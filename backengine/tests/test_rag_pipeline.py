"""
Tests for RAG pipeline: PDF Extraction, Chunk Metadata, and Vector Store Department Isolation.
"""

import unittest
from backengine.app.rag.extractor import PDFExtractor, ExtractedPage
from backengine.app.rag.chunker import DocumentChunker
from backengine.app.rag.vector_store import VectorStore


class TestRAGPipeline(unittest.TestCase):
    def setUp(self):
        self.extractor = PDFExtractor()
        self.chunker = DocumentChunker(chunk_size=100, chunk_overlap=20)
        self.vector_store = VectorStore()

    def test_magic_byte_validation(self):
        """Verify non-PDF bytes are rejected per SECURITY.md Section 10."""
        valid_header = b"%PDF-1.4 test stream content"
        invalid_header = b"PK\x03\x04 malicious zip content disguised as pdf"

        self.assertTrue(self.extractor.validate_pdf_bytes(valid_header))
        self.assertFalse(self.extractor.validate_pdf_bytes(invalid_header))

        with self.assertRaises(ValueError):
            self.extractor.extract_from_bytes(invalid_header, "doc_malicious")

    def test_chunk_metadata_retention(self):
        """Verify chunker preserves document_id, page numbers, and section."""
        pages = [
            ExtractedPage(
                page_number=1,
                text="Section 1.1 Overview\nOfficial statistical methodology mandates rigorous sampling standards.",
                character_count=87,
            ),
            ExtractedPage(
                page_number=2,
                text="Section 1.2 Stratification\nStrata should be formed to ensure homogeneity within each stratum.",
                character_count=90,
            ),
        ]

        chunks = self.chunker.chunk_pages("doc_mospi_handbook", pages)
        self.assertGreater(len(chunks), 0)

        chunk1 = chunks[0]
        self.assertEqual(chunk1.document_id, "doc_mospi_handbook")
        self.assertEqual(chunk1.page_start, 1)
        self.assertEqual(chunk1.page_end, 1)
        self.assertIn("Overview", chunk1.section)

    def test_department_isolation(self):
        """Verify strict department boundary enforcement: Dept A cannot query Dept B's chunks."""
        pages = [
            ExtractedPage(
                page_number=1,
                text="Confidential National Sample Survey data protocols for Field Operations Division.",
                character_count=82,
            )
        ]
        chunks = self.chunker.chunk_pages("doc_dept_a", pages)

        # Index into Dept A
        self.vector_store.add_chunks(department_id="dept_field_ops", chunks=chunks)

        # Query from Dept A -> Found
        results_dept_a = self.vector_store.search(
            department_id="dept_field_ops",
            query="Sample Survey protocols",
            min_similarity=0.1,
        )
        self.assertGreater(len(results_dept_a), 0)

        # Query from Dept B -> Zero results (Tenant Isolation Invariant)
        results_dept_b = self.vector_store.search(
            department_id="dept_finance",
            query="Sample Survey protocols",
            min_similarity=0.1,
        )
        self.assertEqual(len(results_dept_b), 0)


if __name__ == "__main__":
    unittest.main()
