// src/components/strategy/components/StrategyMemo.jsx
// Phase 3 — Portfolio asset: auto-generates an Executive Memo with unique link

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ExternalLink, FileText } from 'lucide-react';

const MEMO_TEMPLATE = `INVESTIGATION MEMO
Incident: North Bangalore Order Drop (8.3% WoW)
Analyst: [Your Name] | Date: {date}

── EXECUTIVE SUMMARY ──────────────────────────────────────────
An 8.3% WoW decline in Tuesday orders across North Bangalore was
traced to two concurrent root causes: a conversion funnel breakdown
at the Add-to-Cart stage (–11.5pp vs LW) and accelerated churn in
Weeks 4–6 new-user cohorts (30% faster than baseline).

── ROOT CAUSE ANALYSIS ────────────────────────────────────────
Primary: Add-to-Cart drop suggests Biryani restaurant availability
issues in North Bangalore — likely a supply-side constraint, not
demand-side. Menu availability on high-reorder SKUs dropped ~18%
during peak hours (6–9 PM Tuesday).

Secondary: New user cohorts from Weeks 4–6 show a retention cliff
at Week 1 (44–48% vs 58% baseline). First-time experience
degradation — likely linked to same supply issue — is driving
permanent churn before habit formation.

── IMPACT SIZING ──────────────────────────────────────────────
Direct GMV loss (this week): ₹19L
Annualized cohort churn impact (expected case, 65% recovery): ₹2.07Cr
Total recoverable GMV over 12 months: ₹2.4–3.1Cr

── RECOMMENDED INTERVENTIONS ──────────────────────────────────
1. Immediate (48h): Restaurant supply audit for Biryani category,
   North Bangalore. Activate 15 backup restaurants for peak hours.
2. Short-term (2 weeks): Implement menu availability SLA with top
   20 North Bangalore restaurants. Alert system if <80% in-stock.
3. Strategic (6 weeks): Early-warning cohort retention dashboard.
   Trigger intervention (discount/outreach) if W1 retention <50%.

── CONFIDENCE & ASSUMPTIONS ───────────────────────────────────
High confidence: Funnel data is consistent with supply hypothesis.
Medium confidence: Cohort drop linked to same root cause (correlation,
not confirmed causation). Requires restaurant supply data cross-check.
Assumption: ₹385 AOV, 2.1 orders/week per active user holds steady.

This memo was generated via the OneStopCareers Strategic Simulator.`;

export default function StrategyMemo({ onComplete }) {
  const [name, setName] = useState('');
  const [step, setStep] = useState('name'); // name | generating | done
  const [memoText, setMemoText] = useState('');
  const [memoUrl, setMemoUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!name.trim()) return;
    setStep('generating');

    const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const filled = MEMO_TEMPLATE
      .replace('[Your Name]', name.trim())
      .replace('{date}', date);

    const id = `osc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;
    const url = `${window.location.origin}/portfolio/${id}`;

    // Simulate generation delay
    setTimeout(() => {
      setMemoText(filled);
      setMemoUrl(url);
      setStep('done');
      onComplete && onComplete({ memo: filled, url });
    }, 2200);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(memoUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (step === 'name') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          borderRadius: 20, padding: 28,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(61,214,140,0.12)', border: '1px solid rgba(61,214,140,0.25)',
          }}>
            <FileText size={20} style={{ color: 'var(--green)' }} />
          </div>
          <div>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: 4 }}>
              Phase 3 Complete — Portfolio Asset
            </p>
            <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 6 }}>
              Generate your Investigation Memo
            </h3>
            <p style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.6 }}>
              This becomes a shareable link you can paste in job applications.
              It shows you can triage incidents, size impact, and communicate strategy — not just write queries.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>
              Your name (for the memo)
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generate()}
              placeholder="e.g. Rahul Sharma"
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink)',
                outline: 'none', boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(61,214,140,0.45)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
            />
          </div>
          <button
            onClick={generate}
            disabled={!name.trim()}
            style={{
              padding: '10px 24px', borderRadius: 10,
              background: name.trim() ? 'var(--green)' : 'rgba(255,255,255,0.06)',
              color: name.trim() ? '#080810' : 'var(--ink3)',
              border: 'none', cursor: name.trim() ? 'pointer' : 'default',
              fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 700,
              whiteSpace: 'nowrap', transition: 'all 0.2s',
            }}
          >
            Generate Memo →
          </button>
        </div>
      </motion.div>
    );
  }

  if (step === 'generating') {
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{
          borderRadius: 20, padding: 40, textAlign: 'center',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          style={{
            width: 40, height: 40, borderRadius: '50%',
            border: '2px solid rgba(61,214,140,0.15)',
            borderTop: '2px solid var(--green)',
            margin: '0 auto 16px',
          }}
        />
        <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink2)' }}>
          Compiling your investigation memo…
        </p>
        {['Analysing funnel findings', 'Sizing cohort impact', 'Drafting executive summary'].map((s, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.6 + 0.3 }}
            style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', marginTop: 4 }}
          >
            ✓ {s}
          </motion.p>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      {/* Success banner */}
      <div style={{
        padding: '16px 20px', borderRadius: 16,
        background: 'rgba(61,214,140,0.08)',
        border: '1px solid rgba(61,214,140,0.25)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(61,214,140,0.15)', border: '1px solid rgba(61,214,140,0.3)',
          fontSize: 16,
        }}>✓</div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: 2 }}>
            Memo Generated — Portfolio Ready
          </p>
          <p style={{ fontSize: 12, color: 'var(--ink2)' }}>
            This is what a Day-Zero analyst looks like. Paste this link in your next job application.
          </p>
        </div>
      </div>

      {/* URL copy */}
      <div style={{
        display: 'flex', gap: 10, alignItems: 'center',
        padding: '12px 16px', borderRadius: 12,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.09)',
      }}>
        <ExternalLink size={14} style={{ color: 'var(--ink3)', flexShrink: 0 }} />
        <span style={{
          flex: 1, fontFamily: 'var(--mono)', fontSize: 12,
          color: 'var(--ink2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{memoUrl}</span>
        <button
          onClick={copyUrl}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '6px 14px', borderRadius: 8,
            background: copied ? 'var(--green)' : 'rgba(255,255,255,0.08)',
            border: 'none', cursor: 'pointer',
            fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
            color: copied ? '#080810' : 'var(--ink2)',
            transition: 'all 0.2s', flexShrink: 0,
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>

      {/* Memo preview */}
      <div style={{
        borderRadius: 16, overflow: 'hidden',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          padding: '10px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          background: 'rgba(8,8,16,0.4)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {['#FF5F57','#FFBD2E','#28CA41'].map(c => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
            ))}
          </div>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', marginLeft: 4 }}>
            investigation-memo.txt
          </span>
        </div>
        <pre style={{
          padding: '16px 20px',
          fontFamily: 'var(--mono)', fontSize: 11, lineHeight: 1.75,
          color: 'var(--ink2)', whiteSpace: 'pre-wrap',
          margin: 0, maxHeight: 320, overflowY: 'auto',
        }}
          className="custom-scrollbar"
        >
          {memoText}
        </pre>
      </div>

      {/* Completion CTA */}
      <a href="/jobs" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '14px 24px', borderRadius: 12,
        background: 'var(--phase1)', color: '#fff',
        fontFamily: 'var(--sans)', fontWeight: 700, fontSize: 15,
        textDecoration: 'none',
        boxShadow: '0 0 0 1px rgba(252,128,25,0.4), 0 6px 24px rgba(252,128,25,0.28)',
        transition: 'all 0.2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(252,128,25,0.6), 0 12px 36px rgba(252,128,25,0.42)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(252,128,25,0.4), 0 6px 24px rgba(252,128,25,0.28)'; }}
      >
        Now apply to the roles that need this skill →
      </a>
    </motion.div>
  );
}
