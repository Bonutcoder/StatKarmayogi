"""
Integration tests for Person 2 FastAPI Endpoints.
Verifies OpenAPI routes, request validation, and status codes.
"""

import unittest
from starlette.testclient import TestClient
from backengine.main import app


class TestAPIEndpoints(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health_check(self):
        """Verify GET /health returns 200 and healthy status."""
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["deterministic_engine"], "online")

    def test_competency_framework_endpoint(self):
        """Verify GET /api/v1/competencies/framework returns canonical MoSPI competencies."""
        response = self.client.get("/api/v1/competencies/framework")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreater(len(data), 0)
        comp_ids = [c["id"] for c in data]
        self.assertIn("comp_statistics", comp_ids)
        self.assertIn("comp_survey_methodology", comp_ids)

    def test_analyze_skill_gaps_endpoint(self):
        """Verify POST /api/v1/competencies/analyze executes deterministic analysis."""
        payload = {
            "employee_id": "emp_officer_42",
            "role_id": "role_statistical_officer",
            "requirements": [
                {
                    "competency_id": "comp_statistics",
                    "competency_name": "Statistics",
                    "required_level": 4,
                    "criticality": 1.5,
                }
            ],
            "current_competencies": [
                {
                    "competency_id": "comp_statistics",
                    "competency_name": "Statistics",
                    "current_level": 2,
                    "evidence_count": 1,
                }
            ],
        }
        response = self.client.post("/api/v1/competencies/analyze", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["employee_id"], "emp_officer_42")
        self.assertEqual(data["total_gaps"], 1)
        self.assertEqual(data["gaps"][0]["gap"], 2)

    def test_igot_courses_endpoint(self):
        """Verify GET /api/v1/integrations/igot/courses returns courses."""
        response = self.client.get("/api/v1/integrations/igot/courses?limit=5")
        self.assertEqual(response.status_code, 200)
        courses = response.json()
        self.assertLessEqual(len(courses), 5)
        self.assertGreater(len(courses), 0)

    def test_rag_index_and_query_endpoints(self):
        """Verify document indexing and RAG querying via API."""
        doc_id = "doc_api_test"
        index_payload = {
            "department_id": "dept_test",
            "document_id": doc_id,
            "pages": [
                {
                    "page_number": 1,
                    "text": "Official sample survey design principles for data collection officers.",
                }
            ],
        }
        idx_res = self.client.post(f"/api/v1/rag/index/{doc_id}", json=index_payload)
        self.assertEqual(idx_res.status_code, 200)
        self.assertEqual(idx_res.json()["status"], "success")

        query_payload = {
            "department_id": "dept_test",
            "query": "sample survey design",
            "top_k": 2,
            "min_similarity": 0.1,
        }
        query_res = self.client.post("/api/v1/rag/query", json=query_payload)
        self.assertEqual(query_res.status_code, 200)
        results = query_res.json()
        self.assertGreater(len(results), 0)
        self.assertEqual(results[0]["document_id"], doc_id)

    def test_assessment_generation_and_scoring_flow(self):
        """Verify end-to-end assessment generation, answer submission, and scoring via API."""
        gen_payload = {
            "employee_id": "emp_learner_88",
            "department_id": "dept_test",
            "competency_id": "comp_statistics",
            "competency_name": "Statistics",
            "difficulty": 2,
            "question_count": 2,
        }
        gen_res = self.client.post("/api/v1/assessments/generate", json=gen_payload)
        self.assertEqual(gen_res.status_code, 200)
        session = gen_res.json()
        asmt_id = session["assessment_id"]
        questions = session["questions"]
        self.assertEqual(len(questions), 2)

        # Invariant: Verify client questions do NOT leak correct_option or explanation
        for q in questions:
            self.assertNotIn("correct_option", q)
            self.assertNotIn("explanation", q)

        # Submit answers
        answers_payload = {
            "assessment_id": asmt_id,
            "employee_id": "emp_learner_88",
            "competency_id": "comp_statistics",
            "answers": [
                {"question_id": questions[0]["id"], "selected_option": "A"},
                {"question_id": questions[1]["id"], "selected_option": "A"},
            ],
        }
        score_res = self.client.post("/api/v1/assessments/score", json=answers_payload)
        self.assertEqual(score_res.status_code, 200)
        result = score_res.json()
        self.assertEqual(result["assessment_id"], asmt_id)
        self.assertIn("mastery_tier", result)
        self.assertIn("score_percentage", result)
        self.assertIn("competency_level_recommended", result)


if __name__ == "__main__":
    unittest.main()
