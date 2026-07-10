# 论文知识图谱问题：用户入口节点驱动的 Agent Skills 调用路线

> 目的：根据用户“从哪个科研节点进入、当前手里有什么材料、想完成什么任务”，判断掌术 AI Agent 应该调用哪些 Skills 和工具，而不是按问题关键词固定匹配单个 Skill。  
> 本版已升级为 **F-01～F-12**：新增 F-11 伦理注册与合规材料、F-12 研究执行与随访管理，并增强 F-06/F-08/F-10。

---

## 1. 路由核心思想

真实使用中，用户不会总是从选题开始。用户可能已经有题目、数据、初稿、伦理需求、招募问题、审稿意见，甚至已经接收见刊。因此 Agent 的第一步不是直接回答，而是判断：

1. 用户当前处于哪个科研节点；
2. 用户已经拥有哪些上游资产；
3. 用户想完成的是解释、草案、变更数据/计算、导出、还是外部系统动作；
4. 完成任务需要串联哪些 Skills；
5. 当前动作属于 R0/R1/R2/R3 哪个风险等级。

标准路由：

```text
用户输入
  → zhangshu-research-orchestrator 判断入口节点、已有资产、缺失资产、风险等级
  → 选择主 Skill
  → 检查是否缺少上游资产
  → 必要时补调前置 Skill
  → 调用工具链
  → 遇到 R2/R3 暂停确认
  → 生成/更新项目产物
  → 推荐下一步 Skill
```

---

## 2. 入口判断字段

| 字段 | 说明 | 示例 |
|---|---|---|
| `entry_node` | 用户进入科研流程的位置 | 选题、文献、设计、伦理、执行、数据、统计、写作、投稿、接收后 |
| `user_goal` | 用户想完成的任务 | 找选题、写综述、清洗数据、选统计方法、准备伦理、回复审稿 |
| `available_assets` | 用户已有材料 | 数据集、题目、PICOS、文献、方案、结果、稿件、审稿意见、伦理材料 |
| `missing_assets` | 完成任务前缺少什么 | 缺 PICOS、缺 Protocol、缺 Dataset Version、缺 Verified Result |
| `data_status` | 数据状态 | 无数据、原始数据、已清洗数据、已验证结果 |
| `risk_level` | 动作风险 | R0、R1、R2、R3 |
| `primary_skill` | 本轮主 Skill | F-04 数据清洗 |
| `supporting_skills` | 为完成任务需要补调的 Skills | F-03 研究设计、F-05 算法推荐 |
| `completion_artifact` | 本轮完成后产物 | Protocol、Dataset Version、Analysis Plan、Manuscript、Ethics Package |

---

## 3. 用户入口节点总表

| 用户当前情况 / 入口节点 | 用户典型问题 | 主调用 Skill | 补充调用 Skill | 关键工具链 | 完成条件 |
|---|---|---|---|---|---|
| 只有模糊想法，没有题目 | “我想做肺癌方向，有什么课题？” | F-01 选题规划 | F-02、F-03 | `get_field_hotspot`、`build_picos_frame`、`query_dataset_inventory`、`calculate_innovation_score`、`generate_topic_plan` | Research Brief + PICOS 草案 |
| 已有疾病/方向，但没有 PICOS | “我想做胃癌预后，怎么定人群和结局？” | F-01 选题规划 | F-03 | `build_picos_frame`、`parse_clinical_research_question`、`validate_design_logic` | PICOS 草案经 R1 确认 |
| 已有题目/PICOS，想评估创新 | “这个题目能不能发？创新性够吗？” | F-01 选题规划 | F-02 | `get_field_hotspot`、`calculate_innovation_score`、`detect_debate_and_gap` | 创新可行性评分 |
| 已有题目，缺文献基础 | “帮我查一下研究现状和争议。” | F-02 文献综述 | F-01 | `define_review_protocol`、`build_database_search_strategy`、`search_literature_databases`、`extract_study_evidence` | Evidence Set / Synthesis Map |
| 已有文献或题录，想写综述 | “这些文献能不能整理成综述？” | F-02 文献综述 | F-09 | `import_literature_records`、`deduplicate_literature_records`、`screen_literature_records`、`compose_literature_review` | Review Package |
| 已有题目/PICOS，想做研究方案 | “该用队列还是病例对照？” | F-03 研究设计 | F-02 | `classify_study_objective`、`route_study_design`、`validate_design_logic` | Design Decision Record |
| 需要伦理/CRF/访视计划 | “帮我生成 CRF 和伦理审查要点。” | F-03 研究设计 | F-11 | `build_schedule_of_activities`、`generate_crf_schema`、`assess_ethics_and_data_governance` | CRF + Ethics Checklist |
| 已有 Protocol，要准备伦理/注册 | “伦理材料和临床注册怎么填？” | F-11 伦理注册 | F-03 | `classify_ethics_review_type`、`generate_ethics_submission_checklist`、`prepare_trial_registration_fields`、`check_registration_consistency` | Ethics Package / Registration Draft |
| 已进入执行期，要招募/随访 | “患者招募、随访和失访怎么管？” | F-12 研究执行管理 | F-03、F-11 | `build_recruitment_plan`、`track_recruitment_funnel`、`generate_followup_schedule`、`audit_followup_deviation` | Recruitment Plan / Follow-up Schedule |
| 执行期需要 CRF/站点质控 | “多中心数据收集怎么保证一致？” | F-12 研究执行管理 | F-04 | `build_site_qc_plan`、`generate_monitoring_report`、`audit_followup_deviation` | Site QC Plan / Monitoring Report |
| 已有原始数据，但没有数据字典 | “我有 Excel，先帮我看看数据能不能用。” | F-04 数据清洗 | F-03 | `inspect_dataset_schema`、`profile_data_quality`、`detect_data_issues` | Dataset Quality Report |
| 已有原始数据，想清洗 | “帮我处理缺失值、异常值、日期逻辑。” | F-04 数据清洗 | F-05 | `recommend_cleaning_plan`、`preview_cleaning_impact`、`execute_cleaning_plan` | 新 Dataset Version；R2 确认 |
| 已有数据，不知道怎么分析 | “这个结局该用 Cox 还是 Logistic？” | F-05 算法推荐 | F-04、F-03 | `profile_dataset`、`query_algorithm_registry`、`filter_method_constraints`、`evaluate_method_fit`、`generate_analysis_plan` | Analysis Plan 草案 |
| 已有清洗数据和研究方案 | “帮我生成正式分析计划。” | F-05 算法推荐 | F-06 | `query_algorithm_registry`、`get_algorithm_documentation`、`generate_analysis_plan` | Approved Analysis Plan |
| 已有 Analysis Plan，想跑结果 | “按这个计划跑统计分析。” | F-06 统计分析 | F-04、F-05 | `validate_analysis_plan`、`validate_statistical_environment`、`execute_statistical_model`、`validate_result_bundle` | Verified Result |
| 已有脚本/环境问题 | “R/Python 环境和代码怎么保证可复现？” | F-06 统计分析 | F-05 | `validate_statistical_environment`、`audit_analysis_script`、`generate_reproducible_run_manifest`、`package_analysis_code` | Environment Report / Code Package |
| 已有 Verified Result，想画图 | “帮我画 KM 曲线、森林图、ROC。” | F-07 统计绘图 | F-06 | `recommend_plot_spec`、`generate_plot_code`、`render_scientific_figure`、`export_figure_bundle` | Figure Asset；R3 确认 |
| 已有方案、证据、结果，想写论文 | “帮我写 Results / Discussion。” | F-08 报告生成 | F-02、F-03、F-06、F-07 | `collect_verified_artifacts`、`draft_imrad_section`、`generate_statistical_tables`、`validate_result_citations` | Manuscript Version |
| 需要 Cover Letter / 声明材料 | “Cover Letter 和作者贡献声明怎么写？” | F-08 报告生成 | F-10、F-11 | `draft_cover_letter`、`draft_author_contribution_statement`、`draft_conflict_of_interest_statement`、`draft_data_availability_statement`、`draft_ethics_statement` | Submission Documents |
| 只有参考文献或引用问题 | “参考文献格式不对，缺 DOI。” | F-09 文献格式化 | F-02 | `import_reference_set`、`resolve_reference_metadata`、`format_reference_set`、`validate_reference_set` | Reference Set |
| 已有稿件，想选刊 | “这个稿子投哪个期刊合适？” | F-10 期刊推荐 | F-08、F-09 | `extract_manuscript_profile`、`query_journal_database`、`rank_journal_fit`、`assess_submission_risk` | Journal Candidates |
| 已有目标期刊，想准备投稿包 | “按期刊要求帮我检查格式和材料。” | F-10 期刊推荐 | F-08、F-09 | `build_submission_checklist`、`validate_submission_package`、`check_manuscript_compliance` | Submission Package |
| 已收到审稿意见 | “帮我回复审稿人意见。” | F-08 报告生成 | F-06、F-10、F-09 | `build_response_letter_matrix`、`parse_editor_decision_letter`、`draft_imrad_section`、`validate_result_citations` | Response Letter / Revised Manuscript |
| 被拒稿，需要改投 | “拒稿了，帮我分析原因并改投。” | F-10 期刊推荐 | F-08、F-09 | `parse_editor_decision_letter`、`assess_submission_risk`、`rank_journal_fit`、`generate_submission_plan` | Resubmission Plan |
| 已接收，处理版权/清样/版面费 | “接收后版权、清样、版面费怎么处理？” | F-10 期刊推荐 | F-08、F-09 | `build_post_acceptance_checklist`、`check_apc_and_oa_risk`、`validate_submission_package` | Post-acceptance Checklist |
| 服务、价格、周期、合规边界 | “全程服务多久？算不算学术不端？” | 总编排 | F-08/F-10/F-11 | `task-routing`、`guardrails`、`artifact-contracts` | 服务说明 / 风险边界说明 |

---

## 4. 入口节点对应的 Skill 调用链

### 4.1 从“想法/选题”进入

```text
zhangshu-research-orchestrator
  → F-01 zhangshu-plan-topic
      get_field_hotspot
      build_picos_frame
      query_dataset_inventory
      calculate_innovation_score
      generate_topic_plan
  → R1 确认研究方向 / PICOS
  → F-02 文献综述（补证据）
  → F-03 研究设计（进入正式方案）
```

### 4.2 从“文献/综述”进入

```text
zhangshu-research-orchestrator
  → F-02 zhangshu-review-literature
      define_review_protocol
      build_database_search_strategy
      search_literature_databases
      import_literature_records
      deduplicate_literature_records
      screen_literature_records
      extract_study_evidence
      assess_risk_of_bias
      synthesize_literature_evidence
      detect_debate_and_gap
      compose_literature_review
  → R1 确认检索策略 / 纳入证据
  → F-03 研究设计 或 F-08 写作
```

### 4.3 从“研究设计/伦理预检查/CRF”进入

```text
zhangshu-research-orchestrator
  → F-03 zhangshu-design-study
      parse_clinical_research_question
      route_study_design
      validate_design_logic
      calculate_sample_size
      generate_crf_schema
      assess_ethics_and_data_governance
      compose_study_protocol
  → R2 确认设计和样本量参数
  → F-11 伦理注册与合规材料
  → F-12 研究执行与随访管理
  → F-04 数据清洗 / F-05 算法推荐
```

### 4.4 从“伦理注册/合规材料”进入

```text
zhangshu-research-orchestrator
  → 检查是否已有稳定 Study Protocol
  → 若没有：返回 F-03
  → F-11 zhangshu-ethics-registration
      classify_ethics_review_type
      generate_ethics_submission_checklist
      draft_informed_consent
      validate_privacy_deidentification_plan
      prepare_trial_registration_fields
      check_registration_consistency
  → R2 确认伦理路径、知情同意和注册字段
  → 只生成材料；外部平台注册属于 R3
```

### 4.5 从“研究执行/招募/随访/质控”进入

```text
zhangshu-research-orchestrator
  → 检查 Protocol、伦理路径、访视窗口
  → 若不完整：返回 F-03/F-11
  → F-12 zhangshu-manage-study-execution
      build_recruitment_plan
      track_recruitment_funnel
      generate_followup_schedule
      audit_followup_deviation
      build_site_qc_plan
      generate_monitoring_report
  → R2 确认影响受试者或站点流程的执行动作
  → F-04 数据清洗
```

### 4.6 从“原始数据/数据清洗”进入

```text
zhangshu-research-orchestrator
  → 检查 Study Protocol / 关键变量
  → F-04 zhangshu-clean-clinical-data
      inspect_dataset_schema
      profile_data_quality
      detect_data_issues
      recommend_cleaning_plan
      preview_cleaning_impact
      execute_cleaning_plan
  → R2 确认清洗规则和影响预览
  → 新 Dataset Version
  → F-05 算法推荐
```

### 4.7 从“统计方法/分析计划/统计执行”进入

```text
zhangshu-research-orchestrator
  → 检查 Protocol 和 Dataset Version
  → 若数据未清洗：先 F-04
  → F-05 zhangshu-route-statistics
      profile_dataset
      query_algorithm_registry
      filter_method_constraints
      evaluate_method_fit
      generate_analysis_plan
  → R2 确认方法、变量、参数
  → F-06 zhangshu-run-statistical-analysis
      validate_analysis_plan
      validate_statistical_environment
      audit_analysis_script
      execute_statistical_model
      validate_result_bundle
      link_code_to_result_items
      generate_reproducible_run_manifest
```

### 4.8 从“绘图/结果表达”进入

```text
zhangshu-research-orchestrator
  → 检查是否已有 Verified Result
  → F-07 zhangshu-create-scientific-figures
      recommend_plot_spec
      load_journal_plot_style
      generate_plot_code
      render_scientific_figure
      export_figure_bundle
  → R3 确认最终导出
  → F-08 写作
```

### 4.9 从“论文写作/投稿文书/审稿回复”进入

```text
zhangshu-research-orchestrator
  → 检查 Evidence / Protocol / Verified Result / Figure / Reference
  → F-08 zhangshu-write-manuscript
      collect_verified_artifacts
      plan_manuscript_structure
      draft_imrad_section
      generate_statistical_tables
      draft_cover_letter
      draft_author_contribution_statement
      draft_conflict_of_interest_statement
      draft_data_availability_statement
      draft_ethics_statement
      build_response_letter_matrix
      validate_result_citations
      check_manuscript_compliance
  → 必要时转 F-02/F-03/F-06/F-07/F-09/F-10/F-11
  → R3 确认正式稿导出
```

### 4.10 从“参考文献/引用格式”进入

```text
zhangshu-research-orchestrator
  → F-09 zhangshu-format-references
      import_reference_set
      resolve_reference_metadata
      disambiguate_author
      format_reference_set
      validate_reference_set
  → 冲突字段 R1/R3 确认
  → F-08 更新 Manuscript
```

### 4.11 从“选刊/投稿/拒稿/接收后”进入

```text
zhangshu-research-orchestrator
  → F-10 zhangshu-match-journals
      extract_manuscript_profile
      understand_submission_preference
      query_journal_database
      rank_journal_fit
      assess_submission_risk
      build_submission_checklist
      validate_submission_package
      parse_editor_decision_letter
      generate_submission_plan
      build_post_acceptance_checklist
      check_apc_and_oa_risk
  → 必要时 F-08 修稿 / F-09 调整引用 / F-06 补分析 / F-11 补伦理声明
  → R3 确认投稿包、改投、接收后外部动作
```

---

## 5. Agent 路由决策树

```text
用户输入
  ↓
是否涉及正式数据变更、统计执行、导出或外部动作？
  ├─ 是 → 标记 R2/R3，准备确认卡
  └─ 否 → R0/R1，可先生成草案或解释

判断已有资产：
  ├─ 无题目/只有方向 → F-01
  ├─ 有题目/缺文献 → F-02
  ├─ 有 PICOS/需方案 → F-03
  ├─ 有 Protocol/需伦理注册 → F-11
  ├─ 有 Protocol/需招募随访质控 → F-12
  ├─ 有原始数据 → F-04
  ├─ 有清洗数据/需方法 → F-05
  ├─ 有 Analysis Plan/需执行或环境审计 → F-06
  ├─ 有 Verified Result → F-07 / F-08
  ├─ 有 Manuscript → F-08 / F-09 / F-10
  ├─ 有审稿意见 → 总编排拆分后转 F-03/F-05/F-06/F-08/F-09/F-10
  └─ 接收后流程 → F-10 + F-08
```

---

## 6. 典型用户任务路线示例

### 示例 1：医生只有方向和病例数据

```text
用户：我有 300 例胃癌病例，想做一个核心期刊能发的预后研究。

路由：
F-01 选题规划 → R1 确认方向
F-03 研究设计 → R2 确认设计
F-11 伦理注册 → 准备伦理/回顾性数据授权材料
F-04 数据清洗 → F-05 算法推荐
```

### 示例 2：用户已有 Excel，想直接分析

```text
用户：我有 Excel，想直接跑 Cox。

路由：
检查是否有 Protocol / 关键变量
若没有：F-03 补研究设计
若有：F-04 数据画像与清洗
F-05 推荐方法
F-06 执行统计并生成 Verified Result
```

### 示例 3：用户在执行期，担心失访

```text
用户：随访研究失访越来越多，怎么管理？

路由：
F-12 研究执行管理
  → track_recruitment_funnel
  → generate_followup_schedule
  → audit_followup_deviation
必要时回到 F-03 调整方案偏离记录，或 F-11 补伦理上报建议。
```

### 示例 4：用户已有结果，想写论文

```text
用户：结果出来了，帮我写 Results 和 Discussion。

路由：
检查 Verified Result
若不是 Verified Result：F-06 校验或重新执行
F-08 写作
F-09 检查引用
F-10 生成投稿计划
```

### 示例 5：用户收到审稿意见

```text
用户：审稿人要求补敏感性分析，还说讨论太弱。

路由：
总编排拆解意见
  方法/统计问题 → F-05/F-06
  文字结构问题 → F-08
  引用问题 → F-09
  期刊策略问题 → F-10
F-08 build_response_letter_matrix 生成逐条回复矩阵
```

---

## 7. Agent 实现时的路由输出格式

```json
{
  "entry_node": "submission_review",
  "user_goal": "respond_to_reviewers",
  "available_assets": ["manuscript_v2", "reviewer_comments", "verified_result_v1"],
  "missing_assets": ["sensitivity_analysis_result"],
  "primary_skill": "zhangshu-write-manuscript",
  "supporting_skills": [
    "zhangshu-run-statistical-analysis",
    "zhangshu-match-journals"
  ],
  "risk_level": "R3",
  "tool_chain": [
    "build_response_letter_matrix",
    "validate_analysis_plan",
    "execute_statistical_model",
    "draft_imrad_section",
    "check_manuscript_compliance"
  ],
  "human_gate": {
    "required": true,
    "reason": "审稿回复和正式修稿属于 R3 导出动作"
  },
  "completion_artifact": "Response Letter + Revised Manuscript",
  "next_recommended_skill": "zhangshu-match-journals"
}
```

---

## 8. 150 个问题的总映射原则

150 个问题不是 150 条固定工作流，而是进入以下入口节点：

| 问题类型 | 入口节点 | 默认主 Skill |
|---|---|---|
| 研究问题、PICOS、人群、暴露、对照、结局 | 选题/设计入口 | F-01 / F-03 |
| 文献检索、综述、研究空白、证据质量 | 文献入口 | F-02 |
| 伦理审批、知情同意、临床注册、数据授权 | 伦理注册入口 | F-11 |
| 患者招募、随访、失访、CRF 质控、站点监查 | 研究执行入口 | F-12 |
| 数据字典、缺失、异常、重复、特征工程 | 数据入口 | F-04 |
| 统计方法、样本量、模型、敏感性分析 | 统计入口 | F-05 / F-06 |
| 统计代码、环境、可复现 | 统计执行入口 | F-06 |
| 图表、结果可视化 | 绘图入口 | F-07 |
| 标题、摘要、引言、方法、结果、讨论 | 写作入口 | F-08 |
| Cover Letter、作者声明、审稿回复 | 写作/投稿文书入口 | F-08 |
| 参考文献、DOI、格式 | 引用入口 | F-09 |
| 选刊、投稿、拒稿、改投、接收后 | 投稿入口 | F-10 |
| 服务边界、周期、合规风险 | 总编排入口 | Orchestrator |

