import math
from typing import List, Dict, Any, Tuple
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

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
        Geographically clusters attractions into day groups using greedy spatial proximity.
        """
        if not attractions:
            return [[] for _ in range(num_days)]

        days: List[List[Dict[str, Any]]] = [[] for _ in range(num_days)]
        unassigned = list(attractions)

        for d in range(num_days):
            if not unassigned:
                break
            
            # Start day with highest ranked unassigned attraction as anchor
            anchor = unassigned.pop(0)
            days[d].append(anchor)

            # Find closest matching attractions to anchor for spatial clustering
            while len(days[d]) < max_daily_activities and unassigned:
                anchor_coord = (anchor["latitude"], anchor["longitude"])
                # Sort remaining by distance to the day's anchor
                unassigned.sort(
                    key=lambda p: haversine_distance(anchor_coord, (p["latitude"], p["longitude"]))
                )
                nearest = unassigned.pop(0)
                days[d].append(nearest)

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

            # Assign schedule time slots (Morning, Afternoon, Evening)
            scheduled_items = []
            time_slots = ["08:30 AM – 11:30 AM", "12:30 PM – 03:30 PM", "05:00 PM – 08:00 PM", "08:30 PM – 10:00 PM"]
            
            for i, item in enumerate(optimized_order):
                item_copy = dict(item)
                item_copy["assigned_slot"] = time_slots[i % len(time_slots)]
                scheduled_items.append(item_copy)

            optimized_days.append({
                "day_number": d_idx + 1,
                "attractions": scheduled_items
            })

        return optimized_days

optimizer = ItineraryOptimizer()
