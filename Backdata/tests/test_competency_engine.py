import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.models import Department, User, Employee, Role, Competency, RoleCompetency, EmployeeCompetency, CompetencyHistory
from app.services.competency_engine import update_employee_competency_level, recalculate_employee_gaps

@pytest.mark.asyncio
async def test_deterministic_gap_calculation_and_append_only_history(test_db_session: AsyncSession):
    # Setup test entities
    dept = Department(code="D1", name="Dept 1")
    test_db_session.add(dept)
    await test_db_session.flush()

    user = User(email="learner@test.com", role="LEARNER", department_id=dept.id)
    test_db_session.add(user)
    await test_db_session.flush()

    role = Role(code="R1", title="Officer", department_id=dept.id)
    comp = Competency(code="C1", name="Statistics", domain="Stats")
    test_db_session.add_all([role, comp])
    await test_db_session.flush()

    # Role requires Level 4
    rc = RoleCompetency(role_id=role.id, competency_id=comp.id, required_level=4)
    emp = Employee(user_id=user.id, employee_code="EMP-1", full_name="Test Learner", designation="Officer", department_id=dept.id, role_id=role.id)
    test_db_session.add_all([rc, emp])
    await test_db_session.commit()

    # Initial Gap calculation (Current level = 0, Required = 4 -> Gap = 4)
    gaps = await recalculate_employee_gaps(test_db_session, emp.id)
    assert len(gaps) == 1
    assert gaps[0].gap_value == 4

    # Update competency level to Level 3 via admin update
    await update_employee_competency_level(
        db=test_db_session,
        employee_id=emp.id,
        competency_id=comp.id,
        new_level=3,
        change_reason="Completed NSSTA Training",
        source_type="TRAINING"
    )

    # Recalculated Gap (Current level = 3, Required = 4 -> Gap = 1)
    new_gaps = await recalculate_employee_gaps(test_db_session, emp.id)
    assert len(new_gaps) == 1
    assert new_gaps[0].gap_value == 1

    # Check CompetencyHistory (append-only)
    hist_stmt = select(CompetencyHistory).where(CompetencyHistory.employee_id == emp.id)
    hist_res = await test_db_session.execute(hist_stmt)
    history = hist_res.scalars().all()
    assert len(history) == 1
    assert history[0].previous_level == 0
    assert history[0].new_level == 3
    assert history[0].change_reason == "Completed NSSTA Training"
