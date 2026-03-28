// src/components/strategy/components/DomainOnboarding.jsx
// Phase 1, Step 0: Domain and KPI knowledge before the incident begins.
// Short, scannable, not a lecture. User reads and clicks through.
// Teaches: what GMV is, what conversion means, what the funnel looks like,
// who the players are — so they have context when the data hits them.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';

const ORANGE = '#FC8019';
const BLUE   = '#4F80FF';
const GREEN  = '#3DD68C';
const RED    = '#F38BA8';

// ── KPI definitions — plain English, no jargon ─────────────────────────────
const KPIS = [
  {
    term: 'GMV',
    full: 'Gross Merchandise Value',
    color: ORANGE,
    plain: 'The total value of all orders placed — before cancellations, refunds, or discounts. If 1,000 orders average ₹300 each, GMV = ₹3L. It\'s the headline number leaders watch daily.',
    why: 'In this investigation, GMV dropped 8.3% week-over-week. Your job is to find out why.',
  },
  {
    term: 'Conversion rate',
    full: 'Sessions → Orders',
    color: BLUE,
    plain: 'Of every 100 people who open the app, how many actually place an order? If 8 do, conversion = 8%. A drop here means something in the journey is breaking — and it could be anywhere from the home screen to payment.',
    why: 'You\'ll trace exactly where in the funnel users are dropping off.',
  },
  {
    term: 'Retention',
    full: 'Did they come back?',
    color: GREEN,
    plain: 'Of users who ordered in week 1, what % ordered again in week 2, 3, 4? A healthy food app retains 55-65% in week 1. If new users are churning at week 4, there\'s a habit-formation problem.',
    why: 'The data will show a week-4 cliff. You\'ll need to explain and quantify it.',
  },
  {
    term: 'CAC',
    full: 'Customer Acquisition Cost',
    color: '#A78BFA',
    plain: 'How much does it cost to get one new paying user? If marketing spends ₹10L and acquires 1,000 users, CAC = ₹1,000. If those users churn in week 4, every rupee spent acquiring them is partially wasted.',
    why: 'High CAC + low retention = a business burning money. This changes what you recommend.',
  },
];

// ── The order-to-delivery funnel ───────────────────────────────────────────
const FUNNEL_STEPS = [
  { label: 'App opens', pct: 100, color: 'rgba(255,255,255,0.15)' },
  { label: 'Browses restaurants', pct: 72, color: `${ORANGE}40` },
  { label: 'Views a menu', pct: 48, color: `${ORANGE}60` },
  { label: 'Adds to cart', pct: 28, color: `${ORANGE}80` },
  { label: 'Reaches checkout', pct: 18, color: ORANGE },
  { label: 'Places order', pct: 11, color: '#FC8019' },
];

// ── Who the players are ────────────────────────────────────────────────────
const PLAYERS = [
  { name: 'Priya', role: 'Head of Growth', color: RED, note: 'She pinged you. She needs answers by EOD.' },
  { name: 'Arjun', role: 'Your AI Mentor', color: BLUE, note: 'He will challenge every assumption. Don\'t skip steps.' },
  { name: 'You', role: 'The Analyst on Call', color: ORANGE, note: 'First one to touch this incident. No one to hand it off to.' },
];

// ── Tabs ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'kpis',   label: 'Key metrics'   },
  { id: 'funnel', label: 'The funnel'    },
  { id: 'people', label: 'Who\'s involved' },
];

export default function DomainOnboarding({ onComplete }) {
  const [activeTab, setActiveTab] = useState('kpis');
  const [expandedKpi, setExpandedKpi] = useState(null);
  const [acknowledged, setAcknowledged] = useState({ kpis: false, funnel: false, people: false });

  const markAcknowledged = (tab) => {
    setAcknowledged(prev => ({ ...prev, [tab]: true }));
  };

  const allAcknowledged = Object.values(acknowledged).every(Boolean);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 60px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <p style={{
          fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'var(--ink2)', marginBottom: 14,
        }}>Before the incident begins</p>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 800,
          letterSpacing: '-0.03em', color: 'var(--ink)', lineHeight: 1.1, marginBottom: 12,
        }}>
          Here is the world{' '}
          <span style={{ color: ORANGE }}>you are walking into.</span>
        </h2>
        <p style={{ fontSize: 15, color: 'var(--ink2)', maxWidth: 460, margin: '0 auto', lineHeight: 1.65 }}>
          Three things to know before the data hits you. Read each tab, then start the investigation.
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 24,
        borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 0,
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 18px',
              borderRadius: '8px 8px 0 0',
              border: 'none',
              borderBottom: activeTab === tab.id ? `2px solid ${ORANGE}` : '2px solid transparent',
              background: activeTab === tab.id ? 'rgba(252,128,25,0.08)' : 'transparent',
              color: activeTab === tab.id ? ORANGE : 'var(--ink3)',
              fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.2s',
            }}
          >
            {acknowledged[tab.id] && (
              <span style={{ color: GREEN, fontSize: 12 }}>✓</span>
            )}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">

        {/* ── KPIs ── */}
        {activeTab === 'kpis' && (
          <motion.div key="kpis"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>

            <p style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.65, marginBottom: 20 }}>
              Four numbers drive every food delivery business. You will see all of them in this investigation.
              Click each one to understand what it means before the data arrives.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {KPIS.map((kpi, i) => (
                <motion.div key={kpi.term}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <div
                    onClick={() => setExpandedKpi(expandedKpi === i ? null : i)}
                    style={{
                      borderRadius: expandedKpi === i ? '12px 12px 0 0' : 12,
                      padding: '14px 18px',
                      background: expandedKpi === i ? `${kpi.color}10` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${expandedKpi === i ? `${kpi.color}30` : 'rgba(255,255,255,0.08)'}`,
                      borderBottom: expandedKpi === i ? 'none' : undefined,
                      display: 'flex', alignItems: 'center', gap: 14,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{
                      fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 800,
                      color: kpi.color, minWidth: 90, flexShrink: 0,
                    }}>{kpi.term}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {kpi.full}
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedKpi === i ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight size={16} color="var(--ink3)" />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {expandedKpi === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{
                          padding: '16px 18px 18px',
                          background: `${kpi.color}08`,
                          border: `1px solid ${kpi.color}30`,
                          borderTop: 'none',
                          borderRadius: '0 0 12px 12px',
                        }}>
                          <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.68, marginBottom: 12 }}>
                            {kpi.plain}
                          </p>
                          <div style={{
                            padding: '8px 12px', borderRadius: 8,
                            background: `${kpi.color}12`, border: `1px solid ${kpi.color}22`,
                          }}>
                            <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: kpi.color, lineHeight: 1.55 }}>
                              → In this investigation: {kpi.why}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={() => { markAcknowledged('kpis'); setActiveTab('funnel'); }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{
                width: '100%', padding: '13px', borderRadius: 10,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--ink2)', fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              Got it — show me the funnel <ChevronRight size={16} />
            </motion.button>
          </motion.div>
        )}

        {/* ── Funnel ── */}
        {activeTab === 'funnel' && (
          <motion.div key="funnel"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>

            <p style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.65, marginBottom: 24 }}>
              Every order starts with an app open and ends with a payment.
              Most users drop off somewhere in between. Here is a typical Swiggy funnel — every number is a % of users who started.
            </p>

            {/* Visual funnel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
              {FUNNEL_STEPS.map((step, i) => (
                <motion.div key={step.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <div style={{
                    fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink3)',
                    width: 140, flexShrink: 0, textAlign: 'right',
                  }}>
                    {step.label}
                  </div>
                  <div style={{ flex: 1, height: 28, borderRadius: 6, background: 'rgba(255,255,255,0.04)', overflow: 'hidden', position: 'relative' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${step.pct}%` }}
                      transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      style={{ height: '100%', background: step.color, borderRadius: 6 }}
                    />
                  </div>
                  <div style={{
                    fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700,
                    color: i === FUNNEL_STEPS.length - 1 ? ORANGE : 'var(--ink3)',
                    width: 36, textAlign: 'right', flexShrink: 0,
                  }}>
                    {step.pct}%
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{
              padding: '14px 18px', borderRadius: 12, marginBottom: 24,
              background: 'rgba(252,128,25,0.06)', border: '1px solid rgba(252,128,25,0.2)',
            }}>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: ORANGE, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                What to look for
              </p>
              <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.65 }}>
                A normal funnel narrows gradually. A <strong>sudden drop between two steps</strong> is the signal —
                something specific is breaking at that point. In this investigation, one step drops far more than expected.
                Your job is to find it and explain why.
              </p>
            </div>

            <motion.button
              onClick={() => { markAcknowledged('funnel'); setActiveTab('people'); }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{
                width: '100%', padding: '13px', borderRadius: 10,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--ink2)', fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              Got it — show me who's involved <ChevronRight size={16} />
            </motion.button>
          </motion.div>
        )}

        {/* ── People ── */}
        {activeTab === 'people' && (
          <motion.div key="people"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>

            <p style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.65, marginBottom: 24 }}>
              Three people in this scenario. Understand each one before the Slack message arrives.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {PLAYERS.map((p, i) => (
                <motion.div key={p.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    borderRadius: 14, padding: '18px 20px',
                    background: `${p.color}08`, border: `1px solid ${p.color}22`,
                    display: 'flex', alignItems: 'flex-start', gap: 16,
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${p.color}18`, border: `1px solid ${p.color}35`,
                    fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 800, color: p.color,
                  }}>
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 2 }}>{p.name}</p>
                    <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: p.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                      {p.role}
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.6 }}>{p.note}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* The Slack message — scene setter */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              style={{
                borderRadius: 14, padding: '18px 20px', marginBottom: 28,
                background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(243,139,168,0.18)', border: '1px solid rgba(243,139,168,0.3)',
                  fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: RED,
                }}>PR</div>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: RED }}>Priya</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)' }}>9:04 AM · #analytics-war-room</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.7 }}>
                Hey — orders in North Bangalore are down 8.3% week-over-week. Started Tuesday.
                GMV impact is already ₹19L. Need a full breakdown by EOD.
                <span style={{ color: ORANGE }}> @you</span> can you take point on this?
              </p>
            </motion.div>

            <motion.button
              onClick={() => markAcknowledged('people')}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{
                width: '100%', padding: '13px', borderRadius: 10, marginBottom: 16,
                background: acknowledged.people ? 'rgba(61,214,140,0.08)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${acknowledged.people ? 'rgba(61,214,140,0.25)' : 'rgba(255,255,255,0.1)'}`,
                color: acknowledged.people ? GREEN : 'var(--ink2)',
                fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {acknowledged.people ? '✓ Ready' : 'I understand the context'}
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Final CTA — only shows when all tabs acknowledged */}
      <AnimatePresence>
        {allAcknowledged && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: 'center', marginTop: 16 }}
          >
            <div style={{
              padding: '20px 24px', borderRadius: 16, marginBottom: 20,
              background: 'rgba(252,128,25,0.05)', border: '1px solid rgba(252,128,25,0.18)',
            }}>
              <p style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 1.65, marginBottom: 0 }}>
                <strong style={{ color: ORANGE }}>You are ready.</strong> Priya is waiting.
                The data is live. You have everything you need to begin.
              </p>
            </div>
            <motion.button
              onClick={onComplete}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '15px 40px', borderRadius: 12,
                background: ORANGE, color: '#fff',
                fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 800,
                letterSpacing: '-0.01em', border: 'none', cursor: 'pointer',
                boxShadow: '0 0 0 1px rgba(252,128,25,0.5), 0 8px 32px rgba(252,128,25,0.38), 0 0 60px rgba(252,128,25,0.15)',
              }}
            >
              Begin the Investigation <ArrowRight size={17} aria-hidden="true" />
            </motion.button>
            <p style={{ marginTop: 12, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink2)' }}>
              Phase 1 · Ambiguity Triage
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}