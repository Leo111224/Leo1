# 参考文献规则

## 最低字段

record_id、type、title、authors、year、container_title；按类型补充 volume、issue、pages、publisher、doi、pmid、url。

## 来源优先级

出版社/DOI 注册信息、PubMed、Crossref、机构库、用户输入。保留每个自动补全字段的来源和检索日期。

## 置信度

- 高：唯一 DOI/PMID 且题名作者一致。
- 中：题名和年份一致但缺少唯一标识符。
- 低：模糊匹配或来源冲突；必须确认。

## 完整性

检查正文有引文但列表缺失、列表存在但正文未引用、重复记录、作者顺序和期刊缩写。
