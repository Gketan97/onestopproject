// src/components/layout/TrustBar.jsx
// Sprint 6 — Global trust bar (non-simulator pages only)
// Rotating signal cycles every 5s via AnimatePresence + key pattern

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GREEN  = '#3DD68C';

const SIGNALS = [
  "🇮🇳 Built for Indian product & analytics careers — Bangalore-first, then everywhere.",
  "✓ Free to start — no account, no credit card, no barrier.",
  "📎 Your portfolio link works forever — share it in any application.",
];

export default function TrustBar() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setIdx(i => (i + 1) % SIGNALS.length), 5000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{
      height: 36,
      background: 'rgba(252,128,25,0.06)',
      borderBottom: '1px solid rgba(252,128,25,0.14)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Rotating signal */}
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            fontFamily: 'var(--mono)', fontSize: 11,
            color: 'var(--ink2)', letterSpacing: '0.04em',
          }}
        >
          {SIGNALS[idx]}
        </motion.span>
      </AnimatePresence>

      {/* YC pill — far right */}
      <a
        href="#"
        style={{
          position: 'absolute', right: 16,
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '3px 10px', borderRadius: 999,
          background: `${GREEN}10`, border: `1px solid ${GREEN}25`,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: GREEN, flexShrink: 0,
        }} />
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
          color: GREEN, letterSpacing: '0.06em',
        }}>
          Y Combinator W25 application →
        </span>
      </a>
    </div>
  );
}