// src/components/strategy/components/ExecutiveMemo.jsx
// Sprint 6: Shared useTypewriter + WorkbenchContext speed

import React, { useState, useCallback, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, TrendingUp, Zap, AlignLeft } from 'lucide-react';
import { EXEC_MEMO_RUBRIC, ARJUN_PHASE2_SYSTEM, P2_SCENARIO } from '../data/swiggyStrategyData.js';
import { useTypewriter } from '../../../hooks/useTypewriter.js';
import { WorkbenchContext } from '../../../contexts/WorkbenchContext.js';

const ORANGE = '#FC8019';
const GREEN  = '#3DD68C';
const RED    = '#F38BA8';
const BLUE   = '#4F80FF';
const YELLOW = '#F9E2AF';
const PURPLE = '#A78BFA';

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ initials, color, size = 28 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:7, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--mono)', fontSize:size*0.32, fontWeight:800, background:`${color}18`, border:`1px solid ${color}38`, color }}>
      {initials}
    </div>
  );
}

// ── Arjun typed line — uses shared hook + context speed ───────────────────────
function ArjunLine({ text, isNew = true }) {
  const { typewriterSpeed } = useContext(WorkbenchContext);
  const { displayed, done } = useTypewriter(text, { speed: typewriterSpeed, trigger: isNew });
  return (
    <div style={{ display:'flex', gap:9, alignItems:'flex-start' }}>
      <Avatar initials="AJ" color={ORANGE} />
      <div style={{ flex:1 }}>
        <div style={{ display:'flex', gap:6, marginBottom:3, alignItems:'baseline' }}>
          <span style={{ fontFamily:'var(--mono)', fontSize:10, fontWeight:700, color:ORANGE }}>Arjun</span>
          <span style={{ fontFamily:'var(--mono)', fontSize:9, color:ORANGE, opacity:0.55 }}>Staff Analyst</span>
        </div>
        <p style={{ fontSize:14, lineHeight:1.72, color:'var(--ink)', margin:0, whiteSpace:'pre-wrap', fontWeight:500 }}>
          {isNew ? displayed : text}
          {isNew && !done && <motion.span animate={{ opacity:[1,0,1] }} transition={{ duration:0.7, repeat:Infinity }} style={{ color:ORANGE, marginLeft:1 }}>▊</motion.span>}
        </p>
      </div>
    </div>
  );
}

// ── Score bar ─────────────────────────────────────────────────────────────────
function ScoreBar({ label, icon: Icon, score, color, description, feedback }) {
  const pct = Math.round(score * 100);
  const barColor = pct >= 75 ? GREEN : pct >= 50 ? YELLOW : RED;
  return (
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
      style={{ padding:'14px 16px', borderRadius:12, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', marginBottom:10 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
        <Icon size={13} color={color} />
        <span style={{ fontFamily:'var(--mono)', fontSize:10, fontWeight:700, color, textTransform:'uppercase', letterSpacing:'0.06em', flex:1 }}>{label}</span>
        <span style={{ fontFamily:'var(--mono)', fontSize:14, fontWeight:800, color:barColor }}>{pct}%</span>
      </div>
      <div style={{ height:4, borderRadius:999, background:'rgba(255,255,255,0.07)', marginBottom:10, overflow:'hidden' }}>
        <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.8, ease:[0.16,1,0.3,1], delay:0.2 }}
          style={{ height:'100%', borderRadius:999, background:barColor }} />
      </div>
      <p style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--ink3)', margin:0, lineHeight:1.6 }}>{description}</p>
      {feedback && (
        <p style={{ fontSize:12, color:'var(--ink2)', margin:'8px 0 0', lineHeight:1.65, padding:'8px 10px', borderRadius:8, background:`${barColor}08`, border:`1px solid ${barColor}15` }}>{feedback}</p>
      )}
    </motion.div>
  );
}

// ── Local scoring fallback ────────────────────────────────────────────────────
function scoreLocally(memoText, rubric) {
  const lower = memoText.toLowerCase();
  const score = (keywords) => {
    const hits = keywords.filter(k => lower.includes(k)).length;
    return Math.min(hits / Math.max(keywords.length * 0.4, 1), 1);
  };
  const sizing = score(rubric.dimensions.sizing.keywords);
  const actionability = score(rubric.dimensions.actionability.keywords);
  const structure = score(rubric.dimensions.structure.keywords);
  const overall = sizing * 0.4 + actionability * 0.35 + structure * 0.25;
  let feedback;
  if (overall >= 0.75) feedback = rubric.feedback.high;
  else if (sizing < 0.4) feedback = rubric.feedback.medium_sizing;
  else if (actionability < 0.4) feedback = rubric.feedback.medium_action;
  else if (structure < 0.4) feedback = rubric.feedback.medium_structure;
  else feedback = rubric.feedback.low;
  return { sizing, actionability, structure, overall, feedback, source:'local' };
}

// ── API-based evaluation ──────────────────────────────────────────────────────
async function evaluateMemo(memoText, investigationLog, scenario) {
  const logSummary = investigationLog?.filter(e => e.conclusion)
    .map(e => `Finding ${e.index + 1}: "${e.conclusion}"`).join('\n') || 'No investigation log.';
  const systemPrompt = `${ARJUN_PHASE2_SYSTEM}\n\nYou are evaluating an executive memo. Respond ONLY with valid JSON, no preamble, no markdown backticks.\n\nInvestigation context:\n- City: ${scenario?.city || 'South Mumbai'}\n- Metric drop: ${scenario?.drop || '11.2%'} GMV WoW\n- Category: ${scenario?.category || 'Desserts'}\n- Day: ${scenario?.period || 'Thursday'}\n\nAnalyst's findings:\n${logSummary}\n\nReturn this exact JSON:\n{"sizing":<0-1>,"actionability":<0-1>,"structure":<0-1>,"sizingFeedback":"<1 sentence>","actionabilityFeedback":"<1 sentence>","structureFeedback":"<1 sentence>","overallVerdict":"<2-3 sentences>"}`;
  try {
    const res = await fetch('/.netlify/functions/evaluate', {
      method:'POST', headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ system:systemPrompt, messages:[{ role:'user', content:`Evaluate this executive memo:\n\n"${memoText}"` }], max_tokens:400 }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const raw = data.content?.[0]?.text || '';
    const parsed = JSON.parse(raw.replace(/```json|```/g,'').trim());
    return {
      sizing:         Math.min(Math.max(parsed.sizing || 0, 0), 1),
      actionability:  Math.min(Math.max(parsed.actionability || 0, 0), 1),
      structure:      Math.min(Math.max(parsed.structure || 0, 0), 1),
      overall:        parsed.sizing * 0.4 + parsed.actionability * 0.35 + parsed.structure * 0.25,
      sizingFeedback: parsed.sizingFeedback,
      actionabilityFeedback: parsed.actionabilityFeedback,
      structureFeedback: parsed.structureFeedback,
      overallVerdict: parsed.overallVerdict,
      source:'api',
    };
  } catch (_) {
    const local = scoreLocally(memoText, EXEC_MEMO_RUBRIC);
    return { ...local, sizingFeedback:null, actionabilityFeedback:null, structureFeedback:null, overallVerdict:local.feedback };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function ExecutiveMemo({ investigationLog, scenario = P2_SCENARIO, onComplete }) {
  const [mode, setMode]         = useState('intro');
  const [memo, setMemo]         = useState('');
  const [focused, setFocused]   = useState(false);
  const [scores, setScores]     = useState(null);
  const [evalLoading, setEvalLoading] = useState(false);
  const [arjunOpening, setArjunOpening] = useState(false);
  const bottomRef = useRef(null);

  const charCount = memo.trim().length;
  const canSubmit = charCount >= EXEC_MEMO_RUBRIC.minChars && !evalLoading;

  useEffect(() => { const t = setTimeout(() => setArjunOpening(true), 300); return () => clearTimeout(t); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth', block:'end' }); }, [mode, scores, evalLoading]);

  const handleStartWrite = useCallback(() => setMode('write'), []);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setMode('evaluating'); setEvalLoading(true);
    const result = await evaluateMemo(memo, investigationLog, scenario);
    setEvalLoading(false); setScores(result); setMode('result');
    onComplete?.(result);
  }, [canSubmit, memo, investigationLog, scenario, onComplete]);

  const overallPct = scores ? Math.round(scores.overall * 100) : null;
  const overallColor = overallPct >= 75 ? GREEN : overallPct >= 50 ? YELLOW : RED;

  return (
    <div>
      {/* Section header */}
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', marginBottom:20 }}>
        <AlignLeft size={13} color="var(--ink3)" />
        <span style={{ fontFamily:'var(--mono)', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--ink3)' }}>Executive Memo — Final Synthesis</span>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:5 }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:ORANGE }} />
          <span style={{ fontFamily:'var(--mono)', fontSize:9, color:ORANGE, textTransform:'uppercase', letterSpacing:'0.08em' }}>Phase 2 Final</span>
        </div>
      </div>

      {/* Arjun opener */}
      <AnimatePresence>
        {arjunOpening && (
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:20 }}>
            <ArjunLine isNew text={`You've done the investigation. You caught a data integrity error, identified the root cause, and sized the impact.\n\nNow write the memo. Not a summary — a recommendation. A VP is reading this in 30 seconds over coffee. What do they need to know, in order?\n\n① Root cause — what broke. ② Evidence — why you're certain. ③ Impact — the number. ④ Action — exactly who does what.`} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Investigation trail */}
      {investigationLog && investigationLog.filter(e => e.conclusion).length > 0 && (
        <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
          style={{ marginBottom:16, borderRadius:10, border:'1px solid rgba(255,255,255,0.07)', overflow:'hidden' }}>
          <div style={{ padding:'8px 14px', background:'rgba(255,255,255,0.02)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontFamily:'var(--mono)', fontSize:9, fontWeight:700, color:'var(--ink3)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Your investigation — use these in the memo</span>
          </div>
          <div style={{ padding:'10px 14px' }}>
            {investigationLog.filter(e => e.conclusion).map((entry, i) => {
              const cs = [ORANGE,BLUE,PURPLE,GREEN,RED,PURPLE];
              const c = cs[entry.index % cs.length];
              return (
                <div key={i} style={{ display:'flex', gap:10, padding:'5px 0', borderBottom: i < investigationLog.filter(e => e.conclusion).length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <span style={{ fontFamily:'var(--mono)', fontSize:9, fontWeight:700, color:c, flexShrink:0, marginTop:2, minWidth:20 }}>P{entry.index+1}</span>
                  <p style={{ fontSize:12, color:'var(--ink2)', lineHeight:1.55, margin:0 }}>"{entry.conclusion}"</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Write mode */}
      <AnimatePresence>
        {(mode === 'write' || mode === 'evaluating') && (
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:16 }}>
            <div style={{ display:'flex', gap:6, marginBottom:10, flexWrap:'wrap' }}>
              {['① Root cause','② Evidence','③ Impact (₹)','④ Action (who / when)'].map((step, i) => {
                const cs = [ORANGE,BLUE,PURPLE,GREEN];
                return <span key={i} style={{ fontFamily:'var(--mono)', fontSize:9, fontWeight:700, color:cs[i], padding:'3px 9px', borderRadius:6, background:`${cs[i]}10`, border:`1px solid ${cs[i]}22` }}>{step}</span>;
              })}
            </div>
            <div style={{ borderRadius:12, overflow:'hidden', border:`1px solid ${focused ? ORANGE : canSubmit ? `${ORANGE}45` : 'rgba(255,255,255,0.09)'}`, boxShadow: focused ? `0 0 0 1px ${ORANGE}30` : 'none', transition:'border-color 0.18s, box-shadow 0.18s' }}>
              <textarea value={memo} onChange={e => setMemo(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                placeholder={`Hey Priya — the drop is driven by [root cause].\n\nData confirms [evidence]. This costs [₹ impact] in recoverable GMV at [recovery]% fix rate.\n\nRecommend [specific action] by [deadline].`}
                rows={6} disabled={mode === 'evaluating'} autoFocus={mode === 'write'}
                style={{ width:'100%', padding:'14px 16px', background:'rgba(255,255,255,0.03)', border:'none', outline:'none', color:'var(--ink)', fontFamily:'var(--sans)', fontSize:14, lineHeight:1.75, resize:'none', boxSizing:'border-box', opacity: mode === 'evaluating' ? 0.6 : 1 }} />
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', background:'rgba(0,0,0,0.2)', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontFamily:'var(--mono)', fontSize:10, color: canSubmit ? GREEN : 'var(--ink3)' }}>
                  {mode === 'evaluating' ? '⟳ Arjun is reading...' : canSubmit ? '✓ Ready — Arjun will evaluate this' : `${charCount} / ${EXEC_MEMO_RUBRIC.minChars} chars min`}
                </span>
                <motion.button onClick={handleSubmit} disabled={!canSubmit || mode === 'evaluating'}
                  whileHover={canSubmit ? { scale:1.04, y:-1 } : {}} whileTap={canSubmit ? { scale:0.97 } : {}}
                  style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:9, background: canSubmit ? ORANGE : 'rgba(255,255,255,0.05)', color: canSubmit ? '#fff' : 'var(--ink3)', fontFamily:'var(--sans)', fontSize:13, fontWeight:700, border:'none', cursor: canSubmit ? 'pointer' : 'default', transition:'all 0.15s', boxShadow: canSubmit ? `0 2px 14px ${ORANGE}45` : 'none' }}>
                  {mode === 'evaluating'
                    ? <><motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }} style={{ width:12, height:12, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff' }} />Evaluating...</>
                    : <>Submit to Arjun <ArrowRight size={13} /></>
                  }
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <AnimatePresence>
        {mode === 'intro' && arjunOpening && (
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.8 }} style={{ marginTop:20 }}>
            <motion.button onClick={handleStartWrite} whileHover={{ scale:1.03, y:-1 }} whileTap={{ scale:0.97 }}
              style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'11px 22px', borderRadius:10, background:ORANGE, color:'#fff', border:'none', cursor:'pointer', fontFamily:'var(--sans)', fontSize:13, fontWeight:700, boxShadow:`0 2px 16px ${ORANGE}40` }}>
              Write the memo <ArrowRight size={14} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {mode === 'result' && scores && (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, ease:[0.16,1,0.3,1] }}>
            <div style={{ padding:'16px 18px', borderRadius:14, background:`${overallColor}08`, border:`1px solid ${overallColor}28`, marginBottom:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <Avatar initials="AJ" color={ORANGE} size={32} />
                <div>
                  <p style={{ fontFamily:'var(--mono)', fontSize:9, color:ORANGE, opacity:0.7, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:2 }}>Arjun — Evaluation</p>
                  <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
                    <span style={{ fontFamily:'var(--mono)', fontSize:26, fontWeight:900, color:overallColor, lineHeight:1 }}>{overallPct}</span>
                    <span style={{ fontFamily:'var(--mono)', fontSize:12, color:overallColor }}>/ 100</span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize:14, lineHeight:1.72, color:'var(--ink)', margin:0, fontWeight:500 }}>{scores.overallVerdict || EXEC_MEMO_RUBRIC.feedback.high}</p>
            </div>
            <ScoreBar label="Sizing" icon={TrendingUp} score={scores.sizing} color={PURPLE} description={EXEC_MEMO_RUBRIC.dimensions.sizing.description} feedback={scores.sizingFeedback} />
            <ScoreBar label="Actionability" icon={Zap} score={scores.actionability} color={ORANGE} description={EXEC_MEMO_RUBRIC.dimensions.actionability.description} feedback={scores.actionabilityFeedback} />
            <ScoreBar label="Structure" icon={AlignLeft} score={scores.structure} color={BLUE} description={EXEC_MEMO_RUBRIC.dimensions.structure.description} feedback={scores.structureFeedback} />
            <div style={{ marginTop:12, padding:'14px 16px', borderRadius:12, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>
              <p style={{ fontFamily:'var(--mono)', fontSize:9, fontWeight:700, color:'var(--ink3)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>Your memo</p>
              <p style={{ fontSize:13, lineHeight:1.72, color:'var(--ink2)', margin:0, whiteSpace:'pre-wrap', fontStyle:'italic' }}>"{memo}"</p>
            </div>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }}
              style={{ marginTop:20, display:'flex', gap:10, alignItems:'center' }}>
              <CheckCircle size={14} color={GREEN} />
              <span style={{ fontFamily:'var(--mono)', fontSize:10, color:GREEN, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>Phase 2 Investigation Complete — saved to portfolio</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`textarea::placeholder { color: var(--ink2) !important; opacity: 0.55; }`}</style>
      <div ref={bottomRef} style={{ height:4 }} />
    </div>
  );
}