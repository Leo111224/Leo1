---
name: zhangshu-match-journals
description: Match clinical manuscripts to current journal scopes and submission constraints, explain fit and risks, screen high-risk journals, build journal-specific submission checklists, validate submission packages, parse editorial decision letters, plan resubmission, and prepare post-acceptance checklists. Use when users ask where to submit, compare journals, balance quartile/OA/time/cost preferences, prepare a submission package, handle rejection or transfer, check APC/OA risks, or manage post-acceptance copyright, proof, and Online First steps.
---

# 临床科研期刊匹配与投稿流程

生成可解释且带来源日期的投稿梯队、投稿包检查和接收后流程清单；不承诺录用概率，不替代期刊系统、出版社或法律意见。

## Resource routing

- 期刊匹配、分区、scope、费用和风险读取 `references/journal-matching-rules.md`。
- 投稿包、投稿系统、拒稿/修改/转投和接收后流程读取 `references/submission-package-rules.md`。

## Tool workflow

1. Call `extract_manuscript_profile` to read Manuscript Version, article type, study design, disease area, main methods, figures/tables, references, and target preferences.
2. Call `understand_submission_preference` to collect quartile/IF/JCR/CAS/OA/APC/time/region/publisher constraints.
3. Call `query_journal_database`; record source URL, access date, scope, article type, APC/OA, word limits, figure/table constraints, and submission policies.
4. Call `rank_journal_fit`; run `scripts/score_journals.py` when structured candidates are available.
5. Call `assess_submission_risk` to screen mismatch, predatory risk, excessive APC, word/table over-limit, missing required statements, or ethical-policy conflicts.
6. Show sprint/match/conservative tiers and ask user to select target journal.
7. Call `build_submission_checklist` for the selected journal.
8. Call `validate_submission_package` to check manuscript, cover letter, title page, highlights, graphical abstract, figures, supplement, references, COI, author forms, ethics statement, data statement, and reporting checklist.
9. For decision letters, call `parse_editor_decision_letter`; route statistical/method issues to F-03/F-05/F-06, writing issues to F-08, references to F-09.
10. For rejection or transfer, call `generate_submission_plan` to produce resubmission strategy and required edits.
11. For accepted papers, call `build_post_acceptance_checklist` and `check_apc_and_oa_risk` for copyright, proof, APC/OA, Online First, indexing, and invoice verification.
12. **Human gate R3**: any formal submission, resubmission, package export, payment-related instruction, or external-system action requires explicit confirmation.

## Boundaries

- Dynamic journal information must be sourced with access date; stale or unverifiable information blocks formal recommendation.
- Hard constraints conflict requires user prioritization; do not silently relax constraints.
- Do not guarantee acceptance probability.
- Do not submit to external systems, pay APC, sign copyright, or approve proofs without connector support and explicit authorization.
- Suspected predatory journals are excluded by default and explained.

## Output contract

Deliver journal candidate cards, fit scores, source dates, risks, sprint/match/conservative tiers, submission checklist, submission package validation report, decision-letter parse, resubmission plan, post-acceptance checklist, and export manifest.

