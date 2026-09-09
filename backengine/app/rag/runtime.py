"""Process-wide RAG store shared by ingestion and assessment generation endpoints."""
from backengine.app.rag.vector_store import VectorStore

vector_store = VectorStore()
