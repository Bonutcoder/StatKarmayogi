import uuid
from datetime import datetime
from sqlalchemy import String, Integer, BigInteger, DateTime, ForeignKey, Boolean, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class Course(Base):
    __tablename__ = "courses"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    external_id: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(String(2000), nullable=True)
    provider: Mapped[str] = mapped_column(String(100), default="LOCAL_CATALOGUE") # iGOT or LOCAL_CATALOGUE
    duration_hours: Mapped[int] = mapped_column(Integer, default=1)
    level: Mapped[str] = mapped_column(String(50), default="Intermediate")
    external_url: Mapped[str] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    course_competencies: Mapped[list["CourseCompetency"]] = relationship("CourseCompetency", back_populates="course")

class CourseCompetency(Base):
    __tablename__ = "course_competencies"
    __table_args__ = (UniqueConstraint("course_id", "competency_id", name="uq_course_competency"),)

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    course_id: Mapped[str] = mapped_column(String, ForeignKey("courses.id"), nullable=False)
    competency_id: Mapped[str] = mapped_column(String, ForeignKey("competencies.id"), nullable=False)
    target_level: Mapped[int] = mapped_column(Integer, nullable=False, default=3)

    course: Mapped["Course"] = relationship("Course", back_populates="course_competencies")

class TrainingHistory(Base):
    __tablename__ = "training_history"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    employee_id: Mapped[str] = mapped_column(String, ForeignKey("employees.id"), nullable=False)
    course_id: Mapped[str] = mapped_column(String, ForeignKey("courses.id"), nullable=False)
    completion_status: Mapped[str] = mapped_column(String(50), default="COMPLETED") # IN_PROGRESS, COMPLETED, DROPPED
    completion_date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    certificate_url: Mapped[str] = mapped_column(String(500), nullable=True)

class TrainingDocument(Base):
    __tablename__ = "training_documents"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    department_id: Mapped[str] = mapped_column(String, ForeignKey("departments.id"), nullable=False)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(500), nullable=False)
    file_size: Mapped[int] = mapped_column(BigInteger, nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False, default="application/pdf")
    sha256_hash: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    upload_status: Mapped[str] = mapped_column(String(50), default="INDEXED") # UPLOADED, PROCESSING, INDEXED, REJECTED
    uploaded_by: Mapped[str] = mapped_column(String, ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    chunks: Mapped[list["DocumentChunk"]] = relationship("DocumentChunk", back_populates="document")

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    document_id: Mapped[str] = mapped_column(String, ForeignKey("training_documents.id"), nullable=False)
    chunk_index: Mapped[int] = mapped_column(Integer, nullable=False)
    content: Mapped[str] = mapped_column(String(4000), nullable=False)
    page_number: Mapped[int] = mapped_column(Integer, nullable=True)
    section_title: Mapped[str] = mapped_column(String(255), nullable=True)

    document: Mapped["TrainingDocument"] = relationship("TrainingDocument", back_populates="chunks")
