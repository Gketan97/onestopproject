// SQL editor — shimmer skeleton on run, active glow, button depress, dual-mode execution
import React, { useState, useCallback, useRef } from 'react';
import { SQL_RES, MOCK } from '../data/swiggyData.js';
import { useArjun } from '../hooks/useArjun.js';
import { useDuckDB } from '../hooks/useDuckDB.js';
import Workbook from './Workbook.jsx';

function guessKey(query) {
  const q = (query || '').toLowerCase();
  if (q.includes('weather') || q.includes('rain'))                               return 'p2_weather';
  if (q.includes('competitor') || q.includes('external_events'))                  return 'p2_external';
  if (q.includes('zomato') && (q.includes('promo') || q.includes('discount')))    return 'p2_external';
  if (q.includes('competitor_pricing') || q.includes('avg_price'))                return 'p2_competitor_pricing';
  if (q.includes('restaurant') && (q.includes('rating') || q.includes('review'))) return 'p2_restaurants';
  if (q.includes('cuisine') || (q.includes('biryani') && q.includes('area')))     return 'p2_baseline';
  if (q.includes('delivery_area') || q.includes('north_bangalore'))               return 'p2_baseline';
  if (q.includes('cohort') || q.includes('first_order') || q.includes('day30'))   return 'p3_cohort';
  if (q.includes('ltv') || (q.includes('retention') && q.includes('gmv')))        return 'p3_ltv';
  if (q.includes('notification') || q.includes('crm') || q.includes('re_engagement')) return 'p1_notification';
  if (q.includes('user_type') || q.includes('returning'))                          return 'p1_user_type';
  if (q.includes('config') || q.includes('target_segment'))                        return 'p1_crm';
  return null;
}

// ── Shimmer skeleton rows ─────────────────────────────────────────────────────
function ShimmerRows({ cols = 3, rows = 3 }) {
  return (
    <div className="px-2 py-2 space-y-1.5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-2">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="shimmer-row h-6 rounded flex-1"
              style={{ animationDelay: `${(i * cols + j) * 0.05}s` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Results table ─────────────────────────────────────────────────────────────
function ResultsTable({ data }) {
  if (!data) return null;
  return (
    <div className="overflow-x-auto max-h-52 overflow-y-auto sql-scroll custom-scrollbar">
      <table className="w-full border-collapse font-mono text-[11px]">
        <thead>
          <tr>
            {data.cols.map((col) => (
              <th key={col} className="bg-sql-surface text-sql-kw px-2.5 py-1.5 text-left border-b border-sql-border text-[10px] sticky top-0">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr key={i} className={`block-enter ${
              data.hl?.includes(i)  ? 'bg-red/10 text-[#F38BA8]'  :
              data.hlg?.includes(i) ? 'bg-green/10 text-sql-str' :
              'hover:bg-sql-surface'
            }`} style={{ animationDelay: `${i * 40}ms` }}>
              {row.map((cell, j) => (
                <td key={j} className="text-sql-text px-2.5 py-1.5 border-b border-sql-border/80">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── DuckDB mode indicator ─────────────────────────────────────────────────────
function RealModeToggle({ status, progress, loadPct, onInit }) {
  if (status === 'idle') return (
    <button onClick={onInit} className="btn-depress text-[10px] font-mono border px-2 py-0.5 rounded transition-colors"
      style={{ color: 'var(--sql-num)', borderColor: 'rgba(249,226,175,0.3)' }}
      onMouseEnter={e => e.target.style.background='rgba(249,226,175,0.1)'}
      onMouseLeave={e => e.target.style.background='transparent'}>
      ⚡ Load Real Data
    </button>
  );
  if (status === 'loading') return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1 rounded-full overflow-hidden" style={{ background: 'var(--sql-border)' }}>
        <div className="h-full rounded-full transition-all duration-300"
          style={{ width: `${loadPct}%`, background: 'var(--sql-num)' }} />
      </div>
      <span className="font-mono text-[10px] animate-pulse" style={{ color: 'var(--sql-comment)' }}>
        {progress || 'Loading…'}
      </span>
    </div>
  );
  if (status === 'ready') return (
    <span className="font-mono text-[10px]" style={{ color: 'var(--sql-str)' }}>● Real Data</span>
  );
  if (status === 'error') return (
    <button onClick={onInit} className="font-mono text-[10px]" style={{ color: '#F38BA8' }}>↺ Retry</button>
  );
  return null;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function SqlWorkbench({
  id,
  title = 'query.sql',
  dataKey = null,
  placeholder = '-- Write your SQL query...\nSELECT ...',
  onRun,
  showEvaluate = true,
}) {
  const [query,      setQuery]      = useState('');
  const [status,     setStatus]     = useState({ text: 'Write a query and click Run', type: 'idle' });
  const [results,    setResults]    = useState(null);
  const [evalResult, setEvalResult] = useState(null);
  const [running,    setRunning]    = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [showWb,     setShowWb]     = useState(false);
  const [focused,    setFocused]    = useState(false);
  const textareaRef = useRef(null);

  const { callArjun } = useArjun();
  const { status: dbStatus, progress: dbProgress, loadPct, initDB, runQuery: dbRunQuery } = useDuckDB();

  const validateQuery = (q) => {
    const ql = q.toLowerCase();
    if (!q.trim() || q.trim().split(/\s+/).length < 4) return 'Query too short.';
    if (ql.includes('select *') && !ql.includes('limit')) return 'Avoid SELECT * — be explicit about columns.';
    if (ql.includes('count(') && !ql.includes('distinct') && !ql.includes('count(1)')) return 'Use COUNT(DISTINCT order_id) to avoid double-counting.';
    return null;
  };

  const execQuery = useCallback(async () => {
    const q = query.trim();
    if (!q) { setStatus({ text: 'Write a query first', type: 'err' }); return; }
    const valErr = validateQuery(q);
    if (valErr) { setStatus({ text: valErr, type: 'err' }); return; }

    setRunning(true);
    setResults(null);
    setEvalResult(null);
    setStatus({ text: 'Running…', type: 'running' });

    if (dbStatus === 'ready') {
      try {
        const data = await dbRunQuery(q);
        setStatus({ text: data.status, type: 'ok' });
        setResults(data);
        onRun?.(q);
      } catch (err) {
        setStatus({ text: `SQL Error: ${err.message}`, type: 'err' });
      }
    } else {
      await new Promise(r => setTimeout(r, 1100)); // slightly longer for shimmer to feel good
      const key  = dataKey || guessKey(q);
      const data = SQL_RES[key];
      if (!data) {
        setStatus({ text: 'No matching data — try a different table or angle.', type: 'err' });
      } else {
        setStatus({ text: data.status || 'Query complete', type: 'ok' });
        setResults(data);
        onRun?.(q);
      }
    }
    setRunning(false);
  }, [query, dataKey, dbStatus, dbRunQuery, onRun]);

  const evaluate = useCallback(async () => {
    const q = query.trim();
    if (!q) { alert('Write a query first.'); return; }
    await execQuery();
    setEvaluating(true);
    setEvalResult({ loading: true });
    const fb = await callArjun(`SQL: ${q}\nContext: ${dataKey || 'Swiggy analytics investigation'}`, 'sql');
    const isIssue = fb.trimStart().toUpperCase().startsWith('ISSUE:');
    setEvalResult({ text: fb.replace(/^(ISSUE:|GOOD:)\s*/i, ''), isIssue });
    setEvaluating(false);
  }, [query, dataKey, execQuery, callArjun]);

  const statusClass = status.type === 'ok' ? 'text-sql-str' : status.type === 'err' ? 'text-[#F38BA8]' : status.type === 'running' ? 'text-sql-num' : 'text-sql-comment';

  return (
    <>
      <div className={`bg-sql-bg border border-sql-border rounded-xl overflow-hidden my-3 transition-all duration-250 ${focused ? 'sql-workbench-focused' : ''}`}>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-sql-surface border-b border-sql-border">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red/60" />
            <span className="w-2 h-2 rounded-full bg-amber/60" />
            <span className="w-2 h-2 rounded-full bg-green/60" />
            <span className="font-mono text-[10px] text-sql-kw font-semibold tracking-wide ml-1">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <RealModeToggle status={dbStatus} progress={dbProgress} loadPct={loadPct} onInit={initDB} />
            <div className="w-px h-3 bg-sql-border mx-1" />
            <button
              onClick={execQuery}
              disabled={running}
              className="sql-run-btn btn-depress bg-phase2 hover:bg-[#163BB0] disabled:opacity-50 text-white text-[11px] font-semibold font-sans px-3 py-1 rounded cursor-pointer transition-all"
            >
              {running ? '…' : '▶ Run'}
            </button>
            {showEvaluate && (
              <button
                onClick={evaluate}
                disabled={evaluating}
                className="btn-depress bg-transparent border border-sql-num/25 hover:bg-sql-num/10 disabled:opacity-50 text-sql-num text-[11px] font-semibold font-sans px-3 py-1 rounded cursor-pointer transition-colors"
              >
                {evaluating ? '…' : 'Evaluate'}
              </button>
            )}
          </div>
        </div>

        {/* ── Editor ── */}
        <textarea
          ref={textareaRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); execQuery(); }}}
          placeholder={placeholder}
          className="w-full bg-sql-bg border-none outline-none text-sql-text font-mono text-xs leading-relaxed px-3.5 py-3 resize-y min-h-[90px] custom-scrollbar"
          spellCheck={false}
        />

        {/* ── Shimmer (while running) ── */}
        {running && <ShimmerRows cols={3} rows={3} />}

        {/* ── Results ── */}
        {!running && results && <ResultsTable data={results} />}

        {/* ── Open in Workbook ── */}
        {!running && results && (
          <div className="px-3.5 py-2 border-t border-sql-border bg-sql-surface flex items-center justify-between">
            <span className="font-mono text-[10px] text-sql-comment">
              {results.rows.length} row{results.rows.length !== 1 ? 's' : ''} · {dbStatus === 'ready' ? 'DuckDB' : 'mock'}
            </span>
            <button
              onClick={() => setShowWb(true)}
              className="btn-depress font-mono text-[11px] border px-2.5 py-1 rounded transition-all"
              style={{ color: 'var(--sql-num)', borderColor: 'rgba(249,226,175,0.25)' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(249,226,175,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}
            >
              ⊞ Open in Workbook →
            </button>
          </div>
        )}

        {/* ── Status bar ── */}
        <div className={`font-mono text-[10px] px-3.5 py-1.5 bg-sql-surface border-t border-sql-border ${statusClass}`}>
          {status.text}
          {dbStatus === 'idle' && status.type === 'idle' && (
            <span className="text-sql-comment ml-2">· Click ⚡ Load Real Data for live execution</span>
          )}
        </div>

        {/* ── Arjun evaluation ── */}
        {evalResult && (
          <div className="px-3.5 py-3 border-t border-sql-border bg-sql-surface block-enter">
            {evalResult.loading ? (
              <div className="flex gap-1.5 items-center">
                {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-sql-comment animate-bounce" style={{ animationDelay:`${i*0.2}s` }} />)}
                <span className="font-mono text-[10px] text-sql-comment ml-1">Arjun is evaluating…</span>
              </div>
            ) : (
              <>
                <p className={`font-mono text-[9px] font-bold tracking-widest uppercase mb-1.5 ${evalResult.isIssue ? 'text-[#F38BA8]' : 'text-sql-str'}`}>
                  {evalResult.isIssue ? '⚠ Arjun flagged an issue' : "✓ Arjun's evaluation"}
                </p>
                <p className="text-[12px] text-sql-text leading-relaxed">{evalResult.text}</p>
              </>
            )}
          </div>
        )}
      </div>

      {showWb && results && (
        <Workbook initialCols={results.cols} initialRows={results.rows} queryTitle={title} onClose={() => setShowWb(false)} />
      )}
    </>
  );
}
