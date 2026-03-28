/**
 * GlassWorkbench.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Glass-morphism container for the SQL editor.
 *
 * Features
 * ────────
 * • Frosted-glass surface (backdrop-blur: 12px, white/10 border)
 * • Active glow ring when user is typing (blue → orange shimmer)
 * • Top shimmer bar during query execution
 * • Staggered Framer Motion entrance
 * • Fully prop-transparent — your existing <SqlWorkbench /> drops inside
 *
 * Props
 * ─────
 * children    ReactNode     — your existing SqlWorkbench (or any content)
 * title       string        — filename shown in the tab bar  (default: 'query.sql')
 * isActive    boolean       — true while textarea is focused → blue glow
 * isLoading   boolean       — true while query is running  → shimmer bar
 * headerRight ReactNode     — extra controls in the tab bar (Run/Evaluate buttons etc.)
 * className   string        — extra classes on the outer wrapper
 * delay       number        — Framer Motion entrance delay in seconds (default: 0)
 *
 * Usage
 * ─────
 * // Minimal — just wrap your existing workbench
 * <GlassWorkbench title="query.sql" isActive={focused} isLoading={running}>
 *   <SqlWorkbench {...existingProps} />
 * </GlassWorkbench>
 *
 * // With custom header slot
 * <GlassWorkbench
 *   title="phase2_investigation.sql"
 *   isActive={focused}
 *   isLoading={running}
 *   headerRight={<RunButton onClick={execQuery} />}
 * >
 *   <textarea ... />
 * </GlassWorkbench>
 */

import React, { useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Traffic lights (purely decorative, à la macOS) ────────────────────────────
function TrafficLights() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#FF5F57' }} />
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#FFBD2E' }} />
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28CA41', opacity: 0.6 }} />
    </div>
  );
}

// ── File tab ──────────────────────────────────────────────────────────────────
function FileTab({ label }) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1 rounded-t-md text-[11px] font-mono"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderBottom: 'none',
        color: 'var(--noir-ink-2, #9AA0B4)',
        letterSpacing: '0.03em',
      }}
    >
      {/* SQL file icon */}
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <rect x="1" y="0" width="6" height="8" rx="1" stroke="currentColor" strokeWidth="0.8" fill="none" />
        <path d="M3 3h4M3 5h2" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
      </svg>
      {label}
    </div>
  );
}

// ── Shimmer top bar ───────────────────────────────────────────────────────────
function ShimmerBar() {
  return (
    <motion.div
      className="noir-shimmer-bar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    />
  );
}

// ── Glow border layer ─────────────────────────────────────────────────────────
// Renders as an inset absolutely-positioned ring so it doesn't shift layout
function GlowRing({ visible, color = 'blue' }) {
  const isBlue   = color === 'blue';
  const glowColor = isBlue
    ? 'rgba(79, 128, 255, 0.5)'
    : 'rgba(252, 128, 25, 0.5)';
  const borderColor = isBlue
    ? 'rgba(79, 128, 255, 0.6)'
    : 'rgba(252, 128, 25, 0.6)';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: `1px solid ${borderColor}` }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            boxShadow: [
              `0 0 0 0 ${glowColor}`,
              `0 0 16px 2px ${glowColor}`,
              `0 0 0 0 ${glowColor}`,
            ],
          }}
          exit={{ opacity: 0 }}
          transition={{
            opacity:    { duration: 0.25 },
            boxShadow:  { duration: 2.0, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      )}
    </AnimatePresence>
  );
}

// ── GlassWorkbench ────────────────────────────────────────────────────────────
export default function GlassWorkbench({
  children,
  title      = 'query.sql',
  isActive   = false,
  isLoading  = false,
  headerRight,
  className  = '',
  delay      = 0,
}) {
  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden ${className}`}
      style={{
        background:       'rgba(255, 255, 255, 0.04)',
        backdropFilter:   'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border:           '1px solid rgba(255, 255, 255, 0.10)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* ── Loading shimmer (absolute top bar) ── */}
      <AnimatePresence>{isLoading && <ShimmerBar />}</AnimatePresence>

      {/* ── Glow ring (sits above content, below border) ── */}
      <GlowRing visible={isActive && !isLoading} color="blue" />
      <GlowRing visible={isLoading}               color="orange" />

      {/* ── Tab bar row ── */}
      <div
        className="flex items-end justify-between px-3 pt-2"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-end gap-0">
          <div className="mr-3 mb-2">
            <TrafficLights />
          </div>
          <FileTab label={title} />
        </div>

        {/* Optional right-side header slot */}
        {headerRight && (
          <div className="mb-2 flex items-center gap-2">
            {headerRight}
          </div>
        )}
      </div>

      {/* ── Content slot — your existing SqlWorkbench ── */}
      <div className="relative">
        {children}
      </div>
    </motion.div>
  );
}

/**
 * GlassPanel — a simpler glass card for non-SQL content blocks.
 * Same visual language as GlassWorkbench without the tab bar.
 */
export function GlassPanel({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden ${className}`}
      style={{
        background:           'rgba(255, 255, 255, 0.04)',
        backdropFilter:       'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border:               '1px solid rgba(255, 255, 255, 0.10)',
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
