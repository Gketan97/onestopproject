/**
 * PremiumShell.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * SaaS-Noir layout wrapper. Renders:
 *   • Deep near-black background (#050505)
 *   • Two ambient orbs — Swiggy Orange (top-left) + Investigation Blue (bottom-right)
 *   • Faint 20px dotted grid overlay
 *   • Children rendered above all layers in a relative z-10 container
 *
 * Props
 * ─────
 * children      ReactNode    — your existing page/section content
 * showGrid      boolean      — toggle dotted grid (default: true)
 * showOrbs      boolean      — toggle ambient orbs (default: true)
 * orangePos     string       — tailwind position for orange orb (default: '-top-32 -left-32')
 * bluePos       string       — tailwind position for blue orb (default: '-bottom-32 -right-32')
 * className     string       — extra classes on the outer wrapper
 * style         object       — extra inline styles on the outer wrapper
 * as            string       — HTML tag to render as (default: 'div')
 *
 * Usage
 * ─────
 * import PremiumShell from '@/components/ui/shell/PremiumShell';
 *
 * <PremiumShell>
 *   <Phase1Section {...props} />
 * </PremiumShell>
 */

import React, { useRef } from 'react';
import { motion } from 'framer-motion';

// ── Orb ───────────────────────────────────────────────────────────────────────
function AmbientOrb({ variant = 'orange', className = '', delay = 0 }) {
  const isOrange = variant === 'orange';
  return (
    <motion.div
      className={`noir-orb ${isOrange ? 'noir-orb-orange' : 'noir-orb-blue'} ${className}`}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 2.0,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    />
  );
}

// ── Dotted Grid ───────────────────────────────────────────────────────────────
function DottedGrid() {
  return (
    <motion.div
      className="noir-grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.3 }}
    />
  );
}

// ── PremiumShell ──────────────────────────────────────────────────────────────
export default function PremiumShell({
  children,
  showGrid   = true,
  showOrbs   = true,
  orangePos  = '-top-48 -left-48',
  bluePos    = '-bottom-48 -right-48',
  className  = '',
  style      = {},
  as         = 'div',
}) {
  const Tag = as;

  return (
    <Tag
      className={`noir-shell relative min-h-screen overflow-hidden ${className}`}
      style={{
        background: '#050505',
        ...style,
      }}
    >
      {/* ── Layer 0: Ambient orbs ── */}
      {showOrbs && (
        <>
          <AmbientOrb variant="orange" className={`absolute ${orangePos}`} delay={0} />
          <AmbientOrb variant="blue"   className={`absolute ${bluePos}`}   delay={0.3} />
        </>
      )}

      {/* ── Layer 1: Dotted grid ── */}
      {showGrid && <DottedGrid />}

      {/* ── Layer 2: Content ── */}
      <div className="relative z-10">
        {children}
      </div>
    </Tag>
  );
}

// ── Named sub-exports for convenience ─────────────────────────────────────────

/**
 * PremiumSection — a motion-animated section container for use INSIDE PremiumShell.
 * Provides staggered entrance for its children.
 *
 * Props: delay (number, seconds), className, children
 */
export function PremiumSection({ children, delay = 0, className = '' }) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.section>
  );
}

/**
 * PremiumCard — a glass morphism card for content inside PremiumShell.
 *
 * Props: children, className, glowOnHover (boolean)
 */
export function PremiumCard({ children, className = '', glowOnHover = false }) {
  return (
    <motion.div
      className={`glass rounded-2xl p-6 ${className}`}
      whileHover={glowOnHover ? { borderColor: 'rgba(79,128,255,0.4)' } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
