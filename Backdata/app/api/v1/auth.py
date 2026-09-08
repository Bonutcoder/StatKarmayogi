from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.db.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, UserResponse
from app.core.security import verify_password, create_access_token
from app.core.dependencies import get_current_user
from app.services.audit_service import log_audit_event

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login", response_model=TokenResponse)
async def login(
    req: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(User).where(User.email == req.email, User.is_active == True)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()

    if not user or not user.hashed_password or not verify_password(req.password, user.hashed_password):
        await log_audit_event(db, event_type="FAILED_LOGIN", details={"email": req.email})
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    token = create_access_token(data={"sub": user.id, "email": user.email, "role": user.role, "department_id": user.department_id})
    await log_audit_event(db, event_type="LOGIN", actor_user_id=user.id, department_id=user.department_id)

    return TokenResponse(access_token=token)

@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user
