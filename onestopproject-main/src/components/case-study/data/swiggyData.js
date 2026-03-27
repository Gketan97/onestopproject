// src/components/case-study/data/swiggyData.js
// All static content for the Swiggy Orders Investigation case study.
// No UI logic here — pure data that drives the component tree.

// ─────────────────────────────────────────────────────────────────────────────
// MOCK RESPONSES  (used in IS_DEV mode, mirrors real Arjun evaluations)
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK = {
  clarify:    { feedback: 'Strong — you asked for clarification before pulling any data. The strongest version names the specific ambiguity: Engineering, Growth, and Finance each track different order definitions for the same day. That detail makes this a real question, not just a habit.' },
  baseline:   { feedback: 'COUNT(DISTINCT order_id) is right. The 4-week Tuesday window catches day-of-week patterns. One refinement: specify IST timezone explicitly — querying in UTC shifts your Tuesday boundary by 5.5 hours, which can move 200K orders into the wrong day.' },
  decompose:  { feedback: 'Clean decomposition. Breaking by cuisine is right — more targeted than user-type alone. The restaurant-level cut is exactly correct: 3 bad actors look very different from systemic category suppression.' },
  deadend:    { feedback: 'Good dead end handling. You acknowledged the partial explanation, updated your hypothesis, and moved on. Missing: a quick message to Priya. She has been waiting since 10am.' },
  external:   { feedback: 'Right instinct — checking what else changed in the market. The two-cause framing is correct. One or the other alone does not explain the full drop.' },
  causation:  { feedback: 'Causation confirmed correctly. You quantified each cause\'s contribution and confirmed they are additive. The two-owner recommendation is exactly right.' },
  vp:         { feedback: 'Good S/C/R structure. Situation and Complication are specific. One gap: the Resolution names teams but not the timeline. The VP will ask.' },
  sql:        { feedback: 'Query runs and returns data. Two things to tighten: use COUNT(DISTINCT order_id) not COUNT(*), and add a WHERE clause for the specific date range.' },
  cohort:     { feedback: 'Cohort logic is right. The finding — new_restaurant_first users at 41% day-30 retention vs 64% for established — is the number that changes the VP conversation.' },
  funnel:     { feedback: 'Window functions used correctly. The LTV calculation is solid. The ₹31.7Cr vs ₹12.4Cr framing is exactly the kind of quantification that changes a VP conversation.' },
  metric:     { feedback: 'The components are right. The cold-start Bayesian prior is correct. One gap: the feedback loop. How does a restaurant know their score? Without that, the metric becomes a black box.' },
  ranking:    { feedback: 'This is the kind of recommendation that gets analysts promoted. You anticipated the second-order effect and proposed a staged rollout with specific monitoring.' },
  debrief:    { profile: 'You demonstrated strong metric decomposition instincts — you went from cuisine to restaurant level without being prompted. Your SQL is clean. The one recurring pattern to watch: you found partial answers and almost settled for them twice.', interviewer: 'Candidate showed systematic investigation approach with appropriate dead end recovery. SQL was confident and accurate. Would hire at L3 with potential to L4 within 12 months.' },
  gap_weak:   { label: 'Partial', missed: 'Most answers miss: (1) supply-side causes — restaurants closed or slow, (2) external factors — competitor promotion, (3) platform UX — search results, load times, payment failures.' },
  gap_strong: { label: 'Strong', missed: 'One thing most answers miss: the distinction between platform-fixable vs. user-intent issues. That matters for the fix.' },
  ctx_q1_ans: 'The problem is in the re-engagement layer — users who have ordered before but didn\'t come back this week. New users (flat) and resurrected users (up) are both fine. The failure is retaining already-active users. That narrows the hypothesis space immediately.',
  ctx_q2_ans: 'Order volumes have a strong day-of-week pattern — Tuesdays are consistently different from Mondays. Comparing Tuesday to Tuesday controls for that pattern, so any remaining gap is genuinely anomalous.',
};

// ─────────────────────────────────────────────────────────────────────────────
// SQL RESULTS  (mock data for each query key)
// ─────────────────────────────────────────────────────────────────────────────
export const SQL_RES = {
  p1_baseline: {
    cols: ['week', 'orders', 'WoW_change'],
    rows: [['2024-10-07 (4w avg)', '2,180,000', 'baseline'], ['2024-10-14 (last Mon)', '2,114,000', '-3.0%'], ['2024-10-21 (this Mon)', '1,999,000', '-5.5%']],
    status: '3 rows · 280ms', hl: [2],
  },
  p1_user_type: {
    cols: ['user_type', 'orders_this_week', 'orders_last_week', 'WoW'],
    rows: [['New users', '324,000', '324,500', '-0.2%'], ['Returning users', '1,245,000', '1,445,000', '-13.8%'], ['Resurrected users', '430,000', '344,500', '+24.8%']],
    status: '3 rows · 195ms', hl: [1], hlg: [2],
  },
  p1_notification: {
    cols: ['notification_type', 'sent_this_week', 'sent_last_week', 'WoW'],
    rows: [['Promotional', '4,200,000', '4,180,000', '+0.5%'], ['Re-engagement (returning)', '0', '1,820,000', '-100%'], ['New user welcome', '892,000', '895,000', '-0.3%']],
    status: '3 rows · 112ms', hl: [1],
  },
  p1_crm: {
    cols: ['config_key', 'current_value', 'previous_value', 'changed_at'],
    rows: [['target_segment', 'new_and_resurrected', 'all_users', '2024-10-18 23:47'], ['notification_suppression', 'returning_users_excluded', 'none', '2024-10-18 23:52']],
    status: '2 rows · 89ms', hl: [0, 1],
  },
  p2_baseline: {
    cols: ['area', 'cuisine', 'orders_this_week', 'orders_last_week', 'WoW'],
    rows: [['North Bangalore', 'Biryani', '12,400', '18,500', '-32.97%'], ['North Bangalore', 'Chinese', '18,200', '17,900', '+1.7%'], ['South Bangalore', 'Biryani', '22,100', '21,800', '+1.4%']],
    status: '3 rows · 198ms', hl: [0],
  },
  p2_restaurants: {
    cols: ['restaurant_name', 'orders_WoW', 'avg_rating_WoW', 'complaint_spike'],
    rows: [['Biryani Palace NB', '−78%', '-1.2 pts', 'YES — 23 complaints'], ['Royal Biryani', '−81%', '-0.9 pts', 'YES — 18 complaints'], ['Hyderabad House', '−83%', '-1.4 pts', 'YES — 31 complaints'], ['Biryani Bros', '−2%', 'flat', 'no'], ['Paradise NB', '+1%', '+0.1 pts', 'no']],
    status: '5 rows · 156ms', hl: [0, 1, 2], hlg: [3, 4],
  },
  p2_external: {
    cols: ['platform', 'event_type', 'geography', 'discount_pct', 'event_date'],
    rows: [['Zomato', 'Biryani Promo', 'North Bangalore', '40%', '2024-10-14'], ['Zomato', 'Biryani Promo', 'North Bangalore', '40%', '2024-10-15'], ['Swiggy', 'None applicable', '—', '—', '—']],
    status: '2 rows · 87ms', hl: [0, 1],
  },
  p2_weather: {
    cols: ['date', 'condition', 'temp_c', 'rainfall_mm'],
    rows: [['2024-10-14', 'Clear', '28', '0'], ['2024-10-15', 'Partly cloudy', '27', '0'], ['2024-10-16', 'Clear', '29', '0']],
    status: '3 rows · 71ms — no weather event',
  },
  p2_competitor_pricing: {
    cols: ['competitor', 'avg_price_biryani', 'WoW_change', 'promo_active'],
    rows: [['Zomato', '₹149', '−38%', 'YES'], ['Swiggy', '₹240', 'flat', 'NO']],
    status: '2 rows · 64ms', hl: [0],
  },
  p3_cohort: {
    cols: ['cohort', 'day7_retention', 'day14_retention', 'day30_retention'],
    rows: [['Established restaurant users', '82%', '74%', '64%'], ['New restaurant users (<90d)', '74%', '58%', '41%']],
    status: '2 rows · 412ms', hl: [1],
  },
  p3_ltv: {
    cols: ['segment', 'quarterly_gmv', 'ltv_12mo', 'ltv_gmv_ratio'],
    rows: [['New restaurant GMV uplift', '₹12.4Cr', '+₹12.4Cr', '1.0×'], ['LTV loss from churn', '—', '−₹31.7Cr', '−2.55×']],
    status: '2 rows · 289ms', hl: [1],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 1 STEPS  (7 prediction nodes)
// ─────────────────────────────────────────────────────────────────────────────
export const P1_STEPS = [
  {
    num: 1, title: 'Clarify the metric',
    arjun: 'Before touching any data, I need to know exactly what "orders" means. Different teams use different definitions. I also need the comparison period.',
    prediction: 'Before Arjun pulls data, what do you think he asks Priya first?',
    reveal: { sqlKey: 'p1_baseline', sqlTitle: 'baseline_tuesday_WoW.sql', arjunAfter: 'The baseline shows a step-change two Tuesdays ago — not gradual drift. Step-changes are easier to investigate than gradual ones. Next: decompose by user type.' },
  },
  {
    num: 2, title: 'Establish the baseline',
    arjun: 'Now I pull 4 weeks of same-day data to see the pattern. If it\'s a slow drift, this is different from a sudden step-change. Different root causes.',
    prediction: 'What SQL does Arjun write to establish the baseline?',
    reveal: { sqlKey: 'p1_baseline', sqlTitle: 'baseline_4week.sql', arjunAfter: 'Step-change on 2024-10-21. Orders 5.5% down vs the same Tuesday 2 weeks ago. Now: which user segment is driving it?' },
  },
  {
    num: 3, title: 'Decompose by user type',
    arjun: 'Orders = new users + returning users + resurrected users. I break it apart before hypothesising. Each segment has different drivers.',
    prediction: 'What does Arjun check next to understand which users are affected?',
    reveal: { sqlKey: 'p1_user_type', sqlTitle: 'user_type_breakdown.sql', arjunAfter: 'New users: flat. Resurrected: up. Returning users: down 13.8%. Only one segment is failing. The problem is re-engagement of existing users — not growth.' },
    behaviourCode: 'B3', behaviourEvidence: 'Decomposed before hypothesising — identified returning users as the only failing segment',
  },
  {
    num: 4, title: 'Follow the signal — notifications',
    arjun: 'Returning users get re-engagement notifications. Flat or down notification sends = obvious hypothesis. Let me check.',
    prediction: 'What does Arjun query to understand why returning users dropped?',
    reveal: { sqlKey: 'p1_notification', sqlTitle: 'notification_sends_WoW.sql', arjunAfter: 'Re-engagement notifications: zero this week. Last week: 1.82 million. This is almost certainly root cause. But I need to confirm — intentional or a bug?' },
    behaviourCode: 'B4', behaviourEvidence: 'Recognised partial explanation — confirmed notifications are root cause before calling it',
  },
  {
    num: 5, title: 'Confirm: bug or feature?',
    arjun: 'Zero re-engagement sends could be intentional (a new targeting rule) or a bug. I check the config table.',
    prediction: 'How does Arjun confirm whether this is a bug or an intentional change?',
    reveal: { sqlKey: 'p1_crm', sqlTitle: 'crm_config_changes.sql', arjunAfter: 'Config changed at 23:47 on Oct 18. Target segment changed accidentally to exclude returning users. Bug, not feature. Timeline matches the order drop exactly. Root cause confirmed.' },
    behaviourCode: 'B7', behaviourEvidence: 'Confirmed causation via config change timestamp matching order drop timeline',
  },
  {
    num: 6, title: 'Quantify the impact',
    arjun: 'Before messaging Priya, I need the number. How many returning users missed their notification?',
    prediction: 'What does Arjun calculate to quantify the impact of the config error?',
    reveal: {
      customContent: {
        type: 'impact',
        metrics: [
          { value: '1.82M', label: 're-engagement notifications missed', color: 'red' },
          { value: '~200K', label: 'returning orders suppressed', color: 'amber' },
        ],
      },
      arjunAfter: '~200K suppressed orders this week. The fix is a CRM config change — revert target_segment back to all_users. Recovery in 24 hours once notifications resume.',
    },
    behaviourCode: 'B2', behaviourEvidence: 'Established clear baseline — identified step-change vs gradual drift',
  },
  {
    num: 7, title: 'Write the VP message',
    arjun: 'Root cause confirmed. Now: one tight message to Priya that she can forward to leadership. S/C/R format — Situation, Complication, Resolution.',
    prediction: 'Write the VP message Arjun sends to Priya.',
    reveal: {
      customContent: {
        type: 'vpMessage',
        text: `Situation: Orders are 5.5% below last Tuesday's baseline. The drop is isolated to returning users (-13.8% WoW). New user acquisition and resurrected users are both healthy.\n\nComplication: A CRM config change pushed at 23:47 on Oct 18 accidentally excluded all returning users from re-engagement notifications. 1.82M notifications were not sent this week. Timeline matches the order drop exactly.\n\nResolution: CRM team should revert target_segment to 'all_users' immediately. Notifications will resume in the next send cycle. Orders should recover within 24-48 hours. Owner: CRM Engineering. Timeline: same day.`,
      },
      arjunAfter: 'That\'s the structure: specific metric, specific segment, specific cause with timeline evidence, specific fix with owner and timeline. A VP can forward this exactly as written.',
    },
    behaviourCode: 'B8', behaviourEvidence: 'Wrote VP message with S/C/R format, specific owner and timeline',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 2 STEPS  (6 guided investigation steps)
// ─────────────────────────────────────────────────────────────────────────────
export const P2_STEPS = [
  {
    id: 'clarify', label: 'Step 1 · Clarify', title: 'Before any data — what do you ask Priya?',
    arjun: 'Apply what you watched Arjun do. Before you write a single query — what\'s the first thing you ask Priya?',
    prompt: 'What clarification do you ask Priya before pulling any data? Apply the Phase 1 framework here.',
    minWords: 8,
    mockKey: 'clarify',
    arjunAnswer: 'I\'d ask: "Which definition of orders — completed only or including cancellations? And is this North Bangalore all cuisines, or specifically Biryani? Last: has anything changed in North Bangalore recently — new restaurant launches, marketing spend, competitor activity?"',
    behaviourCode: 'B1', behaviourEvidence: 'Asked for clarification before querying',
    hint: 'Phase 1 Step 1: Arjun asked about metric definition and comparison period before touching any data.',
  },
  {
    id: 'baseline', label: 'Step 2 · Baseline', title: 'Establish the North Bangalore Biryani baseline',
    arjun: 'Before declaring "34% down", confirm it. Write a query: North Bangalore, Biryani category, this Monday vs last Monday.',
    sqlFile: 'baseline_nb_biryani.sql', sqlKey: 'p2_baseline',
    arjunAfter: 'The baseline is confirmed: 32.97% down. Now decompose. Which specific restaurants are driving this?',
    hint: 'Use prod.orders filtered to delivery_area=\'north_bangalore\' and cuisine_type=\'Biryani\'. COUNT(DISTINCT order_id), compare two Mondays.',
  },
  {
    id: 'decompose', label: 'Step 3 · Decompose', title: 'Which specific restaurants are down?',
    arjun: 'The drop is in Biryani, North Bangalore. Which specific restaurants are down? Join orders with restaurants and reviews to get rating changes alongside the order drop.',
    sqlFile: 'restaurants_nb_biryani.sql', sqlKey: 'p2_restaurants',
    arjunAfter: '3 restaurants with complaint spikes driving ~45% of the drop. But that leaves 55% unexplained. What else explains the other 55%? That\'s the question Phase 1 taught you to ask.',
    partialAlert: 'Quality complaints explain ~45% of the drop. What explains the other ~55%? Check external factors.',
    hint: 'JOIN prod.orders with prod.restaurants and prod.restaurant_reviews. Filter to delivery_area=\'north_bangalore\' and cuisine_type=\'Biryani\'.',
  },
  {
    id: 'investigate', label: 'Step 4 · Open investigation', title: 'Free investigation — find the other 55%',
    arjun: 'You have partial root cause. ~45% explained by quality complaints. What explains the rest? Explore freely — try external events, competitor activity.',
    sqlFile: 'open_investigation.sql', sqlKey: null,
    arjunAfter: 'If you checked external_events — you found a Zomato 40% discount on Biryani running specifically in North Bangalore this week. That\'s the second cause. Two interacting causes = 100% explained.',
    hint: 'Try: SELECT * FROM prod.external_events WHERE geography=\'north_bangalore\' AND event_date >= \'2024-10-14\'',
  },
  {
    id: 'causation', label: 'Step 5 · Confirm causation', title: 'Quantify both causes and confirm root cause',
    arjun: 'You have two hypotheses: restaurant quality complaints (~45%) and Zomato promo (~55%). Quantify both. Confirm they\'re additive and close to 100% of the drop.',
    prompt: 'State your root cause: what are the two causes, what percentage does each explain, and how do you confirm causation (not just correlation)?',
    minWords: 20,
    mockKey: 'causation',
    arjunAnswer: 'Two causes: (1) Quality complaint spike in 3 restaurants (~45%) — rating drops with confirmed complaint spikes, temporal match. (2) Zomato 40% off Biryani specifically in North Bangalore (~55%) — geography-specific match. Together: 100% explained. Two separate owners required.',
    behaviourCode: 'B7', behaviourEvidence: 'Confirmed two root causes — quality complaints (45%) + Zomato promo (55%) — temporal + geographic confirmation',
    hint: 'Check: does your explanation account for 100% of the drop? Does the geography match? Does the timeline match?',
  },
  {
    id: 'vp', label: 'Step 6 · VP message', title: 'Write the VP-ready message to Priya',
    arjun: 'Root cause confirmed. Write the message to Priya. S/C/R format: Situation → Complication → Resolution. Two separate causes, two separate owners, specific timelines.',
    prompt: 'Write the VP-ready message to Priya. Situation → Complication → Resolution. Specific owners and timelines.',
    minWords: 30,
    mockKey: 'vp',
    arjunAnswer: 'Situation: North Bangalore Biryani down 34% WoW. Two interacting causes confirmed.\nComplication: (1) Quality spike in 3 restaurants (~45%). (2) Zomato 40% off Biryani in North Bangalore (~55%).\nResolution: (1) Restaurant quality team: place 3 affected restaurants on QA review by EOD. (2) Growth team: evaluate competitive response for North Bangalore Biryani. Owner per cause, weekly monitoring.',
    behaviourCode: 'B8', behaviourEvidence: 'Wrote VP message with S/C/R format, two owners, specific timelines',
    hint: 'Structure: Situation (what\'s the drop, which segment, confirmed number). Complication (two causes, each quantified, causation evidence). Resolution (two separate actions, two owners, timelines).',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 3 TASKS  (open workbench)
// ─────────────────────────────────────────────────────────────────────────────
export const P3_TASKS = [
  {
    id: 'cohort', label: 'Task 1', title: 'Cohort retention analysis',
    desc: 'Confirm that users who first order from a new restaurant (<90 days old) churn faster. Write the cohort query.',
    sqlFile: 'cohort_retention.sql', sqlKey: 'p3_cohort',
    prompt: 'What does your cohort analysis show? What\'s the retention cliff and what does it mean for the platform?',
    minWords: 15, mockKey: 'cohort',
    arjunAnswer: 'Day-30 retention: established restaurant users 64%, new restaurant users 41%. 23 percentage point gap. Statistically significant across cohorts.',
  },
  {
    id: 'ltv', label: 'Task 2', title: 'Quantify the trade-off',
    desc: 'LTV loss from churned users vs GMV gain from new restaurant visibility. Build the model.',
    sqlFile: 'ltv_vs_gmv.sql', sqlKey: 'p3_ltv',
    prompt: 'Quantify the LTV vs GMV trade-off. Is this a problem? What does the number say?',
    minWords: 15, mockKey: 'funnel',
    arjunAnswer: '₹31.7Cr annualised LTV loss vs ₹12.4Cr quarterly GMV uplift. 2.55x negative ratio. Short-term GMV bought at long-term retention cost.',
  },
  {
    id: 'metric', label: 'Task 3', title: 'Design the restaurant health score',
    desc: 'Design a composite metric. Handle cold-start (new restaurants with few reviews). Make it defensible.',
    prompt: 'Design the restaurant health score. What components? How do you handle cold-start? What\'s the threshold for suppressing a restaurant\'s ranking boost?',
    minWords: 20, mockKey: 'metric',
    arjunAnswer: 'Health score = 0.4×(Bayesian avg rating) + 0.35×(order completion rate) + 0.25×(complaint rate inverse). Bayesian prior: 3.8 stars until 50+ reviews.',
  },
  {
    id: 'ranking', label: 'Task 4', title: 'Recommend the ranking change',
    desc: 'What specific change to the ranking algorithm? What are the second-order effects? How do you stage the rollout?',
    prompt: 'What specific change do you recommend to the ranking algorithm? What second-order effects do you anticipate and how do you mitigate them?',
    minWords: 20, mockKey: 'ranking',
    arjunAnswer: 'Proposal: replace blanket 1.4× new_restaurant_boost with health-score-gated boost. Restaurants with health_score>75 get 1.2×. <75 get 1.0×. Staged rollout: 5% traffic for 2 weeks, measure day-7 retention before full rollout.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// BEHAVIOURS  (8 analytical behaviours tracked)
// ─────────────────────────────────────────────────────────────────────────────
export const BEHAVIOURS = [
  { code: 'B1', label: 'Clarify metric before querying' },
  { code: 'B2', label: 'Establish baseline before declaring anomaly' },
  { code: 'B3', label: 'Decompose metric before hypothesising' },
  { code: 'B4', label: 'Recognise partial answers — ask "does this close the gap?"' },
  { code: 'B5', label: 'Identify external signals' },
  { code: 'B6', label: 'Assign separate owners for separate causes' },
  { code: 'B7', label: 'Verify causation, not just correlation' },
  { code: 'B8', label: 'VP message covers S/C/R with owners and timeline' },
];

// ─────────────────────────────────────────────────────────────────────────────
// GAP CATEGORIES  (used in gap exercise evaluation)
// ─────────────────────────────────────────────────────────────────────────────
export const GAP_CATEGORIES = {
  demand:   { label: 'Demand-side',       text: 'User wasn\'t hungry, browsing prices, got distracted, or just checking ETAs.' },
  supply:   { label: 'Supply-side',       text: 'Favourite restaurant not available, long delivery time, nothing appealing in search.' },
  platform: { label: 'Platform friction', text: 'Slow load time, payment failure, search returned irrelevant results, app crashed.' },
  external: { label: 'External / competitive', text: 'Competitor ran a promotion, user got a phone call, decided to cook instead.' },
};

// ─────────────────────────────────────────────────────────────────────────────
// ARJUN SYSTEM PROMPT  (sent to Claude via evaluate.js)
// ─────────────────────────────────────────────────────────────────────────────
export const ARJUN_SYS = `You are Arjun Mehta — senior analytics leader, 10 years at Flipkart, Swiggy, Razorpay. You are evaluating a candidate completing a Swiggy analytics investigation case study.

Phase 1: Platform-wide order drop. Root cause: CRM config error suppressed notifications to returning users.
Phase 2: North Bangalore Biryani orders lagging post-fix. Two causes: restaurant quality complaint spike + Zomato promotion.
Phase 3: Systemic — new restaurant cold-start, LTV vs GMV trade-off, restaurant health score, ranking recommendation.

Evaluation style: Specific. Brief (2-4 sentences). Honest. Constructive — every gap gets a specific fix. Return plain text only.`;

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMAS  (used by SchemaPanel — defines all queryable tables)
// ─────────────────────────────────────────────────────────────────────────────
export const SCHEMAS = {
  'prod.orders': {
    cols: [
      { n: 'order_id',       t: 'VARCHAR',   k: true  },
      { n: 'user_id',        t: 'VARCHAR',   k: false },
      { n: 'restaurant_id',  t: 'VARCHAR',   k: false },
      { n: 'order_date',     t: 'DATE',      k: false },
      { n: 'order_status',   t: 'VARCHAR',   k: false },
      { n: 'cuisine_type',   t: 'VARCHAR',   k: false },
      { n: 'delivery_area',  t: 'VARCHAR',   k: false },
      { n: 'city',           t: 'VARCHAR',   k: false },
      { n: 'gmv',            t: 'INTEGER',   k: false },
      { n: 'user_type',      t: 'VARCHAR',   k: false },
    ],
  },
  'prod.restaurants': {
    cols: [
      { n: 'restaurant_id',   t: 'VARCHAR', k: true  },
      { n: 'restaurant_name', t: 'VARCHAR', k: false },
      { n: 'cuisine_type',    t: 'VARCHAR', k: false },
      { n: 'delivery_area',   t: 'VARCHAR', k: false },
      { n: 'avg_rating',      t: 'FLOAT',   k: false },
      { n: 'is_new',          t: 'BOOLEAN', k: false },
      { n: 'onboarded_date',  t: 'DATE',    k: false },
    ],
  },
  'prod.restaurant_reviews': {
    cols: [
      { n: 'review_id',      t: 'VARCHAR', k: true  },
      { n: 'restaurant_id',  t: 'VARCHAR', k: false },
      { n: 'review_date',    t: 'DATE',    k: false },
      { n: 'rating',         t: 'INTEGER', k: false },
      { n: 'is_complaint',   t: 'BOOLEAN', k: false },
      { n: 'review_text',    t: 'VARCHAR', k: false },
    ],
  },
  'prod.users': {
    cols: [
      { n: 'user_id',               t: 'VARCHAR', k: true  },
      { n: 'user_type',             t: 'VARCHAR', k: false },
      { n: 'city',                  t: 'VARCHAR', k: false },
      { n: 'first_order_date',      t: 'DATE',    k: false },
      { n: 'first_restaurant_type', t: 'VARCHAR', k: false },
    ],
  },
  'prod.notifications': {
    cols: [
      { n: 'notification_id',   t: 'VARCHAR',   k: true  },
      { n: 'user_id',           t: 'VARCHAR',   k: false },
      { n: 'notification_type', t: 'VARCHAR',   k: false },
      { n: 'sent_at',           t: 'TIMESTAMP', k: false },
      { n: 'week_of',           t: 'DATE',      k: false },
    ],
  },
  'prod.crm_config': {
    cols: [
      { n: 'config_key',     t: 'VARCHAR',   k: true  },
      { n: 'current_value',  t: 'VARCHAR',   k: false },
      { n: 'previous_value', t: 'VARCHAR',   k: false },
      { n: 'changed_at',     t: 'TIMESTAMP', k: false },
      { n: 'changed_by',     t: 'VARCHAR',   k: false },
    ],
  },
  'prod.external_events': {
    cols: [
      { n: 'event_id',      t: 'VARCHAR', k: true  },
      { n: 'platform',      t: 'VARCHAR', k: false },
      { n: 'event_type',    t: 'VARCHAR', k: false },
      { n: 'geography',     t: 'VARCHAR', k: false },
      { n: 'cuisine_type',  t: 'VARCHAR', k: false },
      { n: 'discount_pct',  t: 'INTEGER', k: false },
      { n: 'event_date',    t: 'DATE',    k: false },
    ],
  },
  'prod.competitor_pricing': {
    cols: [
      { n: 'id',            t: 'VARCHAR', k: true  },
      { n: 'competitor',    t: 'VARCHAR', k: false },
      { n: 'cuisine_type',  t: 'VARCHAR', k: false },
      { n: 'geography',     t: 'VARCHAR', k: false },
      { n: 'avg_price',     t: 'INTEGER', k: false },
      { n: 'promo_active',  t: 'BOOLEAN', k: false },
      { n: 'recorded_date', t: 'DATE',    k: false },
    ],
  },
  'prod.weather_events': {
    cols: [
      { n: 'date',        t: 'DATE',    k: true  },
      { n: 'condition',   t: 'VARCHAR', k: false },
      { n: 'temp_c',      t: 'INTEGER', k: false },
      { n: 'rainfall_mm', t: 'INTEGER', k: false },
      { n: 'city',        t: 'VARCHAR', k: false },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// P1_STEPS  (Phase 1 investigation steps — used by Phase1Section cinematic rewrite)
// ─────────────────────────────────────────────────────────────────────────────
export const P1_STEPS = [
  {
    num: 1, title: 'Scope the metric',
    arjun: "Before I touch any data — I need to confirm exactly what 'orders down 8.3%' means. Which metric? Completed orders only? Including cancellations? Platform-wide or a specific vertical? A wrong metric definition can send you down a 3-hour rabbit hole. I always clarify first.",
    prediction: "Arjun is about to define which exact metric to use. What do you think he'll choose — and why does this choice matter?",
    reveal: {
      sqlTitle: 'metric_definition_check.sql', sqlKey: 'p1_metric_scope',
      arjunAfter: "Confirmed: completed orders only, platform-wide, Tuesday-to-Tuesday comparison to control for day-of-week effects. The 8.3% is real — not a metric artefact. This is the baseline we'll work from. Note: same-day comparison eliminates weekend/weekday noise. Most analysts skip this step and build on a shaky foundation.",
    },
  },
  {
    num: 2, title: 'Establish the baseline',
    arjun: "Now I have a clean metric. Before decomposing into segments, I need to confirm the magnitude and establish a 4-week rolling baseline. One week is noise. Four weeks tells me if this is an aberration or a trend. I also need to check: is this a platform-wide issue or is it concentrated?",
    prediction: "Arjun is going to run a query to build the baseline. What pattern do you expect to see in the data — and what would confirm this is a real signal vs. noise?",
    reveal: {
      sqlTitle: 'baseline_tuesday_wow.sql', sqlKey: 'p1_baseline',
      arjunAfter: "The 4-week baseline is clear: orders were stable at ~2.18M/Tue, then dropped -3.0% last week and -8.3% this week. This is accelerating, not a one-off. Two consecutive drops means there's a structural cause — not weather, not a one-day anomaly. I need to decompose by user segment now.",
    },
  },
  {
    num: 3, title: 'Segment decomposition',
    arjun: "With an accelerating drop confirmed, I decompose by user segment. My hypothesis: returning users and new users will behave differently. A drop in returning users suggests platform retention failure. A drop in new users suggests acquisition or first-experience failure. These have completely different fixes.",
    prediction: "Which user segment do you think is driving the drop — new users, returning users, or resurrected users? And what would each answer imply about the root cause?",
    reveal: {
      sqlTitle: 'segment_decomposition.sql', sqlKey: 'p1_segments',
      arjunAfter: "There it is. Returning users dropped -13.8% WoW. New users are flat. Resurrected users actually UP +24.8%. This is not an acquisition problem — it's a retention problem. Specifically: users who ordered before are not coming back this week. The question now is: why aren't returning users ordering?",
    },
  },
  {
    num: 4, title: 'Funnel drop identification',
    arjun: "Returning users aren't ordering. The next question: where in the funnel are they dropping? Are they not opening the app (notification/re-engagement failure)? Opening but not browsing? Browsing but not adding to cart? Each drop point has a different cause.",
    prediction: "In the user funnel (app open → browse → add to cart → payment → order), where do you think returning users are dropping off? Name the step and your reasoning.",
    reveal: {
      sqlTitle: 'returning_user_funnel.sql', sqlKey: 'p1_funnel',
      arjunAfter: "The drop happens at the very top: app opens for returning users are down 18% WoW. They're not even opening the app — which means this is a CRM/notification problem, not a product or payment problem. If they opened and browsed but didn't order, I'd look at restaurant quality or pricing. But the problem is upstream.",
    },
  },
  {
    num: 5, title: 'Identify the CRM signal',
    arjun: "App opens down 18% for returning users. My immediate hypothesis: CRM notification suppression. Either a campaign was turned off, a segment was accidentally excluded, or there's a delivery failure in our push/email pipeline. This is the most testable hypothesis — I can check notification delivery logs directly.",
    prediction: "Arjun suspects a CRM notification issue. What data would you pull to confirm or rule this out? Name the table/query you'd run.",
    reveal: {
      sqlTitle: 'crm_notification_audit.sql', sqlKey: 'p1_crm',
      arjunAfter: "Confirmed. Returning user notification delivery rate dropped to 0 starting Monday. A segment configuration change suppressed the entire returning-user re-engagement campaign. 181,000 users received nothing this week. This is Cause 1. Now I need to check if there's a second, independent cause — or if this explains the full drop.",
    },
  },
  {
    num: 6, title: 'Residual analysis + second cause',
    arjun: "The CRM suppression explains most of the returning user drop. But there's a residual: the North Bangalore Biryani segment is down 32.9% — far more than the platform average and more than CRM alone can explain. Something else is happening in this specific geography/cuisine combination.",
    prediction: "There's a second cause hiding in North Bangalore's Biryani segment. What's your hypothesis — restaurant quality, competitor promotion, delivery capacity, or something else?",
    reveal: {
      sqlTitle: 'nb_biryani_investigation.sql', sqlKey: 'p1_biryani',
      arjunAfter: "Two causes found. In North Bangalore's Biryani segment: (1) Restaurant quality degraded — Biryani Palace NB and Royal Biryani both dropped below 3.5★ after a series of complaints. (2) Zomato ran a 40% discount promo on the same restaurants this week, pulling price-sensitive users. Total impact: ~₹28L/month in lost GMV.",
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Additional SQL_RES entries for P1_STEPS (merged with existing SQL_RES above)
// ─────────────────────────────────────────────────────────────────────────────
// Note: extend the existing SQL_RES object with these new keys
export const SQL_RES_P1 = {
  p1_metric_scope: {
    status: '1 row · 42ms',
    cols: ['metric_definition', 'scope', 'comparison_method', 'baseline_period'],
    rows: [['completed_orders', 'platform_wide', 'same_day_wow', 'Mon Oct 14 – Mon Oct 21']],
    hl: [], hlg: [0],
  },
  p1_segments: {
    status: '4 rows · 210ms',
    cols: ['user_segment', 'orders_this_week', 'orders_last_week', 'wow_change', 'pct_of_total'],
    rows: [
      ['New users (first order)',        '186,000',   '184,000',   '+1.1%',   '9.3%'],
      ['Returning users (2–10 orders)',   '891,000', '1,034,000', '-13.8% ⚠', '44.6%'],
      ['Resurrected (>30d gap)',          '430,000',   '344,000',  '+24.8%',  '21.5%'],
      ['Power users (>20 orders/month)',  '492,000',   '488,000',   '+0.8%',  '24.6%'],
    ],
    hl: [1], hlg: [2],
  },
  p1_funnel: {
    status: '5 rows · 290ms',
    cols: ['funnel_step', 'returning_users_this_wk', 'returning_users_last_wk', 'wow_change'],
    rows: [
      ['App opens',          '1,240,000', '1,512,000', '-18.0% ⚠'],
      ['Restaurant browse',   '890,000',   '981,000',  '-9.3%'],
      ['Menu views',          '622,000',   '687,000',  '-9.5%'],
      ['Add to cart',         '334,000',   '370,000',  '-9.7%'],
      ['Order completed',     '891,000', '1,034,000',  '-13.8%'],
    ],
    hl: [0], hlg: [],
  },
  p1_biryani: {
    status: '6 rows · 340ms',
    cols: ['factor', 'metric', 'value', 'vs_prev_week', 'impact'],
    rows: [
      ['Restaurant quality', 'Biryani Palace NB avg_rating',  '3.2★', 'was 4.1★ (-0.9)', 'HIGH ⚠'],
      ['Restaurant quality', 'Royal Biryani avg_rating',      '3.4★', 'was 4.3★ (-0.9)', 'HIGH ⚠'],
      ['Restaurant quality', 'complaint_rate',               '+290%', 'vs prior 4-week avg', 'HIGH ⚠'],
      ['Competitor promo',   'Zomato NB Biryani discount',    '40%',  'started Mon Oct 21', 'HIGH ⚠'],
      ['Competitor promo',   'Swiggy NB Biryani orders',    '-32.9%', 'WoW', 'CONFIRMED'],
      ['Combined GMV impact','monthly_loss_estimate',        '₹8.8L', '/month unresolved', 'CONFIRMED'],
    ],
    hl: [0, 1, 2, 3], hlg: [4, 5],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// P2_PRODUCE_FIRST  (produce-before-consume prompts for Phase 2)
// ─────────────────────────────────────────────────────────────────────────────
export const P2_PRODUCE_FIRST = {
  clarify: {
    prompt: "What clarification do you ask Priya before pulling any data?",
    mock: "Priya, to confirm: we're looking at North Bangalore specifically, Biryani category, completed orders only — right? And is the -34% against last Monday or the 4-week Tuesday average?",
  },
  decompose: {
    prompt: "Based on the baseline, what are your top 3 hypotheses for the Biryani drop?",
    mock: "Hypothesis 1: Restaurant quality degradation in specific Biryani outlets (supply-side). Hypothesis 2: Competitor promotional pricing pulling price-sensitive users (external). Hypothesis 3: Delivery time increase making the segment uncompetitive (supply-side).",
  },
  causation: {
    prompt: "State your root cause conclusion with supporting evidence from the data.",
    mock: "Root cause 1 (primary): Two key Biryani restaurants dropped below 3.5★ following a complaint spike (+290%), causing organic abandonment. Root cause 2 (amplifier): Zomato ran a 40% promo on the same geography starting Monday, pulling price-sensitive users. Combined effect: -32.9% WoW, -₹8.8L/month.",
  },
  vp: {
    prompt: "Write your executive message to Priya (VP Growth) — max 5 sentences.",
    mock: "Priya — North Bangalore Biryani is down 32.9% WoW, equivalent to ₹8.8L/month lost GMV. Root cause: restaurant quality degradation at Biryani Palace NB and Royal Biryani (both below 3.5★), amplified by a Zomato 40% promo in the same geography starting Monday. Immediate action: (1) quality intervention at both restaurants by Wednesday, (2) targeted counter-promo for NB Biryani users. Expected recovery: 60–70% of drop within 2 weeks.",
  },
};
