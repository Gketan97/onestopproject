// ============================================================
// DUCKDB LOADER COMPONENT
// Shown while DuckDB WASM initializes (~2-4s on first load).
// Gives users context so they don't think the app is broken.
// ============================================================

'use client';

import { useEffect, useState } from 'react';

interface Props {
  initialized: boolean;
  loading: boolean;
  error: string | null;
  tablesLoaded: string[];
  totalTables: number;
}

const LOADING_MESSAGES = [
  'Initializing analytics engine...',
  'Loading DuckDB WASM...',
  'Preparing case dataset...',
  'Almost ready...',
];

export function DuckDBLoader({
  initialized,
  loading,
  error,
  tablesLoaded,
  totalTables,
}: Props) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setMessageIndex(prev =>
        prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 1200);
    return () => clearInterval(interval);
  }, [loading]);

  if (initialized && !error) return null;

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '32px',
          background: 'rgba(255, 79, 79, 0.06)',
          border: '1px solid rgba(255, 79, 79, 0.2)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <p style={{ color: 'var(--red)', fontSize: '13px', fontWeight: 500 }}>
          Analytics engine failed to load
        </p>
        <p style={{ color: 'var(--ink3)', fontSize: '12px' }}>{error}</p>
      </div>
    );
  }

  const progress = totalTables > 0
    ? Math.round((tablesLoaded.length / totalTables) * 100)
    : 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '40px',
      }}
    >
      {/* Spinner */}
      <div
        style={{
          width: '32px',
          height: '32px',
          border: '2px solid var(--border)',
          borderTop: '2px solid var(--blue)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />

      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            color: 'var(--ink2)',
            fontSize: '13px',
            fontWeight: 500,
            marginBottom: '4px',
          }}
        >
          {LOADING_MESSAGES[messageIndex]}
        </p>

        {tablesLoaded.length > 0 && (
          <p style={{ color: 'var(--ink3)', fontSize: '11px' }}>
            {tablesLoaded.length} of {totalTables} tables loaded
          </p>
        )}
      </div>

      {/* Progress bar */}
      {totalTables > 0 && (
        <div
          style={{
            width: '200px',
            height: '3px',
            background: 'var(--border)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'var(--blue)',
              borderRadius: '2px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
