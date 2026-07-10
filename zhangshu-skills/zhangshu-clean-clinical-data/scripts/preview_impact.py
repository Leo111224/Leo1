#!/usr/bin/env python3
import csv
import json
import sys
from pathlib import Path

def profile_csv(path: str) -> dict:
    with Path(path).open(encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))
    fields = list(rows[0]) if rows else []
    missing = {field: sum(not str(row.get(field, "")).strip() for row in rows) for field in fields}
    return {"rows": len(rows), "fields": fields, "missing": missing}

if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("usage: preview_impact.py <dataset.csv>")
    print(json.dumps(profile_csv(sys.argv[1]), ensure_ascii=False, indent=2))
