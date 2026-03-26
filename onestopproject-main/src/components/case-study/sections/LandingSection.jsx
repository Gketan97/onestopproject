import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const COMPANIES = ['Swiggy', 'Razorpay', 'Flipkart', 'Zomato', 'PhonePe', 'Uber'];

export default function LandingSection({ onStart }) {
  const [visible, setVisible] = useState(false);
  const [companyIdx, setCompanyIdx] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setCompanyIdx(i => (i + 1) % COMPANIES.length), 1800);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="px-5 pt-10 pb-8" style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(16px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
    }}>

      {/* Eyebrow */}
      <div className="flex items-center justify-center gap-2 mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        <p className="font-mono text-[10px] font-semibold tracking-widest uppercase text-center"
          style={{ color: 'var(--ink3)' }}>
          For analysts targeting{' '}
          <span key={companyIdx} className="text-accent"
            style={{ display: 'inline-block', animation: 'blockEnter 0.3s ease forwards' }}>
            {COMPANIES[companyIdx]}
          </span>
        </p>
      </div>

      {/* Hero headline */}
      <h1 className="font-serif text-center mb-6 leading-[1.08] tracking-tight"
        style={{ fontSize: 'clamp(28px,6vw,44px)', color: 'var(--ink)' }}>
        Do you know what separates analysts
        <br />
        who get{' '}
        <span style={{ color: 'var(--accent)' }}>₹28L offers</span>{' '}
        from those who don't?
      </h1>

      {/* Myth-busting dark card */}
      <div className="rounded-2xl p-5 mb-5 block-enter block-enter-1"
        style={{ background: 'var(--surface2)', border: '1px solid var(--border2)' }}>
        <p className="font-mono text-[10px] uppercase tracking-widest mb-3"
          style={{ color: 'rgba(255,255,255,0.3)' }}>The answer is not:</p>
        <div className="space-y-2.5 mb-4">
          {[
            'SQL fluency — every candidate who applies can write queries',
            'Dashboard experience — that\'s table stakes',
            'Knowing frameworks — interviewers see these every day',
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-3 block-enter"
              style={{ animationDelay: `${i * 80 + 200}ms`, opacity: 0 }}>
              <span className="text-[#FF5A65] font-bold text-lg flex-shrink-0 leading-none mt-0.5">×</span>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{t}</p>
            </div>
          ))}
        </div>
        <div className="h-px mb-4" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="flex items-start gap-3">
          <span className="text-[#3DD68C] font-bold text-lg flex-shrink-0 leading-none mt-0.5">→</span>
          <p className="text-sm font-medium leading-relaxed" style={{ color: 'white' }}>
            It's how they think through an ambiguous problem — structured, fast, without being told what to look at next.
          </p>
        </div>
      </div>

      {/* Phase preview cards */}
      <div className="space-y-2.5 mb-6">
        {[
          {
            num: '01', phase: 'Watch', time: '~20 min',
            title: 'Investigate alongside a pro',
            desc: 'A 10-year Swiggy analyst works a live incident. Predict his moves before every step.',
            color: 'var(--phase1)', bg: 'rgba(200,75,12,0.06)', border: 'rgba(200,75,12,0.18)',
          },
          {
            num: '02', phase: 'Practice', time: '~25 min',
            title: 'Your investigation — blank editor',
            desc: 'Same company, new problem. You write the SQL. Arjun evaluates your actual queries.',
            color: '#4F80FF', bg: 'rgba(79,128,255,0.06)', border: 'rgba(79,128,255,0.18)',
          },
          {
            num: '03', phase: 'Execute', time: '~10 min',
            title: 'Write the VP message',
            desc: 'No hints. Open questions. Closest thing to the real job.',
            color: '#3DD68C', bg: 'rgba(61,214,140,0.06)', border: 'rgba(61,214,140,0.18)',
          },
        ].map((p, i) => (
          <div key={p.num} className="rounded-xl p-4 relative overflow-hidden block-enter"
            style={{
              background: p.bg, border: `1px solid ${p.border}`,
              animationDelay: `${i * 80 + 400}ms`, opacity: 0,
            }}>
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: p.color }} />
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] font-bold" style={{ color: p.color }}>{p.num}</span>
                  <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ color: p.color, background: `${p.color}18`, border: `1px solid ${p.border}` }}>
                    {p.phase}
                  </span>
                </div>
                <p className="text-[13px] font-semibold mb-0.5" style={{ color: 'var(--ink)' }}>{p.title}</p>
                <p className="text-[12px] leading-relaxed" style={{ color: 'var(--ink2)' }}>{p.desc}</p>
              </div>
              <span className="font-mono text-[10px] flex-shrink-0 mt-1" style={{ color: 'var(--ink3)' }}>{p.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        className="w-full flex items-center justify-center gap-2 py-4 text-white font-semibold rounded-xl text-[15px] btn-depress transition-all duration-150 hover:-translate-y-px"
        style={{ background: 'var(--accent)', boxShadow: '0 4px 24px rgba(200,75,12,0.3)', fontSize: '15px' }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-dark)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
      >
        Start the Swiggy investigation — free
        <ArrowRight size={16} />
      </button>
      <p className="text-center text-[11px] mt-2" style={{ color: 'var(--ink3)' }}>
        No signup · No credit card · Portfolio link at the end
      </p>
    </div>
  );
}
