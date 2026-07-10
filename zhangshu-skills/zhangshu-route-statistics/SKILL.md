---
name: zhangshu-route-statistics
description: Recommend statistically appropriate methods from a confirmed study design, analysis objective, and dataset profile, then create an executable Analysis Plan. Use when users ask which statistical test, regression, survival, causal-inference, diagnostic, meta-analysis, or machine-learning method fits their clinical study.
---

# 临床统计算法路由

用硬约束和算法注册表形成可解释、可执行的 Analysis Plan。

## Workflow

1. 读取已确认 PICOS、Study Protocol、分析目标和 Dataset Version。
2. 读取 `references/routing-rules.md`。
3. 生成变量类型、分布、缺失、样本量和事件数画像。
4. 查询算法注册表，只保留 validated/available 方法。
5. 运行 `scripts/route_methods.py` 进行硬约束过滤和初步排序。
6. 展示主推荐、备选、排除原因、前提假设和预期输出。
7. 等待用户确认方法、变量映射和参数。
8. 使用 `assets/analysis-plan-template.json` 创建 Analysis Plan。

## Boundaries

- 不静默替换不适用或未实现方法。
- 无方法满足硬约束时停止，不强行推荐。
- 用户偏好不能覆盖研究设计和数据约束。
- 方法、变量和参数确认后才能进入执行。

## Output Contract

输出方法推荐卡、排除清单、适用假设、风险、预期字段和 Analysis Plan。
