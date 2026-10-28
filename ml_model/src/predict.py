import json
import math
from pathlib import Path

try:
    from preprocess import preprocess_input
except ImportError:
    from .preprocess import preprocess_input

class ModelInference:
    """
    Inference engine loaded by backend/app/services/ml_service.py.
    """
    def __init__(self, model_file="sample_model.json"):
        base_dir = Path(__file__).resolve().parent.parent
        self.model_path = base_dir / "models" / model_file
        self.weights = [0.45, -0.32, 0.78, 0.12]
        self.bias = 0.15
        self.model_name = "HackathonClassifier"
        self.load_model()

    def load_model(self):
        if self.model_path.exists():
            try:
                with open(self.model_path, "r") as f:
                    data = json.load(f)
                    self.weights = data.get("weights", self.weights)
                    self.bias = data.get("bias", self.bias)
                    self.model_name = data.get("model_name", self.model_name)
            except Exception as e:
                print(f"Failed to read model artifact, using defaults: {e}")

    def predict(self, raw_features):
        features = preprocess_input(raw_features)
        
        # Calculate dot product: sum(x_i * w_i) + bias
        dot_product = sum(
            f * w for f, w in zip(features, self.weights[:len(features)])
        ) + self.bias
        
        # Sigmoid activation function
        try:
            probability = 1.0 / (1.0 + math.exp(-dot_product))
        except OverflowError:
            probability = 1.0 if dot_product > 0 else 0.0

        predicted_class = 1 if probability >= 0.5 else 0
        confidence = probability if predicted_class == 1 else (1.0 - probability)

        return {
            "prediction": predicted_class,
            "confidence": round(float(confidence), 4),
            "model_used": self.model_name,
            "score": round(float(dot_product), 4)
        }

    def generate_itinerary(self, user_preferences):
        """
        Runs the complete ML/AI itinerary generation pipeline:
        Gemini -> Sentence Transformers -> Google OR-Tools -> Route & Budget -> AI Synthesis.
        """
        try:
            from .pipeline import pipeline
        except ImportError:
            from pipeline import pipeline
        return pipeline.generate_smart_itinerary(user_preferences)

if __name__ == "__main__":
    inference = ModelInference()
    sample_input = [1.2, 0.8, 2.1, 0.5]
    print(f"Sample prediction for {sample_input}:")
    print(inference.predict(sample_input))

    print("\n--- Running Complete ML/AI Itinerary Pipeline Test ---")
    test_pref = {
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
        "interests": ["heritage", "culinary", "nature", "art", "folk_performances"],
        "spiritual_preferences": ["hindu_temples", "jain_architecture"],
        "travel_pace": "balanced",
        "transit_mode": "auto_walk"
    }
    result = inference.generate_itinerary(test_pref)
    print("Status:", result.get("status"))
    print("Destination Intelligence:", result.get("destination_intelligence", {}).get("destination_overview")[:80], "...")
    print("Days generated:", len(result.get("itinerary_days", [])))
    print("Total budget ledger:", result.get("budget_ledger", {}).get("total_budget"))
    print("First Day Title:", result.get("itinerary_days", [{}])[0].get("day_title"))
