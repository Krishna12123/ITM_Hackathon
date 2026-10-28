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
    from .validator import validate_itinerary
except ImportError:
    from gemini_service import gemini_service
    from recommender import recommender
    from optimizer import optimizer
    from route_budget import route_budget_engine
    from ai_synthesis import ai_synthesis_engine
    from validator import validate_itinerary

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
            transit_mode=transit_mode,
            start_date=user_preferences.get("start_date"),
            end_date=user_preferences.get("end_date")
        )

        # 5. AI Synthesis & Final Smart Itinerary Packaging (Module 5 & 6)
        dest_lower = destination.lower()
        if "goa" in dest_lower:
            day_themes = [
                "Coastal Fortresses, Old Goa Cathedrals & Latin Quarter",
                "Spice Plantations, Jungle Cascades & Heritage Sanctums",
                "Artisan Beach Markets, Sunsets & Bohemian Vibes",
                "Cliff Bastions, Dolphin Coves & Mandovi Twilight Cruise"
            ]
        elif "jaipur" in dest_lower:
            day_themes = [
                "Pink City Palaces & UNESCO Heritage Forts",
                "Astronomy Observatories & Stepwells",
                "Artisan Bazaars & Traditional Puppetry",
                "Hilltop Nahargarh Sunset & Farewell Feast"
            ]
        elif "varanasi" in dest_lower:
            day_themes = [
                "Sacred Ghats, Morning Aarti & Kashi Sanctum",
                "Sarnath Buddhist Stupas & Silk Weavers",
                "Spiritual Alleyways & Evening Ganga Aarti",
                "Historic Forts & Waterfront Farewell"
            ]
        else:
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

            def format_sequence_item(item):
                if not item:
                    return None
                return {
                    "id": item.get("id"),
                    "time_slot": item.get("assigned_slot", ""),
                    "activity_title": item.get("place_name", ""),
                    "category": item.get("category", ""),
                    "description": item.get("description", ""),
                    "coordinates": {
                        "lat": item.get("latitude"),
                        "lng": item.get("longitude")
                    },
                    "entry_fee": item.get("entry_fee", 0),
                    "open_hour": item.get("open_hour"),
                    "close_hour": item.get("close_hour"),
                    "slot_start_hour": item.get("slot_start_hour"),
                    "slot_end_hour": item.get("slot_end_hour"),
                    "suggested_duration_minutes": item.get("suggested_duration_minutes"),
                    "tags": item.get("tags", []),
                    "spiritual_tags": item.get("spiritual_tags", item.get("spiritual_preferences", [])),
                    "image_url": item.get("image_url", "")
                }

            # Assign places into Morning, Afternoon, and Evening sequences
            morning_item = places[0] if len(places) > 0 else None
            afternoon_item = places[1] if len(places) > 1 else None
            evening_item = places[2] if len(places) > 2 else None

            final_days.append({
                "day_number": day_num,
                "day_title": narrative.get("day_title", theme),
                "narrative_overview": narrative.get("morning_narrative", ""),
                "route_distance_km": day_route["total_distance_km"],
                "transit_time_mins": day_route["moving_time_mins"],
                "transit_mode": transit_mode,
                "insider_travel_tip": narrative.get("insider_travel_tip", ""),
                "cultural_etiquette": narrative.get("cultural_etiquette", ""),
                "morning_sequence": format_sequence_item(morning_item),
                "afternoon_immersion": format_sequence_item(afternoon_item),
                "evening_finale": format_sequence_item(evening_item),
                "places_list": places
            })

        # Assemble full output package
        output_payload = {
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

        # Validate against strict mathematical & duration constraints
        validation = validate_itinerary(user_preferences, output_payload)
        output_payload["validation"] = validation

        return output_payload

pipeline = ItineraryMLPipeline()
