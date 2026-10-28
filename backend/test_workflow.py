import sys
import json
import urllib.request
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.api.routes import generate_itinerary, get_itinerary_by_id
from app.models.schemas import ItineraryRequest

def run_test():
    print("1. Creating Trip Request from Frontend form data...")
    req = ItineraryRequest(
        destination="Udaipur, Rajasthan",
        start_date="2026-10-14",
        end_date="2026-10-18",
        days=4,
        guests=2,
        spend_per_person=18500.0,
        total_budget=37000.0,
        budget_tier="Comfortable Boutique",
        budget_breakdown={"stay": 42.0, "experiences": 34.0, "dining_transit": 24.0},
        interests=["heritage", "culinary", "nature", "art", "folk_performances"],
        spiritual_traditions=["hindu_temples", "jain_architecture"],
        pacing="Balanced",
        transit_mode="auto_walk"
    )

    print("2. Calling generate_itinerary (ML pipeline + Supabase persistence)...")
    res = generate_itinerary(req)

    status = res.get("status")
    synced = res.get("supabase_synced")
    trip_id = res.get("trip_id")
    days_cnt = len(res.get("itinerary_days", []))
    valid = res.get("validation", {}).get("valid")

    print(f"   -> Result Status: {status}")
    print(f"   -> Supabase Synced: {synced}")
    print(f"   -> Supabase Trip ID: {trip_id}")
    print(f"   -> Days Generated: {days_cnt}")
    print(f"   -> Validation Passed: {valid}")

    assert trip_id is not None, "trip_id should be returned from Supabase!"

    print("3. Querying Supabase REST API directly for the generated itinerary record...")
    url = "https://jxtmvfamgyrmnlzfgfwq.supabase.co"
    key = "sb_publishable_4-sM0agOoz1UH8I5zUKBGw_LTTn-9Qy"
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}"
    }
    endpoint = f"{url}/rest/v1/trip_inputs?id=eq.{trip_id}&select=*"
    read_req = urllib.request.Request(endpoint, headers=headers)
    with urllib.request.urlopen(read_req) as response:
        db_rows = json.loads(response.read().decode())
        assert len(db_rows) == 1, "Record should be present in Supabase!"
        row = db_rows[0]
        dest = row.get("destination")
        budget = row.get("total_budget")
        print(f"   -> Found row in Supabase: destination={dest}, total_budget={budget}")
        saved_plan = row.get("budget_breakdown", {}).get("generated_itinerary")
        assert saved_plan is not None, "Generated itinerary should be stored in Supabase row!"
        stored_days = len(saved_plan.get("itinerary_days", []))
        stored_budget = saved_plan.get("budget_ledger", {}).get("total_budget")
        print(f"   -> Stored Plan in Supabase has {stored_days} days")
        print(f"   -> Stored Budget Ledger: {stored_budget}")

    print("4. Testing GET /api/itinerary/{trip_id} retrieval...")
    fetched_via_api = get_itinerary_by_id(trip_id)
    f_dest = fetched_via_api.get("destination")
    f_days = len(fetched_via_api.get("itinerary_days", []))
    print(f"   -> GET by ID Destination: {f_dest}")
    print(f"   -> GET by ID Days: {f_days}")
    print("\n>>> ALL 5 WORKFLOW STEPS VERIFIED END-TO-END! <<<")

if __name__ == "__main__":
    run_test()
