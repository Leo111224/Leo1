#!/usr/bin/env python3
import json
import math
import sys
from pathlib import Path

REQUIRED = {"run_id", "algorithm_version", "dataset_version", "results"}

def validate(bundle: dict) -> list[str]:
    errors = [f"missing: {field}" for field in sorted(REQUIRED - set(bundle))]
    if not isinstance(bundle.get("results", []), list):
        errors.append("results must be a list")
        return errors
    for index, result in enumerate(bundle.get("results", [])):
        if not result.get("metric"):
            errors.append(f"results[{index}] missing metric")
        for field in ("estimate", "p_value"):
            value = result.get(field)
            if isinstance(value, (int, float)) and not math.isfinite(value):
                errors.append(f"results[{index}].{field} is not finite")
        p_value = result.get("p_value")
        if isinstance(p_value, (int, float)) and not 0 <= p_value <= 1:
            errors.append(f"results[{index}].p_value outside [0,1]")
    return errors

if __name__ == "__main__":
    bundle = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    errors = validate(bundle)
    print(json.dumps({"valid": not errors, "errors": errors}, ensure_ascii=False))
    raise SystemExit(1 if errors else 0)
