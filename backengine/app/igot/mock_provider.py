"""
Mock Learning Provider with pre-seeded MoSPI / NSSTA course catalogue.
Used for local demonstration, offline testing, and until live authorized iGOT API access is established.
"""

from typing import List, Optional, Dict
from backengine.app.igot.base import LearningProvider, CourseSummary, CourseDetail


MOCK_CATALOGUE: List[Dict] = [
    {
        "id": "crs_stat_001",
        "title": "Foundations of Official Statistics & Probability",
        "provider": "National Statistical Systems Training Academy (NSSTA)",
        "competency_ids": ["comp_statistics"],
        "level": 1,
        "duration_hours": 6.0,
        "source": "iGOT Karmayogi (Verified Catalog)",
        "external_url": "https://igotkarmayogi.gov.in/course/crs_stat_001",
        "rating": 4.8,
        "description": "Essential probability distributions, point estimation, confidence intervals, and hypothesis testing tailored for official statistical officers.",
        "modules": ["1. Probability Basics", "2. Sampling Distributions", "3. Hypothesis Testing"],
        "target_audience": "Junior Statistical Officers (JSOs)",
        "prerequisites": ["Basic Mathematics"],
    },
    {
        "id": "crs_stat_002",
        "title": "Advanced Time Series Analysis & National Accounts",
        "provider": "MoSPI Training Division",
        "competency_ids": ["comp_statistics"],
        "level": 3,
        "duration_hours": 12.0,
        "source": "iGOT Karmayogi (Verified Catalog)",
        "external_url": "https://igotkarmayogi.gov.in/course/crs_stat_002",
        "rating": 4.7,
        "description": "ARIMA models, seasonal adjustments, and index number compilation for macroeconomic statistical aggregation.",
        "modules": ["1. Stationarity & Differencing", "2. ARIMA Formulation", "3. Seasonal Adjustments"],
        "target_audience": "Senior Statistical Officers (SSOs) & Directors",
        "prerequisites": ["Foundations of Official Statistics"],
    },
    {
        "id": "crs_surv_001",
        "title": "National Sample Survey (NSS) Design & Methodology",
        "provider": "NSSTA / NSSO",
        "competency_ids": ["comp_survey_methodology"],
        "level": 2,
        "duration_hours": 8.0,
        "source": "iGOT Karmayogi (Verified Catalog)",
        "external_url": "https://igotkarmayogi.gov.in/course/crs_surv_001",
        "rating": 4.9,
        "description": "Stratified multi-stage cluster sampling design, schedule preparation, non-sampling error reduction, and field enumeration standards.",
        "modules": ["1. Sample Design Concepts", "2. Schedule canvassing", "3. Scrutiny & Multiplier Computation"],
        "target_audience": "Field Investigators and Statistical Officers",
        "prerequisites": ["Basic Statistics"],
    },
    {
        "id": "crs_py_001",
        "title": "Python for Statistical Data Processing & Pandas",
        "provider": "Digital India & NSSTA",
        "competency_ids": ["comp_python"],
        "level": 2,
        "duration_hours": 10.0,
        "source": "iGOT Karmayogi (Verified Catalog)",
        "external_url": "https://igotkarmayogi.gov.in/course/crs_py_001",
        "rating": 4.6,
        "description": "Hands-on data transformation, cleaning, tabulation, and automated report generation with Pandas and NumPy.",
        "modules": ["1. Python Data Structures", "2. Pandas DataFrames", "3. Tabulation & Aggregation"],
        "target_audience": "Statistical Investigators and Data Analysts",
        "prerequisites": ["Basic Computer Literacy"],
    },
    {
        "id": "crs_ml_001",
        "title": "Machine Learning Fundamentals for Economic Trend Prediction",
        "provider": "Data Analytics Wing, MoSPI",
        "competency_ids": ["comp_machine_learning", "comp_python"],
        "level": 3,
        "duration_hours": 14.0,
        "source": "iGOT Karmayogi (Verified Catalog)",
        "external_url": "https://igotkarmayogi.gov.in/course/crs_ml_001",
        "rating": 4.5,
        "description": "Practical application of regression, classification trees, and clustering techniques on large administrative datasets.",
        "modules": ["1. Supervised Learning", "2. Model Validation", "3. Predictive Modeling with Scikit-Learn"],
        "target_audience": "Data Analysts and Research Officers",
        "prerequisites": ["Python for Statistical Data Processing"],
    },
    {
        "id": "crs_gis_001",
        "title": "Geospatial Data Integration & GIS Thematic Mapping",
        "provider": "NSSTA in collaboration with Survey of India",
        "competency_ids": ["comp_gis"],
        "level": 2,
        "duration_hours": 8.0,
        "source": "iGOT Karmayogi (Verified Catalog)",
        "external_url": "https://igotkarmayogi.gov.in/course/crs_gis_001",
        "rating": 4.8,
        "description": "Integration of administrative boundaries with census and survey indicators using QGIS and spatial shapefiles.",
        "modules": ["1. Coordinate Systems & Projections", "2. QGIS Workflows", "3. Thematic Map Creation"],
        "target_audience": "Statistical Officers working on Spatial Data",
        "prerequisites": ["None"],
    },
    {
        "id": "crs_vis_001",
        "title": "Data Visualization & Dissemination Standards",
        "provider": "MoSPI Publications Wing",
        "competency_ids": ["comp_data_visualization"],
        "level": 1,
        "duration_hours": 5.0,
        "source": "iGOT Karmayogi (Verified Catalog)",
        "external_url": "https://igotkarmayogi.gov.in/course/crs_vis_001",
        "rating": 4.6,
        "description": "Effective chart selection, color palettes for statistical clarity, accessibility guidelines, and dashboard storytelling.",
        "modules": ["1. Principles of Perception", "2. Chart Grammar", "3. Interactive Dashboards"],
        "target_audience": "All Officers producing Reports",
        "prerequisites": ["None"],
    },
    {
        "id": "crs_qual_001",
        "title": "National Quality Assurance Framework (NQAF) for Official Statistics",
        "provider": "Coordination & Quality Division, MoSPI",
        "competency_ids": ["comp_data_quality"],
        "level": 2,
        "duration_hours": 6.0,
        "source": "iGOT Karmayogi (Verified Catalog)",
        "external_url": "https://igotkarmayogi.gov.in/course/crs_qual_001",
        "rating": 4.9,
        "description": "Implementing data quality audits, error detection mechanisms, imputation protocols, and adherence to UN-NQAF guidelines.",
        "modules": ["1. UN-NQAF Principles", "2. Data Scrutiny Checklists", "3. Quality Reporting"],
        "target_audience": "Quality Reviewers and Statistical Supervisors",
        "prerequisites": ["Survey Methodology"],
    },
    {
        "id": "crs_gov_001",
        "title": "Digital Governance & Cybersecurity for Karmayogis",
        "provider": "Mission Karmayogi Bharat / MoSPI",
        "competency_ids": ["comp_digital_governance"],
        "level": 1,
        "duration_hours": 4.0,
        "source": "iGOT Karmayogi (Verified Catalog)",
        "external_url": "https://igotkarmayogi.gov.in/course/crs_gov_001",
        "rating": 4.7,
        "description": "Government data handling rules, NDSAP compliance, cyber hygiene, and leveraging iGOT for continuous career development.",
        "modules": ["1. Information Security Protocols", "2. NDSAP Sharing Rules", "3. Karmayogi Lifelong Learning"],
        "target_audience": "All Central Civil Services Personnel",
        "prerequisites": ["None"],
    },
]


class MockLearningProvider(LearningProvider):
    """Local, in-memory implementation of LearningProvider."""

    def __init__(self):
        self._catalog = MOCK_CATALOGUE

    async def search_courses(
        self,
        query: Optional[str] = None,
        competency_ids: Optional[List[str]] = None,
        level: Optional[int] = None,
        limit: int = 10,
    ) -> List[CourseSummary]:
        results = []
        for c in self._catalog:
            # Competency filter
            if competency_ids:
                if not any(cid in c["competency_ids"] for cid in competency_ids):
                    continue

            # Level filter
            if level is not None and c["level"] != level:
                continue

            # Query text filter
            if query:
                q = query.lower()
                title_match = q in c["title"].lower()
                desc_match = q in c["description"].lower()
                if not (title_match or desc_match):
                    continue

            results.append(CourseSummary(**c))

        return results[:limit]

    async def get_course(self, course_id: str) -> Optional[CourseDetail]:
        for c in self._catalog:
            if c["id"] == course_id:
                return CourseDetail(**c)
        return None

    async def get_course_catalog(
        self, category: Optional[str] = None, limit: int = 20
    ) -> List[CourseSummary]:
        return [CourseSummary(**c) for c in self._catalog[:limit]]
