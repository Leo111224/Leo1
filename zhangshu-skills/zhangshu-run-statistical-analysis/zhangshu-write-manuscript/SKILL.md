---
name: zhangshu-write-manuscript
description: Draft and revise clinical research manuscripts from confirmed protocols, traceable evidence, verified statistical results, and figure assets. Use for IMRAD sections, abstracts, statistical tables, result narratives, journal-compliance checks, or Word/LaTeX/PDF manuscript packages where every formal number and citation must remain traceable.
---

# 临床研究论文写作

基于真实科研产物组织表达，不凭空写论文。

## Workflow

1. 读取文章类型、目标期刊和需要使用的项目资产。
2. 读取 `references/manuscript-rules.md`。
3. 汇集 confirmed Protocol、Evidence Set、Verified Result 和 Figure Asset。
4. 列出缺失资产、章节计划和字数分配，等待用户确认。
5. 按 IMRAD 逐章生成，每个事实保存 evidence_ref，每个数值保存 result_ref。
6. 生成统计表、图注和参考文献占位映射。
7. 运行 `scripts/validate_manuscript_refs.py` 校验数值和证据引用。
8. 检查报告规范、结构、字数和目标期刊要求。
9. 用户逐章确认；正式导出前执行 R3 强确认。

## Boundaries

- 缺少 Verified Result 时不得生成正式 Results 数值。
- 不把观察性关联写成因果结论。
- 无证据支持的陈述降级、删除或标记待核验。
- 数值溯源未达到 100% 时阻止正式导出。

## Output Contract

交付 Manuscript Version、统计表、图注、引用映射、溯源报告、合规报告和导出包。
