from pydantic import BaseModel
from typing import List, Dict

class CompetencyGapSummary(BaseModel):
    competency_id: str
    competency_name: str
    domain: str
    total_employees: int
    employees_with_gap: int
    avg_gap_value: float

class DepartmentAnalyticsResponse(BaseModel):
    department_id: str
    total_employees: int
    average_readiness_score: float
    gaps_by_competency: List[CompetencyGapSummary] = []
