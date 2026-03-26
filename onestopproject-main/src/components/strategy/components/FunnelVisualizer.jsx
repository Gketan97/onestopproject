// src/components/strategy/components/FunnelVisualizer.jsx
// Noir-style funnel showing this-week vs last-week with annotated drop-offs

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { FUNNEL_THIS_WEEK, FUNNEL_LAST_WEEK } from '../data/swiggyStrategyData.js';

const FUNNEL_MAX = 100;
const BAR_HEIGHT = 36;
const ORANGE = '#FC8019';
const BLUE = '#4F80FF';

function FunnelBar({ stage, current, prev, idx, total }) {
  const [hovered, setHovered] = useState(false);
  const isAlert = current.alert;
  const dropVsLW = prev ? ((current.users - prev.users) / prev.users * 100).toFixed(1) : null;
  const worse = dropVsLW && parseFloat(dropVsLW) < -5;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        {/* Stage label */}
        <div style={{ width: 100, flexShrink: 0 }}>
          <p style={{
            fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600,
            color: isAlert ? 'var(--red)' : 'var(--ink2)',
            letterSpacing: '0.02em',
          }}>{stage}</p>
        </div>

        {/* Bar track */}
        <div style={{ flex: 1, position: 'relative', height: BAR_HEIGHT }}>
          {/* Last week bar (reference) */}
          {prev && (
            <div style={{
              position: 'absolute', top: 2, left: 0,
              width: `${prev.pct}%`, height: BAR_HEIGHT - 4,
              borderRadius: 4,
              background: 'rgba(79,128,255,0.15)',
              border: '1px solid rgba(79,128,255,0.2)',
            }} />
          )}

          {/* This week bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${current.pct}%` }}
            transition={{ delay: 0.3 + idx * 0.07, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute', top: 0, left: 0,
              height: BAR_HEIGHT, borderRadius: 4,
              background: isAlert
                ? 'linear-gradient(90deg, rgba(243,139,168,0.35), rgba(243,139,168,0.20))'
                : `linear-gradient(90deg, rgba(252,128,25,0.45), rgba(252,128,25,0.22))`,
              border: `1px solid ${isAlert ? 'rgba(243,139,168,0.35)' : 'rgba(252,128,25,0.30)'}`,
            }}
          />

          {/* Value label inside bar */}
          <div style={{
            position: 'absolute', top: 0, left: 12,
            height: BAR_HEIGHT, display: 'flex', alignItems: 'center',
            pointerEvents: 'none',
          }}>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
              color: isAlert ? 'var(--red)' : ORANGE,
            }}>
              {current.users.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Drop-off label */}
        <div style={{ width: 80, flexShrink: 0, textAlign: 'right' }}>
          {current.dropLabel && (
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
              color: isAlert ? 'var(--red)' : worse ? 'var(--amber)' : 'var(--ink3)',
            }}>
              {current.dropLabel}
            </span>
          )}
          {dropVsLW && (
            <span style={{
              display: 'block', fontFamily: 'var(--mono)', fontSize: 9,
              color: parseFloat(dropVsLW) < 0 ? 'var(--red)' : 'var(--green)',
              marginTop: 1,
            }}>
              {dropVsLW > 0 ? '+' : ''}{dropVsLW}% WoW
            </span>
          )}
        </div>
      </div>

      {/* Alert annotation */}
      {isAlert && current.alertNote && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 + idx * 0.07 }}
          style={{
            marginLeft: 112, marginBottom: 8,
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 6,
            background: 'rgba(243,139,168,0.08)',
            border: '1px solid rgba(243,139,168,0.20)',
            width: 'fit-content',
          }}
        >
          <AlertTriangle size={11} style={{ color: 'var(--red)', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--red)', letterSpacing: '0.04em' }}>
            {current.alertNote}
          </span>
        </motion.div>
      )}

      {/* Hover tooltip */}
      {hovered && prev && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute', top: -44, left: 112, zIndex: 10,
            padding: '6px 12px', borderRadius: 8,
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: BLUE }}>
            LW: {prev.users.toLocaleString('en-IN')}
          </span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', marginLeft: 10 }}>
            TW: {current.users.toLocaleString('en-IN')}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function FunnelVisualizer() {
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
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 8,
      }}>
        <div>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink3)' }}>
            Conversion Funnel
          </p>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginTop: 2 }}>
            Tuesday vs Last Tuesday · North Bangalore
          </p>
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            { color: ORANGE, label: 'This Tuesday', opacity: '0.45' },
            { color: BLUE,   label: 'Last Tuesday', opacity: '0.25' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: `${l.color}${Math.round(parseFloat(l.opacity) * 255).toString(16).padStart(2,'0')}` }} />
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Funnel bars */}
      <div style={{ padding: '20px 20px 16px' }}>
        {FUNNEL_THIS_WEEK.map((stage, i) => (
          <FunnelBar
            key={stage.stage}
            stage={stage.stage}
            current={stage}
            prev={FUNNEL_LAST_WEEK[i]}
            idx={i}
            total={FUNNEL_THIS_WEEK.length}
          />
        ))}
      </div>

      {/* Insight footer */}
      <div style={{
        padding: '14px 20px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(8,8,16,0.3)',
      }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)' }}>
          💡 <strong style={{ color: 'var(--amber)' }}>Analyst note:</strong>{' '}
          Add-to-Cart drop is –11.5pp vs last week. Payment failures also elevated. Identify which drove the GMV loss before concluding root cause.
        </p>
      </div>
    </div>
  );
}
