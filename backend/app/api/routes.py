from fastapi import APIRouter
from app.models.schemas import (
    HealthResponse,
    PredictionRequest,
    PredictionResponse,
    ItineraryRequest,
    ItineraryResponse
)
from app.services.ml_service import ml_service
from app.core.config import settings

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
    Intelligent itinerary synthesis endpoint for TerraVenture Trip Planner.
    """
    total = request.budget
    breakdown = {
        "stays": round(total * 0.42, 2),
        "dining": round(total * 0.22, 2),
        "activities_and_entry": round(total * 0.18, 2),
        "transit": round(total * 0.10, 2),
        "safety_buffer": round(total * 0.08, 2)
    }

    return {
        "destination": request.destination,
        "days": request.days,
        "guests": request.guests,
        "total_budget": total,
        "budget_breakdown": breakdown,
        "status": "success"
    }
