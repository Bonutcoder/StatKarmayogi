"""
Document chunking engine preserving exact metadata:
document_id, page_start, page_end, section, chunk_text.
Complies with PERSON_2.md Section RAG Pipeline.
"""

from typing import List, Optional
import re
from pydantic import BaseModel, Field
from backengine.app.rag.extractor import ExtractedPage


class DocumentChunk(BaseModel):
    """Normalized chunk of text with exact provenance metadata."""
    chunk_id: str
    document_id: str
    page_start: int
    page_end: int
    section: str = "General"
    chunk_text: str
    character_count: int


class DocumentChunker:
    """
    Splits extracted pages into overlapping chunks while preserving
    page boundaries and section headings.
    """

    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def _detect_section(self, text: str) -> str:
        """Heuristically extracts potential section titles (e.g., '1.2 Overview')."""
        match = re.search(r"^(?:(?:Chapter|Section|\d+\.[\d\.]*)\s+([^\n\r]+))", text, re.MULTILINE)
        if match:
            return match.group(0).strip()[:80]
        return "General"

    def chunk_pages(
        self, document_id: str, pages: List[ExtractedPage]
    ) -> List[DocumentChunk]:
        """
        Processes a list of extracted pages into chunks with page provenance.
        """
        chunks: List[DocumentChunk] = []
        chunk_counter = 1

        for page in pages:
            text = page.text.strip()
            if not text:
                continue

            section = self._detect_section(text)

            # If page text is within chunk size, store directly as single page chunk
            if len(text) <= self.chunk_size:
                chunks.append(
                    DocumentChunk(
                        chunk_id=f"{document_id}_p{page.page_number}_c{chunk_counter}",
                        document_id=document_id,
                        page_start=page.page_number,
                        page_end=page.page_number,
                        section=section,
                        chunk_text=text,
                        character_count=len(text),
                    )
                )
                chunk_counter += 1
                continue

            # Sliding window over page paragraphs / sentences
            start = 0
            while start < len(text):
                end = min(start + self.chunk_size, len(text))

                # Attempt to break on paragraph or sentence boundary if not at end
                if end < len(text):
                    last_period = text.rfind(". ", start, end)
                    last_newline = text.rfind("\n", start, end)
                    breakpoint = max(last_period, last_newline)
                    if breakpoint > start + (self.chunk_size // 2):
                        end = breakpoint + 1

                sub_text = text[start:end].strip()
                if sub_text:
                    chunks.append(
                        DocumentChunk(
                            chunk_id=f"{document_id}_p{page.page_number}_c{chunk_counter}",
                            document_id=document_id,
                            page_start=page.page_number,
                            page_end=page.page_number,
                            section=section,
                            chunk_text=sub_text,
                            character_count=len(sub_text),
                        )
                    )
                    chunk_counter += 1

                if end >= len(text):
                    break
                start = end - self.chunk_overlap

        return chunks
