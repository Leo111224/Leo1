# 数据库检索策略

## 数据库组合

临床问题优先覆盖 PubMed/MEDLINE；根据领域选择 Embase、Cochrane Library、Web of Science、Scopus、CINAHL、PsycINFO。补充 ClinicalTrials.gov、WHO ICTRP、medRxiv/bioRxiv、OpenAlex/Semantic Scholar、参考文献回溯和前向引用。

正式系统评价应按协议使用至少两个互补数据库；无法访问计划数据库时记录失败、替代来源和覆盖风险，不得暗示已完成检索。

## 构建步骤

1. 从 PICOS/问题拆出 2–4 个核心概念。
2. 为每个概念列自由词、缩写、旧称、拼写变体和控制词（MeSH/Emtree）。
3. 概念内用 `OR`，概念间用 `AND`；谨慎使用 `NOT`。
4. 将通用概念矩阵翻译为各数据库语法，不直接复制 PubMed 检索式。
5. 用 3–5 篇已知关键文献做召回测试并记录调整。
6. 保存完整检索式、数据库/平台、执行日期、时间范围、过滤器和结果数。

## Search Log 字段

`search_id`、`protocol_id`、database、platform、query_exact、date_executed、coverage_start、coverage_end、filters、result_count、export_format、source_file、status、error、operator。

## 边界

- 引用数和相关性排序只能用于筛查优先级，不能替代纳排标准。
- 预印本必须标记未同行评审，并检查是否已有正式发表版本。
- 搜索引擎结果不可替代可复现数据库检索。
- 所有“截至目前”结论绑定明确检索截止日期。

