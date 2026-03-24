// Arjun's narration — left-bordered callout used throughout all phases
import React from 'react';

const PHASE_STYLES = {
  p1: 'border-phase1 bg-phase1-bg',
  p2: 'border-phase2 bg-phase2-bg',
  p3: 'border-phase3 bg-phase3-bg',
  neutral: 'border-border2 bg-surface',
  amber: 'border-amber bg-amber-bg',
};
const LABEL_STYLES = {
  p1: 'text-phase1', p2: 'text-phase2', p3: 'text-phase3',
  neutral: 'text-ink3', amber: 'text-amber',
};

export default function ArjunVoice({ children, label = "ARJUN", variant = 'p1', className = '' }) {
  return (
    <div className={`border-l-[3px] rounded-r-xl px-4 py-3 my-3 ${PHASE_STYLES[variant] || PHASE_STYLES.p1} ${className}`}>
      <p className={`font-mono text-[9px] font-bold tracking-widest uppercase mb-1.5 ${LABEL_STYLES[variant] || LABEL_STYLES.p1}`}>
        {label}
      </p>
      <p className="text-sm text-ink leading-relaxed italic">{children}</p>
    </div>
  );
}
