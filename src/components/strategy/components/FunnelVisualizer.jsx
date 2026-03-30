// src/components/strategy/components/FunnelVisualizer.jsx
// CP12: Strategic Workbench — Interactive Funnel Visualizer
//
// Dark glassmorphic funnel chart. Shows this week vs last week drop-off rates.
// Interactive: hover a stage to see delta callout. Toggle new/returning users.
//
// PROPS:
//   thisWeek   — array of { stage, pct, users }
//   lastWeek   — array of { stage, pct, users }
//   newUsers   — array of { stage, pct } (segmented)
//   returning  — array of { stage, pct } (segmented)
//   title      — string

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ORANGE = '#FC8019';
const BLUE   = '#4F80FF';
const GREEN  = '#3DD68C';
const RED    = '#F38BA8';
const PURPLE = '#A78BFA';

// ── Default data — mirrors swiggyStrategyData FUNNEL constants ────────────────
const DEFAULT_THIS_WEEK = [
  { stage: 'App opened',    pct: 100,  users: 48200 },
  { stage: 'Browse',        pct: 82.1, users: 39572 },
  { stage: 'Add-to-Cart',   pct: 44.3, users: 21353 },
  { stage: 'Checkout',      pct: 38.2, users: 18413 },
  { stage: 'Order placed',  pct: 34.8, users: 16774 },
];

const DEFAULT_LAST_WEEK = [
  { stage: 'App opened',    pct: 100,  users: 46800 },
  { stage: 'Browse',        pct: 83.4, users: 39031 },
  { stage: 'Add-to-Cart',   pct: 57.8, users: 27062 },
  { stage: 'Checkout',      pct: 41.1, users: 19235 },
  { stage: 'Order placed',  pct: 37.9, users: 17737 },
];

const DEFAULT_NEW_USERS = [
  { stage: 'App opened',   pct: 100  },
  { stage: 'Browse',       pct: 74.2 },
  { stage: 'Add-to-Cart',  pct: 31.4 },
  { stage: 'Checkout',     pct: 25.8 },
  { stage: 'Order placed', pct: 22.1 },
];

const DEFAULT_RETURNING = [
  { stage: 'App opened',   pct: 100  },
  { stage: 'Browse',       pct: 91.3 },
  { stage: 'Add-to-Cart',  pct: 58.7 },
  { stage: 'Checkout',     pct: 52.4 },
  { stage: 'Order placed', pct: 48.9 },
];

// ── Segment toggle ────────────────────────────────────────────────────────────
function SegmentToggle({ value, onChange }) {
  const options = [
    { id: 'comparison', label: 'WoW Compare' },
    { id: 'segment',    label: 'New vs Returning' },
  ];
  return (
    <div style={{
      display: 'flex',
      gap: 2,
      padding: 3,
      borderRadius: 8,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      {options.map(o => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          style={{
            padding: '5px 12px',
            borderRadius: 6,
            border: 'none',
            fontFamily: 'var(--mono)',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.15s',
            background: value === o.id ? ORANGE : 'transparent',
            color: value === o.id ? '#fff' : 'var(--ink3)',
            boxShadow: value === o.id ? `0 1px 8px ${ORANGE}40` : 'none',
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ── Single funnel bar row ─────────────────────────────────────────────────────
function FunnelBar({ stage, pct, comparePct, color, compareColor, isAnomaly, isHovered, onHover, index, totalStages }) {
  const delta = comparePct !== undefined ? (pct - comparePct).toFixed(1) : null;
  const maxBarWidth = 100; // percentage of available width
  const barWidth    = (pct / 100) * maxBarWidth;
  const compareBarWidth = comparePct !== undefined ? (comparePct / 100) * maxBarWidth : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      style={{
        padding: '10px 12px',
        borderRadius: 8,
        background: isHovered
          ? isAnomaly ? `${RED}10` : 'rgba(255,255,255,0.04)'
          : isAnomaly ? `${RED}06` : 'transparent',
        border: `1px solid ${isAnomaly ? `${RED}20` : isHovered ? 'rgba(255,255,255,0.08)' : 'transparent'}`,
        transition: 'all 0.18s ease',
        cursor: 'pointer',
        marginBottom: 4,
      }}
    >
      {/* Stage label + delta badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
        <span style={{
          fontSize: 12,
          color: isAnomaly ? 'var(--ink)' : 'var(--ink2)',
          fontWeight: isAnomaly ? 600 : 400,
          flex: 1,
        }}>
          {stage}
          {isAnomaly && (
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 9, color: RED, marginLeft: 6,
            }}>⚠ anomaly</span>
          )}
        </span>

        {/* This week pct */}
        <span style={{
          fontFamily: 'var(--mono)',
          fontSize: 12,
          fontWeight: 700,
          color: isAnomaly ? RED : color,
        }}>
          {pct.toFixed(1)}%
        </span>

        {/* Delta */}
        {delta !== null && (
          <span style={{
            fontFamily: 'var(--mono)',
            fontSize: 10,
            fontWeight: 700,
            color: parseFloat(delta) < 0 ? RED : GREEN,
            minWidth: 40,
            textAlign: 'right',
          }}>
            {parseFloat(delta) > 0 ? '+' : ''}{delta}pp
          </span>
        )}
      </div>

      {/* Bar visualization */}
      <div style={{ position: 'relative', height: compareBarWidth !== null ? 18 : 10 }}>
        {/* Last week bar (behind) */}
        {compareBarWidth !== null && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: 8,
            width: `${compareBarWidth}%`,
            borderRadius: 4,
            background: `${compareColor}25`,
            border: `1px solid ${compareColor}30`,
            transition: 'width 0.6s ease',
          }} />
        )}
        {/* This week bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${barWidth}%` }}
          transition={{ duration: 0.7, delay: index * 0.07 + 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            top: compareBarWidth !== null ? 10 : 0,
            left: 0,
            height: 8,
            borderRadius: 4,
            background: isAnomaly
              ? `linear-gradient(90deg, ${RED}80, ${RED}40)`
              : `linear-gradient(90deg, ${color}90, ${color}50)`,
            boxShadow: isAnomaly ? `0 0 8px ${RED}40` : `0 0 6px ${color}30`,
          }}
        />
      </div>

      {/* Hover callout */}
      <AnimatePresence>
        {isHovered && comparePct !== undefined && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            style={{
              marginTop: 8,
              padding: '6px 10px',
              borderRadius: 6,
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              gap: 16,
            }}
          >
            <div>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', marginBottom: 2 }}>This week</p>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: color }}>{pct.toFixed(1)}%</p>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', marginBottom: 2 }}>Last week</p>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: compareColor }}>{comparePct.toFixed(1)}%</p>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', marginBottom: 2 }}>Swing</p>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: parseFloat(delta) < 0 ? RED : GREEN }}>
                {parseFloat(delta) > 0 ? '+' : ''}{delta}pp
              </p>
            </div>
            {isAnomaly && (
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: RED,
                  padding: '3px 8px', borderRadius: 4,
                  background: `${RED}15`, border: `1px solid ${RED}30`,
                }}>
                  ROOT CAUSE CANDIDATE
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Segmented view — new vs returning side by side ───────────────────────────
function SegmentedView({ newUsers, returning }) {
  const segments = [
    { label: 'New Users',       data: newUsers,  color: RED,   note: '↓ 18.2% this week' },
    { label: 'Returning Users', data: returning, color: GREEN, note: '↑ 1.2% this week'  },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
      {segments.map(({ label, data, color, note }) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            borderRadius: 12,
            overflow: 'hidden',
            border: `1px solid ${color}20`,
            background: `${color}04`,
          }}
        >
          <div style={{
            padding: '9px 14px',
            borderBottom: `1px solid ${color}14`,
            background: `${color}08`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color, textTransform: 'uppercase' }}>
              {label}
            </span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color, opacity: 0.7 }}>{note}</span>
          </div>
          <div style={{ padding: '10px 14px' }}>
            {data.map((s, i) => {
              const isAnomaly = label === 'New Users' && s.stage === 'Add-to-Cart';
              return (
                <div key={s.stage} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '5px 0',
                  borderBottom: i < data.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}>
                  <span style={{ fontSize: 11, color: 'var(--ink3)' }}>{s.stage}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* Mini bar */}
                    <div style={{ width: 60, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.pct}%` }}
                        transition={{ duration: 0.6, delay: i * 0.06 }}
                        style={{ height: '100%', borderRadius: 2, background: isAnomaly ? RED : color, opacity: 0.7 }}
                      />
                    </div>
                    <span style={{
                      fontFamily: 'var(--mono)', fontSize: 11,
                      fontWeight: isAnomaly ? 700 : 400,
                      color: isAnomaly ? RED : 'var(--ink2)',
                      minWidth: 36, textAlign: 'right',
                    }}>
                      {s.pct.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Main FunnelVisualizer ─────────────────────────────────────────────────────
export default function FunnelVisualizer({
  thisWeek  = DEFAULT_THIS_WEEK,
  lastWeek  = DEFAULT_LAST_WEEK,
  newUsers  = DEFAULT_NEW_USERS,
  returning = DEFAULT_RETURNING,
  title     = 'Conversion Funnel · North Bangalore',
}) {
  const [view, setView]           = useState('comparison');
  const [hoveredIndex, setHovered] = useState(null);

  // Find the anomaly stage (biggest absolute swing)
  const anomalyIndex = thisWeek.reduce((maxIdx, step, i) => {
    if (i === 0) return maxIdx;
    const delta    = Math.abs(step.pct - (lastWeek[i]?.pct || step.pct));
    const maxDelta = Math.abs(thisWeek[maxIdx]?.pct - (lastWeek[maxIdx]?.pct || thisWeek[maxIdx]?.pct));
    return delta > maxDelta ? i : maxIdx;
  }, 1);

  return (
    <div style={{
      borderRadius: 14,
      overflow: 'hidden',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        <div>
          <p style={{
            fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--ink3)', marginBottom: 2,
          }}>
            {title}
          </p>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', opacity: 0.6 }}>
            This week vs last week · hover a stage for details
          </p>
        </div>
        <SegmentToggle value={view} onChange={setView} />
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px' }}>
        <AnimatePresence mode="wait">
          {view === 'comparison' ? (
            <motion.div
              key="comparison"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Legend */}
              <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 24, height: 3, borderRadius: 2, background: `${ORANGE}70` }} />
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)' }}>This week</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 24, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.2)', border: '1px dashed rgba(255,255,255,0.2)' }} />
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)' }}>Last week</span>
                </div>
              </div>

              {thisWeek.map((step, i) => (
                <FunnelBar
                  key={step.stage}
                  stage={step.stage}
                  pct={step.pct}
                  comparePct={lastWeek[i]?.pct}
                  color={ORANGE}
                  compareColor="rgba(255,255,255,0.3)"
                  isAnomaly={i === anomalyIndex}
                  isHovered={hoveredIndex === i}
                  onHover={setHovered}
                  index={i}
                  totalStages={thisWeek.length}
                />
              ))}

              {/* Anomaly callout */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                style={{
                  marginTop: 12,
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: `${RED}08`,
                  border: `1px solid ${RED}20`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                }}
              >
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: RED, flexShrink: 0, marginTop: 1 }}>
                  ⚠ KEY FINDING
                </span>
                <p style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.55, margin: 0 }}>
                  <strong style={{ color: 'var(--ink)' }}>Add-to-Cart</strong> dropped{' '}
                  <strong style={{ color: RED }}>13.5pp</strong> — the largest swing by far.
                  Every other stage moved 2–4pp. The drop-off is at the cart, not discovery.
                </p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="segment"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SegmentedView newUsers={newUsers} returning={returning} />
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                style={{
                  marginTop: 12,
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: `${RED}08`,
                  border: `1px solid ${RED}20`,
                }}
              >
                <p style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.55, margin: 0 }}>
                  <strong style={{ color: RED }}>New users</strong> drop from 74% browse → 31% cart.
                  Returning users hold at 59%. The problem is{' '}
                  <strong style={{ color: 'var(--ink)' }}>new user acquisition quality</strong>{' '}
                  or a <strong style={{ color: 'var(--ink)' }}>cart experience issue</strong> that first-timers hit harder.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}