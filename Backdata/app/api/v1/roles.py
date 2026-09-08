from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.db.models.competency import Role
from app.schemas.competency import RoleResponse
from app.core.dependencies import get_current_user
from app.db.models.user import User

router = APIRouter(prefix="/roles", tags=["Roles"])

@router.get("", response_model=List[RoleResponse])
async def list_roles(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Role)
    res = await db.execute(stmt)
    roles = res.scalars().all()
    return roles

@router.get("/{id}", response_model=RoleResponse)
async def get_role_by_id(
    id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Role).where(Role.id == id)
    res = await db.execute(stmt)
    role = res.scalar_one_or_none()
    if not role:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
    return role
