---
name: zhangshu-plan-topic
description: Discover clinically meaningful research topics, structure a preliminary PICOS question, assess innovation and feasibility, and generate differentiated topic plans. Use when a clinician has a disease area or vague research idea and needs hotspots, evidence gaps, or innovation/steady/hot topic alternatives before literature review or study design.
---

# 临床科研选题规划

将模糊研究兴趣转化为可核验的热点证据、PICOS 草案和三套差异化选题。

## Workflow

1. 收集疾病/领域、研究偏好、目标期刊层级、时间范围和数据条件。
2. 读取 `references/hotspot-and-scoring.md`，确定来源范围和评分方法。
3. 使用 `scripts/analysis_ops.py` 检索 PubMed、统计 MeSH/关键词和形成证据摘要。
4. 并行构建 PICOS 草案和可用数据摘要。
5. 展示热点证据、来源日期、PICOS 缺失与冲突，等待用户确认。
6. 从新颖性、临床价值、证据缺口和可行性四维评分。
7. 使用 `assets/topic-plan-template.md` 输出创新型、稳妥型、热点型三套方案。
8. 将选定方案登记为 Research Brief；建议进入 F-02 或 F-03。

## Mandatory Boundaries

- 动态热点必须引用真实来源和检索日期。
- 不得无证据宣称“首次”“唯一”或“填补空白”。
- 文献覆盖不足时标记 PARTIAL。
- 研究方向与 PICOS 在继续前必须确认。

## Required Inputs

必填：疾病/研究领域。建议：研究类型偏好、目标期刊、已有数据、资源限制。

## Output Contract

输出热点总览、PICOS 草案、逻辑风险、四维评分、三套选题、初步大纲和来源清单。
