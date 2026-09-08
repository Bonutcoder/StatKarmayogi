from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class AuditEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    event_type: str
    actor_user_id: Optional[str] = None
    department_id: Optional[str] = None
    ip_address: Optional[str] = None
    details_json: Optional[str] = None
    timestamp: datetime

class JobResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    job_type: str
    status: str
    error_message: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
