// src/components/strategy/components/KpiScorecard.jsx
// CP8: Reasoning-before-click gate + tooltip affordance + 10 KPI grid
//
// New flow:
//   1. Scorecard renders — all 10 metrics visible but NOT clickable
//   2. Reasoning input appears above: "Before you click — which metric do you
//      think is most important to investigate first, and why?" (30 char min)
//   3. User submits reasoning → Arjun reacts to their written logic
//   4. Scorecard becomes interactive → user clicks to confirm/contradict
//   5. Each card has a "?" tooltip showing a plain-English definition
//
// Design: 10 cards in auto-fit grid, same animated number + stagger behaviour

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, TrendingUp, Minus, HelpCircle, Send, ArrowRight } from 'lucide-react';
import { KPI_DATA } from '../data/swiggyStrategyData.js';

const RED    = '#F38BA8';
const GREEN  = '#3DD68C';
const ORANGE = '#FC8019';
const BLUE   = '#4F80FF';

// ── Arjun's reasoning reactions — keyed by what the user focuses on ───────────
// Simple keyword match on their reasoning text before they click
function getReasoningReaction(text) {
  const lower = text.toLowerCase();
  if (lower.includes('conversion') || lower.includes('convert'))
    return "Exactly the right instinct. Conversion is the lead indicator — it tells you where users stopped, not just that they did. Go ahead and click what you'd investigate first.";
  if (lower.includes('gmv') || lower.includes('revenue') || lower.includes('money'))
    return "GMV is important — but it's the outcome, not the cause. Something made GMV drop. Which metric tells you what broke? Click what you'd actually investigate first.";
  if (lower.includes('fleet') || lower.includes('delivery') || lower.includes('driver'))
    return "Smart to check supply — fleet data either implicates or exonerates delivery capacity fast. Go ahead and click it. I'll tell you what it reveals.";
  if (lower.includes('payment') || lower.includes('checkout'))
    return "Payment failure is worth ruling out quickly. But notice where in the funnel users are dropping — if it's before checkout, payment can't be the cause. Click what you'd check first.";
  if (lower.includes('session') || lower.includes('browsing') || lower.includes('time'))
    return "Interesting instinct. Session duration going up while conversion goes down is a real tension — users engaging more but ordering less. That tension points somewhere specific. Click your first pick.";
  if (lower.includes('support') || lower.includes('ticket') || lower.includes('complaint'))
    return "Tickets tell you users are unhappy but not why. You need the cause before the complaint log helps. Click what gives you faster signal.";
  // Generic fallback
  return "Good thinking. You're asking the right questions. Now go confirm your hypothesis — click the metric you'd investigate first and see where the data leads.";
}

// ── Animated number hook ──────────────────────────────────────────────────────
function useCountUp(to, from = 0, duration = 1200, decimals = 0) {
  const [value, setValue] = useState(from);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const diff  = to - from;
    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((from + diff * eased).toFixed(decimals)));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [to, from, duration, decimals]);

  return value;
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
function Tooltip({ text }) {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        onClick={e => e.stopPropagation()} // don't trigger KPI click
        style={{ background: 'none', border: 'none', cursor: 'help', padding: 0, display: 'flex', alignItems: 'center', color: 'var(--ink3)' }}
        aria-label="What does this metric mean?"
      >
        <HelpCircle size={11} />
      </button>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              bottom: '100%', left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: 6,
              width: 200,
              padding: '8px 10px',
              borderRadius: 8,
              background: 'rgba(14,14,26,0.98)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              zIndex: 100,
              pointerEvents: 'none',
            }}
          >
            <p style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink2)', lineHeight: 1.55, margin: 0 }}>
              {text}
            </p>
            {/* Arrow */}
            <div style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8, background: 'rgba(14,14,26,0.98)', border: '1px solid rgba(255,255,255,0.12)', borderTop: 'none', borderLeft: 'none', transform: 'translateX(-50%) rotate(45deg)' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Individual KPI card ───────────────────────────────────────────────────────
function KpiCard({ kpi, metricKey, delay, visible, isClickable, isSelected, isOtherSelected, onClick }) {
  const isDown = kpi.delta < 0;
  const isUp   = kpi.delta > 0;

  // Color logic
  const alertColor = kpi.alert ? RED : null;
  const deltaColor = alertColor || (isDown ? RED : isUp ? GREEN : 'var(--ink2)');
  const bg     = kpi.alert ? 'rgba(243,139,168,0.06)' : 'rgba(255,255,255,0.04)';
  const border = kpi.alert ? 'rgba(243,139,168,0.25)' : 'rgba(255,255,255,0.08)';

  // Dimmed when another card is selected
  const dimmed = isOtherSelected;

  // Parse for animation
  const parseNum = (str) => parseFloat(String(str).replace(/[₹%,Cr\smin]/g, ''));
  const currentNum = kpi.currentNum ?? parseNum(kpi.current);
  const prevNum    = kpi.prevNum    ?? parseNum(kpi.prev);
  const decimals   = String(kpi.current).includes('.') ? 1 : 0;

  const animatedNum = useCountUp(
    visible ? currentNum : prevNum,
    prevNum, visible ? 1400 : 0, decimals
  );

  const formatValue = (num) => {
    const s = String(kpi.current);
    if (s.includes('₹') && s.includes('Cr')) return `₹${num.toFixed(2)}Cr`;
    if (s.includes('%'))                      return `${num.toFixed(1)}%`;
    if (s.includes('₹'))                      return `₹${Math.round(num)}`;
    if (s.includes('min'))                    return `${Math.round(num)} min`;
    if (s.includes(','))                      return Math.round(num).toLocaleString('en-IN');
    return num.toFixed(decimals);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={visible
        ? { opacity: dimmed ? 0.35 : 1, y: 0, scale: 1 }
        : { opacity: 0, y: 20, scale: 0.97 }
      }
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onClick={isClickable ? onClick : undefined}
      whileHover={isClickable ? { scale: 1.02, y: -2 } : {}}
      style={{
        borderRadius: 14, padding: '16px 16px 14px',
        background: isSelected ? `${alertColor || ORANGE}10` : bg,
        border: `1px solid ${isSelected ? (alertColor || ORANGE) : border}`,
        cursor: isClickable ? 'pointer' : 'default',
        position: 'relative', overflow: 'hidden',
        boxShadow: isSelected ? `0 0 0 1px ${alertColor || ORANGE}40, 0 4px 20px ${alertColor || ORANGE}15` : 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s, opacity 0.2s',
      }}
    >
      {/* Alert pulse ring */}
      {kpi.alert && (
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.8, repeat: Infinity }}
          style={{ position: 'absolute', inset: 0, borderRadius: 14, border: '1px solid rgba(243,139,168,0.35)', pointerEvents: 'none' }} />
      )}
      {/* Alert top bar */}
      {kpi.alert && (
        <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.8, repeat: Infinity }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${RED}, transparent)` }} />
      )}

      {/* Clickable ring hint */}
      {isClickable && !isSelected && !isOtherSelected && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ position: 'absolute', top: 8, right: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: ORANGE, opacity: 0.5 }} />
        </motion.div>
      )}

      {/* Label row with tooltip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
        {kpi.alert && (
          <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
            style={{ width: 5, height: 5, borderRadius: '50%', background: RED, display: 'inline-block', flexShrink: 0 }} />
        )}
        <p style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: kpi.alert ? RED : 'var(--ink3)', margin: 0, flex: 1 }}>
          {kpi.short}
        </p>
        {kpi.definition && <Tooltip text={kpi.definition} />}
      </div>

      {/* Animated value */}
      <p style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: kpi.alert ? RED : 'var(--ink)', lineHeight: 1, marginBottom: 8 }}>
        {visible ? formatValue(animatedNum) : formatValue(prevNum)}
      </p>

      {/* Delta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
        {isDown ? <TrendingDown size={12} color={deltaColor} /> : isUp ? <TrendingUp size={12} color={deltaColor} /> : <Minus size={12} color={deltaColor} />}
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: deltaColor }}>
          {kpi.delta > 0 ? '+' : ''}{kpi.delta}%
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)' }}>vs prev</span>
      </div>

      <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', letterSpacing: '0.04em', margin: 0 }}>{kpi.detail}</p>
    </motion.div>
  );
}

// ── Reasoning gate — shown before scorecard is interactive ───────────────────
function ReasoningGate({ onSubmit }) {
  const [value, setValue]   = useState('');
  const [focused, setFocused] = useState(false);
  const canSubmit = value.trim().length >= 30;
  const hasContent = value.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ marginBottom: 16, padding: '14px 16px', borderRadius: 12, background: `${ORANGE}07`, border: `1px solid ${ORANGE}22` }}
    >
      {/* Arjun prompt */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${ORANGE}20`, border: `1px solid ${ORANGE}40`, fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: ORANGE }}>AJ</div>
        <div>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: ORANGE, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Before you click anything</p>
          <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.65, margin: 0 }}>
            Which metric do you think is most important to investigate first — and why? Write it before you click.
          </p>
        </div>
      </div>

      {/* Input */}
      <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${focused ? ORANGE : hasContent ? `${ORANGE}40` : 'rgba(255,255,255,0.09)'}`, boxShadow: focused ? `0 0 0 1px ${ORANGE}35` : 'none', transition: 'border-color 0.18s, box-shadow 0.18s' }}>
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="I'd start with conversion rate because it shows where in the journey users are dropping off, not just that they are..."
          rows={2}
          autoFocus
          style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: 'none', outline: 'none', color: 'var(--ink)', fontFamily: 'var(--sans)', fontSize: 13, lineHeight: 1.6, resize: 'none', boxSizing: 'border-box' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: canSubmit ? GREEN : 'var(--ink3)' }}>
            {canSubmit ? '✓ Good — now unlock the dashboard' : `${value.trim().length} / 30 chars min`}
          </span>
          <motion.button onClick={() => canSubmit && onSubmit(value.trim())}
            whileHover={canSubmit ? { scale: 1.06, y: -1 } : {}} whileTap={canSubmit ? { scale: 0.96 } : {}}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, background: hasContent ? ORANGE : 'rgba(255,255,255,0.05)', color: hasContent ? '#fff' : 'var(--ink3)', fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 700, border: 'none', cursor: canSubmit ? 'pointer' : 'default', transition: 'all 0.15s', boxShadow: canSubmit ? `0 2px 10px ${ORANGE}45` : 'none' }}>
            Unlock dashboard <ArrowRight size={12} />
          </motion.button>
        </div>
      </div>
      <style>{`textarea::placeholder { color: var(--ink2) !important; opacity: 0.6; }`}</style>
    </motion.div>
  );
}

// ── Arjun reasoning reaction ──────────────────────────────────────────────────
function ArjunReaction({ text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 16, padding: '12px 14px', borderRadius: 10, background: `${ORANGE}08`, border: `1px solid ${ORANGE}18` }}
    >
      <div style={{ width: 28, height: 28, borderRadius: 7, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${ORANGE}20`, border: `1px solid ${ORANGE}40`, fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: ORANGE }}>AJ</div>
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: ORANGE, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Arjun reacts</p>
        <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.65, margin: 0, fontWeight: 400 }}>{text}</p>
      </div>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function KpiScorecard({ onMetricClick, interactive = false, clickedMetric = null }) {
  const kpis    = Object.entries(KPI_DATA); // [key, kpi][]
  const [visibleCount, setVisibleCount] = useState(0);

  // Reasoning gate state
  const [reasoningSubmitted, setReasoningSubmitted] = useState(false);
  const [reasoningReaction, setReasoningReaction]   = useState(null);

  // Stagger cards in
  useEffect(() => {
    kpis.forEach((_, i) => {
      setTimeout(() => setVisibleCount(c => Math.max(c, i + 1)), i * 120);
    });
  }, []); // eslint-disable-line

  const handleReasoningSubmit = useCallback((text) => {
    setReasoningReaction(getReasoningReaction(text));
    setReasoningSubmitted(true);
  }, []);

  // Cards are clickable only after reasoning submitted AND interactive prop is true
  const cardsClickable = interactive && reasoningSubmitted && !clickedMetric;

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Dashboard header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink3)' }}>
            North Bangalore · Tuesday · Live
          </p>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginTop: 2 }}>Performance Snapshot</p>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, background: 'rgba(243,139,168,0.10)', border: '1px solid rgba(243,139,168,0.28)' }}>
          <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.1, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: RED, display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: RED, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Incident Active
          </span>
        </motion.div>
      </motion.div>

      {/* Tooltip hint — shown when cards first appear */}
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', marginBottom: 12 }}>
        Hover the <HelpCircle size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> on any metric for a plain-English definition
      </motion.p>

      {/* KPI Grid — 10 cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 16 }}>
        {kpis.map(([key, kpi], i) => (
          <KpiCard
            key={key}
            kpi={kpi}
            metricKey={key}
            delay={i * 0.04}
            visible={visibleCount > i}
            isClickable={cardsClickable}
            isSelected={clickedMetric === key}
            isOtherSelected={!!clickedMetric && clickedMetric !== key}
            onClick={() => cardsClickable && onMetricClick?.(key)}
          />
        ))}
      </div>

      {/* Reasoning gate — shown when interactive but not yet submitted */}
      <AnimatePresence>
        {interactive && !reasoningSubmitted && (
          <motion.div key="gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ReasoningGate onSubmit={handleReasoningSubmit} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Arjun's reaction to their reasoning */}
      <AnimatePresence>
        {reasoningReaction && !clickedMetric && (
          <motion.div key="reaction" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <ArjunReaction text={reasoningReaction} />
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              style={{ fontFamily: 'var(--mono)', fontSize: 10, color: ORANGE, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: ORANGE, display: 'inline-block' }} />
              Dashboard unlocked — click the metric you'd investigate first
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}