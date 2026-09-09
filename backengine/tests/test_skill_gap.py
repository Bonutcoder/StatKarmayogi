"""
Tests for Deterministic Skill Gap Engine.
Verifies that:
- Same inputs produce stable deterministic gap results
- Required Level - Current Level = Gap
- Gap is never negative
- Priority ranking is strictly reproducible
"""

import unittest
from backengine.app.competency.models import (
    RoleCompetencyRequirement,
    EmployeeCompetency,
)
from backengine.app.competency.gap_engine import SkillGapEngine


class TestSkillGapEngine(unittest.TestCase):
    def setUp(self):
        self.engine = SkillGapEngine()

    def test_basic_gap_calculation(self):
        """Verify: Required Level - Current Level = Gap."""
        self.assertEqual(self.engine.calculate_gap(required_level=4, current_level=2), 2)
        self.assertEqual(self.engine.calculate_gap(required_level=3, current_level=3), 0)
        # Never negative when current > required
        self.assertEqual(self.engine.calculate_gap(required_level=2, current_level=5), 0)

    def test_deterministic_reproducibility(self):
        """Verify that identical inputs produce identical scores every run."""
        reqs = [
            RoleCompetencyRequirement(competency_id="comp_statistics", competency_name="Statistics", required_level=4, criticality=1.5),
            RoleCompetencyRequirement(competency_id="comp_gis", competency_name="GIS", required_level=3, criticality=1.0),
        ]
        curr = [
            EmployeeCompetency(competency_id="comp_statistics", current_level=1, evidence_count=0),
            EmployeeCompetency(competency_id="comp_gis", current_level=3, evidence_count=2, assessment_score=85.0),
        ]

        res1 = self.engine.analyze("emp_001", "role_stat_officer", reqs, curr)
        res2 = self.engine.analyze("emp_001", "role_stat_officer", reqs, curr)

        self.assertEqual(res1.total_gaps, res2.total_gaps)
        self.assertEqual(res1.readiness_percentage, res2.readiness_percentage)
        self.assertEqual(len(res1.gaps), len(res2.gaps))

        # Statistics gap should be 3 and classified as HIGH priority
        stat_gap = next(g for g in res1.gaps if g.competency_id == "comp_statistics")
        self.assertEqual(stat_gap.gap, 3)
        self.assertEqual(stat_gap.priority_level, "HIGH")

        # GIS gap should be 0 and classified as MET
        gis_gap = next(g for g in res1.gaps if g.competency_id == "comp_gis")
        self.assertEqual(gis_gap.gap, 0)
        self.assertEqual(gis_gap.priority_level, "MET")

    def test_readiness_percentage(self):
        """Verify readiness formula: sum(demonstrated) / sum(required)."""
        reqs = [
            RoleCompetencyRequirement(competency_id="comp_python", required_level=4),
            RoleCompetencyRequirement(competency_id="comp_sql", required_level=4),
        ]
        curr = [
            EmployeeCompetency(competency_id="comp_python", current_level=2),
            EmployeeCompetency(competency_id="comp_sql", current_level=2),
        ]
        # Total required = 8, demonstrated = 4 -> 50.0%
        res = self.engine.analyze("emp_002", "role_analyst", reqs, curr)
        self.assertEqual(res.readiness_percentage, 50.0)


if __name__ == "__main__":
    unittest.main()
