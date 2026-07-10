# 筛选与 PRISMA

## 筛选状态

题录依次经过 `identified → deduplicated → title_abstract → full_text → included/excluded`。每次决策保存 `record_id`、阶段、决定、排除原因、操作者、时间和备注。

## 排除原因

全文阶段使用预定义、互斥且可汇总的原因，例如：错误人群、错误干预/暴露、错误比较、错误结局、错误设计、非目标出版类型、时间/语言不符、无全文、重复报告、撤稿。

标题摘要阶段可使用宽松排除；不确定项进入全文阶段，不要为了降低数量而推断排除。

## 双人流程

若协议要求双人筛选，保存两名真实审阅者的独立决策和裁决结果。AI 可以排序、提示和抽取，但不得被登记为第二名人工审阅者。

## PRISMA 数据一致性

- identified = 各来源记录之和。
- deduplicated = identified − duplicates_removed。
- title_abstract_screened = deduplicated。
- full_text_assessed = title_abstract_included。
- included ≤ full_text_assessed。
- full_text_assessed = included + 各全文排除原因计数 + pending_full_text。

若计数不闭合，标记阻断项，不生成正式 PRISMA 图。

