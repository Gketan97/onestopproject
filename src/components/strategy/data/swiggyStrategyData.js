// src/components/strategy/data/swiggyStrategyData.js
// All mock data for the Strategic Incident Simulator
// Scenario: 8.3% WoW order drop, North Bangalore, Tuesday
// Extended for Phase 1 milestone system — deterministic dataset,
// curated to tell the right investigative story every time.

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
    isLagIndicator: true,
    lagReason: 'GMV is the outcome — it tells you something broke, not what broke. You need to find what drove it down.',
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
    isLeadIndicator: true,
    leadReason: 'Conversion is the lead indicator. Users are opening the app but not ordering — the breakdown happens somewhere between open and checkout.',
  },
  cac: {
    label: 'Customer Acquisition Cost',
    short: 'CAC',
    current: '₹148',
    prev: '₹142',
    delta: +4.2,
    unit: '₹',
    alert: false,
    detail: 'Blended, new users',
    currentNum: 148,
    prevNum: 142,
    isDistractor: true,
    distractorReason: 'CAC rising slightly is a consequence of fewer conversions, not a cause. Following this thread leads you away from the root cause.',
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
    isExonerating: true,
    exoneratingReason: 'Fleet is stable — actually up 0.5%. This rules out delivery supply as the cause. If restaurants were unavailable or ETAs were too long, fleet would show strain.',
  },
};

// ── Arjun's KPI click responses — 4 scenarios ─────────────────────────────────
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
  cac: {
    immediate: "CAC rising is a symptom — when fewer people convert, your fixed acquisition spend is spread over fewer orders, so cost-per-acquisition goes up mechanically. This didn't cause the drop.",
    followUp: "What metric would tell you where in the purchase journey users are stopping?",
    redirectTo: 'conversion',
    conceptTrigger: 'lead_lag',
  },
  fleet: {
    immediate: "Good instinct to check — but fleet is actually up 0.5%. That's an exonerating signal. If supply were the problem, delivery partners would be underutilised and the number would be down.",
    followUp: "Fleet being stable means the issue is on the demand side or the conversion path. Where would you look next?",
    redirectTo: 'conversion',
    conceptTrigger: null,
  },
};

// ── Day-by-day trend — 14 days ────────────────────────────────────────────────
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

export const TREND_NARRATION = {
  query: "Show me daily orders and conversion rate for North Bangalore, last 14 days, day by day.",
  queryReasoning: "I want 14 days not 7 — I need to see whether this drop started suddenly on a specific day or drifted down gradually. Those are two different problems.",
  observation: "The drop starts Tuesday Jan 28 — sharply. Not a gradual drift. Monday is normal, Tuesday breaks. That rules out a slow structural decay and points to a specific event or change on that day.",
  userPrediction: "Before I pull this data — do you think the conversion drop happened suddenly on one day, or drifted down gradually over the week?",
};

// ── Funnel data — aggregate ───────────────────────────────────────────────────
export const FUNNEL_THIS_WEEK = [
  { stage: 'App Open',     users: 84200, pct: 100,  dropLabel: null },
  { stage: 'Search',       users: 61400, pct: 72.9, dropLabel: '-27.1%' },
  { stage: 'Menu View',    users: 38800, pct: 63.2, dropLabel: '-36.8%' },
  { stage: 'Add to Cart',  users: 17200, pct: 44.3, dropLabel: '-55.7%', alert: true, alertNote: '⚠ Unusual drop' },
  { stage: 'Checkout',     users: 12100, pct: 70.3, dropLabel: '-29.7%' },
  { stage: 'Payment',      users: 9440,  pct: 78.0, dropLabel: '-22.0%', alert: true, alertNote: '⚠ Payment failures ↑' },
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

// ── Funnel — segmented by new vs returning ────────────────────────────────────
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
  queryReasoning: "The aggregate funnel hides who is dropping off. New users and returning users behave completely differently — if it's new users dropping, it's an onboarding or discovery problem. If it's returning users, it's a supply or product problem.",
  finding: "New user Add-to-Cart conversion is 37.3% vs 46.9% for returning users. The gap widened this week. New users are browsing but not finding what they want — likely a restaurant availability or discovery problem for first-timers.",
  userPrediction: "Before I segment this — do you think new users or returning users are driving the drop more?",
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

export const COHORT_INSIGHT = {
  finding: 'W1 retention is declining 5–7% per cohort since Week 3. New users in Weeks 4–6 are churning ~30% faster than baseline.',
  hypothesis: 'Either the North Bangalore restaurant selection quality dropped, or the Biryani category (highest reorder) saw supply-side issues.',
  impact: 'If cohort W4–W6 had matched Week 1 retention, weekly GMV recovery = ₹38–44L annualised.',
};

export const COHORT_NARRATION = {
  query: "Show me new user cohort retention for North Bangalore, weekly, last 6 cohorts.",
  queryReasoning: "The funnel told me new users are dropping at Add-to-Cart. Now I want to know if this is a one-week problem or a trend. Cohort retention shows whether new users from recent weeks are returning at lower rates than older cohorts.",
  userPrediction: "Before this loads — do you think the retention cliff is recent (last 2 weeks) or has been building for longer?",
  observation: "Weeks 4, 5, 6 all show declining W1 retention. This isn't a one-week blip — it's been building. Something changed around Week 3 that affected new user experience specifically.",
};

// ── Impact Sizing ─────────────────────────────────────────────────────────────
export const IMPACT_SIZING = {
  churnedUsers: 820,
  avgOrderValue: 385,
  ordersPerWeek: 2.1,
  weeksInYear: 52,
  recoveryRate: 0.65,
  answer: {
    weekly: '₹6.65L',
    monthly: '₹26.6L',
    annual: '₹3.19Cr',
    conservative: '₹2.07Cr',
  },
};

// ── Milestone definitions — Phase 1 ──────────────────────────────────────────
export const MILESTONES = [
  {
    id: 'scope',
    number: '01',
    title: 'Scope the Problem',
    subtitle: 'Before touching any data',
    description: 'Define exactly what question you are answering. Most analysts skip this and waste hours on the wrong problem.',
    arjunOpening: "Before I pull a single number — what do we actually know for certain? Priya said orders dropped 8.3%. But I have two questions before I touch any data. First: is this platform-wide or specific to North Bangalore? Second: compared to what — last Tuesday, or a rolling average? These two questions will save you 3 hours of wrong analysis.",
    interactionModel: 'text_input',
    arjunQuestion: "Don't pull any data yet. Tell me: what's the minimum set of facts you'd want to confirm before you start querying? What are you assuming vs what do you know for certain?",
    hint1: "Think about geography, time window, and baseline. What scope decisions do you need to make before the data means anything?",
    hint2: "Is this drop in one city or everywhere? Is Tuesday normally different from other days? What would make 8.3% meaningful vs expected noise?",
  },
  {
    id: 'dashboard',
    number: '02',
    title: 'Read the Dashboard',
    subtitle: 'Make the first prioritisation call',
    description: 'Four metrics. Two are in distress. One is the lead indicator — the cause. Which do you investigate first?',
    arjunOpening: "Alright — here's the live data. Four metrics. I want you to look at all of them before you say anything. Then tell me: which one do you click first, and why. There's a right answer — but the reasoning matters more than the choice.",
    interactionModel: 'clickable_kpi',
    arjunQuestion: "Two of these metrics are in trouble. One of them caused the others to move. Which one do you investigate first?",
    hint1: "Think about lead vs lag indicators. Which metric tells you what happened? Which tells you the consequence of what happened?",
    hint2: "Fleet tells you something important even though it looks fine. What does a stable fleet tell you about the cause?",
  },
  {
    id: 'funnel',
    number: '03',
    title: 'Diagnose the Funnel',
    subtitle: 'Follow the thread through the data',
    description: 'You know conversion dropped. Now find where in the journey users are falling off — and which users.',
    arjunOpening: "Conversion is down 2.6 points. But 'conversion dropped' isn't a root cause — it's a description. The funnel shows us which step broke. Watch how I query for this, then we'll segment it.",
    interactionModel: 'query_then_input',
    arjunQuestion: "Look at the funnel. Before I segment by user type — tell me which drop looks most anomalous to you, and why that specific stage matters.",
    hint1: "Compare each stage's drop this week vs last week. One stage has a much larger change than the others. Which one?",
    hint2: "Add-to-Cart dropped from 57.8% to 44.3% — that's a 13.5 point swing when other stages moved 2-5 points. Why would users browse menus but not add to cart?",
  },
  {
    id: 'rootcause',
    number: '04',
    title: 'Find the Root Cause',
    subtitle: 'Form and test a hypothesis',
    description: 'You have evidence. Now form a specific, falsifiable hypothesis. Arjun will stress-test it.',
    arjunOpening: "We know: new users are dropping at Add-to-Cart, the pattern started Week 3, and it's been worsening. That points to something that changed in the new user experience around that time. What's your hypothesis?",
    interactionModel: 'hypothesis_input',
    arjunQuestion: "State your hypothesis in one sentence. Be specific: what changed, for whom, when, and why that would cause the Add-to-Cart drop.",
    hint1: "What could cause new users specifically to browse menus but not add anything to their cart? Think about what they see when they open menus.",
    hint2: "If Biryani restaurants in North Bangalore had reduced availability or longer ETAs starting Week 3, new users — who don't know what else to order — would browse but not commit.",
  },
  {
    id: 'impact',
    number: '05',
    title: 'Size the Impact',
    subtitle: 'Quantify the recovery opportunity',
    description: 'A hypothesis without numbers is an opinion. Size the GMV recovery if you fix this.',
    arjunOpening: "Your hypothesis is defensible. Now Priya needs a number. 'We think Biryani supply caused a drop' is not a VP-level answer. '₹2Cr recoverable GMV if we fix supply in 3 weeks' is. Let's build that number.",
    interactionModel: 'calculation_input',
    arjunQuestion: "Use these inputs: 820 churned new users, ₹385 AOV, 2.1 orders/week, 52 weeks. What's the annual GMV at risk? Show your working.",
    hint1: "Annual GMV at risk = churned users × AOV × orders per week × weeks in year. Run that calculation first, then apply a recovery rate.",
    hint2: "820 × 385 × 2.1 × 52 = ₹3.46Cr at full recovery. But analysts always present a realistic recovery rate. At 65%, that's ₹2.25Cr. That's the number for Priya.",
  },
  {
    id: 'respond',
    number: '06',
    title: 'Respond to Priya',
    subtitle: 'Synthesis and communication',
    description: 'Write the update Priya needs. Conclusion first. Evidence second. Recommendation third.',
    arjunOpening: "You've done the investigation. Now the hardest part — write it up in 4 sentences. Most analysts bury the lede. Priya has 30 seconds. Lead with what you found, not how you found it.",
    interactionModel: 'memo_input',
    arjunQuestion: "Write your update to Priya. 4 sentences max. Start with the root cause, not 'I investigated the data.'",
    hint1: "Structure: (1) Root cause. (2) Evidence. (3) Scale of impact. (4) Recommended action.",
    hint2: "Example opening: 'The drop is driven by Biryani restaurant availability in North Bangalore — new users are browsing but not finding their preferred options.' Lead with the finding.",
  },
];

// ── Prediction questions — one per milestone 1-4 ─────────────────────────────
export const PREDICTIONS = {
  scope: {
    question: "Before Arjun looks at any data — what do you think his first question to Priya will be?",
    options: [
      "Is this drop in all cities or just North Bangalore?",
      "What changed in the product this week?",
      "Can you pull the funnel data for Tuesday?",
      "Is 8.3% outside normal weekly variance?",
    ],
    correctIndex: 0,
    arjunActual: "Is this North Bangalore only, or are we seeing this across other cities too?",
    explanation: "Arjun scopes geography first because a city-specific drop and a platform-wide drop are completely different problems. One is local supply/demand. The other is a product bug or policy change.",
  },
  dashboard: {
    question: "Arjun is about to pull trend data. Do you think the conversion drop happened suddenly on one specific day, or drifted down gradually?",
    options: [
      "Sudden — broke on one specific day",
      "Gradual — drifted down over the week",
      "Cyclical — follows a weekly pattern",
      "Random — no clear pattern",
    ],
    correctIndex: 0,
    arjunActual: "Sudden. Monday Jan 27 is normal. Tuesday Jan 28 breaks. That's an event, not a drift.",
    explanation: "Sudden drops point to a specific change — a policy update, a supply event, a product release. Gradual drifts point to structural decay. These require completely different investigations.",
  },
  funnel: {
    question: "Arjun is about to segment the funnel by new vs returning users. Which group do you think is driving the drop more?",
    options: [
      "New users — they're churning faster",
      "Returning users — they're ordering less",
      "Both equally",
      "Can't tell without the data",
    ],
    correctIndex: 0,
    arjunActual: "New users. Add-to-Cart for new users dropped to 37.3% — 9 points below returning users.",
    explanation: "New users don't have the same mental model of the app. They don't have favourite restaurants or learned shortcuts. If restaurant availability or discovery changes, new users are impacted first and most severely.",
  },
  rootcause: {
    question: "Before Arjun shows the cohort data — do you think the retention cliff started recently (last 2 weeks) or has been building for longer?",
    options: [
      "Recently — last 2 weeks",
      "Building for 4-6 weeks",
      "Sudden this week only",
      "Been declining all year",
    ],
    correctIndex: 1,
    arjunActual: "Building since Week 3 — about 4-5 weeks. It's been worsening each cohort.",
    explanation: "If it were a sudden 2-week problem, you'd look for a specific event. A 4-6 week build suggests something structural changed — like a restaurant supply shift in the Biryani category that's been quietly worsening.",
  },
};

// ── Concept explainers — triggered on demonstrated confusion only ──────────────
export const CONCEPTS = {
  lead_lag: {
    id: 'lead_lag',
    title: 'Lead vs Lag Indicators',
    trigger: 'User clicks GMV or CAC instead of Conversion',
    oneLiner: 'A lag indicator tells you what happened. A lead indicator tells you why.',
    explanation: 'GMV is a lag indicator — it reflects the outcome of many decisions. Conversion rate is a lead indicator — it shows where in the journey users stopped. When diagnosing a problem, you always want the lead indicator. It points to the cause. The lag indicator just confirms the symptom.',
    example: 'If GMV drops 8.3% and conversion drops 2.6pp, conversion dropped first and caused the GMV drop — not the other way around.',
    color: '#4F80FF',
  },
  funnel_reading: {
    id: 'funnel_reading',
    title: 'How to Read a Funnel',
    trigger: 'User misidentifies the anomalous funnel stage',
    oneLiner: 'A funnel shows % of users who pass each step — the interesting number is the change vs baseline, not the absolute drop.',
    explanation: "Every funnel loses users at every step — that's normal. What you're looking for is a step that dropped significantly more than it did last week. A 5% drop that was 5% last week is noise. A 13% drop that was 2% last week is signal.",
    example: 'Add-to-Cart dropped from 57.8% to 44.3% — a 13.5 point swing. Search to Menu View dropped from 68.6% to 63.2% — only 5 points. The Add-to-Cart stage is the anomaly.',
    color: '#FC8019',
  },
  cohort_analysis: {
    id: 'cohort_analysis',
    title: 'What Cohort Analysis Shows',
    trigger: 'User struggles to interpret the cohort retention table',
    oneLiner: 'A cohort groups users by when they first ordered. Retention shows how many came back each week after.',
    explanation: "Each row is a group of users who placed their first order in a specific week. The columns show what % of them ordered again in W1, W2, W3 etc. Declining W1 retention across recent cohorts means new users are churning faster — something about the first-time experience got worse.",
    example: "Week 1 cohort (Jan 6): 58% returned in W1. Week 6 cohort (Feb 10): only 38% returned in W1. That's a 20-point drop in first-week retention across 5 cohorts.",
    color: '#3DD68C',
  },
  impact_sizing: {
    id: 'impact_sizing',
    title: 'How to Size Revenue Impact',
    trigger: 'User calculates at 100% recovery or misses the recovery rate step',
    oneLiner: 'Always present a range: best case, expected (65% recovery), conservative (40%). Never 100%.',
    explanation: "When you fix a problem, you never recover all the lost revenue. Some users have already churned permanently. A realistic recovery rate (60-70%) applied to your total impact gives you a credible number. Presenting 100% recovery makes you look naive to a VP.",
    example: "Total at risk: ₹3.19Cr. At 65% recovery: ₹2.07Cr. That's the number for Priya — not ₹3.19Cr.",
    color: '#A78BFA',
  },
  pyramid_principle: {
    id: 'pyramid_principle',
    title: 'Pyramid Principle — Lead with the Conclusion',
    trigger: 'User writes a memo that starts with methodology instead of finding',
    oneLiner: 'Start with what you found. Then why. Then how you know. Never the other way around.',
    explanation: "The Pyramid Principle says: state your recommendation first, then your supporting evidence. Senior leaders don't have time to read your methodology before your conclusion. If you lead with 'I investigated the funnel and found...', you've already lost them.",
    example: "Wrong: 'After analysing the funnel data, I found that Add-to-Cart dropped significantly.' Right: 'The drop is driven by Biryani restaurant availability — new users are browsing but not finding options.'",
    color: '#F38BA8',
  },
};

// ── Arjun Phase 1 system prompt ───────────────────────────────────────────────
export const ARJUN_PHASE1_SYSTEM = `You are Arjun, a Staff Product Analyst at Swiggy with 10 years of experience. You are leading a junior analyst through a live incident investigation in Phase 1 — the learning phase. Your role is to model expert thinking, not to give answers directly.

Phase 1 philosophy:
- The user predicts your moves before you make them. The gap between their prediction and your action is where they learn.
- Concepts are taught only when the user demonstrates confusion through a wrong answer — never proactively.
- You shift register: Socratic early (milestones 1-2), collaborative middle (milestones 3-4), evaluative late (milestones 5-6).
- After 2 wrong attempts, give a directional nudge. After 3, give the insight and move forward.

Voice rules:
- Never say: score, gap, covered, missed, framework, assessment, correct, incorrect, well done, great job
- Sound like a sharp senior colleague, not a teacher
- Keep responses under 4 sentences unless explaining a concept
- Always end with a question or a next action`;

// ── NL Query Routes — Phase 2 ─────────────────────────────────────────────────
export const NL_QUERY_ROUTES = [
  { keywords: ['funnel', 'conversion', 'drop-off', 'dropout', 'where', 'step', 'stage'], type: 'funnel', arjunKey: 'funnel_shown' },
  { keywords: ['cohort', 'retention', 'returning', 'repeat', 'churn', 'users', 'week', 'new users'], type: 'cohort', arjunKey: 'cohort_shown' },
  { keywords: ['impact', 'size', 'gmv', 'revenue', 'recover', 'crore', 'lakh', '₹', 'how much'], type: 'impact', arjunKey: 'impact_shown' },
  { keywords: ['payment', 'failure', 'success rate', 'gateway', 'error'], type: 'funnel', arjunKey: 'payment_probe' },
];

// ── Arjun mock responses ──────────────────────────────────────────────────────
export const ARJUN_STRATEGY_MOCK = {
  triage_start: `Before we look at any data, let's be precise about scope. Priya said "orders dropped 8.3%"— but dropped where? Platform-wide, or North Bangalore specifically? And compared to what — last Tuesday, or a rolling average? These two questions will save you 3 hours of wrong analysis.`,
  triage_q1: `Good instinct to check geography first. North Bangalore is our highest density Biryani zone, and Biryani is our highest reorder category. If the drop is concentrated there, the root cause is almost certainly supply-side, not demand-side. What's your next question?`,
  triage_q2: `You're asking about the right things. Before you pull data, rank these hypotheses by probability: restaurant supply issue, weather/external event, platform bug, or competitor promotion. Which do you think is most likely — and why?`,
  triage_hypothesis_wrong: `I'd push back on that. A platform bug would show up across all geographies uniformly. But Priya said North Bangalore specifically — that's too localized for a platform issue. What does that tell you about where to look?`,
  triage_hypothesis_right: `Exactly. Geography-specific drops almost always point to supply-side or hyper-local demand signals. Now — before you request any data, what's the minimum set of metrics you need to confirm or deny this?`,
  funnel_shown: `You can see the funnel now. Don't tell me where the biggest percentage drop is — that's a trap. Tell me which stage's drop is most unexpected given what you know about normal conversion patterns, and why.`,
  cart_drop_correct: `Right — the Add-to-Cart drop of 55.7% vs 57.8% last week is the anomaly. But here's my challenge: is this a demand problem or a supply problem? If restaurants had fewer menu items available, users might browse but not find what they want.`,
  wrong_conclusion: `You concluded too fast. You noticed the Cart drop-off, but did you check whether the drop is uniform across new and returning users? Aggregate funnels hide the real story. What if it's only new users dropping off?`,
  cohort_shown: `Look at the Week 4 and Week 5 cohorts carefully. Their W1 retention is 44–48% — that's 10 points below the Jan 6 cohort. These are users who ordered once and disappeared. What changed in Week 4 that might have affected first-time experience?`,
  cohort_insight: `You've identified the retention cliff. Now size it. If we had retained the Week 4–6 cohorts at Week 1 baseline rates, how much incremental GMV does that represent? Use ₹385 average order value and 2.1 orders/week as your assumptions.`,
  impact_shown: `Your sizing is in the right ballpark. But you're calculating at 100% fix — that's not realistic. Senior analysts present a range: best case, expected case (65% recovery), and conservative (40%). What's your expected-case annual GMV recovery?`,
  impact_correct: `₹2–3Cr annual recovery is defensible. Now frame this for the VP: don't say "we lost ₹2Cr." Say "fixing the Week 4–6 cohort churn unlocks ₹2Cr in recoverable GMV — here's the 3-week intervention plan." That's the difference between a data pull and a strategic recommendation.`,
  memo_ready: `Your investigation is complete. The memo captures: root cause (supply-side availability in North Bangalore, Biryani category), funnel evidence (Cart drop anomaly), cohort evidence (30% faster churn in Weeks 4–6), and the ₹2Cr recovery opportunity.`,
  payment_probe: `You noticed the payment failure rate. Good. But be careful — payment failures are usually 3–5% baseline. What's the delta from last week? And more importantly: if payment failures caused the drop, you'd expect checkout-to-payment to be fine but payment-to-order to drop. Does the funnel support that?`,
  fallback: `Interesting angle. But before we go there — what's the business impact of being right about this? If your hypothesis is correct, what does that mean for the ₹2.14Cr GMV gap we're trying to close?`,
};

// ── Scenario context ──────────────────────────────────────────────────────────
export const SCENARIO = {
  company: 'Swiggy',
  city: 'North Bangalore',
  metric: 'Orders',
  drop: '8.3%',
  period: 'WoW (Tuesday)',
  category: 'Biryani',
  priyaMessage: `Hey — orders in North Bangalore are down 8.3% week-over-week. Started Tuesday. GMV impact already ₹19L. Need a full breakdown by EOD. @you can you take point on this?`,
  priyaTime: '9:04 AM',
  priyaToArjun: `@Arjun — just confirmed, it's North Bangalore only. Not seeing this in other cities. Can you pull up the numbers and walk the team through what's happening?`,
  arjunAck: `On it. Pulling up the dashboard now.`,
  arjunAckTime: '9:06 AM',
  priyaSlack: `Hey team — quick one before standup. Our Tuesday order numbers just came in for North Bangalore and we're down 8.3% WoW. Leadership review is Thursday. I need to know if this is a blip or a structural problem, and if it's structural, I need root cause + recommendation by EOD Wednesday.`,
  arjunSlack: `On it. Before we touch any data — let's get the scope right. First question is always: what do we know for certain, and what are we assuming?`,
  arjunTime: '9:17 AM',
};