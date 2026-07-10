---
name: zhangshu-ethics-registration
description: Prepare and validate clinical research ethics, consent, privacy, data-governance, and trial-registration materials from a confirmed protocol. Use when users ask about ethics approval, exemption or expedited review, informed consent, retrospective data authorization, de-identification, clinical trial registration fields, registry consistency, institutional review-board submission packages, or whether a study can proceed compliantly.
---

# 伦理注册与合规材料

把 Study Protocol 转换为伦理递交、知情同意、数据治理和注册平台字段草案。只生成材料和核查清单，不替代伦理委员会、注册平台或法律意见。

## Resource routing

- 判断伦理审查类型和材料清单时读取 `references/ethics-review-rules.md`。
- 处理知情同意、隐私、脱敏、数据授权时读取 `references/privacy-and-consent.md`。
- 准备临床试验注册字段时读取 `references/registration-fields.md`。

## Tool workflow

1. Call `classify_ethics_review_type` from Protocol, study design, intervention risk, data source, identifiability, prospective/retrospective status, and vulnerable population.
2. Call `generate_ethics_submission_checklist` to create the required documents, missing fields, and institutional dependencies.
3. Call `draft_informed_consent` when consent is needed; if waiver is requested, state the justification and residual risks.
4. Call `validate_privacy_deidentification_plan` to check identifiers, data minimization, retention, access control, transfer, and destruction plan.
5. Call `prepare_trial_registration_fields` for registry-ready fields when the study is interventional, prospective, or otherwise requires registration.
6. Call `check_registration_consistency` to compare registry fields with Protocol, endpoints, sample size, arms/groups, dates, and ethics status.
7. **Human gate R2**: confirm ethics path, consent approach, data authorization, and registration draft before marking package as ready for submission.
8. Call `export_ethics_package` using `assets/ethics-checklist-template.md` and `assets/registration-fields-template.json`.

## Boundaries

- Do not claim ethics approval, waiver, registration, or legal compliance has been granted.
- Do not invent IRB number, approval date, registry ID, consent status, or data authorization.
- When privacy, consent, vulnerable population, genetic data, minors, identifiable images, cross-border transfer, or high-risk intervention is involved, mark as requiring institutional review.
- External submission to IRB or registry is R3 and requires explicit user authorization and system connector support.

## Output contract

Deliver Ethics Review Classification, Submission Checklist, Consent/Waiver Draft, Privacy & De-identification Plan, Trial Registration Field Draft, Consistency Report, and Ethics Package export manifest.

