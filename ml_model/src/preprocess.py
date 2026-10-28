from typing import List, Union

def preprocess_input(raw_features: Union[List[float], List[int]]) -> List[float]:
    """
    Validates and standardizes input feature vectors.
    """
    if not isinstance(raw_features, list):
        try:
            raw_features = list(raw_features)
        except Exception as e:
            raise ValueError(f"Features must be list of numerical values: {e}")
            
    # Convert elements to float
    clean_features = [float(x) for x in raw_features]
    return clean_features
