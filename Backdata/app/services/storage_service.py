import os
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import UploadFile
from app.config import settings
from app.core.security import compute_sha256
from app.core.exceptions import InvalidFileUploadException
from app.db.models.course import TrainingDocument

MAX_BYTES = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024

async def process_and_store_pdf_upload(
    db: AsyncSession,
    file: UploadFile,
    department_id: str,
    uploaded_by_user_id: str,
    title: str
) -> TrainingDocument:
    # 1. Extension check
    if not file.filename.lower().endswith(".pdf"):
        raise InvalidFileUploadException("File must have a .pdf extension")
    
    # 2. Content Read & Size Check
    content = await file.read()
    if len(content) == 0:
        raise InvalidFileUploadException("Uploaded file is empty")
    if len(content) > MAX_BYTES:
        raise InvalidFileUploadException(f"File size exceeds maximum allowed limit of {settings.MAX_UPLOAD_SIZE_MB}MB")

    # 3. Magic-bytes check (%PDF)
    if not content.startswith(b"%PDF"):
        raise InvalidFileUploadException("File header does not match valid PDF magic bytes (%PDF)")

    # 4. Compute SHA-256
    sha256 = compute_sha256(content)

    # 5. Build Safe Private Storage Path
    rel_dir = os.path.join(settings.STORAGE_LOCAL_ROOT, f"department_{department_id}")
    os.makedirs(rel_dir, exist_ok=True)
    
    file_path = os.path.join(rel_dir, f"{sha256}.pdf")
    
    # Save file content
    with open(file_path, "wb") as f:
        f.write(content)

    # 6. Save DB metadata
    doc = TrainingDocument(
        title=title or file.filename,
        department_id=department_id,
        file_name=os.path.basename(file.filename),
        file_path=file_path,
        file_size=len(content),
        mime_type="application/pdf",
        sha256_hash=sha256,
        upload_status="INDEXED",
        uploaded_by=uploaded_by_user_id
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)

    return doc
