import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class AuditEvent(Base):
    __tablename__ = "audit_events"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    event_type: Mapped[str] = mapped_column(String(100), nullable=False, index=True) 
    # LOGIN, EMPLOYEE_UPDATED, COMPETENCY_UPDATED, DOCUMENT_UPLOADED, ASSESSMENT_SUBMITTED, MASTERY_UPDATED, ADMIN_ACTION
    actor_user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), nullable=True)
    department_id: Mapped[str] = mapped_column(String, ForeignKey("departments.id"), nullable=True)
    ip_address: Mapped[str] = mapped_column(String(50), nullable=True)
    details_json: Mapped[str] = mapped_column(String(4000), nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    job_type: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="PENDING") # PENDING, PROCESSING, COMPLETED, FAILED
    error_message: Mapped[str] = mapped_column(String(2000), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    completed_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
