// src/components/strategy/components/ArjunQueryTerminal.jsx
// UX fix: data loads IN PARALLEL with typing animation.
// No "Watch Arjun query" button — auto-starts when mounted.
// Data appears the moment typing finishes — zero additional wait.
// Arjun's reading narration appears 800ms after data, not after a separate phase.

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronRight } from 'lucide-react';

const BLUE   = '#4F80FF';
const GREEN  = '#3DD68C';
const ORANGE = '#FC8019';

function useTypewriter(text, speed = 20, trigger = true) {
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

export default function ArjunQueryTerminal({ queryData, onComplete }) {
  // Phases: typing → data_ready → reading → done
  // Data loads IN PARALLEL with typing — no sequential blocking
  const [phase, setPhase] = useState('typing');
  const [dataReady, setDataReady] = useState(false);

  const { displayed: typedQuery, done: queryTyped } = useTypewriter(
    queryData?.query, 18, phase === 'typing'
  );

  // Data loads in parallel — fires immediately on mount
  useEffect(() => {
    const t = setTimeout(() => setDataReady(true), 900);
    return () => clearTimeout(t);
  }, []);

  // When typing finishes AND data is ready → show data immediately
  useEffect(() => {
    if (queryTyped && dataReady && phase === 'typing') {
      setPhase('data_ready');
    }
  }, [queryTyped, dataReady, phase]);

  // If data arrives before typing finishes — wait for typing
  // If typing finishes before data — wait for data
  // Either way: data appears the instant both are done

  // Reading narration appears 600ms after data
  useEffect(() => {
    if (phase === 'data_ready') {
      const t = setTimeout(() => setPhase('reading'), 600);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // onComplete fires after Arjun reads — 2.5s is enough to absorb the insight
  useEffect(() => {
    if (phase === 'reading') {
      const t = setTimeout(() => {
        setPhase('done');
        onComplete?.();
      }, 2500);
      return () => clearTimeout(t);
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
          {/* Parallel load indicator */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            {phase === 'typing' && !dataReady && (
              <div style={{ display: 'flex', gap: 3 }}>
                {[0,1,2].map(i => (
                  <motion.div key={i}
                    style={{ width: 4, height: 4, borderRadius: '50%', background: BLUE }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            )}
            {dataReady && phase === 'typing' && (
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: GREEN, opacity: 0.6 }}>data ready</span>
            )}
            {['data_ready', 'reading', 'done'].includes(phase) && (
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: GREEN }}>✓ loaded</span>
            )}
            <div style={{ display: 'flex', gap: 4, marginLeft: 4 }}>
              {['#FF5F57','#FFBD2E','#28CA41'].map((c, i) => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: 0.55 }} />
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '12px 14px' }}>
          {/* Query line — typewriter */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
            <ChevronRight size={13} color={GREEN} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: GREEN, lineHeight: 1.5, wordBreak: 'break-all' }}>
              {typedQuery}
              {phase === 'typing' && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{ color: GREEN }}
                >▊</motion.span>
              )}
            </span>
          </div>

          {/* Reasoning — visible throughout */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3, delay: 0.2 }}
            style={{
              padding: '8px 10px', borderRadius: 8,
              background: `${BLUE}08`, border: `1px solid ${BLUE}16`,
              marginBottom: 8,
            }}
          >
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: BLUE, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
              Why this query
            </span>
            <p style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.65, margin: 0 }}>
              {queryData.reasoning}
            </p>
          </motion.div>

          {/* Data status */}
          <AnimatePresence mode="wait">
            {phase === 'typing' && !dataReady && (
              <motion.div key="fetching"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}
              >
                <div style={{ display: 'flex', gap: 3 }}>
                  {[0,1,2].map(i => (
                    <motion.div key={i}
                      style={{ width: 5, height: 5, borderRadius: '50%', background: BLUE }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                    />
                  ))}
                </div>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink3)' }}>Fetching data...</span>
              </motion.div>
            )}
            {['data_ready', 'reading', 'done'].includes(phase) && (
              <motion.div key="loaded"
                initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: GREEN }}>✓ Data loaded</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)' }}>— see below</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Arjun reads the data — appears 600ms after data_ready */}
      <AnimatePresence>
        {['reading', 'done'].includes(phase) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              marginTop: 10, padding: '12px 14px', borderRadius: 10,
              background: `${ORANGE}08`, border: `1px solid ${ORANGE}20`,
              borderLeft: `2px solid ${ORANGE}`,
            }}
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