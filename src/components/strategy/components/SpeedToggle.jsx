// src/components/strategy/components/SpeedToggle.jsx
// Sprint 6 — Typewriter speed selector for the IncidentHUD
//
// Usage in CognitiveWorkbenchShell.jsx:
//   import SpeedToggle from './SpeedToggle.jsx';
//   <SpeedToggle speed={typewriterSpeed} onChange={setTypewriterSpeed} />
//
// Speed mapping: Slow = 18ms, Normal = 10ms, Fast = 4ms
// Persists to localStorage key 'osc_typewriter_speed'.

import React from 'react';

const ORANGE = '#FC8019';

export const SPEED_OPTIONS = [
  { label: '🐢', value: 18, ariaLabel: 'Slow speed' },
  { label: '⚡', value: 10, ariaLabel: 'Normal speed' },
  { label: '🚀', value: 4,  ariaLabel: 'Fast speed'  },
];

export function getInitialSpeed() {
  try {
    const stored = localStorage.getItem('osc_typewriter_speed');
    const n = Number(stored);
    if (SPEED_OPTIONS.some(o => o.value === n)) return n;
  } catch (_) {}
  return 10; // default Normal
}

export default function SpeedToggle({ speed, onChange }) {
  const handleClick = (value) => {
    onChange(value);
    try { localStorage.setItem('osc_typewriter_speed', String(value)); } catch (_) {}
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      flexShrink: 0,
    }}>
      {SPEED_OPTIONS.map(({ label, value, ariaLabel }) => {
        const isActive = speed === value;
        return (
          <button
            key={value}
            onClick={() => handleClick(value)}
            aria-pressed={isActive}
            aria-label={ariaLabel}
            title={ariaLabel}
            style={{
              width: 28, height: 28,
              borderRadius: 6,
              border: `1px solid ${isActive ? `${ORANGE}35` : 'var(--border)'}`,
              background: isActive ? `${ORANGE}14` : 'var(--bg-raised)',
              color: isActive ? ORANGE : 'var(--ink3)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, lineHeight: 1,
              transition: 'background 0.15s, border-color 0.15s',
              flexShrink: 0,
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}