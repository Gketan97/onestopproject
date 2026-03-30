// src/components/strategy/components/CohortMatrix.jsx
// Glassmorphic cohort retention heatmap with alert rows

import React from 'react';
import { motion } from 'framer-motion';
import { COHORT_ROWS, COHORT_HEADERS, COHORT_NARRATION } from '../data/swiggyStrategyData.js';

function retentionColor(pct, isAlert) {
  if (pct === null) return 'transparent';
  if (pct >= 55) return 'rgba(61,214,140,0.35)';
  if (pct >= 40) return 'rgba(61,214,140,0.20)';
  if (pct >= 28) return 'rgba(249,226,175,0.25)';
  if (pct >= 18) return 'rgba(252,128,25,0.30)';
  return 'rgba(243,139,168,0.38)';
}

function retentionTextColor(pct) {
  if (pct === null) return 'transparent';
  if (pct >= 55) return 'var(--green)';
  if (pct >= 40) return 'var(--green)';
  if (pct >= 28) return 'var(--amber)';
  if (pct >= 18) return 'var(--phase1)';
  return 'var(--red)';
}

export default function CohortMatrix() {
  return (
    <div style={{
      borderRadius: 20, overflow: 'hidden',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(8,8,16,0.5)',
      }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink3)' }}>
          Cohort Retention Matrix
        </p>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginTop: 2 }}>
          New User Retention by First-Order Week · North Bangalore
        </p>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {COHORT_HEADERS.map((h, i) => (
                <th key={h} style={{
                  padding: '10px 14px', textAlign: i <= 1 ? 'left' : 'center',
                  fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'var(--ink3)',
                  background: 'rgba(8,8,16,0.4)',
                  borderRight: i < COHORT_HEADERS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COHORT_ROWS.map((row, ri) => (
              <motion.tr
                key={row.cohort}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: ri * 0.07, duration: 0.4 }}
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  background: row.alert ? 'rgba(243,139,168,0.03)' : 'transparent',
                }}
              >
                {/* Cohort label */}
                <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {row.alert && (
                      <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.4, repeat: Infinity, delay: ri * 0.2 }}
                        style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--red)', display: 'inline-block', flexShrink: 0 }}
                      />
                    )}
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: row.alert ? 'var(--red)' : 'var(--ink2)', fontWeight: row.alert ? 600 : 400 }}>
                      {row.cohort}
                    </span>
                  </div>
                </td>
                {/* Cohort size */}
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600, color: 'var(--ink3)' }}>
                    {row.size.toLocaleString('en-IN')}
                  </span>
                </td>
                {/* Retention cells */}
                {row.retention.map((pct, ci) => (
                  <td key={ci} style={{
                    padding: '6px 8px', textAlign: 'center',
                    borderRight: ci < row.retention.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                  }}>
                    {pct !== null ? (
                      <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: ri * 0.07 + ci * 0.04, duration: 0.35 }}
                        style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: 48, height: 28, borderRadius: 6,
                          background: retentionColor(pct, row.alert),
                          fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
                          color: retentionTextColor(pct),
                        }}
                      >
                        {pct}%
                      </motion.div>
                    ) : (
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)' }}>—</span>
                    )}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insight footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(243,139,168,0.04)',
        border: '1px solid rgba(243,139,168,0.12)',
        margin: 0,
      }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 6 }}>
          ⚠ Pattern Detected
        </p>
        <p style={{ fontSize: 12, lineHeight: 1.65, color: 'var(--ink2)' }}>
          {COHORT_NARRATION.observation}
        </p>
        <p style={{ fontSize: 12, lineHeight: 1.65, color: 'var(--ink3)', marginTop: 6 }}>
          Potential impact: <strong style={{ color: 'var(--amber)' }}>{'30% faster churn in Weeks 4–6 vs Week 1 baseline'}</strong>
        </p>
      </div>

      {/* Colour legend */}
      <div style={{
        padding: '10px 20px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Retention scale:</span>
        {[
          { range: '≥55%', color: 'var(--green)' },
          { range: '40–54%', color: 'var(--phase1)' },
          { range: '28–39%', color: 'var(--amber)' },
          { range: '<28%', color: 'var(--red)' },
        ].map(l => (
          <div key={l.range} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color, opacity: 0.7 }} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)' }}>{l.range}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
