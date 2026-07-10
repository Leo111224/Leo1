#!/usr/bin/env python3
import json
import sys
from pathlib import Path

REQUIRED = {"id", "type", "version", "status", "project_id", "source_task", "lineage"}

def validate(path: str) -> list[str]:
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    missing = sorted(REQUIRED - set(data))
    errors = [f"missing field: {field}" for field in missing]
    if not isinstance(data.get("lineage", []), list):
        errors.append("lineage must be a list")
    return errors

if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("usage: validate_manifest.py <manifest.json>")
    issues = validate(sys.argv[1])
    print(json.dumps({"valid": not issues, "errors": issues}, ensure_ascii=False))
    raise SystemExit(1 if issues else 0)
