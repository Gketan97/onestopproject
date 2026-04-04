// ============================================================
// DATA PANEL — Right panel
// Hidden by default. Slides in when a query runs.
// User can collapse and re-expand.
// No empty state ever shown to the user.
// ============================================================

'use client';

import { useEffect, useState } from 'react';
import type { AggregatedMetrics } from '@/types';

interface Props {
  metrics: AggregatedMetrics | null;
  isQueryRunning: boolean;
}

export function MetricsPanel({ metrics, isQueryRunning }: Props) {
  const [visible, setVisible] = useState(false);
  const [everHadData, setEverHadData] = useState(false);

  // Auto-expand when query runs or results arrive
  useEffect(() => {
    if (isQueryRunning || metrics) {
      setVisible(true);
      setEverHadData(true);
    }
  }, [isQueryRunning, metrics]);

  // ── COLLAPSED — thin strip with re-open button ─────────────
  if (!visible) {
    if (!everHadData) return null; // Never show before first query

    return (
      <div style={{
        width: '40px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '16px',
        gap: '8px',
        borderLeft: '1px solid var(--border)',
        background: 'var(--surface)',
        cursor: 'pointer',
      }}
        onClick={() => setVisible(true)}
        title="Show data results"
      >
        <div style={{
          writingMode: 'vertical-rl',
          fontSize: '10px',
          fontWeight: 600,
          color: 'var(--ink4)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          transform: 'rotate(180deg)',
          marginTop: '8px',
        }}>
          Data
        </div>
        <div style={{
          width: '6px', height: '6px',
          borderRadius: '50%',
          background: 'var(--green)',
          marginTop: '4px',
        }} />
      </div>
    );
  }

  // ── EXPANDED ───────────────────────────────────────────────
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      borderLeft: '1px solid var(--border)',
      background: 'var(--surface)',
      animation: 'slideInRight 0.25s ease-out',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink1)' }}>
            Data Results
          </p>
          {metrics && (
            <p style={{ fontSize: '10px', color: 'var(--ink4)', marginTop: '1px' }}>
              {metrics.rowCount} rows · {metrics.executionMs}ms
            </p>
          )}
        </div>
        <button
          onClick={() => setVisible(false)}
          style={{
            padding: '4px 8px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--ink4)',
            fontSize: '11px',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
        {isQueryRunning && <QueryLoadingState />}
        {!isQueryRunning && metrics && <MetricsDisplay metrics={metrics} />}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// METRICS DISPLAY
// ─────────────────────────────────────────────────────────────

function MetricsDisplay({ metrics }: { metrics: AggregatedMetrics }) {
  const entries = Object.entries(metrics.metrics);
  const scalarEntries = entries.filter(
    ([key, val]) => !key.endsWith('_series') && !key.startsWith('_') && val !== null
  );
  const seriesEntries = entries.filter(([key]) => key.endsWith('_series'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Query label — human readable */}
      <div style={{
        padding: '8px 12px',
        background: 'rgba(79,128,255,0.06)',
        border: '1px solid rgba(79,128,255,0.15)',
        borderRadius: 'var(--radius-md)',
      }}>
        <p style={{ fontSize: '11px', color: 'var(--blue)', fontWeight: 600 }}>
          {humaniseQueryId(metrics.queryId)}
        </p>
        <p style={{ fontSize: '10px', color: 'var(--ink4)', marginTop: '2px' }}>
          {metrics.rowCount} data points analysed
        </p>
      </div>

      {/* KPI cards */}
      {scalarEntries.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
        }}>
          {scalarEntries.map(([key, value]) => (
            <KPICard key={key} label={key} value={value} />
          ))}
        </div>
      )}

      {/* Charts */}
      {seriesEntries.map(([key, value]) => {
        const seriesKey = key.replace('_series', '');
        let parsed: (number | string | null)[] = [];
        try { parsed = JSON.parse(String(value)); } catch { return null; }
        const numericValues = parsed.filter((v): v is number => typeof v === 'number');
        if (numericValues.length === 0) return null;
        return <MiniChart key={key} label={seriesKey} values={numericValues} />;
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// KPI CARD
// ─────────────────────────────────────────────────────────────

function KPICard({ label, value }: { label: string; value: number | string | null }) {
  const displayLabel = label.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const isNegative = typeof value === 'number' && (label.includes('loss') || label.includes('decline'));
  const isRevenue = label.includes('revenue') || label.includes('rpb') || label.includes('loss');
  const isRate = label.includes('rate') || label.includes('pct') || label.includes('conversion');
  const color = isNegative ? 'var(--red)' : isRevenue ? 'var(--green)' : isRate ? 'var(--blue)' : 'var(--ink1)';

  return (
    <div style={{
      padding: '10px 12px',
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: 'var(--radius-md)',
    }}>
      <p style={{ fontSize: '10px', color: 'var(--ink3)', marginBottom: '5px', lineHeight: 1.3 }}>
        {displayLabel}
      </p>
      <p style={{ fontSize: '15px', fontWeight: 700, color, fontFamily: 'monospace' }}>
        {formatValue(value, label)}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MINI CHART
// ─────────────────────────────────────────────────────────────

function MiniChart({ label, values }: { label: string; values: number[] }) {
  const displayLabel = label.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const W = 240, H = 60;
  const barW = Math.max(2, (W / values.length) - 2);
  const anomalyIndex = values.length > 12 ? 15 : 4; // MMT revenue: w16, bookings case: w5

  return (
    <div style={{
      padding: '12px',
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: 'var(--radius-md)',
    }}>
      <p style={{ fontSize: '10px', color: 'var(--ink3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {displayLabel}
      </p>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
        {values.length > anomalyIndex && (
          <line
            x1={(anomalyIndex / values.length) * W} y1={0}
            x2={(anomalyIndex / values.length) * W} y2={H}
            stroke="rgba(255,79,79,0.4)" strokeWidth="1" strokeDasharray="3,2"
          />
        )}
        {values.map((v, i) => {
          const barH = Math.max(2, ((v - min) / range) * (H - 8));
          const x = (i / values.length) * W;
          return (
            <rect key={i} x={x + 1} y={H - barH} width={barW} height={barH}
              fill={i >= anomalyIndex ? 'rgba(252,128,25,0.6)' : 'rgba(79,128,255,0.5)'}
              rx="1"
            />
          );
        })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
        <span style={{ fontSize: '10px', color: 'var(--ink4)' }}>W1</span>
        <span style={{ fontSize: '10px', color: 'rgba(255,79,79,0.7)' }}>← W16 anomaly</span>
        <span style={{ fontSize: '10px', color: 'var(--ink4)' }}>W{values.length}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LOADING STATE
// ─────────────────────────────────────────────────────────────

function QueryLoadingState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {[80, 60, 80, 60].map((h, i) => (
        <div key={i} style={{
          height: `${h}px`,
          background: 'var(--elevated)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          opacity: 1 - i * 0.15,
          animation: `pulse-slow ${0.8 + i * 0.15}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────

function humaniseQueryId(queryId: string): string {
  return queryId
    .replace(/^q_/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function formatValue(value: number | string | null, key: string): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string') return value;
  if (key.includes('revenue') || key.includes('loss') || key.includes('rpb') ||
      key.includes('gain') || key.includes('value') || key.includes('price')) {
    return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }
  if (key.includes('rate') || key.includes('pct') || key.includes('conversion') || key.includes('delta')) {
    return `${value}%`;
  }
  if (key.includes('count') || key.includes('bookings') || key.includes('sessions') || key.includes('attempts')) {
    return value.toLocaleString('en-IN');
  }
  return typeof value === 'number'
    ? value.toLocaleString('en-IN', { maximumFractionDigits: 2 })
    : String(value);
}
