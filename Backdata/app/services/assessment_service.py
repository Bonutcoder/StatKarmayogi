from datetime import datetime
from typing import List, Dict, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.models.assessment import Assessment, Question, AssessmentAttempt, Answer, MasteryRecord
from app.schemas.assessment import AnswerInput, AssessmentAttemptResult
from app.services.competency_engine import update_employee_competency_level
from app.core.exceptions import ResourceNotFoundException

def classify_mastery_level(score_percentage: float) -> str:
    if score_percentage >= 80.0:
        return "STRONG_MASTERY"
    elif score_percentage >= 60.0:
        return "PROFICIENT"
    elif score_percentage >= 40.0:
        return "DEVELOPING"
    else:
        return "NEEDS_FOUNDATION"

async def submit_assessment_attempt(
    db: AsyncSession,
    employee_id: str,
    assessment_id: str,
    answers_input: List[AnswerInput]
) -> AssessmentAttemptResult:
    # 1. Fetch assessment and questions
    stmt_ass = select(Assessment).where(Assessment.id == assessment_id)
    ass_res = await db.execute(stmt_ass)
    assessment = ass_res.scalar_one_or_none()
    if not assessment:
        raise ResourceNotFoundException("Assessment not found")

    stmt_q = select(Question).where(Question.assessment_id == assessment_id)
    q_res = await db.execute(stmt_q)
    questions = q_res.scalars().all()
    q_map = {q.id: q for q in questions}

    if not questions:
        raise ResourceNotFoundException("Assessment contains no questions")

    # 2. Score attempt deterministically
    correct_count = 0
    total_questions = len(questions)
    answer_objects: List[Answer] = []

    answer_dict = {ans.question_id: ans.selected_option.strip().upper() for ans in answers_input}

    for q_id, q_obj in q_map.items():
        selected = answer_dict.get(q_id, "")
        is_corr = (selected == q_obj.correct_option.strip().upper())
        if is_corr:
            correct_count += 1

        ans_rec = Answer(
            question_id=q_id,
            selected_option=selected,
            is_correct=is_corr
        )
        answer_objects.append(ans_rec)

    score_pct = (correct_count / total_questions) * 100.0
    passed = score_pct >= 60.0
    mastery_lvl = classify_mastery_level(score_pct)

    # 3. Create AssessmentAttempt
    now = datetime.utcnow()
    attempt = AssessmentAttempt(
        employee_id=employee_id,
        assessment_id=assessment_id,
        score_percentage=score_pct,
        passed=passed,
        started_at=now,
        completed_at=now
    )
    db.add(attempt)
    await db.flush() # obtain attempt.id

    for ans_obj in answer_objects:
        ans_obj.attempt_id = attempt.id
        db.add(ans_obj)

    # 4. Create MasteryRecord
    mastery_rec = MasteryRecord(
        employee_id=employee_id,
        competency_id=assessment.competency_id,
        score=score_pct,
        mastery_level=mastery_lvl,
        recorded_at=now
    )
    db.add(mastery_rec)

    # 5. Update EmployeeCompetency if demonstrated proficiency
    if score_pct >= 80.0:
        await update_employee_competency_level(
            db=db,
            employee_id=employee_id,
            competency_id=assessment.competency_id,
            new_level=4, # Advanced
            change_reason=f"Scored {score_pct:.1f}% on Assessment '{assessment.title}'",
            source_type="ASSESSMENT",
            source_id=attempt.id
        )
    elif score_pct >= 60.0:
        await update_employee_competency_level(
            db=db,
            employee_id=employee_id,
            competency_id=assessment.competency_id,
            new_level=3, # Proficient
            change_reason=f"Scored {score_pct:.1f}% on Assessment '{assessment.title}'",
            source_type="ASSESSMENT",
            source_id=attempt.id
        )

    await db.commit()

    return AssessmentAttemptResult(
        attempt_id=attempt.id,
        employee_id=employee_id,
        assessment_id=assessment_id,
        score_percentage=score_pct,
        passed=passed,
        mastery_level=mastery_lvl,
        total_questions=total_questions,
        correct_count=correct_count,
        started_at=now,
        completed_at=now
    )
