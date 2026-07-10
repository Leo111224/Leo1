# 掌术 AI (Zhangshu AI) 科研工作站 - 产品需求文档 (PRD)

## 1. 引言 (Introduction)

### 1.1 产品定位与愿景 (Product Positioning & Vision)
**掌术 AI (Zhangshu AI)** 是一款面向高水平学术出版（如 SCI、Nature、Science、Cell 等顶级期刊）全生命周期设计的**专业级科研辅佐工作站**。
传统的通用大语言模型（如 ChatGPT、Claude）在学术写作中常出现“口语化、空洞、过度乐观或事实幻觉”等局限，且无法生成符合顶级学术期刊发表标准的统计图表。本工作站旨在通过**系统级学术指令（Instruction）调校**与**深度科研制图引擎（Z-ML Engine）**的结合，重塑学术语言、规范科研制图，直接产出合规、高信度的学术文本与高精度矢量统计图表，为研究人员提供端到端的严谨学术智能辅助。

---

## 2. 核心功能架构与模块设计 (Core Feature Architecture)

产品围绕科研周期的四大阶段（引言、方法、结果、讨论）构建，以“左侧特化模块检索”与“右侧沙盒交互模拟”形成高效率的工作流。

```
                       +---------------------------------------------+
                       |       掌术 AI 科研工作站 门户与期刊规范       |
                       +---------------------------------------------+
                                              |
       +--------------------------------------+--------------------------------------+
       |                                                                             |
+------v----------------------------------+                             +------------v----------------------------+
| 阶段式工具导航 (Academic Catalog Rail)  |                             | 深度制图引擎 (Z-ML Vector Plot Engine)  |
+-----------------------------------------+                             +-----------------------------------------+
| - 分类过滤: 引言/方法/结果/讨论         |                             | - 无边框极简风格 (Borderless Blend)     |
| - 智能检索: 支持高级算子/特化名词搜索    |                             | - 自动重拟合机制 (Continuous Auto-Loop) |
| - 模块范围: REF-01 至 REF-08 完整覆盖   |                             | - 131 Genes FDR高精度差异火山图         |
+-----------------------------------------+                             +-----------------------------------------+
```

### 2.1 阶段式特化工具目录 (Academic Catalog Rail)
提供学术阶段的细分算子检索，协助研究者精细化调配底层多智能体：
*   **全向阶段过滤 (Stage Filtering):**
    *   **引言阶段 (Introduction):**
        *   `[REF-01] 选题规划工具 (Planning)`：结合当前学术热点与学科方向，深度探讨研究选题、创新点及可行性，快速制定科研大纲。
        *   `[REF-02] 文献综述工具 (Literature)`：对导入的多篇核心文献摘要、结论进行对比分析，自动生成脉络清晰的国内外研究现状。
    *   **方法阶段 (Methods):**
        *   `[REF-03] 研究设计工具 (Design)`：定制标准的临床或工程科研设计方案，覆盖对照设置、样本量计算方案、入排标准。
        *   `[REF-04] 伦理 CRF 工具 (Ethics)`：一键草拟符合赫尔辛基宣言的伦理审查申报材料要点，以及定制专用的病例报告表。
        *   `[REF-05] 数据清洗工具 (Cleaning)`：智能检测表格或文本数据集的异常值、缺失值以及格式不一致，提供一键式清洗脚本。
        *   `[REF-06] 特征工程工具 (Features)`：根据预测模型或统计建模需要，提供衍生特征设计、降维（PCA/t-SNE）方案及标准化。
    *   **结果阶段 (Results):**
        *   `[REF-07] 统计代码绘图工具 (Plotting)`：自动生成符合 CNS 期刊英文标准的 Python (Seaborn) 或 R (ggplot2) 严谨统计学绘图代码。
    *   **讨论阶段 (Discussion):**
        *   `[REF-08] 论文全稿撰写工具 (Writing)`：辅助撰写科技论文各章节（Introduction / Methods / Results / Discussion），深度润色英文语法。
*   **智能检索 (Interactive Search):**
    *   支持模糊和关键词精确匹配（如“Cox 比例风险模型”、“约登指数”、“Meta 分析”等）。
    *   支持清除检索与实时空状态反馈。

### 2.2 交互式沙盒模拟器 (Interactive Sandbox Simulator)
右侧区域根据左侧当前选中的 `REF` 特化工具，提供高度仿真的科研参数输入与调校沙盒：
*   **系统参数公示 (Metadata Banner):**
    *   展示当前组件的内部登记号 `[REGISTRY]`（如 `ZS-001`）。
    *   展示合规性评级 `[COMPLIANCE]`（如 `COPE / GRADE-A`）。
    *   提供本地命令行 `[CLI COMMAND]` 调用语法（如 `zhangshu topic-planning`），支持高级科研人员在终端或自动化脚本中一键调度。
*   **输入模式校验 (Input Scheme):**
    *   展示和编辑学术假设、关键词或意向领域。
*   **方法约束调参 (Methodological Constraints):**
    *   提供学术热点匹配策略选择、学科领域定位。
*   **激活引擎 (Action trigger):**
    *   提供独立的操作动作，触发沙盒内参数的编译与学术数据同步。

---

## 3. Z-ML 深度科研制图引擎 (Scientific Vector Plot Engine)

作为系统最具表现力的核心引擎，Z-ML 引擎负责在前端实时演绎科学数据点位从原始拟合（Fitting）到合规发表（Completed）的全流程。

### 3.1 极简无边框设计 (Borderless Aesthetic Paradigm)
*   **视觉融入 (Visual Blend):** 响应高水准极简审美规范，移除传统制图卡片的硬质边角线（边框线），使状态监控区（Live Status Monitor）与 SVG 绘图画布（SVG Plot Canvas）无缝融合进纸张背景。
*   **去拟声装饰 (Anti-Margin Clutter):** 放弃任何多余的 telemetry 指标线条或硬生生的网格线，通过柔和的微米级辅线（微弱网格虚线）衬托科学图表。

### 3.2 自动重拟合循环 (Continuous Auto-Loop Pipeline)
Z-ML 绘图引擎以自主循环的动画流程，动态展现一个多智能体拟合散点图的全生命周期，单次完整循环时间约为 6~8 秒，结束后停留 4 秒自动重启：
1.  **数据解析 (Parse Data):**
    *   控制台日志输出：`[Z-ML Engine] Initializing high-throughput differential analysis...` 并载入 RNA-Seq 矩阵。
    *   覆盖高保真透明遮罩，动态展示“正在渲染高保真学术坐标系”。
2.  **引擎初始化 (Initialize Weights):**
    *   加载 131 个基因点位，对齐多变量显著性分布矩阵。
3.  **梯度优化拟合 (Optimizing Loop):**
    *   控制台输出 Benjamini-Hochberg FDR 分析。
    *   **动态激光扫描线 (Laser Scan Line):** 一条深红色的水平基准线由下至上匀速扫过图表，模拟边界扫描。
    *   **点群聚拢与舒展 (Scatter Kinetic Animation):** 131 个散点伴随拟合进度（Epoch 1~50）从坐标中心底部（0, 0）呈喷泉状向两侧边缘优雅扩散，展现数据清洗与极值聚集的动力学过程。
    *   **拟合指标衰减 (Loss Convergence):** 状态栏中的 `Optimization Loss` 在 50 个 Epoch 内从 `1.3500` 呈指数级迅速衰减收敛至目标阈值 `0.0092`。
4.  **精细化调整 (Fine Tune) 与合规发表 (Completed):**
    *   显示差异显著性判定界限（Fold Change 阈值线：$|x| > 1.0$；$p$-value 显著性虚线：$-\log_{10}p > 1.3$）。
    *   **无重叠标签排布引擎 (Non-Overlapping Labeling):** 锁定高表达量的关键节点，绘制高对比度连接引线与无遮挡的基因名标签（如 `IL6`, `TNF`, `STAT3`, `IFNG`, `CXCL8`, `JAK2`, `MYC` 属于 Crimson 红色上调组；`IL10`, `TGFB1`, `FOS`, `JUN` 属于 Steel 蓝色下调组）。
    *   **科学出版级脚注 (Academic Footnotes):** 展示高置信度学术边界指标，标注 `MAX ENRICHMENT: IL6 (+2.80 Log₂FC, p = 3.98e-6)`。

---

## 4. 非功能性需求与设计规范 (Non-Functional Requirements)

### 4.1 视觉标准与版面美学 (Aesthetic & Typography Rules)
*   **纸张触感主题 (Warm Ivory Theme):** 整体背景采用温润、防疲劳的乳白偏暖色调 (`#FAF9F6`)，并覆盖半透明纸质纹理（Texture Paper Overlay），提供印刷读物的实体触感。
*   **严谨字体配对 (Academic Typography):** 
    *   正文与说明文字统一使用 **Inter** 现代无衬线字体。
    *   系统大标题与出版社信息（ZHANGSHU JOURNAL）使用富有人文沉淀的经典衬线体。
    *   系统控制台、注册号、编译命令使用 **JetBrains Mono** 极客等宽字体，保持数值与状态日志对齐。
*   **出版配色规范 (Editorial Palette):** 主题强调色为严谨经典的学术勃艮第红（Burgundy / `#6B1724`），辅以低饱和度的钢铁灰 (`#4A5568`)、高对比度琥珀金和温和翠绿，杜绝任何喧宾夺主的极光、霓虹渐变。

### 4.2 响应式设计与交互性能 (Performance & Responsiveness)
*   **单屏联动精准比例 (Desktop-First Layout Grid):** 优化宽屏桌面的阅读体验，左侧控制台与右侧可视化比例严格锁定（5:7），确保大屏下所有图表的引线与文字毫无错位。
*   **零累积重绘 (Animation Garbage Collection):** 在定时器重拟合循环、页面切换中，必须严格在 React 卸载阶段（`useEffect` 销毁函数中）对所有 `setTimeout`、`setInterval` 进行全量 GC 回收，防止多次触发产生的内存泄漏与乱序渲染。

---

## 5. 合规性与安全背书 (Compliance & Certifications)

*   **数据脱敏 (Data Confidentiality):** 系统级安全加密，所有输入数据只在客户端进行分析和本地渲染，不进行跨域泄露。
*   **发表规范支持 (COPE Ethics Standard):** 生成图表和重写算法严格遵守国际出版伦理委员会 (COPE) 的伦理指南，确保无剽窃幻觉风险，符合顶刊审稿人合规质询标准。

---

## 6. 平台智能化 AI 功能与全流程工效链 (AI Features & Academic Workflows)

为打破传统通用 LLM 缺乏医学与数理逻辑、常产生学术幻觉的困局，本工作站规划并建立了**高细分学术算子库**与**场景导向多级复合工作流**，实现了端到端的智能化学术辅佐。

### 6.1 模块级 AI 特化学术算子库 (Module-Level Academic AI Operators)
系统针对学术论文的不同结构阶段，内置了 30 余种涵盖医学统计、因果推断、真实世界研究（RWS）与循证医学的深度 AI 算子：

#### 6.1.1 引言阶段算子 (Introduction Phase Operators)
*   **选题规划工具 (Topic Planning / [REGISTRY: ZS-001]):** 适配“前沿突破 (CNS导向)”、“临床转化”或“工程落地”等多维度学术导向，融合多模态学科方向提炼科研假设，生成科学大纲。
*   **文献综述工具 (Literature Review / [REGISTRY: ZS-002]):** 支持叙述、系统、范围及快速综述；覆盖协议定义、多数据库检索、去重筛选、PRISMA、证据提取、偏倚风险评价、主题综合、争议与空白识别、引用核验及 Review Package 导出。AI 辅助筛选必须保留真实操作者与审计记录，不得冒充独立审阅者。

#### 6.1.2 方法阶段算子 (Methods Phase Operators)
*   **研究设计工具 (Research Design):** 自适应输出包含随机对照试验 (RCT)、非随机干预、队列研究、病例对照、横断面、诊断准确性、预后因素、预测模型和真实世界研究的方法路径，生成纳排标准、结局/Estimand、访视表、CRF、伦理数据治理清单、偏倚控制及样本量估算（Sample Size Estimation）方案。
*   **伦理 CRF 工具 (Ethics & Case Report Form):** 一键起草符合赫尔辛基宣言的伦理审查要点、受试者知情同意要点 (ICF) 以及定制专用的病例报告表 (CRF) 字段规范。
*   **数据清洗工具 (Data Cleaning):** 智能定位缺失特征、逻辑异常指标，并生成高容错的 Pandas/R 预处理、插补（Imputation/多重插补）代码。
*   **特征工程工具 (Feature Engineering):** 针对 Logistic/Cox 或复杂机器学习模型，设计高阶交互项与特征降维（PCA/t-SNE）策略。
*   **高级因果推断算子集 (Causal Inference Suite):**
    *   *PSM 倾向评分匹配*：最邻近匹配、卡钳值校验，生成协变量平衡检测（SMD/Love Plot）逻辑。
    *   *IPTW 逆概率加权*：稳定加权估计、权重截断（Weight Truncation）设计。
    *   *HDPS 高维倾向评分*：针对大型医保数据库（RWS）诊断/处方高维特征的自动筛选与平衡。
    *   *工具变量回归*：针对孟德尔随机化（MR）或临床偏好变量，消除未测量混杂。
    *   *DID 双重差分与 RDD 断点回归*：卫生政策效应评估与局部断点因果效应拟合。

#### 6.1.3 结果阶段算子 (Results Phase Operators)
*   **诊断试验专用工具 (Diagnostic Tools Box):** 
    *   *指标计算*：自动输出 Sensitivity、Specificity、PPV、NPV、似然比 (LR) 及诊断优势比 (DOR) 的 95% 置信区间。
    *   *ROC & AUC 效能分析* 与 *最佳截断值/约登指数 (Youden Index) 定位*。
    *   *诊断校准检验 (Calibration Test)* 与 *多变量联合诊断模型 (Combined Diagnostic)*。
*   **预后预测模型评价 (Prognostic Model Evaluation):**
    *   *区分度与校准度*：计算 Harrell's C-index、Brier 评分，并绘制 Time-dependent ROC。
    *   *Nomogram 列线图绘制*：基于 R 语言 `rms` 包绘制发表级概率对齐列线图。
    *   *模型校验*：包含基于 1000 次重采样的内部验证（Bootstrap）与符合 TRIPOD 声明的外部迁移验证。
*   **Meta 分析全套算子 (Meta-Analysis Suite):** 
    *   *异质性检验*：计算 Cochran's Q 检验、$I^2$ 与 $\tau^2$ 统计量并提供固定/随机效应合并建议。
    *   *合并与亚组分析*：生成发表级森林图（Forest Plot）代码，按设计、地区等多维度追溯异质性源头。
    *   *发表偏倚与敏感性检验*：执行 Egger's/Begg's 检验，提供漏斗图及“剪补法 (Trim-and-Fill)”偏倚修正。
    *   *试验序贯分析 (TSA)*：累积信息量估算，随机误差界值控制。
*   **人群校正与流行病学工具 (Population & Survey Tools):**
    *   *复杂抽样权重分析*：融合 NHANES、CHARLS 等 RWS 数据库的多阶段分层（Strata）、初级抽样单位（PSU）与权重。
    *   *年龄标化率校正 (Age Standardization)*：采用直接/间接标化法消除人群结构偏倚。

#### 6.1.4 讨论阶段算子 (Discussion Phase Operators)
*   **论文全稿撰写 (Manuscript Writing):** 严格基于 IMRAD (Introduction, Methods, Results, Discussion) 学术框架进行语态、衔接和科学贡献度重构，提供段落级英文抛光。
*   **参考文献校对与重格式化 (References Formatting):** 支持 BibTeX/EndNote 直接导入，自适应 NEJM、Lancet、JAMA、Nature、APA 等 100 余种期刊引文规范。
*   **偏倚与稳健性论证 (Bias & Robustness):** 计算定量推翻研究所需的未测量混杂临界值（E-value），设计阴性对照暴露（Negative Exposure）或阴性对照结局（Negative Outcomes）进行稳健性论证。

---

### 6.2 场景导向智能复合工作流 (Academic Workflow Chains)
系统将单一的算子组合并，构建了面向实际科研场景的三大“开箱即用”全生命周期复合流（AI Workflow Chains）：

```
+----------------------------------------------------------------------------------------------------------+
| 1. 开题与研究设计全链条 (Research Planning Chain)                                                         |
|    [选题规划 ZS-001]  -->  [文献综述 ZS-002]  -->  [研究设计 ZS-003：Protocol / 样本量 / 伦理 / CRF]    |
+----------------------------------------------------------------------------------------------------------+
| 2. 数据清洗与统计绘图流 (Data & Analytics Pipeline)                                                       |
|    [异常清洗 ZS-005]  -->  [特征衍生 ZS-006]  -->  [顶级期刊绘图 ZS-007 (Nature/NEJM 风格)]              |
+----------------------------------------------------------------------------------------------------------+
| 3. 论文写作与期刊投稿链 (Writing & Publishing Chain)                                                      |
|    [IMRAD草稿起草 ZS-008]  -->  [文献规范核校 ZS-009]  -->  [期刊智能推荐 ZS-010]  -->  [终审出版级精校]      |
+----------------------------------------------------------------------------------------------------------+
```

1.  **开题与研究设计全链条 (Research Planning Chain):**
    *   **核心痛点**：解决青年学者“选题困难、缺乏方法学论证与前期设计”的困境。
    *   **工作流路径**：从研究领域或初步假设出发，首步进行选题优化及热点匹配 -> 继而提取国内外同类研究技术路径生成综述大纲 -> 设计符合 RCT 或 Cohort 规范的具体干预与样本量计算方案 -> 最终生成受试者保护同意书框架与 CRF 主字段清单。
2.  **数据清洗与统计绘图流 (Data & Analytics Pipeline):**
    *   **核心痛点**：消除脏数据，设计合理自变量组合，并高效转化为符合编辑部要求的高分辨率统计插图。
    *   **工作流路径**：录入含有缺失或偏倚的患者基线特征 -> 运行多重插补或极值清理 -> 提取衍生临床特征与高维度交互因子 -> 自动输出 Nature、NEJM 或 Lancet 风格的高维可视化（KM曲线、火山图、森林图等）可执行 Python/R 脚本。
3.  **论文写作与期刊投稿链 (Writing & Publishing Flow):**
    *   **核心痛点**：破除国人学者英文写作逻辑中式化、期刊排版繁琐及因格式退稿的顽疾。
    *   **工作流路径**：将核心试验指标和结果骨架录入 -> 生成地道科学语境的 IMRAD 章节内容 -> 一键转换引文及 BibTeX 格式 -> 根据文本主题语义智能检索最适配的 SCI 投稿目标（SCIE、Ei 等库） -> 执行标点、语气、敏感词和全半角的极端度排版微调。
