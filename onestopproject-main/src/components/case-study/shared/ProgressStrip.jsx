// Sticky progress bar — smooth color morph between phases, dark mode aware
import React from 'react';

export default function ProgressStrip({ pct, label, color = '#C84B0C', time, dark = false }) {
  return (
    <div className={`sticky top-[45px] z-40 border-b px-5 transition-colors duration-700 ${
      dark ? 'bg-[#0D0F14] border-[#1E2330]' : 'bg-[var(--bg)] border-[var(--border)]'
    }`}>
      <div className="h-0.5 rounded-full" style={{ background: dark ? '#1E2330' : 'var(--surface2)' }}>
        <div
          className="h-0.5 rounded-full progress-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <div className="flex items-center justify-between py-1.5">
        <p className="font-mono text-[9px] font-semibold tracking-widest uppercase"
          style={{ color: dark ? '#4A5568' : 'var(--ink3)' }}>
          {label}
        </p>
        {time && (
          <p className="text-[11px]" style={{ color: dark ? '#4A5568' : 'var(--ink3)' }}>
            {time}
          </p>
        )}
      </div>
    </div>
  );
}
