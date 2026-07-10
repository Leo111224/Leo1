#!/usr/bin/env python3
import json
import sys
from pathlib import Path

REQUIRED = {"plot_type", "result_refs", "encodings", "width", "height", "export_formats"}

def validate(spec: dict) -> list[str]:
    errors = [f"missing: {field}" for field in sorted(REQUIRED - set(spec))]
    if not spec.get("result_refs"):
        errors.append("at least one verified result_ref is required")
    allowed = {"svg", "pdf", "png"}
    unknown = set(spec.get("export_formats", [])) - allowed
    if unknown:
        errors.append("unsupported export format: " + ", ".join(sorted(unknown)))
    return errors

if __name__ == "__main__":
    spec = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    errors = validate(spec)
    print(json.dumps({"valid": not errors, "errors": errors}, ensure_ascii=False))
    raise SystemExit(1 if errors else 0)
