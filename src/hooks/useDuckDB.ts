// ============================================================
// useDuckDB HOOK
// Manages DuckDB engine lifecycle and query execution.
// Handles initialization, loading states, and errors.
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import type { AggregatedMetrics, CaseConfig } from '@/types';
import { getDuckDBEngine } from '@/services/analytics/DuckDBEngine';
import { QueryRunner } from '@/services/analytics/QueryRunner';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface DuckDBHookState {
  initialized: boolean;
  loading: boolean;
  error: string | null;
  tablesLoaded: string[];
}

export interface QueryState {
  data: AggregatedMetrics | null;
  loading: boolean;
  error: string | null;
}

export interface UseDuckDBReturn {
  state: DuckDBHookState;
  runQuery: (queryId: string, milestoneId: string) => Promise<AggregatedMetrics | null>;
  queryStates: Record<string, QueryState>;
  isQueryLoading: (queryId: string) => boolean;
  lastResult: AggregatedMetrics | null;
}

// ─────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────

export function useDuckDB(caseConfig: CaseConfig | null): UseDuckDBReturn {
  const [state, setState] = useState<DuckDBHookState>({
    initialized: false,
    loading: false,
    error: null,
    tablesLoaded: [],
  });

  const [queryStates, setQueryStates] = useState<Record<string, QueryState>>({});
  const [lastResult, setLastResult] = useState<AggregatedMetrics | null>(null);

  const runnerRef = useRef<QueryRunner | null>(null);

  // ── INITIALIZE ENGINE ────────────────────────────────────────

  useEffect(() => {
    if (!caseConfig) return;

    let cancelled = false;

    async function init() {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const engine = getDuckDBEngine();

        if (!engine.getState().initialized) {
          await engine.initialize();
        }

        if (caseConfig) runnerRef.current = new QueryRunner(caseConfig);

        if (!cancelled) {
          setState({
            initialized: true,
            loading: false,
            error: null,
            tablesLoaded: engine.getState().tablesLoaded,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : 'DuckDB initialization failed',
          }));
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [caseConfig]);

  // ── RUN QUERY ───────────────────────────────────────────────

  const runQuery = useCallback(
    async (queryId: string, milestoneId: string): Promise<AggregatedMetrics | null> => {
      if (!runnerRef.current) {
        console.error('QueryRunner not initialized');
        return null;
      }

      if (!runnerRef.current.isQueryAvailable(queryId, milestoneId)) {
        console.error(`Query ${queryId} not available for milestone ${milestoneId}`);
        return null;
      }

      // Set query loading state
      setQueryStates(prev => ({
        ...prev,
        [queryId]: { data: null, loading: true, error: null },
      }));

      try {
        const result = await runnerRef.current.run(queryId, milestoneId);

        setQueryStates(prev => ({
          ...prev,
          [queryId]: { data: result, loading: false, error: null },
        }));

        setLastResult(result);

        // Sync loaded tables
        setState(prev => ({
          ...prev,
          tablesLoaded: getDuckDBEngine().getState().tablesLoaded,
        }));

        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Query failed';

        setQueryStates(prev => ({
          ...prev,
          [queryId]: { data: null, loading: false, error: message },
        }));

        return null;
      }
    },
    []
  );

  // ── HELPERS ─────────────────────────────────────────────────

  const isQueryLoading = useCallback(
    (queryId: string): boolean => {
      return queryStates[queryId]?.loading ?? false;
    },
    [queryStates]
  );

  return {
    state,
    runQuery,
    queryStates,
    isQueryLoading,
    lastResult,
  };
}
