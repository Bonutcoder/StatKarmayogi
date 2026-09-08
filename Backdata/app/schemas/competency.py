from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class RoleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    code: str
    title: str
    description: Optional[str] = None
    department_id: Optional[str] = None

class CompetencyResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    code: str
    name: str
    domain: str
    description: Optional[str] = None
    min_level: int = 1
    max_level: int = 5

class SkillGapResponse(BaseModel):
    employee_id: str
    competency_id: str
    competency_name: str
    competency_domain: str
    required_level: int
    current_level: int
    gap_value: int
    priority_score: float

class CompetencyUpdate(BaseModel):
    competency_id: str
    new_level: int
    change_reason: str
    source_type: str = "MANUAL_ADMIN"
    source_id: Optional[str] = None

class CompetencyHistoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    employee_id: str
    competency_id: str
    previous_level: int
    new_level: int
    change_reason: str
    source_type: str
    source_id: Optional[str] = None
    created_at: datetime
