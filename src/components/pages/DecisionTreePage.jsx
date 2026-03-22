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

export default DecisionTreePage;
