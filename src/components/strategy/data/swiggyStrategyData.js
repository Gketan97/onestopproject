// src/components/strategy/data/swiggyStrategyData.js
// CP9: Hypothesis tree data added for M2.5
// HYPOTHESIS_TREE: 3 buckets (demand/supply/platform)
// HYPOTHESIS_PROMPTS: Arjun's 3-step prompts
// HYPOTHESIS_QUERY_REACTIONS: step 3 responses
// M2.5 'hypothesis' milestone inserted between dashboard and funnel

// ── KPI Scorecard ─────────────────────────────────────────────────────────────
export const KPI_DATA = {
  gmv: {
    label: 'Gross Merchandise Value',
    short: 'GMV',
    current: '₹2.14Cr',
    prev: '₹2.33Cr',
    delta: -8.3,
    unit: '₹Cr',
    alert: true,
    detail: 'WoW vs last Tuesday',
    currentNum: 2.14,
    prevNum: 2.33,
    definition: 'Total rupee value of all completed orders. If 1,000 orders × ₹214 AOV = ₹2.14Cr GMV.',
  },
  conversion: {
    label: 'Order Conversion Rate',
    short: 'Conversion',
    current: '11.2%',
    prev: '13.8%',
    delta: -2.6,
    unit: '%',
    alert: true,
    detail: 'App open → placed',
    currentNum: 11.2,
    prevNum: 13.8,
    definition: 'Of every 100 users who open the app, how many place an order. 11.2% means ~11 out of 100 convert.',
  },

  fleet: {
    label: 'Active Delivery Fleet',
    short: 'Active Fleet',
    current: '1,204',
    prev: '1,198',
    delta: +0.5,
    unit: '',
    alert: false,
    detail: 'Peak hour avg',
    currentNum: 1204,
    prevNum: 1198,
    definition: 'Number of delivery partners actively accepting orders during peak hours in North Bangalore.',
  },
  delivery_time: {
    label: 'Avg Delivery Time',
    short: 'Delivery Time',
    current: '34 min',
    prev: '28 min',
    delta: +21.4,
    unit: 'min',
    alert: false,
    detail: 'Door-to-door avg',
    currentNum: 34,
    prevNum: 28,
    definition: "Average time from order placement to delivery at the customer's door, in minutes.",
  },
  ratings: {
    label: 'Restaurant Ratings',
    short: 'Avg Rating',
    current: '4.1',
    prev: '4.2',
    delta: -2.4,
    unit: '',
    alert: false,
    detail: 'Avg across active restaurants',
    currentNum: 4.1,
    prevNum: 4.2,
    definition: 'Average star rating across all active restaurants in North Bangalore on the platform.',
  },
  support_tickets: {
    label: 'Support Tickets',
    short: 'Support Tickets',
    current: '1,840',
    prev: '1,508',
    delta: +22.0,
    unit: '',
    alert: false,
    detail: 'Opened this week',
    currentNum: 1840,
    prevNum: 1508,
    definition: 'Number of customer service tickets opened — complaints, refund requests, missing item reports.',
  },
  session_duration: {
    label: 'Session Duration',
    short: 'Session Time',
    current: '4m 50s',
    prev: '4m 12s',
    delta: +15.1,
    unit: 'min',
    alert: false,
    detail: 'Avg per app session',
    currentNum: 4.83,
    prevNum: 4.2,
    definition: 'Average time a user spends in the app per session — from open to close or order placed.',
  },
 search_null_rate: {
  label: 'Search Null Rate',
  short: 'Search Null Rate',
  current: '14.2%',
  prev: '4.1%',
  delta: +10.1,
  unit: '%',
  alert: true,
  detail: '% searches returning 0 results',
  currentNum: 14.2,
  prevNum: 4.1,
  definition: '% of searches returning 0 results. A spike here means users are searching for restaurants or dishes that aren\'t available — classic supply-side signal.',
},
store_switchoff: {
  label: 'Store Switch-off %',
  short: 'Store Switch-off',
  current: '18.4%',
  prev: '5.2%',
  delta: +13.2,
  unit: '%',
  alert: true,
  detail: '% restaurants toggling offline',
  currentNum: 18.4,
  prevNum: 5.2,
  definition: '% of restaurants manually toggling "Offline" on the merchant app. A 13-point spike is merchants self-selecting out — not a platform bug.',
},
  payment_success: {
    label: 'Payment Success Rate',
    short: 'Payment Success',
    current: '91.4%',
    prev: '93.5%',
    delta: -2.1,
    unit: '%',
    alert: false,
    detail: 'Checkout → payment complete',
    currentNum: 91.4,
    prevNum: 93.5,
    definition: 'Of users who reach checkout, what % successfully complete payment.',
  },
};

// ── Arjun KPI click responses ─────────────────────────────────────────────────
export const ARJUN_KPI_RESPONSES = {
  gmv: {
    immediate: "GMV is the number Priya is worried about — but it's the outcome, not the cause. It dropped because something else broke first. What metric tells you where users stopped?",
    followUp: "Think of GMV as the score at the end of the game. Conversion rate is the play-by-play. Which one tells you what actually happened?",
    redirectTo: 'conversion',
    conceptTrigger: 'lead_lag',
  },
  conversion: {
    immediate: "Right call. Conversion is the lead indicator — it dropped 2.6 points, from 13.8% to 11.2%. Users are opening the app but not placing orders. That's where the story is.",
    followUp: "Now the question is: where in the funnel are they dropping off? Is it before they find a restaurant, at the cart, or at payment?",
    redirectTo: null,
    conceptTrigger: null,
    isCorrect: true,
  },
 
  fleet: {
    immediate: "Good instinct to check — but fleet is actually up 0.5%. That's an exonerating signal. If supply were the problem, delivery partners would be underutilised.",
    followUp: "Fleet being stable means the issue is on the demand side or the conversion path. Where would you look next?",
    redirectTo: 'conversion',
    conceptTrigger: null,
  },
  delivery_time: {
    immediate: "Delivery time is up 6 minutes — worth flagging. But users are dropping off at Add-to-Cart, before they've even placed an order. You can't be put off by delivery time before you've ordered.",
    followUp: "Slow delivery is a consequence, not a cause. What's happening earlier in the journey?",
    redirectTo: 'conversion',
    conceptTrigger: null,
  },
  ratings: {
    immediate: "A 0.1 drop in ratings is noise — ratings move this much every week from random variance. This isn't signal territory for a Tuesday incident.",
    followUp: "If restaurant quality caused this, you'd expect a much larger swing and a gradual decline, not a sudden Tuesday break. What gives you faster signal?",
    redirectTo: 'conversion',
    conceptTrigger: null,
  },
  support_tickets: {
    immediate: "Support tickets up 22% tells you users are frustrated — but it's a consequence, not a cause. You need to know why they're frustrated before tickets help you.",
    followUp: "What metric gives you the same signal faster and quantitatively?",
    redirectTo: 'conversion',
    conceptTrigger: null,
  },
  session_duration: {
    immediate: "This is the most interesting distractor. Users are spending 38 seconds more per session — but converting less. They're browsing longer and leaving without ordering.",
    followUp: "More time, less conversion — that tension tells you they're not finding what they want. It's a discovery or availability problem. Which metric confirms that?",
    redirectTo: 'conversion',
    conceptTrigger: null,
  },
 search_null_rate: {
  immediate: "Search Null Rate at 14.2% — up 10 points — is the most damning supply signal in this dashboard. Users are searching and finding nothing. That's not a demand problem.",
  followUp: "If restaurants are offline, searches for those restaurants return zero results. This metric and Store Switch-off are telling the same story from two angles.",
  redirectTo: null,
  conceptTrigger: null,
  isCorrect: true,
},
store_switchoff: {
  immediate: "18.4% of restaurants toggled offline manually — up 13 points. Merchants don't do this randomly. Something made North Bangalore restaurants decide not to trade on Tuesday.",
  followUp: "Combine this with Search Null Rate spiking to 14.2% and you have both sides of the supply collapse: restaurants went dark, searches returned nothing.",
  redirectTo: null,
  conceptTrigger: null,
  isCorrect: true,
},
  payment_success: {
    immediate: "Payment success rate is worth checking — but look at the funnel: the big drop is at Add-to-Cart, before users even reach checkout. Payment failure can't explain a pre-checkout drop.",
    followUp: "If payment failure caused this, you'd see a healthy Add-to-Cart but a broken checkout-to-payment step. That's not what we're seeing.",
    redirectTo: 'conversion',
    conceptTrigger: null,
  },
};

// ── Hypothesis Tree — M2.5 ────────────────────────────────────────────────────
export const HYPOTHESIS_TREE = {
  demand: {
    label: 'Demand-side',
    color: '#4F80FF',
    icon: '📉',
    description: 'External factors reducing user intent to order',
    hypotheses: [
      { id: 'competitor_promo',  text: 'Competitor promotion — Zomato running a heavy discount in North Bangalore', probability: 'medium' },
      { id: 'price_sensitivity', text: 'Price sensitivity — recent AOV increase hitting an affordability threshold',  probability: 'low' },
      { id: 'weather',           text: 'Weather effect — unusually hot day reducing delivery appetite',               probability: 'low' },
      { id: 'holiday',           text: 'Pay-cycle effect — Tuesday wallet constraints after a weekend spend',         probability: 'low' },
      { id: 'search_ranking',    text: 'Search ranking change — key restaurants no longer surfacing in search',       probability: 'medium' },
    ],
  },
  supply: {
    label: 'Supply-side',
    color: '#FC8019',
    icon: '🏪',
    description: 'Restaurant or menu availability issues',
    hypotheses: [
      { id: 'restaurant_avail', text: 'Restaurant availability — key North Bangalore restaurants offline Tuesday',     probability: 'high' },
      { id: 'biryani_eta',      text: 'Biryani category ETAs — top reorder category showing 50+ min ETAs',            probability: 'high' },
      { id: 'menu_quality',     text: 'Menu quality — missing photos or descriptions, users not adding to cart',      probability: 'medium' },
      { id: 'new_onboarding',   text: 'Restaurant onboarding drop — fewer new options for first-time users',          probability: 'medium' },
    ],
  },
  platform: {
    label: 'Platform-side',
    color: '#A78BFA',
    icon: '📱',
    description: 'App, tech, or algorithm changes',
    hypotheses: [
      { id: 'app_bug',       text: 'App bug — Add-to-Cart button broken or slow for a specific user segment',      probability: 'medium' },
      { id: 'payment_gw',   text: 'Payment gateway — partial outage increasing checkout failure rate',             probability: 'low' },
      { id: 'notification', text: 'Notification suppression — push notifications disabled for a cohort',          probability: 'low' },
      { id: 'search_algo',  text: 'Search algorithm change — personalization update showing wrong results',        probability: 'medium' },
    ],
  },
};

// Arjun's prompt text for each of the 3 hypothesis tree steps
export const HYPOTHESIS_PROMPTS = {
  step1_arjun: "Conversion dropped 2.6 points. Before I pull a single query — list every reason you can think of why that might happen. Go wide. Don't filter yet. The more exhaustive, the better.",
  step1_placeholder: "Maybe the restaurants weren't available, or there was a Zomato promo, or the app had a bug on the Add-to-Cart button...",
  step1_hint: "Think in three buckets: demand (users don't want to order), supply (restaurants aren't available), platform (app got in the way).",
  step1_minChars: 80,

  step2_arjun: "Good. Here's the full taxonomy — I've organised everything into three buckets and added what you might have missed. Now rank your top 3 by probability for THIS specific drop: North Bangalore, Tuesday, new users dropping at Add-to-Cart.",
  step2_hint: "The pattern — city-specific, Add-to-Cart, new users, started Week 3 — should tell you which bucket is most likely.",

  step3_arjun: "You've ranked supply-side highest. Right call given the pattern. What's the first query you'd run to confirm or reject that hypothesis? Describe it in plain English — what data, what time window, what comparison.",
  step3_placeholder: "I'd pull the conversion funnel for North Bangalore this week vs last week to see exactly where in the journey users are dropping off...",
  step3_minChars: 50,
  step3_hint: "The fastest query to confirm a supply hypothesis is the conversion funnel — if restaurants are unavailable, users drop at Add-to-Cart, not at checkout.",
};

// What Arjun says after user describes their step 3 query
export const HYPOTHESIS_QUERY_REACTIONS = {
  funnel:  "Right call. The funnel is the fastest path to confirming a supply hypothesis — if restaurants are unavailable, users drop at Add-to-Cart specifically. Let's pull it.",
  cohort:  "Smart instinct — but I'd start with the funnel first to locate the exact drop stage, then cohort to understand who. Funnel first gives you the answer faster. Let's go.",
  payment: "Worth checking payment — but the funnel will tell us more. If the drop is at Add-to-Cart (before checkout), payment can't be the cause. Let's look at the funnel first.",
  generic: "Good instinct. The funnel is the shortest path to confirming or rejecting a supply hypothesis. Let's pull it and see where users are actually stopping.",
};

// ── Day-by-day trend ──────────────────────────────────────────────────────────
export const DAILY_TREND = [
  { day: 'Mon Jan 20', orders: 9820,  gmv: 2.28, conversion: 13.6 },
  { day: 'Tue Jan 21', orders: 11580, gmv: 2.33, conversion: 13.8 },
  { day: 'Wed Jan 22', orders: 9640,  gmv: 2.19, conversion: 13.2 },
  { day: 'Thu Jan 23', orders: 9210,  gmv: 2.11, conversion: 12.9 },
  { day: 'Fri Jan 24', orders: 10840, gmv: 2.41, conversion: 14.1 },
  { day: 'Sat Jan 25', orders: 12200, gmv: 2.71, conversion: 14.8 },
  { day: 'Sun Jan 26', orders: 13100, gmv: 2.89, conversion: 15.2 },
  { day: 'Mon Jan 27', orders: 9540,  gmv: 2.18, conversion: 13.3 },
  { day: 'Tue Jan 28', orders: 9440,  gmv: 2.14, conversion: 11.2, alert: true },
  { day: 'Wed Jan 29', orders: 8980,  gmv: 2.01, conversion: 10.8, alert: true },
  { day: 'Thu Jan 30', orders: 8840,  gmv: 1.98, conversion: 10.6, alert: true },
  { day: 'Fri Jan 31', orders: 9920,  gmv: 2.19, conversion: 11.8, alert: true },
  { day: 'Sat Feb 1',  orders: 10800, gmv: 2.38, conversion: 12.4, alert: true },
  { day: 'Sun Feb 2',  orders: 11200, gmv: 2.46, conversion: 12.9, alert: true },
];

// ── Funnel data ───────────────────────────────────────────────────────────────
export const FUNNEL_THIS_WEEK = [
  { stage: 'App Open',     users: 84200, pct: 100,  dropLabel: null },
  { stage: 'Search',       users: 61400, pct: 72.9, dropLabel: '-27.1%' },
  { stage: 'Menu View',    users: 38800, pct: 63.2, dropLabel: '-36.8%' },
  { stage: 'Add to Cart',  users: 17200, pct: 44.3, dropLabel: '-55.7%', alert: true },
  { stage: 'Checkout',     users: 12100, pct: 70.3, dropLabel: '-29.7%' },
  { stage: 'Payment',      users: 9440,  pct: 78.0, dropLabel: '-22.0%' },
  { stage: 'Order Placed', users: 9440,  pct: 100,  dropLabel: null },
];

export const FUNNEL_LAST_WEEK = [
  { stage: 'App Open',     users: 81600, pct: 100  },
  { stage: 'Search',       users: 60100, pct: 73.7 },
  { stage: 'Menu View',    users: 41200, pct: 68.6 },
  { stage: 'Add to Cart',  users: 23800, pct: 57.8 },
  { stage: 'Checkout',     users: 17200, pct: 72.3 },
  { stage: 'Payment',      users: 14100, pct: 82.0 },
  { stage: 'Order Placed', users: 11580, pct: 100  },
];

export const FUNNEL_NEW_USERS = [
  { stage: 'App Open',     users: 28400, pct: 100  },
  { stage: 'Search',       users: 18900, pct: 66.5 },
  { stage: 'Menu View',    users: 10200, pct: 54.0 },
  { stage: 'Add to Cart',  users: 3800,  pct: 37.3, alert: true },
  { stage: 'Checkout',     users: 2400,  pct: 63.2 },
  { stage: 'Payment',      users: 1860,  pct: 77.5 },
  { stage: 'Order Placed', users: 1860,  pct: 100  },
];

export const FUNNEL_RETURNING_USERS = [
  { stage: 'App Open',     users: 55800, pct: 100  },
  { stage: 'Search',       users: 42500, pct: 76.2 },
  { stage: 'Menu View',    users: 28600, pct: 67.3 },
  { stage: 'Add to Cart',  users: 13400, pct: 46.9 },
  { stage: 'Checkout',     users: 9700,  pct: 72.4 },
  { stage: 'Payment',      users: 7580,  pct: 78.1 },
  { stage: 'Order Placed', users: 7580,  pct: 100  },
];

export const SEGMENTATION_INSIGHT = {
  query: "Break the funnel down by new users vs returning users. Same time period.",
  queryReasoning: "The aggregate funnel hides who is dropping off. New users and returning users behave completely differently.",
  finding: "New user Add-to-Cart conversion is 37.3% vs 46.9% for returning users. The gap widened this week. New users are browsing but not finding what they want.",
};

// ── Cohort Matrix ─────────────────────────────────────────────────────────────
export const COHORT_HEADERS = ['Cohort', 'Size', 'W1', 'W2', 'W3', 'W4', 'W5', 'W6'];

export const COHORT_ROWS = [
  { cohort: 'Week 1 (Jan 6)',  size: 3240, retention: [100, 58, 44, 38, 32, 28, 25], trend: 'stable' },
  { cohort: 'Week 2 (Jan 13)', size: 2980, retention: [100, 55, 41, 35, 28, 23, null], trend: 'stable' },
  { cohort: 'Week 3 (Jan 20)', size: 3410, retention: [100, 52, 38, 30, 22, null, null], trend: 'drop' },
  { cohort: 'Week 4 (Jan 27)', size: 2760, retention: [100, 48, 31, 21, null, null, null], trend: 'drop', alert: true },
  { cohort: 'Week 5 (Feb 3)',  size: 2590, retention: [100, 44, 28, null, null, null, null], trend: 'drop', alert: true },
  { cohort: 'Week 6 (Feb 10)', size: 2410, retention: [100, 38, null, null, null, null, null], trend: 'drop', alert: true },
];

export const COHORT_NARRATION = {
  query: "Show me new user cohort retention for North Bangalore, weekly, last 6 cohorts.",
  queryReasoning: "The funnel told me new users are dropping at Add-to-Cart. Now I want to know if this is a one-week problem or a trend.",
  observation: "Weeks 4, 5, 6 all show declining W1 retention. This isn't a one-week blip — it's been building since Week 3.",
};

// ── Impact Sizing ─────────────────────────────────────────────────────────────
export const IMPACT_SIZING = {
  churnedUsers: 820,
  avgOrderValue: 385,
  ordersPerWeek: 2.1,
  weeksInYear: 52,
  recoveryRate: 0.65,
  answer: { weekly: '₹6.65L', monthly: '₹26.6L', annual: '₹3.19Cr', conservative: '₹2.07Cr' },
};

// ── Milestones — 7 total (includes M2.5 hypothesis) ──────────────────────────
export const MILESTONES = [
  {
    id: 'scope',
    number: '01',
    title: 'Scope the Problem',
    subtitle: 'Before touching any data',
    description: 'Define exactly what question you are answering.',
    arjunOpening: "Before I pull a single number — what do we actually know for certain? Priya said orders dropped 8.3%. But I have two questions before I touch any data. First: is this platform-wide or specific to North Bangalore? Second: compared to what — last Tuesday, or a rolling average?",
    interactionModel: 'text_input',
    arjunQuestion: "Don't pull any data yet. Tell me: what's the minimum set of facts you'd want to confirm before you start querying? What are you assuming vs what do you know for certain?",
    hint1: "Think about geography, time window, and baseline.",
    hint2: "Is this drop in one city or everywhere? Is Tuesday normally different from other days?",
  },
  {
    id: 'dashboard',
    number: '02',
    title: 'Read the Dashboard',
    subtitle: 'Make the first prioritisation call',
    description: 'Ten metrics. Two are in distress. One is the lead indicator. Which do you investigate first?',
    arjunOpening: "Alright — here's the live data. Ten metrics. Before you click anything, write down which one you'd investigate first and why.",
    interactionModel: 'reasoning_then_clickable_kpi',
    arjunQuestion: "Two of these metrics are in trouble. One of them caused the others to move. Which one do you investigate first?",
    hint1: "Think about lead vs lag indicators.",
    hint2: "Fleet tells you something important even though it looks fine.",
  },
  {
    id: 'hypothesis',
    number: '02.5',
    title: 'Build the Hypothesis Tree',
    subtitle: 'Think before you query',
    description: 'List every possible cause. Rank by probability. Decide what to query first. This is the step most analysts skip.',
    arjunOpening: "Conversion dropped 2.6 points. Before I pull a single query — I want your hypotheses first.",
    interactionModel: 'hypothesis_tree',
    arjunQuestion: "List every reason you can think of. Go wide. Don't filter yet.",
    hint1: "Think in three buckets: demand-side, supply-side, platform-side.",
    hint2: "North Bangalore, Tuesday, new users at Add-to-Cart. Which bucket does that pattern point to?",
  },
  {
    id: 'funnel',
    number: '03',
    title: 'Diagnose the Funnel',
    subtitle: 'Follow the thread through the data',
    description: 'You know conversion dropped. Now find where in the journey users are falling off — and which users.',
    arjunOpening: "You called it — supply-side, funnel first. Here's what I'd query:",
    interactionModel: 'query_then_input',
    arjunQuestion: "Look at the funnel. Before I segment by user type — tell me which drop looks most anomalous, and why that specific stage matters.",
    hint1: "Compare each stage's drop this week vs last week. One stage has a much larger change.",
    hint2: "Add-to-Cart dropped from 57.8% to 44.3% — a 13.5 point swing. Why would users browse menus but not add to cart?",
  },
  {
    id: 'rootcause',
    number: '04',
    title: 'Find the Root Cause',
    subtitle: 'Form and test a hypothesis',
    description: 'You have evidence. Now form a specific, falsifiable hypothesis.',
    arjunOpening: "We know: new users are dropping at Add-to-Cart, the pattern started Week 3, and it's been worsening. What's your hypothesis?",
    interactionModel: 'hypothesis_input',
    arjunQuestion: "State your hypothesis in one sentence. Be specific: what changed, for whom, when, and why.",
    hint1: "What could cause new users specifically to browse menus but not add anything to their cart?",
    hint2: "If Biryani restaurants had reduced availability starting Week 3, new users would browse but not commit.",
  },
  {
    id: 'impact',
    number: '05',
    title: 'Size the Impact',
    subtitle: 'Quantify the recovery opportunity',
    description: 'A hypothesis without numbers is an opinion.',
    arjunOpening: "Your hypothesis is defensible. Now Priya needs a number. Let's build it.",
    interactionModel: 'calculation_input',
    arjunQuestion: "Use these inputs: 820 churned new users, ₹385 AOV, 2.1 orders/week, 52 weeks. Annual GMV at risk?",
    hint1: "Annual GMV at risk = churned users × AOV × orders per week × weeks. Then apply a recovery rate.",
    hint2: "820 × 385 × 2.1 × 52 = ₹3.46Cr. At 65% recovery = ₹2.25Cr.",
  },
  {
    id: 'respond',
    number: '06',
    title: 'Respond to Priya',
    subtitle: 'Synthesis and communication',
    description: 'Write the update Priya needs. Conclusion first.',
    arjunOpening: "You've done the investigation. Now write it up in 4 sentences. Priya has 30 seconds.",
    interactionModel: 'memo_input',
    arjunQuestion: "Write your update to Priya. 4 sentences max. Start with the root cause.",
    hint1: "Structure: (1) Root cause. (2) Evidence. (3) Scale. (4) Action.",
    hint2: "Lead with the finding: 'The drop is driven by Biryani restaurant availability in North Bangalore...'",
  },
];

// ── Predictions ───────────────────────────────────────────────────────────────
export const PREDICTIONS = {
  dashboard: {
    question: "Arjun is about to pull trend data. Do you think the conversion drop happened suddenly on one specific day, or drifted down gradually?",
    options: ["Sudden — broke on one specific day", "Gradual — drifted down over the week", "Cyclical — follows a weekly pattern", "Random — no clear pattern"],
    correctIndex: 0,
    arjunActual: "Sudden. Monday Jan 27 is normal. Tuesday Jan 28 breaks. That's an event, not a drift.",
    explanation: "Sudden drops point to a specific change. Gradual drifts point to structural decay. These require completely different investigations.",
  },
  funnel: {
    question: "Arjun is about to segment the funnel by new vs returning users. Which group do you think is driving the drop more?",
    options: ["New users — they're churning faster", "Returning users — they're ordering less", "Both equally", "Can't tell without the data"],
    correctIndex: 0,
    arjunActual: "New users. Add-to-Cart for new users dropped to 37.3% — 9 points below returning users.",
    explanation: "If availability changes, new users are impacted first — they don't have favourite restaurants or learned shortcuts.",
  },
  rootcause: {
    question: "Before Arjun shows the cohort data — do you think the retention cliff started recently (last 2 weeks) or has been building for longer?",
    options: ["Recently — last 2 weeks", "Building for 4-6 weeks", "Sudden this week only", "Been declining all year"],
    correctIndex: 1,
    arjunActual: "Building since Week 3 — about 4-5 weeks. It's been worsening each cohort.",
    explanation: "A 4-6 week build suggests something structural changed — like a restaurant supply shift that's been quietly worsening.",
  },
};

// ── Concepts ──────────────────────────────────────────────────────────────────
export const CONCEPTS = {
  lead_lag: {
    id: 'lead_lag',
    title: 'Lead vs Lag Indicators',
    oneLiner: 'A lag indicator tells you what happened. A lead indicator tells you why.',
    explanation: 'GMV is a lag indicator. Conversion rate is a lead indicator — it shows where in the journey users stopped.',
    example: 'Conversion dropped first and caused the GMV drop — not the other way around.',
    color: '#4F80FF',
  },
  funnel_reading: {
    id: 'funnel_reading',
    title: 'How to Read a Funnel',
    oneLiner: 'The interesting number is the change vs baseline, not the absolute drop.',
    explanation: "Every funnel loses users at every step — that's normal. What you're looking for is a step that dropped significantly more than it did last week.",
    example: 'Add-to-Cart dropped 13.5 points. Search to Menu View dropped 5 points. Add-to-Cart is the anomaly.',
    color: '#FC8019',
  },
  cohort_analysis: {
    id: 'cohort_analysis',
    title: 'What Cohort Analysis Shows',
    oneLiner: 'A cohort groups users by when they first ordered. Retention shows how many came back.',
    explanation: "Each row is a group of users who placed their first order in a specific week. Declining W1 retention means new users are churning faster.",
    example: "Week 1 cohort: 58% returned in W1. Week 6 cohort: only 38%.",
    color: '#3DD68C',
  },
  impact_sizing: {
    id: 'impact_sizing',
    title: 'How to Size Revenue Impact',
    oneLiner: 'Always present a range: expected (65% recovery), conservative (40%). Never 100%.',
    explanation: "When you fix a problem, you never recover all the lost revenue. A realistic recovery rate gives a credible number.",
    example: "Total at risk: ₹3.19Cr. At 65% recovery: ₹2.07Cr. That's the number for Priya.",
    color: '#A78BFA',
  },
  pyramid_principle: {
    id: 'pyramid_principle',
    title: 'Pyramid Principle — Lead with the Conclusion',
    oneLiner: 'Start with what you found. Then why. Then how you know.',
    explanation: "State your recommendation first, then supporting evidence. Senior leaders don't have time to read methodology before the conclusion.",
    example: "Wrong: 'After analysing the funnel...' Right: 'The drop is driven by Biryani restaurant availability...'",
    color: '#F38BA8',
  },
};

// ── Arjun Phase 1 system prompt ───────────────────────────────────────────────
export const ARJUN_PHASE1_SYSTEM = `You are Arjun, a Staff Product Analyst at Swiggy. You are leading a junior analyst through a live incident investigation.

Voice rules:
- Never say: score, gap, covered, missed, framework, assessment, correct, incorrect, well done, great job
- Sound like a sharp senior colleague, not a teacher
- Keep responses under 4 sentences
- Always end with a question or a next action`;

// ── NL Query Routes ───────────────────────────────────────────────────────────
export const NL_QUERY_ROUTES = [
  { keywords: ['funnel', 'conversion', 'drop-off', 'where', 'step', 'stage'], type: 'funnel', arjunKey: 'funnel_shown' },
  { keywords: ['cohort', 'retention', 'returning', 'repeat', 'churn', 'new users'], type: 'cohort', arjunKey: 'cohort_shown' },
  { keywords: ['impact', 'size', 'gmv', 'revenue', 'recover', '₹', 'how much'], type: 'impact', arjunKey: 'impact_shown' },
  { keywords: ['payment', 'failure', 'success rate', 'gateway'], type: 'funnel', arjunKey: 'payment_probe' },
];

// ── Arjun mock responses ──────────────────────────────────────────────────────
export const ARJUN_STRATEGY_MOCK = {
  triage_start: `Before we look at any data, let's be precise about scope. Priya said "orders dropped 8.3%" — but dropped where? Platform-wide, or North Bangalore specifically? And compared to what — last Tuesday, or a rolling average?`,
  triage_q1: `Good instinct to check geography first. North Bangalore is our highest density Biryani zone. If the drop is concentrated there, the root cause is almost certainly supply-side, not demand-side.`,
  triage_scope_incomplete: `You're on the right track — but I need two things confirmed before we touch data: the geography scope and the time baseline. Which of those is more uncertain to you?`,
  triage_hypothesis_wrong: `I'd push back on that. A platform bug would show up across all geographies uniformly. But Priya said North Bangalore specifically — that's too localised for a platform issue.`,
  triage_hypothesis_right: `Exactly. Geography-specific drops almost always point to supply-side or hyper-local demand signals.`,
  funnel_shown: `You can see the funnel now. Don't tell me where the biggest percentage drop is — that's a trap. Tell me which stage's drop is most unexpected given what you know about normal patterns.`,
  cart_drop_correct: `Right — the Add-to-Cart drop is the anomaly. But here's my challenge: is this a demand problem or a supply problem? If restaurants had fewer items available, users might browse but not find what they want.`,
  wrong_conclusion: `You concluded too fast. You noticed the Cart drop-off, but did you check whether it's uniform across new and returning users? Aggregate funnels hide the real story.`,
  cohort_shown: `Look at the Week 4 and Week 5 cohorts carefully. Their W1 retention is 44–48% — that's 10 points below the Jan 6 cohort. What changed in Week 4 that might have affected first-time experience?`,
  cohort_insight: `You've identified the retention cliff. Now size it. If we had retained the Week 4–6 cohorts at Week 1 baseline rates, how much incremental GMV does that represent?`,
  impact_shown: `Your sizing is in the right ballpark. But you're calculating at 100% fix — that's not realistic. Senior analysts present a range: best case, expected (65%), conservative (40%).`,
  impact_correct: `₹2–3Cr annual recovery is defensible. Now frame it for the VP: "fixing the Week 4–6 cohort churn unlocks ₹2Cr in recoverable GMV." That's the difference between a data pull and a recommendation.`,
  memo_ready: `Your investigation is complete. The memo captures: root cause (Biryani supply, North Bangalore), funnel evidence (Cart drop anomaly), cohort evidence (30% faster churn, Weeks 4–6), and the ₹2Cr recovery opportunity.`,
  payment_probe: `You noticed the payment failure rate. Good. But if payment failures caused the drop, you'd expect checkout-to-payment to be fine but payment-to-order to drop. Does the funnel support that?`,
  fallback: `Interesting angle. Before we go there — what's the business impact of being right about this? If your hypothesis is correct, what does that mean for the ₹2.14Cr GMV gap?`,
};

// ── Scenario ──────────────────────────────────────────────────────────────────
export const SCENARIO = {
  company: 'Swiggy',
  city: 'North Bangalore',
  metric: 'Orders',
  drop: '8.3%',
  period: 'WoW (Tuesday)',
  category: 'Biryani',
  priyaMessage: `Hey — orders in North Bangalore are down 8.3% week-over-week. Started Tuesday. GMV impact already ₹19L. Need a full breakdown by EOD. @you can you take point on this?`,
  priyaTime: '9:04 AM',
};