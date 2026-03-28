/**
 * DiagnosticHero.jsx
 * "Ego-Check" diagnostic interaction.
 * Step 1 — Terminal: "A user browses Swiggy for 5 minutes and leaves. Why?"
 * Step 2 — Logic Gap reveal: user answer vs. Staff-level Structured Logic Tree
 * Step 3 — "Enter the War Room" CTA
 *
 * Uses v1 useArjun hook (routes through /.netlify/functions/evaluate)
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useArjun } from './hooks/useArjun.js';

// ── Typewriter ────────────────────────────────────────────────────────────────
function useTypewriter(text, speed = 28, startDelay = 0) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!text) return;
    setDisplayed(''); setDone(false);
    let i = 0;
    const start = setTimeout(() => {
      const id = setInterval(() => {
        i++; setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(id); setDone(true); }
      }, speed);
      return () => clearInterval(id);
    }, startDelay);
    return () => clearTimeout(start);
  }, [text, speed, startDelay]);
  return { displayed, done };
}

function Cursor({ visible = true }) {
  return (
    <motion.span
      animate={{ opacity: visible ? [1, 0, 1] : 0 }}
      transition={{ duration: 1, repeat: Infinity }}
      style={{ display: 'inline-block', width: 8, height: 14, background: '#FC8019', marginLeft: 2, verticalAlign: 'middle' }}
    />
  );
}

// ── Logic Tree ────────────────────────────────────────────────────────────────
function LogicNode({ node, depth = 0, delay = 0 }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;

  const categoryColors = {
    demand:   { bg: 'rgba(252,128,25,0.08)',  border: 'rgba(252,128,25,0.25)',  text: '#FC8019' },
    supply:   { bg: 'rgba(30,79,204,0.08)',   border: 'rgba(30,79,204,0.3)',    text: '#4F80FF' },
    platform: { bg: 'rgba(139,92,246,0.08)',  border: 'rgba(139,92,246,0.25)', text: '#A78BFA' },
    external: { bg: 'rgba(245,166,35,0.08)',  border: 'rgba(245,166,35,0.25)', text: '#F5A623' },
    leaf:     { bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.5)' },
  };
  const c = categoryColors[node.type] || categoryColors.leaf;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginLeft: depth * 16 }}
    >
      <div
        className="rounded-lg px-3 py-2 mb-1.5 flex items-start gap-2 cursor-pointer select-none"
        style={{ background: c.bg, border: `1px solid ${c.border}` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren && (
          <motion.span
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ color: c.text, fontSize: 10, marginTop: 2, flexShrink: 0, fontFamily: 'monospace' }}
          >▶</motion.span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {node.category && (
              <span className="font-mono text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded"
                style={{ color: c.text, background: `${c.text}18` }}>
                {node.category}
              </span>
            )}
            <span className="text-[12px] font-medium" style={{ color: depth === 0 ? c.text : 'rgba(255,255,255,0.8)' }}>
              {node.label}
            </span>
            {node.prob && (
              <span className="font-mono text-[10px] ml-auto" style={{ color: c.text }}>{node.prob}</span>
            )}
          </div>
          {node.note && (
            <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{node.note}</p>
          )}
        </div>
      </div>
      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            {node.children.map((child, i) => (
              <LogicNode key={i} node={child} depth={depth + 1} delay={delay + i * 0.05} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const STAFF_LOGIC_TREE = [
  {
    type: 'demand', category: 'Demand-Side', label: 'User had no intent to order', prob: 'High P',
    note: 'Most common — casual browse without decision to buy',
    children: [
      { type: 'demand', label: 'Price anchoring — items above mental budget', prob: '↑ testable' },
      { type: 'demand', label: 'No cuisine match — restaurant set irrelevant', prob: '↑ testable' },
      { type: 'demand', label: 'Social browse — comparing with another app', prob: 'hard to measure' },
      { type: 'demand', label: 'Decision fatigue — too many options', note: 'Check scroll depth vs. add-to-cart gap' },
    ],
  },
  {
    type: 'supply', category: 'Supply-Side', label: 'Available restaurants failed the user', prob: 'Med P',
    note: 'Second to diagnose — restaurant quality + availability',
    children: [
      { type: 'supply', label: 'Preferred restaurants closed / too far', prob: '↑ fast check' },
      { type: 'supply', label: 'Delivery time too long (>40 min)', prob: '↑ check ETA logs' },
      { type: 'supply', label: 'Low ratings on visible restaurants', note: 'Compare listing avg_rating vs user cohort expected' },
      { type: 'supply', label: 'Kitchen latency spike — pre-close hours', prob: 'supply metric' },
    ],
  },
  {
    type: 'platform', category: 'Platform', label: 'App / UX friction caused drop-off', prob: 'Low-Med P',
    note: 'Easiest to rule out — check error logs + funnel',
    children: [
      { type: 'platform', label: 'Search returning stale/irrelevant results', prob: '↑ A/B testable' },
      { type: 'platform', label: 'Payment flow friction (3DS, timeout)', prob: '↑ log check' },
      { type: 'platform', label: 'App performance — slow load / crash', prob: '↑ Sentry / Crashlytics' },
      { type: 'platform', label: 'Notification fatigue — ignored entry prompt', note: 'CRM segment analysis' },
    ],
  },
  {
    type: 'external', category: 'External', label: 'Market-level factors pulled user away', prob: 'Low P',
    note: 'Only after ruling out demand/supply/platform',
    children: [
      { type: 'external', label: 'Competitor promo active (Zomato, Blinkit)', prob: 'compare session timing' },
      { type: 'external', label: 'Time of day — non-meal-time browse', note: 'Segment by hour-of-day' },
      { type: 'external', label: 'Weather / delivery risk signal', prob: 'correlate with weather API' },
    ],
  },
];

function analyzeUserAnswer(text) {
  const t = text.toLowerCase();
  return {
    demand:   t.includes('price') || t.includes('cost') || t.includes('intent') || t.includes('hungry') || t.includes('brows') || t.includes('distract'),
    supply:   t.includes('supply') || t.includes('restaurant') || t.includes('closed') || t.includes('delivery') || t.includes('availab') || t.includes('far'),
    platform: t.includes('app') || t.includes('load') || t.includes('slow') || t.includes('crash') || t.includes('ux') || t.includes('friction') || t.includes('payment'),
    external: t.includes('compet') || t.includes('zomato') || t.includes('promo') || t.includes('discount') || t.includes('extern') || t.includes('weather'),
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function DiagnosticHero({ onComplete }) {
  const [phase, setPhase]           = useState('hero');
  const [userAnswer, setUserAnswer] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [terminalReady, setTerminalReady]   = useState(false);
  const [error, setError]           = useState('');
  const textareaRef = useRef(null);
  const { callArjun } = useArjun();

  const PROMPT_TEXT = "incident@swiggy-analytics:~$ A user browses for 5 minutes. They don't order. Why?";
  const { displayed: terminalText, done: terminalDone } = useTypewriter(
    phase === 'terminal' ? PROMPT_TEXT : '', 22, 400
  );

  useEffect(() => {
    if (terminalDone) setTimeout(() => setTerminalReady(true), 300);
  }, [terminalDone]);

  const handleSubmit = useCallback(async () => {
    const wc = userAnswer.trim().split(/\s+/).filter(Boolean).length;
    if (wc < 10) { setError("Write at least 10 words — think out loud, don't hold back."); return; }
    setError('');
    setPhase('analyzing');
    const coverage = analyzeUserAnswer(userAnswer);
    const coveredCount = Object.values(coverage).filter(Boolean).length;
    await callArjun(`Gap exercise: ${userAnswer}`, coveredCount >= 3 ? 'gap_strong' : 'gap_weak');
    setAnalysisResult({ coverage, score: coveredCount });
    setPhase('revealed');
  }, [userAnswer, callArjun]);

  const wc = userAnswer.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">

        {/* ── Hero ── */}
        {phase === 'hero' && (
          <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }} className="text-center py-16 px-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="flex items-center justify-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#FC8019' }} />
              <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>
                OneStopCareers · Strategic Incident Simulator
              </span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#1E4FCC' }} />
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono font-bold leading-[1.1] tracking-tight mb-6"
              style={{ fontSize: 'clamp(26px, 4.5vw, 52px)', color: 'white' }}>
              The AI writes the code.
              <br />
              <span style={{ background: 'linear-gradient(90deg, #FC8019, #FF6B35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Are you prepared to make
              </span>
              <br />
              <span style={{ color: 'white' }}>the decision?</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="max-w-xl mx-auto text-base leading-relaxed mb-10"
              style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
              In 2026, syntax is free. Strategy is expensive.
              <br />
              Master the problem-solving frameworks used by PMs and Strategy Leads at Uber, Swiggy, and Meta.{' '}
              <span style={{ color: '#FC8019' }}>No code. Just logic and impact.</span>
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-3 flex-wrap mb-10">
              {[
                { label: '₹28L avg offer', color: '#FC8019' },
                { label: '6 Strategic milestones', color: '#4F80FF' },
                { label: 'Live incident mode', color: '#3DD68C' },
              ].map(({ label, color }) => (
                <span key={label} className="font-mono text-[10px] px-3 py-1.5 rounded-full"
                  style={{ color, background: `${color}12`, border: `1px solid ${color}30`, letterSpacing: '0.04em' }}>
                  {label}
                </span>
              ))}
            </motion.div>

            <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              onClick={() => setPhase('terminal')}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-mono font-bold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #FC8019 0%, #e06a0e 100%)', boxShadow: '0 8px 32px rgba(252,128,25,0.35)', letterSpacing: '0.04em' }}
              whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
              <span style={{ fontSize: 16 }}>⚡</span>
              Run the diagnostic
            </motion.button>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="mt-3 font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
              ~2 min · No signup · See your strategic blind spots instantly
            </motion.p>
          </motion.div>
        )}

        {/* ── Terminal ── */}
        {phase === 'terminal' && (
          <motion.div key="terminal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }} className="px-4 py-8 max-w-2xl mx-auto">
            <div className="rounded-2xl overflow-hidden mb-6"
              style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)' }}>
              <div className="px-4 py-3 flex items-center gap-2 border-b"
                style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                <div className="w-3 h-3 rounded-full" style={{ background: '#FF5A65' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#F5A623' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#3DD68C' }} />
                <span className="ml-3 font-mono text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  swiggy-analytics — incident-drill
                </span>
              </div>
              <div className="px-5 py-5 font-mono text-sm min-h-[80px]">
                <p style={{ color: '#4F80FF', fontSize: 12, marginBottom: 8 }}>
                  Swiggy Analytics War Room · Incident #2024-1021 · LIVE
                </p>
                <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                  <span style={{ color: '#FC8019' }}>$</span>{' '}
                  {terminalText}
                  {!terminalDone && <Cursor />}
                </p>
              </div>
            </div>

            <AnimatePresence>
              {terminalReady && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                  <p className="font-mono text-[11px] mb-3" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>
                    → Your analysis (think out loud — structure matters):
                  </p>
                  <textarea
                    ref={textareaRef}
                    value={userAnswer}
                    onChange={e => { setUserAnswer(e.target.value); setError(''); }}
                    placeholder="Type your analysis here. Why would a user leave without ordering?"
                    className="w-full min-h-[120px] rounded-xl px-4 py-3.5 resize-y outline-none font-mono text-sm leading-relaxed"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${error ? 'rgba(255,90,101,0.5)' : 'rgba(255,255,255,0.1)'}`,
                      color: 'rgba(255,255,255,0.85)', fontSize: 13,
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(252,128,25,0.5)'}
                    onBlur={e => e.target.style.borderColor = error ? 'rgba(255,90,101,0.5)' : 'rgba(255,255,255,0.1)'}
                  />
                  {error && <p className="font-mono text-[11px] mt-2" style={{ color: '#FF5A65' }}>⚠ {error}</p>}
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-mono text-[11px]" style={{ color: wc >= 10 ? '#3DD68C' : 'rgba(255,255,255,0.25)' }}>
                      {wc}/10 words min
                    </span>
                    <motion.button onClick={handleSubmit}
                      className="px-6 py-2.5 rounded-xl font-mono text-sm font-bold"
                      style={{ background: wc >= 10 ? '#FC8019' : 'rgba(255,255,255,0.05)', color: wc >= 10 ? 'white' : 'rgba(255,255,255,0.3)', border: '1px solid transparent' }}
                      whileHover={wc >= 10 ? { scale: 1.03 } : {}} whileTap={wc >= 10 ? { scale: 0.97 } : {}}>
                      Analyse my answer →
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Analyzing ── */}
        {phase === 'analyzing' && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="py-20 text-center px-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold"
                style={{ background: 'rgba(252,128,25,0.12)', border: '1px solid rgba(252,128,25,0.3)', color: '#FC8019' }}>
                AJ
              </div>
              <span className="font-mono text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Arjun is deconstructing your answer...
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              {[0, 1, 2].map(i => (
                <motion.span key={i} className="w-2 h-2 rounded-full" style={{ background: '#FC8019' }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Revealed ── */}
        {phase === 'revealed' && analysisResult && (
          <motion.div key="revealed" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }} className="px-4 py-6 max-w-2xl mx-auto">
            {/* Score card */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-5 mb-5"
              style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Your diagnostic coverage
                  </p>
                  <p className="font-mono text-xl font-bold" style={{ color: analysisResult.score >= 3 ? '#3DD68C' : '#F5A623' }}>
                    {analysisResult.score}/4 domains covered
                  </p>
                </div>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center font-mono text-2xl font-bold"
                  style={{
                    background: analysisResult.score >= 3 ? 'rgba(61,214,140,0.1)' : 'rgba(245,166,35,0.1)',
                    border: `1px solid ${analysisResult.score >= 3 ? 'rgba(61,214,140,0.3)' : 'rgba(245,166,35,0.3)'}`,
                    color: analysisResult.score >= 3 ? '#3DD68C' : '#F5A623',
                  }}>
                  {analysisResult.score >= 3 ? '✓' : analysisResult.score >= 2 ? '◑' : '○'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'demand', label: 'Demand-Side', color: '#FC8019' },
                  { key: 'supply', label: 'Supply-Side', color: '#4F80FF' },
                  { key: 'platform', label: 'Platform / UX', color: '#A78BFA' },
                  { key: 'external', label: 'External Factors', color: '#F5A623' },
                ].map(({ key, label, color }) => {
                  const covered = analysisResult.coverage[key];
                  return (
                    <div key={key} className="rounded-lg px-3 py-2 flex items-center gap-2"
                      style={{ background: covered ? `${color}10` : 'rgba(255,90,101,0.05)', border: `1px solid ${covered ? `${color}25` : 'rgba(255,90,101,0.15)'}` }}>
                      <span style={{ color: covered ? color : '#FF5A65', fontSize: 12 }}>{covered ? '✓' : '×'}</span>
                      <span className="font-mono text-[11px] font-medium" style={{ color: covered ? color : 'rgba(255,255,255,0.4)' }}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Logic gap */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="rounded-2xl p-4 mb-5"
              style={{ background: 'rgba(252,128,25,0.05)', border: '1px solid rgba(252,128,25,0.2)', borderLeft: '3px solid #FC8019' }}>
              <p className="font-mono text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: '#FC8019' }}>
                Arjun · Staff-Level Logic Gap
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                {analysisResult.score >= 3
                  ? 'Strong instinct. You covered the core domains. Now the question is: in what order would you test them? A Staff analyst ranks by probability × testability — Platform first (fastest to rule out), Supply next, Demand last.'
                  : `You're missing ${4 - analysisResult.score} domain${4 - analysisResult.score > 1 ? 's' : ''}. This is the difference between an L3 and L5 decomposition. A staff analyst structures into exactly 4 buckets before forming any hypothesis. Watch how this unfolds.`}
              </p>
            </motion.div>

            {/* Staff logic tree */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="rounded-2xl overflow-hidden mb-5"
              style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="px-4 py-3 border-b flex items-center justify-between"
                style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: '#4F80FF' }}>
                    Staff-Level Structured Deconstruction
                  </p>
                  <p className="font-mono text-[9px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
                    Click any node to expand · ranked by probability × testability
                  </p>
                </div>
                <span className="font-mono text-[9px] px-2 py-1 rounded"
                  style={{ background: 'rgba(30,79,204,0.12)', color: '#4F80FF', border: '1px solid rgba(30,79,204,0.25)' }}>
                  MECE
                </span>
              </div>
              <div className="p-4">
                {STAFF_LOGIC_TREE.map((node, i) => (
                  <LogicNode key={i} node={node} depth={0} delay={i * 0.1} />
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center">
              <motion.button onClick={onComplete}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-mono font-bold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #FC8019, #e06a0e)', boxShadow: '0 8px 32px rgba(252,128,25,0.3)' }}
                whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                Enter the War Room →
              </motion.button>
              <p className="mt-2 font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                Free · 6 Strategic Milestones · ~45 min
              </p>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
