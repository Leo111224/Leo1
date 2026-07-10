---
name: zhangshu-write-manuscript
description: Draft, revise, validate, and package clinical research manuscripts from confirmed protocols, traceable evidence, verified statistical results, figures, references, and journal requirements. Use for IMRAD sections, title, abstract, introduction, methods, results, discussion, statistical tables, figure legends, cover letters, author contribution statements, conflict-of-interest statements, data availability statements, ethics statements, reviewer response letters, journal-compliance checks, and manuscript export packages where all formal numbers and citations must remain traceable.
---

# 临床科研论文与投稿文书写作

基于真实科研产物组织表达，不凭空写论文，不替代统计结果，不伪造伦理、注册、作者贡献或引用。

## Resource routing

- 写 IMRAD 正文、摘要、标题、图表说明时读取 `references/manuscript-rules.md`。
- 处理作者贡献、利益冲突、数据可得性、伦理声明时读取 `references/compliance-statements.md`。
- 处理 Cover Letter、审稿意见回复、修稿说明时读取 `references/submission-writing.md`。

## Tool workflow

1. Call `collect_verified_artifacts` to collect confirmed Protocol, Evidence Set, Verified Result, Figure Asset, Reference Set, journal requirements, and current Manuscript Version.
2. Call `plan_manuscript_structure` to create the section outline, journal word budget, table/figure placement, missing-assets list, and traceability requirements.
3. **Human gate R1**: ask the user to confirm target article type, journal, section scope, and missing assets before drafting formal sections.
4. Call `draft_imrad_section` for Title, Abstract, Introduction, Methods, Results, Discussion, or Conclusion. Keep `evidence_ref` for claims and `result_ref` for every formal number.
5. Call `generate_statistical_tables` only from Verified Result; do not invent statistics from prose or uploaded screenshots.
6. Call `draft_cover_letter` when preparing submission text for a target journal.
7. Call `draft_author_contribution_statement`, `draft_conflict_of_interest_statement`, `draft_data_availability_statement`, and `draft_ethics_statement` when submission statements are required.
8. For reviewer comments, call `build_response_letter_matrix` to classify each comment, map required action, assign responsible upstream Skill if needed, and draft point-by-point response.
9. Call `validate_result_citations` and run `scripts/validate_manuscript_refs.py` when manuscript refs or result refs are structured.
10. Call `check_manuscript_compliance` against target journal instructions and reporting guidelines.
11. **Human gate R3**: before formal export or submission package creation, confirm manuscript version, unresolved claims, tracked changes policy, and export destination.
12. Call `export_manuscript` using `assets/imrad-template.md` and `assets/response-letter-template.md` as needed.

## Boundaries

- Missing Verified Result blocks formal Results numbers; draft placeholders are allowed only when clearly marked.
- Observational associations must not be written as causal conclusions.
- Unsupported claims must be downgraded, removed, or marked `NEEDS_EVIDENCE`.
- Authorship, conflict-of-interest, funding, ethics approval, consent, registration number, and data availability must come from user-confirmed facts.
- Reviewer responses must not promise analyses, edits, or data that have not been completed or approved.
- Formal export, submission package, and response letter release are R3 actions.

## Output contract

Deliver Manuscript Version, section drafts, statistical tables, figure legends, cover letter, author/contribution/COI/data/ethics statements, reviewer response matrix, response letter, traceability report, compliance report, and export package.

