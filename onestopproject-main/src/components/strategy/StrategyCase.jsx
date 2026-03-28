// src/components/strategy/StrategyCase.jsx
// Clean orchestrator. No gates. No separate pages.
// PhaseOneIntro renders inline at the top of Phase 1 — collapses when done.
// After that, KpiScorecard + ArjunSocraticChat take over normally.

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStrategyState } from './hooks/useStrategyState.js';
import PhaseOneIntro from './components/PhaseOneIntro.jsx';
import KpiScorecard from './components/KpiScorecard.jsx';
import ArjunSocraticChat from './components/ArjunSocraticChat.jsx';
import AnalysisWorkbench from './components/AnalysisWorkbench.jsx';
import StrategyMemo from './components/StrategyMemo.jsx';

// ── Progress bar ──────────────────────────────────────────────────────────────
const PROGRESS = {
  triage:   { pct: 30,  label: 'Phase 1 · Ambiguity Triage',    color: 'var(--phase1)' },
  deepdive: { pct: 60,  label: 'Phase 2 · Deep Dive & Funnels', color: 'var(--phase2)' },
  master:   { pct: 85,  label: 'Phase 3 · Impact & Memo',       color: 'var(--green)'  },
  complete: { pct: 100, label: 'Investigation Complete',         color: 'var(--green)'  },
};

function ProgressBar({ phase }) {
  const p = PROGRESS[phase] || PROGRESS.triage;
  return (
    <div style={{
      position: 'sticky', top: 45, zIndex: 40,
      background: 'rgba(8,8,16,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '0 20px',
    }}>
      <div style={{ height: 2, background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          style={{ height: '100%', background: p.color, borderRadius: 1 }}
          animate={{ width: `${p.pct}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink3)' }}>
          {p.label}
        </p>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)' }}>
          {p.pct}% complete
        </p>
      </div>
    </div>
  );
}

// ── Phase splash ──────────────────────────────────────────────────────────────
function PhaseSplash({ config, onDone }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(5,5,5,0.96)',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: 'center', padding: '0 24px' }}
      >
        <div style={{ fontSize: 48, marginBottom: 20 }}>{config.icon}</div>
        <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: config.color, marginBottom: 8 }}>
          {config.title}
        </h2>
        <p style={{ fontSize: 15, color: 'var(--ink2)', marginBottom: 6 }}>{config.subtitle}</p>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: config.color }}>{config.stat}</p>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 24 }}>
          {[0, 1, 2].map(i => (
            <motion.div key={i}
              style={{ width: 6, height: 6, borderRadius: '50%', background: config.color }}
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ── Phase label ───────────────────────────────────────────────────────────────
function PhaseLabel({ num, title, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${color}18`, border: `1px solid ${color}30`,
        fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 800, color,
      }}>{num}</div>
      <div>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Phase {num}
        </p>
        <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>{title}</p>
      </div>
    </div>
  );
}

const SPLASH_CONFIGS = {
  phase2: {
    icon: '🔍', title: 'Triage complete.',
    subtitle: 'You scoped it right. Time to dig into the data.',
    stat: 'Phase 2 → Deep Dive & Funnel Analysis',
    color: 'var(--phase2)',
  },
  phase3: {
    icon: '⚡', title: 'Patterns identified.',
    subtitle: 'You found the friction. Now size it and write the call.',
    stat: 'Phase 3 → Impact Sizing & Strategic Memo',
    color: 'var(--green)',
  },
  complete: {
    icon: '🏆', title: 'Investigation complete.',
    subtitle: 'Your memo is ready. This is what Day-Zero readiness looks like.',
    stat: 'Recovery identified. Portfolio link generated.',
    color: '#FC8019',
  },
};

// ── Main ──────────────────────────────────────────────────────────────────────
export default function StrategyCase() {
  const { state, advanceTriage, advanceToMaster } = useStrategyState();
  const [splash, setSplash] = useState(null);
  const [vizType, setVizType] = useState(null);

  // PhaseOneIntro is shown at the top of Phase 1 until user completes it.
  // Not persisted — every session sees it. It collapses after ~3 minutes.
  const [introComplete, setIntroComplete] = useState(false);

  const handleTriageAdvance   = useCallback(() => setSplash('phase2'), []);
  const handleDeepDiveAdvance = useCallback(() => setSplash('phase3'), []);
  const handleMemoComplete    = useCallback(() => setSplash('complete'), []);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      <AnimatePresence>
        {splash && (
          <PhaseSplash
            config={SPLASH_CONFIGS[splash]}
            onDone={() => {
              const s = splash;
              setSplash(null);
              if (s === 'phase2') advanceTriage();
              if (s === 'phase3') advanceToMaster();
            }}
          />
        )}
      </AnimatePresence>

      <ProgressBar phase={state.phase} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 80px' }}>
        <AnimatePresence mode="wait">

          {/* ── Phase 1 ── */}
          {state.phase === 'triage' && (
            <motion.div key="triage"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
            >
              <PhaseLabel num="01" title="Ambiguity Triage" color="var(--phase1)" />

              {/* Inline diagnostic — collapses when done, then KpiScorecard loads */}
              <AnimatePresence>
                {!introComplete && (
                  <PhaseOneIntro onComplete={() => setIntroComplete(true)} />
                )}
              </AnimatePresence>

              {/* KpiScorecard appears after intro — user now has context to read it */}
              <AnimatePresence>
                {introComplete && (
                  <motion.div
                    key="phase1-content"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <KpiScorecard />
                    <ArjunSocraticChat
                      phase="triage"
                      onVizRequest={setVizType}
                      onAdvance={handleTriageAdvance}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ── Phase 2 ── */}
          {state.phase === 'deepdive' && (
            <motion.div key="deepdive"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
            >
              <PhaseLabel num="02" title="Deep Dive & Funnel Analysis" color="var(--phase2)" />
              <AnalysisWorkbench onAdvance={handleDeepDiveAdvance} />
            </motion.div>
          )}

          {/* ── Phase 3 ── */}
          {state.phase === 'master' && (
            <motion.div key="master"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
            >
              <PhaseLabel num="03" title="Impact Sizing & Strategic Memo" color="var(--green)" />
              <StrategyMemo onComplete={handleMemoComplete} />
            </motion.div>
          )}

          {/* ── Complete ── */}
          {state.phase === 'complete' && (
            <motion.div key="complete"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ textAlign: 'center', padding: '40px 0' }}
            >
              <div style={{ fontSize: 52, marginBottom: 20 }}>🏆</div>
              <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--phase1)', marginBottom: 10 }}>
                You think like a Staff Analyst.
              </h2>
              <p style={{ fontSize: 15, color: 'var(--ink2)', maxWidth: 420, margin: '0 auto 32px', lineHeight: 1.65 }}>
                Your investigation memo is ready. Apply to the roles that need exactly this.
              </p>
              <a href="/jobs" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', borderRadius: 12,
                background: 'var(--phase1)', color: '#fff',
                fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 700,
                textDecoration: 'none',
              }}>
                Browse roles that hire for this →
              </a>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}