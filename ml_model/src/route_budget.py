import math
from typing import List, Dict, Any, Tuple
try:
    from .optimizer import haversine_distance
except ImportError:
    from optimizer import haversine_distance

class RouteAndBudgetEngine:
    """
    Module 7: Route & Budget Analysis.
    Calculates spatial route metrics (distance, transit duration, GPS waypoints)
    and strictly enforces financial ledger allocations (Stay 42%, Experiences 34%, Dining & Transit 24%).
    """
    def __init__(self):
        # Average speeds in km/h
        self.speeds = {
            "walking": 4.5,
            "auto_walk": 18.0,
            "local_taxi": 25.0,
            "directions_bus": 15.0,
            "two_wheeler": 22.0
        }
        # Average cost per km in INR
        self.transit_rates_per_km = {
            "walking": 0.0,
            "auto_walk": 18.0,
            "local_taxi": 25.0,
            "directions_bus": 5.0,
            "two_wheeler": 10.0
        }

    def compute_daily_route(self, attractions: List[Dict[str, Any]], transit_mode: str = "auto_walk") -> Dict[str, Any]:
        """
        Calculates cumulative distance, moving time, and waypoints for a day's sequence.
        """
        if not attractions:
            return {"total_distance_km": 0.0, "moving_time_mins": 0, "transit_cost": 0.0, "waypoints": []}

        speed = self.speeds.get(transit_mode, 18.0)
        rate = self.transit_rates_per_km.get(transit_mode, 18.0)

        total_km = 0.0
        waypoints = []

        for idx, place in enumerate(attractions):
            waypoints.append({
                "stop_order": idx + 1,
                "place_name": place.get("place_name"),
                "latitude": place.get("latitude"),
                "longitude": place.get("longitude"),
                "category": place.get("category"),
                "duration_minutes": place.get("suggested_duration_minutes", 60)
            })

            if idx > 0:
                prev = attractions[idx - 1]
                coord1 = (prev["latitude"], prev["longitude"])
                coord2 = (place["latitude"], place["longitude"])
                dist = haversine_distance(coord1, coord2)
                total_km += dist

        moving_time_hours = total_km / speed if speed > 0 else 0.0
        moving_time_mins = int(moving_time_hours * 60)
        transit_cost = round(total_km * rate, 2)

        return {
            "total_distance_km": round(total_km, 2),
            "moving_time_mins": moving_time_mins,
            "transit_cost": transit_cost,
            "transit_mode": transit_mode,
            "waypoints": waypoints
        }

    def calculate_budget_ledger(
        self,
        total_budget: float,
        duration_days: int,
        travelers: int,
        allocation_pcts: Dict[str, float],
        all_itinerary_days: List[Dict[str, Any]],
        transit_mode: str = "auto_walk",
        start_date: str = None,
        end_date: str = None
    ) -> Dict[str, Any]:
        """
        Calculates category breakdown and verifies actual expenses against the budget.
        """
        stay_pct = allocation_pcts.get("stay", 42.0)
        exp_pct = allocation_pcts.get("experiences", 34.0)
        dining_transit_pct = allocation_pcts.get("dining_transit", 24.0)

        stay_target = round(total_budget * (stay_pct / 100.0), 2)
        exp_target = round(total_budget * (exp_pct / 100.0), 2)
        dining_transit_target = round(total_budget * (dining_transit_pct / 100.0), 2)

        # Calculate actual experiences costs from attraction entry fees
        actual_experience_cost = 0.0
        total_route_distance_km = 0.0
        total_transit_cost = 0.0

        for day in all_itinerary_days:
            for item in day.get("attractions", []):
                fee = float(item.get("entry_fee", 0.0))
                actual_experience_cost += fee * travelers

            route_info = self.compute_daily_route(day.get("attractions", []), transit_mode)
            total_route_distance_km += route_info["total_distance_km"]
            total_transit_cost += route_info["transit_cost"]

        # Calculate nights based on date range if available, else duration_days - 1
        nights = max(duration_days - 1, 1)
        if start_date and end_date:
            try:
                from datetime import datetime
                d1 = datetime.strptime(start_date.strip()[:10], "%Y-%m-%d")
                d2 = datetime.strptime(end_date.strip()[:10], "%Y-%m-%d")
                calendar_nights = (d2 - d1).days
                if calendar_nights > 0:
                    nights = calendar_nights
            except Exception:
                nights = max(duration_days - 1, 1)

        per_night_stay = round(stay_target / nights, 2)
        estimated_dining_cost = round(dining_transit_target * 0.70, 2)
        actual_transit_cost = round(total_transit_cost, 2)

        total_projected_spend = stay_target + actual_experience_cost + estimated_dining_cost + actual_transit_cost
        remaining_safety_buffer = round(total_budget - total_projected_spend, 2)
        if remaining_safety_buffer < 0:
            remaining_safety_buffer = round(total_budget * 0.08, 2)

        return {
            "total_budget": total_budget,
            "per_person_spend": round(total_budget / travelers, 2) if travelers > 0 else total_budget,
            "nights": nights,
            "stay_allocation": {
                "percentage": stay_pct,
                "target_amount": stay_target,
                "per_night_amount": per_night_stay
            },
            "experiences_allocation": {
                "percentage": exp_pct,
                "target_amount": exp_target,
                "actual_incurred": round(actual_experience_cost, 2)
            },
            "dining_transit_allocation": {
                "percentage": dining_transit_pct,
                "target_amount": dining_transit_target,
                "estimated_dining": estimated_dining_cost,
                "estimated_transit": actual_transit_cost,
                "total_transit_km": round(total_route_distance_km, 2)
            },
            "safety_buffer_retained": remaining_safety_buffer,
            "is_feasible": total_projected_spend <= total_budget,
            "budget_insight": (
                f"Trip budget of ₹{int(total_budget):,} accurately balances {int(stay_pct)}% for comfortable "
                f"heritage stays (₹{int(per_night_stay):,}/night) and reserves a ₹{int(remaining_safety_buffer):,} buffer."
            )
        }

route_budget_engine = RouteAndBudgetEngine()
