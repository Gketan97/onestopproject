// src/components/strategy/components/ArjunSocraticChat.jsx
// Slack-style Socratic chat — Arjun mentors without giving answers

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare } from 'lucide-react';
import { SCENARIO } from '../data/swiggyStrategyData.js';
import { useArjunStrategy } from '../hooks/useArjunStrategy.js';

function Avatar({ initials, color, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 8, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--mono)', fontSize: size * 0.3, fontWeight: 800,
      background: color + '20', border: `1px solid ${color}40`, color,
    }}>
      {initials}
    </div>
  );
}

function Message({ msg, isNew }) {
  const isArjun = msg.role === 'arjun';
  const isPriya = msg.role === 'priya';
  const isUser  = msg.role === 'user';
  const isSystem = msg.role === 'system';

  if (isSystem) {
    return (
      <div style={{ textAlign: 'center', padding: '6px 0' }}>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>{msg.text}</span>
      </div>
    );
  }

  const color = isArjun ? '#FC8019' : isPriya ? '#4F80FF' : 'var(--ink2)';
  const name  = isArjun ? 'Arjun' : isPriya ? 'Priya S.' : 'You';
  const initials = isArjun ? 'AJ' : isPriya ? 'PS' : 'ME';

  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}
    >
      <Avatar initials={initials} color={color} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color }}>
            {name}
          </span>
          {msg.meta && (
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)' }}>
              {msg.meta}
            </span>
          )}
        </div>
        <p style={{
          fontSize: 13, lineHeight: 1.62, color: isUser ? 'var(--ink2)' : 'var(--ink)',
          fontStyle: isUser ? 'italic' : 'normal',
          whiteSpace: 'pre-wrap',
        }}>
          {msg.text}
        </p>
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <Avatar initials="AJ" color="#FC8019" />
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '8px 14px', borderRadius: 10,
        background: 'rgba(252,128,25,0.08)',
        border: '1px solid rgba(252,128,25,0.15)',
      }}>
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            style={{ width: 5, height: 5, borderRadius: '50%', background: '#FC8019', display: 'block' }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.0, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', marginLeft: 4 }}>
          Arjun is thinking…
        </span>
      </div>
    </div>
  );
}

// Suggested questions for the user
const SUGGESTIONS = [
  'Is this drop platform-wide or specific to North Bangalore?',
  'Could this be a supply-side issue with restaurant availability?',
  'What does the conversion funnel look like vs last week?',
  'Show me cohort retention for recent new users',
];

export default function ArjunSocraticChat({ phase, onVizRequest, onAdvance }) {
  const [messages, setMessages] = useState(() => [
    { role: 'priya', text: SCENARIO.priyaSlack, meta: SCENARIO.priyaTime },
    { role: 'arjun', text: SCENARIO.arjunSlack, meta: SCENARIO.arjunTime },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const [showAdvance, setShowAdvance] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const { callArjun } = useArjunStrategy();

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = useCallback(async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setLoading(true);

    const { text: reply, vizType } = await callArjun(q, phase === 'triage' ? null : 'funnel_shown');

    setLoading(false);
    setMessages(prev => [...prev, { role: 'arjun', text: reply }]);

    const count = msgCount + 1;
    setMsgCount(count);

    // Surface the viz if one was triggered
    if (vizType && onVizRequest) {
      setTimeout(() => {
        onVizRequest(vizType);
        setMessages(prev => [...prev, {
          role: 'system',
          text: `── ${vizType === 'funnel' ? 'Conversion Funnel' : vizType === 'cohort' ? 'Cohort Retention Matrix' : 'Impact Sizing'} loaded ──`,
        }]);
      }, 400);
    }

    // Show advance button after meaningful exchange
    if (count >= 2) setShowAdvance(true);
  }, [input, loading, callArjun, phase, onVizRequest, msgCount]);

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div style={{
      borderRadius: 20, overflow: 'hidden',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(8,8,16,0.5)',
      }}>
        <MessageSquare size={14} style={{ color: 'var(--ink3)' }} />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink3)' }}>
          # analytics-incident · Swiggy Data Team
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)', display: 'inline-block' }}
          />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Incident Active
          </span>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        padding: '20px 16px',
        display: 'flex', flexDirection: 'column', gap: 20,
        maxHeight: 400, overflowY: 'auto',
      }}
        className="custom-scrollbar"
      >
        {messages.map((msg, i) => (
          <Message key={i} msg={msg} isNew={i >= 2} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions (shown before user sends first message) */}
      {msgCount === 0 && (
        <div style={{
          padding: '0 16px 12px',
          display: 'flex', flexWrap: 'wrap', gap: 6,
        }}>
          <p style={{ width: '100%', fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Suggested questions:
          </p>
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => send(s)}
              style={{
                padding: '5px 12px', borderRadius: 999,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink2)',
                cursor: 'pointer', transition: 'all 0.15s',
                textAlign: 'left',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--ink)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--ink2)'; }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', gap: 8, alignItems: 'flex-end',
      }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask Arjun anything about the investigation…"
          rows={1}
          style={{
            flex: 1, background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '8px 12px',
            fontFamily: 'var(--sans)', fontSize: 13,
            color: 'var(--ink)', resize: 'none',
            outline: 'none', lineHeight: 1.5,
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(252,128,25,0.4)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
          className="custom-scrollbar"
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: input.trim() ? 'var(--phase1)' : 'rgba(255,255,255,0.06)',
            border: 'none', cursor: input.trim() ? 'pointer' : 'default',
            transition: 'all 0.2s',
          }}
        >
          <Send size={15} style={{ color: input.trim() ? '#fff' : 'var(--ink3)' }} />
        </button>
      </div>

      {/* Advance phase button */}
      <AnimatePresence>
        {showAdvance && onAdvance && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ padding: '0 16px 16px' }}
          >
            <button
              onClick={onAdvance}
              style={{
                width: '100%', padding: '12px',
                background: 'var(--phase2)', color: '#fff',
                border: 'none', borderRadius: 12, cursor: 'pointer',
                fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 700,
                letterSpacing: '-0.01em',
                boxShadow: '0 0 0 1px rgba(79,128,255,0.4), 0 4px 20px rgba(79,128,255,0.2)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              I've completed my triage → Move to Deep Dive ↗
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
