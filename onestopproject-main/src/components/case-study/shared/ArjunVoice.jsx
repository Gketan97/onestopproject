import React, { useEffect, useState } from 'react';
import ArjunAvatar from '../../ui/shell/ArjunAvatar.jsx';

const PHASE_STYLES = {
  p1:      'border-phase1 bg-phase1-bg',
  p2:      'border-phase2 bg-phase2-bg',
  p3:      'border-phase3 bg-phase3-bg',
  neutral: 'border-border2 bg-surface',
  amber:   'border-amber bg-amber-bg',
};
const LABEL_STYLES = {
  p1: 'text-phase1', p2: 'text-phase2', p3: 'text-phase3',
  neutral: 'text-ink3', amber: 'text-amber',
};

export default function ArjunVoice({ children, label = 'ARJUN', variant, phase, className = '', delay = 0 }) {
  // Accept both variant='p2' and phase={2}
  const resolvedVariant = variant || (phase ? `p${phase}` : 'p1');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`border-l-[3px] rounded-r-xl px-4 py-3 my-3 ${PHASE_STYLES[resolvedVariant] || PHASE_STYLES.p1} ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity 0.35s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.35s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      <div className="flex items-start gap-3">
        <ArjunAvatar mode="idle" size={28} showLabel={false} />
        <div className="flex-1">
          <p className={`font-mono text-[9px] font-bold tracking-widest uppercase mb-1.5 ${LABEL_STYLES[resolvedVariant] || LABEL_STYLES.p1}`}>
            {label}
          </p>
          <p className="text-sm leading-relaxed italic" style={{ color: 'var(--ink)' }}>{children}</p>
        </div>
      </div>
    </div>
  );
}
