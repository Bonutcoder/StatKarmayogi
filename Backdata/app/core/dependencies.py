from typing import List, Optional
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.db.models.user import User, Employee
from app.core.security import decode_access_token
from app.core.exceptions import NotAuthenticatedException, PermissionDeniedException

security_scheme = HTTPBearer(auto_error=False)

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    if not credentials or not credentials.credentials:
        raise NotAuthenticatedException("Missing or invalid Authorization header")
    
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise NotAuthenticatedException("Token decoding failed or token expired")
    
    user_id: str = payload.get("sub") or payload.get("user_id")
    if not user_id:
        raise NotAuthenticatedException("Invalid token payload")
    
    stmt = select(User).where(User.id == user_id, User.is_active == True)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        raise NotAuthenticatedException("Authenticated user record not found or inactive")
    
    return user

async def get_current_employee(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Employee:
    stmt = select(Employee).where(Employee.user_id == current_user.id)
    result = await db.execute(stmt)
    employee = result.scalar_one_or_none()
    if not employee:
        raise PermissionDeniedException("No employee profile found for user")
    return employee

class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in self.allowed_roles:
            raise PermissionDeniedException(
                f"Role '{current_user.role}' is not authorized to perform this operation. Allowed: {self.allowed_roles}"
            )
        return current_user

def verify_department_access(current_user: User, target_department_id: str) -> None:
    # System Admin and MoSPI Admins have global visibility
    if current_user.role in ["SYSTEM_ADMIN", "SECURITY_COMPLIANCE", "MOSPI_NSSTA_ADMIN"]:
        return
    
    if current_user.department_id != target_department_id:
        raise PermissionDeniedException("Cross-department access prohibited")
