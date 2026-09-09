// Generated 7 Official Domains & 50 Courses aligned with iGOT Karmayogi Standards

export interface DomainCourse {
  id: string;
  title: string;
  provider: string;
  competency_ids: string[];
  level: number;
  duration_hours: number;
  source: string;
  external_url: string;
  rating: number;
  description: string;
  modules?: string[];
  target_audience?: string;
  prerequisites?: string[];
  domainId: string;
}

export interface LearningDomain {
  id: string;
  name: string;
  icon: string;
  desc: string;
  category: "Core" | "Advanced" | "Foundational";
  coursePrefixes: string[];
}

export interface DomainEnrollment {
  domainId: string;
  domainName: string;
  icon: string;
  category: "Core" | "Advanced" | "Foundational";
  selectedCourseIds: string[]; // completed courses
  targetCourseIds: string[];   // remaining courses to complete
  enrolledAt: string;
}

export const LEARNING_DOMAINS: LearningDomain[] = [
  {
    "id": "domain_statistics",
    "name": "Official Statistics & Survey Methodology",
    "icon": "\ud83d\udcca",
    "desc": "Official probability, time series, national accounts, CPI/PLFS survey design, and small area estimation.",
    "coursePrefixes": [
      "crs_stat_",
      "crs_surv_"
    ],
    "category": "Core"
  },
  {
    "id": "domain_datascience",
    "name": "Data Science, Python & Big Data",
    "icon": "\ud83d\udc0d",
    "desc": "Python data processing, PySpark distributed analytics, PowerBI business intelligence, and spatial econometrics.",
    "coursePrefixes": [
      "crs_py_",
      "crs_cs_ds_",
      "crs_vis_"
    ],
    "category": "Advanced"
  },
  {
    "id": "domain_ai",
    "name": "Artificial Intelligence, ML & Computer Vision",
    "icon": "\ud83e\udd16",
    "desc": "Machine learning, NLP text categorization, Generative AI/LLMs, Computer Vision, and AI Ethics / XAI.",
    "coursePrefixes": [
      "crs_ml_",
      "crs_cs_ai_"
    ],
    "category": "Advanced"
  },
  {
    "id": "domain_cybersecurity",
    "name": "Cybersecurity, Zero-Trust & Data Privacy",
    "icon": "\ud83d\udd12",
    "desc": "Network threat mitigation, ethical hacking, ISO 27001, Zero-Trust IAM, and DPDP Act 2023 compliance.",
    "coursePrefixes": [
      "crs_sec_"
    ],
    "category": "Foundational"
  },
  {
    "id": "domain_administration",
    "name": "Public Administration, Leadership & Procurement",
    "icon": "\ud83c\udfdb\ufe0f",
    "desc": "Mission Karmayogi leadership, GFR 2017 / GeM procurement, risk management, and administrative collaboration.",
    "coursePrefixes": [
      "crs_mgmt_"
    ],
    "category": "Foundational"
  },
  {
    "id": "domain_software",
    "name": "Software Engineering, Cloud & APIs",
    "icon": "\ud83d\udcbb",
    "desc": "Full stack architecture, microservices, database optimization, REST APIs, and MeghRaj NIC cloud deployment.",
    "coursePrefixes": [
      "crs_cs_dev_",
      "crs_cs_fs_"
    ],
    "category": "Advanced"
  },
  {
    "id": "domain_quality_gis",
    "name": "Data Quality, GIS & Governance",
    "icon": "\ud83d\uddfa\ufe0f",
    "desc": "NQAF quality standards, GIS thematic mapping, remote sensing, and NDSAP open data cataloging.",
    "coursePrefixes": [
      "crs_qual_",
      "crs_gis_",
      "crs_gov_"
    ],
    "category": "Core"
  }
];

export const DOMAIN_COURSES: DomainCourse[] = [
  {
    "id": "crs_stat_001",
    "title": "Foundations of Official Statistics & Probability",
    "provider": "National Statistical Systems Training Academy (NSSTA)",
    "competency_ids": [
      "comp_statistics"
    ],
    "level": 1,
    "duration_hours": 6.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_stat_001",
    "rating": 4.8,
    "description": "Essential probability distributions, point estimation, confidence intervals, and hypothesis testing tailored for official statistical officers.",
    "modules": [
      "1. Probability Basics",
      "2. Sampling Distributions",
      "3. Hypothesis Testing"
    ],
    "target_audience": "Junior Statistical Officers (JSOs)",
    "prerequisites": [
      "Basic Mathematics"
    ],
    "domainId": "domain_statistics"
  },
  {
    "id": "crs_stat_002",
    "title": "Advanced Time Series Analysis & National Accounts",
    "provider": "MoSPI Training Division",
    "competency_ids": [
      "comp_statistics"
    ],
    "level": 3,
    "duration_hours": 12.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_stat_002",
    "rating": 4.7,
    "description": "ARIMA models, seasonal adjustments, and index number compilation for macroeconomic statistical aggregation.",
    "modules": [
      "1. Stationarity & Differencing",
      "2. ARIMA Formulation",
      "3. Seasonal Adjustments"
    ],
    "target_audience": "Senior Statistical Officers (SSOs) & Directors",
    "prerequisites": [
      "Foundations of Official Statistics"
    ],
    "domainId": "domain_statistics"
  },
  {
    "id": "crs_surv_001",
    "title": "National Sample Survey (NSS) Design & Methodology",
    "provider": "NSSTA / NSSO",
    "competency_ids": [
      "comp_survey_methodology"
    ],
    "level": 2,
    "duration_hours": 8.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_surv_001",
    "rating": 4.9,
    "description": "Stratified multi-stage cluster sampling design, schedule preparation, non-sampling error reduction, and field enumeration standards.",
    "modules": [
      "1. Sample Design Concepts",
      "2. Schedule canvassing",
      "3. Scrutiny & Multiplier Computation"
    ],
    "target_audience": "Field Investigators and Statistical Officers",
    "prerequisites": [
      "Basic Statistics"
    ],
    "domainId": "domain_statistics"
  },
  {
    "id": "crs_py_001",
    "title": "Python for Statistical Data Processing & Pandas",
    "provider": "Digital India & NSSTA",
    "competency_ids": [
      "comp_python"
    ],
    "level": 2,
    "duration_hours": 10.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_py_001",
    "rating": 4.6,
    "description": "Hands-on data transformation, cleaning, tabulation, and automated report generation with Pandas and NumPy.",
    "modules": [
      "1. Python Data Structures",
      "2. Pandas DataFrames",
      "3. Tabulation & Aggregation"
    ],
    "target_audience": "Statistical Investigators and Data Analysts",
    "prerequisites": [
      "Basic Computer Literacy"
    ],
    "domainId": "domain_datascience"
  },
  {
    "id": "crs_ml_001",
    "title": "Machine Learning Fundamentals for Economic Trend Prediction",
    "provider": "Data Analytics Wing, MoSPI",
    "competency_ids": [
      "comp_machine_learning",
      "comp_python"
    ],
    "level": 3,
    "duration_hours": 14.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_ml_001",
    "rating": 4.5,
    "description": "Practical application of regression, classification trees, and clustering techniques on large administrative datasets.",
    "modules": [
      "1. Supervised Learning",
      "2. Model Validation",
      "3. Predictive Modeling with Scikit-Learn"
    ],
    "target_audience": "Data Analysts and Research Officers",
    "prerequisites": [
      "Python for Statistical Data Processing"
    ],
    "domainId": "domain_ai"
  },
  {
    "id": "crs_gis_001",
    "title": "Geospatial Data Integration & GIS Thematic Mapping",
    "provider": "NSSTA in collaboration with Survey of India",
    "competency_ids": [
      "comp_gis"
    ],
    "level": 2,
    "duration_hours": 8.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_gis_001",
    "rating": 4.8,
    "description": "Integration of administrative boundaries with census and survey indicators using QGIS and spatial shapefiles.",
    "modules": [
      "1. Coordinate Systems & Projections",
      "2. QGIS Workflows",
      "3. Thematic Map Creation"
    ],
    "target_audience": "Statistical Officers working on Spatial Data",
    "prerequisites": [
      "None"
    ],
    "domainId": "domain_quality_gis"
  },
  {
    "id": "crs_vis_001",
    "title": "Data Visualization & Dissemination Standards",
    "provider": "MoSPI Publications Wing",
    "competency_ids": [
      "comp_data_visualization"
    ],
    "level": 1,
    "duration_hours": 5.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_vis_001",
    "rating": 4.6,
    "description": "Effective chart selection, color palettes for statistical clarity, accessibility guidelines, and dashboard storytelling.",
    "modules": [
      "1. Principles of Perception",
      "2. Chart Grammar",
      "3. Interactive Dashboards"
    ],
    "target_audience": "All Officers producing Reports",
    "prerequisites": [
      "None"
    ],
    "domainId": "domain_datascience"
  },
  {
    "id": "crs_qual_001",
    "title": "National Quality Assurance Framework (NQAF) for Official Statistics",
    "provider": "Coordination & Quality Division, MoSPI",
    "competency_ids": [
      "comp_data_quality"
    ],
    "level": 2,
    "duration_hours": 6.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_qual_001",
    "rating": 4.9,
    "description": "Implementing data quality audits, error detection mechanisms, imputation protocols, and adherence to UN-NQAF guidelines.",
    "modules": [
      "1. UN-NQAF Principles",
      "2. Data Scrutiny Checklists",
      "3. Quality Reporting"
    ],
    "target_audience": "Quality Reviewers and Statistical Supervisors",
    "prerequisites": [
      "Survey Methodology"
    ],
    "domainId": "domain_quality_gis"
  },
  {
    "id": "crs_gov_001",
    "title": "Digital Governance & Cybersecurity for Karmayogis",
    "provider": "Mission Karmayogi Bharat / MoSPI",
    "competency_ids": [
      "comp_digital_governance"
    ],
    "level": 1,
    "duration_hours": 4.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_gov_001",
    "rating": 4.7,
    "description": "Government data handling rules, NDSAP compliance, cyber hygiene, and leveraging iGOT for continuous career development.",
    "modules": [
      "1. Information Security Protocols",
      "2. NDSAP Sharing Rules",
      "3. Karmayogi Lifelong Learning"
    ],
    "target_audience": "All Central Civil Services Personnel",
    "prerequisites": [
      "None"
    ],
    "domainId": "domain_quality_gis"
  },
  {
    "id": "crs_stat_003",
    "title": "Consumer Price Index (CPI) & Inflation Metrics Compilation",
    "provider": "Central Statistics Office (CSO), MoSPI",
    "competency_ids": [
      "comp_statistics"
    ],
    "level": 2,
    "duration_hours": 7.5,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_stat_003",
    "rating": 4.8,
    "description": "Laspeyres price index calculation, basket weighting, rural/urban CPI aggregation, and inflation rate reporting.",
    "modules": [
      "1. Base Year & Weighting Diagram",
      "2. Price Data Scrutiny",
      "3. Index Aggregation Formulas"
    ],
    "target_audience": "Statistical Officers & Price Collectors",
    "prerequisites": [
      "Foundations of Official Statistics"
    ],
    "domainId": "domain_statistics"
  },
  {
    "id": "crs_surv_002",
    "title": "Periodic Labour Force Survey (PLFS) Canvassing & Field Audit",
    "provider": "NSSO Field Operations Division (FOD)",
    "competency_ids": [
      "comp_survey_methodology",
      "comp_data_quality"
    ],
    "level": 3,
    "duration_hours": 12.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_surv_002",
    "rating": 4.9,
    "description": "Activity status classification (USPS, CWS), household sampling, computer-assisted personal interviewing (CAPI), and field scrutiny.",
    "modules": [
      "1. PLFS Schedule Concepts",
      "2. Activity Status Matrix",
      "3. CAPI Software & Validation"
    ],
    "target_audience": "Senior Field Investigators & Survey Supervisors",
    "prerequisites": [
      "National Sample Survey Design & Methodology"
    ],
    "domainId": "domain_statistics"
  },
  {
    "id": "crs_py_002",
    "title": "Advanced Statistical Computing & Automated Report Generation",
    "provider": "National Statistical Systems Training Academy (NSSTA)",
    "competency_ids": [
      "comp_python",
      "comp_data_visualization"
    ],
    "level": 3,
    "duration_hours": 15.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_py_002",
    "rating": 4.7,
    "description": "Automated statistical report generation, complex tabular cross-tabulations, and data pipeline scripting using Python and Jupyter.",
    "modules": [
      "1. SciPy & Statsmodels",
      "2. Complex Aggregation Pipelines",
      "3. PDF/HTML Report Generation"
    ],
    "target_audience": "Data Analysts & Deputy Directors",
    "prerequisites": [
      "Python for Statistical Data Processing"
    ],
    "domainId": "domain_datascience"
  },
  {
    "id": "crs_ml_002",
    "title": "Natural Language Processing for Survey Text Categorization",
    "provider": "Data Analytics Wing, MoSPI",
    "competency_ids": [
      "comp_machine_learning"
    ],
    "level": 4,
    "duration_hours": 16.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_ml_002",
    "rating": 4.6,
    "description": "Automated classification of open-ended economic activity descriptions into NIC (National Industrial Classification) codes using NLP.",
    "modules": [
      "1. Text Preprocessing & Embeddings",
      "2. NIC Code Classification",
      "3. Model Fine-Tuning & Evaluation"
    ],
    "target_audience": "Senior Data Scientists & Research Officers",
    "prerequisites": [
      "Machine Learning Fundamentals"
    ],
    "domainId": "domain_ai"
  },
  {
    "id": "crs_gis_002",
    "title": "Remote Sensing & Earth Observation for Agricultural Statistics",
    "provider": "NSSTA in collaboration with ISRO",
    "competency_ids": [
      "comp_gis"
    ],
    "level": 3,
    "duration_hours": 14.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_gis_002",
    "rating": 4.9,
    "description": "Satellite imagery processing, NDVI vegetation index calculation, and crop acreage estimation for official agricultural statistical releases.",
    "modules": [
      "1. Satellite Raster Data Basics",
      "2. NDVI & Crop Masking",
      "3. Acreage & Yield Estimation"
    ],
    "target_audience": "Agricultural Statistical Officers & Analysts",
    "prerequisites": [
      "Geospatial Data Integration & GIS"
    ],
    "domainId": "domain_quality_gis"
  },
  {
    "id": "crs_qual_002",
    "title": "Data Scrutiny Protocols & Outlier Detection in Large Sample Surveys",
    "provider": "Coordination & Quality Division, MoSPI",
    "competency_ids": [
      "comp_data_quality"
    ],
    "level": 3,
    "duration_hours": 9.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_qual_002",
    "rating": 4.8,
    "description": "Statistical outlier detection methods (Mahalanobis distance, IQR, Z-scores), missing data imputation, and data audit trail generation.",
    "modules": [
      "1. Outlier Identification Models",
      "2. Imputation Strategies",
      "3. Audit Logging & Certification"
    ],
    "target_audience": "Statistical Quality Audit Teams & Supervisors",
    "prerequisites": [
      "National Quality Assurance Framework (NQAF)"
    ],
    "domainId": "domain_quality_gis"
  },
  {
    "id": "crs_cs_ai_001",
    "title": "Generative AI & LLM Architecture for Enterprise Solutions",
    "provider": "Digital India & MeitY Academy",
    "competency_ids": [
      "comp_machine_learning",
      "comp_python"
    ],
    "level": 4,
    "duration_hours": 18.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_cs_ai_001",
    "rating": 4.9,
    "description": "Transformer neural networks, prompt engineering, Retrieval-Augmented Generation (RAG), and fine-tuning open-source LLMs for secure government deployments.",
    "modules": [
      "1. Transformer Fundamentals & Attention",
      "2. Vector Embeddings & RAG",
      "3. Llama-3 & Mistral Fine-Tuning"
    ],
    "target_audience": "AI Engineers, System Architects & Technical Leads",
    "prerequisites": [
      "Machine Learning Fundamentals",
      "Python for Statistical Data Processing"
    ],
    "domainId": "domain_ai"
  },
  {
    "id": "crs_cs_fs_001",
    "title": "Modern Full Stack Web Development (React, FastAPI & PostgreSQL)",
    "provider": "National Informatics Centre (NIC) Training Division",
    "competency_ids": [
      "comp_python",
      "comp_digital_governance"
    ],
    "level": 2,
    "duration_hours": 24.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_cs_fs_001",
    "rating": 4.8,
    "description": "Building modern, responsive, and secure web applications with React frontend, FastAPI REST backends, Async SQLAlchemy, and PostgreSQL database management.",
    "modules": [
      "1. React State & UI Components",
      "2. FastAPI Routing & Async ORM",
      "3. JWT Authentication & Security"
    ],
    "target_audience": "Full Stack Software Developers & IT Officers",
    "prerequisites": [
      "Basic Computer Literacy",
      "Python Data Structures"
    ],
    "domainId": "domain_software"
  },
  {
    "id": "crs_cs_ds_001",
    "title": "Big Data Analytics & Distributed Computing with PySpark",
    "provider": "Data Analytics Wing, MoSPI & C-DAC",
    "competency_ids": [
      "comp_statistics",
      "comp_python",
      "comp_machine_learning"
    ],
    "level": 3,
    "duration_hours": 20.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_cs_ds_001",
    "rating": 4.7,
    "description": "Distributed data processing using PySpark RDDs and DataFrames, feature engineering pipelines, handling multi-terabyte survey data, and cluster execution.",
    "modules": [
      "1. PySpark RDDs & DataFrames",
      "2. Distributed Feature Engineering",
      "3. Spark MLlib Pipelines"
    ],
    "target_audience": "Data Scientists, Big Data Engineers & Statistical Analysts",
    "prerequisites": [
      "Python for Statistical Data Processing"
    ],
    "domainId": "domain_datascience"
  },
  {
    "id": "crs_cs_fs_002",
    "title": "Cloud-Native Microservices Architecture & DevOps for e-Governance",
    "provider": "NIC & Centre for Development of Advanced Computing (C-DAC)",
    "competency_ids": [
      "comp_digital_governance",
      "comp_python"
    ],
    "level": 3,
    "duration_hours": 16.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_cs_fs_002",
    "rating": 4.8,
    "description": "Containerization with Docker, Kubernetes cluster orchestration, automated CI/CD deployment pipelines, and zero-trust cloud security standards.",
    "modules": [
      "1. Docker Containerization",
      "2. Kubernetes Deployment Patterns",
      "3. CI/CD & Automated Testing"
    ],
    "target_audience": "DevOps Engineers, Cloud Architects & System Administrators",
    "prerequisites": [
      "Linux System Administration"
    ],
    "domainId": "domain_software"
  },
  {
    "id": "crs_cs_ai_002",
    "title": "Computer Vision & Automated Document Intelligence",
    "provider": "C-DAC & NSSTA",
    "competency_ids": [
      "comp_machine_learning"
    ],
    "level": 3,
    "duration_hours": 14.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_cs_ai_002",
    "rating": 4.7,
    "description": "Optical Character Recognition (OCR), LayoutLM document parsing, image preprocessing, and automated field extraction from handwritten survey forms.",
    "modules": [
      "1. Image Preprocessing & OCR",
      "2. Deep Learning for Layout Parsing",
      "3. Document Data Extraction"
    ],
    "target_audience": "AI Specialists & Survey Digitization Leads",
    "prerequisites": [
      "Machine Learning Fundamentals"
    ],
    "domainId": "domain_ai"
  },
  {
    "id": "crs_sec_001",
    "title": "Cybersecurity Fundamentals & Threat Mitigation for Government Networks",
    "provider": "National Critical Information Infrastructure Protection Centre (NCIIPC)",
    "competency_ids": [
      "comp_digital_governance"
    ],
    "level": 2,
    "duration_hours": 8.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_sec_001",
    "rating": 4.8,
    "description": "Essential network security protocols, malware mitigation, phishing prevention, and CERT-In compliance for civil servants.",
    "modules": [
      "1. Threat Landscape & Phishing",
      "2. Network Defense Basics",
      "3. CERT-In Incident Reporting"
    ],
    "target_audience": "IT Officers & Government System Administrators",
    "prerequisites": [
      "Basic Computer Literacy"
    ],
    "domainId": "domain_cybersecurity"
  },
  {
    "id": "crs_sec_002",
    "title": "Ethical Hacking & Web Application Security Auditing",
    "provider": "C-DAC Cybersecurity Wing",
    "competency_ids": [
      "comp_digital_governance"
    ],
    "level": 3,
    "duration_hours": 14.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_sec_002",
    "rating": 4.9,
    "description": "OWASP Top 10 vulnerabilities, penetration testing methodologies, SQL injection prevention, and secure coding practices.",
    "modules": [
      "1. OWASP Top 10 Exploits",
      "2. Vulnerability Assessment",
      "3. Secure Code Remediation"
    ],
    "target_audience": "Web Developers & Security Auditors",
    "prerequisites": [
      "Full Stack Web Development"
    ],
    "domainId": "domain_cybersecurity"
  },
  {
    "id": "crs_sec_003",
    "title": "ISO/IEC 27001 Information Security Management & Audit Standards",
    "provider": "STQC Directorate & MeitY",
    "competency_ids": [
      "comp_digital_governance",
      "comp_data_quality"
    ],
    "level": 3,
    "duration_hours": 10.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_sec_003",
    "rating": 4.7,
    "description": "Implementing ISMS policies, risk treatment plans, asset classification, and internal security audit preparation for government agencies.",
    "modules": [
      "1. ISMS Policy Framework",
      "2. Risk Assessment Matrix",
      "3. Internal Audit Execution"
    ],
    "target_audience": "Chief Information Security Officers (CISOs) & Quality Auditors",
    "prerequisites": [
      "Cybersecurity Fundamentals"
    ],
    "domainId": "domain_cybersecurity"
  },
  {
    "id": "crs_sec_004",
    "title": "Zero-Trust Network Architecture & Identity Access Management (IAM)",
    "provider": "NIC Cloud & Cyber Security Group",
    "competency_ids": [
      "comp_digital_governance"
    ],
    "level": 4,
    "duration_hours": 12.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_sec_004",
    "rating": 4.9,
    "description": "Never-trust-always-verify principles, OAuth 2.0/OpenID Connect, multi-factor authentication (MFA), and micro-segmentation for e-governance.",
    "modules": [
      "1. Zero-Trust Pillars",
      "2. OAuth 2.0 & SAML Protocols",
      "3. Access Policy Automation"
    ],
    "target_audience": "Enterprise Security Architects & System Administrators",
    "prerequisites": [
      "Ethical Hacking & Security Auditing"
    ],
    "domainId": "domain_cybersecurity"
  },
  {
    "id": "crs_sec_005",
    "title": "Cyber Incident Response, Computer Forensics & SOC Operations",
    "provider": "Indian Cyber Crime Coordination Centre (I4C)",
    "competency_ids": [
      "comp_digital_governance"
    ],
    "level": 3,
    "duration_hours": 16.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_sec_005",
    "rating": 4.8,
    "description": "Security Operations Center (SOC) monitoring, SIEM log analysis, digital evidence preservation, and malware triage.",
    "modules": [
      "1. SOC Triage & Alert Analysis",
      "2. Digital Forensic Preservation",
      "3. Incident Containment & Recovery"
    ],
    "target_audience": "SOC Analysts & Incident Response Teams",
    "prerequisites": [
      "Cybersecurity Fundamentals"
    ],
    "domainId": "domain_cybersecurity"
  },
  {
    "id": "crs_sec_006",
    "title": "Data Privacy, GDPR & India's Digital Personal Data Protection (DPDP) Act 2023",
    "provider": "Ministry of Electronics & IT (MeitY)",
    "competency_ids": [
      "comp_digital_governance"
    ],
    "level": 2,
    "duration_hours": 6.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_sec_006",
    "rating": 4.9,
    "description": "Compliance requirements under DPDP Act 2023, data principal rights, data fiduciary obligations, and anonymization of official survey data.",
    "modules": [
      "1. DPDP Act 2023 Legal Framework",
      "2. Consent Management Architecture",
      "3. Anonymization & De-identification"
    ],
    "target_audience": "Data Protection Officers, Directors & Legal Advisors",
    "prerequisites": [
      "None"
    ],
    "domainId": "domain_cybersecurity"
  },
  {
    "id": "crs_mgmt_001",
    "title": "Public Sector Leadership & Change Management in Mission Karmayogi",
    "provider": "Capacity Building Commission (CBC)",
    "competency_ids": [
      "comp_digital_governance"
    ],
    "level": 2,
    "duration_hours": 8.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_mgmt_001",
    "rating": 4.9,
    "description": "Transforming civil services from rule-based to role-based functioning, adaptive leadership, and driving digital transformation in public offices.",
    "modules": [
      "1. Rule to Role Mindset Shift",
      "2. Stakeholder Engagement",
      "3. Driving Innovation in Government"
    ],
    "target_audience": "Middle & Senior Management Officers",
    "prerequisites": [
      "None"
    ],
    "domainId": "domain_administration"
  },
  {
    "id": "crs_mgmt_002",
    "title": "Government Project Management & Agile Procurement Standards",
    "provider": "Department of Expenditure & National Institute of Financial Management",
    "competency_ids": [
      "comp_digital_governance"
    ],
    "level": 3,
    "duration_hours": 12.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_mgmt_002",
    "rating": 4.7,
    "description": "Managing complex e-governance projects, RFP creation, vendor selection, milestone tracking, and SLA monitoring.",
    "modules": [
      "1. RFP & Tender Drafting",
      "2. Agile Project Execution",
      "3. SLA Monitoring & Risk Mitigation"
    ],
    "target_audience": "Project Directors & Procurement Managers",
    "prerequisites": [
      "Public Sector Leadership"
    ],
    "domainId": "domain_administration"
  },
  {
    "id": "crs_mgmt_003",
    "title": "Strategic Decision Making & Evidence-Based Policy Formulation",
    "provider": "NITI Aayog & Lal Bahadur Shastri National Academy of Administration (LBSNAA)",
    "competency_ids": [
      "comp_statistics",
      "comp_digital_governance"
    ],
    "level": 3,
    "duration_hours": 10.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_mgmt_003",
    "rating": 4.9,
    "description": "Using official statistical indicators, national accounts, and survey data to draft impactful public policy interventions.",
    "modules": [
      "1. Policy Formulation Cycle",
      "2. Statistical Evidence Synthesis",
      "3. Impact Evaluation Methods"
    ],
    "target_audience": "Joint Secretaries, Directors & Policy Analysts",
    "prerequisites": [
      "Foundations of Official Statistics"
    ],
    "domainId": "domain_administration"
  },
  {
    "id": "crs_mgmt_004",
    "title": "Financial Management, GFR 2017 & GeM Procurement Compliance",
    "provider": "National Institute of Financial Management (NIFM)",
    "competency_ids": [
      "comp_digital_governance"
    ],
    "level": 2,
    "duration_hours": 8.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_mgmt_004",
    "rating": 4.8,
    "description": "General Financial Rules (GFR 2017) compliance, Government e-Marketplace (GeM) buying, budget allocation, and audit query handling.",
    "modules": [
      "1. GFR 2017 Key Provisions",
      "2. GeM Portal Bidding & Direct Purchase",
      "3. Financial Scrutiny & Auditing"
    ],
    "target_audience": "Drawing & Disbursing Officers (DDOs) & Finance Clerks",
    "prerequisites": [
      "None"
    ],
    "domainId": "domain_administration"
  },
  {
    "id": "crs_mgmt_005",
    "title": "Team Performance Monitoring & Competency-Based Evaluation",
    "provider": "Capacity Building Commission (CBC)",
    "competency_ids": [
      "comp_digital_governance"
    ],
    "level": 2,
    "duration_hours": 6.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_mgmt_005",
    "rating": 4.6,
    "description": "Establishing Annual Capacity Building Plans (ACBP), setting measurable KPIs, conducting objective appraisals, and coaching staff.",
    "modules": [
      "1. ACBP Framework Drafting",
      "2. KPI Setting & Goal Tracking",
      "3. Constructive Feedback & Coaching"
    ],
    "target_audience": "Section Officers, Directors & Training Coordinators",
    "prerequisites": [
      "None"
    ],
    "domainId": "domain_administration"
  },
  {
    "id": "crs_mgmt_006",
    "title": "Public Communication, Media Handling & Official Data Dissemination",
    "provider": "Indian Institute of Mass Communication (IIMC) & Press Information Bureau (PIB)",
    "competency_ids": [
      "comp_data_visualization"
    ],
    "level": 2,
    "duration_hours": 5.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_mgmt_006",
    "rating": 4.7,
    "description": "Drafting clear statistical press releases, conducting press briefings, managing public misinterpretation of statistics, and social media protocols.",
    "modules": [
      "1. Press Release Drafting for Data Releases",
      "2. Crisis Communication",
      "3. Data Storytelling for Media"
    ],
    "target_audience": "Spokespersons, Information Officers & Statistical Supervisors",
    "prerequisites": [
      "None"
    ],
    "domainId": "domain_administration"
  },
  {
    "id": "crs_mgmt_007",
    "title": "Risk Management Frameworks for Large-Scale Administrative Initiatives",
    "provider": "LBSNAA & Administrative Staff College of India (ASCI)",
    "competency_ids": [
      "comp_digital_governance"
    ],
    "level": 3,
    "duration_hours": 9.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_mgmt_007",
    "rating": 4.8,
    "description": "Identifying operational, financial, and reputational risks in government schemes; establishing mitigation plans and contingency controls.",
    "modules": [
      "1. Risk Identification & Taxonomy",
      "2. Likelihood & Impact Matrix",
      "3. Business Continuity Planning"
    ],
    "target_audience": "Nodal Officers & Program Managers",
    "prerequisites": [
      "Public Sector Leadership"
    ],
    "domainId": "domain_administration"
  },
  {
    "id": "crs_mgmt_008",
    "title": "Conflict Resolution, Negotiation & Cross-Departmental Collaboration",
    "provider": "ASCI Hyderabad",
    "competency_ids": [
      "comp_digital_governance"
    ],
    "level": 1,
    "duration_hours": 4.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_mgmt_008",
    "rating": 4.6,
    "description": "Interest-based negotiation techniques, resolving inter-departmental bottlenecks, building consensus, and effective meeting moderation.",
    "modules": [
      "1. Negotiation Styles & Strategies",
      "2. Inter-agency Bottleneck Removal",
      "3. Consensus Building"
    ],
    "target_audience": "All Government Officers",
    "prerequisites": [
      "None"
    ],
    "domainId": "domain_administration"
  },
  {
    "id": "crs_cs_dev_001",
    "title": "Database Architecture, SQL Optimization & Indexing Strategies",
    "provider": "NIC Software Training Division",
    "competency_ids": [
      "comp_python",
      "comp_digital_governance"
    ],
    "level": 2,
    "duration_hours": 12.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_cs_dev_001",
    "rating": 4.8,
    "description": "Relational database design, query Execution Plan analysis, B-tree/GiST indexing, transaction isolation levels, and PostgreSQL tuning.",
    "modules": [
      "1. Schema Normalization & ER Diagrams",
      "2. Indexing Strategies (B-Tree, GIN, GiST)",
      "3. Query Plan Optimization"
    ],
    "target_audience": "Database Administrators & Backend Developers",
    "prerequisites": [
      "Basic Computer Literacy"
    ],
    "domainId": "domain_software"
  },
  {
    "id": "crs_cs_dev_002",
    "title": "RESTful API Design & OpenAPI (Swagger) Specifications",
    "provider": "Digital India Developer Academy",
    "competency_ids": [
      "comp_python"
    ],
    "level": 2,
    "duration_hours": 10.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_cs_dev_002",
    "rating": 4.7,
    "description": "Designing clean, scalable RESTful APIs, HTTP status codes, pagination, rate limiting, and automated OpenAPI documentation.",
    "modules": [
      "1. REST Resource Modeling",
      "2. OpenAPI 3.0 Specs & Validation",
      "3. Rate Limiting & Error Standard"
    ],
    "target_audience": "Backend Software Engineers & Integration Leads",
    "prerequisites": [
      "Full Stack Web Development"
    ],
    "domainId": "domain_software"
  },
  {
    "id": "crs_cs_dev_003",
    "title": "Software Testing Automation, Unit Testing & Code Quality Standards",
    "provider": "C-DAC Software Quality Group",
    "competency_ids": [
      "comp_python"
    ],
    "level": 2,
    "duration_hours": 8.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_cs_dev_003",
    "rating": 4.8,
    "description": "Pytest frameworks, mock dependencies, coverage metrics, integration testing, and static analysis with Flake8 and Black.",
    "modules": [
      "1. Unit Testing with Pytest",
      "2. Fixtures & Mocking",
      "3. Code Coverage & Static Analysis"
    ],
    "target_audience": "Software Test Engineers & Backend Developers",
    "prerequisites": [
      "Python for Statistical Data Processing"
    ],
    "domainId": "domain_software"
  },
  {
    "id": "crs_cs_dev_004",
    "title": "Linux System Administration & Shell Scripting Automation",
    "provider": "National Knowledge Network (NKN) Training Division",
    "competency_ids": [
      "comp_python",
      "comp_digital_governance"
    ],
    "level": 2,
    "duration_hours": 14.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_cs_dev_004",
    "rating": 4.9,
    "description": "Bash shell scripting, cron automation, process management, user permissions, and system performance monitoring.",
    "modules": [
      "1. Linux Command Line Mastery",
      "2. Advanced Bash Scripting",
      "3. Systemd Services & Automation"
    ],
    "target_audience": "System Administrators & DevOps Engineers",
    "prerequisites": [
      "Basic Computer Literacy"
    ],
    "domainId": "domain_software"
  },
  {
    "id": "crs_cs_dev_005",
    "title": "Git Version Control & Enterprise Branching Workflows",
    "provider": "Digital India Academy",
    "competency_ids": [
      "comp_python"
    ],
    "level": 1,
    "duration_hours": 6.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_cs_dev_005",
    "rating": 4.9,
    "description": "Git branching models (GitFlow, Feature Branching), merge conflict resolution, rebase operations, and GitHub Pull Request workflows.",
    "modules": [
      "1. Git Core Concepts & Commits",
      "2. Branching & Merging Strategies",
      "3. Pull Request Review Workflows"
    ],
    "target_audience": "All Software Engineers & Data Analysts",
    "prerequisites": [
      "None"
    ],
    "domainId": "domain_software"
  },
  {
    "id": "crs_cs_dev_006",
    "title": "Web Accessibility (WCAG 2.1) & GIGW Standards for Public Portals",
    "provider": "STQC & NIC Accessibility Cell",
    "competency_ids": [
      "comp_data_visualization",
      "comp_digital_governance"
    ],
    "level": 2,
    "duration_hours": 8.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_cs_dev_006",
    "rating": 4.7,
    "description": "Guidelines for Indian Government Websites (GIGW 3.0), screen reader compatibility (ARIA attributes), color contrast, and keyboard navigation.",
    "modules": [
      "1. GIGW 3.0 & WCAG Principles",
      "2. ARIA Accessibility markup",
      "3. Automated Accessibility Auditing"
    ],
    "target_audience": "UI/UX Designers & Frontend Developers",
    "prerequisites": [
      "None"
    ],
    "domainId": "domain_software"
  },
  {
    "id": "crs_cs_dev_007",
    "title": "Cloud Infrastructure on MeghRaj & NIC National Cloud",
    "provider": "NIC Cloud Services Wing",
    "competency_ids": [
      "comp_digital_governance"
    ],
    "level": 3,
    "duration_hours": 12.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_cs_dev_007",
    "rating": 4.8,
    "description": "Deploying web applications on Government MeghRaj cloud, virtual machine provisioning, object storage configuration, and load balancing.",
    "modules": [
      "1. MeghRaj Architecture & Services",
      "2. VM & Virtual Network Provisioning",
      "3. Load Balancing & Auto-scaling"
    ],
    "target_audience": "System Administrators & Cloud Operators",
    "prerequisites": [
      "Linux System Administration"
    ],
    "domainId": "domain_software"
  },
  {
    "id": "crs_cs_dev_008",
    "title": "Data Warehousing & ETL Pipeline Engineering with Apache Airflow",
    "provider": "Data Analytics Wing, MoSPI",
    "competency_ids": [
      "comp_python",
      "comp_data_quality"
    ],
    "level": 3,
    "duration_hours": 18.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_cs_dev_008",
    "rating": 4.9,
    "description": "Orchestrating complex statistical data pipelines, DAG construction in Airflow, data validation checks, and data lake integration.",
    "modules": [
      "1. Data Warehouse Star & Snowflake Schema",
      "2. Apache Airflow DAG Authoring",
      "3. ETL Data Validation & Recovery"
    ],
    "target_audience": "Data Engineers & Statistical Pipeline Developers",
    "prerequisites": [
      "Python for Statistical Data Processing"
    ],
    "domainId": "domain_software"
  },
  {
    "id": "crs_cs_ai_003",
    "title": "Deep Learning with PyTorch for Statistical Pattern Recognition",
    "provider": "C-DAC & Digital India",
    "competency_ids": [
      "comp_machine_learning"
    ],
    "level": 4,
    "duration_hours": 20.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_cs_ai_003",
    "rating": 4.8,
    "description": "Neural network architectures (CNNs, RNNs, Transformers) using PyTorch, backpropagation, hyperparameter tuning, and model evaluation.",
    "modules": [
      "1. PyTorch Tensors & Autograd",
      "2. Deep Neural Networks",
      "3. Model Evaluation & Transfer Learning"
    ],
    "target_audience": "Senior AI Researchers & Data Scientists",
    "prerequisites": [
      "Machine Learning Fundamentals"
    ],
    "domainId": "domain_ai"
  },
  {
    "id": "crs_cs_ds_002",
    "title": "Business Intelligence Dashboards with PowerBI & Open Analytics",
    "provider": "National Institute of Smart Government (NISG)",
    "competency_ids": [
      "comp_data_visualization"
    ],
    "level": 2,
    "duration_hours": 10.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_cs_ds_002",
    "rating": 4.7,
    "description": "Connecting to statistical databases, DAX modeling, building executive dashboards, and automated report publishing for leadership.",
    "modules": [
      "1. PowerBI Data Ingestion",
      "2. DAX Expressions & Relationships",
      "3. Dashboard Interactivity & Design"
    ],
    "target_audience": "Data Analysts & Reporting Officers",
    "prerequisites": [
      "Basic Data Visualization"
    ],
    "domainId": "domain_datascience"
  },
  {
    "id": "crs_cs_ai_004",
    "title": "MLOps: Machine Learning Model Deployment & Drift Monitoring",
    "provider": "Digital India AI Wing",
    "competency_ids": [
      "comp_machine_learning",
      "comp_python"
    ],
    "level": 3,
    "duration_hours": 15.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_cs_ai_004",
    "rating": 4.8,
    "description": "MLflow experiment tracking, Model Registry management, automated retraining pipelines, data drift detection, and REST model serving.",
    "modules": [
      "1. MLflow Tracking & Registry",
      "2. Model Containerization & API Serving",
      "3. Data Drift & Retraining Automation"
    ],
    "target_audience": "MLOps Engineers & Senior AI Developers",
    "prerequisites": [
      "Generative AI & LLM Architecture"
    ],
    "domainId": "domain_ai"
  },
  {
    "id": "crs_cs_ds_003",
    "title": "Spatial Statistics & Spatial Econometrics with R",
    "provider": "NSSTA & Indian Statistical Institute (ISI) Kolkata",
    "competency_ids": [
      "comp_gis",
      "comp_statistics"
    ],
    "level": 3,
    "duration_hours": 12.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_cs_ds_003",
    "rating": 4.9,
    "description": "Spatial autocorrelation (Moran's I), spatial autoregressive models (SAR/SEM), kriging interpolation, and R spatstat package workflows.",
    "modules": [
      "1. Spatial Autocorrelation & Moran's I",
      "2. Spatial Regression Models",
      "3. Kriging & Hotspot Analysis"
    ],
    "target_audience": "Spatial Analysts & Senior Statisticians",
    "prerequisites": [
      "Geospatial Data Integration"
    ],
    "domainId": "domain_datascience"
  },
  {
    "id": "crs_cs_ai_005",
    "title": "AI Ethics, Algorithmic Bias Detection & Explainable AI (XAI)",
    "provider": "NITI Aayog AI Taskforce & MeitY",
    "competency_ids": [
      "comp_machine_learning",
      "comp_digital_governance"
    ],
    "level": 3,
    "duration_hours": 8.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_cs_ai_005",
    "rating": 4.9,
    "description": "SHAP and LIME model explainability, algorithmic fairness auditing, mitigating demographic bias in automated scoring, and ethical AI guidelines.",
    "modules": [
      "1. SHAP & LIME Feature Attribution",
      "2. Fairness Metrics & Bias Auditing",
      "3. Responsible AI Governance"
    ],
    "target_audience": "AI Ethicists, Data Scientists & Policy Directors",
    "prerequisites": [
      "Machine Learning Fundamentals"
    ],
    "domainId": "domain_ai"
  },
  {
    "id": "crs_stat_004",
    "title": "Small Area Estimation (SAE) Methods for District-Level Indicators",
    "provider": "NSSTA & Indian Statistical Institute (ISI)",
    "competency_ids": [
      "comp_statistics",
      "comp_survey_methodology"
    ],
    "level": 4,
    "duration_hours": 14.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_stat_004",
    "rating": 4.9,
    "description": "Fay-Herriot area-level models, nested error regression, combining survey micro-data with census indicators for disaggregated estimates.",
    "modules": [
      "1. Direct vs Indirect Estimators",
      "2. Fay-Herriot SAE Modeling",
      "3. MSE Estimation & Validation"
    ],
    "target_audience": "Senior Statistical Officers & Survey Methodologists",
    "prerequisites": [
      "Foundations of Official Statistics"
    ],
    "domainId": "domain_statistics"
  },
  {
    "id": "crs_surv_003",
    "title": "Administrative Data Integration & Micro-data Linking Standards",
    "provider": "Coordination & Data Dissemination Division, MoSPI",
    "competency_ids": [
      "comp_survey_methodology",
      "comp_data_quality"
    ],
    "level": 3,
    "duration_hours": 10.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_surv_003",
    "rating": 4.7,
    "description": "Deterministic and probabilistic record linkage, entity resolution across administrative datasets, preserving confidentiality in micro-data releases.",
    "modules": [
      "1. Record Linkage Algorithms",
      "2. Entity Resolution & Fellegi-Sunter Model",
      "3. Disclosure Control"
    ],
    "target_audience": "Statistical Officers & Data Governance Teams",
    "prerequisites": [
      "National Sample Survey Design"
    ],
    "domainId": "domain_statistics"
  },
  {
    "id": "crs_qual_003",
    "title": "Data Governance, NDSAP Standards & Data Cataloging",
    "provider": "National Data Sharing & Accessibility Policy (NDSAP) Cell / NIC",
    "competency_ids": [
      "comp_data_quality",
      "comp_digital_governance"
    ],
    "level": 2,
    "duration_hours": 7.0,
    "source": "iGOT Karmayogi (Verified Catalog)",
    "external_url": "https://igotkarmayogi.gov.in/course/crs_qual_003",
    "rating": 4.8,
    "description": "Publishing open data on data.gov.in, DCAT-AP metadata tagging, open government data licenses, and data lineage documentation.",
    "modules": [
      "1. NDSAP Principles & Guidelines",
      "2. DCAT Metadata Standards",
      "3. Publishing Open Datasets"
    ],
    "target_audience": "Data Stewards & Nodal Officers",
    "prerequisites": [
      "None"
    ],
    "domainId": "domain_quality_gis"
  }
];

export function getCoursesByDomain(domainId: string): DomainCourse[] {
  return DOMAIN_COURSES.filter((c) => c.domainId === domainId);
}
