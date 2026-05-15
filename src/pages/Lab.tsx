import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import InterestForm from '../components/InterestForm'

const WA_URL = 'https://wa.me/919XXXXXXXXX?text=Hi%20Ketan%2C%20I%27d%20like%20to%20reserve%20a%20seat%20for%20the%20Saturday%20AI%20Problem%20Solving%20Lab.'

function getNextSaturday(): string {
  const today = new Date()
  const day = today.getDay()
  const daysUntil = (6 - day + 7) % 7 || 7
  const next = new Date(today)
  next.setDate(today.getDate() + daysUntil)
  return next.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
}

const PHASES = [
  {
    num: '01',
    when: 'Before Saturday',
    title: 'Pre-read arrives in your inbox',
    body: 'Full case context, company background, and problem statement over email. Read it before Saturday — the session starts where the pre-read ends.',
    tag: 'Async',
    color: 'rgba(168,85,247,0.15)',
    textColor: 'var(--accent)',
  },
  {
    num: '02',
    when: 'Saturday · 1.5 hrs',
    title: 'Live problem solving with Ketan',
    body: 'Work through Phase 1 of the case live. Ketan shows you how to apply the 8-step framework to this specific problem — using AI as a thinking partner, not an answer machine.',
    tag: 'Live',
    color: 'rgba(34,197,94,0.12)',
    textColor: '#4ade80',
  },
  {
    num: '03',
    when: 'Mid-week',
    title: 'WhatsApp group support',
    body: 'Private group with all cohort members. Post questions anytime. Ketan replies EOD. Mid-week session scheduled if the group needs it.',
    tag: 'Async · WhatsApp',
    color: 'rgba(37,211,102,0.1)',
    textColor: '#25D366',
  },
  {
    num: '04',
    when: 'Next Saturday · 2 hrs',
    title: 'Evaluation and frameworks',
    body: 'Ketan reviews each person\'s thinking. Group debrief on what sharp thinking looked like versus what the group produced. You leave with a framework that works on any problem.',
    tag: 'Live',
    color: 'rgba(34,197,94,0.12)',
    textColor: '#4ade80',
  },
]

const FRAMEWORK_STEPS = [
  { n: '01', t: 'Understand the business' },
  { n: '02', t: 'Define the real problem' },
  { n: '03', t: 'Break it into parts' },
  { n: '04', t: 'Generate hypotheses' },
  { n: '05', t: 'Prioritise ruthlessly' },
  { n: '06', t: 'Structure your analysis' },
  { n: '07', t: 'Form a recommendation' },
  { n: '08', t: 'Stress test your thinking' },
]

const INCLUDES = [
  'Full case pre-read material over email',
  '1.5 hr live Saturday session with Ketan',
  'Private WhatsApp group — Ketan replies EOD',
  '2 hr evaluation session next Saturday',
  'Access to Case Study AI during cohort',
  'Session recordings',
  'The 8-step framework to keep',
  '🎁 Ketan\'s personal AI prompt library',
  '🎁 Case debrief notes after Session 2',
]

export default function Lab() {
  const navigate = useNavigate()
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <style>{`
        .lab-page { min-height: 100vh; background: var(--bg-base); }

        /* Top bar */
        .lab-topbar {
          height: 68px; display: flex; align-items: center;
          padding: 0 32px; border-bottom: 1px solid var(--border-subtle);
          background: var(--bg-base); position: sticky; top: 0; z-index: 100;
          justify-content: space-between;
        }
        .lab-logo {
          font-family: 'DM Mono', monospace; font-size: 15px;
          letter-spacing: 0.1em; color: var(--text-primary);
          cursor: pointer; font-weight: 500;
        }
        .lab-logo span {
          background: linear-gradient(135deg, #FF6B9D, #A855F7);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .lab-topbar-cta {
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
          color: #fff; background: var(--accent); border: none; border-radius: 100px;
          padding: 10px 22px; cursor: pointer; transition: all 180ms ease;
        }
        .lab-topbar-cta:hover { filter: brightness(1.1); }

        /* Hero */
        .lab-hero {
          max-width: 1100px; margin: 0 auto;
          padding: 72px 32px 64px;
          display: grid; grid-template-columns: 1fr 360px;
          gap: 64px; align-items: start;
        }
        .lab-eyebrow {
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 0.16em; color: var(--accent); margin-bottom: 16px;
        }
        .lab-h1 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 400; color: var(--text-primary);
          line-height: 1.15; margin-bottom: 20px;
        }
        .lab-h1 em {
          font-style: italic;
          background: linear-gradient(135deg, #FF6B9D, #A855F7);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .lab-desc {
          font-family: 'DM Sans', sans-serif; font-size: 17px;
          line-height: 1.8; color: var(--text-secondary); margin-bottom: 24px;
          max-width: 520px;
        }
        .lab-desc strong { color: var(--text-primary); font-weight: 500; }
        .lab-pills {
          display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 32px;
        }
        .lab-pill {
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 0.08em; color: var(--text-secondary);
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 100px; padding: 6px 14px;
        }
        .lab-not-course {
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 12px; padding: 16px 20px; max-width: 520px;
        }
        .lab-not-label {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.14em; color: var(--text-tertiary); margin-bottom: 10px;
        }
        .lab-not-items { display: flex; flex-wrap: wrap; gap: 8px; }
        .lab-not-item {
          font-family: 'DM Sans', sans-serif; font-size: 12px;
          color: var(--text-tertiary);
          display: flex; align-items: center; gap: 6px;
        }
        .lab-not-item::before { content: '✕'; color: #f87171; font-size: 10px; }

        /* Signup card */
        .lab-card {
          background: var(--bg-elevated);
          border: 1px solid rgba(168,85,247,0.22);
          border-radius: 22px; padding: 32px;
          position: sticky; top: 84px;
        }
        .lab-card-next {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.14em; color: var(--text-tertiary); margin-bottom: 4px;
        }
        .lab-card-date {
          font-family: 'DM Sans', sans-serif; font-size: 15px;
          font-weight: 500; color: var(--text-primary);
          margin-bottom: 20px; padding-bottom: 20px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .lab-card-seats {
          display: flex; align-items: center; gap: 8px; margin-bottom: 18px;
        }
        .lab-card-seats-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #4ade80; box-shadow: 0 0 6px #4ade80;
          animation: lab-pulse 2s ease-in-out infinite;
        }
        @keyframes lab-pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        .lab-card-seats-text {
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 0.08em; color: #4ade80;
        }
        .lab-pricing {
          display: flex; align-items: baseline; gap: 10px; margin-bottom: 4px;
        }
        .lab-price-old {
          font-family: 'Instrument Serif', serif; font-size: 24px;
          color: var(--text-tertiary); text-decoration: line-through; opacity: 0.5;
        }
        .lab-price-new {
          font-family: 'Instrument Serif', serif; font-size: 44px;
          color: var(--text-primary); line-height: 1;
        }
        .lab-price-badge {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.08em; color: #4ade80;
          background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2);
          border-radius: 5px; padding: 3px 8px;
        }
        .lab-price-per {
          font-family: 'DM Mono', monospace; font-size: 11px;
          color: var(--text-tertiary); margin-bottom: 22px; letter-spacing: 0.06em;
        }
        .lab-includes { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
        .lab-include {
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: var(--text-secondary);
          display: flex; align-items: flex-start; gap: 8px; line-height: 1.5;
        }
        .lab-include::before { content: '✓'; color: #4ade80; flex-shrink: 0; }
        .lab-include.bonus { color: var(--text-primary); font-weight: 500; }
        .lab-include.bonus::before { content: ''; display: none; }
        .lab-card-btn {
          width: 100%; font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 600;
          color: #fff; background: var(--accent);
          border: none; border-radius: 100px;
          padding: 15px; cursor: pointer;
          transition: all 200ms ease; margin-bottom: 10px;
        }
        .lab-card-btn:hover { filter: brightness(1.1); transform: scale(1.01); }
        .lab-card-refund {
          font-family: 'DM Sans', sans-serif; font-size: 12px;
          color: #4ade80; text-align: center; margin-bottom: 8px;
        }
        .lab-card-trust {
          font-family: 'DM Mono', monospace; font-size: 10px;
          color: var(--text-tertiary); text-align: center; letter-spacing: 0.06em;
          line-height: 1.6;
        }

        /* Divider */
        .lab-divider {
          border: none; border-top: 1px solid var(--border-subtle);
          margin: 0 32px;
        }

        /* How it works */
        .lab-how {
          max-width: 1100px; margin: 0 auto; padding: 72px 32px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 80px;
        }

        /* Phases */
        .lab-section-label {
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 0.16em; color: var(--accent); margin-bottom: 16px;
        }
        .lab-section-h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(22px, 2.5vw, 32px);
          font-weight: 400; color: var(--text-primary);
          line-height: 1.2; margin-bottom: 32px;
        }
        .lab-phases { display: flex; flex-direction: column; }
        .lab-phase {
          display: grid; grid-template-columns: 48px 1fr;
          gap: 0 16px; padding: 22px 0;
          border-bottom: 1px solid var(--border-subtle);
        }
        .lab-phase:last-child { border-bottom: none; }
        .lab-phase-left { display: flex; flex-direction: column; align-items: center; padding-top: 2px; }
        .lab-phase-num {
          font-family: 'DM Mono', monospace; font-size: 12px;
          color: var(--accent); letter-spacing: 0.08em; margin-bottom: 8px;
        }
        .lab-phase-line {
          width: 1px; flex: 1; background: var(--border-subtle); min-height: 20px;
        }
        .lab-phase:last-child .lab-phase-line { display: none; }
        .lab-phase-when {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.1em; color: var(--text-tertiary); margin-bottom: 5px;
        }
        .lab-phase-title {
          font-family: 'DM Sans', sans-serif; font-size: 15px;
          font-weight: 600; color: var(--text-primary); margin-bottom: 6px;
        }
        .lab-phase-body {
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          line-height: 1.7; color: var(--text-secondary); margin-bottom: 8px;
        }
        .lab-phase-tag {
          display: inline-block; font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.08em;
          border-radius: 5px; padding: 3px 10px; border: 1px solid transparent;
        }

        /* Framework */
        .lab-fw-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
        }
        .lab-fw-card {
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 12px; padding: 16px 14px;
        }
        .lab-fw-num {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.12em; color: var(--accent); margin-bottom: 6px;
        }
        .lab-fw-title {
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          font-weight: 600; color: var(--text-primary); line-height: 1.35;
        }

        /* Bottom CTA */
        .lab-bottom-cta {
          background: var(--bg-surface);
          border-top: 1px solid var(--border-subtle);
          padding: 72px 32px; text-align: center;
        }
        .lab-bottom-inner { max-width: 560px; margin: 0 auto; }
        .lab-bottom-h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(26px, 3vw, 40px);
          font-weight: 400; color: var(--text-primary);
          line-height: 1.2; margin-bottom: 16px;
        }
        .lab-bottom-sub {
          font-family: 'DM Sans', sans-serif; font-size: 16px;
          line-height: 1.75; color: var(--text-secondary); margin-bottom: 32px;
        }
        .lab-bottom-btn {
          font-family: 'DM Sans', sans-serif; font-size: 17px; font-weight: 600;
          color: #fff; background: var(--accent); border: none; border-radius: 100px;
          padding: 18px 52px; cursor: pointer; transition: all 200ms ease;
          display: inline-block; margin-bottom: 16px;
        }
        .lab-bottom-btn:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(168,85,247,0.35); }
        .lab-bottom-trust {
          font-family: 'DM Mono', monospace; font-size: 11px;
          color: var(--text-tertiary); letter-spacing: 0.06em; line-height: 1.8;
        }
        .lab-bottom-diagnostic {
          margin-top: 20px;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          color: var(--text-tertiary);
        }
        .lab-bottom-diagnostic button {
          background: none; border: none; color: var(--accent);
          cursor: pointer; font-size: 14px; font-family: 'DM Sans', sans-serif;
          text-decoration: underline; text-underline-offset: 3px;
        }

        @media (max-width: 960px) {
          .lab-hero { grid-template-columns: 1fr; gap: 48px; }
          .lab-card { position: static; }
          .lab-how { grid-template-columns: 1fr; gap: 48px; }
          .lab-topbar { padding: 0 24px; }
        }
        @media (max-width: 480px) {
          .lab-hero { padding: 48px 20px 40px; }
          .lab-how { padding: 48px 20px; }
          .lab-divider { margin: 0 20px; }
          .lab-bottom-cta { padding: 56px 20px; }
          .lab-card { padding: 24px 20px; }
          .lab-bottom-btn { width: 100%; }
          .lab-fw-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="lab-page">
        {/* Topbar */}
        <div className="lab-topbar">
          <span className="lab-logo" onClick={() => navigate('/')}>
            onestop<span>careers</span>
          </span>
          <button className="lab-topbar-cta" onClick={() => setFormOpen(true)}>
            Reserve My Seat →
          </button>
        </div>

        {/* Hero + Signup card */}
        <div className="lab-hero">
          <div>
            <p className="lab-eyebrow">SATURDAY AI PROBLEM SOLVING LAB</p>
            <h1 className="lab-h1">
              Not a course.<br />
              <em>A thinking workout.</em>
            </h1>
            <p className="lab-desc">
              Every cohort works through one real business problem from a consumer internet company.
              Ketan watches how you think — not just what you produce —
              and tells you <strong>exactly what's holding your reasoning back.</strong>
            </p>
            <div className="lab-pills">
              {['Max 5 people', 'Every Saturday', 'Real business cases', 'Live with Ketan', 'Runs even with 1 person'].map((p, i) => (
                <span key={i} className="lab-pill">{p}</span>
              ))}
            </div>
            <div className="lab-not-course">
              <div className="lab-not-label">THIS IS NOT</div>
              <div className="lab-not-items">
                {['Pre-recorded videos', 'Generic AI prompts', 'Slide decks', 'Another certification'].map((item, i) => (
                  <span key={i} className="lab-not-item">{item}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Signup card */}
          <div className="lab-card">
            <div className="lab-card-next">NEXT COHORT STARTS</div>
            <div className="lab-card-date">{getNextSaturday()}</div>
            <div className="lab-card-seats">
              <span className="lab-card-seats-dot" />
              <span className="lab-card-seats-text">3 of 5 seats remaining</span>
            </div>
            <div className="lab-pricing">
              <span className="lab-price-old">₹4,999</span>
              <span className="lab-price-new">₹2,999</span>
              <span className="lab-price-badge">LAUNCH PRICE</span>
            </div>
            <div className="lab-price-per">PER PERSON · FULL COHORT</div>
            <div className="lab-includes">
              {INCLUDES.map((item, i) => (
                <span key={i} className={`lab-include${item.startsWith('🎁') ? ' bonus' : ''}`}>
                  {item}
                </span>
              ))}
            </div>
            <button className="lab-card-btn" onClick={() => setFormOpen(true)}>
              Reserve via WhatsApp →
            </button>
            <p className="lab-card-refund">✓ No questions asked refund after Session 1</p>
            <p className="lab-card-trust">
              Group runs even with 1 person<br />
              Ketan confirms within 24 hrs
            </p>
          </div>
        </div>

        <hr className="lab-divider" />

        {/* How it works + Framework */}
        <div className="lab-how">
          <div>
            <p className="lab-section-label">HOW THE TWO WEEKS RUN</p>
            <h2 className="lab-section-h2">Four touchpoints. One transformation.</h2>
            <div className="lab-phases">
              {PHASES.map((p, i) => (
                <div key={i} className="lab-phase">
                  <div className="lab-phase-left">
                    <span className="lab-phase-num">{p.num}</span>
                    <div className="lab-phase-line" />
                  </div>
                  <div>
                    <div className="lab-phase-when">{p.when}</div>
                    <div className="lab-phase-title">{p.title}</div>
                    <p className="lab-phase-body">{p.body}</p>
                    <span className="lab-phase-tag" style={{ background: p.color, color: p.textColor }}>
                      {p.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="lab-section-label">THE FRAMEWORK YOU KEEP</p>
            <h2 className="lab-section-h2">8 steps. Works on any business problem.</h2>
            <div className="lab-fw-grid">
              {FRAMEWORK_STEPS.map((s, i) => (
                <div key={i} className="lab-fw-card">
                  <div className="lab-fw-num">{s.n}</div>
                  <div className="lab-fw-title">{s.t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="lab-bottom-cta">
          <div className="lab-bottom-inner">
            <h2 className="lab-bottom-h2">
              Ready to think differently?
            </h2>
            <p className="lab-bottom-sub">
              Max 5 people. Next cohort starts {getNextSaturday()}.
              Reserve your seat now — Ketan confirms within 24 hours.
            </p>
            <button className="lab-bottom-btn" onClick={() => setFormOpen(true)}>
              Reserve via WhatsApp →
            </button>
            <p className="lab-bottom-trust">
              ₹2,999 per person · No auto-renewal · Refund if not satisfied after Session 1
            </p>
            <p className="lab-bottom-diagnostic">
              Not sure yet?{' '}
              <button onClick={() => navigate('/diagnostic')}>
                Take the free 4-minute diagnostic first →
              </button>
            </p>
          </div>
        </div>
      </div>

      <InterestForm open={formOpen} onClose={() => setFormOpen(false)} waUrl={WA_URL} />
    </>
  )
}
