// src/components/strategy/components/ArjunQueryTerminal.jsx
// The AI query interface. Arjun types a query, reasoning appears, data loads.
// Fixed dataset behind it — deterministic story, live feel.
// User watches Arjun query, learns the pattern, takes over by Milestone 4.

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronRight } from 'lucide-react';

const BLUE = '#4F80FF';
const GREEN = '#3DD68C';
const ORANGE = '#FC8019';

// Typewriter hook — types text character by character
function useTypewriter(text, speed = 22, trigger = true) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    if (!trigger || !text) return;
    idx.current = 0;
    setDisplayed('');
    setDone(false);
    const iv = setInterval(() => {
      idx.current += 1;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) {
        clearInterval(iv);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed, trigger]);

  return { displayed, done };
}

export default function ArjunQueryTerminal({ queryKey, queryData, onComplete }) {
  // phase: idle → typing_query → showing_reasoning → loading_data → data_shown → reading
  const [phase, setPhase] = useState('idle');
  const [started, setStarted] = useState(false);

  const { displayed: typedQuery, done: queryTyped } = useTypewriter(queryData?.query, 18, phase === 'typing_query');

  useEffect(() => {
    if (!started) return;
    setPhase('typing_query');
  }, [started]);

  useEffect(() => {
    if (phase === 'typing_query' && queryTyped) {
      setTimeout(() => setPhase('showing_reasoning'), 400);
    }
  }, [phase, queryTyped]);

  useEffect(() => {
    if (phase === 'showing_reasoning') {
      setTimeout(() => setPhase('loading_data'), 1800);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'loading_data') {
      setTimeout(() => setPhase('data_shown'), 1200);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'data_shown') {
      setTimeout(() => setPhase('reading'), 600);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'reading') {
      setTimeout(() => onComplete?.(), 3500);
    }
  }, [phase, onComplete]);

  if (!queryData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginBottom: 16 }}
    >
      {/* Terminal window */}
      <div style={{
        borderRadius: 12, overflow: 'hidden',
        border: `1px solid ${BLUE}25`,
        background: 'rgba(8,8,16,0.7)',
      }}>
        {/* Terminal bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 12px',
          background: 'rgba(0,0,0,0.3)',
          borderBottom: `1px solid ${BLUE}18`,
        }}>
          <Terminal size={12} color={BLUE} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: BLUE, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Arjun's query
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 5 }}>
            {['#FF5F57','#FFBD2E','#28CA41'].map((c, i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.6 }} />
            ))}
          </div>
        </div>

        <div style={{ padding: '12px 14px' }}>
          {/* Query line */}
          {phase !== 'idle' && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
              <ChevronRight size={13} color={GREEN} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: GREEN, lineHeight: 1.5, wordBreak: 'break-all' }}>
                {typedQuery}
                {phase === 'typing_query' && <span style={{ animation: 'cursor-blink 1s step-end infinite', color: GREEN }}>▊</span>}
              </span>
            </div>
          )}

          {/* Reasoning */}
          <AnimatePresence>
            {['showing_reasoning', 'loading_data', 'data_shown', 'reading'].includes(phase) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0 }} transition={{ duration: 0.28 }}
                style={{ padding: '8px 10px', borderRadius: 8, background: `${BLUE}08`, border: `1px solid ${BLUE}16`, marginBottom: 10 }}
              >
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: BLUE, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Why this query
                </span>
                <p style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.65, margin: 0 }}>
                  {queryData.reasoning}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading state */}
          <AnimatePresence>
            {phase === 'loading_data' && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}
              >
                <div style={{ display: 'flex', gap: 4 }}>
                  {[0,1,2].map(i => (
                    <motion.div key={i}
                      style={{ width: 5, height: 5, borderRadius: '50%', background: BLUE }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                    />
                  ))}
                </div>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink3)' }}>Pulling data...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Data returned indicator */}
          <AnimatePresence>
            {['data_shown', 'reading'].includes(phase) && (
              <motion.div
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}
              >
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: GREEN }}>✓ Data loaded</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)' }}>— see chart below</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Trigger button — shown only before started */}
      {!started && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <button
            onClick={() => setStarted(true)}
            style={{
              marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '7px 14px', borderRadius: 8,
              background: `${BLUE}12`, border: `1px solid ${BLUE}28`,
              fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: BLUE,
              cursor: 'pointer', transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = `${BLUE}1C`}
            onMouseLeave={e => e.currentTarget.style.background = `${BLUE}12`}
          >
            <Terminal size={11} /> Watch Arjun query the data
          </button>
        </motion.div>
      )}

      {/* Arjun reads the data */}
      <AnimatePresence>
        {phase === 'reading' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginTop: 12, padding: '11px 14px', borderRadius: 10, background: `${ORANGE}08`, border: `1px solid ${ORANGE}20`, borderLeft: `2px solid ${ORANGE}` }}
          >
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: ORANGE, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>
              Arjun reads the data
            </span>
            <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.68, margin: 0 }}>
              {queryData.arjunReads}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}