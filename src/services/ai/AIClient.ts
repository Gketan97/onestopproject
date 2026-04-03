// ============================================================
// AI CLIENT
// Calls Netlify proxy → Claude API.
// System prompt sent once per session via sessionStorage cache.
// ============================================================

import type { AIPromptPayload, CaseConfig } from '@/types';
import {
  buildMentorSystemPrompt,
  buildStakeholderSystemPrompt,
  buildTurnPayload,
  buildStakeholderReviewPayload,
  parseAIResponse,
} from './promptBuilders';
import type { ParsedAIResponse } from './promptBuilders';

const PROXY_URL = '/api/ai';
const MAX_TOKENS = 1000;

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface AIClientConfig {
  caseConfig: CaseConfig;
}

export interface AICallResult {
  parsed: ParsedAIResponse;
  raw: string;
  tokensUsed: number;
}

// ─────────────────────────────────────────────────────────────
// CLIENT CLASS
// ─────────────────────────────────────────────────────────────

export class AIClient {
  private caseConfig: CaseConfig;
  private mentorSystemPrompt: string;
  private stakeholderSystemPrompts: Record<string, string> = {};

  constructor(config: AIClientConfig) {
    this.caseConfig = config.caseConfig;

    // Build mentor system prompt once
    this.mentorSystemPrompt = buildMentorSystemPrompt(
      config.caseConfig.mentorPersona,
      {
        caseId: config.caseConfig.caseId,
        company: config.caseConfig.company,
        problemBrief: config.caseConfig.problemBrief,
        groundTruth: config.caseConfig.groundTruth,
      }
    );

    // Build stakeholder system prompts once
    for (const persona of config.caseConfig.stakeholderPersonas) {
      this.stakeholderSystemPrompts[persona.id] =
        buildStakeholderSystemPrompt(persona);
    }
  }

  // ── MENTOR TURN ─────────────────────────────────────────────

  async mentorTurn(payload: AIPromptPayload): Promise<AICallResult> {
    const userMessage = buildTurnPayload(payload);

    const messages = [
      ...payload.conversationHistory
        .slice(-6)
        .map(t => ({ role: t.role, content: t.content })),
      { role: 'user' as const, content: userMessage },
    ];

    return this.call(this.mentorSystemPrompt, messages);
  }

  // ── STAKEHOLDER TURN ────────────────────────────────────────

  async stakeholderTurn(
    payload: AIPromptPayload,
    personaId: string
  ): Promise<AICallResult> {
    const persona = this.caseConfig.stakeholderPersonas.find(
      p => p.id === personaId
    );
    if (!persona) throw new Error(`Unknown stakeholder persona: ${personaId}`);

    const systemPrompt = this.stakeholderSystemPrompts[personaId];
    const userMessage = buildStakeholderReviewPayload(
      payload.userResponse,
      payload.investigationBoard,
      persona,
      payload.conversationHistory
    );

    const messages = [
      ...payload.conversationHistory
        .slice(-4)
        .map(t => ({ role: t.role, content: t.content })),
      { role: 'user' as const, content: userMessage },
    ];

    return this.call(systemPrompt, messages);
  }

  // ── CORE CALL ───────────────────────────────────────────────

  private async call(
    systemPrompt: string,
    messages: { role: 'user' | 'assistant'; content: string }[]
  ): Promise<AICallResult> {
    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemPrompt,
        messages,
        maxTokens: MAX_TOKENS,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`AI proxy error ${response.status}: ${error}`);
    }

    const data = await response.json();

    const raw: string =
      data.content?.[0]?.text ?? '';

    const tokensUsed: number =
      (data.usage?.input_tokens ?? 0) + (data.usage?.output_tokens ?? 0);

    const parsed = parseAIResponse(raw);

    return { parsed, raw, tokensUsed };
  }
}
