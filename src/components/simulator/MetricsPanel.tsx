// ============================================================
// METRICS PANEL
// Right panel — shows DuckDB query results as charts/tables.
// ============================================================

'use client';

import type { AggregatedMetrics } from '@/types';

interface Props {
  metrics: AggregatedMetrics | null;
  isQueryRunning: boolean;
}

export function MetricsPanel({ metrics, isQueryRunning }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <p
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--ink3)',
          }}
        >
          Query Results
        </p>
        {metrics && (
          <span
            style={{
              fontSize: '10px',
              color: 'var(--ink4)',
              fontFamily: 'monospace',
            }}
          >
            {metrics.executionMs}ms
          </span>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
        }}
      >
        {isQueryRunning && <QueryLoadingState />}

        {!isQueryRunning && !metrics && <EmptyState />}

        {!isQueryRunning && metrics && (
          <MetricsDisplay metrics={metrics} />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// METRICS DISPLAY
// ─────────────────────────────────────────────────────────────

function MetricsDisplay({ metrics }: { metrics: AggregatedMetrics }) {
  const entries = Object.entries(metrics.metrics);

  // Separate series data from scalar values
  const scalarEntries = entries.filter(
    ([key, val]) =>
      !key.endsWith('_series') &&
      !key.startsWith('_') &&
      val !== null
  );

  const seriesEntries = entries.filter(([key]) => key.endsWith('_series'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Query ID badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontFamily: 'monospace',
            color: 'var(--blue)',
            background: 'rgba(79,128,255,0.08)',
            border: '1px solid rgba(79,128,255,0.2)',
            padding: '3px 8px',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {metrics.queryId}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--ink3)' }}>
          {metrics.rowCount} rows
        </span>
      </div>

      {/* Scalar KPI cards */}
      {scalarEntries.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
          }}
        >
          {scalarEntries.map(([key, value]) => (
            <KPICard key={key} label={key} value={value} />
          ))}
        </div>
      )}

      {/* Series charts */}
      {seriesEntries.map(([key, value]) => {
        const seriesKey = key.replace('_series', '');
        let parsed: (number | string | null)[] = [];
        try {
          parsed = JSON.parse(String(value));
        } catch {
          return null;
        }

        const numericValues = parsed.filter(
          (v): v is number => typeof v === 'number'
        );

        if (numericValues.length === 0) return null;

        return (
          <MiniChart
            key={key}
            label={seriesKey}
            values={numericValues}
          />
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// KPI CARD
// ─────────────────────────────────────────────────────────────

function KPICard({
  label,
  value,
}: {
  label: string;
  value: number | string | null;
}) {
  const displayLabel = label
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  const isRate = label.includes('rate') || label.includes('pct');
  const isRevenue = label.includes('revenue') || label.includes('rpb') || label.includes('loss');
  const isNegative =
    typeof value === 'number' &&
    (label.includes('loss') || label.includes('decline'));

  const color = isNegative
    ? 'var(--red)'
    : isRevenue
    ? 'var(--green)'
    : isRate
    ? 'var(--blue)'
    : 'var(--ink1)';

  return (
    <div
      style={{
        padding: '12px',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <p
        style={{
          fontSize: '10px',
          color: 'var(--ink3)',
          marginBottom: '6px',
          lineHeight: 1.3,
        }}
      >
        {displayLabel}
      </p>
      <p
        style={{
          fontSize: '16px',
          fontWeight: 700,
          color,
          fontFamily: 'monospace',
        }}
      >
        {formatValue(value, label)}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MINI CHART — Simple SVG bar chart
// ─────────────────────────────────────────────────────────────

function MiniChart({
  label,
  values,
}: {
  label: string;
  values: number[];
}) {
  const displayLabel = label
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const W = 240;
  const H = 60;
  const barW = Math.max(2, (W / values.length) - 2);

  // Detect anomaly at index 15 (week 16)
  const anomalyIndex = 15;

  return (
    <div
      style={{
        padding: '12px',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <p
        style={{
          fontSize: '10px',
          color: 'var(--ink3)',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {displayLabel}
      </p>

      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        style={{ overflow: 'visible' }}
      >
        {/* Anomaly marker line */}
        {values.length > anomalyIndex && (
          <line
            x1={(anomalyIndex / values.length) * W}
            y1={0}
            x2={(anomalyIndex / values.length) * W}
            y2={H}
            stroke="rgba(255,79,79,0.4)"
            strokeWidth="1"
            strokeDasharray="3,2"
          />
        )}

        {/* Bars */}
        {values.map((v, i) => {
          const barH = Math.max(2, ((v - min) / range) * (H - 8));
          const x = (i / values.length) * W;
          const isAnomaly = i >= anomalyIndex;

          return (
            <rect
              key={i}
              x={x + 1}
              y={H - barH}
              width={barW}
              height={barH}
              fill={isAnomaly ? 'rgba(252,128,25,0.6)' : 'rgba(79,128,255,0.5)'}
              rx="1"
            />
          );
        })}
      </svg>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '4px',
        }}
      >
        <span style={{ fontSize: '10px', color: 'var(--ink4)' }}>
          W1
        </span>
        <span
          style={{
            fontSize: '10px',
            color: 'rgba(255,79,79,0.7)',
          }}
        >
          ← W16 anomaly
        </span>
        <span style={{ fontSize: '10px', color: 'var(--ink4)' }}>
          W{values.length}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// EMPTY / LOADING STATES
// ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '200px',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--elevated)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
        }}
      >
        📊
      </div>
      <p style={{ fontSize: '12px', color: 'var(--ink3)', textAlign: 'center' }}>
        Run a query to see data
      </p>
    </div>
  );
}

function QueryLoadingState() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          style={{
            height: '60px',
            background: 'var(--elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            animation: `pulse-slow ${0.8 + i * 0.1}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// VALUE FORMATTER
// ─────────────────────────────────────────────────────────────

function formatValue(
  value: number | string | null,
  key: string
): string {
  if (value === null || value === undefined) return '—';

  if (typeof value === 'string') return value;

  if (key.includes('revenue') || key.includes('loss') ||
      key.includes('rpb') || key.includes('gain') ||
      key.includes('value') || key.includes('price')) {
    return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }

  if (key.includes('rate') || key.includes('pct') ||
      key.includes('conversion') || key.includes('delta')) {
    return `${value}%`;
  }

  if (key.includes('count') || key.includes('bookings') ||
      key.includes('sessions') || key.includes('attempts')) {
    return value.toLocaleString('en-IN');
  }

  return typeof value === 'number'
    ? value.toLocaleString('en-IN', { maximumFractionDigits: 2 })
    : String(value);
}
