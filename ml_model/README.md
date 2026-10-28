# Machine Learning Model Service (`ml_model/`)

This directory houses the dataset pipelines, model training routines, serialized model artifacts, and inference functions.

## Directory Structure

```text
ml_model/
├── data/
│   ├── raw/            # Unprocessed raw datasets (CSV, JSON, images, etc.)
│   └── processed/      # Preprocessed, feature-engineered datasets
├── models/             # Serialized model files, weights, checkpoints (.json, .pkl, .pt, .onnx)
│   └── sample_model.json
├── notebooks/          # Jupyter notebooks for data analysis & experimentation
├── src/
│   ├── __init__.py
│   ├── preprocess.py   # Data validation and feature scaling
│   ├── train.py        # Model training pipeline
│   └── predict.py      # Inference class used by backend service
├── README.md
└── requirements.txt    # ML dependencies (numpy, scikit-learn, etc.)
```

## Usage

### 1. Training the Model
Run the training script to train and save the model artifact to `models/`:
```bash
python3 src/train.py
```

### 2. Testing Inference
Test local predictions directly:
```bash
python3 src/predict.py
```

### 3. Backend Integration
The backend automatically imports `ModelInference` from `ml_model/src/predict.py` via `backend/app/services/ml_service.py`.
