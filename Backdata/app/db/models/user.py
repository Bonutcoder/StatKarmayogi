import uuid
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class Department(Base):
    __tablename__ = "departments"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    users: Mapped[list["User"]] = relationship("User", back_populates="department")
    employees: Mapped[list["Employee"]] = relationship("Employee", back_populates="department")

class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=True)
    role: Mapped[str] = mapped_column(String(50), nullable=False, default="LEARNER")
    department_id: Mapped[str] = mapped_column(String, ForeignKey("departments.id"), nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    department: Mapped["Department"] = relationship("Department", back_populates="users")
    employee: Mapped["Employee"] = relationship("Employee", back_populates="user", uselist=False)

class Employee(Base):
    __tablename__ = "employees"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), unique=True, nullable=False)
    employee_code: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    designation: Mapped[str] = mapped_column(String(255), nullable=False)
    department_id: Mapped[str] = mapped_column(String, ForeignKey("departments.id"), nullable=False)
    cadre: Mapped[str] = mapped_column(String(100), nullable=True)
    experience_years: Mapped[int] = mapped_column(Integer, default=0)
    role_id: Mapped[str] = mapped_column(String, ForeignKey("roles.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship("User", back_populates="employee")
    department: Mapped["Department"] = relationship("Department", back_populates="employees")
    role_ref: Mapped["Role"] = relationship("Role", back_populates="employees")
