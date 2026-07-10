#!/usr/bin/env python3
"""Deterministic sample-size calculator for common clinical designs."""

from __future__ import annotations

import json
import math
import sys
from statistics import NormalDist
from typing import Any


def z_two_sided(alpha: float) -> float:
    return NormalDist().inv_cdf(1 - alpha / 2)


def z_power(power: float) -> float:
    return NormalDist().inv_cdf(power)


def adjust_dropout(n: float, dropout_rate: float) -> int:
    if dropout_rate < 0 or dropout_rate >= 1:
        raise ValueError("dropout_rate must be between 0 and 1.")
    return math.ceil(n / (1 - dropout_rate))


def one_proportion_precision(x: dict[str, Any]) -> dict[str, Any]:
    p, margin, alpha = float(x["p"]), float(x["margin"]), float(x.get("alpha", 0.05))
    n = z_two_sided(alpha) ** 2 * p * (1 - p) / margin ** 2
    return {"raw_n": math.ceil(n), "adjusted_n": adjust_dropout(n, float(x.get("dropout_rate", 0))), "formula": "z^2*p*(1-p)/d^2"}


def two_proportions(x: dict[str, Any]) -> dict[str, Any]:
    p1, p2 = float(x["p1"]), float(x["p2"])
    alpha, power = float(x.get("alpha", 0.05)), float(x.get("power", 0.8))
    pbar = (p1 + p2) / 2
    n = ((z_two_sided(alpha) * math.sqrt(2 * pbar * (1 - pbar)) + z_power(power) * math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))) ** 2) / ((p1 - p2) ** 2)
    n_adj = adjust_dropout(n, float(x.get("dropout_rate", 0)))
    return {"raw_n_per_group": math.ceil(n), "adjusted_n_per_group": n_adj, "adjusted_total_n": n_adj * 2, "formula": "normal approximation for two independent proportions"}


def two_means(x: dict[str, Any]) -> dict[str, Any]:
    diff, sd = abs(float(x["mean_diff"])), float(x["sd"])
    alpha, power = float(x.get("alpha", 0.05)), float(x.get("power", 0.8))
    n = 2 * ((z_two_sided(alpha) + z_power(power)) * sd / diff) ** 2
    n_adj = adjust_dropout(n, float(x.get("dropout_rate", 0)))
    return {"raw_n_per_group": math.ceil(n), "adjusted_n_per_group": n_adj, "adjusted_total_n": n_adj * 2, "formula": "2*(z_alpha/2+z_beta)^2*sd^2/diff^2"}


def survival_logrank(x: dict[str, Any]) -> dict[str, Any]:
    hr = float(x["hr"])
    event_probability = float(x["event_probability"])
    allocation = float(x.get("allocation", 1))
    alpha, power = float(x.get("alpha", 0.05)), float(x.get("power", 0.8))
    q0, q1 = 1 / (1 + allocation), allocation / (1 + allocation)
    events = ((z_two_sided(alpha) + z_power(power)) ** 2) / ((math.log(hr) ** 2) * q0 * q1)
    total = events / event_probability
    return {"required_events": math.ceil(events), "raw_total_n": math.ceil(total), "adjusted_total_n": adjust_dropout(total, float(x.get("dropout_rate", 0))), "formula": "Schoenfeld log-rank approximation"}


def diagnostic_accuracy(x: dict[str, Any]) -> dict[str, Any]:
    sens = float(x["sensitivity"])
    spec = float(x["specificity"])
    prevalence = float(x["prevalence"])
    precision = float(x["precision"])
    alpha = float(x.get("alpha", 0.05))
    diseased = z_two_sided(alpha) ** 2 * sens * (1 - sens) / precision ** 2
    nondiseased = z_two_sided(alpha) ** 2 * spec * (1 - spec) / precision ** 2
    total = max(diseased / prevalence, nondiseased / (1 - prevalence))
    return {"required_diseased": math.ceil(diseased), "required_nondiseased": math.ceil(nondiseased), "adjusted_total_n": adjust_dropout(total, float(x.get("dropout_rate", 0))), "formula": "precision-based sensitivity/specificity estimation"}


METHODS = {
    "one_proportion_precision": one_proportion_precision,
    "two_proportions": two_proportions,
    "two_means": two_means,
    "survival_logrank": survival_logrank,
    "diagnostic_accuracy": diagnostic_accuracy,
}


def main() -> int:
    payload = json.loads(open(sys.argv[1], encoding="utf-8").read() if len(sys.argv) > 1 else sys.stdin.read())
    method = payload.get("method")
    if method not in METHODS:
        raise SystemExit(f"Unsupported method: {method}. Supported: {', '.join(METHODS)}")
    result = METHODS[method](payload)
    print(json.dumps({"method_id": method, "calculator_version": "design-study-1.0", "inputs": payload, "result": result, "status": "PROVISIONAL"}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
