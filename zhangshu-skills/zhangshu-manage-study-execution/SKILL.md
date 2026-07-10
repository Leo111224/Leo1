---
name: zhangshu-manage-study-execution
description: Plan, monitor, and audit clinical study execution after protocol approval, including recruitment, eligibility screening, enrollment funnels, visit schedules, follow-up windows, protocol deviations, site monitoring, EDC/CRF completion quality, and execution status reports. Use when users ask how to recruit patients, manage follow-up, reduce loss to follow-up, track enrollment, coordinate single-center or multi-center data collection, audit CRF completion, or produce study monitoring reports.
---

# 研究执行与随访管理

把已批准或待执行的 Study Protocol 转换为招募、入组、随访、质控和监查计划。该 Skill 管理执行过程，不改变研究设计和统计结论。

## Resource routing

- 招募、筛查、入组和随访计划读取 `references/recruitment-followup-rules.md`。
- EDC/CRF 质量控制、多中心一致性和方案偏离读取 `references/site-qc-rules.md`。

## Tool workflow

1. Call `build_recruitment_plan` from Protocol eligibility criteria, sites, expected volume, recruitment period, and consent path.
2. Call `track_recruitment_funnel` when screening, excluded, enrolled, withdrawn, lost-to-follow-up, and completed counts are available.
3. Call `generate_followup_schedule` to produce visit windows, assessment items, reminders, and allowable deviations.
4. Call `audit_followup_deviation` to classify missed visits, out-of-window visits, incomplete assessments, withdrawals, and protocol deviations.
5. Call `build_site_qc_plan` for CRF completion, source-data verification, field consistency, query workflow, and multi-center field harmonization.
6. Call `generate_monitoring_report` using `assets/monitoring-report-template.md`.
7. **Human gate R2**: confirm execution interventions that affect participants, site workflow, or data interpretation.

## Boundaries

- Do not contact patients, send reminders, access hospital systems, or update EDC without explicit connector support and authorization.
- Do not change eligibility criteria, outcomes, or visit windows silently; route design changes back to F-03.
- Do not exclude participants or alter data because of operational inconvenience.
- Serious adverse events, privacy incidents, or major protocol deviations must be escalated to human study owner and ethics path.

## Output contract

Deliver Recruitment Plan, Screening Log Schema, Recruitment Funnel Report, Follow-up Schedule, Deviation Log, Site QC Plan, CRF Completion Audit, and Monitoring Report.

