// ============================================================
// useSimulation HOOK
// Manages CaseEngine lifecycle + milestone phase state.
// Phase state: teach → investigate → commit per milestone.
// ============================================================

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  AggregatedMetrics,
  CaseConfig,
  MilestonePhaseState,
  SimulationState,
} from '@/types';
import { CaseEngine } from '@/services/simulation/CaseEngine';
import type { EngineResponse } from '@/services/simulation/CaseEngine';
import type { DepthEvaluation } from '@/components/simulator/FindingGate';
import {
  createInitialPhaseState,
  advanceToInvestigate,
  advanceToCommit,
  acceptCommit,
} from '@/services/simulation/stateMachine';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface SimulationHookState {
  simulation: SimulationState | null;
  // Phase state per milestone ID
  phaseStates: Record<string, MilestonePhaseState>;
  aiText: string;
  lastMetrics: AggregatedMetrics | null;
  canAdvance: boolean;
  isThinking: boolean;
  isQueryRunning: boolean;
  isEvaluatingDepth: boolean;
  error: string | null;
  totalTokensUsed: number;
}

export interface UseSimulationReturn {
  state: SimulationHookState;
  // Phase transitions
  handleCheckpointPassed: (milestoneId: string) => void;
  handleRequestCommit: (milestoneId: string) => void;
  handleFindingAccepted: (milestoneId: string, text: string) => void;
  handleEvaluateDepth: (text: string) => Promise<DepthEvaluation>;
  // Investigation actions
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
    phaseStates: {},
    aiText: '',
    lastMetrics: null,
    canAdvance: false,
    isThinking: false,
    isQueryRunning: false,
    isEvaluatingDepth: false,
    error: null,
    totalTokensUsed: 0,
  });

  // ── INIT ENGINE ─────────────────────────────────────────────

  useEffect(() => {
    if (!caseConfig) return;

    const initialPhaseStates: Record<string, MilestonePhaseState> = {};
    for (const milestone of caseConfig.milestones) {
      initialPhaseStates[milestone.id] = createInitialPhaseState();
    }

    const engine = new CaseEngine({
      caseConfig,
      onStateChange: (newSimState) => {
        setState(prev => ({ ...prev, simulation: newSimState }));
      },
    });

    engineRef.current = engine;

    setState(prev => ({
      ...prev,
      simulation: engine.getState(),
      phaseStates: initialPhaseStates,
      error: null,
    }));

    return () => {
      engineRef.current = null;
    };
  }, [caseConfig]);

  // ── PHASE TRANSITIONS ────────────────────────────────────────

  const handleCheckpointPassed = useCallback((milestoneId: string) => {
    setState(prev => ({
      ...prev,
      phaseStates: {
        ...prev.phaseStates,
        [milestoneId]: advanceToInvestigate(
          prev.phaseStates[milestoneId] ?? createInitialPhaseState()
        ),
      },
    }));
  }, []);

  const handleRequestCommit = useCallback((milestoneId: string) => {
    setState(prev => ({
      ...prev,
      phaseStates: {
        ...prev.phaseStates,
        [milestoneId]: advanceToCommit(
          prev.phaseStates[milestoneId] ?? createInitialPhaseState()
        ),
      },
    }));
  }, []);

  const handleFindingAccepted = useCallback(
    (milestoneId: string, text: string) => {
      setState(prev => ({
        ...prev,
        phaseStates: {
          ...prev.phaseStates,
          [milestoneId]: acceptCommit(
            prev.phaseStates[milestoneId] ?? createInitialPhaseState(),
            text
          ),
        },
        canAdvance: true,
      }));
    },
    []
  );

  // ── DEPTH EVALUATION ─────────────────────────────────────────

  const handleEvaluateDepth = useCallback(
    async (text: string): Promise<DepthEvaluation> => {
      if (!engineRef.current) {
        return { isDeep: true, challenge: '' };
      }

      setState(prev => ({ ...prev, isEvaluatingDepth: true }));

      try {
        const result = await engineRef.current.evaluateFindingDepth(text);
        return result;
      } catch {
        return { isDeep: true, challenge: '' };
      } finally {
        setState(prev => ({ ...prev, isEvaluatingDepth: false }));
      }
    },
    []
  );

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
    if (!engineRef.current || !caseConfig) return;

    try {
      const newSimState = engineRef.current.advanceMilestone();
      const nextMilestoneId = newSimState.currentMilestoneId;

      setState(prev => ({
        ...prev,
        simulation: newSimState,
        canAdvance: false,
        lastMetrics: null,
        aiText: '',
        // Ensure next milestone has a phase state
        phaseStates: {
          ...prev.phaseStates,
          [nextMilestoneId]:
            prev.phaseStates[nextMilestoneId] ?? createInitialPhaseState(),
        },
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Cannot advance milestone',
      }));
    }
  }, [caseConfig]);

  // ── RESET ───────────────────────────────────────────────────

  const reset = useCallback(() => {
    if (!engineRef.current || !caseConfig) return;

    const newSimState = engineRef.current.reset();

    const freshPhaseStates: Record<string, MilestonePhaseState> = {};
    for (const milestone of caseConfig.milestones) {
      freshPhaseStates[milestone.id] = createInitialPhaseState();
    }

    setState({
      simulation: newSimState,
      phaseStates: freshPhaseStates,
      aiText: '',
      lastMetrics: null,
      canAdvance: false,
      isThinking: false,
      isQueryRunning: false,
      isEvaluatingDepth: false,
      error: null,
      totalTokensUsed: 0,
    });
  }, [caseConfig]);

  return {
    state,
    handleCheckpointPassed,
    handleRequestCommit,
    handleFindingAccepted,
    handleEvaluateDepth,
    sendMessage,
    runQuery,
    advanceMilestone,
    reset,
  };
}
