// src/components/strategy/data/swiggyStrategyData.js
// Clean minimal data file (guaranteed valid JS)

// KPI DATA
export const KPI_DATA = {
  gmv: { label: "GMV", current: "2.14Cr", prev: "2.33Cr", delta: -8.3 },
  conversion: { label: "Conversion", current: "11.2%", prev: "13.8%", delta: -2.6 },
  cac: { label: "CAC", current: "148", prev: "142", delta: 4.2 },
  fleet: { label: "Fleet", current: "1204", prev: "1198", delta: 0.5 }
};

// FUNNEL
export const FUNNEL_THIS_WEEK = [
  { stage: "App Open", users: 84200 },
  { stage: "Search", users: 61400 },
  { stage: "Menu View", users: 38800 },
  { stage: "Add to Cart", users: 17200 },
  { stage: "Checkout", users: 12100 },
  { stage: "Payment", users: 9440 },
  { stage: "Order Placed", users: 9440 }
];

export const FUNNEL_LAST_WEEK = [
  { stage: "App Open", users: 81600 },
  { stage: "Search", users: 60100 },
  { stage: "Menu View", users: 41200 },
  { stage: "Add to Cart", users: 23800 },
  { stage: "Checkout", users: 17200 },
  { stage: "Payment", users: 14100 },
  { stage: "Order Placed", users: 11580 }
];

// COHORT
export const COHORT_HEADERS = ["Cohort","Size","W1","W2","W3"];

export const COHORT_ROWS = [
  { cohort: "Week 1", size: 3240, retention: [100,58,44] },
  { cohort: "Week 2", size: 2980, retention: [100,55,41] },
  { cohort: "Week 3", size: 3410, retention: [100,52,38] }
];

// IMPACT
export const IMPACT_SIZING = {
  churnedUsers: 820,
  avgOrderValue: 385,
  ordersPerWeek: 2.1
};

// ARJUN MOCK RESPONSES
export const ARJUN_STRATEGY_MOCK = {
  triage_start: "Orders dropped in North Bangalore. What data would you check first?",
  funnel_shown: "Which stage drop seems unusual to you?",
  cohort_shown: "Why might new cohorts churn faster?",
  impact_shown: "How would you estimate the GMV impact?"
};

// SCENARIO
export const SCENARIO = {
  company: "Swiggy",
  city: "North Bangalore",
  metric: "Orders",
  drop: "8.3%"
};