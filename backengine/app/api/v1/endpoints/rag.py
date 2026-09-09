"""
RAG document indexing and semantic retrieval endpoints.
Strictly preserves department isolation per SECURITY.md Section 6.
"""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel, Field
from backengine.app.rag.runtime import vector_store
from backengine.app.rag.chunker import DocumentChunker, DocumentChunk
from backengine.app.rag.extractor import ExtractedPage
from backengine.app.rag.extractor import PDFExtractor

router = APIRouter()
chunker = DocumentChunker()
extractor = PDFExtractor()


class IndexDocumentRequest(BaseModel):
    department_id: str = "default"
    document_id: str
    pages: List[Dict[str, Any]] = Field(..., description="List of {page_number, text}")


class RAGQueryRequest(BaseModel):
    department_id: str = "default"
    query: str
    top_k: int = 4
    min_similarity: float = 0.35


@router.post("/upload")
async def upload_and_index_pdf(
    file: UploadFile = File(...), department_id: str = Form("default")
):
    """Validate, extract and index an approved PDF while retaining page provenance."""
    try:
        data = await file.read()
        document_id = file.filename or "training-document.pdf"
        extraction = extractor.extract_from_bytes(data, document_id)
        chunks = chunker.chunk_pages(document_id, extraction.pages)
        indexed = vector_store.add_chunks(department_id, chunks)
        if not indexed:
            raise ValueError("No indexable text was found in this PDF.")
        return {
            "status": "success",
            "document_id": document_id,
            "department_id": department_id,
            "pages_extracted": extraction.total_pages,
            "chunks_indexed": indexed,
        }
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception:
        raise HTTPException(status_code=500, detail="Document indexing failed.")


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


@router.delete("/documents/{document_id}")
async def delete_indexed_document(document_id: str, department_id: str = "default"):
    """Remove a document's chunks from the department-isolated RAG index."""
    deleted = vector_store.delete_document(department_id, document_id)
    return {"status": "success", "document_id": document_id, "chunks_deleted": deleted}
