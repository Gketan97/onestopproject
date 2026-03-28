/**
 * ArjunAvatar.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Animated mentor avatar for Arjun (or any AI mentor character).
 *
 * Animation modes
 * ───────────────
 * 'idle'     — Subtle breathing scale. Static ring. No noise.
 * 'thinking' — Orange pulse ring expanding outward. Body slightly scales.
 *              Use while AI API call is in-flight.
 * 'insight'  — Blue glow ring burst (expands and fades out once).
 *              Use when Arjun delivers a correct/positive evaluation.
 *
 * Props
 * ─────
 * mode        'idle' | 'thinking' | 'insight'    (default: 'idle')
 * size        number                              px diameter (default: 44)
 * initials    string                              avatar text (default: 'AK')
 * label       string                              shown below avatar (default: 'Arjun')
 * showLabel   boolean                             (default: true)
 * className   string
 *
 * Usage
 * ─────
 * import ArjunAvatar from '@/components/ui/shell/ArjunAvatar';
 *
 * // While AI call is in flight:
 * <ArjunAvatar mode="thinking" />
 *
 * // After correct SQL evaluation:
 * <ArjunAvatar mode="insight" />
 *
 * // Default idle state in the sidebar:
 * <ArjunAvatar size={36} showLabel={false} />
 */

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Colours ───────────────────────────────────────────────────────────────────
const ORANGE      = '#FC8019';
const BLUE        = '#4F80FF';
const ORANGE_DIM  = 'rgba(252,128,25,0.25)';
const BLUE_DIM    = 'rgba(79,128,255,0.25)';

// ── Pulse ring (thinking — orange) ────────────────────────────────────────────
function ThinkingRing({ size }) {
  const rings = [0, 1, 2];
  return (
    <>
      {rings.map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{ border: `1.5px solid ${ORANGE}` }}
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{
            scale:   [1, 1.35, 1.6],
            opacity: [0.7, 0.3, 0],
          }}
          transition={{
            duration: 1.8,
            delay:    i * 0.55,
            repeat:   Infinity,
            ease:     'easeOut',
          }}
        />
      ))}
    </>
  );
}

// ── Insight burst ring (one-shot — blue) ──────────────────────────────────────
function InsightRing({ onDone }) {
  return (
    <motion.div
      className="absolute inset-0 rounded-full"
      style={{ border: `2px solid ${BLUE}` }}
      initial={{ scale: 1, opacity: 0.9 }}
      animate={{ scale: 2.2, opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      onAnimationComplete={onDone}
    />
  );
}

// ── Static resting ring ───────────────────────────────────────────────────────
function IdleRing({ size }) {
  return (
    <div
      className="absolute inset-0 rounded-full"
      style={{
        border: '1.5px solid rgba(255,255,255,0.12)',
      }}
    />
  );
}

// ── Status indicator dot (bottom-right of avatar) ─────────────────────────────
function StatusDot({ mode }) {
  const colors = {
    idle:     '#3DD68C',
    thinking: ORANGE,
    insight:  BLUE,
  };
  return (
    <motion.div
      className="absolute bottom-0 right-0 w-3 h-3 rounded-full"
      style={{
        background: colors[mode],
        border: '1.5px solid #050505',
      }}
      animate={
        mode === 'thinking'
          ? { scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }
          : { scale: 1, opacity: 1 }
      }
      transition={
        mode === 'thinking'
          ? { duration: 1.1, repeat: Infinity }
          : { duration: 0.3 }
      }
    />
  );
}

// ── Avatar body ───────────────────────────────────────────────────────────────
function AvatarBody({ size, initials, mode }) {
  const isThinking = mode === 'thinking';
  const isInsight  = mode === 'insight';

  const bgGradient = isInsight
    ? `linear-gradient(135deg, ${BLUE_DIM}, rgba(79,128,255,0.4))`
    : isThinking
      ? `linear-gradient(135deg, ${ORANGE_DIM}, rgba(252,128,25,0.35))`
      : 'linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.06))';

  const borderColor = isInsight
    ? `rgba(79,128,255,0.6)`
    : isThinking
      ? `rgba(252,128,25,0.5)`
      : 'rgba(255,255,255,0.15)';

  return (
    <motion.div
      className="relative flex items-center justify-center rounded-full select-none"
      style={{
        width:            size,
        height:           size,
        background:       bgGradient,
        border:           `1.5px solid ${borderColor}`,
        backdropFilter:   'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        fontSize:         size * 0.34,
        fontFamily:       'var(--noir-display, Inter, system-ui)',
        fontWeight:       600,
        color:            isInsight ? BLUE : isThinking ? ORANGE : 'rgba(255,255,255,0.85)',
        letterSpacing:    '0.04em',
        transition:       'background 0.4s ease, border-color 0.4s ease, color 0.4s ease',
      }}
      animate={
        mode === 'idle'
          ? { scale: [1, 1.025, 1] }
          : mode === 'thinking'
            ? { scale: [1, 1.04, 1] }
            : { scale: [1, 1.08, 1] }
      }
      transition={
        mode === 'idle'
          ? { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
          : mode === 'thinking'
            ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {initials}
    </motion.div>
  );
}

// ── ArjunAvatar (main export) ─────────────────────────────────────────────────
export default function ArjunAvatar({
  mode      = 'idle',
  size      = 44,
  initials  = 'AK',
  label     = 'Arjun',
  showLabel = true,
  className = '',
}) {
  // Track insight rings so multiple can fire if mode cycles
  const [insightKeys, setInsightKeys] = useState([]);
  const lastMode = React.useRef(mode);

  useEffect(() => {
    if (mode === 'insight' && lastMode.current !== 'insight') {
      const key = Date.now();
      setInsightKeys(prev => [...prev, key]);
    }
    lastMode.current = mode;
  }, [mode]);

  const removeInsight = useCallback((key) => {
    setInsightKeys(prev => prev.filter(k => k !== key));
  }, []);

  // Glow shadow behind avatar
  const glowStyle = {
    idle:     '0 0 0 0 transparent',
    thinking: `0 0 20px 4px ${ORANGE_DIM}`,
    insight:  `0 0 28px 6px ${BLUE_DIM}`,
  }[mode];

  return (
    <motion.div
      className={`inline-flex flex-col items-center gap-1.5 ${className}`}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* ── Avatar + rings wrapper ── */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width:     size + 16,
          height:    size + 16,
          filter:    `drop-shadow(${glowStyle})`,
          transition:'filter 0.4s ease',
        }}
      >
        {/* Rings layer (behind body) */}
        <div
          className="absolute inset-2"
          style={{ borderRadius: '50%' }}
        >
          <IdleRing size={size} />

          {/* Thinking — pulsing orange rings */}
          <AnimatePresence>
            {mode === 'thinking' && <ThinkingRing size={size} />}
          </AnimatePresence>

          {/* Insight — one-shot blue burst(s) */}
          <AnimatePresence>
            {insightKeys.map(key => (
              <InsightRing key={key} onDone={() => removeInsight(key)} />
            ))}
          </AnimatePresence>
        </div>

        {/* Avatar body */}
        <div className="relative z-10">
          <AvatarBody size={size} initials={initials} mode={mode} />
          <StatusDot mode={mode} />
        </div>
      </div>

      {/* ── Label ── */}
      {showLabel && (
        <motion.div
          className="flex flex-col items-center gap-0.5"
          animate={{ opacity: 1 }}
        >
          <span
            style={{
              fontFamily:   'var(--noir-ui, Inter, system-ui)',
              fontSize:     size * 0.25,
              fontWeight:   600,
              color:        'rgba(255,255,255,0.75)',
              letterSpacing:'0.02em',
            }}
          >
            {label}
          </span>

          {/* Mode caption */}
          <AnimatePresence mode="wait">
            <motion.span
              key={mode}
              style={{
                fontFamily:   'var(--noir-mono, JetBrains Mono, monospace)',
                fontSize:     size * 0.19,
                color: mode === 'thinking' ? ORANGE
                     : mode === 'insight'  ? BLUE
                     : 'rgba(255,255,255,0.35)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={   { opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            >
              {mode === 'thinking' ? '● thinking…'
             : mode === 'insight'  ? '✓ insight'
             : '○ online'}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}
