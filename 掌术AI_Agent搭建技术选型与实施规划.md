# 掌术 AI Agent 搭建技术选型与实施规划

> 目标：基于现有前端、PRD、Agent 任务设计和 `zhangshu-skills`，搭建一个可演示、可扩展、可审计的临床科研 Agent 工作站。

---

## 1. 当前项目判断

### 1.1 已具备的基础

当前项目已经具备一个很好的 MVP 外壳：

| 模块 | 当前状态 | 判断 |
|---|---|---|
| 前端框架 | React 19 + Vite 6 + TypeScript | 可以继续沿用 |
| 后端框架 | Express + TypeScript + Node 22 | 适合 MVP，后续可演进为模块化 API 服务 |
| Agent 接口 | `/api/agent/run` | 目前是单次请求/响应式演示接口 |
| 模型接入 | `@google/genai` + Gemini key | 可保留为备用 Provider，但建议切到 OpenAI Agent/Responses 主链 |
| 产品数据 | `src/data.ts` 已包含 F-01～F-12 | 可作为前端演示数据源 |
| Skills | `zhangshu-skills/` 已形成 1 个总编排 + 12 个业务 Skill | 可以作为 Agent 能力注册表 |
| 风险分级 | R0～R3 已定义 | 适合做 Human-in-the-loop 门禁 |
| 部署材料 | `Dockerfile`、`render.yaml`、`server.ts` | 适合优先部署到 Render |

### 1.2 当前最大缺口

现在的项目更像“Agent 产品展示页 + 简单模型接口”，还不是完整 Agent 系统。主要缺口是：

1. 没有真正的 Agent Runtime。
2. 没有 Tool Registry。
3. Skills 还没有被后端读取和执行。
4. 没有项目/产物/运行记录数据库。
5. 没有流式输出。
6. 没有 R2/R3 人工确认状态机。
7. 没有真实工具执行隔离层。
8. 没有审计日志和版本化产物。

所以技术路线应当是：先搭“可信 Agent 编排底座”，再逐步接入 F-01～F-12 对应工具。

---

## 2. 总体技术选型结论

### 2.1 推荐技术栈

| 层级 | 推荐选型 | 原因 |
|---|---|---|
| 前端 | React 19 + Vite + TypeScript | 现有项目已使用；Vite 适合 SPA 快速迭代 |
| UI 状态 | React 内置状态 + Zustand | Agent 工作台有大量本地 UI 状态，用 Zustand 简洁 |
| 服务端状态 | TanStack Query | 适合管理 Agent Run、项目、产物、异步轮询和缓存 |
| 表单校验 | React Hook Form + Zod | 临床科研任务输入复杂，必须有结构化校验 |
| 后端 API | Express + TypeScript，短期沿用 | 当前已存在，MVP 不必重构 |
| Agent Runtime | OpenAI Responses API + 自研 Orchestrator，后续升级 OpenAI Agents SDK | 先稳住工具、门禁和产物状态；复杂 handoff/trace 再引入 SDK |
| 模型 Provider | OpenAI 为主，Gemini 作为可选 Provider | Agent、工具调用、结构化输出和长链路更适合用 Responses/Agents |
| 工具协议 | 本地 Function Tools + 后续 MCP | 先把 F-01～F-12 工具做成本地白名单函数；成熟后开放为 MCP |
| 数据库 | PostgreSQL + Prisma | 项目、产物、Run、审计日志都需要强结构化和可追溯 |
| 文件存储 | S3/R2/MinIO 兼容对象存储 | 存放 PDF、CSV、DOCX、图表、导出包 |
| 异步任务 | BullMQ + Redis | 统计分析、文献检索、导出包等长任务需要队列 |
| 部署 | MVP 用 Render 单体部署；生产拆为 Vercel 前端 + Render/Fly/Cloud Run 后端 | 你现在已有 Render 配置，最快可上线 |

### 2.2 核心判断

短期不要上来就做复杂多 Agent 微服务。你的系统最重要的不是“Agent 多”，而是：

- 工具边界清楚；
- 产物能版本化；
- R2/R3 能卡住；
- 统计数值不由 LLM 编造；
- Skills 能被稳定路由。

所以建议 MVP 使用“单 Agent 编排器 + 多 Skill 工具注册表”的方式。

---

## 3. 参考依据与外部框架调研

### 3.1 OpenAI Responses API

OpenAI 官方将 Responses API 定位为新的 API primitive，适合构建 agent-like 应用；官方迁移文档也明确建议新项目使用 Responses API，并支持工具调用、多轮状态、内置工具和 MCP 等能力。  
来源：OpenAI Developers - Migrate to Responses API：<https://developers.openai.com/api/docs/guides/migrate-to-responses>

对掌术 AI 的意义：

- 适合做多轮科研任务；
- 适合接 Function Tools；
- 适合未来接 web search、file search、code interpreter、remote MCP；
- 支持状态化上下文，方便项目连续推进。

### 3.2 Function Calling / Structured Outputs

OpenAI 官方建议使用 Structured Outputs 保证 schema adherence，而不仅是 JSON mode。  
来源：OpenAI Developers - Structured Outputs：<https://developers.openai.com/api/docs/guides/structured-outputs>

对掌术 AI 的意义：

- Agent 输出必须是结构化产物；
- 不能只让模型“写一段话”；
- F-01～F-12 每个任务都应有固定 JSON Schema；
- 所有工具输入输出都应可校验。

### 3.3 OpenAI Agents SDK JS

OpenAI Agents SDK JS 官方文档覆盖 Agents、Tools、Guardrails、Streaming、Handoffs、Human-in-the-loop、Sessions、MCP、Tracing 等模块。  
来源：OpenAI Agents SDK TypeScript：<https://openai.github.io/openai-agents-js/>

对掌术 AI 的意义：

- 后续可以把 F-01～F-12 做成真正的 Agent/Handoff；
- Human-in-the-loop 可对应 R2/R3；
- Tracing 可对应审计日志；
- Sessions 可对应项目会话。

建议：不要 MVP 第一阶段就完全依赖 SDK。先用 Responses API + 自研状态机打好业务底座；当工具和产物稳定后，再把 Runtime 升级到 Agents SDK。

### 3.4 MCP

MCP 是给模型/Agent 暴露工具和上下文的协议。官方介绍把 MCP 定位为连接模型与外部工具、数据源的标准方式。  
来源：Model Context Protocol：<https://modelcontextprotocol.io/docs/getting-started/intro>

对掌术 AI 的意义：

- 未来可把 `zhangshu-skills` 包装成 MCP Server；
- 外部系统如文献库、数据集、医院内部平台、对象存储都可通过 MCP 接入；
- 但 MVP 阶段建议先做本地工具注册表，不急于 MCP 化。

### 3.5 React 19 / Vite / TanStack Query

React 19 官方强调 Actions、表单提交状态、乐观更新等能力，适合复杂交互应用。  
来源：React 19：<https://react.dev/blog/2024/12/05/react-19>

Vite 官方定位是快速开发服务器和构建工具，当前项目已使用 Vite。  
来源：Vite Guide：<https://vite.dev/guide/>

TanStack Query 官方定位是管理异步/服务端状态，适合 API 请求、缓存和异步状态同步。  
来源：TanStack Query Overview：<https://tanstack.com/query/latest/docs/framework/react/overview>

对掌术 AI 的意义：

- React 负责工作台交互；
- TanStack Query 负责项目、运行、产物、确认状态；
- Zustand 负责当前选中任务、面板展开、草稿等本地 UI 状态。

---

## 4. 推荐系统架构

### 4.1 MVP 架构

```text
React/Vite 前端
  ├─ Agent Workspace
  ├─ Skill Catalog
  ├─ Artifact Panel
  ├─ Confirmation Gate
  └─ Run Timeline

Express API
  ├─ Agent Orchestrator
  ├─ Skill Registry
  ├─ Tool Registry
  ├─ Risk Gate Engine
  ├─ Artifact Service
  ├─ Audit Log Service
  └─ Model Provider Adapter

Storage
  ├─ PostgreSQL：项目、运行、产物、确认、审计
  ├─ Object Storage：PDF、CSV、图表、Word、导出包
  └─ Redis/BullMQ：长任务队列

External Providers
  ├─ OpenAI Responses API
  ├─ Gemini Provider 可选
  ├─ 文献/期刊/数据库接口
  └─ 后续 MCP Server
```

### 4.2 生产级架构

```text
Vercel / CDN
  └─ React Frontend

API Service
  ├─ Auth / RBAC
  ├─ Agent Runtime
  ├─ Skill & Tool Registry
  ├─ Artifact Service
  └─ Audit Service

Worker Service
  ├─ 文献检索任务
  ├─ 数据清洗任务
  ├─ 统计执行任务
  ├─ 图表渲染任务
  └─ 导出任务

Data Layer
  ├─ PostgreSQL
  ├─ Redis
  ├─ S3/R2/MinIO
  └─ Vector DB / File Search 后续接入
```

---

## 5. 前端 React 改造规划

### 5.1 页面结构

建议把当前单页展示改造成真正的 Agent 工作台：

```text
src/
  app/
    App.tsx
    routes.tsx
  pages/
    DashboardPage.tsx
    AgentWorkspacePage.tsx
    SkillsPage.tsx
    ProjectPage.tsx
    ArtifactPage.tsx
    RunsPage.tsx
  features/
    agent/
      AgentChat.tsx
      AgentRunPanel.tsx
      ConfirmationGate.tsx
      RunTimeline.tsx
      agent.api.ts
      agent.store.ts
    skills/
      SkillCatalog.tsx
      SkillDetail.tsx
      skills.api.ts
    artifacts/
      ArtifactList.tsx
      ArtifactViewer.tsx
      artifact.api.ts
    projects/
      ProjectSelector.tsx
      project.api.ts
  components/
    ui/
    layout/
  lib/
    apiClient.ts
    queryClient.ts
    schemas.ts
```

### 5.2 前端核心组件

| 组件 | 作用 |
|---|---|
| `AgentWorkspacePage` | 主工作台，左侧任务/Skill，右侧对话和结果 |
| `AgentChat` | 用户输入、流式输出、模型状态 |
| `SkillCatalog` | 展示 1+10 Skills，支持按阶段筛选 |
| `RunTimeline` | 展示 Agent 每一步：计划、工具、等待确认、完成 |
| `ConfirmationGate` | R2/R3 确认卡片，显示风险、影响、确认按钮 |
| `ArtifactPanel` | 展示 Research Brief、PICOS、Protocol、Analysis Plan 等产物 |
| `ToolCallCard` | 展示工具名称、输入摘要、输出状态、失败原因 |
| `ExportPanel` | 导出 Markdown、Word、PDF、ZIP |

### 5.3 状态管理

建议分三类：

| 状态类型 | 工具 | 示例 |
|---|---|---|
| 服务端状态 | TanStack Query | 项目列表、运行记录、产物列表 |
| 本地 UI 状态 | Zustand | 当前选中 Skill、面板展开、草稿输入 |
| 表单状态 | React Hook Form + Zod | 研究需求、样本量参数、确认表单 |

### 5.4 前端交互流程

```text
用户选择 Skill 或输入自然语言
  ↓
前端创建 Agent Run
  ↓
后端返回 Run ID，并开始流式输出
  ↓
前端展示计划、工具调用、产物草案
  ↓
如果遇到 R2/R3，显示 ConfirmationGate
  ↓
用户确认/修改/拒绝
  ↓
后端继续执行或生成新版本
  ↓
最终登记 Artifact
```

### 5.5 流式输出

推荐用 SSE：

- 前端：`EventSource` 或 `fetch` readable stream。
- 后端：`GET /api/agent/runs/:runId/events`。
- 事件类型：
  - `run.started`
  - `plan.created`
  - `tool.started`
  - `tool.completed`
  - `gate.required`
  - `artifact.created`
  - `run.completed`
  - `run.failed`

SSE 比 WebSocket 简单，足够满足 Agent 运行状态推送。

---

## 6. 后端 Agent 设计

### 6.1 后端目录建议

```text
server/
  index.ts
  routes/
    agent.routes.ts
    skill.routes.ts
    project.routes.ts
    artifact.routes.ts
  agent/
    orchestrator.ts
    planner.ts
    runtime.ts
    riskGate.ts
    prompts.ts
    providers/
      openai.provider.ts
      gemini.provider.ts
  skills/
    skillLoader.ts
    skillRegistry.ts
    skillRouter.ts
  tools/
    toolRegistry.ts
    toolSchemas.ts
    handlers/
      f01-topic.tools.ts
      f02-literature.tools.ts
      f03-design.tools.ts
      ...
  artifacts/
    artifactService.ts
    artifactSchemas.ts
  audit/
    auditService.ts
  db/
    prisma.ts
```

### 6.2 Agent Runtime 分层

| 层 | 职责 |
|---|---|
| `Orchestrator` | 判断进入哪个 Skill，维护 Run 状态 |
| `Planner` | 生成任务计划和工具调用顺序 |
| `SkillRouter` | 从 F-01～F-12 选择合适 Skill |
| `ToolRegistry` | 白名单工具、输入输出 Schema、风险等级 |
| `RiskGate` | 判断 R0～R3，暂停或继续 |
| `ArtifactService` | 产物版本化保存 |
| `AuditService` | 记录每次输入、工具、确认、输出 |
| `ProviderAdapter` | OpenAI/Gemini 等模型适配 |

### 6.3 核心状态机

```text
CREATED
  → PLANNING
  → WAITING_CONFIRMATION
  → RUNNING_TOOL
  → VALIDATING_OUTPUT
  → CREATING_ARTIFACT
  → COMPLETED

异常状态：
  → BLOCKED
  → FAILED
  → CANCELLED
```

### 6.4 R0～R3 风险门禁

| 等级 | 系统处理 |
|---|---|
| R0 | 直接执行，记录日志 |
| R1 | 可生成草案，执行后提示用户确认 |
| R2 | 执行前暂停，必须用户确认 |
| R3 | 执行前强确认，并检查权限、版本、合规状态 |

实现上建议：

```ts
type RiskLevel = "R0" | "R1" | "R2" | "R3";

type ToolDefinition = {
  name: string;
  skillId: string;
  risk: RiskLevel;
  inputSchema: unknown;
  outputSchema: unknown;
  handler: ToolHandler;
};
```

---

## 7. Skills 接入方案

### 7.1 Skills 不直接等于工具

`SKILL.md` 是 Agent 的能力说明和工作流，不应该被前端直接执行。正确拆法是：

```text
Skill = 任务能力包
Tool = 可调用原子动作
Reference = 规则/知识
Asset = 输出模板
Script = 确定性执行逻辑
```

### 7.2 Skill Loader

后端启动时读取：

```text
zhangshu-skills/
  zhangshu-research-orchestrator/
  zhangshu-plan-topic/
  ...
```

解析内容：

- `SKILL.md` frontmatter：name、description；
- `agents/openai.yaml`：展示名称、默认 prompt；
- `references/`：按需加载；
- `scripts/`：登记可执行脚本；
- `assets/`：登记模板路径。

### 7.3 Tool Registry

先不要自动从 Markdown 里“猜工具”。建议手写工具注册表，保证可控：

```text
tools/
  f01-topic.tools.ts
  f02-literature.tools.ts
  f03-design.tools.ts
  ...
```

每个工具必须有：

- name；
- skillId；
- description；
- input schema；
- output schema；
- risk level；
- handler；
- timeout；
- audit policy。

### 7.4 F-03 示例

```text
zhangshu-design-study
  ├─ parse_clinical_research_question
  ├─ classify_study_objective
  ├─ route_study_design
  ├─ validate_design_logic
  ├─ calculate_sample_size
  ├─ generate_crf_schema
  └─ validate_study_protocol
```

其中：

- `route_study_design` 可先调用本地 TypeScript 规则；
- `calculate_sample_size` 必须调用确定性脚本或服务；
- `compose_study_protocol` 可调用模型生成草案；
- `validate_study_protocol` 必须结构化校验。

---

## 8. 模型与 Agent 选型

### 8.1 推荐路线

| 阶段 | 模型/框架 | 用途 |
|---|---|---|
| MVP | OpenAI Responses API | 工具调用、结构化输出、流式回答 |
| Beta | Responses API + 本地 Orchestrator | 完整 R0～R3、产物版本、审计 |
| Production | OpenAI Agents SDK JS | Handoff、Tracing、Sessions、Human-in-the-loop |
| 多 Provider | Provider Adapter | 保留 Gemini/本地模型作为备用 |

### 8.2 为什么不直接用 LangChain/LangGraph

LangGraph 适合复杂状态图，但你现在已经有明确的 F-01～F-12 业务流程、Skills、风险等级和产物契约。过早引入 LangGraph 会增加抽象成本。

建议：

- MVP 不引入 LangChain/LangGraph；
- 先把业务状态机写清楚；
- 如果后续出现复杂循环、多 Agent 互相 handoff、可视化 DAG 编排，再评估 LangGraph。

### 8.3 Prompt 组织方式

每次 Agent Run 组装 prompt：

```text
System:
  掌术 AI 通用边界
  R0-R3 风险规则
  禁止编造规则

Skill:
  当前 Skill 的 SKILL.md 摘要
  必要 references
  可用 tools

Project:
  当前项目产物
  用户偏好
  数据集摘要

User:
  用户本轮输入
```

注意：不要每次把所有 Skills 全塞进上下文。先由 Orchestrator 路由，再加载对应 Skill。

---

## 9. 数据库设计

### 9.1 核心表

| 表 | 作用 |
|---|---|
| `users` | 用户 |
| `projects` | 科研项目 |
| `skills` | Skill 元数据 |
| `tools` | Tool 元数据 |
| `agent_runs` | 每次 Agent 运行 |
| `run_events` | 流式事件和审计 |
| `confirmations` | R2/R3 确认记录 |
| `artifacts` | Research Brief、PICOS、Protocol 等产物 |
| `artifact_versions` | 产物版本 |
| `files` | 上传文件和导出文件 |
| `datasets` | 数据集版本摘要 |

### 9.2 Artifact 类型

建议统一：

```ts
type ArtifactType =
  | "ResearchBrief"
  | "PICOSProfile"
  | "ReviewProtocol"
  | "EvidenceSet"
  | "StudyProtocol"
  | "AnalysisPlan"
  | "DatasetVersion"
  | "AnalysisRun"
  | "VerifiedResult"
  | "FigureAsset"
  | "Manuscript"
  | "ReferenceSet"
  | "SubmissionPlan";
```

---

## 10. API 设计

### 10.1 Agent API

| API | 方法 | 作用 |
|---|---|---|
| `/api/agent/runs` | POST | 创建 Agent Run |
| `/api/agent/runs/:id` | GET | 获取 Run 状态 |
| `/api/agent/runs/:id/events` | GET | SSE 流式事件 |
| `/api/agent/runs/:id/confirm` | POST | 提交 R2/R3 确认 |
| `/api/agent/runs/:id/cancel` | POST | 取消运行 |

### 10.2 Skill API

| API | 方法 | 作用 |
|---|---|---|
| `/api/skills` | GET | 获取 Skill 目录 |
| `/api/skills/:id` | GET | 获取 Skill 详情 |
| `/api/skills/:id/tools` | GET | 获取工具列表 |

### 10.3 Artifact API

| API | 方法 | 作用 |
|---|---|---|
| `/api/projects/:id/artifacts` | GET | 获取项目产物 |
| `/api/artifacts/:id` | GET | 获取产物详情 |
| `/api/artifacts/:id/versions` | GET | 获取版本 |
| `/api/artifacts/:id/export` | POST | 导出 |

---

## 11. 部署选型

### 11.1 MVP：Render 单体部署

当前项目已经有：

- `Dockerfile`
- `render.yaml`
- `server.ts`
- `npm run build`
- `npm run start`

所以最短路径是：

```text
Render Web Service
  ├─ build: npm install && npm run build
  ├─ start: npm run start
  ├─ env: OPENAI_API_KEY / DATABASE_URL / REDIS_URL
  └─ add-on: Render PostgreSQL
```

优点：

- 最快上线；
- 前后端同域，少处理 CORS；
- Express 和静态前端一起部署；
- 适合演示和 MVP。

缺点：

- 长任务和统计执行不适合长期放在 Web Service；
- 后续需要拆 Worker。

### 11.2 生产：前后端分离

推荐：

```text
Vercel
  └─ React/Vite 前端

Render / Fly.io / Cloud Run
  └─ Agent API

Redis + Worker
  └─ 长任务

PostgreSQL
  └─ 项目和审计数据

S3/R2
  └─ 文件和导出包
```

### 11.3 不推荐的部署方式

| 方式 | 不推荐原因 |
|---|---|
| 纯前端部署 | API Key 泄露，无法做审计和工具执行 |
| Serverless-only | 长任务、SSE、统计执行和文件处理容易受限制 |
| 所有工具都在 LLM 里 | 无法保证统计数值和医疗科研合规 |

---

## 12. 实施路线图

### Phase 0：技术底座整理，1～2 天

目标：把项目从“演示接口”整理成“可扩展后端”。

任务：

1. 把 `server.ts` 拆成 `server/` 目录。
2. 加入统一 API response。
3. 加入 `zod` 校验。
4. 建立 `SkillRegistry`，读取 `zhangshu-skills`。
5. 建立 `ToolRegistry`，先注册 F-01、F-03、F-04 少量工具。
6. 保留现有页面，先不大改 UI。

验收：

- `/api/skills` 能返回 1+10 Skill。
- `/api/agent/runs` 能创建 Run。
- Run 有状态。

### Phase 1：Agent MVP，3～5 天

目标：跑通一个完整 Skill，例如 F-03 研究设计。

任务：

1. 接入 OpenAI Responses API。
2. 实现结构化输出。
3. 实现 F-03 工具链：
   - parse question；
   - route design；
   - validate PICOS；
   - calculate sample size；
   - compose protocol。
4. 实现 R2 确认门禁。
5. 前端做 Agent Workspace。

验收：

- 用户输入研究问题；
- Agent 生成设计候选；
- R2 暂停确认；
- 用户确认后生成 Study Protocol 草案；
- 产物登记为 Artifact。

### Phase 2：项目与产物系统，5～7 天

目标：让 Agent 结果可以保存、版本化、回看。

任务：

1. 接 PostgreSQL + Prisma。
2. 建立 Project / Artifact / Run / Confirmation / Audit 表。
3. 前端增加 ProjectPage、ArtifactPanel、RunTimeline。
4. 实现导出 Markdown。

验收：

- 每次 Agent Run 可追溯；
- 每个产物有版本；
- R2/R3 确认有记录。

### Phase 3：统计与文件能力，1～2 周

目标：把“可信计算”做出来。

任务：

1. 接 BullMQ + Redis。
2. 把数据清洗/统计执行放到 Worker。
3. 接对象存储。
4. F-04/F-05/F-06/F-07 开始真实工具执行。
5. Figure Asset 与 Verified Result 绑定。

验收：

- 上传数据；
- 生成 Dataset Profile；
- 选择 Analysis Plan；
- 运行确定性统计；
- 输出 Verified Result 和 Figure Asset。

### Phase 4：完整科研链路，2～4 周

目标：打通 F-01～F-12。

优先顺序：

1. F-03 研究设计；
2. F-04 数据清洗；
3. F-05 算法推荐；
4. F-06 统计分析；
5. F-07 统计绘图；
6. F-08 报告生成；
7. F-01/F-02/F-09/F-10。

---

## 13. 建议先做的第一个 Agent

建议第一个真正落地的是：

```text
F-03 研究设计 Agent
```

原因：

- 你已经把 F-03 Skill 改得最完整；
- 它能展示 Agent 的方法学价值；
- 它有明确 R2/R3 门禁；
- 它能产出 Study Protocol，适合汇报；
- 它上接选题/文献，下接算法推荐/数据清洗。

第一个 Demo 流程：

```text
用户输入：
“我想做 NSCLC 免疫治疗相关回顾性队列，研究 irAE 与 OS 的关系，有 500 例院内数据。”

Agent：
1. 解析 PICOS
2. 判断目标为预后/真实世界比较
3. 推荐回顾性队列
4. 提示时间零点、暴露窗口、结局窗口
5. R2 确认研究设计
6. 计算样本量/事件数敏感性场景
7. 生成偏倚控制、CRF、伦理清单
8. 生成 Study Protocol 草案
```

---

## 14. 依赖安装建议

### 14.1 前端

```bash
npm install @tanstack/react-query zustand react-hook-form zod
```

可选：

```bash
npm install react-router-dom
```

### 14.2 后端

```bash
npm install openai zod prisma @prisma/client pino
npm install bullmq ioredis
```

开发依赖：

```bash
npm install -D tsx
```

### 14.3 如果接 OpenAI Agents SDK

```bash
npm install @openai/agents
```

但建议 Phase 2 或 Phase 3 再接，不要第一步就引入复杂度。

---

## 15. 最终建议

你的项目不要从“聊天机器人”角度搭建，而要从“科研任务操作系统”角度搭建。

推荐主线：

```text
React 工作台
  + Skill Registry
  + Tool Registry
  + Agent Orchestrator
  + R0-R3 Risk Gate
  + Artifact Versioning
  + Audit Log
  + Deterministic Worker
```

第一阶段只要打通：

```text
用户输入 → Skill 路由 → 工具计划 → R2 确认 → 结构化产物 → 保存记录
```

就已经从“AI 展示页”进入“真实 Agent 系统”的范畴了。

---

## 16. 推荐下一步开发任务

如果继续往下做，建议按这个顺序：

1. 新建 `server/agent`、`server/skills`、`server/tools`。
2. 实现 `/api/skills`，读取 `zhangshu-skills/技能目录.md` 和各 `SKILL.md`。
3. 实现 `/api/agent/runs`，创建 Agent Run。
4. 接 OpenAI Responses API。
5. 实现 F-03 的 5 个最小工具：
   - `parse_clinical_research_question`
   - `route_study_design`
   - `validate_design_logic`
   - `calculate_sample_size`
   - `compose_study_protocol`
6. 前端新增 Agent Workspace 和 Confirmation Gate。
7. 部署到 Render。

做到这一步，你就有了一个能真实演示的掌术 AI Agent MVP。
