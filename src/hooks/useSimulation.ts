// ============================================================
// useSimulation HOOK
// React interface to CaseEngine.
// Manages engine lifecycle, exposes actions to UI.
// ============================================================

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { AggregatedMetrics, CaseConfig, SimulationState } from '@/types';
import { CaseEngine } from '@/services/simulation/CaseEngine';
import type { EngineResponse } from '@/services/simulation/CaseEngine';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface SimulationHookState {
  simulation: SimulationState | null;
  aiText: string;
  lastMetrics: AggregatedMetrics | null;
  canAdvance: boolean;
  isThinking: boolean;
  isQueryRunning: boolean;
  error: string | null;
  totalTokensUsed: number;
}

export interface UseSimulationReturn {
  state: SimulationHookState;
  sendMessage: (text: string) => Promise<void>;
  runQuery: (queryId: string) => Promise<AggregatedMetrics | null>;
  advanceMilestone: () => void;
  reset: () => void;
}

// ─────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────

export function useSimulation(
  caseConfig: CaseConfig | null
): UseSimulationReturn {
  const engineRef = useRef<CaseEngine | null>(null);

  const [state, setState] = useState<SimulationHookState>({
    simulation: null,
    aiText: '',
    lastMetrics: null,
    canAdvance: false,
    isThinking: false,
    isQueryRunning: false,
    error: null,
    totalTokensUsed: 0,
  });

  // ── INIT ENGINE ─────────────────────────────────────────────

  useEffect(() => {
    if (!caseConfig) return;

    const engine = new CaseEngine({
      caseConfig,
      onStateChange: (newState) => {
        setState(prev => ({ ...prev, simulation: newState }));
      },
    });

    engineRef.current = engine;

    setState(prev => ({
      ...prev,
      simulation: engine.getState(),
      error: null,
    }));

    return () => {
      engineRef.current = null;
    };
  }, [caseConfig]);

  // ── SEND MESSAGE ────────────────────────────────────────────

  const sendMessage = useCallback(async (text: string) => {
    if (!engineRef.current) return;

    setState(prev => ({ ...prev, isThinking: true, error: null }));

    try {
      const result: EngineResponse =
        await engineRef.current.handleUserResponse(text);

      setState(prev => ({
        ...prev,
        simulation: result.state,
        aiText: result.aiText,
        lastMetrics: result.metricsUsed,
        canAdvance: result.canAdvance,
        isThinking: false,
        totalTokensUsed: prev.totalTokensUsed + result.tokensUsed,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        isThinking: false,
        error: err instanceof Error ? err.message : 'AI call failed',
      }));
    }
  }, []);

  // ── RUN QUERY ───────────────────────────────────────────────

  const runQuery = useCallback(
    async (queryId: string): Promise<AggregatedMetrics | null> => {
      if (!engineRef.current) return null;

      setState(prev => ({ ...prev, isQueryRunning: true, error: null }));

      try {
        const metrics = await engineRef.current.runQuery(queryId);

        setState(prev => ({
          ...prev,
          isQueryRunning: false,
          lastMetrics: metrics,
          simulation: engineRef.current?.getState() ?? prev.simulation,
        }));

        return metrics;
      } catch (err) {
        setState(prev => ({
          ...prev,
          isQueryRunning: false,
          error: err instanceof Error ? err.message : 'Query failed',
        }));
        return null;
      }
    },
    []
  );

  // ── ADVANCE MILESTONE ────────────────────────────────────────

  const advanceMilestone = useCallback(() => {
    if (!engineRef.current) return;

    try {
      const newState = engineRef.current.advanceMilestone();
      setState(prev => ({
        ...prev,
        simulation: newState,
        canAdvance: false,
        lastMetrics: null,
        aiText: '',
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Cannot advance milestone',
      }));
    }
  }, []);

  // ── RESET ───────────────────────────────────────────────────

  const reset = useCallback(() => {
    if (!engineRef.current) return;
    const newState = engineRef.current.reset();
    setState({
      simulation: newState,
      aiText: '',
      lastMetrics: null,
      canAdvance: false,
      isThinking: false,
      isQueryRunning: false,
      error: null,
      totalTokensUsed: 0,
    });
  }, []);

  return { state, sendMessage, runQuery, advanceMilestone, reset };
}
