# 领创科研常见问题：Skills 与 Tools 覆盖审计

> 审计对象：`论文知识图谱_临床科研常见问题解答表.csv` 中 150 个临床科研常见问题。  
> 审计状态：已按缺口补充 F-11 伦理注册与合规材料、F-12 研究执行与随访管理，并增强 F-06/F-08/F-10。

---

## 1. 总体结论

结论：**升级后的掌术 AI Skills 体系已经覆盖领创科研 150 个常见问题的主任务链路。**

但需要明确边界：  
对于注册平台提交、投稿系统提交、APC 支付、版权签署、患者联系、医院系统/EDC 写入等外部动作，当前 Skills 设计为“生成材料、清单、字段草案和风险提示”，不默认自动执行。若未来要自动执行，需要外部系统连接器、权限控制、日志和 R3 强确认。

### 覆盖等级判断

| 覆盖等级 | 数量估算 | 占比估算 | 说明 |
|---|---:|---:|---|
| 任务能力覆盖 | 150 个问题 | 100% | 均可路由到 F-01～F-12 或总编排，并形成解释、草案、清单、计划、报告或正式产物 |
| 自动化执行闭环 | 约 125～135 个问题 | 约 83%～90% | 科研文本、方案、数据、统计、图表、引用、投稿包等可形成较完整闭环 |
| 需外部连接器才能执行 | 约 15～25 个问题 | 约 10%～17% | 伦理平台注册、投稿系统提交、患者联系、APC 支付、版权签署、清样确认、出版状态追踪 |

---

## 2. 常见问题分布与当前覆盖

| 一级阶段 | 问题数 | 当前覆盖状态 | 主要 Skills |
|---|---:|---|---|
| 构思选题与规划 | 42 | 完全覆盖 | F-01、F-02、F-03 |
| 执行与数据收集 | 17 | 已补齐主链路 | F-03、F-11、F-12、F-04 |
| 数据分析 - 预处理 / 特征工程 | 13 | 完全覆盖 | F-04、F-05 |
| 数据分析 - 数据统计执行 | 12 | 已增强可复现与代码审计 | F-05、F-06 |
| 论文撰写 | 25 | 已增强投稿文书和合规声明 | F-08、F-09、F-11 |
| 投稿与同行评审 | 22 | 已增强投稿包、决定信解析和审稿回复 | F-10、F-08、F-09、F-06 |
| 接收后流程 | 13 | 已补投稿后清单能力；外部执行需连接器 | F-10、F-08、F-09 |
| 跨阶段通用问题 | 6 | 总编排覆盖 | Orchestrator、F-08、F-10、F-11 |

---

## 3. 现有 Skills 覆盖清单

| Skill | 对应能力 | 覆盖强度 | 主要覆盖的问题类型 |
|---|---|---|---|
| `zhangshu-research-orchestrator` | 总编排、入口判断、风险分级、上下游衔接 | 强 | 用户不知道从哪开始、跨阶段问题、已有材料但任务不清晰 |
| `zhangshu-plan-topic` | 选题规划、热点、PICOS、创新可行性评分 | 强 | 研究问题、PICOS、人群/干预/对照/结局/可行性 |
| `zhangshu-review-literature` | 文献检索、筛选、证据提取、综述写作 | 强 | 文献检索、综述、研究空白、争议、证据质量 |
| `zhangshu-design-study` | 研究设计、样本量、偏倚控制、CRF、伦理预检查 | 强 | 研究设计、纳排标准、结局、对照、样本量、CRF |
| `zhangshu-ethics-registration` | 伦理审查、知情同意、隐私治理、临床注册字段 | 强 | 伦理审批、豁免、注册、数据授权、隐私脱敏 |
| `zhangshu-manage-study-execution` | 招募、入组、随访、方案偏离、CRF质控、监查报告 | 强 | 患者招募、随访、失访、多中心质控、执行监查 |
| `zhangshu-clean-clinical-data` | 数据画像、缺失/异常/逻辑问题、清洗计划和版本 | 强 | 数据清洗、数据字典、缺失值、异常值、数据版本 |
| `zhangshu-route-statistics` | 统计算法推荐、方法约束、Analysis Plan | 强 | 统计方法选择、模型选择、变量映射、分析计划 |
| `zhangshu-run-statistical-analysis` | 统计执行、环境审计、代码审计、结果验证 | 强 | 统计执行、结果解释、模型诊断、可复现分析 |
| `zhangshu-create-scientific-figures` | 科研图表、图注、期刊图形风格 | 强 | KM、ROC、森林图、Table/Figure 生成 |
| `zhangshu-write-manuscript` | IMRAD、Cover Letter、合规声明、审稿回复 | 强 | 标题、摘要、正文、投稿文书、审稿回复 |
| `zhangshu-format-references` | 参考文献解析、修复、去重、格式化 | 强 | DOI、PMID、引用格式、文献列表一致性 |
| `zhangshu-match-journals` | 期刊匹配、投稿包、决定信、改投、接收后清单 | 强 | 选刊、投稿材料、拒稿改投、清样/APC/版权提醒 |

---

## 4. 按二级环节的覆盖矩阵

| 一级阶段 | 二级环节 | 问题数 | 覆盖等级 | 当前可调用 Skills | 关键产物 |
|---|---|---:|---|---|---|
| 构思选题与规划 | 提出研究问题（PICOS 原则） | 18 | 完全覆盖 | F-01、F-03、F-02 | PICOS、Research Brief、创新评分 |
| 构思选题与规划 | 确定研究设计 / 关键点 | 13 | 完全覆盖 | F-03、F-05、F-02 | Study Design Package、Analysis Framework |
| 构思选题与规划 | 文献检索与综述 | 11 | 完全覆盖 | F-02、F-01、F-09 | Review Protocol、Evidence Set |
| 执行与数据收集 | 伦理审批与临床试验注册 | 6 | 完全覆盖材料生成 | F-11、F-03 | Ethics Package、Registration Draft |
| 执行与数据收集 | 数据收集工具与质量控制 | 5 | 完全覆盖 | F-03、F-12、F-04 | CRF、Site QC Plan、Monitoring Report |
| 执行与数据收集 | 患者招募与随访 | 3 | 完全覆盖管理方案 | F-12、F-03、F-11 | Recruitment Plan、Follow-up Schedule |
| 执行与数据收集 | 数据清洗与管理 | 3 | 完全覆盖 | F-04 | Cleaning Plan、Dataset Version |
| 数据分析 - 预处理 / 特征工程 | 数据处理与清洗 | 13 | 完全覆盖 | F-04、F-05 | Data Quality Report、Feature Plan |
| 数据分析 - 数据统计执行 | 统计分析计划的执行 | 5 | 完全覆盖 | F-05、F-06 | Analysis Plan、Verified Result |
| 数据分析 - 数据统计执行 | 结果记录与输出 | 3 | 完全覆盖 | F-06、F-07、F-08 | Result Bundle、Figure、Manuscript |
| 数据分析 - 数据统计执行 | 统计软件选择与环境配置 | 2 | 已增强覆盖 | F-06、F-05 | Environment Report |
| 数据分析 - 数据统计执行 | 分析脚本与代码管理 | 2 | 已增强覆盖 | F-06 | Script Audit、Code Package |
| 论文撰写 | 标题 / 摘要 / 引言 / 方法 / 结果 / 讨论 | 14 | 完全覆盖 | F-08、F-02、F-03、F-06 | Manuscript Version |
| 论文撰写 | 参考文献 | 5 | 完全覆盖 | F-09、F-02、F-08 | Reference Set |
| 论文撰写 | 作者与合规相关 | 6 | 已增强覆盖 | F-08、F-11 | Contribution/COI/Data/Ethics Statements |
| 投稿与同行评审 | 选刊 | 4 | 完全覆盖 | F-10、F-08 | Journal Candidates |
| 投稿与同行评审 | 格式排版 | 2 | 完全覆盖 | F-08、F-09、F-10 | Submission Package |
| 投稿与同行评审 | Cover Letter | 2 | 已增强覆盖 | F-08、F-10 | Cover Letter |
| 投稿与同行评审 | 提交系统 | 3 | 清单覆盖，外部执行需连接器 | F-10、Orchestrator | Submission Checklist |
| 投稿与同行评审 | 应对审稿意见 | 5 | 已增强覆盖 | F-08、F-06、F-10、F-09 | Response Matrix、Response Letter |
| 投稿与同行评审 | 接收 / 修改 / 拒稿 | 6 | 已增强覆盖 | F-10、F-08、F-09 | Decision Parse、Resubmission Plan |
| 接收后流程 | 签署版权协议 | 2 | 清单覆盖，签署需人工 | F-10、F-08 | Post-acceptance Checklist |
| 接收后流程 | 校对清样 | 2 | 清单与文本校对覆盖 | F-10、F-08、F-09 | Proof Checklist |
| 接收后流程 | 支付版面费 | 3 | 风险核验覆盖，支付需人工 | F-10 | APC/OA Risk Check |
| 接收后流程 | Online First → 正式出版 | 6 | 流程清单覆盖，状态追踪需连接器 | F-10、F-08 | Publication Status Checklist |
| 跨阶段通用问题 | 全周期通用 | 6 | 总编排覆盖 | Orchestrator、F-08、F-10、F-11 | 服务说明、风险边界 |

---

## 5. 本次已补充的能力

### 5.1 新增 F-11：伦理注册与合规材料

新增 Skill：`zhangshu-ethics-registration`

核心工具：

| 工具 | 作用 |
|---|---|
| `classify_ethics_review_type` | 判断完整审查、快速审查、豁免/备案或需人工判断 |
| `generate_ethics_submission_checklist` | 生成伦理递交材料清单 |
| `draft_informed_consent` | 起草知情同意书框架 |
| `validate_privacy_deidentification_plan` | 检查脱敏、授权、保留期限和访问控制 |
| `prepare_trial_registration_fields` | 生成临床注册字段草案 |
| `check_registration_consistency` | 检查注册信息与 Protocol 是否一致 |
| `export_ethics_package` | 导出伦理材料包 |

### 5.2 新增 F-12：研究执行与随访管理

新增 Skill：`zhangshu-manage-study-execution`

核心工具：

| 工具 | 作用 |
|---|---|
| `build_recruitment_plan` | 根据研究设计生成招募计划 |
| `track_recruitment_funnel` | 统计筛查、入组、排除、失访、完成随访人数 |
| `generate_followup_schedule` | 生成随访计划和窗口 |
| `audit_followup_deviation` | 识别超窗、漏访、失访和方案偏离 |
| `build_site_qc_plan` | 生成单中心/多中心数据质控计划 |
| `generate_monitoring_report` | 输出研究执行监查报告 |

### 5.3 增强 F-08：论文写作、投稿文书和审稿回复

新增/强化工具：

| 工具 | 作用 |
|---|---|
| `plan_manuscript_structure` | 规划论文结构、字数和缺失资产 |
| `draft_cover_letter` | 生成 Cover Letter |
| `draft_author_contribution_statement` | 生成作者贡献声明 |
| `draft_conflict_of_interest_statement` | 生成利益冲突声明 |
| `draft_data_availability_statement` | 生成数据可得性声明 |
| `draft_ethics_statement` | 生成伦理声明 |
| `build_response_letter_matrix` | 将审稿意见拆成逐条回复矩阵 |

### 5.4 增强 F-10：投稿包、决定信和接收后流程

新增/强化工具：

| 工具 | 作用 |
|---|---|
| `build_submission_checklist` | 根据目标期刊生成投稿清单 |
| `validate_submission_package` | 检查稿件、图表、补充材料、声明和引用是否齐全 |
| `parse_editor_decision_letter` | 解析接收、修改、拒稿、转投建议 |
| `build_post_acceptance_checklist` | 生成版权、APC、清样、Online First 检查清单 |
| `check_apc_and_oa_risk` | 核查版面费、OA 政策和疑似掠夺风险 |

### 5.5 增强 F-06：统计环境、代码和可复现审计

新增/强化工具：

| 工具 | 作用 |
|---|---|
| `validate_statistical_environment` | 检查 R/Python 版本、包版本和运行环境 |
| `audit_analysis_script` | 审计脚本路径、随机种子、数据修改和结果映射 |
| `link_code_to_result_items` | 将每个结果与脚本、参数、数据版本绑定 |
| `generate_reproducible_run_manifest` | 生成可复现运行清单 |
| `package_analysis_code` | 打包脚本、依赖、日志和结果引用 |

---

## 6. 仍需产品或连接器支持的外部动作

这些问题现在已经有 Skill 生成清单和材料，但若要“自动执行”，需要系统连接器：

| 外部动作 | 当前 Skill 能力 | 自动化所需 |
|---|---|---|
| 伦理平台提交 | F-11 生成字段和材料包 | 伦理平台连接器、权限、日志 |
| 临床注册平台提交 | F-11 生成注册字段草案 | 注册平台连接器、R3 确认 |
| 患者联系/随访提醒 | F-12 生成计划和话术 | 医院系统/短信/随访平台连接器 |
| EDC 写入或修改 | F-12/F-04 生成质控和清洗规则 | EDC 连接器、审计追踪 |
| 投稿系统提交 | F-10 生成投稿包和清单 | 投稿系统连接器、R3 确认 |
| APC 支付 | F-10 核查风险和费用 | 财务/支付系统，不建议 Agent 自动支付 |
| 版权签署 | F-10 生成检查清单 | 用户/机构人工签署 |
| 清样批准 | F-10/F-08 检查内容 | 出版系统连接器 + 人工确认 |

---

## 7. 最终判断

升级后可以这样表述：

> 掌术 AI 已经覆盖临床科研从选题、文献、研究设计、伦理注册、研究执行、数据清洗、算法推荐、统计分析、绘图、论文写作、参考文献、选刊投稿到接收后流程的核心任务链路。对于 150 个常见问题，均可通过入口节点路由到对应 Skills，并形成可交付的草案、清单、报告、版本化产物或正式稿件。

同时保留产品边界：

> 涉及外部系统提交、支付、签署、患者联系和真实平台状态同步的动作，当前 Skills 只做材料准备、风险核验和操作清单；自动执行必须依赖连接器、权限控制、审计日志和 R3 强确认。

