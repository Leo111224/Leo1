# 执行与结果契约

## 运行清单

run_id、plan_id/version、dataset_id/version/hash、algorithm_id/version、container/runtime、dependencies、seed、parameters、started_at、finished_at、logs。

## 状态

DRAFT → VALIDATING_INPUT → WAITING_CONFIRMATION → QUEUED → RUNNING → VALIDATING_OUTPUT → SUCCEEDED → REVIEWED → VERIFIED。

异常终态：CANCELLED、TIMED_OUT、FAILED、REJECTED。

## Result Item

metric、estimate、unit、standard_error、confidence_interval、p_value、sample_size、events、diagnostics、run_id、validation_status。

## 解释边界

区分统计显著、效应大小、临床意义和因果解释。观察性设计默认使用“相关”而不是“导致”。
