import re
from datetime import datetime
from typing import Dict, Any, List, Set, Optional

def parse_date(date_str: Optional[str]) -> Optional[datetime]:
    """
    Attempts to parse date strings in ISO or common human formats.
    """
    if not date_str or not isinstance(date_str, str):
        return None
    date_str = date_str.strip()
    formats = [
        "%Y-%m-%d",
        "%d-%m-%Y",
        "%Y/%m/%d",
        "%d/%m/%Y",
        "%b %d, %Y",
        "%B %d, %Y",
        "%Y-%m-%d %H:%M:%S"
    ]
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    # Handle partial dates like '2026-10-14'
    match = re.search(r"(\d{4})-(\d{1,2})-(\d{1,2})", date_str)
    if match:
        try:
            return datetime(int(match.group(1)), int(match.group(2)), int(match.group(3)))
        except ValueError:
            pass
    return None

def validate_itinerary(input_data: Dict[str, Any], output_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Extended Comprehensive Itinerary Validator.
    Deterministic, robust validation covering:
    1. Duration & day count
    2. Date parsing & night calculations
    3. Budget allocation mathematics & ledgers
    4. Scheduled activities presence on every day
    5. Duplicate attraction detection & coordinate bounds
    6. Interest & spiritual preference representation
    7. Opening hours and timing conflict detection
    8. Route distance & travel time validation
    """
    errors: List[str] = []
    warnings: List[str] = []
    checks_passed: List[str] = []
    checks_failed: List[str] = []

    # =========================================================================
    # 1 & 4. Duration and Exact Day Count Validation
    # =========================================================================
    expected_days = input_data.get("duration_days")
    itinerary_days = output_data.get("itinerary_days", [])
    actual_days_count = len(itinerary_days)

    if expected_days is None or not isinstance(expected_days, int) or expected_days <= 0:
        errors.append(f"Invalid input duration_days: {expected_days}. Must be a positive integer.")
        checks_failed.append("Day count verification")
    elif actual_days_count != expected_days:
        errors.append(f"Incorrect number of itinerary days: expected {expected_days}, got {actual_days_count}")
        checks_failed.append("Day count verification")
    else:
        # Check day numbering continuity (1..N)
        day_numbers = [d.get("day_number") for d in itinerary_days]
        expected_sequence = list(range(1, expected_days + 1))
        if day_numbers != expected_sequence:
            errors.append(f"Non-consecutive day numbers in itinerary: got {day_numbers}, expected {expected_sequence}")
            checks_failed.append("Day numbering continuity")
        else:
            checks_passed.append(f"Itinerary contains exactly {expected_days} consecutive days (Days 1 to {expected_days})")

    # =========================================================================
    # 2. Date Range Validation & Night Calculation
    # =========================================================================
    start_str = input_data.get("start_date")
    end_str = input_data.get("end_date")
    start_dt = parse_date(start_str)
    end_dt = parse_date(end_str)

    if start_str and end_str:
        if start_dt and end_dt:
            if end_dt < start_dt:
                errors.append(f"Invalid date range: end_date ({end_str}) is earlier than start_date ({start_str})")
                checks_failed.append("Date range chronology")
            else:
                calculated_nights = (end_dt - start_dt).days
                # Verify nights against expected duration (typically nights = days - 1, or equals calendar difference)
                ledger_nights = output_data.get("budget_ledger", {}).get("nights")
                if ledger_nights is not None and ledger_nights != calculated_nights:
                    warnings.append(
                        f"Calculated calendar nights ({calculated_nights}) differs from budget ledger nights ({ledger_nights})"
                    )
                else:
                    checks_passed.append(
                        f"Date range valid: {start_dt.strftime('%Y-%m-%d')} to {end_dt.strftime('%Y-%m-%d')} ({calculated_nights} nights calculated)"
                    )
        else:
            warnings.append(
                f"Date format not fully standard ISO: start_date='{start_str}', end_date='{end_str}'. Calendar night calculation skipped."
            )
    else:
        warnings.append("Optional start_date or end_date missing from input; skipped calendar date range validation.")

    # =========================================================================
    # 3. Budget Mathematics & Allocation Amount Validation
    # =========================================================================
    budget_per_person = input_data.get("budget_per_person", 0)
    travelers = input_data.get("travelers", 0)
    expected_total_budget = budget_per_person * travelers

    budget_ledger = output_data.get("budget_ledger", {})
    actual_total_budget = budget_ledger.get("total_budget")

    if actual_total_budget != expected_total_budget:
        errors.append(f"Total budget mismatch: expected ₹{expected_total_budget:,.2f} ({travelers} travelers × ₹{budget_per_person:,.2f}), got ₹{actual_total_budget}")
        checks_failed.append("Total budget match")
    else:
        checks_passed.append(f"Total budget strictly verified: ₹{expected_total_budget:,.2f}")

    # Allocation percentage sum check
    allocation = input_data.get("budget_allocation", {})
    if not allocation or not isinstance(allocation, dict):
        errors.append("Missing or invalid budget_allocation mapping in input")
        checks_failed.append("Budget allocation percentage sum")
    else:
        alloc_sum = sum(allocation.values())
        if alloc_sum != 100:
            errors.append(f"Budget allocation must equal 100%, currently sums to {alloc_sum}% ({allocation})")
            checks_failed.append("Budget allocation percentage sum")
        else:
            checks_passed.append("Budget allocation percentages sum strictly to 100%")

            # Mathematical target amounts check
            stay_pct = allocation.get("stay", 0)
            exp_pct = allocation.get("experiences", 0)
            dt_pct = allocation.get("dining_transit", 0)

            expected_stay_target = round(expected_total_budget * (stay_pct / 100.0), 2)
            expected_exp_target = round(expected_total_budget * (exp_pct / 100.0), 2)
            expected_dt_target = round(expected_total_budget * (dt_pct / 100.0), 2)

            actual_stay_target = budget_ledger.get("stay_allocation", {}).get("target_amount")
            actual_exp_target = budget_ledger.get("experiences_allocation", {}).get("target_amount")
            actual_dt_target = budget_ledger.get("dining_transit_allocation", {}).get("target_amount")

            tolerance = 0.5  # Allow minor rounding cents
            allocation_errors = []
            if actual_stay_target is not None and abs(actual_stay_target - expected_stay_target) > tolerance:
                allocation_errors.append(f"Stay target amount mismatch: expected ₹{expected_stay_target}, got ₹{actual_stay_target}")
            if actual_exp_target is not None and abs(actual_exp_target - expected_exp_target) > tolerance:
                allocation_errors.append(f"Experiences target amount mismatch: expected ₹{expected_exp_target}, got ₹{actual_exp_target}")
            if actual_dt_target is not None and abs(actual_dt_target - expected_dt_target) > tolerance:
                allocation_errors.append(f"Dining/Transit target amount mismatch: expected ₹{expected_dt_target}, got ₹{actual_dt_target}")

            if allocation_errors:
                errors.extend(allocation_errors)
                checks_failed.append("Budget allocation amounts math")
            else:
                checks_passed.append("All category budget allocation amounts mathematically verified")

            # Per person spend math check
            actual_per_person = budget_ledger.get("per_person_spend")
            expected_per_person = round(expected_total_budget / travelers, 2) if travelers > 0 else expected_total_budget
            if actual_per_person is not None and abs(actual_per_person - expected_per_person) > tolerance:
                errors.append(f"Per-person spend math mismatch: expected ₹{expected_per_person}, got ₹{actual_per_person}")
                checks_failed.append("Per-person spend math")
            else:
                checks_passed.append("Per-person spend math mathematically verified")

    # =========================================================================
    # 5. Scheduled Activities Presence On Every Day
    # =========================================================================
    empty_days = []
    total_scheduled_activities = 0

    for day in itinerary_days:
        day_num = day.get("day_number", "?")
        # Collect activities from morning/afternoon/evening blocks and places_list
        activities = []
        for slot_key in ["morning_sequence", "afternoon_immersion", "evening_finale"]:
            slot_data = day.get(slot_key)
            if slot_data and isinstance(slot_data, dict) and (slot_data.get("activity_title") or slot_data.get("place_name")):
                activities.append(slot_data)

        if not activities and not day.get("places_list"):
            empty_days.append(day_num)
        else:
            total_scheduled_activities += len(activities) or len(day.get("places_list", []))

    if empty_days:
        errors.append(f"Itinerary contains days without any scheduled activities: Days {empty_days}")
        checks_failed.append("Daily scheduled activities")
    else:
        checks_passed.append(f"All {actual_days_count} days have active, valid scheduled activities (total {total_scheduled_activities} activities)")

    # =========================================================================
    # 6. Duplicate Attraction Detection & Coordinate Validity
    # =========================================================================
    seen_places: Dict[str, int] = {}
    duplicate_errors = []
    coord_errors = []
    all_place_tags: Set[str] = set()

    for day in itinerary_days:
        day_num = day.get("day_number", 0)
        # Check all scheduled items on this day
        activities_to_check = []
        for slot_key in ["morning_sequence", "afternoon_immersion", "evening_finale"]:
            slot_data = day.get(slot_key)
            if slot_data and isinstance(slot_data, dict) and slot_data.get("activity_title"):
                activities_to_check.append(slot_data)

        if not activities_to_check and day.get("places_list"):
            activities_to_check = day.get("places_list")

        for act in activities_to_check:
            title = (act.get("activity_title") or act.get("place_name", "")).strip().lower()
            if not title:
                continue

            # Duplicate detection
            if title in seen_places:
                duplicate_errors.append(f"Duplicate attraction '{title}' scheduled on Day {seen_places[title]} and Day {day_num}")
            else:
                seen_places[title] = day_num

            # Collect tags for interest coverage
            for tag in act.get("tags", []):
                all_place_tags.add(tag.lower().replace("_", ""))
            for stag in act.get("spiritual_tags", []):
                all_place_tags.add(stag.lower().replace("_", ""))
            category = act.get("category", "").lower().replace("_", "")
            if category:
                all_place_tags.add(category)

            # Coordinates validation
            coords = act.get("coordinates") or {}
            lat = coords.get("lat") if isinstance(coords, dict) else act.get("latitude")
            lng = coords.get("lng") if isinstance(coords, dict) else act.get("longitude")

            if lat is None or lng is None:
                coord_errors.append(f"Missing coordinates for '{title}' on Day {day_num}")
            elif not isinstance(lat, (int, float)) or not isinstance(lng, (int, float)):
                coord_errors.append(f"Non-numeric coordinates for '{title}' on Day {day_num}: lat={lat}, lng={lng}")
            elif lat == 0.0 and lng == 0.0:
                coord_errors.append(f"Invalid null/placeholder coordinates (0.0, 0.0) for '{title}' on Day {day_num}")
            elif not (-90.0 <= lat <= 90.0 and -180.0 <= lng <= 180.0):
                coord_errors.append(f"Out-of-range coordinates ({lat}, {lng}) for '{title}' on Day {day_num}")

    if duplicate_errors:
        errors.extend(duplicate_errors)
        checks_failed.append("Duplicate attraction detection")
    else:
        checks_passed.append(f"Zero duplicate attractions detected ({len(seen_places)} unique attractions across the trip)")

    if coord_errors:
        errors.extend(coord_errors)
        checks_failed.append("Attraction coordinates validation")
    else:
        checks_passed.append("All attraction coordinates verified within valid geographic bounds")

    # =========================================================================
    # 7. Interest & Spiritual Preference Representation Checks
    # =========================================================================
    user_interests = input_data.get("interests", [])
    unrepresented_interests = []
    represented_interests = []

    for interest in user_interests:
        norm_interest = interest.lower().replace("_", "")
        # Check if interest substring appears in any place tag, category, or title
        found = any(norm_interest in t or t in norm_interest for t in all_place_tags) or any(
            norm_interest in p for p in seen_places.keys()
        )
        if found:
            represented_interests.append(interest)
        else:
            unrepresented_interests.append(interest)

    if unrepresented_interests:
        warnings.append(
            f"The following user interests were not explicitly matched by scheduled attraction tags: {unrepresented_interests}"
        )
    else:
        checks_passed.append(f"All {len(user_interests)} requested user interests are represented in scheduled activities")

    # Spiritual preferences check
    spiritual_prefs = input_data.get("spiritual_preferences", [])
    if spiritual_prefs:
        unrepresented_spiritual = []
        for sp in spiritual_prefs:
            norm_sp = sp.lower().replace("_", "")
            found = any(norm_sp in t or t in norm_sp for t in all_place_tags) or any(
                norm_sp in p for p in seen_places.keys()
            )
            if not found:
                unrepresented_spiritual.append(sp)

        if unrepresented_spiritual:
            warnings.append(
                f"Some spiritual preferences were not matched in attraction dataset: {unrepresented_spiritual}"
            )
        else:
            checks_passed.append("Selected spiritual preferences are actively represented in the itinerary")

    # =========================================================================
    # 8. Activity Timing & Opening-Hour Conflict Verification
    # =========================================================================
    timing_conflicts = []
    verified_opening_hour_count = 0
    unverified_opening_hour_count = 0

    for day in itinerary_days:
        day_num = day.get("day_number", 0)
        for slot_key in ["morning_sequence", "afternoon_immersion", "evening_finale"]:
            slot = day.get(slot_key)
            if not slot or not isinstance(slot, dict) or not slot.get("activity_title"):
                continue

            open_hour = slot.get("open_hour")
            close_hour = slot.get("close_hour")
            slot_start = slot.get("slot_start_hour")
            slot_end = slot.get("slot_end_hour")
            title = slot.get("activity_title")

            if open_hour is not None and close_hour is not None and slot_start is not None and slot_end is not None:
                verified_opening_hour_count += 1
                # Conflict: scheduled before opening or after closing
                if slot_start < (open_hour - 0.1):
                    timing_conflicts.append(
                        f"Opening conflict on Day {day_num} for '{title}': scheduled at {slot.get('time_slot')}, but opens at {open_hour:04.1f}h"
                    )
                elif slot_end > (close_hour + 0.1):
                    timing_conflicts.append(
                        f"Closing conflict on Day {day_num} for '{title}': scheduled until {slot.get('time_slot')}, but closes at {close_hour:04.1f}h"
                    )
            else:
                unverified_opening_hour_count += 1

    if timing_conflicts:
        errors.extend(timing_conflicts)
        checks_failed.append("Attraction opening-hour conflicts")
    elif verified_opening_hour_count > 0:
        checks_passed.append(
            f"Verified opening hours for {verified_opening_hour_count} scheduled attractions with zero timing conflicts"
        )
    else:
        warnings.append("No verified opening-hour source data available to perform timing conflict checks")

    if unverified_opening_hour_count > 0:
        warnings.append(f"{unverified_opening_hour_count} scheduled activities do not contain source opening-hour data")

    # =========================================================================
    # 9. Route Distances and Travel Times Validation
    # =========================================================================
    routing_verified_count = 0
    routing_missing_count = 0
    route_anomalies = []

    for day in itinerary_days:
        day_num = day.get("day_number", 0)
        dist_km = day.get("route_distance_km")
        time_mins = day.get("transit_time_mins")

        if dist_km is not None and time_mins is not None:
            routing_verified_count += 1
            if dist_km < 0 or time_mins < 0:
                route_anomalies.append(f"Day {day_num} has negative routing metrics: distance={dist_km} km, time={time_mins} mins")
            elif dist_km > 500.0:
                route_anomalies.append(f"Day {day_num} has excessive single-day travel distance: {dist_km:.1f} km")
            elif dist_km > 2.0 and time_mins == 0:
                route_anomalies.append(f"Day {day_num} has {dist_km:.1f} km distance but 0 mins travel time")
            elif time_mins > 0:
                implied_speed = dist_km / (time_mins / 60.0)
                if implied_speed > 130.0:
                    route_anomalies.append(f"Day {day_num} has unrealistic transit speed: {implied_speed:.1f} km/h")
        else:
            routing_missing_count += 1

    if route_anomalies:
        errors.extend(route_anomalies)
        checks_failed.append("Routing and transit metrics")
    elif routing_verified_count > 0:
        checks_passed.append(f"Route distance and travel times verified for {routing_verified_count} itinerary days with realistic transit metrics")
    else:
        warnings.append("Routing data unavailable; distance and transit time validation skipped")

    if routing_missing_count > 0:
        warnings.append(f"{routing_missing_count} days lack explicit routing metric blocks")

    # =========================================================================
    # 10. Final Structured Assessment
    # =========================================================================
    is_valid = len(errors) == 0

    return {
        "valid": is_valid,
        "errors": errors,
        "warnings": warnings,
        "checks_passed": checks_passed,
        "checks_failed": checks_failed
    }
