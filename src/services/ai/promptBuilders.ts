// ============================================================
// AI SERVICE LAYER — PROMPT SYSTEM ARCHITECTURE
// One builder per MilestoneType. System prompt is a singleton.
// Claude only receives aggregated metrics — never raw rows.
// ============================================================

import type {
  AIPromptPayload,
  AggregatedMetrics,
  CaseConfig,
  ConversationTurn,
  InvestigationBoard,
  MentorPersona,
  MilestoneType,
  StakeholderPersona,
} from '@/types';

// ------------------------------------------------------------
// SYSTEM PROMPT — MENTOR AGENT
// Sent ONCE per session. Cached. Not resent on subsequent turns.
// ------------------------------------------------------------

export function buildMentorSystemPrompt(
  persona: MentorPersona,
  caseConfig: Pick<CaseConfig, 'caseId' | 'company' | 'problemBrief' | 'groundTruth'>
): string {
  return `You are ${persona.name}, ${persona.role} at ${persona.company}.

ROLE
You are a Socratic analytics mentor. You guide users through business investigations using expert reasoning.
You NEVER reveal answers directly. You ask questions that lead users to discover answers themselves.

CASE CONTEXT
Company: ${caseConfig.company}
Problem: ${caseConfig.problemBrief}

YOUR TRAITS
${persona.traits.map((t, i) => `${i + 1}. ${t}`).join('\n')}

RESPONSE RULES
- Keep responses under 150 words
- End EVERY response with exactly ONE question
- When user shows good framing: acknowledge briefly, then deepen
- When user jumps to conclusions: redirect with "What does the data show first?"
- When user identifies a red herring: let them discover it via a follow-up query, don't tell them
- Use plain conversational English — no markdown headers
- Scoring guidance is in structured JSON at the end of your response, inside <score_delta> tags

OUTPUT FORMAT
Plain text response (max 150 words)
<score_delta>{"problemFraming": 0-25, "dataInterpretation": 0-25, "hypothesisQuality": 0-25, "solutionImpact": 0-25, "rationale": "one sentence"}</score_delta>
<board_updates>{"findings": [], "hypotheses": [], "insights": [], "solutions": []}</board_updates>
<mistakes>[]</mistakes>`;
}

// ------------------------------------------------------------
// SYSTEM PROMPT — STAKEHOLDER REVIEW AGENT
// ------------------------------------------------------------

export function buildStakeholderSystemPrompt(persona: StakeholderPersona): string {
  return `You are ${persona.name}, ${persona.role} at MakeMyTrip.

ROLE
You are reviewing an analyst's investigation into the revenue decline.
Your challenge style: ${persona.challengeStyle}.
Your focus areas: ${persona.focusAreas.join(', ')}.

BEHAVIOUR
- Be realistic and demanding, not hostile
- Ask for evidence before accepting conclusions
- Focus on your stated focus areas
- Accept good answers graciously — move to the next challenge
- One challenge per message. Max 100 words.

OUTPUT FORMAT
Challenge text (max 100 words)
<score_delta>{"problemFraming": 0-25, "dataInterpretation": 0-25, "hypothesisQuality": 0-25, "solutionImpact": 0-25, "rationale": "one sentence"}</score_delta>`;
}

// ------------------------------------------------------------
// TURN PAYLOAD BUILDERS
// ------------------------------------------------------------

export function buildProblemScopingPayload(
  userResponse: string,
  metrics: AggregatedMetrics | null,
  board: InvestigationBoard,
  history: ConversationTurn[],
  mistakes: string[]
): string {
  return JSON.stringify({
    milestone: 'problem_scoping',
    task: 'Help user define the problem precisely — what metric, what time window, what business context.',
    data: metrics ? extractTopMetrics(metrics, 6) : null,
    user_said: userResponse,
    board_so_far: { problem: board.problem, findings: board.findings.length },
    recent_turns: pruneHistory(history, 4),
    detected_mistakes: mistakes,
  });
}

export function buildKpiSelectionPayload(
  userResponse: string,
  metrics: AggregatedMetrics | null,
  board: InvestigationBoard,
  history: ConversationTurn[],
  mistakes: string[]
): string {
  return JSON.stringify({
    milestone: 'kpi_selection',
    task: 'Guide user to identify which KPIs are healthy vs degraded. Push them to distinguish leading from lagging indicators.',
    data: metrics ? extractTopMetrics(metrics, 8) : null,
    user_said: userResponse,
    board_so_far: { findings_count: board.findings.length },
    recent_turns: pruneHistory(history, 4),
    detected_mistakes: mistakes,
  });
}

export function buildFunnelDiagnosisPayload(
  userResponse: string,
  metrics: AggregatedMetrics | null,
  board: InvestigationBoard,
  history: ConversationTurn[],
  mistakes: string[]
): string {
  return JSON.stringify({
    milestone: 'funnel_diagnosis',
    task: 'Help user identify the weakest funnel stage and when the drop-off started. Do not confirm root cause yet.',
    data: metrics ? extractTopMetrics(metrics, 8) : null,
    user_said: userResponse,
    board_so_far: {
      findings: board.findings.map(f => f.text),
      hypotheses: board.hypotheses.map(h => h.text),
    },
    recent_turns: pruneHistory(history, 6),
    detected_mistakes: mistakes,
  });
}

export function buildRootCausePayload(
  userResponse: string,
  metrics: AggregatedMetrics | null,
  board: InvestigationBoard,
  history: ConversationTurn[],
  mistakes: string[]
): string {
  return JSON.stringify({
    milestone: 'root_cause',
    task: 'User is narrowing down root cause. Challenge weak hypotheses. Guide them to run the pricing anomaly query if they have not. Do not confirm the bug directly.',
    data: metrics ? extractTopMetrics(metrics, 10) : null,
    user_said: userResponse,
    board_so_far: {
      hypotheses: board.hypotheses.map(h => ({ text: h.text, status: h.status })),
      insights: board.insights.map(i => i.text),
    },
    recent_turns: pruneHistory(history, 6),
    detected_mistakes: mistakes,
  });
}

export function buildImpactSizingPayload(
  userResponse: string,
  metrics: AggregatedMetrics | null,
  board: InvestigationBoard,
  history: ConversationTurn[],
  mistakes: string[]
): string {
  return JSON.stringify({
    milestone: 'impact_sizing',
    task: 'Push user to quantify revenue impact precisely. Ask them to state assumptions. Challenge vague estimates.',
    data: metrics ? extractTopMetrics(metrics, 8) : null,
    user_said: userResponse,
    board_so_far: { insights: board.insights.map(i => i.text) },
    recent_turns: pruneHistory(history, 4),
    detected_mistakes: mistakes,
  });
}

export function buildSolutionDesignPayload(
  userResponse: string,
  board: InvestigationBoard,
  history: ConversationTurn[],
  mistakes: string[]
): string {
  return JSON.stringify({
    milestone: 'solution_design',
    task: 'Evaluate solution quality. Push for: success metric, rollback plan, and trade-off acknowledgement.',
    data: null,
    user_said: userResponse,
    board_so_far: {
      root_cause: board.insights.find(i => i.milestoneId === 'm4_root_cause')?.text ?? null,
      solutions: board.solutions.map(s => ({ text: s.text, impact: s.estimatedImpact })),
    },
    recent_turns: pruneHistory(history, 6),
    detected_mistakes: mistakes,
  });
}

export function buildStakeholderReviewPayload(
  userResponse: string,
  board: InvestigationBoard,
  persona: StakeholderPersona,
  history: ConversationTurn[]
): string {
  return JSON.stringify({
    milestone: 'stakeholder_review',
    stakeholder: { name: persona.name, role: persona.role, style: persona.challengeStyle },
    investigation_summary: {
      problem: board.problem,
      key_findings: board.findings.slice(0, 5).map(f => f.text),
      root_cause: board.insights.find(i => i.milestoneId === 'm4_root_cause')?.text ?? 'Not stated',
      solutions: board.solutions.map(s => s.text),
    },
    user_said: userResponse,
    recent_turns: pruneHistory(history, 4),
  });
}

// ------------------------------------------------------------
// PAYLOAD ROUTER
// ------------------------------------------------------------

export function buildTurnPayload(payload: AIPromptPayload): string {
  const { milestoneType, aggregatedMetrics, userResponse, investigationBoard, conversationHistory, detectedMistakes } = payload;

  switch (milestoneType) {
    case 'problem_scoping':
      return buildProblemScopingPayload(userResponse, aggregatedMetrics ?? null, investigationBoard, conversationHistory, detectedMistakes);
    case 'kpi_selection':
      return buildKpiSelectionPayload(userResponse, aggregatedMetrics ?? null, investigationBoard, conversationHistory, detectedMistakes);
    case 'funnel_diagnosis':
      return buildFunnelDiagnosisPayload(userResponse, aggregatedMetrics ?? null, investigationBoard, conversationHistory, detectedMistakes);
    case 'root_cause':
      return buildRootCausePayload(userResponse, aggregatedMetrics ?? null, investigationBoard, conversationHistory, detectedMistakes);
    case 'impact_sizing':
      return buildImpactSizingPayload(userResponse, aggregatedMetrics ?? null, investigationBoard, conversationHistory, detectedMistakes);
    case 'solution_design':
      return buildSolutionDesignPayload(userResponse, investigationBoard, conversationHistory, detectedMistakes);
    case 'stakeholder_review':
      throw new Error('Use buildStakeholderReviewPayload directly with a StakeholderPersona.');
    default:
      throw new Error(`Unknown milestone type: ${milestoneType}`);
  }
}

// ------------------------------------------------------------
// UTILITIES
// ------------------------------------------------------------

function extractTopMetrics(metrics: AggregatedMetrics, limit: number): Record<string, number | string | null> {
  return Object.fromEntries(Object.entries(metrics.metrics).slice(0, limit));
}

function pruneHistory(history: ConversationTurn[], keep: number): { role: string; content: string }[] {
  return history.slice(-keep).map(t => ({ role: t.role, content: t.content }));
}

// ------------------------------------------------------------
// AI RESPONSE PARSER
// ------------------------------------------------------------

export interface ParsedAIResponse {
  text: string;
  scoreDelta: Record<string, number> | null;
  boardUpdates: Record<string, unknown[]> | null;
  mistakes: string[];
}

export function parseAIResponse(raw: string): ParsedAIResponse {
  const extract = (tag: string): string | null => {
    const match = raw.match(new RegExp(`<${tag}>(.*?)<\\/${tag}>`, 's'));
    return match ? match[1].trim() : null;
  };

  const text = raw
    .replace(/<score_delta>.*?<\/score_delta>/s, '')
    .replace(/<board_updates>.*?<\/board_updates>/s, '')
    .replace(/<mistakes>.*?<\/mistakes>/s, '')
    .trim();

  let scoreDelta = null;
  let boardUpdates = null;
  let mistakes: string[] = [];

  try { const sd = extract('score_delta'); if (sd) scoreDelta = JSON.parse(sd); } catch {}
  try { const bu = extract('board_updates'); if (bu) boardUpdates = JSON.parse(bu); } catch {}
  try { const m = extract('mistakes'); if (m) mistakes = JSON.parse(m); } catch {}

  return { text, scoreDelta, boardUpdates, mistakes };
}
