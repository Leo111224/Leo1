#!/usr/bin/env python3
"""Route a clinical research question to candidate study designs."""

from __future__ import annotations

import json
import sys
from typing import Any


def _load() -> dict[str, Any]:
    raw = open(sys.argv[1], encoding="utf-8").read() if len(sys.argv) > 1 else sys.stdin.read()
    return json.loads(raw)


def add(candidates: list[dict[str, Any]], design_id: str, label: str, reasons: list[str], risks: list[str], guideline: str) -> None:
    candidates.append({
        "design_id": design_id,
        "label": label,
        "reasons": reasons,
        "risks": risks,
        "reporting_guideline": guideline,
        "status": "CANDIDATE",
    })


def route(payload: dict[str, Any]) -> dict[str, Any]:
    text = " ".join(str(payload.get(k, "")) for k in ("objective", "question", "study_preference", "data_source")).lower()
    candidates: list[dict[str, Any]] = []

    if any(x in text for x in ["diagnostic", "sensitivity", "specificity", "auc", "index test"]):
        add(candidates, "diagnostic_accuracy", "诊断准确性研究", ["目标涉及诊断性能或阈值"], ["需明确金标准和连续入组策略"], "STARD")
    if any(x in text for x in ["prognosis", "survival", "cox", "risk factor", "预后", "生存"]):
        add(candidates, "cohort", "队列研究", ["目标涉及预后、风险因素或事件发生"], ["需处理混杂、删失和随访完整性"], "STROBE")
    if any(x in text for x in ["prediction", "model", "nomogram", "预测", "模型"]):
        add(candidates, "prediction_model", "预测模型开发/验证", ["目标是个体化风险预测"], ["需避免数据泄漏并进行内部/外部验证"], "TRIPOD")
    if any(x in text for x in ["random", "trial", "intervention", "rct", "随机", "干预"]):
        add(candidates, "randomized_trial", "随机对照试验", ["目标涉及干预效果且可前瞻分配"], ["需随机化、盲法、伦理和注册"], "CONSORT")
    if any(x in text for x in ["case-control", "rare", "病例对照", "罕见"]):
        add(candidates, "case_control", "病例对照研究", ["适合罕见结局或回顾性暴露比较"], ["选择偏倚和回忆偏倚风险较高"], "STROBE")
    if any(x in text for x in ["prevalence", "cross-sectional", "现况", "横断面", "患病率"]):
        add(candidates, "cross_sectional", "横断面研究", ["目标涉及现况、患病率或相关因素"], ["难以证明时间顺序和因果关系"], "STROBE")
    if not candidates:
        add(candidates, "retrospective_cohort", "回顾性队列研究", ["默认适配院内真实世界数据和预后/关联问题"], ["需确认时间零点、暴露窗口和结局窗口"], "STROBE")

    return {"candidates": candidates, "recommended": candidates[0]["design_id"], "requires_confirmation": True}


if __name__ == "__main__":
    print(json.dumps(route(_load()), ensure_ascii=False, indent=2))
