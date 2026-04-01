// src/components/strategy/components/PostCompletionNext.jsx
// Sprint 6 — Rich post-completion screen
// Three columns: Portfolio link, Job cards, Skill path.
// CSS variables only. No hardcoded dark rgba. Light-mode safe.

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ArrowRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ORANGE = '#FC8019';
const BLUE   = '#4F80FF';
const GREEN  = '#3DD68C';
const PURPLE = '#A78BFA';

// ── Static job cards ──────────────────────────────────────────────────────────
const JOBS = [
  { title: 'Product Analyst',  company: 'Swiggy',  location: 'Bangalore', tag: 'Analytics' },
  { title: 'Business Analyst', company: 'Zepto',   location: 'Bangalore', tag: 'Strategy'  },
  { title: 'Data Analyst',     company: 'Meesho',  location: 'Bangalore', tag: 'Growth'    },
];

// ── Skill bars ────────────────────────────────────────────────────────────────
const SKILLS = [
  { label: 'Funnel Analysis',    pct: 100 },
  { label: 'Cohort Retention',   pct: 100 },
  { label: 'Impact Sizing',      pct: 85  },
];

// ── MonoLabel ─────────────────────────────────────────────────────────────────
function MonoLabel({ children, color = 'var(--ink3)' }) {
  return (
    <p style={{
      fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
      color, textTransform: 'uppercase', letterSpacing: '0.12em',
      marginBottom: 12,
    }}>
      {children}
    </p>
  );
}

// ── Column card wrapper ───────────────────────────────────────────────────────
function Col({ color, children }) {
  return (
    <div style={{
      padding: '22px 20px', borderRadius: 16,
      border: `1px solid ${color}20`,
      background: `${color}04`,
      display: 'flex', flexDirection: 'column', gap: 0,
    }}>
      {children}
    </div>
  );
}

// ── Column 1: Portfolio ───────────────────────────────────────────────────────
function PortfolioCol({ portfolioId }) {
  const [copied, setCopied] = useState(false);
  const displayId = portfolioId ? portfolioId.slice(0, 8) : 'abc12345';
  const url       = `onestopcareers.com/portfolio/${displayId}`;
  const fullUrl   = `${window.location.origin}/portfolio/${displayId}`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  }, [fullUrl]);

  return (
    <Col color={GREEN}>
      <MonoLabel color={GREEN}>Shareable Link Ready</MonoLabel>
      <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.35, marginBottom: 14 }}>
        Send this to every recruiter you're applying to.
      </p>

      {/* URL row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        borderRadius: 8, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(0,0,0,0.2)',
        marginBottom: 12,
      }}>
        <span style={{
          flex: 1, padding: '9px 12px',
          fontFamily: 'var(--mono)', fontSize: 10,
          color: 'var(--ink2)', overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {url}
        </span>
        <motion.button
          onClick={handleCopy}
          whileTap={{ scale: 0.93 }}
          style={{
            flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '9px 12px',
            background: copied ? `${GREEN}20` : `${GREEN}15`,
            border: 'none', borderLeft: `1px solid ${GREEN}25`,
            cursor: 'pointer', color: GREEN,
            fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
            transition: 'background 0.15s',
          }}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? '✓' : 'Copy'}
        </motion.button>
      </div>

      <p style={{ fontSize: 12, color: 'var(--ink3)', lineHeight: 1.65 }}>
        This shows them exactly how you think through a real business problem — in 60 seconds.
      </p>
    </Col>
  );
}

// ── Column 2: Jobs ────────────────────────────────────────────────────────────
function JobsCol() {
  const navigate = useNavigate();

  return (
    <Col color={BLUE}>
      <MonoLabel color={BLUE}>Roles That Hire For This</MonoLabel>
      <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.35, marginBottom: 14 }}>
        Next: apply to these roles.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
        {JOBS.map(({ title, company, location, tag }) => (
          <div
            key={company}
            style={{
              height: 40, borderRadius: 8,
              background: `${BLUE}04`, border: `1px solid ${BLUE}18`,
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', padding: '0 12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <span style={{ fontSize: 12, color: 'var(--ink)', fontWeight: 600, flexShrink: 0 }}>{company}</span>
              <span style={{ fontSize: 11, color: 'var(--ink2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)' }}>{location}</span>
              <ArrowRight size={12} color={BLUE} style={{ opacity: 0.6 }} />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/jobs')}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
          color: BLUE, transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        See all open roles <ArrowRight size={11} />
      </button>
    </Col>
  );
}

// ── Column 3: Skills ──────────────────────────────────────────────────────────
function SkillsCol({ onNotifyClick }) {
  return (
    <Col color={PURPLE}>
      <MonoLabel color={PURPLE}>Your Learning Path</MonoLabel>
      <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.35, marginBottom: 14 }}>
        Build on this skill.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {SKILLS.map(({ label, pct }, i) => (
          <div key={label} style={{
            padding: '10px 12px', borderRadius: 8,
            background: `${PURPLE}06`, border: `1px solid ${PURPLE}18`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--ink)', fontWeight: 500 }}>{label}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: PURPLE }}>{pct}%</span>
            </div>
            <div style={{ height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.2, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: '100%', borderRadius: 999, background: PURPLE }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Coming next */}
      <div style={{
        padding: '10px 12px', borderRadius: 8,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        marginBottom: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
          <Lock size={11} color="var(--ink3)" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.6, margin: 0 }}>
            Coming next: A/B Testing & Experiment Design <span style={{ color: 'var(--ink3)' }}>(Flipkart case)</span>
          </p>
        </div>
      </div>

      <button
        onClick={onNotifyClick}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
          color: PURPLE, transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        Notify me when it's live <ArrowRight size={11} />
      </button>
    </Col>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PostCompletionNext({ portfolioId, onNotifyClick }) {
  const navigate = useNavigate();

  const colVariants = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.1 } },
  };
  const colItem = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div style={{ padding: '48px 24px 80px', maxWidth: 860, margin: '0 auto' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: 40 }}
      >
        <div style={{ fontSize: 44, marginBottom: 14 }}>🏆</div>
        <h2 style={{
          fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800,
          letterSpacing: '-0.02em', color: 'var(--ink)',
          marginBottom: 10, lineHeight: 1.15,
        }}>
          You think like a Staff Analyst.
        </h2>
        <p style={{ fontSize: 15, color: 'var(--ink2)', maxWidth: 420, margin: '0 auto', lineHeight: 1.65 }}>
          Your investigation is complete. Here's what to do with it.
        </p>
      </motion.div>

      {/* Three columns */}
      <motion.div
        variants={colVariants}
        initial="hidden"
        animate="show"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
        }}
      >
        <motion.div variants={colItem}><PortfolioCol portfolioId={portfolioId} /></motion.div>
        <motion.div variants={colItem}><JobsCol /></motion.div>
        <motion.div variants={colItem}><SkillsCol onNotifyClick={onNotifyClick} /></motion.div>
      </motion.div>

      {/* Back to home */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ textAlign: 'center', marginTop: 40 }}
      >
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink3)',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--ink2)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--ink3)'}
        >
          ← Back to home
        </button>
      </motion.div>
    </div>
  );
}