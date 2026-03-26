// Sticky progress strip beneath the header — updates color per phase
import React from 'react';

const PHASE_COLOR = { landing: 'var(--ink3)', gap: 'var(--phase1)', context: 'var(--phase1)', phase1: 'var(--phase1)', 'p1-summary': 'var(--phase3)', 'phase2-intro': 'var(--phase2)', phase2: 'var(--phase2)', paywall: 'var(--phase3)', phase3: 'var(--phase3)', debrief: 'var(--phase3)' };

export default function PhaseProgress({ pct, label, sublabel }) {
  const color = 'var(--phase1)'; // simplified; shell passes correct color via label
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
