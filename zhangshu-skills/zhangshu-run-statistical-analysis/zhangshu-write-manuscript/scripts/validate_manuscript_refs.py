#!/usr/bin/env python3
import json
import sys
from pathlib import Path

def validate(document: dict) -> list[str]:
    errors = []
    for index, claim in enumerate(document.get("numeric_claims", [])):
        if not claim.get("result_ref"):
            errors.append(f"numeric_claims[{index}] has no result_ref")
    for index, claim in enumerate(document.get("evidence_claims", [])):
        if not claim.get("evidence_id"):
            errors.append(f"evidence_claims[{index}] has no evidence_id")
    return errors

if __name__ == "__main__":
    document = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    errors = validate(document)
    print(json.dumps({"valid": not errors, "errors": errors}, ensure_ascii=False))
    raise SystemExit(1 if errors else 0)
