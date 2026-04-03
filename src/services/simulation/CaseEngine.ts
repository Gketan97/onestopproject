// ============================================================
// CASE ENGINE
// Orchestrates state machine + AI client + DuckDB query runner.
// Single entry point for all simulation interactions.
// ============================================================

import type {
  AggregatedMetrics,
  CaseConfig,
  InvestigationBoard,
  ScoreDelta,
  SimulationEvent,
  SimulationState,
} from '@/types';

import {
  simulationReducer,
  applyBoardUpdates,
  applyScoreDelta,
  appendConversationTurn,
  canAdvanceMilestone,
  createInitialSimulationState,
} from './stateMachine';

import { AIClient } from '@/services/ai/AIClient';
import { QueryRunner } from '@/services/analytics/QueryRunner';
import { MistakeDetector } from './MistakeDetector';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface EngineResponse {
  state: SimulationState;
  aiText: string;
  metricsUsed: AggregatedMetrics | null;
  canAdvance: boolean;
  tokensUsed: number;
}

export interface CaseEngineConfig {
  caseConfig: CaseConfig;
  onStateChange?: (state: SimulationState) => void;
}

// ─────────────────────────────────────────────────────────────
// CASE ENGINE CLASS
// ─────────────────────────────────────────────────────────────

export class CaseEngine {
  private caseConfig: CaseConfig;
  private state: SimulationState;
  private aiClient: AIClient;
  private queryRunner: QueryRunner;
  private mistakeDetector: MistakeDetector;
  private onStateChange?: (state: SimulationState) => void;
  private lastMetrics: AggregatedMetrics | null = null;

  constructor(config: CaseEngineConfig) {
    this.caseConfig = config.caseConfig;
    this.onStateChange = config.onStateChange;
    this.state = createInitialSimulationState(config.caseConfig);
    this.aiClient = new AIClient({ caseConfig: config.caseConfig });
    this.queryRunner = new QueryRunner(config.caseConfig);
    this.mistakeDetector = new MistakeDetector();
  }

  // ── GETTERS ─────────────────────────────────────────────────

  getState(): SimulationState {
    return this.state;
  }

  getCurrentMilestone() {
    return this.caseConfig.milestones.find(
      m => m.id === this.state.currentMilestoneId
    ) ?? null;
  }

  // ── USER RESPONSE ───────────────────────────────────────────

  async handleUserResponse(userText: string): Promise<EngineResponse> {
    this.dispatch({ type: 'USER_RESPONSE', content: userText });
    this.state = appendConversationTurn(this.state, 'user', userText);

    const milestone = this.getCurrentMilestone();
    if (!milestone) throw new Error('No active milestone');

    const mistakes = this.mistakeDetector.detect(
      this.state.board,
      this.lastMetrics
    );

    const milestoneConversation = this.state.conversation.filter(
      t => t.milestoneId === this.state.currentMilestoneId
    );

    const aiPayload = {
      agentMode: 'mentor' as const,
      milestoneType: milestone.type,
      milestoneTitle: milestone.title,
      caseContext: {
        caseId: this.caseConfig.caseId,
        company: this.caseConfig.company,
        problemBrief: this.caseConfig.problemBrief,
        currentMilestone: milestone.title,
        investigationPath: this.state.investigationPath,
      },
      aggregatedMetrics: this.lastMetrics ?? undefined,
      userResponse: userText,
      conversationHistory: milestoneConversation,
      investigationBoard: this.state.board,
      detectedMistakes: mistakes,
      scoreSoFar: this.state.milestoneStates[this.state.currentMilestoneId]?.score ?? 0,
    };

    const result = milestone.type === 'stakeholder_review'
      ? await this.aiClient.stakeholderTurn(
          aiPayload,
          this.caseConfig.stakeholderPersonas[0].id
        )
      : await this.aiClient.mentorTurn(aiPayload);

    // Apply score delta
    if (result.parsed.scoreDelta) {
      const delta = result.parsed.scoreDelta;
      const scoreDelta: ScoreDelta = {
        problemFraming:     delta.problemFraming     ?? 0,
        dataInterpretation: delta.dataInterpretation ?? 0,
        hypothesisQuality:  delta.hypothesisQuality  ?? 0,
        solutionImpact:     delta.solutionImpact     ?? 0,
        total:
          (delta.problemFraming     ?? 0) +
          (delta.dataInterpretation ?? 0) +
          (delta.hypothesisQuality  ?? 0) +
          (delta.solutionImpact     ?? 0),
        rationale: String(delta.rationale ?? ''),
      };
      this.state = applyScoreDelta(this.state, scoreDelta);
    }

    // Apply board updates
    if (result.parsed.boardUpdates) {
      const updatedBoard = applyBoardUpdates(
        this.state.board,
        result.parsed.boardUpdates as Partial<InvestigationBoard>,
        this.state.currentMilestoneId
      );
      this.state = { ...this.state, board: updatedBoard };
    }

    // Record AI turn
    this.state = appendConversationTurn(
      this.state,
      'assistant',
      result.parsed.text
    );

    this.onStateChange?.(this.state);

    return {
      state: this.state,
      aiText: result.parsed.text,
      metricsUsed: this.lastMetrics,
      canAdvance: canAdvanceMilestone(this.state, this.caseConfig),
      tokensUsed: result.tokensUsed,
    };
  }

  // ── RUN QUERY ───────────────────────────────────────────────

  async runQuery(queryId: string): Promise<AggregatedMetrics> {
    const milestone = this.getCurrentMilestone();
    if (!milestone) throw new Error('No active milestone');

    if (!milestone.availableQueries.includes(queryId)) {
      throw new Error(`Query ${queryId} not available for ${milestone.id}`);
    }

    const metrics = await this.queryRunner.run(queryId, milestone.id);
    this.lastMetrics = metrics;

    this.dispatch({ type: 'QUERY_EXECUTED', metrics });
    this.onStateChange?.(this.state);

    return metrics;
  }

  // ── ADVANCE MILESTONE ────────────────────────────────────────

  advanceMilestone(): SimulationState {
    if (!canAdvanceMilestone(this.state, this.caseConfig)) {
      throw new Error('Exit conditions not met for current milestone');
    }

    this.lastMetrics = null;
    this.dispatch({
      type: 'ADVANCE_MILESTONE',
      milestoneId: this.state.currentMilestoneId,
    });

    this.onStateChange?.(this.state);
    return this.state;
  }

  // ── RESET ───────────────────────────────────────────────────

  reset(): SimulationState {
    this.state = createInitialSimulationState(this.caseConfig);
    this.lastMetrics = null;
    this.onStateChange?.(this.state);
    return this.state;
  }

  // ── PRIVATE ─────────────────────────────────────────────────

  private dispatch(event: SimulationEvent): void {
    this.state = simulationReducer(this.state, event);
  }
}
