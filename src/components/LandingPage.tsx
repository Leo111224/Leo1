import React, { useState } from "react";
import { 
  Sparkles, ShieldCheck, Mail, Lock, User, Check, ArrowRight,
  Sparkle, Brain, Database, Cpu, Code, BookOpen, Layers, 
  MessageSquare, ClipboardCheck, Search, FileText, CheckCircle2,
  HelpCircle, CreditCard, Wallet, QrCode, Globe, Users, LogOut, ArrowLeft,
  X, Info, Star
} from "lucide-react";
import { PICOS_DESIGNS, StudyDesignData } from "../picosData";
import { ScientificPlotGeneratorDemo } from "./ScientificPlotGeneratorDemo";

const SUB_GROUPS_CONFIG = [
  // Introduction
  { category: "introduction", id: "planning", label: "I-1. 课题立意与选题规划 (Topic Planning)" },
  { category: "introduction", id: "literature", label: "I-2. 学术文献与现状综述 (Literature Review)" },

  // Methods
  { category: "methods", id: "design", label: "M-1. 试验设计与伦理CRF (Study Design & Ethics)" },
  { category: "methods", id: "sample-size", label: "M-2. 各类设计样本量估算 (Sample Size Estimation)" },
  { category: "methods", id: "rws-causal", label: "M-3. 因果推断与真实世界研究 (Causal Inference)" },
  { category: "methods", id: "cleaning-imputation", label: "M-4. 异常值清洗与多重插补 (Data Cleaning & Imputation)" },
  { category: "methods", id: "features-validation", label: "M-5. 特征工程与预测模型验证 (Features & Validation)" },

  // Results
  { category: "results", id: "descriptive", label: "R-1. 描述性统计与基线三线表 (Descriptive Statistics)" },
  { category: "results", id: "comparison", label: "R-2. 组间差异比较与假设检验 (Hypothesis Testing)" },
  { category: "results", id: "plotting", label: "R-3. 统计绘图代码生成 (Statistical Plotting)" },
  { category: "results", id: "regression", label: "R-4. 多因素回归模型与生存分析 (Multivariate Regression)" },
  { category: "results", id: "interaction-rcs", label: "R-5. 亚组交互作用与限制立方样条 (Interaction & RCS)" },
  { category: "results", id: "diagnostic", label: "R-6. 诊断试验指标与ROC分析 (Diagnostic Performance)" },
  { category: "results", id: "prognostic", label: "R-7. 预后预测模型构建与列线图 (Prognostic & Nomogram)" },
  { category: "results", id: "meta", label: "R-8. Meta分析与循证医学 (Meta-Analysis Suite)" },
  { category: "results", id: "epidemiology-econ", label: "R-9. 流行病标化与卫生经济学 (Epidemiology & Economics)" },

  // Discussion
  { category: "discussion", id: "writing", label: "D-1. 论文全稿撰写与学术优化 (Manuscript Writing)" },
  { category: "discussion", id: "robustness", label: "D-2. 偏倚量化与结果稳健性评估 (Bias & Robustness)" }
];

const SUB_GROUPS_MAP: Record<string, string> = {
  // Introduction
  "topic-planning": "planning",
  "literature-review": "literature",

  // Methods
  "research-design": "design",
  "ethics-crf": "design",
  "sample-size-estimation": "sample-size",
  "psm-matching": "rws-causal",
  "iptw-weighting": "rws-causal",
  "hdps-model": "rws-causal",
  "instrumental-variable": "rws-causal",
  "did-difference": "rws-causal",
  "rdd-discontinuity": "rws-causal",
  "data-cleaning": "cleaning-imputation",
  "multiple-imputation": "cleaning-imputation",
  "feature-engineering": "features-validation",
  "bootstrap-validation": "features-validation",
  "external-validation": "features-validation",

  // Results
  "baseline-desc": "descriptive",
  "disease-freq-desc": "descriptive",
  "exposure-freq-desc": "descriptive",
  "case-series-desc": "descriptive",
  "fourfold-diagnostic-desc": "descriptive",
  "survival-time-desc": "descriptive",
  "continuous-comparison": "comparison",
  "categorical-comparison": "comparison",
  "paired-comparison": "comparison",
  "multiple-testing-correction": "comparison",
  "stat-code-plot": "plotting",
  "linear-regression": "regression",
  "logistic-regression": "regression",
  "cox-regression": "regression",
  "mixed-effects-model": "regression",
  "gee-model": "regression",
  "poisson-regression": "regression",
  "competing-risk-model": "regression",
  "km-logrank-test": "regression",
  "interaction-analysis": "interaction-rcs",
  "dose-response-trend": "interaction-rcs",
  "interaction-testing": "interaction-rcs",
  "diagnostic-tools": "diagnostic",
  "diagnostic-performance": "diagnostic",
  "roc-auc-analysis": "diagnostic",
  "cutoff-youden": "diagnostic",
  "diagnostic-calibration": "diagnostic",
  "multivariate-diagnostic": "diagnostic",
  "delong-auc-test": "diagnostic",
  "prognostic-tools": "prognostic",
  "prognostic-discrimination": "prognostic",
  "prognostic-calibration": "prognostic",
  "nomogram-construction": "prognostic",
  "ml-prediction-model": "prognostic",
  "meta-analysis-suite": "meta",
  "meta-heterogeneity": "meta",
  "meta-pooling": "meta",
  "meta-subgroup": "meta",
  "meta-regression": "meta",
  "meta-publication-bias": "meta",
  "meta-sensitivity": "meta",
  "meta-tsa": "meta",
  "population-standardization": "epidemiology-econ",
  "health-economics": "epidemiology-econ",
  "complex-survey-weight": "epidemiology-econ",
  "age-standardization": "epidemiology-econ",
  "health-economic-evaluation": "epidemiology-econ",
  "mh-stratified-analysis": "epidemiology-econ",

  // Discussion
  "manuscript-writing": "writing",
  "references-formatting": "writing",
  "bias-robustness": "robustness",
  "e-value-sensitivity": "robustness",
  "negative-control-analysis": "robustness"
};

interface LandingPageProps {
  onLoginSuccess: (email: string, plan: string, isSubscribed: boolean) => void;
  isLoggedIn: boolean;
  userEmail: string | null;
  userPlan: string;
  isSubscribed: boolean;
  onLogout: () => void;
  onEnterWorkspace: () => void;
}

export function LandingPage({
  onLoginSuccess,
  isLoggedIn,
  userEmail,
  userPlan,
  isSubscribed,
  onLogout,
  onEnterWorkspace
}: LandingPageProps) {
  // Auth state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  // Subscription state
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState<"alipay" | "wechat" | "card">("alipay");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [isPaying, setIsPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  // Skills preview state removed since we are single-agent now

  // PICOS router state
  const [selectedPicosDesignId, setSelectedPicosDesignId] = useState("rct");
  const [picosP, setPicosP] = useState(PICOS_DESIGNS[0].p);
  const [picosI, setPicosI] = useState(PICOS_DESIGNS[0].i);
  const [picosC, setPicosC] = useState(PICOS_DESIGNS[0].c);
  const [picosO, setPicosO] = useState(PICOS_DESIGNS[0].o);
  const [picosS, setPicosS] = useState(PICOS_DESIGNS[0].s);
  
  const [picosTextQuery, setPicosTextQuery] = useState("");
  const [isAnalyzingPicos, setIsAnalyzingPicos] = useState(false);
  const [picosLogs, setPicosLogs] = useState<string[]>([]);
  const [selectedPicosChip, setSelectedPicosChip] = useState<string | null>(null);

  const PICOS_EXAMPLES = [
    {
      id: "ex-rct",
      title: "达格列净心衰 RCT",
      query: "一项前瞻性、双盲、随机对照试验。入组 300 例确诊为射血分数保留心力衰竭 (HFpEF) 的患者，随机分配到新型 SGLT2 抑制剂达格列净组或同期安慰剂对照组。随访 12 个月，观察核心结局指标：因心衰住院率、心血管死亡率以及 KCCQ 评分改善率，评价其疗效及临床安全性。",
      p: "射血分数保留心力衰竭患者 (HFpEF, N=300)",
      i: "新型 SGLT2 抑制剂达格列净 (Dapagliflozin)",
      c: "同期安慰剂对照组 (Placebo)",
      o: "因心衰住院率、心血管死亡率、KCCQ 评分改善率、临床安全性",
      s: "随机对照试验 (Randomized Controlled Trial)",
      designId: "rct"
    },
    {
      id: "ex-diagnostic",
      title: "Aβ 脑脊液 AD 诊断试验",
      query: "我想在 150 例疑似阿尔茨海默病患者中进行一项诊断性研究。通过测定脑脊液中新型 Aβ 寡聚体作为诊断指标，对照临床病理确诊金标准，从而评价该指标的灵敏度、特异度、约登指数及 ROC-AUC 诊断效能。",
      p: "疑似阿尔茨海默病患者 (Suspected AD, N=150)",
      i: "脑脊液新型 Aβ 寡聚体测定",
      c: "临床病理确诊金标准 (Pathology Gold Standard)",
      o: "灵敏度、特异度、约登指数、ROC-AUC 诊断效能",
      s: "诊断性研究 (Diagnostic Study)",
      designId: "diagnostic"
    },
    {
      id: "ex-rws",
      title: "糖尿病口服降糖药 RWS 因果推断",
      query: "基于多中心大型临床电子病历及医保数据库（真实世界研究）。回顾性收集 5000 例接受新型口服降糖药（暴露组）与经典双胍类治疗（对照组）的 2 型糖尿病患者。采用倾向评分匹配 (PSM) 和逆概率加权 (IPTW) 充分校正混杂特征，估计在真实临床场景下，新型降糖药对患者远期主要不良心血管事件 (MACE) 的实际临床因果效应及安全性指标。",
      p: "2型糖尿病患者 (T2D, N=5000)",
      i: "新型口服降糖药 (New Oral Hypoglycemics)",
      c: "经典双胍类治疗对照组 (Metformin)",
      o: "主要不良心血管事件 (MACE) 发生率、生存分析、临床安全性指标",
      s: "真实世界研究 (Real-World Study)",
      designId: "rws"
    },
    {
      id: "ex-prognostic",
      title: "三阴性乳腺癌 DFS 预后预测",
      query: "回顾性随访 250 例确诊为三阴性乳腺癌 (TNBC) 的术后患者。收集基线病理分期、基因突变、治疗方案等指标，随访中位时间 5 年，终点为无病生存期 (DFS)。拟构建多因素 Cox 比例风险模型，评价各预后因子，绘制发表级概率对齐列线图 (Nomogram)，并进行 Bootstrap 内部验证与外部验证集迁移校正评估。",
      p: "三阴性乳腺癌术后患者 (TNBC, N=250)",
      i: "预后相关病理/基因突变特征与治疗组",
      c: "非暴露或低危对照组",
      o: "无病生存期 (DFS)、C-index 区分度、校准曲线、列线图预测概率",
      s: "预后研究 (Prognostic Study)",
      designId: "prognostic"
    }
  ];

  // Sandbox routing removed

  const handlePicosChipClick = (chipId: string) => {
    setSelectedPicosChip(chipId);
    const preset = PICOS_EXAMPLES.find(ex => ex.id === chipId);
    if (preset) {
      setPicosTextQuery(preset.query);
      runPicosSimulation(preset);
    }
  };

  const handleCustomPicosSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!picosTextQuery.trim()) return;
    
    // Fuzzy search a match
    const queryLower = picosTextQuery.toLowerCase();
    let matchedPreset = PICOS_EXAMPLES[0]; // fallback
    if (queryLower.includes("诊断") || queryLower.includes("roc") || queryLower.includes("auc") || queryLower.includes("灵敏")) {
      matchedPreset = PICOS_EXAMPLES[1];
    } else if (queryLower.includes("rws") || queryLower.includes("真实世界") || queryLower.includes("因果") || queryLower.includes("倾向")) {
      matchedPreset = PICOS_EXAMPLES[2];
    } else if (queryLower.includes("乳腺癌") || queryLower.includes("生存") || queryLower.includes("列线") || queryLower.includes("nomo")) {
      matchedPreset = PICOS_EXAMPLES[3];
    }
    
    const customPreset = {
      ...matchedPreset,
      query: picosTextQuery,
    };
    
    runPicosSimulation(customPreset);
  };

  const runPicosSimulation = (preset: typeof PICOS_EXAMPLES[0]) => {
    setIsAnalyzingPicos(true);
    setPicosLogs([]);
    
    const logs = [
      "[PICOS Parser] Initializing high-throughput extraction agent...",
      "[PICOS Parser] Scanning natural language input for medical entities...",
      `[PICOS Parser] Detected design keyword hints matching [S]: ${preset.s}`,
      `[PICOS Parser] Extracted Population [P]: ${preset.p}`,
      `[PICOS Parser] Extracted Intervention [I]: ${preset.i}`,
      `[PICOS Parser] Extracted Comparison [C]: ${preset.c}`,
      `[PICOS Parser] Extracted Outcome [O]: ${preset.o}`,
      "[PICOS Router] Testing statistical compatibility and covariate bounds...",
      `[PICOS Router] Successfully routed to Clinical Study Design Matrix: ZS-0${PICOS_DESIGNS.findIndex(d => d.id === preset.designId) + 1}`,
      "[PICOS Router] COMPILATION COMPLETED. Routing rules updated."
    ];
    
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < logs.length) {
        setPicosLogs(prev => [...prev, logs[currentIdx]]);
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsAnalyzingPicos(false);
        // Apply values
        setSelectedPicosDesignId(preset.designId);
        setPicosP(preset.p);
        setPicosI(preset.i);
        setPicosC(preset.c);
        setPicosO(preset.o);
        setPicosS(preset.s);
      }
    }, 120);
  };

  const handleActivateSandboxForMethod = (methodName: string) => {
    if (isLoggedIn) {
      onEnterWorkspace();
    } else {
      setAuthTab("login");
      setShowAuthModal(true);
    }
  };

  // Quick credentials fill
  const handleQuickFill = () => {
    setEmail("admin@academic-ai.com");
    setPassword("admin123");
    setAuthError("");
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (!email || !password) {
      setAuthError("请填写所有必填字段");
      return;
    }

    if (authTab === "login") {
      if (email === "admin@academic-ai.com" && password === "admin123") {
        setAuthSuccess("登录成功！欢迎回来");
        setTimeout(() => {
          onLoginSuccess(email, "学术专业版", true); // Pre-subscribe admin
          setShowAuthModal(false);
        }, 1000);
      } else if (email.includes("@")) {
        setAuthSuccess("登录成功！欢迎回来");
        setTimeout(() => {
          onLoginSuccess(email, "免费体验版", false); // Default free
          setShowAuthModal(false);
        }, 1000);
      } else {
        setAuthError("用户名或密码错误。您可点击下方'快捷填入'使用测试账号进行测试。");
      }
    } else {
      if (!email.includes("@")) {
        setAuthError("请输入合法的邮箱地址");
        return;
      }
      setAuthSuccess("注册成功！已为您自动登录并送1天专业体验。");
      setTimeout(() => {
        onLoginSuccess(email, "免费体验版", false);
        setShowAuthModal(false);
      }, 1200);
    }
  };

  const handleSubscribeClick = (planId: string) => {
    if (!isLoggedIn) {
      setAuthTab("login");
      setShowAuthModal(true);
      return;
    }
    
    if (planId === "free") {
      onLoginSuccess(userEmail || "guest@academic-ai.com", "免费体验版", false);
      alert("已切换为免费体验版");
      return;
    }

    setSelectedPlanId(planId);
    setPaySuccess(false);
    setShowPayModal(true);
  };

  const handleProcessPayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaySuccess(true);
      const planName = selectedPlanId === "pro" ? "学术专业版" : "实验室/机构高级版";
      setTimeout(() => {
        onLoginSuccess(userEmail || "user@academic-ai.com", planName, true);
        setShowPayModal(false);
      }, 1200);
    }, 2000);
  };

  const plans = [
    {
      id: "free",
      name: "免费体验版",
      desc: "适合科研初学者，提供基础规划和AI探路者功能",
      priceMonthly: 0,
      priceYearly: 0,
      features: [
        "每日 5 次 AI 智能额度",
        "基础选题规划与引言撰写",
        "单步数据清洗与缺失值处理",
        "标准 R/Python 绘图代码预览",
        "网页端在线常规客服支持"
      ],
      notIncluded: [
        "解锁全部 12 大高级学术特化工具",
        "多步骤流式学术工作链 (Research Workchains)",
        "极速专用掌术医学大模型处理链路",
        "EndNote/BibTeX/Word 参考文献一键排版",
        "商业或高级学术论文发表授权证书"
      ],
      popular: false,
      ctaText: "当前版本"
    },
    {
      id: "pro",
      name: "学术专业版",
      desc: "最受硕博研究生与科研工作者喜爱的黄金方案，解锁全部功能",
      priceMonthly: 99,
      priceYearly: 79, // Represents discounted average monthly
      features: [
        "解锁全部 12 大智能学术特化工具",
        "无限制使用多阶流式学术工作链",
        "极速优先专用掌术医学大模型通道",
        "无限量学术论文润色、翻译与清样校对",
        "一键生成 R (ggplot2) 和 Python 专业统计图",
        "完整的 Point-by-point 审稿意见精妙回复生成",
        "参考文献标准格式（Nature, APA, IEEE）一键排版",
        "支持本地 CLI 命令行客户端一键批量调用 (CLI命令支持)",
        "提供标准的发表级语言修饰及学术授权授权书"
      ],
      notIncluded: [],
      popular: true,
      ctaText: "立即订阅"
    },
    {
      id: "enterprise",
      name: "实验室/机构高级版",
      desc: "专为课题组、实验室及企业研发团队设计的高效协同方案",
      priceMonthly: 499,
      priceYearly: 399,
      features: [
        "包含学术专业版全部特化能力",
        "支持 5 - 20 个独立协同席位",
        "实验室数据自托管备份 (Firestore 专属集成)",
        "支持本地 CLI 命令行客户端一键批量调用 (CLI命令支持)",
        "一键导出团队全链条科研大纲与CRF表",
        "专属掌术医学大模型自定义 Prompt 模板共享库",
        "1对1 资深期刊审稿专家及统计学家在线答疑",
        "提供机构专属发票开具与经费报销绿色通道"
      ],
      notIncluded: [],
      popular: false,
      ctaText: "立即订阅"
    }
  ];

  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case "Sparkles": return <Sparkles className="h-5 w-5 text-[#111111]" strokeWidth={1.2} />;
      case "FileText": return <FileText className="h-5 w-5 text-[#111111]" strokeWidth={1.2} />;
      case "Layers": return <Layers className="h-5 w-5 text-[#111111]" strokeWidth={1.2} />;
      case "ShieldCheck": return <ShieldCheck className="h-5 w-5 text-[#111111]" strokeWidth={1.2} />;
      case "Database": return <Database className="h-5 w-5 text-[#111111]" strokeWidth={1.2} />;
      case "Cpu": return <Cpu className="h-5 w-5 text-[#111111]" strokeWidth={1.2} />;
      case "Code": return <Code className="h-5 w-5 text-[#111111]" strokeWidth={1.2} />;
      case "BookOpen": return <BookOpen className="h-5 w-5 text-[#111111]" strokeWidth={1.2} />;
      case "Languages": return <FileText className="h-5 w-5 text-[#111111]" strokeWidth={1.2} />;
      case "Search": return <Search className="h-5 w-5 text-[#111111]" strokeWidth={1.2} />;
      case "MessageSquare": return <MessageSquare className="h-5 w-5 text-[#111111]" strokeWidth={1.2} />;
      case "ClipboardCheck": return <ClipboardCheck className="h-5 w-5 text-[#111111]" strokeWidth={1.2} />;
      default: return <Sparkles className="h-5 w-5 text-[#111111]" strokeWidth={1.2} />;
    }
  };

  // Unused currentPreview removed since we are single-agent now

  const revisionScenarios = [
    {
      draft: "We did a very bad survey and found out that ...",
      revised: "We conducted a comprehensive review and observed that ...",
      explanation: "使用学术界更偏爱的动作词“conducted”和中性描述“comprehensive”来替代口语化的“very bad”，让论述更具客观性与研究者风范。",
      category: "学术措辞"
    },
    {
      draft: "... to get result and see if the cells die or not.",
      revised: "... to derive empirical outcomes and evaluate cellular viability.",
      explanation: "将极度口语化的“get result”以及“die or not”替换为更专业的概念，如“derive empirical outcomes”（获取实证结果）和“cellular viability”（细胞活力）。",
      category: "学术名词"
    },
    {
      draft: "I think this is because the drug works good in mice.",
      revised: "It is hypothesized that this efficacy is attributed to the murine model's high responsiveness.",
      explanation: "剔除第一人称口语化猜测，替换为客观的被动或陈述句式（It is hypothesized），并用“efficacy”和“responsiveness”提升科学信度。",
      category: "逻辑严谨"
    }
  ];

  const [activeManuscriptHighlight, setActiveManuscriptHighlight] = useState<number>(0);
  const [activeComboTab, setActiveComboTab] = useState<"survival" | "cytokine">("cytokine");

  return (
    <div id="landing-container" className="min-h-screen bg-[#FAF9F6] text-[#111111] font-sans relative overflow-x-hidden selection:bg-[#111111] selection:text-white texture-paper-overlay">
      
      {/* 1. Header Navigation */}
      <nav className="border-b border-[#111111]/15 bg-[#FAF9F6]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-[#6B1724] flex items-center justify-center text-white border border-[#6B1724] shadow-sm">
                <Brain className="h-5.5 w-5.5 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <span className="text-base font-serif font-extrabold tracking-tight text-[#111111] block leading-none">
                  掌术AI
                </span>
                <span className="text-[9px] text-[#111111]/60 font-mono tracking-widest uppercase mt-1 block">
                  ZHANGSHU AI PLATFORM
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8 font-mono text-[11px] uppercase tracking-wider font-semibold text-[#111111]/70">
              <a href="#features" className="hover:text-[#111111] transition-all duration-100 flex items-center gap-1.5">
                <span className="text-[9px] text-[#111111]/40">[01]</span> 核心工具
              </a>
              <a href="#workflows" className="hover:text-[#111111] transition-all duration-100 flex items-center gap-1.5">
                <span className="text-[9px] text-[#111111]/40">[02]</span> 学术工作链
              </a>
              <a href="#pricing" className="hover:text-[#111111] transition-all duration-100 flex items-center gap-1.5">
                <span className="text-[9px] text-[#111111]/40">[03]</span> 订阅方案
              </a>
              <a href="#safety" className="hover:text-[#111111] transition-all duration-100 flex items-center gap-1.5">
                <span className="text-[9px] text-[#111111]/40">[04]</span> 学术安全
              </a>
            </div>

            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-end text-right">
                    <span className="text-xs font-mono font-medium text-[#111111]">{userEmail}</span>
                    <span className="text-[8px] px-1.5 py-0.5 mt-1 bg-[#6B1724] text-white font-mono uppercase tracking-widest font-black border border-[#6B1724]">
                      {userPlan}
                    </span>
                  </div>
                  <button 
                    onClick={onEnterWorkspace}
                    className="px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-widest bg-[#6B1724] text-white border border-[#6B1724] hover:bg-[#5C131D] transition-all duration-100 rounded-none flex items-center gap-1.5 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6B1724]"
                  >
                    <span>进入工作区</span>
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                  <button 
                    onClick={onLogout}
                    title="登出账户"
                    className="p-2.5 bg-transparent border border-[#111111]/15 hover:border-[#111111] text-[#111111]/60 hover:text-[#111111] transition-all duration-100 rounded-none cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => { setAuthTab("login"); setShowAuthModal(true); }}
                    className="px-3 py-2 text-xs font-mono font-bold uppercase tracking-widest text-[#111111]/70 hover:text-[#111111] hover:underline cursor-pointer"
                  >
                    登录
                  </button>
                  <button
                    onClick={() => { setAuthTab("register"); setShowAuthModal(true); }}
                    className="px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-widest bg-[#6B1724] text-white border border-[#6B1724] hover:bg-[#5C131D] transition-all duration-100 rounded-none cursor-pointer"
                  >
                    立即注册
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section (Asymmetric Split Layout - LaTeX Preprint Style) */}
      <section className="relative border-b-4 border-double border-[#111111] bg-[#FAF9F6] texture-grid">
        {/* Top bar across full page width */}
        <div className="border-b border-[#111111]/10 py-3 text-[10px] font-mono tracking-[0.2em] text-[#111111]/50 uppercase">
          <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-[#6B1724]" />
              <span className="font-bold text-[#6B1724]">PREPRINT MANUSCRIPT SUBMISSION</span>
            </div>
            <div className="hidden md:block">PEER-REVIEWED SCHOLARLY RESEARCH UTILITIES</div>
            <div className="flex items-center gap-2">
              <span>DOI: 10.3291/ZHANGSHU.AI.V1</span>
              <span className="h-1.5 w-1.5 bg-[#6B1724]" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: LaTeX Paper Format (7 cols) */}
            <div className="lg:col-span-7 text-left space-y-6">
              {/* Journal Banner Heading */}
              <div className="border-b-4 border-double border-[#111111] pb-3 pt-1 text-center sm:text-left">
                <span className="text-[10px] font-mono tracking-[0.25em] text-[#6B1724] font-black uppercase block mb-1">
                  ZHANGSHU JOURNAL OF COMPUTATIONAL SCHOLARSHIP
                </span>
                <div className="flex flex-wrap items-center justify-between text-[9px] font-mono text-[#111111]/60 uppercase tracking-wider">
                  <span>VOL. 26, NO. 6, JUNE 2026</span>
                  <span>ISSN 2835-1921 (ONLINE)</span>
                </div>
              </div>

              {/* Title & Authors */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-[#111111] leading-[1.1]">
                  掌术 AI 科研工作站 <br />
                  <span className="font-light italic text-[#6B1724] text-xl sm:text-3xl block mt-2 font-serif">
                    An Integrated Multi-Agent Architecture for End-to-End Scientific Publishing
                  </span>
                </h1>
                
                <div className="pt-2 font-mono text-[10px] text-[#111111]/70 leading-relaxed">
                  <p className="font-bold text-[#111111]">
                    掌术学术软件研究组 <sup className="text-[#6B1724]">1, 2</sup>, 联合科学掌术医学大模型测评实验室 <sup className="text-[#6B1724]">3</sup>
                  </p>
                  <p className="text-[9px] text-[#111111]/50 mt-1">
                    <sup>1</sup> 智能认知前沿教育部重点实验室 &nbsp;&bull;&nbsp; <sup>2</sup> 科学计量与成果自动评估研究所 &nbsp;&bull;&nbsp; <sup>3</sup> AI Studio 开放实验室
                  </p>
                </div>
              </div>

              {/* Credentials / Badges */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[9px] text-[#111111]/50 pt-2 border-b border-[#111111]/10 pb-4">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#6B1724]" />
                  <span>DATA CONFIDENTIALITY (COMPLIANT)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#6B1724]" />
                  <span>PRE-PUBLISHING GRADE (GRADE-A)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#6B1724]" />
                  <span>PUBLISHING GROUP ETHICS (COPE COMPLIANT)</span>
                </div>
              </div>

              {/* Core Feature Index Grid */}
              <div className="space-y-3 pt-2">
                <div className="text-[10px] font-mono tracking-wider text-[#6B1724] font-bold uppercase flex items-center gap-2">
                  <span>SYSTEM SPECIFICATIONS / 平台能力标准</span>
                  <span className="h-[1px] bg-[#6B1724]/20 flex-1"></span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-[11px] leading-relaxed">
                  <div className="space-y-1">
                    <div className="font-bold text-[#111111] border-b border-[#111111]/15 pb-1">01 / 学术语言重构</div>
                    <p className="text-[#111111]/60 text-[10px] leading-normal">基于高标准学术指令调校，重塑词汇与句式，输出严谨学术文风。</p>
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-[#111111] border-b border-[#111111]/15 pb-1">02 / 高精度图表拟合</div>
                    <p className="text-[#111111]/60 text-[10px] leading-normal">支持多变量关系自动扫描，一键输出符合出版级标准的矢量统计图。</p>
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-[#111111] border-b border-[#111111]/15 pb-1">03 / 多场景指令覆盖</div>
                    <p className="text-[#111111]/60 text-[10px] leading-normal">全面覆盖选题、数据清洗、绘图、初稿起草及修回回复等核心工作流。</p>
                  </div>
                </div>
              </div>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <button 
                  onClick={isLoggedIn ? onEnterWorkspace : () => { setAuthTab("register"); setShowAuthModal(true); }}
                  className="px-8 py-4 bg-[#6B1724] hover:bg-[#5C131D] text-white border border-[#6B1724] text-xs font-mono font-bold uppercase tracking-widest transition-all duration-100 rounded-none flex items-center justify-center gap-2.5 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6B1724] focus-visible:outline-offset-2"
                >
                  <span>立即开启学术探索 (ENTER WORKSPACE)</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </button>
                <a 
                  href="#pricing"
                  className="px-8 py-4 bg-transparent text-[#111111] border border-[#111111]/20 hover:border-[#111111] hover:bg-[#111111]/5 text-xs font-mono font-bold uppercase tracking-widest transition-all duration-100 rounded-none flex items-center justify-center gap-2"
                >
                  查看订阅方案 (VIEW PRICING)
                </a>
              </div>
            </div>

            {/* Right Column: AI Scientific Plot Generation Workspace (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white border-2 border-[#111111] rounded-none p-5 shadow-sm relative overflow-hidden texture-paper-overlay flex flex-col h-full justify-between space-y-4">
                
                {/* Academic Preprint Header */}
                <div className="border-b-4 border-double border-[#111111] pb-2 flex items-center justify-between">
                  <div className="text-[9px] font-mono tracking-widest text-[#6B1724] font-black uppercase">
                    AI SCIENTIFIC VECTOR PLOT ENGINE
                  </div>
                  <div className="text-[8px] font-mono uppercase bg-[#6B1724]/10 text-[#6B1724] px-1.5 py-0.5 border border-[#6B1724]/20 font-black">
                    VECTOR SYNTHESIZER
                  </div>
                </div>



                {/* Panel: PUBLISHED GRADE PLOT & MACHINE LEARNING MODEL FITTING */}
                <div className="space-y-1.5 flex-1 flex flex-col min-h-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-mono font-black text-[#6B1724] uppercase tracking-wider">
                      [&sect; 4.3 VECTOR SYNTHESIS WORKSPACE / 智能学术图表生成]
                    </span>
                    <span className="text-[7.5px] font-mono text-[#111111]/45 uppercase font-bold select-none">
                      COPE COMPLIANT
                    </span>
                  </div>

                  <ScientificPlotGeneratorDemo activeComboTab={activeComboTab} />
                </div>

                {/* Footnote status check */}
                <div className="pt-2.5 border-t border-[#111111]/10 text-center select-none">
                  <span className="text-[8.5px] font-mono text-[#6B1724]/70 font-bold uppercase tracking-widest animate-pulse flex items-center justify-center gap-1.5">
                    <span className="h-1 w-1 bg-[#6B1724] rounded-full inline-block" />
                    <span>学术合规：生成图表符合顶级期刊发表级规范标准</span>
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. ZHANGSHU Academic Agent Core Capabilities Showcase */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6 md:px-10 border-b-4 border-double border-[#111111]">
        
        {/* Section Header */}
        <div className="mb-16 border-b border-[#111111] pb-6">
          <div className="flex items-center gap-3 text-xs font-mono text-[#6B1724] font-black uppercase tracking-[0.25em] mb-4">
            <span>&sect; 4.0 AGENT CORE COGNITIVE SERVICES / 核心能效业务场景</span>
            <span className="h-0.5 w-16 bg-[#6B1724]/30" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <h2 className="md:col-span-7 text-3xl sm:text-4xl font-serif font-black tracking-tight text-[#111111] leading-tight">
              掌术智能学术科研 Agent <br />
              <span className="font-light italic text-[#6B1724]">An All-in-One Scientific Research &amp; Publishing Co-pilot</span>
            </h2>
            <p className="md:col-span-5 text-[#111111]/70 text-xs sm:text-sm leading-relaxed font-serif text-justify">
              本学术助理已对各种医学、工学、理学等研究学科的格式、词汇及严密逻辑规范进行全方位的强化微调。通过极简的对话终端和创新的文献路由器架构，一键覆盖从选题开题、方案设计、论文精修润色，到发表答辩等学术全周期，输出专业、精准，拒绝冗余废话。
            </p>
          </div>
        </div>

        {/* Capabilities Grid Layout (2x2 Bento or Grid Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Literature Synthesis */}
          <div className="p-8 bg-white border-2 border-[#111111] hover:border-[#6B1724] transition-all duration-150 flex flex-col justify-between texture-paper-overlay">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="h-11 w-11 bg-[#6B1724]/5 border border-[#6B1724]/10 text-[#6B1724] flex items-center justify-center">
                  <BookOpen className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <span className="text-[9px] font-mono uppercase bg-[#FAF9F6] border border-[#111111]/10 text-[#111111]/50 px-2 py-0.5 font-bold">ZS-AGENT-01</span>
              </div>
              <h3 className="text-xl font-serif font-black text-[#111111] mb-3">深度文献情报检索与汇总 (Literature Intel)</h3>
              <p className="text-xs sm:text-[13px] text-[#111111]/75 font-serif leading-relaxed text-justify mb-6">
                自动连接并分析多篇核心期刊研究，一键检索并精准翻译PubMed、IEEE等文献摘要、结论及实验参数。为您提取主流观点的对立论据，并梳理出尚未被攻克的空白选题，帮助您快速制定极极具学术创新潜力的课题方案。
              </p>
            </div>
            <div className="border-t border-[#111111]/10 pt-4 flex items-center justify-between">
              <span className="text-[9.5px] font-mono text-[#6B1724] font-black uppercase tracking-wider">&sect; 前沿情报检索与立题综述</span>
              <button 
                onClick={isLoggedIn ? onEnterWorkspace : () => { setAuthTab("login"); setShowAuthModal(true); }}
                className="text-xs font-mono font-bold hover:text-[#6B1724] flex items-center gap-1 cursor-pointer"
              >
                <span>立即体验</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Card 2: Academic Drafting & Polishing */}
          <div className="p-8 bg-white border-2 border-[#111111] hover:border-[#6B1724] transition-all duration-150 flex flex-col justify-between texture-paper-overlay">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="h-11 w-11 bg-[#6B1724]/5 border border-[#6B1724]/10 text-[#6B1724] flex items-center justify-center">
                  <Sparkles className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <span className="text-[9px] font-mono uppercase bg-[#FAF9F6] border border-[#111111]/10 text-[#111111]/50 px-2 py-0.5 font-bold">ZS-AGENT-02</span>
              </div>
              <h3 className="text-xl font-serif font-black text-[#111111] mb-3">高水平中英双语学术润色 (Academic Polishing)</h3>
              <p className="text-xs sm:text-[13px] text-[#111111]/75 font-serif leading-relaxed text-justify mb-6">
                针对Nature、Science、Lancet等顶级期刊的审稿人写作偏好，深度重塑口语化句式。采用严谨的学术被动语态（Passive Voice），重构复杂逻辑从句，丰富论证深度与连贯性。支持段落、长文、甚至大纲草拟的精益打磨。
              </p>
            </div>
            <div className="border-t border-[#111111]/10 pt-4 flex items-center justify-between">
              <span className="text-[9.5px] font-mono text-[#6B1724] font-black uppercase tracking-wider">&sect; 发表级全稿语言修缮精细度</span>
              <button 
                onClick={isLoggedIn ? onEnterWorkspace : () => { setAuthTab("login"); setShowAuthModal(true); }}
                className="text-xs font-mono font-bold hover:text-[#6B1724] flex items-center gap-1 cursor-pointer"
              >
                <span>立即体验</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Card 3: Vector Plot Synthesis */}
          <div className="p-8 bg-white border-2 border-[#111111] hover:border-[#6B1724] transition-all duration-150 flex flex-col justify-between texture-paper-overlay">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="h-11 w-11 bg-[#6B1724]/5 border border-[#6B1724]/10 text-[#6B1724] flex items-center justify-center">
                  <Cpu className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <span className="text-[9px] font-mono uppercase bg-[#FAF9F6] border border-[#111111]/10 text-[#111111]/50 px-2 py-0.5 font-bold">ZS-AGENT-03</span>
              </div>
              <h3 className="text-xl font-serif font-black text-[#111111] mb-3">出版级矢量图表与统计分析 (Vector Plot synthesis)</h3>
              <p className="text-xs sm:text-[13px] text-[#111111]/75 font-serif leading-relaxed text-justify mb-6">
                支持输入复杂的科研自变量与因变量关系。Agent将根据统计学模型，自动计算并生成发表级的矢量统计图。通过高度整合的 Scientific Plotting 代码适配机制，一键获取R、Python绘图逻辑并生成可视化分析结果。
              </p>
            </div>
            <div className="border-t border-[#111111]/10 pt-4 flex items-center justify-between">
              <span className="text-[9.5px] font-mono text-[#6B1724] font-black uppercase tracking-wider">&sect; R &amp; Python 绘图代码合规</span>
              <button 
                onClick={isLoggedIn ? onEnterWorkspace : () => { setAuthTab("login"); setShowAuthModal(true); }}
                className="text-xs font-mono font-bold hover:text-[#6B1724] flex items-center gap-1 cursor-pointer"
              >
                <span>立即体验</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Card 4: Study Design */}
          <div className="p-8 bg-white border-2 border-[#111111] hover:border-[#6B1724] transition-all duration-150 flex flex-col justify-between texture-paper-overlay">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="h-11 w-11 bg-[#6B1724]/5 border border-[#6B1724]/10 text-[#6B1724] flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <span className="text-[9px] font-mono uppercase bg-[#FAF9F6] border border-[#111111]/10 text-[#111111]/50 px-2 py-0.5 font-bold">ZS-AGENT-04</span>
              </div>
              <h3 className="text-xl font-serif font-black text-[#111111] mb-3">科学严谨的临床/工程试验方案设计 (Study Design Matrix)</h3>
              <p className="text-xs sm:text-[13px] text-[#111111]/75 font-serif leading-relaxed text-justify mb-6">
                在与您对话交互中快速确定研究的研究类型（RCT、队列、诊断、预测、真实世界、实验室动物等）。基于PICOS框架，为您设计详细的分组、匹配、剂量设置和入排标准，并计算所需的样本量与统计学功效参数。
              </p>
            </div>
            <div className="border-t border-[#111111]/10 pt-4 flex items-center justify-between">
              <span className="text-[9.5px] font-mono text-[#6B1724] font-black uppercase tracking-wider">&sect; 伦理要点、CRF 表与样本量估算</span>
              <button 
                onClick={isLoggedIn ? onEnterWorkspace : () => { setAuthTab("login"); setShowAuthModal(true); }}
                className="text-xs font-mono font-bold hover:text-[#6B1724] flex items-center gap-1 cursor-pointer"
              >
                <span>立即体验</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Placeholder to keep layout ID anchors happy */}
      <div id="workflows" className="hidden"></div>
      <div id="unused-features" className="hidden"></div>

      {/* 5. Inverted Stats Section (Styled as an Academic LaTeX Table) */}
      <section className="py-24 bg-[#111111] text-white relative overflow-hidden border-b-4 border-double border-[#111111] texture-stats-dark">
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          
          <div className="text-center mb-10">
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#E5E5E5]/60 uppercase font-bold block mb-2">
              SYSTEM BENCHMARK EVALUATIONS
            </span>
            <span className="text-[11px] font-mono text-[#E5E5E5]/40 uppercase tracking-widest block">
              TABLE I. PERFORMANCE METRICS AND COGNITIVE KNOWLEDGE BASES (V1.2)
            </span>
          </div>

          {/* Simulated LaTeX Table (Classic Print Grid - horizontal rules only) */}
          <div className="max-w-4xl mx-auto border-t-2 border-b-2 border-white/80 py-4 font-mono text-[11px] uppercase tracking-wider">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 pb-3 border-b border-white/20 font-bold text-[#6B1724] text-[#E5E5E5] tracking-widest text-[9px] md:text-[10px]">
              <div className="col-span-4 md:col-span-3">METRIC PARAMETER</div>
              <div className="col-span-3 text-center">VALUE</div>
              <div className="col-span-5 md:col-span-6">SCHOLARLY SIGNIFICANCE & ANALYSIS</div>
            </div>

            {/* Table Row 1 */}
            <div className="grid grid-cols-12 gap-4 py-3.5 border-b border-white/10 items-center">
              <div className="col-span-4 md:col-span-3 font-bold text-white">[01] AVAILABILITY</div>
              <div className="col-span-3 text-center text-[#6B1724] text-amber-500 font-bold text-sm sm:text-base">99.98%</div>
              <div className="col-span-5 md:col-span-6 text-[10px] text-white/70 font-serif normal-case leading-relaxed">
                高峰期多区域高可用集群负载，确保毫秒级掌术医学大模型吞吐回复，无宕机或连接超时风险。
              </div>
            </div>

            {/* Table Row 2 */}
            <div className="grid grid-cols-12 gap-4 py-3.5 border-b border-white/10 items-center">
              <div className="col-span-4 md:col-span-3 font-bold text-white">[02] CORPUS SIZE</div>
              <div className="col-span-3 text-center text-[#6B1724] text-amber-500 font-bold text-sm sm:text-base">1.2B+ Tokens</div>
              <div className="col-span-5 md:col-span-6 text-[10px] text-white/70 font-serif normal-case leading-relaxed">
                语料库覆盖主流 Elsevier, IEEE, Springer 期刊精选高被引文献及修回回复句式，掌术医学大模型输出学术感极强。
              </div>
            </div>

            {/* Table Row 3 */}
            <div className="grid grid-cols-12 gap-4 py-3.5 border-b border-white/10 items-center">
              <div className="col-span-4 md:col-span-3 font-bold text-white">[03] COGNITIVE RANGE</div>
              <div className="col-span-3 text-center text-[#6B1724] text-amber-500 font-bold text-sm sm:text-base">12+ Domains</div>
              <div className="col-span-5 md:col-span-6 text-[10px] text-white/70 font-serif normal-case leading-relaxed">
                专精于生物医药、临床试验、计算机网络、社会科学及工程力学等主要领域的 LaTeX 标准叙述与推理。
              </div>
            </div>

            {/* Table Row 4 */}
            <div className="grid grid-cols-12 gap-4 py-3.5 items-center">
              <div className="col-span-4 md:col-span-3 font-bold text-white">[04] DATA SECURE</div>
              <div className="col-span-3 text-center text-[#6B1724] text-amber-500 font-bold text-sm sm:text-base">0% Leakage</div>
              <div className="col-span-5 md:col-span-6 text-[10px] text-white/70 font-serif normal-case leading-relaxed">
                数据遵循赫尔辛基宣言和科学伦理审查协议，双向加密信道处理，数据缓存 24h 物理抹除，绝不用于公有训练。
              </div>
            </div>
          </div>

          <div className="text-center mt-6 text-[9px] font-mono text-white/40 uppercase tracking-widest">
            * Note: System latency has been validated under double-blind simulation conditions.
          </div>

        </div>
      </section>

      {/* Editorial Pull Quote Section */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center border-b-4 border-double border-[#111111]/15 bg-[#FAF9F6] texture-paper-overlay">
        <span className="text-[40px] md:text-[60px] font-serif italic text-[#6B1724]/20 block leading-none mb-4 font-black">“</span>
        <blockquote className="text-xl md:text-2xl font-serif italic leading-relaxed text-[#111111] mb-6">
          科研不只是知识的简单堆砌，更是表达契合度与严谨逻辑秩序的艺术。掌术 AI 成功将通用语言模型的泛化生成，提炼为格式严苛、极具学术尊严的高水平工具，彻底解决了科研工作者‘最难熬’的最后一公里。
        </blockquote>
        <cite className="text-xs font-mono tracking-widest text-[#6B1724] uppercase not-italic font-black">
          — [Chen et al., 2026] &bull; SCI 期刊资深客座审稿人 / 科学评阅人
        </cite>
      </section>

      {/* 6. Subscription Pricing Grid */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-6 md:px-10 border-b-4 border-double border-[#111111]">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-3 text-xs font-mono text-[#6B1724] font-black uppercase tracking-[0.25em] mb-4">
            <span className="h-0.5 w-10 bg-[#6B1724]/30" />
            <span>&sect; 6.0 SUBSCRIPTION MODEL AND BUDGETING</span>
            <span className="h-0.5 w-10 bg-[#6B1724]/30" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-[#111111] mb-4">
            透明且符合报销标准的订阅资费
          </h2>
          <p className="text-[#111111]/70 text-xs sm:text-sm font-serif max-w-2xl mx-auto leading-relaxed">
            支持微信支付、支付宝及正规发票在线极速订阅。按月或按年弹性开支扣费，提供可由团队经费及高校横向/纵向课题报销的正规学术发票与系统服务合同。
          </p>

          {/* Toggle Switch Monthly / Yearly (Crisp border-radius 0 style) */}
          <div className="mt-10 inline-flex items-center border-2 border-[#111111] p-1 bg-white">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-100 rounded-none cursor-pointer ${
                billingCycle === "monthly" ? "bg-[#6B1724] text-white border border-[#6B1724]" : "text-[#111111]/60 hover:text-[#6B1724]"
              }`}
            >
              按月支付 (MONTHLY)
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-100 rounded-none flex items-center gap-2 cursor-pointer ${
                billingCycle === "yearly" ? "bg-[#6B1724] text-white border border-[#6B1724]" : "text-[#111111]/60 hover:text-[#6B1724]"
              }`}
            >
              <span>按年订阅 (YEARLY)</span>
              <span className={`px-2 py-0.5 text-[8px] font-mono font-bold ${billingCycle === "yearly" ? "bg-[#5C131D] text-white" : "bg-[#6B1724]/10 text-[#6B1724] border border-[#6B1724]/20"}`}>
                省 20% OFF
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const price = billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly;
            const isCurrent = isLoggedIn && userPlan === plan.name;
            
            return (
              <div 
                key={plan.id}
                className={`p-8 flex flex-col justify-between relative transition-all duration-150 rounded-none border-2 group hover:bg-white texture-paper-overlay ${
                  plan.popular 
                    ? "border-[#6B1724] md:-translate-y-4 shadow-md bg-white" 
                    : "border-[#111111]/15 hover:border-[#6B1724] bg-transparent"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-[#6B1724] text-white text-[9px] font-mono font-bold uppercase tracking-widest px-4 py-1.5 flex items-center gap-1.5 border border-[#6B1724]">
                    <Star className="h-3 w-3 fill-current text-white" />
                    <span>RECOMMENDED • 硕博首选推荐</span>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-serif font-black text-[#111111] mb-2">{plan.name}</h3>
                  <p className="text-xs text-[#111111]/60 font-serif leading-normal mb-8 min-h-[36px]">{plan.desc}</p>
                  
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-[#6B1724] text-sm font-black">¥</span>
                    <span className="text-4xl md:text-5xl font-mono font-black text-[#111111] tracking-tighter">
                      {price}
                    </span>
                    <span className="text-[#111111]/50 text-xs font-mono uppercase tracking-wider ml-1">
                      / month {billingCycle === "yearly" && "(年付)"}
                    </span>
                  </div>

                  <div className="space-y-4 border-t border-[#111111]/10 pt-6">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#6B1724] font-black mb-3">权益包含 (INCLUSIONS)：</p>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-[#111111]/70 leading-normal">
                        <Check className="h-4 w-4 text-[#6B1724] shrink-0 mt-0.5" strokeWidth={2.5} />
                        <span className="font-serif">{feat}</span>
                      </div>
                    ))}

                    {plan.notIncluded && plan.notIncluded.length > 0 && (
                      <div className="space-y-4 pt-3 border-t border-[#111111]/10">
                        {plan.notIncluded.map((feat, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-400 leading-normal">
                            <X className="h-4 w-4 text-neutral-300 shrink-0 mt-0.5" strokeWidth={2.5} />
                            <span className="line-through font-serif">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-[#111111]/10">
                  <button
                    onClick={() => handleSubscribeClick(plan.id)}
                    disabled={isCurrent && plan.id === "free"}
                    className={`w-full py-4 text-xs font-mono font-black uppercase tracking-widest transition-all duration-100 rounded-none cursor-pointer focus-visible:outline focus-visible:outline-2 ${
                      isCurrent
                        ? "bg-[#FAF9F6] text-neutral-400 border border-[#111111]/10 cursor-default"
                        : plan.popular
                          ? "bg-[#6B1724] text-white border border-[#6B1724] hover:bg-[#5C131D] hover:border-[#5C131D]"
                          : "bg-transparent text-[#111111] border-2 border-[#111111] hover:border-[#6B1724] hover:bg-[#6B1724] hover:text-white"
                    }`}
                  >
                    {isCurrent ? "当前版本" : plan.ctaText}
                  </button>
                  {plan.id !== "free" && (
                    <p className="text-[9px] text-[#6B1724]/70 text-center mt-3 font-mono tracking-widest uppercase font-bold">安全支付 &bull; 支持中国高校及研究机构财务报销</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Security and Compliance Assurance */}
      <section id="safety" className="py-24 max-w-7xl mx-auto px-6 md:px-10 border-b-4 border-double border-[#111111]">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 text-xs font-mono text-[#6B1724] font-black uppercase tracking-[0.25em] mb-4">
            <span>&sect; 7.0 COPE COI ETHICAL & DATA PRIVACY COMPLIANCE</span>
            <span className="h-0.5 w-16 bg-[#6B1724]/30" />
          </div>
        </div>

        <div className="p-8 md:p-14 bg-[#6B1724] text-white rounded-none border-2 border-[#111111] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 texture-stats-dark">
          
          <div className="space-y-6 max-w-2xl text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/20 text-white text-[10px] font-mono tracking-widest uppercase font-black">
              <ShieldCheck className="h-4 w-4 text-white" strokeWidth={2} />
              <span>ACADEMIC PRIVACY & INTELLECTUAL SAFETY GUARANTEE</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-white leading-tight">
              最严苛的学术知识产权与保密双重防护
            </h2>
            
            <p className="text-white/85 text-xs sm:text-sm leading-relaxed font-serif text-justify">
              本工作站深度关切您的前沿学术成果与草案的极端敏感性。所有接口数据均经过单向军工级 SSL 及零泄漏信道加密处理，绝不缓存，永不用于大语言模型的公共训练或二次微调。完全遵循国际医学与科学出版伦理委员会 (COPE)、赫尔辛基宣言及 Elsevier/Springer Nature 集团关于科研 AI 工具的最新伦理约束指南。
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-mono text-xs font-bold text-white/95">
              <div className="flex items-center gap-2.5">
                <Check className="h-4.5 w-4.5 text-white bg-black/20 p-0.5" strokeWidth={3} />
                <span>绝不泄露开题、实验数据与草案方案</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4.5 w-4.5 text-white bg-black/20 p-0.5" strokeWidth={3} />
                <span>计算完毕后，数据缓存 24h 自动物理擦除</span>
              </div>
            </div>
          </div>

          <div className="p-8 bg-black/20 border border-white/10 w-full md:w-80 shrink-0 text-center space-y-4 relative z-10">
            <p className="text-xs font-mono text-white/60 uppercase tracking-widest font-black">服务可用性保障协议</p>
            <p className="text-4xl font-black text-white font-mono leading-none">99.98%</p>
            <p className="text-xs text-white/80 leading-relaxed font-serif text-justify">
              本工作站配置多区域高可用服务器节点及计算负载网关，确保在毕业论文季、国家级课题申报高峰期，智能链路依然高效响应。
            </p>
          </div>
        </div>
      </section>

      {/* 8. Footer (Styled like a bibliographic citation list / journal note) */}
      <footer className="py-16 bg-[#FAF9F6] border-t-4 border-double border-[#111111]/30 text-[#111111]/70 text-center text-xs space-y-6 max-w-7xl mx-auto px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#6B1724] font-black">
          掌术AI科研工作站 / ZHANGSHU SCIENTIFIC RESEARCH SPECIALIZATION STATION [PREPRINT-V1.2]
        </p>
        
        <div className="max-w-2xl mx-auto text-[10.5px] leading-relaxed font-serif text-[#111111]/60 text-justify sm:text-center border-t border-[#111111]/10 pt-4">
          <span className="font-bold text-[#6B1724] uppercase font-mono text-[9px] mr-1">[DISCLAIMER & ETHICS ADVISORY]</span>
          本平台所输出之一切学术分析、计算代码、润色 prose、文献校对意见等，均属于科研辅助。学者作为知识的第一责任人，在正式投稿或发表时应基于物理真实与客观实验，自行核实、校对并确认最终的论点与论证数据。
        </div>

        <p className="text-[10px] font-mono tracking-widest text-[#111111]/40 uppercase pt-2 border-t border-[#111111]/5">
          &copy; 2026 掌术AI. All rights reserved. 沪ICP备916fec93号
        </p>
      </footer>

      {/* ================= AUTH MODAL ================= */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-none">
          <div className="relative w-full max-w-md p-8 bg-white border border-[#111111]/10 rounded-none shadow-none overflow-hidden text-left">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-[#111111]/60 hover:bg-[#FAF9F6] p-2 border border-transparent hover:border-[#111111] cursor-pointer rounded-none focus-visible:outline focus-visible:outline-2"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>

            <div className="text-center mb-8">
              <div className="inline-flex h-12 w-12 items-center justify-center bg-[#6B1724] text-white border border-[#6B1724] mb-4">
                <Brain className="h-6 w-6 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-serif font-black text-[#111111]">
                {authTab === "login" ? "登录 掌术AI科研工具平台" : "注册新账号"}
              </h3>
              <p className="text-xs font-serif text-[#111111]/60 mt-2">
                {authTab === "login" ? "登录体验高灵敏学术微调辅助系统" : "免费注册，开启您的专项研究工作链"}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#111111]/10 mb-6">
              <button
                onClick={() => { setAuthTab("login"); setAuthError(""); }}
                className={`flex-1 pb-3 text-xs font-mono font-bold uppercase tracking-wider border-b-4 transition cursor-pointer ${
                  authTab === "login" ? "border-[#111111] text-[#111111]" : "border-transparent text-[#111111]/40"
                }`}
              >
                用户登录
              </button>
              <button
                onClick={() => { setAuthTab("register"); setAuthError(""); }}
                className={`flex-1 pb-3 text-xs font-mono font-bold uppercase tracking-wider border-b-4 transition cursor-pointer ${
                  authTab === "register" ? "border-[#111111] text-[#111111]" : "border-transparent text-[#111111]/40"
                }`}
              >
                极速注册
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#111111] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" strokeWidth={2} />
                  <span>电子邮箱地址 (EMAIL)</span>
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-none bg-white border border-[#111111]/15 text-xs text-[#111111] focus:outline-none focus:border-[#111111] transition font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-[#111111] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" strokeWidth={2} />
                  <span>账户密码 (PASSWORD)</span>
                </label>
                <input
                  type="password"
                  placeholder="输入您的密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-none bg-white border border-[#111111]/15 text-xs text-[#111111] focus:outline-none focus:border-[#111111] transition font-mono"
                />
              </div>

              {authError && (
                <div className="p-4 rounded-none bg-[#FAF9F6] border border-[#111111]/10 text-xs text-[#111111] flex items-start gap-3 leading-relaxed">
                  <Info className="h-4 w-4 mt-0.5 shrink-0 text-[#111111]" strokeWidth={2} />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="p-4 rounded-none bg-[#FAF9F6] border border-[#111111]/10 text-xs text-[#111111] flex items-start gap-3 leading-relaxed font-bold">
                  <Check className="h-4 w-4 mt-0.5 shrink-0 text-[#111111]" strokeWidth={2.5} />
                  <span>{authSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-[#6B1724] text-white border border-[#6B1724] hover:bg-[#5C131D] text-xs font-mono font-bold uppercase tracking-widest transition-all duration-100 rounded-none cursor-pointer focus-visible:outline focus-visible:outline-2"
              >
                {authTab === "login" ? "立即登录" : "注册并登录"}
              </button>
            </form>

            {/* Quick Fill for Demo Panel */}
            {authTab === "login" && (
              <div className="mt-8 pt-6 border-t border-[#111111]/10 text-center">
                <span className="text-[10px] font-mono text-[#111111]/40 uppercase tracking-widest block mb-3">DEMO CREDENTIALS</span>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="px-5 py-2.5 bg-white text-[#111111] border border-[#111111]/15 hover:border-[#111111] hover:text-[#111111] text-[10px] font-mono font-bold uppercase tracking-widest transition-all duration-100 cursor-pointer"
                >
                  一键快速填入
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= PAYMENT MODAL ================= */}
      {showPayModal && selectedPlanId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-none text-left">
          <div className="relative w-full max-w-md p-8 bg-white border border-[#111111]/10 rounded-none shadow-none overflow-hidden">
            <button 
              onClick={() => setShowPayModal(false)}
              className="absolute top-4 right-4 text-[#111111]/60 hover:bg-[#FAF9F6] p-2 border border-transparent hover:border-[#111111] cursor-pointer rounded-none focus-visible:outline"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>

            <div className="text-center mb-8">
              <span className="text-[10px] font-mono font-black uppercase text-[#111111] tracking-widest">SECURE CHECKOUT</span>
              <h3 className="text-xl font-serif font-black text-[#111111] mt-2">确认并支付订单</h3>
              <p className="text-xs font-serif text-[#111111]/60 mt-1">
                选购项目: <span className="text-[#111111] font-bold">{selectedPlanId === "pro" ? "学术专业版" : "实验室/机构高级版"}</span>
              </p>
            </div>

            {/* Billing breakdown */}
            <div className="p-5 rounded-none bg-[#FAF9F6] border border-[#111111]/10 space-y-4 mb-6 text-xs font-mono text-[#111111]">
              <div className="flex items-center justify-between text-[#111111]/60">
                <span>订阅周期</span>
                <span className="text-[#111111] font-bold">{billingCycle === "yearly" ? "年度订阅 (年付)" : "月度订阅 (月付)"}</span>
              </div>
              <div className="flex items-center justify-between text-[#111111]/60">
                <span>专享通道</span>
                <span className="text-[#111111] font-bold">掌术医学大模型高优先专线</span>
              </div>
              <div className="flex items-center justify-between text-[#111111]/60">
                <span>月价单计</span>
                <span className="text-[#111111] font-bold">
                  ¥{selectedPlanId === "pro" ? (billingCycle === "yearly" ? "79.00/月" : "99.00/月") : (billingCycle === "yearly" ? "399.00/月" : "499.00/月")}
                </span>
              </div>
              
              <div className="pt-4 border-t border-[#111111]/10 flex items-center justify-between text-sm">
                <span className="font-bold text-[#111111]">本次应付总额</span>
                <span className="text-xl font-black text-[#111111] font-mono">
                  ¥{selectedPlanId === "pro" ? (billingCycle === "yearly" ? "948.00" : "99.00") : (billingCycle === "yearly" ? "4788.00" : "499.00")}
                </span>
              </div>
            </div>

            {/* Select Pay Method */}
            <div className="space-y-3 mb-8">
              <label className="text-[10px] font-mono text-[#111111] font-bold uppercase tracking-widest block">选择支付方式 (GATEWAY)：</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPayMethod("alipay")}
                  className={`p-3 rounded-none border flex flex-col items-center gap-2 transition cursor-pointer font-mono ${
                    payMethod === "alipay" ? "bg-[#6B1724] text-white border-[#6B1724]" : "bg-white border-[#111111]/15 text-[#111111]/60 hover:border-[#6B1724] hover:text-[#6B1724]"
                  }`}
                >
                  <Wallet className="h-5 w-5" strokeWidth={1.5} />
                  <span className="text-[9px] font-bold">支付宝</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPayMethod("wechat")}
                  className={`p-3 rounded-none border flex flex-col items-center gap-2 transition cursor-pointer font-mono ${
                    payMethod === "wechat" ? "bg-[#6B1724] text-white border-[#6B1724]" : "bg-white border-[#111111]/15 text-[#111111]/60 hover:border-[#6B1724] hover:text-[#6B1724]"
                  }`}
                >
                  <QrCode className="h-5 w-5" strokeWidth={1.5} />
                  <span className="text-[9px] font-bold">微信支付</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPayMethod("card")}
                  className={`p-3 rounded-none border flex flex-col items-center gap-2 transition cursor-pointer font-mono ${
                    payMethod === "card" ? "bg-[#6B1724] text-white border-[#6B1724]" : "bg-white border-[#111111]/15 text-[#111111]/60 hover:border-[#6B1724] hover:text-[#6B1724]"
                  }`}
                >
                  <CreditCard className="h-5 w-5" strokeWidth={1.5} />
                  <span className="text-[9px] font-bold">信用卡</span>
                </button>
              </div>
            </div>

            {/* Simulated Checkout flow */}
            {paySuccess ? (
              <div className="p-5 rounded-none bg-[#FAF9F6] border border-[#111111]/10 text-center space-y-2 mb-4">
                <CheckCircle2 className="h-8 w-8 text-[#111111] mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-xs font-bold text-[#111111] font-mono">支付成功，服务已激活</p>
                <p className="text-[11px] text-[#111111]/60 font-serif">正在为您建立安全的学术专用掌术医学大模型专属处理管道...</p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={isPaying}
                className="w-full py-4 bg-[#6B1724] text-white border border-[#6B1724] hover:bg-[#5C131D] text-xs font-mono font-bold uppercase tracking-widest transition-all duration-100 rounded-none flex items-center justify-center gap-2 cursor-pointer focus-visible:outline"
              >
                {isPaying ? (
                  <>
                    <div className="h-4 w-4 rounded-none border-2 border-white border-t-transparent animate-spin" />
                    <span>通过安全通道支付中...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 text-white" strokeWidth={2} />
                    <span>确认支付并激活订阅 (¥{selectedPlanId === "pro" ? (billingCycle === "yearly" ? "948.00" : "99.00") : (billingCycle === "yearly" ? "4788.00" : "499.00")})</span>
                  </>
                )}
              </button>
            )}

            <div className="mt-5 flex items-center justify-center gap-2 text-[9px] font-mono text-[#111111]/40 uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" strokeWidth={2} />
              <span>PCI-DSS ENCRYPTED SECURE TRANSACTION</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
