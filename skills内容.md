# 掌术 AI：Skills 内容规划

> 文档版本：v2.0  
> 当前状态：已从 F-01～F-10 升级为 F-01～F-12。  
> 规划目标：明确掌术 AI 科研 Agent 需要建设的 Skill、每个 Skill 的职责边界、工具链、内部文档、脚本与模板资源。

---

## 1. 规划结论

掌术 AI 不应把每个原子工具都做成独立 Skill，而应按科研业务阶段建设 Skill：

- **Skill**：负责识别任务、加载领域规则、执行工作流、设置确认点、组织工具调用。
- **Tool**：完成检索、校验、计算、执行、导出等单一原子动作。
- **Reference**：保存方法学规则、Schema、来源政策和输出规范。
- **Script**：承担确定性、可重复、容易出错的计算或校验。
- **Asset**：保存最终输出会复用的模板、表格、结构文件。

推荐建设：

| 层级 | 数量 | 内容 |
|---|---:|---|
| 总编排 Skill | 1 | 识别科研阶段、路由 F-01～F-12、管理确认点和产物衔接 |
| 业务 Skill | 12 | 与科研任务 F-01～F-12 一一对应 |
| 原子 Tool | 约 90+ | 由 Skill 调用，不作为独立 Skill |
| 公共规则 | 6 类 | 红线、风险、资产、记忆、工具契约、术语 |

最终形成 **13 个 Skill**：

```text
1 个总编排 Skill + 12 个业务 Skill
```

---

## 2. 总体目录

```text
zhangshu-skills/
├── zhangshu-research-orchestrator/       # 总编排与任务路由
├── zhangshu-plan-topic/                  # F-01 选题规划
├── zhangshu-review-literature/           # F-02 文献综述
├── zhangshu-design-study/                # F-03 研究设计
├── zhangshu-clean-clinical-data/         # F-04 数据清洗
├── zhangshu-route-statistics/            # F-05 算法推荐
├── zhangshu-run-statistical-analysis/    # F-06 统计分析
├── zhangshu-create-scientific-figures/   # F-07 统计绘图
├── zhangshu-write-manuscript/            # F-08 报告生成
├── zhangshu-format-references/           # F-09 文献格式化
├── zhangshu-match-journals/              # F-10 期刊推荐
├── zhangshu-ethics-registration/         # F-11 伦理注册与合规材料
└── zhangshu-manage-study-execution/      # F-12 研究执行与随访管理
```

每个 Skill 的标准目录：

```text
skill-name/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
├── scripts/
└── assets/
```

---

## 3. Skills 总览

| ID | Skill | 中文名称 | 核心职责 | 主要产物 |
|---|---|---|---|---|
| ORCH | `zhangshu-research-orchestrator` | 科研任务总编排 | 判断入口节点、拆分任务、管理风险确认和产物依赖 | Task Plan、Manifest |
| F-01 | `zhangshu-plan-topic` | 选题规划 | 热点挖掘、PICOS 草案、创新可行性评分、选题方案 | Research Brief、PICOS |
| F-02 | `zhangshu-review-literature` | 文献综述 | 综述协议、检索、筛选、证据提取、质量评价、综述写作 | Evidence Set、Review Package |
| F-03 | `zhangshu-design-study` | 研究设计 | 研究类型、样本量、偏倚控制、CRF、Protocol | Study Design Package |
| F-04 | `zhangshu-clean-clinical-data` | 数据清洗 | 数据画像、缺失/异常/逻辑问题、清洗计划和新版本 | Dataset Version |
| F-05 | `zhangshu-route-statistics` | 算法推荐 | 方法选择、约束过滤、变量映射、Analysis Plan | Analysis Plan |
| F-06 | `zhangshu-run-statistical-analysis` | 统计分析 | 环境审计、脚本审计、模型执行、结果验证、可复现包 | Verified Result、Code Package |
| F-07 | `zhangshu-create-scientific-figures` | 统计绘图 | 期刊级科研图、图注、绘图代码、导出包 | Figure Asset |
| F-08 | `zhangshu-write-manuscript` | 报告生成 | IMRAD、Cover Letter、声明材料、审稿回复、合规检查 | Manuscript、Response Letter |
| F-09 | `zhangshu-format-references` | 文献格式化 | DOI/PMID 修复、去重、作者消歧、期刊格式 | Reference Set |
| F-10 | `zhangshu-match-journals` | 期刊推荐 | 选刊、投稿包检查、决定信解析、改投、接收后清单 | Submission Plan |
| F-11 | `zhangshu-ethics-registration` | 伦理注册 | 伦理审查类型、知情同意、隐私治理、临床注册字段 | Ethics Package |
| F-12 | `zhangshu-manage-study-execution` | 研究执行管理 | 招募、入组、随访、CRF 质控、方案偏离、监查报告 | Monitoring Report |

---

## 3.1 论文流程调用顺序

> F 编号用于能力治理和文件命名，真实汇报与 Agent 编排应按照论文/临床科研流程调用。

| 流程顺序 | 调用 Skill | 业务节点 | 上游依赖 | 下游产物 |
|---:|---|---|---|---|
| 1 | F-01 | 选题规划 | 用户方向、疾病、数据条件 | Research Brief、PICOS |
| 2 | F-02 | 文献综述 | 题目/PICOS/文献材料 | Evidence Set、Review Package |
| 3 | F-03 | 研究设计 | Research Brief、Evidence Set | Study Protocol、CRF、样本量 |
| 4 | F-11 | 伦理注册 | Protocol、CRF、数据来源 | Ethics Package、Registration Draft |
| 5 | F-12 | 研究执行管理 | Protocol、伦理路径、执行计划 | Recruitment Plan、Monitoring Report |
| 6 | F-04 | 数据清洗 | 原始数据、数据字典、CRF | Dataset Version、Cleaning Log |
| 7 | F-05 | 算法推荐 | Protocol、清洗数据、分析目标 | Analysis Plan |
| 8 | F-06 | 统计分析 | Approved Analysis Plan、Dataset Version | Verified Result、Code Package |
| 9 | F-07 | 统计绘图 | Verified Result | Figure Asset、图注 |
| 10 | F-08 | 报告生成 | 方案、证据、结果、图表 | Manuscript、Cover Letter、Response Letter |
| 11 | F-09 | 文献格式化 | Manuscript、Reference Set | 格式化引用、冲突报告 |
| 12 | F-10 | 期刊推荐 | Manuscript、引用、投稿偏好 | Submission Plan、投稿包清单 |

---

## 4. 新增与增强内容

### 4.1 新增 F-11：伦理注册与合规材料

目录：

```text
zhangshu-ethics-registration/
├── SKILL.md
├── agents/openai.yaml
├── references/
│   ├── ethics-review-rules.md
│   ├── privacy-and-consent.md
│   └── registration-fields.md
└── assets/
    ├── ethics-checklist-template.md
    └── registration-fields-template.json
```

工具：

| 工具 | 作用 |
|---|---|
| `classify_ethics_review_type` | 判断完整审查、快速审查、豁免/备案或需人工判断 |
| `generate_ethics_submission_checklist` | 生成伦理递交材料清单 |
| `draft_informed_consent` | 起草知情同意书框架 |
| `validate_privacy_deidentification_plan` | 检查脱敏、授权、保留期限和访问控制 |
| `prepare_trial_registration_fields` | 生成临床注册字段草案 |
| `check_registration_consistency` | 检查注册信息与 Protocol 是否一致 |
| `export_ethics_package` | 导出伦理材料包 |

### 4.2 新增 F-12：研究执行与随访管理

目录：

```text
zhangshu-manage-study-execution/
├── SKILL.md
├── agents/openai.yaml
├── references/
│   ├── recruitment-followup-rules.md
│   └── site-qc-rules.md
└── assets/
    ├── monitoring-report-template.md
    └── screening-log-template.csv
```

工具：

| 工具 | 作用 |
|---|---|
| `build_recruitment_plan` | 根据研究设计生成招募计划 |
| `track_recruitment_funnel` | 统计筛查、入组、排除、失访、完成随访人数 |
| `generate_followup_schedule` | 生成随访计划和窗口 |
| `audit_followup_deviation` | 识别超窗、漏访、失访和方案偏离 |
| `build_site_qc_plan` | 生成单中心/多中心数据质控计划 |
| `generate_monitoring_report` | 输出研究执行监查报告 |

### 4.3 增强 F-06：统计环境、代码和可复现审计

新增工具：

| 工具 | 作用 |
|---|---|
| `validate_statistical_environment` | 检查 R/Python 版本、包版本和运行环境 |
| `audit_analysis_script` | 审计脚本路径、随机种子、数据修改和结果映射 |
| `link_code_to_result_items` | 将每个结果与脚本、参数、数据版本绑定 |
| `generate_reproducible_run_manifest` | 生成可复现运行清单 |
| `package_analysis_code` | 打包脚本、依赖、日志和结果引用 |

### 4.4 增强 F-08：投稿文书、声明和审稿回复

新增工具：

| 工具 | 作用 |
|---|---|
| `plan_manuscript_structure` | 规划论文结构、字数和缺失资产 |
| `draft_cover_letter` | 生成 Cover Letter |
| `draft_author_contribution_statement` | 生成作者贡献声明 |
| `draft_conflict_of_interest_statement` | 生成利益冲突声明 |
| `draft_data_availability_statement` | 生成数据可得性声明 |
| `draft_ethics_statement` | 生成伦理声明 |
| `build_response_letter_matrix` | 将审稿意见拆成逐条回复矩阵 |

### 4.5 增强 F-10：投稿包、决定信和接收后流程

新增工具：

| 工具 | 作用 |
|---|---|
| `build_submission_checklist` | 根据目标期刊生成投稿清单 |
| `validate_submission_package` | 检查稿件、图表、补充材料、声明和引用是否齐全 |
| `parse_editor_decision_letter` | 解析接收、修改、拒稿、转投建议 |
| `build_post_acceptance_checklist` | 生成版权、APC、清样、Online First 检查清单 |
| `check_apc_and_oa_risk` | 核查版面费、OA 政策和疑似掠夺风险 |

---

## 5. 统一红线

- 不编造文献、数据、统计数值、伦理批准、注册号、期刊指标或投稿状态。
- 不把 AI 推断描述为已验证事实。
- 不绕过领域工具直接产生正式科研结果。
- 正式统计数值只能来自 `Verified Result`。
- R2/R3 动作必须获得用户明确确认。
- 动态外部信息必须保存来源和更新时间。
- 外部系统动作，如伦理提交、投稿提交、APC 支付、版权签署、患者联系，默认只生成清单或草案；自动执行需要连接器、权限、日志和 R3 强确认。

---

## 6. 路由顺序

```text
用户输入
  → zhangshu-research-orchestrator
  → 判断 entry_node / available_assets / missing_assets / risk_level
  → 选择 F-01～F-12 主 Skill
  → 补调必要上游 Skill
  → R2/R3 确认
  → 工具链执行
  → 产物登记
  → 推荐下一步
```

---

## 7. 当前已落地文件

- `zhangshu-skills/技能目录.md`
- `zhangshu-skills/zhangshu-research-orchestrator/SKILL.md`
- `zhangshu-skills/zhangshu-research-orchestrator/references/task-routing.md`
- `zhangshu-skills/zhangshu-write-manuscript/`
- `zhangshu-skills/zhangshu-ethics-registration/`
- `zhangshu-skills/zhangshu-manage-study-execution/`
- `论文知识图谱问题_Agent路由与Skills工具映射.md`
- `领创科研常见问题_Skills与Tools覆盖审计.md`
- `论文知识图谱_Agent入口路由鱼骨图汇报.html`
