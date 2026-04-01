// src/components/layout/ThemeToggle.jsx
// Sprint 6 — Light/dark mode toggle
// Pill-shaped, 52×26px. Moon = dark, Sun = light.
// Framer Motion layout animation on thumb.

import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useThemeContext } from '../../hooks/useTheme.jsx';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeContext();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      role="switch"
      aria-checked={!isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: 52, height: 26,
        borderRadius: 999,
        padding: '0 4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
        cursor: 'pointer',
        outline: 'none',
        transition: 'background 0.2s, border-color 0.2s',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      {/* Moon icon — left side in dark mode */}
      <Moon
        size={13}
        style={{
          color: 'var(--ink2)',
          opacity: isDark ? 1 : 0,
          transition: 'opacity 0.2s',
          flexShrink: 0,
        }}
      />

      {/* Sun icon — right side in light mode */}
      <Sun
        size={13}
        style={{
          color: 'var(--ink2)',
          opacity: isDark ? 0 : 1,
          transition: 'opacity 0.2s',
          flexShrink: 0,
        }}
      />

      {/* Animated thumb */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        style={{
          position: 'absolute',
          top: 3,
          left: isDark ? 'calc(100% - 22px)' : 3,
          width: 18, height: 18,
          borderRadius: '50%',
          background: isDark ? '#F0F0F5' : '#111118',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  );
}