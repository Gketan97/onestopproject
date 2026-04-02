// src/data/cases/swiggy.js
import { validateCase } from '../validateCase.js';

export {
  KPI_DATA, ARJUN_KPI_RESPONSES, HYPOTHESIS_TREE, HYPOTHESIS_PROMPTS,
  HYPOTHESIS_QUERY_REACTIONS, DAILY_TREND, FUNNEL_THIS_WEEK, FUNNEL_LAST_WEEK,
  FUNNEL_NEW_USERS, FUNNEL_RETURNING_USERS, SEGMENTATION_INSIGHT,
  COHORT_HEADERS, COHORT_ROWS, COHORT_NARRATION, IMPACT_SIZING, MILESTONES,
  PREDICTIONS, CONCEPTS, ARJUN_PHASE1_SYSTEM, NL_QUERY_ROUTES,
  ARJUN_STRATEGY_MOCK, SCENARIO, P2_SCENARIO, P2_KPI_DIRTY, P2_KPI_CLEAN,
  P2_FUNNEL_DIRTY_THIS_WEEK, P2_FUNNEL_DIRTY_LAST_WEEK, P2_FUNNEL_CLEAN_THIS_WEEK,
  P2_SANITY_CHECK, P2_IMPACT_SIZING, P2_ARJUN_HARDMODE, EXEC_MEMO_RUBRIC,
  ARJUN_PHASE2_SYSTEM, ARJUN_P2_MOCK,
} from '../../components/strategy/data/swiggyStrategyData.js';

const SEED = {
  company:               'Swiggy',
  city:                  'North Bangalore',
  incidentType:          'supply_drop',
  affectedCategory:      'Biryani',
  categoryShare:         0.28,
  dropMagnitude:         0.083,
  period:                'Tuesday WoW',
  baselineNullRate:      0.065,
  baselineAOV:           385,
  baselineOrdersPerWeek: 2.1,
};

function deriveCaseData(seed) {
  const nullResultRate = seed.baselineNullRate * (1 + seed.dropMagnitude * 4.8);

  const funnelBaseline = {
    browse:      0.834,
    addToCart:   0.578,
    checkout:    0.411,
    orderPlaced: 0.379,
  };

  const funnelAnomaly = {
    browse:      funnelBaseline.browse      * (1 - seed.dropMagnitude * 0.10),
    addToCart:   funnelBaseline.addToCart   * (1 - seed.dropMagnitude * 1.62),
    checkout:    funnelBaseline.checkout    * (1 - seed.dropMagnitude * 0.32),
    orderPlaced: funnelBaseline.orderPlaced * (1 - seed.dropMagnitude * 0.35),
  };

  const churnedUsers = Math.round(1121 * (seed.dropMagnitude / 0.083));
  const annual       = churnedUsers * seed.baselineAOV * seed.baselineOrdersPerWeek * 52;
  const conservative = Math.round(annual * 0.65);
  const expected     = Math.round(annual * 0.80);

  const cohortRows = [
    { cohort: 'W-4 (new)', d1: 68, d7: 41, d14: 28, d30: 19,   users: 3420, isNew: true  },
    { cohort: 'W-3 (new)', d1: 71, d7: 44, d14: 30, d30: 21,   users: 3180, isNew: true  },
    { cohort: 'W-2 (new)', d1: 69, d7: 42, d14: 29, d30: 20,   users: 3290, isNew: true  },
    { cohort: 'W-1 (new)', d1: 70, d7: 18, d14: 12, d30: null, users: 4820, isNew: true,  anomaly: true },
    { cohort: 'W-4 (ret)', d1: 88, d7: 72, d14: 61, d30: 49,   users: 8140, isNew: false },
    { cohort: 'W-3 (ret)', d1: 87, d7: 71, d14: 60, d30: 48,   users: 7980, isNew: false },
    { cohort: 'W-2 (ret)', d1: 89, d7: 73, d14: 62, d30: 50,   users: 8220, isNew: false },
    { cohort: 'W-1 (ret)', d1: 88, d7: 71, d14: null, d30: null, users: 8610, isNew: false },
  ];

  return {
    kpis: {
      nullResultRate,
      gmvWoW:        -seed.dropMagnitude,
      sessionsTotal:  48200,
      deliveryOnTime: 0.94,
    },
    funnel: { baseline: funnelBaseline, anomaly: funnelAnomaly },
    cohortRows,
    impact: {
      churnedUsers,
      avgOrderValue:  seed.baselineAOV,
      ordersPerWeek:  seed.baselineOrdersPerWeek,
      weeksInYear:    52,
      annual,
      conservative,
      expected,
      recoveryRate:   0.65,
    },
  };
}

export const SWIGGY_CASE = {
  id:   'swiggy',
  seed: SEED,
  data: deriveCaseData(SEED),

  arjunExpertMemo: {
    sentences: [
      {
        text:  "The 8.3% WoW GMV drop in North Bangalore is driven by a supply-side outage in the Biryani category — restaurants are online but Sold Out, causing a 4.8× spike in null search results.",
        label: "CONCLUSION FIRST",
        color: "#FC8019",
      },
      {
        text:  "Tuesday funnel data confirms: Add-to-Cart dropped 13.5pp (57.8% → 44.3%) while Browse held flat — users are reaching the category but finding nothing to order.",
        label: "EVIDENCE",
        color: "#4F80FF",
      },
      {
        text:  "New users acquired during the outage show 18pp lower D7 retention, putting ₹2.25Cr annualised GMV at risk at a 65% recovery rate.",
        label: "IMPACT — QUANTIFIED",
        color: "#A78BFA",
      },
      {
        text:  "Recommend: ops team to contact top 20 Biryani restaurants in North Bangalore zones by 6 PM today; product to suppress null-result pages and surface alternatives; review resolved by Thursday standup.",
        label: "ACTION — WHO / WHAT / WHEN",
        color: "#3DD68C",
      },
    ],
  },

  rubric: {
    feedback: {
      gotRight: {
        sizing:        "You quantified the GMV impact precisely with a recovery rate.",
        actionability: "You named a specific owner and deadline for the fix.",
        structure:     "You led with the finding — root cause in sentence one.",
      },
      sharpen: {
        sizing:        "Lead with the number — ₹2.25Cr at 65% recovery — before the root cause narrative.",
        actionability: "'Fix availability' is an ops ticket, not a recommendation. Name who, what, by when.",
        structure:     "Bury the methodology. A VP needs the conclusion in sentence one, not after context.",
      },
    },
  },
};

validateCase(SWIGGY_CASE);
