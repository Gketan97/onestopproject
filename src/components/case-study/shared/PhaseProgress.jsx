// Sticky progress strip beneath the header — updates color per phase
import React from 'react';

const PHASE_COLOR = { landing: '#9B9B8F', gap: '#C84B0C', context: '#C84B0C', phase1: '#C84B0C', 'p1-summary': '#1A6B45', 'phase2-intro': '#1E4FCC', phase2: '#1E4FCC', paywall: '#1A6B45', phase3: '#1A6B45', debrief: '#1A6B45' };

export default function PhaseProgress({ pct, label, sublabel }) {
  const color = '#C84B0C'; // simplified; shell passes correct color via label
  return (
    <div className="sticky top-[45px] z-40 bg-bg border-b border-border px-5">
      <div className="h-0.5 bg-surface2 rounded-full">
        <div className="h-0.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="flex justify-between items-center py-1.5">
        <p className="font-mono text-[9px] font-semibold text-ink3 uppercase tracking-widest">{label}</p>
        {sublabel && <p className="font-mono text-[9px] text-ink3">{sublabel}</p>}
      </div>
    </div>
  );
}
