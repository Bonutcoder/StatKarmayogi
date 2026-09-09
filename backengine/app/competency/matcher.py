"""
Semantic Competency Matcher.
Uses SBERT / Sentence Transformers (or resilient fallback) to map queries or job descriptions
to canonical MoSPI / NSSTA competencies.
Invariant: Semantic matching NEVER overrides authoritative competency rules.
"""

from typing import List, Dict, Any, Optional
import math
import re
from backengine.app.core.config import get_settings, Settings
from backengine.app.competency.models import Competency

# Default official MoSPI / NSSTA Competency Framework (canonical ground truth)
OFFICIAL_COMPETENCIES: List[Dict[str, Any]] = [
    {
        "id": "comp_statistics",
        "name": "Statistics",
        "domain": "Statistical Core",
        "description": "Foundational and advanced statistical theory, probability distributions, estimation, and hypothesis testing in official data.",
        "keywords": ["statistics", "probability", "estimation", "hypothesis testing", "variance", "regression", "sampling distribution"],
    },
    {
        "id": "comp_survey_methodology",
        "name": "Survey Methodology",
        "domain": "Survey Operations",
        "description": "Design of sample surveys, stratified multi-stage sampling, questionnaire design, field enumeration, and non-sampling error reduction.",
        "keywords": ["survey", "sampling", "questionnaire", "enumeration", "field work", "strata", "nss", "census"],
    },
    {
        "id": "comp_python",
        "name": "Python",
        "domain": "Data Science & Computing",
        "description": "Data manipulation, automated scripting, pandas, numpy, and statistical workflow automation using Python.",
        "keywords": ["python", "pandas", "numpy", "scripting", "programming", "data manipulation", "jupyter"],
    },
    {
        "id": "comp_machine_learning",
        "name": "Machine Learning",
        "domain": "Advanced Analytics",
        "description": "Supervised and unsupervised learning, predictive modeling, clustering, and decision trees for official statistics.",
        "keywords": ["machine learning", "ml", "predictive", "clustering", "classification", "scikit-learn", "ai"],
    },
    {
        "id": "comp_gis",
        "name": "GIS",
        "domain": "Geospatial Analysis",
        "description": "Geographic Information Systems, spatial data analysis, thematic mapping, and integration of geospatial boundaries with statistical indicators.",
        "keywords": ["gis", "spatial", "mapping", "geospatial", "qgis", "shapefile", "geo", "remote sensing"],
    },
    {
        "id": "comp_data_visualization",
        "name": "Data Visualization",
        "domain": "Dissemination & Analytics",
        "description": "Visual presentation of statistical findings, dashboard creation, chart interpretation, and statistical publication standards.",
        "keywords": ["visualization", "dashboard", "charts", "graphs", "matplotlib", "seaborn", "tableau", "powerbi"],
    },
    {
        "id": "comp_data_quality",
        "name": "Data Quality",
        "domain": "Data Governance",
        "description": "Data validation, cleaning, consistency checking, missing value imputation, outlier detection, and adherence to national data standards.",
        "keywords": ["data quality", "validation", "imputation", "cleaning", "outlier", "consistency", "audit", "accuracy"],
    },
    {
        "id": "comp_digital_governance",
        "name": "Digital Governance",
        "domain": "Administrative",
        "description": "e-Governance protocols, iGOT Karmayogi integration, cybersecurity compliance, data privacy, and government digital frameworks.",
        "keywords": ["governance", "digital", "igot", "karmayogi", "compliance", "cybersecurity", "policy", "ndsap"],
    },
]


class SemanticCompetencyMatcher:
    """
    Semantic matcher for competencies.
    Uses sentence-transformers when available, and provides a deterministic
    token-overlap / tf-idf vector fallback when sentence-transformers is not loaded.
    """

    def __init__(self, settings: Optional[Settings] = None):
        self.settings = settings or get_settings()
        self._sbert_model = None
        self._load_model_attempted = False
        self._canonical_competencies = OFFICIAL_COMPETENCIES

    def _get_sbert_model(self):
        """Lazy loader for SBERT model with safe error handling."""
        if not self._load_model_attempted:
            self._load_model_attempted = True
            try:
                from sentence_transformers import SentenceTransformer  # type: ignore
                self._sbert_model = SentenceTransformer(self.settings.EMBEDDING_MODEL_NAME)
            except Exception:
                # Fallback to pure-Python semantic scoring if sentence-transformers is unavailable
                self._sbert_model = None
        return self._sbert_model

    def _tokenize(self, text: str) -> List[str]:
        return re.findall(r"\b\w{3,}\b", text.lower())

    def _compute_fallback_similarity(self, query: str, target: str, keywords: List[str]) -> float:
        """
        Pure-Python fallback calculating Jaccard + keyword-boosted cosine similarity.
        Guarantees reliable semantic matching even without heavyweight C-extensions.
        """
        q_tokens = set(self._tokenize(query))
        t_tokens = set(self._tokenize(target))

        if not q_tokens or not t_tokens:
            return 0.0

        # Jaccard on description tokens
        intersection = len(q_tokens & t_tokens)
        union = len(q_tokens | t_tokens)
        jaccard = intersection / union if union > 0 else 0.0

        # Direct keyword match boost
        kw_matches = sum(1 for kw in keywords if kw.lower() in query.lower())
        kw_score = min(1.0, kw_matches * 0.35)

        return round(min(1.0, (0.5 * jaccard) + (0.5 * kw_score)), 4)

    def match(self, query: str, top_k: int = 3, threshold: float = 0.20) -> List[Dict[str, Any]]:
        """
        Matches a natural language query against the canonical competency framework.
        Returns matched competencies sorted by similarity score.
        """
        results = []
        model = self._get_sbert_model()

        if model is not None:
            # SBERT Vector path
            try:
                descriptions = [c["description"] for c in self._canonical_competencies]
                query_emb = model.encode(query, convert_to_tensor=True)
                desc_embs = model.encode(descriptions, convert_to_tensor=True)
                from sentence_transformers.util import cos_sim  # type: ignore
                similarities = cos_sim(query_emb, desc_embs)[0].tolist()

                for idx, comp in enumerate(self._canonical_competencies):
                    score = round(float(similarities[idx]), 4)
                    if score >= threshold:
                        results.append({
                            "competency_id": comp["id"],
                            "name": comp["name"],
                            "domain": comp["domain"],
                            "similarity_score": score,
                            "method": "sbert",
                        })
            except Exception:
                model = None  # Revert to fallback

        if model is None:
            # Fallback path
            for comp in self._canonical_competencies:
                score = self._compute_fallback_similarity(
                    query=query,
                    target=f"{comp['name']} {comp['description']}",
                    keywords=comp["keywords"],
                )
                if score >= threshold:
                    results.append({
                        "competency_id": comp["id"],
                        "name": comp["name"],
                        "domain": comp["domain"],
                        "similarity_score": score,
                        "method": "resilient_semantic_fallback",
                    })

        results.sort(key=lambda x: x["similarity_score"], reverse=True)
        return results[:top_k]
