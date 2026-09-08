"""
Tests for iGOT Adapter Layer.
Verifies MockLearningProvider and IGOTLearningProvider fallback behavior.
"""

import unittest
import asyncio
from backengine.app.igot.mock_provider import MockLearningProvider
from backengine.app.igot.igot_provider import IGOTLearningProvider


class TestIGOTAdapter(unittest.TestCase):
    def setUp(self):
        self.mock_provider = MockLearningProvider()
        self.live_provider = IGOTLearningProvider()

    def test_mock_search_and_filter(self):
        """Verify mock catalogue search by competency and text query."""
        # Search by competency
        courses = asyncio.run(
            self.mock_provider.search_courses(competency_ids=["comp_python"], limit=5)
        )
        self.assertGreater(len(courses), 0)
        self.assertTrue(any("comp_python" in c.competency_ids for c in courses))

        # Search by keyword
        surv_courses = asyncio.run(
            self.mock_provider.search_courses(query="Sample Survey", limit=5)
        )
        self.assertGreater(len(surv_courses), 0)
        self.assertIn("NSS", surv_courses[0].title)

    def test_course_detail(self):
        """Verify course detail metadata retrieval."""
        detail = asyncio.run(self.mock_provider.get_course("crs_stat_001"))
        self.assertIsNotNone(detail)
        self.assertEqual(detail.id, "crs_stat_001")
        self.assertGreater(len(detail.modules), 0)

    def test_live_provider_fallback(self):
        """Verify that unconfigured live adapter safely falls back to mock catalog."""
        # Without valid token, live adapter falls back safely to mock
        courses = asyncio.run(self.live_provider.search_courses(limit=3))
        self.assertEqual(len(courses), 3)


if __name__ == "__main__":
    unittest.main()
