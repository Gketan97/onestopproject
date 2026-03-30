// src/components/strategy/components/AnalysisWorkbench.jsx
// CP11: Phase 2 — "Own the Investigation"
//
// KEY CHANGES FROM PLACEHOLDER:
//   1. DirtyDataTrap integrated as the FIRST interaction — user must verify
//      the incomplete dataset before any queries are processed.
//
//   2. LogicEfficiency layer — after every NL query response, Arjun's reply
//      is checked against pushback rules in P2_ARJUN_HARDMODE.logicPushbacks.
//      Weak logic gets a 2-sentence challenge before data is surfaced.
//
//   3. Feed architecture — same continuous vertical feed pattern as ArjunSocraticChat.
//      Each "data block" (KPI, Funnel, Cohort) appends to the bottom.
//      Previous blocks remain visible.
//
//   4. Phase gates:
//      Gate A: data verified (DirtyDataTrap complete)
//      Gate B: user has queried ≥ 2 data types
//      Gate C: user has submitted impact sizing
//      Gate D: ExecutiveMemo complete → onAdvance()
//
//   5. P2 investigation log built as user queries → passed to ExecutiveMemo.

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, AlertTriangle, ChevronRight, ArrowRight } from 'lucide-react';
import { useArjunStrategy } from '../hooks/useArjunStrategy.js';
import CohortMatrix from './CohortMatrix.jsx';
import DirtyDataTrap from './DirtyDataTrap.jsx';
import ExecutiveMemo from './ExecutiveMemo.jsx';
import {
  P2_SCENARIO,
  P2_KPI_CLEAN,
  P2_FUNNEL_CLEAN_THIS_WEEK,
  P2_FUNNEL_DIRTY_THIS_WEEK,
  P2_FUNNEL_DIRTY_LAST_WEEK,
  P2_IMPACT_SIZING,
  P2_ARJUN_HARDMODE,
  ARJUN_P2_MOCK,
} from '../data/swiggyStrategyData.js';

const ORANGE = '#FC8019';
const RED    = '#F38BA8';
const GREEN  = '#3DD68C';
const BLUE   = '#4F80FF';
const YELLOW = '#F9E2AF';
const PURPLE = '#A78BFA';

const P2_PROMPTS = [
  'Show me the conversion funnel for Thursday vs last Thursday',
  'What does the dessert category availability look like?',
  'Where is the biggest funnel drop-off?',
  'Show me cohort retention for South Mumbai new users',
  'Size the GMV impact — how much is recoverable?',
];

// ── Logic efficiency check — returns pushback text or null ───────────────────
function checkLogicEfficiency(userQuery, vizType) {
  const lower = userQuery.toLowerCase();

  if ((lower.includes('demand') || lower.includes('users don\'t want')) && !lower.includes('supply'))
    return P2_ARJUN_HARDMODE.logicPushbacks.demand_blame;

  if (lower.includes('delivery time') && (lower.includes('cause') || lower.includes('reason') || lower.includes('root')))
    return P2_ARJUN_HARDMODE.logicPushbacks.delivery_time;

  if (lower.includes('payment') && (lower.includes('cause') || lower.includes('reason') || lower.includes('root')))
    return P2_ARJUN_HARDMODE.logicPushbacks.payment_blame;

  if ((lower.includes('fix') || lower.includes('restore') || lower.includes('recommend')) && !lower.includes('₹') && !lower.includes('cr') && !lower.includes('lakh'))
    return P2_ARJUN_HARDMODE.logicPushbacks.unsized_recommendation;

  return null; // logic is fine
}

// ── Avatar ────────────────────────────────────────────────────────────────────
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

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <Avatar initials="AJ" color={ORANGE} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 10, background: `${ORANGE}08`, border: `1px solid ${ORANGE}18` }}>
        {[0,1,2].map(i => <motion.span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: ORANGE, display: 'block' }}
          animate={{ scale: [1,1.4,1], opacity: [0.4,1,0.4] }} transition={{ duration: 1.0, delay: i*0.2, repeat: Infinity }} />)}
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', marginLeft: 4 }}>Arjun is analysing...</span>
      </div>
    </div>
  );
}

// ── Logic pushback banner ─────────────────────────────────────────────────────
function LogicPushback({ message, onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{
        padding: '12px 14px', borderRadius: 11,
        background: `${YELLOW}08`, border: `1px solid ${YELLOW}22`,
        marginBottom: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: onDismiss ? 10 : 0 }}>
        <AlertTriangle size={13} color={YELLOW} style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: YELLOW, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>
            Arjun — Logic Check
          </p>
          <p style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--ink)', margin: 0 }}>{message}</p>
        </div>
      </div>
      {onDismiss && (
        <button onClick={onDismiss}
          style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8, padding: '5px 10px', borderRadius: 7, background: `${YELLOW}12`, border: `1px solid ${YELLOW}20`, color: YELLOW, fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
          Understood <ChevronRight size={10} />
        </button>
      )}
    </motion.div>
  );
}

// ── Funnel comparison table (Phase 2) ─────────────────────────────────────────
function P2FunnelTable({ thisWeek, lastWeek, title }) {
  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', marginBottom: 12 }}>
      <div style={{ padding: '9px 14px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink3)', margin: 0 }}>{title}</p>
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 60px', gap: 8, marginBottom: 8 }}>
          {['Stage','This week','Last week','Δ'].map(h => <span key={h} style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink3)' }}>{h}</span>)}
        </div>
        {thisWeek.map((step, i) => {
          const last = lastWeek[i];
          const delta = last ? (step.pct - last.pct).toFixed(1) : null;
          const isAnomaly = delta !== null && Math.abs(parseFloat(delta)) > 8;
          return (
            <div key={step.stage} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 60px', gap: 8, padding: '6px 0', borderBottom: i < thisWeek.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: isAnomaly ? `${RED}06` : 'transparent', borderRadius: isAnomaly ? 6 : 0 }}>
              <span style={{ fontSize: 12, color: isAnomaly ? 'var(--ink)' : 'var(--ink2)', fontWeight: isAnomaly ? 600 : 400 }}>{step.stage}{isAnomaly && <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: RED }}> ⚠</span>}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: isAnomaly ? RED : 'var(--ink2)', fontWeight: isAnomaly ? 700 : 400 }}>{step.pct?.toFixed(1)}%</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink3)' }}>{last?.pct?.toFixed(1)}%</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: delta && parseFloat(delta) < 0 ? RED : GREEN, fontWeight: isAnomaly ? 700 : 400 }}>{delta !== null ? `${parseFloat(delta) > 0 ? '+' : ''}${delta}` : '—'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Impact sizing challenge ───────────────────────────────────────────────────
function ImpactChallenge({ onSubmit }) {
  const [val, setVal]           = useState('');
  const [error, setError]       = useState('');
  const [submitted, setSubmitted] = useState(false);

  const check = () => {
    const clean = val.replace(/[₹,\s]/gi, '').toLowerCase();
    if (!val.trim()) { setError('Enter your estimate first.'); return; }
    // Accept 1.8–4.5 Cr range
    const inCr = clean.includes('cr') ? parseFloat(clean) : clean.includes('lakh') ? parseFloat(clean) / 100 : parseFloat(clean);
    if (isNaN(inCr) || inCr < 1.5 || inCr > 5) {
      setError(`Check your inputs: ₹${P2_IMPACT_SIZING.avgOrderValue} AOV × ${P2_IMPACT_SIZING.ordersPerWeek} orders/week × ${P2_IMPACT_SIZING.churnedUsers} churned users × 52 weeks × ${P2_IMPACT_SIZING.recoveryRate * 100}% recovery.`);
      return;
    }
    setError('');
    setSubmitted(true);
    onSubmit && onSubmit(val);
  };

  if (submitted) return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      style={{ padding: 16, borderRadius: 14, background: `${GREEN}08`, border: `1px solid ${GREEN}22` }}>
      <p style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: GREEN, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>✓ Sizing accepted</p>
      <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.65, margin: 0 }}>
        Your estimate of <strong style={{ color: GREEN }}>{val}</strong> is in range. At {P2_IMPACT_SIZING.recoveryRate * 100}% recovery — expected case — that's <strong>{P2_IMPACT_SIZING.answer.conservative} annualized</strong>. Use this in your memo.
      </p>
    </motion.div>
  );

  return (
    <div style={{ padding: 16, borderRadius: 14, background: `${YELLOW}06`, border: `1px solid ${YELLOW}20` }}>
      <p style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: YELLOW, marginBottom: 8 }}>⚡ Impact Sizing</p>
      <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.62, marginBottom: 12 }}>
        What is the annualized GMV recovery if we fix dessert availability? Use: <strong>₹{P2_IMPACT_SIZING.avgOrderValue} AOV</strong>, <strong>{P2_IMPACT_SIZING.ordersPerWeek} orders/week</strong>, <strong>{P2_IMPACT_SIZING.churnedUsers} churned users</strong>, <strong>{P2_IMPACT_SIZING.recoveryRate * 100}% recovery rate</strong>.
      </p>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <input value={val} onChange={e => { setVal(e.target.value); setError(''); }} placeholder="e.g. ₹2.17Cr"
          style={{ flex: 1, minWidth: 140, background: 'rgba(255,255,255,0.05)', border: `1px solid ${error ? RED : 'rgba(255,255,255,0.1)'}`, borderRadius: 9, padding: '9px 14px', fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' }}
          onKeyDown={e => e.key === 'Enter' && check()} />
        <button onClick={check}
          style={{ padding: '9px 18px', borderRadius: 9, background: ORANGE, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 700 }}>
          Submit
        </button>
      </div>
      {error && <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: RED, marginTop: 8 }}>{error}</p>}
    </div>
  );
}

// ── Feed block (a single query + arjun response + optional viz) ───────────────
function FeedBlock({ entry, index }) {
  const colors = [BLUE, ORANGE, PURPLE, GREEN, RED, YELLOW];
  const c = colors[index % colors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginBottom: 16 }}
    >
      {/* User query */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 10 }}>
        <Avatar initials="ME" color={BLUE} size={26} />
        <div style={{ flex: 1, padding: '8px 12px', borderRadius: 9, background: `${BLUE}08`, border: `1px solid ${BLUE}15` }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: BLUE, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>You</p>
          <p style={{ fontSize: 13, color: 'var(--ink2)', margin: 0, fontStyle: 'italic' }}>{entry.query}</p>
        </div>
      </div>

      {/* Logic pushback if present */}
      {entry.pushback && (
        <LogicPushback message={entry.pushback} />
      )}

      {/* Arjun response */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: entry.vizType ? 12 : 0 }}>
        <Avatar initials="AJ" color={ORANGE} size={26} />
        <div style={{ flex: 1, padding: '10px 14px', borderRadius: 10, background: `${ORANGE}06`, border: `1px solid ${ORANGE}15` }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: ORANGE, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Arjun — Staff Analyst</p>
          <p style={{ fontSize: 13, lineHeight: 1.67, color: 'var(--ink)', margin: 0 }}>{entry.arjunText}</p>
        </div>
      </div>

      {/* Visualisation */}
      {entry.vizType === 'funnel' && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginTop: 10 }}>
          <P2FunnelTable thisWeek={P2_FUNNEL_CLEAN_THIS_WEEK} lastWeek={P2_FUNNEL_DIRTY_LAST_WEEK} title="Conversion funnel · South Mumbai · Thursday WoW" />
        </motion.div>
      )}
      {entry.vizType === 'cohort' && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginTop: 10 }}>
          <CohortMatrix />
        </motion.div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function AnalysisWorkbench({ onAdvance, onImpactSized }) {
  // Phase gates
  const [dataVerified, setDataVerified]   = useState(false);
  const [hardModeHit, setHardModeHit]     = useState(false);
  const [impactSized, setImpactSized]     = useState(false);
  const [showMemo, setShowMemo]           = useState(false);

  // NL query feed
  const [query, setQuery]     = useState('');
  const [loading, setLoading] = useState(false);
  const [feed, setFeed]       = useState([]);       // [{ query, arjunText, vizType, pushback }]
  const [pushbackActive, setPushbackActive] = useState(null); // current pushback text

  // Investigation log for memo
  const [p2Log, setP2Log]     = useState([]);

  const { callArjun } = useArjunStrategy();
  const inputRef      = useRef(null);
  const bottomRef     = useRef(null);

  const uniqueVizTypes = [...new Set(feed.map(e => e.vizType).filter(Boolean))];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [feed, loading, dataVerified, impactSized, showMemo, pushbackActive]);

  const handleDataVerified = useCallback((cleanKpi) => {
    setDataVerified(true);
    // Seed log with data verification finding
    setP2Log([{ index: 0, conclusion: 'Verified full South Mumbai partition — West + Central + East (94,800 sessions). Initial dataset was missing East zone.' }]);
  }, []);

  const submit = useCallback(async (text) => {
    const q = (text || query).trim();
    if (!q || loading || !dataVerified) return;

    // Check logic efficiency before calling API
    const pushback = checkLogicEfficiency(q, null);
    if (pushback && !pushbackActive) {
      setPushbackActive(pushback);
      return; // hold — user must acknowledge pushback before getting data
    }
    setPushbackActive(null);

    setQuery('');
    setLoading(true);

    const { text: arjunText, vizType } = await callArjun(q, 'deepdive');
    setLoading(false);

    // Pick P2 mock if it matches
    const lower = q.toLowerCase();
    let finalText = arjunText;
    if (lower.includes('funnel') || lower.includes('conversion')) finalText = ARJUN_P2_MOCK.funnel;
    else if (lower.includes('cohort') || lower.includes('retention')) finalText = ARJUN_P2_MOCK.cohort;
    else if (lower.includes('availability') || lower.includes('dessert')) finalText = ARJUN_P2_MOCK.availability;
    else if (lower.includes('impact') || lower.includes('size') || lower.includes('₹') || lower.includes('gmv')) finalText = ARJUN_P2_MOCK.impact;
    else if (lower.includes('kpi') || lower.includes('dashboard')) finalText = ARJUN_P2_MOCK.kpi;

    const entry = { query: q, arjunText: finalText, vizType, pushback: null };
    setFeed(prev => [...prev, entry]);

    // Log to investigation trail
    setP2Log(prev => [...prev, { index: prev.length, conclusion: q }]);
  }, [query, loading, dataVerified, callArjun, pushbackActive]);

  const handleImpactSubmit = useCallback((val) => {
    setImpactSized(true);
    setP2Log(prev => [...prev, { index: prev.length, conclusion: `Impact sizing: ${val} annualized GMV recoverable at ${P2_IMPACT_SIZING.recoveryRate * 100}% recovery rate.` }]);
    onImpactSized?.(val);
    setTimeout(() => setShowMemo(true), 1200);
  }, [onImpactSized]);

  const handleMemoComplete = useCallback((scores) => {
    setTimeout(() => onAdvance?.(), 2000);
  }, [onAdvance]);

  return (
    <div>
      {/* ── Phase 2 scenario banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: '10px 14px', borderRadius: 10, marginBottom: 20,
          background: `${RED}07`, border: `1px solid ${RED}20`,
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, marginTop: 1 }}>
          <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: RED }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: RED, textTransform: 'uppercase', letterSpacing: '0.08em' }}>New Incident</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.6, margin: 0 }}>{P2_SCENARIO.priyaMessage}</p>
      </motion.div>

      {/* ── Gate A: Dirty Data Trap ── */}
      <div style={{ marginBottom: 20 }}>
        <DirtyDataTrap
          onDataVerified={handleDataVerified}
          onHardModeTriggered={(wasTriggered) => setHardModeHit(wasTriggered)}
        />
      </div>

      {/* ── Gate A unlocked: NL query interface ── */}
      <AnimatePresence>
        {dataVerified && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Hard mode badge if triggered */}
            {hardModeHit && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 10px', borderRadius: 999, marginBottom: 14,
                  background: `${RED}10`, border: `1px solid ${RED}25`,
                  fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: RED,
                }}
              >
                <AlertTriangle size={10} />
                Hard Mode Triggered — partition error caught by Arjun
              </motion.div>
            )}

            {/* NL Query Input */}
            <div style={{
              borderRadius: 16, overflow: 'hidden',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              marginBottom: 16,
            }}>
              {/* Header */}
              <div style={{
                padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(8,8,16,0.5)', display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <Sparkles size={12} color={BLUE} />
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink3)' }}>
                  Natural Language Workbench — You Lead
                </span>
                <span style={{
                  marginLeft: 'auto', padding: '2px 8px', borderRadius: 999,
                  fontFamily: 'var(--mono)', fontSize: 9,
                  background: `${BLUE}12`, color: BLUE, border: `1px solid ${BLUE}20`,
                }}>
                  Arjun is reactive
                </span>
              </div>

              {/* Input */}
              <div style={{ padding: '14px 14px 10px' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink3)', pointerEvents: 'none' }} />
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && submit()}
                      placeholder="Ask in plain English — funnel, cohort, availability, impact..."
                      style={{
                        width: '100%', paddingLeft: 33, paddingRight: 12,
                        paddingTop: 9, paddingBottom: 9,
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                        borderRadius: 10, fontFamily: 'var(--sans)', fontSize: 13,
                        color: 'var(--ink)', outline: 'none', boxSizing: 'border-box',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = `${BLUE}50`}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                    />
                  </div>
                  <button onClick={() => submit()} disabled={!query.trim() || loading}
                    style={{
                      padding: '9px 18px', borderRadius: 10,
                      background: query.trim() ? BLUE : 'rgba(255,255,255,0.05)',
                      color: query.trim() ? '#fff' : 'var(--ink3)',
                      border: 'none', cursor: query.trim() ? 'pointer' : 'default',
                      fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 700,
                      transition: 'all 0.18s', whiteSpace: 'nowrap',
                    }}>
                    {loading ? '…' : 'Query →'}
                  </button>
                </div>

                {/* Prompt chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                  {P2_PROMPTS.map((p, i) => (
                    <button key={i} onClick={() => submit(p)}
                      style={{
                        padding: '3px 10px', borderRadius: 999,
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                        fontFamily: 'var(--sans)', fontSize: 10, color: 'var(--ink3)',
                        cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.borderColor = `${BLUE}30`; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink3)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Logic pushback (before data loads) */}
            <AnimatePresence>
              {pushbackActive && (
                <LogicPushback
                  message={pushbackActive}
                  onDismiss={() => setPushbackActive(null)}
                />
              )}
            </AnimatePresence>

            {/* Loading indicator */}
            <AnimatePresence>
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ marginBottom: 12 }}>
                  <TypingIndicator />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Feed */}
            {feed.map((entry, i) => (
              <FeedBlock key={i} entry={entry} index={i} />
            ))}

            {/* Gate B: Impact sizing unlocks after ≥ 2 queries */}
            <AnimatePresence>
              {feed.length >= 2 && !impactSized && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ marginTop: 4 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0 14px' }}>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: YELLOW, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Size the impact
                    </span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                  </div>
                  <ImpactChallenge onSubmit={handleImpactSubmit} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Gate C: Memo unlocks after impact sized */}
            <AnimatePresence>
              {impactSized && !showMemo && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ marginTop: 16, textAlign: 'center' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                    <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
                      style={{ width: 5, height: 5, borderRadius: '50%', background: ORANGE }} />
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: ORANGE }}>Loading executive memo...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Gate D: Executive Memo ── */}
      <AnimatePresence>
        {showMemo && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginTop: 20 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 20px' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: GREEN, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Final step
              </span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            </div>
            <ExecutiveMemo
              investigationLog={p2Log}
              scenario={P2_SCENARIO}
              onComplete={handleMemoComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={bottomRef} style={{ height: 8 }} />
    </div>
  );
}