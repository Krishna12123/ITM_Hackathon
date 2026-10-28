import os
import sys
import copy
import unittest

sys.path.insert(0, os.path.dirname(__file__))

from validator import validate_itinerary
from pipeline import ItineraryMLPipeline

class TestItineraryValidator(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Run real pipeline once to obtain baseline valid output
        cls.input_data = {
            "destination": "Udaipur, Rajasthan",
            "start_date": "2026-10-14",
            "end_date": "2026-10-18",
            "duration_days": 4,
            "travelers": 2,
            "budget_per_person": 18500,
            "budget_category": "comfortable_boutique",
            "budget_allocation": {
                "stay": 42,
                "experiences": 34,
                "dining_transit": 24
            },
            "interests": [
                "heritage",
                "culinary",
                "nature",
                "art",
                "folk_performances"
            ],
            "spiritual_preferences": [
                "hindu_temples",
                "jain_architecture"
            ],
            "travel_pace": "balanced",
            "transit_mode": "auto_walk"
        }
        pipeline = ItineraryMLPipeline()
        cls.baseline_output = pipeline.generate_smart_itinerary(cls.input_data)

    def test_01_baseline_valid_itinerary(self):
        """Test that the standard Udaipur itinerary validates successfully."""
        result = validate_itinerary(self.input_data, self.baseline_output)
        self.assertTrue(result["valid"])
        self.assertEqual(len(result["errors"]), 0)
        self.assertGreater(len(result["checks_passed"]), 5)
        self.assertEqual(len(result["checks_failed"]), 0)

    def test_02_day_count_mismatch(self):
        """Test detection of mismatch between input duration_days and itinerary days count."""
        tampered_output = copy.deepcopy(self.baseline_output)
        tampered_output["itinerary_days"] = tampered_output["itinerary_days"][:3]  # Only 3 days
        result = validate_itinerary(self.input_data, tampered_output)
        self.assertFalse(result["valid"])
        self.assertTrue(any("Incorrect number of itinerary days" in e for e in result["errors"]))
        self.assertIn("Day count verification", result["checks_failed"])

    def test_03_non_consecutive_days(self):
        """Test detection of non-consecutive day numbers."""
        tampered_output = copy.deepcopy(self.baseline_output)
        tampered_output["itinerary_days"][3]["day_number"] = 5
        result = validate_itinerary(self.input_data, tampered_output)
        self.assertFalse(result["valid"])
        self.assertTrue(any("Non-consecutive day numbers" in e for e in result["errors"]))

    def test_04_date_range_chronology(self):
        """Test detection when end_date is earlier than start_date."""
        tampered_input = copy.deepcopy(self.input_data)
        tampered_input["end_date"] = "2026-10-10"  # earlier than 2026-10-14
        result = validate_itinerary(tampered_input, self.baseline_output)
        self.assertFalse(result["valid"])
        self.assertTrue(any("end_date" in e and "earlier than start_date" in e for e in result["errors"]))

    def test_05_missing_optional_dates_warning(self):
        """Test that missing optional dates triggers a warning but not a hard validation failure."""
        tampered_input = copy.deepcopy(self.input_data)
        tampered_input.pop("start_date")
        tampered_input.pop("end_date")
        result = validate_itinerary(tampered_input, self.baseline_output)
        self.assertTrue(result["valid"])
        self.assertTrue(any("skipped calendar date range validation" in w for w in result["warnings"]))

    def test_06_total_budget_mismatch(self):
        """Test mathematical mismatch in total budget."""
        tampered_output = copy.deepcopy(self.baseline_output)
        tampered_output["budget_ledger"]["total_budget"] = 99999
        result = validate_itinerary(self.input_data, tampered_output)
        self.assertFalse(result["valid"])
        self.assertTrue(any("Total budget mismatch" in e for e in result["errors"]))

    def test_07_allocation_percentage_sum_not_100(self):
        """Test failure when budget allocation does not equal 100%."""
        tampered_input = copy.deepcopy(self.input_data)
        tampered_input["budget_allocation"] = {"stay": 50, "experiences": 30, "dining_transit": 10}  # sums to 90
        result = validate_itinerary(tampered_input, self.baseline_output)
        self.assertFalse(result["valid"])
        self.assertTrue(any("must equal 100%" in e for e in result["errors"]))

    def test_08_empty_day_activities(self):
        """Test error when a day has no scheduled activities."""
        tampered_output = copy.deepcopy(self.baseline_output)
        tampered_output["itinerary_days"][1]["morning_sequence"] = None
        tampered_output["itinerary_days"][1]["afternoon_immersion"] = None
        tampered_output["itinerary_days"][1]["evening_finale"] = None
        tampered_output["itinerary_days"][1]["places_list"] = []
        result = validate_itinerary(self.input_data, tampered_output)
        self.assertFalse(result["valid"])
        self.assertTrue(any("without any scheduled activities" in e for e in result["errors"]))

    def test_09_duplicate_attraction_detection(self):
        """Test error when an attraction is scheduled more than once across the trip."""
        tampered_output = copy.deepcopy(self.baseline_output)
        # Duplicate Day 1 morning into Day 3 morning
        tampered_output["itinerary_days"][2]["morning_sequence"] = copy.deepcopy(
            tampered_output["itinerary_days"][0]["morning_sequence"]
        )
        result = validate_itinerary(self.input_data, tampered_output)
        self.assertFalse(result["valid"])
        self.assertTrue(any("Duplicate attraction" in e for e in result["errors"]))

    def test_10_invalid_coordinates(self):
        """Test detection of null or invalid GPS coordinates."""
        tampered_output = copy.deepcopy(self.baseline_output)
        tampered_output["itinerary_days"][0]["morning_sequence"]["coordinates"] = {"lat": 195.0, "lng": 73.0}
        result = validate_itinerary(self.input_data, tampered_output)
        self.assertFalse(result["valid"])
        self.assertTrue(any("Out-of-range coordinates" in e for e in result["errors"]))

    def test_11_opening_hour_conflict(self):
        """Test hard error when an activity is scheduled after closing hour."""
        tampered_output = copy.deepcopy(self.baseline_output)
        # Schedule attraction until 22:00 when it closes at 18:00
        tampered_output["itinerary_days"][0]["evening_finale"]["close_hour"] = 18.0
        tampered_output["itinerary_days"][0]["evening_finale"]["slot_end_hour"] = 22.0
        result = validate_itinerary(self.input_data, tampered_output)
        self.assertFalse(result["valid"])
        self.assertTrue(any("Closing conflict" in e for e in result["errors"]))

    def test_12_route_transit_anomaly(self):
        """Test detection of unrealistic routing speeds."""
        tampered_output = copy.deepcopy(self.baseline_output)
        tampered_output["itinerary_days"][0]["route_distance_km"] = 400.0
        tampered_output["itinerary_days"][0]["transit_time_mins"] = 30  # 800 km/h
        result = validate_itinerary(self.input_data, tampered_output)
        self.assertFalse(result["valid"])
        self.assertTrue(any("unrealistic transit speed" in e for e in result["errors"]))

if __name__ == "__main__":
    unittest.main()
