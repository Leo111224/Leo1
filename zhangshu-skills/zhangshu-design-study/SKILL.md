---
name: zhangshu-design-study
description: Design, validate, and document executable clinical research protocols from a clinical question, Research Brief, PICOS, evidence gap, or existing protocol. Use for randomized and non-randomized trials, prospective or retrospective cohorts, case-control and cross-sectional studies, diagnostic accuracy studies, prognostic-factor studies, prediction-model development or validation, case series, real-world comparative-effectiveness studies, sample-size planning, outcome and estimand definition, bias control, visit schedules, CRF schemas, ethics and data-governance review, and protocol validation.
---

# 临床研究方案设计

把临床研究问题转化为版本化、可执行、可审计的 `Study Design Package`。不要只生成通用方案文字；必须保留设计决策、样本量参数、CRF、伦理数据治理和校验记录。

## Resource routing

- 路由研究设计时读取 `references/study-design-decision-tree.md`。
- 提取和校验 PICOS/PECO 时读取 `references/picos-validation-rules.md`。
- 选择样本量方法与参数时读取 `references/sample-size-methods.md`。
- 设计随机化、盲法、混杂控制和敏感性策略时读取 `references/bias-control-catalog.md`。
- 生成协议与版本状态时读取 `references/study-protocol-schema.md`。
- 生成 CRF 和访视字段时读取 `references/crf-field-guidance.md`。
- 处理伦理、隐私、注册和数据授权时读取 `references/ethics-boundaries.md`。

## Tool workflow

1. Call `parse_clinical_research_question` to extract objective, PICOS/PECO, time zero, follow-up, data source, and resource constraints from natural language, Research Brief, Evidence Set, or existing protocol.
2. Call `classify_study_objective` to classify the objective as diagnostic, efficacy, etiology, prognostic, prediction, descriptive, or real-world comparative-effectiveness. Keep alternatives when the objective is ambiguous.
3. Call `route_study_design` to generate candidate designs, reasons, required data, reporting guideline, and major bias risks. Run `scripts/route_study_design.py` when deterministic routing is useful.
4. Call `validate_design_logic` to check time order, selection mechanism, comparator, outcome, feasibility, and ethics conflicts. Run `scripts/validate_picos.py` when a structured PICOS object is available.
5. **Human gate R2**: show design candidates, key assumptions, feasibility, exclusions, and residual risks. Continue only after the researcher confirms a design.
6. In parallel, call `define_eligibility_criteria`, `define_intervention_exposure_control`, and `define_outcome_estimand`.
7. Call `build_schedule_of_activities` to create screening, baseline, intervention/exposure, follow-up, outcome assessment, and safety/quality-control timing.
8. Collect effect-size evidence, alpha, power, allocation ratio, dropout/invalid rate, and other parameters. Call `calculate_sample_size`; run `scripts/calculate_sample_size.py` for supported deterministic formulas. If evidence is weak, output sensitivity scenarios instead of a single official value.
9. In parallel, call `build_bias_control_plan`, `draft_statistical_analysis_framework`, `generate_crf_schema`, and `assess_ethics_and_data_governance`.
10. **Human gate R2**: show sample-size parameters, bias controls, analysis framework, schedule, CRF, and ethics blockers. Continue only after revision or confirmation.
11. Call `compose_study_protocol` using `assets/study-protocol-template.md`; reuse `assets/crf-template.csv`, `assets/sample-size-report-template.md`, and `assets/schedule-of-activities-template.csv` as appendices.
12. Call `validate_study_protocol`; run `scripts/validate_protocol.py` when a structured protocol JSON is available.
13. **Human gate R3**: before formal export, confirm the protocol version and register `PICOS Profile`, `Design Decision Record`, `Sample Size Report`, `Bias Control Plan`, `Schedule of Activities`, `CRF Schema`, `Ethics & Data Governance Checklist`, and `Study Protocol`.

## Design coverage

Support randomized controlled trials, non-randomized intervention studies, prospective cohorts, retrospective cohorts, case-control studies, cross-sectional studies, diagnostic accuracy studies, prognostic-factor studies, prediction-model development or validation, case series, and real-world comparative-effectiveness studies.

Route systematic-review/meta-analysis protocols to F-02 and formal statistical execution to F-06.

## Deterministic calculation rules

- Sample size must be produced by a versioned calculator, recording method ID, formula, parameters, parameter sources, sidedness, allocation ratio, dropout/invalid-rate adjustment, and sensitivity scenarios.
- Do not treat default parameters as researcher-confirmed values.
- Cluster, repeated-measure, non-inferiority, equivalence, ordinal, adaptive, multiple-primary-outcome, and complex sampling designs require statistician review unless a validated calculator is available.
- LLM may explain calculation results but must not alter or invent formal numbers.

## Safety and governance boundaries

- Do not fabricate background evidence, effect sizes, event rates, drug doses, diagnostic thresholds, ethics approval, registration numbers, or data authorization.
- Do not replace the judgment of the researcher, statistician, ethics committee, or data-governance owner.
- Do not mark a protocol as `APPROVED` when primary outcome, time zero, comparator, data source, sample-size assumptions, or ethics path is unresolved.
- Keep prediction modeling, causal inference, and descriptive association clearly separated.
- CRF should collect the minimum data required to answer the research question; mark sensitive fields with authorization, de-identification, and retention strategy.

## Output contract

Deliver and register:

- `PICOS Profile`: question, objective, time axis, missing items, and conflicts.
- `Design Decision Record`: candidate designs, selected design, exclusion reasons, and confirmation record.
- `Sample Size Report`: method, parameters, sources, result, and sensitivity scenarios.
- `Bias Control Plan` and `Statistical Analysis Framework`.
- `Schedule of Activities` and `CRF Schema`.
- `Ethics & Data Governance Checklist`.
- `Study Protocol`: version, status, linked artifacts, validation report, and export manifest.
