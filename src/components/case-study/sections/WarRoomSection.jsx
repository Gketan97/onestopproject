/**
 * WarRoomSection.jsx
 * The Strategic Incident Simulator — 6-milestone war room.
 * Integrates: LayoutEngine, DiagnosticHero (skipped here — done upstream),
 * ArjunMentor, StrategicWorkbench.
 * Import paths are relative from sections/ folder.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LayoutEngine, { StreamBlock, GateButton, useEngine } from '../LayoutEngine.jsx';
import ArjunMentor    from '../ArjunMentor.jsx';
import StrategicWorkbench from '../StrategicWorkbench.jsx';
import { useArjun }   from '../hooks/useArjun.js';

// ── Shared primitives ─────────────────────────────────────────────────────────
function SectionLabel({ num, label, color = '#FC8019' }) {
  return (
    <div className="flex items-center gap-3 mb-6" data-milestone={label.toLowerCase().replace(/\s+/g, '-')}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-[11px] font-bold flex-shrink-0"
        style={{ background: `${color}15`, border: `1px solid ${color}30`, color }}>
        {num}
      </div>
      <div className="flex items-center gap-3 flex-1">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color }}>
          Milestone {num} · {label}
        </span>
        <div className="flex-1 h-px" style={{ background: `${color}20` }} />
      </div>
    </div>
  );
}

function GlassCard({ children, className = '', color = 'rgba(255,255,255,0.06)' }) {
  return (
    <div className={`rounded-2xl p-5 ${className}`}
      style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid ${color}`, backdropFilter: 'blur(12px)' }}>
      {children}
    </div>
  );
}

function IncidentBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
      style={{ background: 'rgba(255,90,101,0.08)', border: '1px solid rgba(255,90,101,0.25)' }}>
      <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: '#FF5A65' }}
        animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
      <span className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: '#FF5A65' }}>
        Incident Active · Swiggy Orders · North Bangalore
      </span>
    </div>
  );
}

// ── Milestone 1 — Metric Scoping ──────────────────────────────────────────────
function MilestoneMetric({ onComplete }) {
  const { callArjun } = useArjun();
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const METRIC_OPTIONS = [
    { id: 'a', label: 'Total orders (all statuses)',           correct: false, note: 'Includes cancellations — noisy signal.' },
    { id: 'b', label: 'Completed orders, same-day WoW',        correct: true,  note: 'Correct. Controls for day-of-week + excludes noise.' },
    { id: 'c', label: 'GMV (Gross Merchandise Value)',          correct: false, note: 'Mixes price changes with volume — decoupled.' },
    { id: 'd', label: 'Unique ordering users, 7-day rolling',  correct: false, note: "Useful but doesn't isolate frequency vs. acquisition." },
  ];

  const handleSelect = useCallback(async (opt) => {
    setSelected(opt.id); setRevealed(true);
    if (opt.correct) {
      await callArjun('Metric scoping correct', 'clarify');
      setTimeout(() => onComplete(), 600);
    }
  }, [callArjun, onComplete]);

  return (
    <div className="space-y-4">
      <GlassCard color="rgba(252,128,25,0.15)">
        <p className="font-mono text-[11px] uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Incident Brief · 09:18 AM IST
        </p>
        <p className="text-base font-semibold mb-3" style={{ color: 'white', lineHeight: 1.5 }}>
          Priya (VP, Growth) pings you:{' '}
          <span style={{ color: '#FC8019' }}>"Orders are down 8.3% WoW. I need root cause by EOD."</span>
        </p>
        <div className="rounded-xl px-4 py-3 font-mono text-xs"
          style={{ background: 'rgba(0,0,0,0.4)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ color: '#4F80FF' }}>prod.analytics</span>{' '}→{' '}
          <span style={{ color: '#3DD68C' }}>orders_summary</span>{' · '}
          <span style={{ color: '#F5A623' }}>ALERT: −8.3% WoW · Oct 21, 2024</span>
        </div>
      </GlassCard>
      <div>
        <p className="font-mono text-[11px] mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Before writing a single query — which metric do you scope to?
        </p>
        <div className="space-y-2">
          {METRIC_OPTIONS.map(opt => {
            const isSelected = selected === opt.id;
            const showResult = revealed && isSelected;
            return (
              <motion.button key={opt.id} onClick={() => !revealed && handleSelect(opt)}
                className="w-full text-left rounded-xl px-4 py-3.5 transition-all"
                style={{
                  background: showResult ? (opt.correct ? 'rgba(61,214,140,0.08)' : 'rgba(255,90,101,0.08)') : isSelected ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${showResult ? (opt.correct ? 'rgba(61,214,140,0.3)' : 'rgba(255,90,101,0.3)') : 'rgba(255,255,255,0.08)'}`,
                  cursor: revealed ? 'default' : 'pointer',
                }}
                whileHover={!revealed ? { borderColor: 'rgba(252,128,25,0.3)' } : {}}>
                <div className="flex items-start gap-3">
                  <span className="font-mono text-[10px] w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: showResult ? (opt.correct ? 'rgba(61,214,140,0.2)' : 'rgba(255,90,101,0.2)') : 'rgba(255,255,255,0.06)', color: showResult ? (opt.correct ? '#3DD68C' : '#FF5A65') : 'rgba(255,255,255,0.4)', border: `1px solid ${showResult ? (opt.correct ? 'rgba(61,214,140,0.3)' : 'rgba(255,90,101,0.3)') : 'rgba(255,255,255,0.1)'}` }}>
                    {opt.id.toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{opt.label}</p>
                    {showResult && (
                      <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                        className="font-mono text-[11px] mt-1" style={{ color: opt.correct ? '#3DD68C' : 'rgba(255,90,101,0.8)' }}>
                        {opt.correct ? '✓ ' : '✗ '}{opt.note}
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Milestone 2 — Data Sanity ─────────────────────────────────────────────────
function MilestoneSanity({ onComplete, onDirtyDataDetected }) {
  const [step, setStep] = useState(0);

  const DIRTY_WARNING = {
    message: "Wait. Before you declare a finding — have you checked what's upstream? The `prod.events` table in North Bangalore cluster has a known 4-hour logging lag. If any of this data was pulled in the last 4 hours, you're potentially missing 14,000 transactions. That's not a minor gap — that changes whether this is a 6% drop or an 8% drop.",
    technical: 'ENG-4821 · prod.events WHERE cluster=north_bangalore AND event_ts > NOW() - INTERVAL 4 HOUR → 0 rows (expected ≈14,000). Known BigQuery ingestion delay, ticket open since Oct 19.',
  };

  return (
    <div className="space-y-4">
      <GlassCard color="rgba(30,79,204,0.15)">
        <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: '#4F80FF' }}>Baseline Query Result</p>
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.4)' }}>
          <div className="px-3 py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
            <span className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>baseline_tuesday_wow.sql · 3 rows · 280ms</span>
          </div>
          <table className="w-full font-mono text-[11px]">
            <thead><tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              {['week', 'completed_orders', 'wow_change'].map(col => (
                <th key={col} className="px-3 py-2 text-left" style={{ color: '#4F80FF', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{col}</th>
              ))}
            </tr></thead>
            <tbody>
              {[['2024-10-07 (4w avg)', '2,180,000', 'baseline'], ['2024-10-14 (last Tue)', '2,114,000', '-3.0%'], ['2024-10-21 (this Tue)', '1,999,000', '-8.3% ⚠']].map((row, i) => (
                <motion.tr key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}
                  style={{ background: i === 2 ? 'rgba(255,90,101,0.06)' : 'transparent' }}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-2"
                      style={{ color: j === 2 && i === 2 ? '#FF5A65' : 'rgba(255,255,255,0.7)', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none', fontWeight: i === 2 ? 600 : 400 }}>
                      {cell}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {step === 0 && (
        <div className="space-y-3">
          <p className="font-mono text-[12px]" style={{ color: 'rgba(255,255,255,0.5)' }}>You see the 8.3% drop confirmed. What do you do next?</p>
          <div className="grid grid-cols-1 gap-2">
            {[
              { label: 'Check data pipeline health before proceeding', correct: true },
              { label: 'Start decomposing by user segment immediately', correct: false },
              { label: 'Share the numbers with Priya right away', correct: false },
            ].map(opt => (
              <motion.button key={opt.label}
                onClick={() => { if (opt.correct) { setStep(1); } else { setStep(2); onDirtyDataDetected?.(); } }}
                className="w-full text-left rounded-xl px-4 py-3 font-mono text-sm"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)' }}
                whileHover={{ borderColor: 'rgba(252,128,25,0.3)', color: 'rgba(255,255,255,0.9)' }}>
                <span style={{ color: '#FC8019', marginRight: 8 }}>{opt.correct ? '✓' : '→'}</span>
                {opt.label}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-xl p-4 border-l-2 mb-4"
            style={{ background: 'rgba(61,214,140,0.06)', border: '1px solid rgba(61,214,140,0.2)', borderLeft: '2px solid #3DD68C' }}>
            <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: '#3DD68C' }}>✓ Good instinct — pipeline check first</p>
            <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Arjun: "This is the move that separates analysts from engineers. You caught the logging lag before it corrupted your hypothesis. The 4-hour lag in North Bangalore adds ≈14,000 orders back. Your real drop is 6.1%, not 8.3%."
            </p>
          </div>
          <button onClick={onComplete} className="w-full py-3 rounded-xl font-mono text-sm font-bold text-white"
            style={{ background: '#FC8019', boxShadow: '0 4px 20px rgba(252,128,25,0.3)' }}>
            Data confirmed — continue to hypotheses →
          </button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(245,166,35,0.35)', background: 'rgba(245,166,35,0.04)' }}>
          <div className="px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(245,166,35,0.08)', borderBottom: '1px solid rgba(245,166,35,0.15)' }}>
            <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ color: '#F5A623', fontSize: 14 }}>⚠</motion.span>
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest" style={{ color: '#F5A623' }}>Arjun · Hard-Mode Intervention</span>
          </div>
          <div className="p-4">
            <p className="text-sm leading-relaxed italic mb-3" style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>"{DIRTY_WARNING.message}"</p>
            <div className="rounded-lg px-3 py-2 font-mono text-[11px] mb-4" style={{ background: 'rgba(0,0,0,0.4)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {DIRTY_WARNING.technical}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-xl font-mono text-sm font-bold"
                style={{ background: 'rgba(61,214,140,0.1)', border: '1px solid rgba(61,214,140,0.25)', color: '#3DD68C' }}>
                ✓ Go back — check pipeline
              </button>
              <button onClick={onComplete} className="px-4 py-2.5 rounded-xl font-mono text-sm"
                style={{ background: 'rgba(255,90,101,0.08)', border: '1px solid rgba(255,90,101,0.2)', color: '#FF5A65' }}>
                Proceed anyway*
              </button>
            </div>
            <p className="font-mono text-[10px] mt-2" style={{ color: 'rgba(255,90,101,0.5)' }}>* Hard mode: Arjun will flag this in your debrief</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ── Milestone 3 — Hypothesis MECE ─────────────────────────────────────────────
function MilestoneHypothesis({ onComplete }) {
  const [selected, setSelected] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);
  const { callArjun } = useArjun();

  const HYPOTHESES = [
    { id: 'h1', label: 'CRM notification suppression for returning users', bucket: 'Platform', correct: true },
    { id: 'h2', label: 'Restaurant quality degradation in Biryani segment', bucket: 'Supply',   correct: true },
    { id: 'h3', label: 'Zomato promotional pricing in North Bangalore',    bucket: 'External',  correct: true },
    { id: 'h4', label: 'Weather event causing delivery delays',            bucket: 'External',  correct: false },
    { id: 'h5', label: 'Price hike on Swiggy platform',                   bucket: 'Platform',  correct: false },
    { id: 'h6', label: 'New competitor launch',                           bucket: 'External',  correct: false },
  ];
  const BUCKET_COLORS = { Platform: '#A78BFA', Supply: '#4F80FF', External: '#F5A623' };

  const toggle = (id) => { if (submitted) return; setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); };

  const handleSubmit = async () => {
    setSubmitted(true);
    const correct = HYPOTHESES.filter(h => h.correct).every(h => selected.has(h.id));
    await callArjun('Hypothesis selection', correct ? 'external' : 'deadend');
    setTimeout(onComplete, 800);
  };

  return (
    <div className="space-y-4">
      <GlassCard>
        <p className="font-mono text-[11px] uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Arjun · Socratic Challenge</p>
        <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>
          "Before we touch the data — what are the hypotheses? MECE. Name every possible cause. Don't start with the most obvious one."
        </p>
      </GlassCard>
      <div>
        <p className="font-mono text-[11px] mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Select all hypotheses worth testing (pick your best 3):</p>
        <div className="space-y-2">
          {HYPOTHESES.map(h => {
            const isSelected = selected.has(h.id);
            const showResult = submitted;
            const color = BUCKET_COLORS[h.bucket] || '#FC8019';
            return (
              <motion.button key={h.id} onClick={() => toggle(h.id)}
                className="w-full text-left rounded-xl px-4 py-3 transition-all"
                style={{
                  background: showResult ? (h.correct && isSelected ? 'rgba(61,214,140,0.07)' : h.correct && !isSelected ? 'rgba(245,166,35,0.07)' : isSelected ? 'rgba(255,90,101,0.07)' : 'rgba(255,255,255,0.02)') : isSelected ? 'rgba(252,128,25,0.08)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${showResult ? (h.correct && isSelected ? 'rgba(61,214,140,0.3)' : h.correct && !isSelected ? 'rgba(245,166,35,0.3)' : isSelected ? 'rgba(255,90,101,0.25)' : 'rgba(255,255,255,0.06)') : isSelected ? 'rgba(252,128,25,0.3)' : 'rgba(255,255,255,0.07)'}`,
                }}
                whileHover={!submitted ? { borderColor: 'rgba(252,128,25,0.25)' } : {}}>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: isSelected ? 'rgba(252,128,25,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isSelected ? 'rgba(252,128,25,0.4)' : 'rgba(255,255,255,0.1)'}` }}>
                    {isSelected && <span style={{ color: '#FC8019', fontSize: 9 }}>✓</span>}
                  </div>
                  <span className="flex-1 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>{h.label}</span>
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ color, background: `${color}15`, border: `1px solid ${color}25` }}>{h.bucket}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
      {!submitted && selected.size >= 2 && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={handleSubmit}
          className="w-full py-3 rounded-xl font-mono text-sm font-bold text-white"
          style={{ background: '#FC8019', boxShadow: '0 4px 20px rgba(252,128,25,0.3)' }}>
          Lock in hypotheses →
        </motion.button>
      )}
    </div>
  );
}

// ── Milestone 4 — Synthesis ───────────────────────────────────────────────────
function MilestoneSynthesis({ onComplete, onDirtyData }) {
  const [synthesisText, setSynthesisText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { callArjun } = useArjun();

  return (
    <div className="space-y-5">
      <GlassCard color="rgba(252,128,25,0.12)">
        <p className="font-mono text-[11px] uppercase tracking-widest mb-1" style={{ color: '#FC8019' }}>Arjun · Your Turn</p>
        <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>
          "You have the hypotheses. Now get the evidence. Use the workbench — pull the funnel, the cohort matrix, the competitor data. Then tell me: what's the root cause?"
        </p>
      </GlassCard>
      <StrategicWorkbench phase={2} dirtyDataTriggered={false} onDirtyDataAck={(choice) => { if (choice === 'ignored') onDirtyData?.(); }} />
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.3)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>Root Cause Synthesis</p>
        </div>
        <div className="p-4">
          <p className="font-mono text-[11px] mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Based on your analysis: what are the root causes? (name them, with evidence)</p>
          <textarea value={synthesisText} onChange={e => setSynthesisText(e.target.value)}
            placeholder="Cause 1: ... because the data shows...&#10;Cause 2: ... evidenced by..."
            className="w-full min-h-[100px] rounded-xl px-4 py-3 outline-none font-mono text-sm leading-relaxed resize-y"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', fontSize: 12 }}
            onFocus={e => e.target.style.borderColor = 'rgba(252,128,25,0.4)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
          {!submitted && synthesisText.trim().split(/\s+/).length >= 15 && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={async () => { setSubmitted(true); await callArjun(`Root cause: ${synthesisText}`, 'causation'); setTimeout(onComplete, 600); }}
              className="mt-3 w-full py-3 rounded-xl font-mono text-sm font-bold text-white"
              style={{ background: '#FC8019', boxShadow: '0 4px 20px rgba(252,128,25,0.25)' }}>
              Submit synthesis →
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Milestone 5 — Impact Sizing ───────────────────────────────────────────────
function MilestoneImpact({ onComplete, dirtyIgnored }) {
  const [answer, setAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const { callArjun } = useArjun();

  const STAFF_SIZING = {
    cause1: { label: 'CRM suppression (returning users)',      monthly: '₹19.2L', calc: '181K users × 0.34 reorder prob × ₹312 AOV × 4.3 wks' },
    cause2: { label: 'Restaurant quality + Zomato promo',      monthly: '₹8.8L',  calc: '6,100 biryani orders/wk × 4.3 wks × ₹335 AOV × 32% shift' },
    total:  { label: 'Total monthly recovery opportunity',     monthly: '₹28L',   note: 'Validated against direct attribution query' },
  };

  return (
    <div className="space-y-4">
      {dirtyIgnored && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-xl p-3 flex items-start gap-2"
          style={{ background: 'rgba(255,90,101,0.06)', border: '1px solid rgba(255,90,101,0.2)' }}>
          <span style={{ color: '#FF5A65', fontSize: 12, flexShrink: 0, marginTop: 2 }}>⚠</span>
          <p className="font-mono text-[11px] leading-relaxed" style={{ color: 'rgba(255,90,101,0.8)' }}>
            You ignored the data sanity warning. Your impact sizing may be overstated by ≈1.5L/month due to the uncorrected logging lag.
          </p>
        </motion.div>
      )}
      <GlassCard color="rgba(61,214,140,0.12)">
        <p className="font-mono text-[11px] uppercase tracking-widest mb-1" style={{ color: '#3DD68C' }}>Arjun · The Stakes</p>
        <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>
          "Root cause is half the job. Your VP needs a number. How much are we losing per month? Work through it."
        </p>
      </GlassCard>
      {!revealed && (
        <div>
          <p className="font-mono text-[11px] mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Estimate the monthly revenue impact (both causes combined):</p>
          <textarea value={answer} onChange={e => setAnswer(e.target.value)}
            placeholder="My estimate: ₹___ per month because..."
            className="w-full min-h-[80px] rounded-xl px-4 py-3 outline-none font-mono text-sm leading-relaxed resize-y mb-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', fontSize: 12 }}
            onFocus={e => e.target.style.borderColor = 'rgba(61,214,140,0.4)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
          {answer.length > 10 && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={async () => { setRevealed(true); await callArjun(`Impact sizing: ${answer}`, 'funnel'); }}
              className="w-full py-2.5 rounded-xl font-mono text-sm font-bold"
              style={{ background: 'rgba(61,214,140,0.1)', border: '1px solid rgba(61,214,140,0.3)', color: '#3DD68C' }}>
              See staff-level sizing →
            </motion.button>
          )}
        </div>
      )}
      {revealed && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(61,214,140,0.2)', background: 'rgba(0,0,0,0.3)' }}>
            <div className="px-4 py-2.5 border-b" style={{ borderColor: 'rgba(61,214,140,0.15)', background: 'rgba(61,214,140,0.06)' }}>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: '#3DD68C' }}>Staff-Level Impact Sizing</p>
            </div>
            <div className="p-4 space-y-3">
              {Object.values(STAFF_SIZING).map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[12px] font-semibold" style={{ color: i === 2 ? '#3DD68C' : 'rgba(255,255,255,0.8)' }}>{s.label}</p>
                    {s.calc && <p className="font-mono text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.calc}</p>}
                    {s.note && <p className="font-mono text-[10px] mt-0.5" style={{ color: 'rgba(61,214,140,0.6)' }}>{s.note}</p>}
                  </div>
                  <span className="font-mono text-base font-bold flex-shrink-0" style={{ color: i === 2 ? '#3DD68C' : 'rgba(255,255,255,0.6)' }}>{s.monthly}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <button onClick={onComplete} className="w-full py-3 rounded-xl font-mono text-sm font-bold text-white"
            style={{ background: '#FC8019', boxShadow: '0 4px 20px rgba(252,128,25,0.3)' }}>
            Build the executive brief →
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ── Milestone 6 — Executive Brief ─────────────────────────────────────────────
function MilestoneExecutiveBrief({ onComplete }) {
  const [brief, setBrief]       = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { callArjun } = useArjun();

  const TEMPLATE = `Situation: Orders in [area] dropped [X]% WoW since [date].\nComplication: Root cause is [cause 1] + [cause 2].\nResolution: [Action] owned by [team] by [date] recovers ₹[X]L/month.`;

  const handleSubmit = async () => {
    setSubmitted(true);
    const fb = await callArjun(`VP brief: ${brief}`, 'vp');
    setFeedback(fb || '');
  };

  return (
    <div className="space-y-4">
      <GlassCard color="rgba(252,128,25,0.15)">
        <p className="font-mono text-[11px] uppercase tracking-widest mb-2" style={{ color: '#FC8019' }}>Final Challenge · Write to the VP</p>
        <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>
          "Priya has 90 seconds. She needs three things: what happened, why it happened, what you're doing about it and by when. Write it."
        </p>
      </GlassCard>
      <div className="rounded-xl p-3 font-mono text-[11px]"
        style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}>
        <p className="mb-1" style={{ color: 'rgba(255,255,255,0.2)' }}>Structure (S/C/R):</p>
        {TEMPLATE.split('\n').map((line, i) => <p key={i} style={{ color: 'rgba(255,255,255,0.4)' }}>{line}</p>)}
      </div>
      {!submitted ? (
        <>
          <textarea value={brief} onChange={e => setBrief(e.target.value)} placeholder="Write your executive brief here..."
            className="w-full min-h-[140px] rounded-xl px-4 py-3.5 outline-none font-mono text-sm leading-relaxed resize-y"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}
            onFocus={e => e.target.style.borderColor = 'rgba(252,128,25,0.4)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
          {brief.trim().split(/\s+/).length >= 30 && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={handleSubmit}
              className="w-full py-3.5 rounded-xl font-mono text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #FC8019, #e06a0e)', boxShadow: '0 8px 32px rgba(252,128,25,0.35)' }}>
              Submit to Arjun →
            </motion.button>
          )}
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="rounded-xl px-4 py-3 border-l-2"
            style={{ background: 'rgba(30,79,204,0.07)', border: '1px solid rgba(30,79,204,0.2)', borderLeft: '2px solid #4F80FF' }}>
            <p className="font-mono text-[10px] mb-1.5" style={{ color: '#4F80FF' }}>Your brief</p>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>{brief}</p>
          </div>
          {feedback && (
            <div className="rounded-xl px-4 py-3.5 border-l-2"
              style={{ background: 'rgba(252,128,25,0.06)', border: '1px solid rgba(252,128,25,0.2)', borderLeft: '2px solid #FC8019' }}>
              <p className="font-mono text-[10px] mb-1.5" style={{ color: '#FC8019' }}>Arjun's evaluation</p>
              <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>{feedback}</p>
            </div>
          )}
          {feedback && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={() => onComplete({ brief, feedback })}
              className="w-full py-3.5 rounded-xl font-mono text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, rgba(61,214,140,0.15), rgba(30,79,204,0.12))', border: '1px solid rgba(61,214,140,0.3)', color: '#3DD68C' }}>
              🎖 Complete the War Room →
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ── Inner Stream ──────────────────────────────────────────────────────────────
function WarRoomStream({ onDone }) {
  const { revealBlock } = useEngine();
  const [dirtyDataIgnored, setDirtyDataIgnored] = useState(false);

  const complete = useCallback((milestoneId, nextBlockId) => {
    if (nextBlockId) revealBlock(nextBlockId);
  }, [revealBlock]);

  useEffect(() => { revealBlock('m1-block'); }, [revealBlock]);

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 space-y-12">

      <div data-milestone="metric">
        <StreamBlock id="m1-block" milestoneId="metric" skipFog>
          <SectionLabel num={1} label="Metric Scoping" color="#FC8019" />
          <IncidentBadge />
          <MilestoneMetric onComplete={() => complete('metric', 'm2-block')} />
        </StreamBlock>
      </div>

      <div data-milestone="sanity">
        <StreamBlock id="m2-block" milestoneId="sanity">
          <SectionLabel num={2} label="Data Sanity" color="#F5A623" />
          <MilestoneSanity
            onComplete={() => complete('sanity', 'm3-block')}
            onDirtyDataDetected={() => setDirtyDataIgnored(true)}
          />
        </StreamBlock>
      </div>

      <div data-milestone="hypothesis">
        <StreamBlock id="m3-block" milestoneId="hypothesis">
          <SectionLabel num={3} label="Hypothesis MECE" color="#A78BFA" />
          <div className="mb-5">
            <ArjunMentor milestone="hypothesis" dirtyDataEnabled={false}
              initialMessages={[{ from: 'arjun', text: 'Good — data is clean. Now structure your hypotheses before touching the evidence. Why does this order matter?', time: '09:31' }]} />
          </div>
          <MilestoneHypothesis onComplete={() => complete('hypothesis', 'm4-block')} />
        </StreamBlock>
      </div>

      <div data-milestone="synthesis">
        <StreamBlock id="m4-block" milestoneId="synthesis">
          <SectionLabel num={4} label="Synthesis" color="#4F80FF" />
          <MilestoneSynthesis
            onComplete={() => complete('synthesis', 'm5-block')}
            onDirtyData={() => setDirtyDataIgnored(true)}
          />
        </StreamBlock>
      </div>

      <div data-milestone="impact">
        <StreamBlock id="m5-block" milestoneId="impact">
          <SectionLabel num={5} label="Impact Sizing" color="#3DD68C" />
          <MilestoneImpact dirtyIgnored={dirtyDataIgnored} onComplete={() => complete('impact', 'm6-block')} />
        </StreamBlock>
      </div>

      <div data-milestone="brief">
        <StreamBlock id="m6-block" milestoneId="brief">
          <SectionLabel num={6} label="Executive Brief" color="#FC8019" />
          <MilestoneExecutiveBrief
            onComplete={(result) => { complete('brief', null); setTimeout(() => onDone?.(result), 600); }}
          />
        </StreamBlock>
      </div>

    </div>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export default function WarRoomSection({ onDone }) {
  return (
    <div className="min-h-screen" style={{ background: '#050505' }}>
      <LayoutEngine initialMilestone="metric" className="min-h-screen">
        <WarRoomStream onDone={onDone} />
      </LayoutEngine>
    </div>
  );
}
