// src/components/strategy/components/GapDiagnostic.jsx
// Visual rebuild: ambient depth matches the rest of the app,
// step progress indicator, question card is visually prominent,
// covered/missed have strong visual hierarchy, animations are fast.

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Circle } from 'lucide-react';

const ORANGE = '#FC8019';
const BLUE   = '#4F80FF';
const GREEN  = '#3DD68C';
const RED    = '#F38BA8';
const PURPLE = '#A78BFA';

const SIGNALS = [
  {
    key: 'demand',
    label: 'User intent',
    sublabel: 'Did they even want to order?',
    color: ORANGE,
    keywords: ['intent', 'hungry', 'brows', 'price', 'cost', 'budget', 'distract', 'habit', 'casual', 'want', 'demand', 'need', 'mood'],
    missed: 'Most drop-offs are intent gaps — the user was browsing with no real decision to buy. This is the most common cause and the first thing a structured analyst checks.',
  },
  {
    key: 'supply',
    label: 'What was available',
    sublabel: 'Were the right restaurants there?',
    color: BLUE,
    keywords: ['restaurant', 'closed', 'delivery', 'far', 'time', 'eta', 'availab', 'supply', 'kitchen', 'option', 'menu', 'choice'],
    missed: 'If the right restaurants weren\'t open, close enough, or fast enough — the user had no good choice. Supply mismatch is the second most common cause.',
  },
  {
    key: 'platform',
    label: 'App experience',
    sublabel: 'Did something in the app slow them down?',
    color: PURPLE,
    keywords: ['app', 'slow', 'load', 'crash', 'ux', 'search', 'payment', 'error', 'friction', 'bug', 'platform', 'ui', 'experience'],
    missed: 'Slow load, bad search results, payment friction — the fastest to rule out. Check error logs and the funnel by step. Usually not the culprit but must be eliminated first.',
  },
  {
    key: 'external',
    label: 'Outside factors',
    sublabel: 'Something outside the app entirely?',
    color: GREEN,
    keywords: ['compet', 'zomato', 'promo', 'discount', 'weather', 'time', 'hour', 'extern', 'market', 'event', 'blinkit'],
    missed: 'Competitor promotions, time of day, weather. Rule this out last — it takes the longest to confirm and is the least common cause.',
  },
];

function analyseAnswer(text) {
  const t = text.toLowerCase();
  const coverage = {};
  SIGNALS.forEach(s => { coverage[s.key] = s.keywords.some(kw => t.includes(kw)); });
  const score = Object.values(coverage).filter(Boolean).length;
  return { coverage, score };
}

// ── Step progress dots ────────────────────────────────────────────────────────
const STEPS = ['intro', 'question', 'result'];
function StepDots({ current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 44 }}>
      {STEPS.map((s, i) => {
        const done = STEPS.indexOf(current) > i;
        const active = s === current;
        return (
          <React.Fragment key={s}>
            <div style={{
              width: active ? 24 : 8, height: 8, borderRadius: 999,
              background: active ? ORANGE : done ? `${ORANGE}50` : 'rgba(255,255,255,0.12)',
              transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
            }} />
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)', maxWidth: 32 }} />
            )}
          </React.Fragment>
        );
      })}
      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', marginLeft: 4 }}>
        {STEPS.indexOf(current) + 1} / {STEPS.length}
      </span>
    </div>
  );
}

export default function GapDiagnostic({ onComplete }) {
  const [step, setStep] = useState('intro');
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const textareaRef = useRef(null);

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
  const canSubmit = wordCount >= 10;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setStep('analyzing');
    await new Promise(r => setTimeout(r, 1600));
    setResult(analyseAnswer(answer));
    setStep('result');
  }, [answer, canSubmit]);

  useEffect(() => {
    if (step === 'question') setTimeout(() => textareaRef.current?.focus(), 350);
  }, [step]);

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Ambient orbs — matches the rest of the app */}
      <div style={{
        position: 'fixed', top: -160, left: -160, width: 560, height: 560,
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(circle, rgba(252,128,25,0.12) 0%, transparent 70%)',
        filter: 'blur(90px)',
      }} />
      <div style={{
        position: 'fixed', bottom: -160, right: -160, width: 560, height: 560,
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(circle, rgba(79,128,255,0.14) 0%, transparent 70%)',
        filter: 'blur(90px)',
      }} />
      {/* Dot grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 660, padding: '52px 24px 64px' }}>
        <AnimatePresence mode="wait">

          {/* ══ INTRO ══ */}
          {step === 'intro' && (
            <motion.div key="intro"
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.38 }}>

              <StepDots current="intro" />

              {/* Eyebrow */}
              <p style={{
                fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'var(--ink2)', marginBottom: 16,
              }}>
                2 minutes · Before the case study
              </p>

              {/* Headline */}
              <h1 style={{
                fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)', fontWeight: 800,
                letterSpacing: '-0.035em', color: 'var(--ink)', lineHeight: 1.08, marginBottom: 20,
              }}>
                Let's see where your thinking{' '}
                <span style={{ color: ORANGE }}>starts right now.</span>
              </h1>

              <p style={{ fontSize: 16, color: 'var(--ink2)', lineHeight: 1.72, marginBottom: 40, maxWidth: 540 }}>
                When a business problem hits, most people jump straight to data.
                This takes 2 minutes and shows you{' '}
                <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>what a structured analyst covers
                that you might not</strong> — so the case study actually changes how you think.
              </p>

              {/* 3-step visual — stronger visual treatment */}
              <div style={{ marginBottom: 44 }}>
                {[
                  { num: '01', text: 'Answer one question — the way you would right now', color: ORANGE, bg: 'rgba(252,128,25,0.06)', border: 'rgba(252,128,25,0.18)' },
                  { num: '02', text: 'See exactly what a structured thinker covers that you missed', color: BLUE, bg: 'rgba(79,128,255,0.06)', border: 'rgba(79,128,255,0.18)' },
                  { num: '03', text: 'The case study builds this skill — step by step, on live data', color: GREEN, bg: 'rgba(61,214,140,0.06)', border: 'rgba(61,214,140,0.18)' },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: '16px 20px',
                      borderRadius: 14, marginBottom: 10,
                      background: s.bg,
                      border: `1px solid ${s.border}`,
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--mono)', fontSize: 15, fontWeight: 800,
                      color: s.color, flexShrink: 0, minWidth: 32,
                    }}>{s.num}</span>
                    <span style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 1.45, fontWeight: 500 }}>
                      {s.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                onClick={() => setStep('question')}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '15px 36px', borderRadius: 12,
                  background: ORANGE, color: '#fff',
                  fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 800,
                  letterSpacing: '-0.01em', border: 'none', cursor: 'pointer',
                  boxShadow: '0 0 0 1px rgba(252,128,25,0.5), 0 8px 28px rgba(252,128,25,0.32), 0 0 48px rgba(252,128,25,0.12)',
                }}
              >
                Show me the question <ArrowRight size={16} aria-hidden="true" />
              </motion.button>
              <p style={{ marginTop: 12, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink2)' }}>
                No right or wrong answer · Takes about 2 minutes
              </p>
            </motion.div>
          )}

          {/* ══ QUESTION ══ */}
          {step === 'question' && (
            <motion.div key="question"
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.38 }}>

              <StepDots current="question" />

              <p style={{
                fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'var(--ink2)', marginBottom: 20,
              }}>
                The question
              </p>

              {/* Question card — visually prominent, this is the hero element */}
              <div style={{
                borderRadius: 18, padding: '32px 32px 28px', marginBottom: 32,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Subtle top accent */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, ${ORANGE}, ${BLUE})`,
                }} />
                <p style={{
                  fontSize: 'clamp(17px, 2.5vw, 21px)',
                  color: 'var(--ink)', lineHeight: 1.68,
                  fontStyle: 'italic', marginBottom: 20, fontWeight: 500,
                }}>
                  "A user opens Swiggy, browses for 5 minutes, and leaves without ordering.
                  Walk me through how you'd think about why."
                </p>
                <div style={{
                  padding: '10px 14px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink3)', lineHeight: 1.55, margin: 0 }}>
                    Asked in PM and analyst interviews at Swiggy, Zomato, Flipkart, Razorpay.
                    Answer it the way you naturally would — don't overthink it.
                  </p>
                </div>
              </div>

              {/* Textarea — styled to look intentional, not like an empty box */}
              <div style={{
                borderRadius: 14, overflow: 'hidden',
                border: `1px solid ${canSubmit ? `rgba(252,128,25,0.4)` : 'rgba(255,255,255,0.1)'}`,
                transition: 'border-color 0.25s',
                marginBottom: 16,
              }}>
                <div style={{
                  padding: '10px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Your answer
                  </span>
                  {canSubmit && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 10, color: GREEN }}
                    >
                      ✓ Ready
                    </motion.span>
                  )}
                </div>
                <textarea
                  ref={textareaRef}
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder="Think out loud. What are the possible reasons? How would you approach figuring this out?"
                  rows={6}
                  style={{
                    width: '100%', padding: '16px 18px',
                    background: 'rgba(255,255,255,0.02)',
                    border: 'none', outline: 'none',
                    color: 'var(--ink)', fontFamily: 'var(--sans)', fontSize: 15,
                    lineHeight: 1.7, resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: canSubmit ? GREEN : 'var(--ink3)' }}>
                  {canSubmit ? '✓ Good — submit when ready' : `${wordCount} / 10 words`}
                </p>
                <motion.button
                  onClick={handleSubmit}
                  whileHover={canSubmit ? { scale: 1.03, y: -1 } : {}}
                  whileTap={canSubmit ? { scale: 0.97 } : {}}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '12px 26px', borderRadius: 10,
                    background: canSubmit ? ORANGE : 'rgba(255,255,255,0.05)',
                    color: canSubmit ? '#fff' : 'var(--ink3)',
                    fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 700,
                    border: `1px solid ${canSubmit ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                    cursor: canSubmit ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    boxShadow: canSubmit ? '0 4px 20px rgba(252,128,25,0.3)' : 'none',
                  }}
                >
                  See how you did <ArrowRight size={14} aria-hidden="true" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ══ ANALYZING ══ */}
          {step === 'analyzing' && (
            <motion.div key="analyzing"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ textAlign: 'center', paddingTop: '30vh' }}>
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: 56, height: 56, borderRadius: 16, margin: '0 auto 24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(79,128,255,0.12)', border: '1px solid rgba(79,128,255,0.3)',
                  fontFamily: 'var(--mono)', fontSize: 17, fontWeight: 800, color: BLUE,
                  boxShadow: '0 0 24px rgba(79,128,255,0.2)',
                }}>AJ</motion.div>
              <p style={{ fontSize: 16, color: 'var(--ink)', marginBottom: 6, fontWeight: 500 }}>
                Reading your answer...
              </p>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink3)', marginBottom: 32 }}>
                Scoring structure, not correctness
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                {[0, 1, 2].map(i => (
                  <motion.div key={i}
                    style={{ width: 8, height: 8, borderRadius: '50%', background: BLUE }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.65, repeat: Infinity, delay: i * 0.13 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ══ RESULT ══ */}
          {step === 'result' && result && (
            <motion.div key="result"
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}>

              <StepDots current="result" />

              {/* Score headline — large, immediate */}
              <div style={{ marginBottom: 32 }}>
                <p style={{
                  fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'var(--ink2)', marginBottom: 14,
                }}>Your thinking right now</p>
                <h2 style={{
                  fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', fontWeight: 800,
                  letterSpacing: '-0.035em', color: 'var(--ink)', lineHeight: 1.08, marginBottom: 16,
                }}>
                  {result.score === 4
                    ? <>All 4 areas covered. <span style={{ color: GREEN }}>Strong structured thinking.</span></>
                    : result.score === 3
                    ? <>3 of 4 covered. <span style={{ color: ORANGE }}>One blind spot.</span></>
                    : result.score === 2
                    ? <>2 of 4 covered. <span style={{ color: ORANGE }}>Two gaps most analysts have.</span></>
                    : <>1 area covered. <span style={{ color: RED }}>This is where most people start.</span></>
                  }
                </h2>
                <p style={{ fontSize: 15, color: 'var(--ink2)', lineHeight: 1.68, maxWidth: 540 }}>
                  {result.score === 4
                    ? 'You already think across the full problem space. The case study sharpens the next layer — knowing which area to check first, and why that sequencing matters under time pressure.'
                    : 'Not a knowledge gap — a framing one. Most people anchor on the first cause they think of. A structured analyst maps all possible causes before committing to any. The case study builds this reflex.'
                  }
                </p>
              </div>

              {/* Signal cards — strong visual contrast between covered and missed */}
              <div style={{ marginBottom: 28 }}>
                <p style={{
                  fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)',
                  textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14,
                }}>
                  The 4 areas a structured analyst always covers
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {/* Covered items first, then missed — puts missed at bottom for emphasis */}
                  {[...SIGNALS].sort((a, b) => {
                    const ac = result.coverage[a.key] ? 1 : 0;
                    const bc = result.coverage[b.key] ? 1 : 0;
                    return bc - ac; // covered first
                  }).map((s, i) => {
                    const covered = result.coverage[s.key];
                    return (
                      <motion.div key={s.key}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.32 }}
                        style={{
                          borderRadius: 14, overflow: 'hidden',
                          border: `1px solid ${covered ? `${s.color}25` : 'rgba(255,255,255,0.1)'}`,
                          // Missed items have more visual weight
                          boxShadow: !covered ? '0 2px 12px rgba(0,0,0,0.2)' : 'none',
                        }}>

                        {/* Header */}
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '14px 18px',
                          background: covered ? `${s.color}0A` : 'rgba(255,255,255,0.03)',
                        }}>
                          {/* Icon */}
                          {covered
                            ? <CheckCircle size={18} color={s.color} strokeWidth={2} style={{ flexShrink: 0 }} />
                            : <Circle size={18} color="rgba(255,255,255,0.2)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                          }
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                              fontSize: 14, fontWeight: 700,
                              color: covered ? 'var(--ink)' : 'var(--ink2)',
                              marginBottom: 2,
                            }}>{s.label}</p>
                            <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: covered ? s.color : 'var(--ink3)' }}>
                              {s.sublabel}
                            </p>
                          </div>
                          <span style={{
                            fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
                            color: covered ? s.color : 'var(--ink3)',
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                            padding: '3px 8px', borderRadius: 6,
                            background: covered ? `${s.color}15` : 'rgba(255,255,255,0.05)',
                            flexShrink: 0,
                          }}>
                            {covered ? 'Covered' : 'Missed'}
                          </span>
                        </div>

                        {/* Explanation — only for missed, visually distinct */}
                        {!covered && (
                          <div style={{
                            padding: '14px 18px',
                            background: 'rgba(0,0,0,0.2)',
                            borderTop: '1px solid rgba(255,255,255,0.07)',
                          }}>
                            <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.65, margin: 0 }}>
                              {s.missed}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Bridge card */}
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38 }}
                style={{
                  borderRadius: 16, padding: '22px 24px', marginBottom: 36,
                  background: 'rgba(252,128,25,0.05)',
                  border: '1px solid rgba(252,128,25,0.2)',
                  borderLeft: `3px solid ${ORANGE}`,
                }}>
                <p style={{
                  fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
                  color: ORANGE, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10,
                }}>
                  What happens next
                </p>
                <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.72, margin: 0 }}>
                  The investigation you're about to run is a live version of this exact scenario —
                  a real revenue drop, real data, and a missing data trap that catches most people off guard.
                  By the end you'll have practised thinking across all 4 areas under real pressure,
                  and a portfolio link that shows the full reasoning trail.
                </p>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.48 }}
                style={{ textAlign: 'center' }}>
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
                    boxShadow: '0 0 0 1px rgba(252,128,25,0.5), 0 8px 28px rgba(252,128,25,0.35), 0 0 48px rgba(252,128,25,0.12)',
                  }}
                >
                  Start the Investigation <ArrowRight size={17} aria-hidden="true" />
                </motion.button>
                <p style={{ marginTop: 12, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink2)' }}>
                  Next: business context — then Phase 1 begins
                </p>
              </motion.div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}