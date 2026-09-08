"""
Security validation, prompt sanitization, and injection defense primitives.
Implements the security constraints defined in SECURITY.md (Sections 10, 13, 14, 15).
"""

import re
from typing import List, Dict, Any


# Common patterns indicative of prompt injection attempts in untrusted documents
INJECTION_PATTERNS = [
    r"ignore\s+(all\s+)?(previous|prior)\s+instructions",
    r"disregard\s+(all\s+)?(previous|prior)\s+instructions",
    r"system\s*prompt\s*:",
    r"you\s+are\s+now\s+(an\s+unrestricted|a\s+different|in\s+developer\s+mode)",
    r"reveal\s+(the\s+)?(secret|api[_\s]key|token|password)",
    r"give\s+(full|100%|maximum)\s+(marks|score|points)",
    r"always\s+(choose|pick|answer)\s+option",
    r"override\s+system",
    r"<script\b[^>]*>",
]

COMPILED_INJECTION_REGEX = re.compile(
    "|".join(f"({p})" for p in INJECTION_PATTERNS), re.IGNORECASE
)


def sanitize_text(text: str) -> str:
    """
    Sanitizes raw text extracted from untrusted documents:
    - Strips non-printable/control characters (except newline, tab, carriage return).
    - Normalizes excessive whitespace.
    """
    if not text:
        return ""
    # Remove control characters except standard whitespace
    cleaned = "".join(ch for ch in text if ch.isprintable() or ch in "\n\t\r")
    # Normalize multiple spaces
    cleaned = re.sub(r"[ \t]+", " ", cleaned)
    return cleaned.strip()


def detect_prompt_injection(text: str) -> bool:
    """
    Checks if a text segment contains prompt injection indicators.
    Returns True if suspicious instructions are detected.
    """
    if not text:
        return False
    return bool(COMPILED_INJECTION_REGEX.search(text))


def neutralize_prompt_injection(text: str) -> str:
    """
    Neutralizes detected instruction-override patterns within untrusted text
    by prefixing/tagging them as data, preventing LLM instruction confusion.
    """
    if not text:
        return ""
    return COMPILED_INJECTION_REGEX.sub("[FILTERED_POTENTIAL_INJECTION]", text)


def build_delimited_context(chunks: List[Dict[str, Any]]) -> str:
    """
    Wraps retrieved document chunks into strictly delimited XML tags.
    Treats retrieved text strictly as data, never as instructions.
    Preserves document_id and page numbers.
    """
    context_blocks = []
    for idx, chunk in enumerate(chunks, 1):
        doc_id = chunk.get("document_id", "unknown_doc")
        page_start = chunk.get("page_start", "?")
        page_end = chunk.get("page_end", page_start)
        section = chunk.get("section", "General")
        raw_text = chunk.get("chunk_text", "")

        # Clean and neutralize prompt injections
        clean_text = sanitize_text(raw_text)
        safe_text = neutralize_prompt_injection(clean_text)

        block = (
            f'<source_chunk index="{idx}" document_id="{doc_id}" '
            f'page_start="{page_start}" page_end="{page_end}" section="{section}">\n'
            f"{safe_text}\n"
            f"</source_chunk>"
        )
        context_blocks.append(block)

    return "\n\n".join(context_blocks)


def redact_sensitive_strings(text: str) -> str:
    """Redacts potential API keys or tokens from log or output messages."""
    if not text:
        return ""
    # Redact common token patterns (sk-..., bearer, etc.)
    text = re.sub(r"sk-[a-zA-Z0-9_\-]{20,}", "sk-[REDACTED]", text)
    text = re.sub(r"(Bearer\s+)[a-zA-Z0-9_\-\.]{20,}", r"\1[REDACTED]", text, flags=re.IGNORECASE)
    return text
