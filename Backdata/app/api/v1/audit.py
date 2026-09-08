from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.db.models.user import User
from app.db.models.audit import AuditEvent
from app.schemas.audit import AuditEventResponse
from app.core.dependencies import RoleChecker, verify_department_access

router = APIRouter(prefix="/audit", tags=["Audit"])

@router.get("/events", response_model=List[AuditEventResponse])
async def list_audit_events(
    current_user: User = Depends(RoleChecker(["SECURITY_COMPLIANCE", "SYSTEM_ADMIN", "DEPARTMENT_ADMIN"])),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(AuditEvent)
    if current_user.role == "DEPARTMENT_ADMIN":
        stmt = stmt.where(AuditEvent.department_id == current_user.department_id)
    
    stmt = stmt.order_by(AuditEvent.timestamp.desc()).limit(100)
    res = await db.execute(stmt)
    events = res.scalars().all()
    return events
