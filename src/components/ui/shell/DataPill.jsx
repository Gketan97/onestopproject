/**
 * DataPill.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * High-contrast micro-badge inspired by Oneroadmap's pill design language.
 * Tight padding, sharp contrast, optional animated status dot.
 *
 * Variants
 * ────────
 * 'phase'     — Swiggy Orange. Use for phase labels ("Phase 1", "Phase 2").
 * 'running'   — Blue with blinking dot. Use for "Running Query", "In Progress".
 * 'complete'  — Green. Use for "Complete", "Passed", "Correct".
 * 'locked'    — Muted gray. Use for "Locked", "Paywall", "Coming Soon".
 * 'neutral'   — White/8 glass. Use for generic tags.
 * 'error'     — Red. Use for "Error", "Failed".
 *
 * Props
 * ─────
 * label       string        — pill text (required)
 * variant     string        — one of the variants above (default: 'neutral')
 * dot         boolean       — show status dot (default: auto based on variant)
 * dotColor    string        — override dot color
 * icon        ReactNode     — optional icon before label
 * onClick     function      — makes pill interactive
 * className   string
 * delay       number        — Framer entrance delay in seconds
 *
 * Usage
 * ─────
 * import DataPill from '@/components/ui/shell/DataPill';
 *
 * <DataPill label="Phase 1" variant="phase" />
 * <DataPill label="Running Query" variant="running" />
 * <DataPill label="Complete" variant="complete" />
 * <DataPill label="Locked" variant="locked" />
 */

import React from 'react';
import { motion } from 'framer-motion';

// ── Variant config ────────────────────────────────────────────────────────────
const VARIANTS = {
  phase: {
    bg:         'rgba(252, 128, 25, 0.15)',
    border:     'rgba(252, 128, 25, 0.40)',
    text:       '#FC8019',
    dot:        '#FC8019',
    defaultDot: false,
  },
  running: {
    bg:         'rgba(79, 128, 255, 0.14)',
    border:     'rgba(79, 128, 255, 0.38)',
    text:       '#7FAAFF',
    dot:        '#4F80FF',
    defaultDot: true,
  },
  complete: {
    bg:         'rgba(61, 214, 140, 0.12)',
    border:     'rgba(61, 214, 140, 0.35)',
    text:       '#3DD68C',
    dot:        '#3DD68C',
    defaultDot: false,
  },
  locked: {
    bg:         'rgba(255, 255, 255, 0.05)',
    border:     'rgba(255, 255, 255, 0.12)',
    text:       'rgba(255,255,255,0.35)',
    dot:        'rgba(255,255,255,0.25)',
    defaultDot: false,
  },
  neutral: {
    bg:         'rgba(255, 255, 255, 0.07)',
    border:     'rgba(255, 255, 255, 0.13)',
    text:       'rgba(255,255,255,0.65)',
    dot:        'rgba(255,255,255,0.4)',
    defaultDot: false,
  },
  error: {
    bg:         'rgba(243, 139, 168, 0.12)',
    border:     'rgba(243, 139, 168, 0.35)',
    text:       '#F38BA8',
    dot:        '#F38BA8',
    defaultDot: true,
  },
};

// ── Blinking dot ──────────────────────────────────────────────────────────────
function PillDot({ color, blink = false }) {
  return (
    <motion.span
      style={{
        display:      'inline-block',
        width:        6,
        height:       6,
        borderRadius: '50%',
        background:   color,
        flexShrink:   0,
      }}
      animate={blink ? { opacity: [1, 0.25, 1] } : { opacity: 1 }}
      transition={blink ? { duration: 1.1, repeat: Infinity, ease: 'easeInOut' } : {}}
    />
  );
}

// ── DataPill ──────────────────────────────────────────────────────────────────
export default function DataPill({
  label,
  variant   = 'neutral',
  dot,
  dotColor,
  icon,
  onClick,
  className = '',
  delay     = 0,
}) {
  const cfg        = VARIANTS[variant] || VARIANTS.neutral;
  const showDot    = dot !== undefined ? dot : cfg.defaultDot;
  const isRunning  = variant === 'running';
  const isClickable = !!onClick;

  return (
    <motion.span
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 ${isClickable ? 'cursor-pointer' : ''} ${className}`}
      style={{
        background:   cfg.bg,
        border:       `1px solid ${cfg.border}`,
        borderRadius: 999,
        padding:      '2px 9px',
        fontFamily:   'var(--noir-mono, JetBrains Mono, monospace)',
        fontSize:     10,
        fontWeight:   600,
        letterSpacing:'0.06em',
        textTransform:'uppercase',
        color:        cfg.text,
        userSelect:   'none',
        whiteSpace:   'nowrap',
        lineHeight:   '18px',
      }}
      initial={{ opacity: 0, scale: 0.82 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.35,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={isClickable ? { scale: 1.04 } : undefined}
      whileTap={ isClickable ? { scale: 0.96 } : undefined}
    >
      {/* Optional icon */}
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}

      {/* Status dot */}
      {showDot && (
        <PillDot
          color={dotColor || cfg.dot}
          blink={isRunning}
        />
      )}

      {label}
    </motion.span>
  );
}

// ── DataPillGroup — render multiple pills with stagger ────────────────────────
/**
 * DataPillGroup — renders a row of DataPills with staggered entrance.
 *
 * Props: pills (array of DataPill props), gap (number px), className
 *
 * Usage:
 * <DataPillGroup pills={[
 *   { label: 'Phase 1', variant: 'phase' },
 *   { label: 'Running Query', variant: 'running' },
 * ]} />
 */
export function DataPillGroup({ pills = [], gap = 6, className = '' }) {
  return (
    <div className={`flex flex-wrap items-center ${className}`} style={{ gap }}>
      {pills.map((props, i) => (
        <DataPill key={i} {...props} delay={i * 0.05} />
      ))}
    </div>
  );
}
