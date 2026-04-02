// src/components/strategy/components/ExpertDebrief.jsx
// CP5-B/C: Full-screen overlay shown after VP memo submission.
// Section 1 — Score summary
// Section 2 — Side-by-side memo comparison with structural labels
// Section 3 — "Got right" / "Sharpen" driven by rubric scores
// Section 4 — Portfolio + next step CTA

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, CheckCircle, TrendingUp, Zap, AlignLeft } from 'lucide-react';

const ORANGE = '#FC8019';
const BLUE   = '#4F80FF';
const GREEN  = '#3DD68C';
const RED    = '#F38BA8';
const PURPLE = '#A78BFA';
const YELLOW = '#F9E2AF';

// ── Score badge ───────────────────────────────────────────────────────────────
function OverallBadge({ pct }) {
  const color = pct >= 75 ? GREEN : pct >= 50 ? YELLOW : RED;
  const label = pct >= 75 ? 'Strong memo' : pct >= 50 ? 'Solid start' : 'Needs work';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 16,
      padding: '20px 28px', borderRadius: 16,
      background: `${color}10`, border: `1px solid ${color}30`,
      marginBottom: 20,
    }}>
      <div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 52, fontWeight: 900, color, lineHeight: 1 }}>{pct}</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 18, color, opacity: 0.7 }}>/100</span>
      </div>
      <div>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Overall score</p>
        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>{label}</p>
      </div>
    </div>
  );
}

// ── Dimension bar ─────────────────────────────────────────────────────────────
function DimBar({ label, score, icon: Icon, color }) {
  const pct      = Math.round(score * 100);
  const barColor = pct >= 75 ? GREEN : pct >= 50 ? YELLOW : RED;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
        <Icon size={12} color={color} />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color, flex: 1, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 800, color: barColor }}>{pct}%</span>
      </div>
      <div style={{ height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          style={{ height: '100%', borderRadius: 999, background: barColor }} />
      </div>
    </div>
  );
}

// ── Memo panel ────────────────────────────────────────────────────────────────
function MemoPanel({ label, color, children }) {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      borderRadius: 12, overflow: 'hidden',
      border: `1px solid ${color}30`,
      background: `${color}05`,
    }}>
      <div style={{ padding: '10px 14px', background: `${color}10`, borderBottom: `1px solid ${color}18` }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{label}</p>
      </div>
      <div style={{ padding: '14px' }}>{children}</div>
    </div>
  );
}

// ── Expert sentence with label ────────────────────────────────────────────────
function ExpertSentence({ text, label, color }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--ink)', margin: '0 0 5px' }}>{text}</p>
      <span style={{
        fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
        color, padding: '2px 8px', borderRadius: 5,
        background: `${color}15`, border: `1px solid ${color}25`,
      }}>
        {label}
      </span>
    </div>
  );
}

// ── Got right / Sharpen ───────────────────────────────────────────────────────
function FeedbackColumns({ scores, rubric }) {
  const gotRight = [];
  const sharpen  = [];

  if (scores.sizing >= 0.7)        gotRight.push(rubric.feedback.gotRight.sizing);
  else if (scores.sizing < 0.5)    sharpen.push(rubric.feedback.sharpen.sizing);

  if (scores.actionability >= 0.7) gotRight.push(rubric.feedback.gotRight.actionability);
  else if (scores.actionability < 0.5) sharpen.push(rubric.feedback.sharpen.actionability);

  if (scores.structure >= 0.7)     gotRight.push(rubric.feedback.gotRight.structure);
  else if (scores.structure < 0.5) sharpen.push(rubric.feedback.sharpen.structure);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <div style={{ padding: '14px', borderRadius: 12, background: `${GREEN}07`, border: `1px solid ${GREEN}20` }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>✓ What you got right</p>
        {gotRight.length > 0
          ? gotRight.map((t, i) => <p key={i} style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.6, margin: '0 0 6px' }}>· {t}</p>)
          : <p style={{ fontSize: 12, color: 'var(--ink3)', margin: 0 }}>Keep practising — structure improves with reps.</p>
        }
      </div>
      <div style={{ padding: '14px', borderRadius: 12, background: `${ORANGE}07`, border: `1px solid ${ORANGE}20` }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: ORANGE, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>→ What to sharpen</p>
        {sharpen.length > 0
          ? sharpen.map((t, i) => <p key={i} style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.6, margin: '0 0 6px' }}>· {t}</p>)
          : <p style={{ fontSize: 12, color: GREEN, margin: 0 }}>Nothing major — this memo would hold up in a VP review.</p>
        }
      </div>
    </div>
  );
}

// ── Main ExpertDebrief ────────────────────────────────────────────────────────
export default function ExpertDebrief({ scores, userMemo, caseConfig, portfolioId, onClose }) {
  const navigate   = useNavigate();
  const overallPct = scores ? Math.round(scores.overall * 100) : 0;
  const expertMemo = caseConfig?.arjunExpertMemo;
  const rubric     = caseConfig?.rubric;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(4,4,12,0.97)',
        overflowY: 'auto',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Close button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <button onClick={onClose} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 8,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--ink3)', fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
            cursor: 'pointer', letterSpacing: '0.06em',
          }}>
            <X size={11} /> Done — close debrief
          </button>
        </div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: ORANGE, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>
            Expert Debrief · Swiggy Case
          </p>
          <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--ink)', marginBottom: 20 }}>
            Here's what "good" looks like.
          </h2>
        </motion.div>

        {/* ── Section 1: Score summary ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
          style={{ marginBottom: 32 }}>
          <OverallBadge pct={overallPct} />
          {scores?.overallVerdict && (
            <p style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.7, marginBottom: 16 }}>{scores.overallVerdict}</p>
          )}
          <DimBar label="Sizing"         score={scores?.sizing || 0}        icon={TrendingUp} color={PURPLE} />
          <DimBar label="Actionability"  score={scores?.actionability || 0} icon={Zap}        color={ORANGE} />
          <DimBar label="Structure"      score={scores?.structure || 0}     icon={AlignLeft}  color={BLUE}   />
        </motion.div>

        {/* ── Section 2: Side-by-side comparison ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}
          style={{ marginBottom: 32 }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
            Memo comparison
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* User memo */}
            <MemoPanel label="Your memo" color={GREEN}>
              <p style={{ fontSize: 13, lineHeight: 1.75, color: 'var(--ink2)', margin: 0, fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
                "{userMemo}"
              </p>
            </MemoPanel>

            {/* Arjun expert memo */}
            <MemoPanel label="Arjun's memo" color={ORANGE}>
              {expertMemo?.sentences?.map((s, i) => (
                <ExpertSentence key={i} text={s.text} label={s.label} color={s.color} />
              ))}
            </MemoPanel>
          </div>
        </motion.div>

        {/* ── Section 3: Got right / Sharpen ── */}
        {rubric && scores && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}
            style={{ marginBottom: 32 }}>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
              Feedback
            </p>
            <FeedbackColumns scores={scores} rubric={rubric} />
          </motion.div>
        )}

        {/* ── Section 4: CTA ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }}
          style={{ padding: '20px 24px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <CheckCircle size={14} color={GREEN} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              This is now in your portfolio
            </span>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            {portfolioId && (
              <motion.button
                onClick={() => navigate(`/portfolio/${portfolioId}`)}
                whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 10, background: ORANGE, color: '#fff', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: `0 2px 14px ${ORANGE}40` }}>
                See your portfolio <ArrowRight size={13} />
              </motion.button>
            )}
            <button
              onClick={() => navigate('/case-studies')}
              style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink3)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: '4px 0' }}>
              Try the next case →
            </button>
            <button onClick={onClose}
              style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink3)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: '4px 0', marginLeft: 'auto' }}>
              Done — close debrief
            </button>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
