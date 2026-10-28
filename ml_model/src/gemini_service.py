import os
import json
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger("gemini_service")

class GeminiService:
    """
    Module 1 & AI Understanding:
    Handles destination intelligence and structured planning constraint extraction.
    Supports google-genai SDK when API key is present, with deterministic fallback.
    """
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.client = None
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
                logger.info("Gemini Client successfully initialized with API key.")
            except Exception as e:
                logger.warning(f"Failed to initialize google-genai client: {e}")

    def generate_destination_intelligence(self, destination: str) -> Dict[str, Any]:
        """
        Module 1: AI Explore – Destination intelligence.
        Identifies overview, popular attractions, hidden gems, and cultural experiences.
        """
        prompt = f"""
        Act as an expert travel intelligence engine. Generate structured destination intelligence for: '{destination}'.
        Return ONLY valid JSON matching this schema:
        {{
            "destination": "{destination}",
            "destination_overview": "Comprehensive 2-sentence overview",
            "highlights": ["Top highlight 1", "Top highlight 2", "Top highlight 3"],
            "hidden_gems": ["Secret spot 1", "Secret spot 2"],
            "cultural_experiences": ["Experience 1", "Experience 2"],
            "local_food_experiences": ["Dish 1", "Dish 2"],
            "seasonal_recommendations": "Best seasons & timing notes"
        }}
        """

        if self.client:
            try:
                response = self.client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                text = response.text.strip()
                if "```json" in text:
                    text = text.split("```json")[1].split("```")[0].strip()
                elif "```" in text:
                    text = text.split("```")[1].split("```")[0].strip()
                return json.loads(text)
            except Exception as e:
                logger.warning(f"Gemini API generation fallback triggered: {e}")

        # Deterministic Domain-Knowledge Fallback
        dest_low = destination.lower()
        if "goa" in dest_low:
            return {
                "destination": "Goa, India",
                "destination_overview": "Famed for its sun-kissed Arabian coastline, Portuguese-colonial Latin quarters, UNESCO cathedrals, and vibrant spice plantations, Goa offers an eclectic mix of coastal heritage, sacred shrines, and bohemian culture.",
                "highlights": ["Aguada Coastal Fort", "Basilica of Bom Jesus", "Fontainhas Latin Quarter", "Palolem Beach"],
                "hidden_gems": ["Cabo de Rama clifftop ramparts", "Sahakari organic spice trails", "Dudhsagar jungle cascades"],
                "cultural_experiences": ["Fugdi and Dekhni folk performances on Mandovi", "Heritage Portuguese villa architectural walks"],
                "local_food_experiences": ["Goan Fish Curry Thali", "Pebbly Poee with traditional spices", "Bebinca dessert"],
                "seasonal_recommendations": "Ideal from October through March with cool sea breezes and clear coastal twilights."
            }

        if "udaipur" in dest_low:
            return {
                "destination": "Udaipur, Rajasthan",
                "destination_overview": "Known as the City of Lakes and the Venice of the East, Udaipur offers a majestic blend of Rajput royal heritage, ornate palaces, and serene lakes flanked by the Aravali ranges.",
                "highlights": ["City Palace Complex", "Lake Pichola Sunset", "Jagdish Temple Sanctum"],
                "hidden_gems": ["Ambrai Ghat night reflections", "Sajjangarh Monsoon Ridge", "Hathi Pol artisan backstreets"],
                "cultural_experiences": ["Mewar miniature painting workshop", "Dharohar Rajasthani folk performance", "Jagdish morning aarti"],
                "local_food_experiences": ["Dal Baati Churma", "Gulab Jamun ki Sabzi", "Jheel's bakery masala chai"],
                "seasonal_recommendations": "Pleasant and ideal for walking from October to March with mild winter sunshine."
            }
        
        return {
            "destination": destination,
            "destination_overview": f"A historic and culturally vibrant destination rich in regional traditions, architectural landmarks, and local culinary trails.",
            "highlights": ["Historic Forts & Palaces", "Local Heritage Markets", "Sunset Scenic Views"],
            "hidden_gems": ["Artisan lanes", "Scenic viewpoints away from crowds"],
            "cultural_experiences": ["Traditional crafts workshops", "Evening cultural performances"],
            "local_food_experiences": ["Regional culinary specialties", "Heritage dining terraces"],
            "seasonal_recommendations": "Best visited during pleasant weather windows from October through March."
        }

    def parse_planning_constraints(self, user_preferences: Dict[str, Any]) -> Dict[str, Any]:
        """
        AI Understanding: Extracts structured planning constraints from user input.
        """
        pace = user_preferences.get("travel_pace", "balanced").lower()
        pace_map = {
            "relaxed": {"max_activities_per_day": 2, "max_active_hours": 5.0},
            "balanced": {"max_activities_per_day": 3, "max_active_hours": 7.5},
            "packed": {"max_activities_per_day": 4, "max_active_hours": 10.0}
        }
        pace_config = pace_map.get(pace, pace_map["balanced"])

        days = int(user_preferences.get("duration_days", 4))
        travelers = int(user_preferences.get("travelers", 2))
        budget_per_person = float(user_preferences.get("budget_per_person", 18500.0))
        total_budget = budget_per_person * travelers

        allocations = user_preferences.get("budget_allocation", {"stay": 42, "experiences": 34, "dining_transit": 24})

        return {
            "destination": user_preferences.get("destination", "Udaipur, Rajasthan"),
            "duration_days": days,
            "travelers": travelers,
            "total_budget": total_budget,
            "max_daily_activities": pace_config["max_activities_per_day"],
            "max_daily_active_hours": pace_config["max_active_hours"],
            "budget_limits": {
                "stay_total": round(total_budget * (allocations.get("stay", 42) / 100.0), 2),
                "experiences_total": round(total_budget * (allocations.get("experiences", 34) / 100.0), 2),
                "dining_transit_total": round(total_budget * (allocations.get("dining_transit", 24) / 100.0), 2)
            },
            "interests": user_preferences.get("interests", []),
            "spiritual_preferences": user_preferences.get("spiritual_preferences", []),
            "transit_mode": user_preferences.get("transit_mode", "auto_walk")
        }

gemini_service = GeminiService()
