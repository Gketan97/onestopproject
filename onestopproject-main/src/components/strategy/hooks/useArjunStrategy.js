// src/components/strategy/hooks/useArjunStrategy.js
// Arjun AI hook — Socratic Staff Analyst persona
// Routes NL queries to the right mock or live response

import { useCallback } from 'react';
import { ARJUN_STRATEGY_MOCK, ARJUN_STRATEGY_SYS, NL_QUERY_ROUTES } from '../data/swiggyStrategyData.js';

const IS_DEV = import.meta.env.DEV;
const delay = ms => new Promise(r => setTimeout(r, ms));

// Score a natural language query against route keywords
function routeQuery(text) {
  const lower = text.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const route of NL_QUERY_ROUTES) {
    const score = route.keywords.filter(k => lower.includes(k)).length;
    if (score > bestScore) { bestScore = score; best = route; }
  }
  return best;
}

// Detect if user made a common logic error to trigger Socratic challenge
function detectLogicError(text) {
  const lower = text.toLowerCase();
  if (lower.includes('cart') && (lower.includes('main') || lower.includes('biggest') || lower.includes('root cause'))) {
    return 'wrong_conclusion';
  }
  if (lower.includes('platform') && (lower.includes('bug') || lower.includes('issue') || lower.includes('problem'))) {
    return 'triage_hypothesis_wrong';
  }
  return null;
}

export function useArjunStrategy() {

  const callArjun = useCallback(async (userMessage, phaseKey) => {
    // Logic error detection takes priority
    const logicErrorKey = detectLogicError(userMessage);
    if (logicErrorKey && ARJUN_STRATEGY_MOCK[logicErrorKey]) {
      await delay(IS_DEV ? 900 : 1200);
      return { text: ARJUN_STRATEGY_MOCK[logicErrorKey], vizType: null };
    }

    // Route NL queries to the right visualizer + response
    const route = routeQuery(userMessage);
    const mockKey = phaseKey || route?.arjunKey || 'fallback';
    const vizType = route?.type || null;

    if (IS_DEV) {
      await delay(1000);
      const text = ARJUN_STRATEGY_MOCK[mockKey] || ARJUN_STRATEGY_MOCK.fallback;
      return { text, vizType };
    }

    try {
      const res = await fetch('/.netlify/functions/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: ARJUN_STRATEGY_SYS,
          messages: [{ role: 'user', content: userMessage }],
          max_tokens: 250,
        }),
      });
      const data = await res.json();
      return {
        text: data.content?.[0]?.text || ARJUN_STRATEGY_MOCK.fallback,
        vizType,
      };
    } catch (_) {
      return {
        text: ARJUN_STRATEGY_MOCK[mockKey] || ARJUN_STRATEGY_MOCK.fallback,
        vizType,
      };
    }
  }, []);

  return { callArjun };
}
