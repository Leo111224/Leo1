# PICOS / PECO 校验规则

## 最低字段

`population`、`intervention_or_exposure`、`comparison`、`outcome`、`study_design`、`objective`、`time_origin`、`follow_up`、`data_source`。

比较项确实不适用时写明 `not_applicable_reason`，不能静默省略。诊断研究补充 `index_test`、`reference_standard`、`threshold_policy`；预测研究补充 `prediction_time`、`prediction_horizon`、开发/验证目标。

## 逻辑检查

- 人群定义、纳排标准和数据源可被一致执行。
- 暴露/干预发生在结局评估之前；横断面研究明确时间顺序限制。
- 比较组来自可比目标人群，避免不朽时间和选择机制差异。
- 主要结局包含测量方法、时间点、单位、事件判定和竞争事件处理。
- 研究目标与设计匹配：预测、诊断、因果、描述不能混用。
- 主要分析问题只保留一个主估计目标；多个主要结局说明多重性策略。

## 状态

`DRAFT`：允许缺失；`CONFIRMED`：核心字段与时间轴已确认；`LOCKED`：已被正式协议引用。字段变化必须新建版本。

