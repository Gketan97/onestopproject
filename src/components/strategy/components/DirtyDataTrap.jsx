// src/components/strategy/components/DirtyDataTrap.jsx
// Phase 2 — "Dirty Data" trap component.
//
// Behaviour:
//   1. User receives P2_KPI_DIRTY dataset by default (West + Central only).
//   2. A sanity-check CTA appears after first data view: "Does this look right?"
//   3. If user submits an interpretation WITHOUT flagging the session anomaly:
//      → Arjun fires Hard-Mode intervention (reveal modal).
//   4. If user correctly flags the session count discrepancy:
//      → Arjun praises + unlocks P2_KPI_CLEAN dataset.
//   5. Clean dataset is clearly labelled — user continues with full partition.
//
// Props:
//   onDataVerified(cleanKpi) — called once user has verified / been corrected
//   onHardModeTriggered()   — optional callback to notify parent

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Database, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';
import {
  P2_KPI_DIRTY,
  P2_KPI_CLEAN,
  P2_SANITY_CHECK,
  P2_ARJUN_HARDMODE,
} from '../data/swiggyStrategyData.js';

const ORANGE = '#FC8019';
const RED    = '#F38BA8';
const GREEN  = '#3DD68C';
const BLUE   = '#4F80FF';
const YELLOW = '#F9E2AF';

// ── Typewriter ────────────────────────────────────────────────────────────────
function useTypewriter(text, speed = 12, trigger = true) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone]           = useState(false);
  const idx = useRef(0);
  useEffect(() => {
    if (!trigger || !text) { setDisplayed(text || ''); setDone(true); return; }
    idx.current = 0; setDisplayed(''); setDone(false);
    const iv = setInterval(() => {
      idx.current += 1;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed, trigger]);
  return { displayed, done };
}

// ── Mini Avatar ───────────────────────────────────────────────────────────────
function Avatar({ initials, color, size = 28 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 7, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--mono)', fontSize: size * 0.32, fontWeight: 800,
      background: `${color}18`, border: `1px solid ${color}38`, color,
    }}>
      {initials}
    </div>
  );
}

// ── Arjun message with typewriter ─────────────────────────────────────────────
function ArjunLine({ text, isNew = true, color = ORANGE }) {
  const { displayed, done } = useTypewriter(text, 12, isNew);
  return (
    <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
      <Avatar initials="AJ" color={ORANGE} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 3, alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: ORANGE }}>Arjun</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: ORANGE, opacity: 0.55 }}>Staff Analyst</span>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink)', margin: 0, whiteSpace: 'pre-wrap', fontWeight: 500 }}>
          {isNew ? displayed : text}
          {isNew && !done && (
            <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.7, repeat: Infinity }}
              style={{ color: ORANGE, marginLeft: 1 }}>▊</motion.span>
          )}
        </p>
      </div>
    </div>
  );
}

// ── KPI mini-card ─────────────────────────────────────────────────────────────
function KpiCard({ data, highlight = false }) {
  const isAlert = data.alert;
  const borderColor = highlight ? RED : isAlert ? `${RED}40` : 'rgba(255,255,255,0.08)';
  const bg = highlight ? `${RED}0C` : isAlert ? `${RED}06` : 'rgba(255,255,255,0.03)';
  return (
    <div style={{
      padding: '12px 14px', borderRadius: 10,
      background: bg, border: `1px solid ${borderColor}`,
      transition: 'all 0.2s',
      position: 'relative', overflow: 'hidden',
    }}>
      {highlight && (
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, transparent, ${RED}, transparent)`,
          }}
        />
      )}
      <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {data.short || data.label}
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 800, color: isAlert ? RED : 'var(--ink)' }}>
          {data.current}
        </span>
        {data.delta !== undefined && (
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: data.delta < 0 ? RED : GREEN }}>
            {data.delta > 0 ? '+' : ''}{data.delta}%
          </span>
        )}
      </div>
      <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', marginTop: 3 }}>{data.detail}</p>
    </div>
  );
}

// ── Hard-mode overlay modal ───────────────────────────────────────────────────
function HardModeModal({ message, onAcknowledge }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(0,0,0,0.82)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <motion.div
        initial={{ scale: 0.92, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 12 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          maxWidth: 540, width: '100%',
          background: '#0D0D18',
          border: `1px solid ${RED}40`,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: `0 0 60px ${RED}15, 0 24px 48px rgba(0,0,0,0.6)`,
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          background: `${RED}0A`,
          borderBottom: `1px solid ${RED}20`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <AlertTriangle size={16} color={RED} />
          </motion.div>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: RED, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Hard Mode — Arjun Intervening
          </span>
          <div style={{
            marginLeft: 'auto', padding: '2px 8px', borderRadius: 999,
            background: `${RED}15`, border: `1px solid ${RED}30`,
            fontFamily: 'var(--mono)', fontSize: 9, color: RED,
          }}>
            DATA INTEGRITY ERROR
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px' }}>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--ink)', marginBottom: 20, whiteSpace: 'pre-wrap' }}>
            {message}
          </p>

          {/* Visual: what was missing */}
          <div style={{
            borderRadius: 12, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.07)',
            marginBottom: 20,
          }}>
            <div style={{ padding: '8px 14px', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Partition Coverage</span>
            </div>
            <div style={{ padding: '14px' }}>
              {[
                { zone: 'West', sessions: '31,400', pct: '33.1%', ok: true },
                { zone: 'Central', sessions: '39,800', pct: '42.0%', ok: true },
                { zone: 'East', sessions: '0 ← MISSING', pct: '0% of 24.8%', ok: false },
              ].map(({ zone, sessions, pct, ok }) => (
                <div key={zone} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '7px 0',
                  borderBottom: zone !== 'East' ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: ok ? GREEN : RED,
                  }} />
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: ok ? 'var(--ink2)' : RED, flex: 1, fontWeight: ok ? 400 : 700 }}>
                    {zone}
                  </span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: ok ? 'var(--ink3)' : RED }}>{sessions}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: ok ? 'var(--ink3)' : `${RED}90`, marginLeft: 8 }}>{pct}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            padding: '10px 14px', borderRadius: 10,
            background: `${YELLOW}08`, border: `1px solid ${YELLOW}20`,
            marginBottom: 20,
          }}>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: YELLOW, lineHeight: 1.6, margin: 0 }}>
              🔑 Rule: Always verify total session counts match the expected city baseline before interpreting any metric. A 24% session drop with stable city population = missing partition.
            </p>
          </div>

          <motion.button
            onClick={onAcknowledge}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: '100%', padding: '12px 20px', borderRadius: 12,
              background: ORANGE, color: '#fff',
              border: 'none', cursor: 'pointer',
              fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 700,
              boxShadow: `0 2px 16px ${ORANGE}40`,
            }}
          >
            Got it — reload the full dataset →
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Sanity check input ────────────────────────────────────────────────────────
function SanityCheckInput({ onResult, attemptCount }) {
  const [value, setValue]         = useState('');
  const [focused, setFocused]     = useState(false);
  const canSubmit = value.trim().length > 20;

  const checkForCatch = (text) => {
    const lower = text.toLowerCase();
    return P2_SANITY_CHECK.catchKeywords.some(k => lower.includes(k));
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    const caught = checkForCatch(value.trim());
    onResult({ caught, input: value.trim() });
    setValue('');
  };

  const hint = attemptCount === 0
    ? 'Look at total app sessions this week vs last week. Does that make sense?'
    : 'Hint: the total sessions dropped 24% — but South Mumbai\'s population didn\'t change. What could cause this?';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        marginTop: 16, padding: '14px 16px',
        borderRadius: 12, background: `${BLUE}07`,
        border: `1px solid ${BLUE}20`,
      }}
    >
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'flex-start' }}>
        <Avatar initials="AJ" color={ORANGE} size={24} />
        <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
          {P2_ARJUN_HARDMODE.trigger}
        </p>
      </div>
      {attemptCount > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ fontFamily: 'var(--mono)', fontSize: 10, color: YELLOW, marginBottom: 8, padding: '6px 10px', borderRadius: 7, background: `${YELLOW}08`, border: `1px solid ${YELLOW}15` }}
        >
          💡 {hint}
        </motion.p>
      )}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="The session count looks off because..."
          rows={2}
          autoFocus
          style={{
            flex: 1, padding: '9px 12px',
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${focused ? ORANGE : 'rgba(255,255,255,0.09)'}`,
            borderRadius: 9, fontFamily: 'var(--sans)', fontSize: 13,
            color: 'var(--ink)', resize: 'none', outline: 'none',
            lineHeight: 1.55,
            transition: 'border-color 0.18s',
            boxShadow: focused ? `0 0 0 1px ${ORANGE}30` : 'none',
          }}
        />
        <motion.button
          onClick={handleSubmit}
          whileHover={canSubmit ? { scale: 1.06 } : {}}
          whileTap={canSubmit ? { scale: 0.93 } : {}}
          style={{
            padding: '9px 16px', borderRadius: 9, flexShrink: 0,
            background: canSubmit ? ORANGE : 'rgba(255,255,255,0.05)',
            color: canSubmit ? '#fff' : 'var(--ink3)',
            border: 'none', cursor: canSubmit ? 'pointer' : 'default',
            fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 700,
            transition: 'all 0.14s',
            boxShadow: canSubmit ? `0 2px 12px ${ORANGE}45` : 'none',
          }}
        >
          Submit
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function DirtyDataTrap({ onDataVerified, onHardModeTriggered }) {
  const [stage, setStage]               = useState('dirty');
  // dirty → sanity_check → caught | hard_mode → clean
  const [showHardMode, setShowHardMode] = useState(false);
  const [sanityAttempts, setSanityAttempts] = useState(0);
  const [arjunLines, setArjunLines]     = useState([]);
  const [expandedInfo, setExpandedInfo] = useState(false);
  const [dataExpanded, setDataExpanded] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [stage, arjunLines, showHardMode]);

  // Show sanity check prompt after user views data
  const handleViewData = useCallback(() => {
    setStage('sanity_check');
  }, []);

  const handleSanityResult = useCallback(({ caught, input }) => {
    setSanityAttempts(prev => prev + 1);

    if (caught) {
      // User caught the error ✓
      setStage('caught');
      setArjunLines([{ text: P2_ARJUN_HARDMODE.caught, isNew: true }]);
      setTimeout(() => {
        setStage('clean');
        onHardModeTriggered?.(false); // false = not triggered (user caught it)
        setTimeout(() => onDataVerified?.(P2_KPI_CLEAN), 2000);
      }, 3500);
    } else if (sanityAttempts >= 1) {
      // Second failed attempt → Hard Mode
      setShowHardMode(true);
      onHardModeTriggered?.(true);
    } else {
      // First failed attempt → hint
      setArjunLines([{ text: P2_ARJUN_HARDMODE.hint1, isNew: true }]);
      setStage('sanity_check');
    }
  }, [sanityAttempts, onDataVerified, onHardModeTriggered]);

  const handleHardModeAck = useCallback(() => {
    setShowHardMode(false);
    setStage('clean');
    setArjunLines([{ text: P2_ARJUN_HARDMODE.reveal, isNew: true }]);
    setTimeout(() => onDataVerified?.(P2_KPI_CLEAN), 2800);
  }, [onDataVerified]);

  const kpiEntries = Object.entries(
    stage === 'clean' ? P2_KPI_CLEAN : P2_KPI_DIRTY
  ).filter(([k]) => k !== '_meta');

  const isCleaned = stage === 'clean';
  const highlightSession = stage !== 'clean' && ['sanity_check', 'dirty'].includes(stage);

  return (
    <div>
      {/* ── Dataset header badge ── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', borderRadius: 10, marginBottom: 14,
          background: isCleaned ? `${GREEN}08` : `${RED}08`,
          border: `1px solid ${isCleaned ? `${GREEN}25` : `${RED}25`}`,
        }}
      >
        <Database size={13} color={isCleaned ? GREEN : RED} />
        <div style={{ flex: 1 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: isCleaned ? GREEN : RED, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isCleaned ? '✓ Verified Dataset' : '⚠ Dataset Loaded'}
          </span>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', margin: '2px 0 0' }}>
            {isCleaned
              ? (P2_KPI_CLEAN._meta?.partition || 'All zones — West + Central + East')
              : (P2_KPI_DIRTY._meta?.partition || 'Partial partition')}
          </p>
        </div>
        {!isCleaned && (
          <div style={{
            padding: '3px 9px', borderRadius: 999,
            background: `${YELLOW}12`, border: `1px solid ${YELLOW}25`,
            fontFamily: 'var(--mono)', fontSize: 9, color: YELLOW,
          }}>
            Verify before using
          </div>
        )}
        {isCleaned && (
          <CheckCircle size={13} color={GREEN} />
        )}
      </motion.div>

      {/* ── KPI grid — collapsible ── */}
      <div style={{
        borderRadius: 14, overflow: 'hidden',
        border: `1px solid ${isCleaned ? 'rgba(61,214,140,0.15)' : 'rgba(255,255,255,0.08)'}`,
        marginBottom: 14, transition: 'border-color 0.4s',
      }}>
        <button
          onClick={() => setDataExpanded(e => !e)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', background: 'rgba(0,0,0,0.25)',
            border: 'none', cursor: 'pointer', textAlign: 'left',
          }}
        >
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.08em', flex: 1 }}>
            South Mumbai KPI Dashboard — Thursday WoW
          </span>
          {dataExpanded ? <ChevronDown size={13} color="var(--ink3)" /> : <ChevronRight size={13} color="var(--ink3)" />}
        </button>
        <AnimatePresence>
          {dataExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                padding: '12px 14px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: 10,
              }}>
                {kpiEntries.map(([key, data]) => (
                  <KpiCard
                    key={key}
                    data={data}
                    highlight={highlightSession && key === 'total_sessions'}
                  />
                ))}
              </div>
              {/* Sessions anomaly callout — only in dirty state */}
              {!isCleaned && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  style={{
                    margin: '0 14px 12px',
                    padding: '9px 12px', borderRadius: 9,
                    background: `${RED}07`, border: `1px solid ${RED}20`,
                    display: 'flex', gap: 8, alignItems: 'center',
                  }}
                >
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    style={{ width: 6, height: 6, borderRadius: '50%', background: RED, flexShrink: 0 }}
                  />
                  <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: RED, margin: 0, lineHeight: 1.55 }}>
                    Sessions: 71,200 this week vs 94,100 last week (−24.3%). City population unchanged — does this gap make sense?
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── CTA to trigger sanity check ── */}
      <AnimatePresence>
        {stage === 'dirty' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ marginBottom: 14 }}
          >
            <button
              onClick={handleViewData}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 16px', borderRadius: 9,
                background: `${BLUE}10`, border: `1px solid ${BLUE}28`,
                color: BLUE, cursor: 'pointer',
                fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 700,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = `${BLUE}18`}
              onMouseLeave={e => e.currentTarget.style.background = `${BLUE}10`}
            >
              <RefreshCw size={12} />
              I've reviewed the data — looks ready to interpret
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sanity check input ── */}
      <AnimatePresence>
        {stage === 'sanity_check' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {arjunLines.map((line, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <ArjunLine text={line.text} isNew={line.isNew} />
              </div>
            ))}
            <SanityCheckInput
              onResult={handleSanityResult}
              attemptCount={sanityAttempts}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Caught state — clean data loading ── */}
      <AnimatePresence>
        {(stage === 'caught' || stage === 'clean') && arjunLines.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {arjunLines.map((line, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <ArjunLine text={line.text} isNew={line.isNew} />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Clean data unlock banner ── */}
      <AnimatePresence>
        {stage === 'clean' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              marginTop: 8, padding: '12px 16px', borderRadius: 12,
              background: `${GREEN}08`, border: `1px solid ${GREEN}28`,
              display: 'flex', gap: 10, alignItems: 'center',
            }}
          >
            <CheckCircle size={14} color={GREEN} />
            <div>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: GREEN, margin: 0, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Full Dataset Loaded
              </p>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', margin: 0 }}>
                All three South Mumbai zones — 94,800 sessions. Safe to interpret.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hard Mode overlay ── */}
      <AnimatePresence>
        {showHardMode && (
          <HardModeModal
            message={P2_ARJUN_HARDMODE.reveal}
            onAcknowledge={handleHardModeAck}
          />
        )}
      </AnimatePresence>

      <div ref={bottomRef} style={{ height: 4 }} />
    </div>
  );
}