"""
RAG document indexing and semantic retrieval endpoints.
Strictly preserves department isolation per SECURITY.md Section 6.
"""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from backengine.app.rag.vector_store import VectorStore
from backengine.app.rag.chunker import DocumentChunker, DocumentChunk
from backengine.app.rag.extractor import ExtractedPage

router = APIRouter()
vector_store = VectorStore()
chunker = DocumentChunker()


class IndexDocumentRequest(BaseModel):
    department_id: str = "default"
    document_id: str
    pages: List[Dict[str, Any]] = Field(..., description="List of {page_number, text}")


class RAGQueryRequest(BaseModel):
    department_id: str = "default"
    query: str
    top_k: int = 4
    min_similarity: float = 0.35


@router.post("/index/{document_id}")
async def index_document(document_id: str, request: IndexDocumentRequest):
    """
    Chunks and indexes document text into the department's isolated vector space.
    Retains page numbers and section metadata.
    """
    try:
        extracted_pages = [
            ExtractedPage(
                page_number=p.get("page_number", idx + 1),
                text=p.get("text", ""),
                character_count=len(p.get("text", "")),
            )
            for idx, p in enumerate(request.pages)
        ]

        chunks = chunker.chunk_pages(document_id, extracted_pages)
        count = vector_store.add_chunks(request.department_id, chunks)

        return {
            "status": "success",
            "document_id": document_id,
            "department_id": request.department_id,
            "chunks_indexed": count,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Indexing error: {str(e)}")


@router.post("/query")
async def query_rag(request: RAGQueryRequest) -> List[Dict[str, Any]]:
    """
    Retrieves evidence chunks relevant to query within the department boundary.
    """
    try:
        return vector_store.search(
            department_id=request.department_id,
            query=request.query,
            top_k=request.top_k,
            min_similarity=request.min_similarity,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retrieval error: {str(e)}")
