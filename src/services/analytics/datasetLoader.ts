// ============================================================
// DATASET LOADER — ARCHITECTURE
// Responsible for fetching CSVs and registering them with
// the DuckDB WASM engine. Zero raw data reaches the UI.
// ============================================================

import type { DatasetManifest, TableDefinition } from '@/types';

// ------------------------------------------------------------
// LOADER INTERFACE
// ------------------------------------------------------------

export interface IDatasetLoader {
  loadCase(caseId: string, manifest: DatasetManifest): Promise<LoadResult>;
  isTableLoaded(tableName: string): boolean;
  unloadAll(): void;
}

export interface LoadResult {
  success: boolean;
  tablesLoaded: string[];
  errors: LoadError[];
  totalRowsLoaded: number;
  loadTimeMs: number;
}

export interface LoadError {
  tableName: string;
  message: string;
}

// ------------------------------------------------------------
// LAZY LOAD STRATEGY
// Only tables required by current milestone are loaded.
// Keeps initial render fast despite 80k total rows.
// ------------------------------------------------------------

export const MILESTONE_TABLE_MAP: Record<string, string[]> = {
  m1_problem_scoping:    ['bookings'],
  m2_kpi_selection:      ['sessions', 'search_events', 'hotel_views', 'booking_attempts', 'bookings', 'payments', 'inventory_logs'],
  m3_funnel_diagnosis:   ['sessions', 'search_events', 'hotel_views', 'booking_attempts', 'bookings'],
  m4_root_cause:         ['booking_attempts', 'hotel_views', 'search_events', 'price_logs', 'inventory_logs'],
  m5_impact_sizing:      ['bookings', 'booking_attempts'],
  m6_solution_design:    [],
  m7_stakeholder_review: [],
};

// Always loaded at case init — small tables, always needed
export const ALWAYS_LOADED_TABLES = ['users', 'suppliers'];

// ------------------------------------------------------------
// CSV FETCH UTILITY
// Fetches from /public/cases/{caseId}/dataset/{file}
// In production: Netlify static assets
// ------------------------------------------------------------

export async function fetchCSV(basePath: string, file: string): Promise<string> {
  const url = `${basePath}${file}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.text();
}

// ------------------------------------------------------------
// TABLE REGISTRATION TYPE
// DuckDB WASM registration function injected at runtime
// to avoid circular dependencies
// ------------------------------------------------------------

export type RegisterTableFn = (
  tableName: string,
  csvText: string,
  schema: TableDefinition['schema']
) => Promise<void>;

// ------------------------------------------------------------
// LOAD PROGRESS EVENT
// Emitted during loading for UI progress feedback
// ------------------------------------------------------------

export interface LoadProgressEvent {
  phase: 'fetch' | 'register' | 'complete';
  tableName: string;
  progress: number;       // 0.0 – 1.0
  rowsLoaded: number;
}

export type LoadProgressCallback = (event: LoadProgressEvent) => void;
