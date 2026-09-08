from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.db.models.user import Employee
from app.db.models.competency import RoleCompetency, EmployeeCompetency, SkillGap, CompetencyHistory, Competency
from app.schemas.competency import SkillGapResponse

async def recalculate_employee_gaps(db: AsyncSession, employee_id: str) -> List[SkillGapResponse]:
    stmt_emp = select(Employee).where(Employee.id == employee_id)
    emp_res = await db.execute(stmt_emp)
    employee = emp_res.scalar_one_or_none()
    if not employee or not employee.role_id:
        return []
    
    # 1. Fetch required competencies for employee's role
    stmt_req = select(RoleCompetency, Competency).join(Competency, RoleCompetency.competency_id == Competency.id).where(RoleCompetency.role_id == employee.role_id)
    req_res = await db.execute(stmt_req)
    req_rows = req_res.all()

    # 2. Fetch current employee competency levels
    stmt_curr = select(EmployeeCompetency).where(EmployeeCompetency.employee_id == employee_id)
    curr_res = await db.execute(stmt_curr)
    curr_map = {row.competency_id: row.current_level for row in curr_res.scalars().all()}

    # 3. Clean existing gaps for employee
    stmt_del = delete(SkillGap).where(SkillGap.employee_id == employee_id)
    await db.execute(stmt_del)

    gaps: List[SkillGapResponse] = []
    for role_comp, comp in req_rows:
        current_lvl = curr_map.get(comp.id, 0)
        req_lvl = role_comp.required_level
        gap_val = req_lvl - current_lvl

        if gap_val > 0:
            priority = float(gap_val * 1.5)
            gap_record = SkillGap(
                employee_id=employee_id,
                competency_id=comp.id,
                required_level=req_lvl,
                current_level=current_lvl,
                gap_value=gap_val,
                priority_score=priority
            )
            db.add(gap_record)
            
            gaps.append(
                SkillGapResponse(
                    employee_id=employee_id,
                    competency_id=comp.id,
                    competency_name=comp.name,
                    competency_domain=comp.domain,
                    required_level=req_lvl,
                    current_level=current_lvl,
                    gap_value=gap_val,
                    priority_score=priority
                )
            )
    
    await db.commit()
    return gaps

async def update_employee_competency_level(
    db: AsyncSession,
    employee_id: str,
    competency_id: str,
    new_level: int,
    change_reason: str,
    source_type: str = "MANUAL_ADMIN",
    source_id: str = None
) -> EmployeeCompetency:
    # Fetch existing level
    stmt_curr = select(EmployeeCompetency).where(
        EmployeeCompetency.employee_id == employee_id,
        EmployeeCompetency.competency_id == competency_id
    )
    res = await db.execute(stmt_curr)
    emp_comp = res.scalar_one_or_none()

    prev_level = emp_comp.current_level if emp_comp else 0

    if emp_comp:
        emp_comp.current_level = new_level
    else:
        emp_comp = EmployeeCompetency(
            employee_id=employee_id,
            competency_id=competency_id,
            current_level=new_level
        )
        db.add(emp_comp)

    # Append to CompetencyHistory (append-only principle)
    history = CompetencyHistory(
        employee_id=employee_id,
        competency_id=competency_id,
        previous_level=prev_level,
        new_level=new_level,
        change_reason=change_reason,
        source_type=source_type,
        source_id=source_id
    )
    db.add(history)
    await db.commit()

    # Recalculate gaps
    await recalculate_employee_gaps(db, employee_id)
    return emp_comp
