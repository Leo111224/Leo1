---
name: zhangshu-format-references
description: Parse, deduplicate, verify, repair, disambiguate, and format biomedical references against a target journal style while preserving source and confidence metadata. Use for BibTeX, RIS, EndNote XML, DOI/PMID cleanup, author disambiguation, missing metadata reports, or manuscript-reference consistency checks.
---

# 参考文献校验与格式化

将题录转换为可验证的 Reference Set；不静默补造字段。

## Workflow

1. 导入 BibTeX、RIS、EndNote XML 或 Manuscript 引文。
2. 读取 `references/reference-rules.md`。
3. 按 DOI、PMID、题名和作者去重。
4. 从可信来源补充元数据，保存来源与置信度。
5. 展示冲突、作者消歧和低置信字段，等待用户确认。
6. 按目标期刊/CSL 规则格式化正文引文和文后列表。
7. 运行 `scripts/validate_reference_set.py` 检查缺失、重复、未引用和顺序。
8. 输出新 Reference Set 和错误报告。

## Boundaries

- 无可靠标识符时保留缺失，不猜测卷期页码。
- 多来源冲突必须展示并确认。
- 作者无法唯一消歧时保留原始信息。
- 规则版本和更新时间不明确时提示核对官网。

## Output Contract

交付格式化正文引文、文后列表、Reference Set、来源/置信度和缺失冲突报告。
