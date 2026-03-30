// src/components/strategy/components/MilestoneStrip.jsx
// CP9: M2.5 hypothesis milestone rendered as a sub-step between 02 and 03
// Visual treatment: smaller dot, indented label, branching connector
// Still uses the same completedIndices + currentIndex props — no API changes

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { MILESTONES } from '../data/swiggyStrategyData.js';

const MILESTONE_COLORS = ['#FC8019', '#4F80FF', '#9B6FD4', '#3DD68C', '#F38BA8', '#F9E2AF', '#FC8019'];
// Index map matches MILESTONES array order: scope, dashboard, hypothesis, funnel, rootcause, impact, respond

export default function MilestoneStrip({ currentIndex, completedIndices }) {
  const color = (i) => MILESTONE_COLORS[i % MILESTONE_COLORS.length];

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 30,
      margin: '-20px -20px 24px',
      padding: '0 20px',
      background: 'rgba(8,8,16,0.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 0,
        overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none',
        padding: '10px 0',
      }}>
        {MILESTONES.map((milestone, i) => {
          const isDone     = completedIndices.includes(milestone.id);
          const isCurrent  = i === currentIndex;
          const isUpcoming = i > currentIndex;
          const c          = color(i);
          const isLast     = i === MILESTONES.length - 1;
          const isSubStep  = milestone.number === '02.5';

          return (
            <React.Fragment key={milestone.id}>
              {/* ── Milestone node ── */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: isSubStep ? 5 : 7,
                flexShrink: 0,
                opacity: isUpcoming ? 0.38 : 1,
                transition: 'opacity 0.35s ease',
                // Sub-step gets slight indent to show hierarchy
                marginLeft: isSubStep ? 4 : 0,
              }}>
                {/* Dot */}
                <div style={{ position: 'relative', width: isSubStep ? 14 : 18, height: isSubStep ? 14 : 18, flexShrink: 0 }}>
                  {isCurrent && (
                    <motion.div
                      animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                      style={{ position: 'absolute', inset: -3, borderRadius: '50%', background: c, opacity: 0.5 }}
                    />
                  )}

                  {isDone ? (
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}
                      style={{ width: isSubStep ? 14 : 18, height: isSubStep ? 14 : 18, borderRadius: '50%', background: `${c}25`, border: `1.5px solid ${c}50`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={isSubStep ? 7 : 9} color={c} strokeWidth={3} />
                    </motion.div>
                  ) : isCurrent ? (
                    <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
                      style={{ width: isSubStep ? 14 : 18, height: isSubStep ? 14 : 18, borderRadius: '50%', background: c, boxShadow: `0 0 8px ${c}80` }} />
                  ) : (
                    <div style={{ width: isSubStep ? 14 : 18, height: isSubStep ? 14 : 18, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: `${isSubStep ? 1 : 1.5}px solid rgba(255,255,255,0.12)` }} />
                  )}
                </div>

                {/* Label */}
                <span style={{
                  fontFamily: 'var(--mono)',
                  fontSize: isSubStep ? 9 : 10,
                  fontWeight: isCurrent ? 700 : 500,
                  color: isCurrent ? c : 'var(--ink3)',
                  textDecoration: isDone ? 'line-through' : 'none',
                  textDecorationColor: `${c}50`,
                  letterSpacing: isCurrent ? '0.02em' : '0',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.3s ease',
                  // Sub-step label is slightly more muted when not active
                  opacity: isSubStep && !isCurrent && !isDone ? 0.7 : 1,
                }}>
                  {isCurrent ? (
                    <>{isSubStep && <span style={{ opacity: 0.5, marginRight: 3, fontSize: 8 }}>↳</span>}<span style={{ opacity: 0.6, marginRight: 4 }}>{milestone.number}</span>{milestone.title}</>
                  ) : isDone ? (
                    <>{isSubStep && <span style={{ opacity: 0.4, marginRight: 3, fontSize: 8 }}>↳</span>}{milestone.title}</>
                  ) : (
                    <>{isSubStep && <span style={{ opacity: 0.35, marginRight: 3, fontSize: 8 }}>↳</span>}<span style={{ opacity: 0.5, marginRight: 4 }}>{milestone.number}</span>{milestone.title}</>
                  )}
                </span>
              </div>

              {/* Connector */}
              {!isLast && (
                <div style={{
                  flex: 1, minWidth: isSubStep ? 8 : 16, maxWidth: isSubStep ? 20 : 36,
                  height: 1, margin: '0 4px',
                  background: isDone ? `${color(i)}40` : 'rgba(255,255,255,0.07)',
                  transition: 'background 0.4s ease',
                  // Dashed connector before/after sub-step
                  borderTop: isSubStep || MILESTONES[i + 1]?.number === '02.5' ? '1px dashed rgba(255,255,255,0.12)' : 'none',
                  height: isSubStep || MILESTONES[i + 1]?.number === '02.5' ? 0 : 1,
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Progress bar */}
      <motion.div
        style={{ position: 'absolute', bottom: 0, left: 0, height: 1.5, background: color(currentIndex), borderRadius: '0 1px 1px 0', opacity: 0.6 }}
        animate={{ width: `${((currentIndex + (completedIndices.length > currentIndex ? 1 : 0)) / MILESTONES.length) * 100}%` }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}