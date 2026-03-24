// src/components/ui/index.jsx
// Shared design-system components. Import from here everywhere.
// All tokens come from tailwind.config.js — no hardcoded hex in components.

import React from 'react';

// ── Phase pill ────────────────────────────────────────────────────────────────
const PHASE_CONFIG = {
  1: { label: 'Phase 1 · Watch',    bg: 'bg-phase1-bg',  text: 'text-phase1',  border: 'border-phase1-border' },
  2: { label: 'Phase 2 · Practice', bg: 'bg-phase2-bg',  text: 'text-phase2',  border: 'border-phase2-border' },
  3: { label: 'Phase 3 · Execute',  bg: 'bg-phase3-bg',  text: 'text-phase3',  border: 'border-phase3-border' },
};

export const PhasePill = ({ phase, label, className = '' }) => {
  const cfg = PHASE_CONFIG[phase] || PHASE_CONFIG[1];
  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded-full
      font-mono text-[10px] font-semibold tracking-wide whitespace-nowrap
      border ${cfg.bg} ${cfg.text} ${cfg.border} ${className}
    `}>
      {label || cfg.label}
    </span>
  );
};

// ── Mono label (uppercase metadata) ──────────────────────────────────────────
export const MonoLabel = ({ children, color = 'text-ink3', className = '' }) => (
  <p className={`font-mono text-[10px] font-semibold tracking-widest uppercase ${color} ${className}`}>
    {children}
  </p>
);

// ── Buttons ───────────────────────────────────────────────────────────────────
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  href,
  disabled = false,
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  const variants = {
    primary:   'bg-accent text-white hover:bg-accent-dark hover:-translate-y-px shadow-none hover:shadow-accent',
    secondary: 'bg-transparent text-ink border border-border hover:border-border2 hover:bg-surface',
    ghost:     'bg-transparent text-ink2 hover:text-ink hover:bg-surface',
    danger:    'bg-red-bg text-red border border-red-border hover:bg-red/10',
  };
  const base = `inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 ${sizes[size]} ${variants[variant]}`;
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  if (href) {
    return (
      <a href={href} className={`${base} ${disabledClass} ${className}`} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${disabledClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

// ── Callout card ──────────────────────────────────────────────────────────────
const CALLOUT_VARIANTS = {
  default: { bg: 'bg-surface',   border: 'border-border',        label: 'text-ink3'   },
  info:    { bg: 'bg-blue-bg',   border: 'border-blue-border',   label: 'text-blue'   },
  success: { bg: 'bg-green-bg',  border: 'border-green-border',  label: 'text-green'  },
  warning: { bg: 'bg-amber-bg',  border: 'border-amber-border',  label: 'text-amber'  },
  error:   { bg: 'bg-red-bg',    border: 'border-red-border',    label: 'text-red'    },
  accent:  { bg: 'bg-accent-light', border: 'border-accent-border', label: 'text-accent' },
};

export const CalloutCard = ({ label, children, variant = 'default', className = '' }) => {
  const cfg = CALLOUT_VARIANTS[variant] || CALLOUT_VARIANTS.default;
  return (
    <div className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border} ${className}`}>
      {label && (
        <p className={`font-mono text-[10px] font-semibold tracking-widest uppercase mb-2 ${cfg.label}`}>
          {label}
        </p>
      )}
      <div className="text-sm text-ink2 leading-relaxed">{children}</div>
    </div>
  );
};

// ── SQL block (dark workbench display) ────────────────────────────────────────
export const SqlBlock = ({ query, title, className = '' }) => (
  <div className={`bg-sql-bg border border-sql-border rounded-xl overflow-hidden ${className}`}>
    {title && (
      <div className="bg-sql-surface border-b border-sql-border px-4 py-2.5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red/60" />
        <span className="w-2 h-2 rounded-full bg-amber/60" />
        <span className="w-2 h-2 rounded-full bg-green/60" />
        <span className="font-mono text-[10px] text-sql-kw font-semibold tracking-wide ml-2">{title}</span>
      </div>
    )}
    <pre className="p-4 overflow-x-auto font-mono text-xs text-sql-text leading-relaxed whitespace-pre-wrap">
      {query}
    </pre>
  </div>
);

// ── Score badge ───────────────────────────────────────────────────────────────
export const ScoreBadge = ({ score }) => {
  const color = score >= 80 ? 'text-green bg-green-bg border-green-border'
    : score >= 55 ? 'text-amber bg-amber-bg border-amber-border'
    : 'text-red bg-red-bg border-red-border';
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full border font-mono text-sm font-semibold ${color}`}>
      {score}/100
    </span>
  );
};

// ── Section divider ───────────────────────────────────────────────────────────
export const Divider = ({ className = '' }) => (
  <hr className={`border-t border-border ${className}`} />
);

// ── Loading spinner ───────────────────────────────────────────────────────────
export const Spinner = ({ size = 'md', className = '' }) => {
  const s = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';
  return (
    <div className={`${s} border-2 border-border border-t-accent rounded-full animate-spin ${className}`} />
  );
};
