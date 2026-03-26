// src/components/case-study/SwiggyCase.jsx
// Root orchestrator — now with investigation dark mode, phase transitions,
// staggered animations, completion splashes, and ambient pressure.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCaseState } from './hooks/useCaseState.js';
import ProgressStrip from './shared/ProgressStrip.jsx';

import LandingSection    from './sections/LandingSection.jsx';
import GapSection        from './sections/GapSection.jsx';
import ContextSection    from './sections/ContextSection.jsx';
import Phase1Section     from './sections/Phase1Section.jsx';
import P1SummarySection  from './sections/P1SummarySection.jsx';
import Phase2Section     from './sections/Phase2Section.jsx';
import PaywallSection    from './sections/PaywallSection.jsx';
import Phase3Section     from './sections/Phase3Section.jsx';
import DebriefSection    from './sections/DebriefSection.jsx';

const PROGRESS = {
  landing:   { pct: 2,   label: 'Getting started',             color: '#C84B0C' },
  gap:       { pct: 6,   label: 'Warm-up exercise',            color: '#C84B0C', time: '~2 min' },
  context:   { pct: 12,  label: 'Business briefing',           color: '#C84B0C', time: '~5 min' },
  phase1:    { pct: 20,  label: 'Phase 1 · Watching Arjun',    color: '#C84B0C', time: '~20 min' },
  p1summary: { pct: 48,  label: 'Phase 1 complete',            color: '#1A6B45' },
  phase2:    { pct: 52,  label: 'Phase 2 · Your investigation',color: '#4F80FF', time: '~25 min' },
  paywall:   { pct: 88,  label: 'Phase 2 complete',            color: '#3DD68C' },
  phase3:    { pct: 92,  label: 'Phase 3 · Open workbench',    color: '#3DD68C', time: '~10 min' },
  debrief:   { pct: 100, label: 'Case complete',               color: '#3DD68C' },
};

const DARK_SECTIONS = new Set(['phase2', 'phase3', 'paywall']);
const FULL_WIDTH_SECTIONS = new Set(['phase1', 'phase2', 'phase3']);

// ── Phase Transition Splash ───────────────────────────────────────────────────
function PhaseSplash({ phase, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  const config = {
    p1complete: {
      icon: '🔍',
      title: 'Phase 1 Complete',
      subtitle: 'You watched a senior analyst work live.',
      stat: 'Now it\'s your turn.',
      color: '#3DD68C',
      bg: 'from-[#0D0F14] to-[#111820]',
    },
    p2complete: {
      icon: '⚡',
      title: 'Root Cause Found',
      subtitle: 'Two causes. Quantified. Confirmed.',
      stat: 'That\'s the ₹28L move.',
      color: '#4F80FF',
      bg: 'from-[#0D0F14] to-[#0D1120]',
    },
  }[phase] || {};

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center bg-gradient-to-b ${config.bg}`}>
      <div className="splash-in text-center px-8">
        <div className="text-6xl mb-6 block">{config.icon}</div>
        <h2 className="font-serif text-4xl mb-3 font-semibold" style={{ color: config.color }}>
          {config.title}
        </h2>
        <p className="text-[#9BA3B8] text-lg mb-2">{config.subtitle}</p>
        <p className="font-mono text-[13px]" style={{ color: config.color }}>{config.stat}</p>
        <div className="mt-8 flex justify-center gap-1.5">
          {[0,1,2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
              style={{ background: config.color, animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Confetti ──────────────────────────────────────────────────────────────────
function Confetti() {
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2.5 + Math.random() * 2,
    color: ['#FF6B2B','#4F80FF','#3DD68C','#F5A623','#FF5A65','#A78BFA'][Math.floor(Math.random()*6)],
    size: 6 + Math.random() * 6,
    rotate: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 z-[300] pointer-events-none overflow-hidden">
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`,
          top: '-20px',
          width: p.size,
          height: p.size,
          background: p.color,
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          transform: `rotate(${p.rotate}deg)`,
          animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
        }} />
      ))}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function SwiggyCase() {
  const { state, update, reset, markBehaviour } = useCaseState();
  const journalRef   = useRef(null);
  const scrollTimeout = useRef(null);
  const [splash, setSplash]       = useState(null); // 'p1complete' | 'p2complete'
  const [showConfetti, setConfetti] = useState(false);

  const isDark = DARK_SECTIONS.has(state.section);
  const isFullWidth = FULL_WIDTH_SECTIONS.has(state.section);
  const isInvestigation = state.section === 'phase2';
  const progress = PROGRESS[state.section] || PROGRESS.landing;
  const showResume = !['landing','gap'].includes(state.section);

  // Scroll on section change
  useEffect(() => {
    const el = journalRef.current;
    if (!el) return;
    scrollTimeout.current = setTimeout(() => {
      el.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
    return () => clearTimeout(scrollTimeout.current);
  }, [state.section]);

  // Persist state
  useEffect(() => {
    try { localStorage.setItem('swiggy-case-progress', JSON.stringify(state)); } catch {}
  }, [state]);

  const goTo = useCallback((section) => update({ section }), [update]);

  const handleMarkBehaviour = useCallback((code, evidence, quality) => {
    markBehaviour(code, evidence, quality);
  }, [markBehaviour]);

  const handleQueryCount = useCallback(() => {
    update(prev => ({ ...prev, p2QueryCount: (prev?.p2QueryCount || 0) + 1 }));
  }, [update]);

  const handlePriyaMessage = useCallback((n, msg) => {
    update(prev => ({
      ...prev,
      [`priya${n}Sent`]: true,
      priyaMessages: [...(prev.priyaMessages || []), msg],
    }));
  }, [update]);

  // ── Section renderer ────────────────────────────────────────────────────────
  const renderSection = () => {
    switch (state.section) {
      case 'landing':
        return <LandingSection onStart={() => goTo('gap')} />;

      case 'gap':
        return <GapSection onDone={() => goTo('context')} />;

      case 'context':
        return <ContextSection onDone={() => goTo('phase1')} />;

      case 'phase1':
        return (
          <Phase1Section
            onDone={() => {
              update(prev => ({ ...prev, completedPhases: [...new Set([...(prev?.completedPhases||[]),1])] }));
              setSplash('p1complete');
            }}
            onMarkBehaviour={handleMarkBehaviour}
            onSavePrediction={(idx, answer) => {
              update(prev => ({ ...prev, p1Predictions: { ...(prev?.p1Predictions||{}), [idx]: answer } }));
            }}
          />
        );

      case 'p1summary':
        return (
          <P1SummarySection
            predictions={state?.p1Predictions || {}}
            onDone={(framework) => {
              update({ p1Framework: framework, p2StartTime: Date.now() });
              goTo('phase2');
            }}
          />
        );

      case 'phase2':
        return (
          <Phase2Section
            startTime={state.p2StartTime}
            priya1Sent={state.priya1Sent}
            priya2Sent={state.priya2Sent}
            onPriyaMessage={handlePriyaMessage}
            onTick={(s) => update(prev => ({ ...prev, p2ElapsedSeconds: s }))}
            onDone={(vpText) => {
              const elapsed = state?.p2StartTime ? Math.floor((Date.now() - state.p2StartTime) / 1000) : 0;
              update(prev => ({
                ...prev,
                p2ElapsedSeconds: elapsed,
                completedPhases: [...new Set([...(prev?.completedPhases||[]),2])],
                p2Answers: { ...(prev?.p2Answers||{}), 'p2-vp-ta': vpText || '' },
              }));
              setSplash('p2complete');
            }}
            onBehaviour={handleMarkBehaviour}
            onQueryCount={handleQueryCount}
            queryCount={state?.p2QueryCount || 0}
          />
        );

      case 'paywall':
        return (
          <PaywallSection
            vpText={state?.p2Answers?.['p2-vp-ta'] || ''}
            onUnlock={() => goTo('phase3')}
            onSkip={() => goTo('debrief')}
          />
        );

      case 'phase3':
        return (
          <Phase3Section
            onDone={(answers) => {
              update(prev => ({
                ...prev,
                p3Answers: { ...(prev?.p3Answers||{}), ...answers },
                completedPhases: [...new Set([...(prev?.completedPhases||[]),3])],
              }));
              setConfetti(true);
              setTimeout(() => setConfetti(false), 4500);
              goTo('debrief');
            }}
          />
        );

      case 'debrief':
        return <DebriefSection state={state} />;

      default:
        return <LandingSection onStart={() => goTo('gap')} />;
    }
  };

  return (
    <div className={`min-h-screen font-sans phase-bg-transition ${isDark ? 'investigation-mode' : ''}`}
      style={{ background: isDark ? '#0D0F14' : 'var(--bg)' }}>

      {/* Phase transition splash */}
      {splash && (
        <PhaseSplash
          phase={splash}
          onDone={() => {
            setSplash(null);
            if (splash === 'p1complete') goTo('p1summary');
            if (splash === 'p2complete') goTo('paywall');
          }}
        />
      )}

      {/* Confetti */}
      {showConfetti && <Confetti />}

      {/* ── Header ── */}
      <div className={`sticky top-0 z-50 backdrop-blur-sm border-b flex items-center justify-between px-5 py-3 transition-colors duration-700 ${
        isDark
          ? 'bg-[#0D0F14]/95 border-[#1E2330]'
          : 'bg-[var(--bg)]/95 border-[var(--border)]'
      }`}>
        <a href="/" className="font-serif text-xl" style={{ color: 'var(--ink)' }}>
          one<em className="not-italic" style={{ color: 'var(--accent)' }}>stop</em>careers
        </a>

        <div className="flex items-center gap-3">
          {isInvestigation && (
            <span className="flex items-center gap-1.5 font-mono text-[11px]" style={{ color: '#FF5A65' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A65] alert-pulse" />
              Incident open
            </span>
          )}
          <span className="inline-flex items-center px-2.5 py-1 rounded-full font-mono text-[10px] font-semibold border"
            style={{
              background: isDark ? 'rgba(255,255,255,0.05)' : 'var(--surface)',
              color: 'var(--ink2)',
              borderColor: 'var(--border)',
            }}>
            {state.section === 'landing' || state.section === 'gap' ? 'Case 01 · Free'
              : state.section === 'phase1' || state.section === 'p1summary' ? 'Phase 1 · Watch'
              : state.section === 'phase2' || state.section === 'paywall' ? 'Phase 2 · Practice'
              : state.section === 'phase3' ? 'Phase 3 · Execute'
              : 'Complete'}
          </span>
        </div>
      </div>

      {/* ── Progress strip ── */}
      <ProgressStrip pct={progress.pct} label={progress.label} color={progress.color} time={progress.time} dark={isDark} />

      {/* ── Resume banner ── */}
      {showResume && !['debrief','paywall'].includes(state.section) && (
        <div className="px-5 mt-4">
          <div className="max-w-4xl mx-auto px-4 py-3 rounded-xl flex items-center justify-between gap-3"
            style={{ background: 'var(--phase2-bg)', border: '1px solid var(--phase2-border)' }}>
            <p className="text-[13px]" style={{ color: 'var(--ink)' }}>You were partway through this case study.</p>
            <div className="flex gap-2">
              <button onClick={reset}
                className="px-3 py-1.5 text-[12px] rounded-lg transition-colors"
                style={{ border: '1px solid var(--border)', color: 'var(--ink2)', background: 'var(--bg)' }}>
                Start over
              </button>
              <button onClick={() => goTo(state.section)}
                className="px-3 py-1.5 text-[12px] rounded-lg transition-colors"
                style={{ background: 'var(--phase2)', color: 'white' }}>
                Continue →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Section ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.section}
          ref={journalRef}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {isFullWidth
            ? renderSection()
            : <div className="max-w-2xl mx-auto">{renderSection()}</div>
          }
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
