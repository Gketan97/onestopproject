// ============================================================
// DUCKDB ANALYTICS ENGINE — SERVICE INTERFACE
// Defines the contract for all analytics operations.
// Implementation in services/analytics/DuckDBEngine.ts
// ============================================================

import type {
  AggregatedMetrics,
  DuckDBEngineState,
  MilestoneType,
  QueryDefinition,
  TableDefinition,
} from '@/types';

// ------------------------------------------------------------
// ENGINE INTERFACE
// ------------------------------------------------------------

export interface IDuckDBEngine {
  initialize(): Promise<void>;
  loadCase(caseId: string, tables: TableDefinition[]): Promise<void>;
  runQuery(queryId: string, params?: QueryParams): Promise<AggregatedMetrics>;
  getState(): DuckDBEngineState;
  dispose(): void;
}

export type QueryParams = Record<string, string | number | boolean>;

// ------------------------------------------------------------
// QUERY REGISTRY
// ------------------------------------------------------------

export interface QueryRegistry {
  [queryId: string]: QueryDefinition;
}

// ------------------------------------------------------------
// MMT CASE QUERY MANIFEST
// ------------------------------------------------------------

export const MMT_QUERY_MANIFEST: Record<string, {
  file: string;
  milestoneType: MilestoneType;
  metricKeys: string[];
}> = {

  // M1 — Problem Scoping
  q_revenue_trend: {
    file: 'q_revenue_trend.sql',
    milestoneType: 'problem_scoping',
    metricKeys: ['week_number', 'total_revenue', 'bookings_count', 'revenue_per_booking', 'wow_change_pct'],
  },
  q_booking_volume_trend: {
    file: 'q_booking_volume_trend.sql',
    milestoneType: 'problem_scoping',
    metricKeys: ['week_number', 'sessions', 'search_events', 'booking_attempts', 'bookings'],
  },

  // M2 — KPI Selection
  q_kpi_snapshot: {
    file: 'q_kpi_snapshot.sql',
    milestoneType: 'kpi_selection',
    metricKeys: [
      'avg_revenue_per_booking_pre', 'avg_revenue_per_booking_post',
      'session_to_search_rate', 'search_to_view_rate',
      'view_to_attempt_rate', 'attempt_to_booking_rate',
      'supplier_success_rate', 'payment_success_rate',
    ],
  },
  q_funnel_overview: {
    file: 'q_funnel_overview.sql',
    milestoneType: 'kpi_selection',
    metricKeys: ['stage', 'count', 'conversion_rate', 'wow_delta'],
  },
  q_session_conversion: {
    file: 'q_session_conversion.sql',
    milestoneType: 'kpi_selection',
    metricKeys: ['week_number', 'sessions', 'bookings', 'conversion_rate'],
  },

  // M3 — Funnel Diagnosis
  q_funnel_stages: {
    file: 'q_funnel_stages.sql',
    milestoneType: 'funnel_diagnosis',
    metricKeys: ['search_to_view', 'view_to_attempt', 'attempt_to_booking', 'weakest_stage'],
  },
  q_funnel_weekly_trend: {
    file: 'q_funnel_weekly_trend.sql',
    milestoneType: 'funnel_diagnosis',
    metricKeys: ['week_number', 'search_to_view', 'view_to_attempt', 'attempt_to_booking'],
  },
  q_checkout_drop: {
    file: 'q_checkout_drop.sql',
    milestoneType: 'funnel_diagnosis',
    metricKeys: ['week_number', 'attempts', 'abandoned', 'abandonment_rate', 'primary_abandonment_reason'],
  },

  // M4 — Root Cause
  q_pricing_anomaly: {
    file: 'q_pricing_anomaly.sql',
    milestoneType: 'root_cause',
    metricKeys: ['week_number', 'avg_search_price', 'avg_checkout_price', 'avg_price_delta_pct', 'pct_with_price_shock'],
  },
  q_supplier_failure_rate: {
    file: 'q_supplier_failure_rate.sql',
    milestoneType: 'root_cause',
    metricKeys: ['week_number', 'total_attempts', 'supplier_failures', 'failure_rate'],
  },
  q_dynamic_pricing_log: {
    file: 'q_dynamic_pricing_log.sql',
    milestoneType: 'root_cause',
    metricKeys: ['week_number', 'algorithm_version', 'avg_multiplier', 'max_multiplier', 'entries_count'],
  },
  q_price_at_checkout_vs_search: {
    file: 'q_price_at_checkout_vs_search.sql',
    milestoneType: 'root_cause',
    metricKeys: ['week_number', 'is_domestic', 'avg_search_price', 'avg_checkout_price', 'delta_pct'],
  },

  // M5 — Impact Sizing
  q_revenue_lost_estimate: {
    file: 'q_revenue_lost_estimate.sql',
    milestoneType: 'impact_sizing',
    metricKeys: ['baseline_rpb', 'current_rpb', 'weekly_bookings', 'weekly_revenue_loss', 'total_revenue_lost_6w'],
  },
  q_affected_bookings: {
    file: 'q_affected_bookings.sql',
    milestoneType: 'impact_sizing',
    metricKeys: ['total_attempts_post_w16', 'abandoned_due_to_price_shock', 'abandoned_pct', 'estimated_lost_bookings'],
  },
  q_recovery_projection: {
    file: 'q_recovery_projection.sql',
    milestoneType: 'impact_sizing',
    metricKeys: ['current_attempt_to_booking', 'baseline_attempt_to_booking', 'recovery_booking_delta', 'projected_weekly_revenue_gain'],
  },
};
