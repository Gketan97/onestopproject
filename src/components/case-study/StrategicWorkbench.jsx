/**
 * StrategicWorkbench.jsx
 * Natural Language data request interface.
 * Returns high-fidelity visualizations: FunnelAnalysis, CohortMatrix, MetricCards.
 * Uses v1 useArjun hook (routes through /.netlify/functions/evaluate)
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useArjun } from './hooks/useArjun.js';

// ── Color helpers ─────────────────────────────────────────────────────────────
function retentionColor(pct) {
  if (pct >= 70) return { bg: 'rgba(61,214,140,0.85)',  text: '#0a1f14', fw: '700' };
  if (pct >= 55) return { bg: 'rgba(61,214,140,0.5)',   text: '#1a3d29', fw: '600' };
  if (pct >= 40) return { bg: 'rgba(245,166,35,0.55)',  text: '#2a1f00', fw: '600' };
  if (pct >= 25) return { bg: 'rgba(252,128,25,0.5)',   text: '#2a1200', fw: '600' };
  return              { bg: 'rgba(255,90,101,0.55)',  text: '#2a0a0a', fw: '600' };
}

// ── CohortMatrix ──────────────────────────────────────────────────────────────
function CohortMatrix({ data }) {
  const { cohorts, weeks } = data;
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.3)' }}>
      <div className="px-4 py-3 border-b flex items-center justify-between"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: '#4F80FF' }}>Cohort Retention Matrix</p>
          <p className="font-mono text-[9px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>8-week rolling · Swiggy North Bangalore · Oct 2024</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono">
          {[{ color: 'rgba(61,214,140,0.8)', label: '≥70%' }, { color: 'rgba(245,166,35,0.6)', label: '40–70%' }, { color: 'rgba(255,90,101,0.6)', label: '<40%' }].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto p-3">
        <table className="w-full border-collapse" style={{ minWidth: 560 }}>
          <thead>
            <tr>
              <th className="text-left font-mono text-[10px] pb-2 pr-3" style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 500, minWidth: 160 }}>Cohort</th>
              {weeks.map(w => (
                <th key={w} className="font-mono text-[10px] pb-2 px-1 text-center" style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 500, minWidth: 52 }}>{w}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohorts.map((row, ri) => (
              <tr key={ri}>
                <td className="font-mono text-[11px] py-1 pr-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {row.label}
                  <div className="font-mono text-[9px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>n={row.size}</div>
                </td>
                {row.values.map((val, ci) => {
                  const c = retentionColor(val);
                  return (
                    <td key={ci} className="py-1 px-0.5">
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: ri * 0.06 + ci * 0.03 }}
                        className="rounded text-center font-mono font-bold"
                        style={{ background: c.bg, color: c.text, fontWeight: c.fw, padding: '4px 2px', fontSize: 11, minWidth: 44 }}>
                        {val}%
                      </motion.div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.insight && (
        <div className="px-4 py-2.5 border-t flex items-start gap-2"
          style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(252,128,25,0.04)' }}>
          <span style={{ color: '#FC8019', fontSize: 11, marginTop: 1, flexShrink: 0 }}>△</span>
          <p className="font-mono text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{data.insight}</p>
        </div>
      )}
    </div>
  );
}

// ── FunnelAnalysis ────────────────────────────────────────────────────────────
function FunnelAnalysis({ data }) {
  const maxCount = Math.max(...data.steps.map(s => s.count));
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.3)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: '#FC8019' }}>{data.title || 'Funnel Analysis'}</p>
        <p className="font-mono text-[9px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{data.subtitle || 'Step-by-step drop-off with delta indicators'}</p>
      </div>
      <div className="p-4 space-y-2">
        {data.steps.map((step, i) => {
          const barWidth = (step.count / maxCount) * 100;
          const prev = data.steps[i - 1];
          const dropPct = prev ? Math.round(((prev.count - step.count) / prev.count) * 100) : null;
          return (
            <div key={i}>
              {dropPct !== null && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 py-1 pl-4">
                  <div className="w-0.5 h-4 rounded" style={{ background: 'rgba(255,255,255,0.1)' }} />
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded"
                    style={{ color: dropPct > 30 ? '#FF5A65' : dropPct > 15 ? '#F5A623' : '#3DD68C', background: dropPct > 30 ? 'rgba(255,90,101,0.1)' : dropPct > 15 ? 'rgba(245,166,35,0.1)' : 'rgba(61,214,140,0.1)', border: `1px solid ${dropPct > 30 ? 'rgba(255,90,101,0.2)' : dropPct > 15 ? 'rgba(245,166,35,0.2)' : 'rgba(61,214,140,0.2)'}` }}>
                    ↓ {dropPct}% drop
                  </span>
                  {step.dropNote && <span className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>— {step.dropNote}</span>}
                </motion.div>
              )}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 font-mono text-[10px] font-bold"
                  style={{ background: i === 0 ? 'rgba(252,128,25,0.15)' : 'rgba(255,255,255,0.05)', color: i === 0 ? '#FC8019' : 'rgba(255,255,255,0.4)', border: `1px solid ${i === 0 ? 'rgba(252,128,25,0.25)' : 'rgba(255,255,255,0.08)'}` }}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[12px]" style={{ color: 'rgba(255,255,255,0.8)' }}>{step.label}</span>
                    <span className="font-mono text-[11px] font-bold" style={{ color: step.highlight ? '#FC8019' : 'rgba(255,255,255,0.6)' }}>{step.count.toLocaleString()}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div className="h-full rounded-full"
                      style={{ background: i === 0 ? 'linear-gradient(90deg, #FC8019, #FF6B35)' : step.highlight ? 'linear-gradient(90deg, #FF5A65, #e04050)' : 'rgba(30,79,204,0.7)' }}
                      initial={{ width: 0 }} animate={{ width: `${barWidth}%` }}
                      transition={{ delay: i * 0.08 + 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
      {data.insight && (
        <div className="px-4 py-2.5 border-t flex items-start gap-2"
          style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(252,128,25,0.04)' }}>
          <span style={{ color: '#FC8019', fontSize: 11, flexShrink: 0, marginTop: 1 }}>◈</span>
          <p className="font-mono text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{data.insight}</p>
        </div>
      )}
    </div>
  );
}

// ── MetricCards ───────────────────────────────────────────────────────────────
function MetricCards({ data }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {data.map((m, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
          className="rounded-xl p-4"
          style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${m.positive ? 'rgba(61,214,140,0.2)' : 'rgba(255,90,101,0.2)'}` }}>
          <p className="font-mono text-[10px] mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{m.label}</p>
          <p className="font-mono text-xl font-bold" style={{ color: m.positive ? '#3DD68C' : '#FF5A65' }}>{m.value}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded"
              style={{ background: m.positive ? 'rgba(61,214,140,0.1)' : 'rgba(255,90,101,0.1)', color: m.positive ? '#3DD68C' : '#FF5A65' }}>
              {m.delta}
            </span>
            <span className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{m.note}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Dirty Data Warning ────────────────────────────────────────────────────────
const DIRTY_ISSUE = {
  message: "Hold on. Before you build a hypothesis on this data — I need you to check something. The events table has a known 4-hour logging lag in the North Bangalore cluster. If you're looking at today's numbers, you're missing the last 4 hours of orders. That's potentially 14,000 transactions. Do you want to build a strategy on incomplete data?",
  technical: 'Logging lag detected: prod.events WHERE cluster=north_bangalore AND event_ts > NOW() - INTERVAL 4 HOUR → 0 rows (expected ~14K). Known infrastructure issue — BigQuery ingestion delay. Ticket: ENG-4821.',
};

function DirtyDataWarning({ onAcknowledge }) {
  const [ack, setAck] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl overflow-hidden mb-4"
      style={{ border: '1px solid rgba(245,166,35,0.4)', background: 'rgba(245,166,35,0.04)' }}>
      <div className="px-4 py-3 flex items-center gap-3"
        style={{ background: 'rgba(245,166,35,0.08)', borderBottom: '1px solid rgba(245,166,35,0.2)' }}>
        <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ color: '#F5A623', fontSize: 16 }}>⚠</motion.span>
        <span className="font-mono text-[11px] font-bold uppercase tracking-widest" style={{ color: '#F5A623' }}>Data Sanity Warning · Arjun Detected Anomaly</span>
      </div>
      <div className="px-4 py-4">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0"
            style={{ background: 'rgba(252,128,25,0.1)', border: '1px solid rgba(252,128,25,0.3)', color: '#FC8019' }}>AJ</div>
          <div>
            <p className="font-mono text-[10px] mb-1" style={{ color: '#FC8019' }}>Arjun · Staff Analyst</p>
            <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>{DIRTY_ISSUE.message}</p>
            <div className="mt-2 px-3 py-2 rounded-lg font-mono text-[11px] leading-relaxed"
              style={{ background: 'rgba(0,0,0,0.4)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {DIRTY_ISSUE.technical}
            </div>
          </div>
        </div>
        {!ack ? (
          <div className="flex items-center gap-3">
            <motion.button onClick={() => { setAck(true); onAcknowledge('corrected'); }}
              className="flex-1 py-2.5 rounded-xl font-mono text-sm font-bold"
              style={{ background: 'rgba(61,214,140,0.12)', border: '1px solid rgba(61,214,140,0.3)', color: '#3DD68C' }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              ✓ Acknowledge — adjust for lag
            </motion.button>
            <motion.button onClick={() => { setAck(true); onAcknowledge('ignored'); }}
              className="px-4 py-2.5 rounded-xl font-mono text-sm"
              style={{ background: 'rgba(255,90,101,0.08)', border: '1px solid rgba(255,90,101,0.2)', color: '#FF5A65' }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              Proceed anyway
            </motion.button>
          </div>
        ) : (
          <p className="font-mono text-[11px] px-3 py-2 rounded-lg"
            style={{ background: 'rgba(61,214,140,0.06)', color: '#3DD68C', border: '1px solid rgba(61,214,140,0.15)' }}>
            ✓ Good catch. Adjusted for 4-hour logging lag.
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ── NL Response data ──────────────────────────────────────────────────────────
const NL_RESPONSES = {
  cohort: {
    type: 'cohort',
    data: {
      cohorts: [
        { label: 'New users (first order)',        size: '42.3K', values: [100, 74, 61, 52, 47, 44, 41, 38] },
        { label: 'Returning users (2–10 orders)',  size: '891K',  values: [100, 82, 71, 65, 60, 58, 55, 53] },
        { label: 'Resurrected users (>30d gap)',   size: '124K',  values: [100, 69, 58, 49, 45, 41, 39, 36] },
        { label: 'Power users (>20 orders/month)', size: '67K',   values: [100, 94, 90, 88, 85, 83, 82, 81] },
        { label: 'North BLR Biryani cohort',       size: '18.5K', values: [100, 71, 55, 43, 34, 28, 24, 21] },
      ],
      weeks: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
      insight: 'North BLR Biryani cohort drops to 21% at W8 vs 53% for returning users — a 32pp gap directly attributable to restaurant quality decay + Zomato competitive pressure.',
    },
  },
  funnel: {
    type: 'funnel',
    data: {
      title: 'Swiggy App Order Funnel · North Bangalore · Oct 14–21',
      subtitle: 'Session → Order conversion with drop-off analysis',
      steps: [
        { label: 'App sessions',          count: 482000 },
        { label: 'Search / browse',       count: 341000, dropNote: 'intent filter' },
        { label: 'Restaurant page views', count: 218000, dropNote: 'availability + rating' },
        { label: 'Menu views',            count: 149000, dropNote: 'pricing + ETA friction' },
        { label: 'Add to cart',           count: 87000,  dropNote: 'commitment gate' },
        { label: 'Payment initiated',     count: 61000,  dropNote: 'checkout friction' },
        { label: 'Order confirmed',       count: 52000,  dropNote: 'payment success' },
      ],
      insight: 'The biggest drop is Restaurant → Menu (31%). Cross-referencing with complaint data: 72% of abandoned sessions at this step had restaurants with avg_rating < 3.8.',
    },
  },
  ltv: {
    type: 'metric_cards',
    data: [
      { label: 'LTV (Returning cohort)',        value: '₹31.7Cr', delta: '+2.8%',  positive: true,  note: '12-month projected' },
      { label: 'LTV (New restaurant users)',    value: '₹12.4Cr', delta: '-18.3%', positive: false, note: '12-month projected' },
      { label: 'CAC (Biryani segment)',         value: '₹340',    delta: '+28%',   positive: false, note: 'vs ₹265 baseline' },
      { label: 'Recovery opportunity',         value: '₹28L/mo', delta: 'recoverable', positive: true, note: 'if restaurant quality fixed' },
    ],
  },
};

function parseNLQuery(query) {
  const q = query.toLowerCase();
  if (q.includes('cohort') || q.includes('retention')) return NL_RESPONSES.cohort;
  if (q.includes('funnel') || q.includes('drop') || q.includes('conversion')) return NL_RESPONSES.funnel;
  if (q.includes('ltv') || q.includes('cac') || q.includes('unit') || q.includes('economics')) return NL_RESPONSES.ltv;
  if (q.includes('sanit') || q.includes('dirty') || q.includes('lag') || q.includes('incomplete')) return { isDirty: true };
  return null;
}

const SUGGESTIONS = [
  'Show me cohort retention for new vs resurrected users',
  'Funnel drop-off analysis this week',
  'LTV/CAC breakdown for Biryani segment',
  'Check data sanity before my analysis',
];

// ── Main ──────────────────────────────────────────────────────────────────────
export default function StrategicWorkbench({ phase = 2, dirtyDataTriggered = false, onDirtyDataAck, className = '' }) {
  const [query, setQuery]       = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [showDirtyWarning, setShowDirtyWarning] = useState(false);
  const [dirtyAck, setDirtyAck] = useState(null);
  const bottomRef = useRef(null);
  const { callArjun } = useArjun();

  const submit = useCallback(async (q) => {
    const text = (q || query).trim();
    if (!text) return;
    setQuery('');
    setLoading(true);
    const parsed = parseNLQuery(text);

    if (parsed?.isDirty) {
      setShowDirtyWarning(true);
      setResponses(prev => [...prev, { type: 'nl_request', text }]);
      setLoading(false);
      return;
    }

    setResponses(prev => [...prev, { type: 'nl_request', text }]);
    await new Promise(r => setTimeout(r, 900));

    if (parsed) {
      setResponses(prev => [...prev, { ...parsed, id: Date.now() }]);
    } else {
      const arjunRes = await callArjun(`Strategic data request: ${text}`, 'sql');
      setResponses(prev => [...prev, { type: 'arjun_text', text: arjunRes, id: Date.now() }]);
    }
    setLoading(false);
  }, [query, callArjun]);

  useEffect(() => {
    if (dirtyDataTriggered && !showDirtyWarning && responses.length > 2) {
      setShowDirtyWarning(true);
    }
  }, [responses.length, dirtyDataTriggered, showDirtyWarning]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [responses, loading]);

  return (
    <div className={`rounded-2xl overflow-hidden ${className}`}
      style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)' }}>
      {/* Header */}
      <div className="px-4 py-3.5 flex items-center justify-between border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold"
            style={{ background: 'rgba(252,128,25,0.12)', border: '1px solid rgba(252,128,25,0.25)', color: '#FC8019' }}>◈</div>
          <div>
            <p className="font-mono text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.8)' }}>Strategic Workbench</p>
            <p className="font-mono text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Natural language → high-fidelity analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full" style={{ background: '#3DD68C' }} />
          <span className="font-mono text-[10px]" style={{ color: '#3DD68C' }}>live</span>
        </div>
      </div>

      {/* Stream */}
      <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
        {responses.length === 0 && (
          <div className="py-8 text-center">
            <p className="font-mono text-[12px] mb-4" style={{ color: 'rgba(255,255,255,0.25)' }}>Ask Arjun for data in plain English</p>
            <div className="flex flex-col gap-2 max-w-sm mx-auto">
              {SUGGESTIONS.map(s => (
                <motion.button key={s} onClick={() => submit(s)} className="text-left px-3 py-2.5 rounded-xl font-mono text-[11px] leading-relaxed"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)' }}
                  whileHover={{ borderColor: 'rgba(252,128,25,0.3)', color: 'rgba(255,255,255,0.7)', x: 2 }}>
                  <span style={{ color: '#FC8019', marginRight: 6 }}>→</span>{s}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {responses.map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {r.type === 'nl_request' && (
              <div className="flex justify-end">
                <div className="rounded-xl px-4 py-2.5 font-mono text-[12px] max-w-sm"
                  style={{ background: 'rgba(30,79,204,0.12)', border: '1px solid rgba(30,79,204,0.25)', color: '#4F80FF' }}>
                  {r.text}
                </div>
              </div>
            )}
            {r.type === 'cohort' && <CohortMatrix data={r.data} />}
            {r.type === 'funnel' && <FunnelAnalysis data={r.data} />}
            {r.type === 'metric_cards' && <MetricCards data={r.data} />}
            {r.type === 'arjun_text' && (
              <div className="rounded-xl px-4 py-3.5 border-l-2"
                style={{ background: 'rgba(252,128,25,0.05)', border: '1px solid rgba(252,128,25,0.15)', borderLeft: '2px solid #FC8019' }}>
                <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: '#FC8019' }}>Arjun</p>
                <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{r.text}</p>
              </div>
            )}
          </motion.div>
        ))}

        <AnimatePresence>
          {showDirtyWarning && !dirtyAck && (
            <DirtyDataWarning
              onAcknowledge={(choice) => {
                setDirtyAck(choice);
                setShowDirtyWarning(false);
                onDirtyDataAck?.(choice);
                if (choice === 'ignored') {
                  setTimeout(() => {
                    setResponses(prev => [...prev, {
                      type: 'arjun_text',
                      text: "You proceeded without correcting for the logging lag. I flagged this for a reason. Any metric you've calculated in the last 4 hours is missing ~14,000 transactions. If you take this to the VP, that's not a minor oversight — that's the entire North BLR recovery story. Why didn't you adjust?",
                      id: Date.now(),
                    }]);
                  }, 800);
                }
              }}
            />
          )}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 py-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold"
              style={{ background: 'rgba(252,128,25,0.1)', border: '1px solid rgba(252,128,25,0.25)', color: '#FC8019' }}>AJ</div>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map(i => (
                <motion.span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: '#FC8019' }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.12 }} />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
        <div className="flex gap-2">
          <input value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && submit()}
            placeholder="Ask Arjun for data... (e.g. 'show me cohort retention')"
            className="flex-1 rounded-xl px-4 py-2.5 outline-none font-mono text-sm"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', fontSize: 12 }}
            onFocus={e => e.target.style.borderColor = 'rgba(252,128,25,0.4)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
          <motion.button onClick={() => submit()} disabled={!query.trim()}
            className="px-4 py-2.5 rounded-xl font-mono text-sm font-bold"
            style={{ background: query.trim() ? '#FC8019' : 'rgba(255,255,255,0.04)', color: query.trim() ? 'white' : 'rgba(255,255,255,0.2)', border: '1px solid transparent' }}
            whileHover={query.trim() ? { scale: 1.05 } : {}} whileTap={query.trim() ? { scale: 0.95 } : {}}>
            ↵
          </motion.button>
        </div>
        <p className="mt-1.5 font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Try: cohort retention · funnel analysis · LTV/CAC · data sanity check
        </p>
      </div>
    </div>
  );
}
