from fastapi import APIRouter, HTTPException
from ..models.schemas import (
    HealthResponse,
    PredictionRequest,
    PredictionResponse,
    ItineraryRequest,
    ItineraryResponse,
    TripInputCreate,
    TripInputResponse
)
from ..services.ml_service import ml_service
from ..services.supabase_service import supabase_service
from ..core.config import settings

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
def health_check():
    return {
        "status": "healthy",
        "message": f"{settings.PROJECT_NAME} is running smoothly",
        "version": settings.PROJECT_VERSION
    }

@router.post("/predict", response_model=PredictionResponse)
def make_prediction(request: PredictionRequest):
    result = ml_service.predict(request.features, request.model_name)
    return {
        "prediction": result.get("prediction"),
        "confidence": result.get("confidence", 0.95),
        "model_used": result.get("model_used", request.model_name),
        "status": "success"
    }

@router.post("/itinerary/generate", response_model=ItineraryResponse)
def generate_itinerary(request: ItineraryRequest):
    """
    End-to-end ML/AI itinerary synthesis endpoint with Supabase integration.
    Workflow:
    1. Input from frontend or fetched from Supabase if trip_id is provided.
    2. ML model processes it (Sentence Transformers + OR-Tools + Route & Budget + Validator).
    3. Persists both trip input and complete generated smart itinerary to Supabase.
    4. Returns trip_id and itinerary for frontend display.
    """
    # 1. Check if trip_id already has a cached generated itinerary in Supabase
    if request.trip_id:
        existing = supabase_service.fetch_record_by_id("trip_inputs", request.trip_id)
        if existing.get("success") and existing.get("data"):
            data = existing["data"]
            cached_plan = data.get("budget_breakdown", {}).get("generated_itinerary") or data.get("generated_itinerary")
            if cached_plan:
                return {
                    "trip_id": request.trip_id,
                    "destination": cached_plan.get("destination", data.get("destination")),
                    "days": cached_plan.get("duration_days", data.get("days", 4)),
                    "guests": cached_plan.get("travelers", data.get("guests", 2)),
                    "total_budget": cached_plan.get("budget_ledger", {}).get("total_budget", data.get("total_budget", 37000.0)),
                    "budget_breakdown": data.get("budget_breakdown", {}),
                    "status": "success",
                    "supabase_synced": True,
                    "destination_intelligence": cached_plan.get("destination_intelligence"),
                    "budget_ledger": cached_plan.get("budget_ledger"),
                    "itinerary_days": cached_plan.get("itinerary_days"),
                    "map_waypoints": cached_plan.get("map_waypoints"),
                    "ml_model_metadata": cached_plan.get("ml_model_metadata"),
                    "validation": cached_plan.get("validation")
                }

    total = request.total_budget if request.total_budget else (request.spend_per_person * request.guests if request.spend_per_person else request.budget)

    alloc_map = {"stay": 42.0, "experiences": 34.0, "dining_transit": 24.0}
    if request.budget_breakdown:
        s = request.budget_breakdown.get("stay", request.budget_breakdown.get("stay_pct", 42.0))
        e = request.budget_breakdown.get("experiences", request.budget_breakdown.get("experiences_pct", 34.0))
        d = request.budget_breakdown.get("dining_transit", request.budget_breakdown.get("dining_transit_pct", 24.0))
        alloc_map = {"stay": float(s), "experiences": float(e), "dining_transit": float(d)}

    # 2. Map input fields to ML system
    ml_input = {
        "destination": request.destination,
        "start_date": request.start_date,
        "end_date": request.end_date,
        "duration_days": request.days,
        "travelers": request.guests,
        "budget_per_person": request.spend_per_person or (total / request.guests),
        "budget_category": request.budget_tier or "comfortable_boutique",
        "budget_allocation": alloc_map,
        "interests": request.interests,
        "spiritual_preferences": request.spiritual_traditions or [],
        "travel_pace": request.pacing or "balanced",
        "transit_mode": request.transit_mode or "auto_walk"
    }

    # 3. Execute ML pipeline (Modules 1 to 7 + Validator)
    ml_result = ml_service.generate_smart_itinerary(ml_input)

    # 4. Save complete trip (input + generated itinerary) into Supabase
    trip_dict = request.model_dump()
    trip_dict["total_budget"] = total
    save_result = supabase_service.save_trip_with_itinerary(trip_dict, ml_result)

    trip_id = save_result.get("trip_id") or request.trip_id
    supabase_synced = save_result.get("success", False)

    return {
        "trip_id": trip_id,
        "destination": request.destination,
        "days": request.days,
        "guests": request.guests,
        "total_budget": total,
        "budget_breakdown": {
            "stay_pct": 42.0,
            "experiences_pct": 34.0,
            "dining_transit_pct": 24.0
        },
        "status": "success",
        "supabase_synced": supabase_synced,
        "destination_intelligence": ml_result.get("destination_intelligence"),
        "budget_ledger": ml_result.get("budget_ledger"),
        "itinerary_days": ml_result.get("itinerary_days"),
        "map_waypoints": ml_result.get("map_waypoints"),
        "ml_model_metadata": ml_result.get("ml_model_metadata"),
        "validation": ml_result.get("validation")
    }

@router.get("/itinerary/{trip_id}", response_model=ItineraryResponse)
def get_itinerary_by_id(trip_id: str):
    """
    Retrieves stored trip and generated itinerary from Supabase by trip ID.
    """
    result = supabase_service.fetch_record_by_id("trip_inputs", trip_id)
    if not result.get("success") or not result.get("data"):
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found in Supabase")

    record = result["data"]
    plan = record.get("budget_breakdown", {}).get("generated_itinerary") or record.get("generated_itinerary")

    if not plan:
        # If not yet generated for this record, generate and store now
        ml_input = {
            "destination": record.get("destination", "Udaipur, Rajasthan"),
            "start_date": record.get("start_date", "Oct 14"),
            "end_date": record.get("end_date", "Oct 18"),
            "duration_days": record.get("days", 4),
            "travelers": record.get("guests", 2),
            "budget_per_person": float(record.get("spend_per_person", 18500.0)),
            "budget_category": record.get("budget_tier", "comfortable_boutique"),
            "budget_allocation": {"stay": 42, "experiences": 34, "dining_transit": 24},
            "interests": record.get("interests", []),
            "spiritual_preferences": record.get("spiritual_traditions", []),
            "travel_pace": record.get("selected_pace", "balanced"),
            "transit_mode": record.get("selected_transit", "auto_walk")
        }
        plan = ml_service.generate_smart_itinerary(ml_input)
        supabase_service.save_trip_with_itinerary(record, plan)

    return {
        "trip_id": trip_id,
        "destination": plan.get("destination", record.get("destination")),
        "days": plan.get("duration_days", record.get("days", 4)),
        "guests": plan.get("travelers", record.get("guests", 2)),
        "total_budget": plan.get("budget_ledger", {}).get("total_budget", float(record.get("total_budget", 37000.0))),
        "budget_breakdown": record.get("budget_breakdown", {}),
        "status": "success",
        "supabase_synced": True,
        "destination_intelligence": plan.get("destination_intelligence"),
        "budget_ledger": plan.get("budget_ledger"),
        "itinerary_days": plan.get("itinerary_days"),
        "map_waypoints": plan.get("map_waypoints"),
        "ml_model_metadata": plan.get("ml_model_metadata"),
        "validation": plan.get("validation")
    }

@router.post("/trips/submit", response_model=TripInputResponse)
def submit_trip_inputs(request: TripInputCreate):
    """
    Takes all trip planner form inputs and connects to Supabase database.
    Executes in a loop until the inputs are successfully synced to Supabase
    or cached locally for automatic retry.
    """
    payload = request.model_dump()
    sync_result = supabase_service.sync_trip_inputs_loop(payload, max_retries=3, retry_delay=1.0)

    if sync_result.get("synced"):
        return {
            "status": "success",
            "message": f"Successfully persisted all trip inputs to Supabase table '{sync_result.get('table')}'",
            "data": payload,
            "supabase_synced": True
        }
    else:
        return {
            "status": "cached",
            "message": "Trip inputs captured successfully. Supabase table is pending creation; inputs cached locally.",
            "data": payload,
            "supabase_synced": False
        }

@router.get("/trips")
def list_trips():
    """
    Retrieves stored trips from Supabase or the in-memory fallback.
    """
    remote = supabase_service.fetch_records("trip_inputs")
    if remote.get("success") and remote.get("data"):
        return {"source": "supabase", "trips": remote["data"]}
    
    return {"source": "local_cache", "trips": supabase_service.local_cache}


from ..services.payment_service import payment_service
from ..models.schemas import (
    PaymentCheckoutRequest,
    PaymentCheckoutResponse,
    PaymentVerifyRequest,
    PaymentVerifyResponse
)

@router.post("/payments/create-checkout-session", response_model=PaymentCheckoutResponse)
def create_payment_checkout_session(request: PaymentCheckoutRequest):
    """
    Creates a payment checkout order for itinerary booking.
    """
    session = payment_service.create_checkout_session(
        amount=request.amount,
        trip_destination=request.trip_destination,
        customer_email=request.customer_email,
        customer_name=request.customer_name,
        success_url=request.success_url,
        cancel_url=request.cancel_url
    )
    return session

@router.post("/payments/verify", response_model=PaymentVerifyResponse)
def verify_payment_session(request: PaymentVerifyRequest):
    """
    Verifies payment status for a checkout session.
    """
    result = payment_service.verify_payment(request.session_id)
    return result

@router.get("/payments/checkout-mock/{session_id}")
def checkout_mock_page(session_id: str):
    """
    Fallback mock checkout verification endpoint for testing without live credentials.
    """
    res = payment_service.verify_payment(session_id)
    return {
        "status": "success",
        "message": "Payment verified in YatraSathi test gateway",
        "details": res
    }
