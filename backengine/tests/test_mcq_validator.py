"""
Tests for MCQ Contract Validation.
Validates the rules defined in PERSON_2.md Section MCQ Contract:
- exactly four options
- exactly one correct answer
- no duplicates
- non-empty explanation
- source metadata where available
"""

import unittest
from backengine.app.assessment.validator import MCQValidator


class TestMCQValidator(unittest.TestCase):

    def test_valid_question(self):
        """Verify compliant question passes validation."""
        data = {
            "question": "What is the primary purpose of stratification in survey design?",
            "option_a": "To decrease sampling variance by grouping similar units",
            "option_b": "To eliminate the need for field enumeration",
            "option_c": "To convert continuous variables to arbitrary discrete scales",
            "option_d": "To avoid documentation of non-sampling errors",
            "correct_option": "A",
            "explanation": "Stratification groups homogeneous elements, reducing variance across sample estimates.",
            "source_document": "doc_sampling_guide",
            "source_page": 14,
        }

        result = MCQValidator.validate_raw_dict(data)
        self.assertTrue(result.is_valid)
        self.assertEqual(len(result.errors), 0)
        self.assertIsNotNone(result.question)
        self.assertEqual(result.question.correct_option, "A")

    def test_duplicate_options_rejected(self):
        """Verify duplicate choices are detected and rejected."""
        data = {
            "question": "Which of the following is a probability sampling method?",
            "option_a": "Simple Random Sampling",
            "option_b": "Simple Random Sampling",  # Duplicate
            "option_c": "Convenience Sampling",
            "option_d": "Purposive Sampling",
            "correct_option": "A",
            "explanation": "Simple Random Sampling is a probability sampling method.",
            "source_document": "doc_sampling_guide",
            "source_page": 10,
        }

        result = MCQValidator.validate_raw_dict(data)
        self.assertFalse(result.is_valid)
        self.assertTrue(any("duplicate" in err.lower() for err in result.errors))

    def test_invalid_correct_option(self):
        """Verify invalid answer key (not A, B, C, or D) is rejected."""
        data = {
            "question": "What constitutes a valid administrative boundary shapefile in GIS?",
            "option_a": "Format with .shp, .shx, and .dbf files",
            "option_b": "Unformatted CSV file",
            "option_c": "Raster image without georeferencing",
            "option_d": "Raw text transcript",
            "correct_option": "E",  # Invalid
            "explanation": "Shapefiles require corresponding component files.",
            "source_document": "doc_gis_standards",
            "source_page": 5,
        }

        result = MCQValidator.validate_raw_dict(data)
        self.assertFalse(result.is_valid)
        self.assertTrue(any("invalid" in err.lower() for err in result.errors))

    def test_missing_explanation_or_citations(self):
        """Verify questions missing explanation or page citations are rejected."""
        data = {
            "question": "What is the primary indicator of data quality in official statistics?",
            "option_a": "High accuracy and low non-sampling error",
            "option_b": "Informal speed of release",
            "option_c": "Number of pages in the publication",
            "option_d": "Exclusion of rural households",
            "correct_option": "A",
            "explanation": "",  # Empty explanation
            "source_document": "",  # Missing doc
            "source_page": 0,       # Invalid page
        }

        result = MCQValidator.validate_raw_dict(data)
        self.assertFalse(result.is_valid)
        self.assertGreater(len(result.errors), 1)


if __name__ == "__main__":
    unittest.main()
