// src/components/strategy/components/PhaseOneIntro.jsx
//
// FAANG-level rebuild.
// Design decisions:
// — Chat column: max-width 660px centred. Question + input stay readable.
// — Reveal breaks to FULL container width (inherits 1040px from StrategyCase).
//   This signals "this moment is different" — same pattern as Linear's onboarding,
//   Notion's template gallery, Stripe's dashboard reveals.
// — User answer: small quoted callout above the grid. Not a competing panel.
// — Arjun's 4 points: 2×2 card grid. Each card = heading (1 line) + 2 sentences max.
//   No walls of text. The heading carries the message. Body is the evidence.
// — Cards stagger in at 80ms intervals — progressive reveal, not a data dump.
// — Closing line + Priya return to chat width — bookends the reveal moment.
// — Mobile: auto-fit minmax(280px,1fr) collapses to 1 col cleanly.
// — Stage machine unchanged: arjun_typing→arjun_question→user_typing→evaluating→revealed→done

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowRight, Quote } from 'lucide-react';

const ORANGE = '#FC8019';
const BLUE   = '#4F80FF';
const GREEN  = '#3DD68C';
const RED    = '#F38BA8';
const PURPLE = '#A78BFA';

// ── Arjun's hardcoded answer — fallback if API fails ─────────────────────────
// Heading: 1 punchy line. Body: 2 sentences max. Written as Arjun thinking.
const ARJUN_STANDARD = {
  opening: "Good attempt. Here's how I'd actually walk through this.",
  cards: [
    {
      color: ORANGE,
      num: '01',
      heading: 'Did they actually want to order?',
      body: "Five minutes of browsing usually means the decision wasn't made before they opened the app. I'd check what % of sessions this long convert — if it's under 15%, this is a browsing session, not a failed purchase.",
    },
    {
      color: BLUE,
      num: '02',
      heading: 'Was there anything worth ordering?',
      body: "Closed restaurants, 50-min ETAs, no cuisine match — supply failure looks identical to intent failure on the surface. I'd check search-to-menu conversion and restaurant availability at the time of the session.",
    },
    {
      color: PURPLE,
      num: '03',
      heading: 'Did the app get in the way?',
      body: "Slow loads, payment errors, bad search results — these spike suddenly, not gradually. Check the error logs first. Fastest thing to rule out, and if it's not that, you move on in under an hour.",
    },
    {
      color: GREEN,
      num: '04',
      heading: 'Was something else going on entirely?',
      body: "A Zomato promo, a late-night session, a Tuesday pay-cycle pattern. External factors take the longest to confirm — I'd look here last, but never skip it for a week-over-week move.",
    },
  ],
  closing: "By the end of this case study, this is exactly how you'll think through any drop — not because you memorised a list, but because you'll have worked through a real one.",
};

// ── Claude API — responds AS Arjun, calibrated to user's answer ──────────────
const SYSTEM_PROMPT = `You are Arjun — a sharp, warm product analytics mentor. You just read a candidate's answer. Respond directly as yourself — a senior colleague reacting naturally, not an evaluator.

Return ONLY valid JSON. No markdown, no backticks, no preamble.

{
  "opening": "1-2 sentences. Acknowledge something SPECIFIC from what they wrote. Warm but direct. Not generic praise. Not 'great answer'.",
  "cards": [
    {
      "color": "orange|blue|purple|green",
      "num": "01",
      "heading": "One punchy line — Arjun thinking out loud, not a category label",
      "body": "Exactly 2 sentences. Senior PM level. Specific metric, real hypothesis, clear sequencing rationale."
    }
  ],
  "closing": "1 sentence. Forward-looking. Connects to the case study. Sounds like a mentor, not a course."
}

Write exactly 4 cards in this order:
- 01: User intent (color: orange) — did they actually want to order?
- 02: Supply availability (color: blue) — were the right restaurants there?
- 03: Platform friction (color: purple) — did the app get in the way?
- 04: External factors (color: green) — something outside the app?

Rules:
- Never say: score, gap, covered, missed, area, triage, framework, assessment, correct, incorrect
- Heading must be a real thought, not a slide title
- Body is 2 sentences. No more.
- Opening references something specific from their answer`;

async function callClaudeAPI(userAnswer) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Question: "A user opens Swiggy, browses for 5 minutes, and leaves without ordering. Walk me through how you'd think about why."\n\nCandidate wrote: "${userAnswer}"\n\nRespond as Arjun. JSON only.`,
      }],
    }),
  });
  const data = await res.json();
  const raw = data.content?.map(b => b.text || '').join('');
  return JSON.parse(raw.replace(/```json|```/g, '').trim());
}

// ── Shared components ─────────────────────────────────────────────────────────
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
        {children}
      </div>
    </motion.div>
  );
}

function TypingDots() {
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
        background: `${BLUE}18`, border: `1px solid ${BLUE}35`,
        fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 800, color: BLUE,
      }}>AJ</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, paddingTop: 10 }}>
        {[0, 1, 2].map(i => (
          <motion.div key={i}
            style={{ width: 7, height: 7, borderRadius: '50%', background: BLUE }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.11 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ── The reveal — full width, 2×2 grid ─────────────────────────────────────────
function ArjunReveal({ arjunResponse, userAnswer, onComplete }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Opening — stays in chat voice / chat width */}
      <p style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.7, marginBottom: 20 }}>
        {arjunResponse.opening}
      </p>

      {/* ── User's answer — small quoted callout, not a competing panel ── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '11px 14px', borderRadius: 9, marginBottom: 24,
        background: 'rgba(252,128,25,0.06)',
        border: '1px solid rgba(252,128,25,0.16)',
        borderLeft: `2px solid ${ORANGE}`,
      }}>
        <Quote size={13} color={ORANGE} style={{ flexShrink: 0, marginTop: 2, opacity: 0.7 }} />
        <p style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
          {userAnswer}
        </p>
      </div>

      {/* ── FULL WIDTH BREAK — 2×2 card grid ── */}
      {/* Breaks out of the ArjunRow flex context using negative margin */}
      <div style={{
        margin: '0 -48px 24px',   // break out of ArjunRow's 48px left offset (36px avatar + 12px gap)
        padding: '0',
      }}>
        <p style={{
          fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--ink3)', marginBottom: 12, paddingLeft: 4,
        }}>
          How Arjun thinks through it
        </p>

        {/* 2×2 grid — collapses to 1 col on mobile */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 10,
        }}>
          {arjunResponse.cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{
                borderRadius: 12, padding: '18px 20px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderTop: `2px solid ${card.color}`,
                position: 'relative',
              }}
            >
              {/* Card number */}
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800,
                color: card.color, opacity: 0.5,
                position: 'absolute', top: 14, right: 16,
                letterSpacing: '0.06em',
              }}>{card.num}</span>

              {/* Heading — carries the message */}
              <p style={{
                fontSize: 14, fontWeight: 700,
                color: card.color,
                lineHeight: 1.35, marginBottom: 10,
                paddingRight: 24, // avoid overlap with number
              }}>
                {card.heading}
              </p>

              {/* Body — 2 sentences, ink2 for contrast without competing with heading */}
              <p style={{
                fontSize: 13, color: 'var(--ink2)',
                lineHeight: 1.65, margin: 0,
              }}>
                {card.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Closing line — back to chat voice */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.42 }}
        style={{
          fontSize: 13, color: 'var(--ink2)', lineHeight: 1.7,
          marginBottom: 20, fontStyle: 'italic',
          padding: '11px 14px', borderRadius: 9,
          background: `${BLUE}07`, border: `1px solid ${BLUE}16`,
        }}
      >
        {arjunResponse.closing}
      </motion.p>

      {/* ── Priya's message — lands with weight ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.35 }}
        style={{ marginBottom: 20 }}
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
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 14px',
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
          <div style={{ padding: '14px', display: 'flex', gap: 10 }}>
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
  // arjun_typing → arjun_question → user_typing → evaluating → revealed → done
  const [stage, setStage] = useState('arjun_typing');
  const [answer, setAnswer] = useState('');
  const [arjunResponse, setArjunResponse] = useState(null);
  const textareaRef = useRef(null);
  const bottomRef = useRef(null);
  const completedRef = useRef(false);

  const charCount = answer.trim().length;
  const canSubmit = charCount >= 40;

  // Stage transitions — unchanged from previous version
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
    try {
      const result = await callClaudeAPI(answer);
      setArjunResponse(result);
    } catch {
      // Silent fallback — user sees no error
      setArjunResponse(ARJUN_STANDARD);
    }
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
      {/* ── Chat column — constrained to readable width ── */}
      <div style={{ padding: '20px 20px 16px', maxWidth: 660, margin: '0 auto' }}>

        <AnimatePresence>
          {stage === 'arjun_typing' && <TypingDots key="typing" />}
        </AnimatePresence>

        {/* Arjun's question — visible from arjun_question through revealed */}
        <AnimatePresence>
          {['arjun_question', 'user_typing', 'evaluating', 'revealed'].includes(stage) && (
            <ArjunRow key="arjun_q" time="9:04 AM">
              <p style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.7, marginBottom: 10 }}>
                Before we look at the incident — one question first.
              </p>
              <div style={{
                padding: '14px 16px', borderRadius: 10,
                background: 'rgba(79,128,255,0.08)',
                border: '1px solid rgba(79,128,255,0.20)',
                marginBottom: 10,
              }}>
                <p style={{
                  fontSize: 15, color: 'var(--ink)', lineHeight: 1.72,
                  fontStyle: 'italic', margin: 0, fontWeight: 500,
                }}>
                  "A user opens Swiggy, browses for 5 minutes, and leaves without ordering.
                  Walk me through how you'd think about why."
                </p>
              </div>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', lineHeight: 1.55 }}>
                Think out loud. I'm not grading you — I want to see how you approach it.
              </p>
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

        <AnimatePresence>
          {stage === 'evaluating' && <TypingDots key="evaluating" />}
        </AnimatePresence>

        {/* Reveal — ArjunRow + full-width grid breakout */}
        <AnimatePresence>
          {stage === 'revealed' && arjunResponse && (
            <ArjunRow key="arjun_reveal" time="9:05 AM">
              <ArjunReveal
                arjunResponse={arjunResponse}
                userAnswer={answer}
                onComplete={handleComplete}
              />
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
                placeholder="Think out loud — maybe they weren't actually hungry, or the restaurant they wanted wasn't available, or the app was slow..."
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
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)' }}>⌘↵ to send</span>
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

      {/* ── Full-width reveal panel — outside the chat column constraint ── */}
      {/* Rendered outside the maxWidth:660 div so it can use full container width */}
      <style>{`
        @keyframes intro-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.35; transform:scale(0.6); }
        }
      `}</style>
    </motion.div>
  );
}