#!/usr/bin/env python3
import json
import sys
from pathlib import Path

ROUTES = {
    "continuous": ["linear-regression", "group-comparison"],
    "binary": ["logistic-regression", "risk-ratio-model"],
    "count": ["poisson-regression", "negative-binomial"],
    "time-to-event": ["kaplan-meier", "cox-regression"],
    "diagnostic": ["diagnostic-2x2", "roc-analysis"],
}

def route(profile: dict) -> dict:
    outcome = profile.get("outcome_type")
    candidates = ROUTES.get(outcome, [])
    exclusions = []
    events = profile.get("events")
    covariates = profile.get("covariates", 0)
    if outcome == "time-to-event" and events is not None and events < max(10, covariates * 10):
        exclusions.append("multivariable Cox may be unstable: insufficient events")
    return {"candidates": candidates, "warnings": exclusions}

if __name__ == "__main__":
    data = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    print(json.dumps(route(data), ensure_ascii=False, indent=2))
