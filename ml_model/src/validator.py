from typing import Dict, Any, List

def validate_itinerary(input_data: Dict[str, Any], output_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validates that the generated ML/AI itinerary strictly complies with input constraints:
    1. Correct number of itinerary days.
    2. Total budget equals (budget_per_person * travelers).
    3. Budget allocation percentages sum up to 100%.
    """
    errors: List[str] = []

    # 1. Verify itinerary days match duration_days
    if len(output_data.get("itinerary_days", [])) != input_data.get("duration_days"):
        errors.append("Incorrect number of itinerary days")

    # 2. Verify total budget match
    expected_budget = (
        input_data.get("budget_per_person", 0) * input_data.get("travelers", 0)
    )

    actual_budget = output_data.get("budget_ledger", {}).get("total_budget")
    if actual_budget != expected_budget:
        errors.append("Total budget mismatch")

    # 3. Verify budget allocation percentages sum to 100%
    allocation = input_data.get("budget_allocation", {})
    if sum(allocation.values()) != 100:
        errors.append("Budget allocation must equal 100%")

    return {
        "valid": len(errors) == 0,
        "errors": errors
    }
