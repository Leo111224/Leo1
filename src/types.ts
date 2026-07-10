export type ViewId = "overview" | "skills" | "agents" | "assets" | "results" | "manuscript";
export type Stage = "pre" | "mid" | "post";
export type RiskLevel = "R0" | "R1" | "R2" | "R3";

export interface AgentTool {
  name: string;
  description: string;
}

export interface AISkillParamOption {
  label: string;
  value: string;
}

export interface AISkillParam {
  id: string;
  label: string;
  type: "select" | "text" | "number";
  defaultValue: string;
  options?: AISkillParamOption[];
}

export interface AISkill {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  placeholderText: string;
  params?: AISkillParam[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  status?: "sending" | "done" | "error";
  hasArtifacts?: boolean;
}

export interface AgentTask {
  id: string;
  name: string;
  shortName: string;
  stage: Stage;
  priority: "P0" | "P1" | "P2";
  risk: RiskLevel;
  description: string;
  objective: string;
  tools: AgentTool[];
  steps: string[];
  gate: string;
  inputs: string[];
  outputs: string[];
  exceptions: string[];
  next: string[];
  prompt: string;
}

export interface ProjectArtifact {
  id: string;
  type: string;
  name: string;
  version: string;
  status: "草稿" | "已确认" | "已验证" | "待确认";
  updatedAt: string;
  source: string;
}

export interface AgentRunResponse {
  taskId: string;
  summary: string;
  findings: string[];
  nextActions: string[];
  demoMode: boolean;
}

export interface SkillDefinition {
  id: string;
  name: string;
  displayName: string;
  description: string;
  path: string;
  stage: Stage;
  taskId?: string;
  inputs: string[];
  outputs: string[];
  tools: string[];
  dependencies: string[];
  riskLevel: RiskLevel;
  references: string[];
  scripts: string[];
  assets: string[];
}

export interface SkillRegistryResponse {
  root: string;
  count: number;
  skills: SkillDefinition[];
}

export interface WorkflowNode {
  id: string;
  skillId: string;
  taskId?: string;
  label: string;
  stage: Stage;
  riskLevel: RiskLevel;
  dependencies: string[];
  enabled: boolean;
  order: number;
}

export interface AgentRunRecord {
  id: string;
  taskId: string;
  skillId?: string;
  status: "planned" | "running" | "completed" | "failed";
  summary: string;
  createdAt: string;
}

export interface ProjectManifest {
  projectId: string;
  name: string;
  goal: string;
  updatedAt: string;
  workflow: WorkflowNode[];
  artifacts: ProjectArtifact[];
  runs: AgentRunRecord[];
}
