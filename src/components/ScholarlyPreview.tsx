import React, { useState, useEffect } from "react";
import { 
  Sparkles, FileText, CheckCircle2, TrendingUp, BarChart2, Check, X,
  Database, Cpu, BookOpen, ShieldCheck, Layers, ClipboardCheck, Info,
  AlertCircle, ChevronRight, Play, Copy, RefreshCw, Sliders, Activity, Target
} from "lucide-react";

interface ScholarlyPreviewProps {
  skillId: string;
  inputText: string;
  outputResult: string;
  params?: Record<string, string>;
}

export const ScholarlyPreview: React.FC<ScholarlyPreviewProps> = ({
  skillId,
  inputText,
  outputResult,
  params = {} as Record<string, string>
}) => {
  // Common states
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Topic Planning Interactive State
  const [selectedTopicIdx, setSelectedTopicIdx] = useState<number>(0);
  
  // CRF Interactive State
  const [activeCrfModule, setActiveCrfModule] = useState<string>("demographics");
  const [crfFormState, setCrfFormState] = useState<Record<string, string>>({
    patient_id: "ZS-2026-089",
    age: "58",
    gender: "Male",
    treatment_group: "Active Drug A (High Dose)",
    enrollment_date: "2026-07-02",
    baseline_hba1c: "7.8",
    bp_sys: "142",
    ae_occurred: "No",
    egfr: "84.2"
  });

  // Nomogram Interactive State
  const [nomogramPoints, setNomogramPoints] = useState({
    age: 62,
    tumorSize: 3.5,
    lymphNodes: 1, // 0 = negative, 1 = positive
    comorbidities: 1 // 0 = none, 1 = mild, 2 = severe
  });

  // Proofreading / Diff Revision Tone toggle
  const [revisionViewMode, setRevisionViewMode] = useState<"diff" | "pristine">("diff");

  // Code editor display copy
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedText("code");
    setTimeout(() => setCopiedText(null), 2000);
  };

  // ----------------------------------------------------
  // 1. DATA EXTRACTORS (Mock or parse from LLM result)
  // ----------------------------------------------------
  const cleanedInputText = inputText.trim();

  // Helper: check if certain words are in input to make previews semi-dynamic
  const containsWord = (words: string[]) => {
    return words.some(w => cleanedInputText.toLowerCase().includes(w.toLowerCase()));
  };

  const isCancerRelated = containsWord(["癌", "cancer", "肿瘤", "tumor", "survival", "生存"]);
  const isCardioRelated = containsWord(["心", "cardio", "bp", "血压", "hypertension", "stroke"]);
  const isDiabetesRelated = containsWord(["糖", "diabetes", "hba1c", "insulin", "胰岛素"]);

  // ----------------------------------------------------
  // 2. RENDERERS FOR INDIVIDUAL TOOL PREVIEWS
  // ----------------------------------------------------

  // 2.1 Topic Planning & Literature Review
  const renderTopicPlanning = () => {
    const topics = [
      {
        titleZh: "基于多模态医学掌术大模型的阿尔茨海默病(AD)早期生物标志物多维筛选与预后预测系统构建",
        titleEn: "Multimodal Zhangshu Medical LLM for Multi-dimensional Screening of Early Biomarkers and Prognosis Prediction in Alzheimer's Disease",
        hypothesis: "通过整合掌术大模型处理的非结构化病历和脑脊液多组学数据，能显著提高前驱期AD诊断的AUC值。",
        innovation: "98%",
        feasibility: "高 (结合专线大模型算力)",
        jcrPartition: "Q1",
        targetJournal: "Nature Medicine / Lancet Digital Health"
      },
      {
        titleZh: "抗肿瘤靶向药物伴随不良反应的真实世界机器学习预警模型研发及多中心验证",
        titleEn: "Real-World Machine Learning Early-Warning Model for Concomitant Adverse Events of Antitumor Targeted Therapies: A Multicenter Validation",
        hypothesis: "基于集成学习算法的动态时间序列分析，可提前48小时预警恶性肿瘤靶向化疗中的严重肝肾损伤。",
        innovation: "94%",
        feasibility: "极高 (成熟的常规医疗随访队列)",
        jcrPartition: "Q1",
        targetJournal: "JAMA Oncology / Journal of Clinical Oncology"
      },
      {
        titleZh: "微生态制剂联合免疫治疗对重度二型糖尿病小鼠糖脂代谢机制影响的体外与体内双规验证",
        titleEn: "Efficacy and Microbiome Mechanisms of Microecologics Combined with Immunotherapy on Glycolipid Metabolism in Type 2 Diabetic Mice",
        hypothesis: "肠道菌群介导的短链脂肪酸(SCFAs)水平提升能通过AMPK通路直接改善靶器官的胰岛素敏感度。",
        innovation: "91%",
        feasibility: "中等 (需动物实验平台配合)",
        jcrPartition: "Q1",
        targetJournal: "Gastroenterology / Diabetes Care"
      }
    ];

    return (
      <div className="space-y-5">
        <div className="bg-[#6B1724]/5 border-2 border-[#6B1724] p-4">
          <div className="flex items-center gap-2 mb-2 text-[#6B1724]">
            <Sparkles className="h-4.5 w-4.5 animate-pulse" />
            <span className="text-xs font-mono font-black uppercase tracking-wider">立题分析：{cleanedInputText ? `"${cleanedInputText.slice(0, 15)}..."` : "学术大纲规划"}</span>
          </div>
          <p className="text-[11px] font-serif leading-relaxed text-[#111111]">
            掌术学术专家大模型已匹配了 <strong className="text-[#6B1724]">3 项</strong> 极具发表潜力的前沿选题。请点击下方卡片查看详细的立论、科学假设和创新度解剖。
          </p>
        </div>

        {/* Dynamic selector cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {topics.map((t, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedTopicIdx(idx)}
              className={`text-left p-3 border-2 transition-all cursor-pointer ${
                selectedTopicIdx === idx 
                  ? "bg-[#6B1724] text-white border-black" 
                  : "bg-white text-[#111111] border-neutral-200 hover:border-[#6B1724]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[9px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded-none ${
                  selectedTopicIdx === idx ? "bg-[#5C131D] text-white" : "bg-[#FAF9F6] border border-[#111111]/10 text-[#6B1724]"
                }`}>
                  课题方案 0{idx + 1}
                </span>
                <span className={`text-[10px] font-mono font-bold ${selectedTopicIdx === idx ? "text-neutral-200" : "text-[#111111]/60"}`}>
                  创新度: {t.innovation}
                </span>
              </div>
              <h4 className="text-[11px] font-sans font-black line-clamp-2 leading-tight uppercase">
                {t.titleZh}
              </h4>
            </button>
          ))}
        </div>

        {/* Selected Topic Detail */}
        <div className="border-2 border-[#111111] bg-white p-5">
          <div className="border-b-2 border-[#111111]/10 pb-3 mb-3.5">
            <h3 className="text-xs font-mono font-black text-[#6B1724] uppercase tracking-wider mb-1">
              &sect; 方案 0{selectedTopicIdx + 1} 深度立项书纲要
            </h3>
            <p className="text-[11px] text-neutral-500 font-mono italic leading-relaxed uppercase">
              {topics[selectedTopicIdx].titleEn}
            </p>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-[10px] font-mono font-black text-black uppercase tracking-widest block mb-1">【核心科学假设 / Scientific Hypothesis】</span>
              <p className="font-serif text-[#111111] bg-[#FAF9F6] p-3 border border-[#111111]/10 leading-relaxed italic">
                &ldquo;{topics[selectedTopicIdx].hypothesis}&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-2.5 bg-[#FAF9F6] border border-[#111111]/10">
                <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider block">预估可行性</span>
                <span className="text-xs font-sans font-black text-black block mt-0.5">{topics[selectedTopicIdx].feasibility}</span>
              </div>
              <div className="p-2.5 bg-[#FAF9F6] border border-[#111111]/10">
                <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider block">拟投目标期刊</span>
                <span className="text-xs font-sans font-black text-[#6B1724] block mt-0.5 truncate">{topics[selectedTopicIdx].targetJournal.split(" / ")[0]}</span>
              </div>
              <div className="p-2.5 bg-[#FAF9F6] border border-[#111111]/10">
                <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider block">期刊分区及影响</span>
                <span className="text-xs font-sans font-black text-black block mt-0.5">JCR {topics[selectedTopicIdx].jcrPartition} / Top期刊</span>
              </div>
            </div>

            {/* Simulated research milestones */}
            <div className="pt-2">
              <span className="text-[10px] font-mono font-black text-black uppercase tracking-widest block mb-2">【推进实施路径 / Timeline Stages】</span>
              <div className="flex items-center justify-between gap-1 text-[10px] font-mono">
                <div className="flex-1 text-center bg-[#FAF9F6] border border-[#111111]/15 p-2 rounded-none">
                  <div className="font-black text-[#6B1724]">STAGE 1</div>
                  <div className="text-[9px] text-[#111111]/70 mt-0.5">多源数据采集与质控</div>
                </div>
                <ChevronRight className="h-3 w-3 text-[#111111]/40" />
                <div className="flex-1 text-center bg-[#FAF9F6] border border-[#111111]/15 p-2 rounded-none">
                  <div className="font-black text-[#6B1724]">STAGE 2</div>
                  <div className="text-[9px] text-[#111111]/70 mt-0.5">大模型特征预训练</div>
                </div>
                <ChevronRight className="h-3 w-3 text-[#111111]/40" />
                <div className="flex-1 text-center bg-[#FAF9F6] border border-[#111111]/15 p-2 rounded-none">
                  <div className="font-black text-[#6B1724]">STAGE 3</div>
                  <div className="text-[9px] text-[#111111]/70 mt-0.5">多中心队列临床验证</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLiteratureReview = () => {
    return (
      <div className="space-y-4">
        <div className="bg-[#6B1724]/5 border-2 border-[#6B1724] p-4">
          <span className="text-xs font-mono font-black text-[#6B1724] uppercase tracking-wider block mb-1">【文献共识度与研究空白透视 (Research Gap Analysis)】</span>
          <p className="text-[11px] font-serif text-[#111111] leading-relaxed">
            掌术文献网络聚类引擎已完成国内外研究现状的拓扑建模。图表展现了当前主流方向的共识饱和度，指出您的切入点所在的极高科研空白。
          </p>
        </div>

        {/* Visual Venn / Chart represent literature state */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-[#111111] bg-white p-4 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-black uppercase text-[#111111] tracking-widest block mb-2.5">领域热度与空白比对 / RESEARCH GAP</span>
              
              {/* Simple pure-CSS bars */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-neutral-500 mb-1">
                    <span>A. 传统单模态临床参数建模</span>
                    <span className="font-bold text-black">85% (高饱和/难发高分)</span>
                  </div>
                  <div className="w-full bg-[#FAF9F6] border border-[#111111]/15 h-2 rounded-none">
                    <div className="bg-[#111111]/60 h-full" style={{ width: "85%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono text-neutral-500 mb-1">
                    <span>B. 基础动物实验通路机制</span>
                    <span className="font-bold text-black">70% (研究雷同性高)</span>
                  </div>
                  <div className="w-full bg-[#FAF9F6] border border-[#111111]/15 h-2 rounded-none">
                    <div className="bg-[#111111]/40 h-full" style={{ width: "70%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono text-[#6B1724] mb-1">
                    <span>C. 掌术大模型+真实世界前瞻队列</span>
                    <span className="font-bold text-[#6B1724]">15% (绝对学术空缺/黄金红利)</span>
                  </div>
                  <div className="w-full bg-[#FAF9F6] border-2 border-[#6B1724] h-3 rounded-none">
                    <div className="bg-[#6B1724] h-full animate-pulse" style={{ width: "15%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-[#6B1724] bg-[#6B1724]/5 border border-[#6B1724]/20 p-2.5 mt-4">
              &sect; <strong>掌术引文建议:</strong> 突破传统孤立分析，围绕方向 C 进行国内外文献综述梳理，能极大增强 Reviewer 的认同度。
            </div>
          </div>

          <div className="border-2 border-[#111111] bg-white p-4">
            <span className="text-[10px] font-mono font-black uppercase text-[#111111] tracking-widest block mb-3">综述大纲核心架构 / Narrative Structure</span>
            <div className="space-y-3 text-xs font-serif">
              <div className="border-l-2 border-black pl-3.5 py-1">
                <strong className="block text-[#111111] font-sans text-xs">第一部分：临床局限与未满足需求</strong>
                <p className="text-neutral-500 text-[10.5px] leading-relaxed mt-0.5">梳理二十年来的经典诊疗难点，提炼现有无创诊断在特异度上的学术瓶颈。</p>
              </div>
              <div className="border-l-2 border-black pl-3.5 py-1">
                <strong className="block text-[#111111] font-sans text-xs">第二部分：高通量大模型时代的诊疗范式转移</strong>
                <p className="text-neutral-500 text-[10.5px] leading-relaxed mt-0.5">对比分析神经网络、多组学融合相较于传统回归分析的技术进步与发表阵地演变。</p>
              </div>
              <div className="border-l-2 border-[#6B1724] pl-3.5 py-1 bg-[#6B1724]/5">
                <strong className="block text-[#6B1724] font-sans text-xs">第三部分：科学瓶颈、争鸣与本研究切入点</strong>
                <p className="text-neutral-500 text-[10.5px] leading-relaxed mt-0.5">指出多中心多队列泛化性不足的根本局限，顺理成章推出本课题的独创研究设计。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 2.2 Research Design & Ethics/CRF
  const renderResearchDesign = () => {
    return (
      <div className="space-y-4">
        <div className="bg-[#FAF9F6] border-2 border-[#111111] p-4">
          <span className="text-xs font-mono font-black text-[#111111] uppercase tracking-widest block mb-2">&sect; 2.2.1 临床入选与排除标准设计卡片</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-300 p-3">
              <div className="flex items-center gap-1.5 text-emerald-800 font-sans font-bold text-xs mb-2">
                <Check className="h-4 w-4 bg-emerald-600 text-white rounded-full p-0.5" />
                <span>入选标准 (Inclusion Criteria)</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-neutral-700 font-serif list-disc pl-4 leading-relaxed">
                <li>经临床及影像学/病理金标准确诊的患者（年龄 18 - 75 岁）</li>
                <li>具备完整的 3 年以上临床随访基线病历记录</li>
                <li>同意并签署由掌术医学伦理委员会核准的知情同意书</li>
                <li>基线器官功能基本健全（肌酐清除率 &gt; 60 ml/min）</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-300 p-3">
              <div className="flex items-center gap-1.5 text-red-800 font-sans font-bold text-xs mb-2">
                <X className="h-4 w-4 bg-red-600 text-white rounded-full p-0.5" />
                <span>排除标准 (Exclusion Criteria)</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-neutral-700 font-serif list-disc pl-4 leading-relaxed">
                <li>近期接受过其他同类干扰性临床试验/免疫抑制药物治疗</li>
                <li>合并严重心、肺、肾功能不全或不稳定性全身系统性疾病</li>
                <li>妊娠期、哺乳期女性或伴有精神认知功能障碍无法配合随访者</li>
                <li>失访概率高（如非本地常住人口，计划半年内迁移者）</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Study Flow Pathway */}
        <div className="border-2 border-[#111111] bg-white p-4">
          <span className="text-[10px] font-mono font-black uppercase text-black tracking-widest block mb-3">多中心临床试验流向图 (CONSORT Flow-chart Blueprint)</span>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center text-[10.5px] font-mono">
            <div className="flex-1 bg-[#FAF9F6] border border-[#111111]/15 p-2 w-full">
              <div className="font-black text-[#111111]">受试者筛查</div>
              <div className="text-neutral-500 mt-0.5">N = 500 名拟招募</div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#111111]/40 hidden sm:block rotate-90 sm:rotate-0" />
            <div className="flex-1 bg-[#FAF9F6] border border-[#111111]/15 p-2 w-full">
              <div className="font-black text-[#6B1724]">随机化分配 (1:1)</div>
              <div className="text-neutral-500 mt-0.5">N = 200 实验组 / 200 对照组</div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#111111]/40 hidden sm:block rotate-90 sm:rotate-0" />
            <div className="flex-1 bg-[#FAF9F6] border border-[#111111]/15 p-2 w-full">
              <div className="font-black text-[#111111]">干预与随访</div>
              <div className="text-neutral-500 mt-0.5">3个周期 / 脱失失访控制&lt;10%</div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#111111]/40 hidden sm:block rotate-90 sm:rotate-0" />
            <div className="flex-1 bg-[#6B1724] text-white border border-[#111111] p-2 w-full">
              <div className="font-black text-white">符合方案集 (PP)</div>
              <div className="text-neutral-200 mt-0.5">ITT/PP 统计学差异性终点</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEthicsCrf = () => {
    // CRF modules
    const modules = [
      { id: "demographics", name: "1. 人口学基线", fields: ["Patient ID", "Age", "Gender", "Ethnicity", "Weight (kg)"] },
      { id: "vitals", name: "2. 生命体征", fields: ["Systolic BP", "Diastolic BP", "Heart Rate", "Temperature", "BMI"] },
      { id: "lab_biomarkers", name: "3. 实验室指标与组学", fields: ["HbA1c (%)", "Serum Creatinine", "eGFR", "ALT / AST", "RNA-seq Code"] },
      { id: "outcomes", name: "4. 临床不良事件 (AE)", fields: ["AE Description", "Severity (CTC-AE)", "Action Taken", "Causality with Drug"] }
    ];

    const currentModule = modules.find(m => m.id === activeCrfModule) || modules[0];

    return (
      <div className="space-y-4">
        <div className="bg-[#6B1724]/5 border border-[#6B1724] p-3.5 text-xs">
          <span className="font-mono font-black text-[#6B1724] uppercase tracking-wider block mb-1">【GCP 病例报告表 (CRF) 交互预览沙盒】</span>
          <p className="font-serif leading-relaxed text-[#111111]/80">
            临床试验中采集数据必须规范，下面是为您定制的标准的电子病例报告表（eCRF）草案模块，支持临床研究助理（CRC/CRA）录入与稽查。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Menu */}
          <div className="md:col-span-4 flex flex-col gap-1">
            {modules.map(m => (
              <button
                key={m.id}
                onClick={() => setActiveCrfModule(m.id)}
                className={`text-left text-xs font-mono font-bold p-2.5 rounded-none border-2 transition-all cursor-pointer ${
                  activeCrfModule === m.id 
                    ? "bg-[#111111] text-white border-black" 
                    : "bg-[#FAF9F6] text-neutral-600 border-neutral-200 hover:border-black hover:text-black"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>

          {/* Form simulation */}
          <div className="md:col-span-8 bg-white border-2 border-[#111111] p-4 flex flex-col justify-between">
            <div>
              <div className="border-b border-[#111111]/10 pb-2 mb-3.5 flex items-center justify-between">
                <span className="text-[10px] font-mono font-black text-[#6B1724] uppercase tracking-wider">
                  &sect; {currentModule.name} - 字段数据采集
                </span>
                <span className="text-[9px] font-mono text-neutral-400">STATUS: READY</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {currentModule.fields.map(field => {
                  const fieldKey = field.toLowerCase().replace(/[^a-z0-9]/g, "_");
                  return (
                    <div key={field} className="space-y-1">
                      <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block">{field}</label>
                      <input
                        type="text"
                        value={crfFormState[fieldKey] !== undefined ? crfFormState[fieldKey] : "---"}
                        onChange={(e) => setCrfFormState(prev => ({ ...prev, [fieldKey]: e.target.value }))}
                        className="w-full text-xs bg-[#FAF9F6] border border-neutral-300 rounded-none px-2 py-1.5 font-mono text-black outline-none focus:border-black"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-[#111111]/10 flex justify-between items-center text-[9px] font-mono text-neutral-400">
              <span>赫尔辛基宣言 &bull; 掌术大模型自动脱敏质控</span>
              <button
                onClick={() => {
                  alert(`CRF 数据包 "${currentModule.name}" 校验成功！符合 21 CFR Part 11 指南规范。`);
                }}
                className="bg-[#6B1724] text-white font-bold px-3 py-1 border border-black hover:bg-[#5C131D] text-[9px] cursor-pointer"
              >
                校验并提交沙盒
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 2.3 Data Science & Statistics Core
  const renderDataCleaning = () => {
    return (
      <div className="space-y-4">
        <div className="border-2 border-[#111111] bg-white p-4.5">
          <div className="flex items-center justify-between border-b border-[#111111]/10 pb-2.5 mb-3">
            <span className="text-xs font-mono font-black text-[#6B1724] uppercase tracking-wider">数据异常捕获 &amp; 清理对账 (Data Quality Report)</span>
            <span className="text-[10px] bg-red-50 text-red-700 font-mono font-bold px-2 py-0.5 border border-red-300">
              3 项异常警告
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2.5 p-2.5 bg-red-50 border border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-mono font-bold text-red-900">1. 空缺值异常 [Missing values]:</span>
                <p className="font-serif text-neutral-600 mt-0.5">
                  患者生理指标中 `Baseline_HbA1c` 字段检测到 8% 缺失值。自动采用 <strong className="text-[#6B1724] font-mono">多重插补法 (Multiple Imputation)</strong> 恢复偏倚控制。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 bg-yellow-50 border border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-mono font-bold text-yellow-900">2. 时间格式不一致 [Datetime Inconsistency]:</span>
                <p className="font-serif text-neutral-600 mt-0.5">
                  随访记录中检测到 `YYYY-MM-DD` 与 `DD/MM/YYYY` 混用。已全部自动解析重整为标准 ISO-8601 格式。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 bg-neutral-50 border border-neutral-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-mono font-bold text-neutral-800">3. 异常离群值限制 [Outlier bound limits]:</span>
                <p className="font-serif text-neutral-600 mt-0.5">
                  发现2例收缩压测量记录超过 220 mmHg，判定为输入偶发噪声。自动实施 99% 百分位数卡尾限幅。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Python Pandas snippet */}
        <div className="bg-neutral-950 border-2 border-[#111111] p-4 text-white font-mono text-[10px]">
          <div className="flex justify-between items-center text-neutral-400 border-b border-neutral-800 pb-2 mb-2.5">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <span>PYTHON (PANDAS) IMPUTATION SCRIPT</span>
            </div>
            <button
              onClick={() => handleCopyCode(`import pandas as pd
import numpy as np
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer

# 1. 载入临床数据集
df = pd.read_csv("patient_data.csv")

# 2. 空缺值与极值清理
imputer = IterativeImputer(random_state=42)
df_clean = df.copy()
df_clean[['age', 'baseline_hba1c']] = imputer.fit_transform(df[['age', 'baseline_hba1c']])

# 3. 规范日期字段
df_clean['followup_date'] = pd.to_datetime(df_clean['followup_date'], errors='coerce')`)}
              className="text-white hover:underline flex items-center gap-1"
            >
              <Copy className="h-3 w-3" />
              <span>{copiedText === "code" ? "已复制" : "复制清洗脚本"}</span>
            </button>
          </div>
          <pre className="overflow-x-auto text-neutral-200 max-h-40">
{`# 载入临床数据集
df = pd.read_csv("patient_data.csv")

# 空缺值与极值清理
imputer = IterativeImputer(random_state=42)
df_clean = df.copy()
df_clean[['age', 'baseline_hba1c']] = imputer.fit_transform(df[['age', 'baseline_hba1c']])

# 规范日期字段并存盘
df_clean['followup_date'] = pd.to_datetime(df_clean['followup_date'])
print("Cleaned successfully! Total missing rate = 0.00%")`}
          </pre>
        </div>
      </div>
    );
  };

  const renderFeatureEngineering = () => {
    return (
      <div className="space-y-4">
        <div className="border-2 border-[#111111] bg-white p-4">
          <span className="text-[10px] font-mono font-black uppercase text-[#111111] tracking-widest block mb-2">主成分分析因子权重 (PCA Component Loading Map)</span>
          
          <div className="h-44 flex items-end justify-between border-b border-[#111111]/30 pb-1 px-4 pt-4">
            {[
              { label: "Age & Vitals (Age / SBP)", pc1: 0.82, pc2: -0.15, color: "bg-[#6B1724]" },
              { label: "Lab Biomarkers (HbA1c / LDL)", pc1: 0.65, pc2: 0.72, color: "bg-[#111111]" },
              { label: "Omics Features (RNA-Seq Cluster)", pc1: 0.41, pc2: 0.88, color: "bg-neutral-500" },
              { label: "Lifestyle Index (Smoking / BMI)", pc1: 0.55, pc2: -0.42, color: "bg-neutral-300" }
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center w-1/5 gap-2.5">
                <div className="w-full flex justify-center gap-1.5 h-24 items-end bg-neutral-50 border border-neutral-100 p-1">
                  {/* PC1 bar */}
                  <div className={`${item.color} w-3`} style={{ height: `${item.pc1 * 100}%` }} title={`PC1 loading: ${item.pc1}`}></div>
                  {/* PC2 bar */}
                  <div className="bg-neutral-300 w-3" style={{ height: `${Math.abs(item.pc2) * 100}%` }} title={`PC2 loading: ${item.pc2}`}></div>
                </div>
                <span className="text-[8.5px] font-mono text-center truncate w-full" title={item.label}>
                  {item.label.split(" (")[0]}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-[8px] font-mono text-neutral-400 mt-2">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 bg-[#6B1724]"></span>
              <span>主轴 PC1 (解释变异 48.2%)</span>
              <span className="inline-block h-2 w-2 bg-neutral-300"></span>
              <span>次轴 PC2 (解释变异 21.6%)</span>
            </div>
            <span>累计贡献度: 69.8%</span>
          </div>
        </div>

        <div className="bg-[#FAF9F6] border border-[#111111]/15 p-3.5 text-xs font-serif leading-relaxed text-[#111111]">
          <strong className="block text-[#6B1724] font-sans font-bold mb-1">&sect; 掌术建模建议</strong>
          针对机器学习及Cox多因素模型，建议选择 LASSO 回归算法对特征系数进行惩罚限缩，可解决因自变量交互导致的过拟合危机。
        </div>
      </div>
    );
  };

  // Highly customizable Academic Charts
  const renderStatCodePlot = () => {
    return (
      <div className="space-y-5">
        <div className="bg-[#6B1724]/5 border border-[#6B1724]/20 p-3 flex justify-between items-center">
          <div className="text-xs">
            <span className="font-mono font-black text-[#6B1724] uppercase tracking-wider block">【CNS 级别学术可视化仿真绘图板】</span>
            <p className="font-serif text-neutral-600 text-[11px] mt-0.5">下面为您加载了本研究专用的四种国际顶级医学期刊最偏好的插图高精度仿真版，包含完美的可视化配色与统计结论标注。</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Chart 1: Kaplan-Meier Curve */}
          <div className="border-2 border-[#111111] bg-white p-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2 mb-3">
              <span className="text-[10px] font-mono font-black text-[#111111] uppercase tracking-wider">A. Kaplan-Meier Survival Curve (NEJM Style)</span>
              <span className="text-[9px] bg-red-50 text-[#6B1724] border border-[#6B1724]/20 font-mono px-1.5">P &lt; 0.001</span>
            </div>

            {/* KM curve SVG mockup */}
            <div className="relative">
              <svg viewBox="0 0 300 150" className="w-full h-auto overflow-visible">
                {/* Axes */}
                <line x1="30" y1="10" x2="30" y2="130" stroke="#111111" strokeWidth="1.5" />
                <line x1="30" y1="130" x2="280" y2="130" stroke="#111111" strokeWidth="1.5" />
                
                {/* Labels */}
                <text x="10" y="70" className="text-[8px] font-mono" transform="rotate(-90,10,70)" textAnchor="middle">Overall Survival Rate (%)</text>
                <text x="155" y="145" className="text-[8px] font-mono" textAnchor="middle">Follow-up Time (Months)</text>
                
                {/* Tickmarks */}
                <text x="25" y="15" className="text-[7px] font-mono">100</text>
                <text x="25" y="70" className="text-[7px] font-mono">50</text>
                <text x="25" y="130" className="text-[7px] font-mono">0</text>
                
                <text x="30" y="138" className="text-[7px] font-mono" textAnchor="middle">0</text>
                <text x="92" y="138" className="text-[7px] font-mono" textAnchor="middle">12</text>
                <text x="155" y="138" className="text-[7px] font-mono" textAnchor="middle">24</text>
                <text x="218" y="138" className="text-[7px] font-mono" textAnchor="middle">36</text>
                <text x="280" y="138" className="text-[7px] font-mono" textAnchor="middle">48</text>

                {/* Control Group (Lancet red / NEJM blue) */}
                <path d="M 30 15 L 60 15 L 60 20 L 92 25 L 92 40 L 155 55 L 155 68 L 218 85 L 280 98" fill="none" stroke="#111111" strokeWidth="1.5" />
                
                {/* Treatment Group */}
                <path d="M 30 15 L 92 15 L 92 18 L 155 22 L 218 28 L 280 35" fill="none" stroke="#6B1724" strokeWidth="2" />
                
                {/* Legend */}
                <rect x="180" y="10" width="85" height="30" fill="#FAF9F6" stroke="#111111" strokeWidth="0.5" />
                <line x1="185" y1="20" x2="200" y2="20" stroke="#6B1724" strokeWidth="2" />
                <text x="205" y="23" className="text-[7px] font-sans font-bold">治疗组 (Drug A)</text>
                <line x1="185" y1="32" x2="200" y2="32" stroke="#111111" strokeWidth="1.5" />
                <text x="205" y="35" className="text-[7px] font-sans">对照组 (Placebo)</text>
                
                {/* HR label */}
                <text x="45" y="115" className="text-[8px] font-mono font-bold" fill="#6B1724">HR: 0.42 (95% CI: 0.28-0.61)</text>
              </svg>
            </div>

            <div className="mt-3 bg-[#FAF9F6] border border-[#111111]/10 p-2 text-[8px] font-mono text-neutral-500">
              <div className="grid grid-cols-5 text-center font-bold text-black border-b border-neutral-200 pb-1 mb-1">
                <span>Risk Table</span>
                <span>0 m</span>
                <span>12 m</span>
                <span>24 m</span>
                <span>36 m</span>
              </div>
              <div className="grid grid-cols-5 text-center">
                <span>Drug A</span>
                <span>200</span>
                <span>195</span>
                <span>182</span>
                <span>171</span>
              </div>
              <div className="grid grid-cols-5 text-center">
                <span>Placebo</span>
                <span>200</span>
                <span>160</span>
                <span>110</span>
                <span>85</span>
              </div>
            </div>
          </div>

          {/* Chart 2: Receiver Operating Characteristic (ROC) */}
          <div className="border-2 border-[#111111] bg-white p-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2 mb-3">
              <span className="text-[10px] font-mono font-black text-[#111111] uppercase tracking-wider">B. ROC Curve &amp; Calibration (Model Validation)</span>
              <span className="text-[9px] bg-red-50 text-red-700 border border-red-200 font-mono px-1.5">AUC = 0.892</span>
            </div>

            <div className="relative">
              <svg viewBox="0 0 300 150" className="w-full h-auto overflow-visible">
                {/* Grid */}
                <line x1="30" y1="10" x2="30" y2="130" stroke="#CCCCCC" strokeWidth="0.5" strokeDasharray="3" />
                <line x1="30" y1="130" x2="150" y2="130" stroke="#CCCCCC" strokeWidth="0.5" strokeDasharray="3" />
                <line x1="150" y1="10" x2="150" y2="130" stroke="#CCCCCC" strokeWidth="0.5" strokeDasharray="3" />
                <line x1="30" y1="10" x2="150" y2="10" stroke="#CCCCCC" strokeWidth="0.5" strokeDasharray="3" />
                
                {/* Diagonal random guess */}
                <line x1="30" y1="130" x2="150" y2="10" stroke="gray" strokeWidth="1" strokeDasharray="4" />
                
                {/* Actual ROC curve */}
                <path d="M 30 130 C 35 70, 60 25, 150 10" fill="none" stroke="#6B1724" strokeWidth="2" />
                
                {/* Axes */}
                <line x1="30" y1="10" x2="30" y2="130" stroke="#111111" strokeWidth="1.5" />
                <line x1="30" y1="130" x2="150" y2="130" stroke="#111111" strokeWidth="1.5" />
                
                {/* Labels */}
                <text x="12" y="70" className="text-[8px] font-mono" transform="rotate(-90,12,70)" textAnchor="middle">Sensitivity</text>
                <text x="90" y="142" className="text-[8px] font-mono" textAnchor="middle">1 - Specificity</text>
                
                <text x="25" y="15" className="text-[7px] font-mono">1.0</text>
                <text x="25" y="130" className="text-[7px] font-mono">0.0</text>
                <text x="30" y="138" className="text-[7px] font-mono" textAnchor="middle">0.0</text>
                <text x="150" y="138" className="text-[7px] font-mono" textAnchor="middle">1.0</text>

                {/* Calibration card right side */}
                <rect x="170" y="10" width="120" height="110" fill="#FAF9F6" stroke="#111111" strokeWidth="0.5" />
                <text x="230" y="24" className="text-[8px] font-mono font-black text-[#6B1724]" textAnchor="middle">DIAGNOSTIC METRICS</text>
                
                <text x="175" y="42" className="text-[8px] font-mono">AUC Value:</text>
                <text x="285" y="42" className="text-[8px] font-mono font-bold text-right" textAnchor="end">0.892 (0.83-0.95)</text>
                
                <text x="175" y="58" className="text-[8px] font-mono">Sensitivity:</text>
                <text x="285" y="58" className="text-[8px] font-mono font-bold text-right text-emerald-600" textAnchor="end">85.3%</text>
                
                <text x="175" y="74" className="text-[8px] font-mono">Specificity:</text>
                <text x="285" y="74" className="text-[8px] font-mono font-bold text-right" textAnchor="end">91.0%</text>

                <text x="175" y="90" className="text-[8px] font-mono">Youden Index:</text>
                <text x="285" y="90" className="text-[8px] font-mono font-bold text-[#6B1724]" textAnchor="end">0.763 (Optimal)</text>
                
                <text x="175" y="106" className="text-[8px] font-mono">PPV / NPV:</text>
                <text x="285" y="106" className="text-[8px] font-mono font-bold text-right" textAnchor="end">88.2% / 89.1%</text>
              </svg>
            </div>
            
            <div className="mt-2 text-[8px] font-serif text-center text-neutral-400">
              STARD 声明校准规范 &bull; 支持 DeLong 检验
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReferencesFormatting = () => {
    return (
      <div className="space-y-4">
        <div className="bg-[#6B1724]/5 border border-[#6B1724]/20 p-3 text-xs leading-relaxed">
          <span className="font-mono font-black text-[#6B1724] uppercase tracking-wider block mb-1">【文献格式化精修对账单】</span>
          按照您选择的 <span className="font-bold underline">{params?.format || "Nature"}</span> 规范，大模型已深度校对。卷期缺失已被自动补全。
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-red-300 bg-red-50/30 p-4">
            <span className="text-[10px] font-mono font-black text-red-800 uppercase tracking-wider block mb-2">原始文献错误 (Input Inconsistencies)</span>
            <div className="space-y-3.5 text-[11px] font-mono text-neutral-600 leading-normal">
              <div>
                <span className="text-red-700 font-bold">[!]</span> Smith J, Doe A. Multimodal AI for clinical study. JOURNAL OF INTELLECTUAL MEDICINE. 2026. 12-15. <span className="text-red-600 underline font-bold">(缺失DOI, 卷期不详)</span>
              </div>
              <div className="border-t border-red-100 pt-2">
                <span className="text-red-700 font-bold">[!]</span> Wang, X., &amp; Li, Y. (2025). Clinical trials in China. Lancet, v45, 102-108. <span className="text-red-600 underline font-bold">(标点混杂，非Nature规范)</span>
              </div>
            </div>
          </div>

          <div className="border-2 border-emerald-500 bg-emerald-50/10 p-4">
            <span className="text-[10px] font-mono font-black text-emerald-800 uppercase tracking-wider block mb-2">标准排版文献 (Formatted References)</span>
            <div className="space-y-3.5 text-[11px] font-serif text-black leading-relaxed">
              <div>
                1. Smith J, Doe A. Multimodal AI for clinical study. <span className="italic text-black font-bold">J. Intel. Med.</span> <span className="font-bold">28</span>, 114-121 (2026). <span className="text-emerald-700 font-mono text-[10px] font-bold block mt-0.5">DOI: 10.1038/s41591-026-0421-y (已补齐)</span>
              </div>
              <div className="border-t border-emerald-100 pt-2">
                2. Wang X, Li Y. Clinical trials in China. <span className="italic text-black font-bold">Lancet</span> <span className="font-bold">405</span>, 102-108 (2025). <span className="text-emerald-700 font-mono text-[10px] font-bold block mt-0.5">PMID: 39482103 (已补齐)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderJournalMatching = () => {
    const journals = [
      { name: "Lancet Digital Health", if: "36.8", speed: "1.8 个月", rate: "12%", partition: "中科院 1区 Top", apc: "OA (Gold)" },
      { name: "Nature Medicine", if: "58.7", speed: "2.5 个月", rate: "8%", partition: "中科院 1区 Top", apc: "Hybrid" },
      { name: "IEEE Journal of Biomedical Health Informatics", if: "7.7", speed: "3.2 个月", rate: "22%", partition: "中科院 2区", apc: "Hybrid" }
    ];

    return (
      <div className="space-y-4">
        <span className="text-xs font-mono font-black text-[#111111] uppercase tracking-wider block">&sect; 推荐投稿候选期刊比对 (Journal Matcher Spectrum)</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {journals.map((j, idx) => (
            <div key={idx} className="border-2 border-[#111111] bg-white p-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] bg-[#6B1724]/10 text-[#6B1724] border border-[#6B1724]/20 px-2 py-0.5 font-mono font-bold">
                    匹配度 #0{idx + 1}
                  </span>
                  <span className="text-[10px] font-mono font-black text-[#6B1724]">IF: {j.if}</span>
                </div>
                <h3 className="text-xs font-sans font-black text-black leading-tight mb-2.5">
                  {j.name}
                </h3>
                
                <div className="space-y-2 text-[11px] font-mono text-neutral-500 border-t border-neutral-100 pt-2.5">
                  <div className="flex justify-between">
                    <span>分区:</span>
                    <span className="text-black font-bold">{j.partition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>审稿周期:</span>
                    <span className="text-black font-bold">{j.speed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>录用率:</span>
                    <span className="text-black font-bold">{j.rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>出版模式:</span>
                    <span className="text-black font-bold">{j.apc}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#111111]/10 text-[10px] font-serif text-[#111111]/80 leading-relaxed italic">
                &ldquo;该期刊近期大量收录医疗人工智能与大语言模型(LLM)相关的队列实证，非常适合您的课题定位。&rdquo;
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderReviewerResponse = () => {
    return (
      <div className="space-y-4">
        <div className="bg-[#6B1724]/5 border-2 border-[#6B1724] p-4 text-xs">
          <span className="font-mono font-black text-[#6B1724] uppercase tracking-wider block mb-1">【审稿意见答复点对点系统 (Author Response Module)】</span>
          <p className="font-serif leading-relaxed text-[#111111]">
            采用国际最高标准的 Point-by-point 格式重构，语气谦逊，立论严密。
          </p>
        </div>

        <div className="border-2 border-[#111111] bg-white p-4.5">
          <div className="border-b border-[#111111]/10 pb-2.5 mb-3">
            <span className="text-xs font-mono font-black text-black">Reviewer #1, Comment 1 (关于对照缺失与混杂校正的疑问)</span>
          </div>

          <div className="space-y-3.5 text-xs font-serif leading-relaxed">
            <div className="bg-red-50/50 border-l-4 border-red-500 p-3 text-neutral-700 italic">
              <strong>Concern:</strong> &ldquo;The retrospective design of this trial could lead to potential selection bias. How did the authors control for baseline differences in patient comorbidities?&rdquo;
            </div>

            <div className="bg-emerald-50/30 border-l-4 border-emerald-500 p-3 text-black">
              <strong>Response (极客气学术回应):</strong> 
              <p className="text-neutral-800 italic mt-1.5 pl-2 leading-relaxed">
                &ldquo;We thank the reviewer for this constructive suggestion. To address this issue, we performed a rigorous <strong className="text-black">Propensity Score Matching (PSM)</strong> analysis to balance baseline covariates between groups. All comorbidities (Age, Gender, Baseline eGFR, cardiovascular risk factors) have been balanced perfectly, and the standardized mean differences (SMD) are now less than 10%.&rdquo;
              </p>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 p-3">
              <span className="text-[10px] font-mono font-black text-black uppercase tracking-widest block mb-1">【修改于论文清样中的具体位置 / Action in Manuscript】</span>
              <p className="font-mono text-[10.5px] leading-relaxed text-neutral-600">
                &ldquo;We have updated Section 2.4 (Statistical Analysis) on page 6 of the revised manuscript and inserted a Love Plot (Supplemental Figure S2) illustrating the balance of comorbidities pre- and post-PSM.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProofreading = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-black text-[#111111] uppercase tracking-wider">&sect; 润色与学术提升对账 (Proofreading Markup)</span>
          <div className="flex gap-1">
            <button
              onClick={() => setRevisionViewMode("diff")}
              className={`px-3 py-1 text-[10px] font-mono font-bold rounded-none cursor-pointer border ${
                revisionViewMode === "diff" ? "bg-[#6B1724] text-white border-black" : "bg-white text-black border-neutral-300"
              }`}
            >
              对比模式
            </button>
            <button
              onClick={() => setRevisionViewMode("pristine")}
              className={`px-3 py-1 text-[10px] font-mono font-bold rounded-none cursor-pointer border ${
                revisionViewMode === "pristine" ? "bg-[#6B1724] text-white border-black" : "bg-white text-black border-neutral-300"
              }`}
            >
              纯净精润版
            </button>
          </div>
        </div>

        <div className="border-2 border-[#111111] bg-white p-5 leading-relaxed font-serif text-xs text-[#111111]">
          {revisionViewMode === "diff" ? (
            <div className="space-y-3.5">
              <p>
                In this clinical trial, we <span className="bg-red-100 text-red-800 line-through px-1 rounded">tested</span><span className="bg-emerald-100 text-emerald-800 font-bold px-1 rounded">evaluated</span> the efficacy of Drug A. 
                The results <span className="bg-red-100 text-red-800 line-through px-1 rounded">showed that the medicine works fine</span><span className="bg-emerald-100 text-emerald-800 font-bold px-1 rounded">demonstrated a statistically significant reduction in disease biomarkers</span> (p &lt; 0.01).
              </p>
              <p className="border-t border-neutral-100 pt-3">
                We also <span className="bg-red-100 text-red-800 line-through px-1 rounded">checked out how bad the side effects were</span><span className="bg-emerald-100 text-emerald-800 font-bold px-1 rounded">assessed the incidence of treatment-emergent adverse events</span>. 
                No severe adverse events <span className="bg-red-100 text-red-800 line-through px-1 rounded">happened to the patients</span><span className="bg-emerald-100 text-emerald-800 font-bold px-1 rounded">were documented during the 12-week followup period</span>.
              </p>

              <div className="bg-[#FAF9F6] border border-[#111111]/15 p-3 text-[10px] font-mono text-neutral-500 mt-4">
                <span className="font-bold text-[#6B1724] uppercase tracking-wider block mb-1">【润色逻辑报告】</span>
                &bull; <strong>学术词汇替换</strong>: 将口语化的 test, checked out, works fine 等替换为符合 SCI 期刊发文标准的 evaluated, assessed, demonstrated reduction 等高阶医学主干词汇。
              </div>
            </div>
          ) : (
            <div className="space-y-3.5 italic">
              <p>
                In this clinical trial, we evaluated the efficacy of Drug A. The results demonstrated a statistically significant reduction in disease biomarkers (p &lt; 0.01).
              </p>
              <p>
                We also assessed the incidence of treatment-emergent adverse events. No severe adverse events were documented during the 12-week followup period.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSampleSize = () => {
    return (
      <div className="space-y-4">
        <div className="bg-[#6B1724]/5 border-2 border-[#6B1724] p-4">
          <span className="text-xs font-mono font-black text-[#6B1724] uppercase tracking-wider block mb-1">【高灵敏度样本量推导计算书 (Sample Size Calculation Sheet)】</span>
          <p className="text-[11px] font-serif text-[#111111]/80 leading-relaxed">
            基于设定的检验水准和期望效应，计算得出的临床研究样本量，包含15%失访调整，提供标准的投稿说明文字。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-[#111111] bg-white p-4 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-black uppercase text-black tracking-widest block mb-3">参数配置与计算公式</span>
              
              <div className="space-y-2 text-[11px] font-mono text-neutral-500 mb-4">
                <div className="flex justify-between">
                  <span>期望组 1 有效率 (p1):</span>
                  <span className="text-black font-bold">85%</span>
                </div>
                <div className="flex justify-between">
                  <span>对照组 2 有效率 (p2):</span>
                  <span className="text-black font-bold">60%</span>
                </div>
                <div className="flex justify-between">
                  <span>一类错误 (α, 双侧):</span>
                  <span className="text-black font-bold">0.05 (z_alpha = 1.96)</span>
                </div>
                <div className="flex justify-between">
                  <span>检验把握度 (1-β):</span>
                  <span className="text-black font-bold">80% (z_beta = 0.84)</span>
                </div>
              </div>

              <div className="bg-[#FAF9F6] border border-[#111111]/15 p-2.5 font-mono text-[9px] leading-relaxed text-neutral-600">
                <span className="font-bold text-black block mb-1">计算公式 (双侧双独立样本率对比):</span>
                n = [z_a/2 * sqrt(2*p_bar*(1-p_bar)) + z_b * sqrt(p1*(1-p1) + p2*(1-p2))]^2 / (p1 - p2)^2
              </div>
            </div>

            <div className="border-t border-[#111111]/10 pt-3 mt-4 flex items-center justify-between text-xs font-mono">
              <span>匹配设计:</span>
              <span className="font-black text-[#6B1724]">RCT 随机双盲对照</span>
            </div>
          </div>

          <div className="border-2 border-[#111111] bg-white p-4 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-black uppercase text-[#6B1724] tracking-widest block mb-4">算力引擎推导输出</span>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#FAF9F6] border border-[#111111]/10 p-3 text-center">
                  <span className="text-[8px] font-mono text-neutral-400 uppercase">单组原始样本量</span>
                  <span className="block text-lg font-sans font-black text-black mt-1">112</span>
                  <span className="text-[9px] font-mono text-neutral-500 mt-0.5 block">per group</span>
                </div>
                <div className="bg-[#6B1724]/5 border-2 border-[#6B1724] p-3 text-center">
                  <span className="text-[8px] font-mono text-[#6B1724] uppercase font-bold">失访调整最终总样本量</span>
                  <span className="block text-lg font-sans font-black text-[#6B1724] mt-1">264</span>
                  <span className="text-[9px] font-mono text-[#6B1724]/80 mt-0.5 block">15% attrition adjusted</span>
                </div>
              </div>
            </div>

            <p className="text-[10.5px] font-serif text-neutral-500 leading-relaxed italic border-t border-neutral-100 pt-3">
              &ldquo;Based on a two-sided alpha of 0.05 and 80% power, a sample size of 112 patients per group was calculated. Accounting for a 15% attrition rate, the final enrollment of 264 patients was planned.&rdquo;
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderDescriptiveStatistics = () => {
    return (
      <div className="space-y-4">
        <span className="text-xs font-mono font-black text-[#111111] uppercase tracking-wider block">&sect; 规范化基线特征描述三线表 (Table 1 Benchmark)</span>
        
        <div className="border-t-2 border-b-2 border-black bg-white p-3 overflow-x-auto">
          <table className="w-full text-left text-xs font-serif min-w-[450px]">
            <thead>
              <tr className="border-b border-[#111111]/30">
                <th className="py-2.5 font-bold text-black w-2/5">基线指标 (Demographics)</th>
                <th className="py-2.5 font-bold text-black text-center">治疗组 A (N = 120)</th>
                <th className="py-2.5 font-bold text-black text-center">对照组 B (N = 120)</th>
                <th className="py-2.5 font-bold text-black text-center">检验统计量</th>
                <th className="py-2.5 font-bold text-black text-center">P值 (p-value)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-sans text-[11px] text-neutral-800">
              <tr>
                <td className="py-2 font-serif text-black font-bold">年龄 (Age, years), mean &plusmn; SD</td>
                <td className="py-2 text-center font-mono">61.5 &plusmn; 8.4</td>
                <td className="py-2 text-center font-mono">60.9 &plusmn; 9.1</td>
                <td className="py-2 text-center font-mono">t = 0.52</td>
                <td className="py-2 text-center font-mono">0.603</td>
              </tr>
              <tr>
                <td className="py-2 font-serif text-black font-bold">性别 (Gender, Male), n (%)</td>
                <td className="py-2 text-center font-mono">72 (60.0%)</td>
                <td className="py-2 text-center font-mono">68 (56.7%)</td>
                <td className="py-2 text-center font-mono">&chi;&sup2; = 0.27</td>
                <td className="py-2 text-center font-mono">0.601</td>
              </tr>
              <tr>
                <td className="py-2 font-serif text-black font-bold">基线血压 (SBP, mmHg), mean &plusmn; SD</td>
                <td className="py-2 text-center font-mono">143.2 &plusmn; 12.8</td>
                <td className="py-2 text-center font-mono">142.9 &plusmn; 13.1</td>
                <td className="py-2 text-center font-mono">t = 0.18</td>
                <td className="py-2 text-center font-mono">0.857</td>
              </tr>
              <tr className="bg-neutral-50">
                <td className="py-2 font-serif text-black font-bold">糖化血红蛋白 (HbA1c, %), median [IQR]</td>
                <td className="py-2 text-center font-mono">7.8 [7.2, 8.5]</td>
                <td className="py-2 text-center font-mono">7.9 [7.1, 8.6]</td>
                <td className="py-2 text-center font-mono">Z = -0.12</td>
                <td className="py-2 text-center font-mono">0.904</td>
              </tr>
              <tr>
                <td className="py-2 font-serif text-black font-bold">总胆固醇 (TC, mmol/L), mean &plusmn; SD</td>
                <td className="py-2 text-center font-mono">4.82 &plusmn; 0.94</td>
                <td className="py-2 text-center font-mono">4.79 &plusmn; 0.98</td>
                <td className="py-2 text-center font-mono">t = 0.24</td>
                <td className="py-2 text-center font-mono">0.810</td>
              </tr>
            </tbody>
          </table>
          <div className="border-t-2 border-black mt-2 pt-2 text-[9px] font-mono text-neutral-400">
            Note: SD, Standard Deviation; IQR, Interquartile Range; SBP, Systolic Blood Pressure. P-values derived from Student's t-test or Chi-square test.
          </div>
        </div>
      </div>
    );
  };

  const renderUnivariateComparison = () => {
    return (
      <div className="space-y-4">
        <div className="bg-[#6B1724]/5 border-2 border-[#6B1724] p-4 text-xs">
          <span className="font-mono font-black text-[#6B1724] uppercase tracking-wider block mb-1">【假设检验方法学自适应推荐树】</span>
          根据您输入的分组自变量和结局变量性质，系统已经校验了前置假设（正态性检验 Shapiro-Wilk P &gt; 0.05, 方差齐性检验 Levene P &gt; 0.05），为您推荐以下最严谨的假设检验路径：
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="border-2 border-[#111111] bg-white p-4">
            <span className="text-[10px] font-black uppercase text-black block mb-3">自适应假设验证</span>
            <div className="space-y-2.5">
              <div className="flex justify-between border-b border-neutral-100 pb-1">
                <span className="text-neutral-500">变量分布形态 (Distribution):</span>
                <span className="text-emerald-600 font-bold">符合正态分布</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-1">
                <span className="text-neutral-500">组间方差齐性 (Homogeneity):</span>
                <span className="text-emerald-600 font-bold">方差齐 (P = 0.72)</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-1">
                <span className="text-neutral-500">自变量分组数 (Groups):</span>
                <span className="text-black font-bold">2 组独立样本</span>
              </div>
              <div className="flex justify-between border-[#6B1724] border-b-2 pb-1 bg-[#6B1724]/5 px-1">
                <span className="text-[#6B1724] font-bold">推荐检验方法:</span>
                <span className="text-[#6B1724] font-black">独立样本 t 检验 (Student's t-test)</span>
              </div>
            </div>
          </div>

          <div className="border-2 border-[#111111] bg-white p-4 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-[#6B1724] block mb-2">备用非参数检验指引</span>
              <p className="font-serif leading-relaxed text-neutral-500 text-[11px]">
                若您的后续大样本数据不符合正态分布（Shapiro-Wilk P &lt; 0.05），系统将自动降级为 <strong className="text-black">Mann-Whitney U 秩和检验</strong>，以确保 P 值的绝对稳健与不发生一类错误假阳性。
              </p>
            </div>
            
            <div className="text-[10px] text-[#6B1724] bg-[#6B1724]/5 border border-[#6B1724]/20 p-2 text-center mt-3 font-bold">
              符合国际引文发表 ICH-GCP E9 统计学指南
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBasicRegression = () => {
    return (
      <div className="space-y-4">
        <span className="text-xs font-mono font-black text-[#111111] uppercase tracking-wider block">&sect; 多因素回归模型系数及多重共线性对账单</span>
        
        <div className="border-2 border-[#111111] bg-white p-4 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono min-w-[500px]">
            <thead>
              <tr className="border-b-2 border-black text-black">
                <th className="py-2 font-bold">自变量 (Variables)</th>
                <th className="py-2 font-bold text-center">回归系数 (Beta / OR)</th>
                <th className="py-2 font-bold text-center">标准误 (SE)</th>
                <th className="py-2 font-bold text-center">95% 置信区间 (95% CI)</th>
                <th className="py-2 font-bold text-center">t / Wald 值</th>
                <th className="py-2 font-bold text-center text-[#6B1724]">P 值 (p-value)</th>
                <th className="py-2 font-bold text-center">共线性 (VIF)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-[11px] text-neutral-800">
              <tr>
                <td className="py-2 font-bold text-black">拦截项 (Intercept)</td>
                <td className="py-2 text-center">12.45</td>
                <td className="py-2 text-center">1.82</td>
                <td className="py-2 text-center">[8.88, 16.02]</td>
                <td className="py-2 text-center">6.84</td>
                <td className="py-2 text-center text-neutral-400">&lt;0.001</td>
                <td className="py-2 text-center">--</td>
              </tr>
              <tr>
                <td className="py-2 font-bold text-black">干预组 (Treatment Group)</td>
                <td className="py-2 text-center text-[#6B1724] font-bold">0.38 (OR = 1.46)</td>
                <td className="py-2 text-center">0.11</td>
                <td className="py-2 text-center">[1.18, 1.81]</td>
                <td className="py-2 text-center">3.45</td>
                <td className="py-2 text-center text-[#6B1724] font-black">0.002</td>
                <td className="py-2 text-center font-bold text-emerald-600">1.12</td>
              </tr>
              <tr>
                <td className="py-2 font-bold text-black">年龄 (Age, per year)</td>
                <td className="py-2 text-center">0.04 (OR = 1.04)</td>
                <td className="py-2 text-center">0.01</td>
                <td className="py-2 text-center">[1.02, 1.06]</td>
                <td className="py-2 text-center">4.00</td>
                <td className="py-2 text-center text-neutral-400">&lt;0.001</td>
                <td className="py-2 text-center font-bold text-emerald-600">1.25</td>
              </tr>
              <tr>
                <td className="py-2 font-bold text-black">基线收缩压 (Baseline SBP)</td>
                <td className="py-2 text-center">0.02 (OR = 1.02)</td>
                <td className="py-2 text-center">0.02</td>
                <td className="py-2 text-center">[0.98, 1.06]</td>
                <td className="py-2 text-center">1.00</td>
                <td className="py-2 text-center">0.317</td>
                <td className="py-2 text-center font-bold text-yellow-600">2.14</td>
              </tr>
            </tbody>
          </table>
          <div className="border-t border-[#111111]/15 mt-3.5 pt-2 text-[9px] font-serif text-neutral-400">
            Hosmer-Lemeshow 拟合优度检验 P = 0.842 &bull; 模型解释力 Adj. R-squared = 0.385 &bull; 判定多重共线性风险低 (VIF &lt; 5)
          </div>
        </div>
      </div>
    );
  };

  const renderConfoundingBias = () => {
    return (
      <div className="space-y-4">
        <div className="border-2 border-[#111111] bg-white p-4">
          <span className="text-[10px] font-mono font-black uppercase text-[#111111] tracking-widest block mb-3.5">倾向评分匹配前后的协变量平衡对仗图 (Covariate Love Plot)</span>
          
          <div className="space-y-3.5 pt-1">
            {/* SMD comparison bars */}
            {[
              { name: "患者年龄 (Patient Age)", before: 0.28, after: 0.04 },
              { name: "基线收缩压 (Baseline SBP)", before: 0.35, after: 0.02 },
              { name: "糖化血红蛋白 (HbA1c)", before: 0.42, after: 0.06 },
              { name: "合并症指数 (CCI Index)", before: 0.21, after: 0.03 }
            ].map(cov => (
              <div key={cov.name} className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="font-bold text-[#111111]">{cov.name}</span>
                  <span className="text-neutral-500">
                    SMD: 匹配前 <span className="text-red-700 font-bold">{(cov.before * 100).toFixed(0)}%</span> &rarr; 匹配后 <span className="text-emerald-700 font-bold">{(cov.after * 100).toFixed(0)}%</span>
                  </span>
                </div>
                <div className="w-full bg-[#FAF9F6] border border-[#111111]/15 h-3 relative">
                  {/* Before matching line */}
                  <div className="absolute top-0 bottom-0 bg-red-400 opacity-60" style={{ left: "0px", width: `${cov.before * 100}%` }}></div>
                  {/* After matching line */}
                  <div className="absolute top-0 bottom-0 bg-emerald-600" style={{ left: "0px", width: `${cov.after * 100}%` }}></div>
                  
                  {/* 10% benchmark threshold */}
                  <div className="absolute top-0 bottom-0 border-l border-dashed border-red-800" style={{ left: "10%" }} title="10% Balance Threshold"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-[8px] font-mono text-neutral-400 mt-2.5">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 bg-red-400 inline-block"></span>
              <span>匹配前标准化均数差</span>
              <span className="h-2.5 w-2.5 bg-emerald-600 inline-block"></span>
              <span>匹配后标准化均数差</span>
            </div>
            <span>虚线：国际公认均衡基准线 (10%)</span>
          </div>
        </div>
      </div>
    );
  };

  const renderBiasRobustness = () => {
    return (
      <div className="space-y-4">
        <div className="bg-[#6B1724]/5 border-2 border-[#6B1724] p-4 text-xs font-serif leading-relaxed text-[#111111]">
          <span className="font-mono font-black text-[#6B1724] uppercase tracking-wider block mb-1">【E-value 未测混杂因素敏感性分析】</span>
          即使存在潜在的未测混杂（如家族病史、隐秘暴露等），本研究结论依旧极度稳健。下面为您推导抵消本研究关联所需的未测混杂的最小关联强度：
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-[#111111] bg-white p-4 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">本研究观测到的效应大小 (OR / HR)</span>
            <span className="text-2xl font-sans font-black text-black block mt-2">1.82</span>
            <span className="text-[10px] font-mono text-neutral-500 mt-0.5 block">95% CI: 1.34 - 2.45</span>
          </div>

          <div className="border-2 border-[#111111] bg-[#111111] text-white p-4 text-center">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">推算得出的 E-value 临界值</span>
            <span className="text-2xl font-sans font-black text-[#F4C430] block mt-2">2.94</span>
            <span className="text-[10px] font-mono text-neutral-300 mt-0.5 block">E-value (for CI bound): 2.01</span>
          </div>
        </div>

        <div className="bg-[#FAF9F6] border border-neutral-200 p-3.5 text-xs font-serif leading-relaxed text-neutral-600">
          <strong>学术解释 (Interpretation):</strong> 只有当某个未被纳入模型的未知混杂因子，其同时与药物暴露和主要终点事件之间的相对危险度 (RR) 都达到 <strong className="text-[#6B1724]">2.94 倍</strong> 以上时，才可能推翻本研究所观测到的显著性关联。在临床实践中，几乎不存在如此强烈的独立未知混杂，证明本项结论具备极佳的偏倚抵抗稳健性。
        </div>
      </div>
    );
  };

  const renderPrognosticTools = () => {
    // Nomogram calculator calculation logic
    const scoreAge = Math.round((nomogramPoints.age - 40) * 1.5);
    const scoreTumor = Math.round(nomogramPoints.tumorSize * 15);
    const scoreLymph = nomogramPoints.lymphNodes * 35;
    const scoreComorb = nomogramPoints.comorbidities * 20;
    
    const totalPoints = scoreAge + scoreTumor + scoreLymph + scoreComorb;
    
    // Estimate 3-year survival rate based on points
    const survivalRate = Math.max(5, Math.min(99, Math.round(100 - (totalPoints / 220) * 85)));

    return (
      <div className="space-y-4">
        <div className="bg-[#6B1724]/5 border border-[#6B1724]/20 p-3 text-xs leading-relaxed">
          <span className="font-mono font-black text-[#6B1724] uppercase tracking-wider block mb-1">【TRIPOD 标准 - 个体化临床生存预测 Nomogram 交互沙盒】</span>
          拖动下方患者临床指标参数，大模型将自动计算评分（Points），并输出高灵敏度 3 年及 5 年无病生存概率（DFS）。
        </div>

        <div className="border-2 border-[#111111] bg-white p-5">
          <div className="space-y-4 text-xs font-mono">
            {/* Nomogram parameters sliders */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>1. 患者诊断年龄 (Age): <strong className="text-black">{nomogramPoints.age} 岁</strong></span>
                <span className="text-neutral-400">计分: +{scoreAge} P</span>
              </div>
              <input
                type="range"
                min="40"
                max="85"
                value={nomogramPoints.age}
                onChange={(e) => setNomogramPoints(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                className="w-full accent-[#6B1724] cursor-ew-resize"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>2. 肿瘤病灶最大径 (Tumor Size): <strong className="text-black">{nomogramPoints.tumorSize} cm</strong></span>
                <span className="text-neutral-400">计分: +{scoreTumor} P</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="8.0"
                step="0.1"
                value={nomogramPoints.tumorSize}
                onChange={(e) => setNomogramPoints(prev => ({ ...prev, tumorSize: parseFloat(e.target.value) }))}
                className="w-full accent-[#6B1724] cursor-ew-resize"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 block">3. 淋巴结转移状态 (Lymph Node)</span>
                <select
                  value={nomogramPoints.lymphNodes}
                  onChange={(e) => setNomogramPoints(prev => ({ ...prev, lymphNodes: parseInt(e.target.value) }))}
                  className="w-full text-xs bg-[#FAF9F6] border border-neutral-300 p-2 font-mono rounded-none"
                >
                  <option value={0}>阴性 (Negative, +0 P)</option>
                  <option value={1}>阳性 (Positive, +35 P)</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 block">4. 基线合并症分级 (Comorbidities)</span>
                <select
                  value={nomogramPoints.comorbidities}
                  onChange={(e) => setNomogramPoints(prev => ({ ...prev, comorbidities: parseInt(e.target.value) }))}
                  className="w-full text-xs bg-[#FAF9F6] border border-neutral-300 p-2 font-mono rounded-none"
                >
                  <option value={0}>无并发症 (None, +0 P)</option>
                  <option value={1}>轻度/中度 (Mild, +20 P)</option>
                  <option value={2}>重度合并症 (Severe, +40 P)</option>
                </select>
              </div>
            </div>

            {/* Combined outputs */}
            <div className="bg-[#FAF9F6] border border-[#111111]/15 p-4 mt-4.5">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2 mb-3">
                <span className="text-[10px] font-black uppercase text-[#111111]">Nomogram 计算得分总和</span>
                <span className="text-sm font-bold text-[#6B1724]">{totalPoints} POINTS</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-neutral-400 uppercase">预测 3 年无病生存率 (3-Yr Survival Probability)</span>
                  <span className="block text-xl font-sans font-black text-emerald-600 mt-1">{survivalRate}%</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-neutral-400 uppercase">预测 5 年无病生存率</span>
                  <span className="block text-xl font-sans font-black text-[#6B1724] mt-1">{Math.max(2, survivalRate - 15)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMetaAnalysis = () => {
    return (
      <div className="space-y-4">
        <div className="bg-[#6B1724]/5 border border-[#6B1724]/20 p-3 text-xs leading-relaxed">
          <span className="font-mono font-black text-[#6B1724] uppercase tracking-wider block mb-1">【Cochrane 偏倚风险及 Meta 合并森林图 (Forest Plot)】</span>
          提取了5项大型历史文献数据进行随机效应模型合并，图表展现了效应量集中趋势及异质性指标。
        </div>

        <div className="border-2 border-[#111111] bg-white p-4">
          <span className="text-[10px] font-mono font-black uppercase text-[#111111] tracking-widest block mb-4">Meta-Analysis Random-Effects Forest Plot</span>

          <div className="space-y-3 font-mono text-[10px]">
            {/* Header */}
            <div className="grid grid-cols-12 font-bold border-b border-neutral-300 pb-1 text-black">
              <span className="col-span-4">文献名称 (Study)</span>
              <span className="col-span-2 text-center">实验组 (n/N)</span>
              <span className="col-span-2 text-center">对照组 (n/N)</span>
              <span className="col-span-4 text-right">比值比 Odds Ratio (95% CI)</span>
            </div>

            {/* Studies */}
            {[
              { name: "Smith et al. (2021)", exp: "15/100", ctr: "28/100", or: "0.45 [0.22, 0.92]", x: 50, w: 10 },
              { name: "Wang et al. (2023)", exp: "22/150", ctr: "40/150", or: "0.47 [0.26, 0.85]", x: 52, w: 12 },
              { name: "Miller et al. (2024)", exp: "8/50", ctr: "12/50", or: "0.60 [0.21, 1.68]", x: 65, w: 8 },
              { name: "Garcia et al. (2025)", exp: "35/200", ctr: "68/200", or: "0.41 [0.26, 0.65]", x: 46, w: 15 }
            ].map(study => (
              <div key={study.name} className="grid grid-cols-12 items-center">
                <span className="col-span-4 font-serif text-black">{study.name}</span>
                <span className="col-span-2 text-center text-neutral-500">{study.exp}</span>
                <span className="col-span-2 text-center text-neutral-500">{study.ctr}</span>
                
                {/* Visual line representation */}
                <div className="col-span-4 flex items-center justify-between pl-4">
                  <div className="w-24 bg-neutral-100 h-2 relative rounded-none border border-neutral-200">
                    {/* Confidence interval line */}
                    <div className="absolute top-1/2 -translate-y-1/2 bg-neutral-400 h-0.5" style={{ left: `${study.x - study.w}%`, width: `${study.w * 2}%` }}></div>
                    {/* OR square */}
                    <div className="absolute top-1/2 -translate-y-1/2 bg-[#111111] h-1.5 w-1.5" style={{ left: `${study.x}%` }}></div>
                  </div>
                  <span className="font-bold text-black">{study.or.split(" ")[0]}</span>
                </div>
              </div>
            ))}

            {/* Combined diamond */}
            <div className="grid grid-cols-12 items-center border-t border-neutral-300 pt-2 font-bold text-black">
              <span className="col-span-4 font-sans text-[#6B1724]">合并效应 (Pooled Effect)</span>
              <span className="col-span-2 text-center">80/500</span>
              <span className="col-span-2 text-center">148/500</span>
              
              <div className="col-span-4 flex items-center justify-between pl-4">
                <div className="w-24 bg-neutral-100 h-2 relative rounded-none">
                  {/* Vertical reference line at OR = 1.0 */}
                  <div className="absolute top-0 bottom-0 border-l border-dashed border-red-800" style={{ left: "70%" }}></div>
                  {/* Diamond */}
                  <div className="absolute top-1/2 -translate-y-1/2 bg-[#6B1724] h-2 w-3 rotate-45" style={{ left: "49%" }}></div>
                </div>
                <span className="font-black text-[#6B1724]">0.46 [0.32, 0.65]</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-[8.5px] font-mono text-neutral-400 mt-4 border-t border-neutral-100 pt-2">
            <span>异质性度量: I&sup2; = 18.4% (Q=3.68, df=3, P=0.298) &bull; 无显著异质性</span>
            <span className="text-[#6B1724] font-bold">推荐选用固定效应模型</span>
          </div>
        </div>
      </div>
    );
  };

  const renderHealthEconomics = () => {
    return (
      <div className="space-y-4">
        <div className="bg-[#6B1724]/5 border-2 border-[#6B1724] p-4 text-xs font-serif leading-relaxed text-[#111111]">
          <span className="font-mono font-black text-[#6B1724] uppercase tracking-wider block mb-1">【成本效用增量 ICER 推导决策模型】</span>
          基于新治疗方案 A 的额外支出及质量调整生命年（QALY）增量，计算所得成本效果比是否低于国家人均 GDP 支付阈值：
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="border-2 border-[#111111] bg-white p-3.5 text-center">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">增量成本 (Delta Cost)</span>
            <span className="text-lg font-sans font-black text-black block mt-1.5">&yen; 18,500</span>
            <span className="text-[9px] text-neutral-500 mt-1 block">自付与医保额外净增</span>
          </div>

          <div className="border-2 border-[#111111] bg-white p-3.5 text-center">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">增量效用 (Delta QALYs)</span>
            <span className="text-lg font-sans font-black text-emerald-600 block mt-1.5">0.42 QALY</span>
            <span className="text-[9px] text-neutral-500 mt-1 block">平均延长 5.04 满分月度</span>
          </div>

          <div className="border-2 border-[#111111] bg-[#111111] text-white p-3.5 text-center">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">ICER 值 (增量成本效果比)</span>
            <span className="text-lg font-sans font-black text-[#F4C430] block mt-1.5">&yen; 44,047 / QALY</span>
            <span className="text-[9px] text-emerald-400 mt-1 block font-bold">低于 1 倍人均 GDP 阈值</span>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-3 text-[11px] font-serif leading-relaxed text-neutral-700">
          <strong>经济效益学结论:</strong> 增量成本效果比（ICER）为 &yen;44,047/QALY，远低于我国推荐的 1 倍人均 GDP（约 &yen;85,000）支付意愿阈值，代表新药 A 具有极佳的药物经济学性价比，属于极力推荐报销或进入目录的高价值方案。
        </div>
      </div>
    );
  };


  // ----------------------------------------------------
  // 3. MASTER ROUTER & FALLBACK PREVIEW
  // ----------------------------------------------------
  const renderSelectedPreview = () => {
    switch (skillId) {
      case "topic-planning":
        return renderTopicPlanning();
      case "literature-review":
        return renderLiteratureReview();
      case "research-design":
        return renderResearchDesign();
      case "ethics-crf":
        return renderEthicsCrf();
      case "data-cleaning":
        return renderDataCleaning();
      case "feature-engineering":
        return renderFeatureEngineering();
      case "stat-code-plot":
        return renderStatCodePlot();
      case "references-formatting":
        return renderReferencesFormatting();
      case "journal-matching":
        return renderJournalMatching();
      case "reviewer-response":
        return renderReviewerResponse();
      case "proofreading":
        return renderProofreading();
      case "sample-size-estimation":
        return renderSampleSize();
      case "descriptive-statistics":
        return renderDescriptiveStatistics();
      case "univariate-comparison":
        return renderUnivariateComparison();
      case "basic-regression":
        return renderBasicRegression();
      case "survival-exclusive":
        return renderStatCodePlot(); // Re-use high fidelity KM/ROC curve elements
      case "confounding-bias":
        return renderConfoundingBias();
      case "interaction-testing":
        return renderUnivariateComparison();
      case "bias-robustness":
        return renderBiasRobustness();
      case "diagnostic-tools":
        return renderStatCodePlot(); // Re-use Diagnostic metrics ROC curve
      case "prognostic-tools":
        return renderPrognosticTools();
      case "meta-analysis-suite":
        return renderMetaAnalysis();
      case "population-standardization":
        return renderDescriptiveStatistics();
      case "health-economics":
        return renderHealthEconomics();
      default:
        // Unified Fallback for other custom tools or generic workflows
        return (
          <div className="space-y-4">
            <div className="bg-[#FAF9F6] border-2 border-[#111111] p-5">
              <div className="flex items-center gap-2 mb-3 text-black">
                <ClipboardCheck className="h-5 w-5" />
                <span className="text-xs font-mono font-black uppercase tracking-wider">学术处理就绪评估</span>
              </div>
              <p className="text-xs font-serif leading-relaxed text-[#111111] mb-4">
                掌术学术大模型分析引擎已对输入的文本信息提取关键变量。系统匹配了最适用的数据表达，并将高阶 Markdown 渲染在左侧输出面板。
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-mono">
                <div className="p-3 bg-white border border-neutral-200">
                  <span className="text-[9px] text-neutral-400 uppercase tracking-widest block mb-1">输入源质检 (Source Quality)</span>
                  <span className="font-bold text-emerald-600">PASS (完全符合伦理)</span>
                </div>
                <div className="p-3 bg-white border border-neutral-200">
                  <span className="text-[9px] text-neutral-400 uppercase tracking-widest block mb-1">学术可信度 (Confidence Metric)</span>
                  <span className="font-bold text-[#6B1724]">97.8% (极其可信)</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-2 border-[#111111] bg-white text-xs font-serif text-neutral-500 italic">
              &ldquo;建议使用左侧的「复制」或「打包进 AGENT」功能，将推演大纲导入 AI 聊天助手，以生成完整的长篇文献段落或 R 分析脚本。&rdquo;
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col justify-between overflow-y-auto pb-4">
      <div className="flex-1 animate-fadeIn">
        {renderSelectedPreview()}
      </div>
    </div>
  );
};
