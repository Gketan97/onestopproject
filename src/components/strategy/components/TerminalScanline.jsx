// src/components/strategy/components/TerminalScanline.jsx
// Sprint 5 — CRT Terminal Scanline Overlay
//
// Renders as position:absolute, inset:0, pointerEvents:none
// so it overlays the Terminal pane without blocking interaction.
//
// Two layers:
//   1. Static horizontal scan lines (SVG pattern) — subtle texture
//   2. Animated "sweep" line that moves top→bottom on loop — CRT feel
//
// Usage: drop inside the Terminal pane container with position:relative

import React from 'react';
import { motion } from 'framer-motion';

export default function TerminalScanline({ opacity = 0.35 }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
        overflow: 'hidden',
        borderRadius: 'inherit',
      }}
    >
      {/* Layer 1: static scanline texture via repeating SVG gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0,0,0,${opacity * 0.4}) 2px,
          rgba(0,0,0,${opacity * 0.4}) 4px
        )`,
        opacity,
      }} />

      {/* Layer 2: subtle vignette — darkens edges like a CRT bezel */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,${opacity * 0.7}) 100%)`,
      }} />

      {/* Layer 3: animated sweep line */}
      <motion.div
        animate={{ y: ['-2%', '102%'] }}
        transition={{
          duration: 8,
          ease: 'linear',
          repeat: Infinity,
          repeatDelay: 4,
        }}
        style={{
          position: 'absolute',
          left: 0, right: 0,
          height: 3,
          background: `linear-gradient(
            90deg,
            transparent 0%,
            rgba(252,128,25,0.06) 20%,
            rgba(79,128,255,0.10) 50%,
            rgba(252,128,25,0.06) 80%,
            transparent 100%
          )`,
          boxShadow: '0 0 12px rgba(79,128,255,0.12)',
        }}
      />

      {/* Layer 4: top-edge phosphor glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(79,128,255,0.15), transparent)',
        opacity: 0.6,
      }} />
    </div>
  );
}