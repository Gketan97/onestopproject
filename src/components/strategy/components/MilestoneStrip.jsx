// src/components/strategy/components/MilestoneStrip.jsx
// CP-B: Refactored from bulky stacked cards → sleek sticky horizontal progress bar.
// Design:
//   - Completed: dim dot + strikethrough label — minimal footprint
//   - Active: glowing pulse dot + full label + milestone color — commands focus
//   - Upcoming: faded dot + label — visible but recedes
//   - Takes < 48px vertical real estate
//   - Sticky so it follows the user as they scroll through long milestones

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { MILESTONES } from '../data/swiggyStrategyData.js';

const MILESTONE_COLORS = ['#FC8019', '#4F80FF', '#A78BFA', '#3DD68C', '#F38BA8', '#F9E2AF'];

export default function MilestoneStrip({ currentIndex, completedIndices }) {
  const color = (i) => MILESTONE_COLORS[i % MILESTONE_COLORS.length];

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        marginBottom: 24,
        // Pull to edges of the chat container padding
        margin: '-20px -20px 24px',
        padding: '0 20px',
        background: 'rgba(8,8,16,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Inner scrollable track — allows horizontal scroll on very small screens */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          padding: '10px 0',
        }}
      >
        {MILESTONES.map((milestone, i) => {
          const isDone    = completedIndices.includes(milestone.id);
          const isCurrent = i === currentIndex;
          const isUpcoming = i > currentIndex;
          const c         = color(i);
          const isLast    = i === MILESTONES.length - 1;

          return (
            <React.Fragment key={milestone.id}>
              {/* ── Milestone node ── */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  flexShrink: 0,
                  opacity: isUpcoming ? 0.38 : 1,
                  transition: 'opacity 0.35s ease',
                }}
              >
                {/* Dot / check icon */}
                <div style={{ position: 'relative', width: 18, height: 18, flexShrink: 0 }}>
                  {/* Glow ring — only on current */}
                  {isCurrent && (
                    <motion.div
                      animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                      style={{
                        position: 'absolute',
                        inset: -3,
                        borderRadius: '50%',
                        background: c,
                        opacity: 0.5,
                      }}
                    />
                  )}

                  {isDone ? (
                    // Completed: filled check
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        width: 18, height: 18, borderRadius: '50%',
                        background: `${c}25`,
                        border: `1.5px solid ${c}50`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Check size={9} color={c} strokeWidth={3} />
                    </motion.div>
                  ) : isCurrent ? (
                    // Active: solid glowing dot
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        width: 18, height: 18, borderRadius: '50%',
                        background: c,
                        boxShadow: `0 0 8px ${c}80`,
                      }}
                    />
                  ) : (
                    // Upcoming: hollow dim dot
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1.5px solid rgba(255,255,255,0.12)',
                    }} />
                  )}
                </div>

                {/* Label */}
                <span
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                    fontWeight: isCurrent ? 700 : 500,
                    color: isCurrent ? c : isDone ? 'var(--ink3)' : 'var(--ink3)',
                    textDecoration: isDone ? 'line-through' : 'none',
                    textDecorationColor: `${c}50`,
                    letterSpacing: isCurrent ? '0.02em' : '0',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {isCurrent ? (
                    // Active: show number + title
                    <>
                      <span style={{ opacity: 0.6, marginRight: 4 }}>{milestone.number}</span>
                      {milestone.title}
                    </>
                  ) : isDone ? (
                    // Done: title only (struck through)
                    milestone.title
                  ) : (
                    // Upcoming: number + title
                    <>
                      <span style={{ opacity: 0.5, marginRight: 4 }}>{milestone.number}</span>
                      {milestone.title}
                    </>
                  )}
                </span>
              </div>

              {/* ── Connector line between nodes ── */}
              {!isLast && (
                <div
                  style={{
                    flex: 1,
                    minWidth: 16,
                    maxWidth: 36,
                    height: 1,
                    margin: '0 6px',
                    background: isDone
                      ? `${color(i)}40`          // completed segment = colored
                      : 'rgba(255,255,255,0.07)', // upcoming = dim
                    transition: 'background 0.4s ease',
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Ultra-thin color-keyed progress bar at very bottom of strip */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0, left: 0,
          height: 1.5,
          background: color(currentIndex),
          borderRadius: '0 1px 1px 0',
          opacity: 0.6,
        }}
        animate={{
          width: `${((currentIndex + (completedIndices.length > currentIndex ? 1 : 0)) / MILESTONES.length) * 100}%`,
        }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}