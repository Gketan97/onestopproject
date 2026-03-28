/**
 * PremiumShell.jsx
 * Layout wrapper for the case study pages.
 * Ambient orbs + dotted grid are handled globally by body/html pseudo-elements
 * in index.css — no duplication needed here.
 *
 * Props: children, className, style, as
 */
import React from 'react';
import { motion } from 'framer-motion';

export default function PremiumShell({
  children,
  // kept for API compat but no longer used — orbs/grid are in CSS
  showGrid   = true,
  showOrbs   = true,
  orangePos,
  bluePos,
  className  = '',
  style      = {},
  as         = 'div',
}) {
  const Tag = as;
  return (
    <Tag
      className={`min-h-screen ${className}`}
      style={{ background: 'var(--bg)', ...style }}
    >
      {children}
    </Tag>
  );
}

/** PremiumSection — staggered entrance for sections inside the shell */
export function PremiumSection({ children, delay = 0, className = '' }) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.section>
  );
}

/** PremiumCard — glass morphism card */
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

