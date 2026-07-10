# 科研产物契约

所有产物至少包含 `id`、`type`、`version`、`status`、`project_id`、`created_at`、`created_by`、`source_task` 和 `lineage`。

| 产物 | 最低状态要求 | 关键字段 |
|---|---|---|
| Research Brief | draft/confirmed | question、constraints、topic_candidates |
| PICOS Profile | confirmed | population、intervention、comparison、outcome、study_design |
| Evidence Set | reviewed | records、evidence_cards、search_strategy |
| Study Protocol | confirmed | design、sample_size、bias_plan、outcomes |
| Dataset Version | immutable | parent_version、hash、dictionary、sensitivity |
| Analysis Plan | approved | variables、algorithm、parameters、rationale |
| Analysis Run | immutable | plan_version、dataset_version、environment、logs |
| Verified Result | verified | metric、value、CI、p_value、run_id |
| Figure Asset | verified/draft | plot_spec、result_refs、code、hash |
| Manuscript | draft/approved | sections、result_refs、evidence_refs |

禁止原地覆盖 confirmed、immutable 或 verified 产物；修改时创建新版本。
