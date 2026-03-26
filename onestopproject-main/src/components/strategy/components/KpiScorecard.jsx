// src/components/strategy/components/KpiScorecard.jsx
// Phase 1 — Triage: KPI dashboard with one metric pulsing red

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { KPI_DATA } from '../data/swiggyStrategyData.js';

function KpiCard({ kpi, delay }) {
  const isDown  = kpi.delta < 0;
  const isUp    = kpi.delta > 0;
  const color   = kpi.alert ? 'var(--red)' : isDown ? 'var(--ink2)' : isUp ? 'var(--green)' : 'var(--ink2)';
  const bg      = kpi.alert ? 'rgba(243,139,168,0.06)' : 'var(--glass-bg, rgba(255,255,255,0.04))';
  const border  = kpi.alert ? 'rgba(243,139,168,0.25)' : 'rgba(255,255,255,0.08)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        borderRadius: 16, padding: '20px 20px 18px',
        background: bg, border: `1px solid ${border}`,
        backdropFilter: 'blur(12px)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Alert pulse ring */}
      {kpi.alert && (
        <motion.div
          style={{
            position: 'absolute', inset: 0, borderRadius: 16,
            border: '1px solid rgba(243,139,168,0.4)',
            pointerEvents: 'none',
          }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Alert top bar */}
      {kpi.alert && (
        <motion.div
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, var(--red), transparent)',
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      )}

      {/* Metric label */}
      <p style={{
        fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: kpi.alert ? 'var(--red)' : 'var(--ink3)',
        marginBottom: 10,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        {kpi.alert && (
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--red)', display: 'inline-block' }}
          />
        )}
        {kpi.short}
      </p>

      {/* Current value */}
      <p style={{
        fontFamily: 'var(--mono)', fontSize: 26, fontWeight: 800,
        letterSpacing: '-0.03em', color: kpi.alert ? 'var(--red)' : 'var(--ink)',
        lineHeight: 1, marginBottom: 8,
      }}>
        {kpi.current}
      </p>

      {/* Delta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
        {isDown ? <TrendingDown size={13} style={{ color }} /> :
         isUp   ? <TrendingUp  size={13} style={{ color }} /> :
                  <Minus       size={13} style={{ color }} />}
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color,
        }}>
          {kpi.delta > 0 ? '+' : ''}{kpi.delta}%
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)' }}>
          vs prev
        </span>
      </div>

      {/* Detail */}
      <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', letterSpacing: '0.05em' }}>
        {kpi.detail}
      </p>
    </motion.div>
  );
}

export default function KpiScorecard() {
  return (
    <div style={{ marginBottom: 24 }}>
      {/* Dashboard header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16, flexWrap: 'wrap', gap: 8,
      }}>
        <div>
          <p style={{
            fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink3)',
          }}>
            North Bangalore · Tuesday · Live
          </p>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginTop: 2 }}>
            Performance Snapshot
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 12px', borderRadius: 999,
          background: 'rgba(243,139,168,0.10)',
          border: '1px solid rgba(243,139,168,0.25)',
        }}>
          <motion.span
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.3, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)', display: 'inline-block' }}
          />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: 'var(--red)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Incident Active
          </span>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 12,
      }}>
        {Object.values(KPI_DATA).map((kpi, i) => (
          <KpiCard key={kpi.short} kpi={kpi} delay={i * 0.08} />
        ))}
      </div>
    </div>
  );
}
