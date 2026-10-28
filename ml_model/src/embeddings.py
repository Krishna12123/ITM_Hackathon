import os
import pickle
import numpy as np
from pathlib import Path
from typing import List, Dict, Any, Union

class EmbeddingEngine:
    """
    Phase 3: Semantic Embeddings using Sentence Transformers.
    Computes dense vector representations of attraction descriptions and user interest queries,
    allowing semantic cosine similarity search.
    """
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.model = None
        self.base_dir = Path(__file__).resolve().parent.parent
        self.cache_path = self.base_dir / "models" / "embeddings_cache.pkl"
        self._init_model()

    def _init_model(self):
        try:
            from sentence_transformers import SentenceTransformer
            # Load from local cache without online check
            self.model = SentenceTransformer(self.model_name, local_files_only=True)
        except Exception as e:
            try:
                from sentence_transformers import SentenceTransformer
                self.model = SentenceTransformer(self.model_name)
            except Exception as e2:
                print(f"[EmbeddingEngine] Note: Using Scikit-Learn TF-IDF vectorizer fallback: {e2}")
                from sklearn.feature_extraction.text import TfidfVectorizer
                self.tfidf = TfidfVectorizer(ngram_range=(1, 2), stop_words='english')

    def encode(self, texts: List[str]) -> np.ndarray:
        """
        Encodes a list of texts into normalized embedding vectors.
        """
        if self.model is not None:
            embeddings = self.model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)
            return embeddings
        else:
            tfidf_mat = self.tfidf.fit_transform(texts).toarray()
            # L2 normalize
            norms = np.linalg.norm(tfidf_mat, axis=1, keepdims=True)
            norms[norms == 0] = 1.0
            return tfidf_mat / norms

    def compute_similarity(self, query_embedding: np.ndarray, doc_embeddings: np.ndarray) -> np.ndarray:
        """
        Calculates cosine similarity scores between query vector and candidate document vectors.
        """
        if query_embedding.ndim == 1:
            query_embedding = query_embedding.reshape(1, -1)
        
        # Dot product of normalized vectors equals cosine similarity
        similarities = np.dot(doc_embeddings, query_embedding.T).flatten()
        return np.clip(similarities, 0.0, 1.0)

embedding_engine = EmbeddingEngine()
