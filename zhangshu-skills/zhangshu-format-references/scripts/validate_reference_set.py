#!/usr/bin/env python3
import json
import sys
from pathlib import Path

REQUIRED = {"title", "authors", "year"}

def validate(records: list[dict]) -> list[str]:
    errors, seen = [], set()
    for index, record in enumerate(records):
        for field in REQUIRED:
            if not record.get(field):
                errors.append(f"record[{index}] missing {field}")
        marker = (record.get("doi") or record.get("pmid") or record.get("title", "")).strip().lower()
        if marker in seen:
            errors.append(f"record[{index}] duplicate identifier/title")
        seen.add(marker)
    return errors

if __name__ == "__main__":
    records = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    errors = validate(records)
    print(json.dumps({"valid": not errors, "errors": errors}, ensure_ascii=False))
    raise SystemExit(1 if errors else 0)
