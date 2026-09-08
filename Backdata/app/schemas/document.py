from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class DocumentMetadataResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    department_id: str
    file_name: str
    file_size: int
    mime_type: str
    sha256_hash: str
    upload_status: str
    uploaded_by: str
    created_at: datetime

class DocumentChunkResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    document_id: str
    chunk_index: int
    content: str
    page_number: Optional[int] = None
    section_title: Optional[str] = None
