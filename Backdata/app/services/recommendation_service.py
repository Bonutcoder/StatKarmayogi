from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.db.models.competency import SkillGap, Competency
from app.db.models.course import Course, CourseCompetency
from app.db.models.recommendation import Recommendation
from app.schemas.course import RecommendationResponse, CourseResponse

async def generate_employee_recommendations(db: AsyncSession, employee_id: str) -> List[RecommendationResponse]:
    # 1. Fetch employee skill gaps
    stmt_gap = select(SkillGap, Competency).join(Competency, SkillGap.competency_id == Competency.id).where(SkillGap.employee_id == employee_id)
    gap_res = await db.execute(stmt_gap)
    gap_rows = gap_res.all()

    if not gap_rows:
        return []

    # Clear prior recommendations for employee
    stmt_del = delete(Recommendation).where(Recommendation.employee_id == employee_id)
    await db.execute(stmt_del)

    results: List[RecommendationResponse] = []

    for gap, comp in gap_rows:
        # Find courses mapping to this competency with target_level >= required_level or matching target
        stmt_course = select(Course, CourseCompetency).join(
            CourseCompetency, Course.id == CourseCompetency.course_id
        ).where(
            CourseCompetency.competency_id == comp.id,
            Course.is_active == True
        )
        c_res = await db.execute(stmt_course)
        c_rows = c_res.all()

        for course, course_comp in c_rows:
            rec_score = float(gap.gap_value * 2.0 + (course_comp.target_level * 0.5))
            reasoning = f"Recommended to bridge level {gap.gap_value} gap in '{comp.name}' (Required: Level {gap.required_level}, Current: Level {gap.current_level})"

            rec_entry = Recommendation(
                employee_id=employee_id,
                course_id=course.id,
                gap_competency_id=comp.id,
                recommendation_score=rec_score,
                reasoning=reasoning
            )
            db.add(rec_entry)
            await db.flush()

            results.append(
                RecommendationResponse(
                    id=rec_entry.id,
                    employee_id=employee_id,
                    course=CourseResponse(
                        id=course.id,
                        external_id=course.external_id,
                        title=course.title,
                        description=course.description,
                        provider=course.provider,
                        duration_hours=course.duration_hours,
                        level=course.level,
                        external_url=course.external_url,
                        is_active=course.is_active
                    ),
                    gap_competency_id=comp.id,
                    gap_competency_name=comp.name,
                    recommendation_score=rec_score,
                    reasoning=reasoning
                )
            )

    await db.commit()
    return results
