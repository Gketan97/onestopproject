// src/components/strategy/data/swiggyStrategyData.js
// All mock data for the Strategic Incident Simulator
// Scenario: 8.3% WoW order drop, North Bangalore, Tuesday

// ── KPI Scorecard ─────────────────────────────────────────────────────────────
export const KPI_DATA = {
  gmv: {
    label: 'Gross Merchandise Value',
    short: 'GMV',
    current: '₹2.14Cr',
    prev: '₹2.33Cr',
    delta: -8.3,
    unit: '₹Cr',
    alert: true, // pulsing red
    detail: 'WoW vs last Tuesday',
    icon: 'trending-down',
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
    icon: 'trending-down',
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
    icon: 'trending-up',
  },
  fleet: {
    label: 'Active Delivery Fleet',
    short: 'Active Fleets',
    current: '1,204',
    prev: '1,198',
    delta: +0.5,
    unit: '',
    alert: false,
    detail: 'Peak hour avg',
    icon: 'stable',
  },
};

// ── Funnel Data ───────────────────────────────────────────────────────────────
export const FUNNEL_THIS_WEEK = [
  { stage: 'App Open',       users: 84200, pct: 100,  dropLabel: null },
  { stage: 'Search',         users: 61400, pct: 72.9, dropLabel: '-27.1%' },
  { stage: 'Menu View',      users: 38800, pct: 63.2, dropLabel: '-36.8%', alert: false },
  { stage: 'Add to Cart',    users: 17200, pct: 44.3, dropLabel: '-55.7%', alert: true, alertNote: '⚠ Unusual drop' },
  { stage: 'Checkout',       users: 12100, pct: 70.3, dropLabel: '-29.7%' },
  { stage: 'Payment',        users: 9440,  pct: 78.0, dropLabel: '-22.0%', alert: true, alertNote: '⚠ Payment failures ↑' },
  { stage: 'Order Placed',   users: 9440,  pct: 100,  dropLabel: null },
];

export const FUNNEL_LAST_WEEK = [
  { stage: 'App Open',       users: 81600, pct: 100  },
  { stage: 'Search',         users: 60100, pct: 73.7 },
  { stage: 'Menu View',      users: 41200, pct: 68.6 },
  { stage: 'Add to Cart',    users: 23800, pct: 57.8 },
  { stage: 'Checkout',       users: 17200, pct: 72.3 },
  { stage: 'Payment',        users: 14100, pct: 82.0 },
  { stage: 'Order Placed',   users: 11580, pct: 100  },
];

// ── Cohort Matrix (retention by first-order week) ────────────────────────────
export const COHORT_HEADERS = ['Cohort', 'Size', 'W1', 'W2', 'W3', 'W4', 'W5', 'W6'];

export const COHORT_ROWS = [
  { cohort: 'Week 1 (Jan 6)',  size: 3240, retention: [100, 58, 44, 38, 32, 28, 25], trend: 'stable'   },
  { cohort: 'Week 2 (Jan 13)', size: 2980, retention: [100, 55, 41, 35, 28, 23, null], trend: 'stable' },
  { cohort: 'Week 3 (Jan 20)', size: 3410, retention: [100, 52, 38, 30, 22, null, null], trend: 'drop' },
  { cohort: 'Week 4 (Jan 27)', size: 2760, retention: [100, 48, 31, 21, null, null, null], trend: 'drop', alert: true },
  { cohort: 'Week 5 (Feb 3)',  size: 2590, retention: [100, 44, 28, null, null, null, null], trend: 'drop', alert: true },
  { cohort: 'Week 6 (Feb 10)', size: 2410, retention: [100, 38, null, null, null, null, null], trend: 'drop', alert: true },
];

export const COHORT_INSIGHT = {
  finding: 'W1 retention is declining 5–7% per cohort since Week 3. New users in Weeks 4–6 are churning ~30% faster than baseline.',
  hypothesis: 'Either the North Bangalore restaurant selection quality dropped, or the Biryani category (highest reorder) saw supply-side issues.',
  impact: 'If cohort W4–W6 had matched Week 1 retention, weekly GMV recovery = ₹38–44L annualized.',
};

// ── Impact Sizing Parameters ──────────────────────────────────────────────────
export const IMPACT_SIZING = {
  churnedUsers: 820,
  avgOrderValue: 385,
  ordersPerWeek: 2.1,
  weeksInYear: 52,
  recoveryRate: 0.65, // realistic fix recovery
  answer: {
    weekly: '₹6.65L',
    monthly: '₹26.6L',
    annual: '₹3.19Cr',
    conservative: '₹2.07Cr', // at 65% recovery
  },
};

// ── NL Query Routing ──────────────────────────────────────────────────────────
// Maps user's natural language to visualizer type + Arjun response
export const NL_QUERY_ROUTES = [
  {
    keywords: ['funnel', 'conversion', 'sunday', 'drop-off', 'dropout', 'where', 'step', 'stage'],
    type: 'funnel',
    arjunKey: 'funnel_shown',
  },
  {
    keywords: ['cohort', 'retention', 'returning', 'repeat', 'churn', 'users', 'week', 'new users'],
    type: 'cohort',
    arjunKey: 'cohort_shown',
  },
  {
    keywords: ['impact', 'size', 'gmv', 'revenue', 'recover', 'crore', 'lakh', 'inr', '₹', 'how much'],
    type: 'impact',
    arjunKey: 'impact_shown',
  },
  {
    keywords: ['payment', 'failure', 'success rate', 'gateway', 'error'],
    type: 'funnel',
    arjunKey: 'payment_probe',
  },
];

// ── Arjun System Prompt ───────────────────────────────────────────────────────
export const ARJUN_STRATEGY_SYS = `You are Arjun, a Staff Analyst at Swiggy with 10 years of experience in product analytics and strategic problem solving. You are mentoring a junior analyst through a real incident investigation.

Your communication style:
- Never give the answer directly. Always ask a Socratic follow-up question.
- Be skeptical but not harsh. Challenge assumptions.
- Always push the user to "size the impact" in INR.
- Use concrete Swiggy context (North Bangalore, Biryani category, GMV, WoW).
- Keep responses under 3 sentences.
- Use data to challenge logic errors.
- End with a question that forces deeper thinking.

Example: If user says "the cart drop is the main issue", respond: "The cart drop is notable, but have you checked whether payment success rates declined independently? Correlation in a funnel doesn't imply causation. What percentage of users who reached payment actually failed?"`;

// ── Arjun Mock Responses ─────────────────────────────────────────────────────
export const ARJUN_STRATEGY_MOCK = {

  // Phase 1 — Triage responses
  triage_start: `Before we look at any data, let's be precise about scope. Priya said "orders dropped 8.3%"— but dropped where? Platform-wide, or a specific delivery zone? And compared to what — last Tuesday, or a rolling average? These two questions will save you 3 hours of wrong analysis.`,

  triage_q1: `Good instinct to check geography first. North Bangalore is our highest density Biryani zone, and Biryani is our highest reorder category. If the drop is concentrated there, the root cause is almost certainly supply-side, not demand-side. What's your next question?`,

  triage_q2: `You're asking about the right things. Before you pull data, rank these hypotheses by probability: restaurant supply issue, weather/external event, platform bug, or competitor promotion. Which do you think is most likely — and why?`,

  triage_hypothesis_wrong: `I'd push back on that. A platform bug would show up across all geographies uniformly. But Priya said North Bangalore specifically — that's too localized for a platform issue. What does that tell you about where to look?`,

  triage_hypothesis_right: `Exactly. Geography-specific drops almost always point to supply-side or hyper-local demand signals. Now — before you request any data, what's the minimum set of metrics you need to confirm or deny this? Don't ask for everything.`,

  // Phase 2 — Funnel responses
  funnel_shown: `You can see the funnel now. Don't tell me where the biggest percentage drop is — that's a trap. Tell me which stage's drop is most *unexpected* given what you know about the business, and why.`,

  cart_drop_correct: `Right — the Add to Cart drop of 55.7% vs 42.2% last week is the anomaly. But here's my challenge: is this a demand problem or a supply problem? If restaurants had fewer menu items available, users might browse but not find what they want. Have you considered that the funnel issue might start before the cart?`,

  payment_probe: `You noticed the payment failure rate. Good. But be careful — payment failures are usually 3–5% baseline. What's the delta from last week? And more importantly: if payment failures caused the drop, you'd expect checkout-to-payment to be fine but payment-to-order to drop. Does the funnel support that?`,

  wrong_conclusion: `You concluded too fast. You noticed the Cart drop-off, but did you check the Payment Success Rate for the same period? Correlation in a funnel isn't causation. What if users were adding to cart but the restaurant's menu had availability issues that only surfaced at checkout?`,

  // Phase 3 — Cohort + Impact
  cohort_shown: `Look at the Week 4 and Week 5 cohorts carefully. Their Week 1 retention is 44–48% — that's 10 points below the Jan 6 cohort. These are users who ordered once and disappeared. What changed in Week 4 that might have affected first-time experience?`,

  cohort_insight: `You've identified the retention cliff. Now size it. If we had retained the Week 4–6 cohorts at Week 1 baseline rates, how much incremental GMV does that represent? Use ₹385 average order value and 2.1 orders/week as your assumptions.`,

  impact_shown: `Your sizing is in the right ballpark. But you're calculating at 100% fix — that's not realistic. Senior analysts present a range: best case, expected case (65% recovery), and conservative (40%). What's your expected-case annual GMV recovery?`,

  impact_correct: `₹2–3Cr annual recovery is defensible. Now frame this for the VP: don't say "we lost ₹2Cr." Say "fixing the Week 4–6 cohort churn unlocks ₹2Cr in recoverable GMV — here's the 3-week intervention plan." That's the difference between a data pull and a strategic recommendation.`,

  // Memo generation
  memo_ready: `Your investigation is complete. The memo captures: root cause (supply-side availability in North Bangalore, Biryani category), funnel evidence (Cart drop anomaly), cohort evidence (30% faster churn in Weeks 4–6), and the ₹2Cr recovery opportunity. This is what a Day-Zero analyst looks like.`,

  // Fallback
  fallback: `Interesting angle. But before we go there — what's the business impact of being right about this? If your hypothesis is correct, what does that mean for the ₹2.14Cr GMV gap we're trying to close?`,
};

// ── Scenario Context ──────────────────────────────────────────────────────────
export const SCENARIO = {
  company: 'Swiggy',
  city: 'North Bangalore',
  metric: 'Orders',
  drop: '8.3%',
  period: 'WoW (Tuesday)',
  category: 'Biryani',
  priyaSlack: `Hey team — quick one before standup. Our Tuesday order numbers just came in for North Bangalore and we're down 8.3% WoW. Leadership review is Thursday. I need to know if this is a blip or a structural problem, and if it's structural, I need root cause + recommendation by EOD Wednesday. @Arjun can you lead the investigation with the new joiner?`,
  priyaTime: 'Tue 9:14 AM',
  arjunSlack: `On it. Before we touch any data — let's get the scope right. New joiner, I'm going to walk you through how I approach this. First question is always: what do we know for certain, and what are we assuming?`,
  arjunTime: '9:17 AM',
};
