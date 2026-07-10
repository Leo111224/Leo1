#!/usr/bin/env python3
"""Lightweight manuscript traceability validator.

Checks a markdown manuscript for unresolved traceability placeholders.
"""
import re
import sys
from pathlib import Path

if len(sys.argv) < 2:
    print("Usage: validate_manuscript_refs.py <manuscript.md>")
    sys.exit(2)

text = Path(sys.argv[1]).read_text(encoding="utf-8")
issues = []
for marker in ["NEEDS_EVIDENCE", "MISSING_RESULT_REF", "MISSING_USER_CONFIRMATION"]:
    count = len(re.findall(marker, text))
    if count:
        issues.append({"marker": marker, "count": count})

print({"status": "PASS" if not issues else "NEEDS_REVIEW", "issues": issues})
sys.exit(0)

