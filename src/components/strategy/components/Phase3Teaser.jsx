// src/components/strategy/components/Phase3Teaser.jsx
// Sprint 6 — Phase 3 preview screen
//
// Shows what Phase 3 contains, user's own findings, and captures waitlist intent.
// Zero payment UI, zero Razorpay, zero lock icons referencing paid tiers.

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, TrendingUp, FileText, Link } from 'lucide-react';
import { MILESTONES } from '../data/swiggyStrategyData.js';

const ORANGE = '#FC8019';
const BLUE   = '#4F80FF';
const GREEN  = '#3DD68C';
const RED    = '#F38BA8';
const PURPLE = '#A78BFA';

// ── Milestone label map — short labels for findings list ─────────────────────
const MILESTONE_SHORT = {
  0: 'Scope',
  1: 'KPI Read',
  2: 'Funnel',
  3: 'Root Cause',
  4: 'Impact',
  5: 'VP Memo',
};

// ── Document preview — simulated text lines ───────────────────────────────────
function DocPreview({ color }) {
  const lines = [
    { w: '75%' }, { w: '55%' }, { w: '90%' }, { w: '40%' }, { w: '70%' }, { w: '50%' },
  ];
  return (
    <div style={{
      width: '100%', height: 120, borderRadius: 8,
      background: 'rgba(8,8,16,0.9)',
      border: '1px solid rgba(255,255,255,0.08)',
      padding: '14px 12px',
      display: 'flex', flexDirection: 'column', gap: 9,
      boxSizing: 'border-box',
    }}>
      {/* Colour strip at top */}
      <div style={{ height: 3, width: 40, borderRadius: 2, background: color, marginBottom: 2 }} />
      {lines.map((l, i) => (
        <div key={i} style={{
          height: 8, borderRadius: 4,
          background: 'rgba(255,255,255,0.07)',
          width: l.w,
        }} />
      ))}
    </div>
  );
}

// ── Phase 3 deliverable cards ─────────────────────────────────────────────────
const DELIVERABLES = [
  {
    color:  ORANGE,
    Icon:   TrendingUp,
    title:  'Impact Sizing Model',
    body:   'You build the ₹2Cr recovery estimate with best/expected/conservative ranges, as if presenting to a VP. Includes a live sensitivity calculator: what if recovery rate is 40% vs 70%?',
  },
  {
    color:  BLUE,
    Icon:   FileText,
    title:  'The Exec Brief',
    body:   'A one-page memo structured Conclusion → Evidence → Impact → Action that any C-suite reader can act on in under 2 minutes. Arjun evaluates yours against the Staff Analyst rubric.',
  },
  {
    color:  PURPLE,
    Icon:   Link,
    title:  'Your Career Asset',
    body:   'A shareable /portfolio/:id link showing your complete investigation — every hypothesis, every data move, every conclusion. Recruiters see exactly how you think.',
  },
];

// ── Example portfolio previews ────────────────────────────────────────────────
const EXAMPLES = [
  { role: 'Product Analyst → Swiggy interview in 4 days', score: 87, color: ORANGE },
  { role: 'Senior BizOps → PhonePe offer accepted',        score: 92, color: BLUE   },
  { role: 'Growth Manager → Meesho final round',           score: 79, color: GREEN  },
];

// ── Intent capture form ───────────────────────────────────────────────────────
function IntentCapture({ onNotifyMe }) {
  const [method, setMethod]       = useState('whatsapp');
  const [value, setValue]         = useState('');
  const [error, setError]         = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused]     = useState(false);

  const validate = () => {
    if (method === 'whatsapp') {
      const digits = value.replace(/\D/g, '');
      if (digits.length < 10) { setError('Enter a valid 10-digit number.'); return false; }
    } else {
      if (!value.includes('@')) { setError('Enter a valid email address.'); return false; }
    }
    return true;
  };

  const handleSubmit = () => {
    setError('');
    if (!validate()) return;
    setSubmitted(true);
    onNotifyMe?.({ contact: value, method });
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 12, padding: '28px 20px', textAlign: 'center',
        }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: `${GREEN}15`, border: `1px solid ${GREEN}35`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Check size={22} color={GREEN} strokeWidth={2.5} />
        </div>
        <p style={{ fontSize: 16, fontWeight: 700, color: GREEN, margin: 0 }}>
          You're on the list.
        </p>
        <p style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.65, margin: 0, maxWidth: 340 }}>
          We'll {method === 'whatsapp' ? 'WhatsApp' : 'email'} you the day Phase 3 opens.
          Your investigation stays saved — you'll pick up exactly where you left off.
        </p>
      </motion.div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Method toggle */}
      <div style={{
        display: 'flex', gap: 2, padding: 3,
        borderRadius: 8, background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        marginBottom: 16, width: 'fit-content',
      }}>
        {['whatsapp', 'email'].map(m => (
          <button key={m} onClick={() => { setMethod(m); setValue(''); setError(''); }}
            style={{
              padding: '5px 16px', borderRadius: 6, border: 'none',
              fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              cursor: 'pointer', transition: 'all 0.15s',
              background: method === m ? ORANGE : 'transparent',
              color: method === m ? '#fff' : 'var(--ink3)',
              boxShadow: method === m ? `0 1px 8px ${ORANGE}35` : 'none',
            }}
          >
            {m === 'whatsapp' ? 'WhatsApp' : 'Email'}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div style={{
        display: 'flex', gap: 8, alignItems: 'center',
        borderRadius: 10, overflow: 'hidden',
        border: `1px solid ${focused ? ORANGE : error ? RED : 'rgba(255,255,255,0.1)'}`,
        background: 'rgba(255,255,255,0.04)',
        marginBottom: error ? 8 : 14,
        transition: 'border-color 0.18s',
        boxShadow: focused ? `0 0 0 1px ${ORANGE}25` : 'none',
      }}>
        {method === 'whatsapp' && (
          <span style={{
            padding: '12px 12px 12px 14px',
            fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--ink3)',
            borderRight: '1px solid rgba(255,255,255,0.08)', flexShrink: 0,
          }}>+91</span>
        )}
        <input
          type={method === 'whatsapp' ? 'tel' : 'email'}
          value={value}
          onChange={e => { setValue(e.target.value); setError(''); }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={method === 'whatsapp' ? '98765 43210' : 'you@email.com'}
          style={{
            flex: 1, padding: '12px 14px',
            background: 'none', border: 'none', outline: 'none',
            fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--ink)',
          }}
        />
      </div>

      {error && (
        <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: RED, marginBottom: 10, marginTop: 0 }}>
          {error}
        </p>
      )}

      <motion.button
        onClick={handleSubmit}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.97 }}
        style={{
          width: '100%', padding: '13px 20px', borderRadius: 10,
          background: ORANGE, color: '#fff',
          border: 'none', cursor: 'pointer',
          fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 700,
          boxShadow: `0 2px 16px ${ORANGE}40`,
          transition: 'box-shadow 0.2s',
        }}
      >
        Notify me — I want in
      </motion.button>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Phase3Teaser({
  investigationSummary = [],
  scenario = {},
  onBack,
  onNotifyMe,
}) {
  // Grab up to 3 conclusions from the investigation log
  const findings = investigationSummary
    .filter(e => e.conclusion)
    .slice(0, 3);

  const sectionVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      padding: '40px 24px 80px',
      overflowX: 'hidden',
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        {/* Back button */}
        <motion.button
          onClick={onBack}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.96 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 0', marginBottom: 32,
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink3)',
            transition: 'color 0.2s', letterSpacing: '0.04em',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--ink2)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--ink3)'}
        >
          <ArrowLeft size={13} /> Back to Phase 2
        </motion.button>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="show"
          style={{ display: 'flex', flexDirection: 'column', gap: 40 }}
        >

          {/* ── Section 1: You've earned this ── */}
          <motion.div variants={itemVariants}>
            <div style={{
              padding: '28px 28px 24px',
              borderRadius: 18, borderLeft: `3px solid ${GREEN}`,
              background: 'rgba(61,214,140,0.04)',
              border: `1px solid ${GREEN}22`,
              borderLeftWidth: 3,
            }}>
              <p style={{
                fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
                color: GREEN, textTransform: 'uppercase', letterSpacing: '0.12em',
                marginBottom: 12,
              }}>
                Phase 1 + 2 complete
              </p>
              <h1 style={{
                fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800,
                color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.2,
                marginBottom: 12,
              }}>
                You diagnosed the incident. Phase 3 is where you own the outcome.
              </h1>
              <p style={{
                fontSize: 14, color: 'var(--ink2)', lineHeight: 1.7, marginBottom: 24,
              }}>
                Most analysts stop at the finding. Senior analysts present a recovery plan
                that gets approved in the first review. That's Phase 3.
              </p>

              {/* User's findings */}
              {findings.length > 0 && (
                <div>
                  <p style={{
                    fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
                    color: 'var(--ink3)', textTransform: 'uppercase',
                    letterSpacing: '0.1em', marginBottom: 10,
                  }}>
                    Your findings
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {findings.map((entry, i) => (
                      <div key={i} style={{
                        display: 'flex', gap: 10, alignItems: 'flex-start',
                        padding: '8px 12px', borderRadius: 8,
                        background: `${GREEN}06`, border: `1px solid ${GREEN}15`,
                      }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                          background: `${GREEN}18`, border: `1px solid ${GREEN}35`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          marginTop: 1,
                        }}>
                          <Check size={10} color={GREEN} strokeWidth={3} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <span style={{
                            fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
                            color: GREEN, textTransform: 'uppercase',
                            letterSpacing: '0.06em', marginRight: 8,
                          }}>
                            {MILESTONE_SHORT[entry.index] ?? `M${entry.index + 1}`}
                          </span>
                          <span style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.55 }}>
                            {entry.conclusion}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Section 2: What happens in Phase 3 ── */}
          <motion.div variants={itemVariants}>
            <p style={{
              fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
              color: 'var(--ink3)', textTransform: 'uppercase',
              letterSpacing: '0.12em', marginBottom: 16,
            }}>
              What happens in Phase 3
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 14,
            }}>
              {DELIVERABLES.map(({ color, Icon, title, body }) => (
                <motion.div
                  key={title}
                  whileHover={{
                    y: -4,
                    boxShadow: `0 8px 32px ${color}25`,
                  }}
                  transition={{ type: 'spring', stiffness: 360, damping: 24 }}
                  style={{
                    padding: 22, borderRadius: 14,
                    border: `1px solid ${color}25`,
                    background: `${color}06`,
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, marginBottom: 14,
                    background: `${color}12`, border: `1px solid ${color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={17} color={color} />
                  </div>
                  <p style={{
                    fontSize: 15, fontWeight: 700, color: 'var(--ink)',
                    marginBottom: 8, lineHeight: 1.3,
                  }}>
                    {title}
                  </p>
                  <p style={{
                    fontSize: 13, color: 'var(--ink2)', lineHeight: 1.7, margin: 0,
                  }}>
                    {body}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Section 3: Example portfolio previews ── */}
          <motion.div variants={itemVariants}>
            <p style={{
              fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
              color: 'var(--ink3)', textTransform: 'uppercase',
              letterSpacing: '0.12em', marginBottom: 16,
            }}>
              What others built
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 14,
            }}>
              {EXAMPLES.map(({ role, score, color }, i) => (
                <div key={i} style={{
                  padding: '16px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  {/* Simulated doc preview */}
                  <DocPreview color={color} />

                  <div style={{ marginTop: 12 }}>
                    <p style={{
                      fontFamily: 'var(--mono)', fontSize: 8, fontWeight: 700,
                      color: 'var(--ink3)', textTransform: 'uppercase',
                      letterSpacing: '0.08em', marginBottom: 4,
                    }}>
                      Example
                    </p>
                    <p style={{
                      fontSize: 12, color: 'var(--ink2)', lineHeight: 1.5, marginBottom: 10,
                    }}>
                      {role}
                    </p>

                    {/* Score bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        flex: 1, height: 4, borderRadius: 2,
                        background: 'rgba(255,255,255,0.07)', overflow: 'hidden',
                      }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                          style={{ height: '100%', borderRadius: 2, background: color }}
                        />
                      </div>
                      <span style={{
                        fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
                        color, flexShrink: 0,
                      }}>
                        {score}/100
                      </span>
                    </div>
                    <p style={{
                      fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--ink3)',
                      marginTop: 4,
                    }}>
                      Exec Brief Score
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Section 4: Intent capture ── */}
          <motion.div variants={itemVariants}>
            <div style={{
              borderRadius: 18, overflow: 'hidden',
              border: `1px solid ${ORANGE}25`,
              background: `${ORANGE}04`,
            }}>
              {/* Header */}
              <div style={{
                padding: '16px 20px',
                borderBottom: `1px solid ${ORANGE}14`,
                background: `${ORANGE}06`,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: ORANGE, flexShrink: 0,
                  }}
                />
                <p style={{
                  fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
                  color: ORANGE, textTransform: 'uppercase', letterSpacing: '0.08em',
                  margin: 0,
                }}>
                  Get notified when Phase 3 opens — launching soon
                </p>
              </div>

              <IntentCapture onNotifyMe={onNotifyMe} />
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}