// src/components/strategy/components/PhaseOneIntro.jsx
//
// Audit-driven rebuild:
// — Priya's message REMOVED from diagnostic. She appears AFTER the gap reveal,
//   introducing the live incident. Now she lands with weight because the user
//   understands the stakes.
// — Arjun leads immediately — no Slack preamble before the question.
// — Character count (40+) replaces word count — harder to game.
// — Skip link appears below Arjun's question, not in a header.
// — Typing delay reduced to 900ms — motivation is high, don't waste it.

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowRight } from 'lucide-react';

const ORANGE = '#FC8019';
const BLUE   = '#4F80FF';
const GREEN  = '#3DD68C';
const RED    = '#F38BA8';
const PURPLE = '#A78BFA';

// ── 4 thinking buckets ────────────────────────────────────────────────────────
const BUCKETS = [
  {
    key: 'demand',
    label: 'User intent',
    sublabel: 'Did they actually want to order?',
    color: ORANGE,
    missedBy: '71%',
    keywords: ['intent', 'hungry', 'brows', 'price', 'cost', 'budget', 'distract', 'habit', 'casual', 'want', 'demand', 'need', 'mood', 'decision', 'purpose', 'reason', 'motive'],
    note: 'Most drop-offs are intent gaps — people browse without a real decision to buy. The most common cause and the first thing to check.',
  },
  {
    key: 'supply',
    label: 'Restaurant availability',
    sublabel: 'Were the right options there?',
    color: BLUE,
    missedBy: '58%',
    keywords: ['restaurant', 'closed', 'delivery', 'far', 'time', 'eta', 'availab', 'supply', 'kitchen', 'option', 'menu', 'choice', 'open', 'distance', 'food', 'offer'],
    note: 'If the right restaurants weren\'t open, nearby, or fast enough — the user had no good choice. Second most common cause.',
  },
  {
    key: 'platform',
    label: 'App or platform friction',
    sublabel: 'Did the app slow them down?',
    color: PURPLE,
    missedBy: '44%',
    keywords: ['app', 'slow', 'load', 'crash', 'ux', 'search', 'payment', 'error', 'friction', 'bug', 'platform', 'ui', 'experience', 'speed', 'glitch', 'issue', 'technical'],
    note: 'Fastest to rule out — check error logs and funnel step by step. Usually not the culprit but must be cleared first.',
  },
  {
    key: 'external',
    label: 'External factors',
    sublabel: 'Something outside the app entirely?',
    color: GREEN,
    missedBy: '83%',
    keywords: ['compet', 'zomato', 'promo', 'discount', 'weather', 'time', 'hour', 'extern', 'market', 'event', 'blinkit', 'outside', 'other'],
    note: 'Competitor promos, time of day, weather. Rule this out last — takes longest to confirm.',
  },
];

function analyse(text) {
  const t = text.toLowerCase();
  const coverage = {};
  BUCKETS.forEach(b => {
    coverage[b.key] = b.keywords.some(kw => t.includes(kw));
  });
  return { coverage, score: Object.values(coverage).filter(Boolean).length };
}

// ── Arjun chat row ────────────────────────────────────────────────────────────
function ArjunRow({ time = '9:04 AM', children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'flex', gap: 12, marginBottom: 20 }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0, marginTop: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${BLUE}18`, border: `1px solid ${BLUE}35`,
        fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 800, color: BLUE,
      }}>AJ</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Arjun</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: BLUE }}>Your thinking partner</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', marginLeft: 'auto' }}>{time}</span>
        </div>
        <div>{children}</div>
      </div>
    </motion.div>
  );
}

// ── Priya row — appears AFTER gap reveal ──────────────────────────────────────
function PriyaRow({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'flex', gap: 12, marginBottom: 20 }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0, marginTop: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${RED}18`, border: `1px solid ${RED}35`,
        fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 800, color: RED,
      }}>PR</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Priya</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: RED }}>Head of Growth</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', marginLeft: 'auto' }}>9:04 AM</span>
        </div>
        <div>{children}</div>
      </div>
    </motion.div>
  );
}

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingDots({ color = BLUE }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      style={{ display: 'flex', gap: 12, marginBottom: 16 }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${color}18`, border: `1px solid ${color}35`,
        fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 800, color,
      }}>AJ</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, paddingTop: 10 }}>
        {[0, 1, 2].map(i => (
          <motion.div key={i}
            style={{ width: 7, height: 7, borderRadius: '50%', background: color }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.11 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ── Gap reveal ────────────────────────────────────────────────────────────────
function GapReveal({ result, onComplete }) {
  const missedBuckets = BUCKETS.filter(b => !result.coverage[b.key]);

  // Missed items first — that's the whole point
  const sorted = [...BUCKETS].sort((a, b) =>
    (result.coverage[a.key] ? 1 : 0) - (result.coverage[b.key] ? 1 : 0)
  );

  const verdict =
    result.score === 4 ? { headline: 'All 4 areas covered.', sub: 'Strong structured thinking. The case study will now test your sequencing — which area to check first, and why that saves hours.', color: GREEN }
    : result.score === 3 ? { headline: `3 of 4 covered. One blind spot.`, sub: `You missed the ${missedBuckets[0]?.label} angle. ${missedBuckets[0]?.missedBy} of people miss this one.`, color: ORANGE }
    : result.score === 2 ? { headline: `2 of 4 covered.`, sub: `You missed ${missedBuckets.map(b => b.label).join(' and ')}. Most analysts have at least one of these gaps.`, color: ORANGE }
    : { headline: `1 area covered.`, sub: `This is where most people start. The case study builds the habit of thinking across all 4 — step by step.`, color: RED };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Verdict — largest, most prominent element */}
      <div style={{
        padding: '16px 18px', borderRadius: 12, marginBottom: 14,
        background: `${verdict.color}0C`,
        border: `1px solid ${verdict.color}28`,
        borderLeft: `3px solid ${verdict.color}`,
      }}>
        <p style={{ fontSize: 16, fontWeight: 800, color: verdict.color, marginBottom: 4, letterSpacing: '-0.01em' }}>
          {verdict.headline}
        </p>
        <p style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.6, margin: 0 }}>
          {verdict.sub}
        </p>
      </div>

      {/* Bucket list — missed first, vertical stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        {sorted.map(b => {
          const isCovered = result.coverage[b.key];
          return (
            <div key={b.key} style={{
              borderRadius: 10, overflow: 'hidden',
              border: `1px solid ${isCovered ? `${b.color}18` : `${b.color}32`}`,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                background: isCovered ? `${b.color}06` : `${b.color}10`,
              }}>
                <span style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                  background: isCovered ? `${b.color}18` : `${b.color}22`,
                  color: b.color,
                }}>
                  {isCovered ? '✓' : '○'}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: isCovered ? 'var(--ink2)' : 'var(--ink)' }}>
                    {b.label}
                  </span>
                  {/* Social proof — normalises the miss */}
                  {!isCovered && (
                    <span style={{
                      marginLeft: 8, fontFamily: 'var(--mono)', fontSize: 9,
                      color: b.color, letterSpacing: '0.05em',
                    }}>
                      {b.missedBy} miss this
                    </span>
                  )}
                </div>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
                  color: b.color, textTransform: 'uppercase', letterSpacing: '0.08em',
                  opacity: isCovered ? 0.5 : 1,
                }}>
                  {isCovered ? 'covered' : 'missed'}
                </span>
              </div>
              {!isCovered && (
                <div style={{
                  padding: '10px 14px',
                  background: 'rgba(0,0,0,0.22)',
                  borderTop: `1px solid ${b.color}18`,
                }}>
                  <p style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
                    {b.note}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Priya's message — appears HERE, after gap reveal */}
      {/* Now it lands with weight because user understands the stakes */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.35 }}
        style={{ marginBottom: 16 }}
      >
        <p style={{
          fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--ink3)', marginBottom: 10,
        }}>
          The live incident you're about to investigate:
        </p>
        <div style={{
          borderRadius: 12, overflow: 'hidden',
          border: '1px solid rgba(243,139,168,0.2)',
          background: 'rgba(243,139,168,0.04)',
        }}>
          {/* Slack header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
            background: 'rgba(0,0,0,0.2)',
            borderBottom: '1px solid rgba(243,139,168,0.12)',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: RED,
              animation: 'intro-pulse 1.5s ease-in-out infinite', flexShrink: 0,
            }} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', letterSpacing: '0.08em' }}>
              #analytics-war-room · 9:04 AM
            </span>
          </div>
          <div style={{ padding: '14px 14px', display: 'flex', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `${RED}18`, border: `1px solid ${RED}30`,
              fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: RED,
            }}>PR</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Priya</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: RED }}>Head of Growth</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.7, margin: 0 }}>
                Hey — orders in North Bangalore are down{' '}
                <strong style={{ color: RED }}>8.3% week-over-week</strong>.
                Started Tuesday. GMV impact already{' '}
                <strong style={{ color: RED }}>₹19L</strong>.
                Need a full breakdown by EOD.{' '}
                <span style={{ color: ORANGE }}>@you</span> can you take point on this?
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.button
        onClick={onComplete}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '12px 24px', borderRadius: 10,
          background: ORANGE, color: '#fff',
          fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 800,
          border: 'none', cursor: 'pointer', letterSpacing: '-0.01em',
          boxShadow: '0 0 0 1px rgba(252,128,25,0.45), 0 4px 20px rgba(252,128,25,0.28)',
        }}
      >
        See what the data shows <ArrowRight size={15} aria-hidden="true" />
      </motion.button>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PhaseOneIntro({ onComplete }) {
  // Explicit stage machine — no races
  // arjun_typing → arjun_question → user_typing → evaluating → revealed → done
  const [stage, setStage] = useState('arjun_typing');
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const textareaRef = useRef(null);
  const bottomRef = useRef(null);
  const completedRef = useRef(false);

  // Character count — harder to game than word count
  const charCount = answer.trim().length;
  const canSubmit = charCount >= 40;

  // Stage progression
  useEffect(() => {
    let t;
    if (stage === 'arjun_typing') t = setTimeout(() => setStage('arjun_question'), 900);
    if (stage === 'arjun_question') t = setTimeout(() => setStage('user_typing'), 500);
    return () => clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    if (stage === 'user_typing') setTimeout(() => textareaRef.current?.focus(), 200);
  }, [stage]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [stage]);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setStage('evaluating');
    await new Promise(r => setTimeout(r, 1500));
    setResult(analyse(answer));
    setStage('revealed');
  }, [answer, canSubmit]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && canSubmit) {
      e.preventDefault();
      handleSubmit();
    }
  }, [canSubmit, handleSubmit]);

  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setStage('done');
    onComplete();
  }, [onComplete]);

  if (stage === 'done') return null;

  return (
    <motion.div
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      style={{
        borderRadius: 18, marginBottom: 24,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.10)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        overflow: 'hidden',
      }}
    >
      {/* Chat content */}
      <div style={{ padding: '20px 20px 16px' }}>

        {/* Arjun typing */}
        <AnimatePresence>
          {stage === 'arjun_typing' && <TypingDots key="typing" />}
        </AnimatePresence>

        {/* Arjun's question — visible from arjun_question onwards */}
        <AnimatePresence>
          {['arjun_question', 'user_typing', 'evaluating', 'revealed'].includes(stage) && (
            <ArjunRow key="arjun_q" time="9:04 AM">
              <p style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.7, marginBottom: 10 }}>
                Before we look at the incident — one question first.
              </p>
              <div style={{
                padding: '14px 16px', borderRadius: 10,
                background: 'rgba(79,128,255,0.08)',
                border: '1px solid rgba(79,128,255,0.2)',
                marginBottom: 10,
              }}>
                <p style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 1.72, fontStyle: 'italic', margin: 0, fontWeight: 500 }}>
                  "A user opens Swiggy, browses for 5 minutes, and leaves without ordering.
                  Walk me through how you'd think about why."
                </p>
              </div>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', lineHeight: 1.55 }}>
                Think out loud. I'm scoring structure, not whether you're right. Takes about 2 minutes.
              </p>
              {/* Skip — below the question, not in a header */}
              {stage === 'user_typing' && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  onClick={handleComplete}
                  style={{
                    display: 'inline-block', marginTop: 10,
                    fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    textDecoration: 'underline', textUnderlineOffset: 3,
                    transition: 'color 0.2s', padding: 0,
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--ink2)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--ink3)'}
                >
                  Already know this? Skip to the investigation →
                </motion.button>
              )}
            </ArjunRow>
          )}
        </AnimatePresence>

        {/* User's answer bubble */}
        <AnimatePresence>
          {['evaluating', 'revealed'].includes(stage) && answer && (
            <motion.div
              key="user_answer"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}
            >
              <div style={{
                maxWidth: '78%', padding: '12px 16px', borderRadius: 12,
                background: 'rgba(252,128,25,0.14)',
                border: '1px solid rgba(252,128,25,0.28)',
                borderBottomRightRadius: 3,
              }}>
                <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.65, margin: 0 }}>
                  {answer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Arjun evaluating */}
        <AnimatePresence>
          {stage === 'evaluating' && <TypingDots key="evaluating" />}
        </AnimatePresence>

        {/* Gap reveal + Priya's message */}
        <AnimatePresence>
          {stage === 'revealed' && result && (
            <ArjunRow key="arjun_reveal" time="9:05 AM">
              <GapReveal result={result} onComplete={handleComplete} />
            </ArjunRow>
          )}
        </AnimatePresence>

        {/* Input */}
        <AnimatePresence>
          {stage === 'user_typing' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28 }}
              style={{
                borderRadius: 12, overflow: 'hidden',
                border: `1px solid ${canSubmit ? 'rgba(252,128,25,0.4)' : 'rgba(255,255,255,0.1)'}`,
                transition: 'border-color 0.25s',
              }}
            >
              <textarea
                ref={textareaRef}
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Think out loud — e.g. the user might not have been hungry, or the restaurant they wanted was closed, or the app was slow..."
                rows={4}
                style={{
                  width: '100%', padding: '14px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: 'none', outline: 'none',
                  color: 'var(--ink)', fontFamily: 'var(--sans)', fontSize: 14,
                  lineHeight: 1.65, resize: 'none', boxSizing: 'border-box',
                }}
              />
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'rgba(0,0,0,0.2)',
                borderTop: '1px solid rgba(255,255,255,0.07)',
              }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: canSubmit ? GREEN : 'var(--ink3)' }}>
                  {canSubmit ? '✓ Ready to send' : 'Keep going...'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)' }}>
                    ⌘↵ to send
                  </span>
                  <motion.button
                    onClick={handleSubmit}
                    whileHover={canSubmit ? { scale: 1.08 } : {}}
                    whileTap={canSubmit ? { scale: 0.92 } : {}}
                    aria-label="Send answer"
                    style={{
                      width: 34, height: 34, borderRadius: 8,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: canSubmit ? ORANGE : 'rgba(255,255,255,0.06)',
                      border: 'none', cursor: canSubmit ? 'pointer' : 'default',
                      transition: 'all 0.2s',
                      boxShadow: canSubmit ? '0 2px 12px rgba(252,128,25,0.35)' : 'none',
                    }}
                  >
                    <Send size={14} color={canSubmit ? '#fff' : 'rgba(255,255,255,0.2)'} aria-hidden="true" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      <style>{`
        @keyframes intro-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.35; transform:scale(0.6); }
        }
      `}</style>
    </motion.div>
  );
}