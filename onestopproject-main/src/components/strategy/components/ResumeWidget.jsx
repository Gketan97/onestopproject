// src/components/strategy/components/ResumeWidget.jsx
// Before/After glassmorphism card comparison — SQL Writer vs Incident Responder

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CARD_A = {
  badge: '✗ Ghosted · 14 Days',
  label: 'THE SQL WRITER',
  role: 'Data Analyst · Application',
  points: [
    { text: 'Ran SQL queries on request from marketing',   icon: '—' },
    { text: 'Built weekly order dashboards in Tableau',    icon: '—' },
    { text: 'Maintained data pipelines and ETL jobs',      icon: '—' },
    { text: 'Created Excel reports for business reviews',  icon: '—' },
  ],
  footer: '● No response · Moved to rejected folder',
  borderColor: 'rgba(243,139,168,0.18)',
  glowColor: 'transparent',
  bg: 'rgba(243,139,168,0.03)',
  badgeBg: 'rgba(243,139,168,0.12)',
  badgeColor: '#F38BA8',
  labelColor: '#F38BA8',
  dotColor: 'rgba(243,139,168,0.4)',
  footerColor: '#F38BA8',
  ptColor: 'var(--ink3)',
};

const CARD_B_BASE = {
  badge: '○ Pending',
  label: 'THE INCIDENT RESPONDER',
  role: 'Senior Analyst · Application',
  points: [
    { text: 'Diagnosed 8.3% WoW revenue leak via root-cause investigation',         icon: '✓' },
    { text: 'Performed Cohort Analysis identifying $1.2M churn risk in North Bangalore', icon: '✓' },
    { text: 'Authored Executive Brief for VP of Product — ₹28L impact sizing',       icon: '✓' },
    { text: 'Built early-warning retention framework adopted across 3 verticals',     icon: '✓' },
  ],
  borderColor: 'rgba(252,128,25,0.20)',
  glowColor: 'transparent',
  bg: 'rgba(252,128,25,0.03)',
  badgeBg: 'rgba(252,128,25,0.10)',
  badgeColor: '#FC8019',
  badgeBorderColor: 'rgba(252,128,25,0.25)',
  labelColor: '#FC8019',
  dotColor: '#FC8019',
  footerColor: 'var(--ink3)',
  footer: '○ Awaiting response',
  ptColor: 'var(--ink2)',
};

const CARD_B_SHORTLISTED = {
  ...CARD_B_BASE,
  badge: '⚡ Shortlisted',
  badgeBg: 'var(--phase1)',
  badgeColor: '#fff',
  borderColor: 'rgba(252,128,25,0.45)',
  glowColor: '0 0 48px rgba(252,128,25,0.22), 0 0 0 1px rgba(252,128,25,0.28)',
  bg: 'rgba(252,128,25,0.07)',
  footer: '● Interview scheduled · Thursday 3 PM',
  footerColor: '#FC8019',
  ptColor: 'var(--ink2)',
};

function Card({ data, shortlisted, isB }) {
  return (
    <motion.div
      layout
      style={{
        position: 'relative',
        borderRadius: 20,
        padding: 28,
        background: data.bg,
        border: `1px solid ${data.borderColor}`,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow: data.glowColor || 'none',
        display: 'flex', flexDirection: 'column', gap: 18,
      }}
      animate={{
        y: isB && shortlisted ? -8 : 0,
        boxShadow: isB && shortlisted
          ? '0 0 48px rgba(252,128,25,0.22), 0 0 0 1px rgba(252,128,25,0.28)'
          : 'none',
      }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Top badge */}
      <div style={{ position: 'absolute', top: -15, left: '50%', transform: 'translateX(-50%)' }}>
        <motion.span
          animate={isB && shortlisted ? {
            boxShadow: ['0 0 16px rgba(252,128,25,0.5)', '0 0 36px rgba(252,128,25,0.9)', '0 0 16px rgba(252,128,25,0.5)'],
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            display: 'inline-block', padding: '4px 14px', borderRadius: 999,
            fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            background: data.badgeBg, color: data.badgeColor,
            border: `1px solid ${data.badgeBorderColor || data.badgeColor + '40'}`,
            whiteSpace: 'nowrap',
          }}
        >
          {data.badge}
        </motion.span>
      </div>

      {/* Header */}
      <div style={{ marginTop: 8 }}>
        <p style={{
          fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: data.labelColor, marginBottom: 4,
        }}>
          {data.label}
        </p>
        <p style={{ fontSize: 13, color: 'var(--ink2)', fontWeight: 500 }}>{data.role}</p>
      </div>

      <div style={{ height: 1, background: `${data.labelColor}20` }} />

      {/* Bullet points */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {data.points.map((pt, i) => (
          <motion.li
            key={i}
            initial={false}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}
          >
            <span style={{
              flexShrink: 0, marginTop: 2,
              width: 18, height: 18, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: isB ? 10 : 11, fontWeight: 800,
              background: isB ? 'rgba(252,128,25,0.12)' : 'rgba(243,139,168,0.10)',
              color: data.dotColor,
              border: `1px solid ${isB ? 'rgba(252,128,25,0.25)' : 'rgba(243,139,168,0.2)'}`,
            }}>
              {pt.icon}
            </span>
            <span style={{ fontSize: 13, lineHeight: 1.58, color: data.ptColor }}>{pt.text}</span>
          </motion.li>
        ))}
      </ul>

      <div style={{ height: 1, background: `${data.labelColor}15` }} />

      {/* Footer status */}
      <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: data.footerColor }}>{data.footer}</p>
    </motion.div>
  );
}

export default function ResumeWidget() {
  const [shortlisted, setShortlisted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !shortlisted) setTimeout(() => setShortlisted(true), 700); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const cardBData = shortlisted ? CARD_B_SHORTLISTED : CARD_B_BASE;

  return (
    <section ref={ref} style={{ padding: '0 24px 96px', maxWidth: 960, margin: '0 auto' }}>

      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <p style={{
          fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'var(--ink3)', marginBottom: 14,
        }}>
          The Resume Reality Check
        </p>
        <h2 style={{
          fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)',
          fontWeight: 800, letterSpacing: '-0.03em',
          color: 'var(--ink)', lineHeight: 1.12, marginBottom: 14,
        }}>
          Same role. Same tools.{' '}
          <span style={{ color: 'var(--phase1)' }}>One got the callback.</span>
        </h2>
        <p style={{ fontSize: 15, color: 'var(--ink2)', maxWidth: 500, margin: '0 auto', lineHeight: 1.65 }}>
          The difference isn't SQL skill — it's the ability to frame impact,
          diagnose root causes, and speak the language of business decisions.
        </p>
      </div>

      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 24, paddingTop: 22,
      }}>
        <Card data={CARD_A}       shortlisted={shortlisted} isB={false} />
        <Card data={cardBData}    shortlisted={shortlisted} isB={true} />
      </div>

      {/* Replay */}
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <button
          onClick={() => { setShortlisted(false); setTimeout(() => setShortlisted(true), 120); }}
          style={{
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--ink3)',
            background: 'none', border: 'none', cursor: 'pointer', padding: '6px 12px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--phase1)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--ink3)'}
        >
          ↺ Replay animation
        </button>
      </div>
    </section>
  );
}
