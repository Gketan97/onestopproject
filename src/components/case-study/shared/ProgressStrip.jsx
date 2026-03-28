// Sticky progress bar — always noir, smooth color morph between phases
import React from 'react';

export default function ProgressStrip({ pct, label, color = 'var(--phase1)', time }) {
  return (
    <div
      className="sticky top-[45px] z-40 border-b px-5"
      style={{
        background: 'rgba(8,8,16,0.90)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="h-0.5 rounded-full" style={{ background: 'var(--surface2)' }}>
        <div
          className="h-0.5 rounded-full progress-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <div className="flex items-center justify-between py-1.5">
        <p className="font-mono text-[9px] font-semibold tracking-widest uppercase text-ink3">
          {label}
        </p>
        {time && <p className="text-[11px] text-ink3">{time}</p>}
      </div>
    </div>
  );
}
