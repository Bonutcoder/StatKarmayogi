from datetime import timedelta
from urllib.parse import urlencode
import uuid
import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.config import settings
from app.db.models.user import Department, Employee, User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserResponse
from app.core.security import verify_password, get_password_hash, create_access_token, decode_access_token
from app.core.dependencies import get_current_user
from app.services.audit_service import log_audit_event

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Create a learner account and its employee profile for self-service onboarding."""
    email = req.email.lower()
    existing = (await db.execute(select(User).where(User.email == email))).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists")

    department_name = req.department.strip()
    department = (await db.execute(select(Department).where(Department.name == department_name))).scalar_one_or_none()
    if not department:
        department = Department(
            code=f"USER_{uuid.uuid4().hex[:12].upper()}",
            name=department_name,
            description="Department created during self-service onboarding",
        )
        db.add(department)
        await db.flush()

    user = User(
        email=email,
        hashed_password=get_password_hash(req.password),
        role="LEARNER",
        department_id=department.id,
    )
    db.add(user)
    await db.flush()
    db.add(Employee(
        user_id=user.id,
        employee_code=f"USR-{uuid.uuid4().hex[:10].upper()}",
        full_name=req.full_name.strip(),
        designation=f"{req.designation.strip()} ({req.grade.strip()})",
        department_id=department.id,
        cadre=req.grade.strip(),
    ))
    await db.commit()

    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role, "department_id": user.department_id})
    return TokenResponse(access_token=token)

@router.get("/github/login")
async def github_login():
    if not settings.GITHUB_CLIENT_ID or not settings.GITHUB_CLIENT_SECRET:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="GitHub sign-in is not configured")
    state = create_access_token({"purpose": "github_oauth_state"}, timedelta(minutes=10))
    query = urlencode({
        "client_id": settings.GITHUB_CLIENT_ID,
        "redirect_uri": f"{settings.APP_BASE_URL}/api/v1/auth/github/callback",
        "scope": "read:user user:email",
        "state": state,
    })
    return RedirectResponse(f"https://github.com/login/oauth/authorize?{query}")

@router.get("/github/callback")
async def github_callback(code: str | None = None, state: str | None = None, error: str | None = None, db: AsyncSession = Depends(get_db)):
    if error:
        return RedirectResponse(f"{settings.APP_FRONTEND_URL}/#oauth_error={error}")
    state_data = decode_access_token(state or "")
    if not code or not state_data or state_data.get("purpose") != "github_oauth_state":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid GitHub OAuth callback")

    async with httpx.AsyncClient(timeout=10) as client:
        token_response = await client.post("https://github.com/login/oauth/access_token", headers={"Accept": "application/json"}, data={
            "client_id": settings.GITHUB_CLIENT_ID,
            "client_secret": settings.GITHUB_CLIENT_SECRET,
            "code": code,
            "redirect_uri": f"{settings.APP_BASE_URL}/api/v1/auth/github/callback",
        })
        token_response.raise_for_status()
        github_token = token_response.json().get("access_token")
        if not github_token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="GitHub did not return an access token")
        headers = {"Authorization": f"Bearer {github_token}", "Accept": "application/vnd.github+json"}
        profile_response = await client.get("https://api.github.com/user", headers=headers)
        profile_response.raise_for_status()
        github_profile = profile_response.json()
        emails_response = await client.get("https://api.github.com/user/emails", headers=headers)
        emails_response.raise_for_status()
        emails = emails_response.json()

    email = github_profile.get("email") or next((item["email"] for item in emails if item.get("primary") and item.get("verified")), None)
    if not email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="A verified email address is required for GitHub sign-in")

    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        department = (await db.execute(select(Department).limit(1))).scalar_one_or_none()
        if not department:
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="No department is available for new users")
        user = User(email=email, role="LEARNER", department_id=department.id)
        db.add(user)
        await db.flush()
        db.add(Employee(user_id=user.id, employee_code=f"GH-{github_profile['id']}", full_name=github_profile.get("name") or github_profile.get("login"), designation="Learner", department_id=department.id, cadre="GitHub OAuth"))
        await db.commit()

    access_token = create_access_token({"sub": user.id, "email": user.email, "role": user.role, "department_id": user.department_id})
    return RedirectResponse(f"{settings.APP_FRONTEND_URL}/#github_token={access_token}")

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
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    department = (await db.execute(select(Department).where(Department.id == current_user.department_id))).scalar_one_or_none()
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        role=current_user.role,
        department_id=current_user.department_id,
        department_name=department.name if department else None,
        is_active=current_user.is_active,
        created_at=current_user.created_at,
    )
