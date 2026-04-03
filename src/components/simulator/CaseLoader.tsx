// ============================================================
// CASE LOADER
// Fetches and validates case_config.json at runtime.
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import type { CaseConfig } from '@/types';

interface Props {
  caseId: string;
  onLoaded: (config: CaseConfig) => void;
  onError: (error: string) => void;
}

export function CaseLoader({ caseId, onLoaded, onError }: Props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(
          `/cases/${caseId}/config/case_config.json`
        );
        if (!response.ok) {
          throw new Error(`Failed to load case config: ${response.statusText}`);
        }
        const config: CaseConfig = await response.json();
        onLoaded(config);
      } catch (err) {
        onError(
          err instanceof Error ? err.message : 'Failed to load case'
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [caseId, onLoaded, onError]);

  if (!loading) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          border: '2px solid var(--border)',
          borderTop: '2px solid var(--orange)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <p style={{ fontSize: '13px', color: 'var(--ink3)' }}>
        Loading case...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
