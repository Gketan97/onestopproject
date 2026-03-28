// src/components/strategy/components/MilestoneStrip.jsx
// UX fix: current milestone fully expanded.
// Completed = single checkmark line, title only, no description.
// Next = title + "up next" pill, no description.
// Everything beyond next = hidden entirely.
// One focus at a time.

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { MILESTONES } from '../data/swiggyStrategyData.js';

const MILESTONE_COLORS = ['#FC8019', '#4F80FF', '#A78BFA', '#3DD68C', '#F38BA8', '#F9E2AF'];

export default function MilestoneStrip({ currentIndex, completedIndices }) {
  const color = (i) => MILESTONE_COLORS[i % MILESTONE_COLORS.length];

  // Only show: completed ones + current + next teaser
  // Completed milestones are always visible (collapsed)
  // Current is always visible (expanded)
  // Next is visible as teaser
  // Everything else hidden

  const completedMilestones = MILESTONES.filter((m, i) => completedIndices.includes(m.id));
  const currentMilestone = MILESTONES[currentIndex];
  const nextMilestone = MILESTONES[currentIndex + 1] || null;

  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{
        fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--ink3)', marginBottom: 8,
      }}>
        Investigation progress · {currentIndex + 1} of {MILESTONES.length}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

        {/* Completed milestones — compact single line */}
        {completedMilestones.map((m) => {
          const i = MILESTONES.indexOf(m);
          const c = color(i);
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 12px', borderRadius: 8,
                background: `${c}06`,
                border: `1px solid ${c}15`,
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${c}18`, border: `1px solid ${c}35`,
              }}>
                <Check size={11} color={c} strokeWidth={2.5} />
              </div>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink3)', flex: 1 }}>
                {m.title}
              </span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: c, opacity: 0.7 }}>done</span>
            </motion.div>
          );
        })}

        {/* Current milestone — fully expanded */}
        {currentMilestone && (
          <motion.div
            key={currentMilestone.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              borderRadius: 10,
              border: `1px solid ${color(currentIndex)}40`,
              background: `${color(currentIndex)}0C`,
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
              <div style={{
                width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${color(currentIndex)}18`,
                border: `1px solid ${color(currentIndex)}40`,
              }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: color(currentIndex) }}>
                  {currentMilestone.number}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', display: 'block' }}>
                  {currentMilestone.title}
                </span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: color(currentIndex), letterSpacing: '0.04em' }}>
                  {currentMilestone.subtitle}
                </span>
              </div>
              <motion.div
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: color(currentIndex), flexShrink: 0 }}
              />
            </div>
            {/* Description — only on current */}
            <div style={{
              padding: '0 14px 12px 48px',
              borderTop: `1px solid ${color(currentIndex)}14`,
            }}>
              <p style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.65, marginTop: 10, marginBottom: 0 }}>
                {currentMilestone.description}
              </p>
            </div>
          </motion.div>
        )}

        {/* Next milestone — teaser only, no description */}
        {nextMilestone && (
          <motion.div
            key={nextMilestone.id + '-next'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 12px', borderRadius: 8,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: 6, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 800, color: 'var(--ink3)' }}>
                {nextMilestone.number}
              </span>
            </div>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink3)', flex: 1 }}>
              {nextMilestone.title}
            </span>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)',
              padding: '2px 7px', borderRadius: 4,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              up next
            </span>
          </motion.div>
        )}

      </div>
    </div>
  );
}