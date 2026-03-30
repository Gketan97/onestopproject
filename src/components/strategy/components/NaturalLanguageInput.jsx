// src/components/strategy/components/NaturalLanguageInput.jsx
// CP12: Strategic Workbench — Natural Language Data Requester
//
// Replaces the SQL editor. Users type plain English requests to Arjun.
// Arjun "runs" the query and surfaces the right visualization.
//
// PROPS:
//   onRequest(intent)  — called with parsed intent: 'funnel' | 'cohort' | 'kpi' | 'unknown'
//   onRawQuery(text)   — called with the raw query text for logging
//   loading            — bool, shows Arjun thinking state
//   disabled           — bool, locks input
//   placeholder        — custom placeholder string

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap } from 'lucide-react';

const ORANGE = '#FC8019';
const BLUE   = '#4F80FF';
const GREEN  = '#3DD68C';
const RED    = '#F38BA8';
const PURPLE = '#A78BFA';

// ── Intent parser — maps natural language to data intent ─────────────────────
// Lightweight keyword matcher. No AI needed — the patterns are deterministic.
export function parseIntent(query) {
  const q = query.toLowerCase();

  // Funnel signals
  if (/funnel|conversion|drop.?off|add.?to.?cart|cart|checkout|stage|step|where.*(drop|fall|lost)/i.test(q)) {
    return 'funnel';
  }
  // Cohort / retention signals
  if (/cohort|retention|retain|coming back|return|repeat|loyal|week.?over.?week|day.?\d|d\d/i.test(q)) {
    return 'cohort';
  }
  // KPI / dashboard signals
  if (/kpi|dashboard|metric|order|gmv|revenue|aov|average.?order|summary|overview|number/i.test(q)) {
    return 'kpi';
  }
  // Segmentation signals
  if (/segment|new user|returning user|new vs|split|breakdown|group/i.test(q)) {
    return 'segment';
  }

  return 'unknown';
}

// ── Quick prompt chips ────────────────────────────────────────────────────────
const QUICK_PROMPTS = [
  { label: 'Show funnel',       query: 'Show me the conversion funnel this week vs last week',  intent: 'funnel'  },
  { label: 'Retention heatmap', query: 'Show retention cohort — who stopped coming back?',       intent: 'cohort'  },
  { label: 'KPI summary',       query: 'Give me the key metrics dashboard',                      intent: 'kpi'     },
  { label: 'New vs returning',  query: 'Break the funnel down by new vs returning users',        intent: 'segment' },
];

// ── Arjun "reading" animation ─────────────────────────────────────────────────
function ArjunReading({ query }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '12px 14px',
        borderRadius: 10,
        background: `${ORANGE}07`,
        border: `1px solid ${ORANGE}18`,
        marginTop: 12,
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 28, height: 28, borderRadius: 7, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${ORANGE}18`, border: `1px solid ${ORANGE}30`,
        fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: ORANGE,
      }}>
        AJ
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: ORANGE }}>Arjun</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: ORANGE, opacity: 0.6 }}>running query...</span>
        </div>
        {/* Query echo */}
        <p style={{
          fontFamily: 'var(--mono)',
          fontSize: 11,
          color: 'var(--ink3)',
          marginBottom: 8,
          padding: '6px 10px',
          borderRadius: 6,
          background: 'rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.06)',
          lineHeight: 1.5,
        }}>
          → {query}
        </p>
        {/* Typing dots */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {[0,1,2].map(i => (
            <motion.div
              key={i}
              style={{ width: 5, height: 5, borderRadius: '50%', background: ORANGE }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.9, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', marginLeft: 4 }}>
            pulling data...
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function NaturalLanguageInput({
  onRequest,
  onRawQuery,
  loading = false,
  disabled = false,
  placeholder = 'Ask Arjun for data — e.g. "Show me the conversion funnel" or "Who stopped coming back?"',
  currentQuery = '',
}) {
  const [value, setValue]     = useState('');
  const [focused, setFocused] = useState(false);
  const [history, setHistory] = useState([]);
  const textareaRef           = useRef(null);
  const hasContent            = value.length > 0;
  const canSend               = value.trim().length > 3 && !loading && !disabled;

  const handleSend = useCallback(() => {
    if (!canSend) return;
    const q     = value.trim();
    const intent = parseIntent(q);
    setHistory(prev => [{ query: q, intent }, ...prev.slice(0, 4)]);
    setValue('');
    onRawQuery?.(q);
    onRequest?.(intent, q);
  }, [canSend, value, onRequest, onRawQuery]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleQuickPrompt = useCallback((prompt) => {
    if (loading || disabled) return;
    setHistory(prev => [{ query: prompt.query, intent: prompt.intent }, ...prev.slice(0, 4)]);
    onRawQuery?.(prompt.query);
    onRequest?.(prompt.intent, prompt.query);
  }, [loading, disabled, onRequest, onRawQuery]);

  const borderColor = focused
    ? ORANGE
    : hasContent
    ? `${ORANGE}50`
    : 'rgba(255,255,255,0.09)';

  const boxShadow = focused
    ? `0 0 0 1px ${ORANGE}40, 0 0 12px ${ORANGE}15`
    : 'none';

  return (
    <div>
      {/* Section label */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
      }}>
        <Zap size={11} color={ORANGE} />
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
          color: ORANGE, textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>
          Ask Arjun for data
        </span>
        <div style={{ flex: 1, height: 1, background: `${ORANGE}18` }} />
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)',
        }}>
          natural language
        </span>
      </div>

      {/* Quick prompt chips */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {QUICK_PROMPTS.map((p) => (
          <motion.button
            key={p.intent}
            onClick={() => handleQuickPrompt(p)}
            whileHover={!loading && !disabled ? { scale: 1.03, y: -1 } : {}}
            whileTap={!loading && !disabled ? { scale: 0.97 } : {}}
            style={{
              padding: '5px 11px',
              borderRadius: 6,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              fontFamily: 'var(--mono)',
              fontSize: 10,
              color: disabled || loading ? 'var(--ink3)' : 'var(--ink2)',
              cursor: disabled || loading ? 'default' : 'pointer',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              if (!loading && !disabled) {
                e.currentTarget.style.background = `${ORANGE}10`;
                e.currentTarget.style.borderColor = `${ORANGE}30`;
                e.currentTarget.style.color = ORANGE;
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
              e.currentTarget.style.color = disabled || loading ? 'var(--ink3)' : 'var(--ink2)';
            }}
          >
            {p.label}
          </motion.button>
        ))}
      </div>

      {/* Text input */}
      <div style={{
        display: 'flex', gap: 8, alignItems: 'flex-end',
      }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={2}
          disabled={disabled}
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${borderColor}`,
            borderRadius: 10,
            padding: '10px 12px',
            fontFamily: 'var(--sans)',
            fontSize: 13,
            color: 'var(--ink)',
            resize: 'none',
            outline: 'none',
            lineHeight: 1.55,
            transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
            boxSizing: 'border-box',
            boxShadow,
            opacity: disabled ? 0.5 : 1,
          }}
        />
        <motion.button
          onClick={handleSend}
          whileHover={canSend ? { scale: 1.08 } : {}}
          whileTap={canSend ? { scale: 0.92 } : {}}
          style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: hasContent ? ORANGE : 'rgba(255,255,255,0.06)',
            border: 'none',
            cursor: canSend ? 'pointer' : 'default',
            transition: 'background 0.12s ease, box-shadow 0.12s ease',
            boxShadow: hasContent ? `0 2px 12px ${ORANGE}50` : 'none',
          }}
        >
          <Send size={15} color={hasContent ? '#fff' : 'rgba(255,255,255,0.2)'} />
        </motion.button>
      </div>

      {/* Arjun reading state */}
      <AnimatePresence>
        {loading && currentQuery && (
          <ArjunReading query={currentQuery} />
        )}
      </AnimatePresence>

      {/* Query history */}
      <AnimatePresence>
        {history.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{ marginTop: 10 }}
          >
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {history.slice(0, 3).map((h, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 9,
                    color: 'var(--ink3)',
                    padding: '3px 8px',
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    maxWidth: 220,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ↑ {h.query}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`textarea::placeholder { color: var(--ink2) !important; opacity: 0.65; }`}</style>
    </div>
  );
}