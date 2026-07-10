#!/usr/bin/env python3
import json
import sys
from pathlib import Path

WEIGHTS = {"scope": 0.35, "design": 0.25, "methods": 0.15, "constraints": 0.15, "readiness": 0.10}

def score(journal: dict) -> float:
    return round(sum(float(journal.get(key, 0)) * weight for key, weight in WEIGHTS.items()), 2)

if __name__ == "__main__":
    journals = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    ranked = [{**item, "fit_score": score(item)} for item in journals]
    ranked.sort(key=lambda item: item["fit_score"], reverse=True)
    print(json.dumps(ranked, ensure_ascii=False, indent=2))
