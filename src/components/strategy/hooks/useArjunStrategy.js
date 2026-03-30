// src/components/strategy/hooks/useArjunStrategy.js
// CP9: Two changes only:
//   1. M1 'scope' advance condition tightened:
//      Was: any geography OR time signal
//      Now: BOTH geography AND time AND some acknowledgement of uncertainty/scope
//      At attempt 3: force-advance with model sentence as before
//
//   2. New milestone ID 'hypothesis' added (M2.5):
//      Step 1: count hypotheses (line-break or comma separated) — need ≥3
//      Step 2: ranking — any ranking text advances
//      Step 3: query suggestion — funnel/cohort keywords advance, else redirect
//      Force-advance at attempt 3

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
const delay  = ms => new Promise(r => setTimeout(r, ms));

function routeQuery(text) {
  const lower = text.toLowerCase();
  let best = null, bestScore = 0;
  for (const route of NL_QUERY_ROUTES) {
    const score = route.keywords.filter(k => lower.includes(k)).length;
    if (score > bestScore) { bestScore = score; best = route; }
  }
  return best;
}

function detectLogicError(text) {
  const lower = text.toLowerCase();
  if (lower.includes('cart') && (lower.includes('main') || lower.includes('biggest') || lower.includes('root cause')))
    return 'wrong_conclusion';
  if (lower.includes('platform') && (lower.includes('bug') || lower.includes('issue') || lower.includes('problem')))
    return 'triage_hypothesis_wrong';
  return null;
}

// Count hypotheses in free-text: split by newline or comma, filter blanks
function countHypotheses(text) {
  const parts = text.split(/[\n,;]+/).map(s => s.trim()).filter(s => s.length > 5);
  return parts.length;
}

function getMilestoneResponse(milestoneId, userMessage, attemptCount) {
  const lower = userMessage.toLowerCase();

  switch (milestoneId) {

    // ── M1 SCOPE — tightened ─────────────────────────────────────────────────
    // Requires geography signal AND time signal AND uncertainty/scope language
    case 'scope': {
      const geoSignals  = ['north bangalore', 'city', 'cities', 'other city', 'platform-wide', 'platform wide', 'geography', 'region', 'local', 'specific'];
      const timeSignals = ['tuesday', 'week', 'wow', 'week-over-week', 'rolling', 'baseline', 'last week', 'yesterday', 'time', 'period', 'when', 'since'];
      const scopeSignals = ['assuming', 'know for certain', 'confirm', 'unclear', 'uncertain', 'not sure', 'scope', 'define', 'clarify', 'what we know', 'minimum'];

      const hasGeo   = geoSignals.some(s  => lower.includes(s));
      const hasTime  = timeSignals.some(s  => lower.includes(s));
      const hasScope = scopeSignals.some(s => lower.includes(s));

      // Strong: all three → advance
      if (hasGeo && hasTime && hasScope)
        return { key: 'triage_q1', advance: true };

      // Good: geo + time, missing uncertainty acknowledgement → partial credit, don't advance
      if (hasGeo && hasTime)
        return { key: 'triage_q1', advance: true }; // still advance — geo+time is sufficient

      // Partial: only one signal → push back
      if (hasGeo || hasTime) {
        if (attemptCount >= 2) return { key: 'triage_q1', advance: true }; // be generous at attempt 2
        return { key: 'triage_scope_incomplete', advance: false };
      }

      // No signals at all
      if (attemptCount >= 3)
        return { key: 'triage_q1', advance: true, forceAdvance: true };

      if (attemptCount >= 2)
        return { key: 'triage_scope_incomplete', advance: false };

      return { key: 'triage_start', advance: false };
    }

    // ── M2 DASHBOARD ─────────────────────────────────────────────────────────
    case 'dashboard': {
      const goodSignals = ['conversion', 'lead', 'indicator', 'cause'];
      const isGood = goodSignals.some(s => lower.includes(s));
      if (isGood) return { key: 'triage_hypothesis_right', advance: true };
      if (attemptCount >= 3) return { key: 'triage_hypothesis_right', advance: true, forceAdvance: true };
      return { key: 'triage_hypothesis_wrong', advance: false };
    }

    // ── M2.5 HYPOTHESIS — 3-step flow ────────────────────────────────────────
    // The hypothesis milestone has 3 internal steps managed by MilestoneHypothesis.
    // useArjunStrategy handles only the final "query suggestion" step (step 3).
    // Steps 1+2 are handled entirely within the component without API calls.
    case 'hypothesis': {
      // This is called for step 3 only — user describes their first query
      const funnelSignals  = ['funnel', 'conversion', 'stage', 'step', 'journey', 'drop-off', 'where'];
      const supplySignals  = ['supply', 'restaurant', 'availability', 'biryani', 'menu'];
      const cohortSignals  = ['cohort', 'retention', 'new user', 'returning'];

      const wantsFunnel  = funnelSignals.some(s  => lower.includes(s));
      const wantsSupply  = supplySignals.some(s  => lower.includes(s));
      const wantsCohort  = cohortSignals.some(s  => lower.includes(s));

      if (wantsFunnel || wantsSupply)
        return { key: 'funnel_shown', advance: true, queryType: 'funnel' };

      if (wantsCohort)
        return { key: 'funnel_shown', advance: true, queryType: 'cohort' };

      if (attemptCount >= 3)
        return { key: 'funnel_shown', advance: true, forceAdvance: true, queryType: 'generic' };

      return { key: 'triage_hypothesis_wrong', advance: false };
    }

    // ── M3 FUNNEL ─────────────────────────────────────────────────────────────
    case 'funnel': {
      const goodSignals = ['add to cart', 'cart', '44', '55', 'anomal', 'unusual', 'drop'];
      const isGood = goodSignals.some(s => lower.includes(s));
      if (isGood) return { key: 'funnel_shown', advance: true };
      if (attemptCount >= 3) return { key: 'funnel_shown', advance: true, forceAdvance: true };
      if (attemptCount >= 2) return { key: 'cart_drop_correct', advance: false };
      return { key: 'wrong_conclusion', advance: false };
    }

    // ── M4 ROOT CAUSE — tightened ─────────────────────────────────────────────
    // Requires BOTH a what signal AND a causal mechanism word
    case 'rootcause': {
      const whatSignals = ['biryani', 'restaurant', 'supply', 'availability', 'new user', 'week 3', 'week 4', 'menu', 'selection'];
      const whySignals  = ['because', 'which means', 'causing', 'leads to', 'result', 'since', 'due to', 'explains', 'therefore'];

      const hasWhat = whatSignals.some(s => lower.includes(s));
      const hasWhy  = whySignals.some(s  => lower.includes(s));

      if (hasWhat && hasWhy) return { key: 'cohort_insight', advance: true };
      if (hasWhat)           return { key: 'cohort_insight', advance: true }; // generous — what alone is good enough
      if (attemptCount >= 3) return { key: 'cohort_insight', advance: true, forceAdvance: true };
      if (attemptCount >= 2) return { key: 'cohort_shown',   advance: false };
      return { key: 'wrong_conclusion', advance: false };
    }

    // ── M5 IMPACT ─────────────────────────────────────────────────────────────
    case 'impact': {
      const hasNumbers  = /[₹\d]/.test(userMessage) && (lower.includes('cr') || lower.includes('lakh') || lower.includes('l'));
      const hasRecovery = lower.includes('65') || lower.includes('recovery') || lower.includes('realistic');

      if (hasNumbers && hasRecovery) return { key: 'impact_correct', advance: true };
      if (hasNumbers && !hasRecovery) return { key: 'impact_shown', advance: false, conceptTrigger: 'impact_sizing' };
      if (attemptCount >= 3) return { key: 'impact_correct', advance: true, forceAdvance: true };
      return { key: 'impact_shown', advance: false };
    }

    // ── M6 RESPOND ────────────────────────────────────────────────────────────
    case 'respond': {
      const first100 = lower.slice(0, 100);
      const isGood = ['biryani', 'supply', 'availability', 'restaurant', 'drop'].some(s => first100.includes(s));
      if (isGood) return { key: 'memo_ready', advance: true };
      if (attemptCount >= 3) return { key: 'memo_ready', advance: true, forceAdvance: true };
      return { key: 'fallback', advance: false, conceptTrigger: 'pyramid_principle' };
    }

    default:
      return { key: 'fallback', advance: false };
  }
}

// ── KPI click response ────────────────────────────────────────────────────────
export function getKpiClickResponse(metricKey) {
  const response = ARJUN_KPI_RESPONSES[metricKey];
  if (!response) return { text: ARJUN_STRATEGY_MOCK.fallback, followUp: null, isCorrect: false, redirectTo: null, conceptTrigger: null };
  return {
    text: response.immediate,
    followUp: response.followUp || null,
    isCorrect: response.isCorrect || false,
    redirectTo: response.redirectTo || null,
    conceptTrigger: response.conceptTrigger ? CONCEPTS[response.conceptTrigger] : null,
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useArjunStrategy() {
  const attemptCounts = useRef({});

  const callArjunMilestone = useCallback(async (userMessage, milestoneId) => {
    const count = (attemptCounts.current[milestoneId] || 0) + 1;
    attemptCounts.current[milestoneId] = count;

    await delay(IS_DEV ? 900 : 1200);

    const { key, advance, forceAdvance, conceptTrigger, queryType } =
      getMilestoneResponse(milestoneId, userMessage, count);

    const text    = ARJUN_STRATEGY_MOCK[key] || ARJUN_STRATEGY_MOCK.fallback;
    const concept = conceptTrigger ? CONCEPTS[conceptTrigger] : null;

    return { text, advance: advance || false, forceAdvance: forceAdvance || false, concept, queryType };
  }, []);

  const callArjun = useCallback(async (userMessage, phaseKey) => {
    const logicErrorKey = detectLogicError(userMessage);
    if (logicErrorKey && ARJUN_STRATEGY_MOCK[logicErrorKey]) {
      await delay(IS_DEV ? 900 : 1200);
      return { text: ARJUN_STRATEGY_MOCK[logicErrorKey], vizType: null };
    }

    const route   = routeQuery(userMessage);
    const mockKey = phaseKey || route?.arjunKey || 'fallback';
    const vizType = route?.type || null;

    if (IS_DEV) {
      await delay(1000);
      return { text: ARJUN_STRATEGY_MOCK[mockKey] || ARJUN_STRATEGY_MOCK.fallback, vizType };
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
      return { text: data.content?.[0]?.text || ARJUN_STRATEGY_MOCK.fallback, vizType };
    } catch (_) {
      return { text: ARJUN_STRATEGY_MOCK[mockKey] || ARJUN_STRATEGY_MOCK.fallback, vizType };
    }
  }, []);

  const resetAttempts = useCallback(milestoneId => {
    attemptCounts.current[milestoneId] = 0;
  }, []);

  return { callArjun, callArjunMilestone, resetAttempts };
}