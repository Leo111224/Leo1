# 任务路由

| ID | 用户目标 | 必要上游 | 主要产物 | 默认下游 |
|---|---|---|---|---|
| F-01 | 找选题、评估创新、形成 PICOS 草案 | 用户背景、疾病/领域 | Research Brief、PICOS 草案 | F-02/F-03 |
| F-02 | 定综述协议、检索筛选、评价证据、写综述 | 主题/PICOS/已有题录 | Review Protocol、Evidence Set、Review Package | F-03/F-06/F-08 |
| F-03 | 设计研究、算样本量、生成访视/CRF/伦理初筛 | Brief、Evidence、PICOS、数据约束 | Study Design Package、Protocol | F-11/F-12/F-04/F-05 |
| F-04 | 清洗临床数据、生成数据质量报告和新版本 | Dataset、字典、研究目的 | 新 Dataset Version、Cleaning Log | F-05/F-06 |
| F-05 | 推荐统计方法、生成 Analysis Plan | Protocol、数据画像 | Analysis Plan | F-06 |
| F-06 | 执行统计分析、审计环境与代码、注册 Verified Result | 已批准 Plan、数据版本 | Analysis Run、Verified Result、Code Package | F-07/F-08 |
| F-07 | 生成科研图、图注和绘图代码 | Verified Result | Figure Asset | F-08 |
| F-08 | 生成论文、投稿文书、审稿回复和合规声明 | Evidence、Result、Figure、Journal Rules | Manuscript、Cover Letter、Response Letter | F-09/F-10 |
| F-09 | 校验和格式化引用 | Reference Set、Manuscript | 新 Reference Set、冲突报告 | F-08/F-10 |
| F-10 | 推荐期刊、检查投稿包、处理改投和接收后流程 | Manuscript、偏好、Journal Rules | Submission Plan、Post-acceptance Checklist | F-08/F-09 |
| F-11 | 准备伦理审查、知情同意、隐私治理和注册字段 | Study Protocol、数据治理信息 | Ethics Package、Registration Draft | F-12/F-04 |
| F-12 | 管理招募、入组、随访、CRF 质控和监查 | Approved/Executable Protocol、站点信息 | Recruitment Plan、Monitoring Report | F-04/F-06 |

## 冲突处理

1. 用户同时要求分析和写作时，先确认是否已有 Verified Result；没有则转 F-06。
2. 用户要求绘图但只有原始数据时，先完成 F-04～F-06。
3. 用户要求正式论文但缺少证据时，先完成 F-02。
4. 用户要求伦理注册但没有稳定 Protocol 时，先完成 F-03。
5. 用户要求招募/随访管理但设计或访视窗口未确认时，先完成 F-03；涉及伦理材料时补 F-11。
6. 用户要求投稿系统提交、APC 支付、版权签署、患者联系等外部动作时，标记 R3；无连接器时只生成清单、话术或字段草案。
7. 用户明确指定任务时仍要校验必要上游，不静默跳过。

