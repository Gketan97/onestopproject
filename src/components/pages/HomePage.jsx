<<<<<<< Updated upstream
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { decisionTree } from '../../data/appData';

const RESULT_COPY = {
  job_hunt: {
    headline: 'Your job search is disorganised.',
    body: "The Swiggy case study teaches the thinking pattern that gets you noticed — structured root cause analysis under pressure. It's the skill interviewers can't ignore.",
    cta: 'Start Swiggy case study',
  },
  interview: {
    headline: "You're not passing interviews.",
    body: 'Most candidates fail on structured thinking, not SQL. The Swiggy case study simulates the exact kind of question where candidates fall short — and fixes it.',
    cta: 'Start Swiggy case study',
  },
  upskilling: {
    headline: 'You need to build skills, not memorise them.',
    body: 'The Swiggy case study is active learning — you write real queries, hit real dead ends, and get evaluated on what you actually produce. Not a course. A simulation.',
    cta: 'Start Swiggy case study',
  },
  exploration: {
    headline: "You're still figuring out your path.",
    body: 'Starting with an investigation is the best move — it shows you whether analytical thinking energises you. 45 minutes will tell you more than a month of research.',
    cta: 'Try the Swiggy case study',
  },
};

const PHASE_STYLES = [
  { bg: '#FDF2EC', color: '#C84B0C', border: '#F2C4A5', label: 'Phase 1 · Watch' },
  { bg: '#EDF1FD', color: '#1E4FCC', border: '#A8B8F0', label: 'Phase 2 · Practice' },
  { bg: '#EDF6F1', color: '#1A6B45', border: '#A8D9BC', label: 'Phase 3 · Execute' },
];

const DecisionTreePage = () => {
  const [currentQuestionId, setCurrentQuestionId] = useState('start');
  const [resultKey, setResultKey] = useState(null);
  const [stepCount, setStepCount] = useState(1);

  const decisionTreeData = decisionTree['stage1'];
  const currentQuestion = decisionTreeData.find(q => q.id === currentQuestionId);

  const handleOptionClick = (nextId) => {
    if (!nextId) {
      const branch = currentQuestionId.split('_')[0];
      setResultKey(branch in RESULT_COPY ? branch : 'job_hunt');
    } else {
      setCurrentQuestionId(nextId);
      setStepCount(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentQuestionId('start');
    setResultKey(null);
    setStepCount(1);
  };

  // Result screen
  if (resultKey) {
    const result = RESULT_COPY[resultKey];
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <p className="label mb-3">Your diagnosis</p>
          <h2 className="font-serif text-3xl md:text-4xl text-ink leading-tight mb-4">
            {result.headline}
          </h2>
          <p className="text-ink2 text-base leading-relaxed mb-8">{result.body}</p>

          <div className="bg-ink rounded-xl p-6 mb-6">
            <p className="font-mono text-xs text-white/40 tracking-widest uppercase mb-4">Case 01 · Free · ~45 min</p>
            <p className="text-white font-medium text-base mb-1">Swiggy Orders Investigation</p>
            <p className="text-white/60 text-sm mb-5 leading-relaxed">
              3-phase case study. Watch a senior analyst work. Do it yourself. Execute under mock interview pressure.
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {PHASE_STYLES.map((p) => (
                <span
                  key={p.label}
                  className="font-mono text-[10px] font-semibold px-3 py-1 rounded-full"
                  style={{ background: p.bg, color: p.color, border: `1px solid ${p.border}` }}
                >
                  {p.label}
                </span>
              ))}
=======
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
>>>>>>> Stashed changes
            </div>
            <a
              href="/case-studies/swiggy"
              className="block w-full text-center py-3 px-6 bg-accent text-white font-medium rounded-lg hover:bg-accent-dark transition-all"
            >
              {result.cta} →
            </a>
          </div>

          <div className="flex items-center justify-between">
            <button onClick={handleReset} className="text-sm text-ink3 hover:text-ink2 transition-colors">
              ← Retake quiz
            </button>
            <Link to="/jobs" className="text-sm text-ink3 hover:text-ink2 transition-colors">
              Browse jobs instead →
            </Link>
          </div>
        </div>
<<<<<<< Updated upstream
      </div>
    );
  }

  // Fallback if question not found
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4 text-center">
        <h2 className="font-serif text-3xl text-ink mb-4">Thanks for your answers!</h2>
        <Link to="/" className="px-6 py-3 brand-button rounded-lg font-medium">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <p className="label mb-4">Career diagnosis</p>
          <p className="font-mono text-xs text-ink3">Question {stepCount}</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6 md:p-8 mb-4">
          <h2 className="font-serif text-xl md:text-2xl text-ink mb-6 leading-snug">
            {currentQuestion.question}
          </h2>
          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option.nextQuestionId)}
                className="w-full text-left px-5 py-4 bg-bg border border-border rounded-lg text-sm text-ink hover:border-accent hover:bg-accent-light transition-all duration-200 font-medium"
              >
                {option.text}
              </button>
            ))}
          </div>
          {currentQuestion.insight && (
            <p className="text-xs text-ink3 mt-5 italic">{currentQuestion.insight}</p>
          )}
        </div>

        <div className="text-center">
          <button onClick={handleReset} className="text-xs text-ink3 hover:text-ink2 transition-colors">
            ← Start over
          </button>
        </div>
      </div>
    </div>
  );
};
=======
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
>>>>>>> Stashed changes

export default DecisionTreePage;
