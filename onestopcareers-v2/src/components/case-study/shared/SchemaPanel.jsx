// Collapsible database schema reference panel
import React, { useState } from 'react';
import { SCHEMAS } from '../data/swiggyData.js';

function SchemaTable({ name }) {
  const s = SCHEMAS[name];
  if (!s) return null;
  return (
    <div className="mb-2">
      <p className="font-mono text-[10px] font-semibold text-ink2 mb-1">{name}</p>
      <div className="overflow-x-auto">
        <table className="w-full font-mono text-[10px]">
          <thead>
            <tr className="bg-surface2">
              <th className="text-left px-2 py-1 border border-border text-ink3">column</th>
              <th className="text-left px-2 py-1 border border-border text-ink3">type</th>
            </tr>
          </thead>
          <tbody>
            {s.cols.map(col => (
              <tr key={col.n}>
                <td className={`px-2 py-1 border border-border ${col.k ? 'text-accent font-semibold' : 'text-ink2'}`}>{col.n}</td>
                <td className="px-2 py-1 border border-border text-ink3">{col.t}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SchemaPanel({ tables, compact = false }) {
  const [open, setOpen] = useState(false);
  const names = tables || Object.keys(SCHEMAS);
  return (
    <div className="border border-border rounded-lg overflow-hidden mb-2">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2 bg-surface2 hover:bg-border text-left transition-colors"
      >
        <span className="font-mono text-[10px] font-semibold text-ink2 tracking-widest uppercase">
          Schema &amp; Tables · prod.swiggy · BigQuery
        </span>
        <span className="text-ink3 text-xs">{open ? '▲' : '▶'}</span>
      </button>
      {open && (
        <div className={`p-3 ${compact ? 'bg-sql-bg' : 'bg-surface'}`}>
          {compact ? (
            <div className="font-mono text-[10px] text-sql-text leading-loose">
              {names.slice(0, 4).map(n => (
                <div key={n}>
                  <span className="text-sql-str font-semibold">{n}</span>
                  <span className="text-sql-comment ml-2">{SCHEMAS[n]?.cols.map(c => c.n).join(', ')}</span>
                </div>
              ))}
              <div className="text-sql-comment mt-1">+ more explore tables available</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {names.map(n => <SchemaTable key={n} name={n} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
