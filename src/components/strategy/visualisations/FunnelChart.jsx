// src/components/strategy/visualisations/FunnelChart.jsx
// CP2-A: Shared funnel visualisation — replaces FunnelComparison in
// ArjunSocraticChat.jsx and FunnelReadOnly in useTerminalBlocks.js
//
// PROPS:
//   thisWeek      — array: [{ stage, pct, users }]
//   lastWeek      — array: [{ stage, pct, users }]
//   title         — string
//   showSegmented — boolean: if true, renders new/returning split below
//   newUsers      — array: [{ stage, pct, users, alert? }]
//   returning     — array: [{ stage, pct, users }]

import React from 'react';

const RED   = '#F38BA8';
const GREEN = '#3DD68C';

export default function FunnelChart({
  thisWeek   = [],
  lastWeek   = [],
  title      = 'Conversion funnel',
  showSegmented = false,
  newUsers   = [],
  returning  = [],
}) {
  return (
    <div>
      {/* ── Main comparison table ── */}
      <div style={{
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.03)',
        marginBottom: 12,
      }}>
        <div style={{
          padding: '9px 14px',
          background: 'rgba(0,0,0,0.2)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <p style={{
            fontFamily: 'var(--mono)',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--ink3)',
            margin: 0,
          }}>
            {title}
          </p>
        </div>
        <div style={{ padding: '12px 14px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 80px 80px 60px',
            gap: 8,
            marginBottom: 8,
          }}>
            {['Stage', 'This week', 'Last week', 'Δ'].map(h => (
              <span key={h} style={{
                fontFamily: 'var(--mono)',
                fontSize: 9,
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--ink3)',
              }}>
                {h}
              </span>
            ))}
          </div>
          {thisWeek.map((step, i) => {
            const last  = lastWeek[i];
            const delta = last ? (step.pct - last.pct).toFixed(1) : null;
            const isAnomaly = delta !== null && Math.abs(parseFloat(delta)) > 8;
            return (
              <div key={step.stage} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 80px 80px 60px',
                gap: 8,
                padding: '6px 0',
                borderBottom: i < thisWeek.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                background: isAnomaly ? `${RED}06` : 'transparent',
                borderRadius: isAnomaly ? 6 : 0,
              }}>
                <span style={{
                  fontSize: 12,
                  color: isAnomaly ? 'var(--ink)' : 'var(--ink2)',
                  fontWeight: isAnomaly ? 600 : 400,
                }}>
                  {step.stage}
                  {isAnomaly && (
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: RED }}> ⚠</span>
                  )}
                </span>
                <span style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  color: isAnomaly ? RED : 'var(--ink2)',
                  fontWeight: isAnomaly ? 700 : 400,
                }}>
                  {step.pct?.toFixed(1)}%
                </span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink3)' }}>
                  {last?.pct?.toFixed(1)}%
                </span>
                <span style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  color: delta && parseFloat(delta) < 0 ? RED : GREEN,
                  fontWeight: isAnomaly ? 700 : 400,
                }}>
                  {delta !== null ? `${parseFloat(delta) > 0 ? '+' : ''}${delta}` : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Segmented new/returning split ── */}
      {showSegmented && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 10,
          marginBottom: 12,
        }}>
          {[
            { label: 'New Users',       data: newUsers,  color: RED   },
            { label: 'Returning Users', data: returning, color: GREEN },
          ].map(({ label, data, color }) => (
            <div key={label} style={{
              borderRadius: 10,
              overflow: 'hidden',
              border: `1px solid ${color}22`,
              background: `${color}05`,
            }}>
              <div style={{
                padding: '8px 12px',
                borderBottom: `1px solid ${color}14`,
                background: `${color}08`,
              }}>
                <p style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 9,
                  fontWeight: 700,
                  color,
                  textTransform: 'uppercase',
                  margin: 0,
                }}>
                  {label}
                </p>
              </div>
              <div style={{ padding: '10px 12px' }}>
                {data.slice(0, 5).map((s, i) => (
                  <div key={s.stage} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '4px 0',
                    borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}>
                    <span style={{ fontSize: 11, color: 'var(--ink3)' }}>{s.stage}</span>
                    <span style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 11,
                      fontWeight: s.alert ? 700 : 400,
                      color: s.alert ? RED : 'var(--ink2)',
                    }}>
                      {s.pct?.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
