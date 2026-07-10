import { useEffect, useState, type ReactNode } from "react";
import {
  Activity, ArrowRight, BarChart3, BookOpen, Bot, Check, ChevronRight, CircleAlert,
  ClipboardCheck, Database, FileCheck2, FileText, FlaskConical, Home, Layers3, LockKeyhole,
  Menu, Network, PanelLeftClose, PanelLeftOpen, Play, Plus, Search, Send, ShieldCheck,
  Sparkles, Table2, X, Zap,
} from "lucide-react";
import { AGENT_TASKS, PROJECT_ARTIFACTS, STAGE_META } from "./data";
import type { AgentRunResponse, AgentTask, ProjectManifest, SkillDefinition, SkillRegistryResponse, Stage, ViewId, WorkflowNode } from "./types";
import { LandingPage as NewLandingPage } from "./components/LandingPage";
import { AgentTab } from "./components/AgentTab";
import { SkillsTab } from "./components/SkillsTab";

const stageOrder: Stage[] = ["pre", "mid", "post"];

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className={`brand ${inverse ? "brand-inverse" : ""}`}>
      <span className="brand-seal">掌</span>
      <span><strong>掌术 AI</strong><small>ZHANGSHU RESEARCH</small></span>
    </div>
  );
}

function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="landing">
      <header className="landing-nav shell">
        <Logo />
        <nav>
          <a href="#architecture">产品架构</a>
          <a href="#capabilities">核心能力</a>
          <a href="#trust">可信科研</a>
        </nav>
        <button className="button button-dark" onClick={onEnter}>进入科研工作站 <ArrowRight size={16} /></button>
      </header>

      <main>
        <section className="hero shell">
          <div className="hero-copy">
            <span className="kicker">Clinical research, engineered for trust</span>
            <h1>从研究问题，<br />到<span>可信科研成果</span></h1>
            <p>掌术 AI 是面向临床科研全生命周期的专业工作站。AI 负责理解与写作，统计结果必须由真实算法计算。</p>
            <div className="hero-actions">
              <button className="button button-primary" onClick={onEnter}>开始一个研究项目 <ArrowRight size={17} /></button>
              <a className="text-link" href="#architecture">了解产品架构 <ChevronRight size={15} /></a>
            </div>
            <div className="hero-proof"><ShieldCheck size={17} /><span>统计数值可追溯 · 数据版本不可变 · 关键决策有人机确认</span></div>
          </div>
          <div className="hero-visual">
            <div className="paper-stack paper-back" />
            <div className="paper-stack paper-mid" />
            <div className="research-card">
              <div className="research-card-head"><span className="mono">PROJECT / ZS-2026-014</span><span className="status-dot">● ACTIVE</span></div>
              <div className="research-title">免疫相关不良事件与<br />长期生存获益研究</div>
              <div className="picos-row">{["P","I","C","O","S"].map((x,i)=><div key={x}><b>{x}</b><span>{["NSCLC","irAE","No irAE","Overall survival","RWS"][i]}</span></div>)}</div>
              <div className="mini-chart" aria-label="生存曲线示意图">
                <svg viewBox="0 0 420 150" role="img"><line x1="35" y1="125" x2="400" y2="125"/><line x1="35" y1="20" x2="35" y2="125"/><path className="curve-a" d="M35 28 H78 V35 H123 V42 H170 V56 H215 V63 H260 V79 H310 V91 H355 V101 H398"/><path className="curve-b" d="M35 28 H70 V42 H110 V54 H150 V69 H195 V82 H240 V96 H285 V105 H335 V116 H398"/><text x="305" y="70">HR 0.72 · 95% CI</text></svg>
              </div>
              <div className="trace-line"><Check size={14}/><span>Result trace verified</span><code>run_456 → data_v4</code></div>
            </div>
          </div>
        </section>

        <section className="metric-band"><div className="shell metrics-grid"><div><strong>10</strong><span>科研 Agent 任务</span></div><div><strong>12</strong><span>类临床研究设计</span></div><div><strong>107</strong><span>项统计方法规划</span></div><div><strong>100%</strong><span>正式数值溯源目标</span></div></div></section>

        <section id="architecture" className="landing-section shell">
          <div className="section-heading"><span className="kicker">Product backbone</span><h2>三段式科研主链</h2><p>两端发挥 AI 的理解与表达优势，中段回到确定性算法。三段通过版本化科研产物连接。</p></div>
          <div className="stage-grid">
            {stageOrder.map((stage,index) => {
              const meta = STAGE_META[stage];
              const items = AGENT_TASKS.filter(t => t.stage === stage);
              return <article className={`stage-card stage-${stage}`} key={stage}><div className="stage-number">0{index+1}</div><span className="stage-label">{meta.subtitle}</span><h3>{meta.label}</h3><div className="stage-tools">{items.map(item=><span key={item.id}>{item.id} {item.shortName}</span>)}</div><footer>{stage === "pre" ? "PICOS · Protocol · Analysis Plan" : stage === "mid" ? "Dataset · Verified Result · Figure" : "Manuscript · Submission Pack"}</footer></article>
            })}
          </div>
          <div className="redline"><LockKeyhole size={22}/><div><strong>统计防幻觉红线</strong><p>HR、OR、P 值、置信区间、AUC 等正式数值，只能来自成功的确定性算法运行；找不到来源的数值阻止导出。</p></div></div>
        </section>

        <section id="capabilities" className="landing-section capability-section">
          <div className="shell"><div className="section-heading"><span className="kicker">One core, two entrances</span><h2>双入口，单内核</h2><p>快速工作流服务熟练用户，智能 Agent 处理模糊意图；两者调用相同领域服务、执行器和结果标准。</p></div>
          <div className="dual-grid"><article><span className="icon-box teal"><Zap size={21}/></span><h3>快速工作流</h3><p>表单与文件入口，固定规则、少中断、可批量、可复现。</p><ul><li>适合需求明确的熟练用户</li><li>同输入保持相同编排决策</li><li>支持批量数据与任务处理</li></ul></article><div className="core-orb"><Network size={25}/><strong>共享科研内核</strong><span>Single source of truth</span></div><article><span className="icon-box wine"><Bot size={21}/></span><h3>智能 Agent</h3><p>自然语言入口，动态计划、多轮确认、复杂场景探索。</p><ul><li>理解模糊研究意图</li><li>只调用白名单结构化工具</li><li>高风险动作前强制确认</li></ul></article></div>
          </div>
        </section>

        <section id="trust" className="landing-section shell">
          <div className="section-heading"><span className="kicker">Trust by architecture</span><h2>可信不是承诺，是一条数据链</h2></div>
          <div className="lineage-flow">{["PICOS Profile","Dataset Version","Analysis Plan","Analysis Run","Verified Result","Figure / Manuscript"].map((item,index)=><div key={item}><span>A0{index+1}</span><strong>{item}</strong><small>{["用户确认","原始数据只读","方法已批准","隔离执行","结果校验","导出闸门"][index]}</small></div>)}</div>
        </section>

        <section className="cta-section"><div className="shell"><div><span className="kicker">Start with a trustworthy loop</span><h2>先完成一个可信闭环，<br/>再扩展算法广度。</h2></div><button className="button button-light" onClick={onEnter}>进入工作站 <ArrowRight size={17}/></button></div></section>
      </main>
      <footer className="landing-footer shell"><Logo/><span>掌术 AI 科研工作站 · 产品原型 v0.1</span></footer>
    </div>
  );
}

const navItems: { id: ViewId; label: string; caption: string; icon: typeof Home }[] = [
  { id: "overview", label: "项目总览", caption: "Research overview", icon: Home },
  { id: "skills", label: "Skill 编排", caption: "Visual orchestration", icon: Network },
  { id: "agents", label: "科研 Agent", caption: "10 task agents", icon: Bot },
  { id: "assets", label: "科研资产", caption: "Artifacts & lineage", icon: Database },
  { id: "results", label: "分析与图表", caption: "Verified results", icon: BarChart3 },
  { id: "manuscript", label: "稿件工作区", caption: "Manuscript studio", icon: FileText },
];

function Workspace({ onLeave }: { onLeave: () => void }) {
  const [view, setView] = useState<ViewId>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState("F-01");

  const openAgent = (taskId: string) => {
    setSelectedTaskId(taskId);
    setView("agents");
    setMobileOpen(false);
  };

  const renderView = () => {
    if (view === "overview") return <Overview onOpenTask={openAgent} />;
    if (view === "skills") return <SkillOrchestrationView onOpenTask={openAgent} />;
    if (view === "agents") return <AgentWorkspace initialTaskId={selectedTaskId} />;
    if (view === "assets") return <AssetsView />;
    if (view === "results") return <ResultsView />;
    return <ManuscriptView />;
  };

  return (
    <div className="workspace">
      <aside className={`sidebar ${sidebarOpen ? "" : "sidebar-collapsed"} ${mobileOpen ? "sidebar-mobile-open" : ""}`}>
        <div className="sidebar-top"><Logo inverse/><button className="icon-button collapse-button" onClick={()=>setSidebarOpen(!sidebarOpen)} aria-label="收起侧栏">{sidebarOpen?<PanelLeftClose size={18}/>:<PanelLeftOpen size={18}/>}</button></div>
        <div className="project-switch"><span className="project-mark">ZS</span><div><strong>NSCLC · RWS</strong><small>免疫治疗预后研究</small></div><ChevronRight size={15}/></div>
        <nav className="workspace-nav">{navItems.map(item=>{const Icon=item.icon;return <button key={item.id} className={view===item.id?"active":""} onClick={()=>{setView(item.id);setMobileOpen(false)}} title={item.label}><Icon size={19}/><span><b>{item.label}</b><small>{item.caption}</small></span></button>})}</nav>
        <div className="sidebar-bottom"><div className="system-state"><div><span className="online-dot"/>系统运行正常</div><small>演示数据 · 本地优先</small></div><button className="back-site" onClick={onLeave}><Home size={16}/><span>返回产品首页</span></button></div>
      </aside>
      {mobileOpen && <button className="mobile-backdrop" onClick={()=>setMobileOpen(false)} aria-label="关闭菜单"/>}
      <main className="workspace-main">
        <header className="workspace-header"><button className="icon-button mobile-menu" onClick={()=>setMobileOpen(true)}><Menu size={20}/></button><div className="breadcrumb"><span>掌术科研工作站</span><ChevronRight size={14}/><strong>{navItems.find(x=>x.id===view)?.label}</strong></div><div className="header-actions"><button className="icon-button" aria-label="搜索"><Search size={18}/></button><button className="button button-primary button-small"><Plus size={15}/> 新建研究任务</button><span className="avatar">ZS</span></div></header>
        <div className="workspace-content">{renderView()}</div>
      </main>
    </div>
  );
}

function PageTitle({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="page-title"><div><span className="kicker">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

const stageLabels: Record<Stage, string> = {
  pre: "前置规划",
  mid: "执行分析",
  post: "发表交付",
};

function buildWorkflowFromSkills(skills: SkillDefinition[]): WorkflowNode[] {
  return skills
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
}

function SkillOrchestrationView({ onOpenTask }: { onOpenTask: (id: string) => void }) {
  const [registry, setRegistry] = useState<SkillRegistryResponse | null>(null);
  const [manifest, setManifest] = useState<ProjectManifest | null>(null);
  const [selectedId, setSelectedId] = useState<string>("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    let cancelled = false;
    async function loadSkills() {
      try {
        const [skillResponse, manifestResponse] = await Promise.all([
          fetch("/api/skills"),
          fetch("/api/project/manifest"),
        ]);
        if (!skillResponse.ok) throw new Error("Skill registry request failed");
        const data = (await skillResponse.json()) as SkillRegistryResponse;
        const manifestData = manifestResponse.ok ? ((await manifestResponse.json()) as ProjectManifest) : null;
        if (cancelled) return;
        setRegistry(data);
        setManifest(manifestData);
        setSelectedId(data.skills[0]?.id || "");
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }
    loadSkills();
    return () => {
      cancelled = true;
    };
  }, []);

  const skills = registry?.skills || [];
  const selected = skills.find((skill) => skill.id === selectedId) || skills[0];
  const orchestrator = skills.find((skill) => skill.id === "zhangshu-research-orchestrator");
  const activeWorkflow = manifest?.workflow?.length ? manifest.workflow : buildWorkflowFromSkills(skills);
  const latestRun = manifest?.runs?.[0];

  const saveWorkflow = async () => {
    if (!skills.length) return;
    setSaveState("saving");
    try {
      const response = await fetch("/api/project/workflow", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflow: buildWorkflowFromSkills(skills) }),
      });
      if (!response.ok) throw new Error("Workflow save failed");
      setManifest((await response.json()) as ProjectManifest);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  };

  const createPlannedRun = async () => {
    if (!selected?.taskId) return;
    setSaveState("saving");
    try {
      const response = await fetch("/api/project/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: selected.taskId,
          skillId: selected.id,
          status: "planned",
          summary: `Planned run for ${selected.displayName}`,
        }),
      });
      if (!response.ok) throw new Error("Run record create failed");
      const data = (await response.json()) as { manifest: ProjectManifest };
      setManifest(data.manifest);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  };

  return <div className="view-stack skill-view">
    <PageTitle
      eyebrow="Skill Registry · Visual Agent Builder"
      title="Skill 可视化编排器"
      description="把本地技能包扫描成可查看、可编排、可执行的科研 Agent 节点，先建立可信工作流骨架。"
      action={<div className="skill-title-actions">
        <button className="button" disabled={saveState === "saving" || !skills.length} onClick={saveWorkflow}><FileCheck2 size={15}/>{saveState === "saving" ? "保存中" : "保存 workflow"}</button>
        <button className="button button-primary" disabled={!selected?.taskId} onClick={() => selected?.taskId && onOpenTask(selected.taskId)}><Play size={15}/>运行选中节点</button>
      </div>}
    />

    <div className="skill-metrics">
      <section className="panel">
        <span className="panel-kicker">REGISTRY</span>
        <strong>{status === "ready" ? registry?.count || 0 : "--"}</strong>
        <small>已发现 Skill</small>
      </section>
      <section className="panel">
        <span className="panel-kicker">WORKFLOW</span>
        <strong>{activeWorkflow.length || "--"}</strong>
        <small>已保存 / 可编排节点</small>
      </section>
      <section className="panel">
        <span className="panel-kicker">RUNS</span>
        <strong>{manifest?.runs?.length || 0}</strong>
        <small>{latestRun ? `最近 ${latestRun.taskId}` : "暂无运行记录"}</small>
      </section>
      <section className="panel">
        <span className="panel-kicker">MODE</span>
        <strong>{saveState === "error" ? "ERR" : saveState === "saved" ? "SAVED" : "MVP"}</strong>
        <small>{manifest ? `更新 ${new Date(manifest.updatedAt).toLocaleString()}` : "本地优先 · 可升级执行器"}</small>
      </section>
    </div>

    {status === "loading" && <section className="panel skill-empty"><span className="spinner"/><strong>正在读取本地技能包</strong></section>}
    {status === "error" && <section className="panel skill-empty"><CircleAlert size={22}/><strong>技能目录读取失败</strong><p>请确认后端服务可以访问 zhangshu-skills 目录。</p></section>}

    {status === "ready" && <div className="skill-builder-layout">
      <aside className="panel skill-catalog-panel">
        <div className="panel-head">
          <div>
            <span className="panel-kicker">SKILL CATALOG</span>
            <h2>技能目录</h2>
          </div>
          <span className="pill pill-success">{registry?.root}</span>
        </div>
        <div className="skill-catalog-list">
          {skills.map((skill) => <button key={skill.id} className={selected?.id === skill.id ? "active" : ""} onClick={() => setSelectedId(skill.id)}>
            <span className={`skill-node-code skill-${skill.stage}`}>{skill.taskId || "SYS"}</span>
            <div>
              <b>{skill.displayName}</b>
              <small>{skill.id}</small>
            </div>
            <i>{skill.riskLevel}</i>
          </button>)}
        </div>
      </aside>

      <main className="skill-canvas-panel">
        <section className="panel">
          <div className="panel-head">
            <div>
              <span className="panel-kicker">WORKFLOW CANVAS</span>
              <h2>科研 Agent 主链路</h2>
            </div>
            <button className="ghost-button" onClick={() => orchestrator && setSelectedId(orchestrator.id)}><Network size={14}/>查看总编排器</button>
          </div>
          <div className="workflow-canvas">
            {stageOrder.map((stage) => <div className="workflow-stage" key={stage}>
              <div className="workflow-stage-head">
                <span>{stageLabels[stage]}</span>
                <small>{activeWorkflow.filter((node) => node.stage === stage && node.enabled).length} nodes</small>
              </div>
              <div className="workflow-node-list">
                {activeWorkflow.filter((node) => node.stage === stage && node.enabled).map((node) => {
                  const skill = skills.find((item) => item.id === node.skillId);
                  return <button key={node.id} className={`workflow-node ${selected?.id === node.skillId ? "active" : ""}`} onClick={() => setSelectedId(node.skillId)}>
                  <span className={`skill-node-code skill-${node.stage}`}>{node.taskId}</span>
                  <div>
                    <b>{(skill?.displayName || node.label).replace(`${node.taskId} `, "")}</b>
                    <small>{node.dependencies.length ? `依赖 ${node.dependencies.join(" / ")}` : "入口节点"}</small>
                  </div>
                  <strong>{node.riskLevel}</strong>
                </button>;
                })}
              </div>
            </div>)}
          </div>
        </section>
      </main>

      <aside className="panel skill-inspector">
        {selected ? <>
          <span className="panel-kicker">NODE INSPECTOR</span>
          <h2>{selected.displayName}</h2>
          <p>{selected.description || "该 Skill 暂无 frontmatter 描述。"}</p>
          <dl>
            <div><dt>Skill ID</dt><dd className="mono">{selected.id}</dd></div>
            <div><dt>路径</dt><dd className="mono">{selected.path}</dd></div>
            <div><dt>阶段</dt><dd>{stageLabels[selected.stage]}</dd></div>
            <div><dt>风险</dt><dd>{selected.riskLevel}</dd></div>
            <div><dt>依赖</dt><dd>{selected.dependencies.length ? selected.dependencies.join(", ") : "无"}</dd></div>
          </dl>

          <div className="skill-resource-block">
            <h3>资源结构</h3>
            <span><BookOpen size={13}/>{selected.references.length} references</span>
            <span><Activity size={13}/>{selected.scripts.length} scripts</span>
            <span><FileText size={13}/>{selected.assets.length} assets</span>
          </div>

          <div className="skill-chip-block">
            <h3>可识别工具 / 调用</h3>
            {(selected.tools.length ? selected.tools : ["等待补充工具契约"]).slice(0, 10).map((tool) => <code key={tool}>{tool}</code>)}
          </div>

          <div className="skill-resource-block">
            <h3>Manifest 状态</h3>
            <span><Layers3 size={13}/>{activeWorkflow.length} workflow nodes</span>
            <span><ClipboardCheck size={13}/>{manifest?.runs?.length || 0} run records</span>
            <span><Database size={13}/>{manifest?.artifacts?.length || 0} artifacts</span>
          </div>

          <button className="button full-width" disabled={!selected.taskId || saveState === "saving"} onClick={createPlannedRun}>
            <ClipboardCheck size={15}/>创建计划运行记录
          </button>
          <button className="button button-dark full-width" disabled={!selected.taskId} onClick={() => selected.taskId && onOpenTask(selected.taskId)}>
            <Bot size={15}/>打开 Agent 执行页
          </button>
        </> : null}
      </aside>
    </div>}
  </div>;
}

function Overview({ onOpenTask }: { onOpenTask: (id: string) => void }) {
  const p0 = AGENT_TASKS.filter(t=>t.priority==="P0");
  return <div className="view-stack">
    <PageTitle eyebrow="Project dashboard · ZS-2026-014" title="下午好，张医生" description="研究主链已有 5 项产物通过确认；下一步建议完成统计分析运行。" action={<button className="button button-primary" onClick={()=>onOpenTask("F-06")}><Play size={16}/>继续主分析</button>}/>
    <div className="overview-grid">
      <section className="panel project-progress"><div className="panel-head"><div><span className="panel-kicker">CURRENT PROJECT</span><h2>免疫相关不良事件与生存获益</h2></div><span className="pill pill-success">进行中</span></div><div className="progress-rail"><span style={{width:"62%"}}/></div><div className="progress-meta"><span>可信闭环进度</span><strong>62%</strong></div><div className="stage-progress">{stageOrder.map((stage,i)=><div key={stage} className={i<2?"done":""}><span>{i<2?<Check size={14}/>:i+1}</span><div><b>{STAGE_META[stage].label}</b><small>{STAGE_META[stage].subtitle}</small></div></div>)}</div></section>
      <section className="panel metric-panel"><div className="panel-head"><div><span className="panel-kicker">PROJECT HEALTH</span><h2>科研资产状态</h2></div><Activity size={19}/></div><div className="health-metrics"><div><strong>7</strong><span>版本化资产</span></div><div><strong>1</strong><span>待确认节点</span></div><div><strong>100%</strong><span>结果溯源</span></div><div><strong>0</strong><span>阻断性风险</span></div></div></section>
    </div>
    <section className="panel"><div className="panel-head"><div><span className="panel-kicker">RECOMMENDED ACTIONS</span><h2>建议继续的任务</h2></div><button className="ghost-button" onClick={()=>onOpenTask("F-01")}>查看全部 Agent <ArrowRight size={14}/></button></div><div className="quick-task-grid">{p0.map(task=><button key={task.id} onClick={()=>onOpenTask(task.id)} className={`quick-task quick-${task.stage}`}><span className="task-code">{task.id}</span><div><strong>{task.shortName}</strong><p>{task.description}</p></div><ArrowRight size={17}/></button>)}</div></section>
    <div className="overview-grid lower"><section className="panel"><div className="panel-head"><div><span className="panel-kicker">RECENT ARTIFACTS</span><h2>最近科研产物</h2></div><Layers3 size={18}/></div><div className="compact-list">{PROJECT_ARTIFACTS.slice(-4).reverse().map(a=><div key={a.id}><span className="file-icon"><FileCheck2 size={16}/></span><div><b>{a.name}</b><small>{a.type} · {a.version}</small></div><span>{a.updatedAt}</span></div>)}</div></section><section className="panel confidence-panel"><div className="panel-head"><div><span className="panel-kicker">TRUST CHECK</span><h2>正式成果校验</h2></div><ShieldCheck size={19}/></div><div className="trust-score"><div><strong>92</strong><span>/ 100</span></div><p>方法、数据和结果链完整；稿件仍有 2 条引文待确认。</p></div><ul className="check-list"><li><Check size={14}/>统计数值均绑定 Result ID</li><li><Check size={14}/>图表引用已验证结果</li><li className="warning"><CircleAlert size={14}/>2 条参考文献元数据待补齐</li></ul></section></div>
  </div>;
}

function AgentWorkspace({ initialTaskId }: { initialTaskId: string }) {
  const [selectedId, setSelectedId] = useState(initialTaskId);
  const [filter, setFilter] = useState<Stage | "all">("all");
  const [input, setInput] = useState(AGENT_TASKS.find(t=>t.id===initialTaskId)?.prompt || "");
  const [runState, setRunState] = useState<"idle"|"plan"|"running"|"done">("idle");
  const [result, setResult] = useState<AgentRunResponse | null>(null);
  const task = AGENT_TASKS.find(t=>t.id===selectedId) || AGENT_TASKS[0];
  const visibleTasks = filter === "all" ? AGENT_TASKS : AGENT_TASKS.filter(t=>t.stage===filter);

  const selectTask=(next: AgentTask)=>{setSelectedId(next.id);setInput(next.prompt);setRunState("idle");setResult(null)};
  const execute = async () => {
    setRunState("running");
    try {
      const response = await fetch("/api/agent/run", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({taskId:task.id,input})});
      if(!response.ok) throw new Error("服务暂不可用");
      setResult(await response.json());
    } catch {
      setResult({taskId:task.id,summary:`已完成「${task.shortName}」演示运行。当前环境使用本地演示结果，正式环境将调用受控工具链。`,findings:task.outputs.slice(0,3).map(x=>`已生成：${x}`),nextActions:task.next,demoMode:true});
    } finally {setRunState("done")}
  };

  return <div className="agent-layout">
    <aside className="agent-catalog"><div className="catalog-head"><span className="panel-kicker">AGENT CATALOG</span><h2>科研任务</h2><div className="catalog-filters"><button className={filter==="all"?"active":""} onClick={()=>setFilter("all")}>全部</button>{stageOrder.map(s=><button key={s} className={filter===s?"active":""} onClick={()=>setFilter(s)}>{s==="pre"?"前置":s==="mid"?"算法":"后置"}</button>)}</div></div><div className="catalog-list">{visibleTasks.map(item=><button key={item.id} className={selectedId===item.id?"active":""} onClick={()=>selectTask(item)}><span className={`catalog-code code-${item.stage}`}>{item.id}</span><div><b>{item.shortName}</b><small>{STAGE_META[item.stage].label} · {item.priority}</small></div><ChevronRight size={15}/></button>)}</div></aside>
    <section className="agent-detail">
      <div className="agent-detail-head"><div><div className="task-meta"><span className={`stage-tag tag-${task.stage}`}>{STAGE_META[task.stage].label}</span><span>{task.priority}</span><span>{task.risk}</span></div><h1>{task.name}</h1><p>{task.objective}</p></div><span className={`big-code code-${task.stage}`}>{task.id}</span></div>
      <div className="agent-work-grid">
        <div className="agent-main-column">
          <section className="panel input-panel"><div className="panel-head"><div><span className="panel-kicker">RESEARCH INTENT</span><h2>描述你的研究需求</h2></div><Sparkles size={18}/></div><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={task.prompt}/><div className="input-actions"><span>Agent 将先生成计划，不会直接执行高风险操作。</span><button className="button button-primary" disabled={!input.trim()||runState==="running"} onClick={()=>{setRunState("plan");setResult(null)}}><Send size={15}/>生成行动计划</button></div></section>
          {runState!=="idle" && <section className="panel run-panel"><div className="panel-head"><div><span className="panel-kicker">EXECUTION PLAN</span><h2>{runState==="done"?"任务交付":"执行计划与确认点"}</h2></div><span className={`pill ${runState==="done"?"pill-success":"pill-warning"}`}>{runState==="running"?"执行中":runState==="done"?"已完成":"等待确认"}</span></div>
            {runState==="plan" && <><div className="execution-steps">{task.steps.map((step,i)=><div key={step}><span>{i+1}</span><p>{step}</p>{i===Math.max(1,task.steps.length-3)&&<b>HUMAN GATE</b>}</div>)}</div><div className="gate-box"><LockKeyhole size={18}/><div><strong>需要你的确认</strong><p>{task.gate}</p></div></div><div className="confirm-actions"><button className="ghost-button" onClick={()=>setRunState("idle")}>返回修改</button><button className="button button-primary" onClick={execute}><Check size={15}/>确认并执行</button></div></>}
            {runState==="running" && <div className="running-state"><span className="spinner"/><strong>正在调用受控工具链</strong><p>工具执行、结果校验和资产登记均会写入审计记录。</p></div>}
            {runState==="done"&&result&&<div className="result-box"><div className="result-summary"><span className="success-icon"><Check size={18}/></span><div><strong>{result.summary}</strong>{result.demoMode&&<small>DEMO MODE · 未产生正式科研结论</small>}</div></div><div className="result-columns"><div><h3>本次产出</h3><ul>{result.findings.map(x=><li key={x}><Check size={13}/>{x}</li>)}</ul></div><div><h3>建议下一步</h3><ul>{result.nextActions.map(x=><li key={x}><ArrowRight size={13}/>{x}</li>)}</ul></div></div><button className="button button-primary"><FileCheck2 size={15}/>保存为项目产物</button></div>}
          </section>}
        </div>
        <aside className="agent-side-column"><section className="panel"><span className="panel-kicker">TOOL CONTRACTS</span><h2>{task.tools.length} 个受控工具</h2><div className="tool-contracts">{task.tools.map(tool=><div key={tool.name}><code>{tool.name}</code><p>{tool.description}</p></div>)}</div></section><section className="panel"><span className="panel-kicker">INPUT / OUTPUT</span><div className="io-block"><h3>需要输入</h3>{task.inputs.map(x=><span key={x}>{x}</span>)}</div><div className="io-block output"><h3>交付产物</h3>{task.outputs.map(x=><span key={x}>{x}</span>)}</div></section><section className="panel exception-panel"><span className="panel-kicker">BOUNDARIES</span><h2>异常与边界</h2>{task.exceptions.map(x=><p key={x}><CircleAlert size={13}/>{x}</p>)}</section></aside>
      </div>
    </section>
  </div>;
}

function AssetsView(){
  const [selected,setSelected]=useState(PROJECT_ARTIFACTS[4]);
  return <div className="view-stack"><PageTitle eyebrow="Artifacts & lineage" title="科研资产" description="模块通过版本化科研产物衔接，不依赖聊天上下文传递关键事实。" action={<button className="button button-primary"><Plus size={15}/>导入科研资产</button>}/><div className="asset-layout"><section className="panel asset-table-panel"><div className="panel-head"><div><span className="panel-kicker">PROJECT ARTIFACTS</span><h2>7 项版本化产物</h2></div><button className="ghost-button"><Search size={14}/>筛选</button></div><div className="asset-table"><div className="asset-row asset-header"><span>产物</span><span>类型</span><span>版本</span><span>状态</span><span>更新时间</span></div>{PROJECT_ARTIFACTS.map(a=><button className={`asset-row ${selected.id===a.id?"selected":""}`} key={a.id} onClick={()=>setSelected(a)}><span><FileText size={15}/><b>{a.name}</b><small>{a.id}</small></span><span>{a.type}</span><span className="mono">{a.version}</span><span><i className={`status-badge status-${a.status}`}>{a.status}</i></span><span>{a.updatedAt}</span></button>)}</div></section><aside className="panel asset-inspector"><span className="panel-kicker">ASSET INSPECTOR</span><h2>{selected.name}</h2><p className="asset-id mono">{selected.id} · {selected.version}</p><dl><div><dt>资产类型</dt><dd>{selected.type}</dd></div><div><dt>验证状态</dt><dd>{selected.status}</dd></div><div><dt>生产任务</dt><dd>{selected.source}</dd></div><div><dt>内容哈希</dt><dd className="mono">sha256:8a71…f09c</dd></div></dl><div className="lineage-mini"><span>上游</span><div>{selected.id==="run_456"?"plan_008 + data_004":"项目资产"}</div><ArrowRight size={15}/><div>{selected.id==="run_456"?"fig_032 + ms_006":"下游任务"}</div><span>下游</span></div><button className="button button-dark full-width">查看完整溯源</button></aside></div></div>
}

function ResultsView(){return <div className="view-stack"><PageTitle eyebrow="Verified analytics" title="分析与图表" description="所有数值来自确定性算法运行；图表布局可以优化，但统计数据不可被修改。" action={<button className="button button-primary"><Play size={15}/>新建分析运行</button>}/><div className="result-metrics"><div className="panel"><span>主要效应</span><strong>0.72</strong><small>HR · 95% CI 0.58–0.89</small></div><div className="panel"><span>显著性</span><strong>0.002</strong><small>P value · Cox model</small></div><div className="panel"><span>样本量</span><strong>486</strong><small>128 events · data_v4</small></div><div className="panel"><span>模型状态</span><strong className="text-success">通过</strong><small>PH assumption · P=0.37</small></div></div><div className="analysis-grid"><section className="panel chart-panel"><div className="panel-head"><div><span className="panel-kicker">FIGURE 01 · VERIFIED</span><h2>Kaplan–Meier overall survival</h2></div><span className="pill pill-success">result_id: res_789</span></div><div className="km-chart"><svg viewBox="0 0 720 310" role="img" aria-label="Kaplan-Meier 生存曲线"><g className="grid-lines"><line x1="60" y1="50" x2="680" y2="50"/><line x1="60" y1="110" x2="680" y2="110"/><line x1="60" y1="170" x2="680" y2="170"/><line x1="60" y1="230" x2="680" y2="230"/></g><line x1="60" y1="260" x2="680" y2="260"/><line x1="60" y1="30" x2="60" y2="260"/><path className="km-a" d="M60 38 H112 V45 H162 V54 H214 V66 H268 V76 H322 V91 H380 V106 H440 V126 H500 V144 H558 V163 H620 V179 H680"/><path className="km-b" d="M60 38 H104 V53 H150 V70 H198 V91 H246 V111 H300 V136 H354 V158 H410 V181 H470 V205 H530 V220 H590 V235 H680"/><text x="500" y="88" className="label-a">irAE group</text><text x="455" y="215" className="label-b">No-irAE group</text><text x="530" y="48" className="stat-label">HR 0.72 (95% CI 0.58–0.89)</text><text x="530" y="65" className="stat-label">Log-rank P = 0.002</text></svg></div><div className="chart-trace"><ShieldCheck size={15}/><span>run_456 · algorithm_cox_v2.3 · dataset_v4 · seed 20260706</span><button>导出 SVG</button></div></section><section className="panel diagnostics"><div className="panel-head"><div><span className="panel-kicker">MODEL DIAGNOSTICS</span><h2>模型诊断</h2></div><ClipboardCheck size={18}/></div>{[["比例风险假设","通过","P = 0.37"],["共线性检查","通过","Max VIF = 2.1"],["缺失数据","已处理","MICE · m=20"],["模型收敛","通过","4 iterations"]].map(x=><div className="diagnostic-row" key={x[0]}><span><Check size={14}/></span><div><b>{x[0]}</b><small>{x[2]}</small></div><strong>{x[1]}</strong></div>)}<div className="run-manifest"><span className="panel-kicker">RUN MANIFEST</span><code>run_id: run_456<br/>engine: survival/cox@2.3.0<br/>runtime: R 4.5.1<br/>dataset: data_004:v4<br/>result_hash: 3b9a…81df</code></div></section></div></div>}

function ManuscriptView(){const [section,setSection]=useState("Results");const sections=["Abstract","Introduction","Methods","Results","Discussion"];return <div className="view-stack manuscript-view"><PageTitle eyebrow="Manuscript studio" title="稿件工作区" description="基于已确认方案、证据和 Verified Result 组织表达；正式数值保持机器可读引用。" action={<button className="button button-primary"><FileCheck2 size={15}/>运行合规检查</button>}/><div className="manuscript-layout"><aside className="panel outline-panel"><span className="panel-kicker">DOCUMENT OUTLINE</span><h2>IMRAD Manuscript</h2><div className="outline-list">{sections.map((x,i)=><button key={x} className={section===x?"active":""} onClick={()=>setSection(x)}><span>{String(i+1).padStart(2,"0")}</span>{x}<small>{x==="Results"?"3 refs":"完成"}</small></button>)}</div><div className="document-meta"><span>目标期刊</span><strong>JAMA Oncology</strong><span>总字数</span><strong>3,842 / 4,000</strong><span>版本</span><strong>v6 · Draft</strong></div></aside><section className="panel editor-panel"><div className="editor-toolbar"><div><span className="panel-kicker">SECTION 04</span><h2>{section}</h2></div><div><button>B</button><button><i>I</i></button><button>引用</button><button>插入结果</button></div></div><article className="paper-editor"><h1>{section}</h1>{section==="Results"?<><h2>Patient characteristics</h2><p>A total of 486 patients with advanced non-small-cell lung cancer were included in the final analysis. Of these, 172 patients (35.4%) developed immune-related adverse events during follow-up.<sup className="evidence-ref">E12</sup></p><h2>Overall survival</h2><p>After multivariable adjustment, the occurrence of immune-related adverse events was associated with improved overall survival (<mark>HR 0.72, 95% CI 0.58–0.89; P=0.002</mark><sup className="result-ref">R789</sup>). The proportional hazards assumption was not violated (P=0.37).</p><div className="inline-figure"><BarChart3 size={25}/><div><strong>Figure 1. Kaplan–Meier overall survival</strong><span>fig_032 · verified from result res_789</span></div></div><h2>Sensitivity analyses</h2><p>The direction and magnitude of the association remained consistent after inverse probability of treatment weighting and complete-case analysis.<sup className="result-ref">R804</sup></p></>:<><h2>{section} draft</h2><p>该章节将从项目资产中调用已确认的研究方案、证据卡片和结果引用。选择 Results 可查看完整演示内容。</p></>}</article><div className="editor-status"><span><Check size={14}/>自动保存于 13:42</span><span><ShieldCheck size={14}/>3 个数值引用已验证</span></div></section><aside className="panel compliance-panel"><span className="panel-kicker">COMPLIANCE</span><h2>章节检查</h2><div className="score-ring"><strong>94</strong><span>/100</span></div><ul className="check-list"><li><Check size={14}/>所有统计数值可追溯</li><li><Check size={14}/>Methods 与 Results 一致</li><li><Check size={14}/>图表引用有效</li><li className="warning"><CircleAlert size={14}/>2 条引文元数据待核验</li></ul><div className="reference-legend"><span><b className="result-dot"/>R789</span> 已验证结果引用<span><b className="evidence-dot"/>E12</span> 文献证据引用</div><button className="button button-dark full-width">查看溯源报告</button></aside></div></div>}

type WorkspaceTab = "agent" | "skills";

function IntegratedWorkspace({
  onLeave,
  queuedMessage,
  onQueueMessage,
  onClearQueuedMessage,
}: {
  onLeave: () => void;
  queuedMessage: string | null;
  onQueueMessage: (message: string) => void;
  onClearQueuedMessage: () => void;
}) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("agent");

  const navigateToTab = (tab: "agent" | "skills" | "workflows" | "about") => {
    setActiveTab(tab === "skills" ? "skills" : "agent");
  };

  const sendMessageToAgent = (message: string) => {
    onQueueMessage(message);
    setActiveTab("agent");
  };

  const tabs: { id: WorkspaceTab; label: string; caption: string }[] = [
    { id: "agent", label: "Agent", caption: "Academic copilot" },
    { id: "skills", label: "Skills", caption: "Built-in market" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-neutral-900 font-sans flex flex-col">
      <header className="shrink-0 border-b border-neutral-200 bg-white/90 backdrop-blur-md px-5 lg:px-8 py-3 flex items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 border border-[#6B1724] text-[#6B1724] flex items-center justify-center font-serif font-black">
            掌
          </div>
          <div className="min-w-0">
            <div className="text-sm font-black tracking-tight text-neutral-950">掌术 AI 科研工作站</div>
            <div className="text-[9px] font-mono uppercase tracking-[0.22em] text-neutral-400 truncate">ZHANGSHU RESEARCH AGENT OS</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-neutral-100 border border-neutral-200 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg border-0 cursor-pointer transition-colors text-left ${
                activeTab === tab.id ? "bg-[#6B1724] text-white shadow-sm" : "bg-transparent text-neutral-500 hover:text-neutral-950 hover:bg-white"
              }`}
            >
              <span className="block text-xs font-black leading-tight">{tab.label}</span>
              <span className="block text-[8px] font-mono uppercase opacity-60 leading-tight mt-0.5">{tab.caption}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <select
            value={activeTab}
            onChange={(event) => setActiveTab(event.target.value as WorkspaceTab)}
            className="md:hidden text-xs border border-neutral-200 bg-white rounded-lg px-3 py-2"
          >
            {tabs.map((tab) => <option key={tab.id} value={tab.id}>{tab.label}</option>)}
          </select>
          <button
            onClick={onLeave}
            className="px-3 py-2 text-[10px] font-mono font-black uppercase tracking-widest border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-500 hover:text-[#6B1724] rounded-lg cursor-pointer"
          >
            返回首页
          </button>
        </div>
      </header>

      <main className="flex-1 min-h-0 p-3 lg:p-5">
        {activeTab === "agent" && (
          <AgentTab
            onNavigateToTab={navigateToTab}
            queuedMessage={queuedMessage}
            onClearQueuedMessage={onClearQueuedMessage}
          />
        )}

        {activeTab === "skills" && (
          <div className="min-h-full bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-lg">
            <SkillsTab onSendMessageToAgent={sendMessageToAgent} />
          </div>
        )}

      </main>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState<"landing" | "workspace">(() => localStorage.getItem("zs_mode") === "workspace" ? "workspace" : "landing");
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("zs_logged_in") === "true");
  const [userEmail, setUserEmail] = useState<string | null>(() => localStorage.getItem("zs_user_email"));
  const [userPlan, setUserPlan] = useState(() => localStorage.getItem("zs_user_plan") || "Free");
  const [isSubscribed, setIsSubscribed] = useState(() => localStorage.getItem("zs_subscribed") === "true");
  const [queuedMessage, setQueuedMessage] = useState<string | null>(null);

  const enterWorkspace = () => {
    localStorage.setItem("zs_mode", "workspace");
    setMode("workspace");
  };

  const leaveWorkspace = () => {
    localStorage.setItem("zs_mode", "landing");
    setMode("landing");
  };

  const handleLoginSuccess = (email: string, plan: string, subscribed: boolean) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setUserPlan(plan);
    setIsSubscribed(subscribed);
    localStorage.setItem("zs_logged_in", "true");
    localStorage.setItem("zs_user_email", email);
    localStorage.setItem("zs_user_plan", plan);
    localStorage.setItem("zs_subscribed", String(subscribed));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail(null);
    setUserPlan("Free");
    setIsSubscribed(false);
    localStorage.removeItem("zs_logged_in");
    localStorage.removeItem("zs_user_email");
    localStorage.removeItem("zs_user_plan");
    localStorage.removeItem("zs_subscribed");
    leaveWorkspace();
  };

  if (mode === "landing") {
    return (
      <NewLandingPage
        onLoginSuccess={handleLoginSuccess}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        userPlan={userPlan}
        isSubscribed={isSubscribed}
        onLogout={handleLogout}
        onEnterWorkspace={enterWorkspace}
      />
    );
  }

  return (
    <IntegratedWorkspace
      onLeave={leaveWorkspace}
      queuedMessage={queuedMessage}
      onQueueMessage={setQueuedMessage}
      onClearQueuedMessage={() => setQueuedMessage(null)}
    />
  );
}
