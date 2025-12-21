
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface ValidationData {
  stratum: string;
  method: string;
  k: number;
  ari: number;
  silhouette: number;
  ch: number;
  db: number;
}

const VALIDATION_RESULTS: ValidationData[] = [
  { stratum: 'High MM', method: 'MMSP', k: 5, ari: 0.221, silhouette: 0.115, ch: 91.16, db: 2.48 },
  { stratum: 'High MM', method: 'SNF-lite', k: 3, ari: 0.477, silhouette: 0.273, ch: 406.91, db: 1.25 },
  { stratum: 'Mid MM', method: 'MMSP', k: 3, ari: 0.321, silhouette: 0.110, ch: 367.23, db: 2.80 },
  { stratum: 'Mid MM', method: 'SNF-lite', k: 3, ari: 0.670, silhouette: 0.319, ch: 1566.30, db: 1.13 },
  { stratum: 'Low MM', method: 'MMSP', k: 4, ari: 0.267, silhouette: 0.114, ch: 370.92, db: 2.61 },
  { stratum: 'Low MM', method: 'SNF-lite', k: 3, ari: 0.607, silhouette: 0.388, ch: 1961.89, db: 1.05 },
];

const MetricBar: React.FC<{ 
  value: number; 
  max: number; 
  visible: boolean; 
  invert?: boolean; 
  precision?: number;
  colorClass?: string;
}> = ({ value, max, visible, invert = false, precision = 3, colorClass = "bg-snf" }) => {
  const width = invert ? (max / value) * 50 : (value / max) * 100;
  
  return (
    <div className="flex items-center space-x-3 flex-grow">
      <div className="h-1.5 bg-slate-100 rounded-full flex-grow overflow-hidden relative">
        <div 
          className={`h-full ${colorClass} rounded-full transition-all duration-[1000ms] ease-out origin-left`}
          style={{ width: visible ? `${Math.min(width, 100)}%` : '0%' }}
        />
      </div>
      <span className="text-[11px] font-mono text-secondary w-10 tabular-nums">
        {value.toFixed(value > 100 ? 1 : precision)}
      </span>
    </div>
  );
};

const PipelineStep: React.FC<{ 
  title: string; 
  desc: string; 
  index: number; 
  visible: boolean;
  highlightColor?: string;
}> = ({ title, desc, index, visible, highlightColor }) => (
  <div 
    className={`space-y-2 p-6 bg-white border rounded-2xl shadow-sm transition-all duration-[450ms] ease-out relative z-10 ${highlightColor ? `border-l-4 ${highlightColor}` : 'border-apple'}`}
    style={{ 
      opacity: visible ? 1 : 0, 
      transform: visible ? 'translateY(0)' : 'translateY(10px)',
      transitionDelay: `${index * 140}ms`
    }}
  >
    <div className="flex items-center space-x-3">
      <span className="text-[10px] font-bold text-secondary bg-slate-50 px-2 py-0.5 rounded tracking-tighter">STEP {index + 1}</span>
      <h3 className="font-semibold text-lg">{title}</h3>
    </div>
    <p className="text-secondary leading-relaxed text-sm">{desc}</p>
  </div>
);

const Legend: React.FC = () => (
  <div className="flex items-center space-x-6 text-[10px] font-bold uppercase tracking-widest text-secondary mb-4">
    <div className="flex items-center space-x-2">
      <span className="w-2 h-2 rounded-full bg-snf"></span>
      <span>SNF-lite</span>
    </div>
    <div className="flex items-center space-x-2">
      <span className="w-2 h-2 rounded-full bg-mmsp"></span>
      <span>MMSP</span>
    </div>
  </div>
);

const Technical: React.FC = () => {
  const [barsVisible, setBarsVisible] = useState(false);
  const [stepsVisible, setStepsVisible] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    
    const tableObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setBarsVisible(true);
        tableObserver.unobserve(entry.target);
      }
    }, observerOptions);

    const stepsObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStepsVisible(true);
        stepsObserver.unobserve(entry.target);
      }
    }, observerOptions);

    if (tableRef.current) tableObserver.observe(tableRef.current);
    if (stepsContainerRef.current) stepsObserver.observe(stepsContainerRef.current);

    return () => {
      tableObserver.disconnect();
      stepsObserver.disconnect();
    };
  }, []);

  const steps = [
    { title: 'Data View Construction', desc: 'Organizing clinical features into Chronic, Acute, and Socio-Contextual views.' },
    { title: 'Multimorbidity Anchoring', desc: 'Stratification by chronic disease count to isolate acute physiological variance.' },
    { title: 'Similarity Fusion (SNF-lite)', desc: 'Gower/RBF network fusion for consensus patient consensus clustering.', highlight: 'border-blue-500' },
    { title: 'Stability Selection', desc: 'Bootstrap ARI maximization to determine optimal cluster count (K).' },
    { title: 'Surrogate Distillation', desc: 'Sparse decision trees approximating assignments with auditable rules.' },
    { title: 'RAG Translation & QC', desc: 'Local LLM-driven rulecards with automated programmatic logical verification.', highlight: 'border-slate-400' }
  ];

  return (
    <div className="space-y-24">
      <style>{`
        @keyframes drawLine {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: 0; }
        }
        .dotted-line-path {
          stroke-dasharray: 8 8;
          stroke-dashoffset: 1000;
          transition: stroke-dashoffset 2s ease-out;
        }
        .dotted-line-active {
          animation: drawLine 2.5s ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .dotted-line-path { animation: none; stroke-dashoffset: 0; }
          .transition-all { transition: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      <header className="space-y-4">
        <h2 className="text-4xl font-semibold tracking-tight">Technical Pipeline</h2>
        <p className="text-xl text-secondary max-w-2xl">A robust, auditable pathway from high-dimensional raw data to human-readable decision rules.</p>
      </header>

      {/* Animated Pipeline Section */}
      <section ref={stepsContainerRef} className="relative space-y-12">
        <div className="relative">
          <div className="absolute inset-0 pointer-events-none hidden md:block" style={{ top: '10%', bottom: '10%' }}>
            <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="none">
              <path 
                d="M 200,50 L 600,50 L 600,250 L 200,250 L 200,450 L 600,450" 
                fill="none" 
                stroke="rgba(0,0,0,0.12)" 
                strokeWidth="2" 
                className={`dotted-line-path ${stepsVisible ? 'dotted-line-active' : ''}`}
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            {steps.map((step, idx) => (
              <PipelineStep 
                key={idx} 
                title={step.title} 
                desc={step.desc} 
                index={idx} 
                visible={stepsVisible}
                highlightColor={step.highlight}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-center">
          <a href="#why-this-matters" className="text-sm font-medium text-blue-600 hover:underline decoration-1 underline-offset-4">
            Why this matters →
          </a>
        </div>
        <div id="why-this-matters" className="scroll-mt-24"></div>
      </section>

      {/* Internal Validation Snapshot */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Internal validation snapshot</h3>
            <p className="text-xs text-secondary italic">Stability and separation indices by stratum (MMSP vs SNF-lite).</p>
          </div>
          <Legend />
        </div>

        <div ref={tableRef} className="border border-apple rounded-2xl overflow-hidden bg-white shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-apple">
                <th className="px-6 py-4 font-semibold text-secondary w-32">Stratum</th>
                <th className="px-6 py-4 font-semibold text-secondary w-28">Method</th>
                <th className="px-6 py-4 font-semibold text-secondary w-16 text-center">K</th>
                <th className="px-6 py-4 font-semibold text-secondary">Stability (ARI)</th>
                <th className="px-6 py-4 font-semibold text-secondary">Silhouette</th>
                <th className="px-6 py-4 font-semibold text-secondary">CH Index</th>
                <th className="px-6 py-4 font-semibold text-secondary">DB Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-apple">
              {VALIDATION_RESULTS.map((row, i) => {
                const isGroupStart = i % 2 === 0;
                const group = VALIDATION_RESULTS.slice(Math.floor(i/2)*2, Math.floor(i/2)*2 + 2);
                const maxARI = Math.max(...group.map(g => g.ari));
                const maxSil = Math.max(...group.map(g => g.silhouette));
                const maxCH = Math.max(...group.map(g => g.ch));
                const minDB = Math.min(...group.map(g => g.db));
                const isSNF = row.method === 'SNF-lite';
                const accentClass = isSNF ? 'bg-snf' : 'bg-mmsp';
                const textClass = isSNF ? 'text-snf font-semibold' : 'text-mmsp font-medium';

                return (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    {isGroupStart ? (
                      <td className="px-6 py-4 font-medium border-r border-apple bg-slate-50/30 align-top" rowSpan={2}>
                        {row.stratum}
                      </td>
                    ) : null}
                    <td className={`px-6 py-4 ${textClass}`}>
                      <div className="flex items-center space-x-2">
                        <span className={`w-1 h-3 rounded-full ${accentClass}`}></span>
                        <span>{row.method}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-center text-secondary">{row.k}</td>
                    <td className="px-6 py-4">
                      <MetricBar value={row.ari} max={maxARI} visible={barsVisible} colorClass={accentClass} />
                    </td>
                    <td className="px-6 py-4">
                      <MetricBar value={row.silhouette} max={maxSil} visible={barsVisible} colorClass={accentClass} />
                    </td>
                    <td className="px-6 py-4">
                      <MetricBar value={row.ch} max={maxCH} visible={barsVisible} colorClass={accentClass} />
                    </td>
                    <td className="px-6 py-4">
                      <MetricBar value={row.db} max={minDB} visible={barsVisible} invert colorClass={accentClass} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Revised Implementation Notes */}
      <section className="pt-12 border-t border-apple space-y-8">
        <h3 className="text-2xl font-semibold tracking-tight">Implementation Notes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary">Stack</h4>
            <ul className="text-xs space-y-2 text-slate-700">
              <li className="flex items-center space-x-2"><span>•</span> <span>Python (Scikit-Learn, Py-SNF)</span></li>
              <li className="flex items-center space-x-2"><span>•</span> <span>R (FactoMineR, Survival/Lifelines)</span></li>
              <li className="flex items-center space-x-2"><span>•</span> <span>Custom SNF fusion kernel</span></li>
              <li className="flex items-center space-x-2"><span>•</span> <span>JSON-Schema rulecard rendering</span></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary">Reproducibility</h4>
            <ul className="text-xs space-y-2 text-slate-700">
              <li className="flex items-center space-x-2"><span>•</span> <span>Strict deterministic random seeding</span></li>
              <li className="flex items-center space-x-2"><span>•</span> <span>Versioned evaluation artifacts</span></li>
              <li className="flex items-center space-x-2"><span>•</span> <span>Immutable configuration YAMLs</span></li>
              <li className="flex items-center space-x-2"><span>•</span> <span>Frozen train/eval cohort separation</span></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary">Quality Control</h4>
            <ul className="text-xs space-y-2 text-slate-700">
              <li className="flex items-center space-x-2"><span>•</span> <span>Bootstrap ARI stability checks</span></li>
              <li className="flex items-center space-x-2"><span>•</span> <span>Automated rule coverage validation</span></li>
              <li className="flex items-center space-x-2"><span>•</span> <span>Unified feature dictionary alignment</span></li>
              <li className="flex items-center space-x-2"><span>•</span> <span>Synthetic profile consistency testing</span></li>
            </ul>
          </div>
        </div>
      </section>

      <div className="flex justify-center pt-10">
        <Link to="/results" className="group flex items-center space-x-2 text-blue-600 font-medium text-lg hover:underline decoration-2 underline-offset-4">
          <span>Explore results & demo</span>
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default Technical;
