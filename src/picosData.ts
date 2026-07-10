export interface MethodItem {
  name: string;
  status: "✅" | "⚠️" | "❌";
  output: string;
}

export interface StudyDesignData {
  id: string;
  name: string;
  p: string;
  i: string;
  c: string;
  o: string;
  s: string;
  sampleSize: string;
  sampleSizeStatus: "❌" | "✅" | "⚠️";
  keyPoints: string[];
  methods: MethodItem[];
}

export const PICOS_DESIGNS: StudyDesignData[] = [
  {
    id: "rct",
    name: "随机对照试验 (RCT)",
    p: "确诊患病人群",
    i: "新型临床干预",
    c: "标准治疗/安慰剂/空白",
    o: "疗效、安全性",
    s: "随机对照试验 (Randomized Controlled Trial)",
    sampleSize: "正态近似法（组间比较型）",
    sampleSizeStatus: "❌",
    keyPoints: ["随机序列生成 (Random Sequence)", "分配隐藏 (Allocation Concealment)", "盲法设计 (Blinding / Double Blind)", "基线可比性控制", "大样本量要求", "临床试验注册 (Registry)", "ITT 意向性治疗分析", "亚组分析预设 (Subgroup Prespecification)"],
    methods: [
      { name: "基线特征描述统计 (Baseline Stats)", status: "✅", output: "均值±标准差、中位数[IQR]、频数[百分比]、样本量" },
      { name: "连续变量组间比较 (Continuous Comparison)", status: "✅", output: "t 值、自由度(df)、P 值、均值差[95%CI]" },
      { name: "分类变量组间比较 (Categorical Comparison)", status: "✅", output: "χ²值、自由度(df)、P 值、OR[95%CI]" },
      { name: "线性回归 (Linear Regression)", status: "✅", output: "回归系数 β[95%CI]、标准误、R²、调整 R²、AIC/BIC" },
      { name: "Logistic 回归 (Logistic Regression)", status: "✅", output: "OR[95%CI]、回归系数 β、标准误、C 统计量、AIC/BIC" },
      { name: "Cox 比例风险回归 (Cox Regression)", status: "✅", output: "HR[95%CI]、回归系数 β、标准误、Wald χ²、AIC/BIC" },
      { name: "混合效应模型 (Mixed-Effects Model)", status: "❌", output: "固定效应系数 β[95%CI]、随机效应方差、ICC、AIC/BIC" },
      { name: "广义估计方程 (GEE)", status: "❌", output: "回归系数 β[95%CI]、工作相关矩阵、QIC 值、标准误" },
      { name: "多重检验校正 (Multiple Correction)", status: "✅", output: "校正后 P 值、校正方法、显著结果数量" },
      { name: "交互作用检验 (Interaction Test)", status: "✅", output: "交互项系数 β[95%CI]、交互作用 P 值、分层效应量" }
    ]
  },
  {
    id: "quasi-rct",
    name: "非随机对照试验 (quasi-RCT)",
    p: "确诊患病人群",
    i: "非随机分配干预",
    c: "标准治疗/阳性对照/同期对照组",
    o: "安全性、疗效",
    s: "非随机对照试验 (Non-Randomized Trial)",
    sampleSize: "正态近似法（组间比较型）、设计效应修正法",
    sampleSizeStatus: "❌",
    keyPoints: ["非随机分配干预", "基线可比性控制", "混杂因素控制设计", "大样本量要求"],
    methods: [
      { name: "基线特征描述统计", status: "✅", output: "均值±标准差、中位数[IQR]、频数[百分比]、样本量" },
      { name: "连续变量组间比较", status: "✅", output: "t 值、F 值、P 值、均值差[95%CI]" },
      { name: "分类变量组间比较", status: "✅", output: "χ²值、P 值、频数[百分比]" },
      { name: "配对样本前后比较", status: "✅", output: "配对 t 值、中位数差、P 值、前后差值分布" },
      { name: "线性回归", status: "✅", output: "回归系数 β[95%CI]、R²、调整 R²、AIC/BIC" },
      { name: "Logistic 回归", status: "✅", output: "OR[95%CI]、回归系数 β、C 统计量、AIC/BIC" },
      { name: "Cox 比例风险回归", status: "✅", output: "HR[95%CI]、回归系数 β、标准误、AIC/BIC" },
      { name: "交互作用检验", status: "✅", output: "交互项系数 β[95%CI]、交互 P 值、分层效应量" },
      { name: "倾向评分匹配 (PSM Matching)", status: "❌", output: "匹配前后标准化均值差(SMD)、匹配后样本量、卡钳值、匹配比例、匹配后效应量" },
      { name: "逆概率加权 (IPTW Weighting)", status: "❌", output: "权重分布、加权后效应量[95%CI]、加权后基线 SMD" },
      { name: "工具变量回归 (IV Regression)", status: "❌", output: "第一阶段 F 值、弱工具变量检验、Hausman 检验、校正后效应量" },
      { name: "双重差分模型 (DID)", status: "❌", output: "交互项系数、平行趋势检验、组间效应 P 值" },
      { name: "断点回归 (RDD)", status: "❌", output: "带宽选择、断点处效应量[95%CI]、拟合优度" },
      { name: "敏感性分析 (Sensitivity / E-value)", status: "❌", output: "E-value、未观测混杂最小强度、不同方法对比、稳健性" },
      { name: "多重检验校正", status: "✅", output: "校正后 P 值、校正方法" }
    ]
  },
  {
    id: "prospective-cohort",
    name: "前瞻性队列研究 (Prospective Cohort)",
    p: "健康/高危人群",
    i: "环境/行为/遗传暴露",
    c: "非暴露/低暴露组",
    o: "生存/远期结局",
    s: "前瞻性队列研究 (Prospective Cohort)",
    sampleSize: "正态近似法、事件数法（生存分析型）",
    sampleSizeStatus: "❌",
    keyPoints: ["基线可比性控制", "失访率控制 (Attrition Rate)", "长期随访方案", "暴露测量标准化"],
    methods: [
      { name: "疾病频率描述统计 (Disease Frequency)", status: "⚠️", output: "累计发病率[95%CI]、发病率密度、总人年数" },
      { name: "生存曲线组间比较 (Survival Curve)", status: "⚠️", output: "中位生存时间[95%CI]、生存率、log-rank 检验 P 值、KM 曲线" },
      { name: "分层关联分析 (Stratified Analysis)", status: "⚠️", output: "各层 OR 值、Mantel-Haenszel OR 值[95%CI]、异质性检验" },
      { name: "Cox 比例风险回归", status: "✅", output: "HR[95%CI]、回归系数 β、标准误、AIC/BIC" },
      { name: "Poisson 回归", status: "❌", output: "发病率比(IRR)[95%CI]、离散参数、回归系数" },
      { name: "剂量反应趋势检验 (Dose-Response)", status: "❌", output: "各暴露水平 OR/HR 值、趋势检验 P 值" },
      { name: "交互作用检验", status: "✅", output: "交互项系数 β[95%CI]、交互 P 值" }
    ]
  },
  {
    id: "retrospective-cohort",
    name: "回顾性队列研究 (Retrospective Cohort)",
    p: "历史就诊人群",
    i: "既往历史暴露/治疗",
    c: "非暴露/低暴露组",
    o: "生存/远期结局",
    s: "回顾性队列研究 (Retrospective Cohort)",
    sampleSize: "正态近似法、事件数法（生存分析型）",
    sampleSizeStatus: "❌",
    keyPoints: ["混杂因素控制设计", "回忆偏倚控制 (Recall Bias)", "历史数据完整性", "数据来源明确"],
    methods: [
      { name: "疾病频率描述统计", status: "⚠️", output: "累计发病率、患病率、总人年数" },
      { name: "生存曲线组间比较", status: "⚠️", output: "中位生存时间、生存率、生存检验 P 值、KM 曲线" },
      { name: "分层关联分析", status: "✅", output: "各层 OR/HR 值、分层效应量、异质性检验" },
      { name: "Logistic 回归", status: "✅", output: "OR[95%CI]、回归系数 β、C 统计量、AIC/BIC" },
      { name: "Cox 比例风险回归", status: "✅", output: "HR[95%CI]、回归系数 β、标准误、AIC/BIC" },
      { name: "Poisson 回归", status: "❌", output: "IRR[95%CI]、离散参数、回归系数" },
      { name: "剂量反应趋势检验", status: "❌", output: "各暴露水平效应量、趋势检验 P 值" },
      { name: "交互作用检验", status: "✅", output: "交互项系数、交互 P 值" },
      { name: "倾向评分匹配 (PSM)", status: "❌", output: "匹配前后 SMD、匹配后样本量、卡钳值、匹配后效应量" },
      { name: "逆概率加权 (IPTW)", status: "❌", output: "权重分布、加权后效应量、加权后基线均衡性" },
      { name: "多重插补法 (Multiple Imputation)", status: "⚠️", output: "缺失比例(%)、插补次数、Rubin 规则合并结果" },
      { name: "敏感性分析 (Sensitivity / E-value)", status: "❌", output: "E-value、方法对比、稳健性判断" },
      { name: "竞争风险模型 (Competing Risks)", status: "❌", output: "特定原因 HR[95%CI]、累积发生率曲线、竞争风险占比" }
    ]
  },
  {
    id: "case-control",
    name: "病例对照研究 (Case-Control Study)",
    p: "病例组 + 对照组人群",
    i: "回顾性危险因素",
    c: "非暴露/低暴露组",
    o: "患病状态/关联强度",
    s: "病例对照研究 (Case-Control Study)",
    sampleSize: "对数 OR 近似法、匹配设计调整法",
    sampleSizeStatus: "❌",
    keyPoints: ["回忆偏倚控制 (Recall Bias)", "病例与对照精确匹配", "样本代表性与选择偏倚控制"],
    methods: [
      { name: "暴露频率描述统计 (Exposure Frequency)", status: "❌", output: "病例组暴露频数[百分比]、对照组暴露频数" },
      { name: "分类变量组间比较 (χ²)", status: "✅", output: "χ²值、P 值、粗 OR[95%CI]" },
      { name: "分层关联分析", status: "⚠️", output: "各层 OR 值、Mantel-Haenszel OR 值、层间异质性" },
      { name: "Logistic 回归 (条件/非条件)", status: "✅", output: "调整后 OR[95%CI]、混杂协变量效应、C 统计量" },
      { name: "剂量反应趋势检验", status: "❌", output: "各暴露水平 OR 值、趋势检验 P 值" },
      { name: "交互作用检验", status: "✅", output: "交互项系数 β[95%CI]、分层 OR" }
    ]
  },
  {
    id: "nested-case-control",
    name: "巢式病例对照研究 (Nested Case-Control)",
    p: "队列衍生人群、病例+对照组",
    i: "队列基线暴露",
    c: "队列内匹配对照、非暴露组",
    o: "患病状态/关联强度",
    s: "巢式病例对照研究 (Nested Case-Control)",
    sampleSize: "对数 OR 近似法、匹配调整、母队列约束估算法",
    sampleSizeStatus: "❌",
    keyPoints: ["对照按风险集抽样 (Risk-Set Sampling)", "病例与对照匹配设计", "队列内嵌套设计", "省生物标本"],
    methods: [
      { name: "暴露频率描述统计", status: "❌", output: "病例/对照组暴露分布、频数百分比" },
      { name: "分类变量组间比较", status: "✅", output: "χ²值、P 值、粗 OR 值" },
      { name: "分层关联分析", status: "✅", output: "各层 OR 值、分层效应、异质性检验" },
      { name: "Logistic 回归 (条件 Logistic)", status: "✅", output: "条件 Logistic 系数、OR[95%CI]、调整后效应" },
      { name: "Cox 比例风险回归", status: "✅", output: "HR[95%CI]、回归系数 β、生存关联" },
      { name: "交互作用检验", status: "✅", output: "交互项系数、交互 P" },
      { name: "逆概率加权 (IPTW)", status: "❌", output: "抽样权重分布、加权后效应、均衡性指标" }
    ]
  },
  {
    id: "cross-sectional",
    name: "横断面研究 (Cross-Sectional Study)",
    p: "全人群（特定时点）",
    i: "人群特征/基础指标",
    c: "组内不同暴露水平",
    o: "患病率/人群分布",
    s: "横断面研究 (Cross-Sectional Study)",
    sampleSize: "总体率估计法（精度导向型）",
    sampleSizeStatus: "❌",
    keyPoints: ["代表性抽样 (Representative Sampling)", "高应答率要求 (Response Rate)"],
    methods: [
      { name: "疾病频率描述统计 (患病率)", status: "⚠️", output: "粗患病率[95%CI]、标化患病率[95%CI]" },
      { name: "连续变量组间比较", status: "✅", output: "t 值、F 值、P 值、均值差" },
      { name: "分类变量组间比较", status: "✅", output: "χ²值、P 值、各组百分比" },
      { name: "线性回归", status: "✅", output: "回归系数 β[95%CI]、R²、调整 R²" },
      { name: "Logistic 回归", status: "✅", output: "OR[95%CI]、回归系数 β、C 统计量" },
      { name: "复杂抽样权重分析 (Weights)", status: "❌", output: "抽样权重分布、加权后效应、设计效应(Deff)、标化率" },
      { name: "年龄标化校正 (Standardization)", status: "❌", output: "标化率[95%CI]、标准人群结构、各年龄组率" }
    ]
  },
  {
    id: "diagnostic",
    name: "诊断性研究 (Diagnostic Study)",
    p: "疑似患病人群",
    i: "诊断检测手段",
    c: "金标准对照 (Reference Gold Standard)",
    o: "诊断效能指标",
    s: "诊断性研究 (Diagnostic Study)",
    sampleSize: "总体率估计法（精度导向型）",
    sampleSizeStatus: "❌",
    keyPoints: ["盲法设计 (Blinding)", "疾病谱覆盖要求", "阳性例数最低要求", "金标准独立应用"],
    methods: [
      { name: "诊断试验四格表统计", status: "✅", output: "TP/FP/TN/FN 计数、总样本量" },
      { name: "诊断准确性核心指标计算", status: "⚠️", output: "灵敏度[95%CI]、特异度[95%CI]、PPV、NPV、LR+、LR-、DOR[95%CI]" },
      { name: "ROC 曲线与 AUC 分析", status: "✅", output: "AUC 值[95%CI]、各截断值 Se-Sp、ROC 曲线" },
      { name: "最佳截断值确定 (Youden Index)", status: "❌", output: "最佳截断值、约登指数" },
      { name: "AUC 比较检验 (DeLong Test)", status: "✅", output: "两个 AUC 差值[95%CI]、DeLong 检验 P 值" },
      { name: "诊断模型校准检验 (Calibration)", status: "⚠️", output: "Hosmer-Lemeshow 检验、校准曲线、拟合优度" },
      { name: "多变量联合诊断模型 (Combined ROC)", status: "✅", output: "入选变量、权重、联合 AUC、校准曲线" }
    ]
  },
  {
    id: "prognostic",
    name: "预后研究 (Prognostic / Survival Study)",
    p: "确诊患病人群",
    i: "预后相关因素",
    c: "非暴露/低暴露组",
    o: "生存/远期结局、预后评价",
    s: "预后研究 (Prognostic Study)",
    sampleSize: "事件数法（生存分析型）",
    sampleSizeStatus: "❌",
    keyPoints: ["长期随访方案 (Follow-up)", "随访终点明确定义", "模型内部/外部验证 (Validation)"],
    methods: [
      { name: "生存时间描述统计", status: "⚠️", output: "中位生存时间[95%CI]、1/3/5 年生存率[95%CI]" },
      { name: "生存曲线组间比较 (KM)", status: "⚠️", output: "KM 生存曲线、log-rank 检验 P 值" },
      { name: "Cox 比例风险回归 (Multivariable)", status: "✅", output: "HR[95%CI]、回归系数 β、标准误、AIC/BIC" },
      { name: "预后模型区分度评价 (C-index)", status: "⚠️", output: "C-index[95%CI]、Brier 评分、时间特异性 AUC" },
      { name: "预后模型校准度评价 (Calibration Plot)", status: "✅", output: "校准曲线、Hosmer-Lemeshow 检验、校准偏差" },
      { name: "列线图 (Nomogram) 构建", status: "✅", output: "各变量得分、总得分对应预测概率、列线图可视化" },
      { name: "模型内部验证 (Bootstrap)", status: "⚠️", output: "Bootstrap 检验、C-index/Brier 校正值" },
      { name: "模型外部验证 (External Cohort)", status: "✅", output: "验证集 C-index、校准曲线、AUC、性能差异" }
    ]
  },
  {
    id: "meta-analysis",
    name: "Meta 分析/系统评价 (Meta-Analysis)",
    p: "合并原始研究人群",
    i: "常规/新型干预、环境暴露",
    c: "沿用原始研究对照",
    o: "合并效应量",
    s: "系统评价/Meta 分析 (Systematic Review & Meta)",
    sampleSize: "试验序贯分析/逆方差法（Meta 分析型）",
    sampleSizeStatus: "❌",
    keyPoints: ["全面文献检索", "原始研究质量评价 (Risk of Bias)", "异质性处理设计", "发表偏倚检验设计"],
    methods: [
      { name: "异质性检验 (Heterogeneity Test)", status: "⚠️", output: "Cochran's Q、I² 统计量、τ² 值" },
      { name: "合并效应量计算 (Effect Size)", status: "❌", output: "合并效应量 (RR/OR/MD)[95%CI]、Z 值、固定/随机效应" },
      { name: "亚组分析 (Subgroup)", status: "⚠️", output: "亚组合并效应量[95%CI]、组间异质性" },
      { name: "Meta 回归 (Meta-Regression)", status: "❌", output: "回归系数、解释的异质性比例、残差" },
      { name: "发表偏倚检验 (Publication Bias)", status: "❌", output: "Egger/Begg 检验、漏斗图" },
      { name: "敏感性分析 (Trim-and-Fill)", status: "❌", output: "剪补法后效应、逐一剔除后合并效应、稳健性判断" }
    ]
  },
  {
    id: "case-report",
    name: "病例报告/病例系列 (Case Report/Series)",
    p: "罕见/特殊个案",
    i: "临床表现/诊疗方案",
    c: "历史对照/无",
    o: "描述性结局",
    s: "病例报告/病例系列 (Case Report / Case Series)",
    sampleSize: "不适用",
    sampleSizeStatus: "✅",
    keyPoints: ["病例完整详细记录", "病例系列最低例数规范", "无须正式对照组"],
    methods: [
      { name: "个案数据描述统计 (Case Description)", status: "❌", output: "特征汇总表、个体表现、病程变化描述" },
      { name: "配对样本前后比较 (自身的配对)", status: "✅", output: "配对前后差值、检验 P 值" }
    ]
  },
  {
    id: "rws",
    name: "真实世界研究 (Real-World Study)",
    p: "广泛真实临床人群",
    i: "既往暴露/常规干预",
    c: "标准治疗/非暴露",
    o: "疗效、安全性、生存、卫生经济学",
    s: "真实世界研究 (Real-World Study)",
    sampleSize: "双向估算法（真实世界型）",
    sampleSizeStatus: "❌",
    keyPoints: ["极复杂的未测量混杂控制", "大数据源真实可信度", "数据脱敏与隐私保护"],
    methods: [
      { name: "基线特征描述统计 (基线平衡)", status: "✅", output: "均值±标准差、中位数[IQR]、频数[百分比]、样本量" },
      { name: "连续/分类变量组间比较", status: "✅", output: "t、F、χ²、非参检验、P 值" },
      { name: "经典多因素回归 (Logistic/Cox)", status: "✅", output: "AOR/AHR[95%CI]、回归系数" },
      { name: "交互作用检验 (Interaction)", status: "✅", output: "交互项系数 β[95%CI]、相加相乘交互" },
      { name: "倾向评分匹配 (PSM)", status: "❌", output: "匹配前后 SMD、卡钳值、匹配后效应量" },
      { name: "逆概率加权 (IPTW)", status: "❌", output: "权重分布、SIPTW、加权后效应" },
      { name: "工具变量回归 (IV)", status: "❌", output: "F 值、弱工具检验、Hausman、因果断言" },
      { name: "双重差分模型 (DID)", status: "❌", output: "DID 系数、平行趋势检验、政策溢出评估" },
      { name: "断点回归 (RDD)", status: "❌", output: "带宽选择、断点因果效应" },
      { name: "高维倾向评分 (HDPS)", status: "❌", output: "高维混杂筛选、HDPS 评分、加权或匹配" },
      { name: "多重插补法 (Multiple Imputation)", status: "⚠️", output: "缺失比例、插补合并" },
      { name: "敏感性分析与 E-value 计算", status: "❌", output: "E-value 临界值、结论稳健性" },
      { name: "竞争风险模型 (Competing Risks)", status: "❌", output: "Fine-Gray 生存风险、累积发生率" },
      { name: "机器学习预测模型 (ML Classifier)", status: "✅", output: "AUC-ROC、精确率/召回率、SHAP 重要性归因" },
      { name: "卫生经济学评价 (Cost-Effectiveness)", status: "❌", output: "ICER、QALYs/DALYs、成本效果可接受曲线" },
      { name: "阴性对照分析 (Negative Controls)", status: "❌", output: "阴性对照暴露/结局效应量、系统误差校验" }
    ]
  }
];
