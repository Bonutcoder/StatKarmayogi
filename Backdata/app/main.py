import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from app.config import settings
from app.db.base import Base
from app.db.session import engine, AsyncSessionLocal
from app.db.models import (
    Department, User, Employee, Role, Competency, RoleCompetency, Course, CourseCompetency, Assessment, Question
)
from app.core.security import get_password_hash
from app.api.v1.router import api_router

async def init_db_data():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # Check if seed data exists
        stmt = select(Department).where(Department.code == "MOSPI_NSSTA")
        res = await db.execute(stmt)
        if res.scalar_one_or_none():
            return

        # Seed Department
        dept = Department(
            code="MOSPI_NSSTA",
            name="National Statistical Systems Training Academy (NSSTA) / MoSPI",
            description="Official Statistical System Training & Competency Academy"
        )
        db.add(dept)
        await db.flush()

        # Seed Demo Roles
        roles_data = [
            ("STAT_OFFICER", "Statistical Officer", "Oversees statistical collection and survey operations"),
            ("DATA_ANALYST", "Data Analyst", "Analyzes official survey data and produces analytical reports"),
            ("STAT_INVESTIGATOR", "Statistical Investigator", "Conducts field surveys and primary data collection"),
            ("TRAINING_COORD", "Training Coordinator", "Coordinates NSSTA capacity-building programs")
        ]
        role_objs = {}
        for code, title, desc in roles_data:
            r = Role(code=code, title=title, description=desc, department_id=dept.id)
            db.add(r)
            role_objs[code] = r
        await db.flush()

        # Seed Demo Competencies (from PROJECT_CONTEXT.md)
        comps_data = [
            ("STATISTICS", "Statistics", "Official Statistics", "Descriptive statistics, inference, and sampling design"),
            ("SURVEY_METH", "Survey Methodology", "Survey Operations", "Sampling frames, survey design, non-sampling error management"),
            ("PYTHON", "Python", "Statistical Computing", "Python data analysis with Pandas, NumPy, and Scipy"),
            ("ML", "Machine Learning", "Data Science", "Supervised/unsupervised predictive modeling for survey data"),
            ("GIS", "GIS", "Spatial Analytics", "Geospatial data analysis and thematic mapping"),
            ("DATA_VIS", "Data Visualization", "Dissemination", "Dashboards, statistical charts, and data storytelling"),
            ("DATA_QUAL", "Data Quality", "Quality Governance", "Data validation, auditing, and quality frameworks"),
            ("DIGITAL_GOV", "Digital Governance", "Governance", "e-Governance policies, iGOT Karmayogi integration, security")
        ]
        comp_objs = {}
        for code, name, domain, desc in comps_data:
            c = Competency(code=code, name=name, domain=domain, description=desc, min_level=1, max_level=5)
            db.add(c)
            comp_objs[code] = c
        await db.flush()

        # Map Required Competencies for Statistical Officer
        rc1 = RoleCompetency(role_id=role_objs["STAT_OFFICER"].id, competency_id=comp_objs["STATISTICS"].id, required_level=4)
        rc2 = RoleCompetency(role_id=role_objs["STAT_OFFICER"].id, competency_id=comp_objs["SURVEY_METH"].id, required_level=4)
        rc3 = RoleCompetency(role_id=role_objs["STAT_OFFICER"].id, competency_id=comp_objs["PYTHON"].id, required_level=3)
        rc4 = RoleCompetency(role_id=role_objs["STAT_OFFICER"].id, competency_id=comp_objs["DATA_QUAL"].id, required_level=3)
        db.add_all([rc1, rc2, rc3, rc4])

        # Seed Courses (from iGOT / Local Catalogue)
        course1 = Course(
            title="Official Statistics & Survey Operations",
            description="Comprehensive guide to sample survey design and official data collection",
            provider="LOCAL_CATALOGUE",
            duration_hours=20,
            level="Intermediate",
            external_url="https://igotkarmayogi.gov.in/courses/stat-ops"
        )
        course2 = Course(
            title="Python for Statistical Data Analysis",
            description="Hands-on Python programming for statistical officers and analysts",
            provider="LOCAL_CATALOGUE",
            duration_hours=15,
            level="Intermediate",
            external_url="https://igotkarmayogi.gov.in/courses/python-stats"
        )
        db.add_all([course1, course2])
        await db.flush()

        cc1 = CourseCompetency(course_id=course1.id, competency_id=comp_objs["SURVEY_METH"].id, target_level=4)
        cc2 = CourseCompetency(course_id=course2.id, competency_id=comp_objs["PYTHON"].id, target_level=3)
        db.add_all([cc1, cc2])

        # Seed Demo User & Employee (Learner)
        learner_user = User(
            email="learner@mospi.gov.in",
            hashed_password=get_password_hash("password123"),
            role="LEARNER",
            department_id=dept.id
        )
        db.add(learner_user)
        await db.flush()

        learner_emp = Employee(
            user_id=learner_user.id,
            employee_code="EMP-2026-001",
            full_name="Rajesh Kumar",
            designation="Statistical Officer",
            department_id=dept.id,
            cadre="Indian Statistical Service",
            experience_years=5,
            role_id=role_objs["STAT_OFFICER"].id
        )
        db.add(learner_emp)

        # Seed Demo Admin User
        admin_user = User(
            email="admin@mospi.gov.in",
            hashed_password=get_password_hash("password123"),
            role="DEPARTMENT_ADMIN",
            department_id=dept.id
        )
        db.add(admin_user)
        await db.flush()

        admin_emp = Employee(
            user_id=admin_user.id,
            employee_code="EMP-2026-000",
            full_name="Sunita Sharma",
            designation="Director (Training & NSSTA)",
            department_id=dept.id,
            cadre="Indian Statistical Service",
            experience_years=15,
            role_id=role_objs["TRAINING_COORD"].id
        )
        db.add(admin_emp)

        # Seed Demo Assessment
        ass = Assessment(
            title="Survey Methodology & Sampling Quiz",
            competency_id=comp_objs["SURVEY_METH"].id,
            difficulty_level="Intermediate",
            created_by=admin_user.id
        )
        db.add(ass)
        await db.flush()

        q1 = Question(
            assessment_id=ass.id,
            question_text="Which sampling technique ensures every unit in the population has a known, non-zero probability of selection?",
            option_a="Convenience Sampling",
            option_b="Probability Sampling",
            option_c="Quota Sampling",
            option_d="Judgmental Sampling",
            correct_option="B",
            explanation="Probability sampling assigns a known non-zero inclusion probability to every population unit."
        )
        q2 = Question(
            assessment_id=ass.id,
            question_text="What type of error arises from non-response or measurement inaccuracy during data collection?",
            option_a="Sampling Error",
            option_b="Non-Sampling Error",
            option_c="Standard Error",
            option_d="Type I Error",
            correct_option="B",
            explanation="Non-sampling errors stem from non-response, measurement issues, or data entry errors."
        )
        db.add_all([q1, q2])

        await db.commit()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db_data()
    yield

app = FastAPI(
    title="StatKarmayogi AI — Core Backend (Backdata)",
    description="Authoritative Backend Data, Security, Deterministic Engines & API Contracts",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Backdata (StatKarmayogi Core Backend)",
        "version": "1.0.0"
    }
