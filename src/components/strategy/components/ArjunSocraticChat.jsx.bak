// src/components/strategy/components/ArjunSocraticChat.jsx
// CP10: Accordion → Continuous Vertical War-Room Feed
//
// KEY CHANGES FROM CP9:
//   1. Feed rendering: log.map() renders ALL completed milestones top-to-bottom,
//      followed by the active milestone. Nothing is replaced — only appended.
//
//   2. Locked state: completed milestone cards have inputs removed but
//      data visualizations (KPIs, Funnels, Cohort) remain fully visible
//      when the card is expanded — so users can scroll back and reference them.
//
//   3. Auto-scroll: useEffect watches [log, activeMilestoneIndex, updating]
//      and smoothly scrolls feedBottomRef into view on every change.
//
//   4. Scroll-spy refs: milestoneRefs array holds one ref per milestone.
//      MilestoneStrip receives onMilestoneClick(index) which calls
//      scrollIntoView on the matching ref.
//
//   5. onMilestoneAdvance prop: called after each milestone completes,
//      passes (milestoneName, milestoneIndex) up to StrategyCase so the
//      sticky IncidentStatusBar can update its label.

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, ArrowRight, ArrowDown, Check, ChevronDown, ChevronRight } from 'lucide-react';
import {
  MILESTONES, PREDICTIONS, IMPACT_SIZING,
  FUNNEL_THIS_WEEK, FUNNEL_LAST_WEEK,
  FUNNEL_NEW_USERS, FUNNEL_RETURNING_USERS,
  SEGMENTATION_INSIGHT, COHORT_NARRATION, SCENARIO,
} from '../data/swiggyStrategyData.js';
import { useArjunStrategy, getKpiClickResponse } from '../hooks/useArjunStrategy.js';
import MilestoneStrip from './MilestoneStrip.jsx';
import PredictionPrompt from './PredictionPrompt.jsx';
import ConceptChip from './ConceptChip.jsx';
import KpiScorecard from './KpiScorecard.jsx';
import CohortMatrix from './CohortMatrix.jsx';
import ArjunQueryTerminal from './ArjunQueryTerminal.jsx';

const ORANGE = '#FC8019';
const BLUE   = '#4F80FF';
const GREEN  = '#3DD68C';
const RED    = '#F38BA8';
const PURPLE = '#A78BFA';
const MILESTONE_COLORS = [ORANGE, BLUE, PURPLE, GREEN, RED, PURPLE, '#F9E2AF'];

// ── Typewriter hook ───────────────────────────────────────────────────────────
function useTypewriter(text, speed = 10, trigger = true) {
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

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ initials, color, size = 32 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: size * 0.3, fontWeight: 800, background: `${color}20`, border: `1px solid ${color}40`, color }}>
      {initials}
    </div>
  );
}

// ── Arjun typed message ───────────────────────────────────────────────────────
function ArjunTypedMessage({ text, isNew, onDone }) {
  const { displayed, done } = useTypewriter(text, 10, isNew);
  useEffect(() => { if (done && onDone) onDone(); }, [done, onDone]);
  return (
    <span style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.72, color: 'var(--ink)', whiteSpace: 'pre-wrap' }}>
      {isNew ? displayed : text}
      {isNew && !done && <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.7, repeat: Infinity }} style={{ color: ORANGE, marginLeft: 1 }}>▊</motion.span>}
    </span>
  );
}

// ── Message ───────────────────────────────────────────────────────────────────
function Message({ msg, isNew }) {
  if (msg.role === 'system') return (
    <div style={{ textAlign: 'center', padding: '4px 0' }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{msg.text}</span>
    </div>
  );
  const color    = msg.role === 'arjun' ? ORANGE : msg.role === 'priya' ? RED : BLUE;
  const name     = msg.role === 'arjun' ? 'Arjun' : msg.role === 'priya' ? 'Priya' : 'You';
  const initials = msg.role === 'arjun' ? 'AJ' : msg.role === 'priya' ? 'PR' : 'ME';
  return (
    <motion.div initial={isNew ? { opacity: 0, y: 8 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <Avatar initials={initials} color={color} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color }}>{name}</span>
          {msg.role === 'arjun' && <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: ORANGE, opacity: 0.6 }}>Staff Analyst</span>}
          {msg.meta && <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)' }}>{msg.meta}</span>}
        </div>
        {msg.role === 'arjun'
          ? <ArjunTypedMessage text={msg.text} isNew={isNew} />
          : <p style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--ink2)', fontStyle: 'italic', whiteSpace: 'pre-wrap', margin: 0 }}>{msg.text}</p>
        }
      </div>
    </motion.div>
  );
}

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <Avatar initials="AJ" color={ORANGE} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 10, background: `${ORANGE}08`, border: `1px solid ${ORANGE}18` }}>
        {[0,1,2].map(i => <motion.span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: ORANGE, display: 'block' }} animate={{ scale: [1,1.4,1], opacity: [0.4,1,0.4] }} transition={{ duration: 1.0, delay: i*0.2, repeat: Infinity }} />)}
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', marginLeft: 4 }}>Arjun is thinking...</span>
      </div>
    </div>
  );
}

// ── Chat input ────────────────────────────────────────────────────────────────
function ChatInput({ value, onChange, onSend, loading, placeholder, rows = 2, autoFocus = false }) {
  const [focused, setFocused] = useState(false);
  const textareaRef           = useRef(null);
  const hasContent            = value.length > 0;
  const canSend               = value.trim().length > 0 && !loading;

  useEffect(() => { if (autoFocus) setTimeout(() => textareaRef.current?.focus(), 100); }, [autoFocus]);

  const borderColor = focused ? ORANGE : hasContent ? `${ORANGE}50` : 'rgba(255,255,255,0.09)';
  const boxShadow   = focused ? `0 0 0 1px ${ORANGE}40, 0 0 12px ${ORANGE}15` : 'none';

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', padding: '12px 0 0' }}>
      <textarea ref={textareaRef} value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && rows === 2) { e.preventDefault(); onSend(); } }}
        placeholder={placeholder || 'Type your response...'} rows={rows}
        style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid ${borderColor}`, borderRadius: 10, padding: '10px 12px', fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink)', resize: 'none', outline: 'none', lineHeight: 1.55, transition: 'border-color 0.18s ease, box-shadow 0.18s ease', boxSizing: 'border-box', boxShadow }}
      />
      <motion.button onClick={onSend} whileHover={canSend ? { scale: 1.08 } : {}} whileTap={canSend ? { scale: 0.92 } : {}}
        style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: hasContent ? ORANGE : 'rgba(255,255,255,0.06)', border: 'none', cursor: canSend ? 'pointer' : 'default', transition: 'background 0.12s ease, box-shadow 0.12s ease', boxShadow: hasContent ? `0 2px 12px ${ORANGE}50` : 'none' }}>
        <Send size={15} color={hasContent ? '#fff' : 'rgba(255,255,255,0.2)'} />
      </motion.button>
      <style>{`textarea::placeholder { color: var(--ink2) !important; opacity: 0.65; }`}</style>
    </div>
  );
}

// ── Synthesis prompt ──────────────────────────────────────────────────────────
function SynthesisPrompt({ prompt, placeholder, minChars = 60, onSubmit, color = ORANGE }) {
  const [value, setValue]         = useState('');
  const [focused, setFocused]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const canSubmit = value.trim().length >= minChars && !submitted;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    onSubmit(value.trim());
  };

  if (submitted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginTop: 20, padding: '16px', borderRadius: 12, background: `${color}07`, border: `1px solid ${color}25` }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
        <Avatar initials="AJ" color={ORANGE} size={28} />
        <div>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: ORANGE, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Arjun — before we move on</p>
          <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.65, margin: 0 }}>{prompt}</p>
        </div>
      </div>
      <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${focused ? color : canSubmit ? `${color}40` : 'rgba(255,255,255,0.09)'}`, boxShadow: focused ? `0 0 0 1px ${color}35` : 'none', transition: 'border-color 0.18s, box-shadow 0.18s' }}>
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          rows={2}
          autoFocus
          style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: 'none', outline: 'none', color: 'var(--ink)', fontFamily: 'var(--sans)', fontSize: 13, lineHeight: 1.6, resize: 'none', boxSizing: 'border-box' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: canSubmit ? GREEN : 'var(--ink3)' }}>
            {canSubmit ? '✓ Locked in — this goes into your investigation log' : `${value.trim().length} / ${minChars} chars min`}
          </span>
          <motion.button onClick={handleSubmit} whileHover={canSubmit ? { scale: 1.05, y: -1 } : {}} whileTap={canSubmit ? { scale: 0.96 } : {}}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 8, background: canSubmit ? color : 'rgba(255,255,255,0.05)', color: canSubmit ? '#fff' : 'var(--ink3)', fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 700, border: 'none', cursor: canSubmit ? 'pointer' : 'default', transition: 'all 0.15s', boxShadow: canSubmit ? `0 2px 12px ${color}45` : 'none' }}>
            Lock it in <ArrowRight size={12} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Funnel table components (used both live and in locked cards) ───────────────
function FunnelComparison({ thisWeek, lastWeek, title }) {
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

function SegmentedFunnel() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 12 }}>
      {[{ label: 'New Users', data: FUNNEL_NEW_USERS, color: RED }, { label: 'Returning Users', data: FUNNEL_RETURNING_USERS, color: GREEN }].map(({ label, data, color }) => (
        <div key={label} style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${color}22`, background: `${color}05` }}>
          <div style={{ padding: '8px 12px', borderBottom: `1px solid ${color}14`, background: `${color}08` }}>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color, textTransform: 'uppercase', margin: 0 }}>{label}</p>
          </div>
          <div style={{ padding: '10px 12px' }}>
            {data.slice(0,5).map((s,i) => (
              <div key={s.stage} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <span style={{ fontSize: 11, color: 'var(--ink3)' }}>{s.stage}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: s.alert ? 700 : 400, color: s.alert ? RED : 'var(--ink2)' }}>{s.pct?.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Collapsed milestone card — locked state with visible data viz ──────────────
// Inputs are gone. Data visualizations remain visible when expanded.
// This is the core "feed" artifact for each completed milestone.
function CollapsedMilestoneCard({ milestone, index, conclusion, isExpanded, onToggle }) {
  const color = MILESTONE_COLORS[index % MILESTONE_COLORS.length];

  // Read-only data viz snapshot — visible when card is expanded
  // pointerEvents: none ensures nothing is clickable inside locked cards
  const DataSnapshot = () => {
    if (index === 1) { // M2 Dashboard
      return (
        <div style={{ marginTop: 12, pointerEvents: 'none', opacity: 0.8 }}>
          <KpiScorecard onMetricClick={() => {}} clickedMetric={null} interactive={false} />
        </div>
      );
    }
    if (index === 2) { // M3 Funnel
      return (
        <div style={{ marginTop: 12, pointerEvents: 'none', opacity: 0.8 }}>
          <FunnelComparison thisWeek={FUNNEL_THIS_WEEK} lastWeek={FUNNEL_LAST_WEEK} title="Conversion funnel · reference" />
          <SegmentedFunnel />
        </div>
      );
    }
    if (index === 3) { // M4 Root Cause
      return (
        <div style={{ marginTop: 12, pointerEvents: 'none', opacity: 0.8 }}>
          <CohortMatrix />
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginBottom: 8 }}
    >
      {/* Card header — always visible */}
      <div
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', borderRadius: isExpanded ? '10px 10px 0 0' : 10,
          cursor: 'pointer', background: `${color}06`,
          border: `1px solid ${color}18`,
          transition: 'background 0.2s, border-radius 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = `${color}0E`}
        onMouseLeave={e => e.currentTarget.style.background = `${color}06`}
      >
        <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}20`, border: `1.5px solid ${color}45` }}>
          <Check size={10} color={color} strokeWidth={3} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color, letterSpacing: '0.04em' }}>
            {milestone.number} {milestone.title}
          </span>
          {conclusion && (
            <p style={{ fontSize: 12, color: 'var(--ink2)', margin: '2px 0 0', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: isExpanded ? 'normal' : 'nowrap' }}>
              "{conclusion}"
            </p>
          )}
        </div>
        <div style={{ color: 'var(--ink3)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)' }}>
            {isExpanded ? 'collapse' : 'expand'}
          </span>
          {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </div>
      </div>

      {/* Expanded body — read-only data viz, no inputs */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              overflow: 'hidden',
              padding: '12px 14px',
              background: `${color}04`,
              border: `1px solid ${color}18`,
              borderTop: 'none',
              borderRadius: '0 0 10px 10px',
            }}
          >
            <DataSnapshot />
            {!([1, 2, 3].includes(index)) && (
              <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', margin: 0 }}>
                No data visualization for this milestone.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Investigation log updating animation ──────────────────────────────────────
function LogUpdating() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', marginBottom: 8 }}
    >
      <div style={{ display: 'flex', gap: 3 }}>
        {[0,1,2].map(i => (
          <motion.div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--ink3)' }}
            animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
        ))}
      </div>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)' }}>
        investigation log updating...
      </span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MILESTONE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const M1_CONTEXT_MESSAGE = `Quick context before we dive in — so we're on the same page.

Priya said orders are down 8.3%. Let's be precise about what that means:

• Orders = every time someone taps "Place Order" and it goes through. Not browsing, not adding to cart — a completed purchase.

• Week-over-week (WoW) = this Tuesday compared to last Tuesday. Not yesterday, not last month.

• GMV ₹19L = the total rupee value of those lost orders. Think of it this way: if 1,000 orders didn't happen and each was ₹190, that's ₹19 lakh gone.

Now — Priya flagged North Bangalore. But before I pull a single number, I want to know: is this actually isolated there, or are we seeing it elsewhere?`;

const M1_SCOPE_QUESTION = `Don't pull any data yet. Tell me — what's your instinct? Is this a North Bangalore problem, or could it be platform-wide and Priya just noticed it there first?`;

// ── Milestone 1: Scope ────────────────────────────────────────────────────────
function MilestoneScope({ onComplete, callArjunMilestone }) {
  const [stage, setStage]       = useState('context');
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [concept, setConcept]   = useState(null);
  const [messages, setMessages] = useState([]);
  const [advanced, setAdvanced] = useState(false);
  const [showSynthesis, setShowSynthesis] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [stage, messages, loading, showSynthesis]);

  const handleContextDone = useCallback(() => { setTimeout(() => setStage('bridge'), 600); }, []);

  useEffect(() => {
    if (stage === 'bridge') { const t = setTimeout(() => setStage('question'), 1200); return () => clearTimeout(t); }
  }, [stage]);

  const handleQuestionDone = useCallback(() => { setTimeout(() => setStage('input'), 400); }, []);

  const send = useCallback(async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    setStage('replied');
    setMessages(prev => [...prev, { role: 'user', text: q, isNew: true }]);
    setLoading(true);
    const { text, advance, concept: c } = await callArjunMilestone(q, 'scope');
    setLoading(false);
    setMessages(prev => [...prev, { role: 'arjun', text, isNew: true }]);
    if (c) setConcept(c);
    if (advance) {
      setAdvanced(true);
      setTimeout(() => setShowSynthesis(true), 1000);
    } else {
      setStage('input');
    }
  }, [input, loading, callArjunMilestone]);

  return (
    <div>
      {['context','bridge','question','input','replied'].includes(stage) && (
        <motion.div key="context-msg" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 20 }}>
          <Avatar initials="AJ" color={ORANGE} size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: ORANGE }}>Arjun</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: ORANGE, opacity: 0.6 }}>Staff Analyst</span>
            </div>
            <ArjunTypedMessage text={M1_CONTEXT_MESSAGE} isNew={stage === 'context'} onDone={handleContextDone} />
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {['bridge','question','input','replied'].includes(stage) && (
          <motion.div key="bridge" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 20px 42px' }}>
            <div style={{ flex: 1, height: 1, background: `${ORANGE}20` }} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: ORANGE, opacity: 0.7, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5 }}>
              <ArrowDown size={10} /> Your turn first
            </span>
            <div style={{ flex: 1, height: 1, background: `${ORANGE}20` }} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {['question','input','replied'].includes(stage) && (
          <motion.div key="scope-q" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
            style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 20 }}>
            <Avatar initials="AJ" color={ORANGE} size={32} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: ORANGE }}>Arjun</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: ORANGE, opacity: 0.6 }}>Staff Analyst</span>
              </div>
              <ArjunTypedMessage text={M1_SCOPE_QUESTION} isNew={stage === 'question'} onDone={handleQuestionDone} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {messages.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
          {messages.map((msg, i) => <Message key={i} msg={msg} isNew={msg.isNew} />)}
          {loading && <TypingIndicator />}
        </div>
      )}

      <AnimatePresence>{concept && <ConceptChip concept={concept} onDismiss={() => setConcept(null)} />}</AnimatePresence>

      <AnimatePresence>
        {stage === 'input' && !advanced && (
          <motion.div key="input-area" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: ORANGE, flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: ORANGE, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Your turn — reply to Arjun
              </span>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ padding: '8px 12px', borderRadius: 8, marginBottom: 8, background: `${BLUE}08`, border: `1px solid ${BLUE}16` }}>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink2)', margin: 0, lineHeight: 1.6 }}>
                💡 Type what you think — there's no wrong answer. Arjun will react to whatever you write.
              </p>
            </motion.div>
            <ChatInput value={input} onChange={setInput} onSend={send} loading={loading}
              placeholder="My instinct is this is probably isolated to North Bangalore because..." autoFocus />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSynthesis && (
          <SynthesisPrompt
            prompt="Before we pull any data — write your problem statement in one sentence. What exactly are we investigating?"
            placeholder='We are investigating: [what dropped], in [where], compared to [when], because [why it matters]...'
            minChars={60}
            color={ORANGE}
            onSubmit={(sentence) => onComplete(sentence)}
          />
        )}
      </AnimatePresence>

      <div ref={bottomRef} />
    </div>
  );
}

// ── Milestone 2: Dashboard ────────────────────────────────────────────────────
function MilestoneDashboard({ onComplete, callArjunMilestone }) {
  const [predictionDone, setPredictionDone] = useState(false);
  const [arjunOpened, setArjunOpened]       = useState(false);
  const [messages, setMessages]             = useState([]);
  const [kpiClicked, setKpiClicked]         = useState(null);
  const [concept, setConcept]               = useState(null);
  const [loading, setLoading]               = useState(false);
  const [input, setInput]                   = useState('');
  const [followUpShown, setFollowUpShown]   = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (predictionDone && !arjunOpened) {
      const t = setTimeout(() => { setMessages([{ role: 'arjun', text: MILESTONES[1].arjunOpening, isNew: true }]); setArjunOpened(true); }, 400);
      return () => clearTimeout(t);
    }
  }, [predictionDone, arjunOpened]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading, kpiClicked]);

  const handleKpiClick = useCallback((metricKey) => {
    if (kpiClicked) return;
    setKpiClicked(metricKey);
    const { text, followUp, isCorrect, conceptTrigger } = getKpiClickResponse(metricKey);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessages(prev => [...prev, { role: 'arjun', text, isNew: true }]);
      if (conceptTrigger) setConcept(conceptTrigger);
      setTimeout(() => {
        if (followUp) { setMessages(prev => [...prev, { role: 'arjun', text: followUp, isNew: true }]); setFollowUpShown(true); }
        if (isCorrect) setTimeout(() => onComplete(null), 2500);
      }, 1200);
    }, 900);
  }, [kpiClicked, onComplete]);

  const send = useCallback(async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: q, isNew: true }]);
    setLoading(true);
    const { text, advance, concept: c } = await callArjunMilestone(q, 'dashboard');
    setLoading(false);
    setMessages(prev => [...prev, { role: 'arjun', text, isNew: true }]);
    if (c) setConcept(c);
    if (advance) setTimeout(() => onComplete(null), 2500);
  }, [input, loading, callArjunMilestone, onComplete]);

  return (
    <div>
      {!predictionDone && <PredictionPrompt prediction={PREDICTIONS.dashboard} onComplete={() => setPredictionDone(true)} />}
      <AnimatePresence>
        {predictionDone && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
              {messages.map((msg, i) => <Message key={i} msg={msg} isNew={msg.isNew} />)}
              {loading && <TypingIndicator />}
            </div>
            {arjunOpened && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <KpiScorecard onMetricClick={handleKpiClick} clickedMetric={kpiClicked} interactive={!kpiClicked} />
              </motion.div>
            )}
            <AnimatePresence>{concept && <ConceptChip concept={concept} onDismiss={() => setConcept(null)} />}</AnimatePresence>
            {followUpShown && <ChatInput value={input} onChange={setInput} onSend={send} loading={loading} placeholder="Type your reasoning..." />}
            <div ref={bottomRef} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Milestone 3: Funnel ───────────────────────────────────────────────────────
function MilestoneFunnel({ onComplete, callArjunMilestone }) {
  const [predictionDone, setPredictionDone] = useState(false);
  const [messages, setMessages]             = useState([]);
  const [input, setInput]                   = useState('');
  const [loading, setLoading]               = useState(false);
  const [concept, setConcept]               = useState(null);
  const [funnelReady, setFunnelReady]       = useState(false);
  const [segmentReady, setSegmentReady]     = useState(false);
  const [arjunOpened, setArjunOpened]       = useState(false);
  const [showSynthesis, setShowSynthesis]   = useState(false);
  const bottomRef = useRef(null);

  const funnelQ = { query: 'Show conversion funnel, North Bangalore, this week vs last week.', reasoning: "I want each stage side by side — the delta at each step tells me which stage changed most, not just which has the biggest absolute drop.", arjunReads: "Add-to-Cart dropped from 57.8% to 44.3% — a 13.5 point swing. Every other stage moved 2-5 points. That's the anomaly." };
  const segQ    = { query: 'Break the funnel down by new users vs returning users. Same period.', reasoning: SEGMENTATION_INSIGHT.queryReasoning, arjunReads: SEGMENTATION_INSIGHT.finding };

  useEffect(() => { if (predictionDone && !arjunOpened) { setTimeout(() => { setMessages([{ role: 'arjun', text: MILESTONES[2].arjunOpening, isNew: true }]); setArjunOpened(true); }, 400); } }, [predictionDone, arjunOpened]);
  useEffect(() => { if (segmentReady) { setTimeout(() => setMessages(prev => [...prev, { role: 'arjun', text: MILESTONES[2].arjunQuestion, isNew: true }]), 600); } }, [segmentReady]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading, funnelReady, segmentReady, showSynthesis]);

  const send = useCallback(async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: q, isNew: true }]);
    setLoading(true);
    const { text, advance, concept: c } = await callArjunMilestone(q, 'funnel');
    setLoading(false);
    setMessages(prev => [...prev, { role: 'arjun', text, isNew: true }]);
    if (c) setConcept(c);
    if (advance) setTimeout(() => setShowSynthesis(true), 1000);
  }, [input, loading, callArjunMilestone]);

  return (
    <div>
      {!predictionDone && <PredictionPrompt prediction={PREDICTIONS.funnel} onComplete={() => setPredictionDone(true)} />}
      <AnimatePresence>
        {predictionDone && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
              {messages.map((msg, i) => <Message key={i} msg={msg} isNew={msg.isNew} />)}
              {loading && <TypingIndicator />}
            </div>
            {arjunOpened && <ArjunQueryTerminal queryData={funnelQ} onComplete={() => setFunnelReady(true)} />}
            {funnelReady && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <FunnelComparison thisWeek={FUNNEL_THIS_WEEK} lastWeek={FUNNEL_LAST_WEEK} title="Conversion funnel · This week vs Last week" />
                <ArjunQueryTerminal queryData={segQ} onComplete={() => setSegmentReady(true)} />
              </motion.div>
            )}
            {segmentReady && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}><SegmentedFunnel /></motion.div>}
            <AnimatePresence>{concept && <ConceptChip concept={concept} onDismiss={() => setConcept(null)} />}</AnimatePresence>
            {segmentReady && !showSynthesis && <ChatInput value={input} onChange={setInput} onSend={send} loading={loading} placeholder={MILESTONES[2].hint1} />}
            <AnimatePresence>
              {showSynthesis && (
                <SynthesisPrompt
                  prompt="In one sentence — what did the funnel tell you that the dashboard couldn't?"
                  placeholder="The funnel showed that the drop is happening at Add-to-Cart, specifically for new users, which means..."
                  minChars={60}
                  color={PURPLE}
                  onSubmit={(sentence) => onComplete(sentence)}
                />
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Milestone 4: Root Cause ───────────────────────────────────────────────────
function MilestoneRootCause({ onComplete, callArjunMilestone }) {
  const [predictionDone, setPredictionDone] = useState(false);
  const [messages, setMessages]             = useState([]);
  const [input, setInput]                   = useState('');
  const [loading, setLoading]               = useState(false);
  const [concept, setConcept]               = useState(null);
  const [cohortReady, setCohortReady]       = useState(false);
  const [arjunOpened, setArjunOpened]       = useState(false);
  const bottomRef = useRef(null);

  const cohortQ = { query: COHORT_NARRATION.query, reasoning: COHORT_NARRATION.queryReasoning, arjunReads: COHORT_NARRATION.observation };

  useEffect(() => { if (predictionDone && !arjunOpened) { setTimeout(() => { setMessages([{ role: 'arjun', text: MILESTONES[3].arjunOpening, isNew: true }]); setArjunOpened(true); }, 400); } }, [predictionDone, arjunOpened]);
  useEffect(() => { if (cohortReady) { setTimeout(() => setMessages(prev => [...prev, { role: 'arjun', text: MILESTONES[3].arjunQuestion, isNew: true }]), 600); } }, [cohortReady]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading, cohortReady]);

  const send = useCallback(async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: q, isNew: true }]);
    setLoading(true);
    const { text, advance, concept: c } = await callArjunMilestone(q, 'rootcause');
    setLoading(false);
    setMessages(prev => [...prev, { role: 'arjun', text, isNew: true }]);
    if (c) setConcept(c);
    if (advance) setTimeout(() => onComplete(null), 2500);
  }, [input, loading, callArjunMilestone, onComplete]);

  return (
    <div>
      {!predictionDone && <PredictionPrompt prediction={PREDICTIONS.rootcause} onComplete={() => setPredictionDone(true)} />}
      <AnimatePresence>
        {predictionDone && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
              {messages.map((msg, i) => <Message key={i} msg={msg} isNew={msg.isNew} />)}
              {loading && <TypingIndicator />}
            </div>
            {arjunOpened && <ArjunQueryTerminal queryData={cohortQ} onComplete={() => setCohortReady(true)} />}
            {cohortReady && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: 16 }}><CohortMatrix /></motion.div>}
            <AnimatePresence>{concept && <ConceptChip concept={concept} onDismiss={() => setConcept(null)} />}</AnimatePresence>
            {cohortReady && <ChatInput value={input} onChange={setInput} onSend={send} loading={loading} placeholder={MILESTONES[3].hint1} />}
            <div ref={bottomRef} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Milestone 5: Impact ───────────────────────────────────────────────────────
function ImpactInputs() {
  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${PURPLE}22`, background: `${PURPLE}05`, marginBottom: 16 }}>
      <div style={{ padding: '9px 14px', background: `${PURPLE}08`, borderBottom: `1px solid ${PURPLE}14` }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: PURPLE, margin: 0 }}>Your inputs — use these to build the calculation</p>
      </div>
      <div style={{ padding: '14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
        {[{ label: 'Churned new users', value: `${IMPACT_SIZING.churnedUsers}`, unit: 'users' }, { label: 'Avg order value', value: `₹${IMPACT_SIZING.avgOrderValue}`, unit: 'per order' }, { label: 'Orders per week', value: `${IMPACT_SIZING.ordersPerWeek}`, unit: 'per user' }, { label: 'Weeks in year', value: `${IMPACT_SIZING.weeksInYear}`, unit: 'weeks' }].map(({ label, value, unit }) => (
          <div key={label} style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', marginBottom: 4 }}>{label}</p>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 800, color: PURPLE, lineHeight: 1, marginBottom: 2 }}>{value}</p>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)' }}>{unit}</p>
          </div>
        ))}
      </div>
      <div style={{ padding: '10px 14px', borderTop: `1px solid ${PURPLE}14`, background: 'rgba(0,0,0,0.15)' }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', margin: 0 }}>Formula: churned users × AOV × orders/week × weeks = annual GMV at risk. Then apply recovery rate.</p>
      </div>
    </div>
  );
}

function MilestoneImpact({ onComplete, callArjunMilestone }) {
  const [messages, setMessages]           = useState([]);
  const [input, setInput]                 = useState('');
  const [loading, setLoading]             = useState(false);
  const [concept, setConcept]             = useState(null);
  const [arjunOpened, setArjunOpened]     = useState(false);
  const [showSynthesis, setShowSynthesis] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setMessages([{ role: 'arjun', text: MILESTONES[4].arjunOpening, isNew: true }]);
      setArjunOpened(true);
      setTimeout(() => setMessages(prev => [...prev, { role: 'arjun', text: MILESTONES[4].arjunQuestion, isNew: true }]), 800);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading, showSynthesis]);

  const send = useCallback(async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: q, isNew: true }]);
    setLoading(true);
    const { text, advance, concept: c } = await callArjunMilestone(q, 'impact');
    setLoading(false);
    setMessages(prev => [...prev, { role: 'arjun', text, isNew: true }]);
    if (c) setConcept(c);
    if (advance) setTimeout(() => setShowSynthesis(true), 1000);
  }, [input, loading, callArjunMilestone]);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
        {messages.map((msg, i) => <Message key={i} msg={msg} isNew={msg.isNew} />)}
        {loading && <TypingIndicator />}
      </div>
      {arjunOpened && <ImpactInputs />}
      <AnimatePresence>{concept && <ConceptChip concept={concept} onDismiss={() => setConcept(null)} />}</AnimatePresence>
      {arjunOpened && !showSynthesis && (
        <ChatInput value={input} onChange={setInput} onSend={send} loading={loading}
          placeholder="e.g. 820 × ₹385 × 2.1 × 52 = ₹3.46Cr. At 65% recovery = ₹2.25Cr" />
      )}
      <AnimatePresence>
        {showSynthesis && (
          <SynthesisPrompt
            prompt="What's the one-line number you'd lead with in your memo to Priya?"
            placeholder="₹2.25Cr recoverable GMV at 65% recovery rate, if Biryani supply is restored within 3 weeks"
            minChars={40}
            color={PURPLE}
            onSubmit={(sentence) => onComplete(sentence)}
          />
        )}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}

// ── Milestone 6: Respond ──────────────────────────────────────────────────────
function MemoInput({ value, onChange, onSend, loading }) {
  const [focused, setFocused] = useState(false);
  const charCount  = value.trim().length;
  const canSend    = charCount >= 80 && !loading;
  const hasContent = value.length > 0;
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        {['① Root cause','② Evidence','③ Impact','④ Action'].map((step,i) => (
          <span key={i} style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: ORANGE, padding: '3px 8px', borderRadius: 6, background: `${ORANGE}10`, border: `1px solid ${ORANGE}20` }}>{step}</span>
        ))}
      </div>
      <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${focused ? ORANGE : canSend ? `${ORANGE}40` : 'rgba(255,255,255,0.09)'}`, boxShadow: focused ? `0 0 0 1px ${ORANGE}35` : 'none', transition: 'border-color 0.18s, box-shadow 0.18s' }}>
        <textarea value={value} onChange={e => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder="Hey Priya — the drop is driven by..." rows={5}
          style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: 'none', outline: 'none', color: 'var(--ink)', fontFamily: 'var(--sans)', fontSize: 14, lineHeight: 1.7, resize: 'none', boxSizing: 'border-box' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: canSend ? GREEN : 'var(--ink3)' }}>{canSend ? '✓ Ready to send to Priya' : `${charCount} / 80 chars min`}</span>
          <motion.button onClick={onSend} disabled={!canSend} whileHover={canSend ? { scale: 1.04, y: -1 } : {}} whileTap={canSend ? { scale: 0.97 } : {}}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 8, background: hasContent ? ORANGE : 'rgba(255,255,255,0.05)', color: hasContent ? '#fff' : 'var(--ink3)', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 700, border: 'none', cursor: canSend ? 'pointer' : 'default', transition: 'all 0.15s', boxShadow: canSend ? `0 2px 14px ${ORANGE}50` : 'none' }}>
            Send to Priya <ArrowRight size={13} />
          </motion.button>
        </div>
      </div>
      <style>{`textarea::placeholder { color: var(--ink2) !important; opacity: 0.65; }`}</style>
    </div>
  );
}

function MilestoneRespond({ onComplete, callArjunMilestone, investigationLog }) {
  const [messages, setMessages]       = useState([]);
  const [memo, setMemo]               = useState('');
  const [loading, setLoading]         = useState(false);
  const [concept, setConcept]         = useState(null);
  const [submitted, setSubmitted]     = useState(false);
  const [logExpanded, setLogExpanded] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setMessages([{ role: 'arjun', text: MILESTONES[5].arjunOpening, isNew: true }]);
      setTimeout(() => setMessages(prev => [...prev, { role: 'arjun', text: MILESTONES[5].arjunQuestion, isNew: true }]), 800);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const handleSend = useCallback(async () => {
    const q = memo.trim();
    if (!q || loading || submitted) return;
    setSubmitted(true);
    setMessages(prev => [...prev, { role: 'user', text: q, isNew: true }]);
    setLoading(true);
    const { text, advance, concept: c } = await callArjunMilestone(q, 'respond');
    setLoading(false);
    setMessages(prev => [...prev, { role: 'arjun', text, isNew: true }]);
    if (c) setConcept(c);
    if (advance) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'priya', text: "Got it — this is exactly what I needed. Escalating to the VP now with your recommendation. Good work.", isNew: true, meta: '9:48 AM' }]);
        setTimeout(() => onComplete(null), 2500);
      }, 1800);
    }
  }, [memo, loading, submitted, callArjunMilestone, onComplete]);

  const impactLine = investigationLog?.find(l => l.index === 4)?.conclusion;

  return (
    <div>
      <div style={{ padding: '10px 12px', borderRadius: 9, marginBottom: 16, background: `${RED}06`, border: `1px solid ${RED}16`, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: RED, textTransform: 'uppercase', flexShrink: 0, marginTop: 2 }}>Priya is waiting</span>
        <p style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.55, margin: 0 }}>{SCENARIO.priyaMessage}</p>
      </div>

      {investigationLog && investigationLog.filter(l => l.conclusion).length > 0 && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          style={{ marginBottom: 16, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <button onClick={() => setLogExpanded(e => !e)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.06em', flex: 1 }}>
              Your investigation trail — {investigationLog.filter(l => l.conclusion).length} findings
            </span>
            {logExpanded ? <ChevronDown size={13} color="var(--ink3)" /> : <ChevronRight size={13} color="var(--ink3)" />}
          </button>
          <AnimatePresence>
            {logExpanded && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {investigationLog.filter(l => l.conclusion).map((entry, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, padding: '6px 0', borderBottom: i < investigationLog.filter(l => l.conclusion).length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: MILESTONE_COLORS[entry.index], flexShrink: 0, marginTop: 2 }}>M{entry.index + 1}</span>
                      <p style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.5, margin: 0 }}>"{entry.conclusion}"</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {impactLine && (
        <div style={{ padding: '8px 12px', borderRadius: 8, marginBottom: 14, background: `${PURPLE}08`, border: `1px solid ${PURPLE}18` }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: PURPLE, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your impact number: </span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink2)' }}>{impactLine}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
        {messages.map((msg, i) => <Message key={i} msg={msg} isNew={msg.isNew} />)}
        {loading && <TypingIndicator />}
      </div>
      <AnimatePresence>{concept && <ConceptChip concept={concept} onDismiss={() => setConcept(null)} />}</AnimatePresence>
      {!submitted && <MemoInput value={memo} onChange={setMemo} onSend={handleSend} loading={loading} />}
      <div ref={bottomRef} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── MAIN — Continuous Vertical War-Room Feed ──────────────────────────────────
//
// State shape:
//   activeMilestoneIndex: number — which milestone is currently active
//   log: [{ index, conclusion }]  — completed milestones in order
//   expandedCards: Set<number>    — which collapsed cards are expanded
//
// New in CP10:
//   milestoneRefs: array of refs — one per milestone (for scroll-spy)
//   feedBottomRef: ref           — auto-scroll anchor at end of feed
//   onMilestoneAdvance prop      — notifies StrategyCase of active milestone name
// ─────────────────────────────────────────────────────────────────────────────
export default function ArjunSocraticChat({ phase, onVizRequest, onAdvance, onMilestoneAdvance }) {
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(0);
  const [log, setLog]                                   = useState([]);
  const [expandedCards, setExpandedCards]               = useState(new Set());
  const [updating, setUpdating]                         = useState(false);
  const { callArjunMilestone } = useArjunStrategy();

  // Refs for scroll-spy — one slot per milestone
  const milestoneRefs = useRef([]);
  const feedBottomRef = useRef(null);

  // Auto-scroll to bottom on every feed change
  useEffect(() => {
    feedBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [log, activeMilestoneIndex, updating]);

  const completedIndices = log.map(e => MILESTONES[e.index]?.id).filter(Boolean);

  const handleComplete = useCallback((index, conclusion) => {
    setUpdating(true);
    setTimeout(() => {
      setUpdating(false);
      setLog(prev => [...prev, { index, conclusion }]);

      if (index < MILESTONES.length - 1) {
        const nextIndex = index + 1;
        setTimeout(() => {
          setActiveMilestoneIndex(nextIndex);
          // Notify StrategyCase so IncidentStatusBar can update
          const nextMilestone = MILESTONES[nextIndex];
          if (nextMilestone) {
            onMilestoneAdvance?.(nextMilestone.title.toUpperCase(), nextIndex, conclusion);
          }
        }, 400);
      } else {
        setTimeout(() => onAdvance?.(), 2500);
      }
    }, 1200);
  }, [onAdvance, onMilestoneAdvance]);

  const toggleCard = useCallback((index) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  }, []);

  // Scroll-spy click handler — passed to MilestoneStrip
  const handleMilestoneClick = useCallback((idx) => {
    milestoneRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const currentMilestone = MILESTONES[activeMilestoneIndex];
  const headerLabel = currentMilestone
    ? `# analytics-incident · ${currentMilestone.number} ${currentMilestone.title}`
    : '# analytics-incident';

  return (
    <div>
      {/* Dynamic channel header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
        <MessageSquare size={13} color="var(--ink3)" />
        <motion.span
          key={headerLabel}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink3)' }}
        >
          {headerLabel}
        </motion.span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
          <motion.span animate={{ opacity: [1,0.3,1] }} transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: RED, display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: RED, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Incident Active</span>
        </div>
      </div>

      {/* Milestone strip — now with scroll-spy click handler */}
      <MilestoneStrip
        currentIndex={activeMilestoneIndex}
        completedIndices={completedIndices}
        onMilestoneClick={handleMilestoneClick}
      />

      {/* ── CONTINUOUS FEED — completed milestones rendered top-to-bottom ── */}
      {log.map((entry) => (
        <div
          key={entry.index}
          ref={el => { milestoneRefs.current[entry.index] = el; }}
        >
          <CollapsedMilestoneCard
            milestone={MILESTONES[entry.index]}
            index={entry.index}
            conclusion={entry.conclusion}
            isExpanded={expandedCards.has(entry.index)}
            onToggle={() => toggleCard(entry.index)}
          />
        </div>
      ))}

      {/* Log updating animation */}
      <AnimatePresence>
        {updating && <LogUpdating />}
      </AnimatePresence>

      {/* ── ACTIVE MILESTONE — always at bottom of feed, slides in ── */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeMilestoneIndex}
          ref={el => { milestoneRefs.current[activeMilestoneIndex] = el; }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginTop: log.length > 0 ? 16 : 0 }}
        >
          {/* Separator label between completed cards and active milestone */}
          {log.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: MILESTONE_COLORS[activeMilestoneIndex % MILESTONE_COLORS.length], opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {currentMilestone?.number} {currentMilestone?.title}
              </span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            </div>
          )}

          {activeMilestoneIndex === 0 && (
            <MilestoneScope
              onComplete={(conclusion) => handleComplete(0, conclusion)}
              callArjunMilestone={callArjunMilestone}
            />
          )}
          {activeMilestoneIndex === 1 && (
            <MilestoneDashboard
              onComplete={(conclusion) => handleComplete(1, conclusion)}
              callArjunMilestone={callArjunMilestone}
            />
          )}
          {activeMilestoneIndex === 2 && (
            <MilestoneFunnel
              onComplete={(conclusion) => handleComplete(2, conclusion)}
              callArjunMilestone={callArjunMilestone}
            />
          )}
          {activeMilestoneIndex === 3 && (
            <MilestoneRootCause
              onComplete={(conclusion) => handleComplete(3, conclusion)}
              callArjunMilestone={callArjunMilestone}
            />
          )}
          {activeMilestoneIndex === 4 && (
            <MilestoneImpact
              onComplete={(conclusion) => handleComplete(4, conclusion)}
              callArjunMilestone={callArjunMilestone}
            />
          )}
          {activeMilestoneIndex === 5 && (
            <MilestoneRespond
              onComplete={(conclusion) => handleComplete(5, conclusion)}
              callArjunMilestone={callArjunMilestone}
              investigationLog={log}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Feed scroll anchor — auto-scrolled to on every state change */}
      <div ref={feedBottomRef} style={{ height: 1 }} />
    </div>
  );
}