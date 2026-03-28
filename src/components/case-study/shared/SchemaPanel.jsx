// Collapsible database schema reference panel — always noir
import React, { useState } from 'react';
import { SCHEMAS } from '../data/swiggyData.js';

function SchemaTable({ name }) {
  const s = SCHEMAS[name];
  if (!s) return null;
  return (
    <div className="mb-2">
      <p className="font-mono text-[10px] font-semibold text-sql-str mb-1">{name}</p>
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
                <td className={`px-2 py-1 border border-border ${col.k ? 'text-phase1 font-semibold' : 'text-ink2'}`}>{col.n}</td>
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
    <div className="rounded-lg overflow-hidden mb-3" style={{ border: '1px solid var(--border)' }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-left transition-colors"
        style={{ background: 'var(--surface2)' }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--surface2)'}
      >
        <span className="font-mono text-[10px] font-semibold tracking-widest uppercase text-ink2">
          Schema &amp; Tables · prod.swiggy · BigQuery
        </span>
        <span className="text-xs text-ink3">{open ? '▲' : '▶'}</span>
      </button>

      {open && (
        <div className="p-3" style={{ background: 'var(--surface)' }}>
          {compact ? (
            <div className="font-mono text-[10px] leading-loose text-ink2">
              {names.slice(0, 5).map(n => (
                <div key={n}>
                  <span className="font-semibold text-sql-str">{n}</span>
                  <span className="ml-2 text-ink3">
                    {SCHEMAS[n]?.cols.map(c => c.n).join(' · ')}
                  </span>
                </div>
              ))}
              {names.length > 5 && (
                <div className="text-ink3">+ {names.length - 5} more tables</div>
              )}
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
