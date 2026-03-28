// src/components/case-study/shared/Workbook.jsx
// Lightweight editable spreadsheet for post-SQL synthesis.
// Opens full-screen over the case study. No external dependencies.
// Features: editable cells, sortable columns, pivot tab, calculated columns.

import React, { useState, useMemo, useCallback } from 'react';

// ── Pivot aggregation ─────────────────────────────────────────────────────────
function pivotData(cols, rows, groupCol, valueCol) {
  const gi = cols.indexOf(groupCol);
  const vi = cols.indexOf(valueCol);
  if (gi === -1 || vi === -1) return { cols, rows };

  const groups = {};
  for (const row of rows) {
    const key = row[gi] ?? '(null)';
    const raw = String(row[vi] ?? '').replace(/[₹,%\s,]/g, '');
    const num = parseFloat(raw);
    if (!groups[key]) groups[key] = { count: 0, sum: 0, nums: [] };
    groups[key].count += 1;
    if (!isNaN(num)) { groups[key].sum += num; groups[key].nums.push(num); }
  }

  const pivotCols = [groupCol, 'count', `sum_${valueCol}`, `avg_${valueCol}`];
  const pivotRows = Object.entries(groups)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([key, g]) => [
      key,
      String(g.count),
      g.nums.length ? g.sum.toFixed(0) : '—',
      g.nums.length ? (g.sum / g.nums.length).toFixed(1) : '—',
    ]);

  return { cols: pivotCols, rows: pivotRows };
}

// ── Editable cell ─────────────────────────────────────────────────────────────
function EditCell({ value, onChange, isHeader }) {
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(value);

  const commit = () => { setEditing(false); if (draft !== value) onChange(draft); };

  const baseHdr = 'px-2.5 py-1.5 text-left font-mono text-[10px] font-semibold ' +
    'text-ink2 bg-surface2 border-r border-border min-w-[80px] outline-none ' +
    'cursor-text focus:bg-phase2-bg focus:text-phase2';
  const baseCell = 'px-2.5 py-1.5 border-r border-border text-[12px] font-mono ' +
    'min-w-[80px] whitespace-nowrap cursor-pointer text-ink2';

  if (isHeader) {
    return (
      <th
        contentEditable suppressContentEditableWarning
        onBlur={e => onChange(e.currentTarget.textContent.trim())}
        className={baseHdr}
      >{value}</th>
    );
  }

  return (
    <td
      onClick={() => { setDraft(value); setEditing(true); }}
      className={`${baseCell} ${editing ? 'bg-blue-bg' : 'hover:bg-surface'}`}
    >
      {editing
        ? <input autoFocus value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={e => { if (e.key==='Enter') commit(); if (e.key==='Escape') { setDraft(value); setEditing(false); }}}
            className="w-full bg-transparent outline-none font-mono text-[12px] text-ink" />
        : value
      }
    </td>
  );
}

// ── Main Workbook ─────────────────────────────────────────────────────────────
export default function Workbook({ initialCols, initialRows, queryTitle, onClose }) {
  const [cols, setCols] = useState(initialCols);
  const [rows, setRows] = useState(initialRows);
  const [tab,  setTab]  = useState('table');   // 'table' | 'pivot'
  const [sortCol, setSortCol]   = useState(null);
  const [sortDir, setSortDir]   = useState('asc');
  const [pivotGroup, setPivotGroup] = useState('');
  const [pivotValue, setPivotValue] = useState('');
  const [fColName, setFColName] = useState('');
  const [fExpr,    setFExpr]    = useState('');

  // Derived display data
  const displayData = useMemo(() => {
    if (tab === 'pivot' && pivotGroup && pivotValue) {
      return pivotData(cols, rows, pivotGroup, pivotValue);
    }
    return { cols, rows };
  }, [tab, cols, rows, pivotGroup, pivotValue]);

  const sortedRows = useMemo(() => {
    if (!sortCol) return displayData.rows;
    const idx = displayData.cols.indexOf(sortCol);
    if (idx === -1) return displayData.rows;
    return [...displayData.rows].sort((a, b) => {
      const av = String(a[idx] ?? ''), bv = String(b[idx] ?? '');
      const an = parseFloat(av.replace(/[^0-9.-]/g, ''));
      const bn = parseFloat(bv.replace(/[^0-9.-]/g, ''));
      const cmp = !isNaN(an) && !isNaN(bn) ? an - bn : av.localeCompare(bv);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [displayData, sortCol, sortDir]);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const updateCell = useCallback((ri, ci, val) => {
    setRows(prev => prev.map((r, i) => i === ri ? r.map((c, j) => j === ci ? val : c) : r));
  }, []);

  const updateHeader = useCallback((ci, val) => {
    setCols(prev => prev.map((c, i) => i === ci ? val : c));
  }, []);

  const addFormulaCol = () => {
    const name = fColName.trim();
    const expr = fExpr.trim();
    if (!name || !expr) return;
    const srcIdx = cols.indexOf(expr);
    setRows(prev => prev.map(row => {
      if (srcIdx !== -1) {
        const n = parseFloat(String(row[srcIdx] ?? '').replace(/[^0-9.-]/g, ''));
        return [...row, isNaN(n) ? '—' : n.toLocaleString()];
      }
      return [...row, expr];
    }));
    setCols(prev => [...prev, name]);
    setFColName(''); setFExpr('');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col"
      style={{ background: 'var(--bg)', fontFamily: 'var(--sans)' }}>

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border flex-shrink-0"
        style={{ background: 'var(--surface)' }}>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] font-bold tracking-widest uppercase"
            style={{ color: 'var(--ink3)' }}>⊞ Workbook</span>
          <span className="font-mono text-[11px]" style={{ color: 'var(--ink2)' }}>
            {queryTitle || 'query results'}
          </span>
          <span className="font-mono text-[10px]" style={{ color: 'var(--ink3)' }}>
            {rows.length} rows × {cols.length} cols
          </span>
        </div>
        <div className="flex items-center gap-2">
          {['table','pivot'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-3 py-1 rounded text-[11px] font-mono font-medium transition-colors"
              style={{
                background: tab === t ? 'var(--phase2-bg)' : 'transparent',
                color: tab === t ? 'var(--phase2)' : 'var(--ink2)',
                border: '1px solid ' + (tab === t ? 'var(--phase2-border)' : 'var(--border)'),
              }}>
              {t === 'table' ? '⊞ Table' : '⊟ Pivot'}
            </button>
          ))}
          <button onClick={onClose}
            className="ml-2 px-3 py-1 text-[11px] rounded transition-colors"
            style={{ border: '1px solid var(--border)', color: 'var(--ink3)' }}
            onMouseEnter={e => e.target.style.color='var(--ink)'}
            onMouseLeave={e => e.target.style.color='var(--ink3)'}>
            ✕ Close
          </button>
        </div>
      </div>

      {/* ── Pivot controls ── */}
      {tab === 'pivot' && (
        <div className="flex items-center gap-3 px-4 py-2 border-b border-border flex-shrink-0"
          style={{ background: 'var(--surface2)' }}>
          <span className="font-mono text-[10px] uppercase" style={{ color: 'var(--ink3)' }}>Group by</span>
          <select value={pivotGroup} onChange={e => setPivotGroup(e.target.value)}
            className="text-[12px] rounded px-2 py-1 outline-none font-mono"
            style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)' }}>
            <option value="">— column —</option>
            {cols.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="font-mono text-[10px] uppercase" style={{ color: 'var(--ink3)' }}>Aggregate</span>
          <select value={pivotValue} onChange={e => setPivotValue(e.target.value)}
            className="text-[12px] rounded px-2 py-1 outline-none font-mono"
            style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)' }}>
            <option value="">— value —</option>
            {cols.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {pivotGroup && pivotValue && (
            <span className="font-mono text-[10px]" style={{ color: 'var(--ink3)' }}>
              {displayData.rows.length} groups
            </span>
          )}
        </div>
      )}

      {/* ── Formula bar ── */}
      {tab === 'table' && (
        <div className="flex items-center gap-2 px-4 py-1.5 border-b border-border flex-shrink-0"
          style={{ background: 'var(--surface)' }}>
          <span className="font-mono text-[10px]" style={{ color: 'var(--ink3)' }}>+ Column</span>
          <input placeholder="name" value={fColName} onChange={e => setFColName(e.target.value)}
            className="font-mono text-[12px] rounded px-2 py-0.5 w-28 outline-none"
            style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)' }} />
          <span className="font-mono text-[10px]" style={{ color: 'var(--ink3)' }}>=</span>
          <input placeholder="source column or literal"
            value={fExpr} onChange={e => setFExpr(e.target.value)}
            onKeyDown={e => { if (e.key==='Enter') addFormulaCol(); }}
            className="font-mono text-[12px] rounded px-2 py-0.5 w-44 outline-none"
            style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)' }} />
          <button onClick={addFormulaCol}
            className="font-mono text-[11px] px-2.5 py-0.5 rounded transition-colors"
            style={{ background: 'var(--phase2)', color: 'white' }}>
            Add
          </button>
        </div>
      )}

      {/* ── Grid ── */}
      <div className="flex-1 overflow-auto p-4">
        <table className="border-collapse text-left"
          style={{ borderTop: '1px solid var(--border)', borderLeft: '1px solid var(--border)' }}>
          <thead>
            <tr>
              <th className="px-2 py-1.5 font-mono text-[10px] w-8 text-center border-r border-b"
                style={{ background: 'var(--surface2)', color: 'var(--ink3)',
                         borderColor: 'var(--border)' }}>#</th>
              {displayData.cols.map((col, ci) => (
                <th key={ci} className="border-b" style={{ borderColor: 'var(--border)', background: 'var(--surface2)' }}>
                  <div className="flex items-center">
                    {tab === 'table'
                      ? <EditCell isHeader value={col} onChange={v => updateHeader(ci, v)} />
                      : <span className="px-2.5 py-1.5 font-mono text-[10px] font-semibold"
                          style={{ color: 'var(--ink2)' }}>{col}</span>
                    }
                    <button onClick={() => handleSort(col)}
                      className="px-1 text-[10px] flex-shrink-0"
                      style={{ color: sortCol===col ? 'var(--accent)' : 'var(--ink3)' }}>
                      {sortCol===col ? (sortDir==='asc' ? '↑' : '↓') : '↕'}
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, ri) => (
              <tr key={ri}>
                <td className="px-2 py-1.5 font-mono text-[10px] text-center border-r border-b"
                  style={{ color: 'var(--ink3)', background: 'var(--surface)',
                           borderColor: 'var(--border)' }}>
                  {ri + 1}
                </td>
                {row.map((cell, ci) => (
                  <td key={ci} className="border-r border-b p-0" style={{ borderColor: 'var(--border)' }}>
                    {tab === 'table'
                      ? <EditCell value={String(cell ?? '')} onChange={v => updateCell(ri, ci, v)} />
                      : <span className="px-2.5 py-1.5 block font-mono text-[12px]"
                          style={{ color: 'var(--ink2)' }}>{String(cell ?? '')}</span>
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Status bar ── */}
      <div className="flex items-center justify-between px-4 py-1.5 border-t border-border flex-shrink-0"
        style={{ background: 'var(--surface2)' }}>
        <span className="font-mono text-[10px]" style={{ color: 'var(--ink3)' }}>
          {displayData.rows.length} rows · {displayData.cols.length} cols
          {sortCol && ` · sorted by ${sortCol} ${sortDir}`}
        </span>
        <span className="font-mono text-[10px]" style={{ color: 'var(--ink3)' }}>
          Click cell to edit · Click ↕ to sort · Pivot tab to aggregate
        </span>
      </div>
    </div>
  );
}
