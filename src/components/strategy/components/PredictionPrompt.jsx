// src/components/strategy/components/PredictionPrompt.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, XCircle } from 'lucide-react';

const BLUE  = '#4F80FF';
const GREEN = '#3DD68C';
const RED   = '#F38BA8';
const ORANGE = '#FC8019';

export default function PredictionPrompt({ prediction, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  if (!prediction) return null;

  const isCorrect = selected === prediction.correctIndex;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ borderRadius: 14, overflow: 'hidden', border: `1px solid ${BLUE}22`, background: `${BLUE}05`, marginBottom: 16 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 13px', background: `${BLUE}08`, borderBottom: `1px solid ${BLUE}14` }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: BLUE, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Your prediction</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', marginLeft: 'auto' }}>before Arjun acts</span>
      </div>

      <div style={{ padding: '12px 13px' }}>
        <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.65, marginBottom: 12, fontWeight: 500 }}>
          {prediction.question}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 12 }}>
          {(prediction.options || []).map((option, i) => {
            const isSelected = selected === i;
            const isCorrectOption = i === prediction.correctIndex;

            let border = 'rgba(255,255,255,0.09)';
            let bg = 'rgba(255,255,255,0.03)';
            let color = 'var(--ink2)';

            if (isSelected && !revealed) { border = `${BLUE}50`; bg = `${BLUE}10`; color = 'var(--ink)'; }
            if (revealed && isCorrectOption) { border = `${GREEN}50`; bg = `${GREEN}08`; color = 'var(--ink)'; }
            if (revealed && isSelected && !isCorrectOption) { border = `${RED}40`; bg = `${RED}06`; }

            return (
              <motion.button key={i}
                onClick={() => !revealed && setSelected(i)}
                whileHover={!revealed ? { x: 2 } : {}}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 9, background: bg, border: `1px solid ${border}`, cursor: revealed ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
              >
                <div style={{ flexShrink: 0, width: 16 }}>
                  {revealed && isCorrectOption && <CheckCircle size={14} color={GREEN} />}
                  {revealed && isSelected && !isCorrectOption && <XCircle size={14} color={RED} />}
                  {!revealed && <div style={{ width: 8, height: 8, borderRadius: '50%', background: isSelected ? BLUE : 'transparent', border: `1px solid ${isSelected ? BLUE : 'rgba(255,255,255,0.2)'}`, margin: '0 auto' }} />}
                </div>
                <span style={{ fontSize: 13, color, lineHeight: 1.45, flex: 1 }}>{option}</span>
              </motion.button>
            );
          })}
        </div>

        {!revealed && selected !== null && (
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={() => setRevealed(true)}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 8, background: BLUE, color: '#fff', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}
          >
            See what Arjun does <ArrowRight size={13} />
          </motion.button>
        )}

        <AnimatePresence>
          {revealed && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <div style={{ padding: '10px 12px', borderRadius: 9, marginBottom: 10, background: `${BLUE}08`, border: `1px solid ${BLUE}20`, borderLeft: `2px solid ${BLUE}` }}>
                <p style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: BLUE, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Arjun\'s actual move</p>
                <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>"{prediction.arjunActual}"</p>
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.65, marginBottom: 12 }}>{prediction.explanation}</p>
              <motion.button
                onClick={onComplete}
                whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 8, background: ORANGE, color: '#fff', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 2px 12px rgba(252,128,25,0.3)' }}
              >
                Watch Arjun do it <ArrowRight size={13} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
