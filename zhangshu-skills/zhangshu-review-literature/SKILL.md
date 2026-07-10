---
name: zhangshu-review-literature
description: Plan, search, screen, appraise, synthesize, verify, and write traceable clinical literature reviews. Use for narrative, systematic, scoping, rapid, umbrella, or meta-analysis-oriented reviews; multi-database searches; PRISMA screening; evidence extraction; risk-of-bias assessment; thematic synthesis; research-gap analysis; citation verification; and review manuscript generation from a topic, PICOS, Research Brief, PDFs, DOIs, PMIDs, RIS, or BibTeX records.
---

# 临床文献综述

构建可复核的 Review Protocol、Search Log、Screening Set、Evidence Set 和 Review Manuscript。不要从题录直接跳到流畅综述。

## Resource routing

- 选择综述类型、确定问题和协议时读取 `references/review-types-and-protocol.md`。
- 构建数据库检索式时读取 `references/database-search-strategy.md`。
- 执行题录筛选与 PRISMA 计数时读取 `references/screening-and-prisma.md`。
- 提取证据和评价偏倚风险时读取 `references/evidence-extraction-and-quality.md`。
- 形成主题综合、争议、空白与正文时读取 `references/synthesis-and-writing.md`。
- 核验 DOI、题录和陈述引用映射时读取 `references/citation-integrity.md`。

## Tool workflow

1. 调用 `define_review_protocol`，确定综述类型、PICOS/研究问题、数据库、时间、语言、文献类型、纳排标准、质量评价方法和目标交付物。
2. 调用 `build_database_search_strategy`，形成概念矩阵、同义词、主题词和各数据库可复现检索式。
3. **确认点 R1**：展示 Review Protocol 与 Search Strategy；用户确认后才开始正式检索。
4. 并行调用 `search_literature_databases` 与 `import_literature_records`，记录数据库、完整检索式、执行日期、结果数、失败源和来源标识。
5. 调用 `deduplicate_literature_records`；必要时运行 `scripts/process_search_results.py` 生成唯一题录、重复组和来源统计。
6. 调用 `screen_literature_records`，按标题/摘要、全文两阶段记录纳入、排除、原因、操作者和时间，生成 PRISMA 计数。
7. 对纳入研究并行调用 `extract_study_evidence` 与 `assess_risk_of_bias`。原文不可用时只保留元数据，不推断正文。
8. 运行 `scripts/validate_evidence_set.py`；字段、原文定位或引用标识不完整时不得进入正式综合。
9. 调用 `synthesize_literature_evidence` 与 `detect_debate_and_gap`，区分共识、异质性、冲突、方法不足、人群不足和真实证据空白。
10. **确认点 R1**：展示最终纳入集、质量分布、主题结构、争议和空白；用户确认后才写正文。
11. 调用 `compose_literature_review`，基于 `assets/review-manuscript-template.md` 生成主题式综述，不按论文逐篇罗列。
12. 调用 `verify_review_citations`；必要时运行 `scripts/verify_citations.py`，修复 DOI/元数据和正文—参考文献映射。
13. **确认点 R3**：用户确认正式版本后，调用 `export_review_package` 导出正文、证据矩阵、检索日志、筛选日志、PRISMA 数据、质量评价和引用核验报告。

## Review-type rules

- 叙述综述可以简化筛选和偏倚工具，但仍要声明来源、时间边界与选择逻辑。
- 系统评价、范围综述和快速综述必须保留逐库检索式、检索日期、纳排决策与 PRISMA 流程。
- Meta-analysis 仅在结局、效应量和研究设计可合并时转交统计分析 Skill；本 Skill 不自行生成合并效应量。
- 系统评价中的双人筛选、质量评价和冲突裁决必须标注真实操作者；AI 辅助不能冒充独立审阅者。
- PRISMA 图仅在筛选计数完整时生成；其他示意图按用户需要调用绘图 Skill，不强制制造装饰图。

## Evidence and citation boundaries

- 不编造文献、DOI、PMID、作者、样本量、效应值、原文位置或数据库执行状态。
- 预印本、仅摘要、撤稿、勘误和非同行评审资料必须显式标记。
- 区分原文事实、跨研究综合、方法学判断和 AI 推断；因果表述不得超出研究设计。
- “无研究”“首次”“最新”只在检索覆盖和检索日期足以支持时使用。
- 检索源少于协议要求、全文覆盖不足或关键字段缺失时，将状态标记为 `PARTIAL`。

## Output contract

至少登记以下版本化资产：

- `Review Protocol`：综述类型、问题、范围、纳排标准、数据库和评价方法。
- `Search Log`：逐库检索式、日期、结果数、失败与补检记录。
- `Screening Set`：去重结果、纳排决策、排除原因和 PRISMA 计数。
- `Evidence Set`：证据卡、原文定位、质量评价和来源置信度。
- `Synthesis Map`：主题、共识、争议、异质性和证据空白。
- `Review Manuscript`：正文、引用映射、局限和声明。
- `Review Package`：正文及全部可复核附录；未通过核验时不得标记为正式交付。

