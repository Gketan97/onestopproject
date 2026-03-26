// src/components/pages/HomePage.jsx
// SaaS-Noir Homepage — Pattern Interrupt for ambitious analysts
// Sections: Hero → Stats → Resume Comparison → Framework Matrix → Final CTA

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Zap, Eye, Users } from 'lucide-react';

// ── Company ticker data ───────────────────────────────────────────────────────
const COMPANIES = [
  { name: 'Swiggy',    abbr: 'SW', color: '#FC8019' },
  { name: 'Zomato',    abbr: 'ZO', color: '#E23744' },
  { name: 'Flipkart',  abbr: 'FL', color: '#2874F0' },
  { name: 'Razorpay',  abbr: 'RA', color: '#2B64F5' },
  { name: 'PhonePe',   abbr: 'PP', color: '#5F259F' },
  { name: 'Uber',      abbr: 'UB', color: '#888' },
  { name: 'Google',    abbr: 'GO', color: '#4285F4' },
  { name: 'Amazon',    abbr: 'AM', color: '#FF9900' },
  { name: 'CRED',      abbr: 'CR', color: '#9B4DCA' },
  { name: 'Meesho',    abbr: 'ME', color: '#9B59B6' },
  { name: 'Atlassian', abbr: 'AT', color: '#0052CC' },
  { name: 'Microsoft', abbr: 'MS', color: '#00A4EF' },
];

// ── Hooks ─────────────────────────────────────────────────────────────────────
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return y;
}

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useCountUp(target, duration, active) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return val;
}

// ── Ticker ────────────────────────────────────────────────────────────────────
function Ticker() {
  const doubled = [...COMPANIES, ...COMPANIES];
  return (
    <div style={{ overflow: 'hidden', position: 'relative', padding: '4px 0' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(to right, var(--bg), transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(to left, var(--bg), transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ display: 'flex', gap: 10, width: 'max-content', animation: 'ticker 36s linear infinite' }}>
        {doubled.map((c, i) => (
          <div key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px 6px 8px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 999, flexShrink: 0,
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6,
              background: c.color, display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--mono)', fontSize: 8, fontWeight: 800, color: '#fff',
            }}>{c.abbr}</div>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink2)' }}>{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Stat block ────────────────────────────────────────────────────────────────
function Stat({ value, suffix, label, color, active }) {
  const count = useCountUp(value, 1100, active);
  return (
    <div style={{ textAlign: 'center', padding: '28px 20px', background: 'rgba(8,8,16,0.5)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 36, fontWeight: 800, color, letterSpacing: '-0.04em', lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink3)', marginTop: 6 }}>{label}</div>
    </div>
  );
}

// ── Resume Card ───────────────────────────────────────────────────────────────
function ResumeCard({ variant, shortlisted }) {
  const isB = variant === 'B';

  const data = {
    A: {
      badge: '✗ Rejected',
      badgeBg: 'rgba(243,139,168,0.12)', badgeColor: '#F38BA8', badgeBorder: 'rgba(243,139,168,0.25)',
      label: 'THE SQL WRITER', labelColor: '#F38BA8',
      role: 'Data Analyst · No Response · 14 Days',
      roleColor: 'var(--ink3)',
      points: [
        'Created weekly dashboards for marketing team',
        'Ran SQL queries on request from stakeholders',
        'Maintained data pipelines and ETL processes',
        'Built Excel reports for monthly business reviews',
      ],
      dotBg: 'rgba(243,139,168,0.12)', dotColor: '#F38BA8', dotBorder: 'rgba(243,139,168,0.2)',
      ptColor: 'var(--ink3)',
      divider: 'rgba(243,139,168,0.1)',
      footerColor: '#F38BA8', footerText: '● No callback · Ghosted',
      cardBg: 'rgba(243,139,168,0.03)', cardBorder: 'rgba(243,139,168,0.12)',
      glow: 'none',
    },
    B: {
      badge: shortlisted ? '⚡ Shortlisted' : '○ Pending',
      badgeBg: shortlisted ? 'var(--phase1)' : 'rgba(252,128,25,0.1)',
      badgeColor: '#fff',
      badgeBorder: 'rgba(252,128,25,0.4)',
      label: 'THE INCIDENT RESPONDER', labelColor: '#FC8019',
      role: shortlisted ? 'Senior Analyst · Interview in 2 Days ✓' : 'Senior Analyst · Submitted',
      roleColor: shortlisted ? 'var(--ink)' : 'var(--ink2)',
      points: [
        'Identified 8.3% WoW revenue leak via root-cause investigation',
        'Triaged delivery churn in North Bangalore within 48 hours',
        'Authored Executive Brief for VP of Product — ₹28L impact',
        'Built early-warning framework adopted across 3 verticals',
      ],
      dotBg: 'rgba(252,128,25,0.12)', dotColor: '#FC8019', dotBorder: 'rgba(252,128,25,0.25)',
      ptColor: 'var(--ink2)',
      divider: 'rgba(252,128,25,0.1)',
      footerColor: shortlisted ? '#FC8019' : 'var(--ink3)',
      footerText: shortlisted ? '● Interview scheduled · Thursday 3PM' : '○ Awaiting response',
      cardBg: shortlisted ? 'rgba(252,128,25,0.06)' : 'rgba(252,128,25,0.03)',
      cardBorder: shortlisted ? 'rgba(252,128,25,0.3)' : 'rgba(252,128,25,0.12)',
      glow: shortlisted ? '0 0 40px rgba(252,128,25,0.18), 0 0 0 1px rgba(252,128,25,0.2)' : 'none',
    },
  }[variant];

  return (
    <div style={{
      position: 'relative',
      borderRadius: 20,
      padding: 24,
      background: data.cardBg,
      border: `1px solid ${data.cardBorder}`,
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      boxShadow: data.glow,
      transform: isB && shortlisted ? 'translateY(-6px)' : 'none',
      transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)',
      display: 'flex', flexDirection: 'column', gap: 18,
    }}>
      {/* Top badge */}
      <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
        <span style={{
          display: 'inline-block', padding: '4px 14px', borderRadius: 999,
          fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          background: data.badgeBg, color: data.badgeColor,
          border: `1px solid ${data.badgeBorder}`,
          boxShadow: isB && shortlisted ? '0 0 24px rgba(252,128,25,0.55)' : 'none',
          animation: isB && shortlisted ? 'badge-pulse 2s ease-in-out infinite' : 'none',
          whiteSpace: 'nowrap',
        }}>
          {data.badge}
        </span>
      </div>

      {/* Header */}
      <div style={{ marginTop: 8 }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: data.labelColor, marginBottom: 4 }}>
          {data.label}
        </p>
        <p style={{ fontSize: 13, color: data.roleColor, fontWeight: 500 }}>{data.role}</p>
      </div>

      <div style={{ height: 1, background: data.divider }} />

      {/* Points */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {data.points.map((pt, i) => (
          <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{
              flexShrink: 0, marginTop: 2,
              width: 16, height: 16, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 800,
              background: data.dotBg, color: data.dotColor,
              border: `1px solid ${data.dotBorder}`,
            }}>{isB ? '✓' : '✗'}</span>
            <span style={{ fontSize: 13, lineHeight: 1.55, color: data.ptColor }}>{pt}</span>
          </li>
        ))}
      </ul>

      <div style={{ height: 1, background: data.divider }} />

      {/* Footer */}
      <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: data.footerColor }}>{data.footerText}</p>
    </div>
  );
}

// ── Framework Card ────────────────────────────────────────────────────────────
function FrameworkCard({ Icon, tag, title, desc, accent, delay, visible }) {
  return (
    <div style={{
      borderRadius: 20, padding: '28px 24px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      display: 'flex', flexDirection: 'column', gap: 18,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.6s ${delay}ms cubic-bezier(0.16,1,0.3,1), transform 0.6s ${delay}ms cubic-bezier(0.16,1,0.3,1)`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${accent}18`, border: `1px solid ${accent}30`,
        }}>
          <Icon size={20} color={accent} />
        </div>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          padding: '4px 10px', borderRadius: 999,
          background: `${accent}12`, color: accent, border: `1px solid ${accent}22`,
          whiteSpace: 'nowrap',
        }}>{tag}</span>
      </div>
      <div>
        <h3 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 8, lineHeight: 1.3 }}>{title}</h3>
        <p style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--ink2)' }}>{desc}</p>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const scrollY = useScrollY();
  const [shortlisted, setShortlisted] = useState(false);
  const [resumeRef, resumeInView] = useInView(0.25);
  const [fwRef, fwInView] = useInView(0.15);
  const [statsRef, statsInView] = useInView(0.5);

  useEffect(() => {
    if (resumeInView && !shortlisted) {
      const t = setTimeout(() => setShortlisted(true), 700);
      return () => clearTimeout(t);
    }
  }, [resumeInView]);

  const ORANGE = '#FC8019';
  const BLUE   = '#4F80FF';
  const GREEN  = '#3DD68C';

  return (
    <div style={{ background: 'var(--bg)', fontFamily: 'var(--sans)', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── Scroll-responsive ambient orbs ── */}
      <div style={{
        position: 'fixed', zIndex: 0, pointerEvents: 'none',
        top: -240 + scrollY * 0.12, left: -240,
        width: 680, height: 680, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(252,128,25,0.16) 0%, transparent 70%)`,
        filter: 'blur(110px)',
      }} />
      <div style={{
        position: 'fixed', zIndex: 0, pointerEvents: 'none',
        bottom: -240 - scrollY * 0.06, right: -240,
        width: 680, height: 680, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(79,128,255,0.20) 0%, transparent 70%)`,
        filter: 'blur(110px)',
      }} />

      {/* ── Dotted grid ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ════════ HERO ════════ */}
        <section style={{ padding: 'clamp(72px,10vw,120px) 24px 80px', maxWidth: 920, margin: '0 auto', textAlign: 'center' }}>

          {/* Pill */}
          <div style={{ marginBottom: 32, animation: 'hp-up 0.6s both' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 18px', borderRadius: 999,
              fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              background: 'rgba(252,128,25,0.10)',
              border: '1px solid rgba(252,128,25,0.28)',
              color: ORANGE,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: ORANGE, display: 'inline-block', animation: 'hp-pulse 2s ease-in-out infinite' }} />
              Pattern Interrupt · For Ambitious Analysts
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.1rem, 6vw, 4rem)',
            fontWeight: 800, lineHeight: 1.06,
            letterSpacing: '-0.035em', color: 'var(--ink)',
            marginBottom: 24,
            animation: 'hp-up 0.7s 0.08s both',
          }}>
            SQL is the{' '}
            <span style={{ background: `linear-gradient(135deg, ${ORANGE}, #FF9E50)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              entry requirement.
            </span>
            <br />
            Problem solving is the{' '}
            <span style={{ background: `linear-gradient(135deg, ${BLUE}, #A0C0FF)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              competitive edge.
            </span>
          </h1>

          {/* Sub-copy */}
          <p style={{
            fontSize: 16, lineHeight: 1.72, color: 'var(--ink2)',
            maxWidth: 560, margin: '0 auto 40px',
            animation: 'hp-up 0.7s 0.16s both',
          }}>
            Most analysts are just human APIs for data pulls. The top 1% are{' '}
            <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>Strategic Partners</strong>{' '}
            who triage incidents and drive revenue. Shift from{' '}
            <span style={{ color: 'var(--ink3)', fontStyle: 'italic' }}>"Task Taker"</span>{' '}
            to{' '}
            <span style={{ color: ORANGE, fontWeight: 600 }}>"Decision Maker"</span>{' '}
            in one afternoon.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', animation: 'hp-up 0.7s 0.24s both' }}>
            <a href="/case-study/swiggy"
              className="hp-cta-primary"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 30px', borderRadius: 12,
                background: ORANGE, color: '#fff',
                fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em',
                textDecoration: 'none',
                boxShadow: `0 0 0 1px rgba(252,128,25,0.45), 0 8px 32px rgba(252,128,25,0.32)`,
                transition: 'all 0.2s ease',
              }}
            >
              Start the Swiggy Case <ArrowRight size={16} />
            </a>
            <a href="/case-studies"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 24px', borderRadius: 12,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.10)',
                color: 'var(--ink2)', fontWeight: 500, fontSize: 15,
                textDecoration: 'none', backdropFilter: 'blur(12px)',
                transition: 'all 0.2s ease',
              }}
            >
              Browse All Cases
            </a>
          </div>

          <p style={{ marginTop: 18, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', animation: 'hp-up 0.7s 0.32s both' }}>
            Free · No account · Portfolio link at end · ~45 min
          </p>
        </section>

        {/* ════════ TICKER ════════ */}
        <div style={{ padding: '0 0 80px' }}>
          <p style={{ textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>
            Analysts are getting hired right now at
          </p>
          <Ticker />
        </div>

        {/* ════════ STATS ════════ */}
        <div ref={statsRef} style={{ padding: '0 24px 88px' }}>
          <div style={{
            maxWidth: 680, margin: '0 auto',
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 18, overflow: 'hidden',
          }}>
            <Stat value={45}  suffix="m"   label="To complete"          color={ORANGE} active={statsInView} />
            <Stat value={3}   suffix=""    label="Investigation phases"  color={BLUE}   active={statsInView} />
            <Stat value={28}  suffix="L"   label="Revenue impact"        color={GREEN}  active={statsInView} />
          </div>
        </div>

        {/* ════════ RESUME COMPARISON ════════ */}
        <section ref={resumeRef} style={{ padding: '0 24px 96px', maxWidth: 960, margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: 14 }}>
              The Resume Reality Check
            </p>
            <h2 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.6rem)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--ink)', lineHeight: 1.12, marginBottom: 14 }}>
              Two analysts. Same tools.{' '}
              <span style={{ color: ORANGE }}>Very different outcomes.</span>
            </h2>
            <p style={{ fontSize: 15, color: 'var(--ink2)', maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>
              The difference isn't SQL skill. It's how they frame their impact — and how they think when the data doesn't make sense.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 24, paddingTop: 20 }}>
            <ResumeCard variant="A" shortlisted={shortlisted} />
            <ResumeCard variant="B" shortlisted={shortlisted} />
          </div>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button onClick={() => { setShortlisted(false); setTimeout(() => setShortlisted(true), 120); }}
              style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink3)', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 12px', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = ORANGE}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--ink3)'}
            >
              ↺ Replay shortlist animation
            </button>
          </div>
        </section>

        {/* ════════ FRAMEWORK MATRIX ════════ */}
        <section ref={fwRef} style={{ padding: '0 24px 96px', maxWidth: 960, margin: '0 auto' }}>

          {/* Section label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 52 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink3)', whiteSpace: 'nowrap' }}>
              What We Actually Teach
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.6rem)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--ink)', lineHeight: 1.12, marginBottom: 14 }}>
              Three skills no SQL course teaches.
            </h2>
            <p style={{ fontSize: 15, color: 'var(--ink2)', maxWidth: 460, margin: '0 auto', lineHeight: 1.65 }}>
              Interviewers at top firms aren't testing syntax. They're testing how you think when you're 15 minutes into the wrong rabbit hole.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: 16 }}>
            <FrameworkCard
              Icon={Zap} tag="Skill 01"
              title="Ambiguity Triage"
              desc="How to ask the right clarifying questions before writing a single line of SQL. Most analysts skip this. Senior analysts never do."
              accent={ORANGE} delay={0} visible={fwInView}
            />
            <FrameworkCard
              Icon={Eye} tag="Skill 02"
              title="Data Skepticism"
              desc="Why the first query result is almost always wrong, and the structured approach to validating data before presenting it to a VP."
              accent={BLUE} delay={110} visible={fwInView}
            />
            <FrameworkCard
              Icon={Users} tag="Skill 03"
              title="Stakeholder Synthesis"
              desc="Turning 'SELECT *' into a ₹2M business recommendation. How to translate rows and columns into decisions that actually get adopted."
              accent={GREEN} delay={220} visible={fwInView}
            />
          </div>

          {/* Framework vs syntax bar */}
          <div style={{
            marginTop: 36, padding: '18px 28px', borderRadius: 14,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 24, flexWrap: 'wrap',
          }}>
            {[
              { text: 'SQL Syntax', sub: 'table stakes', color: 'var(--ink3)' },
              { sep: '→' },
              { text: 'Problem Framing', sub: 'differentiator', color: BLUE },
              { sep: '+' },
              { text: 'Business Impact', sub: 'why you get hired', color: ORANGE },
            ].map((item, i) =>
              item.sep ? (
                <span key={i} style={{ fontFamily: 'var(--mono)', fontSize: 16, color: 'var(--border2)' }}>{item.sep}</span>
              ) : (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 700, color: item.color, letterSpacing: '-0.01em' }}>{item.text}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{item.sub}</div>
                </div>
              )
            )}
          </div>
        </section>

        {/* ════════ FINAL CTA ════════ */}
        <section style={{ padding: '0 24px 96px' }}>
          <div style={{
            maxWidth: 660, margin: '0 auto', textAlign: 'center',
            padding: 'clamp(40px,8vw,72px) clamp(28px,6vw,60px)',
            borderRadius: 24,
            background: 'rgba(252,128,25,0.05)',
            border: '1px solid rgba(252,128,25,0.15)',
            backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
              width: 500, height: 300,
              background: 'radial-gradient(circle, rgba(252,128,25,0.12) 0%, transparent 70%)',
              filter: 'blur(40px)', pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative' }}>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: ORANGE, marginBottom: 20 }}>
                ⚡ Start Free · No Credit Card
              </p>
              <h2 style={{ fontSize: 'clamp(1.7rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.035em', color: 'var(--ink)', lineHeight: 1.1, marginBottom: 16 }}>
                Stop applying.{' '}
                <span style={{ color: ORANGE }}>Start getting called.</span>
              </h2>
              <p style={{ fontSize: 15, color: 'var(--ink2)', maxWidth: 420, margin: '0 auto 36px', lineHeight: 1.7 }}>
                One 45-minute investigation. A portfolio link for your next application. Results most analysts never learn in 3 years.
              </p>
              <a href="/case-study/swiggy"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '16px 38px', borderRadius: 12,
                  background: ORANGE, color: '#fff',
                  fontWeight: 800, fontSize: 16, letterSpacing: '-0.01em',
                  textDecoration: 'none',
                  boxShadow: `0 0 0 1px rgba(252,128,25,0.5), 0 8px 32px rgba(252,128,25,0.38), 0 0 60px rgba(252,128,25,0.15)`,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = `0 0 0 1px rgba(252,128,25,0.7), 0 16px 48px rgba(252,128,25,0.55), 0 0 80px rgba(252,128,25,0.22)`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = `0 0 0 1px rgba(252,128,25,0.5), 0 8px 32px rgba(252,128,25,0.38), 0 0 60px rgba(252,128,25,0.15)`;
                }}
              >
                Begin the Investigation <ArrowRight size={18} />
              </a>
              <p style={{ marginTop: 16, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink3)' }}>
                Swiggy Case Study · Phase 1 free · ~45 minutes
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes hp-up {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hp-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.45; transform:scale(0.65); }
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes badge-pulse {
          0%,100% { box-shadow: 0 0 20px rgba(252,128,25,0.55); }
          50%      { box-shadow: 0 0 38px rgba(252,128,25,0.95); }
        }
        .hp-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 0 1px rgba(252,128,25,0.6), 0 12px 44px rgba(252,128,25,0.5) !important;
        }
        @media (max-width: 600px) {
          section { padding-left: 16px !important; padding-right: 16px !important; }
        }
      `}</style>
    </div>
  );
}
