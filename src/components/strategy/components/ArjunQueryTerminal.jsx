// src/components/strategy/components/ArjunQueryTerminal.jsx
// CP-6C: Sprint 6 — Color-Pulse Triggers (Task 1)
//
// CHANGES FROM CP12:
//   1. Accepts `pulseColor` prop (string hex). When provided, the terminal bar
//      and "Arjun reads" panel glow in that color, visually linking this terminal
//      dispatch to the corresponding chat message in ArjunSocraticChat.
//   2. All timing / parallel-load logic is unchanged.

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
      if (idx.current >= text.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed, trigger]);

  return { displayed, done };
}

export default function ArjunQueryTerminal({ queryData, onComplete, pulseColor }) {
  const [phase, setPhase]       = useState('typing');
  const [dataReady, setDataReady] = useState(false);

  // Resolve accent color — pulseColor overrides BLUE for this terminal instance
  const accentColor = pulseColor || BLUE;

  const { displayed: typedQuery, done: queryTyped } = useTypewriter(
    queryData?.query, 18, phase === 'typing'
  );

  // Data loads in parallel — fires immediately on mount
  useEffect(() => {
    const t = setTimeout(() => setDataReady(true), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (queryTyped && dataReady && phase === 'typing') setPhase('data_ready');
  }, [queryTyped, dataReady, phase]);

  useEffect(() => {
    if (phase === 'data_ready') {
      const t = setTimeout(() => setPhase('reading'), 600);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'reading') {
      const t = setTimeout(() => { setPhase('done'); onComplete?.(); }, 2500);
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
        // ── Pulse border: glow in accentColor when pulseColor is provided ──
        border: `1px solid ${accentColor}${pulseColor ? '50' : '25'}`,
        background: 'rgba(8,8,16,0.7)',
        boxShadow: pulseColor ? `0 0 18px ${accentColor}20` : 'none',
        transition: 'border-color 0.4s, box-shadow 0.4s',
      }}>
        {/* Terminal bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 12px',
          background: pulseColor ? `${accentColor}10` : 'rgba(0,0,0,0.3)',
          borderBottom: `1px solid ${accentColor}${pulseColor ? '28' : '18'}`,
          transition: 'background 0.4s, border-color 0.4s',
        }}>
          <Terminal size={12} color={accentColor} />
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
            color: accentColor, letterSpacing: '0.08em', textTransform: 'uppercase',
            transition: 'color 0.4s',
          }}>
            Arjun's query
          </span>

          {/* Pulse dot — only when pulseColor active */}
          {pulseColor && (
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.3, 0.8] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              style={{
                width: 6, height: 6, borderRadius: '50%',
                background: accentColor, marginLeft: 2,
              }}
            />
          )}

          {/* Load indicator */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            {phase === 'typing' && !dataReady && (
              <div style={{ display: 'flex', gap: 3 }}>
                {[0,1,2].map(i => (
                  <motion.div key={i}
                    style={{ width: 4, height: 4, borderRadius: '50%', background: accentColor }}
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
          {/* Query typewriter */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
            <ChevronRight size={13} color={GREEN} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: GREEN, lineHeight: 1.5, wordBreak: 'break-all' }}>
              {typedQuery}
              {phase === 'typing' && (
                <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} style={{ color: GREEN }}>▊</motion.span>
              )}
            </span>
          </div>

          {/* Reasoning box */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3, delay: 0.2 }}
            style={{
              padding: '8px 10px', borderRadius: 8,
              background: `${accentColor}08`, border: `1px solid ${accentColor}16`,
              marginBottom: 8,
              transition: 'background 0.4s, border-color 0.4s',
            }}
          >
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
              color: accentColor, letterSpacing: '0.08em', textTransform: 'uppercase',
              display: 'block', marginBottom: 4, transition: 'color 0.4s',
            }}>Why this query</span>
            <p style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.65, margin: 0 }}>
              {queryData.reasoning}
            </p>
          </motion.div>

          {/* Data status */}
          <AnimatePresence mode="wait">
            {phase === 'typing' && !dataReady && (
              <motion.div key="fetching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[0,1,2].map(i => (
                    <motion.div key={i}
                      style={{ width: 5, height: 5, borderRadius: '50%', background: accentColor }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                    />
                  ))}
                </div>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink3)' }}>Fetching data...</span>
              </motion.div>
            )}
            {['data_ready', 'reading', 'done'].includes(phase) && (
              <motion.div key="loaded" initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: GREEN }}>✓ Data loaded</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)' }}>— see below</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Arjun reads the data */}
      <AnimatePresence>
        {['reading', 'done'].includes(phase) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              marginTop: 10, padding: '12px 14px', borderRadius: 10,
              // ── Pulse: reading panel also picks up accentColor ──
              background: `${accentColor}08`, border: `1px solid ${accentColor}20`,
              borderLeft: `2px solid ${accentColor}`,
              transition: 'background 0.4s, border-color 0.4s',
            }}
          >
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
              color: accentColor, letterSpacing: '0.08em', textTransform: 'uppercase',
              display: 'block', marginBottom: 5, transition: 'color 0.4s',
            }}>Arjun reads the data</span>
            <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.68, margin: 0 }}>
              {queryData.arjunReads}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}