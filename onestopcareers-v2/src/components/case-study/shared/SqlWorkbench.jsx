// SQL editor with Run and Evaluate buttons, results table, and Arjun evaluation
import React, { useState, useCallback } from 'react';
import { SQL_RES, MOCK } from '../data/swiggyData.js';
import { useArjun } from '../hooks/useArjun.js';

// Detect which SQL_RES key to use from free-text query
function guessKey(query) {
  const q = (query || '').toLowerCase();
  if (q.includes('weather') || q.includes('rain')) return 'p2_weather';
  if (q.includes('competitor') || q.includes('zomato') || q.includes('external_events')) return 'p2_external';
  if (q.includes('restaurant') && (q.includes('rating') || q.includes('review'))) return 'p2_restaurants';
  if (q.includes('cuisine') || (q.includes('biryani') && q.includes('area'))) return 'p2_baseline';
  if (q.includes('price') || q.includes('promo') || q.includes('competitor_pricing')) return 'p2_competitor_pricing';
  if (q.includes('cohort') || q.includes('first_order')) return 'p3_cohort';
  if (q.includes('ltv') || q.includes('retention') && q.includes('gmv')) return 'p3_ltv';
  return null;
}

function ResultsTable({ data }) {
  if (!data) return null;
  return (
    <div className="overflow-x-auto max-h-52 overflow-y-auto">
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
            <tr
              key={i}
              className={
                data.hl?.includes(i) ? 'bg-red/10 text-[#F38BA8]'
                : data.hlg?.includes(i) ? 'bg-green/10 text-sql-str'
                : 'hover:bg-sql-surface'
              }
            >
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

export default function SqlWorkbench({
  id,
  title = 'query.sql',        // Bug 7 fix: was 'filename', all callers use 'title'
  dataKey = null,
  placeholder = '-- Write your SQL query...\nSELECT ...',
  onRun,                       // Bug 8 fix: was 'onQueryRun', all callers use 'onRun'
  showEvaluate = true,
}) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState({ text: 'Write a query and click Run', type: 'idle' });
  const [results, setResults] = useState(null);
  const [evalResult, setEvalResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const { callArjun } = useArjun();

  const validateQuery = (q) => {
    const ql = q.toLowerCase();
    if (!q.trim() || q.trim().split(/\s+/).length < 4) return 'Query too short — write a real SQL query.';
    if (ql.includes('select *') && !ql.includes('limit')) return "Avoid SELECT * — be explicit about columns. Also consider adding a LIMIT.";
    if (ql.includes('count(') && !ql.includes('distinct') && !ql.includes('count(1)')) return "Use COUNT(DISTINCT order_id) to avoid double-counting rows that join to multiple records.";
    return null;
  };

  const runQuery = useCallback(async () => {
    const q = query.trim();
    if (!q) { setStatus({ text: 'Write a query first', type: 'err' }); return; }
    const err = validateQuery(q);
    if (err) { setStatus({ text: err, type: 'err' }); return; }
    setRunning(true);
    setStatus({ text: 'Running...', type: 'running' });
    setResults(null);
    await new Promise((r) => setTimeout(r, 900));
    const resolvedKey = dataKey || guessKey(q);
    const data = SQL_RES[resolvedKey];
    if (!data) {
      setStatus({ text: 'No matching data found — try a different angle or table.', type: 'err' });
    } else {
      setStatus({ text: data.status || 'Query complete', type: 'ok' });
      setResults(data);
      onRun?.(q);
    }
    setRunning(false);
  }, [query, dataKey, onRun]);

  const evaluate = useCallback(async () => {
    const q = query.trim();
    if (!q) { alert('Write a query first.'); return; }
    // Also run so user sees results
    await runQuery();
    setEvaluating(true);
    setEvalResult({ loading: true });
    const fb = await callArjun(`SQL: ${q}\nContext: ${dataKey || 'Swiggy analytics investigation'}`, 'sql');
    const isIssue = fb.trimStart().toUpperCase().startsWith('ISSUE:');
    setEvalResult({ text: fb.replace(/^(ISSUE:|GOOD:)\s*/i, ''), isIssue });
    setEvaluating(false);
  }, [query, dataKey, runQuery, callArjun]);

  const statusClass = status.type === 'ok' ? 'text-sql-str' : status.type === 'err' ? 'text-[#F38BA8]' : status.type === 'running' ? 'text-sql-num' : 'text-sql-comment';

  return (
    <div className="bg-sql-bg border border-sql-border rounded-xl overflow-hidden my-3">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-sql-surface border-b border-sql-border">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red/60" />
          <span className="w-2 h-2 rounded-full bg-amber/60" />
          <span className="w-2 h-2 rounded-full bg-green/60" />
          <span className="font-mono text-[10px] text-sql-kw font-semibold tracking-wide ml-1">{title}</span>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={runQuery}
            disabled={running}
            className="bg-phase2 hover:bg-[#163BB0] disabled:opacity-50 text-white text-[11px] font-semibold font-sans px-3 py-1 rounded cursor-pointer transition-colors"
          >
            {running ? '...' : '▶ Run'}
          </button>
          {showEvaluate && (
            <button
              onClick={evaluate}
              disabled={evaluating}
              className="bg-transparent border border-sql-num/25 hover:bg-sql-num/10 disabled:opacity-50 text-sql-num text-[11px] font-semibold font-sans px-3 py-1 rounded cursor-pointer transition-colors"
            >
              {evaluating ? '...' : 'Evaluate'}
            </button>
          )}
        </div>
      </div>

      {/* Editor */}
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-sql-bg border-none outline-none text-sql-text font-mono text-xs leading-relaxed px-3.5 py-3 resize-y min-h-[90px]"
        spellCheck={false}
      />

      {/* Results */}
      {results && <ResultsTable data={results} />}

      {/* Status bar */}
      <div className={`font-mono text-[10px] px-3.5 py-1.5 bg-sql-surface border-t border-sql-border ${statusClass}`}>
        {status.text}
      </div>

      {/* Arjun evaluation */}
      {evalResult && (
        <div className="px-3.5 py-3 border-t border-sql-border bg-sql-surface">
          {evalResult.loading ? (
            <div className="flex gap-1.5 items-center">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-sql-comment animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
              <span className="font-mono text-[10px] text-sql-comment ml-1">Arjun is evaluating...</span>
            </div>
          ) : (
            <>
              <p className={`font-mono text-[9px] font-bold tracking-widest uppercase mb-1.5 ${evalResult.isIssue ? 'text-[#F38BA8]' : 'text-sql-str'}`}>
                {evalResult.isIssue ? '⚠ Arjun flagged an issue' : '✓ Arjun\'s evaluation'}
              </p>
              <p className="text-[12px] text-sql-text leading-relaxed">{evalResult.text}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}