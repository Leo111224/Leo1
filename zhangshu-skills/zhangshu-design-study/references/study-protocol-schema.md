# Study Protocol Schema

## 元数据

`protocol_id`、version、status、title、short_title、sponsor、PI、sites、study_type、reporting_guideline、created_at、approved_at、upstream_artifacts、change_log。

## 正文模块

Synopsis；背景与证据；目标和假设；PICOS/PECO；研究设计和流程；人群及纳排；干预/暴露/比较；结局和估计目标；访视计划；样本量；偏倚控制；统计分析框架；数据管理；安全与监测；伦理与同意；注册；质量管理；传播；附录。

## 状态机

`DRAFT → METHOD_CONFIRMED → VALIDATED → APPROVED → AMENDED/ARCHIVED`。

- `METHOD_CONFIRMED`：设计与主要结局已确认。
- `VALIDATED`：必填项、跨章节一致性和计算引用通过。
- `APPROVED`：只表示用户/项目流程确认，不代表伦理委员会批准。
- 关键字段修改创建新版本并登记 amendment；禁止覆盖历史协议。

## 一致性

Synopsis、正文、CRF、Schedule、样本量和分析框架必须引用同一 PICOS/Protocol 版本。主要结局、时间点、组别和样本数不一致时阻断正式导出。

