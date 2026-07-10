import React, { useState, useRef, useEffect, useMemo } from "react";
import { 
  Send, Sparkles, AlertCircle, HelpCircle, CornerDownLeft, 
  Trash2, BrainCircuit, RefreshCw, Zap, ArrowRight, Settings, Info, CheckCircle2,
  Plus, Folder, Brain, Activity, Search, Share2, Clock, Check, Copy, ThumbsUp, ThumbsDown,
  Volume2, MoreHorizontal, Paperclip, Mic, Link as LinkIcon, X, ChevronDown, ChevronRight,
  Bell, Maximize2, Sliders, BookOpen, FileText, FileCode, Play, ChevronLeft,
  CircleUser, Network, Shapes, PlusCircle
} from "lucide-react";
import { ChatMessage, AISkill } from "../types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { SKILLS_DATA } from "../data";

interface AgentTabProps {
  onNavigateToTab: (tab: "agent" | "skills" | "workflows" | "about") => void;
  queuedMessage: string | null;
  onClearQueuedMessage: () => void;
}

interface FileArtifact {
  id: string;
  name: string;
  size: string;
  type: "pdf" | "markdown" | "code" | "excel";
  content: string;
}

// Pre-defined academic documents for right-side preview panel
const ACADEMIC_DOCUMENTS: Record<string, { title: string; journal: string; authors: string; sections: { heading: string; body: string }[]; figures?: { id: string; label: string; title: string; type: string }[] }> = {
  "PMID38915099": {
    title: "Exploration of CAR-T-cell therapy targets in T-cell malignancies",
    journal: "Journal of Hematology & Oncology (2024) 17:49",
    authors: "Zheng et al. Department of Hematology, State Key Laboratory of Biotherapy",
    sections: [
      {
        heading: "1. Abstract & Introduction",
        body: "T-cell malignancies represent a heterogeneous group of aggressive hematological cancers with poor prognosis under standard chemotherapies. Chimeric antigen receptor (CAR) T-cell therapy has achieved outstanding success in B-cell malignancies, prompting researchers to explore its potential in T-cell malignancies. However, the development of CAR-T therapy for T-cell malignancies faces unique hurdles, including CAR-T cell fratricide, product contamination with malignant T cells, and severe immune-suppression."
      },
      {
        heading: "2. Target Selection Strategy",
        body: "Identifying ideal target antigens is the key to successful CAR-T cell therapy. In T-cell malignancies, target antigens are usually shared between normal and malignant T cells, leading to severe T-cell aplasia and fratricide. Promising targets currently under active preclinical and clinical investigation include CD30, TRBC1/2, CD26, CD70, and CD5. CD30 is highly expressed in anaplastic large cell lymphoma (ALCL) and Hodgkin lymphoma, offering a safe window with minimal expression on resting T cells."
      },
      {
        heading: "3. Overcoming Fratricide via CRISPR-Cas9",
        body: "To prevent CAR-T self-destruction (fratricide), multiplex CRISPR-Cas9 genome editing is utilized to knock down endogenous T-cell receptors or target antigens in CAR-T cells. For example, knocking down CD7 in CD7-targeted CAR-T cells allows successful expansion without sacrificing potency. Similarly, target-gated logic circuits or switchable CAR-T modules have been developed to enhance specificity and safety margins during clinical delivery."
      }
    ],
    figures: [
      {
        id: "fig-car-t",
        label: "Figure 1",
        title: "Schematic representation of target antigen distribution on T-cell malignancies vs healthy immune cells",
        type: "car-t-diagram"
      }
    ]
  },
  "PMID37149643": {
    title: "Advances in Oncology: Next-Generation Bispecific Antibodies",
    journal: "Oncology Frontiers (2025) 12:104",
    authors: "Chen et al. Institute of Cancer Research",
    sections: [
      {
        heading: "1. Abstract",
        body: "Bispecific antibodies (BsAbs) represent a rapidly growing field of cancer immunotherapy. By binding to two different epitopes or antigens simultaneously, BsAbs can recruit cytotoxic immune cells directly to tumor cells, block dual signaling pathways, or trigger receptor clustering to induce apoptosis."
      },
      {
        heading: "2. Mechanism of Action",
        body: "The primary class of BsAbs, known as T-cell engagers (BiTEs), cross-links CD3 on T cells with a tumor-associated antigen (TAA) such as CD19 or EpCAM. This triggers T-cell activation independent of MHC restriction, leading to highly efficient lysis of malignant cells."
      }
    ]
  },
  "PMID39501358": {
    title: "Immunotherapy in Peripheral T-Cell Lymphoma (PTCL): A Global Review",
    journal: "Clinical Lymphoma & Myeloma (2026) 8:213",
    authors: "Hamilton et al. International Lymphoma Study Group",
    sections: [
      {
        heading: "1. Background",
        body: "Peripheral T-cell lymphoma (PTCL) comprises several aggressive subtypes of non-Hodgkin lymphoma. Treatment options are limited, and relapse rates remain high. Immunotherapeutic approaches, including antibody-drug conjugates (ADCs) and checkpoint inhibitors, are paving new ways to durable remissions."
      },
      {
        heading: "2. Clinical Trials and Efficacy",
        body: "Recent Phase II multi-center trials of PD-1 blockade combined with HDAC inhibitors show synergism, registering an objective response rate (ORR) of 58% in refractory patients. Toxicities were manageable, primarily consisting of transient cytopenias."
      }
    ]
  },
  "文献清单": {
    title: "PubMed 检索文献清单 (PubMed Query Catalog)",
    journal: "掌术学术助理自动生成报表",
    authors: "Generated on 2026-07-02 09:09:12",
    sections: [
      {
        heading: "检索关键词 (Search Keywords)",
        body: "Query: (CAR-T OR Immunotherapy) AND T-cell malignancies AND Target Selection [Date: Last 5 Years, Humans, English]"
      },
      {
        heading: "文献 1 (Document 1)",
        body: "标题: Exploration of CAR-T-cell therapy targets in T-cell malignancies\nPMID: 38915099 | PMC: PMC11197302\n期刊: Journal of Hematology & Oncology | 影响因子: 21.2\n核心提要: 系统评估了CD30, TRBC1, CD26等靶点，提出利用CRISPR-Cas9阻断CAR-T自残的突破性思路。"
      },
      {
        heading: "文献 2 (Document 2)",
        body: "标题: Advances in Oncology: Next-Generation Bispecific Antibodies\nPMID: 37149643 | PMC: PMC11204892\n核心提要: 概述双特异性抗体在T细胞恶性肿瘤中的抗原协同募集作用。"
      },
      {
        heading: "文献 3 (Document 3)",
        body: "标题: Immunotherapy in Peripheral T-Cell Lymphoma (PTCL): A Global Review\nPMID: 39501358 | PMC: PMC11293847\n核心提要: 探讨了外周T细胞淋巴瘤免疫微环境重塑与靶向治疗联合方案。"
      }
    ]
  }
};

const AGENT_SYSTEM_INSTRUCTION = `You are ZHANGSHU Academic Agent, an advanced, specialized AI Scientific Researcher and Writing Co-pilot.
Your goal is to help scholars, physicians, and researchers with their scientific publishing needs:
1. Literature synthesis & critical reviews of academic domains (e.g. immunology, clinical trials, oncology, etc.).
2. Polishing and rewriting research drafts to match rigorous peer-reviewed journal standards (e.g. Nature, Science, Lancet).
3. Brainstorming study designs, formulating PICOS frameworks, and calculating sample sizes.
4. Statistical plotting assistance, clinical data analysis guidance, and regression modeling.

Always reply in a helpful, highly professional, scientific, and structured manner. Use Markdown lists, code blocks, and bold text to present arguments cleanly.`;

export const AgentTab: React.FC<AgentTabProps> = ({ 
  onNavigateToTab, 
  queuedMessage, 
  onClearQueuedMessage 
}) => {
  // Layout states
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightPanelExpanded, setRightPanelExpanded] = useState(true);
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(256); // default 256px (w-64)
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      if (sidebarRef.current) {
        const rect = sidebarRef.current.getBoundingClientRect();
        const newWidth = e.clientX - rect.left;
        if (newWidth >= 180 && newWidth <= 450) {
          setLeftSidebarWidth(newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // Active Document key for the Right Panel previewer
  const [activeDocKey, setActiveDocKey] = useState<string>("PMID38915099");

  // Dynamic Topics/Conversations list on the left side
  const [topics, setTopics] = useState([
    { id: "pubmed-download", title: "帮我在pubmed 上下载几篇...", time: "6小时前", active: true },
    { id: "custom-prompt", title: "编写肿瘤微环境基因分析代码...", time: "3天前", active: false }
  ]);

  const [showAllTopics, setShowAllTopics] = useState(false);

  // Messages database for different selected topics
  const [conversations, setConversations] = useState<Record<string, ChatMessage[]>>({
    "pubmed-download": [
      {
        id: "msg-welcome-pubmed",
        role: "assistant",
        content: `学术大模型文献检索检索已完成！已为您在 PubMed 数据库中检索并定位 **4项** 领域高分经典文献，核心文献 PDF 文件及结构化文献大纲均已妥善归档。`,
        timestamp: new Date(Date.now() - 3600000 * 6)
      },
      {
        id: "msg-pubmed-artifact",
        role: "assistant",
        content: `你也可以直接在文件资源管理器地址栏粘贴这个路径打开：
\`\`\`bash
C:\\Users\\Ethicall\\Zhangshu\\2026-07-02-09-09-12\\pubmed_pdfs
\`\`\`
需要我把它们移动到其他位置（比如桌面或 Documents），或者打包成一个压缩包吗？点击下方卡片，可在右侧**学术文献浏览器**中查阅其高清渲染排版和科学双栏大纲。`,
        timestamp: new Date(Date.now() - 3600000 * 5.9),
        // Special marker to show visual file cards in this bubble
        hasArtifacts: true
      }
    ],
    "custom-prompt": [
      {
        id: "msg-custom-user",
        role: "user",
        content: "编写肿瘤微环境基因分析代码，并用 R 语言实现聚类可视化。",
        timestamp: new Date(Date.now() - 3600000 * 72)
      },
      {
        id: "msg-custom-ai",
        role: "assistant",
        content: "### 肿瘤微环境 (TME) 单细胞测序聚类分析 R 代码：\n\n```R\nlibrary(Seurat)\nlibrary(tidyverse)\n\n# 1. 导入单细胞表达矩阵并创建 Seurat 对象\ntme_data <- Read10X(data.dir = \"./filtered_feature_bc_matrix/\")\ntme_seurat <- CreateSeuratObject(counts = tme_data, project = \"TME_Analysis\", min.cells = 3, min.features = 200)\n\n# 2. 质控及线粒体基因比例过滤\ntme_seurat[[\"percent.mt\"]] <- PercentageFeatureSet(tme_seurat, pattern = \"^MT-\")\ntme_seurat <- subset(tme_seurat, subset = nFeature_RNA > 200 & nFeature_RNA < 6000 & percent.mt < 10)\n\n# 3. 标准化与高变基因识别\ntme_seurat <- NormalizeData(tme_seurat)\ntme_seurat <- FindVariableFeatures(tme_seurat, selection.method = \"vst\", nfeatures = 2000)\n\n# 4. 降维与聚类\ntme_seurat <- ScaleData(tme_seurat)\ntme_seurat <- RunPCA(tme_seurat)\ntme_seurat <- FindNeighbors(tme_seurat, dims = 1:15)\ntme_seurat <- FindClusters(tme_seurat, resolution = 0.5)\n\n# 5. UMAP 可视化图绘制\ntme_seurat <- RunUMAP(tme_seurat, dims = 1:15)\nDimPlot(tme_seurat, reduction = \"umap\", label = TRUE, pt.size = 0.5) +\n  theme_classic() +\n  ggtitle(\"Tumor Microenvironment Single-cell Clustering\")\n```\n该脚本实现了经典的 Seurat 管道流，可对肿瘤基质细胞、淋巴细胞、骨髓系细胞进行精准的聚类与降维展现。",
        timestamp: new Date(Date.now() - 3600000 * 71.5)
      }
    ]
  });

  const [activeTopicId, setActiveTopicId] = useState("pubmed-download");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sidebar skills states
  const [skillsSearch, setSkillsSearch] = useState("");
  const [skillsCategory, setSkillsCategory] = useState("all");
  const [selectedSidebarSkill, setSelectedSidebarSkill] = useState<AISkill | null>(null);
  const [sidebarSkillParamValues, setSidebarSkillParamValues] = useState<Record<string, string>>({});
  const [sidebarSkillCustomInputText, setSidebarSkillCustomInputText] = useState("");
  const [showAllSkillsSidebar, setShowAllSkillsSidebar] = useState(false);

  // File attachments state for input panel
  const [isCraftOpen, setIsCraftOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get active message list
  const activeMessages = conversations[activeTopicId] || [];

  useEffect(() => {
    scrollToBottom();
  }, [activeTopicId, activeMessages]);

  // Handle queued message from outer app state
  useEffect(() => {
    if (queuedMessage) {
      handleSendMessage(queuedMessage);
      onClearQueuedMessage();
    }
  }, [queuedMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (text: string, topicIdOverride?: string) => {
    if (!text.trim() || isLoading) return;

    const targetTopicId = topicIdOverride || activeTopicId;
    setErrorMsg(null);
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      role: "user",
      content: text,
      timestamp: new Date(),
      status: "sending"
    };

    // Append user message to active conversation
    setConversations(prev => ({
      ...prev,
      [targetTopicId]: [...(prev[targetTopicId] || []), userMsg]
    }));
    
    setInputValue("");
    setIsLoading(true);

    try {
      const fullHistory = (conversations[targetTopicId] || []);
      const chatPayload = [...fullHistory, userMsg]
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatPayload,
          systemInstruction: AGENT_SYSTEM_INSTRUCTION
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `请求失败，状态码: ${res.status}`);
      }

      const data = await res.json();

      // Set user message as done
      setConversations(prev => ({
        ...prev,
        [targetTopicId]: (prev[targetTopicId] || []).map(m => m.id === userMsg.id ? { ...m, status: "done" } : m)
      }));

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
        status: "done"
      };

      // Append assistant response
      setConversations(prev => ({
        ...prev,
        [targetTopicId]: [...(prev[targetTopicId] || []), assistantMsg]
      }));

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "连接掌术医学大模型中枢失败，请检测网络状况，或在页面右上角配置您的 API 密钥。");
      setConversations(prev => ({
        ...prev,
        [targetTopicId]: (prev[targetTopicId] || []).map(m => m.id === userMsg.id ? { ...m, status: "error" } : m)
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewTask = () => {
    const newId = `topic-${Date.now()}`;
    const newTopic = {
      id: newId,
      title: `新建学术讨论 ${topics.length + 1}`,
      time: "刚刚",
      active: true
    };

    setTopics(prev => [newTopic, ...prev.map(t => ({ ...t, active: false }))]);
    setActiveTopicId(newId);
    setConversations(prev => ({
      ...prev,
      [newId]: [
        {
          id: `welcome-${newId}`,
          role: "assistant",
          content: "您好！这是新开启的学术对话窗口。请告诉我您的课题诉求，或者向我提问关于 CAR-T 治疗、论文检索、课题设计、数据分析或任何科学写作段落的修改！",
          timestamp: new Date()
        }
      ]
    }));
  };

  const handleSelectTopic = (id: string) => {
    setTopics(prev => prev.map(t => ({ ...t, active: t.id === id })));
    setActiveTopicId(id);
  };

  const handleDeleteTopic = (e: React.MouseEvent, idToDelete: string) => {
    e.stopPropagation();
    if (topics.length <= 1) {
      alert("最少保留一个对话记录！");
      return;
    }
    const filtered = topics.filter(t => t.id !== idToDelete);
    setTopics(filtered);
    if (activeTopicId === idToDelete) {
      const firstAvailable = filtered[0];
      if (firstAvailable) {
        setTopics(prev => prev.map(t => ({ ...t, active: t.id === firstAvailable.id })));
        setActiveTopicId(firstAvailable.id);
      }
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("确定要清空当前学术对话的全部历史记录吗？")) {
      setConversations(prev => ({
        ...prev,
        [activeTopicId]: [
          {
            id: `welcome-reset-${activeTopicId}`,
            role: "assistant",
            content: "当前学术窗口对话已安全归档并重置。期待您的新课题创意！",
            timestamp: new Date()
          }
        ]
      }));
    }
  };

  const handleSelectSkillFromSidebar = (skill: AISkill) => {
    setSelectedSidebarSkill(skill);
    const initialParams: Record<string, string> = {};
    skill.params?.forEach(p => {
      initialParams[p.id] = p.defaultValue;
    });
    setSidebarSkillParamValues(initialParams);
    setSidebarSkillCustomInputText(skill.placeholderText);
  };

  const sidebarCompiledPrompt = useMemo(() => {
    if (!selectedSidebarSkill) return "";
    let paramContext = "";
    if (selectedSidebarSkill.params && selectedSidebarSkill.params.length > 0) {
      paramContext = "\n\n【预设参数限制】：\n" + selectedSidebarSkill.params.map(p => {
        const currentVal = sidebarSkillParamValues[p.id] || p.defaultValue;
        const selectedOpt = p.options?.find(opt => opt.value === currentVal);
        return `- ${p.label}: ${selectedOpt ? selectedOpt.label : currentVal}`;
      }).join("\n");
    }
    return `[${selectedSidebarSkill.name} 运行指令]\n\n研究细节描述：\n${sidebarSkillCustomInputText}${paramContext}\n\n请严格遵守掌术学术Agent的科研严谨和数据合规偏好，为您生成结构完整、措辞精炼专业的阶段产出。`;
  }, [selectedSidebarSkill, sidebarSkillParamValues, sidebarSkillCustomInputText]);

  const handleLaunchSidebarTool = (createNewTopic: boolean) => {
    if (!selectedSidebarSkill) return;
    
    if (createNewTopic) {
      const newId = `topic-${Date.now()}`;
      const newTopic = {
        id: newId,
        title: `${selectedSidebarSkill.name.split(" (")[0]} 任务`,
        time: "刚刚",
        active: true
      };
      
      setTopics(prev => [newTopic, ...prev.map(t => ({ ...t, active: false }))]);
      setActiveTopicId(newId);
      
      setConversations(prev => ({
        ...prev,
        [newId]: [
          {
            id: `welcome-${newId}`,
            role: "assistant",
            content: `【学术微工具运行启动】\n已为您开启专用课题讨论窗口，正在按参数指令调度：**${selectedSidebarSkill.name}**。`,
            timestamp: new Date()
          }
        ]
      }));

      // Launch the prompt inside the new topic context
      setTimeout(() => {
        handleSendMessage(sidebarCompiledPrompt, newId);
      }, 300);
    } else {
      // Just send in the active conversation
      handleSendMessage(sidebarCompiledPrompt);
    }
    
    setSelectedSidebarSkill(null);
  };

  // Predefined Files inside the Pubmed Topic
  const files: FileArtifact[] = [
    { id: "文献清单", name: "文献清单.md", size: "3 KB", type: "markdown", content: "" },
    { id: "PMID37149643", name: "PMID37149643_P...", size: "2.7 MB", type: "pdf", content: "" },
    { id: "PMID38915099", name: "PMID38915099_P...", size: "2.6 MB", type: "pdf", content: "" },
    { id: "PMID39501358", name: "PMID39501358_P...", size: "5.5 MB", type: "pdf", content: "" }
  ];

  return (
    <div id="workspace-container" className="flex flex-1 h-full min-h-0 bg-[#FAF9F6] text-neutral-900 overflow-hidden relative border border-neutral-200/80 rounded-2xl shadow-lg font-sans w-full max-w-[100%]">
      
      {/* 1. LEFT SIDEBAR: Zhangshu Academic Agent Navigation & Task History */}
      <div 
        ref={sidebarRef}
        style={{ width: leftSidebarCollapsed ? 0 : `${leftSidebarWidth}px` }}
        className={`flex-col bg-white border-r border-neutral-200 relative select-none ${
          isResizing ? "transition-none" : "transition-all duration-300"
        } ${
          leftSidebarCollapsed ? "overflow-hidden border-r-0" : "flex"
        }`}
      >
        {/* Drag Handle for Resizing */}
        {!leftSidebarCollapsed && (
          <div 
            onMouseDown={startResizing}
            className={`absolute top-0 right-[-3.5px] bottom-0 w-[7px] cursor-col-resize z-40 group hover:bg-[#6B1724]/30 transition-colors ${
              isResizing ? "bg-[#6B1724]/40" : "bg-transparent"
            }`}
            title="拖拽调整侧边栏宽度"
          >
            {/* Elegant visual guideline inside the handle */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-8 rounded bg-neutral-300 group-hover:bg-[#6B1724]/60 transition-colors ${
              isResizing ? "bg-[#6B1724]" : ""
            }`} />
          </div>
        )}
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <div className="h-6.5 w-6.5 bg-[#6B1724] text-white flex items-center justify-center font-black text-xs rounded-lg shadow-sm font-serif">
              掌
            </div>
            <div>
              <span className="font-black text-xs tracking-tight text-neutral-900">掌术学术Agent</span>
              <span className="text-[9px] font-mono font-medium text-neutral-500 ml-1.5 px-1 py-0.5 bg-neutral-200/60 rounded">v5.2.0</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="p-1 hover:bg-neutral-200 text-neutral-600 transition-colors rounded cursor-pointer" title="全局搜索">
              <Search className="h-3.5 w-3.5" />
            </button>
            <button className="p-1 hover:bg-neutral-200 text-neutral-600 transition-colors rounded cursor-pointer" title="过滤">
              <Sliders className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Sidebar Middle: Main Menu Links */}
        <div className="p-3 border-b border-neutral-200">
          <button 
            onClick={handleCreateNewTask}
            className="w-full py-2.5 px-3 flex items-center justify-center gap-3 text-xs font-semibold text-white bg-[#6B1724] hover:bg-[#5C131D] active:translate-y-0.5 shadow-sm transition-all rounded-lg cursor-pointer border-0"
          >
            <PlusCircle className="h-4.5 w-4.5 text-white" strokeWidth={2} />
            <span>新建学术对话</span>
          </button>
        </div>

        {/* Sidebar Lower: Conversations History (任务 6) */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          <div>
            <div className="px-2 mb-1.5 flex items-center justify-between text-[11px] font-bold text-neutral-400">
              <span className="flex items-center gap-1">
                <span>任务 ({topics.length})</span>
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
            </div>

            <div className="space-y-0.5">
              {(showAllTopics ? topics : topics.slice(0, 5)).map((t) => (
                <div
                  key={t.id}
                  className={`group relative w-full flex items-center justify-between transition-all rounded-lg text-xs ${
                    t.id === activeTopicId
                      ? "bg-neutral-200/60 text-neutral-900 font-semibold"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectTopic(t.id)}
                    className="flex-1 text-left px-2.5 py-2.5 truncate cursor-pointer font-normal"
                  >
                    {t.title}
                  </button>
                  <div className="flex items-center gap-1.5 pr-2 shrink-0">
                    <span className="text-[10px] font-normal text-neutral-400 scale-90">{t.time}</span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteTopic(e, t.id)}
                      className="hidden group-hover:flex p-1 hover:bg-neutral-250 text-neutral-500 hover:text-red-650 rounded transition-all cursor-pointer"
                      title="删除此任务记录"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Show more/less button */}
              {topics.length > 5 && (
                <button
                  type="button"
                  onClick={() => setShowAllTopics(!showAllTopics)}
                  className="w-full text-left px-2.5 py-2 text-xs text-neutral-400 hover:text-neutral-600 transition-colors font-normal flex items-center gap-1 cursor-pointer"
                >
                  <span>{showAllTopics ? "收起" : `查看更多 (${topics.length - 5})`}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Footer: Profile info */}
        <div className="p-3 border-t border-neutral-150 bg-neutral-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-[#6B1724] text-white flex items-center justify-center text-xs font-black uppercase shadow-xs">
              CH
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-neutral-800 leading-tight">Channing</span>
              <span className="text-[9px] text-neutral-400 leading-tight font-mono">18855066856</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-neutral-500">
            <button className="p-1 hover:bg-neutral-200 hover:text-neutral-800 rounded transition-colors cursor-pointer" title="消息通知">
              <Bell className="h-3.5 w-3.5" />
            </button>
            <button className="p-1 hover:bg-neutral-200 hover:text-neutral-800 rounded transition-colors cursor-pointer" title="设置">
              <Settings className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Toggle left sidebar button */}
      <button 
        onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-10 w-4 bg-white border border-neutral-200 hover:bg-neutral-50 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 rounded-r-md"
        title={leftSidebarCollapsed ? "展开左侧边栏" : "收起左侧边栏"}
      >
        {leftSidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* 2. CENTER PANEL: Conversation Workspace */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
        {/* Center Panel Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-neutral-200 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FAF9F6] border border-neutral-200 rounded-xl shadow-xs">
              <BrainCircuit className="h-4.5 w-4.5 text-[#6B1724]" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-sm font-black text-neutral-900 uppercase font-serif flex items-center gap-2 leading-none">
                {activeTopicId === "pubmed-download" ? "帮我在pubmed 上下载几篇文献" : (topics.find(t => t.id === activeTopicId)?.title || "学术问答对话")}
                {isLoading && <span className="flex h-2.5 w-2.5 bg-[#6B1724] animate-ping rounded-full" />}
              </h1>
              <p className="text-[10px] text-neutral-400 font-mono tracking-widest mt-1 uppercase">
                Active Session / {activeTopicId.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-neutral-100 border border-transparent hover:border-neutral-200 transition-all rounded cursor-pointer" title="学术搜索">
              <Search className="h-4 w-4 text-neutral-500" />
            </button>
            <button className="p-2 hover:bg-neutral-100 border border-transparent hover:border-neutral-200 transition-all rounded cursor-pointer" title="分享协作">
              <Share2 className="h-4 w-4 text-neutral-500" />
            </button>
            <button 
              onClick={handleClearHistory}
              className="p-2 hover:bg-red-50 border border-transparent hover:border-red-200 hover:text-red-700 transition-all rounded cursor-pointer" 
              title="清空此历史对话"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setRightPanelExpanded(!rightPanelExpanded)}
              className={`p-2 transition-all rounded cursor-pointer border ${
                rightPanelExpanded ? "bg-[#6B1724]/8 border-[#6B1724]/20 text-[#6B1724]" : "bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-100"
              }`}
              title={rightPanelExpanded ? "关闭文献浏览器" : "展开文献浏览器"}
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Message Streams List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAF9F6] texture-paper-overlay">
          {activeMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <BrainCircuit className="h-10 w-10 text-neutral-300 mb-2.5 animate-pulse" />
              <p className="text-xs font-serif font-bold text-neutral-600">对话中暂无内容</p>
              <p className="text-[10px] text-neutral-400 font-mono mt-1">WRITE SOMETHING IN INPUT TO KICKSTART CHAT</p>
            </div>
          ) : (
            activeMessages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-4 max-w-4xl ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {/* Visual Avatar */}
                <div className={`h-8 w-8 shrink-0 flex items-center justify-center text-[10px] font-mono font-bold rounded-full shadow-sm ${
                  msg.role === "user" 
                    ? "bg-neutral-800 text-white" 
                    : "bg-[#6B1724] text-white"
                }`}>
                  {msg.role === "user" ? "USER" : "AI"}
                </div>

                {/* Bubble Container */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className={`p-4.5 bg-white border border-neutral-200 rounded-2xl shadow-xs transition-shadow hover:shadow-sm ${
                    msg.role === "user" ? "bg-[#6B1724]/4 border-[#6B1724]/10" : ""
                  }`}>
                    {msg.role === "user" ? (
                      <p className="text-xs font-serif text-neutral-900 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    ) : (
                      <div className="space-y-4">
                        <MarkdownRenderer content={msg.content} />
                        
                        {/* Custom visual artifact block requested by user */}
                        {msg.hasArtifacts && (
                          <div className="mt-4 pt-4 border-t border-dashed border-neutral-200">
                            
                            {/* Directory Output Badge */}
                            <div className="mb-4 bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-sm font-mono text-[10px] text-neutral-600 flex items-center justify-between overflow-x-auto">
                              <span className="truncate">C:\Users\Ethicall\Zhangshu\2026-07-02-09-09-12\pubmed_pdfs</span>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText("C:\\Users\\Ethicall\\Zhangshu\\2026-07-02-09-09-12\\pubmed_pdfs");
                                  alert("路径已复制到剪贴板！");
                                }}
                                className="ml-2 px-1.5 py-0.5 bg-white hover:bg-neutral-150 border border-neutral-300 text-neutral-700 rounded text-[8px] font-bold cursor-pointer transition-all"
                              >
                                COPY
                              </button>
                            </div>

                            {/* Artifact File Grid Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {files.map((file) => (
                                <div 
                                  key={file.id}
                                  onClick={() => {
                                    setActiveDocKey(file.id);
                                    setRightPanelExpanded(true);
                                  }}
                                  className={`p-3 border border-neutral-200 hover:border-neutral-900 bg-neutral-50 hover:bg-white flex items-center justify-between rounded-sm transition-all cursor-pointer group ${
                                    activeDocKey === file.id ? "ring-2 ring-[#6B1724]/60 border-[#6B1724]" : ""
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`h-8 w-8 flex items-center justify-center font-bold text-[9px] rounded-sm text-white ${
                                      file.type === "pdf" ? "bg-rose-600" : "bg-emerald-600"
                                    }`}>
                                      {file.type === "pdf" ? "PDF" : "MD"}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[11px] font-bold text-neutral-800 truncate max-w-[120px] font-mono group-hover:text-[#6B1724]">
                                        {file.name}
                                      </span>
                                      <span className="text-[9px] text-neutral-450 font-mono">{file.size}</span>
                                    </div>
                                  </div>
                                  <div className="text-neutral-400 group-hover:text-[#6B1724] transition-colors">
                                    <ArrowRight className="h-3.5 w-3.5 scale-90" />
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Additional Links Bar */}
                            <div className="mt-3.5 flex items-center gap-4 text-[10px] font-bold text-[#6B1724] font-mono">
                              <button onClick={() => alert("当前列表下共 4 篇重要产物。已完全缓存在本地工作沙盘。")} className="hover:underline flex items-center gap-1 cursor-pointer">
                                <span>查看所有产物 (4) ➔</span>
                              </button>
                              <button onClick={() => alert("共 1 个版本更新记录。当前为系统默认匹配的最优版本。")} className="hover:underline flex items-center gap-1 cursor-pointer">
                                <span>查看所有变更 (1) ➔</span>
                              </button>
                            </div>

                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Message Bottom Action Row */}
                  <div className={`flex items-center gap-3.5 text-[10px] font-mono tracking-wider text-neutral-400 uppercase ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}>
                    <span className="text-[9px]">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.status === "sending" && (
                      <span className="h-1.5 w-1.5 bg-[#6B1724] animate-ping" />
                    )}

                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-2 text-neutral-400 hover:text-neutral-600 transition-colors ml-1">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(msg.content);
                            alert("已复制消息文本！");
                          }}
                          className="hover:text-neutral-800 p-0.5 cursor-pointer" 
                          title="复制回答"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                        <button className="hover:text-neutral-800 p-0.5 cursor-pointer" title="点赞">
                          <ThumbsUp className="h-3 w-3" />
                        </button>
                        <button className="hover:text-neutral-800 p-0.5 cursor-pointer" title="踩">
                          <ThumbsDown className="h-3 w-3" />
                        </button>
                        <button className="hover:text-neutral-800 p-0.5 cursor-pointer" title="TTS 播报">
                          <Volume2 className="h-3 w-3" />
                        </button>
                        <button className="hover:text-neutral-800 p-0.5 cursor-pointer" title="更多">
                          <MoreHorizontal className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-4 max-w-3xl mr-auto">
              <div className="flex h-8 w-8 items-center justify-center text-[10px] font-mono font-bold bg-[#6B1724] text-white rounded-full shadow-sm">
                AI
              </div>
              <div className="bg-white border border-neutral-200 p-4 px-5 rounded-2xl shadow-xs flex items-center gap-1.5">
                <span className="h-2 w-2 bg-[#6B1724] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 bg-[#6B1724] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 bg-[#6B1724] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error Warning Box */}
        {errorMsg && (
          <div className="mx-6 my-2 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 shadow-sm">
            <AlertCircle className="h-5 w-5 text-[#6B1724] shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <h4 className="text-xs font-mono font-bold text-[#6B1724] uppercase tracking-wider">API REQUEST REJECTION</h4>
              <p className="text-xs text-neutral-800 font-serif leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Input Bar Form */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="p-5 border-t border-neutral-200 bg-white"
        >
          {/* Main rich input element */}
          <div className="border border-neutral-250 rounded-2xl bg-white shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-[#6B1724]/20 focus-within:border-[#6B1724]/30 transition-all">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }
              }}
              placeholder="今天帮你做些什么？ @ 引用对话文件, / 调用技能与指令"
              className="w-full min-h-[64px] max-h-36 resize-none outline-none px-4 py-3.5 text-xs text-neutral-800 placeholder-neutral-400 font-sans"
              rows={2}
            />

            {/* Input Footer toolbar */}
            <div className="px-4 pb-3 flex items-center justify-between border-t border-neutral-100/60 pt-2.5">
              
              {/* Left Action Elements */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setIsCraftOpen(!isCraftOpen)}
                    className="h-7 px-2.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 flex items-center gap-1 text-[10px] font-black uppercase tracking-tight rounded-md cursor-pointer transition-all"
                  >
                    <span>Craft</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {isCraftOpen && (
                    <div className="absolute bottom-9 left-0 w-44 bg-white border border-neutral-200 p-2 space-y-1 z-30 rounded-xl shadow-lg">
                      <p className="text-[9px] font-mono font-bold text-neutral-400 uppercase px-1 border-b pb-1 mb-1">CRAFT SETTINGS</p>
                      <button 
                        type="button"
                        onClick={() => {
                          setInputValue("帮我按照最高学术规范 (Nature Standard) 深度分析这段数据");
                          setIsCraftOpen(false);
                        }}
                        className="w-full text-left text-[11px] p-1.5 hover:bg-neutral-100 font-serif text-neutral-800 block rounded"
                      >
                        🔬 深度学术分析
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          setInputValue("润色本节讨论与论证，使修辞风格兼具科学严谨性与流动美感");
                          setIsCraftOpen(false);
                        }}
                        className="w-full text-left text-[11px] p-1.5 hover:bg-neutral-100 font-serif text-neutral-800 block rounded"
                      >
                        ✍️ 自然科学润色
                      </button>
                    </div>
                  )}
                </div>

                {/* Vertical Separator */}
                <span className="w-[1px] h-4 bg-neutral-200 mx-1" />

                {/* Rich Input Action Buttons */}
                <button type="button" onClick={() => alert("已触发学术Z轴索引...")} className="p-1.5 hover:bg-neutral-100 hover:text-neutral-900 text-neutral-500 rounded transition-colors cursor-pointer" title="Z-Axis Search">
                  <span className="text-[10px] font-mono font-black border border-neutral-300 px-1 rounded bg-neutral-50">Z</span>
                </button>
                <button type="button" onClick={() => alert("开启图表手绘批注/签名板...")} className="p-1.5 hover:bg-neutral-100 hover:text-neutral-900 text-neutral-500 rounded transition-colors cursor-pointer" title="批注/手绘">
                  <Sliders className="h-3.5 w-3.5 text-neutral-600" />
                </button>
                <button type="button" onClick={() => alert("插入外部分享链接...")} className="p-1.5 hover:bg-neutral-100 hover:text-neutral-900 text-neutral-500 rounded transition-colors cursor-pointer" title="添加引用连接">
                  <LinkIcon className="h-3.5 w-3.5 text-neutral-600" />
                </button>
                <button type="button" onClick={() => alert("检索本周问答档案...")} className="p-1.5 hover:bg-neutral-100 hover:text-neutral-900 text-neutral-500 rounded transition-colors cursor-pointer" title="对话历史快照">
                  <Clock className="h-3.5 w-3.5 text-neutral-600" />
                </button>
                <button type="button" onClick={() => alert("多轮会话状态诊断器已就绪...")} className="p-1.5 hover:bg-neutral-100 hover:text-neutral-900 text-[#6B1724] rounded transition-colors cursor-pointer" title="诊断会话">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin-slow" />
                </button>
                <button type="button" onClick={() => alert("请在电脑本地选择需要上传分析的学术附件或 PDF/Excel表格...")} className="p-1.5 hover:bg-neutral-100 hover:text-neutral-900 text-neutral-500 rounded transition-colors cursor-pointer" title="上传附件">
                  <Plus className="h-3.5 w-3.5 text-neutral-600" />
                </button>
                <button type="button" onClick={() => alert("大模型流式思考特级加速开启中...")} className="p-1.5 hover:bg-neutral-100 hover:text-[#6B1724] text-neutral-500 rounded transition-colors cursor-pointer" title="智能加速">
                  <Sparkles className="h-3.5 w-3.5 text-neutral-600" />
                </button>
                <button type="button" onClick={() => alert("微型麦克风已待命，请说出您的学术指令...")} className="p-1.5 hover:bg-neutral-100 hover:text-neutral-900 text-neutral-500 rounded transition-colors cursor-pointer" title="语音录入">
                  <Mic className="h-3.5 w-3.5 text-neutral-600" />
                </button>
              </div>

              {/* Right Send Action Button */}
              <div>
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className={`h-8.5 w-8.5 rounded-full flex items-center justify-center border border-transparent transition-all ${
                    inputValue.trim() && !isLoading
                      ? "bg-[#6B1724] text-white hover:bg-[#5C131D] hover:translate-y-[-1px] shadow-sm cursor-pointer"
                      : "bg-neutral-150 text-neutral-400 cursor-not-allowed"
                  }`}
                  title="发送消息"
                >
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </div>

            </div>
          </div>

          {/* Core Footer Disclaimer Text */}
          <div className="mt-3.5 text-center">
            <span className="text-[10px] text-neutral-400 font-mono tracking-wider">
              内容由 AI 生成，请核实重要信息 / Secured by Academic-Enclave Encryption
            </span>
          </div>

        </form>

      </div>

      {/* 3. RIGHT PANEL: Scholarly Document Reader / PDF Mock */}
      <div 
        className={`bg-white border-l border-neutral-200 flex-col transition-all duration-300 relative ${
          rightPanelExpanded ? "w-[420px] xl:w-[480px] flex" : "w-0 overflow-hidden border-l-0"
        }`}
      >
        {/* Toggle right panel button (attached to its left edge) */}
        <button 
          onClick={() => setRightPanelExpanded(!rightPanelExpanded)}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-4 bg-white border border-neutral-200 hover:bg-neutral-50 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 rounded-l-md"
          title={rightPanelExpanded ? "收起文献浏览器" : "展开文献浏览器"}
        >
          {rightPanelExpanded ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>

        {/* Reader Tab Bar */}
        <div className="p-3 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto select-none">
            <div className="p-1 text-neutral-700 bg-neutral-200/60 rounded">
              <Sliders className="h-3.5 w-3.5" />
            </div>
            
            {/* Tab Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-300 text-neutral-800 rounded-md font-mono text-[10px] font-bold shadow-sm shrink-0">
              <div className={`h-2.5 w-2.5 rounded-full ${activeDocKey === "文献清单" ? "bg-emerald-600" : "bg-rose-600"}`} />
              <span className="truncate max-w-[120px]">
                {activeDocKey === "文献清单" ? "文献清单.md" : `${activeDocKey}_PMC111...pdf`}
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDocKey("文献清单");
                }}
                className="hover:bg-neutral-100 p-0.5 rounded"
              >
                <X className="h-2.5 w-2.5 text-neutral-400" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-1 hover:bg-neutral-200 text-neutral-600 rounded transition-colors" title="分享或导出">
              <Share2 className="h-3.5 w-3.5" />
            </button>
            <button className="p-1 hover:bg-neutral-200 text-neutral-600 rounded transition-colors" title="全屏阅读">
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={() => setRightPanelExpanded(false)}
              className="p-1 hover:bg-neutral-200 text-neutral-600 rounded transition-colors" 
              title="关闭浏览器"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Reader Document Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 font-serif bg-[#FCFBF9] text-neutral-900 leading-relaxed text-justify selection:bg-amber-100 select-text">
          {(() => {
            const doc = ACADEMIC_DOCUMENTS[activeDocKey] || ACADEMIC_DOCUMENTS["PMID38915099"];
            return (
              <div className="space-y-6">
                
                {/* Journal / Issue line */}
                <div className="border-b border-neutral-300 pb-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                  <span>{doc.journal}</span>
                  <span className="font-bold text-[#6B1724]">RESEARCH HIGH</span>
                </div>

                {/* Article Title */}
                <h1 className="text-lg md:text-xl font-bold text-neutral-900 tracking-tight leading-tight font-serif text-left">
                  {doc.title}
                </h1>

                {/* Authors */}
                <div className="text-[11px] font-serif text-neutral-600 italic">
                  {doc.authors}
                </div>

                {/* Multi-column Body sections */}
                <div className="space-y-5">
                  {doc.sections.map((sec, i) => (
                    <div key={i} className="space-y-2">
                      <h3 className="text-xs font-mono font-black text-neutral-900 uppercase tracking-wider border-b border-neutral-200 pb-1 pt-1">
                        {sec.heading}
                      </h3>
                      {activeDocKey === "文献清单" ? (
                        <div className="text-xs font-mono text-neutral-800 whitespace-pre-line leading-relaxed pl-2 border-l-2 border-emerald-500 bg-emerald-50/20 py-1">
                          {sec.body}
                        </div>
                      ) : (
                        <p className="text-xs text-neutral-800 font-serif leading-relaxed text-justify first-letter:text-lg first-letter:font-bold first-letter:float-left first-letter:mr-1.5">
                          {sec.body}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Interactive CAR-T Target Graph Rendered exactly for visual representation of user PDF screenshot */}
                {activeDocKey === "PMID38915099" && (
                  <div className="border border-neutral-200 bg-white p-5 rounded-2xl shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b pb-1.5 border-neutral-100">
                      <span className="text-[10px] font-mono font-black text-[#6B1724] uppercase tracking-wider">
                        FIGURE 1: Target Interaction Diagram
                      </span>
                      <span className="text-[9px] font-mono text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                        INTERACTIVE CAR-T GRAPH
                      </span>
                    </div>

                    {/* Nodes flow container */}
                    <div className="py-6 flex flex-col items-center justify-center relative bg-[#FAF9F6] border border-neutral-200/60 rounded-xl overflow-hidden">
                      {/* Grid background effect */}
                      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(#111 1px, transparent 1px)", backgroundSize: "12px 12px" }} />
                      
                      {/* Connection flow lines */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 90,60 C 130,40 180,40 220,60" fill="none" stroke="#6B1724" strokeWidth="2" strokeDasharray="3,3" />
                        <path d="M 90,140 C 130,160 180,160 220,140" fill="none" stroke="#10b981" strokeWidth="1.5" />
                        <path d="M 90,100 L 220,100" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      </svg>

                      <div className="flex justify-between items-center w-full px-6 relative z-10">
                        {/* Source PTCL cancer cell node */}
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="h-14 w-14 rounded-full bg-rose-50 border-2 border-rose-600 flex items-center justify-center font-mono text-[9px] font-black text-rose-700 shadow-md animate-pulse">
                            PTCL Cell
                          </div>
                          <span className="text-[9px] font-mono text-rose-700 bg-rose-50 border border-rose-200 px-1 rounded-sm">Tumor target</span>
                        </div>

                        {/* CAR-T cell engineered target list */}
                        <div className="flex flex-col gap-3">
                          <div className="px-2.5 py-1.5 bg-white border border-neutral-100 shadow-xs rounded-lg text-[9px] font-mono font-bold flex items-center gap-1.5 hover:shadow-sm transition-all">
                            <span className="h-2 w-2 rounded-full bg-rose-600" />
                            <span>CD30 Target: High Affinity</span>
                          </div>
                          <div className="px-2.5 py-1.5 bg-white border border-neutral-100 shadow-xs rounded-lg text-[9px] font-mono font-bold flex items-center gap-1.5 hover:shadow-sm transition-all">
                            <span className="h-2 w-2 rounded-full bg-teal-500" />
                            <span>TRBC1/2: Precision Gate</span>
                          </div>
                          <div className="px-2.5 py-1.5 bg-white border border-neutral-100 shadow-xs rounded-lg text-[9px] font-mono font-bold flex items-center gap-1.5 hover:shadow-sm transition-all">
                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                            <span>CD26 Knockout: Anti-Fratricide</span>
                          </div>
                        </div>

                        {/* Engineered CAR-T cell node */}
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="h-14 w-14 rounded-full bg-emerald-50 border-2 border-emerald-600 flex items-center justify-center font-mono text-[9px] font-black text-emerald-700 shadow-md">
                            CAR-T
                          </div>
                          <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 rounded-sm">Engineered</span>
                        </div>
                      </div>

                    </div>

                    <p className="text-[10px] font-serif text-neutral-500 leading-normal text-left italic">
                      Fig 1. Schematic illustration of CAR-T targeting and precise elimination of CD30+, TRBC+, CD26+ malignant T cells. Dynamic logic gates prevent self-destruction.
                    </p>
                  </div>
                )}

              </div>
            );
          })()}
        </div>

        {/* Reader Footer Info */}
        <div className="p-3 border-t border-neutral-200 bg-neutral-50 text-center select-none">
          <span className="text-[9px] text-neutral-400 font-mono tracking-widest uppercase">
            Double Column Academic Preview Engine v1.4
          </span>
        </div>
      </div>

      {/* Sidebar Skill Configuration Modal */}
      {selectedSidebarSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-neutral-200 bg-[#6B1724] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-white animate-pulse" />
                <div>
                  <h3 className="text-sm font-black tracking-tight">{selectedSidebarSkill.name}</h3>
                  <p className="text-[10px] text-neutral-200 font-serif leading-tight mt-0.5">{selectedSidebarSkill.description}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedSidebarSkill(null)}
                className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Parameter Settings */}
              {selectedSidebarSkill.params && selectedSidebarSkill.params.length > 0 && (
                <div className="space-y-3.5 bg-neutral-50 p-4 rounded-xl border border-neutral-200/60">
                  <h4 className="text-[11px] font-mono font-black text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-[#6B1724]" />
                    <span>微调分析参数设置</span>
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedSidebarSkill.params.map((p) => (
                      <div key={p.id} className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-500 flex items-center justify-between">
                          <span>{p.label}</span>
                          <span className="font-mono text-[9px] text-neutral-400 bg-neutral-200/50 px-1 rounded">
                            {sidebarSkillParamValues[p.id] || p.defaultValue}
                          </span>
                        </label>
                        {p.options ? (
                          <select
                            value={sidebarSkillParamValues[p.id] || p.defaultValue}
                            onChange={(e) => setSidebarSkillParamValues(prev => ({ ...prev, [p.id]: e.target.value }))}
                            className="w-full text-xs px-2.5 py-2 bg-white border border-neutral-250 rounded-lg focus:outline-none focus:border-[#6B1724] focus:ring-1 focus:ring-[#6B1724] font-sans"
                          >
                            {p.options.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={sidebarSkillParamValues[p.id] || p.defaultValue}
                            onChange={(e) => setSidebarSkillParamValues(prev => ({ ...prev, [p.id]: e.target.value }))}
                            placeholder={p.label}
                            className="w-full text-xs px-2.5 py-2 bg-white border border-neutral-250 rounded-lg focus:outline-none focus:border-[#6B1724] focus:ring-1 focus:ring-[#6B1724] font-sans"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Research Detail Textarea */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-neutral-800 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-neutral-500" />
                  <span>具体学术细节描述</span>
                </label>
                <textarea
                  value={sidebarSkillCustomInputText}
                  onChange={(e) => setSidebarSkillCustomInputText(e.target.value)}
                  placeholder={selectedSidebarSkill.placeholderText}
                  className="w-full text-xs p-3 border border-neutral-250 rounded-xl focus:outline-none focus:border-[#6B1724] focus:ring-1 focus:ring-[#6B1724] h-28 font-sans leading-relaxed resize-none"
                />
                <p className="text-[10px] text-neutral-400 font-serif leading-tight">
                  输入字数、目标领域、具体研究方向或临床表现，能得到更贴近临床真实的学术输出。
                </p>
              </div>

              {/* Live Preview of Prompt */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono font-black text-neutral-800 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <BrainCircuit className="h-3.5 w-3.5 text-emerald-600" />
                    <span>大模型编译指令预览</span>
                  </span>
                  <span className="text-[9px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider animate-pulse">
                    Compiled Ready
                  </span>
                </div>
                <div className="bg-neutral-900 text-neutral-300 font-mono text-[10px] p-4 rounded-xl border border-neutral-800 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed select-text select-none">
                  {sidebarCompiledPrompt}
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="px-5 py-4 border-t border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedSidebarSkill(null)}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors border border-neutral-200 bg-white hover:bg-neutral-50 rounded-lg cursor-pointer"
              >
                取消
              </button>
              
              <div className="w-full sm:w-auto flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleLaunchSidebarTool(false)}
                  className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-bold text-neutral-700 hover:text-[#6B1724] bg-white border border-neutral-250 hover:border-[#6B1724] transition-all rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="h-3 w-3" />
                  <span>当前对话中运行</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLaunchSidebarTool(true)}
                  className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-white bg-[#6B1724] hover:bg-[#5C131D] active:translate-y-0.5 shadow-sm transition-all rounded-lg cursor-pointer flex items-center justify-center gap-1.5 border-0"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>新建对话运行</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
