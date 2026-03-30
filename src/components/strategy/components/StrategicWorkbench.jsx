// src/components/strategy/components/StrategicWorkbench.jsx
// CP12: Strategic Workbench — NL query orchestrator
//
// Replaces the old AnalysisWorkbench placeholder.
// Users request data in plain English → Arjun responds with the right visualization.
//
// INTENT ROUTING:
//   'funnel'  → FunnelVisualizer (WoW comparison)
//   'segment' → FunnelVisualizer (new vs returning toggle)
//   'cohort'  → CohortMatrix
//   'kpi'     → KpiScorecard (read-only)
//   'unknown' → Arjun asks a clarifying question
//
// PROPS:
//   onAdvance()  — called when user has unlocked enough data and writes an insight

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import NaturalLanguageInput, { parseIntent } from './NaturalLanguageInput.jsx';
import FunnelVisualizer from './FunnelVisualizer.jsx';
import CohortMatrix from './CohortMatrix.jsx';
import KpiScorecard from './KpiScorecard.jsx';

const ORANGE = '#FC8019';
const BLUE   = '#4F80FF';
const GREEN  = '#3DD68C';
const RED    = '#F38BA8';
const PURPLE = '#A78BFA';

// ── Arjun response messages per intent ───────────────────────────────────────
const ARJUN_RESPONSES = {
  funnel: {
    text: "Running the funnel — North Bangalore, this week vs last week. Watch the Add-to-Cart stage.",
    delay: 1400,
  },
  segment: {
    text: "Good instinct. Breaking by new vs returning. The gap between the two segments is the real story.",
    delay: 1600,
  },
  cohort: {
    text: "Pulling the cohort matrix. Look at W-1 new users — their D7 retention is the anomaly.",
    delay: 1800,
  },
  kpi: {
    text: "Here's the full dashboard. Start by finding the metric that has the biggest week-over-week swing.",
    delay: 1200,
  },
  unknown: {
    text: "I'm not sure what data you want. Try: 'show me the funnel', 'cohort retention', or 'KPI summary'.",
    delay: 800,
  },
};

// ── Arjun message bubble ──────────────────────────────────────────────────────
function ArjunMessage({ text, isNew }) {
  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}
    >
      <div style={{
        width: 28, height: 28, borderRadius: 7, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${ORANGE}18`, border: `1px solid ${ORANGE}30`,
        fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: ORANGE,
      }}>
        AJ
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 4 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: ORANGE }}>Arjun</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: ORANGE, opacity: 0.6 }}>Staff Analyst</span>
        </div>
        <p style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.65, color: 'var(--ink)', margin: 0 }}>
          {text}
        </p>
      </div>
    </motion.div>
  );
}

// ── Insight submission — user writes their analysis ───────────────────────────
function InsightBox({ onSubmit, unlockedCount }) {
  const [value, setValue]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const minChars = 80;
  const canSubmit = value.trim().length >= minChars && !submitted;

  if (unlockedCount < 2) return null; // only show after 2+ data pulls

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        marginTop: 20,
        padding: '16px',
        borderRadius: 12,
        background: `${ORANGE}07`,
        border: `1px solid ${ORANGE}22`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${ORANGE}18`, border: `1px solid ${ORANGE}30`,
          fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: ORANGE,
        }}>
          AJ
        </div>
        <div>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: ORANGE, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            Arjun — synthesise what you've found
          </p>
          <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.65, margin: 0 }}>
            You've pulled {unlockedCount} data cuts. What's the root cause and what should Priya do in the next 48 hours?
          </p>
        </div>
      </div>

      {!submitted ? (
        <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid rgba(255,255,255,0.09)` }}>
          <textarea
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="The root cause is... The evidence is... The recommended action is..."
            rows={3}
            autoFocus
            style={{
              width: '100%', padding: '12px 14px',
              background: 'rgba(255,255,255,0.03)',
              border: 'none', outline: 'none',
              color: 'var(--ink)', fontFamily: 'var(--sans)',
              fontSize: 13, lineHeight: 1.6, resize: 'none', boxSizing: 'border-box',
            }}
          />
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 12px', background: 'rgba(0,0,0,0.2)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: canSubmit ? GREEN : 'var(--ink3)' }}>
              {canSubmit ? '✓ Ready to submit' : `${value.trim().length} / ${minChars} chars min`}
            </span>
            <motion.button
              onClick={() => { if (canSubmit) { setSubmitted(true); onSubmit?.(value.trim()); } }}
              whileHover={canSubmit ? { scale: 1.05, y: -1 } : {}}
              whileTap={canSubmit ? { scale: 0.96 } : {}}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '7px 16px', borderRadius: 8,
                background: canSubmit ? ORANGE : 'rgba(255,255,255,0.05)',
                color: canSubmit ? '#fff' : 'var(--ink3)',
                fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 700,
                border: 'none', cursor: canSubmit ? 'pointer' : 'default',
                transition: 'all 0.15s',
                boxShadow: canSubmit ? `0 2px 12px ${ORANGE}45` : 'none',
              }}
            >
              Submit insight <ArrowRight size={12} />
            </motion.button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', borderRadius: 8,
            background: `${GREEN}10`, border: `1px solid ${GREEN}25`,
          }}
        >
          <CheckCircle size={14} color={GREEN} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: GREEN, fontWeight: 700 }}>
            Insight logged — moving to Phase 3
          </span>
        </motion.div>
      )}
      <style>{`textarea::placeholder { color: var(--ink2) !important; opacity: 0.65; }`}</style>
    </motion.div>
  );
}

// ── Unlocked viz block ────────────────────────────────────────────────────────
function VizBlock({ entry, index }) {
  const colorMap = { funnel: ORANGE, segment: PURPLE, cohort: GREEN, kpi: BLUE, unknown: RED };
  const color    = colorMap[entry.intent] || ORANGE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginBottom: 20 }}
    >
      {/* Query echo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        marginBottom: 10, padding: '7px 12px',
        borderRadius: 7,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', flex: 1 }}>
          → {entry.query}
        </span>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
          color, padding: '2px 7px', borderRadius: 4,
          background: `${color}12`, border: `1px solid ${color}25`,
          textTransform: 'uppercase',
        }}>
          {entry.intent}
        </span>
      </div>

      {/* Visualization */}
      {entry.intent === 'funnel'  && <FunnelVisualizer />}
      {entry.intent === 'segment' && <FunnelVisualizer />}
      {entry.intent === 'cohort'  && <CohortMatrix />}
      {entry.intent === 'kpi'     && (
        <div style={{ pointerEvents: 'none', opacity: 0.9 }}>
          <KpiScorecard onMetricClick={() => {}} clickedMetric={null} interactive={false} />
        </div>
      )}
      {entry.intent === 'unknown' && (
        <div style={{
          padding: '12px 16px', borderRadius: 10,
          background: `${RED}08`, border: `1px solid ${RED}18`,
        }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: RED, margin: 0 }}>
            No data match for that query. Try: "funnel", "cohort retention", or "KPI dashboard".
          </p>
        </div>
      )}
    </motion.div>
  );
}

// ── Main StrategicWorkbench ───────────────────────────────────────────────────
export default function StrategicWorkbench({ onAdvance }) {
  const [messages, setMessages] = useState([
    {
      type: 'arjun',
      text: "Phase 2. You're leading now — I'm here if you need data. Tell me what you want to look at and I'll pull it. Start wherever your instinct takes you.",
      isNew: false,
    },
  ]);
  const [vizBlocks, setVizBlocks]     = useState([]);
  const [loading, setLoading]         = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [unlockedIntents, setUnlockedIntents] = useState(new Set());
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, vizBlocks, loading]);

  const handleRequest = useCallback((intent, query) => {
    if (loading) return;

    setCurrentQuery(query);
    setLoading(true);

    const response = ARJUN_RESPONSES[intent] || ARJUN_RESPONSES.unknown;

    // Add Arjun's "running query" message immediately
    setMessages(prev => [...prev, {
      type: 'arjun',
      text: response.text,
      isNew: true,
    }]);

    // After delay, surface the visualization
    setTimeout(() => {
      setLoading(false);
      setCurrentQuery('');
      setVizBlocks(prev => {
        // Don't show duplicate intent blocks — update in place if already shown
        const exists = prev.findIndex(b => b.intent === intent);
        const newBlock = { intent, query, id: Date.now() };
        if (exists >= 0) {
          const updated = [...prev];
          updated[exists] = newBlock;
          return updated;
        }
        return [...prev, newBlock];
      });
      setUnlockedIntents(prev => new Set([...prev, intent]));
    }, response.delay);
  }, [loading]);

  const handleRawQuery = useCallback((q) => {
    setCurrentQuery(q);
  }, []);

  const handleInsightSubmit = useCallback((insight) => {
    setTimeout(() => onAdvance?.(), 2500);
  }, [onAdvance]);

  return (
    <div>
      {/* Opening messages */}
      <div style={{ marginBottom: 16 }}>
        {messages.map((msg, i) => (
          <ArjunMessage key={i} text={msg.text} isNew={msg.isNew} />
        ))}
      </div>

      {/* NL Input */}
      <NaturalLanguageInput
        onRequest={handleRequest}
        onRawQuery={handleRawQuery}
        loading={loading}
        currentQuery={currentQuery}
      />

      {/* Unlocked viz blocks */}
      <AnimatePresence>
        {vizBlocks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ marginTop: 24 }}
          >
            {/* Section divider */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
            }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)',
                textTransform: 'uppercase', letterSpacing: '0.1em',
              }}>
                {vizBlocks.length} data {vizBlocks.length === 1 ? 'cut' : 'cuts'} pulled
              </span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            </div>

            {vizBlocks.map((entry, i) => (
              <VizBlock key={entry.id} entry={entry} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Insight submission */}
      <InsightBox
        onSubmit={handleInsightSubmit}
        unlockedCount={unlockedIntents.size}
      />

      <div ref={bottomRef} style={{ height: 1 }} />
    </div>
  );
}