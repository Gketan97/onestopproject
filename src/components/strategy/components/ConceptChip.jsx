// src/components/strategy/components/ConceptChip.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen } from 'lucide-react';

export default function ConceptChip({ concept, onDismiss }) {
  const [expanded, setExpanded] = useState(false);
  if (!concept) return null;
  const c = concept.color;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.97 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginBottom: 14 }}
    >
      {!expanded && (
        <div
          onClick={() => setExpanded(true)}
          role="button" tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && setExpanded(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '5px 12px', borderRadius: 999, cursor: 'pointer',
            background: `${c}10`, border: `1px solid ${c}28`, transition: 'background 0.18s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = `${c}1C`}
          onMouseLeave={e => e.currentTarget.style.background = `${c}10`}
        >
          <BookOpen size={11} color={c} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: c, letterSpacing: '0.06em' }}>{concept.title}</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)' }}>— {concept.oneLiner}</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: c, opacity: 0.55 }}>↗</span>
        </div>
      )}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${c}22`, background: `${c}06` }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 13px', background: `${c}08`, borderBottom: `1px solid ${c}14` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <BookOpen size={12} color={c} />
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: c, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{concept.title}</span>
              </div>
              <button onClick={() => { setExpanded(false); onDismiss?.(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}>
                <X size={13} color='var(--ink3)' />
              </button>
            </div>
            <div style={{ padding: '12px 13px' }}>
              <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.68, marginBottom: 10, fontWeight: 500 }}>{concept.explanation}</p>
              <div style={{ padding: '8px 11px', borderRadius: 8, background: 'rgba(0,0,0,0.2)', border: `1px solid ${c}16`, marginBottom: 10 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: c, letterSpacing: '0.08em', textTransform: 'uppercase', marginRight: 8 }}>Example</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink2)', lineHeight: 1.6 }}>{concept.example}</span>
              </div>
              <button onClick={() => { setExpanded(false); onDismiss?.(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                Got it — back to the investigation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}