// ============================================================
// DUCKDB WASM ENGINE — SINGLETON IMPLEMENTATION
// Initializes once, persists across milestone transitions.
// Never returns raw rows — only AggregatedMetrics.
// ============================================================

import type {
  AggregatedMetrics,
  DuckDBEngineState,
  MilestoneType,
  TableDefinition,
} from '@/types';

import type { IDuckDBEngine, QueryParams } from './types';

// DuckDB WASM types — imported dynamically to avoid SSR issues
type DuckDBInstance = {
  connect: () => Promise<DuckDBConnection>;
};

type DuckDBConnection = {
  query: (sql: string) => Promise<DuckDBResult>;
  close: () => Promise<void>;
};

type DuckDBResult = {
  toArray: () => unknown[];
  schema: { fields: { name: string }[] };
};

// ─────────────────────────────────────────────────────────────
// SINGLETON
// ─────────────────────────────────────────────────────────────

let engineInstance: DuckDBEngine | null = null;

export function getDuckDBEngine(): DuckDBEngine {
  if (!engineInstance) {
    engineInstance = new DuckDBEngine();
  }
  return engineInstance;
}

// ─────────────────────────────────────────────────────────────
// ENGINE CLASS
// ─────────────────────────────────────────────────────────────

export class DuckDBEngine implements IDuckDBEngine {
  private db: DuckDBInstance | null = null;
  private conn: DuckDBConnection | null = null;
  private state: DuckDBEngineState = {
    initialized: false,
    tablesLoaded: [],
    error: null,
  };

  // ── INITIALIZE ──────────────────────────────────────────────

  async initialize(): Promise<void> {
    if (this.state.initialized) return;

    try {
      // Dynamic import — keeps WASM out of SSR bundle
      const duckdb = await import('@duckdb/duckdb-wasm');

      const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

      const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

      const workerUrl = URL.createObjectURL(
        new Blob([`importScripts("${bundle.mainWorker!}");`], {
          type: 'text/javascript',
        })
      );

      const worker = new Worker(workerUrl);
      const logger = new duckdb.ConsoleLogger();
      const db = new duckdb.AsyncDuckDB(logger, worker);

      await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
      URL.revokeObjectURL(workerUrl);

      this.db = db as unknown as DuckDBInstance;
      this.conn = await this.db.connect();

      this.state = {
        ...this.state,
        initialized: true,
        error: null,
      };
    } catch (err) {
      this.state = {
        ...this.state,
        error: err instanceof Error ? err.message : 'DuckDB init failed',
      };
      throw err;
    }
  }

  // ── LOAD CASE TABLES ────────────────────────────────────────

  async loadCase(caseId: string, tables: TableDefinition[]): Promise<void> {
    if (!this.conn) throw new Error('DuckDB not initialized');

    for (const table of tables) {
      if (this.state.tablesLoaded.includes(table.name)) continue;

      try {
        const csvUrl = `/cases/${caseId}/dataset/${table.file}`;
        const response = await fetch(csvUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch ${csvUrl}: ${response.statusText}`);
        }

        const csvText = await response.text();

        // Register CSV as in-memory table via DuckDB read_csv_auto
        const escapedCsv = csvText.replace(/'/g, "''");
        const createSQL = `
          CREATE OR REPLACE TABLE ${table.name} AS
          SELECT * FROM read_csv_auto('${table.name}.csv', header=true);
        `;

        // Use DuckDB's file registration instead
        const duckdb = await import('@duckdb/duckdb-wasm');
        const db = this.db as unknown as InstanceType<typeof duckdb.AsyncDuckDB>;
        await db.registerFileText(`${table.name}.csv`, csvText);

        await this.conn.query(
          `CREATE OR REPLACE TABLE ${table.name} AS
           SELECT * FROM read_csv_auto('${table.name}.csv', header=true)`
        );

        this.state = {
          ...this.state,
          tablesLoaded: [...this.state.tablesLoaded, table.name],
        };
      } catch (err) {
        console.error(`Failed to load table ${table.name}:`, err);
        throw err;
      }
    }
  }

  // ── RUN QUERY ───────────────────────────────────────────────

  async runQuery(
    queryId: string,
    params?: QueryParams
  ): Promise<AggregatedMetrics> {
    if (!this.conn) throw new Error('DuckDB not initialized');

    const { MMT_QUERY_MANIFEST } = await import('./types');
    const queryMeta = MMT_QUERY_MANIFEST[queryId];

    if (!queryMeta) {
      throw new Error(`Unknown query: ${queryId}`);
    }

    // Load SQL from file
    const sqlUrl = `/cases/makemytrip_revenue_leak/queries/${queryMeta.file}`;
    const sqlResponse = await fetch(sqlUrl);
    if (!sqlResponse.ok) {
      throw new Error(`Failed to fetch SQL: ${sqlUrl}`);
    }

    let sql = await sqlResponse.text();

    // Inject params if provided
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        sql = sql.replace(
          new RegExp(`:${key}`, 'g'),
          typeof value === 'string' ? `'${value}'` : String(value)
        );
      }
    }

    const startMs = performance.now();

    try {
      const result = await this.conn.query(sql);
      const executionMs = Math.round(performance.now() - startMs);
      const rows = result.toArray();
      const fields = result.schema.fields.map((f: { name: string }) => f.name);

      // Extract metrics — first row for scalar queries,
      // aggregated summary for multi-row queries
      const metrics = extractMetrics(rows, fields, queryMeta.metricKeys);

      return {
        queryId,
        milestoneType: queryMeta.milestoneType,
        executedAt: Date.now(),
        metrics,
        rowCount: rows.length,
        executionMs,
      };
    } catch (err) {
      throw new Error(
        `Query ${queryId} failed: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    }
  }

  // ── STATE ───────────────────────────────────────────────────

  getState(): DuckDBEngineState {
    return { ...this.state };
  }

  // ── DISPOSE ─────────────────────────────────────────────────

  dispose(): void {
    this.conn?.close().catch(console.error);
    this.conn = null;
    this.db = null;
    this.state = { initialized: false, tablesLoaded: [], error: null };
    engineInstance = null;
  }
}

// ─────────────────────────────────────────────────────────────
// METRIC EXTRACTOR
// Converts DuckDB result rows into typed AggregatedMetrics.
// Multi-row results are summarised — raw rows never leave here.
// ─────────────────────────────────────────────────────────────

function extractMetrics(
  rows: unknown[],
  fields: string[],
  metricKeys: string[]
): Record<string, number | string | null> {
  if (rows.length === 0) return {};

  // Single row — extract directly
  if (rows.length === 1) {
    const row = rows[0] as Record<string, unknown>;
    return Object.fromEntries(
      fields.map((f) => [f, coerceValue(row[f])])
    );
  }

  // Multi-row — build summary object with arrays for charting
  const result: Record<string, number | string | null> = {};

  for (const key of metricKeys) {
    if (!fields.includes(key)) continue;

    const values = (rows as Record<string, unknown>[]).map((r) =>
      coerceValue(r[key])
    );

    // Numeric arrays: include as JSON string for chart consumption
    const numericValues = values.filter(
      (v): v is number => typeof v === 'number'
    );

    if (numericValues.length > 0) {
      result[`${key}_series`] = JSON.stringify(values);
      result[`${key}_min`] = Math.min(...numericValues);
      result[`${key}_max`] = Math.max(...numericValues);
      result[`${key}_avg`] = Math.round(
        numericValues.reduce((a, b) => a + b, 0) / numericValues.length
      );
      result[`${key}_last`] = numericValues[numericValues.length - 1] ?? null;
    } else {
      // String series (e.g. week labels)
      result[`${key}_series`] = JSON.stringify(values);
    }
  }

  result['_row_count'] = rows.length;
  return result;
}

function coerceValue(v: unknown): number | string | null {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return v;
  if (typeof v === 'bigint') return Number(v);
  if (typeof v === 'boolean') return v ? 1 : 0;
  if (typeof v === 'string') {
    const n = Number(v);
    return isNaN(n) ? v : n;
  }
  return String(v);
}
