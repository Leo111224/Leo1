# SKILLS_demo 对现有掌术 Skills 的优化同步报告

## 1. 总体结论

`SKILLS_demo` 更像一组细粒度科研能力样例，覆盖文献、伦理、随机化、Meta、数据探索、生存分析、引用、投稿、盲审和汇报等能力。掌术当前已经按完整科研流程拆成 F-01～F-12，因此不建议把 demo 包原样新增为独立 Skill；更合理的方式是把 demo 能力吸收到现有业务 Skill 的工具链和资源文档中。

本轮已落地的核心改造：F-03 研究设计从 6 个粗粒度工具升级为 15 个可审计工具，并补齐脚本与模板。

## 2. 已同步文件

| 文件 | 同步内容 |
|---|---|
| `zhangshu-skills/zhangshu-design-study/SKILL.md` | 研究设计 Skill 已升级为完整 Study Design Package 工作流 |
| `zhangshu-skills/zhangshu-design-study/scripts/` | 新增 PICOS 校验、设计路由、样本量计算、Protocol 校验脚本 |
| `zhangshu-skills/zhangshu-design-study/assets/` | 新增 Protocol、CRF、样本量报告、访视表模板 |
| `掌术AI科研工作站_Agent任务设计.md` | F-03 Agent 工具清单与执行流程同步为 15 工具版本 |
| `掌术AI科研工作站_功能规划PRD.md` | F-03 功能范围、产物、设计边界同步更新 |
| `skills内容.md` | 工具总数更新为 76，并新增 demo 吸收矩阵 |
| `src/data.ts` | 网站任务数据同步 F-03 新版工具链 |
| `掌术AI_Skills架构汇报.html` | Skills 鱼骨图同步 F-03 新版工具链 |
| `掌术AI科研工作站_Agent设计汇报.html` | Agent 汇报页同步 F-03 新版工具链 |
| `zhangshu-skills/技能目录.md` | 技能目录同步 F-03 核心产物 |
| `zhangshu-skills/zhangshu-research-orchestrator/references/task-routing.md` | 总编排路由同步 F-03 输入输出 |

## 3. demo 能力归并建议

| demo 能力 | 建议归并 | 重新设计后的掌术能力 |
|---|---|---|
| 期刊最新 issue、引用追踪、临床试验匹配 | F-01 选题规划 | 热点不只看关键词，还结合期刊议题、引用前沿和试验空白 |
| 系统评价、Meta 协议、QUADAS-2、全文精读 | F-02 文献综述 | 强化 Review Protocol、质量评价、全文定位和 Meta 交接 |
| 随机化、适应性试验、IRB、知情同意、方法学抽取 | F-03 研究设计 | 已落地为设计路由、CRF、伦理治理、样本量和 Protocol 校验 |
| EDA、PyHealth、生存分析、因果中介 | F-05/F-06 算法推荐与统计执行 | 进入算法注册表和确定性执行器，LLM 只解释不计算正式数值 |
| EDA、可复现性检查 | F-04 数据清洗 | 强化数据画像、影响预览、版本差异和 manifest |
| 森林图、Meta 敏感性分析、病理 ROI | F-07 科研制图 | 扩展图形类型，但必须绑定 Verified Result |
| 方法写作、学术规范、盲审脱敏、回复信、Word 读写 | F-08 报告生成 | 扩展 Methods、合规、盲审版、Response Letter 和导出 |
| 引用管理、论文检索、PMC 下载、OA 查找 | F-09 文献格式化 | 强化 DOI/PMID/OA/全文来源和引用完整性 |
| 期刊推荐、OA、预算说明 | F-10 期刊推荐 | 强化 scope、费用、OA、风险和投稿梯队 |

## 4. 本轮重点工具重设计：F-03

| 阶段 | 工具 | 作用 |
|---|---|---|
| 问题解析 | `parse_clinical_research_question` | 把自然语言、Research Brief 或 Evidence Set 转成结构化研究问题 |
| 目标分类 | `classify_study_objective` | 判断诊断、疗效、病因、预后、预测、描述或真实世界比较 |
| 设计路由 | `route_study_design` | 生成研究设计候选、适用理由、排除理由和报告规范 |
| 逻辑校验 | `validate_design_logic` | 检查时间顺序、对照、结局、伦理和可行性冲突 |
| 方案细化 | `define_eligibility_criteria` | 生成纳排标准 |
| 方案细化 | `define_intervention_exposure_control` | 定义干预/暴露/对照和窗口期 |
| 方案细化 | `define_outcome_estimand` | 定义主要结局、时间窗和估计目标 |
| 执行计划 | `build_schedule_of_activities` | 生成访视与活动时间表 |
| 确定性计算 | `calculate_sample_size` | 计算样本量、事件数和敏感性场景 |
| 风险控制 | `build_bias_control_plan` | 生成偏倚控制措施 |
| 统计交接 | `draft_statistical_analysis_framework` | 为 F-05 生成分析框架 |
| 数据采集 | `generate_crf_schema` | 生成 CRF 字段、单位、编码和敏感级别 |
| 合规治理 | `assess_ethics_and_data_governance` | 检查伦理、授权、脱敏、注册和阻断项 |
| 文档生成 | `compose_study_protocol` | 生成 Protocol、Synopsis 和附录 |
| 正式校验 | `validate_study_protocol` | 检查章节一致性、必填项和确认状态 |

## 5. 后续建议

1. 下一轮优先改造 F-05/F-06：把 `survival-analysis-km`、`pyhealth`、`bio-causal-genomics-mediation-analysis`、`meta-results-*` 收敛到算法注册表和执行器。
2. 再改造 F-08/F-09/F-10：吸收盲审、回复信、Word、引用管理、OA 和期刊推荐能力。
3. demo 中的 PPT 和格式整理能力建议放在汇报/导出层，不进入科研核心 Agent 链路。
