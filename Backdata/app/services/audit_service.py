import json
from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.audit import AuditEvent

async def log_audit_event(
    db: AsyncSession,
    event_type: str,
    actor_user_id: Optional[str] = None,
    department_id: Optional[str] = None,
    ip_address: Optional[str] = None,
    details: Optional[Dict[str, Any]] = None
) -> AuditEvent:
    details_str = json.dumps(details) if details else None
    audit = AuditEvent(
        event_type=event_type,
        actor_user_id=actor_user_id,
        department_id=department_id,
        ip_address=ip_address,
        details_json=details_str
    )
    db.add(audit)
    await db.commit()
    await db.refresh(audit)
    return audit
