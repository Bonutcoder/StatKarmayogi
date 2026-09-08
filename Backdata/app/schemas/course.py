from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class CourseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    external_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    provider: str
    duration_hours: int
    level: str
    external_url: Optional[str] = None
    is_active: bool

class RecommendationResponse(BaseModel):
    id: str
    employee_id: str
    course: CourseResponse
    gap_competency_id: str
    gap_competency_name: str
    recommendation_score: float
    reasoning: str

class TrainingHistoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    employee_id: str
    course_id: str
    completion_status: str
    completion_date: datetime
    certificate_url: Optional[str] = None
