// src/components/strategy/components/StrategyHero.jsx
// FAANG-grade role-agnostic landing.
// Central persona system: the cycling role in the pill drives resume card
// copy, job titles, and bullets everywhere on the page — one scenario,
// every audience sees themselves.

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Brain, TrendingUp, FileText } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// PERSONA MAP — one entry per cycling role.
// Each persona: pill label, resume card A (ghosted) and B (shortlisted).
// Same incident. Different role lens. User self-identifies instantly.
// ─────────────────────────────────────────────────────────────────────────────
const PERSONAS = [
  {
    pill: 'Product Managers',
    roleA: 'Product Manager · Application',
    archetypeA: 'The Feature Shipper',
    bulletsA: [
      'Wrote PRDs and managed sprint backlog for 3 squads',
      'Coordinated with design and engineering on feature launches',
      'Tracked DAU and retention in dashboards built by the data team',
      'Ran weekly standups and updated stakeholders on delivery status',
    ],
    roleB: 'Senior PM · Interview in 2 Days ✓',
    archetypeB: 'The Incident Owner',
    bulletsB: [
      'Led cross-functional war room response to 8.3% WoW GMV drop',
      'Structured MECE hypothesis tree; isolated supply-side root cause in 48h',
      'Authored VP-level brief sizing ₹2Cr+ revenue recovery opportunity',
      'Shipped early-warning retention playbook adopted across 3 business verticals',
    ],
    footerB: '● Interview scheduled · Thursday 3 PM',
  },
  {
    pill: 'Business Analysts',
    roleA: 'Business Analyst · Application',
    archetypeA: 'The Report Runner',
    bulletsA: [
      'Ran SQL queries on request from marketing and ops teams',
      'Built weekly order dashboards in Tableau for leadership reviews',
      'Maintained data pipelines and ETL jobs across three databases',
      'Created Excel models for monthly business performance reviews',
    ],
    roleB: 'Senior Analyst · Interview in 2 Days ✓',
    archetypeB: 'The Root Cause Detective',
    bulletsB: [
      'Diagnosed 8.3% WoW revenue leak via structured root-cause investigation',
      'Performed cohort analysis identifying ₹1.2Cr churn risk in North Bangalore',
      'Authored executive brief for VP of Product with ₹28L impact sizing',
      'Built early-warning retention framework adopted across 3 verticals',
    ],
    footerB: '● Interview scheduled · Thursday 3 PM',
  },
  {
    pill: 'Strategy & Ops',
    roleA: 'Strategy Associate · Application',
    archetypeA: 'The Deck Builder',
    bulletsA: [
      'Built weekly operational review decks for leadership team',
      'Tracked KPIs in spreadsheets and flagged anomalies to managers',
      'Supported city-level ops reviews with pre-formatted templates',
      'Coordinated data pulls from analytics team for monthly reports',
    ],
    roleB: 'Strategy Lead · Interview in 2 Days ✓',
    archetypeB: 'The Business Architect',
    bulletsB: [
      'Owned cross-functional response to 8.3% WoW order drop in North Bangalore',
      'Designed diagnostic framework that isolated root cause in under 48 hours',
      'Presented ₹2Cr+ recovery brief directly to VP of Growth — approved in one review',
      'Built reusable incident playbook now standard across 3 city operations teams',
    ],
    footerB: '● Interview scheduled · Thursday 3 PM',
  },
  {
    pill: 'Consulting Associates',
    roleA: 'Consulting Analyst · Application',
    archetypeA: 'The Slide Factory',
    bulletsA: [
      'Supported case teams with secondary research and data gathering',
      'Built financial models in Excel based on manager specifications',
      'Formatted slide decks and synthesised client interview notes',
      'Tracked project milestones and updated weekly status reports',
    ],
    roleB: 'Senior Associate · Interview in 2 Days ✓',
    archetypeB: 'The Problem Solver',
    bulletsB: [
      'Led independent root-cause analysis on a live ₹2Cr revenue incident',
      'Applied MECE decomposition to isolate supply-side churn driver within 48h',
      'Delivered board-ready recommendation brief with quantified recovery scenario',
      'Designed early-warning metric framework scaled across 3 business units',
    ],
    footerB: '● Interview scheduled · Thursday 3 PM',
  },
  {
    pill: 'Growth Managers',
    roleA: 'Growth Manager · Application',
    archetypeA: 'The Campaign Executor',
    bulletsA: [
      'Managed performance marketing campaigns across Google and Meta',
      'Reported weekly CAC and ROAS metrics to the marketing leadership team',
      'A/B tested ad creatives and landing pages using third-party tools',
      'Coordinated with analytics team to pull cohort and funnel reports',
    ],
    roleB: 'Growth Lead · Interview in 2 Days ✓',
    archetypeB: 'The Revenue Architect',
    bulletsB: [
      'Identified supply-side friction causing 8.3% WoW GMV drop — not a demand issue',
      'Diagnosed new-user cohort churn cliff worth ₹2Cr+ in annualised revenue risk',
      'Authored executive growth brief adopted by VP as the recovery playbook',
      'Built cohort-based early-warning system flagging churn 2 weeks before it surfaces',
    ],
    footerB: '● Interview scheduled · Thursday 3 PM',
  },
  {
    pill: 'BizOps Analysts',
    roleA: 'BizOps Analyst · Application',
    archetypeA: 'The Dashboard Maintainer',
    bulletsA: [
      'Maintained operational dashboards for 4 city-level business units',
      'Ran ad-hoc SQL reports requested by ops leads and city managers',
      'Updated SOP documents and tracked process compliance metrics',
      'Prepared weekly ops review packs using pre-defined Excel templates',
    ],
    roleB: 'Senior BizOps Analyst · Interview in 2 Days ✓',
    archetypeB: 'The Operations Architect',
    bulletsB: [
      'Cracked a live ₹2Cr GMV drop by diagnosing dirty data masking the real root cause',
      'Mapped cohort retention cliff and sized impact for VP-level resource reallocation',
      'Authored cross-functional incident brief now used as the BizOps response standard',
      'Designed scalable early-warning metrics framework rolled out across 3 verticals',
    ],
    footerB: '● Interview scheduled · Thursday 3 PM',
  },
  {
    pill: 'Product Analysts',
    roleA: 'Product Analyst · Application',
    archetypeA: 'The Metric Tracker',
    bulletsA: [
      'Tracked product KPIs and built dashboards for the core product team',
      'Pulled weekly retention and engagement reports using SQL and Metabase',
      'Flagged metric anomalies in Slack and escalated to senior analysts',
      'Maintained event taxonomy and supported product instrumentation QA',
    ],
    roleB: 'Senior Product Analyst · Interview in 2 Days ✓',
    archetypeB: 'The Insight Driver',
    bulletsB: [
      'Self-initiated root cause investigation on 8.3% WoW GMV drop — no ask required',
      'Uncovered dirty data masking true drop; re-ran analysis and corrected VP\'s read',
      'Structured impact brief that changed the product roadmap prioritisation for Q3',
      'Built new-user retention framework now embedded in quarterly product reviews',
    ],
    footerB: '● Interview scheduled · Thursday 3 PM',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Hook — cycles through PERSONAS, drives everything
// ─────────────────────────────────────────────────────────────────────────────
function usePersonaCycle(interval = 2800) {
  const [idx, setIdx] = useState(0);
  const advance = useCallback(() => setIdx(i => (i + 1) % PERSONAS.length), []);
  useEffect(() => {
    const iv = setInterval(advance, interval);
    return () => clearInterval(iv);
  }, [advance, interval]);
  return { persona: PERSONAS[idx], idx };
}

// ─────────────────────────────────────────────────────────────────────────────
// Grain overlay
// ─────────────────────────────────────────────────────────────────────────────
function GrainOverlay() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    const W = c.width = window.innerWidth;
    const H = c.height = window.innerHeight;
    const d = ctx.createImageData(W, H);
    for (let i = 0; i < d.data.length; i += 4) {
      const v = Math.random() * 255;
      d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
      d.data[i + 3] = 7;
    }
    ctx.putImageData(d, 0, 0);
  }, []);
  return (
    <canvas ref={ref} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.35,
    }} />
  );
}

const ORANGE = '#FC8019';
const BLUE   = '#4F80FF';
const GREEN  = '#3DD68C';
const RED    = '#F38BA8';

// ─────────────────────────────────────────────────────────────────────────────
// Resume cards — fully reactive to active persona
// ─────────────────────────────────────────────────────────────────────────────
function ResumeCards({ persona, personaIdx }) {
  const [shortlisted, setShortlisted] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHasIntersected(true); setTimeout(() => setShortlisted(true), 600); } },
      { threshold: 0.25 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!hasIntersected) return;
    setShortlisted(false);
    const t = setTimeout(() => setShortlisted(true), 400);
    return () => clearTimeout(t);
  }, [personaIdx, hasIntersected]);

  return (
    <div ref={ref} style={{ padding: '0 24px 96px', maxWidth: 980, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <p style={{
          fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'var(--ink3)', marginBottom: 16,
        }}>The Experience Gap</p>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800,
          letterSpacing: '-0.03em', color: 'var(--ink)', lineHeight: 1.1, marginBottom: 16,
        }}>
          Same role. Same tools.{' '}
          <span style={{ color: ORANGE }}>One got the callback.</span>
        </h2>
        <p style={{ fontSize: 15, color: 'var(--ink2)', maxWidth: 520, margin: '0 auto', lineHeight: 1.65 }}>
          The gap isn't technical skill — it's structured thinking under pressure,
          the ability to frame impact, and knowing how to speak to decision-makers.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
        gap: 28, paddingTop: 24, alignItems: 'start',
      }}>
        {/* Card A */}
        <div style={{
          position: 'relative', borderRadius: 20, padding: 28,
          background: 'rgba(243,139,168,0.03)',
          outline: '1px solid rgba(243,139,168,0.14)',
          backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          display: 'flex', flexDirection: 'column', gap: 20,
        }}>
          <div style={{ position: 'absolute', top: -15, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
            <span style={{
              display: 'inline-block', padding: '5px 16px', borderRadius: 999,
              fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              background: 'rgba(243,139,168,0.12)', color: RED,
              border: '1px solid rgba(243,139,168,0.3)', whiteSpace: 'nowrap',
            }}>✗ Ghosted · 14 Days</span>
          </div>

          <div style={{ marginTop: 10 }}>
            <AnimatePresence mode="wait">
              <motion.p key={`arcA-${personaIdx}`}
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.28 }}
                style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: RED, marginBottom: 6 }}>
                {persona.archetypeA}
              </motion.p>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p key={`roleA-${personaIdx}`}
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.28, delay: 0.04 }}
                style={{ fontSize: 13, color: 'var(--ink3)', fontWeight: 500 }}>
                {persona.roleA}
              </motion.p>
            </AnimatePresence>
          </div>

          <div style={{ height: 1, background: 'rgba(243,139,168,0.1)' }} />

          <AnimatePresence mode="wait">
            <motion.ul key={`bullA-${personaIdx}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {persona.bulletsA.map((pt, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{
                    flexShrink: 0, marginTop: 2, width: 16, height: 16, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 800,
                    background: 'rgba(243,139,168,0.1)', color: RED, border: '1px solid rgba(243,139,168,0.22)',
                  }}>✗</span>
                  <span style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink3)' }}>{pt}</span>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>

          <div style={{ height: 1, background: 'rgba(243,139,168,0.1)' }} />
          <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: RED }}>
            ● No response · Moved to rejected folder
          </p>
        </div>

        {/* Card B */}
        <motion.div
          animate={shortlisted
            ? { y: -8, boxShadow: '0 0 48px rgba(252,128,25,0.22), 0 0 0 1px rgba(252,128,25,0.30)' }
            : { y: 0, boxShadow: '0 0 0px rgba(252,128,25,0)' }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'relative', borderRadius: 20, padding: 28,
            background: shortlisted ? 'rgba(252,128,25,0.06)' : 'rgba(252,128,25,0.03)',
            border: `1px solid ${shortlisted ? 'rgba(252,128,25,0.32)' : 'rgba(252,128,25,0.14)'}`,
            backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
            display: 'flex', flexDirection: 'column', gap: 20,
            transition: 'background 0.5s, border-color 0.5s',
          }}
        >
          <div style={{ position: 'absolute', top: -15, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
            <motion.span
              animate={shortlisted
                ? { boxShadow: ['0 0 20px rgba(252,128,25,0.5)', '0 0 42px rgba(252,128,25,0.95)', '0 0 20px rgba(252,128,25,0.5)'] }
                : { boxShadow: '0 0 0px rgba(252,128,25,0)' }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                display: 'inline-block', padding: '5px 16px', borderRadius: 999,
                fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                background: shortlisted ? ORANGE : 'rgba(252,128,25,0.1)',
                color: '#fff', border: '1px solid rgba(252,128,25,0.4)', whiteSpace: 'nowrap',
              }}
            >
              {shortlisted ? '⚡ Shortlisted' : '○ Pending'}
            </motion.span>
          </div>

          <div style={{ marginTop: 10 }}>
            <AnimatePresence mode="wait">
              <motion.p key={`arcB-${personaIdx}`}
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.28 }}
                style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: ORANGE, marginBottom: 6 }}>
                {persona.archetypeB}
              </motion.p>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p key={`roleB-${personaIdx}`}
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.28, delay: 0.04 }}
                style={{ fontSize: 13, color: shortlisted ? 'var(--ink)' : 'var(--ink2)', fontWeight: 500 }}>
                {persona.roleB}
              </motion.p>
            </AnimatePresence>
          </div>

          <div style={{ height: 1, background: 'rgba(252,128,25,0.1)' }} />

          <AnimatePresence mode="wait">
            <motion.ul key={`bullB-${personaIdx}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {persona.bulletsB.map((pt, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{
                    flexShrink: 0, marginTop: 2, width: 16, height: 16, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 800,
                    background: 'rgba(252,128,25,0.12)', color: ORANGE, border: '1px solid rgba(252,128,25,0.25)',
                  }}>✓</span>
                  <span style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink2)' }}>{pt}</span>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>

          <div style={{ height: 1, background: 'rgba(252,128,25,0.1)' }} />
          <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: shortlisted ? ORANGE : 'var(--ink3)' }}>
            {shortlisted ? persona.footerB : '○ Awaiting response'}
          </p>
        </motion.div>
      </div>

      {/* Progress dots + label */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28 }}>
        {PERSONAS.map((_, i) => (
          <div key={i} style={{
            width: i === personaIdx ? 22 : 6, height: 6, borderRadius: 999,
            background: i === personaIdx ? ORANGE : 'rgba(255,255,255,0.11)',
            transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
          }} />
        ))}
      </div>
      <p style={{
        textAlign: 'center', marginTop: 10,
        fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', letterSpacing: '0.06em',
      }}>
        Viewing: <span style={{ color: ORANGE }}>{persona.pill}</span>
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase cards — outcome-led, role-agnostic
// ─────────────────────────────────────────────────────────────────────────────
function PhaseCards({ onStartSimulator }) {
  const phases = [
    {
      num: '01', color: ORANGE, icon: Brain,
      title: 'Frame the Problem',
      subtitle: 'Before you touch data',
      body: 'Real incidents don\'t come with instructions. You\'ll practise the structured questioning that separates strategic thinkers from task-executors — scoping, hypothesis trees, what to rule out first. Arjun, your AI mentor, pushes back on every shortcut.',
      outcome: 'You walk away knowing how to triage ambiguity under pressure',
    },
    {
      num: '02', color: BLUE, icon: TrendingUp,
      title: 'Find What Actually Broke',
      subtitle: 'AI-leveraged root cause analysis',
      body: 'Explore live data in plain English — no SQL required. Spot the real revenue leak and the dirty-data trap that trips most people. AI accelerates exploration; your judgment drives the conclusion. The tool finds patterns. You find meaning.',
      outcome: 'You walk away with a defensible root cause backed by evidence',
    },
    {
      num: '03', color: GREEN, icon: FileText,
      title: 'A Portfolio Piece Recruiters Notice',
      subtitle: 'From insight to career asset',
      body: 'Turn your findings into an executive recommendation — ₹2Cr+ impact, action-oriented, board-ready. Walk away with a shareable portfolio URL, your full reasoning trail, and a resume rewrite showing how to talk about strategic problem-solving in any interview.',
      outcome: 'You walk away with a live URL to drop into every application',
    },
  ];

  return (
    <div style={{ padding: '0 24px 96px', maxWidth: 980, margin: '0 auto' }}>

      {/* Arjun intro */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'flex', alignItems: 'flex-start', gap: 18, marginBottom: 56,
          padding: '20px 24px', borderRadius: 16,
          background: 'rgba(79,128,255,0.05)', border: '1px solid rgba(79,128,255,0.16)',
        }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 13, flexShrink: 0,
          background: 'rgba(79,128,255,0.14)', border: '1px solid rgba(79,128,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--mono)', fontSize: 15, fontWeight: 800, color: BLUE,
          boxShadow: '0 0 16px rgba(79,128,255,0.2)',
        }}>AJ</div>
        <div>
          <p style={{
            fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase', color: BLUE, marginBottom: 6,
          }}>Arjun · Your AI Thinking Partner</p>
          <p style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.6, maxWidth: 640 }}>
            A Staff-level strategist embedded in the simulation. He doesn't give you answers —
            he challenges your reasoning, catches logic gaps before your VP does,
            and pushes you toward the insight the data is actually signalling.
            Think of him as the senior colleague who makes you sharper.
          </p>
        </div>
      </motion.div>

      <div style={{ textAlign: 'center', marginBottom: 52 }}>
        <p style={{
          fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: 14,
        }}>Three phases. One Investigation.</p>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800,
          letterSpacing: '-0.03em', color: 'var(--ink)', lineHeight: 1.1, marginBottom: 14,
        }}>
          You're the one on call.{' '}
          <span style={{ color: ORANGE }}>The data is live.</span>
        </h2>
        <p style={{ fontSize: 15, color: 'var(--ink2)', maxWidth: 500, margin: '0 auto', lineHeight: 1.65 }}>
          No tutorials. No theory. A real business incident, live data, and 45 minutes
          to crack it — the way it happens inside Swiggy, Uber, and Razorpay.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {phases.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              style={{
                borderRadius: 20, padding: 28,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(12px)',
                display: 'flex', flexDirection: 'column', gap: 16,
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, ${p.color}, transparent)`,
              }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: 28, fontWeight: 800,
                  color: p.color, letterSpacing: '-0.04em', lineHeight: 1,
                }}>{p.num}</span>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${p.color}14`, border: `1px solid ${p.color}28`,
                }}>
                  <Icon size={17} color={p.color} />
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 5, lineHeight: 1.25 }}>{p.title}</h3>
                <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: p.color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{p.subtitle}</p>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--ink2)', flex: 1 }}>{p.body}</p>
              <div style={{
                padding: '10px 14px', borderRadius: 10,
                background: `${p.color}0A`, border: `1px solid ${p.color}1A`,
              }}>
                <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: p.color, letterSpacing: '0.04em' }}>
                  → {p.outcome}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: 56 }}>
        <motion.button
          onClick={onStartSimulator}
          whileHover={{ scale: 1.03, y: -3 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '16px 42px', borderRadius: 14,
            background: ORANGE, color: '#fff',
            fontWeight: 800, fontSize: 16, letterSpacing: '-0.01em',
            border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)',
            boxShadow: '0 0 0 1px rgba(252,128,25,0.5), 0 8px 32px rgba(252,128,25,0.38), 0 0 60px rgba(252,128,25,0.15)',
          }}
        >
          Begin the Investigation <ArrowRight size={18} />
        </motion.button>
        <p style={{ marginTop: 14, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)' }}>
          Free · No account · Portfolio link at end · ~45 minutes
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root export
// ─────────────────────────────────────────────────────────────────────────────
export default function StrategyHero({ onStartSimulator }) {
  const { persona, idx: personaIdx } = usePersonaCycle(2800);

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div style={{ background: 'var(--bg)', fontFamily: 'var(--sans)', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ══ HERO ══ */}
      <section style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(80px,12vw,140px) 24px clamp(60px,8vw,100px)',
        overflow: 'hidden',
      }}>
        <GrainOverlay />

        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />

        <motion.div style={{
          position: 'absolute', top: -200, left: -200, width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(252,128,25,0.20) 0%, transparent 68%)',
          filter: 'blur(100px)', pointerEvents: 'none',
        }} animate={{ scale: [1, 1.09, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />

        <motion.div style={{
          position: 'absolute', bottom: -200, right: -200, width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(30,79,204,0.26) 0%, transparent 68%)',
          filter: 'blur(100px)', pointerEvents: 'none',
        }} animate={{ scale: [1, 1.11, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }} />

        <motion.div style={{
          position: 'absolute', top: '38%', left: '52%', width: 340, height: 340, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,128,255,0.11) 0%, transparent 70%)',
          filter: 'blur(70px)', pointerEvents: 'none',
        }} animate={{ x: [0, 28, 0], y: [0, -18, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} />

        <motion.div
          variants={stagger} initial="hidden" animate="show"
          style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 920 }}
        >
          {/* ── ENLARGED PILL ── */}
          <motion.div variants={fadeUp} style={{ marginBottom: 40 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 14,
              padding: '12px 28px', borderRadius: 999,
              background: 'rgba(79,128,255,0.09)',
              border: '1px solid rgba(79,128,255,0.26)',
              boxShadow: '0 0 32px rgba(79,128,255,0.08)',
            }}>
              <span style={{
                width: 9, height: 9, borderRadius: '50%', background: BLUE, flexShrink: 0,
                display: 'inline-block', boxShadow: `0 0 10px ${BLUE}`,
                animation: 'hero-pulse 2s ease-in-out infinite',
              }} />
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 600,
                letterSpacing: '0.08em', color: 'rgba(255,255,255,0.45)',
              }}>For</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={personaIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 800,
                    letterSpacing: '0.05em', textTransform: 'uppercase', color: ORANGE,
                  }}
                >
                  {persona.pill}
                </motion.span>
              </AnimatePresence>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 600,
                letterSpacing: '0.08em', color: 'rgba(255,255,255,0.45)',
              }}>who make decisions with data</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp} style={{
            fontSize: 'clamp(2.5rem, 7.5vw, 5.4rem)',
            fontWeight: 800, lineHeight: 1.03, letterSpacing: '-0.04em',
            color: 'var(--ink)', marginBottom: 28,
          }}>
            The AI will pull the data.
            <br />
            <span style={{
              background: `linear-gradient(135deg, ${ORANGE} 0%, #FF9E50 40%, ${BLUE} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Can you make the decision?
            </span>
          </motion.h1>

          {/* Sub-copy — zero role-specific language */}
          <motion.p variants={fadeUp} style={{
            fontSize: 'clamp(15px, 2vw, 18px)', lineHeight: 1.72,
            color: 'var(--ink2)', maxWidth: 640, margin: '0 auto 44px',
          }}>
            In 2026, syntax is free.{' '}
            <strong style={{ color: 'var(--ink)' }}>Structured thinking is the moat.</strong>{' '}
            Work through a live business incident alongside an AI mentor — frame the problem,
            find the root cause, size the impact — and leave with a{' '}
            <strong style={{ color: 'var(--ink)' }}>portfolio piece that gets you noticed.</strong>
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp}
            style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            <motion.button
              onClick={onStartSimulator}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '16px 36px', borderRadius: 12,
                background: ORANGE, color: '#fff',
                fontWeight: 800, fontSize: 16, letterSpacing: '-0.01em',
                border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)',
                boxShadow: `0 0 0 1px rgba(252,128,25,0.5), 0 8px 32px rgba(252,128,25,0.38), 0 0 60px rgba(252,128,25,0.18)`,
              }}
            >
              <Zap size={17} /> Start the Investigation <ArrowRight size={17} />
            </motion.button>
            <motion.a href="/case-studies"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '16px 26px', borderRadius: 12,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)',
                color: 'var(--ink2)', fontWeight: 500, fontSize: 15,
                textDecoration: 'none', backdropFilter: 'blur(12px)', fontFamily: 'var(--sans)',
              }}
            >Browse All Cases</motion.a>
          </motion.div>

          <motion.p variants={fadeUp} style={{
            marginTop: 20, fontFamily: 'var(--mono)', fontSize: 10,
            color: 'var(--ink3)', letterSpacing: '0.05em',
          }}>
            Free · No account · Portfolio link at end · ~45 minutes
          </motion.p>

          {/* Metric strip */}
          <motion.div variants={fadeUp} style={{
            marginTop: 64, display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
            border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden',
            background: 'rgba(255,255,255,0.02)',
          }}>
            {[
              { val: '3',     label: 'Structured Phases',        color: ORANGE },
              { val: '₹2Cr+', label: 'Business Impact Modelled',  color: BLUE  },
              { val: '1',     label: 'Portfolio Piece You Keep',  color: GREEN  },
            ].map((m, i) => (
              <div key={i} style={{
                padding: '22px 44px',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                textAlign: 'center', flex: 1, minWidth: 140,
              }}>
                <div style={{
                  fontFamily: 'var(--mono)', fontSize: 30, fontWeight: 800,
                  color: m.color, letterSpacing: '-0.03em', lineHeight: 1,
                }}>{m.val}</div>
                <div style={{
                  fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)',
                  textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 7,
                }}>{m.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}
          style={{
            position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 1,
          }}
        >
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)',
            textTransform: 'uppercase', letterSpacing: '0.1em',
          }}>Scroll to see the experience gap</span>
          <motion.div
            animate={{ y: [0, 7, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 1, height: 28, background: 'linear-gradient(to bottom, var(--ink3), transparent)' }}
          />
        </motion.div>
      </section>

      {/* ══ RESUME CARDS — role-reactive ══ */}
      <ResumeCards persona={persona} personaIdx={personaIdx} />

      {/* ══ PHASE CARDS + CTA ══ */}
      <PhaseCards onStartSimulator={onStartSimulator} />

      <style>{`
        @keyframes hero-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(0.6); }
        }
        @media (max-width: 640px) {
          section { padding-left: 16px !important; padding-right: 16px !important; }
        }
      `}</style>
    </div>
  );
}