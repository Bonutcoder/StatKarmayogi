from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class EmployeeBase(BaseModel):
    employee_code: str
    full_name: str
    designation: str
    department_id: str
    cadre: Optional[str] = None
    experience_years: int = 0
    role_id: Optional[str] = None

class EmployeeCreate(EmployeeBase):
    user_id: str

class EmployeeResponse(EmployeeBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    created_at: datetime
