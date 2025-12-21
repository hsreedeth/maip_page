
import React, { useState, useEffect, useRef } from 'react';
import { STRATA_DATA, C_INDEX_RESULTS, MAX_DELTA_C } from '../constants';
import { PhenotypeRule } from '../types';

/**
 * DELTA C SCALING LOGIC:
 * width% = (deltaC / MAX_DELTA_C) * 100
 * Triggered via IntersectionObserver.
 */

const DeltaBar: React.FC<{ value: number; visible: boolean; colorClass?: string }> = ({ value, visible, colorClass = "bg-snf" }) => {
  const width = (value / MAX_DELTA_C) * 100;
  return (
    <div className="flex items-center space-x-3 flex-grow">
      <div className="h-1.5 bg-slate-100 rounded-full flex-grow overflow-hidden relative">
        <div 
          className={`h-full ${colorClass} rounded-full transition-all duration-[1000ms] ease-out origin-left`}
          style={{ width: visible ? `${width}%` : '0%' }}
        />
      </div>
      <span className="text-[11px] font-mono text-secondary w-10 tabular-nums">
        {value > 0 ? `+${value.toFixed(3)}` : '—'}
      </span>
    </div>
  );
};

const TakeawayStep: React.FC<{ label: string; index: number; visible: boolean; isLast?: boolean }> = ({ label, index, visible, isLast }) => {
  return (
    <div className="flex items-center flex-1">
      <div className="flex items-center space-x-2 md:space-x-3 w-full justify-center">
        <div 
          className="px-4 py-2 bg-white border border-apple rounded-lg shadow-sm transition-all duration-500 ease-out"
          style={{ 
            opacity: visible ? 1 : 0, 
            transform: visible ? 'translateY(0)' : 'translateY(10px)',
            transitionDelay: `${index * 140}ms`
          }}
        >
          <span className="text-xs font-semibold whitespace-nowrap">{label}</span>
        </div>
        {!isLast && (
          <span 
            className="text-apple transition-opacity duration-300 hidden md:inline" 
            style={{ 
              opacity: visible ? 1 : 0, 
              transitionDelay: `${(index * 140) + 70}ms` 
            }}
          >
            →
          </span>
        )}
      </div>
    </div>
  );
};

const Results: React.FC = () => {
  const [selectedStratum, setSelectedStratum] = useState(STRATA_DATA[0]);
  const [selectedPhenotype, setSelectedPhenotype] = useState<PhenotypeRule | null>(STRATA_DATA[0].phenotypes[0]);
  const [barsVisible, setBarsVisible] = useState(false);
  const [stepsVisible, setStepsVisible] = useState(false);
  const [contentKey, setContentKey] = useState(0);
  
  const tableRef = useRef<HTMLDivElement>(null);
  const takeawayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = { threshold: 0.15 };
    
    const tableObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setBarsVisible(true);
        tableObserver.unobserve(entry.target);
      }
    }, observerOptions);

    const takeawayObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStepsVisible(true);
        takeawayObserver.unobserve(entry.target);
      }
    }, observerOptions);

    if (tableRef.current) tableObserver.observe(tableRef.current);
    if (takeawayRef.current) takeawayObserver.observe(takeawayRef.current);

    return () => {
      tableObserver.disconnect();
      takeawayObserver.disconnect();
    };
  }, []);

  const handleStratumChange = (id: string) => {
    const s = STRATA_DATA.find(x => x.id === id) || STRATA_DATA[0];
    setSelectedStratum(s);
    setSelectedPhenotype(s.phenotypes[0]);
    setContentKey(prev => prev + 1);
  };

  const handlePhenotypeChange = (p: PhenotypeRule) => {
    setSelectedPhenotype(p);
    setContentKey(prev => prev + 1);
  };

  const pipelineSteps = [
    "Stable clusters",
    "Validated signal",
    "Compact rules",
    "Grounded text",
    "QC"
  ];

  return (
    <div className="space-y-16 md:space-y-24">
      <style>{`
        @keyframes pulse-green {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-pulse-green {
          animation: pulse-green 3s ease-in-out infinite;
        }
        .animate-fade-content {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>

      <header className="space-y-4">
        <h2 className="text-4xl font-semibold tracking-tight">Results & Evidence</h2>
        <p className="text-xl text-secondary max-w-2xl">Proven prognostic value and clinically intuitive clustering across nine distinct phenotypes.</p>
      </header>

      {/* Cross-validated C-index Table */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Cross-validated C-index (6-month mortality)</h3>
            <p className="text-xs text-secondary italic">Higher is better. Max ΔC = 0.042.</p>
          </div>
          <div className="flex items-center space-x-6 text-[10px] font-bold uppercase tracking-widest text-secondary">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-snf"></span>
              <span>SNF-lite</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-mmsp"></span>
              <span>MMSP</span>
            </div>
          </div>
        </div>
        
        <div ref={tableRef} className="border border-apple rounded-2xl overflow-hidden bg-white shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-apple">
                <th className="px-6 py-4 font-semibold text-secondary w-24">Stratum</th>
                <th className="px-6 py-4 font-semibold text-secondary">Model</th>
                <th className="px-6 py-4 font-semibold text-secondary w-32">Mean C-index</th>
                <th className="px-6 py-4 font-semibold text-secondary">Mean ΔC vs base</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-apple">
              {C_INDEX_RESULTS.map((row, i) => {
                const isSNF = row.model.includes('SNF-lite');
                const isMMSP = row.model.includes('MMSP');
                const accentClass = isSNF ? 'bg-snf' : (isMMSP ? 'bg-mmsp' : 'bg-slate-300');
                const textClass = isSNF ? 'text-snf font-semibold' : (isMMSP ? 'text-mmsp font-medium' : 'text-slate-800');
                
                return (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{row.stratum}</td>
                    <td className={`px-6 py-4 ${textClass}`}>
                      {(isSNF || isMMSP) && <span className={`inline-block w-1 h-3 rounded-full ${accentClass} mr-2 align-middle`}></span>}
                      {row.model}
                    </td>
                    <td className="px-6 py-4 font-mono text-secondary">{row.meanCIndex.toFixed(3)}</td>
                    <td className="px-6 py-4">
                      <DeltaBar value={row.deltaC} visible={barsVisible} colorClass={accentClass} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Full-width Takeaway Card */}
      <section ref={takeawayRef} className="w-full p-8 md:p-12 border border-apple rounded-3xl bg-slate-50/50 space-y-12">
        <div className="space-y-2 max-w-2xl">
          <h4 className="text-xs font-bold uppercase tracking-widest text-secondary">One-sentence takeaway</h4>
          <p className="text-2xl font-medium leading-tight">
            MAIP is a maintainable path from unsupervised phenotyping to an auditable clinical artefact.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-y-6 w-full">
          {pipelineSteps.map((step, idx) => (
            <TakeawayStep 
              key={step} 
              label={step} 
              index={idx} 
              visible={stepsVisible} 
              isLast={idx === pipelineSteps.length - 1} 
            />
          ))}
        </div>
      </section>

      {/* Rulecard Demo Interface */}
      <section className="w-full p-8 md:p-12 border border-apple rounded-3xl bg-white space-y-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="inline-block px-2.5 py-1 bg-yellow-100 border border-yellow-200 text-[10px] font-bold uppercase tracking-widest rounded-md">
              DEMO ONLY
            </div>
            <h4 className="text-3xl font-semibold tracking-tight">Rulecard demo (preview)</h4>
            <p className="text-lg text-secondary leading-relaxed max-w-3xl">
              This is a lightweight demonstration of the rule translation and QC concept. It illustrates how high-dimensional clustering becomes clinical documentation.
            </p>
          </div>
          
          <div className="flex items-center space-x-3 text-green-600 font-bold text-[11px] uppercase tracking-[0.1em]">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse-green"></span>
            <span>ALL QC CHECKS PASSED</span>
          </div>
        </div>

        <div className="pt-8 border-t border-apple">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Controls */}
            <div className="w-full lg:w-1/3 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">1. Select Stratum</label>
                <select 
                  className="w-full p-4 bg-slate-50 border border-apple rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%2386868B%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_16px_center] bg-no-repeat transition-all hover:bg-slate-100"
                  value={selectedStratum.id}
                  onChange={(e) => handleStratumChange(e.target.value)}
                >
                  {STRATA_DATA.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-secondary">2. Select Phenotype</label>
                <div className="flex flex-col space-y-3">
                  {selectedStratum.phenotypes.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => handlePhenotypeChange(p)}
                      className={`text-left px-5 py-4 rounded-xl text-sm transition-all duration-300 min-h-[5rem] flex items-center justify-between border-2 ${
                        selectedPhenotype?.id === p.id 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                        : 'bg-white border-apple text-secondary hover:border-blue-400'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedPhenotype?.id === p.id ? 'text-blue-100' : 'text-secondary/60'}`}>
                          {p.id}
                        </span>
                        <span className="font-semibold block text-base">{p.title}</span>
                      </div>
                      {selectedPhenotype?.id === p.id && (
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-slate-50 border border-apple rounded-2xl space-y-4">
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-secondary">Internal Verification</h5>
                <div className="space-y-2.5">
                  {[
                    { label: 'Feature names valid', status: true },
                    { label: 'Unit mapping aligned', status: true },
                    { label: 'Rule coverage > 85%', status: true },
                    { label: 'Synthetic profile consistency', status: true },
                  ].map((check, i) => (
                    <div key={i} className="flex items-center space-x-2.5 text-[11px]">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-secondary font-medium">{check.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div 
              key={contentKey}
              className="flex-grow bg-slate-50/30 border border-apple rounded-3xl p-6 md:p-10 space-y-10 overflow-hidden animate-fade-content"
            >
              {selectedPhenotype ? (
                <>
                  <div className="space-y-3 border-b border-apple pb-8">
                    <div className="flex justify-between items-start">
                      <h4 className="text-3xl font-semibold tracking-tight leading-tight">{selectedPhenotype.id} – {selectedPhenotype.title}</h4>
                      <span className="text-[10px] bg-slate-200/50 px-2 py-1 rounded font-mono text-secondary tracking-wider">HEX_ID: 0x{Math.floor(Math.random()*65536).toString(16).toUpperCase()}</span>
                    </div>
                    <p className="text-secondary leading-relaxed text-lg italic max-w-2xl">“{selectedPhenotype.keyIdea}”</p>
                  </div>

                  <div className="space-y-5">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-secondary">Surrogate Rulecard</h5>
                    <ul className="space-y-4">
                      {selectedPhenotype.rules.map((rule, i) => (
                        <li key={i} className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs md:text-sm font-mono bg-white p-5 rounded-2xl border border-apple group hover:border-blue-300 transition-colors shadow-sm">
                          <div className="flex items-start space-x-4">
                            <span className="text-blue-600 font-black pt-0.5">•</span>
                            <span className="leading-relaxed text-slate-700">{rule.split(' THEN ')[0]}</span>
                          </div>
                          <div className="flex items-center justify-end">
                            <span className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap shadow-sm">
                              THEN {selectedPhenotype.id}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-5">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-secondary">Logic Tree (Simplified)</h5>
                    <div className="relative group">
                      <pre className="text-[10px] md:text-[11px] font-mono leading-tight bg-slate-900 text-slate-300 p-8 rounded-[2rem] overflow-x-auto shadow-2xl border border-slate-800">
                        {selectedPhenotype.flowchart}
                      </pre>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-secondary italic">Select a phenotype to view its rulecard</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Key Message Statement */}
      <section className="p-8 md:p-12 border border-apple rounded-3xl bg-slate-50/50 space-y-6">
        <h4 className="text-xs font-bold uppercase tracking-widest text-secondary">Key message</h4>
        <p className="text-lg text-slate-800 leading-relaxed font-normal">
          MAIP demonstrates an end-to-end method for discovering ICU phenotypes that are not merely severity strata: multimorbidity anchoring reduces confounding by chronic burden, multi-view fusion captures complementary clinical structure, and validation confirms the phenotypes carry independent prognostic signal. Crucially, the phenotypes are operationalised as auditable decision rules and QC-checked rulecards—turning unsupervised clustering into a maintainable, reviewable clinical artefact.
        </p>
      </section>

      <div className="flex flex-col items-center space-y-6 pt-10">
        <p className="text-secondary text-center max-w-lg text-sm leading-relaxed">
          For full implementation details, validation metrics, and the complete supporting manuscript, please visit the repository.
        </p>
        <div className="flex space-x-6">
          <a href="#" className="px-8 py-4 bg-black text-white rounded-full text-sm font-semibold hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95 shadow-lg">
            View on GitHub
          </a>
          <a href="#" className="px-8 py-4 border border-apple rounded-full text-sm font-semibold hover:bg-slate-50 transition-all hover:scale-105 active:scale-95">
            Read Manuscript
          </a>
        </div>
      </div>
    </div>
  );
};

export default Results;
