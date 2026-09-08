import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class Assessment(Base):
    __tablename__ = "assessments"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    competency_id: Mapped[str] = mapped_column(String, ForeignKey("competencies.id"), nullable=False)
    difficulty_level: Mapped[str] = mapped_column(String(50), default="Intermediate") # Beginner, Intermediate, Advanced
    created_by: Mapped[str] = mapped_column(String, ForeignKey("users.id"), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    questions: Mapped[list["Question"]] = relationship("Question", back_populates="assessment")
    attempts: Mapped[list["AssessmentAttempt"]] = relationship("AssessmentAttempt", back_populates="assessment")

class Question(Base):
    __tablename__ = "questions"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    assessment_id: Mapped[str] = mapped_column(String, ForeignKey("assessments.id"), nullable=False)
    question_text: Mapped[str] = mapped_column(String(2000), nullable=False)
    option_a: Mapped[str] = mapped_column(String(500), nullable=False)
    option_b: Mapped[str] = mapped_column(String(500), nullable=False)
    option_c: Mapped[str] = mapped_column(String(500), nullable=False)
    option_d: Mapped[str] = mapped_column(String(500), nullable=False)
    correct_option: Mapped[str] = mapped_column(String(10), nullable=False) # A, B, C, D
    explanation: Mapped[str] = mapped_column(String(2000), nullable=True)
    source_document_id: Mapped[str] = mapped_column(String, ForeignKey("training_documents.id"), nullable=True)
    source_page: Mapped[int] = mapped_column(Integer, nullable=True)

    assessment: Mapped["Assessment"] = relationship("Assessment", back_populates="questions")

class AssessmentAttempt(Base):
    __tablename__ = "assessment_attempts"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    employee_id: Mapped[str] = mapped_column(String, ForeignKey("employees.id"), nullable=False)
    assessment_id: Mapped[str] = mapped_column(String, ForeignKey("assessments.id"), nullable=False)
    score_percentage: Mapped[float] = mapped_column(Float, default=0.0)
    passed: Mapped[bool] = mapped_column(Boolean, default=False)
    started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    completed_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    assessment: Mapped["Assessment"] = relationship("Assessment", back_populates="attempts")
    answers: Mapped[list["Answer"]] = relationship("Answer", back_populates="attempt")

class Answer(Base):
    __tablename__ = "answers"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    attempt_id: Mapped[str] = mapped_column(String, ForeignKey("assessment_attempts.id"), nullable=False)
    question_id: Mapped[str] = mapped_column(String, ForeignKey("questions.id"), nullable=False)
    selected_option: Mapped[str] = mapped_column(String(10), nullable=False) # A, B, C, D
    is_correct: Mapped[bool] = mapped_column(Boolean, default=False)

    attempt: Mapped["AssessmentAttempt"] = relationship("AssessmentAttempt", back_populates="answers")

class MasteryRecord(Base):
    __tablename__ = "mastery_records"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    employee_id: Mapped[str] = mapped_column(String, ForeignKey("employees.id"), nullable=False)
    competency_id: Mapped[str] = mapped_column(String, ForeignKey("competencies.id"), nullable=False)
    score: Mapped[float] = mapped_column(Float, nullable=False)
    mastery_level: Mapped[str] = mapped_column(String(50), nullable=False) # NEEDS_FOUNDATION, DEVELOPING, PROFICIENT, STRONG_MASTERY
    recorded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
