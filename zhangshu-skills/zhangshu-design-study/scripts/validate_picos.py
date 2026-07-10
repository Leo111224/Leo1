#!/usr/bin/env python3
"""Validate a clinical PICOS/PECO object.

Input: JSON file path as argv[1], or JSON from stdin.
Output: JSON validation report.
"""

from __future__ import annotations

import json
import sys
from typing import Any


REQUIRED = {
    "population": "P",
    "outcome": "O",
    "study_design": "S",
}


def _load() -> dict[str, Any]:
    raw = open(sys.argv[1], encoding="utf-8").read() if len(sys.argv) > 1 else sys.stdin.read()
    return json.loads(raw)


def _is_empty(value: Any) -> bool:
    return value is None or value == "" or value == [] or value == {}


def validate_picos(picos: dict[str, Any]) -> dict[str, Any]:
    errors: list[str] = []
    warnings: list[str] = []

    for key, label in REQUIRED.items():
        if _is_empty(picos.get(key)):
            errors.append(f"Missing required PICOS element: {label} ({key}).")

    has_intervention = not _is_empty(picos.get("intervention"))
    has_exposure = not _is_empty(picos.get("exposure"))
    if not has_intervention and not has_exposure:
        warnings.append("No intervention/exposure defined; confirm whether this is descriptive or diagnostic research.")
    if has_intervention and has_exposure:
        warnings.append("Both intervention and exposure are present; clarify whether the question is interventional or observational.")

    design = str(picos.get("study_design", "")).lower()
    if "diagnostic" in design:
        for key in ("index_test", "reference_standard", "target_condition"):
            if _is_empty(picos.get(key)):
                errors.append(f"Diagnostic study requires {key}.")
    if "prediction" in design or "prognostic" in design:
        if _is_empty(picos.get("prediction_horizon")) and _is_empty(picos.get("follow_up")):
            warnings.append("Prediction/prognostic studies should define prediction horizon or follow-up window.")
    if "case-control" in design and _is_empty(picos.get("case_definition")):
        warnings.append("Case-control studies should explicitly define cases and controls.")

    start = picos.get("index_date")
    outcome_time = picos.get("outcome_window")
    if start and not outcome_time:
        warnings.append("Index date is defined but outcome window is missing.")

    return {
        "valid": not errors,
        "errors": errors,
        "warnings": warnings,
        "status": "PASS" if not errors else "BLOCKED",
    }


if __name__ == "__main__":
    report = validate_picos(_load())
    print(json.dumps(report, ensure_ascii=False, indent=2))
    sys.exit(0 if report["valid"] else 1)
