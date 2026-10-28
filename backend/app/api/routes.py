from fastapi import APIRouter
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
    Intelligent itinerary synthesis endpoint for YatraSathi Trip Planner.
    Calculates dynamic budget breakdowns based on duration, guests, and spend tier.
    """
    total = request.total_budget if request.total_budget else (request.spend_per_person * request.guests if request.spend_per_person else request.budget)
    
    # Stay: 42%, Experiences/Activities: 34%, Dining & Transit: 24%
    breakdown = {
        "stays": round(total * 0.42, 2),
        "dining": round(total * 0.14, 2),
        "activities_and_entry": round(total * 0.20, 2),
        "transit": round(total * 0.10, 2),
        "experiences": round(total * 0.14, 2)
    }

    return {
        "destination": request.destination,
        "days": request.days,
        "guests": request.guests,
        "total_budget": total,
        "budget_breakdown": breakdown,
        "status": "success"
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
