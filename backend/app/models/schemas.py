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
    trip_id: Optional[str] = Field(default=None, description="Supabase UUID for trip inputs")
    destination: str = Field(default="Udaipur, Rajasthan")
    start_date: Optional[str] = Field(default="Oct 14")
    end_date: Optional[str] = Field(default="Oct 18")
    days: int = Field(default=4, ge=1, le=30)
    nights: Optional[int] = Field(default=3, ge=0)
    guests: int = Field(default=2, ge=1)
    spend_per_person: Optional[float] = Field(default=18500.0)
    budget: float = Field(default=18500.0)
    total_budget: Optional[float] = Field(default=37000.0)
    budget_tier: Optional[str] = Field(default="Comfortable Boutique")
    budget_breakdown: Optional[Dict[str, Any]] = None
    interests: List[str] = Field(default_factory=lambda: ["Heritage & Forts", "Nature & Lakes"])
    spiritual_traditions: Optional[List[str]] = Field(default_factory=list)
    pacing: Optional[str] = Field(default="Balanced")
    transit_mode: Optional[str] = Field(default="local_taxi")
    vibe: Optional[str] = Field(default="Heritage & Architecture")

class TripInputCreate(BaseModel):
    destination: str = Field(default="Udaipur, Rajasthan")
    start_date: Optional[str] = "Oct 14"
    end_date: Optional[str] = "Oct 18"
    days: int = Field(default=4, ge=1)
    nights: Optional[int] = 3
    guests: int = Field(default=2, ge=1)
    spend_per_person: float = 18500.0
    total_budget: float = 37000.0
    budget_tier: str = "Comfortable Boutique"
    budget_breakdown: Optional[Dict[str, float]] = Field(
        default_factory=lambda: {
            "stay_pct": 42.0,
            "experiences_pct": 34.0,
            "dining_transit_pct": 24.0
        }
    )
    interests: List[str] = Field(
        default_factory=lambda: [
            "Heritage & Forts",
            "Culinary Trails",
            "Nature & Lakes"
        ]
    )
    spiritual_traditions: Optional[List[str]] = Field(
        default_factory=lambda: [
            "Hindu & Vedic Temples"
        ]
    )
    pacing: str = Field(default="Balanced")
    transit_mode: str = Field(default="local_taxi")
    raw_text: Optional[str] = None

class TripInputResponse(BaseModel):
    id: Optional[str] = None
    status: str
    message: str
    data: Optional[Dict[str, Any]] = None
    supabase_synced: bool = False

class ItineraryResponse(BaseModel):
    trip_id: Optional[str] = None
    destination: str
    days: int
    guests: int
    total_budget: float
    budget_breakdown: Optional[Dict[str, Any]] = None
    status: str = "success"
    supabase_synced: bool = False
    destination_intelligence: Optional[Dict[str, Any]] = None
    budget_ledger: Optional[Dict[str, Any]] = None
    itinerary_days: Optional[List[Dict[str, Any]]] = None
    map_waypoints: Optional[List[Dict[str, Any]]] = None
    ml_model_metadata: Optional[Dict[str, Any]] = None
    validation: Optional[Dict[str, Any]] = None
