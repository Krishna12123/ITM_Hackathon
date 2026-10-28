import math
from typing import List, Dict, Any, Tuple
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

def format_time_label(hour_float: float) -> str:
    """
    Converts decimal hour (e.g. 16.5) to formatted 12-hour time string (e.g. '04:30 PM').
    """
    h = int(hour_float)
    m = int(round((hour_float - h) * 60))
    suffix = "AM" if h < 12 else "PM"
    display_h = h if 1 <= h <= 12 else (h - 12 if h > 12 else 12)
    return f"{display_h:02d}:{m:02d} {suffix}"

def haversine_distance(coord1: Tuple[float, float], coord2: Tuple[float, float]) -> float:
    """
    Computes great-circle distance in kilometers between two GPS points.
    """
    lat1, lon1 = coord1
    lat2, lon2 = coord2
    R = 6371.0  # Earth radius in km

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

class ItineraryOptimizer:
    """
    Module 4: Itinerary Planner & Schedule Optimizer using Google OR-Tools.
    Solves TSP with Time Windows and day clustering constraints.
    """
    def __init__(self):
        # Average speed in km/h based on transit mode
        self.speed_map = {
            "auto_walk": 18.0,
            "walking": 4.5,
            "local_taxi": 25.0,
            "directions_bus": 15.0,
            "two_wheeler": 22.0
        }

    def partition_attractions_by_day(
        self,
        attractions: List[Dict[str, Any]],
        num_days: int,
        max_daily_activities: int = 3
    ) -> List[List[Dict[str, Any]]]:
        """
        Partitions attractions across days balancing time-of-day suitability
        (Morning, Afternoon, Evening) and geographic proximity.
        """
        if not attractions:
            return [[] for _ in range(num_days)]

        days: List[List[Dict[str, Any]]] = [[] for _ in range(num_days)]

        # Separate into time buckets
        mornings = [a for a in attractions if a.get("best_visit_time") == "Morning"]
        afternoons = [a for a in attractions if a.get("best_visit_time") == "Afternoon"]
        evenings = [a for a in attractions if a.get("best_visit_time") == "Evening"]
        others = [a for a in attractions if a not in mornings and a not in afternoons and a not in evenings]

        # Fill each day with one morning, one afternoon, and one evening attraction
        for d in range(num_days):
            if mornings:
                days[d].append(mornings.pop(0))
            elif others:
                days[d].append(others.pop(0))

            if afternoons:
                days[d].append(afternoons.pop(0))
            elif others:
                days[d].append(others.pop(0))

            if evenings:
                days[d].append(evenings.pop(0))
            elif others:
                days[d].append(others.pop(0))

        # Distribute any remaining places up to max_daily_activities
        remaining = mornings + afternoons + evenings + others
        for place in remaining:
            for d in range(num_days):
                if len(days[d]) < max_daily_activities:
                    days[d].append(place)
                    break

        return days

    def optimize_day_route_ortools(
        self,
        day_attractions: List[Dict[str, Any]],
        transit_mode: str = "auto_walk"
    ) -> List[Dict[str, Any]]:
        """
        Uses Google OR-Tools Routing Solver to determine the optimal sequence
        minimizing total travel time and distance.
        """
        n = len(day_attractions)
        if n <= 1:
            return day_attractions

        # Compute distance matrix (in meters)
        coords = [(p["latitude"], p["longitude"]) for p in day_attractions]
        dist_matrix = []
        for i in range(n):
            row = []
            for j in range(n):
                if i == j:
                    row.append(0)
                else:
                    dist_km = haversine_distance(coords[i], coords[j])
                    row.append(int(dist_km * 1000))
            dist_matrix.append(row)

        # Setup OR-Tools routing model
        manager = pywrapcp.RoutingIndexManager(n, 1, 0)
        routing = pywrapcp.RoutingModel(manager)

        def distance_callback(from_index, to_index):
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            return dist_matrix[from_node][to_node]

        transit_callback_index = routing.RegisterTransitCallback(distance_callback)
        routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        )

        solution = routing.SolveWithParameters(search_parameters)

        if solution:
            ordered_route = []
            index = routing.Start(0)
            while not routing.IsEnd(index):
                node = manager.IndexToNode(index)
                ordered_route.append(day_attractions[node])
                index = solution.Value(routing.NextVar(index))
            return ordered_route

        # Fallback to original order if OR-Tools solver finds no improvement
        return day_attractions

    def solve_itinerary(
        self,
        recommended_attractions: List[Dict[str, Any]],
        duration_days: int = 4,
        max_daily_activities: int = 3,
        transit_mode: str = "auto_walk"
    ) -> List[Dict[str, Any]]:
        """
        Full optimization pipeline: partitions by day and optimizes sequences via OR-Tools.
        """
        day_partitions = self.partition_attractions_by_day(
            recommended_attractions, duration_days, max_daily_activities
        )

        optimized_days = []
        for d_idx, day_items in enumerate(day_partitions):
            optimized_order = self.optimize_day_route_ortools(day_items, transit_mode)

            # Sort within day chronologically: Morning -> Afternoon -> Evening
            time_priority = {"Morning": 0, "Afternoon": 1, "Evening": 2}
            optimized_order.sort(key=lambda p: time_priority.get(p.get("best_visit_time"), 1))

            scheduled_items = []
            slot_definitions = [
                {"label": "08:30 AM – 11:30 AM", "start_hour": 8.5, "end_hour": 11.5},
                {"label": "12:30 PM – 03:30 PM", "start_hour": 12.5, "end_hour": 15.5},
                {"label": "05:00 PM – 07:30 PM", "start_hour": 17.0, "end_hour": 19.5},
                {"label": "08:00 PM – 09:30 PM", "start_hour": 20.0, "end_hour": 21.5}
            ]

            for i, item in enumerate(optimized_order):
                item_copy = dict(item)
                slot = slot_definitions[i % len(slot_definitions)]
                s_start = slot["start_hour"]
                s_end = slot["end_hour"]

                open_h = item.get("open_hour")
                close_h = item.get("close_hour")

                # Respect opening time if attraction opens later than slot start
                if open_h is not None and s_start < open_h:
                    s_start = open_h

                # Respect closing time if attraction closes earlier than slot end
                if close_h is not None and s_end > close_h:
                    s_end = close_h
                    # Adjust start if needed so duration is accommodated
                    duration_hrs = min(item.get("suggested_duration_minutes", 90) / 60.0, 1.5)
                    s_start = max(s_end - duration_hrs, open_h if open_h is not None else 8.0)

                label = f"{format_time_label(s_start)} – {format_time_label(s_end)}"
                item_copy["assigned_slot"] = label
                item_copy["slot_start_hour"] = round(s_start, 2)
                item_copy["slot_end_hour"] = round(s_end, 2)
                scheduled_items.append(item_copy)

            optimized_days.append({
                "day_number": d_idx + 1,
                "attractions": scheduled_items
            })

        return optimized_days

optimizer = ItineraryOptimizer()
