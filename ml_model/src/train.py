import json
from pathlib import Path

def train_model():
    """
    Demonstration training script for the hackathon model.
    Saves trained parameters/weights to ml_model/models/sample_model.json.
    """
    base_dir = Path(__file__).resolve().parent.parent
    models_dir = base_dir / "models"
    models_dir.mkdir(parents=True, exist_ok=True)
    
    print("Training ML Model...")
    # Example model artifact representation
    model_artifact = {
        "model_name": "HackathonClassifier",
        "version": "1.0.0",
        "weights": [0.45, -0.32, 0.78, 0.12],
        "bias": 0.15,
        "classes": ["Negative", "Positive"],
        "metrics": {
            "accuracy": 0.942,
            "f1_score": 0.938
        }
    }
    
    output_path = models_dir / "sample_model.json"
    with open(output_path, "w") as f:
        json.dump(model_artifact, f, indent=2)
        
    print(f"✅ Model artifact successfully saved to: {output_path}")

if __name__ == "__main__":
    train_model()
