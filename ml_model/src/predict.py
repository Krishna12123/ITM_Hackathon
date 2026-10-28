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

if __name__ == "__main__":
    inference = ModelInference()
    sample_input = [1.2, 0.8, 2.1, 0.5]
    print(f"Sample prediction for {sample_input}:")
    print(inference.predict(sample_input))
