// src/components/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { PhasePill, MonoLabel, CalloutCard } from '../ui/index.jsx';

const PHASES = [
  { phase: 1, title: 'Watch',    desc: 'See how a senior analyst structures the investigation — problem decomposition, hypothesis thinking, query logic.', time: '~20 min' },
  { phase: 2, title: 'Practice', desc: 'Same company, different problem. You write the SQL. You hit dead ends. You find the root cause.', time: '~15 min' },
  { phase: 3, title: 'Execute',  desc: 'Open dataset. Open questions. You design the analysis and write the executive summary — just like the real job.', time: '~10 min' },
];

const HomePage = () => (
  <div className="min-h-screen bg-bg font-sans">

    {/* HERO */}
    <section className="max-w-3xl mx-auto px-5 pt-20 pb-16 md:pt-28 md:pb-24 text-center">
      <MonoLabel className="mb-5 justify-center flex">Case 01 · Free · ~45 min</MonoLabel>
      <h1 className="font-serif text-4xl md:text-6xl text-ink leading-[1.08] tracking-tight mb-6">
        Analytics interviews test SQL.<br />
        <em className="not-italic text-accent">Analysts fail on thinking.</em>
      </h1>
      <p className="text-ink2 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10">
        The Swiggy Orders Investigation is a 3-phase case study that teaches structured analytical reasoning — the skill that separates ₹18L candidates from ₹28L ones.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        <PhasePill phase={1} /><PhasePill phase={2} /><PhasePill phase={3} />
      </div>
      <a
        href="/case-studies/swiggy"
        className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-white font-medium rounded-xl text-base hover:bg-accent-dark hover:-translate-y-px transition-all duration-150"
      >
        Start the Swiggy case study — free <span>→</span>
      </a>
      <p className="text-ink3 text-xs mt-4">No signup required · 45 minutes · Portfolio link at the end</p>
    </section>

    {/* WHAT YOU GET */}
    <section className="max-w-3xl mx-auto px-5 pb-20">
      <div className="bg-ink rounded-2xl p-7 md:p-10">
        <MonoLabel color="text-white/40" className="mb-5">What you get after 45 minutes</MonoLabel>
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {[
            { icon: '📊', title: 'Real analytical skill', body: 'Decompose a business problem, form hypotheses, and communicate findings to a VP.' },
            { icon: '💻', title: 'Proof of work', body: 'A shareable portfolio page with your queries, reasoning, and evaluation — ready for recruiters.' },
            { icon: '🎯', title: 'Honest feedback', body: 'A senior Swiggy analyst reviews your work and tells you exactly what you got right and missed.' },
          ].map(({ icon, title, body }) => (
            <div key={title}>
              <p className="text-2xl mb-2">{icon}</p>
              <p className="text-white font-medium text-sm mb-1">{title}</p>
              <p className="text-white/50 text-xs leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <a href="/case-studies/swiggy" className="block w-full text-center py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-dark transition-colors text-sm">
          Start now — it is free →
        </a>
      </div>
    </section>

    {/* THREE PHASES */}
    <section className="max-w-3xl mx-auto px-5 pb-20">
      <MonoLabel className="mb-8 text-center flex justify-center">How the case study works</MonoLabel>
      <div className="space-y-4">
        {PHASES.map(({ phase, title, desc, time }) => (
          <div key={phase} className="flex gap-5 bg-surface border border-border rounded-xl p-5">
            <div className="flex-shrink-0 pt-0.5"><PhasePill phase={phase} label={`Phase ${phase}`} /></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-ink text-sm">{title}</p>
                <span className="text-ink3 text-xs">{time}</span>
              </div>
              <p className="text-ink2 text-sm leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* HONEST CTA */}
    <section className="max-w-3xl mx-auto px-5 pb-24 text-center">
      <CalloutCard variant="accent" className="text-left mb-8">
        <p className="text-ink font-medium text-sm mb-1">No testimonials yet — we just launched.</p>
        <p className="text-ink2 text-sm">You would be one of the first 10 people to complete this. Your feedback shapes what gets built next.</p>
      </CalloutCard>
      <a href="/case-studies/swiggy" className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-white font-medium rounded-xl text-base hover:bg-accent-dark hover:-translate-y-px transition-all duration-150">
        Start the Swiggy case study <span>→</span>
      </a>
      <div className="mt-6 flex items-center justify-center gap-6 text-xs text-ink3">
        <span>Free · no signup</span>
        <span>·</span>
        <Link to="/jobs" className="hover:text-ink2 transition-colors">Browse analytics jobs →</Link>
      </div>
    </section>
  </div>
);

export default HomePage;