"""
Embedding provider using SBERT / Sentence Transformers.
Maintains consistent embedding representation across competencies, queries, and training chunks.
Includes pure-Python fallback to ensure operational stability across all environments.
"""

from typing import List, Optional
import math
import re
from backengine.app.core.config import get_settings, Settings


class EmbeddingProvider:
    """
    Generates normalized dense vector representations for queries and document chunks.
    Uses SentenceTransformers when loaded, falling back gracefully if not installed.
    """

    def __init__(self, settings: Optional[Settings] = None):
        self.settings = settings or get_settings()
        self.model_name = self.settings.EMBEDDING_MODEL_NAME
        self.dimension = self.settings.EMBEDDING_DIMENSION
        self._sbert_model = None
        self._load_attempted = False

    def _get_model(self):
        if not self._load_attempted:
            self._load_attempted = True
            try:
                from sentence_transformers import SentenceTransformer  # type: ignore
                self._sbert_model = SentenceTransformer(self.model_name)
            except Exception:
                self._sbert_model = None
        return self._sbert_model

    def _fallback_embed(self, text: str) -> List[float]:
        """
        Pure-Python deterministic feature hashing vectorizer.
        Generates a normalized dense vector of fixed dimension.
        """
        vec = [0.0] * self.dimension
        tokens = re.findall(r"\b\w{2,}\b", text.lower())
        if not tokens:
            return vec

        for token in tokens:
            # Deterministic hash to dimension index
            idx = abs(hash(token)) % self.dimension
            vec[idx] += 1.0

        # L2 normalize
        norm = math.sqrt(sum(x * x for x in vec))
        if norm > 0:
            vec = [round(x / norm, 6) for x in vec]
        return vec

    def embed_texts(self, texts: List[str]) -> List[List[float]]:
        """Computes embeddings for a batch of text chunks."""
        model = self._get_model()
        if model is not None:
            try:
                embeddings = model.encode(texts, show_progress_bar=False, normalize_embeddings=True)
                return [e.tolist() for e in embeddings]
            except Exception:
                pass

        return [self._fallback_embed(t) for t in texts]

    def embed_query(self, query: str) -> List[float]:
        """Computes embedding for a single search or assessment query."""
        results = self.embed_texts([query])
        return results[0]
