// src/components/strategy/hooks/useArjunStrategy.js
// CP10: Two changes from CP9:
//   1. M1 'scope' branching rewritten — 4 explicit branches:
//      Branch A (time only)  → pushes on geography
//      Branch B (geo only)   → pushes on baseline
//      Branch C (both)       → praises + advances
//      Branch D (vague)      → pushes on both, force-advances at attempt 3
//      All branches use responseOverride (inline string) instead of mock key
//      so responses are precise and immersive rather than generic.
//
//   2. callArjunMilestone now destructures + applies responseOverride:
//      text = responseOverride || ARJUN_STRATEGY_MOCK[key] || fallback

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

    // ── M1 SCOPE — 4-branch intent recognition ───────────────────────────────
    case 'scope': {
      const timeSignals = [
        'timeline', 'wow', 'week-over-week', 'baseline', 'rolling',
        'tuesday', 'last week', 'yesterday', 'period', 'when', 'since', 'time',
      ];
      const geoSignals = [
        'location', 'city', 'north bangalore', 'geography', 'region',
        'platform-wide', 'platform wide', 'local', 'specific', 'where',
        'cities', 'other city',
      ];

      const hasTime = timeSignals.some(s => lower.includes(s));
      const hasGeo  = geoSignals.some(s  => lower.includes(s));

      // Branch C — Both geo + time → praise comprehensive scope, advance
      if (hasTime && hasGeo) {
        return {
          key: 'triage_q1',
          advance: true,
          responseOverride: "Good — you're locking down both dimensions before touching data. Geography narrows the hypothesis space, the baseline anchors the severity. That's the minimum viable scope. Let's pull the numbers.",
        };
      }

      // Branch A — Time only, no geo mentioned → push specifically on geography
      if (hasTime && !hasGeo) {
        if (attemptCount >= 2) {
          return {
            key: 'triage_q1',
            advance: true,
            responseOverride: "Fair to question the baseline, but Priya's WoW numbers are firm. The real wildcard is geography — is this North Bangalore or platform-wide? I'll treat it as North Bangalore for now and we can revisit.",
          };
        }
        return {
          key: 'triage_scope_incomplete',
          advance: false,
          responseOverride: "Fair to question the baseline, but Priya's WoW numbers are firm. The real wildcard is geography — is this North Bangalore or platform-wide?",
        };
      }

      // Branch B — Geo only, no time mentioned → push specifically on baseline
      if (hasGeo && !hasTime) {
        if (attemptCount >= 2) {
          return {
            key: 'triage_q1',
            advance: true,
            responseOverride: "Good instinct. If the drop is concentrated in one zone, it's almost certainly supply-side. But compared to what? Tuesday baseline or a rolling average? I'll anchor to last Tuesday — that's Priya's reference.",
          };
        }
        return {
          key: 'triage_scope_incomplete',
          advance: false,
          responseOverride: "Good instinct. If the drop is concentrated in one zone, it's almost certainly supply-side. But compared to what? Tuesday baseline or a rolling average?",
        };
      }

      // Branch D — Vague: neither geo nor time → push back on both
      if (attemptCount >= 3) {
        return {
          key: 'triage_q1',
          advance: true,
          forceAdvance: true,
          responseOverride: "Let me anchor the scope for us: the drop is confirmed in North Bangalore specifically, measured WoW against last Tuesday. Those two facts change everything about where we look next.",
        };
      }

      return {
        key: 'triage_scope_incomplete',
        advance: false,
        responseOverride: "Before any data — two things need to be locked down: is this drop isolated to North Bangalore or platform-wide? And are we measuring against last Tuesday or a rolling average? Which of those is less clear to you?",
      };
    }

    // ── M2 DASHBOARD ─────────────────────────────────────────────────────────
    case 'dashboard': {
      const goodSignals = ['conversion', 'lead', 'indicator', 'cause'];
      const isGood = goodSignals.some(s => lower.includes(s));
      if (isGood) return { key: 'triage_hypothesis_right', advance: true };
      if (attemptCount >= 3) return { key: 'triage_hypothesis_right', advance: true, forceAdvance: true };
      return { key: 'triage_hypothesis_wrong', advance: false };
    }

    // ── M2.5 HYPOTHESIS — step 3 only (steps 1+2 handled in component) ───────
    case 'hypothesis': {
      const funnelSignals  = ['funnel', 'conversion', 'stage', 'step', 'journey', 'drop-off', 'where'];
      const supplySignals  = ['supply', 'restaurant', 'availability', 'biryani', 'menu'];
      const cohortSignals  = ['cohort', 'retention', 'new user', 'returning'];

      const wantsFunnel  = funnelSignals.some(s => lower.includes(s));
      const wantsSupply  = supplySignals.some(s => lower.includes(s));
      const wantsCohort  = cohortSignals.some(s => lower.includes(s));

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

    // ── M4 ROOT CAUSE ─────────────────────────────────────────────────────────
    case 'rootcause': {
      const whatSignals = ['biryani', 'restaurant', 'supply', 'availability', 'new user', 'week 3', 'week 4', 'menu', 'selection'];
      const whySignals  = ['because', 'which means', 'causing', 'leads to', 'result', 'since', 'due to', 'explains', 'therefore'];

      const hasWhat = whatSignals.some(s => lower.includes(s));
      const hasWhy  = whySignals.some(s  => lower.includes(s));

      if (hasWhat && hasWhy) return { key: 'cohort_insight', advance: true };
      if (hasWhat)           return { key: 'cohort_insight', advance: true };
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

    // responseOverride: branch-specific inline string that bypasses mock lookup
    const { key, advance, forceAdvance, conceptTrigger, queryType, responseOverride } =
      getMilestoneResponse(milestoneId, userMessage, count);

    const text    = responseOverride || ARJUN_STRATEGY_MOCK[key] || ARJUN_STRATEGY_MOCK.fallback;
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