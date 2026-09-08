import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class Role(Base):
    __tablename__ = "roles"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(String(1000), nullable=True)
    department_id: Mapped[str] = mapped_column(String, ForeignKey("departments.id"), nullable=True)

    employees: Mapped[list["Employee"]] = relationship("Employee", back_populates="role_ref")
    required_competencies: Mapped[list["RoleCompetency"]] = relationship("RoleCompetency", back_populates="role")

class Competency(Base):
    __tablename__ = "competencies"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    domain: Mapped[str] = mapped_column(String(100), nullable=False) # e.g. Statistics, Survey Methodology, Python
    description: Mapped[str] = mapped_column(String(1000), nullable=True)
    min_level: Mapped[int] = mapped_column(Integer, default=1)
    max_level: Mapped[int] = mapped_column(Integer, default=5)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    role_mappings: Mapped[list["RoleCompetency"]] = relationship("RoleCompetency", back_populates="competency")
    employee_competencies: Mapped[list["EmployeeCompetency"]] = relationship("EmployeeCompetency", back_populates="competency")

class RoleCompetency(Base):
    __tablename__ = "role_competencies"
    __table_args__ = (UniqueConstraint("role_id", "competency_id", name="uq_role_competency"),)

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    role_id: Mapped[str] = mapped_column(String, ForeignKey("roles.id"), nullable=False)
    competency_id: Mapped[str] = mapped_column(String, ForeignKey("competencies.id"), nullable=False)
    required_level: Mapped[int] = mapped_column(Integer, nullable=False, default=3)

    role: Mapped["Role"] = relationship("Role", back_populates="required_competencies")
    competency: Mapped["Competency"] = relationship("Competency", back_populates="role_mappings")

class EmployeeCompetency(Base):
    __tablename__ = "employee_competencies"
    __table_args__ = (UniqueConstraint("employee_id", "competency_id", name="uq_employee_competency"),)

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    employee_id: Mapped[str] = mapped_column(String, ForeignKey("employees.id"), nullable=False)
    competency_id: Mapped[str] = mapped_column(String, ForeignKey("competencies.id"), nullable=False)
    current_level: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    verified_by: Mapped[str] = mapped_column(String(255), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    competency: Mapped["Competency"] = relationship("Competency", back_populates="employee_competencies")

class CompetencyHistory(Base):
    __tablename__ = "competency_history"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    employee_id: Mapped[str] = mapped_column(String, ForeignKey("employees.id"), nullable=False)
    competency_id: Mapped[str] = mapped_column(String, ForeignKey("competencies.id"), nullable=False)
    previous_level: Mapped[int] = mapped_column(Integer, nullable=False)
    new_level: Mapped[int] = mapped_column(Integer, nullable=False)
    change_reason: Mapped[str] = mapped_column(String(500), nullable=False)
    source_type: Mapped[str] = mapped_column(String(100), nullable=False) # ASSESSMENT, MANUAL_ADMIN, TRAINING
    source_id: Mapped[str] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class SkillGap(Base):
    __tablename__ = "skill_gaps"
    __table_args__ = (UniqueConstraint("employee_id", "competency_id", name="uq_employee_skill_gap"),)

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    employee_id: Mapped[str] = mapped_column(String, ForeignKey("employees.id"), nullable=False)
    competency_id: Mapped[str] = mapped_column(String, ForeignKey("competencies.id"), nullable=False)
    required_level: Mapped[int] = mapped_column(Integer, nullable=False)
    current_level: Mapped[int] = mapped_column(Integer, nullable=False)
    gap_value: Mapped[int] = mapped_column(Integer, nullable=False) # required_level - current_level
    priority_score: Mapped[float] = mapped_column(Float, default=1.0)
    calculated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
