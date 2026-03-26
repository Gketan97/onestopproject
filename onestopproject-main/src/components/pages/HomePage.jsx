// src/components/pages/HomePage.jsx
// Redesigned homepage — bold, editorial, interview-first experience

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Users, Zap, ChevronRight } from 'lucide-react';

// ── Company data ─────────────────────────────────────────────────────────────
const COMPANIES = [
  { name: 'Swiggy',    abbr: 'SW', color: '#FC8019' },
  { name: 'Zomato',    abbr: 'ZO', color: '#E23744' },
  { name: 'Flipkart',  abbr: 'FL', color: '#2874F0' },
  { name: 'PhonePe',   abbr: 'PP', color: '#5F259F' },
  { name: 'CRED',      abbr: 'CR', color: '#1A1A1A' },
  { name: 'Meesho',    abbr: 'ME', color: '#9B4DCA' },
  { name: 'Razorpay',  abbr: 'RA', color: '#2B64F5' },
  { name: 'Google',    abbr: 'GO', color: '#4285F4' },
  { name: 'Amazon',    abbr: 'AM', color: '#FF9900' },
  { name: 'Microsoft', abbr: 'MS', color: '#00A4EF' },
  { name: 'Uber',      abbr: 'UB', color: '#000000' },
  { name: 'Atlassian', abbr: 'AT', color: '#0052CC' },
];

// ── Typing effect hook ────────────────────────────────────────────────────────
function useTypewriter(text, speed = 28, startDelay = 0) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(t);
  }, [text, speed, startDelay]);
  return { displayed, done };
}

// ── Live interview hero ───────────────────────────────────────────────────────
const INTERVIEW_Q = 'A user opens the Swiggy app, browses restaurants for 3–5 minutes, then closes without ordering. What are all the reasons that might happen?';
const ANSWER_OPTIONS = [
  { id: 'a', text: 'They got distracted by a notification.' },
  { id: 'b', text: 'No restaurants available in their area.' },
  { id: 'c', text: 'Payment failed on their previous order.' },
  { id: 'd', text: 'App crashed or loaded too slowly.' },
];

const InterviewHero = ({ onEngaged }) => {
  const [phase, setPhase] = useState('typing'); // typing | question | answered | revealed
  const [selected, setSelected] = useState(null);
  const { displayed: qText, done: qDone } = useTypewriter(INTERVIEW_Q, 18, 600);

  useEffect(() => {
    if (qDone) setPhase('question');
  }, [qDone]);

  const handleSelect = (id) => {
    if (phase !== 'question') return;
    setSelected(id);
    setPhase('answered');
    setTimeout(() => {
      setPhase('revealed');
      onEngaged && onEngaged();
    }, 700);
  };

  return (
    <div className="interview-hero">
      {/* Terminal header */}
      <div className="terminal-bar">
        <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
        <span className="terminal-label">INTERVIEW · SWIGGY ANALYTICS L2</span>
      </div>

      {/* Interviewer message */}
      <div className="message-row interviewer">
        <div className="avatar iv">IV</div>
        <div className="bubble">
          <div className="bubble-meta">Interviewer <span>· Product Analytics · Swiggy</span></div>
          <div className="bubble-text">
            {qText}
            {phase === 'typing' && <span className="cursor">▋</span>}
          </div>
        </div>
      </div>

      {/* Options */}
      {phase !== 'typing' && (
        <div className={`options-grid ${phase === 'revealed' ? 'faded' : ''}`}>
          <div className="options-label">— How do you respond?</div>
          {ANSWER_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={`option-btn ${selected === opt.id ? 'selected' : ''} ${phase === 'answered' || phase === 'revealed' ? 'locked' : ''}`}
            >
              <span className="opt-id">{opt.id.toUpperCase()}</span>
              <span>{opt.text}</span>
            </button>
          ))}
        </div>
      )}

      {/* Arjun reaction */}
      {phase === 'revealed' && (
        <div className="message-row arjun revealed-anim">
          <div className="avatar ar">AR</div>
          <div className="bubble arjun-bubble">
            <div className="bubble-meta">Arjun <span>· 10 years at Swiggy</span></div>
            <div className="bubble-text">
              That's one reason — but a senior analyst structures this into <strong>4 categories</strong>: demand, supply, platform, and external. You just picked platform friction. What's missing?
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Ticker ────────────────────────────────────────────────────────────────────
const Ticker = () => {
  const doubled = [...COMPANIES, ...COMPANIES];
  return (
    <div className="ticker-wrap">
      <div className="ticker-inner">
        {doubled.map((c, i) => (
          <div key={i} className="ticker-chip">
            <span className="ticker-abbr" style={{ background: c.color }}>{c.abbr}</span>
            <span className="ticker-name">{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Salary comparison ─────────────────────────────────────────────────────────
const SalaryBar = ({ label, lpa, max, color, delay }) => {
  const [filled, setFilled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFilled(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  const pct = (lpa / max) * 100;
  return (
    <div className="salary-row">
      <span className="salary-label">{label}</span>
      <div className="salary-track">
        <div
          className="salary-fill"
          style={{
            width: filled ? `${pct}%` : '0%',
            background: color,
            transition: `width 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
          }}
        />
      </div>
      <span className="salary-value" style={{ color }}>₹{lpa}L</span>
    </div>
  );
};

// ── Social proof numbers ─────────────────────────────────────────────────────
const STATS = [
  { icon: Users, value: '40k+', label: 'on WhatsApp' },
  { icon: Zap,   value: '4,200+', label: 'case studies done' },
  { icon: Clock, value: '45 min', label: 'to interview-ready' },
];

// ── Phase preview cards ────────────────────────────────────────────────────────
const PHASES = [
  {
    num: '01', tag: 'WATCH', color: '#C84B0C', bg: 'rgba(200,75,12,0.08)', border: 'rgba(200,75,12,0.2)',
    title: 'Investigate alongside a pro',
    desc: 'Arjun — 10 years at Swiggy — works a real incident live. Predict his next move before every step.',
    time: '~20 min',
  },
  {
    num: '02', tag: 'PRACTICE', color: '#1E4FCC', bg: 'rgba(30,79,204,0.08)', border: 'rgba(30,79,204,0.2)',
    title: 'Same company, your SQL',
    desc: 'Blank editor. New problem. Write the queries. Arjun evaluates your actual logic in real-time.',
    time: '~25 min',
  },
  {
    num: '03', tag: 'EXECUTE', color: '#1A6B45', bg: 'rgba(26,107,69,0.08)', border: 'rgba(26,107,69,0.2)',
    title: 'Write the VP message',
    desc: 'Open questions, no hints. Structure your findings into a message for the VP of Product.',
    time: '~10 min',
  },
];

// ── Main Component ─────────────────────────────────────────────────────────────
const HomePage = () => {
  const [engaged, setEngaged] = useState(false);
  const ctaRef = useRef(null);

  useEffect(() => {
    if (engaged && ctaRef.current) {
      setTimeout(() => ctaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 500);
    }
  }, [engaged]);

  return (
    <div className="hp-root">

      {/* ── HERO ── */}
      <section className="hp-hero">
        <div className="hp-hero-inner">

          {/* Left column — context + CTA */}
          <div className="hp-hero-left">
            <div className="hp-eyebrow">
              <span className="eyebrow-dot" />
              FOR ANALYSTS · TOP TECH COMPANIES
            </div>

            <h1 className="hp-h1">
              Stop preparing.<br />
              Start <em>performing.</em>
            </h1>

            <p className="hp-sub">
              The only platform where you investigate real data problems at real companies — the same way you'd do it on day one of the job.
            </p>

            {/* Stats row */}
            <div className="hp-stats">
              {STATS.map((s) => (
                <div key={s.label} className="hp-stat">
                  <s.icon size={14} className="stat-icon" />
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>

            <div className="hp-cta-row">
              <a href="/case-study/swiggy" className="hp-btn-primary">
                Try the Swiggy case — free
                <ArrowRight size={15} />
              </a>
              <Link to="/case-studies" className="hp-btn-ghost">
                See all cases <ChevronRight size={13} />
              </Link>
            </div>
            <p className="hp-fine">No signup · No credit card · Portfolio link at end</p>
          </div>

          {/* Right column — live interview terminal */}
          <div className="hp-hero-right">
            <div className="terminal-label-above">LIVE INTERVIEW SIMULATION</div>
            <InterviewHero onEngaged={() => setEngaged(true)} />
            {engaged && (
              <p className="terminal-nudge revealed-anim">
                This is how the case study starts. ↓
              </p>
            )}
          </div>

        </div>
      </section>

      {/* ── COMPANIES TICKER ── */}
      <section className="hp-ticker-section">
        <p className="ticker-caption">Analysts are getting hired right now at</p>
        <Ticker />
      </section>

      {/* ── SALARY REALITY CHECK ── */}
      <section className="hp-salary-section" ref={ctaRef}>
        <div className="hp-section-inner">
          <div className="section-eyebrow">THE SALARY GAP IS REAL</div>
          <h2 className="hp-h2">Same job title. Very different offers.</h2>
          <p className="hp-section-sub">What separates a ₹18L analyst from a ₹28L one has nothing to do with years of experience.</p>

          <div className="salary-widget">
            <SalaryBar label="Memorised frameworks" lpa={14} max={30} color="#9B9B8F" delay={200} />
            <SalaryBar label="SQL fluency" lpa={17} max={30} color="#9B9B8F" delay={350} />
            <SalaryBar label="Dashboard experience" lpa={18} max={30} color="#9B9B8F" delay={500} />
            <div className="salary-divider" />
            <SalaryBar label="Thinks through ambiguity fast" lpa={28} max={30} color="#C84B0C" delay={750} />
          </div>

          <div className="salary-insight">
            <span className="insight-arrow">→</span>
            <p>The ₹28L analyst doesn't just list reasons — they structure into categories, rank by probability × testability, and move fast without being told what to look at next.</p>
          </div>
        </div>
      </section>

      {/* ── 3 PHASES ── */}
      <section className="hp-phases-section">
        <div className="hp-section-inner">
          <div className="section-eyebrow">HOW IT WORKS</div>
          <h2 className="hp-h2">One case study. Three phases. Real skills.</h2>

          <div className="phases-grid">
            {PHASES.map((ph) => (
              <div key={ph.num} className="phase-card" style={{ '--ph-color': ph.color, '--ph-bg': ph.bg, '--ph-border': ph.border }}>
                <div className="phase-header">
                  <span className="phase-num" style={{ color: ph.color }}>{ph.num}</span>
                  <span className="phase-tag" style={{ color: ph.color, background: ph.bg, border: `1px solid ${ph.border}` }}>{ph.tag}</span>
                  <span className="phase-time">{ph.time}</span>
                </div>
                <h3 className="phase-title">{ph.title}</h3>
                <p className="phase-desc">{ph.desc}</p>
                <div className="phase-bar" style={{ background: ph.color }} />
              </div>
            ))}
          </div>

          <div className="phases-cta">
            <a href="/case-study/swiggy" className="hp-btn-primary large">
              Start the Swiggy investigation — free
              <ArrowRight size={16} />
            </a>
            <p className="hp-fine">~45 min · No account needed</p>
          </div>
        </div>
      </section>

      {/* ── COMING SOON ── */}
      <section className="hp-coming-section">
        <div className="hp-section-inner narrow">
          <div className="coming-card">
            <div className="section-eyebrow centered">COMING SOON</div>
            <p className="coming-text">More investigations across Zomato, Razorpay, Meesho, PhonePe, Uber and others.</p>
            <Link to="/case-studies" className="coming-link">
              See all case studies <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        /* ── Root ── */
        .hp-root {
          min-height: 100vh;
          background: var(--bg);
          font-family: var(--sans);
        }

        /* ── Hero ── */
        .hp-hero {
          padding: 64px 24px 48px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .hp-hero-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: start;
        }
        @media (max-width: 860px) {
          .hp-hero-inner { grid-template-columns: 1fr; gap: 40px; }
          .hp-hero { padding: 40px 20px 32px; }
        }

        /* Left */
        .hp-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--mono);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink3);
          margin-bottom: 20px;
        }
        .eyebrow-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--accent);
          display: inline-block;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }
        .hp-h1 {
          font-family: var(--serif);
          font-size: clamp(2.2rem, 5vw, 3.4rem);
          color: var(--ink);
          line-height: 1.05;
          letter-spacing: -0.025em;
          margin-bottom: 20px;
        }
        .hp-h1 em {
          font-style: normal;
          color: var(--accent);
          position: relative;
        }
        .hp-sub {
          font-size: 15px;
          color: var(--ink2);
          line-height: 1.65;
          max-width: 420px;
          margin-bottom: 28px;
        }
        .hp-stats {
          display: flex;
          gap: 20px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .hp-stat {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--ink3);
        }
        .hp-stat strong { color: var(--ink); font-weight: 600; }
        .stat-icon { color: var(--accent); flex-shrink: 0; }
        .hp-cta-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }
        .hp-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          background: var(--accent);
          color: white;
          font-size: 14px;
          font-weight: 500;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.15s;
          box-shadow: 0 4px 20px rgba(200,75,12,0.25);
        }
        .hp-btn-primary:hover {
          background: var(--accent-dark);
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(200,75,12,0.35);
        }
        .hp-btn-primary.large { padding: 14px 28px; font-size: 15px; }
        .hp-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: var(--ink2);
          text-decoration: none;
          padding: 12px 4px;
          transition: color 0.15s;
        }
        .hp-btn-ghost:hover { color: var(--ink); }
        .hp-fine {
          font-size: 11px;
          color: var(--ink3);
          margin: 0;
        }

        /* Terminal / Right column */
        .hp-hero-right {
          position: relative;
        }
        .terminal-label-above {
          font-family: var(--mono);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink3);
          margin-bottom: 8px;
        }
        .terminal-nudge {
          font-family: var(--mono);
          font-size: 11px;
          color: var(--accent);
          text-align: center;
          margin-top: 12px;
        }

        /* Interview hero */
        .interview-hero {
          background: #14150F;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #2A2B22;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04);
        }
        .terminal-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 14px;
          background: #0D0E09;
          border-bottom: 1px solid #1E1F17;
        }
        .dot {
          width: 10px; height: 10px;
          border-radius: 50%;
        }
        .dot.red { background: #FF5F57; }
        .dot.yellow { background: #FEBC2E; }
        .dot.green { background: #28C840; }
        .terminal-label {
          font-family: var(--mono);
          font-size: 9px;
          color: #4A4B3F;
          letter-spacing: 0.08em;
          margin-left: 6px;
        }
        .message-row {
          display: flex;
          gap: 12px;
          padding: 16px 16px 0;
        }
        .message-row.arjun { padding-top: 12px; padding-bottom: 16px; }
        .avatar {
          width: 32px; height: 32px;
          border-radius: 8px;
          font-family: var(--mono);
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .avatar.iv { background: #2A2B22; color: #C8C9B0; }
        .avatar.ar { background: rgba(200,75,12,0.2); color: #C84B0C; }
        .bubble { flex: 1; }
        .bubble-meta {
          font-family: var(--mono);
          font-size: 10px;
          font-weight: 700;
          color: #8A8B78;
          margin-bottom: 6px;
        }
        .bubble-meta span { font-weight: 400; opacity: 0.6; }
        .bubble-text {
          font-size: 13px;
          color: #C8C9B0;
          line-height: 1.6;
        }
        .bubble-text strong { color: #E8C88A; }
        .arjun-bubble .bubble-text { color: #E8C88A; }
        .cursor {
          display: inline-block;
          color: var(--accent);
          animation: blink 0.9s step-end infinite;
        }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

        /* Options */
        .options-grid {
          padding: 14px 16px 16px;
          transition: opacity 0.4s;
        }
        .options-grid.faded { opacity: 0.35; }
        .options-label {
          font-family: var(--mono);
          font-size: 9px;
          color: #4A4B3F;
          letter-spacing: 0.06em;
          margin-bottom: 10px;
        }
        .option-btn {
          width: 100%;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 12px;
          margin-bottom: 6px;
          background: #1A1B13;
          border: 1px solid #252620;
          border-radius: 8px;
          text-align: left;
          font-size: 12px;
          color: #8A8B78;
          cursor: pointer;
          transition: all 0.15s;
        }
        .option-btn:last-child { margin-bottom: 0; }
        .option-btn:hover:not(.locked) {
          background: #1E1F17;
          border-color: #3A3B2E;
          color: #C8C9B0;
        }
        .option-btn.selected {
          background: rgba(200,75,12,0.12);
          border-color: rgba(200,75,12,0.35);
          color: #C84B0C;
        }
        .option-btn.locked { cursor: default; }
        .opt-id {
          font-family: var(--mono);
          font-size: 9px;
          font-weight: 700;
          color: #4A4B3F;
          margin-top: 1px;
          flex-shrink: 0;
        }
        .option-btn.selected .opt-id { color: #C84B0C; }

        /* Revealed anim */
        .revealed-anim {
          animation: slideIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Ticker ── */
        .hp-ticker-section {
          padding: 0 0 40px;
          overflow: hidden;
        }
        .ticker-caption {
          font-family: var(--mono);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.05em;
          color: var(--ink3);
          text-align: center;
          margin-bottom: 16px;
        }
        .ticker-wrap {
          position: relative;
          overflow: hidden;
        }
        .ticker-wrap::before, .ticker-wrap::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0; width: 80px; z-index: 2; pointer-events: none;
        }
        .ticker-wrap::before { left: 0; background: linear-gradient(to right, var(--bg), transparent); }
        .ticker-wrap::after  { right: 0; background: linear-gradient(to left, var(--bg), transparent); }
        .ticker-inner {
          display: flex;
          gap: 10px;
          width: max-content;
          animation: ticker 30s linear infinite;
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ticker-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px 6px 8px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 999px;
          flex-shrink: 0;
        }
        .ticker-abbr {
          width: 24px; height: 24px;
          border-radius: 6px;
          font-family: var(--mono);
          font-size: 8px;
          font-weight: 800;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0;
        }
        .ticker-name {
          font-size: 12px;
          font-weight: 500;
          color: var(--ink2);
        }

        /* ── Salary section ── */
        .hp-salary-section {
          padding: 72px 24px;
          background: var(--surface);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .hp-section-inner {
          max-width: 760px;
          margin: 0 auto;
        }
        .hp-section-inner.narrow { max-width: 520px; }
        .section-eyebrow {
          font-family: var(--mono);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink3);
          margin-bottom: 16px;
        }
        .section-eyebrow.centered { text-align: center; }
        .hp-h2 {
          font-family: var(--serif);
          font-size: clamp(1.7rem, 4vw, 2.4rem);
          color: var(--ink);
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }
        .hp-section-sub {
          font-size: 14px;
          color: var(--ink2);
          line-height: 1.6;
          margin-bottom: 36px;
          max-width: 540px;
        }

        /* Salary widget */
        .salary-widget {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }
        .salary-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 14px;
        }
        .salary-row:last-child { margin-bottom: 0; }
        .salary-label {
          font-size: 12px;
          color: var(--ink2);
          width: 200px;
          flex-shrink: 0;
        }
        @media (max-width: 560px) { .salary-label { width: 130px; font-size: 11px; } }
        .salary-track {
          flex: 1;
          height: 8px;
          background: var(--surface);
          border-radius: 999px;
          overflow: hidden;
        }
        .salary-fill {
          height: 100%;
          border-radius: 999px;
        }
        .salary-value {
          font-family: var(--mono);
          font-size: 12px;
          font-weight: 700;
          width: 40px;
          text-align: right;
          flex-shrink: 0;
        }
        .salary-divider {
          height: 1px;
          background: var(--border);
          margin: 16px 0;
        }
        .salary-insight {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 16px 20px;
          background: rgba(200,75,12,0.06);
          border: 1px solid rgba(200,75,12,0.18);
          border-radius: 12px;
        }
        .insight-arrow {
          font-size: 20px;
          color: var(--accent);
          flex-shrink: 0;
          margin-top: 1px;
        }
        .salary-insight p {
          font-size: 13px;
          color: var(--ink);
          line-height: 1.65;
          margin: 0;
        }

        /* ── Phases ── */
        .hp-phases-section {
          padding: 72px 24px;
        }
        .phases-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 40px;
        }
        @media (max-width: 760px) {
          .phases-grid { grid-template-columns: 1fr; }
        }
        .phase-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 20px;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .phase-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
        }
        .phase-bar {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          opacity: 0.6;
        }
        .phase-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
        }
        .phase-num {
          font-family: var(--mono);
          font-size: 11px;
          font-weight: 800;
        }
        .phase-tag {
          font-family: var(--mono);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.07em;
          padding: 3px 8px;
          border-radius: 999px;
        }
        .phase-time {
          font-family: var(--mono);
          font-size: 10px;
          color: var(--ink3);
          margin-left: auto;
        }
        .phase-title {
          font-family: var(--serif);
          font-size: 1.05rem;
          color: var(--ink);
          line-height: 1.3;
          margin-bottom: 8px;
        }
        .phase-desc {
          font-size: 12px;
          color: var(--ink2);
          line-height: 1.6;
        }
        .phases-cta {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        /* ── Coming soon ── */
        .hp-coming-section {
          padding: 0 24px 80px;
        }
        .coming-card {
          background: var(--surface);
          border: 1px dashed var(--border2);
          border-radius: 16px;
          padding: 28px;
          text-align: center;
        }
        .coming-text {
          font-size: 14px;
          color: var(--ink2);
          margin-bottom: 16px;
          line-height: 1.6;
        }
        .coming-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: var(--accent);
          text-decoration: none;
          transition: gap 0.15s;
        }
        .coming-link:hover { gap: 10px; }
      `}</style>
    </div>
  );
};

export default HomePage;
