from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.db.models.user import User
from app.db.models.course import TrainingDocument
from app.schemas.document import DocumentMetadataResponse
from app.core.dependencies import get_current_user, RoleChecker, verify_department_access
from app.services.storage_service import process_and_store_pdf_upload
from app.services.audit_service import log_audit_event

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/upload", response_model=DocumentMetadataResponse)
async def upload_training_document(
    title: str = Form(...),
    department_id: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(RoleChecker(["DEPARTMENT_ADMIN", "SYSTEM_ADMIN", "MOSPI_NSSTA_ADMIN", "TRAINING_COORDINATOR"])),
    db: AsyncSession = Depends(get_db)
):
    verify_department_access(current_user, department_id)

    doc = await process_and_store_pdf_upload(
        db=db,
        file=file,
        department_id=department_id,
        uploaded_by_user_id=current_user.id,
        title=title
    )

    await log_audit_event(
        db,
        event_type="DOCUMENT_UPLOADED",
        actor_user_id=current_user.id,
        department_id=department_id,
        details={"document_id": doc.id, "file_name": doc.file_name, "sha256": doc.sha256_hash}
    )

    return doc

@router.get("/{id}", response_model=DocumentMetadataResponse)
async def get_document_metadata(
    id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(TrainingDocument).where(TrainingDocument.id == id)
    res = await db.execute(stmt)
    doc = res.scalar_one_or_none()

    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    verify_department_access(current_user, doc.department_id)
    return doc
