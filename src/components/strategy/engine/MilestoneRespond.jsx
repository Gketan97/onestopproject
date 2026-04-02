// src/components/strategy/engine/MilestoneRespond.jsx
// CP3-D: VP memo milestone — kept separate because it has unique interaction
// model (MemoInput, investigation log review, Priya reply).
// Extracted verbatim from ArjunSocraticChat.jsx MilestoneRespond function.

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';
import { SCENARIO, MILESTONES } from '../data/swiggyStrategyData.js';
import { usePriyaPing } from '../hooks/usePriyaPing.js';

const ORANGE = '#FC8019';
const GREEN  = '#3DD68C';
const RED    = '#F38BA8';
const PURPLE = '#A78BFA';

const MILESTONE_COLORS = [ORANGE, '#4F80FF', PURPLE, GREEN, RED, PURPLE, '#F9E2AF'];

function Avatar({ initials, color, size = 32 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: size * 0.3, fontWeight: 800, background: `${color}20`, border: `1px solid ${color}40`, color }}>
      {initials}
    </div>
  );
}

function Message({ msg, isNew }) {
  const color    = msg.role === 'arjun' ? ORANGE : msg.role === 'priya' ? RED : '#4F80FF';
  const initials = msg.role === 'arjun' ? 'AJ' : msg.role === 'priya' ? 'PR' : 'ME';
  const name     = msg.role === 'arjun' ? 'Arjun' : msg.role === 'priya' ? 'Priya' : 'You';
  return (
    <motion.div initial={isNew ? { opacity: 0, y: 8 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <Avatar initials={initials} color={color} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color }}>{name}</span>
          {msg.role === 'arjun' && <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: ORANGE, opacity: 0.6 }}>Staff Analyst</span>}
          {msg.role === 'priya' && <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: RED,    opacity: 0.6 }}>Head of Growth</span>}
          {msg.meta && <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)' }}>{msg.meta}</span>}
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.65, color: msg.role === 'priya' ? 'var(--ink)' : 'var(--ink2)', fontStyle: msg.role === 'priya' ? 'normal' : 'italic', whiteSpace: 'pre-wrap', margin: 0 }}>{msg.text}</p>
      </div>
    </motion.div>
  );
}

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

function MemoInput({ value, onChange, onSend, loading }) {
  const [focused, setFocused] = useState(false);
  const charCount  = value.trim().length;
  const canSend    = charCount >= 80 && !loading;
  const hasContent = value.length > 0;
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        {['① Root cause','② Evidence','③ Impact','④ Action'].map((step, i) => (
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
    </div>
  );
}

export default function MilestoneRespond({ onComplete, callArjunMilestone, investigationLog, onPriyaPing }) {
  const [messages, setMessages]       = useState([]);
  const [memo, setMemo]               = useState('');
  const [loading, setLoading]         = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [logExpanded, setLogExpanded] = useState(false);
  const bottomRef = useRef(null);

  const respondConfig = MILESTONES[5];

  usePriyaPing(5, false, useCallback((pingMsg) => {
    setMessages(prev => [...prev, pingMsg]);
    onPriyaPing?.();
  }, [onPriyaPing]));

  useEffect(() => {
    const t = setTimeout(() => {
      setMessages([{ role: 'arjun', text: respondConfig.arjunOpening, isNew: true }]);
      setTimeout(() => setMessages(prev => [...prev, { role: 'arjun', text: respondConfig.arjunQuestion, isNew: true }]), 800);
    }, 400);
    return () => clearTimeout(t);
  }, [respondConfig]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const handleSend = useCallback(async () => {
    const q = memo.trim();
    if (!q || loading || submitted) return;
    setSubmitted(true);
    setMessages(prev => [...prev, { role: 'user', text: q, isNew: true }]);
    setLoading(true);
    const { text, advance } = await callArjunMilestone(q, 'respond');
    setLoading(false);
    setMessages(prev => [...prev, { role: 'arjun', text, isNew: true }]);
    if (advance) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'priya', text: "Got it — this is exactly what I needed. Escalating to the VP now with your recommendation. Good work.", isNew: true, meta: '9:48 AM' }]);
        setTimeout(() => onComplete(null), 2500);
      }, 1800);
    }
  }, [memo, loading, submitted, callArjunMilestone, onComplete]);

  const impactLine = investigationLog?.find(l => l.index === 4)?.conclusion;
  const logEntries = investigationLog?.filter(l => l.conclusion) || [];

  return (
    <div>
      {/* Priya waiting banner */}
      <div style={{ padding: '10px 12px', borderRadius: 9, marginBottom: 16, background: `${RED}06`, border: `1px solid ${RED}16`, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: RED, textTransform: 'uppercase', flexShrink: 0, marginTop: 2 }}>Priya is waiting</span>
        <p style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.55, margin: 0 }}>{SCENARIO.priyaMessage}</p>
      </div>

      {/* Investigation trail */}
      {logEntries.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          style={{ marginBottom: 16, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <button onClick={() => setLogExpanded(e => !e)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.06em', flex: 1 }}>Your investigation trail — {logEntries.length} findings</span>
            {logExpanded ? <ChevronDown size={13} color="var(--ink3)" /> : <ChevronRight size={13} color="var(--ink3)" />}
          </button>
          <AnimatePresence>
            {logExpanded && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {logEntries.map((entry, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, padding: '6px 0', borderBottom: i < logEntries.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
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

      {/* Impact number */}
      {impactLine && (
        <div style={{ padding: '8px 12px', borderRadius: 8, marginBottom: 14, background: `${PURPLE}08`, border: `1px solid ${PURPLE}18` }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: PURPLE, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your impact number: </span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink2)' }}>{impactLine}</span>
        </div>
      )}

      {/* Messages */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
        {messages.map((msg, i) => <Message key={i} msg={msg} isNew={msg.isNew} />)}
        {loading && <TypingIndicator />}
      </div>

      {!submitted && <MemoInput value={memo} onChange={setMemo} onSend={handleSend} loading={loading} />}
      <div ref={bottomRef} />
    </div>
  );
}
