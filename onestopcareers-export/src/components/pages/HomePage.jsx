// src/components/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { PhasePill, MonoLabel, CalloutCard } from '../ui/index.jsx';
import { ArrowRight, Clock, Award, Share2 } from 'lucide-react';

const PHASES = [
  {
    phase: 1,
    title: 'Watch',
    time: '~20 min',
    desc: 'A 10-year Swiggy analyst works a real incident live. You predict his next move before every step. See exactly how elite analysts decompose a problem.',
    color: 'border-phase1-border bg-phase1-bg',
    textColor: 'text-phase1',
  },
  {
    phase: 2,
    title: 'Practice',
    time: '~25 min',
    desc: 'Same company, different problem. Blank SQL editor. You write queries, hit dead ends, and find the root cause. Arjun evaluates what you actually wrote.',
    color: 'border-phase2-border bg-phase2-bg',
    textColor: 'text-phase2',
  },
  {
    phase: 3,
    title: 'Execute',
    time: '~10 min',
    desc: 'Open workbench. Open questions. Design the analysis, quantify the trade-off, write the VP message. Closest thing to the real job.',
    color: 'border-phase3-border bg-phase3-bg',
    textColor: 'text-phase3',
  },
];

const OUTCOMES = [
  { icon: <Award size={16} />, title: 'Real analytical skill', desc: 'Decompose a business problem, form hypotheses, communicate findings to a VP — under time pressure.' },
  { icon: <Share2 size={16} />, title: 'Portfolio proof', desc: 'A shareable URL with your queries, reasoning, and AI evaluation — ready to paste into your resume.' },
  { icon: <Clock size={16} />, title: 'Interview readiness', desc: 'The 6 most common analytics interview questions, answered through lived experience — not memorised frameworks.' },
];

const IQ_QUESTIONS = [
  '"Walk me through a metric drop investigation."',
  '"How do you distinguish correlation from causation?"',
  '"Tell me about a time you were wrong mid-investigation."',
  '"How would you improve Swiggy\'s restaurant ranking?"',
];

const HomePage = () => (
  <div className="min-h-screen bg-bg font-sans">

    {/* ── HERO ── */}
    <section className="max-w-2xl mx-auto px-5 pt-16 pb-12 md:pt-24 md:pb-16 text-center">
      <MonoLabel className="mb-4 flex justify-center">
        Case 01 · Free · ~45 min · Swiggy Orders Investigation
      </MonoLabel>
      <h1 className="font-serif text-[clamp(2rem,6vw,3.5rem)] text-ink leading-[1.06] tracking-tight mb-5">
        Analytics interviews test SQL.<br />
        <em className="not-italic text-accent">Analysts fail on thinking.</em>
      </h1>
      <p className="text-ink2 text-base md:text-lg leading-relaxed max-w-lg mx-auto mb-8">
        A 3-phase case study that teaches structured analytical reasoning — the skill that separates ₹18L candidates from ₹28L ones.
      </p>

      {/* Phase pills as a teaser */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        <PhasePill phase={1} />
        <span className="text-border2 text-sm">→</span>
        <PhasePill phase={2} />
        <span className="text-border2 text-sm">→</span>
        <PhasePill phase={3} />
      </div>

      <a
        href="/case-study/swiggy"
        className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-medium rounded-xl text-base hover:bg-accent-dark hover:-translate-y-px hover:shadow-accent transition-all duration-150"
      >
        Start the Swiggy case study — free
        <ArrowRight size={16} />
      </a>
      <p className="text-ink3 text-xs mt-3">No signup · 45 minutes · Portfolio link at the end</p>
    </section>

    {/* ── WHAT YOU GET ── */}
    <section className="max-w-2xl mx-auto px-5 pb-16">
      <div className="bg-ink rounded-2xl p-6 md:p-8">
        <MonoLabel color="text-white/40" className="mb-6">What you walk away with after 45 minutes</MonoLabel>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {OUTCOMES.map(({ icon, title, desc }) => (
            <div key={title}>
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 mb-3">
                {icon}
              </div>
              <p className="text-white font-medium text-sm mb-1">{title}</p>
              <p className="text-white/45 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <a
          href="/case-study/swiggy"
          className="block w-full text-center py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-dark transition-colors text-sm"
        >
          Start now — free →
        </a>
      </div>
    </section>

    {/* ── THREE PHASES ── */}
    <section className="max-w-2xl mx-auto px-5 pb-16">
      <MonoLabel className="mb-6 flex justify-center">How the case study works</MonoLabel>
      <div className="space-y-3">
        {PHASES.map(({ phase, title, desc, time, color, textColor }) => (
          <div key={phase} className={`flex gap-4 border rounded-xl p-5 ${color}`}>
            <div className="flex-shrink-0 pt-0.5">
              <PhasePill phase={phase} label={`Phase ${phase} · ${title}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <p className={`font-mono text-[10px] font-semibold tracking-widest uppercase ${textColor}`}>{time}</p>
              </div>
              <p className="text-ink2 text-sm leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* ── INTERVIEW QUESTIONS ── */}
    <section className="max-w-2xl mx-auto px-5 pb-16">
      <MonoLabel className="mb-4 flex justify-center">6 interview questions this case prepares</MonoLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {IQ_QUESTIONS.map((q) => (
          <div key={q} className="text-xs text-ink2 bg-surface border border-border rounded-lg px-4 py-3 leading-relaxed">
            {q}
          </div>
        ))}
        <div className="text-xs text-ink3 bg-surface border border-dashed border-border2 rounded-lg px-4 py-3 leading-relaxed col-span-1 sm:col-span-2 text-center">
          + 2 more inside the case study
        </div>
      </div>
    </section>

    {/* ── HONEST CTA ── */}
    <section className="max-w-2xl mx-auto px-5 pb-24 text-center">
      <CalloutCard variant="accent" className="text-left mb-8">
        <p className="text-ink font-medium text-sm mb-1">No testimonials yet — this just launched.</p>
        <p className="text-ink2 text-sm">You'd be one of the first to complete this. At the end you get a real shareable portfolio URL. Your feedback shapes what gets built next.</p>
      </CalloutCard>
      <a
        href="/case-study/swiggy"
        className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-medium rounded-xl text-base hover:bg-accent-dark hover:-translate-y-px hover:shadow-accent transition-all duration-150"
      >
        Start the Swiggy case study
        <ArrowRight size={16} />
      </a>
      <div className="mt-5 flex items-center justify-center gap-5 text-xs text-ink3">
        <span>Free · no signup</span>
        <span>·</span>
        <Link to="/jobs" className="hover:text-ink2 transition-colors">Browse analytics jobs →</Link>
      </div>
    </section>
  </div>
);

export default HomePage;
