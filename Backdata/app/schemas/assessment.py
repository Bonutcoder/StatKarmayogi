from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class QuestionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    explanation: Optional[str] = None
    source_document_id: Optional[str] = None
    source_page: Optional[int] = None

class AssessmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    competency_id: str
    difficulty_level: str
    questions: List[QuestionResponse] = []

class AnswerInput(BaseModel):
    question_id: str
    selected_option: str # A, B, C, D

class AssessmentSubmitRequest(BaseModel):
    answers: List[AnswerInput]

class AssessmentAttemptResult(BaseModel):
    attempt_id: str
    employee_id: str
    assessment_id: str
    score_percentage: float
    passed: bool
    mastery_level: str
    total_questions: int
    correct_count: int
    started_at: datetime
    completed_at: datetime
