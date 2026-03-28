// src/components/strategy/components/ArjunSocraticChat.jsx
// UX Fixes: M1 no prediction, M2 KPI only, query terminal parallel load, strip compact

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, ArrowRight } from 'lucide-react';
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

function Avatar({ initials, color, size = 32 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: size * 0.3, fontWeight: 800, background: `${color}20`, border: `1px solid ${color}40`, color }}>
      {initials}
    </div>
  );
}

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
        <p style={{ fontSize: 13, lineHeight: 1.65, color: msg.role === 'user' ? 'var(--ink2)' : 'var(--ink)', fontStyle: msg.role === 'user' ? 'italic' : 'normal', whiteSpace: 'pre-wrap', margin: 0 }}>
          {msg.text}
        </p>
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <Avatar initials="AJ" color={ORANGE} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 10, background: `${ORANGE}08`, border: `1px solid ${ORANGE}18` }}>
        {[0, 1, 2].map(i => (
          <motion.span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: ORANGE, display: 'block' }} animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.0, delay: i * 0.2, repeat: Infinity }} />
        ))}
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', marginLeft: 4 }}>Arjun is thinking...</span>
      </div>
    </div>
  );
}

function ChatInput({ value, onChange, onSend, loading, placeholder, rows = 2 }) {
  const canSend = value.trim().length > 0 && !loading;
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', padding: '12px 0 0' }}>
      <textarea value={value} onChange={e => onChange(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && rows === 2) { e.preventDefault(); onSend(); } }} placeholder={placeholder || 'Type your response...'} rows={rows} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid ${canSend ? `${ORANGE}35` : 'rgba(255,255,255,0.09)'}`, borderRadius: 10, padding: '10px 12px', fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink)', resize: 'none', outline: 'none', lineHeight: 1.55, transition: 'border-color 0.2s', boxSizing: 'border-box' }} />
      <motion.button onClick={onSend} whileHover={canSend ? { scale: 1.08 } : {}} whileTap={canSend ? { scale: 0.92 } : {}} style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: canSend ? ORANGE : 'rgba(255,255,255,0.06)', border: 'none', cursor: canSend ? 'pointer' : 'default', transition: 'all 0.2s', boxShadow: canSend ? '0 2px 12px rgba(252,128,25,0.3)' : 'none' }}>
        <Send size={15} color={canSend ? '#fff' : 'rgba(255,255,255,0.2)'} />
      </motion.button>
    </div>
  );
}

function FunnelComparison({ thisWeek, lastWeek, title }) {
  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', marginBottom: 12 }}>
      <div style={{ padding: '9px 14px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink3)', margin: 0 }}>{title}</p>
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 60px', gap: 8, marginBottom: 8 }}>
          {['Stage', 'This week', 'Last week', 'Δ'].map(h => <span key={h} style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink3)' }}>{h}</span>)}
        </div>
        {thisWeek.map((step, i) => {
          const last = lastWeek[i];
          const delta = last ? (step.pct - last.pct).toFixed(1) : null;
          const isAnomaly = delta !== null && Math.abs(parseFloat(delta)) > 8;
          return (
            <div key={step.stage} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 60px', gap: 8, padding: '6px 0', borderBottom: i < thisWeek.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: isAnomaly ? `${RED}06` : 'transparent', borderRadius: isAnomaly ? 6 : 0 }}>
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
            {data.slice(0, 5).map((s, i) => (
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

function MemoInput({ value, onChange, onSend, loading }) {
  const charCount = value.trim().length;
  const canSend = charCount >= 80 && !loading;
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        {['① Root cause', '② Evidence', '③ Impact', '④ Action'].map((step, i) => (
          <span key={i} style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: ORANGE, padding: '3px 8px', borderRadius: 6, background: `${ORANGE}10`, border: `1px solid ${ORANGE}20` }}>{step}</span>
        ))}
      </div>
      <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${canSend ? `${ORANGE}40` : 'rgba(255,255,255,0.09)'}`, transition: 'border-color 0.25s' }}>
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder="Hey Priya — the drop is driven by..." rows={5} style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: 'none', outline: 'none', color: 'var(--ink)', fontFamily: 'var(--sans)', fontSize: 14, lineHeight: 1.7, resize: 'none', boxSizing: 'border-box' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: canSend ? GREEN : 'var(--ink3)' }}>{canSend ? '✓ Ready to send to Priya' : `${charCount} / 80 chars min`}</span>
          <motion.button onClick={onSend} disabled={!canSend} whileHover={canSend ? { scale: 1.04, y: -1 } : {}} whileTap={canSend ? { scale: 0.97 } : {}} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 8, background: canSend ? ORANGE : 'rgba(255,255,255,0.05)', color: canSend ? '#fff' : 'var(--ink3)', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 700, border: 'none', cursor: canSend ? 'pointer' : 'default', transition: 'all 0.2s', boxShadow: canSend ? '0 2px 14px rgba(252,128,25,0.35)' : 'none' }}>
            Send to Priya <ArrowRight size={13} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ── Milestone 1: Scope — NO prediction, opens immediately ────────────────────
function MilestoneScope({ onComplete, callArjunMilestone }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [arjunOpened, setArjunOpened] = useState(false);
  const [concept, setConcept] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setMessages([{ role: 'arjun', text: MILESTONES[0].arjunOpening, isNew: true }]);
      setArjunOpened(true);
      setTimeout(() => setMessages(prev => [...prev, { role: 'arjun', text: MILESTONES[0].arjunQuestion, isNew: true }]), 900);
    }, 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const send = useCallback(async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: q, isNew: true }]);
    setLoading(true);
    const { text, advance, concept: c } = await callArjunMilestone(q, 'scope');
    setLoading(false);
    setMessages(prev => [...prev, { role: 'arjun', text, isNew: true }]);
    if (c) setConcept(c);
    if (advance) setTimeout(() => onComplete(), 1200);
  }, [input, loading, callArjunMilestone, onComplete]);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
        {messages.map((msg, i) => <Message key={i} msg={msg} isNew={msg.isNew} />)}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
      <AnimatePresence>{concept && <ConceptChip concept={concept} onDismiss={() => setConcept(null)} />}</AnimatePresence>
      {arjunOpened && <ChatInput value={input} onChange={setInput} onSend={send} loading={loading} placeholder={MILESTONES[0].hint1} />}
    </div>
  );
}

// ── Milestone 2: Dashboard — prediction + KPI ────────────────────────────────
function MilestoneDashboard({ onComplete, callArjunMilestone }) {
  const [predictionDone, setPredictionDone] = useState(false);
  const [arjunOpened, setArjunOpened] = useState(false);
  const [messages, setMessages] = useState([]);
  const [kpiClicked, setKpiClicked] = useState(null);
  const [concept, setConcept] = useState(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [followUpShown, setFollowUpShown] = useState(false);
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
        if (isCorrect) setTimeout(() => onComplete(), 2000);
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
    if (advance) setTimeout(() => onComplete(), 1200);
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
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [concept, setConcept] = useState(null);
  const [funnelReady, setFunnelReady] = useState(false);
  const [segmentReady, setSegmentReady] = useState(false);
  const [arjunOpened, setArjunOpened] = useState(false);
  const bottomRef = useRef(null);

  const funnelQ = { query: 'Show conversion funnel, North Bangalore, this week vs last week.', reasoning: "I want each stage side by side — the delta at each step tells me which stage changed most, not just which has the biggest absolute drop.", arjunReads: "Add-to-Cart dropped from 57.8% to 44.3% — a 13.5 point swing. Every other stage moved 2-5 points. That's the anomaly." };
  const segQ = { query: 'Break the funnel down by new users vs returning users. Same period.', reasoning: SEGMENTATION_INSIGHT.queryReasoning, arjunReads: SEGMENTATION_INSIGHT.finding };

  useEffect(() => { if (predictionDone && !arjunOpened) { setTimeout(() => { setMessages([{ role: 'arjun', text: MILESTONES[2].arjunOpening, isNew: true }]); setArjunOpened(true); }, 400); } }, [predictionDone, arjunOpened]);
  useEffect(() => { if (segmentReady) { setTimeout(() => setMessages(prev => [...prev, { role: 'arjun', text: MILESTONES[2].arjunQuestion, isNew: true }]), 600); } }, [segmentReady]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading, funnelReady, segmentReady]);

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
    if (advance) setTimeout(() => onComplete(), 1200);
  }, [input, loading, callArjunMilestone, onComplete]);

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
            {segmentReady && <ChatInput value={input} onChange={setInput} onSend={send} loading={loading} placeholder={MILESTONES[2].hint1} />}
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
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [concept, setConcept] = useState(null);
  const [cohortReady, setCohortReady] = useState(false);
  const [arjunOpened, setArjunOpened] = useState(false);
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
    if (advance) setTimeout(() => onComplete(), 1200);
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
function MilestoneImpact({ onComplete, callArjunMilestone }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [concept, setConcept] = useState(null);
  const [arjunOpened, setArjunOpened] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setMessages([{ role: 'arjun', text: MILESTONES[4].arjunOpening, isNew: true }]);
      setArjunOpened(true);
      setTimeout(() => setMessages(prev => [...prev, { role: 'arjun', text: MILESTONES[4].arjunQuestion, isNew: true }]), 800);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

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
    if (advance) setTimeout(() => onComplete(), 1200);
  }, [input, loading, callArjunMilestone, onComplete]);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
        {messages.map((msg, i) => <Message key={i} msg={msg} isNew={msg.isNew} />)}
        {loading && <TypingIndicator />}
      </div>
      {arjunOpened && <ImpactInputs />}
      <AnimatePresence>{concept && <ConceptChip concept={concept} onDismiss={() => setConcept(null)} />}</AnimatePresence>
      {arjunOpened && <ChatInput value={input} onChange={setInput} onSend={send} loading={loading} placeholder="e.g. 820 × ₹385 × 2.1 × 52 = ₹3.46Cr. At 65% recovery = ₹2.25Cr" />}
      <div ref={bottomRef} />
    </div>
  );
}

// ── Milestone 6: Respond ──────────────────────────────────────────────────────
function MilestoneRespond({ onComplete, callArjunMilestone }) {
  const [messages, setMessages] = useState([]);
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [concept, setConcept] = useState(null);
  const [submitted, setSubmitted] = useState(false);
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
        setTimeout(() => onComplete(), 2000);
      }, 1800);
    }
  }, [memo, loading, submitted, callArjunMilestone, onComplete]);

  return (
    <div>
      <div style={{ padding: '10px 12px', borderRadius: 9, marginBottom: 16, background: `${RED}06`, border: `1px solid ${RED}16`, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: RED, textTransform: 'uppercase', flexShrink: 0, marginTop: 2 }}>Priya is waiting</span>
        <p style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.55, margin: 0 }}>{SCENARIO.priyaMessage}</p>
      </div>
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

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ArjunSocraticChat({ phase, onVizRequest, onAdvance }) {
  const [milestoneIndex, setMilestoneIndex] = useState(0);
  const [completedIndices, setCompletedIndices] = useState([]);
  const { callArjunMilestone } = useArjunStrategy();

  const handleComplete = useCallback((index) => {
    setCompletedIndices(prev => [...prev, index]);
    if (index < MILESTONES.length - 1) {
      setTimeout(() => setMilestoneIndex(index + 1), 600);
    } else {
      setTimeout(() => onAdvance?.(), 1200);
    }
  }, [onAdvance]);

  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(8,8,16,0.5)' }}>
        <MessageSquare size={14} color="var(--ink3)" />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink3)' }}># analytics-incident · Phase 1 — Learn the Method</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
          <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: '50%', background: RED, display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: RED, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Incident Active</span>
        </div>
      </div>
      <div style={{ padding: '20px 20px 16px' }}>
        <MilestoneStrip currentIndex={milestoneIndex} completedIndices={completedIndices} />
        <AnimatePresence mode="wait">
          <motion.div key={milestoneIndex} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
            {milestoneIndex === 0 && <MilestoneScope onComplete={() => handleComplete(0)} callArjunMilestone={callArjunMilestone} />}
            {milestoneIndex === 1 && <MilestoneDashboard onComplete={() => handleComplete(1)} callArjunMilestone={callArjunMilestone} />}
            {milestoneIndex === 2 && <MilestoneFunnel onComplete={() => handleComplete(2)} callArjunMilestone={callArjunMilestone} />}
            {milestoneIndex === 3 && <MilestoneRootCause onComplete={() => handleComplete(3)} callArjunMilestone={callArjunMilestone} />}
            {milestoneIndex === 4 && <MilestoneImpact onComplete={() => handleComplete(4)} callArjunMilestone={callArjunMilestone} />}
            {milestoneIndex === 5 && <MilestoneRespond onComplete={() => handleComplete(5)} callArjunMilestone={callArjunMilestone} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}