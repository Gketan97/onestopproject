import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function LandingSection({ onStart }) {
  return (
    <div className="px-5 pt-10 pb-8">
      <p className="font-mono text-[10px] font-semibold text-ink3 tracking-widest uppercase text-center mb-4">
        For analysts targeting Swiggy · Razorpay · Uber · Flipkart
      </p>
      <h1 className="font-serif text-[clamp(26px,5vw,40px)] text-ink leading-[1.08] tracking-tight text-center mb-5">
        Do you know what separates analysts<br className="hidden sm:block" /> who get ₹28L offers from those who don't?
      </h1>

      <div className="bg-ink rounded-2xl p-5 mb-5">
        <p className="text-white/40 font-mono text-[11px] tracking-widest uppercase mb-3">The answer is not:</p>
        <div className="space-y-2 mb-4">
          {['SQL fluency — everyone who applies can write queries', 'Dashboard experience — that\'s table stakes', 'Knowing frameworks — everyone has memorised them'].map(t => (
            <div key={t} className="flex items-center gap-2.5">
              <span className="text-red font-bold text-base flex-shrink-0">×</span>
              <p className="text-white/70 text-sm">{t}</p>
            </div>
          ))}
        </div>
        <div className="h-px bg-white/10 mb-4" />
        <div className="flex items-start gap-2.5">
          <span className="text-green font-bold text-base flex-shrink-0">→</span>
          <p className="text-white font-medium text-sm leading-relaxed">It's how they think through a problem under pressure — structured, fast, without being told what to look at next.</p>
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-white font-medium rounded-xl text-sm hover:bg-accent-dark hover:-translate-y-px hover:shadow-accent transition-all"
      >
        Find out how you think now <ArrowRight size={15} />
      </button>
      <p className="text-center text-ink3 text-xs mt-2">Free · 2 min · No account needed</p>

      <div className="mt-6 space-y-3">
        {[
          { phase: 1, label: 'Phase 1 · Watch · ~20 min', title: 'Watch Arjun investigate', desc: 'A 10-year Swiggy analyst works a real incident live. Predict his moves before each step.', color: 'border-phase1-border bg-phase1-bg', accent: 'bg-phase1' },
          { phase: 2, label: 'Phase 2 · Practice · ~25 min', title: 'Your investigation — blank editor', desc: 'Same company, different problem. You write the SQL. Arjun evaluates what you actually wrote.', color: 'border-phase2-border bg-phase2-bg', accent: 'bg-phase2' },
        ].map(p => (
          <div key={p.phase} className={`border rounded-xl p-4 relative overflow-hidden ${p.color}`}>
            <div className={`absolute top-0 left-0 right-0 h-0.5 ${p.accent}`} />
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[9px] font-semibold border mb-2 ${p.color}`}>{p.label}</span>
            <p className="font-semibold text-[13px] text-ink mb-1">{p.title}</p>
            <p className="text-[12px] text-ink2 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 bg-accent-light border border-accent-border rounded-xl p-4">
        <p className="text-[13px] font-semibold text-ink mb-1">No testimonials yet — this just launched.</p>
        <p className="text-[12px] text-ink2 leading-relaxed">You'd be one of the first 10 to complete this. At the end you get a shareable portfolio URL — a real link that shows recruiters exactly how you think.</p>
      </div>
    </div>
  );
}
