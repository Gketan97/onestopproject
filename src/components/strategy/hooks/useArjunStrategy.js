// src/components/strategy/hooks/useArjunStrategy.js
// CP12: Sprint 4 — Agentic Arjun + Sprint 3 ThinkingReveal wiring
//
// KEY CHANGES FROM CP10/CP11:
//
//   1. MarketplaceDB integration:
//      - applyAnomaly('SupplyDrop') called once on mount
//      - Each milestone maps to a queryType: DASHBOARD_KPI | CONVERSION_FUNNEL | COHORT_RETENTION
//      - callArjunMilestone() now:
//          a. Identifies the correct query for the milestone
//          b. Calls MarketplaceDB.execute(queryType)
//          c. Derives expertAnalysis from the returned data
//          d. Returns { text, advance, concept, queryType, expertAnalysis, sqlQuery }
//
//   2. expertAnalysis payload:
//      Built deterministically from actual DB anomaly values.
//      Shape: { title, insight, evidence[], implication }
//      Consumed by ThinkingReveal.jsx — revealed only after user commits.
//
//   3. sqlQuery:
//      Each milestone now exposes a `sqlQuery` string.
//      ArjunQueryTerminal uses this for the typewriter SQL effect in the Terminal.
//
//   4. All existing milestone routing (scope, dashboard, funnel, rootcause,
//      impact, respond, p2_dirty) is PRESERVED exactly — no regressions.

import { useCallback, useRef } from 'react';
import {
  ARJUN_STRATEGY_MOCK,
  ARJUN_PHASE1_SYSTEM,
  NL_QUERY_ROUTES,
  ARJUN_KPI_RESPONSES,
  CONCEPTS,
  MILESTONES,
} from '../data/swiggyStrategyData.js';
import { applyAnomaly, execute } from '../../../data/MarketplaceDB.js';

const IS_DEV = import.meta.env.DEV;
const delay  = ms => new Promise(r => setTimeout(r, ms));

// ── Bootstrap: apply SupplyDrop anomaly once ──────────────────────────────────
// Safe to call multiple times — buildDatabase() is idempotent with same type
let _anomalyApplied = false;
function ensureAnomaly() {
  if (!_anomalyApplied) {
    try { applyAnomaly('SupplyDrop'); _anomalyApplied = true; }
    catch (_) { /* silent — DB may already be seeded */ }
  }
}

// ── Milestone → DB query mapping ──────────────────────────────────────────────
const MILESTONE_QUERY_MAP = {
  dashboard: 'DASHBOARD_KPI',
  funnel:    'CONVERSION_FUNNEL',
  rootcause: 'COHORT_RETENTION',
  impact:    'DASHBOARD_KPI',   // re-uses KPI to build impact sizing
  respond:   null,              // no DB query needed
  scope:     null,
  hypothesis: null,
};

// ── SQL strings for typewriter Terminal effect ────────────────────────────────
const MILESTONE_SQL = {
  dashboard: `SELECT
  city_name,
  SUM(sessions)          AS total_sessions,
  SUM(search_null_results) AS null_results,
  ROUND(SUM(search_null_results)::FLOAT
    / NULLIF(SUM(searches),0), 4) AS null_rate,
  SUM(checkouts)         AS checkouts
FROM fact_app_sessions
WHERE city_name = 'North Bangalore'
  AND date_id BETWEEN DATE_TRUNC('week', CURRENT_DATE - 7)
                  AND CURRENT_DATE
GROUP BY city_name;`,

  funnel: `SELECT
  day_name,
  SUM(sessions)     AS sessions,
  SUM(searches)     AS searches,
  SUM(pdp_views)    AS pdp_views,
  SUM(add_to_carts) AS add_to_carts,
  SUM(checkouts)    AS checkouts,
  ROUND(SUM(add_to_carts)::FLOAT
    / NULLIF(SUM(pdp_views),0), 4) AS cart_conv
FROM fact_app_sessions
WHERE city_name = 'North Bangalore'
  AND date_id >= CURRENT_DATE - 7
GROUP BY day_name
ORDER BY cart_conv ASC;`,

  rootcause: `SELECT
  c.cohort,
  c.cohort_size,
  c.w0  AS week_0_retention,
  c.w1  AS week_1_retention,
  c.w2  AS week_2_retention,
  c.w3  AS week_3_retention
FROM cohort_retention c
WHERE city = 'North Bangalore'
ORDER BY cohort ASC;`,
};

// ── Expert analysis builder — reads actual DB output ─────────────────────────
function buildExpertAnalysis(milestoneId, dbResult) {
  if (!dbResult) return null;

  switch (milestoneId) {

    case 'dashboard': {
      const nb = dbResult.by_city?.['North Bangalore'];
      if (!nb) return null;
      const nullRate = nb.metrics?.null_result_rate?.value;
      const gmvWow   = nb.metrics?.total_gmv?.wow;
      const baseline = 0.065;
      const spike    = nullRate ? Math.round((nullRate - baseline) / baseline * 100) : 0;

      return {
        title: 'Dashboard — Lead Indicator Identification',
        insight: `Search Null Rate spiked to ${nullRate ? (nullRate * 100).toFixed(1) : '~31'}% — a ${spike}% increase above the 6.5% baseline. This is the lead indicator. GMV (−${Math.abs(gmvWow || 8.3)}% WoW) is the lagging consequence, not the cause.`,
        evidence: [
          `Null result rate: ${nullRate ? (nullRate * 100).toFixed(1) : '31'}% this week vs 6.5% baseline — users are searching and finding nothing.`,
          `Delivery fleet and on-time rate unchanged — this is not a logistics problem.`,
          `Session count stable — demand intent is there, supply is the gap.`,
        ],
        implication: 'When null_result_rate spikes without a session drop, restaurants went offline — not users. The funnel will confirm where exactly the conversion breaks.',
      };
    }

    case 'funnel': {
      const seg = dbResult.segment_by_day || [];
      const tue = seg.find(d => d.day_name === 'Tuesday');
      const avg = seg.reduce((s, d) => s + (d.null_result_rate || 0), 0) / Math.max(seg.length, 1);
      const cartConvTue  = tue?.cart_conv  || 0.373;
      const cartConvAvg  = seg.reduce((s, d) => s + (d.pdp_conv || 0), 0) / Math.max(seg.length, 1);

      return {
        title: 'Funnel — Stage Anomaly Isolation',
        insight: `Tuesday's Add-to-Cart conversion is ${(cartConvTue * 100).toFixed(1)}% — the sharpest single-day drop in the funnel. Every other stage moved 2–5 points. This is an anomaly, not a drift.`,
        evidence: [
          `Tuesday null_result_rate: ${tue ? (tue.null_result_rate * 100).toFixed(1) : '31.0'}% vs weekly avg ${(avg * 100).toFixed(1)}% — 4.8× elevated.`,
          `Search→PDP conversion collapses 39% on Tuesday — users who do get results aren't finding Biryani options.`,
          `Cart→Checkout rate is normal — users who add items are completing. The problem is at discovery, not intent.`,
        ],
        implication: 'The cart drop is supply-driven: users open the app, search, find nothing relevant, and leave. The Biryani category is the primary suspect given its 28% share of North BLR orders.',
      };
    }

    case 'rootcause': {
      const heatmap = dbResult.heatmap || [];
      const wk3 = heatmap.find(r => r.cohort === 'Week 3');
      const wk1 = heatmap.find(r => r.cohort === 'Week 1');
      const wk3W1 = wk3?.cells?.find(c => c.week === 'W1')?.retention_rate;
      const wk1W1 = wk1?.cells?.find(c => c.week === 'W1')?.retention_rate;
      const penalty = wk3W1 && wk1W1 ? Math.round((1 - wk3W1 / wk1W1) * 100) : 18;

      return {
        title: 'Cohort — Retention Degradation Root Cause',
        insight: `Week 3 cohort W1 retention is ${wk3W1 ? (wk3W1 * 100).toFixed(0) : '32'}% — ${penalty}% below Week 1 cohort's ${wk1W1 ? (wk1W1 * 100).toFixed(0) : '42'}%. This is not a one-week blip. It's been building for 4 weeks.`,
        evidence: [
          `Week 3 cohort (acquired during supply gap): W1 retention ${wk3W1 ? (wk3W1 * 100).toFixed(0) : '32'}% vs ${wk1W1 ? (wk1W1 * 100).toFixed(0) : '42'}% baseline.`,
          `Cohort sizes are stable (3,900–4,400) — this is not a sample size problem.`,
          `Weeks 4, 5, 6 all show the same degraded pattern — the supply gap is ongoing, not fixed.`,
        ],
        implication: 'New users who experienced null search results in their first session churned at 18% higher rates. Supply disruption doesn\'t just lose orders today — it erodes the new user base permanently.',
      };
    }

    default:
      return null;
  }
}

// ── Original logic functions (unchanged) ─────────────────────────────────────

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

function getMilestoneResponse(milestoneId, userMessage, attemptCount) {
  const lower = userMessage.toLowerCase();

  switch (milestoneId) {
    case 'scope': {
      const timeSignals = ['timeline','wow','week-over-week','baseline','rolling','tuesday','last week','yesterday','period','when','since','time'];
      const geoSignals  = ['location','city','north bangalore','geography','region','platform-wide','platform wide','local','specific','where','cities','other city'];
      const hasTime = timeSignals.some(s => lower.includes(s));
      const hasGeo  = geoSignals.some(s  => lower.includes(s));

      if (hasTime && hasGeo) return { key: 'triage_q1', advance: true, responseOverride: "Good — you're locking down both dimensions before touching data. Geography narrows the hypothesis space, the baseline anchors the severity. That's the minimum viable scope. Let's pull the numbers." };
      if (hasTime && !hasGeo) {
        if (attemptCount >= 2) return { key: 'triage_q1', advance: true, responseOverride: "Fair to question the baseline, but Priya's WoW numbers are firm. The real wildcard is geography — is this North Bangalore or platform-wide? I'll treat it as North Bangalore for now and we can revisit." };
        return { key: 'triage_scope_incomplete', advance: false, responseOverride: "Fair to question the baseline, but Priya's WoW numbers are firm. The real wildcard is geography — is this North Bangalore or platform-wide?" };
      }
      if (hasGeo && !hasTime) {
        if (attemptCount >= 2) return { key: 'triage_q1', advance: true, responseOverride: "Good instinct. If the drop is concentrated in one zone, it's almost certainly supply-side. But compared to what? Tuesday baseline or a rolling average? I'll anchor to last Tuesday — that's Priya's reference." };
        return { key: 'triage_scope_incomplete', advance: false, responseOverride: "Good instinct. If the drop is concentrated in one zone, it's almost certainly supply-side. But compared to what? Tuesday baseline or a rolling average?" };
      }
      if (attemptCount >= 3) return { key: 'triage_q1', advance: true, forceAdvance: true, responseOverride: "Let me anchor the scope for us: the drop is confirmed in North Bangalore specifically, measured WoW against last Tuesday. Those two facts change everything about where we look next." };
      return { key: 'triage_scope_incomplete', advance: false, responseOverride: "Before any data — two things need to be locked down: is this drop isolated to North Bangalore or platform-wide? And are we measuring against last Tuesday or a rolling average? Which of those is less clear to you?" };
    }

    case 'dashboard': {
      const goodSignals = ['conversion','lead','indicator','cause'];
      const isGood = goodSignals.some(s => lower.includes(s));
      if (isGood) return { key: 'triage_hypothesis_right', advance: true };
      if (attemptCount >= 3) return { key: 'triage_hypothesis_right', advance: true, forceAdvance: true };
      return { key: 'triage_hypothesis_wrong', advance: false };
    }

    case 'hypothesis': {
      const funnelSignals = ['funnel','conversion','stage','step','journey','drop-off','where'];
      const supplySignals = ['supply','restaurant','availability','biryani','menu'];
      const cohortSignals = ['cohort','retention','new user','returning'];
      if (funnelSignals.some(s => lower.includes(s)) || supplySignals.some(s => lower.includes(s)))
        return { key: 'funnel_shown', advance: true, queryType: 'funnel' };
      if (cohortSignals.some(s => lower.includes(s)))
        return { key: 'funnel_shown', advance: true, queryType: 'cohort' };
      if (attemptCount >= 3) return { key: 'funnel_shown', advance: true, forceAdvance: true, queryType: 'generic' };
      return { key: 'triage_hypothesis_wrong', advance: false };
    }

    case 'funnel': {
      const goodSignals = ['add to cart','cart','44','55','anomal','unusual','drop'];
      const isGood = goodSignals.some(s => lower.includes(s));
      if (isGood) return { key: 'funnel_shown', advance: true };
      if (attemptCount >= 3) return { key: 'funnel_shown', advance: true, forceAdvance: true };
      if (attemptCount >= 2) return { key: 'cart_drop_correct', advance: false };
      return { key: 'wrong_conclusion', advance: false };
    }

    case 'rootcause': {
      const whatSignals = ['biryani','restaurant','supply','availability','new user','week 3','week 4','menu','selection'];
      const whySignals  = ['because','which means','causing','leads to','result','since','due to','explains','therefore'];
      const hasWhat = whatSignals.some(s => lower.includes(s));
      const hasWhy  = whySignals.some(s  => lower.includes(s));
      if (hasWhat && hasWhy) return { key: 'cohort_insight', advance: true };
      if (hasWhat)           return { key: 'cohort_insight', advance: true };
      if (attemptCount >= 3) return { key: 'cohort_insight', advance: true, forceAdvance: true };
      if (attemptCount >= 2) return { key: 'cohort_shown',   advance: false };
      return { key: 'wrong_conclusion', advance: false };
    }

    case 'impact': {
      const hasNumbers  = /[₹\d]/.test(userMessage) && (lower.includes('cr') || lower.includes('lakh') || lower.includes('l'));
      const hasRecovery = lower.includes('65') || lower.includes('recovery') || lower.includes('realistic');
      if (hasNumbers && hasRecovery) return { key: 'impact_correct', advance: true };
      if (hasNumbers && !hasRecovery) return { key: 'impact_shown', advance: false, conceptTrigger: 'impact_sizing' };
      if (attemptCount >= 3) return { key: 'impact_correct', advance: true, forceAdvance: true };
      return { key: 'impact_shown', advance: false };
    }

    case 'respond': {
      const first100 = lower.slice(0, 100);
      const isGood = ['biryani','supply','availability','restaurant','drop'].some(s => first100.includes(s));
      if (isGood) return { key: 'memo_ready', advance: true };
      if (attemptCount >= 3) return { key: 'memo_ready', advance: true, forceAdvance: true };
      return { key: 'fallback', advance: false, conceptTrigger: 'pyramid_principle' };
    }

    case 'p2_dirty': {
      const catchSignals = ['session','total sessions','partition','zone','east','coverage','missing','sanity','check','sample','population','baseline','weird','suspicious','doesn\'t add','inconsistent','low','small'];
      const caught = catchSignals.some(s => lower.includes(s));
      if (caught) return { key: 'p2_good_catch', advance: true, responseOverride: "Good catch. That's exactly the kind of sanity check that separates a senior analyst from a data-puller. The session count mismatch was the tell — South Mumbai East zone dropped out of the ETL partition. Reloading the full dataset now." };
      if (attemptCount >= 2) return { key: 'p2_dirty_reveal', advance: true, forceAdvance: true, responseOverride: "I'll flag this before you go further — the dataset has an incomplete partition. South Mumbai East is missing (~23,600 sessions). This is a common ETL bug. Any metric you calculated on the dirty data is off by ~24%. Reloading the full set." };
      return { key: 'p2_dirty_hint', advance: false, responseOverride: "Before you interpret — look at total sessions. 71,200 this Thursday vs 94,100 last Thursday. That's a 24% drop. South Mumbai's population didn't change. What could explain that?" };
    }

    default:
      return { key: 'fallback', advance: false };
  }
}

// ── KPI click response (unchanged) ───────────────────────────────────────────
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
  const attemptCounts  = useRef({});
  const expertCache    = useRef({});  // cache expertAnalysis per milestone

  // Ensure anomaly is seeded on first hook instantiation
  ensureAnomaly();

  const callArjunMilestone = useCallback(async (userMessage, milestoneId) => {
    const count = (attemptCounts.current[milestoneId] || 0) + 1;
    attemptCounts.current[milestoneId] = count;

    await delay(IS_DEV ? 900 : 1200);

    const { key, advance, forceAdvance, conceptTrigger, queryType, responseOverride } =
      getMilestoneResponse(milestoneId, userMessage, count);

    const text    = responseOverride || ARJUN_STRATEGY_MOCK[key] || ARJUN_STRATEGY_MOCK.fallback;
    const concept = conceptTrigger ? CONCEPTS[conceptTrigger] : null;

    // ── Sprint 4: DB query + expertAnalysis ──────────────────────────────────
    let expertAnalysis = expertCache.current[milestoneId] || null;
    let sqlQuery       = MILESTONE_SQL[milestoneId] || null;

    const dbQueryType = MILESTONE_QUERY_MAP[milestoneId];
    if (dbQueryType && !expertAnalysis) {
      try {
        const dbResult = execute(dbQueryType);
        expertAnalysis = buildExpertAnalysis(milestoneId, dbResult);
        expertCache.current[milestoneId] = expertAnalysis;
      } catch (_) {
        // Graceful fallback — ThinkingReveal simply won't render
        expertAnalysis = null;
      }
    }

    return {
      text,
      advance:        advance || false,
      forceAdvance:   forceAdvance || false,
      concept,
      queryType,
      expertAnalysis, // → consumed by ThinkingReveal
      sqlQuery,       // → consumed by ArjunQueryTerminal typewriter
    };
  }, []);

  // callArjun — Phase 2 NL interface (unchanged except expert cache)
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

  // Expose the expert cache so StrategyCase can pass it to DecisionLog
  const getExpertAnalyses = useCallback(() => {
    return { ...expertCache.current };
  }, []);

  return { callArjun, callArjunMilestone, resetAttempts, getExpertAnalyses };
}