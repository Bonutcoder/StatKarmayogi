"""
Vector Store for RAG Document Retrieval.
Provides isolated collections per department/tenant scope as mandated by SECURITY.md Section 6.
Uses ChromaDB when available, with a built-in in-memory cosine vector index fallback.
"""

from typing import List, Dict, Any, Optional
import math
from backengine.app.core.config import get_settings, Settings
from backengine.app.rag.chunker import DocumentChunk
from backengine.app.rag.embeddings import EmbeddingProvider


def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    """Computes cosine similarity between two float vectors."""
    dot = sum(a * b for a, b in zip(v1, v2))
    norm1 = math.sqrt(sum(a * a for a in v1))
    norm2 = math.sqrt(sum(b * b for b in v2))
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return dot / (norm1 * norm2)


class VectorStore:
    """
    Vector storage and similarity search engine.
    Guarantees strict department isolation: chunks indexed in Department A
    can never be retrieved by Department B.
    """

    def __init__(
        self,
        embedding_provider: Optional[EmbeddingProvider] = None,
        settings: Optional[Settings] = None,
    ):
        self.settings = settings or get_settings()
        self.embedding_provider = embedding_provider or EmbeddingProvider(self.settings)

        # In-memory storage: { department_id: [ {chunk, embedding} ] }
        self._isolated_stores: Dict[str, List[Dict[str, Any]]] = {}

        # Attempt ChromaDB initialization
        self._chroma_client = None
        try:
            import chromadb  # type: ignore
            self._chroma_client = chromadb.PersistentClient(path=self.settings.VECTOR_STORE_PATH)
        except Exception:
            self._chroma_client = None

    def _get_collection_name(self, department_id: str) -> str:
        """Sanitizes department id for vector collection name."""
        clean_dept = "".join(c if c.isalnum() else "_" for c in department_id)
        return f"dept_{clean_dept}"[:63]

    def add_chunks(self, department_id: str, chunks: List[DocumentChunk]) -> int:
        """
        Indexes document chunks into the department's isolated vector space.
        """
        if not chunks:
            return 0

        texts = [c.chunk_text for c in chunks]
        embeddings = self.embedding_provider.embed_texts(texts)

        # Add to ChromaDB if active
        if self._chroma_client is not None:
            try:
                coll_name = self._get_collection_name(department_id)
                collection = self._chroma_client.get_or_create_collection(name=coll_name)

                collection.add(
                    ids=[c.chunk_id for c in chunks],
                    embeddings=embeddings,
                    documents=texts,
                    metadatas=[
                        {
                            "document_id": c.document_id,
                            "page_start": c.page_start,
                            "page_end": c.page_end,
                            "section": c.section,
                        }
                        for c in chunks
                    ],
                )
            except Exception:
                pass  # Fall back to in-memory store

        # Always store in isolated in-memory index for resilience
        if department_id not in self._isolated_stores:
            self._isolated_stores[department_id] = []

        existing_ids = {item["chunk"].chunk_id for item in self._isolated_stores[department_id]}
        count = 0
        for chunk, emb in zip(chunks, embeddings):
            if chunk.chunk_id not in existing_ids:
                self._isolated_stores[department_id].append({
                    "chunk": chunk,
                    "embedding": emb,
                })
                count += 1

        return count

    def search(
        self,
        department_id: str,
        query: str,
        top_k: Optional[int] = None,
        min_similarity: Optional[float] = None,
    ) -> List[Dict[str, Any]]:
        """
        Retrieves relevant chunks within the specified department boundary.
        Never crosses department boundaries.
        """
        k = top_k or self.settings.RAG_TOP_K
        threshold = min_similarity or self.settings.RAG_MIN_SIMILARITY
        query_emb = self.embedding_provider.embed_query(query)

        # Department boundary check
        dept_chunks = self._isolated_stores.get(department_id, [])
        if not dept_chunks:
            return []

        scored_results = []
        for item in dept_chunks:
            chunk: DocumentChunk = item["chunk"]
            sim = cosine_similarity(query_emb, item["embedding"])
            if sim >= threshold:
                scored_results.append({
                    "chunk_id": chunk.chunk_id,
                    "document_id": chunk.document_id,
                    "page_start": chunk.page_start,
                    "page_end": chunk.page_end,
                    "section": chunk.section,
                    "chunk_text": chunk.chunk_text,
                    "similarity_score": round(sim, 4),
                })

        scored_results.sort(key=lambda x: x["similarity_score"], reverse=True)
        return scored_results[:k]

    def delete_document(self, department_id: str, document_id: str) -> int:
        """Deletes all chunks belonging to a document within a department."""
        if department_id in self._isolated_stores:
            initial = len(self._isolated_stores[department_id])
            self._isolated_stores[department_id] = [
                item for item in self._isolated_stores[department_id]
                if item["chunk"].document_id != document_id
            ]
            return initial - len(self._isolated_stores[department_id])
        return 0
