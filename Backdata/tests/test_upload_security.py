import pytest
from io import BytesIO
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.storage_service import process_and_store_pdf_upload
from app.core.exceptions import InvalidFileUploadException

@pytest.mark.asyncio
async def test_non_pdf_extension_rejected(test_db_session: AsyncSession):
    file = UploadFile(filename="malicious.exe", file=BytesIO(b"echo hack"))
    with pytest.raises(InvalidFileUploadException) as exc:
        await process_and_store_pdf_upload(test_db_session, file, "dept-1", "user-1", "Title")
    assert "File must have a .pdf extension" in str(exc.value.detail)

@pytest.mark.asyncio
async def test_invalid_magic_bytes_rejected(test_db_session: AsyncSession):
    file = UploadFile(filename="fake.pdf", file=BytesIO(b"NOT A VALID PDF CONTENT"))
    with pytest.raises(InvalidFileUploadException) as exc:
        await process_and_store_pdf_upload(test_db_session, file, "dept-1", "user-1", "Title")
    assert "magic bytes" in str(exc.value.detail)
