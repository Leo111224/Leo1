# CRF 与访视字段设计

## 字段属性

`field_id`、domain、label、definition、data_type、unit、allowed_values、missing_codes、required、timepoint、source、derivation、sensitivity、validation_rule、protocol_reference。

## 设计原则

- 每个字段对应研究目的、结局、协变量、安全性或运营需求；无用途字段不收集。
- 使用明确单位、编码、正常范围和缺失原因，禁止用空值混合“不适用/未知/未测”。
- 派生变量保留公式和源字段，不在采集层覆盖原始值。
- 时间字段区分事件日期、记录日期、访视窗口和时区。
- 结局字段与协议定义、判定规则和分析框架一致。

## 敏感数据

身份、联系方式、遗传、生殖、影像和自由文本标注敏感级别、授权、脱敏、访问角色和保留期限。CRF 模板不包含真实患者数据。

## Schedule of Activities

每项活动记录访视、目标日、允许窗口、执行角色、条件、数据域和异常处理。访视表必须覆盖筛查、基线、干预/暴露、随访、主要结局和安全事件。

