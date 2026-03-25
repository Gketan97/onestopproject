// src/components/case-study/hooks/useDuckDB.js
// Lazy-loads DuckDB-Wasm and registers all Swiggy synthetic CSV tables.
// Only initialises when user clicks "Load Real Data" — never on page load.
// After init, runQuery(sql) executes real SQL and returns { cols, rows, rowCount }.

import { useState, useCallback, useRef } from 'react';

const DATA_BASE = '/data/swiggy/';

// Tables to load — order matters (orders last, it's largest)
const TABLES = [
  { file: 'restaurants',        view: 'prod.restaurants' },
  { file: 'restaurant_reviews', view: 'prod.restaurant_reviews' },
  { file: 'users',              view: 'prod.users' },
  { file: 'crm_config',         view: 'prod.crm_config' },
  { file: 'external_events',    view: 'prod.external_events' },
  { file: 'competitor_pricing', view: 'prod.competitor_pricing' },
  { file: 'weather_events',     view: 'prod.weather_events' },
  { file: 'notifications',      view: 'prod.notifications' },
  { file: 'orders',             view: 'prod.orders' },  // largest — load last
];

export function useDuckDB() {
  const [status, setStatus]     = useState('idle');    // idle|loading|ready|error
  const [progress, setProgress] = useState('');
  const [loadPct, setLoadPct]   = useState(0);
  const dbRef   = useRef(null);
  const connRef = useRef(null);

  const initDB = useCallback(async () => {
    if (status === 'ready' || status === 'loading') return;
    setStatus('loading');
    setLoadPct(0);

    try {
      setProgress('Loading SQL engine…');
      // Dynamic import — only fetched when user opts in
      const duckdb = await import('@duckdb/duckdb-wasm');
      setLoadPct(10);

      const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
      const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
      setLoadPct(20);

      // Inline worker to avoid COOP issues with blob URLs
      const workerUrl = URL.createObjectURL(
        new Blob([`importScripts("${bundle.mainWorker}");`], { type: 'text/javascript' })
      );
      const worker = new Worker(workerUrl);
      const logger = new duckdb.ConsoleLogger();
      const db     = new duckdb.AsyncDuckDB(logger, worker);

      setProgress('Initialising database…');
      await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
      URL.revokeObjectURL(workerUrl);
      setLoadPct(30);

      const conn = await db.connect();

      // Load each CSV file
      for (let i = 0; i < TABLES.length; i++) {
        const { file, view } = TABLES[i];
        setProgress(`Loading ${view} (${i + 1}/${TABLES.length})…`);

        const res     = await fetch(`${DATA_BASE}${file}.csv`);
        const csvText = await res.text();
        const uint8   = new TextEncoder().encode(csvText);

        // Register buffer then create table from it
        await db.registerFileBuffer(`${file}.csv`, uint8);
        // Use backtick-quoted view name so dots work in DuckDB
        const safeName = file.replace(/[^a-z0-9_]/g, '_');
        await conn.query(
          `CREATE OR REPLACE TABLE _${safeName} AS SELECT * FROM read_csv_auto('${file}.csv', AUTO_DETECT=TRUE)`
        );
        // Create view with prod.tablename alias that matches hints
        await conn.query(
          `CREATE OR REPLACE VIEW "${view}" AS SELECT * FROM _${safeName}`
        );

        setLoadPct(30 + Math.round(((i + 1) / TABLES.length) * 65));
      }

      dbRef.current   = db;
      connRef.current = conn;
      setStatus('ready');
      setLoadPct(100);
      setProgress('');
    } catch (err) {
      console.error('[DuckDB] init failed:', err);
      setStatus('error');
      setProgress(`Failed: ${err.message}`);
    }
  }, [status]);

  const runQuery = useCallback(async (sql) => {
    if (!connRef.current) throw new Error('Database not initialised — click Load Real Data first');

    // Safety: cap result rows to prevent tab freeze
    const safeSql = sql.trim();
    const hasLimit = /\bLIMIT\b/i.test(safeSql);
    const execSql  = hasLimit ? safeSql : `${safeSql}\nLIMIT 500`;

    const result = await connRef.current.query(execSql);
    const schema = result.schema.fields.map(f => f.name);
    const rows   = result.toArray().map(row =>
      schema.map(col => {
        const v = row[col];
        if (v === null || v === undefined) return 'NULL';
        if (typeof v === 'bigint') return v.toString();
        return String(v);
      })
    );

    return {
      cols:     schema,
      rows,
      rowCount: rows.length,
      status:   `${rows.length} row${rows.length !== 1 ? 's' : ''} · DuckDB`,
    };
  }, []);

  return { status, progress, loadPct, initDB, runQuery };
}
