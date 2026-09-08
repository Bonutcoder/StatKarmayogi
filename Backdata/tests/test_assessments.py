import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import Department, User, Employee, Competency, Assessment, Question
from app.schemas.assessment import AnswerInput
from app.services.assessment_service import submit_assessment_attempt, classify_mastery_level

def test_mastery_level_classification():
    assert classify_mastery_level(95.0) == "STRONG_MASTERY"
    assert classify_mastery_level(70.0) == "PROFICIENT"
    assert classify_mastery_level(50.0) == "DEVELOPING"
    assert classify_mastery_level(20.0) == "NEEDS_FOUNDATION"

@pytest.mark.asyncio
async def test_quiz_attempt_deterministic_scoring(test_db_session: AsyncSession):
    dept = Department(code="D1", name="Dept 1")
    test_db_session.add(dept)
    await test_db_session.flush()

    user = User(email="test@test.com", role="LEARNER", department_id=dept.id)
    comp = Competency(code="C1", name="Stats", domain="Math")
    test_db_session.add_all([user, comp])
    await test_db_session.flush()

    emp = Employee(user_id=user.id, employee_code="E1", full_name="Name", designation="Desig", department_id=dept.id)
    ass = Assessment(title="Test Quiz", competency_id=comp.id)
    test_db_session.add_all([emp, ass])
    await test_db_session.flush()

    q1 = Question(assessment_id=ass.id, question_text="Q1", option_a="A", option_b="B", option_c="C", option_d="D", correct_option="A")
    q2 = Question(assessment_id=ass.id, question_text="Q2", option_a="A", option_b="B", option_c="C", option_d="D", correct_option="B")
    test_db_session.add_all([q1, q2])
    await test_db_session.commit()

    # Submit 1 correct out of 2 -> 50% score
    answers = [
        AnswerInput(question_id=q1.id, selected_option="A"),
        AnswerInput(question_id=q2.id, selected_option="C")
    ]

    result = await submit_assessment_attempt(
        db=test_db_session,
        employee_id=emp.id,
        assessment_id=ass.id,
        answers_input=answers
    )

    assert result.score_percentage == 50.0
    assert result.passed == False
    assert result.mastery_level == "DEVELOPING"
    assert result.correct_count == 1
