import json
import logging
from typing import Dict, Any, List, Optional
from pathlib import Path

try:
    from .gemini_service import gemini_service
    from .recommender import recommender
    from .optimizer import optimizer
    from .route_budget import route_budget_engine
    from .ai_synthesis import ai_synthesis_engine
except ImportError:
    from gemini_service import gemini_service
    from recommender import recommender
    from optimizer import optimizer
    from route_budget import route_budget_engine
    from ai_synthesis import ai_synthesis_engine

logger = logging.getLogger("itinerary_pipeline")

class ItineraryMLPipeline:
    """
    Master Orchestration Pipeline:
    Executes the complete 8-step ML/AI workflow:
    1. Reads user preferences
    2. Gathers destination intelligence (Gemini)
    3. Recommends top attractions (Sentence Transformers semantic search + ranking)
    4. Optimizes day-wise sequence & route (Google OR-Tools)
    5. Calculates routes and category budget ledgers (Route & Budget Engine)
    6. Synthesizes human travel narratives and tips (Gemini AI Synthesis)
    7. Generates complete production-ready Smart Itinerary
    """
    def __init__(self):
        pass

    def generate_smart_itinerary(self, user_preferences: Dict[str, Any]) -> Dict[str, Any]:
        destination = user_preferences.get("destination", "Udaipur, Rajasthan")
        duration_days = int(user_preferences.get("duration_days", 4))
        travelers = int(user_preferences.get("travelers", 2))
        budget_per_person = float(user_preferences.get("budget_per_person", 18500.0))
        total_budget = budget_per_person * travelers
        interests = user_preferences.get("interests", ["heritage", "culinary", "nature", "art"])
        spiritual_prefs = user_preferences.get("spiritual_preferences", ["hindu_temples", "jain_architecture"])
        pace = user_preferences.get("travel_pace", "balanced")
        transit_mode = user_preferences.get("transit_mode", "auto_walk")
        allocations = user_preferences.get("budget_allocation", {"stay": 42, "experiences": 34, "dining_transit": 24})

        # 1. AI Understanding & Destination Intelligence (Module 1)
        dest_intel = gemini_service.generate_destination_intelligence(destination)
        constraints = gemini_service.parse_planning_constraints(user_preferences)

        # 2. Attraction Recommendation via Sentence Transformers (Module 2 & 3)
        experience_budget_limit = constraints["budget_limits"]["experiences_total"]
        top_attractions = recommender.recommend(
            destination=destination,
            interests=interests,
            spiritual_preferences=spiritual_prefs,
            budget_limit=experience_budget_limit,
            top_k=duration_days * constraints["max_daily_activities"] + 2
        )

        # 3. Schedule & Route Optimization via Google OR-Tools (Module 4)
        optimized_schedule = optimizer.solve_itinerary(
            recommended_attractions=top_attractions,
            duration_days=duration_days,
            max_daily_activities=constraints["max_daily_activities"],
            transit_mode=transit_mode
        )

        # 4. Route Metrics & Category Budget Ledger (Module 7)
        budget_ledger = route_budget_engine.calculate_budget_ledger(
            total_budget=total_budget,
            duration_days=duration_days,
            travelers=travelers,
            allocation_pcts=allocations,
            all_itinerary_days=optimized_schedule,
            transit_mode=transit_mode
        )

        # 5. AI Synthesis & Final Smart Itinerary Packaging (Module 5 & 6)
        day_themes = [
            "Old City Heritage Sanctum & Lake Sunset",
            "Royal Palaces, Hilltop Monsoons & Nature Trails",
            "Artisan Guilds, Miniature Painting & Cultural Immersion",
            "Sacred Temples, Scenic Waterfronts & Farewell Feast"
        ]

        final_days = []
        all_map_waypoints = []

        for d_idx, day_data in enumerate(optimized_schedule):
            day_num = day_data["day_number"]
            theme = day_themes[(day_num - 1) % len(day_themes)]
            places = day_data["attractions"]

            # Route information for this specific day
            day_route = route_budget_engine.compute_daily_route(places, transit_mode)
            all_map_waypoints.extend(day_route["waypoints"])

            # AI Narrative Synthesis
            narrative = ai_synthesis_engine.synthesize_day_narrative(
                day_number=day_num,
                day_theme=theme,
                attractions=places,
                interests=interests
            )

            # Assign places into Morning, Afternoon, and Evening sequences
            morning_item = places[0] if len(places) > 0 else None
            afternoon_item = places[1] if len(places) > 1 else places[0] if places else None
            evening_item = places[2] if len(places) > 2 else places[-1] if places else None

            final_days.append({
                "day_number": day_num,
                "day_title": narrative.get("day_title", theme),
                "narrative_overview": narrative.get("morning_narrative", ""),
                "route_distance_km": day_route["total_distance_km"],
                "transit_time_mins": day_route["moving_time_mins"],
                "transit_mode": transit_mode,
                "insider_travel_tip": narrative.get("insider_travel_tip", ""),
                "cultural_etiquette": narrative.get("cultural_etiquette", ""),
                "morning_sequence": {
                    "time_slot": morning_item.get("assigned_slot", "08:30 AM – 11:30 AM") if morning_item else "",
                    "activity_title": morning_item.get("place_name", "") if morning_item else "",
                    "category": morning_item.get("category", "") if morning_item else "",
                    "description": morning_item.get("description", "") if morning_item else "",
                    "coordinates": {
                        "lat": morning_item.get("latitude") if morning_item else 0.0,
                        "lng": morning_item.get("longitude") if morning_item else 0.0
                    },
                    "entry_fee": morning_item.get("entry_fee", 0) if morning_item else 0,
                    "image_url": morning_item.get("image_url", "") if morning_item else ""
                },
                "afternoon_immersion": {
                    "time_slot": afternoon_item.get("assigned_slot", "12:30 PM – 03:30 PM") if afternoon_item else "",
                    "activity_title": afternoon_item.get("place_name", "") if afternoon_item else "",
                    "category": afternoon_item.get("category", "") if afternoon_item else "",
                    "description": afternoon_item.get("description", "") if afternoon_item else "",
                    "coordinates": {
                        "lat": afternoon_item.get("latitude") if afternoon_item else 0.0,
                        "lng": afternoon_item.get("longitude") if afternoon_item else 0.0
                    },
                    "entry_fee": afternoon_item.get("entry_fee", 0) if afternoon_item else 0,
                    "image_url": afternoon_item.get("image_url", "") if afternoon_item else ""
                },
                "evening_finale": {
                    "time_slot": evening_item.get("assigned_slot", "05:00 PM – 08:00 PM") if evening_item else "",
                    "activity_title": evening_item.get("place_name", "") if evening_item else "",
                    "category": evening_item.get("category", "") if evening_item else "",
                    "description": evening_item.get("description", "") if evening_item else "",
                    "coordinates": {
                        "lat": evening_item.get("latitude") if evening_item else 0.0,
                        "lng": evening_item.get("longitude") if evening_item else 0.0
                    },
                    "entry_fee": evening_item.get("entry_fee", 0) if evening_item else 0,
                    "image_url": evening_item.get("image_url", "") if evening_item else ""
                },
                "places_list": places
            })

        # Assemble full output package
        return {
            "status": "success",
            "destination": destination,
            "destination_intelligence": dest_intel,
            "duration_days": duration_days,
            "travelers": travelers,
            "travel_pace": pace,
            "transit_mode": transit_mode,
            "budget_ledger": budget_ledger,
            "itinerary_days": final_days,
            "map_waypoints": all_map_waypoints,
            "ml_model_metadata": {
                "recommender": "Sentence Transformers (all-MiniLM-L6-v2) + Semantic Cosine Ranking",
                "optimizer": "Google OR-Tools TSP Routing Engine with Time Constraints",
                "ai_synthesis": "Gemini 2.5 Structured Narrative Engine"
            }
        }

pipeline = ItineraryMLPipeline()
