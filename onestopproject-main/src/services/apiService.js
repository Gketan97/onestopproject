// src/services/apiService.js
// All Anthropic API calls go through this module — never directly from components.
// In development, calls go to /.netlify/functions/evaluate (proxied by Vite if configured)
// In production, they hit the Netlify serverless function.

const EVALUATE_ENDPOINT = '/.netlify/functions/evaluate';

/**
 * Call Claude via the secure Netlify proxy.
 *
 * @param {Object} params
 * @param {string}   params.system    - System prompt
 * @param {Array}    params.messages  - Messages array [{role, content}]
 * @param {number}  [params.maxTokens=1000]
 *
 * @returns {Promise<string>} The assistant's text response
 */
export const callClaude = async ({ system, messages, maxTokens = 1000 }) => {
  const response = await fetch(EVALUATE_ENDPOINT, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system, messages, max_tokens: maxTokens }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `API error ${response.status}`);
  }

  const data = await response.json();
  // Extract text from the first content block
  const text = data.content?.find(b => b.type === 'text')?.text || '';
  return text;
};

// ── Specific evaluation prompts ───────────────────────────────────────────────

const ARJUN_SYSTEM = `You are Arjun, a senior data analyst with 8 years of experience at Swiggy.
You are reviewing a junior analyst's work on the Swiggy Orders Investigation case study.

Your evaluation is specific, honest, and structured. You evaluate on three dimensions:
1. ROOT CAUSE IDENTIFICATION — Did they find the right tables and identify the actual causes?
2. QUERY LOGIC — Was their SQL approach correct? Did it answer the question being asked?
3. BUSINESS COMMUNICATION — Is their write-up clear, structured, and actionable for a VP?

Format your response in three clearly labelled sections. Be direct — name what they did right and what they missed. Never give generic encouragement. Reference specific things from their work.`;

/**
 * Get Arjun's evaluation of a Phase 2 SQL answer.
 */
export const evaluatePhase2 = async ({ question, userQuery, expectedInsight }) => {
  const prompt = `The analyst was asked: "${question}"

Their SQL query:
${userQuery}

Expected insight: ${expectedInsight}

Evaluate their query and reasoning. Focus on whether they targeted the right tables, whether the logic would produce a meaningful result, and what they likely missed.`;

  return callClaude({
    system:   ARJUN_SYSTEM,
    messages: [{ role: 'user', content: prompt }],
    maxTokens: 600,
  });
};

/**
 * Get Arjun's full debrief evaluation after Phase 3 completion.
 */
export const evaluatePhase3 = async ({ phase3Answers, finalWriteUp, score }) => {
  const answersText = Object.entries(phase3Answers)
    .map(([key, val]) => `Question: ${key}\nHypothesis: ${val.hypothesis || 'none'}\nAnswer: ${val.answer || 'none'}\nConclusion: ${val.conclusion || 'none'}`)
    .join('\n\n');

  const prompt = `The analyst has completed the Swiggy Orders Investigation — Phase 3 (Execute).

Their score: ${score}/100

Their answers to the open-ended questions:
${answersText}

Their final executive write-up to the VP:
${finalWriteUp}

Provide a full debrief. Start with what they got right. Then name the specific insights they missed. End with one concrete recommendation for what they should practise next.`;

  return callClaude({
    system:    ARJUN_SYSTEM,
    messages:  [{ role: 'user', content: prompt }],
    maxTokens: 1000,
  });
};
