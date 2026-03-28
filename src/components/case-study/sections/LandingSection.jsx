import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const COMPANIES = ['Swiggy', 'Razorpay', 'Flipkart', 'Zomato', 'PhonePe', 'Uber', 'Meta'];

export default function LandingSection({ onStart }) {
  const [visible, setVisible] = useState(false);
  const [companyIdx, setCompanyIdx] = useState(0);

  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);
  useEffect(() => { const iv = setInterval(() => setCompanyIdx(i => (i + 1) % COMPANIES.length), 1800); return () => clearInterval(iv); }, []);

  return (
    <div className="px-5 pt-10 pb-8" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}>

      <div className="flex items-center justify-center gap-2 mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        <p className="font-mono text-[10px] font-semibold tracking-widest uppercase text-center" style={{ color: 'var(--ink3)' }}>
          For analysts targeting{' '}
          <span key={companyIdx} className="text-accent" style={{ display: 'inline-block', animation: 'blockEnter 0.3s ease forwards' }}>
            {COMPANIES[companyIdx]}
          </span>
        </p>
      </div>

      <h1 className="font-mono text-center mb-4 leading-[1.1] tracking-tight font-bold"
        style={{ fontSize: 'clamp(24px,5.5vw,42px)', color: 'var(--ink)' }}>
        The AI writes the code.
        <br />
        <span style={{ background: 'linear-gradient(90deg, #FC8019, #FF6B35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Are you prepared to
        </span>
        <br />
        make the decision?
      </h1>

      <p className="font-mono text-center mb-6 text-[13px] leading-relaxed"
        style={{ color: 'rgba(255,255,255,0.45)', maxWidth: 380, margin: '0 auto 24px' }}>
        In 2026, syntax is free. Strategy is expensive. Master the frameworks used by PMs and Strategy Leads at Uber, Swiggy, and Meta.{' '}
        <span style={{ color: '#FC8019' }}>No code. Just logic and impact.</span>
      </p>

      {/* War Room entry card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-2xl p-5 mb-5"
        style={{ background: 'rgba(252,128,25,0.05)', border: '1px solid rgba(252,128,25,0.2)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-2 mb-3">
          <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full" style={{ background: '#FF5A65' }} />
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: '#FF5A65' }}>
            War Room Active · Swiggy Orders Incident
          </span>
        </div>
        <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
          A live ₹28L/month incident. 6 strategic milestones. Arjun will push back on every shallow answer. No hints — just decisions.
        </p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[{ label: '6 Milestones', icon: '◎' }, { label: 'Dirty Data Trap', icon: '⚠' }, { label: 'VP Brief', icon: '✦' }].map(item => (
            <div key={item.label} className="rounded-lg px-2 py-2 text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="font-mono text-base mb-0.5" style={{ color: '#FC8019' }}>{item.icon}</div>
              <div className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Myth-busting card */}
      <div className="rounded-2xl p-5 mb-5 block-enter block-enter-1" style={{ background: 'var(--surface2)', border: '1px solid var(--border2)' }}>
        <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>The answer is not:</p>
        <div className="space-y-2.5 mb-4">
          {['SQL fluency — every candidate who applies can write queries', "Dashboard experience — that's table stakes", "Knowing frameworks — interviewers see these every day"].map((t, i) => (
            <div key={i} className="flex items-start gap-3 block-enter" style={{ animationDelay: `${i * 80 + 200}ms`, opacity: 0 }}>
              <span className="text-[#FF5A65] font-bold text-lg flex-shrink-0 leading-none mt-0.5">×</span>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{t}</p>
            </div>
          ))}
        </div>
        <div className="h-px mb-4" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="flex items-start gap-3">
          <span className="text-[#3DD68C] font-bold text-lg flex-shrink-0 leading-none mt-0.5">→</span>
          <p className="text-sm font-medium leading-relaxed" style={{ color: 'white' }}>
            It's how you think through ambiguous problems — structured, fast, under pressure.
          </p>
        </div>
      </div>

      <button onClick={onStart}
        className="w-full flex items-center justify-center gap-2 py-4 text-white font-bold rounded-xl text-[15px] btn-depress transition-all duration-150 hover:-translate-y-px"
        style={{ background: 'linear-gradient(135deg, #FC8019, #e06a0e)', boxShadow: '0 8px 32px rgba(252,128,25,0.35)', fontFamily: 'monospace', letterSpacing: '0.02em' }}>
        <span style={{ fontSize: 16 }}>⚡</span>
        Enter the War Room — free
      </button>
      <p className="text-center font-mono text-[11px] mt-2" style={{ color: 'var(--ink3)' }}>
        No signup · No credit card · ~45 min · Portfolio link at the end
      </p>
    </div>
  );
}
