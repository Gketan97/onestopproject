/**
 * IncidentContext.jsx
 * Pre-investigation war-room KPI dashboard.
 * Shown BEFORE Phase 1 — creates genuine pressure.
 * Features: animated KPI tiles, live alert feed, 3-phase preview, CTA gate.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function KpiTile({ label, value, delta, deltaColor, sub, icon, delay = 0 }) {
  const [counted, setCounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setCounted(true), delay); return () => clearTimeout(t); }, [delay]);
  const isNeg = deltaColor === 'red';
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: counted ? 1 : 0, y: counted ? 0 : 12 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="rounded-xl p-4"
      style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid ${isNeg ? 'rgba(255,90,101,0.18)' : 'rgba(255,255,255,0.07)'}`, backdropFilter: 'blur(12px)' }}>
      <div className="flex items-start justify-between mb-2">
        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
        {icon && <span style={{ fontSize: 14, opacity: 0.5 }}>{icon}</span>}
      </div>
      <p className="font-mono text-xl font-bold mb-1"
        style={{ color: isNeg ? '#FF5A65' : deltaColor === 'green' ? '#3DD68C' : 'rgba(255,255,255,0.9)' }}>
        {value}
      </p>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded"
          style={{ background: isNeg ? 'rgba(255,90,101,0.1)' : deltaColor === 'green' ? 'rgba(61,214,140,0.1)' : 'rgba(255,255,255,0.05)', color: isNeg ? '#FF5A65' : deltaColor === 'green' ? '#3DD68C' : 'rgba(255,255,255,0.4)' }}>
          {delta}
        </span>
        {sub && <span className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>{sub}</span>}
      </div>
    </motion.div>
  );
}

const ALERT_STREAM = [
  { time: '09:14', level: 'P1',   text: 'Orders WoW alert triggered: −8.3%',                        color: '#FF5A65' },
  { time: '09:17', level: 'INFO', text: 'North Bangalore cluster: Biryani segment −32.9%',           color: '#F5A623' },
  { time: '09:22', level: 'INFO', text: 'CRM notification log: suppression detected',                color: '#F5A623' },
  { time: '09:31', level: 'WARN', text: 'prod.events NB cluster: 4hr logging lag (ENG-4821)',        color: '#F5A623' },
  { time: '09:38', level: 'INFO', text: 'Zomato external event: 40% Biryani promo · North BLR',     color: '#4F80FF' },
  { time: '09:45', level: 'P2',   text: 'Restaurant complaint spike: Biryani Palace NB +290%',       color: '#FF5A65' },
  { time: '09:52', level: 'INFO', text: 'Returning user cohort: notification delivery 0 this week',  color: '#F5A623' },
  { time: '10:03', level: 'INFO', text: 'Weather data pull: no anomaly detected North BLR',          color: '#3DD68C' },
  { time: '10:14', level: 'WARN', text: 'LTV impact projection: −₹28L/month unresolved',             color: '#FF5A65' },
];

function AlertFeed() {
  const [visible, setVisible] = useState(1);
  const feedRef = useRef(null);
  useEffect(() => {
    const id = setInterval(() => {
      setVisible(v => {
        const next = Math.min(v + 1, ALERT_STREAM.length);
        setTimeout(() => feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' }), 50);
        return next;
      });
    }, 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <div ref={feedRef} className="rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.4)', maxHeight: 220, overflowY: 'auto' }}>
      <div className="px-3.5 py-2.5 border-b flex items-center gap-2"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', position: 'sticky', top: 0 }}>
        <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: '#FF5A65' }}
          animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: '#FF5A65' }}>
          Live Alert Feed · analytics-incident
        </span>
      </div>
      <div className="p-2">
        {ALERT_STREAM.slice(0, visible).map((a, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
            className="flex items-start gap-2 px-2 py-1.5 rounded-lg mb-0.5"
            style={{ background: i === visible - 1 ? `${a.color}08` : 'transparent' }}>
            <span className="font-mono text-[9px] flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>{a.time}</span>
            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded flex-shrink-0"
              style={{ background: `${a.color}15`, color: a.color, border: `1px solid ${a.color}30`, minWidth: 34, textAlign: 'center' }}>
              {a.level}
            </span>
            <span className="font-mono text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{a.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PhasePreviewStrip() {
  const PHASES = [
    { num: '01', label: 'Universal Logic',    time: '~20 min', color: '#FC8019', headline: '8.3% WoW order drop',     desc: 'Platform-wide. Funnel Friction and Demand-side causes. Watch Arjun decompose live.',    badge: 'Watch' },
    { num: '02', label: 'Domain Complexity',  time: '~25 min', color: '#4F80FF', headline: 'North BLR Biryani −32%',  desc: 'Fleet availability and Kitchen Latency. Supply-side constraints. Your investigation.',   badge: 'Practice' },
    { num: '03', label: 'Deep Unit Economics',time: '~10 min', color: '#3DD68C', headline: 'LTV/CAC · ₹28L recovery', desc: 'Competitive pricing wars, Data Sanity, and sizing the recovery opportunity.',              badge: 'Execute' },
  ];
  return (
    <div className="space-y-2">
      {PHASES.map((p, i) => (
        <motion.div key={p.num} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }}
          className="rounded-xl p-4 relative overflow-hidden"
          style={{ background: `${p.color}08`, border: `1px solid ${p.color}20` }}>
          <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: p.color, opacity: 0.5 }} />
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-[9px] font-bold" style={{ color: p.color }}>Phase {p.num}</span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full" style={{ color: p.color, background: `${p.color}15`, border: `1px solid ${p.color}25` }}>{p.badge}</span>
                <span className="font-mono text-[9px]" style={{ color: 'rgba(255,255,255,0.2)' }}>{p.label}</span>
              </div>
              <p className="font-mono text-sm font-bold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{p.headline}</p>
              <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{p.desc}</p>
            </div>
            <span className="font-mono text-[10px] flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>{p.time}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function IncidentContext({ onDone }) {
  const KPI_DATA = [
    { label: 'Orders this Tue',      value: '1,999K',  delta: '−8.3% WoW',  deltaColor: 'red',   sub: 'vs 2,180K avg', icon: '📦', delay: 200 },
    { label: 'Returning users',      value: '1.24M',   delta: '−13.8%',     deltaColor: 'red',   sub: 'critical',      icon: '👥', delay: 300 },
    { label: 'Resurrected users',    value: '430K',    delta: '+24.8%',     deltaColor: 'green', sub: 're-engaged',    icon: '🔄', delay: 400 },
    { label: 'NB Biryani orders',    value: '12.4K',   delta: '−32.9%',     deltaColor: 'red',   sub: 'this week',     icon: '🍛', delay: 500 },
    { label: 'Zomato promo active',  value: '40% off', delta: 'COMPETITOR', deltaColor: 'amber', sub: 'North BLR',     icon: '⚡', delay: 600 },
    { label: 'LTV at risk',          value: '₹28L/mo', delta: 'UNRESOLVED', deltaColor: 'red',   sub: 'monthly',       icon: '△', delay: 700 },
  ];

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      {/* Incident header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden mb-6"
        style={{ border: '1px solid rgba(255,90,101,0.3)', background: 'rgba(255,90,101,0.04)' }}>
        <div className="px-5 py-4 border-b flex items-center justify-between"
          style={{ borderColor: 'rgba(255,90,101,0.15)', background: 'rgba(255,90,101,0.06)' }}>
          <div className="flex items-center gap-3">
            <motion.div className="w-2 h-2 rounded-full" style={{ background: '#FF5A65' }}
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }} />
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest" style={{ color: '#FF5A65' }}>
              P1 Incident · Swiggy Orders · Oct 21 2024
            </span>
          </div>
          <span className="font-mono text-[10px]" style={{ color: 'rgba(255,90,101,0.6)' }}>09:14 IST · OPEN</span>
        </div>
        <div className="px-5 py-4">
          <p className="font-mono text-base font-bold mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Orders are down 8.3% week-over-week.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Leadership noticed. Priya (VP Growth) needs root cause by EOD. Two separate causes are hidden in this data — one platform-side, one market-side. Your job: find both, quantify them, and write the brief.
          </p>
        </div>
      </motion.div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-6">
        {KPI_DATA.map(k => <KpiTile key={k.label} {...k} />)}
      </div>

      {/* Alert feed */}
      <div className="mb-6"><AlertFeed /></div>

      {/* Phase preview */}
      <div className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Investigation structure · 3 phases
        </p>
        <PhasePreviewStrip />
      </div>

      {/* Arjun brief */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="rounded-xl px-4 py-4 mb-6 border-l-2"
        style={{ background: 'rgba(252,128,25,0.05)', border: '1px solid rgba(252,128,25,0.2)', borderLeft: '2px solid #FC8019' }}>
        <p className="font-mono text-[9px] uppercase tracking-widest mb-2" style={{ color: '#FC8019' }}>Arjun · How we'll work</p>
        <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
          "In Phase 1, I'll investigate live — you predict every move. In Phase 2, same company, new problem — blank slate. In Phase 3, the VP message: no hints, open-ended, closest thing to the real job. One warning: there's dirty data in this dataset. If you skip the sanity check, I will call it out."
        </p>
      </motion.div>

      {/* CTA */}
      <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}
        onClick={onDone}
        className="w-full py-4 rounded-xl font-mono text-sm font-bold text-white"
        style={{ background: 'linear-gradient(135deg, #FC8019, #e06a0e)', boxShadow: '0 8px 32px rgba(252,128,25,0.35)', letterSpacing: '0.04em' }}
        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
        ⚡ Begin Phase 1 — Watch Arjun investigate
      </motion.button>
      <p className="font-mono text-center text-[10px] mt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>~20 min · Free · No signup</p>
    </div>
  );
}
