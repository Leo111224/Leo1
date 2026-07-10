---
name: zhangshu-clean-clinical-data
description: Profile clinical datasets, detect missingness and logical anomalies, propose auditable cleaning rules, preview their impact, and create a new immutable dataset version after confirmation. Use for clinical CSV/XLSX data quality checks, data dictionaries, missing-data strategies, outlier review, or reproducible cleaning plans.
---

# 临床数据质量与清洗

保留原始数据，只通过明确规则创建新的 Dataset Version。

## Workflow

1. 确认数据授权、Dataset Version、数据字典和分析用途。
2. 读取 `references/data-quality-rules.md`。
3. 运行确定性画像，检查类型、单位、编码、缺失、重复、范围、日期和跨字段逻辑。
4. 生成 Cleaning Plan；区分检测到的问题与建议处理方式。
5. 运行 `scripts/preview_impact.py`，展示影响行、字段、样本量和事件数。
6. 等待用户逐项确认规则。
7. 在隔离执行器中应用规则并创建新版本。
8. 使用 `assets/data-quality-report-template.md` 输出前后差异和日志。

## Boundaries

- 原始数据永不覆盖。
- “异常值”不等同于“错误值”。
- 单位、编码或临床含义不明时停止处理该字段。
- 清洗导致样本量或事件数明显下降时二次确认。
- 执行失败不得产生新数据版本。

## Output Contract

交付数据质量报告、Cleaning Plan、影响预览、新 Dataset Version、差异摘要、脚本和日志。
