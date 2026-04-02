// src/components/strategy/engine/MilestoneRunner.jsx
// CP3-B/C: Generic milestone renderer — reads everything from props.
// Handles: Arjun opening → user input → response routing → synthesis prompt.
// Has zero Swiggy-specific code. Replaces MilestoneScope, MilestoneDashboard,
// MilestoneFunnel, MilestoneRootCause, MilestoneImpact.
// MilestoneRespond lives separately at engine/MilestoneRespond.jsx.

import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowRight, ArrowDown } from 'lucide-react';
import { useTypewriter } from '../../../hooks/useTypewriter.js';
import { WorkbenchContext } from '../../../contexts/WorkbenchContext.js';
import KpiScorecard from '../components/KpiScorecard.jsx';
import CohortMatrix from '../components/CohortMatrix.jsx';
import FunnelChart from '../visualisations/FunnelChart.jsx';
import PredictionPrompt from '../components/PredictionPrompt.jsx';
import ConceptChip from '../components/ConceptChip.jsx';
import ArjunQueryTerminal from '../components/ArjunQueryTerminal.jsx';
import ThinkingReveal from '../components/ThinkingReveal.jsx';
import { usePriyaPing } from '../hooks/usePriyaPing.js';

const ORANGE = '#FC8019';
const BLUE   = '#4F80FF';
const GREEN  = '#3DD68C';
const RED    = '#F38BA8';
const PURPLE = '#A78BFA';

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ initials, color, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 8, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--mono)', fontSize: size * 0.3, fontWeight: 800,
      background: `${color}20`, border: `1px solid ${color}40`, color,
    }}>
      {initials}
    </div>
  );
}

// ── Typewriter message ────────────────────────────────────────────────────────
const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;

function ArjunTypedMessage({ text, isNew, onDone }) {
  const { typewriterSpeed } = useContext(WorkbenchContext);
  const { displayed, done, skip } = useTypewriter(text, { speed: typewriterSpeed, trigger: isNew });
  useEffect(() => { if (done && onDone) onDone(); }, [done, onDone]);
  return (
    <span style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.72, color: 'var(--ink)', whiteSpace: 'pre-wrap' }}>
      {isNew ? displayed : text}
      {isNew && !done && (
        <>
          <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.7, repeat: Infinity }} style={{ color: ORANGE, marginLeft: 1 }}>▊</motion.span>
          <span onClick={skip} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && skip()}
            style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', cursor: 'pointer', marginLeft: 8, textDecoration: 'underline', letterSpacing: '0.04em', userSelect: 'none', ...(isTouchDevice ? { display: 'inline-flex', alignItems: 'center', minWidth: 44, padding: '4px 0' } : {}) }}>
            Skip →
          </span>
        </>
      )}
    </span>
  );
}

// ── Message ───────────────────────────────────────────────────────────────────
function Message({ msg, isNew }) {
  if (msg.role === 'system') return (
    <div style={{ textAlign: 'center', padding: '4px 0' }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{msg.text}</span>
    </div>
  );
  const color    = msg.role === 'arjun' ? ORANGE : msg.role === 'priya' ? RED : BLUE;
  const initials = msg.role === 'arjun' ? 'AJ' : msg.role === 'priya' ? 'PR' : 'ME';
  const name     = msg.role === 'arjun' ? 'Arjun' : msg.role === 'priya' ? 'Priya' : 'You';
  return (
    <motion.div initial={isNew ? { opacity: 0, y: 8 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <Avatar initials={initials} color={color} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color }}>{name}</span>
          {msg.role === 'arjun' && <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: ORANGE, opacity: 0.6 }}>Staff Analyst</span>}
          {msg.role === 'priya' && <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: RED,    opacity: 0.6 }}>Head of Growth</span>}
          {msg.meta && <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)' }}>{msg.meta}</span>}
        </div>
        {msg.role === 'arjun'
          ? <ArjunTypedMessage text={msg.text} isNew={isNew} />
          : <p style={{ fontSize: 13, lineHeight: 1.65, color: msg.role === 'priya' ? 'var(--ink)' : 'var(--ink2)', fontStyle: msg.role === 'priya' ? 'normal' : 'italic', whiteSpace: 'pre-wrap', margin: 0 }}>{msg.text}</p>
        }
      </div>
    </motion.div>
  );
}

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <Avatar initials="AJ" color={ORANGE} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 10, background: `${ORANGE}08`, border: `1px solid ${ORANGE}18` }}>
        {[0,1,2].map(i => <motion.span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: ORANGE, display: 'block' }} animate={{ scale: [1,1.4,1], opacity: [0.4,1,0.4] }} transition={{ duration: 1.0, delay: i*0.2, repeat: Infinity }} />)}
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', marginLeft: 4 }}>Arjun is thinking...</span>
      </div>
    </div>
  );
}

// ── Chat input ────────────────────────────────────────────────────────────────
function ChatInput({ value, onChange, onSend, loading, placeholder, autoFocus = false }) {
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef(null);
  const hasContent  = value.length > 0;
  const canSend     = value.trim().length > 0 && !loading;

  useEffect(() => { if (autoFocus) setTimeout(() => textareaRef.current?.focus(), 100); }, [autoFocus]);

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', padding: '12px 0 0' }}>
      <textarea ref={textareaRef} value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
        placeholder={placeholder || 'Type your response...'} rows={2}
        style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid ${focused ? ORANGE : hasContent ? `${ORANGE}50` : 'rgba(255,255,255,0.09)'}`, borderRadius: 10, padding: '10px 12px', fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink)', resize: 'none', outline: 'none', lineHeight: 1.55, transition: 'border-color 0.18s, box-shadow 0.18s', boxSizing: 'border-box', boxShadow: focused ? `0 0 0 1px ${ORANGE}40, 0 0 12px ${ORANGE}15` : 'none' }}
      />
      <motion.button onClick={onSend} whileHover={canSend ? { scale: 1.08 } : {}} whileTap={canSend ? { scale: 0.92 } : {}}
        style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: hasContent ? ORANGE : 'rgba(255,255,255,0.06)', border: 'none', cursor: canSend ? 'pointer' : 'default', transition: 'background 0.12s, box-shadow 0.12s', boxShadow: hasContent ? `0 2px 12px ${ORANGE}50` : 'none' }}>
        <Send size={15} color={hasContent ? '#fff' : 'rgba(255,255,255,0.2)'} />
      </motion.button>
    </div>
  );
}

// ── Synthesis prompt ──────────────────────────────────────────────────────────
function SynthesisPrompt({ prompt, placeholder, minChars = 60, onSubmit, color = ORANGE }) {
  const [value, setValue]         = useState('');
  const [focused, setFocused]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const canSubmit = value.trim().length >= minChars && !submitted;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    onSubmit(value.trim());
  };

  if (submitted) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      style={{ marginTop: 20, padding: '16px', borderRadius: 12, background: `${color}07`, border: `1px solid ${color}25` }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
        <Avatar initials="AJ" color={ORANGE} size={28} />
        <div>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: ORANGE, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Arjun — before we move on</p>
          <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.65, margin: 0 }}>{prompt}</p>
        </div>
      </div>
      <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${focused ? color : canSubmit ? `${color}40` : 'rgba(255,255,255,0.09)'}`, boxShadow: focused ? `0 0 0 1px ${color}35` : 'none', transition: 'border-color 0.18s, box-shadow 0.18s' }}>
        <textarea value={value} onChange={e => setValue(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={placeholder} rows={2} autoFocus
          style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: 'none', outline: 'none', color: 'var(--ink)', fontFamily: 'var(--sans)', fontSize: 13, lineHeight: 1.6, resize: 'none', boxSizing: 'border-box' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: canSubmit ? GREEN : 'var(--ink3)' }}>
            {canSubmit ? '✓ Locked in' : `${value.trim().length} / ${minChars} chars min`}
          </span>
          <motion.button onClick={handleSubmit} whileHover={canSubmit ? { scale: 1.05, y: -1 } : {}} whileTap={canSubmit ? { scale: 0.96 } : {}}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 8, background: canSubmit ? color : 'rgba(255,255,255,0.05)', color: canSubmit ? '#fff' : 'var(--ink3)', fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 700, border: 'none', cursor: canSubmit ? 'pointer' : 'default', transition: 'all 0.15s', boxShadow: canSubmit ? `0 2px 12px ${color}45` : 'none' }}>
            Lock it in <ArrowRight size={12} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Viz renderer — driven by config.vizType ───────────────────────────────────
function VizBlock({ vizType, caseData, pulseColor, queryData, onVizReady }) {
  if (!vizType || vizType === 'none') return null;

  if (vizType === 'kpi') {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <KpiScorecard
          onMetricClick={() => {}}
          clickedMetric={null}
          interactive={false}
        />
      </motion.div>
    );
  }

  if (vizType === 'funnel') {
    return (
      <div>
        {queryData && (
          <ArjunQueryTerminal
            queryData={queryData}
            onComplete={onVizReady}
            pulseColor={pulseColor || BLUE}
          />
        )}
        {caseData?.funnel && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <FunnelChart
              thisWeek={caseData.funnelThisWeek || []}
              lastWeek={caseData.funnelLastWeek || []}
              title="Conversion funnel · This week vs Last week"
              showSegmented
              newUsers={caseData.funnelNewUsers || []}
              returning={caseData.funnelReturning || []}
            />
          </motion.div>
        )}
      </div>
    );
  }

  if (vizType === 'cohort') {
    return (
      <div>
        {queryData && (
          <ArjunQueryTerminal
            queryData={queryData}
            onComplete={onVizReady}
            pulseColor={pulseColor || PURPLE}
          />
        )}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: 16 }}>
          <CohortMatrix data={caseData?.cohortRows} />
        </motion.div>
      </div>
    );
  }

  if (vizType === 'impact') {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${PURPLE}22`, background: `${PURPLE}05`, marginBottom: 16 }}>
        <div style={{ padding: '9px 14px', background: `${PURPLE}08`, borderBottom: `1px solid ${PURPLE}14` }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: PURPLE, margin: 0 }}>Your inputs — use these to build the calculation</p>
        </div>
        <div style={{ padding: '14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
          {[
            { label: 'Churned new users', value: `${caseData?.impact?.churnedUsers}`,    unit: 'users'     },
            { label: 'Avg order value',   value: `₹${caseData?.impact?.avgOrderValue}`, unit: 'per order' },
            { label: 'Orders per week',   value: `${caseData?.impact?.ordersPerWeek}`,   unit: 'per user'  },
            { label: 'Weeks in year',     value: `${caseData?.impact?.weeksInYear}`,     unit: 'weeks'     },
          ].map(({ label, value, unit }) => (
            <div key={label} style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', marginBottom: 4 }}>{label}</p>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 800, color: PURPLE, lineHeight: 1, marginBottom: 2 }}>{value}</p>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)' }}>{unit}</p>
            </div>
          ))}
        </div>
        <div style={{ padding: '10px 14px', borderTop: `1px solid ${PURPLE}14`, background: 'rgba(0,0,0,0.15)' }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', margin: 0 }}>Formula: churned users × AOV × orders/week × weeks = annual GMV at risk. Then apply recovery rate.</p>
        </div>
      </motion.div>
    );
  }

  return null;
}

// ── ForceAdvanceBeat — ceremony for rescued milestones ──────────────────────
function ForceAdvanceBeat({ missedConcept, conceptName }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        display: 'flex', gap: 10, alignItems: 'flex-start',
        padding: '14px 16px', borderRadius: 12, marginBottom: 16,
        background: 'rgba(249,226,175,0.06)', border: '1px solid rgba(249,226,175,0.20)',
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(249,226,175,0.15)', border: '1px solid rgba(249,226,175,0.30)',
        fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 800, color: '#F9E2AF',
      }}>AJ</div>
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#F9E2AF', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
          Arjun — moving on
        </p>
        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.65, margin: '0 0 6px' }}>
          Let me anchor this before we continue.
        </p>
        {missedConcept && (
          <p style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.65, margin: '0 0 8px' }}>{missedConcept}</p>
        )}
        {conceptName && (
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
            color: '#F9E2AF', padding: '3px 9px', borderRadius: 6,
            background: 'rgba(249,226,175,0.12)', border: '1px solid rgba(249,226,175,0.22)',
          }}>
            Concept: {conceptName}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ── Main MilestoneRunner ──────────────────────────────────────────────────────
export default function MilestoneRunner({
  config,
  caseData,
  onComplete,
  callArjunMilestone,
  onPriyaPing,
  milestoneColor = ORANGE,
  pulseColor     = ORANGE,
  milestoneIndex = 0,
  prediction     = null,
}) {
  const [stage, setStage]               = useState('opening');
  const [messages, setMessages]         = useState([]);
  const [input, setInput]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [concept, setConcept]           = useState(null);
  const [showSynthesis, setShowSynthesis] = useState(false);
  const [predictionDone, setPredictionDone] = useState(!prediction);
  const [vizReady, setVizReady]         = useState(false);
  const [expertAnalysis, setExpertAnalysis] = useState(null);
  const [revealed, setRevealed]         = useState(false);
  const [showForceBeat, setShowForceBeat] = useState(false);
  const bottomRef = useRef(null);

  // Priya ping
  usePriyaPing(milestoneIndex, false, useCallback((pingMsg) => {
    setMessages(prev => [...prev, pingMsg]);
    onPriyaPing?.();
  }, [onPriyaPing]));

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, showSynthesis, vizReady, predictionDone]);

  // Start opening message after prediction done
  useEffect(() => {
    if (!predictionDone) return;
    const t = setTimeout(() => {
      setMessages([{ role: 'arjun', text: config.arjunOpening, isNew: true }]);
      setStage('question');
    }, 400);
    return () => clearTimeout(t);
  }, [predictionDone, config.arjunOpening]);

  // Add question after opening
  useEffect(() => {
    if (stage !== 'question') return;
    const t = setTimeout(() => {
      setMessages(prev => [...prev, { role: 'arjun', text: config.arjunQuestion, isNew: true }]);
      setStage('input');
    }, 800);
    return () => clearTimeout(t);
  }, [stage, config.arjunQuestion]);

  const send = useCallback(async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: q, isNew: true }]);
    setLoading(true);

    const { text, advance, forceAdvance, concept: c, expertAnalysis: ea } =
      await callArjunMilestone(q, config.id);

    setLoading(false);

    if (ea) setExpertAnalysis(ea);

    if (advance) {
      setMessages(prev => [...prev, { role: 'arjun', text, isNew: true }]);
      if (c) setConcept(c);
      setRevealed(true);

      // ForceAdvance — show beat before proceeding
      if (forceAdvance && config.forcedAdvanceLesson) {
        setShowForceBeat(true);
        setTimeout(() => {
          setShowForceBeat(false);
          if (config.synthesisPrompt) {
            setShowSynthesis(true);
          } else {
            onComplete(null);
          }
        }, 2800);
        return;
      }

      // If milestone has synthesis, show it; otherwise complete directly
      if (config.synthesisPrompt) {
        setTimeout(() => setShowSynthesis(true), 1000);
      } else {
        setTimeout(() => onComplete(null), 2500);
      }
    } else {
      setMessages(prev => [...prev, { role: 'arjun', text, isNew: true }]);
      if (c) setConcept(c);
      setStage('input');
    }
  }, [input, loading, callArjunMilestone, config, onComplete]);

  return (
    <div>
      {/* Prediction gate */}
      {!predictionDone && prediction && (
        <PredictionPrompt prediction={prediction} onComplete={() => setPredictionDone(true)} />
      )}

      <AnimatePresence>
        {predictionDone && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

            {/* Message feed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
              {messages.map((msg, i) => (
                <Message key={i} msg={msg} isNew={msg.isNew} />
              ))}
              {loading && <TypingIndicator />}
            </div>

            {/* Viz block — shown after opening message */}
            {stage !== 'opening' && config.vizType && config.vizType !== 'none' && (
              <VizBlock
                vizType={config.vizType}
                caseData={caseData}
                pulseColor={pulseColor}
                queryData={config.queryData}
                onVizReady={() => setVizReady(true)}
              />
            )}

            {/* Concept chip */}
            <AnimatePresence>
              {concept && <ConceptChip concept={concept} onDismiss={() => setConcept(null)} />}
            </AnimatePresence>

            {/* Expert analysis reveal */}
            {expertAnalysis && (
              <ThinkingReveal
                expertAnalysis={expertAnalysis}
                isRevealed={revealed}
                milestoneColor={milestoneColor}
              />
            )}

            {/* Chat input */}
            {stage === 'input' && !showSynthesis && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                    style={{ width: 6, height: 6, borderRadius: '50%', background: milestoneColor, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: milestoneColor, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Your turn — reply to Arjun
                  </span>
                </div>
                <ChatInput
                  value={input}
                  onChange={setInput}
                  onSend={send}
                  loading={loading}
                  placeholder={config.hint1}
                  autoFocus
                />
              </motion.div>
            )}

            {/* ForceAdvance beat */}
            <AnimatePresence>
              {showForceBeat && config.forcedAdvanceLesson && (
                <ForceAdvanceBeat
                  missedConcept={config.forcedAdvanceLesson}
                  conceptName={config.title}
                />
              )}
            </AnimatePresence>

            {/* Synthesis prompt */}
            <AnimatePresence>
              {showSynthesis && config.synthesisPrompt && (
                <SynthesisPrompt
                  prompt={config.synthesisPrompt}
                  placeholder={config.synthesisPlaceholder}
                  minChars={config.synthesisMin || 60}
                  color={config.synthesisColor || milestoneColor}
                  onSubmit={(sentence) => onComplete(sentence)}
                />
              )}
            </AnimatePresence>

            <div ref={bottomRef} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
