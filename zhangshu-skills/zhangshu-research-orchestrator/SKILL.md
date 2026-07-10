---
name: zhangshu-research-orchestrator
description: Route clinical research requests across the Zhangshu AI workflow from topic planning through post-acceptance management. Use when a request spans multiple research stages, the user is unsure which task to start, a project must continue from existing artifacts, dependencies and human confirmation gates must be coordinated, or the request may require handoff across F-01 through F-12 including ethics registration, study execution, manuscript, submission, and post-acceptance workflows.
---

# 掌术科研任务总编排

把开放式科研需求转换为有依赖、有确认点、有产物交付的任务链。不在本 Skill 中执行统计计算、数据清洗、外部提交或替代领域 Skill。

## Core Workflow

1. Identify user goal, entry node, current research stage, available artifacts, missing artifacts, and requested action.
2. Read `references/task-routing.md` and route the request to F-01～F-12.
3. Read `references/artifact-contracts.md` and check upstream assets, confirmation status, and version dependencies.
4. Read `references/guardrails.md` and determine risk level and required human gates.
5. Output a task plan; split cross-stage requests by dependency order.
6. After required confirmation, call the corresponding task Skill or controlled tool.
7. Register artifact ID, version, source, and upstream/downstream relation.
8. Deliver the current task and ask whether to continue into the recommended downstream task.

## Routing Rules

- Vague disease area, research ideas, innovation assessment: `$zhangshu-plan-topic`.
- Review protocol, multi-database search, PRISMA, evidence appraisal, review writing: `$zhangshu-review-literature`.
- PICOS, study design, sample size, bias control, CRF, ethics pre-check: `$zhangshu-design-study`.
- Clinical dataset quality, missingness, anomalies, cleaning versions: `$zhangshu-clean-clinical-data`.
- Statistical method selection and Analysis Plan: `$zhangshu-route-statistics`.
- Real statistical execution, reproducibility, environment/code audit, Verified Result: `$zhangshu-run-statistical-analysis`.
- Publication-grade figures: `$zhangshu-create-scientific-figures`.
- IMRAD manuscript, statistical tables, cover letter, compliance statements, reviewer response: `$zhangshu-write-manuscript`.
- Reference repair and journal-specific citation style: `$zhangshu-format-references`.
- Journal matching, submission checklist, resubmission, post-acceptance checklist: `$zhangshu-match-journals`.
- Ethics approval materials, informed consent, privacy, clinical trial registration: `$zhangshu-ethics-registration`.
- Recruitment, enrollment, follow-up, CRF completion, site QC, monitoring reports: `$zhangshu-manage-study-execution`.

## Mandatory Boundaries

- Do not fabricate literature, data, statistical numbers, ethics approval, registry IDs, journal metrics, submission status, or study execution status.
- Do not allow LLM-created formal statistical numbers; formal numbers must come from Verified Result.
- R2 data/design/computation changes and R3 formal export/external actions require explicit confirmation.
- Missing key upstream assets must route back to the upstream task instead of pretending the workflow is complete.
- Dynamic external information must include source and access/update date.
- External system actions, including registry submission, patient contact, journal submission, APC payment, copyright signing, and proof approval, require connector support and R3 confirmation.

## Output Contract

Output at least:

- current stage and target task;
- satisfied and missing upstream requirements;
- proposed Skill/Tool calls;
- risk level and confirmation gates;
- current artifact and expected downstream task;
- blocked items and whether the system can only generate a checklist/draft rather than execute externally.

Run `scripts/validate_manifest.py` when generating a project manifest.

