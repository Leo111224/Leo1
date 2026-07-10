import "dotenv/config";
import express from "express";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { GoogleGenAI } from "@google/genai";

const app = express();
const port = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === "production";

app.disable("x-powered-by");
app.use(express.json({ limit: "2mb" }));

const dataDir = path.resolve(process.cwd(), ".zhangshu-data");
const manifestPath = path.join(dataDir, "project-manifest.json");

const taskNames: Record<string, string> = {
  "F-01": "选题规划",
  "F-02": "文献综述",
  "F-03": "研究设计",
  "F-04": "数据清洗",
  "F-05": "算法推荐",
  "F-06": "统计分析",
  "F-07": "统计绘图",
  "F-08": "报告生成",
  "F-09": "文献格式化",
  "F-10": "期刊推荐",
  "F-11": "伦理注册",
  "F-12": "研究执行管理",
};

const stageByTaskId: Record<string, "pre" | "mid" | "post"> = {
  "F-01": "pre",
  "F-02": "pre",
  "F-03": "pre",
  "F-04": "mid",
  "F-05": "mid",
  "F-06": "mid",
  "F-07": "mid",
  "F-08": "post",
  "F-09": "post",
  "F-10": "post",
  "F-11": "pre",
  "F-12": "mid",
};

const taskIdBySkillSlug: Record<string, string> = {
  "zhangshu-plan-topic": "F-01",
  "zhangshu-review-literature": "F-02",
  "zhangshu-design-study": "F-03",
  "zhangshu-clean-clinical-data": "F-04",
  "zhangshu-route-statistics": "F-05",
  "zhangshu-run-statistical-analysis": "F-06",
  "zhangshu-create-scientific-figures": "F-07",
  "zhangshu-write-manuscript": "F-08",
  "zhangshu-format-references": "F-09",
  "zhangshu-match-journals": "F-10",
  "zhangshu-ethics-registration": "F-11",
  "zhangshu-manage-study-execution": "F-12",
};

const riskByTaskId: Record<string, "R0" | "R1" | "R2" | "R3"> = {
  "F-01": "R1",
  "F-02": "R1",
  "F-03": "R2",
  "F-04": "R2",
  "F-05": "R2",
  "F-06": "R2",
  "F-07": "R3",
  "F-08": "R3",
  "F-09": "R3",
  "F-10": "R3",
  "F-11": "R2",
  "F-12": "R2",
};

const dependencyByTaskId: Record<string, string[]> = {
  "F-01": [],
  "F-02": ["F-01"],
  "F-03": ["F-01", "F-02"],
  "F-04": ["F-03", "F-12"],
  "F-05": ["F-03", "F-04"],
  "F-06": ["F-04", "F-05"],
  "F-07": ["F-06"],
  "F-08": ["F-02", "F-03", "F-06", "F-07"],
  "F-09": ["F-08"],
  "F-10": ["F-08", "F-09"],
  "F-11": ["F-03"],
  "F-12": ["F-03", "F-11"],
};

function parseSkillFrontmatter(content: string) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const meta: Record<string, string> = {};
  if (!match) return meta;
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    meta[key] = value;
  }
  return meta;
}

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function parseListItems(section: string, content: string) {
  const sectionMatch = content.match(new RegExp(`## ${section}\\s*\\r?\\n([\\s\\S]*?)(?=\\r?\\n## |$)`, "i"));
  if (!sectionMatch) return [];
  return sectionMatch[1]
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*[-*]\s+(.+?)\s*$/)?.[1])
    .filter((line): line is string => Boolean(line))
    .slice(0, 12);
}

async function listChildFiles(dir: string) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
  } catch {
    return [];
  }
}

async function getSkillRegistry() {
  const skillsRoot = path.resolve(process.cwd(), "zhangshu-skills");
  const entries = await fs.readdir(skillsRoot, { withFileTypes: true });
  const skills = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const skillDir = path.join(skillsRoot, entry.name);
        const skillPath = path.join(skillDir, "SKILL.md");
        const content = await fs.readFile(skillPath, "utf8");
        const meta = parseSkillFrontmatter(content);
        const taskId = taskIdBySkillSlug[entry.name];
        const displayName = taskId ? `${taskId} ${taskNames[taskId]}` : meta.name || entry.name;
        const references = await listChildFiles(path.join(skillDir, "references"));
        const scripts = await listChildFiles(path.join(skillDir, "scripts"));
        const assets = await listChildFiles(path.join(skillDir, "assets"));
        const toolMentions = uniqueSorted([
          ...Array.from(content.matchAll(/`([a-z][a-z0-9_]+)`/g), (match) => match[1]),
          ...Array.from(content.matchAll(/\$([a-z0-9-]+)/g), (match) => `$${match[1]}`),
        ]);

        return {
          id: entry.name,
          name: meta.name || entry.name,
          displayName,
          description: meta.description || "",
          path: path.relative(process.cwd(), skillPath).replace(/\\/g, "/"),
          stage: taskId ? stageByTaskId[taskId] : "pre",
          taskId,
          inputs: parseListItems("Inputs", content),
          outputs: parseListItems("Outputs", content),
          tools: toolMentions.slice(0, 18),
          dependencies: taskId ? dependencyByTaskId[taskId] || [] : [],
          riskLevel: taskId ? riskByTaskId[taskId] || "R1" : "R1",
          references,
          scripts,
          assets,
        };
      }),
  );

  const sortedSkills = skills.sort((a, b) => {
    if (a.taskId && b.taskId) return a.taskId.localeCompare(b.taskId);
    if (a.taskId) return -1;
    if (b.taskId) return 1;
    return a.id.localeCompare(b.id);
  });

  return {
    root: path.relative(process.cwd(), skillsRoot).replace(/\\/g, "/"),
    count: sortedSkills.length,
    skills: sortedSkills,
  };
}

async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

async function buildDefaultManifest() {
  const registry = await getSkillRegistry();
  const workflow = registry.skills
    .filter((skill) => skill.taskId)
    .map((skill, index) => ({
      id: `node_${skill.taskId}`,
      skillId: skill.id,
      taskId: skill.taskId,
      label: skill.displayName,
      stage: skill.stage,
      riskLevel: skill.riskLevel,
      dependencies: skill.dependencies,
      enabled: true,
      order: index + 1,
    }));

  return {
    projectId: "zs-local-default",
    name: "Zhangshu AI Research Workspace",
    goal: "Build a visual research-agent orchestration workspace from local skills.",
    updatedAt: new Date().toISOString(),
    workflow,
    artifacts: [],
    runs: [],
  };
}

async function readProjectManifest() {
  try {
    const raw = await fs.readFile(manifestPath, "utf8");
    return JSON.parse(raw);
  } catch {
    const manifest = await buildDefaultManifest();
    await writeProjectManifest(manifest);
    return manifest;
  }
}

async function writeProjectManifest(manifest: any) {
  await ensureDataDir();
  const nextManifest = {
    ...manifest,
    updatedAt: new Date().toISOString(),
    workflow: Array.isArray(manifest.workflow) ? manifest.workflow : [],
    artifacts: Array.isArray(manifest.artifacts) ? manifest.artifacts : [],
    runs: Array.isArray(manifest.runs) ? manifest.runs : [],
  };
  await fs.writeFile(manifestPath, JSON.stringify(nextManifest, null, 2), "utf8");
  return nextManifest;
}

function validateWorkflowNode(node: any, index: number) {
  if (!node || typeof node !== "object") return null;
  if (typeof node.skillId !== "string" || !node.skillId) return null;
  if (typeof node.label !== "string" || !node.label) return null;
  if (!["pre", "mid", "post"].includes(node.stage)) return null;
  if (!["R0", "R1", "R2", "R3"].includes(node.riskLevel)) return null;
  return {
    id: typeof node.id === "string" && node.id ? node.id : `node_${index + 1}`,
    skillId: node.skillId,
    taskId: typeof node.taskId === "string" ? node.taskId : undefined,
    label: node.label,
    stage: node.stage,
    riskLevel: node.riskLevel,
    dependencies: Array.isArray(node.dependencies) ? node.dependencies.map(String) : [],
    enabled: Boolean(node.enabled),
    order: Number.isFinite(Number(node.order)) ? Number(node.order) : index + 1,
  };
}

const demoResponse = (taskId: string) => ({
  taskId,
  summary: `已完成「${taskNames[taskId] || "科研任务"}」演示规划。当前未配置模型密钥，因此没有调用外部模型，也没有产生正式科研结论。`,
  findings: [
    "已将自然语言需求转换为结构化任务意图。",
    "已识别必填信息、上游资产缺口与潜在方法学风险。",
    "已生成需要用户确认的下一步行动计划。",
  ],
  nextActions:
    taskId === "F-01"
      ? ["F-02 文献综述", "F-03 研究设计"]
      : taskId === "F-03"
        ? ["F-11 伦理注册", "F-12 研究执行管理", "F-04 数据清洗"]
        : taskId === "F-06"
          ? ["F-07 统计绘图", "F-08 报告生成"]
          : taskId === "F-10"
            ? ["F-08 按目标期刊修稿", "F-09 调整参考文献", "接收后清单"]
            : ["保存为项目草稿", "根据反馈继续迭代"],
  demoMode: true,
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    apiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
    mode: process.env.GEMINI_API_KEY ? "connected" : "demo",
  });
});

app.get("/api/skills", async (_req, res) => {
  try {
    res.json(await getSkillRegistry());
  } catch (error) {
    console.error("Skill registry error", error);
    res.status(500).json({ error: "技能目录读取失败，请检查 zhangshu-skills 目录。" });
  }
});

app.get("/api/project/manifest", async (_req, res) => {
  try {
    res.json(await readProjectManifest());
  } catch (error) {
    console.error("Project manifest read error", error);
    res.status(500).json({ error: "Project manifest read failed." });
  }
});

app.put("/api/project/workflow", async (req, res) => {
  try {
    const workflow = Array.isArray(req.body?.workflow)
      ? req.body.workflow.map(validateWorkflowNode).filter(Boolean)
      : null;
    if (!workflow || workflow.length === 0) {
      return res.status(400).json({ error: "A non-empty workflow is required." });
    }

    const manifest = await readProjectManifest();
    const nextManifest = await writeProjectManifest({
      ...manifest,
      workflow,
    });
    res.json(nextManifest);
  } catch (error) {
    console.error("Workflow save error", error);
    res.status(500).json({ error: "Workflow save failed." });
  }
});

app.post("/api/project/runs", async (req, res) => {
  try {
    const { taskId, skillId, status, summary } = req.body ?? {};
    if (typeof taskId !== "string" || !taskNames[taskId]) {
      return res.status(400).json({ error: "A valid taskId is required." });
    }

    const run = {
      id: `run_${randomUUID().slice(0, 8)}`,
      taskId,
      skillId: typeof skillId === "string" ? skillId : undefined,
      status: ["planned", "running", "completed", "failed"].includes(status) ? status : "planned",
      summary: typeof summary === "string" && summary.trim() ? summary.trim().slice(0, 500) : "Manual workflow run record.",
      createdAt: new Date().toISOString(),
    };
    const manifest = await readProjectManifest();
    const nextManifest = await writeProjectManifest({
      ...manifest,
      runs: [run, ...(Array.isArray(manifest.runs) ? manifest.runs : [])].slice(0, 50),
    });
    res.status(201).json({ run, manifest: nextManifest });
  } catch (error) {
    console.error("Run record create error", error);
    res.status(500).json({ error: "Run record create failed." });
  }
});

app.post("/api/agent/run", async (req, res) => {
  const { taskId, input } = req.body ?? {};
  if (typeof taskId !== "string" || !taskNames[taskId]) {
    return res.status(400).json({ error: "无效的 taskId。" });
  }
  if (typeof input !== "string" || input.trim().length < 5) {
    return res.status(400).json({ error: "请提供完整的科研需求。" });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.json(demoResponse(taskId));
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: `任务：${taskNames[taskId]}（${taskId}）\n用户科研需求：\n${input}`,
      config: {
        systemInstruction: [
          "你是掌术 AI 临床科研任务编排器。",
          "你的职责是理解需求、识别信息缺口、生成候选计划和风险提示。",
          "不得编造文献、数据、统计数值、伦理批准、期刊指标或执行状态。",
          "不得声称已经完成真实数据分析、伦理提交、投稿提交或外部系统动作。",
          "只返回 JSON，字段为 summary:string、findings:string[]、nextActions:string[]。",
        ].join("\n"),
        responseMimeType: "application/json",
        temperature: 0.25,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      taskId,
      summary: String(parsed.summary || "已完成任务规划。"),
      findings: Array.isArray(parsed.findings) ? parsed.findings.map(String).slice(0, 6) : [],
      nextActions: Array.isArray(parsed.nextActions) ? parsed.nextActions.map(String).slice(0, 5) : [],
      demoMode: false,
    });
  } catch (error) {
    console.error("Agent API error", error);
    return res.status(502).json({ error: "模型服务暂不可用，请稍后重试。" });
  }
});

async function startServer() {
  if (isProduction) {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath, { maxAge: "1h", etag: true }));
    app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Zhangshu AI is running on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exitCode = 1;
});
