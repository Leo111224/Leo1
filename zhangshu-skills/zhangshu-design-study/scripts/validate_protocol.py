#!/usr/bin/env python3
"""Validate a structured Study Protocol JSON object."""

from __future__ import annotations

import json
import sys
from typing import Any


REQUIRED_TOP_LEVEL = ["metadata", "picos", "study_design", "outcomes", "sample_size", "bias_control", "ethics"]


def _load() -> dict[str, Any]:
    raw = open(sys.argv[1], encoding="utf-8").read() if len(sys.argv) > 1 else sys.stdin.read()
    return json.loads(raw)


def missing(value: Any) -> bool:
    return value is None or value == "" or value == [] or value == {}


def validate(protocol: dict[str, Any]) -> dict[str, Any]:
    errors: list[str] = []
    warnings: list[str] = []

    for key in REQUIRED_TOP_LEVEL:
        if missing(protocol.get(key)):
            errors.append(f"Missing protocol section: {key}.")

    metadata = protocol.get("metadata", {})
    if metadata.get("status") == "APPROVED" and missing(metadata.get("human_confirmation")):
        errors.append("APPROVED protocol requires human_confirmation.")

    outcomes = protocol.get("outcomes", {})
    if missing(outcomes.get("primary")):
        errors.append("Primary outcome is required.")
    elif missing(outcomes.get("primary", {}).get("time_window")):
        warnings.append("Primary outcome time window should be specified.")

    sample = protocol.get("sample_size", {})
    if sample and missing(sample.get("method_id")):
        errors.append("Sample size section requires method_id.")
    if sample and sample.get("status") == "CONFIRMED" and missing(sample.get("parameter_sources")):
        errors.append("Confirmed sample-size calculation requires parameter_sources.")

    ethics = protocol.get("ethics", {})
    if ethics and ethics.get("blockers"):
        errors.append("Ethics/data-governance blockers must be resolved before approval.")

    return {
        "valid": not errors,
        "errors": errors,
        "warnings": warnings,
        "status": "PASS" if not errors else "BLOCKED",
    }


if __name__ == "__main__":
    report = validate(_load())
    print(json.dumps(report, ensure_ascii=False, indent=2))
    sys.exit(0 if report["valid"] else 1)
