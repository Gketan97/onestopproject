// src/components/strategy/hooks/useArjunStrategy.js

import { useCallback, useRef } from 'react';
import {
  ARJUN_STRATEGY_MOCK,
  ARJUN_PHASE1_SYSTEM,
  NL_QUERY_ROUTES,
  ARJUN_KPI_RESPONSES,
  CONCEPTS,
  MILESTONES,
} from '../data/swiggyStrategyData.js';

const IS_DEV = import.meta.env.DEV;
const delay = ms => new Promise(r => setTimeout(r, ms));

function routeQuery(text) {
  const lower = text.toLowerCase();
  let best = null;
  let bestScore = 0;

  for (const route of NL_QUERY_ROUTES) {
    const score = route.keywords.filter(k => lower.includes(k)).length;
    if (score > bestScore) {
      bestScore = score;
      best = route;
    }
  }

  return best;
}

function detectLogicError(text) {
  const lower = text.toLowerCase();

  if (
    lower.includes('cart') &&
    (lower.includes('main') ||
      lower.includes('biggest') ||
      lower.includes('root cause'))
  ) {
    return 'wrong_conclusion';
  }

  if (
    lower.includes('platform') &&
    (lower.includes('bug') ||
      lower.includes('issue') ||
      lower.includes('problem'))
  ) {
    return 'triage_hypothesis_wrong';
  }

  return null;
}

function getMilestoneResponse(milestoneId, userMessage, attemptCount) {
  const lower = userMessage.toLowerCase();

  switch (milestoneId) {
    case 'scope': {
      const goodSignals = [
        'north bangalore',
        'city',
        'other cities',
        'platform',
        'tuesday',
        'wow',
        'week',
        'baseline',
        'normal',
        'variance',
        'scope',
        'specific',
      ];

      const isGood = goodSignals.some(s => lower.includes(s));

      if (isGood) return { key: 'triage_q1', advance: true };

      if (attemptCount >= 3)
        return { key: 'triage_start', advance: true, forceAdvance: true };

      if (attemptCount >= 2)
        return { key: 'triage_q1', advance: false };

      return { key: 'triage_start', advance: false };
    }

    case 'dashboard': {
      const goodSignals = ['conversion', 'lead', 'indicator', 'cause'];
      const isGood = goodSignals.some(s => lower.includes(s));

      if (isGood)
        return { key: 'triage_hypothesis_right', advance: true };

      if (attemptCount >= 3)
        return {
          key: 'triage_hypothesis_right',
          advance: true,
          forceAdvance: true,
        };

      return { key: 'triage_hypothesis_wrong', advance: false };
    }

    case 'funnel': {
      const goodSignals = [
        'add to cart',
        'cart',
        '44',
        '55',
        'anomal',
        'unusual',
        'drop',
      ];

      const isGood = goodSignals.some(s => lower.includes(s));

      if (isGood)
        return { key: 'funnel_shown', advance: true };

      if (attemptCount >= 3)
        return {
          key: 'funnel_shown',
          advance: true,
          forceAdvance: true,
        };

      if (attemptCount >= 2)
        return { key: 'cart_drop_correct', advance: false };

      return { key: 'wrong_conclusion', advance: false };
    }

    case 'rootcause': {
      const goodSignals = [
        'biryani',
        'restaurant',
        'supply',
        'availability',
        'new user',
        'week 3',
        'week 4',
        'menu',
        'selection',
      ];

      const isGood = goodSignals.some(s => lower.includes(s));

      if (isGood)
        return { key: 'cohort_insight', advance: true };

      if (attemptCount >= 3)
        return {
          key: 'cohort_insight',
          advance: true,
          forceAdvance: true,
        };

      if (attemptCount >= 2)
        return { key: 'cohort_shown', advance: false };

      return { key: 'wrong_conclusion', advance: false };
    }

    case 'impact': {
      const hasNumbers =
        /[₹\d]/.test(userMessage) &&
        (lower.includes('cr') ||
          lower.includes('lakh') ||
          lower.includes('l'));

      const hasRecovery =
        lower.includes('65') ||
        lower.includes('recovery') ||
        lower.includes('realistic');

      if (hasNumbers && hasRecovery)
        return { key: 'impact_correct', advance: true };

      if (hasNumbers && !hasRecovery)
        return {
          key: 'impact_shown',
          advance: false,
          conceptTrigger: 'impact_sizing',
        };

      if (attemptCount >= 3)
        return {
          key: 'impact_correct',
          advance: true,
          forceAdvance: true,
        };

      return { key: 'impact_shown', advance: false };
    }

    case 'recommendation': {
      const first100 = lower.slice(0, 100);

      const isGood = [
        'biryani',
        'supply',
        'availability',
        'restaurant',
        'drop',
      ].some(s => first100.includes(s));

      if (isGood)
        return { key: 'memo_ready', advance: true };

      if (attemptCount >= 3)
        return {
          key: 'memo_ready',
          advance: true,
          forceAdvance: true,
        };

      return {
        key: 'fallback',
        advance: false,
        conceptTrigger: 'pyramid_principle',
      };
    }

    default:
      return { key: 'fallback', advance: false };
  }
}

// KPI click response
export function getKpiClickResponse(metricKey) {
  const response = ARJUN_KPI_RESPONSES[metricKey];

  if (!response) {
    return {
      text: ARJUN_STRATEGY_MOCK.fallback,
      followUp: null,
      isCorrect: false,
      redirectTo: null,
      conceptTrigger: null,
    };
  }

  return {
    text: response.immediate,
    followUp: response.followUp || null,
    isCorrect: response.isCorrect || false,
    redirectTo: response.redirectTo || null,
    conceptTrigger: response.conceptTrigger ? CONCEPTS[response.conceptTrigger] : null,
  };
}

export function useArjunStrategy() {
  const attemptCounts = useRef({});

  const callArjunMilestone = useCallback(async (userMessage, milestoneId) => {
    const count = (attemptCounts.current[milestoneId] || 0) + 1;
    attemptCounts.current[milestoneId] = count;

    await delay(IS_DEV ? 900 : 1200);

    const { key, advance, forceAdvance, conceptTrigger } =
      getMilestoneResponse(milestoneId, userMessage, count);

    const text = ARJUN_STRATEGY_MOCK[key] || ARJUN_STRATEGY_MOCK.fallback;
    const concept = conceptTrigger ? CONCEPTS[conceptTrigger] : null;

    return {
      text,
      advance: advance || false,
      forceAdvance: forceAdvance || false,
      concept,
    };
  }, []);

  const callArjun = useCallback(async (userMessage, phaseKey) => {
    const logicErrorKey = detectLogicError(userMessage);

    if (logicErrorKey && ARJUN_STRATEGY_MOCK[logicErrorKey]) {
      await delay(IS_DEV ? 900 : 1200);
      return {
        text: ARJUN_STRATEGY_MOCK[logicErrorKey],
        vizType: null,
      };
    }

    const route = routeQuery(userMessage);

    const mockKey = phaseKey || route?.arjunKey || 'fallback';
    const vizType = route?.type || null;

    if (IS_DEV) {
      await delay(1000);
      const text =
        ARJUN_STRATEGY_MOCK[mockKey] ||
        ARJUN_STRATEGY_MOCK.fallback;

      return { text, vizType };
    }

    try {
      const res = await fetch('/.netlify/functions/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: ARJUN_PHASE1_SYSTEM,
          messages: [{ role: 'user', content: userMessage }],
          max_tokens: 250,
        }),
      });

      const data = await res.json();

      return {
        text:
          data.content?.[0]?.text ||
          ARJUN_STRATEGY_MOCK.fallback,
        vizType,
      };
    } catch (_) {
      return {
        text:
          ARJUN_STRATEGY_MOCK[mockKey] ||
          ARJUN_STRATEGY_MOCK.fallback,
        vizType,
      };
    }
  }, []);

  const resetAttempts = useCallback(milestoneId => {
    attemptCounts.current[milestoneId] = 0;
  }, []);

  return {
    callArjun,
    callArjunMilestone,
    resetAttempts,
  };
}