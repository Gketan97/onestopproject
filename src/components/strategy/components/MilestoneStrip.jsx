import { MILESTONES } from '../data/swiggyStrategyData.js';
// src/components/strategy/components/MilestoneStrip.jsx
// Reveals one milestone at a time — user never sees all 6 upfront.
// Each milestone unlocks only when the previous completes.
// Shows current milestone expanded, completed ones as compact ticks, next hidden.

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';


const MILESTONE_COLORS = ['#FC8019', '#4F80FF', '#A78BFA', '#3DD68C', '#F38BA8', '#F9E2AF'];

export default function MilestoneStrip({ currentIndex, completedIndices }) {
  // Only show milestones up to currentIndex + 1 (next is a teaser)
  const milestones = MILESTONES;
  const visible = milestones.slice(0, currentIndex + 2);

  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: 10 }}>
        Investigation progress
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {visible.map((m, i) => {
          const isDone = completedIndices.includes(m.id);
          const isCurrent = i === currentIndex;
          const isNext = i === currentIndex + 1;

          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: isNext ? 0.45 : 1, x: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              style={{
                borderRadius: 10,
                border: `1px solid ${isDone ? `${MILESTONE_COLORS[i % MILESTONE_COLORS.length]}20` : isCurrent ? `${MILESTONE_COLORS[i % MILESTONE_COLORS.length]}35` : 'rgba(255,255,255,0.06)'}`,
                background: isDone ? `${MILESTONE_COLORS[i % MILESTONE_COLORS.length]}06` : isCurrent ? `${MILESTONE_COLORS[i % MILESTONE_COLORS.length]}09` : 'rgba(255,255,255,0.02)',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: isCurrent ? '12px 14px' : '9px 14px' }}>
                {/* Status icon */}
                <div style={{
                  width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isDone ? `${MILESTONE_COLORS[i % MILESTONE_COLORS.length]}20` : isCurrent ? `${MILESTONE_COLORS[i % MILESTONE_COLORS.length]}15` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isDone ? `${MILESTONE_COLORS[i % MILESTONE_COLORS.length]}40` : isCurrent ? `${MILESTONE_COLORS[i % MILESTONE_COLORS.length]}30` : 'rgba(255,255,255,0.08)'}`,
                }}>
                  {isDone
                    ? <Check size={12} color={MILESTONE_COLORS[i % MILESTONE_COLORS.length]} strokeWidth={2.5} />
                    : <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: isCurrent ? MILESTONE_COLORS[i % MILESTONE_COLORS.length] : 'var(--ink3)' }}>{m.number}</span>
                  }
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: isDone || isCurrent ? 700 : 500, color: isDone ? 'var(--ink2)' : isCurrent ? 'var(--ink)' : 'var(--ink3)' }}>
                      {m.title}
                    </span>
                    {isDone && (
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: MILESTONE_COLORS[i % MILESTONE_COLORS.length], fontWeight: 700, letterSpacing: '0.06em' }}>✓ done</span>
                    )}
                    {isNext && (
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', letterSpacing: '0.06em' }}>up next</span>
                    )}
                  </div>
                  {isCurrent && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      style={{ fontFamily: 'var(--mono)', fontSize: 10, color: MILESTONE_COLORS[i % MILESTONE_COLORS.length], marginTop: 2, letterSpacing: '0.04em' }}
                    >
                      {m.subtitle}
                    </motion.p>
                  )}
                </div>

                {/* Active indicator */}
                {isCurrent && (
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                    style={{ width: 6, height: 6, borderRadius: '50%', background: MILESTONE_COLORS[i % MILESTONE_COLORS.length], flexShrink: 0 }}
                  />
                )}
              </div>

              {/* Current milestone description */}
              <AnimatePresence>
                {isCurrent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ padding: '0 14px 12px 48px', borderTop: `1px solid ${MILESTONE_COLORS[i % MILESTONE_COLORS.length]}14` }}
                  >
                    <p style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.65, marginTop: 10, marginBottom: 0 }}>
                      {m.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}