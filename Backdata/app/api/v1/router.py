from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.employees import router as employees_router
from app.api.v1.roles import router as roles_router
from app.api.v1.competencies import router as competencies_router
from app.api.v1.courses import router as courses_router
from app.api.v1.recommendations import router as recommendations_router
from app.api.v1.documents import router as documents_router
from app.api.v1.assessments import router as assessments_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.audit import router as audit_router
from app.api.v1.jobs import router as jobs_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth_router)
api_router.include_router(employees_router)
api_router.include_router(roles_router)
api_router.include_router(competencies_router)
api_router.include_router(courses_router)
api_router.include_router(recommendations_router)
api_router.include_router(documents_router)
api_router.include_router(assessments_router)
api_router.include_router(analytics_router)
api_router.include_router(audit_router)
api_router.include_router(jobs_router)
