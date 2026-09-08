import uuid
from datetime import datetime
from sqlalchemy import String, Float, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class Recommendation(Base):
    __tablename__ = "recommendations"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    employee_id: Mapped[str] = mapped_column(String, ForeignKey("employees.id"), nullable=False)
    course_id: Mapped[str] = mapped_column(String, ForeignKey("courses.id"), nullable=False)
    gap_competency_id: Mapped[str] = mapped_column(String, ForeignKey("competencies.id"), nullable=False)
    recommendation_score: Mapped[float] = mapped_column(Float, default=1.0)
    reasoning: Mapped[str] = mapped_column(String(1000), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
