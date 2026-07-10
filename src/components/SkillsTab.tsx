import React, { useState, useMemo } from "react";
import { 
  Search, Sliders, Sparkles, Database, Cpu, Code, BookOpen, 
  Languages, Activity, FileText, CheckCircle2, ArrowRight, 
  ShoppingBag, Filter, ArrowUpRight, Check, Layers, MessageSquare, 
  Users, Flame, Coins, ShieldCheck, Star, Clock, X, ChevronDown,
  Globe, Sun, Moon, LogIn, Heart
} from "lucide-react";
import { SKILLS_DATA } from "../data";
import { AISkill } from "../types";

interface SkillsTabProps {
  onSendMessageToAgent: (text: string) => void;
}

// Custom Premium Human Editorial/Research Services
interface PremiumService {
  id: string;
  name: string;
  badge: string;
  description: string;
  features: string[];
  cost: string;
  duration: string;
  rating: string;
  reviewsCount: number;
  provider: string;
  stars: string;
  updatedAt: string;
}

const PREMIUM_SERVICES: PremiumService[] = [
  {
    id: "biostatistics-consulting",
    name: "医学统计分析与高级建模 (Biostatistics)",
    badge: "金牌专家执行",
    description: "针对临床和观察性研究（RCT、队列、倾向评分匹配、COX比例风险回归模型）进行严密的医学统计分析。由10年以上发表经验的资深医学统计学专家执笔，交付符合高水平SCI审稿标准的完整分析报告、纯手写R/Stata代码及出版级三线表。",
    features: [
      "自变量多重共线性筛查与矫正",
      "逆概率加权 (IPTW) / 倾向评分匹配 (PSM) 敏度检验",
      "双向双重差分 (DID) 与断点回归 (RDD) 建模",
      "完全公开无隐藏代码，100% 独立可复现"
    ],
    cost: "¥1,200 起",
    duration: "3-5 工作日交付",
    rating: "4.9",
    reviewsCount: 148,
    provider: "zhangshu/biostatistics-expert",
    stars: "381.2k",
    updatedAt: "2026-06-25"
  },
  {
    id: "vector-illustration",
    name: "发表级高精矢量机制图/信号通路图 (Vector Illustration)",
    badge: "出版级无损插图",
    description: "手绘设计临床研究机制图、细胞信号通路图、工艺流程图或统计分析混合图。支持1200 DPI无损SVG/TIFF矢量格式导出，配色与构图完美适配Nature、Cell、Lancet等著名期刊一审插图修回（Illustrations Correction）的高标准审稿人偏好。",
    features: [
      "提供符合特定期刊 Style Guidelines 的精准配色",
      "3D立面机制图、解剖学精细融合插画",
      "后期无限次文字标注、排版样式免费精修",
      "交付原始 AI/SVG 工程文件，拥有永久独立版权"
    ],
    cost: "¥580 / 幅起",
    duration: "2-4 工作日交付",
    rating: "5.0",
    reviewsCount: 92,
    provider: "zhangshu/visual-sciences",
    stars: "210.5k",
    updatedAt: "2026-06-18"
  },
  {
    id: "peer-review-coaching",
    name: "1对1顶级期刊审稿意见修回(R&R)攻坚指导 (Peer Coaching)",
    badge: "大修/小修突破",
    description: "当您的论文面临Major Revision（大修）或Minor Revision（小修）时，指派具有JAMA、NEJM、IEEE、Nature子刊独立特邀审稿经验的顶尖学者。进行逐条审稿人意见的逻辑拆解、回复信措辞精打细磨及补实验兜底设计，确保顺利被接收。",
    features: [
      "对苛刻及对立审稿意见进行非冲突式学术申辩 (Rebuttal Letters)",
      "辅助设计补充实验对照组、统计效能 (Power Analysis) 补算",
      "全周期学术回复信语境打磨，消除任何口语化 and 中式思维",
      "承诺不录用全额退款 (按协议规范执行)"
    ],
    cost: "¥2,400 起",
    duration: "全程保驾护航至收录",
    rating: "4.9",
    reviewsCount: 206,
    provider: "zhangshu/peer-review-panel",
    stars: "148.9k",
    updatedAt: "2026-07-02"
  }
];

// Mock popularity/stars & dates for skills to mimic the screenshot
const SKILL_EXTRAS_MAP: Record<string, { stars: string; rawStars: number; date: string }> = {
  "topic-selection": { stars: "354.2k", rawStars: 354200, date: "2026-06-15" },
  "coi-declaration": { stars: "128.5k", rawStars: 128500, date: "2026-05-20" },
  "abstract-writer": { stars: "410.8k", rawStars: 410800, date: "2026-07-01" },
  "clinical-cohort": { stars: "98.2k", rawStars: 98200, date: "2026-04-12" },
  "cox-regression": { stars: "245.1k", rawStars: 245100, date: "2026-06-28" },
  "propensity-matching": { stars: "189.3k", rawStars: 189300, date: "2026-06-10" },
  "pubmed-search": { stars: "320.4k", rawStars: 320400, date: "2026-07-05" },
  "academic-polisher": { stars: "482.6k", rawStars: 482600, date: "2026-07-06" },
  "response-letter": { stars: "215.7k", rawStars: 215700, date: "2026-06-30" },
  "meta-analysis": { stars: "167.4k", rawStars: 167400, date: "2026-05-18" },
  "table-one": { stars: "284.2k", rawStars: 284200, date: "2026-06-22" },
  "grant-proposal": { stars: "156.9k", rawStars: 156900, date: "2026-05-05" },
};

export const SkillsTab: React.FC<SkillsTabProps> = ({ onSendMessageToAgent }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"stars" | "recent">("stars");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  // Simulated liked skills
  const [likedSkills, setLikedSkills] = useState<Record<string, boolean>>({});

  // Selected tool/service for detailed modal configuration
  const [selectedTool, setSelectedTool] = useState<AISkill | null>(null);
  const [selectedService, setSelectedService] = useState<PremiumService | null>(null);

  // Parameter values for selected tool
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [customInputText, setCustomInputText] = useState("");

  // Booking consultation states for premium services
  const [consultationName, setConsultationName] = useState("");
  const [consultationContact, setConsultationContact] = useState("");
  const [consultationNotes, setConsultationNotes] = useState("");
  const [consultationSubmitted, setConsultationSubmitted] = useState(false);
  const [isSubmittingConsultation, setIsSubmittingConsultation] = useState(false);

  // Helper to map string to lucide icons
  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case "Sparkles": return <Sparkles className="h-4 w-4 text-[#6B1724]" />;
      case "FileText": return <FileText className="h-4 w-4 text-[#6B1724]" />;
      case "Layers": return <Layers className="h-4 w-4 text-[#6B1724]" />;
      case "ShieldCheck": return <ShieldCheck className="h-4 w-4 text-[#6B1724]" />;
      case "Database": return <Database className="h-4 w-4 text-[#6B1724]" />;
      case "Cpu": return <Cpu className="h-4 w-4 text-[#6B1724]" />;
      case "Code": return <Code className="h-4 w-4 text-[#6B1724]" />;
      case "BookOpen": return <BookOpen className="h-4 w-4 text-[#6B1724]" />;
      case "Languages": return <Languages className="h-4 w-4 text-[#6B1724]" />;
      case "Activity": return <Activity className="h-4 w-4 text-[#6B1724]" />;
      default: return <Cpu className="h-4 w-4 text-[#6B1724]" />;
    }
  };

  const categories = [
    { id: "all", label: "全部学术生态 (All Elements)" },
    { id: "introduction", label: "引言与选题 (Introduction)" },
    { id: "methods", label: "研究方案与设计 (Methods)" },
    { id: "results", label: "数据分析与统计 (Results)" },
    { id: "discussion", label: "论文撰写与发表 (Discussion)" },
    { id: "services", label: "顶级专家人工服务 (Premium Services)" }
  ];

  const currentCategoryLabel = categories.find(c => c.id === activeCategory)?.label || "全部学术生态";

  // Toggle Like Status
  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedSkills(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Compile combined and sorted lists
  const processedItems = useMemo(() => {
    // 1. Gather all raw components
    const skillsMapped = SKILLS_DATA.map(skill => {
      const extra = SKILL_EXTRAS_MAP[skill.id] || { stars: "100.0k", rawStars: 100000, date: "2026-06-01" };
      return {
        type: "skill" as const,
        id: skill.id,
        name: skill.name,
        category: skill.category,
        description: skill.description,
        provider: "zhangshu/academic-agent",
        stars: extra.stars,
        rawStars: extra.rawStars,
        updatedAt: extra.date,
        originalData: skill
      };
    });

    const servicesMapped = PREMIUM_SERVICES.map(service => {
      const parsedStars = parseFloat(service.stars.replace("k", "")) * 1000;
      return {
        type: "service" as const,
        id: service.id,
        name: service.name,
        category: "services",
        description: service.description,
        provider: service.provider,
        stars: service.stars,
        rawStars: parsedStars,
        updatedAt: service.updatedAt,
        originalData: service
      };
    });

    const combined = [...skillsMapped, ...servicesMapped];

    // 2. Filter based on Search and Category
    const filtered = combined.filter(item => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.provider.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // 3. Sort
    return filtered.sort((a, b) => {
      if (sortBy === "stars") {
        return b.rawStars - a.rawStars;
      } else {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });
  }, [activeCategory, searchQuery, sortBy]);

  // Open configuration modal for a specific AI skill
  const handleOpenToolModal = (tool: AISkill) => {
    setSelectedTool(tool);
    const initialParams: Record<string, string> = {};
    tool.params?.forEach(p => {
      initialParams[p.id] = p.defaultValue;
    });
    setParamValues(initialParams);
    setCustomInputText(tool.placeholderText);
  };

  // Open consultation modal for premium service
  const handleOpenServiceModal = (service: PremiumService) => {
    setSelectedService(service);
    setConsultationSubmitted(false);
    setConsultationName("");
    setConsultationContact("");
    setConsultationNotes("");
  };

  const handleParamChange = (paramId: string, value: string) => {
    setParamValues(prev => ({
      ...prev,
      [paramId]: value
    }));
  };

  // Compile prompt based on configured parameter selections and inputs
  const compiledPrompt = useMemo(() => {
    if (!selectedTool) return "";
    let paramContext = "";
    if (selectedTool.params && selectedTool.params.length > 0) {
      paramContext = "\n\n【预设参数限制】：\n" + selectedTool.params.map(p => {
        const currentVal = paramValues[p.id];
        const selectedOpt = p.options?.find(opt => opt.value === currentVal);
        return `- ${p.label}: ${selectedOpt ? selectedOpt.label : currentVal}`;
      }).join("\n");
    }
    return `[${selectedTool.name} 运行指令]\n\n研究细节描述：\n${customInputText}${paramContext}\n\n请严格遵守掌术学术Agent的科研严谨和数据合规偏好，为您生成结构完整、措辞精炼专业的阶段产出。`;
  }, [selectedTool, paramValues, customInputText]);

  const handleLaunchTool = () => {
    if (!selectedTool) return;
    onSendMessageToAgent(compiledPrompt);
    setSelectedTool(null);
  };

  const handleSubmitConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultationName || !consultationContact) return;
    
    setIsSubmittingConsultation(true);
    setTimeout(() => {
      setIsSubmittingConsultation(false);
      setConsultationSubmitted(true);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col bg-white text-neutral-800 font-sans min-h-screen">
      
      {/* 1. High-Fidelity Navigation Header (Represents the Skillsmp Top Bar) */}
      <header className="border-b border-neutral-200 bg-neutral-50 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Logo block */}
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 bg-[#6B1724] text-white flex items-center justify-center rounded-lg font-black text-sm">
            zs
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-900">
            skills<span className="text-[#6B1724] font-black">mp</span>
          </span>
        </div>

        {/* Navigation Tabs (Simulated menu) */}
        <nav className="flex items-center gap-1.5 overflow-x-auto shrink-0 py-0.5">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-200 text-neutral-800 border-0 transition-colors">
            <Search className="h-3.5 w-3.5 text-neutral-500" />
            <span>Search</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border-0 transition-colors">
            <Sparkles className="h-3.5 w-3.5 text-[#6B1724]" />
            <span>Skills</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border-0 transition-colors">
            <Users className="h-3.5 w-3.5 text-neutral-500" />
            <span>Creators</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border-0 transition-colors">
            <ShoppingBag className="h-3.5 w-3.5 text-neutral-500" />
            <span>Occupations</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border-0 transition-colors">
            <BookOpen className="h-3.5 w-3.5 text-neutral-500" />
            <span>Docs</span>
          </button>
        </nav>

        {/* Right Action Widgets */}
        <div className="flex items-center gap-3">
          <button className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-200 border-0 bg-transparent cursor-pointer" title="Switch Theme">
            <Sun className="h-4 w-4" />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-neutral-700 hover:text-[#6B1724] border border-neutral-300 rounded-lg hover:border-[#6B1724] bg-white transition-colors cursor-pointer">
            <Globe className="h-3.5 w-3.5" />
            <span>zh Chinese</span>
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#6B1724] hover:bg-[#5C131D] rounded-lg border-0 cursor-pointer shadow-xs">
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </button>
        </div>
      </header>

      {/* Breadcrumb line matching screenshot */}
      <div className="bg-white border-b border-neutral-100 px-8 py-2.5 text-[11px] font-mono text-neutral-400 flex items-center gap-2">
        <span className="hover:text-neutral-700 cursor-pointer">Home</span>
        <span>&gt;</span>
        <span className="text-neutral-600 font-bold">Search</span>
      </div>

      <main className="flex-1 px-4 sm:px-8 py-10 max-w-7xl mx-auto w-full space-y-8">
        
        {/* 2. Main Title & Description Panel */}
        <div className="text-center space-y-3.5 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-none">
            Browse Academic Agent Skills
          </h1>
          <p className="text-sm font-serif text-neutral-500 max-w-2xl mx-auto leading-relaxed text-justify sm:text-center">
            掌术自主研发的医学及自然科学深度学术Agent微型工具市场。囊括全学科50余种高度定制的科研决策、统计、机制图设计及学术规范校验模组，让人工智能深度理解您的科研语境。
          </p>
        </div>

        {/* 3. Filter dropdown & Sort toggles matching exactly the layout in the screenshot */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-2 border-y border-neutral-150">
          
          {/* Occupation Filter Dropdown Button */}
          <div className="flex items-center gap-2 relative">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Filter by</span>
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-250 hover:border-[#6B1724] hover:text-[#6B1724] text-xs font-bold text-neutral-700 rounded-lg transition-colors cursor-pointer"
            >
              <Filter className="h-3.5 w-3.5 text-neutral-400" />
              <span>{currentCategoryLabel}</span>
              <ChevronDown className="h-3 w-3 text-neutral-400" />
            </button>

            {showCategoryDropdown && (
              <div className="absolute top-10 left-16 z-20 w-72 bg-white border border-neutral-200 rounded-xl shadow-xl py-2 animate-in fade-in duration-150">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setShowCategoryDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between border-0 bg-transparent transition-colors cursor-pointer ${
                      activeCategory === cat.id 
                        ? "bg-[#6B1724]/8 text-[#6B1724] font-bold" 
                        : "text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    <span>{cat.label}</span>
                    {activeCategory === cat.id && <Check className="h-3.5 w-3.5 text-[#6B1724]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Spacer on Desktop */}
          <div className="hidden sm:block h-5 w-[1px] bg-neutral-250" />

          {/* Sort By Toggles */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Sort by</span>
            <div className="flex bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
              <button
                onClick={() => setSortBy("stars")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all border-0 cursor-pointer ${
                  sortBy === "stars"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span>Stars</span>
              </button>
              <button
                onClick={() => setSortBy("recent")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all border-0 cursor-pointer ${
                  sortBy === "recent"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                <Clock className="h-3.5 w-3.5 text-neutral-500" />
                <span>Recent</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4. Massive screenshot-style Search Box */}
        <div className="max-w-4xl mx-auto w-full">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 54291 academic skills: try 'cox-regression', 'academic polishing', 'vector-illustration'..."
              className="w-full text-sm pl-12 pr-12 py-3.5 bg-white border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-[#6B1724] focus:ring-1 focus:ring-[#6B1724] shadow-xs hover:border-neutral-300 transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-3.5 text-neutral-400 hover:text-[#6B1724] cursor-pointer border-0 bg-transparent p-1"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Quick recommendations */}
          <div className="mt-3 flex flex-wrap justify-center gap-1.5 text-[11px] text-neutral-400 font-serif">
            <span>推荐搜索:</span>
            {["cox-regression", "academic-polisher", "biostatistics", "table-one", "pubmed"].map(term => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="hover:text-[#6B1724] hover:underline cursor-pointer border-0 bg-transparent p-0 italic"
              >
                '{term}',
              </button>
            ))}
          </div>
        </div>

        {/* 5. The Cards Grid in exact skillsmp Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {processedItems.map((item) => {
            const isLiked = !!likedSkills[item.id];
            
            return (
              <div 
                key={item.id}
                onClick={() => {
                  if (item.type === "skill") {
                    handleOpenToolModal(item.originalData as AISkill);
                  } else {
                    handleOpenServiceModal(item.originalData as PremiumService);
                  }
                }}
                className="bg-white border border-neutral-200 hover:border-[#6B1724]/40 hover:shadow-lg rounded-xl overflow-hidden transition-all duration-200 flex flex-col justify-between group cursor-pointer relative"
              >
                {/* Visual marker for Premium Human Service vs standard AI skill */}
                {item.type === "service" && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#6B1724]" />
                )}

                <div>
                  {/* Card Header matching screenshot layout */}
                  <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center justify-between">
                    <span className="font-mono text-xs font-extrabold text-neutral-900 group-hover:text-[#6B1724] transition-colors truncate max-w-[180px]">
                      {item.id}
                    </span>
                    <span className="text-[11px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      <span>{item.stars}</span>
                    </span>
                  </div>

                  {/* Creator and Badge Namespace Section */}
                  <div className="px-5 pt-3.5 flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-[#6B1724] text-white flex items-center justify-center font-bold text-[9px] shrink-0 uppercase">
                      {item.provider.split("/")[1].substring(0, 2)}
                    </div>
                    <span className="text-xs text-neutral-400 font-mono truncate">
                      {item.provider}
                    </span>
                    {item.type === "service" && (
                      <span className="text-[9px] font-bold bg-[#6B1724]/8 text-[#6B1724] px-1.5 py-0.5 rounded border border-[#6B1724]/10 shrink-0">
                        Expert
                      </span>
                    )}
                  </div>

                  {/* Card Main Body Content */}
                  <div className="px-5 py-3.5 space-y-2">
                    <h3 className="text-sm font-extrabold text-neutral-800 leading-snug group-hover:text-[#6B1724] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-neutral-500 font-serif leading-relaxed text-justify line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer matching screenshot style */}
                <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400">
                    <Clock className="h-3 w-3" />
                    <span>{item.updatedAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Hover indicator cue */}
                    <span className="text-[9px] font-bold text-[#6B1724] opacity-0 group-hover:opacity-100 transition-all font-mono">
                      Configure ➔
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleToggleLike(item.id, e)}
                      className="p-1 rounded-md text-neutral-400 hover:text-red-500 hover:bg-neutral-100 transition-colors border-0 bg-transparent cursor-pointer"
                    >
                      <Heart className={`h-3.5 w-3.5 transition-transform active:scale-125 ${isLiked ? "text-red-500 fill-red-500" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 6. Fallback when Search filter matches nothing */}
        {processedItems.length === 0 && (
          <div className="p-16 text-center bg-neutral-50 border border-dashed border-neutral-300 rounded-2xl font-serif">
            <Search className="h-10 w-10 text-neutral-300 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-neutral-700 mb-1">未搜索到相关学术工具、服务或提供商</h4>
            <p className="text-xs text-neutral-400">请更换更精准的关键词（如 'cox', 'statistics'）进行检索，或者在上方调整 Occupation 分类偏好。</p>
          </div>
        )}

      </main>

      {/* ================= MODAL 1: AI SKILL INTERACTIVE PARAMETER CONFIGURATION ================= */}
      {selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs text-neutral-800 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white border border-neutral-200 rounded-2xl shadow-2xl p-8 flex flex-col max-h-[90vh] overflow-y-auto">
            
            {/* Close */}
            <button 
              onClick={() => setSelectedTool(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-2 rounded-lg cursor-pointer border-0 bg-transparent"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Title Block */}
            <div className="border-b border-neutral-150 pb-4 mb-6">
              <span className="text-[9px] font-mono uppercase text-[#6B1724] font-black tracking-widest">ZS-AI-ENGINE COMPILER</span>
              <h3 className="text-xl font-bold text-neutral-900 mt-1 flex items-center gap-2">
                {getToolIcon(selectedTool.icon)}
                <span>{selectedTool.name}</span>
              </h3>
              <p className="text-xs font-serif text-neutral-500 mt-2 leading-relaxed text-justify">
                {selectedTool.description}
              </p>
            </div>

            {/* Forms body */}
            <div className="space-y-6 flex-1">
              
              {/* Render dynamic parameters configured */}
              {selectedTool.params && selectedTool.params.length > 0 && (
                <div className="space-y-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B1724] font-black block">METHOD CONSTRAINTS / 统计学决策调参项：</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedTool.params.map(p => (
                      <div key={p.id} className="space-y-1.5">
                        <label className="text-[10.5px] font-bold text-neutral-600 block">
                          {p.label}
                        </label>
                        {p.type === "select" ? (
                          <select
                            value={paramValues[p.id] || p.defaultValue}
                            onChange={(e) => handleParamChange(p.id, e.target.value)}
                            className="w-full text-xs p-2.5 bg-white border border-neutral-250 rounded-lg focus:outline-none focus:border-[#6B1724] cursor-pointer"
                          >
                            {p.options?.map(opt => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={p.type}
                            value={paramValues[p.id] || p.defaultValue}
                            onChange={(e) => handleParamChange(p.id, e.target.value)}
                            className="w-full text-xs p-2.5 bg-white border border-neutral-250 rounded-lg focus:outline-none focus:border-[#6B1724]"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Main textual prompt text-area */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#6B1724] font-black block">
                  RESEARCH CONTEXT / 精密科研研究背景描述：
                </label>
                <textarea
                  value={customInputText}
                  onChange={(e) => setCustomInputText(e.target.value)}
                  rows={4}
                  className="w-full text-xs p-4 bg-white border border-neutral-250 rounded-xl focus:outline-none focus:border-[#6B1724] leading-relaxed text-justify font-sans"
                  placeholder="在此输入您的课题具体临床/工程参数..."
                />
                <span className="text-[10px] text-neutral-400 font-serif block text-right italic">
                  您可随时精简或替换以上预置背景范例以实现最严谨匹配
                </span>
              </div>

              {/* Dynamic Query Live Compiler Preview */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-600 font-black block flex items-center gap-1">
                  <Cpu className="h-3.5 w-3.5" />
                  <span>COMPILED QUERY PREVIEW / 掌术大模型原生 Prompt 实时编译：</span>
                </label>
                <div className="bg-neutral-900 p-4 border border-neutral-800 rounded-xl font-mono text-[11px] text-neutral-300 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap select-all">
                  {compiledPrompt}
                </div>
              </div>
            </div>

            {/* Footer triggers onSendMessageToAgent */}
            <div className="border-t border-neutral-200 pt-6 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-neutral-400 text-[10px] font-mono uppercase">
                <CheckCircle2 className="h-4.5 w-4.5 text-[#6B1724]" strokeWidth={2} />
                <span>COPE/ICMJE 论文发表伦理合规已激活</span>
              </div>

              <button
                onClick={handleLaunchTool}
                className="px-6 py-3 bg-[#6B1724] hover:bg-[#5C131D] text-white text-xs font-bold rounded-lg transition-all duration-100 flex items-center justify-center gap-2 cursor-pointer border-0 shadow-sm"
              >
                <span>一键派发至 Agent 运行 (LAUNCH)</span>
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL 2: PREMIUM SERVICE RECRUITMENT CONSULTATION FORM ================= */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs text-neutral-800 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white border border-neutral-200 rounded-2xl shadow-2xl p-8 flex flex-col">
            
            {/* Close */}
            <button 
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 p-2 rounded-lg cursor-pointer border-0 bg-transparent"
            >
              <X className="h-4 w-4" />
            </button>

            {!consultationSubmitted ? (
              <form onSubmit={handleSubmitConsultation} className="space-y-6">
                {/* Title */}
                <div className="border-b border-neutral-150 pb-4">
                  <span className="text-[9px] font-mono uppercase text-[#6B1724] font-black tracking-widest">PREMIUM SCHOLARLY CONSULTATION</span>
                  <h3 className="text-xl font-bold text-neutral-950 mt-1 leading-snug">
                    高级专案定制：{selectedService.name}
                  </h3>
                  <p className="text-xs text-neutral-500 font-serif mt-2">
                    由 <b>{selectedService.provider}</b> 派驻顶尖团队跟进。请提交您课题的初步意向，我们将在2小时内指派专属学科秘书与您建立安全加密会话。
                  </p>
                </div>

                {/* Inputs */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10.5px] font-bold text-neutral-600 block">
                      您的姓名/称呼 (Name) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={consultationName}
                      onChange={(e) => setConsultationName(e.target.value)}
                      placeholder="例如：李教授 / 王医生"
                      className="w-full text-xs p-2.5 bg-white border border-neutral-250 rounded-lg focus:outline-none focus:border-[#6B1724]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10.5px] font-bold text-neutral-600 block">
                      联系方式 (手机、微信或学术邮箱) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={consultationContact}
                      onChange={(e) => setConsultationContact(e.target.value)}
                      placeholder="例如：138-xxxx-xxxx / academic@university.edu"
                      className="w-full text-xs p-2.5 bg-white border border-neutral-250 rounded-lg focus:outline-none focus:border-[#6B1724]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10.5px] font-bold text-neutral-600 block">
                      课题当前进展与具体定制需求说明 (Notes &amp; Specs)
                    </label>
                    <textarea
                      value={consultationNotes}
                      onChange={(e) => setConsultationNotes(e.target.value)}
                      rows={3}
                      placeholder="描述您的研究领域、所需样本量大小或希望绘制的信号通路细节，以便专家团队快速研判..."
                      className="w-full text-xs p-3 bg-white border border-neutral-250 rounded-lg focus:outline-none focus:border-[#6B1724] leading-relaxed text-justify"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-neutral-150 pt-6 mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#6B1724] uppercase tracking-widest font-black flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    <span>NDA 隐私保密协议保障</span>
                  </span>

                  <button
                    type="submit"
                    disabled={isSubmittingConsultation}
                    className="px-6 py-3.5 bg-[#6B1724] hover:bg-[#5C131D] text-white disabled:opacity-50 text-xs font-bold rounded-lg transition-all duration-100 flex items-center gap-2 cursor-pointer border-0 shadow-sm"
                  >
                    {isSubmittingConsultation ? (
                      <span>正在提报安全通道...</span>
                    ) : (
                      <>
                        <span>确认提交意向订单</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-12 space-y-6">
                <div className="mx-auto h-16 w-16 bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center rounded-full animate-bounce">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-neutral-900">定制提报提审成功！</h3>
                  <p className="text-xs text-neutral-500 font-serif leading-relaxed max-w-sm mx-auto">
                    系统已锁定专属加密服务通道。学科秘书将在 <b>2小时内 (工作时间)</b> 通过您预留的联系方式：<span className="font-mono text-neutral-950 font-bold block mt-1">{consultationContact}</span> 与您取得联系，商定 NDA 隐私保密协议，并开启专家1对1专案服务。
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setSelectedService(null)}
                    className="px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-lg transition-colors duration-100 cursor-pointer border-0"
                  >
                    返回服务市场
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
