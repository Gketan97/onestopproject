/**
 * MarketplaceDB.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Synthetic Database Engine — OneStopCareers Strategic Workbench
 * Sprint 1: Data Physics
 *
 * Architecture: Normalised star-schema modelled on a food-tech marketplace
 * (Swiggy-class) with one active anomaly injection system.
 *
 * Tables:
 *   dim_city          — city master
 *   dim_restaurant    — restaurant master
 *   dim_category      — cuisine category master
 *   dim_date          — calendar dimension (last 28 days + today)
 *   fact_app_sessions — per-city, per-day session + search funnel metrics
 *   fact_orders       — per-city, per-category, per-day order + GMV metrics
 *   fact_restaurant   — per-restaurant, per-day availability + fulfilment
 *   fact_delivery     — per-city, per-day delivery SLA metrics
 *
 * Anomaly: 'SupplyDrop'
 *   Simulates a Tuesday restaurant supply crisis in North Bangalore.
 *   Causal chain: restaurant unavailability ↑ → search_null_results ↑ →
 *   add_to_cart ↓ → Biryani orders ↓ → GMV ↓ → delivery fill-rate unaffected
 *   (demand problem, not logistics).
 *
 * execute(queryType) returns pre-aggregated JSON for three analyst views:
 *   DASHBOARD_KPI     — 12 headline metrics, baseline vs anomaly comparison
 *   CONVERSION_FUNNEL — 7-stage funnel with segment drill-down
 *   COHORT_RETENTION  — 4-week rolling cohort × 4-week retention heatmap
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Constants ───────────────────────────────────────────────────────────────

const CITIES = [
  { id: 'C1', name: 'North Bangalore', zone: 'Bangalore' },
  { id: 'C2', name: 'South Bangalore', zone: 'Bangalore' },
  { id: 'C3', name: 'East Bangalore',  zone: 'Bangalore' },
  { id: 'C4', name: 'Central Bangalore', zone: 'Bangalore' },
];

const CATEGORIES = [
  { id: 'CAT1', name: 'Biryani',      avg_order_value: 320, popularity: 0.28 },
  { id: 'CAT2', name: 'North Indian', avg_order_value: 380, popularity: 0.22 },
  { id: 'CAT3', name: 'South Indian', avg_order_value: 210, popularity: 0.18 },
  { id: 'CAT4', name: 'Chinese',      avg_order_value: 290, popularity: 0.15 },
  { id: 'CAT5', name: 'Pizza',        avg_order_value: 450, popularity: 0.10 },
  { id: 'CAT6', name: 'Desserts',     avg_order_value: 180, popularity: 0.07 },
];

// Day-of-week demand multipliers (0=Sun … 6=Sat)
const DOW_MULTIPLIERS = {
  sessions: [0.88, 0.92, 0.95, 1.0, 1.05, 1.18, 1.10],
  orders:   [0.90, 0.93, 0.96, 1.0, 1.04, 1.15, 1.08],
};

// ─── Seeded deterministic RNG ─────────────────────────────────────────────────
// Ensures every generateBaseline() call returns identical numbers — critical
// for data consistency across user sessions without a real DB.

function seededRng(seed) {
  let s = seed;
  return function () {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function gaussianPair(rng, mean, stddev) {
  // Box-Muller transform
  const u1 = Math.max(1e-10, rng());
  const u2 = rng();
  const z  = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * stddev;
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function round(val, decimals = 0) {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

// ─── Dimension Tables ─────────────────────────────────────────────────────────

function buildDimDate(numDays = 28) {
  const rows = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dow = d.getDay(); // 0=Sun, 2=Tue
    rows.push({
      date_id:    d.toISOString().slice(0, 10),
      day_of_week: dow,
      day_name:   ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][dow],
      week_num:   Math.ceil((numDays - i) / 7),
      is_weekend: dow === 0 || dow === 6,
    });
  }
  return rows;
}

function buildDimRestaurant() {
  const rng  = seededRng(777);
  const rows = [];
  let id = 1;
  for (const city of CITIES) {
    // Each city gets 40 restaurants, mix of categories, different tiers
    for (let i = 0; i < 40; i++) {
      const catIdx = Math.floor(rng() * CATEGORIES.length);
      const cat    = CATEGORIES[catIdx];
      rows.push({
        restaurant_id:  `R${String(id).padStart(4,'0')}`,
        city_id:        city.id,
        city_name:      city.name,
        category_id:    cat.id,
        category_name:  cat.name,
        tier:           rng() < 0.2 ? 'premium' : rng() < 0.5 ? 'mid' : 'value',
        rating:         round(gaussianPair(rng, 4.0, 0.4), 1),
        base_availability: round(0.88 + rng() * 0.10, 3), // 88-98 % available normally
      });
      id++;
    }
  }
  return rows;
}

// ─── Fact Table Generators ────────────────────────────────────────────────────

/**
 * fact_app_sessions
 * Grain: city × date
 * Metrics: sessions, searches, search_null_results, pdp_views, add_to_cart, checkouts
 */
function buildFactSessions(dimDate, _dimCity, anomalyActive = false) {
  const rng  = seededRng(1001);
  const rows = [];

  for (const city of CITIES) {
    // Base daily sessions per city — North BLR is the biggest market
    const baseSessionMap = { C1: 48000, C2: 36000, C3: 28000, C4: 32000 };
    const baseSessions   = baseSessionMap[city.id];

    for (const day of dimDate) {
      const dowMul    = DOW_MULTIPLIERS.sessions[day.day_of_week];
      const noise     = gaussianPair(rng, 1.0, 0.03);
      const sessions  = Math.round(baseSessions * dowMul * noise);

      // Baseline null-result rate: ~6.5 % — restaurants not serving / out of stock
      let nullRate    = gaussianPair(rng, 0.065, 0.008);

      // SupplyDrop anomaly: only North BLR, only Tuesdays
      const isAnomalyDay = anomalyActive
        && city.id === 'C1'
        && day.day_name === 'Tuesday';

      if (isAnomalyDay) {
        // 31 % null result rate — restaurant supply pulled → users search, find nothing
        nullRate = gaussianPair(rng, 0.31, 0.025);
      }

      nullRate = clamp(nullRate, 0, 0.95);

      const searchNullResults = Math.round(sessions * 0.72 * nullRate); // 72 % of sessions search
      const searches          = Math.round(sessions * 0.72);

      // Downstream funnel degrades proportionally to null rate
      // Normal: 62 % of searchers find something & hit PDP
      // Anomaly: null-result users mostly bounce; ~12 % persist and scroll
      const pdpConvRate = isAnomalyDay
        ? clamp(gaussianPair(rng, 0.38, 0.03), 0.2, 0.7)
        : clamp(gaussianPair(rng, 0.62, 0.025), 0.5, 0.8);
      const pdpViews = Math.round(searches * pdpConvRate);

      const addToCartRate = clamp(gaussianPair(rng, 0.48, 0.02), 0.3, 0.65);
      const addToCarts    = Math.round(pdpViews * addToCartRate);

      const checkoutRate = clamp(gaussianPair(rng, 0.71, 0.02), 0.55, 0.85);
      const checkouts    = Math.round(addToCarts * checkoutRate);

      rows.push({
        city_id:             city.id,
        city_name:           city.name,
        date_id:             day.date_id,
        day_name:            day.day_name,
        week_num:            day.week_num,
        sessions,
        searches,
        search_null_results: searchNullResults,
        null_result_rate:    round(searchNullResults / searches, 4),
        pdp_views:           pdpViews,
        add_to_carts:        addToCarts,
        checkouts,
        // Derived conversion rates
        search_to_pdp:       round(pdpViews / searches, 4),
        pdp_to_cart:         round(addToCarts / pdpViews, 4),
        cart_to_checkout:    round(checkouts / addToCarts, 4),
        is_anomaly_day:      isAnomalyDay,
      });
    }
  }
  return rows;
}

/**
 * fact_orders
 * Grain: city × category × date
 * Metrics: orders, gmv, avg_order_value, cancellations, refunds
 */
function buildFactOrders(dimDate, dimRestaurant, anomalyActive = false) {
  const rng  = seededRng(2002);
  const rows = [];

  // Base daily orders for North BLR across all categories
  const baseOrdersNorthBLR = { CAT1: 3200, CAT2: 2500, CAT3: 2100, CAT4: 1700, CAT5: 1100, CAT6: 760 };
  const scaleFactor        = { C1: 1.0, C2: 0.75, C3: 0.58, C4: 0.67 };

  for (const city of CITIES) {
    for (const cat of CATEGORIES) {
      const baseOrders = (baseOrdersNorthBLR[cat.id] || 1000) * scaleFactor[city.id];

      for (const day of dimDate) {
        const dowMul = DOW_MULTIPLIERS.orders[day.day_of_week];
        const noise  = gaussianPair(rng, 1.0, 0.04);

        let orderCount = Math.round(baseOrders * dowMul * noise);

        // SupplyDrop anomaly: North BLR, Tuesday, Biryani — 47 % order drop
        const isAnomalyDay = anomalyActive
          && city.id === 'C1'
          && cat.id  === 'CAT1'  // Biryani
          && day.day_name === 'Tuesday';

        if (isAnomalyDay) {
          orderCount = Math.round(orderCount * gaussianPair(rng, 0.53, 0.04));
        }

        orderCount = Math.max(0, orderCount);

        const aovNoise  = gaussianPair(rng, 1.0, 0.05);
        const aov       = round(cat.avg_order_value * aovNoise, 1);
        const gmv       = round(orderCount * aov, 0);

        // Cancel rate slightly higher on anomaly (users ordered, restaurant pulled out)
        const cancelRate = isAnomalyDay
          ? clamp(gaussianPair(rng, 0.11, 0.015), 0.06, 0.20)
          : clamp(gaussianPair(rng, 0.04, 0.008), 0.02, 0.09);

        const cancellations = Math.round(orderCount * cancelRate);
        const refundRate    = isAnomalyDay
          ? clamp(gaussianPair(rng, 0.08, 0.012), 0.04, 0.15)
          : clamp(gaussianPair(rng, 0.025, 0.005), 0.01, 0.06);
        const refunds       = Math.round(orderCount * refundRate);

        rows.push({
          city_id:         city.id,
          city_name:       city.name,
          category_id:     cat.id,
          category_name:   cat.name,
          date_id:         day.date_id,
          day_name:        day.day_name,
          week_num:        day.week_num,
          orders:          orderCount,
          gmv,
          avg_order_value: aov,
          cancellations,
          refunds,
          cancel_rate:     round(cancellations / Math.max(orderCount, 1), 4),
          refund_rate:     round(refunds / Math.max(orderCount, 1), 4),
          net_gmv:         round(gmv - (refunds * aov), 0),
          is_anomaly_day:  isAnomalyDay,
        });
      }
    }
  }
  return rows;
}

/**
 * fact_restaurant
 * Grain: restaurant × date
 * Tracks availability, avg prep time, rating trend
 */
function buildFactRestaurant(dimDate, dimRestaurant, anomalyActive = false) {
  const rng  = seededRng(3003);
  const rows = [];

  for (const r of dimRestaurant) {
    for (const day of dimDate) {
      const isAnomalyDay = anomalyActive
        && r.city_id       === 'C1'
        && r.category_name === 'Biryani'
        && day.day_name    === 'Tuesday';

      // Normal availability from restaurant master
      let availability = isAnomalyDay
        ? clamp(gaussianPair(rng, 0.34, 0.12), 0.0, 0.70)  // 66 % of Biryani joints in N.BLR closed
        : clamp(gaussianPair(rng, r.base_availability, 0.03), 0.5, 1.0);

      const prepTime = isAnomalyDay
        ? round(gaussianPair(rng, 38, 5), 1)   // Surviving restaurants are overwhelmed
        : round(gaussianPair(rng, 26, 4), 1);

      rows.push({
        restaurant_id:  r.restaurant_id,
        city_id:        r.city_id,
        city_name:      r.city_name,
        category_id:    r.category_id,
        category_name:  r.category_name,
        date_id:        day.date_id,
        day_name:       day.day_name,
        availability:   round(availability, 3),
        avg_prep_time:  prepTime,
        is_anomaly_day: isAnomalyDay,
      });
    }
  }
  return rows;
}

/**
 * fact_delivery
 * Grain: city × date
 * Delivery SLA: delivery partners are NOT affected by SupplyDrop
 * (demand problem, not logistics — important red herring for investigators)
 */
function buildFactDelivery(dimDate, _dimCity, anomalyActive = false) {
  const rng  = seededRng(4004);
  const rows = [];

  const baseDeliveryTime = { C1: 28, C2: 31, C3: 33, C4: 30 }; // minutes

  for (const city of CITIES) {
    for (const day of dimDate) {
      const noise       = gaussianPair(rng, 1.0, 0.04);
      const avgTime     = round(baseDeliveryTime[city.id] * noise, 1);
      const onTimeRate  = clamp(gaussianPair(rng, 0.87, 0.02), 0.75, 0.97);
      const partnerUtil = clamp(gaussianPair(rng, 0.74, 0.03), 0.60, 0.90);

      // KEY: delivery metrics are UNCHANGED on anomaly days
      // This is the investigative twist: SLA is fine → supply is the problem, not ops
      rows.push({
        city_id:              city.id,
        city_name:            city.name,
        date_id:              day.date_id,
        day_name:             day.day_name,
        avg_delivery_time:    avgTime,
        on_time_rate:         round(onTimeRate, 4),
        partner_utilisation:  round(partnerUtil, 4),
        active_partners:      Math.round(gaussianPair(rng, city.id === 'C1' ? 820 : 500, 40)),
      });
    }
  }
  return rows;
}

// ─── Cohort Engine ────────────────────────────────────────────────────────────

/**
 * buildCohortData
 * 4-week acquisition cohorts × 4-week retention.
 * Slightly degraded retention for North BLR cohort 3 (acquired the week of the
 * anomaly) — users who experienced null results are less likely to return.
 */
function buildCohortData(anomalyActive = false) {
  const rng = seededRng(5005);

  const cohorts = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const weeks   = ['W0', 'W1', 'W2', 'W3'];

  // Baseline retention curves (decay function)
  const baseRetention = [
    [1.00, 0.42, 0.31, 0.24],  // Week 1 cohort
    [1.00, 0.41, 0.30, 0.23],  // Week 2 cohort
    [1.00, 0.39, 0.28, 0.22],  // Week 3 cohort (anomaly week — slightly worse)
    [1.00, 0.43, 0.32, null],  // Week 4 cohort — W3 not yet observable
  ];

  const cohortSizes = [4200, 3900, 4100, 4400]; // new users acquired that week

  const data = cohorts.map((cohort, ci) => {
    const row = { cohort, cohort_size: cohortSizes[ci] };
    weeks.forEach((w, wi) => {
      const base = baseRetention[ci][wi];
      if (base === null) {
        row[w] = null;
        return;
      }
      const noise   = gaussianPair(rng, 1.0, 0.02);
      // Anomaly: cohort acquired during week 3 has ~18% worse retention (W1 onward)
      const penalty = (anomalyActive && ci === 2 && wi > 0) ? 0.82 : 1.0;
      row[w]        = round(clamp(base * noise * penalty, 0, 1), 3);
    });
    return row;
  });

  return { cohorts, weeks, data };
}

// ─── Database Object ──────────────────────────────────────────────────────────

let _db = null; // module-level cache

function buildDatabase(anomalyType = null) {
  const dimDate       = buildDimDate(28);
  const dimCity       = CITIES;
  const dimCategory   = CATEGORIES;
  const dimRestaurant = buildDimRestaurant();

  const anomalyActive = anomalyType === 'SupplyDrop';

  const factSessions    = buildFactSessions(dimDate, dimCity, anomalyActive);
  const factOrders      = buildFactOrders(dimDate, dimRestaurant, anomalyActive);
  const factRestaurant  = buildFactRestaurant(dimDate, dimRestaurant, anomalyActive);
  const factDelivery    = buildFactDelivery(dimDate, dimCity, anomalyActive);
  const cohortData      = buildCohortData(anomalyActive);

  return {
    meta: {
      generated_at: new Date().toISOString(),
      anomaly:      anomalyType,
      days:         dimDate.length,
      cities:       dimCity.length,
      restaurants:  dimRestaurant.length,
    },
    dim:  { date: dimDate, city: dimCity, category: dimCategory, restaurant: dimRestaurant },
    fact: { sessions: factSessions, orders: factOrders, restaurant: factRestaurant, delivery: factDelivery },
    cohort: cohortData,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * generateBaseline()
 * Returns the full DB with no anomaly applied.
 */
export function generateBaseline() {
  _db = buildDatabase(null);
  return _db;
}

/**
 * applyAnomaly(type)
 * Rebuilds the DB with the specified anomaly injected.
 * Supported types: 'SupplyDrop'
 */
export function applyAnomaly(type) {
  const supported = ['SupplyDrop'];
  if (!supported.includes(type)) {
    throw new Error(`Unknown anomaly type "${type}". Supported: ${supported.join(', ')}`);
  }
  _db = buildDatabase(type);
  return _db;
}

/**
 * execute(queryType)
 * Returns pre-aggregated JSON for analyst dashboards.
 * Lazily initialises baseline DB if none has been generated yet.
 *
 * queryType: 'DASHBOARD_KPI' | 'CONVERSION_FUNNEL' | 'COHORT_RETENTION'
 */
export function execute(queryType) {
  if (!_db) generateBaseline();
  const db = _db;

  switch (queryType) {

    // ── DASHBOARD_KPI ──────────────────────────────────────────────────────
    case 'DASHBOARD_KPI': {
      // Aggregate last 7 days vs prior 7 days for each city
      const allDates = db.dim.date.map(d => d.date_id).sort();
      const last7    = new Set(allDates.slice(-7));
      const prev7    = new Set(allDates.slice(-14, -7));

      const kpiByCity = {};
      for (const city of db.dim.city) {
        const sessions = db.fact.sessions.filter(r => r.city_id === city.id);
        const orders   = db.fact.orders.filter(r => r.city_id === city.id);
        const delivery = db.fact.delivery.filter(r => r.city_id === city.id);

        const aggregate = (rows, dateSet) => {
          const filtered = rows.filter(r => dateSet.has(r.date_id));
          return {
            sessions:     filtered.reduce((s, r) => s + (r.sessions || 0), 0),
            orders:       filtered.reduce((s, r) => s + (r.orders   || 0), 0),
            gmv:          filtered.reduce((s, r) => s + (r.gmv      || 0), 0),
            null_results: filtered.reduce((s, r) => s + (r.search_null_results || 0), 0),
            searches:     filtered.reduce((s, r) => s + (r.searches || 0), 0),
            checkouts:    filtered.reduce((s, r) => s + (r.checkouts || 0), 0),
            add_to_carts: filtered.reduce((s, r) => s + (r.add_to_carts || 0), 0),
            cancellations: filtered.reduce((s, r) => s + (r.cancellations || 0), 0),
            avg_delivery: filtered.length
              ? round(filtered.reduce((s, r) => s + (r.avg_delivery_time || 0), 0) / filtered.length, 1)
              : 0,
            on_time_rate: filtered.length
              ? round(filtered.reduce((s, r) => s + (r.on_time_rate || 0), 0) / filtered.length, 4)
              : 0,
          };
        };

        // Merge sessions + orders rows on date for aggregation (they have different grains)
        const aggSessions_L7  = aggregate(sessions, last7);
        const aggOrders_L7    = aggregate(orders, last7);
        const aggDelivery_L7  = aggregate(delivery, last7);
        const aggSessions_P7  = aggregate(sessions, prev7);
        const aggOrders_P7    = aggregate(orders, prev7);

        const safe_pct = (curr, prev) =>
          prev === 0 ? null : round((curr - prev) / prev * 100, 2);

        kpiByCity[city.name] = {
          city_id:   city.id,
          city_name: city.name,
          period:    'last_7d_vs_prior_7d',
          metrics: {
            total_sessions:        { value: aggSessions_L7.sessions,  wow: safe_pct(aggSessions_L7.sessions,  aggSessions_P7.sessions)  },
            total_orders:          { value: aggOrders_L7.orders,       wow: safe_pct(aggOrders_L7.orders,      aggOrders_P7.orders)       },
            total_gmv:             { value: aggOrders_L7.gmv,          wow: safe_pct(aggOrders_L7.gmv,         aggOrders_P7.gmv)          },
            null_result_rate:      {
              value: round(aggSessions_L7.null_results / Math.max(aggSessions_L7.searches, 1), 4),
              wow:   safe_pct(
                aggSessions_L7.null_results / Math.max(aggSessions_L7.searches, 1),
                aggSessions_P7.null_results / Math.max(aggSessions_P7.searches, 1)
              ),
            },
            session_to_checkout:   {
              value: round(aggSessions_L7.checkouts / Math.max(aggSessions_L7.sessions, 1), 4),
              wow:   safe_pct(
                aggSessions_L7.checkouts / Math.max(aggSessions_L7.sessions, 1),
                aggSessions_P7.checkouts / Math.max(aggSessions_P7.sessions, 1)
              ),
            },
            cancel_rate:           {
              value: round(aggOrders_L7.cancellations / Math.max(aggOrders_L7.orders, 1), 4),
              wow:   safe_pct(
                aggOrders_L7.cancellations / Math.max(aggOrders_L7.orders, 1),
                aggOrders_P7.cancellations / Math.max(aggOrders_P7.orders, 1)
              ),
            },
            avg_delivery_time:     { value: aggDelivery_L7.avg_delivery, wow: null },
            on_time_delivery_rate: { value: aggDelivery_L7.on_time_rate, wow: null },
          },
        };
      }

      // Summary row: North BLR headline for incident report
      const nb = kpiByCity['North Bangalore'];
      return {
        query:          'DASHBOARD_KPI',
        anomaly:         db.meta.anomaly,
        headline_city:   'North Bangalore',
        headline_alert: db.meta.anomaly === 'SupplyDrop' ? {
          metric:    'total_gmv',
          wow_pct:   nb.metrics.total_gmv.wow,
          signal:    'null_result_rate spiked +' + round(
            (nb.metrics.null_result_rate.value - 0.065) / 0.065 * 100, 1
          ) + '% above baseline in North Bangalore this week',
        } : null,
        by_city: kpiByCity,
      };
    }

    // ── CONVERSION_FUNNEL ──────────────────────────────────────────────────
    case 'CONVERSION_FUNNEL': {
      const allDates = db.dim.date.map(d => d.date_id).sort();
      const last7    = new Set(allDates.slice(-7));

      // North BLR only — that's what the investigation focuses on
      const sessions = db.fact.sessions
        .filter(r => r.city_id === 'C1' && last7.has(r.date_id));

      const totals = sessions.reduce((acc, r) => {
        acc.sessions     += r.sessions;
        acc.searches     += r.searches;
        acc.null_results += r.search_null_results;
        acc.pdp_views    += r.pdp_views;
        acc.add_to_carts += r.add_to_carts;
        acc.checkouts    += r.checkouts;
        return acc;
      }, { sessions: 0, searches: 0, null_results: 0, pdp_views: 0, add_to_carts: 0, checkouts: 0 });

      // Approximate placed orders from orders table
      const orders = db.fact.orders
        .filter(r => r.city_id === 'C1' && last7.has(r.date_id))
        .reduce((s, r) => s + r.orders, 0);

      const funnel = [
        { stage: 'App Sessions',       count: totals.sessions,     step_conv: null,                                                                     end_to_end: 1.0 },
        { stage: 'Searches',           count: totals.searches,     step_conv: round(totals.searches / totals.sessions, 4),                              end_to_end: round(totals.searches / totals.sessions, 4) },
        { stage: 'Results Found',      count: totals.searches - totals.null_results, step_conv: round((totals.searches - totals.null_results) / totals.searches, 4), end_to_end: round((totals.searches - totals.null_results) / totals.sessions, 4) },
        { stage: 'PDP Views',          count: totals.pdp_views,    step_conv: round(totals.pdp_views / (totals.searches - totals.null_results), 4),     end_to_end: round(totals.pdp_views / totals.sessions, 4) },
        { stage: 'Add to Cart',        count: totals.add_to_carts, step_conv: round(totals.add_to_carts / totals.pdp_views, 4),                         end_to_end: round(totals.add_to_carts / totals.sessions, 4) },
        { stage: 'Checkout Initiated', count: totals.checkouts,    step_conv: round(totals.checkouts / totals.add_to_carts, 4),                         end_to_end: round(totals.checkouts / totals.sessions, 4) },
        { stage: 'Orders Placed',      count: orders,              step_conv: round(orders / totals.checkouts, 4),                                       end_to_end: round(orders / totals.sessions, 4) },
      ];

      // Segment breakdown: by day-of-week for Tuesday vs rest
      const byDow = {};
      sessions.forEach(r => {
        if (!byDow[r.day_name]) byDow[r.day_name] = { ...r };
        else {
          byDow[r.day_name].sessions     += r.sessions;
          byDow[r.day_name].searches     += r.searches;
          byDow[r.day_name].search_null_results += r.search_null_results;
          byDow[r.day_name].pdp_views    += r.pdp_views;
          byDow[r.day_name].add_to_carts += r.add_to_carts;
          byDow[r.day_name].checkouts    += r.checkouts;
        }
      });

      const dow_segment = Object.entries(byDow).map(([day, r]) => ({
        day_name:         day,
        null_result_rate: round(r.search_null_results / Math.max(r.searches, 1), 4),
        pdp_conv:         round(r.pdp_views / Math.max(r.searches, 1), 4),
        cart_conv:        round(r.add_to_carts / Math.max(r.pdp_views, 1), 4),
        checkout_conv:    round(r.checkouts / Math.max(r.add_to_carts, 1), 4),
      }));

      return {
        query:     'CONVERSION_FUNNEL',
        anomaly:   db.meta.anomaly,
        city:      'North Bangalore',
        period:    'last_7_days',
        funnel,
        segment_by_day: dow_segment,
        annotation: db.meta.anomaly === 'SupplyDrop'
          ? 'Tuesday shows 4.8× higher null_result_rate vs rest of week. Search→PDP conversion collapses 39% below weekly average.'
          : 'Funnel operating within normal variance across all days.',
      };
    }

    // ── COHORT_RETENTION ──────────────────────────────────────────────────
    case 'COHORT_RETENTION': {
      const c = db.cohort;

      // Build heatmap cells with absolute counts
      const heatmap = c.data.map(row => {
        const cells = c.weeks.map(w => ({
          week:            w,
          retention_rate:  row[w],
          retained_users:  row[w] !== null ? Math.round(row.cohort_size * row[w]) : null,
        }));
        return {
          cohort:       row.cohort,
          cohort_size:  row.cohort_size,
          cells,
        };
      });

      return {
        query:       'COHORT_RETENTION',
        anomaly:     db.meta.anomaly,
        description: '4-week rolling new-user cohorts × 4-week retention window. North Bangalore.',
        cohorts:     c.cohorts,
        weeks:       c.weeks,
        heatmap,
        annotation:  db.meta.anomaly === 'SupplyDrop'
          ? 'Week 3 cohort (acquired during SupplyDrop) shows W1 retention of ~32% vs ~41% baseline — 18% degradation. Users who experienced null results converted at lower return rates.'
          : 'Retention curves within ±3% of historical baseline across all cohorts.',
      };
    }

    default:
      throw new Error(
        `Unknown queryType "${queryType}". Valid options: DASHBOARD_KPI, CONVERSION_FUNNEL, COHORT_RETENTION`
      );
  }
}

// ─── Default export convenience ───────────────────────────────────────────────

const MarketplaceDB = { generateBaseline, applyAnomaly, execute };
export default MarketplaceDB;