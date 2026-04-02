// src/data/cases/zomato.js
// CP6-D: Zomato case config — engine validation test.
// Uses identical schema to swiggy.js.
// Zero new React components needed — runs entirely on P3 engine.
// Root cause: competitor promo (demand-side drop, not supply-side).

import { validateCase } from '../validateCase.js';

const SEED = {
  company:               'Zomato',
  city:                  'South Delhi',
  incidentType:          'demand_drop',
  affectedCategory:      'Chinese',
  categoryShare:         0.19,
  dropMagnitude:         0.112,   // 11.2% WoW
  period:                'Thursday WoW',
  baselineNullRate:      0.055,
  baselineAOV:           420,
  baselineOrdersPerWeek: 1.8,
};

function deriveCaseData(seed) {
  const nullResultRate = seed.baselineNullRate * (1 + seed.dropMagnitude * 1.8);

  const funnelBaseline = {
    browse:      0.811,
    addToCart:   0.561,
    checkout:    0.398,
    orderPlaced: 0.362,
  };

  const funnelAnomaly = {
    browse:      funnelBaseline.browse      * (1 - seed.dropMagnitude * 0.22),
    addToCart:   funnelBaseline.addToCart   * (1 - seed.dropMagnitude * 1.45),
    checkout:    funnelBaseline.checkout    * (1 - seed.dropMagnitude * 0.28),
    orderPlaced: funnelBaseline.orderPlaced * (1 - seed.dropMagnitude * 0.31),
  };

  const churnedUsers  = Math.round(980 * (seed.dropMagnitude / 0.112));
  const annual        = churnedUsers * seed.baselineAOV * seed.baselineOrdersPerWeek * 52;
  const conservative  = Math.round(annual * 0.60);
  const expected      = Math.round(annual * 0.75);

  const cohortRows = [
    { cohort: 'W-4 (new)', d1: 65, d7: 38, d14: 26, d30: 17,   users: 2980, isNew: true  },
    { cohort: 'W-3 (new)', d1: 67, d7: 40, d14: 27, d30: 18,   users: 3120, isNew: true  },
    { cohort: 'W-2 (new)', d1: 66, d7: 39, d14: 26, d30: 17,   users: 3050, isNew: true  },
    { cohort: 'W-1 (new)', d1: 64, d7: 15, d14: 10, d30: null, users: 4210, isNew: true,  anomaly: true },
    { cohort: 'W-4 (ret)', d1: 85, d7: 68, d14: 57, d30: 44,   users: 7620, isNew: false },
    { cohort: 'W-3 (ret)', d1: 84, d7: 67, d14: 56, d30: 43,   users: 7480, isNew: false },
    { cohort: 'W-2 (ret)', d1: 86, d7: 69, d14: 58, d30: 45,   users: 7810, isNew: false },
    { cohort: 'W-1 (ret)', d1: 85, d7: 67, d14: null, d30: null, users: 8020, isNew: false },
  ];

  return {
    kpis: {
      nullResultRate,
      gmvWoW:        -seed.dropMagnitude,
      sessionsTotal:  41800,
      deliveryOnTime: 0.91,
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
      recoveryRate:   0.60,
    },
  };
}

// ── Milestone configs ─────────────────────────────────────────────────────────
const ZOMATO_MILESTONES = [
  {
    id:            'scope',
    number:        '01',
    title:         'Scope the Problem',
    arjunOpening:  `Priya's message came in at 8:52 AM: orders in South Delhi down 11.2% WoW. Thursday. Chinese category is the suspected vector.\n\nBefore I pull a single number — two questions. First: is this South Delhi only, or have you seen dips in other cities this Thursday? Second: 11.2% vs what baseline — last Thursday, or a rolling 4-week average?`,
    arjunQuestion: "Don't touch the data yet. What's your first instinct — demand-side or supply-side problem? And what single metric would confirm it fastest?",
    hint1:         "Think about what changed on Thursday specifically. Chinese food on Thursday — is there a demand pattern here?",
    hint2:         "Competitor promos tend to spike on specific days and categories. What data would you pull to confirm or rule that out?",
    correctSignals: ['demand', 'competitor', 'promo', 'thursday', 'discount', 'zomato gold', 'south delhi', 'geography', 'baseline'],
    successKey:    'triage_q1',
    maxAttempts:   3,
    vizType:       'none',
    synthesisPrompt: "In one sentence — what exactly are you investigating? Scope it precisely.",
    synthesisPlaceholder: "We are investigating an 11.2% WoW GMV drop in South Delhi's Chinese category on Thursday, driven by suspected demand-side competition...",
    synthesisMin:  60,
    synthesisColor: '#FC8019',
    forcedAdvanceLesson: "The key distinction: supply drops show null search results. Demand drops show users not opening the app at all. Thursday + one category + South Delhi = highly localised. That pattern points to a competitor event, not a supply failure.",
  },
  {
    id:            'dashboard',
    number:        '02',
    title:         'Read the Dashboard',
    arjunOpening:  "Here's the live data. Ten metrics. Before you click anything — write down which one you'd investigate first and why.",
    arjunQuestion: "Two metrics are in distress. Which is the lead indicator — the one that caused the others to move?",
    hint1:         "Search Null Rate is normal this week. That rules out supply. So what caused users to drop off?",
    hint2:         "Session count dropped too. Users aren't even opening the app in the same numbers. That's a demand signal, not a funnel signal.",
    correctSignals: ['session', 'conversion', 'demand', 'competitor', 'sessions dropped', 'fewer users', 'open rate'],
    successKey:    'triage_hypothesis_right',
    maxAttempts:   3,
    vizType:       'kpi',
    synthesisPrompt: null,
    forcedAdvanceLesson: "When session count drops alongside conversion, the problem is upstream of the app — users chose not to open it. That's a demand-side signal, not a funnel problem.",
  },
  {
    id:            'funnel',
    number:        '03',
    title:         'Diagnose the Funnel',
    arjunOpening:  "You called demand-side. Right direction. Here's the funnel — let's confirm where users are dropping.",
    arjunQuestion: "Look at the funnel. Which drop is most anomalous — and does it support demand-side or supply-side?",
    hint1:         "Compare Browse-to-Search this week vs last week. Supply problems kill Add-to-Cart. Demand problems kill Browse.",
    hint2:         "Browse dropped 9pp. Add-to-Cart dropped 8pp. Both moved — but Browse moved first. Users aren't even searching.",
    correctSignals: ['browse', 'session', 'demand', 'not searching', 'app open', 'fewer', 'traffic', 'upstream'],
    successKey:    'funnel_shown',
    maxAttempts:   3,
    vizType:       'funnel',
    synthesisPrompt: "What did the funnel confirm that the dashboard couldn't show you?",
    synthesisPlaceholder: "The funnel showed the drop starts at Browse — users are opening the app but not searching Chinese, which means...",
    synthesisMin:  60,
    synthesisColor: '#4F80FF',
    forcedAdvanceLesson: "The anomaly is at Browse, not Add-to-Cart. Supply failures kill Add-to-Cart (items unavailable). Demand failures kill Browse (users don't search). This is a demand problem confirmed.",
  },
  {
    id:            'rootcause',
    number:        '04',
    title:         'Find the Root Cause',
    arjunOpening:  "Demand drop, Browse stage, Thursday, South Delhi, Chinese category. What's your hypothesis?",
    arjunQuestion: "State your hypothesis in one sentence. Be specific — what changed, for whom, when, and why.",
    hint1:         "Swiggy ran a 40% off Chinese promotion on Thursday in South Delhi. What would that do to Zomato's session counts?",
    hint2:         "If a competitor runs a category-specific promo in one city on one day — look at cohort data. New users who see no promo leave permanently.",
    correctSignals: ['swiggy', 'competitor', 'promotion', 'promo', 'discount', 'offer', 'chinese', 'thursday', 'demand', 'marketing'],
    successKey:    'cohort_insight',
    maxAttempts:   3,
    vizType:       'cohort',
    synthesisPrompt: null,
    forcedAdvanceLesson: "Competitor promos are the hardest root cause to confirm because the data is external. The signal is: session drop without null result spike + category-specific + city-specific + single day = competitor event, not platform failure.",
  },
  {
    id:            'impact',
    number:        '05',
    title:         'Size the Impact',
    arjunOpening:  "Your hypothesis is defensible. Now Priya needs a number. Let's build it.",
    arjunQuestion: `Use these inputs: ${Math.round(980 * (0.112 / 0.112))} churned new users, ₹420 AOV, 1.8 orders/week, 52 weeks, 60% recovery. Annual GMV at risk?`,
    hint1:         "Annual GMV at risk = churned users × AOV × orders per week × weeks. Then apply recovery rate.",
    hint2:         "980 × 420 × 1.8 × 52 = ₹3.84Cr. At 60% recovery = ₹2.30Cr.",
    correctSignals: ['cr', 'crore', 'lakh', '₹', '2.3', '2.30', '3.8', '3.84', 'recovery', '60'],
    successKey:    'impact_correct',
    maxAttempts:   3,
    vizType:       'impact',
    synthesisPrompt: "What's the one-line number you'd lead with in your memo to Priya?",
    synthesisPlaceholder: "₹2.30Cr recoverable GMV at 60% recovery rate, if we match Swiggy's Thursday Chinese promo within 2 weeks",
    synthesisMin:  40,
    synthesisColor: '#A78BFA',
    forcedAdvanceLesson: "Always present a range. ₹3.84Cr is the full exposure. ₹2.30Cr is the expected recovery at 60%. A single number without a recovery rate looks overconfident to a VP.",
  },
  {
    id:            'respond',
    number:        '06',
    title:         'Respond to Priya',
    arjunOpening:  "You've done the investigation. Now write it up. Priya has 30 seconds.",
    arjunQuestion: "Write your update to Priya. 4 sentences max. Start with the root cause.",
    hint1:         "Structure: (1) Root cause. (2) Evidence. (3) Scale. (4) Action.",
    hint2:         "Lead with the finding: 'The drop is driven by a Swiggy competitor promo in South Delhi Chinese category on Thursday...'",
    correctSignals: ['swiggy', 'competitor', 'promo', 'chinese', 'south delhi', 'thursday', '₹', 'cr', 'lakh', 'recovery'],
    successKey:    'memo_ready',
    maxAttempts:   3,
    vizType:       'none',
    synthesisPrompt: null,
    forcedAdvanceLesson: "Lead with the conclusion. The VP doesn't need methodology — they need: what broke, why you're certain, how much it costs, and what to do. In that order.",
  },
];

// ── Expert memo ───────────────────────────────────────────────────────────────
const ZOMATO_EXPERT_MEMO = {
  sentences: [
    {
      text:  "The 11.2% WoW GMV drop in South Delhi is driven by a Swiggy competitor promotion — 40% off Chinese orders on Thursday — pulling demand-side users before they open Zomato.",
      label: "CONCLUSION FIRST",
      color: "#FC8019",
    },
    {
      text:  "Thursday funnel confirms demand-side: Browse dropped 9pp (sessions fell, not null results) — users didn't search Chinese at all, ruling out supply failure.",
      label: "EVIDENCE",
      color: "#4F80FF",
    },
    {
      text:  "New users acquired during the promo week show 23pp lower D7 retention, putting ₹2.30Cr annualised GMV at risk at a 60% recovery rate.",
      label: "IMPACT — QUANTIFIED",
      color: "#A78BFA",
    },
    {
      text:  "Recommend: growth team to run a counter-promotion (₹50 off Chinese, South Delhi, Thursday–Friday) within 48 hours; set up competitive promo alerting for top-5 categories; review at Monday standup.",
      label: "ACTION — WHO / WHAT / WHEN",
      color: "#3DD68C",
    },
  ],
};

// ── Rubric ────────────────────────────────────────────────────────────────────
const ZOMATO_RUBRIC = {
  feedback: {
    gotRight: {
      sizing:        "You quantified the GMV impact with a recovery rate.",
      actionability: "You named a specific counter-action with a deadline.",
      structure:     "You led with the root cause — competitor promo in sentence one.",
    },
    sharpen: {
      sizing:        "Lead with ₹2.30Cr at 60% recovery before the narrative.",
      actionability: "'Counter the promo' is not actionable. Name the channel, the discount amount, and the deadline.",
      structure:     "Don't bury the finding. Priya needs: competitor promo → evidence → cost → action. In that order.",
    },
  },
  dimensions: {
    sizing: {
      keywords: ['cr', 'lakh', '₹', 'crore', 'recovery', '%', 'gmv', 'annualized', 'annual', 'weekly', '2.3', '3.8'],
    },
    actionability: {
      keywords: ['counter', 'promo', 'promotion', 'discount', 'growth', 'marketing', 'thursday', 'friday', 'within', 'by', 'hours', 'days'],
    },
    structure: {
      keywords: ['competitor', 'swiggy', 'promo', 'chinese', 'south delhi', 'demand', 'browse', 'session'],
    },
  },
};

// ── Export ────────────────────────────────────────────────────────────────────
export const ZOMATO_CASE = {
  id:        'zomato',
  seed:      SEED,
  data:      deriveCaseData(SEED),
  milestones: ZOMATO_MILESTONES,
  predictions: {
    dashboard: {
      question:     "Arjun is about to pull trend data. Do you think the session drop happened suddenly on one specific day, or drifted down gradually?",
      options:      ["Sudden — broke on one specific day", "Gradual — drifted over the week", "Cyclical — follows a weekly pattern", "Random — no clear pattern"],
      correctIndex: 0,
      arjunActual:  "Sudden. Wednesday is normal. Thursday breaks. That's an event — almost certainly a competitor action.",
      explanation:  "Sudden drops on a specific day point to an external event. Gradual drifts point to structural decay. Competitor promos are always sudden.",
    },
    funnel: {
      question:     "Which stage do you think will show the biggest anomaly?",
      options:      ["Browse — users aren't searching", "Add-to-Cart — items unavailable", "Checkout — payment issues", "Can't tell without the data"],
      correctIndex: 0,
      arjunActual:  "Browse. Demand drops kill Browse. Supply drops kill Add-to-Cart. This is a demand problem.",
      explanation:  "Browse stage anomalies = demand-side. Add-to-Cart anomalies = supply-side. The stage tells you the cause before you even read the root cause.",
    },
    rootcause: {
      question:     "Before Arjun shows the cohort data — do you think the retention cliff started recently or has been building?",
      options:      ["Recently — last 1-2 weeks", "Building for 4-6 weeks", "Sudden this week only", "Been declining all year"],
      correctIndex: 2,
      arjunActual:  "Sudden this week only. Competitor promos create a sharp cliff, not a gradual slope. One bad week, then it stabilises.",
      explanation:  "Competitor promos create sudden cohort cliffs. Structural product problems create gradual slopes. The shape of the cohort drop tells you the cause.",
    },
  },
  arjunExpertMemo: ZOMATO_EXPERT_MEMO,
  rubric:          ZOMATO_RUBRIC,
};

validateCase(ZOMATO_CASE);
