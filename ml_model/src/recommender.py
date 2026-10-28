import json
from pathlib import Path
from typing import List, Dict, Any, Optional
import numpy as np
try:
    from .embeddings import embedding_engine
except ImportError:
    from embeddings import embedding_engine

class AttractionRecommender:
    """
    Module 2: Experiences – Personalized recommendation engine.
    Applies Sentence Transformers semantic search, content-based tag filtering,
    budget verification, and multi-factor ranking.
    """
    def __init__(self, data_file: str = "attractions.json"):
        self.base_dir = Path(__file__).resolve().parent.parent
        self.data_path = self.base_dir / "data" / "processed" / data_file
        self.attractions: List[Dict[str, Any]] = []
        self.doc_embeddings: Optional[np.ndarray] = None
        self.load_data()

    def load_data(self):
        if self.data_path.exists():
            with open(self.data_path, "r", encoding="utf-8") as f:
                self.attractions = json.load(f)
            self._precompute_embeddings()
        else:
            print(f"[AttractionRecommender] Warning: {self.data_path} not found.")

    def _precompute_embeddings(self):
        if not self.attractions:
            return
        # Combine place name, category, and description for rich semantic representation
        corpus = [
            f"{a['place_name']}. Category: {a['category']}. {a['description']} Tags: {' '.join(a.get('tags', []))}"
            for a in self.attractions
        ]
        self.doc_embeddings = embedding_engine.encode(corpus)

    def recommend(
        self,
        destination: str,
        interests: List[str],
        spiritual_preferences: List[str],
        budget_limit: float = 12580.0,
        top_k: int = 8
    ) -> List[Dict[str, Any]]:
        """
        Ranks attractions matching user interests, spiritual focus, and budget boundaries.
        """
        if not self.attractions or self.doc_embeddings is None:
            return []

        # 1. Destination match filter
        dest_filter = destination.split(",")[0].strip().lower()
        candidates = []
        candidate_indices = []

        for idx, a in enumerate(self.attractions):
            if dest_filter in a.get("destination", "").lower():
                candidates.append(a)
                candidate_indices.append(idx)

        if not candidates:
            # Fallback to all attractions if destination filter too strict
            candidates = self.attractions
            candidate_indices = list(range(len(self.attractions)))

        # 2. Build semantic query from interests and spiritual preferences
        interest_text = " ".join(interests).replace("_", " ")
        spiritual_text = " ".join(spiritual_preferences).replace("_", " ")
        query = f"Travel experiences for {destination}: {interest_text}. Spiritual and cultural focus: {spiritual_text}"

        query_embedding = embedding_engine.encode([query])
        sub_doc_embeddings = self.doc_embeddings[candidate_indices]

        # 3. Calculate semantic cosine similarity
        cosine_sims = embedding_engine.compute_similarity(query_embedding, sub_doc_embeddings)

        # 4. Multi-factor Scoring & Content-based Filtering
        scored_places = []
        for i, place in enumerate(candidates):
            sim_score = float(cosine_sims[i])
            rating_score = place.get("rating", 4.5) / 5.0  # normalize to 0..1

            # Tag overlap score
            place_tags = set(place.get("tags", []))
            user_interests = set(interests)
            overlap_count = len(place_tags.intersection(user_interests))
            tag_score = min(overlap_count / max(len(interests), 1), 1.0)

            # Spiritual preference boost
            spiritual_boost = 0.0
            if spiritual_preferences:
                place_spiritual = set(place.get("spiritual_preferences", []))
                if place_spiritual.intersection(set(spiritual_preferences)):
                    spiritual_boost = 0.25

            # Cost penalty if ticket exceeds 25% of single-day experience budget
            entry_fee = float(place.get("entry_fee", 0.0))
            cost_penalty = 0.0
            if entry_fee > (budget_limit * 0.25):
                cost_penalty = 0.15

            # Composite weighted ranking score
            final_score = (
                0.45 * sim_score +
                0.25 * tag_score +
                0.20 * rating_score +
                spiritual_boost -
                cost_penalty
            )

            scored_item = dict(place)
            scored_item["match_score"] = round(float(final_score), 4)
            scored_item["semantic_similarity"] = round(float(sim_score), 4)
            scored_places.append(scored_item)

        # 5. Sort by final score descending
        scored_places.sort(key=lambda x: x["match_score"], reverse=True)

        return scored_places[:top_k]

recommender = AttractionRecommender()
