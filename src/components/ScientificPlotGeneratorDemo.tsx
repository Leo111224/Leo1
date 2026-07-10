import React, { useState, useEffect } from "react";
import { Cpu, RefreshCw, Layers } from "lucide-react";

interface ScientificPlotGeneratorDemoProps {
  activeComboTab: "survival" | "cytokine";
}

type StepStatus = "IDLE" | "PARSE_DATA" | "INITIALIZE" | "OPTIMIZING" | "FINE_TUNE" | "COMPLETED";

interface VolcanoDot {
  id: number;
  x: number; // log2FC between -3.5 and 3.5
  y: number; // -log10 p-value between 0 and 6.0
  gene?: string;
  labelDx?: number; // custom horizontal offset for label
  labelDy?: number; // custom vertical offset for label
}

// Fixed non-overlapping key labeled genes for perfect publication quality
const UP_LABELED_GENES: VolcanoDot[] = [
  { id: 1001, gene: "IL6", x: 2.8, y: 5.4, labelDx: 12, labelDy: -8 },
  { id: 1002, gene: "TNF", x: 1.9, y: 4.8, labelDx: -16, labelDy: -12 },
  { id: 1003, gene: "STAT3", x: 2.2, y: 3.9, labelDx: 15, labelDy: 4 },
  { id: 1004, gene: "IFNG", x: 1.5, y: 4.4, labelDx: -18, labelDy: -6 },
  { id: 1005, gene: "CXCL8", x: 3.1, y: 4.9, labelDx: 12, labelDy: -2 },
  { id: 1006, gene: "JAK2", x: 2.7, y: 3.2, labelDx: 15, labelDy: 6 },
  { id: 1007, gene: "MYC", x: 1.3, y: 3.4, labelDx: -15, labelDy: 8 }
];

const DOWN_LABELED_GENES: VolcanoDot[] = [
  { id: 2001, gene: "IL10", x: -2.7, y: 4.3, labelDx: -15, labelDy: -8 },
  { id: 2002, gene: "TGFB1", x: -1.8, y: 3.7, labelDx: -16, labelDy: 10 },
  { id: 2003, gene: "FOS", x: -2.4, y: 3.1, labelDx: -16, labelDy: -2 },
  { id: 2004, gene: "JUN", x: -1.3, y: 2.7, labelDx: 14, labelDy: -6 }
];

// Generate deterministic background dots outside the component
const BACKGROUND_DOTS: VolcanoDot[] = [];
let seed = 888;
function sRandom() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// 1. Bottom cluster: low significance, low fold change (neutral genes)
for (let i = 0; i < 55; i++) {
  const x = (sRandom() - 0.5) * 1.7;
  const y = sRandom() * 1.1;
  BACKGROUND_DOTS.push({ id: i, x, y });
}

// 2. Mid-dispersed non-significant background
for (let i = 55; i < 110; i++) {
  const x = (sRandom() - 0.5) * 3.6;
  const y = 0.5 + sRandom() * 2.1;
  BACKGROUND_DOTS.push({ id: i, x, y });
}

// 3. Significant background dots without labels (upregulated arm)
for (let i = 110; i < 135; i++) {
  const x = 1.15 + sRandom() * 1.5;
  const y = 1.45 + sRandom() * 2.5;
  BACKGROUND_DOTS.push({ id: i, x, y });
}

// 4. Significant background dots without labels (downregulated arm)
for (let i = 135; i < 155; i++) {
  const x = -1.15 - sRandom() * 1.4;
  const y = 1.45 + sRandom() * 2.3;
  BACKGROUND_DOTS.push({ id: i, x, y });
}

// Merge all dots
const VOLCANO_DOTS: VolcanoDot[] = [
  ...BACKGROUND_DOTS,
  ...UP_LABELED_GENES,
  ...DOWN_LABELED_GENES
];

export function ScientificPlotGeneratorDemo({ activeComboTab }: ScientificPlotGeneratorDemoProps) {
  const [status, setStatus] = useState<StepStatus>("PARSE_DATA");
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(1.35);
  const [logs, setLogs] = useState<string[]>([]);
  const [triggerCount, setTriggerCount] = useState(0);

  // Restart animation when tab changes or manual button is clicked, with continuous auto-looping
  useEffect(() => {
    setStatus("PARSE_DATA");
    setEpoch(0);
    setLoss(1.35);

    setLogs([
      `[Z-ML Engine] Initializing high-throughput differential analysis...`,
      `[Matrix] Loading transcriptomic RNA-Seq expression matrix (131 candidates)...`,
    ]);

    let currentEpoch = 0;
    let timer1: NodeJS.Timeout | null = null;
    let timer2: NodeJS.Timeout | null = null;
    let timer3: NodeJS.Timeout | null = null;
    let loopTimer: NodeJS.Timeout | null = null;
    let interval: NodeJS.Timeout | null = null;

    const runEngine = () => {
      // Step 1: Parse data
      timer1 = setTimeout(() => {
        setLogs((prev) => [
          ...prev,
          `[Matrix] Formatted 131 differential candidate coordinates.`,
          `[Model] Aligning multi-variate significance distribution matrix...`,
        ]);
        setStatus("INITIALIZE");

        // Step 2: Initialize weights / axes
        timer2 = setTimeout(() => {
          setLogs((prev) => [
            ...prev,
            `[Optimizer] Fast-FDR (Benjamini-Hochberg) analyzer loaded.`,
            `[Training] Starting volcano scatter boundary scanning...`,
          ]);
          setStatus("OPTIMIZING");

          // Step 3: Optimize loop (Epochs 1-50)
          const maxEpoch = 50;
          interval = setInterval(() => {
            currentEpoch += 2;
            if (currentEpoch <= maxEpoch) {
              setEpoch(currentEpoch);
              
              // Simulate Loss decreasing
              const currentLoss = 1.35 * Math.pow(0.91, currentEpoch) + 0.024;
              setLoss(currentLoss);

              if (currentEpoch % 10 === 0) {
                setLogs((prev) => [
                  ...prev.slice(-3), // keep only last 3 lines
                  `[Training] Iteration ${currentEpoch}/${maxEpoch} | Optimization Loss: ${currentLoss.toFixed(4)}`,
                ]);
              }
            } else {
              if (interval) clearInterval(interval);
              setStatus("FINE_TUNE");
              
              setLogs((prev) => [
                ...prev,
                `[Training] Boundary coordinates converged.`,
                `[Renderer] Flagging significant upregulated/downregulated targets...`,
              ]);

              // Step 4: Fine-tune & complete
              timer3 = setTimeout(() => {
                setStatus("COMPLETED");
                setEpoch(maxEpoch);
                setLoss(0.0092);
                
                setLogs((prev) => [
                  ...prev,
                  `[Renderer] 11 Upregulated (crimson) and 4 Downregulated (grey) labels aligned.`,
                  `[Status] Vector-grade gene expression volcano plot compiled successfully!`,
                ]);

                // Automatically trigger next animation loop cycle after 4 seconds of displaying complete state
                loopTimer = setTimeout(() => {
                  setTriggerCount((prev) => prev + 1);
                }, 4000);

              }, 800);
            }
          }, 55);

        }, 600);

      }, 600);
    };

    runEngine();

    return () => {
      if (timer1) clearTimeout(timer1);
      if (timer2) clearTimeout(timer2);
      if (timer3) clearTimeout(timer3);
      if (loopTimer) clearTimeout(loopTimer);
      if (interval) clearInterval(interval);
    };
  }, [activeComboTab, triggerCount]);

  const progressPercent = Math.min(100, (epoch / 50) * 100);

  // Optimization scaling factor
  const optimizeFactor = status === "PARSE_DATA" || status === "INITIALIZE" 
    ? 0 
    : status === "OPTIMIZING" 
    ? (epoch / 50) 
    : 1;

  const handleRebuild = () => {
    setTriggerCount((prev) => prev + 1);
  };

  return (
    <div id="ml-plot-demo-container" className="w-full flex-1 flex flex-col justify-between space-y-4">
      
      {/* ML Training Live Status Monitor - Clean, borderless layout */}
      <div className="bg-[#FAF9F6]/70 p-2.5 rounded-none font-mono text-[9px] relative overflow-hidden flex flex-col justify-between min-h-[112px]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-[#111111]/10 pb-1 mb-1.5 select-none">
          <div className="flex items-center gap-1.5">
            <Cpu className={`h-3 w-3 text-[#6B1724] ${status === "OPTIMIZING" ? "animate-spin" : ""}`} />
            <span className="font-black text-[#111111]">SCIENTIFIC PLOT GENERATION PIPELINE (Z-ML)</span>
          </div>
          <button
            onClick={handleRebuild}
            className="flex items-center gap-1 text-[8px] px-1.5 py-0.5 bg-[#6B1724] text-white font-bold hover:bg-[#6B1724]/90 cursor-pointer"
          >
            <RefreshCw className="h-2 w-2" />
            <span>RE-RUN FIT / 一键拟合</span>
          </button>
        </div>

        {/* Training Parameters Dashboard */}
        <div className="grid grid-cols-4 gap-1 border-b border-[#111111]/10 pb-1.5 mb-1.5 text-center bg-[#FAF9F6]/40 p-1">
          <div>
            <div className="text-[7.5px] text-[#111111]/50 uppercase font-black">Input Features</div>
            <div className="text-[10px] font-bold text-[#111111]">131 Genes</div>
          </div>
          <div>
            <div className="text-[7.5px] text-[#111111]/50 uppercase font-black">Analysis Method</div>
            <div className="text-[10px] font-bold text-[#6B1724]">FDR q &lt; 0.01</div>
          </div>
          <div>
            <div className="text-[7.5px] text-[#111111]/50 uppercase font-black">Significance</div>
            <div className="text-[10px] font-bold text-emerald-800">FC &gt; 2.0 (±1.0)</div>
          </div>
          <div>
            <div className="text-[7.5px] text-[#111111]/50 uppercase font-black">Engine Status</div>
            <div className={`text-[9px] font-black uppercase ${
              status === "COMPLETED" ? "text-emerald-700 animate-pulse" : "text-[#6B1724]"
            }`}>
              {status}
            </div>
          </div>
        </div>

        {/* Live log feed */}
        <div className="flex-1 space-y-0.5 h-[34px] overflow-y-auto font-mono scrollbar-none opacity-80 leading-normal select-text">
          {logs.slice(-3).map((log, idx) => (
            <div key={idx} className="truncate text-[8.5px] text-[#111111]/80">
              <span className="text-[#6B1724]/70 mr-1">&gt;</span> {log}
            </div>
          ))}
        </div>

        {/* Model Optimizing Progress Bar */}
        <div className="h-1 bg-neutral-200 mt-1.5 relative rounded-none overflow-hidden">
          <div 
            className="h-full bg-[#6B1724] transition-all duration-75"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* SVG Plot Visualizer Canvas - Complete borderless blend */}
      <div className="bg-transparent py-2.5 flex-1 flex flex-col justify-center min-h-[235px] relative">
        
        {/* Parsing state loading screen overlay */}
        {(status === "PARSE_DATA" || status === "INITIALIZE") && (
          <div className="absolute inset-0 bg-[#FAF9F6]/95 z-10 flex flex-col items-center justify-center space-y-2">
            <div className="relative flex items-center justify-center">
              <RefreshCw className="h-6 w-6 text-[#6B1724] animate-spin" />
              <div className="absolute text-[8px] font-mono font-bold text-[#6B1724] uppercase">Z-ML</div>
            </div>
            <div className="text-center">
              <div className="text-[9px] font-mono font-black text-[#6B1724] tracking-widest uppercase">
                MAPPING VECTOR VIEWPORT
              </div>
              <div className="text-[8px] font-mono text-[#111111]/50 mt-0.5 animate-pulse">
                Running high-fidelity academic coordinate projection...
              </div>
            </div>
          </div>
        )}

        <div className="w-full">
          <svg viewBox="0 0 380 170" className="w-full h-auto text-[#111111] font-mono">
            {/* Grid lines */}
            <line x1="40" y1="15" x2="360" y2="15" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="40" y1="41" x2="360" y2="41" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="40" y1="67" x2="360" y2="67" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="40" y1="93" x2="360" y2="93" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="40" y1="119" x2="360" y2="119" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="40" y1="145" x2="360" y2="145" stroke="#111111" strokeWidth="1" />

            {/* Y-axis Ticks & Labels (Mapped 0 to 6.0) */}
            <text x="32" y="18" className="text-[7.5px] fill-neutral-400 text-right font-mono" textAnchor="end">6.0</text>
            <text x="32" y="44" className="text-[7.5px] fill-neutral-400 text-right font-mono" textAnchor="end">4.8</text>
            <text x="32" y="67" className="text-[7.5px] fill-neutral-400 text-right font-mono" textAnchor="end">3.6</text>
            <text x="32" y="93" className="text-[7.5px] fill-neutral-400 text-right font-mono" textAnchor="end">2.4</text>
            <text x="32" y="119" className="text-[7.5px] fill-neutral-400 text-right font-mono" textAnchor="end">1.2</text>
            <text x="32" y="148" className="text-[7.5px] fill-neutral-400 text-right font-mono" textAnchor="end">0.0</text>

            {/* X-axis ticks & labels (log2 fold change from -4 to 4) */}
            <line x1="40" y1="145" x2="40" y2="149" stroke="#111111" strokeWidth="1" />
            <text x="40" y="157" className="text-[7.5px] fill-neutral-400 font-mono" textAnchor="middle">-4.0</text>

            <line x1="120" y1="145" x2="120" y2="149" stroke="#111111" strokeWidth="1" />
            <text x="120" y="157" className="text-[7.5px] fill-neutral-400 font-mono" textAnchor="middle">-2.0</text>

            <line x1="200" y1="145" x2="200" y2="149" stroke="#111111" strokeWidth="1" />
            <text x="200" y="157" className="text-[7.5px] fill-neutral-400 font-mono" textAnchor="middle">0.0</text>

            <line x1="280" y1="145" x2="280" y2="149" stroke="#111111" strokeWidth="1" />
            <text x="280" y="157" className="text-[7.5px] fill-neutral-400 font-mono" textAnchor="middle">2.0</text>

            <line x1="360" y1="145" x2="360" y2="149" stroke="#111111" strokeWidth="1" />
            <text x="360" y="157" className="text-[7.5px] fill-neutral-400 font-mono" textAnchor="middle">4.0</text>

            {/* Axis Titles */}
            <text x="360" y="140" className="text-[7px] fill-neutral-500 font-bold font-mono" textAnchor="end">log₂ Fold Change</text>
            <text x="45" y="10" className="text-[7px] fill-neutral-500 font-bold font-mono">-log₁₀ p-value</text>

            {/* Threshold Lines - Sweep into position during fitting */}
            {optimizeFactor > 0.4 && (
              <g className="transition-opacity duration-300">
                {/* Significance threshold line (y = 1.3 -> cy = 116.8) */}
                <line 
                  x1="40" 
                  y1="116.8" 
                  x2="360" 
                  y2="116.8" 
                  stroke="#111111" 
                  strokeWidth="1.2" 
                  strokeDasharray="3,3" 
                  opacity="0.3" 
                />
                {/* Left FC Cutoff (x = -1.0 -> cx = 160) */}
                <line 
                  x1="160" 
                  y1="15" 
                  x2="160" 
                  y2="145" 
                  stroke="#111111" 
                  strokeWidth="1.2" 
                  strokeDasharray="3,3" 
                  opacity="0.3" 
                />
                {/* Right FC Cutoff (x = 1.0 -> cx = 240) */}
                <line 
                  x1="240" 
                  y1="15" 
                  x2="240" 
                  y2="145" 
                  stroke="#111111" 
                  strokeWidth="1.2" 
                  strokeDasharray="3,3" 
                  opacity="0.3" 
                />
              </g>
            )}

            {/* Laser Scanner bar when optimizing */}
            {status === "OPTIMIZING" && (
              <line 
                x1="40" 
                y1={145 - optimizeFactor * 130} 
                x2="360" 
                y2={145 - optimizeFactor * 130} 
                stroke="#6B1724" 
                strokeWidth="1.5" 
                opacity="0.6" 
              />
            )}

            {/* Generate and map Volcano scatter dots */}
            {(() => {
              return VOLCANO_DOTS.map((dot) => {
                // X-axis maps log2FC from -4.0 to +4.0 (range of 8)
                const targetCx = 40 + ((dot.x + 4.0) / 8.0) * 320;
                // Y-axis maps -log10 p-value from 0.0 to 6.0 (range of 6)
                const targetCy = 145 - (dot.y / 6.0) * 130;

                // During initialization / optimizing, dots gather from center bottom (200, 145) towards target
                const currentCx = 200 + (targetCx - 200) * optimizeFactor;
                const currentCy = 145 - (145 - targetCy) * optimizeFactor;

                // Determine dot color
                let dotColor = "#9CA3AF"; // Neutral background genes (grey)
                let isSignificant = false;
                
                if (status === "COMPLETED") {
                  if (dot.y >= 1.3) {
                    if (dot.x >= 1.0) {
                      dotColor = "#6B1724"; // Significant upregulated (crimson)
                      isSignificant = true;
                    } else if (dot.x <= -1.0) {
                      dotColor = "#4A5568"; // Significant downregulated (steel blue/grey)
                      isSignificant = true;
                    }
                  }
                } else {
                  // Default grey or soft reddish/grey during fitting process
                  dotColor = dot.x > 0 ? "#D1D5DB" : "#E5E7EB";
                }

                const opacityValue = status === "COMPLETED" 
                  ? (isSignificant ? 0.95 : 0.35) 
                  : 0.6;

                const radius = isSignificant ? 3.2 : 2.2;

                // Custom offsets designed to have ZERO overlaps
                const dx = dot.labelDx !== undefined ? dot.labelDx : (dot.x > 0 ? 12 : -12);
                const dy = dot.labelDy !== undefined ? dot.labelDy : -8;

                return (
                  <g key={dot.id}>
                    <circle 
                      cx={currentCx} 
                      cy={currentCy} 
                      r={radius} 
                      fill={dotColor} 
                      opacity={opacityValue}
                      className="transition-all duration-300"
                    />
                    
                    {/* Render top significant gene labels with thin indicator lines when complete */}
                    {status === "COMPLETED" && dot.gene && (
                      <g className="transition-opacity duration-700">
                        {/* Indicator Line */}
                        <line 
                          x1={targetCx} 
                          y1={targetCy} 
                          x2={targetCx + dx} 
                          y2={targetCy + dy} 
                          stroke="#111111" 
                          strokeWidth="0.5" 
                          opacity="0.4"
                        />
                        {/* Gene Label Text */}
                        <text 
                          x={targetCx + dx + (dx > 0 ? 2 : -2)} 
                          y={targetCy + dy + 2} 
                          textAnchor={dx > 0 ? "start" : "end"}
                          className="text-[6.5px] fill-[#111111] font-mono font-black select-none"
                        >
                          {dot.gene}
                        </text>
                      </g>
                    )}
                  </g>
                );
              });
            })()}

            {/* Sub-group Legend Box - Placed in the completely empty Top-Middle region */}
            {status === "COMPLETED" && (
              <g transform="translate(135, 18)" className="transition-opacity duration-500">
                <rect x="0" y="0" width="110" height="38" fill="white" fillOpacity="0.9" stroke="#E5E7EB" strokeWidth="1" />
                
                <circle cx="10" cy="10" r="3" fill="#6B1724" />
                <text x="20" y="13" className="text-[6.5px] font-mono font-bold fill-neutral-800">Upregulated (n=11)</text>
                
                <circle cx="10" cy="20" r="3" fill="#4A5568" />
                <text x="20" y="23" className="text-[6.5px] font-mono font-bold fill-neutral-800">Downregulated (n=4)</text>

                <circle cx="10" cy="29" r="2" fill="#9CA3AF" opacity="0.35" />
                <text x="20" y="32" className="text-[6.5px] font-mono fill-neutral-400">Non-Significant</text>
              </g>
            )}

            {/* Axes */}
            <line x1="40" y1="15" x2="40" y2="145" stroke="#111111" strokeWidth="1" />
            <line x1="40" y1="145" x2="360" y2="145" stroke="#111111" strokeWidth="1" />
          </svg>

          {/* Differential Expression metrics footer - High fidelity format */}
          <div 
            className="mt-3 border-t border-[#111111]/10 pt-2 flex flex-col sm:flex-row justify-between text-[7.5px] font-mono text-neutral-500 transition-all duration-300 gap-1.5"
            style={{ opacity: status === "COMPLETED" ? 1 : 0.3 }}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#6B1724]">THRESHOLD METRICS:</span>
              <span>p-value &lt; 0.05 Cutoff (y &gt; 1.30)</span>
              <span className="text-neutral-300">|</span>
              <span>Fold-Change Cutoff (|x| &gt; 1.0)</span>
            </div>
            <div className="text-[#6B1724] font-bold text-right sm:text-left">
              MAX ENRICHMENT: IL6 (+2.80 Log₂FC, p = 3.98e-6)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
