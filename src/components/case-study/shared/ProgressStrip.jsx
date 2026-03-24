// Sticky progress bar at top of the investigation journal
import React from 'react';

export default function ProgressStrip({ pct, label, color = '#C84B0C', time }) {
  return (
    <div className="sticky top-[45px] z-40 bg-bg border-b border-border px-5">
      <div className="h-0.5 bg-surface2 rounded-full">
        <div
          className="h-0.5 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <div className="flex items-center justify-between py-1.5">
        <p className="font-mono text-[9px] font-semibold tracking-widest uppercase text-ink3">{label}</p>
        {time && <p className="text-[11px] text-ink3">{time}</p>}
      </div>
    </div>
  );
}
