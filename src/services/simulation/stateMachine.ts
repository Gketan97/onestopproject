// ============================================================
// SIMULATION STATE MACHINE
// Pure function reducer — no side effects. UI-agnostic.
// Drives milestone progression, scoring, board updates.
// ============================================================

import type {
  AggregatedMetrics,
  AnalystSkillProfile,
  CaseConfig,
  ConversationTurn,
  InvestigationBoard,
  MilestoneState,
  ScoreDelta,
  SimulationEvent,
  SimulationState,
} from '@/types';

// ------------------------------------------------------------
// INITIAL STATE FACTORY
// ------------------------------------------------------------

export function createInitialSimulationState(config: CaseConfig): SimulationState {
  const milestoneStates: Record<string, MilestoneState> = {};

  for (const m of config.milestones) {
    milestoneStates[m.id] = {
      milestoneId: m.id,
      status: m.order === 1 ? 'active' : 'pending',
      turns: 0,
      score: 0,
      scoreDelta: null,
      queriesRun: [],
      startedAt: m.order === 1 ? Date.now() : null,
      completedAt: null,
    };
  }

  return {
    caseId: config.caseId,
    status: 'active',
    currentMilestoneId: config.milestones[0].id,
    milestoneStates,
    investigationPath: config.investigationPaths[0],
    board: createEmptyBoard(config.caseId),
    profile: createEmptyProfile(),
    conversation: [],
    startedAt: Date.now(),
    completedAt: null,
  };
}

function createEmptyBoard(caseId: string): InvestigationBoard {
  return {
    caseId,
    problem: '',
    findings: [],
    hypotheses: [],
    insights: [],
    solutions: [],
    lastUpdated: Date.now(),
  };
}

function createEmptyProfile(): AnalystSkillProfile {
  return {
    userId: 'local',
    totalScore: 0,
    casesCompleted: [],
    skills: [],
    scorecard: {
      problemFraming: 0,
      dataInterpretation: 0,
      hypothesisQuality: 0,
      solutionImpact: 0,
    },
    lastUpdated: Date.now(),
  };
}

// ------------------------------------------------------------
// STATE MACHINE REDUCER
// ------------------------------------------------------------

export function simulationReducer(
  state: SimulationState,
  event: SimulationEvent
): SimulationState {
  switch (event.type) {

    case 'USER_RESPONSE': {
      const current = state.milestoneStates[state.currentMilestoneId];
      return {
        ...state,
        milestoneStates: {
          ...state.milestoneStates,
          [state.currentMilestoneId]: {
            ...current,
            turns: current.turns + 1,
          },
        },
      };
    }

    case 'QUERY_EXECUTED': {
      const current = state.milestoneStates[state.currentMilestoneId];
      const alreadyRun = current.queriesRun.includes(event.metrics.queryId);
      if (alreadyRun) return state;
      return {
        ...state,
        milestoneStates: {
          ...state.milestoneStates,
          [state.currentMilestoneId]: {
            ...current,
            queriesRun: [...current.queriesRun, event.metrics.queryId],
          },
        },
      };
    }

    case 'ADVANCE_MILESTONE': {
      const milestoneIds = getMilestoneIds(state);
      const currentIndex = milestoneIds.findIndex(id => id === state.currentMilestoneId);
      const nextMilestoneId = milestoneIds[currentIndex + 1] ?? null;

      const updatedStates = { ...state.milestoneStates };

      updatedStates[state.currentMilestoneId] = {
        ...updatedStates[state.currentMilestoneId],
        status: 'completed',
        completedAt: Date.now(),
      };

      if (nextMilestoneId) {
        updatedStates[nextMilestoneId] = {
          ...updatedStates[nextMilestoneId],
          status: 'active',
          startedAt: Date.now(),
        };
      }

      const isLastMilestone = nextMilestoneId === null;

      return {
        ...state,
        status: isLastMilestone ? 'completed' : 'active',
        currentMilestoneId: nextMilestoneId ?? state.currentMilestoneId,
        milestoneStates: updatedStates,
        completedAt: isLastMilestone ? Date.now() : null,
      };
    }

    case 'COMPLETE_CASE': {
      return {
        ...state,
        status: 'completed',
        completedAt: Date.now(),
      };
    }

    case 'RESET': {
      return {
        ...state,
        status: 'active',
        currentMilestoneId: getMilestoneIds(state)[0],
        board: createEmptyBoard(state.caseId),
        conversation: [],
        completedAt: null,
      };
    }

    default:
      return state;
  }
}

// ------------------------------------------------------------
// BOARD UPDATER
// ------------------------------------------------------------

export function applyBoardUpdates(
  board: InvestigationBoard,
  updates: Partial<InvestigationBoard>,
  milestoneId: string
): InvestigationBoard {
  const now = Date.now();
  const uid = () => `${now}_${Math.random().toString(36).slice(2, 6)}`;

  return {
    ...board,
    problem: updates.problem ?? board.problem,
    findings: [
      ...board.findings,
      ...(updates.findings ?? []).map(f => ({
        ...f,
        id: `f_${uid()}`,
        milestoneId,
        createdAt: now,
      })),
    ],
    hypotheses: [
      ...board.hypotheses,
      ...(updates.hypotheses ?? []).map(h => ({
        ...h,
        id: `h_${uid()}`,
        milestoneId,
        createdAt: now,
      })),
    ],
    insights: [
      ...board.insights,
      ...(updates.insights ?? []).map(i => ({
        ...i,
        id: `i_${uid()}`,
        milestoneId,
        createdAt: now,
      })),
    ],
    solutions: [
      ...board.solutions,
      ...(updates.solutions ?? []).map(s => ({
        ...s,
        id: `s_${uid()}`,
        milestoneId,
        createdAt: now,
      })),
    ],
    lastUpdated: now,
  };
}

// ------------------------------------------------------------
// SCORE UPDATER
// ------------------------------------------------------------

export function applyScoreDelta(
  state: SimulationState,
  delta: ScoreDelta
): SimulationState {
  const current = state.milestoneStates[state.currentMilestoneId];
  const newScore = Math.min(100, current.score + delta.total);

  return {
    ...state,
    milestoneStates: {
      ...state.milestoneStates,
      [state.currentMilestoneId]: {
        ...current,
        score: newScore,
        scoreDelta: delta,
      },
    },
    profile: {
      ...state.profile,
      totalScore: state.profile.totalScore + delta.total,
      scorecard: {
        problemFraming: state.profile.scorecard.problemFraming + delta.problemFraming,
        dataInterpretation: state.profile.scorecard.dataInterpretation + delta.dataInterpretation,
        hypothesisQuality: state.profile.scorecard.hypothesisQuality + delta.hypothesisQuality,
        solutionImpact: state.profile.scorecard.solutionImpact + delta.solutionImpact,
      },
      lastUpdated: Date.now(),
    },
  };
}

// ------------------------------------------------------------
// EXIT CONDITION CHECKER
// ------------------------------------------------------------

export function canAdvanceMilestone(
  state: SimulationState,
  config: CaseConfig
): boolean {
  const milestoneConfig = config.milestones.find(m => m.id === state.currentMilestoneId);
  if (!milestoneConfig) return false;

  const milestoneState = state.milestoneStates[state.currentMilestoneId];
  const { exitCondition } = milestoneConfig;

  if (milestoneState.score < exitCondition.minScore) return false;

  for (const field of exitCondition.requiredFields) {
    const boardField = state.board[field as keyof InvestigationBoard];
    if (!boardField) return false;
    if (Array.isArray(boardField) && boardField.length === 0) return false;
    if (typeof boardField === 'string' && boardField.trim() === '') return false;
  }

  return true;
}

// ------------------------------------------------------------
// CONVERSATION HELPERS
// ------------------------------------------------------------

export function appendConversationTurn(
  state: SimulationState,
  role: 'user' | 'assistant',
  content: string
): SimulationState {
  const turn: ConversationTurn = {
    role,
    content,
    milestoneId: state.currentMilestoneId,
    timestamp: Date.now(),
  };
  return {
    ...state,
    conversation: [...state.conversation, turn],
  };
}

export function getCurrentMilestoneConversation(state: SimulationState): ConversationTurn[] {
  return state.conversation.filter(t => t.milestoneId === state.currentMilestoneId);
}

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------

function getMilestoneIds(state: SimulationState): string[] {
  return Object.keys(state.milestoneStates);
}

// ------------------------------------------------------------
// MILESTONE PHASE TRACKING
// Tracks teach → investigate → commit phase per milestone.
// Stored outside SimulationState to keep reducer pure.
// Managed by CaseEngine, persisted in useSimulation hook.
// ------------------------------------------------------------

import type { MilestonePhase, MilestonePhaseState } from '@/types';

export function createInitialPhaseState(): MilestonePhaseState {
  return {
    phase: 'teach',
    checkpointPassed: false,
    commitText: '',
    commitAccepted: false,
    depthChallengeShown: false,
  };
}

export function advanceToInvestigate(
  state: MilestonePhaseState
): MilestonePhaseState {
  return {
    ...state,
    phase: 'investigate',
    checkpointPassed: true,
  };
}

export function advanceToCommit(
  state: MilestonePhaseState
): MilestonePhaseState {
  return {
    ...state,
    phase: 'commit',
  };
}

export function acceptCommit(
  state: MilestonePhaseState,
  text: string
): MilestonePhaseState {
  return {
    ...state,
    commitText: text,
    commitAccepted: true,
    depthChallengeShown: false,
  };
}

export function markDepthChallengeShown(
  state: MilestonePhaseState
): MilestonePhaseState {
  return {
    ...state,
    depthChallengeShown: true,
  };
}
