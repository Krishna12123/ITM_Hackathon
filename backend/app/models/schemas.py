from pydantic import BaseModel, Field
from typing import Optional, Any, List, Dict

class HealthResponse(BaseModel):
    status: str
    message: str
    version: str

class PredictionRequest(BaseModel):
    features: List[float] = Field(..., description="List of numerical features for prediction")
    model_name: Optional[str] = Field("default", description="Model identifier")

class PredictionResponse(BaseModel):
    prediction: Any
    confidence: Optional[float] = None
    model_used: str
    status: str = "success"

class ItineraryRequest(BaseModel):
    destination: str = Field(default="Udaipur, Rajasthan")
    days: int = Field(default=4, ge=1, le=14)
    guests: int = Field(default=2, ge=1)
    budget: float = Field(default=18500.0)
    vibe: Optional[str] = Field(default="Heritage & Architecture")
    pacing: Optional[str] = Field(default="Balanced")

class ItineraryResponse(BaseModel):
    destination: str
    days: int
    guests: int
    total_budget: float
    budget_breakdown: Dict[str, float]
    status: str = "success"
