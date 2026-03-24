// src/components/case-study/SwiggyCase.jsx

import React, { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCaseState } from './hooks/useCaseState.js';
import ProgressStrip from './shared/ProgressStrip.jsx';

import LandingSection from './sections/LandingSection.jsx';
import GapSection from './sections/GapSection.jsx';
import ContextSection from './sections/ContextSection.jsx';
import Phase1Section from './sections/Phase1Section.jsx';
import P1SummarySection from './sections/P1SummarySection.jsx';
import Phase2Section from './sections/Phase2Section.jsx';
import PaywallSection from './sections/PaywallSection.jsx';
import Phase3Section from './sections/Phase3Section.jsx';
import DebriefSection from './sections/DebriefSection.jsx';

const PROGRESS = {
  landing: { pct: 2, label: 'Getting started', color: '#C84B0C' },
  gap: { pct: 6, label: 'Warm-up exercise', color: '#C84B0C', time: '~2 min' },
  context: { pct: 12, label: 'Business briefing', color: '#C84B0C', time: '~5 min' },
  phase1: { pct: 20, label: 'Phase 1 · Watching Arjun', color: '#C84B0C', time: '~20 min' },
  p1summary: { pct: 48, label: 'Phase 1 complete', color: '#1A6B45' },
  phase2: { pct: 52, label: 'Phase 2 · Your investigation', color: '#1E4FCC', time: '~25 min' },
  paywall: { pct: 88, label: 'Phase 2 complete', color: '#1A6B45' },
  phase3: { pct: 92, label: 'Phase 3 · Open workbench', color: '#1A6B45', time: '~10 min' },
  debrief: { pct: 100, label: 'Case complete', color: '#1A6B45' },
};

const FULL_WIDTH_SECTIONS = ['phase1', 'phase2', 'phase3'];

export default function SwiggyCase() {
  const { state, update, reset, markBehaviour } = useCaseState();
  const journalRef = useRef(null);
  const scrollTimeout = useRef(null);

  /* ───────────────────────── Scroll handling ───────────────────────── */

  useEffect(() => {
    const el = journalRef.current;

    if (!el) return;

    scrollTimeout.current = setTimeout(() => {
      const target = el.lastElementChild;
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);

    return () => clearTimeout(scrollTimeout.current);
  }, [state.section]);

  /* ───────────────────────── Persistence ───────────────────────── */

  useEffect(() => {
    try {
      localStorage.setItem('swiggy-case-progress', JSON.stringify(state));
    } catch {}
  }, [state]);

  /* ───────────────────────── Navigation helpers ───────────────────────── */

  const goTo = useCallback(
    (section) => {
      update({ section });
    },
    [update]
  );

  const progress = PROGRESS[state.section] || PROGRESS.landing;
  const showResume = state.section !== 'landing' && state.section !== 'gap';
  const isFullWidth = FULL_WIDTH_SECTIONS.includes(state.section);
  const isInvestigation = state.section === 'phase2';

  const handleMarkBehaviour = useCallback(
    (code, evidence, quality) => {
      markBehaviour(code, evidence, quality);
    },
    [markBehaviour]
  );

  const handleQueryCount = useCallback(() => {
    update((prev) => ({
      ...prev,
      p2QueryCount: (prev?.p2QueryCount || 0) + 1,
    }));
  }, [update]);

  const handlePriyaMessage = useCallback(
    (n) => {
      update((prev) => ({
        ...prev,
        [`priya${n}Sent`]: true,
      }));
    },
    [update]
  );

  /* ───────────────────────── Section renderer ───────────────────────── */

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
              update((prev) => ({
                ...prev,
                completedPhases: [...new Set([...(prev?.completedPhases || []), 1])],
              }));
              goTo('p1summary');
            }}
            onMarkBehaviour={handleMarkBehaviour}
            onSavePrediction={(idx, answer) => {
              update((prev) => ({
                ...prev,
                p1Predictions: {
                  ...(prev?.p1Predictions || {}),
                  [idx]: answer,
                },
              }));
            }}
          />
        );

      case 'p1summary':
        return (
          <P1SummarySection
            predictions={state?.p1Predictions || {}}
            onDone={(framework) => {
              update({
                p1Framework: framework,
                p2StartTime: Date.now(),
              });
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
            onDone={(vpText) => {
              const elapsed = state?.p2StartTime
                ? Math.floor((Date.now() - state.p2StartTime) / 1000)
                : 0;

              update((prev) => ({
                ...prev,
                p2ElapsedSeconds: elapsed,
                completedPhases: [...new Set([...(prev?.completedPhases || []), 2])],
                p2Answers: {
                  ...(prev?.p2Answers || {}),
                  'p2-vp-ta': vpText || '',
                },
              }));

              goTo('paywall');
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
              update((prev) => ({
                ...prev,
                p3Answers: {
                  ...(prev?.p3Answers || {}),
                  ...answers,
                },
                completedPhases: [...new Set([...(prev?.completedPhases || []), 3])],
              }));
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

  /* ───────────────────────── UI ───────────────────────── */

  return (
    <div className="min-h-screen bg-bg font-sans">

      {/* Header */}
      <div className="sticky top-0 z-50 bg-bg/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-5 py-3">

        <a href="/" className="font-serif text-xl text-ink">
          one<em className="text-accent not-italic">stop</em>careers
        </a>

        <div className="flex items-center gap-3">

          {isInvestigation && (
            <span className="font-mono text-[11px] text-phase2">
              Investigation running
            </span>
          )}

          <span className="inline-flex items-center px-2.5 py-1 rounded-full font-mono text-[10px] font-semibold border bg-surface text-ink2 border-border">
            {state.section === 'landing' || state.section === 'gap'
              ? 'Case 01 · Free'
              : state.section === 'phase1' || state.section === 'p1summary'
              ? 'Phase 1 · Watch'
              : state.section === 'phase2' || state.section === 'paywall'
              ? 'Phase 2 · Practice'
              : state.section === 'phase3'
              ? 'Phase 3 · Execute'
              : 'Complete'}
          </span>

        </div>
      </div>

      {/* Progress */}
      <ProgressStrip
        pct={progress.pct}
        label={progress.label}
        color={progress.color}
        time={progress.time}
      />

      {/* Resume Banner */}
      {showResume && state.section !== 'debrief' && (
        <div className="px-5 mt-4">
          <div className="max-w-4xl mx-auto px-4 py-3 bg-phase2-bg border border-phase2-border rounded-xl flex items-center justify-between gap-3">

            <p className="text-[13px] text-ink">
              You were partway through this case study.
            </p>

            <div className="flex gap-2">

              <button
                onClick={reset}
                className="px-3 py-1.5 text-[12px] border border-border bg-bg rounded-lg text-ink2 hover:bg-surface transition-colors"
              >
                Start over
              </button>

              <button
                onClick={() => goTo(state.section)}
                className="px-3 py-1.5 text-[12px] bg-phase2 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue →
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Sections with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.section}
          ref={journalRef}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
        >
          {isFullWidth ? (
            renderSection()
          ) : (
            <div className="max-w-2xl mx-auto">
              {renderSection()}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}