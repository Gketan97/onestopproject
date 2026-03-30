// src/components/strategy/StrategyCase.jsx
// CP11: Sprint 2 — Cognitive Workbench Layout
// PATCHED: Sprint 5 wiring applied
//
// CHANGES FROM CP10:
//   1. Phase 1 (triage) now renders inside CognitiveWorkbenchShell
//      - IncidentHUD replaces old ProgressBar + IncidentStatusBar for Phase 1
//      - Two-pane grid: Terminal (left 68%) + Strategy Pad (right 32%)
//      - ArjunSocraticChat moves into the Strategy Pad (right pane)
//      - Data blocks (KPI, Funnel, Cohort) unlock into Terminal (left pane)
//
//   2. useTerminalBlocks hook wired to ArjunSocraticChat via onMilestoneComplete
//      - Called with (milestoneIndex, { conclusion, funnelData }) after each milestone
//
//   3. ProgressBar retained for Phase 2 + Phase 3 (deepdive, master)
//      - Phase 2/3 use old single-column layout (AnalysisWorkbench, StrategyMemo)
//
//   4. IncidentHUD live loss counter: ₹19L base, ~₹1,200/sec tick
//
// SPRINT 5 CHANGES:
//   1. Added DecisionLog and TerminalScanline imports
//   2. Added expertAnalyses + showDecisionLog state, handleExpertAnalysesUpdate callback
//   3. handleMilestonesComplete now sets showDecisionLog(true)
//   4. onExpertAnalysesUpdate wired into ArjunSocraticChat
//   5. investigationLog state + onLogUpdate wired into ArjunSocraticChat
//   6. DecisionLog rendered in Phase 1 triage block with AnimatePresence
//   7. TerminalScanline added to CognitiveWorkbenchShell Terminal pane (see shell component)

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useStrategyState } from './hooks/useStrategyState.js';
import { useTerminalBlocks } from './hooks/useTerminalBlocks.jsx';
import CognitiveWorkbenchShell, { IncidentHUD, WorkbenchGrid, TerminalStack } from './components/CognitiveWorkbenchShell.jsx';
import ArjunSocraticChat from './components/ArjunSocraticChat.jsx';
import AnalysisWorkbench from './components/AnalysisWorkbench.jsx';
import StrategyMemo from './components/StrategyMemo.jsx';
import IncidentAlert from './components/IncidentAlert.jsx';
import DecisionLog from './components/DecisionLog.jsx';
import TerminalScanline from './components/TerminalScanline.jsx';

const ORANGE = '#FC8019';
const BLUE   = '#4F80FF';
const GREEN  = '#3DD68C';
const RED    = '#F38BA8';

const PROGRESS = {
  triage:   { pct: 30,  label: 'Phase 1 · Understand the Problem', color: ORANGE },
  deepdive: { pct: 62,  label: 'Phase 2 · Own the Investigation',   color: BLUE   },
  master:   { pct: 88,  label: 'Phase 3 · Impact & Memo',           color: GREEN  },
  complete: { pct: 100, label: 'Investigation Complete',             color: GREEN  },
};

// ── Progress bar — for Phase 2 and Phase 3 ────────────────────────────────────
function ProgressBar({ phase }) {
  const p = PROGRESS[phase] || PROGRESS.triage;
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'rgba(8,8,16,0.92)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 20px',
    }}>
      <div style={{ height: 2, background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          style={{ height: '100%', background: p.color, borderRadius: 1 }}
          animate={{ width: `${p.pct}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink3)' }}>{p.label}</p>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)' }}>{p.pct}% complete</p>
      </div>
    </div>
  );
}

// ── Phase splash screen — shown on phase transitions ──────────────────────────
function PhaseSplash({ config, onDone }) {
  React.useEffect(() => { const t = setTimeout(onDone, 2000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5,5,5,0.96)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} style={{ textAlign: 'center', padding: '0 24px' }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>{config.icon}</div>
        <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: config.color, marginBottom: 8 }}>{config.title}</h2>
        <p style={{ fontSize: 15, color: 'var(--ink2)', marginBottom: 6 }}>{config.subtitle}</p>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: config.color }}>{config.stat}</p>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 24 }}>
          {[0,1,2].map(i => <motion.div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: config.color }} animate={{ y: [-3,3,-3] }} transition={{ duration: 0.8, delay: i*0.15, repeat: Infinity }} />)}
        </div>
      </motion.div>
    </div>
  );
}

// ── Phase header — Phase 2 and Phase 3 ───────────────────────────────────────
function PhaseHeader({ num, title, color, onBack, backLabel }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <motion.button onClick={onBack} whileHover={{ x: -2 }} whileTap={{ scale: 0.96 }}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 0', marginBottom: 16, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink3)', transition: 'color 0.2s', letterSpacing: '0.04em' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--ink2)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--ink3)'}>
        <ArrowLeft size={13} />{backLabel}
      </motion.button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}18`, border: `1px solid ${color}30`, fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 800, color }}>{num}</div>
        <div>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Phase {num}</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>{title}</p>
        </div>
      </div>
    </div>
  );
}

// ── Retrieval moment — between Phase 1 and Phase 2 ────────────────────────────
function RetrievalMoment({ onComplete }) {
  const [answer, setAnswer]         = useState('');
  const [submitted, setSubmitted]   = useState(false);
  const [arjunReply, setArjunReply] = useState(null);
  const canSubmit = answer.trim().length >= 40;

  const handleSubmit = useCallback(() => {
    if (!canSubmit || submitted) return;
    setSubmitted(true);
    setTimeout(() => {
      setArjunReply("That's the shift. Before, you were looking for what changed. Now you're asking where, for whom, and since when — before you touch a single number. That's how senior analysts think. Phase 2 is a different incident. You're leading it.");
      setTimeout(() => onComplete(), 2800);
    }, 1200);
  }, [canSubmit, submitted, onComplete]);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ maxWidth: 680, margin: '0 auto', borderRadius: 20, overflow: 'hidden', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', backdropFilter: 'blur(16px)' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <motion.div animate={{ scale: [1,1.15,1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN, flexShrink: 0 }} />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GREEN }}>Phase 1 Complete</span>
      </div>
      <div style={{ padding: '24px 20px' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${BLUE}18`, border: `1px solid ${BLUE}35`, fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 800, color: BLUE }}>AJ</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Arjun</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: BLUE }}>Your thinking partner</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.7, marginBottom: 6 }}>Before we move to Phase 2 — one question.</p>
            <div style={{ padding: '14px 16px', borderRadius: 10, background: `${BLUE}08`, border: `1px solid ${BLUE}20` }}>
              <p style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
                You just worked through this incident from scratch. If you had to walk into the same situation cold tomorrow — what would you do in the first 10 minutes?
              </p>
            </div>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', lineHeight: 1.55, marginTop: 8 }}>Be specific. This becomes the opening line of your portfolio.</p>
          </div>
        </div>

        <AnimatePresence>
          {!submitted && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
              style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${canSubmit ? `${GREEN}40` : 'rgba(255,255,255,0.1)'}`, transition: 'border-color 0.25s' }}>
              <textarea value={answer} onChange={e => setAnswer(e.target.value)}
                placeholder="First I'd confirm the scope — is it only North Bangalore or wider? Then I'd look at the funnel to find exactly where people dropped..."
                rows={4} style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: 'none', outline: 'none', color: 'var(--ink)', fontFamily: 'var(--sans)', fontSize: 14, lineHeight: 1.65, resize: 'none', boxSizing: 'border-box' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: canSubmit ? GREEN : 'var(--ink3)' }}>{canSubmit ? '✓ Ready' : 'Keep going...'}</span>
                <motion.button onClick={handleSubmit} whileHover={canSubmit ? { scale: 1.06, y: -1 } : {}} whileTap={canSubmit ? { scale: 0.96 } : {}}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 20px', borderRadius: 8, background: canSubmit ? GREEN : 'rgba(255,255,255,0.05)', color: canSubmit ? '#fff' : 'var(--ink3)', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 700, border: 'none', cursor: canSubmit ? 'pointer' : 'default', transition: 'all 0.2s', boxShadow: canSubmit ? '0 2px 14px rgba(61,214,140,0.35)' : 'none' }}>
                  Lock it in <ArrowRight size={13} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {submitted && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
              <div style={{ maxWidth: '80%', padding: '12px 16px', borderRadius: 12, background: `${GREEN}14`, border: `1px solid ${GREEN}28`, borderBottomRightRadius: 3 }}>
                <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.65, margin: 0 }}>{answer}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {arjunReply && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${BLUE}18`, border: `1px solid ${BLUE}35`, fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 800, color: BLUE }}>AJ</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Arjun</span></div>
                <p style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.7, marginBottom: 12 }}>{arjunReply}</p>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <motion.div animate={{ scale: [1,1.2,1] }} transition={{ duration: 0.8, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: '50%', background: ORANGE }} />
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)' }}>Loading Phase 2...</span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

const SPLASH_CONFIGS = {
  phase2:   { icon: '🔍', title: 'Phase 1 complete.',    subtitle: "You've learned the method. Now you lead.", stat: 'Phase 2 → Own the Investigation', color: `var(--phase2)` },
  phase3:   { icon: '⚡', title: 'Patterns identified.', subtitle: 'You found the friction. Now size it.',    stat: 'Phase 3 → Impact Sizing & Memo',   color: `var(--green)`  },
  complete: { icon: '🏆', title: 'Investigation complete.', subtitle: 'Your memo is ready.',                 stat: 'Portfolio link generated.',          color: ORANGE },
};

// ── Main ──────────────────────────────────────────────────────────────────────
export default function StrategyCase() {
  const navigate = useNavigate();
  const { state, advanceTriage, advanceToMaster, update } = useStrategyState();
  const { terminalBlocks, unlockBlock } = useTerminalBlocks();

  const [splash, setSplash]                               = useState(null);
  const [milestonesComplete, setMilestonesComplete]       = useState(false);
  const [retrievalComplete, setRetrievalComplete]         = useState(false);
  const [showAlert, setShowAlert]                         = useState(state.phase === 'triage');
  const [currentMilestoneName, setCurrentMilestoneName]  = useState('SCOPE THE PROBLEM');

  // ── Sprint 5: expertAnalyses + DecisionLog state ──────────────────────────
  const [expertAnalyses, setExpertAnalyses]   = useState({});
  const [showDecisionLog, setShowDecisionLog] = useState(false);
  const [investigationLog, setInvestigationLog] = useState([]);

  // ── Sprint 5: callbacks ───────────────────────────────────────────────────
  const handleExpertAnalysesUpdate = useCallback((analyses) => {
    setExpertAnalyses(analyses);
  }, []);

  const handleAlertEnter         = useCallback(() => setShowAlert(false), []);

  // Sprint 5: also set showDecisionLog on milestones complete
  const handleMilestonesComplete = useCallback(() => {
    setMilestonesComplete(true);
    setShowDecisionLog(true);
  }, []);

  const handleRetrievalComplete  = useCallback(() => { setRetrievalComplete(true); setSplash('phase2'); }, []);
  const handleDeepDiveAdvance    = useCallback(() => setSplash('phase3'), []);
  const handleMemoComplete       = useCallback(() => setSplash('complete'), []);

  // CP11: Called by ArjunSocraticChat after each milestone completes.
  // milestoneIndex = newly active milestone (e.g. 1 = M2 now active = M1 just done)
  // conclusion = user's synthesis sentence (if any)
  const handleMilestoneAdvance = useCallback((milestoneName, milestoneIndex, conclusion) => {
    setCurrentMilestoneName(milestoneName);
    // Unlock Terminal block for the COMPLETED milestone (index - 1)
    const completedIndex = milestoneIndex - 1;
    if (completedIndex >= 0) {
      setTimeout(() => {
        unlockBlock(completedIndex, { conclusion });
      }, 600);
    }
  }, [unlockBlock]);

  // Also unlock M5 block (impact) when M5 completes (index 4)
  // This is handled by onMilestoneComplete being called for M5 → M6 advance
  // which triggers handleMilestoneAdvance with milestoneIndex=5 → completedIndex=4

  const handleBack = useCallback((fromPhase) => {
    if (fromPhase === 'triage')   navigate('/');
    if (fromPhase === 'deepdive') update({ phase: 'triage' });
    if (fromPhase === 'master')   update({ phase: 'deepdive' });
  }, [navigate, update]);

  // ── Phase 1 (triage) renders inside the CognitiveWorkbenchShell ──────────
  if (state.phase === 'triage' && !showAlert) {
    return (
      <>
        {/* Full-screen splash overlay */}
        <AnimatePresence>
          {splash && (
            <PhaseSplash config={SPLASH_CONFIGS[splash]} onDone={() => {
              const s = splash; setSplash(null);
              if (s === 'phase2') advanceTriage();
            }} />
          )}
        </AnimatePresence>

        {/* Cognitive Workbench Shell — wraps the entire Phase 1 experience */}
        <CognitiveWorkbenchShell
          milestoneName={currentMilestoneName}
          lossAmount={1900000}
          lossTickRate={1200}
          terminalBlocks={terminalBlocks}
          showHUD={true}
        >
          {/* Right Pane content: ArjunSocraticChat or RetrievalMoment */}
          <AnimatePresence mode="wait">
            {!milestonesComplete && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Sprint 5: onExpertAnalysesUpdate + onLogUpdate wired in */}
                <ArjunSocraticChat
                  phase="triage"
                  onVizRequest={() => {}}
                  onAdvance={handleMilestonesComplete}
                  onMilestoneAdvance={handleMilestoneAdvance}
                  onExpertAnalysesUpdate={handleExpertAnalysesUpdate}
                  onLogUpdate={setInvestigationLog}
                />
              </motion.div>
            )}

            {milestonesComplete && !retrievalComplete && (
              <motion.div
                key="retrieval"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <RetrievalMoment onComplete={handleRetrievalComplete} />
              </motion.div>
            )}
          </AnimatePresence>
        </CognitiveWorkbenchShell>

        {/* Sprint 5: Decision Log — generated on M6 completion */}
        <AnimatePresence>
          {showDecisionLog && (
            <DecisionLog
              investigationLog={investigationLog}
              expertAnalyses={expertAnalyses}
              scenario={{ company: 'Swiggy', city: 'North Bangalore', period: 'Tuesday WoW', drop: '8.3%', category: 'Biryani' }}
              onClose={() => setShowDecisionLog(false)}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  // ── Phase 1 alert (cold open) ─────────────────────────────────────────────
  if (state.phase === 'triage' && showAlert) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <IncidentAlert onEnter={handleAlertEnter} />
      </div>
    );
  }

  // ── Phase 2 + Phase 3 + Complete — single-column layouts ─────────────────
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <AnimatePresence>
        {splash && (
          <PhaseSplash config={SPLASH_CONFIGS[splash]} onDone={() => {
            const s = splash; setSplash(null);
            if (s === 'phase3') advanceToMaster();
          }} />
        )}
      </AnimatePresence>

      <ProgressBar phase={state.phase} />

      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '28px 24px 80px' }}>
        <AnimatePresence mode="wait">

          {/* Phase 2 */}
          {state.phase === 'deepdive' && (
            <motion.div key="deepdive" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
              <PhaseHeader num="02" title="Own the Investigation" color={BLUE} onBack={() => handleBack('deepdive')} backLabel="Back to Phase 1" />
              <AnalysisWorkbench onAdvance={handleDeepDiveAdvance} />
            </motion.div>
          )}

          {/* Phase 3 */}
          {state.phase === 'master' && (
            <motion.div key="master" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
              <PhaseHeader num="03" title="Impact Sizing & Strategic Memo" color={GREEN} onBack={() => handleBack('master')} backLabel="Back to Phase 2" />
              <StrategyMemo onComplete={handleMemoComplete} />
            </motion.div>
          )}

          {/* Complete */}
          {state.phase === 'complete' && (
            <motion.div key="complete" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ textAlign: 'center', padding: '40px 0' }}>
              <motion.button onClick={() => navigate('/')} whileHover={{ x: -2 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 0', marginBottom: 40, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink3)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--ink2)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--ink3)'}>
                <ArrowLeft size={13} />Back to home
              </motion.button>
              <div style={{ fontSize: 52, marginBottom: 20 }}>🏆</div>
              <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: ORANGE, marginBottom: 10 }}>You think like a Staff Analyst.</h2>
              <p style={{ fontSize: 15, color: 'var(--ink2)', maxWidth: 420, margin: '0 auto 32px', lineHeight: 1.65 }}>Your investigation memo is ready. Apply to the roles that need exactly this.</p>
              <a href="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 12, background: ORANGE, color: '#fff', fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
                Browse roles that hire for this →
              </a>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}