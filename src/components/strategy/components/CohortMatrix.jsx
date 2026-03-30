// src/components/strategy/components/CohortMatrix.jsx
// CP12: Strategic Workbench — Interactive Cohort Retention Matrix
//
// Dark glassmorphic heatmap. Rows = user cohorts by week.
// Columns = retention at D1, D7, D14, D30.
// Interactive: hover a cell for exact count + context.
// Highlights the anomaly cohort (W-1 new users, D7 drop).
//
// PROPS:
//   data      — optional override for matrix data
//   title     — string

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ORANGE = '#FC8019';
const GREEN  = '#3DD68C';
const RED    = '#F38BA8';
const BLUE   = '#4F80FF';
const PURPLE = '#A78BFA';

// ── Default cohort data ───────────────────────────────────────────────────────
// Rows: cohort week. Cols: D1, D7, D14, D30 retention rates
const DEFAULT_HEADERS = ['Cohort', 'D1', 'D7', 'D14', 'D30', 'Users'];

const DEFAULT_ROWS = [
  { cohort: 'W-4 (new)',  d1: 68, d7: 41, d14: 28, d30: 19, users: 3420, isNew: true  },
  { cohort: 'W-3 (new)',  d1: 71, d7: 44, d14: 30, d30: 21, users: 3180, isNew: true  },
  { cohort: 'W-2 (new)',  d1: 69, d7: 42, d14: 29, d30: 20, users: 3290, isNew: true  },
  { cohort: 'W-1 (new)',  d1: 70, d7: 18, d14: 12, d30: null, users: 4820, isNew: true, anomaly: true },
  { cohort: 'W-4 (ret)',  d1: 88, d7: 72, d14: 61, d30: 49, users: 8140, isNew: false },
  { cohort: 'W-3 (ret)',  d1: 87, d7: 71, d14: 60, d30: 48, users: 7980, isNew: false },
  { cohort: 'W-2 (ret)',  d1: 89, d7: 73, d14: 62, d30: 50, users: 8220, isNew: false },
  { cohort: 'W-1 (ret)',  d1: 88, d7: 71, d14: null, d30: null, users: 8610, isNew: false },
];

// ── Color scale — maps retention % to a color ─────────────────────────────────
function getRetentionColor(pct, isAnomaly = false) {
  if (pct === null) return { bg: 'rgba(255,255,255,0.03)', text: 'var(--ink3)', border: 'transparent' };
  if (isAnomaly)    return { bg: `${RED}20`,    text: RED,    border: `${RED}40`    };
  if (pct >= 70)    return { bg: `${GREEN}18`,  text: GREEN,  border: `${GREEN}30`  };
  if (pct >= 50)    return { bg: `${BLUE}14`,   text: BLUE,   border: `${BLUE}25`   };
  if (pct >= 30)    return { bg: `${ORANGE}14`, text: ORANGE, border: `${ORANGE}25` };
  if (pct >= 15)    return { bg: `${RED}12`,    text: RED,    border: `${RED}22`    };
  return               { bg: `${RED}20`,    text: RED,    border: `${RED}35`    };
}

// ── Cell component ────────────────────────────────────────────────────────────
function Cell({ pct, isAnomaly, colLabel, cohort, users, isHovered, onHover }) {
  const { bg, text, border } = getRetentionColor(pct, isAnomaly);

  if (pct === null) {
    return (
      <td style={{ padding: '6px 4px', textAlign: 'center' }}>
        <div style={{
          padding: '5px 8px',
          borderRadius: 5,
          background: 'rgba(255,255,255,0.02)',
          fontFamily: 'var(--mono)',
          fontSize: 10,
          color: 'rgba(255,255,255,0.15)',
        }}>
          —
        </div>
      </td>
    );
  }

  return (
    <td style={{ padding: '4px 4px', textAlign: 'center', position: 'relative' }}>
      <motion.div
        onMouseEnter={() => onHover({ pct, colLabel, cohort, users, isAnomaly })}
        onMouseLeave={() => onHover(null)}
        whileHover={{ scale: 1.08 }}
        style={{
          padding: '6px 8px',
          borderRadius: 5,
          background: isHovered ? `${text}28` : bg,
          border: `1px solid ${isHovered ? text : border}`,
          fontFamily: 'var(--mono)',
          fontSize: 11,
          fontWeight: isAnomaly ? 800 : 600,
          color: text,
          cursor: 'pointer',
          transition: 'all 0.15s',
          boxShadow: isAnomaly ? `0 0 8px ${RED}30` : 'none',
          userSelect: 'none',
        }}
      >
        {pct}%
        {isAnomaly && (
          <span style={{ display: 'block', fontSize: 8, opacity: 0.8, marginTop: 1 }}>⚠</span>
        )}
      </motion.div>
    </td>
  );
}

// ── Hover tooltip ─────────────────────────────────────────────────────────────
function HoverTooltip({ data }) {
  if (!data) return null;
  const { pct, colLabel, cohort, users, isAnomaly } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.15 }}
      style={{
        position: 'absolute',
        bottom: 'calc(100% + 8px)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        padding: '10px 14px',
        borderRadius: 8,
        background: 'rgba(5,5,5,0.96)',
        border: `1px solid ${isAnomaly ? RED : 'rgba(255,255,255,0.12)'}`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        whiteSpace: 'nowrap',
        boxShadow: isAnomaly ? `0 4px 20px ${RED}30` : '0 4px 20px rgba(0,0,0,0.5)',
        pointerEvents: 'none',
      }}
    >
      <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', marginBottom: 4 }}>
        {cohort} · {colLabel}
      </p>
      <p style={{
        fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 800,
        color: isAnomaly ? RED : GREEN, margin: 0,
      }}>
        {pct}% retained
      </p>
      <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', marginTop: 3 }}>
        ~{Math.round(users * pct / 100).toLocaleString()} users
      </p>
      {isAnomaly && (
        <p style={{
          fontFamily: 'var(--mono)', fontSize: 9, color: RED,
          marginTop: 5, paddingTop: 5, borderTop: `1px solid ${RED}30`,
        }}>
          ⚠ 23pp below baseline — root cause candidate
        </p>
      )}
    </motion.div>
  );
}

// ── Legend ────────────────────────────────────────────────────────────────────
function Legend() {
  const items = [
    { color: GREEN,  label: '≥70% strong'   },
    { color: BLUE,   label: '50–69% good'   },
    { color: ORANGE, label: '30–49% weak'   },
    { color: RED,    label: '<30% critical' },
  ];
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {items.map(({ color, label }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{
            width: 8, height: 8, borderRadius: 2,
            background: `${color}30`, border: `1px solid ${color}50`,
          }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)' }}>{label}</span>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <div style={{
          width: 8, height: 8, borderRadius: 2,
          background: `${RED}20`, border: `1px solid ${RED}40`,
        }} />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: RED }}>⚠ anomaly</span>
      </div>
    </div>
  );
}

// ── Main CohortMatrix ─────────────────────────────────────────────────────────
export default function CohortMatrix({
  data  = DEFAULT_ROWS,
  title = 'Retention Cohort Matrix · North Bangalore',
}) {
  const [hovered, setHovered]   = useState(null);
  const [filter, setFilter]     = useState('all'); // 'all' | 'new' | 'returning'

  const filteredData = filter === 'all'
    ? data
    : filter === 'new'
    ? data.filter(r => r.isNew)
    : data.filter(r => !r.isNew);

  const cols = [
    { key: 'd1',  label: 'D1'  },
    { key: 'd7',  label: 'D7'  },
    { key: 'd14', label: 'D14' },
    { key: 'd30', label: 'D30' },
  ];

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
        flexWrap: 'wrap',
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
            hover a cell for detail · W-1 new users show anomalous D7 drop
          </p>
        </div>

        {/* Filter toggle */}
        <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { id: 'all',       label: 'All'       },
            { id: 'new',       label: 'New'        },
            { id: 'returning', label: 'Returning'  },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding: '4px 10px', borderRadius: 5, border: 'none',
              fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.15s',
              background: filter === f.id ? PURPLE : 'transparent',
              color: filter === f.id ? '#fff' : 'var(--ink3)',
            }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ padding: '14px 16px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr>
              <th style={{
                fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                color: 'var(--ink3)', textAlign: 'left',
                padding: '4px 8px 10px', width: '25%',
              }}>
                Cohort
              </th>
              {cols.map(c => (
                <th key={c.key} style={{
                  fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  color: 'var(--ink3)', textAlign: 'center',
                  padding: '4px 4px 10px',
                }}>
                  {c.label}
                </th>
              ))}
              <th style={{
                fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                color: 'var(--ink3)', textAlign: 'right',
                padding: '4px 8px 10px',
              }}>
                Users
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rowIdx) => (
              <motion.tr
                key={row.cohort}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: rowIdx * 0.05 }}
                style={{
                  background: row.anomaly ? `${RED}06` : 'transparent',
                }}
              >
                {/* Cohort label */}
                <td style={{ padding: '4px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                      background: row.isNew ? RED : GREEN,
                      opacity: 0.7,
                    }} />
                    <span style={{
                      fontFamily: 'var(--mono)', fontSize: 10,
                      color: row.anomaly ? 'var(--ink)' : 'var(--ink2)',
                      fontWeight: row.anomaly ? 700 : 400,
                    }}>
                      {row.cohort}
                    </span>
                    {row.anomaly && (
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 8, color: RED }}>⚠</span>
                    )}
                  </div>
                </td>

                {/* Data cells */}
                {cols.map(c => {
                  const pct       = row[c.key];
                  const isAnomaly = row.anomaly && (c.key === 'd7' || c.key === 'd14');
                  const hovKey    = `${rowIdx}-${c.key}`;
                  return (
                    <td key={c.key} style={{ padding: '4px 4px', textAlign: 'center', position: 'relative' }}>
                      {pct === null ? (
                        <div style={{
                          padding: '6px 8px', borderRadius: 5,
                          background: 'rgba(255,255,255,0.02)',
                          fontFamily: 'var(--mono)', fontSize: 10,
                          color: 'rgba(255,255,255,0.15)',
                          textAlign: 'center',
                        }}>—</div>
                      ) : (
                        <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                          <motion.div
                            onMouseEnter={() => setHovered({ pct, colLabel: c.label, cohort: row.cohort, users: row.users, isAnomaly })}
                            onMouseLeave={() => setHovered(null)}
                            whileHover={{ scale: 1.08 }}
                            style={{
                              padding: '6px 8px',
                              borderRadius: 5,
                              background: isAnomaly ? `${RED}20` : getRetentionColor(pct).bg,
                              border: `1px solid ${isAnomaly ? `${RED}40` : getRetentionColor(pct).border}`,
                              fontFamily: 'var(--mono)',
                              fontSize: 11,
                              fontWeight: isAnomaly ? 800 : 600,
                              color: isAnomaly ? RED : getRetentionColor(pct).text,
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                              boxShadow: isAnomaly ? `0 0 8px ${RED}30` : 'none',
                              userSelect: 'none',
                              textAlign: 'center',
                            }}
                          >
                            {pct}%
                            {isAnomaly && (
                              <span style={{ display: 'block', fontSize: 8, opacity: 0.8, marginTop: 1 }}>⚠</span>
                            )}
                          </motion.div>
                        </div>
                      )}
                    </td>
                  );
                })}

                {/* Users column */}
                <td style={{ padding: '4px 8px', textAlign: 'right' }}>
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: 10,
                    color: 'var(--ink3)',
                  }}>
                    {row.users.toLocaleString()}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {/* Hover tooltip — floating above table */}
        <div style={{ position: 'relative', height: 0 }}>
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'fixed',
                  bottom: 80,
                  right: 24,
                  zIndex: 100,
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: 'rgba(5,5,5,0.96)',
                  border: `1px solid ${hovered.isAnomaly ? RED : 'rgba(255,255,255,0.12)'}`,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: hovered.isAnomaly ? `0 4px 20px ${RED}30` : '0 4px 20px rgba(0,0,0,0.5)',
                  pointerEvents: 'none',
                  minWidth: 180,
                }}
              >
                <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', marginBottom: 4 }}>
                  {hovered.cohort} · {hovered.colLabel}
                </p>
                <p style={{
                  fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 800,
                  color: hovered.isAnomaly ? RED : GREEN, margin: 0,
                }}>
                  {hovered.pct}% retained
                </p>
                <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', marginTop: 3 }}>
                  ~{Math.round(hovered.users * hovered.pct / 100).toLocaleString()} users
                </p>
                {hovered.isAnomaly && (
                  <p style={{
                    fontFamily: 'var(--mono)', fontSize: 9, color: RED,
                    marginTop: 6, paddingTop: 6, borderTop: `1px solid ${RED}30`,
                  }}>
                    ⚠ 23pp below baseline — root cause candidate
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 16px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10,
      }}>
        <Legend />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            padding: '4px 10px', borderRadius: 5,
            background: `${RED}12`, border: `1px solid ${RED}25`,
          }}
        >
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: RED }}>
            W-1 new users: D7 retention 18% vs 42% baseline
          </span>
        </motion.div>
      </div>
    </div>
  );
}