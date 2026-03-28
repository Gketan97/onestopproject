// src/components/strategy/components/KpiScorecard.jsx
// Rebuild: progressive reveal + animated numbers.
// — Cards appear one at a time with 120ms stagger — data "arriving", not pre-loaded.
// — Numbers count up/down from neutral to their value on mount.
// — GMV card: number counts DOWN and turns red — visceral, impossible to ignore.
// — Alert pulse ring on GMV only — draws the eye to the right problem.
// — "LIVE INCIDENT" header with animated red dot signals this is real.

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { KPI_DATA } from '../data/swiggyStrategyData.js';

const RED    = '#F38BA8';
const GREEN  = '#3DD68C';
const ORANGE = '#FC8019';

// ── Animated number hook ──────────────────────────────────────────────────────
// Counts from `from` to `to` over `duration`ms on mount.
function useCountUp(to, from = 0, duration = 1200, decimals = 0) {
  const [value, setValue] = useState(from);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const diff = to - from;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + diff * eased;
      setValue(parseFloat(current.toFixed(decimals)));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [to, from, duration, decimals]);

  return value;
}

// ── Individual KPI card ───────────────────────────────────────────────────────
function KpiCard({ kpi, delay, visible }) {
  const isDown  = kpi.delta < 0;
  const isUp    = kpi.delta > 0;
  const color   = kpi.alert ? RED : isDown ? 'var(--ink2)' : isUp ? GREEN : 'var(--ink2)';
  const bg      = kpi.alert ? 'rgba(243,139,168,0.06)' : 'rgba(255,255,255,0.04)';
  const border  = kpi.alert ? 'rgba(243,139,168,0.25)' : 'rgba(255,255,255,0.08)';

  // Parse numeric value for animation
  // GMV: '₹2.14Cr' → 2.14 (counts from 2.33 down)
  // Conversion: '11.2%' → 11.2 (counts from 13.8 down)
  // Others: count from prev to current
  const parseNum = (str) => parseFloat(str.replace(/[₹%,Cr\s]/g, ''));
  const currentNum = parseNum(kpi.current);
  const prevNum    = parseNum(kpi.prev);

  // Count from prev → current (drops count DOWN, rises count UP)
  const animatedNum = useCountUp(
    visible ? currentNum : prevNum,
    prevNum,
    visible ? 1400 : 0,
    kpi.current.includes('.') ? (kpi.current.split('.')[1]?.replace(/[^\d]/g, '').length || 1) : 0
  );

  // Format the animated number back to match the original format
  const formatValue = (num) => {
    if (kpi.current.includes('₹') && kpi.current.includes('Cr')) return `₹${num.toFixed(2)}Cr`;
    if (kpi.current.includes('%')) return `${num.toFixed(1)}%`;
    if (kpi.current.includes('₹')) return `₹${Math.round(num)}`;
    if (kpi.current.includes(',')) return Math.round(num).toLocaleString('en-IN');
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={visible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.97 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        borderRadius: 16, padding: '20px 20px 18px',
        background: bg, border: `1px solid ${border}`,
        backdropFilter: 'blur(12px)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Alert pulse ring — GMV only */}
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
        color: kpi.alert ? RED : 'var(--ink3)',
        marginBottom: 10,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        {kpi.alert && (
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{ width: 5, height: 5, borderRadius: '50%', background: RED, display: 'inline-block' }}
          />
        )}
        {kpi.short}
      </p>

      {/* Animated value */}
      <motion.p
        style={{
          fontFamily: 'var(--mono)', fontSize: 26, fontWeight: 800,
          letterSpacing: '-0.03em',
          color: kpi.alert ? RED : 'var(--ink)',
          lineHeight: 1, marginBottom: 8,
        }}
      >
        {visible ? formatValue(animatedNum) : formatValue(prevNum)}
      </motion.p>

      {/* Delta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
        {isDown ? <TrendingDown size={13} style={{ color }} /> :
         isUp   ? <TrendingUp  size={13} style={{ color }} /> :
                  <Minus       size={13} style={{ color }} />}
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color }}>
          {kpi.delta > 0 ? '+' : ''}{kpi.delta}%
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)' }}>
          vs prev
        </span>
      </div>

      <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', letterSpacing: '0.05em' }}>
        {kpi.detail}
      </p>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function KpiScorecard({ onMetricClick, interactive = false, clickedMetric = null }) {
  // Each card becomes visible 120ms after the previous one — data "arriving"
  const kpis = Object.values(KPI_DATA);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    kpis.forEach((_, i) => {
      setTimeout(() => setVisibleCount(c => Math.max(c, i + 1)), i * 180);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Dashboard header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 16, flexWrap: 'wrap', gap: 8,
        }}
      >
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

        {/* LIVE INCIDENT badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 999,
            background: 'rgba(243,139,168,0.10)',
            border: '1px solid rgba(243,139,168,0.30)',
            boxShadow: '0 0 16px rgba(243,139,168,0.12)',
          }}
        >
          <motion.span
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.1, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: RED, display: 'inline-block' }}
          />
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
            color: RED, letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            Incident Active
          </span>
        </motion.div>
      </motion.div>

      {/* KPI Grid — cards stagger in */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 12,
      }}>
        {kpis.map((kpi, i) => {
  const metricKey = Object.keys(KPI_DATA)[i];
  return (
    <motion.div
      key={kpi.short}
      onClick={() => interactive && onMetricClick?.(metricKey)}
      whileHover={interactive && !clickedMetric ? { scale: 1.02, y: -2 } : {}}
      style={{ cursor: interactive && !clickedMetric ? 'pointer' : 'default' }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <KpiCard
        kpi={kpi}
        delay={i * 0.05}
        visible={visibleCount > i}
        isSelected={clickedMetric === metricKey}
        isClickable={interactive && !clickedMetric}
      />
    </motion.div>
  );
})}
      </div>
    </div>
  );
}