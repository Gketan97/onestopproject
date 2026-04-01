// src/components/strategy/components/PlatformContextBar.jsx
// Sprint 6 — Platform cross-navigation bar
// Appears at the bottom of the Strategy Pad after Milestone 2 completes.
// Uses CSS variables only — no hardcoded dark rgba values.

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CHIPS = [
  { icon: Briefcase, label: 'Jobs for this skill', href: '/jobs',            newTab: false },
  { icon: Users,     label: 'Get referred',         href: '/become-referrer', newTab: true  },
  { icon: Star,      label: 'Find a mentor',         href: '/mentors',         newTab: true  },
];

function Chip({ icon: Icon, label, href, newTab, navigate }) {
  const [hovered, setHovered] = React.useState(false);

  const handleClick = () => {
    if (newTab) {
      window.open(href, '_blank', 'noopener noreferrer');
    } else {
      navigate(href);
    }
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 28,
        borderRadius: 999,
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${hovered ? 'rgba(252,128,25,0.4)' : 'rgba(255,255,255,0.09)'}`,
        padding: '0 12px',
        display: 'flex', alignItems: 'center', gap: 6,
        fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600,
        color: hovered ? 'var(--ink2)' : 'var(--ink3)',
        cursor: 'pointer',
        transition: 'border-color 0.15s, color 0.15s',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      <Icon size={11} />
      {label}
    </button>
  );
}

export default function PlatformContextBar({ milestonesCompleted = 0 }) {
  const navigate = useNavigate();

  if (milestonesCompleted < 2) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.8 }}
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(0,0,0,0.2)',
        padding: '0 16px',
        height: 52,
        display: 'flex', alignItems: 'center', gap: 10,
        flexShrink: 0,
        overflowX: 'auto',
      }}
    >
      <span style={{
        fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
        color: 'var(--ink3)', textTransform: 'uppercase',
        letterSpacing: '0.1em', flexShrink: 0,
      }}>
        Explore:
      </span>

      {CHIPS.map(chip => (
        <Chip key={chip.href} {...chip} navigate={navigate} />
      ))}
    </motion.div>
  );
}