#!/usr/bin/env python3
"""Validate the minimum traceability contract of an Evidence Set."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

REQUIRED = ("evidence_id", "record_id", "title", "year", "design", "population",
            "findings", "limitations", "source_locations")


def validate(records: list[dict[str, Any]]) -> dict[str, Any]:
    errors: list[dict[str, Any]] = []
    warnings: list[dict[str, Any]] = []
    seen: set[str] = set()
    for index, record in enumerate(records):
        rid = str(record.get("evidence_id") or f"row:{index}")
        if rid in seen:
            errors.append({"record": rid, "field": "evidence_id", "message": "duplicate"})
        seen.add(rid)
        for field in REQUIRED:
            if record.get(field) in (None, "", [], {}):
                errors.append({"record": rid, "field": field, "message": "required"})
        if not record.get("doi") and not record.get("pmid"):
            warnings.append({"record": rid, "field": "identifier", "message": "DOI and PMID both missing"})
        if record.get("abstract_only"):
            warnings.append({"record": rid, "field": "abstract_only", "message": "do not infer full-text details"})
        if record.get("effect_estimate") and not record.get("source_locations"):
            errors.append({"record": rid, "field": "source_locations", "message": "required for effect estimate"})
    return {"valid": not errors, "record_count": len(records), "errors": errors, "warnings": warnings}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    try:
        payload = json.loads(args.input.read_text(encoding="utf-8"))
        records = payload.get("records") if isinstance(payload, dict) else payload
        if not isinstance(records, list) or not all(isinstance(x, dict) for x in records):
            raise ValueError("Input must be a JSON list or an object containing a records list")
        report = validate(records)
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        parser.error(str(exc))
    text = json.dumps(report, ensure_ascii=False, indent=2)
    if args.output:
        args.output.write_text(text + "\n", encoding="utf-8")
    else:
        print(text)
    return 0 if report["valid"] else 1


if __name__ == "__main__":
    raise SystemExit(main())

