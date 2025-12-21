
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="space-y-6">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1]">
          ICU phenotypes <br />
          beyond severity.
        </h1>
        <p className="text-xl md:text-2xl text-secondary font-normal max-w-2xl leading-relaxed">
          Disentangling chronic disease burden from acute physiology using multi-view similarity fusion and auditable rules.
        </p>
      </section>

      {/* 2x2 Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-apple rounded-xl overflow-hidden">
        <div className="bg-white p-8 space-y-4">
          <h3 className="font-semibold text-lg">The Problem</h3>
          <p className="text-secondary leading-relaxed">
            Standard ICU phenotyping often collapses into a simple gradient of "more sick vs less sick," as chronic comorbidity signals overwhelm acute patterns.
          </p>
        </div>
        <div className="bg-white p-8 space-y-4">
          <h3 className="font-semibold text-lg">The Solution</h3>
          <p className="text-secondary leading-relaxed">
            By anchoring clustering in multimorbidity strata and fusing data views (SNF-lite), we reveal distinct clinical signatures that exist independent of age or disease count.
          </p>
        </div>
        <div className="bg-white p-8 space-y-4">
          <h3 className="font-semibold text-lg">Outcome Relevance</h3>
          <p className="text-secondary leading-relaxed">
            Derived phenotypes demonstrate significant prognostic uplift (C-index) over base clinical models across all strata, validated on held-out outcomes.
          </p>
        </div>
        <div className="bg-white p-8 space-y-4">
          <h3 className="font-semibold text-lg">Interpretability</h3>
          <p className="text-secondary leading-relaxed">
            No black boxes. High-dimensional clusters are distilled into sparse decision rules, translated into human-readable rulecards with programmatic QC.
          </p>
        </div>
      </section>

      {/* Role and Skills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-apple pt-12 space-y-8 md:space-y-0">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-widest text-secondary">My Role</p>
          <p className="text-lg">Lead Researcher & Engineer. Designed and implemented the end-to-end ML pipeline.</p>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-widest text-secondary">Skills Demonstrated</p>
          <div className="flex flex-wrap gap-2">
            {['Applied ML', 'Survival Analysis', 'LLM/RAG', 'Pipeline Engineering', 'R/Python', 'Interpretability'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-slate-50 border border-apple rounded-full text-xs font-medium">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center pt-10">
        <Link to="/technical" className="group flex items-center space-x-2 text-blue-600 font-medium text-lg hover:underline decoration-2 underline-offset-4">
          <span>See how it works</span>
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default Home;
