// src/components/strategy/components/AnalysisWorkbench.jsx
// Natural Language Workbench — user asks, Arjun loads the right visualization

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { useArjunStrategy } from '../hooks/useArjunStrategy.js';
import FunnelVisualizer from './FunnelVisualizer.jsx';
import CohortMatrix from './CohortMatrix.jsx';

const PROMPTS = [
  'Show me the conversion funnel for Tuesday vs last Tuesday',
  'What does new user retention look like over the last 6 weeks?',
  'Where is the biggest funnel drop-off this week?',
  'Show me cohort retention — I want to check for churn patterns',
];

function ImpactSizing({ onSubmit }) {
  const [val, setVal] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const check = () => {
    const n = parseFloat(val.replace(/[₹,CrL\s]/gi, ''));
    if (!val.trim()) { setError('Enter your estimate first.'); return; }
    // Accept 1.5–4 Cr range as correct
    const inCr = val.toLowerCase().includes('cr') ? n : n / 100;
    if (inCr < 1.5 || inCr > 5) {
      setError('Hmm — check your assumptions. Use ₹385 AOV × 2.1 orders/week × 820 churned users × 52 weeks × 65% recovery.');
      return;
    }
    setError('');
    setSubmitted(true);
    onSubmit && onSubmit(val);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: 20, borderRadius: 16,
          background: 'rgba(61,214,140,0.08)',
          border: '1px solid rgba(61,214,140,0.25)',
        }}
      >
        <p style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: 6 }}>
          ✓ Good sizing
        </p>
        <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.6 }}>
          Your estimate of <strong style={{ color: 'var(--green)' }}>{val}</strong> is in range.
          At 65% recovery — the realistic case — that's <strong>₹2.07Cr annualized</strong>.
          Frame this in your memo as the expected-case recovery, not best-case.
        </p>
      </motion.div>
    );
  }

  return (
    <div style={{
      padding: 20, borderRadius: 16,
      background: 'rgba(249,226,175,0.06)',
      border: '1px solid rgba(249,226,175,0.2)',
    }}>
      <p style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 10 }}>
        ⚡ Impact Sizing Challenge
      </p>
      <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.62, marginBottom: 14 }}>
        Arjun: "If we fix the Week 4–6 cohort churn for North Bangalore, what is the annualized GMV recovery? Use: <strong>₹385 AOV</strong>, <strong>2.1 orders/week</strong>, <strong>820 churned users</strong>, <strong>65% fix recovery</strong>."
      </p>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <input
          value={val}
          onChange={e => { setVal(e.target.value); setError(''); }}
          placeholder="e.g. ₹2.07Cr"
          style={{
            flex: 1, minWidth: 160,
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${error ? 'var(--red)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 10, padding: '9px 14px',
            fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--ink)',
            outline: 'none',
          }}
          onKeyDown={e => e.key === 'Enter' && check()}
        />
        <button onClick={check} style={{
          padding: '9px 20px', borderRadius: 10,
          background: 'var(--amber)', color: '#080810',
          border: 'none', cursor: 'pointer',
          fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 700,
        }}>
          Submit Estimate
        </button>
      </div>
      {error && <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--red)', marginTop: 8 }}>{error}</p>}
    </div>
  );
}

export default function AnalysisWorkbench({ onAdvance, onImpactSized }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null); // { arjunText, vizType }
  const [history, setHistory] = useState([]);
  const [showImpact, setShowImpact] = useState(false);
  const { callArjun } = useArjunStrategy();
  const inputRef = useRef(null);

  const submit = useCallback(async (text) => {
    const q = (text || query).trim();
    if (!q || loading) return;

    setQuery('');
    setLoading(true);
    setResponse(null);

    const { text: arjunText, vizType } = await callArjun(q, 'deepdive');
    setLoading(false);

    const entry = { query: q, arjunText, vizType };
    setHistory(prev => [...prev, entry]);
    setResponse(entry);

    if (vizType === 'impact') setShowImpact(true);
  }, [query, loading, callArjun]);

  const activeViz = response?.vizType || history.find(h => h.vizType)?.vizType;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* NL Query Input */}
      <div style={{
        borderRadius: 20, overflow: 'hidden',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        {/* Header */}
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(8,8,16,0.5)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Sparkles size={13} style={{ color: 'var(--phase2)' }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink3)' }}>
            Natural Language Workbench
          </span>
          <span style={{
            marginLeft: 'auto',
            padding: '2px 8px', borderRadius: 999,
            fontFamily: 'var(--mono)', fontSize: 9,
            background: 'rgba(79,128,255,0.12)', color: 'var(--phase2)',
            border: '1px solid rgba(79,128,255,0.2)',
          }}>
            Ask in plain English
          </span>
        </div>

        {/* Input area */}
        <div style={{ padding: '16px 16px 12px' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={14} style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--ink3)', pointerEvents: 'none',
              }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}
                placeholder="e.g. Show me the conversion funnel for Sunday vs last Sunday"
                style={{
                  width: '100%', paddingLeft: 36, paddingRight: 14, paddingTop: 10, paddingBottom: 10,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 12, fontFamily: 'var(--sans)', fontSize: 14,
                  color: 'var(--ink)', outline: 'none', transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(79,128,255,0.45)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
              />
            </div>
            <button
              onClick={() => submit()}
              disabled={!query.trim() || loading}
              style={{
                padding: '10px 20px', borderRadius: 12,
                background: query.trim() ? 'var(--phase2)' : 'rgba(255,255,255,0.06)',
                color: query.trim() ? '#fff' : 'var(--ink3)',
                border: 'none', cursor: query.trim() ? 'pointer' : 'default',
                fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 700,
                transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}
            >
              {loading ? '…' : 'Analyse →'}
            </button>
          </div>

          {/* Prompt suggestions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {PROMPTS.map((p, i) => (
              <button
                key={i}
                onClick={() => submit(p)}
                style={{
                  padding: '4px 10px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontFamily: 'var(--sans)', fontSize: 11,
                  color: 'var(--ink3)', cursor: 'pointer', transition: 'all 0.15s',
                  textAlign: 'left',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.borderColor = 'rgba(79,128,255,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink3)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              padding: '16px 20px', borderRadius: 16,
              background: 'rgba(252,128,25,0.06)',
              border: '1px solid rgba(252,128,25,0.15)',
              display: 'flex', gap: 10, alignItems: 'center',
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(252,128,25,0.15)', border: '1px solid rgba(252,128,25,0.3)',
              fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: '#FC8019',
            }}>AJ</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0,1,2].map(i => (
                <motion.span key={i}
                  style={{ width: 5, height: 5, borderRadius: '50%', background: '#FC8019', display: 'block' }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.9, delay: i * 0.18, repeat: Infinity }}
                />
              ))}
            </div>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)' }}>
              Arjun is pulling the data…
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Arjun response */}
      <AnimatePresence>
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '16px 20px', borderRadius: 16,
              background: 'rgba(252,128,25,0.05)',
              border: '1px solid rgba(252,128,25,0.15)',
            }}
          >
            <p style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FC8019', marginBottom: 8 }}>
              Arjun — Staff Analyst
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--ink)' }}>
              {response.arjunText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Funnel Viz */}
      <AnimatePresence>
        {(activeViz === 'funnel') && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <FunnelVisualizer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cohort Viz */}
      <AnimatePresence>
        {(activeViz === 'cohort') && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <CohortMatrix />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Impact sizing */}
      <AnimatePresence>
        {showImpact && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            <ImpactSizing onSubmit={onImpactSized} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advance */}
      {history.length >= 2 && !showImpact && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowImpact(true)}
          style={{
            padding: '12px 20px', borderRadius: 12,
            background: 'var(--phase2)', color: '#fff',
            border: 'none', cursor: 'pointer',
            fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 700,
            boxShadow: '0 0 0 1px rgba(79,128,255,0.4), 0 4px 20px rgba(79,128,255,0.2)',
          }}
        >
          I've identified the friction point → Size the impact ↗
        </motion.button>
      )}

      {showImpact && onAdvance && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onAdvance}
          style={{
            marginTop: 8, padding: '12px 20px', borderRadius: 12,
            background: 'var(--green)', color: '#080810',
            border: 'none', cursor: 'pointer',
            fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 700,
          }}
        >
          I've completed the deep dive → Write the Memo ↗
        </motion.button>
      )}
    </div>
  );
}
