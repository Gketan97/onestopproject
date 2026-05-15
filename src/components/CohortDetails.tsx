import { useEffect, useRef, useState } from 'react'
import InterestForm from './InterestForm'

const WA_URL = 'https://wa.me/919XXXXXXXXX?text=Hi%20Ketan%2C%20I%27d%20like%20to%20reserve%20a%20seat%20for%20the%20Saturday%20AI%20Problem%20Solving%20Lab.'

function getNextSaturday(): string {
  const today = new Date()
  const day = today.getDay()
  const daysUntil = (6 - day + 7) % 7 || 7
  const next = new Date(today)
  next.setDate(today.getDate() + daysUntil)
  return next.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
}

const FRAMEWORK = [
  {
    num: '01',
    title: 'Understand the business',
    body: 'Before touching the problem, you understand what the company actually cares about — its revenue model, growth levers, and what success looks like for the team asking the question.',
  },
  {
    num: '02',
    title: 'Define the real problem',
    body: 'Most people solve the wrong problem because they never question the brief. You learn to separate what you\'ve been asked from what you should actually be solving.',
  },
  {
    num: '03',
    title: 'Break the problem into parts',
    body: 'Structure the problem space before investigating anything. What are the logical sub-problems? What do you need to know to answer each one?',
  },
  {
    num: '04',
    title: 'Generate hypotheses',
    body: 'Not a list of guesses — a structured set of testable explanations ranked by likelihood. You learn to think in hypotheses, not possibilities.',
  },
  {
    num: '05',
    title: 'Prioritise ruthlessly',
    body: 'You can\'t investigate everything. Which hypotheses have the highest probability and the highest impact if true? That\'s where you start.',
  },
  {
    num: '06',
    title: 'Structure your analysis',
    body: 'What data confirms or refutes each hypothesis? How do you use AI to move through this faster without losing rigour?',
  },
  {
    num: '07',
    title: 'Form a clear recommendation',
    body: 'Not "here are the findings." A specific recommendation with a reason and a next step. Something the person in front of you can actually act on.',
  },
  {
    num: '08',
    title: 'Stress test your thinking',
    body: 'Where are you most likely to be wrong? What assumption is doing the most work? Anticipating pushback before it comes is what separates sharp thinkers from everyone else.',
  },
]

const PHASES = [
  {
    num: '01',
    when: 'Before Saturday',
    title: 'Pre-read arrives in your inbox',
    body: 'You receive the full context over email — the company background, the business model, and the problem statement. Read it before Saturday. The session starts where the pre-read ends, not where it begins.',
    tag: 'Async · On your own time',
    tagBg: 'rgba(168,85,247,0.1)',
    tagColor: 'var(--accent)',
  },
  {
    num: '02',
    when: 'Saturday · 1.5 hours',
    title: 'Live problem solving with Ketan',
    body: 'You work through the first half of the case live with Ketan. He shows you how to apply the 8-step framework to this specific problem — using AI as a thinking partner, not an answer machine. You see exactly how a senior analyst approaches it.',
    tag: 'Live · Saturday',
    tagBg: 'rgba(34,197,94,0.1)',
    tagColor: '#4ade80',
  },
  {
    num: '03',
    when: 'Mid-week',
    title: 'WhatsApp group support',
    body: 'All cohort members are added to a private WhatsApp group. Post your questions, blockers, or hypotheses anytime. Ketan replies EOD. A mid-week doubt session is scheduled if needed — the group decides when.',
    tag: 'Async · WhatsApp group',
    tagBg: 'rgba(37,211,102,0.1)',
    tagColor: '#25D366',
  },
  {
    num: '04',
    when: 'Next Saturday · 2 hours',
    title: 'Evaluation and frameworks',
    body: 'Ketan reviews each person\'s work. Group debrief on what sharp thinking looked like versus what the group produced — the gap is where you grow. You leave with a framework that works on any problem, not just this one.',
    tag: 'Live · Next Saturday',
    tagBg: 'rgba(34,197,94,0.1)',
    tagColor: '#4ade80',
  },
]

export default function CohortDetails() {
  const ref = useRef<HTMLDivElement>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [activeStep, setActiveStep] = useState<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
              setTimeout(() => {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
                el.style.opacity = '1'
                el.style.transform = 'translateY(0)'
              }, i * 80)
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.06 }
    )
    if (ref.current) {
      ref.current.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(20px)'
      })
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        .cohort-section {
          background: var(--bg-base);
          padding: 112px 32px;
          border-top: 1px solid var(--border-subtle);
        }
        .cohort-inner {
          max-width: 1100px; margin: 0 auto;
        }

        /* Header */
        .cohort-header {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 64px; align-items: start; margin-bottom: 80px;
        }
        .cohort-label {
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 0.16em; color: var(--accent); margin-bottom: 16px;
        }
        .cohort-h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 400; color: var(--text-primary);
          line-height: 1.15; margin-bottom: 0;
        }
        .cohort-h2 em {
          font-style: italic;
          background: linear-gradient(135deg, #FF6B9D, #A855F7);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .cohort-intro {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; line-height: 1.8;
          color: var(--text-secondary); margin-bottom: 20px;
        }
        .cohort-intro strong { color: var(--text-primary); font-weight: 500; }
        .cohort-intro:last-child { margin-bottom: 0; }

        /* Case type callout */
        .cohort-case-type {
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 14px; padding: 20px 24px;
          margin-top: 28px;
        }
        .cohort-case-label {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.14em; color: var(--text-tertiary); margin-bottom: 10px;
        }
        .cohort-case-examples {
          display: flex; flex-wrap: wrap; gap: 8px;
        }
        .cohort-case-tag {
          font-family: 'DM Sans', sans-serif; font-size: 12px;
          color: var(--text-secondary);
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-subtle);
          border-radius: 6px; padding: 5px 12px;
        }

        /* Framework section */
        .cohort-framework-wrap {
          margin-bottom: 80px;
        }
        .cohort-framework-header {
          display: flex; align-items: baseline;
          justify-content: space-between; margin-bottom: 28px;
          flex-wrap: wrap; gap: 12px;
        }
        .cohort-framework-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(20px, 2.5vw, 28px);
          color: var(--text-primary); font-weight: 400;
        }
        .cohort-framework-sub {
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 0.1em; color: var(--text-tertiary);
        }
        .cohort-framework-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .cohort-fw-card {
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 14px; padding: 20px 18px;
          cursor: pointer;
          transition: border-color 200ms ease, background 200ms ease;
        }
        .cohort-fw-card:hover,
        .cohort-fw-card.active {
          border-color: rgba(168,85,247,0.35);
          background: rgba(168,85,247,0.05);
        }
        .cohort-fw-num {
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 0.1em; color: var(--accent); margin-bottom: 10px;
        }
        .cohort-fw-title {
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          font-weight: 600; color: var(--text-primary);
          line-height: 1.35; margin-bottom: 0;
        }
        .cohort-fw-body {
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          line-height: 1.65; color: var(--text-secondary);
          margin-top: 10px;
          max-height: 0; overflow: hidden;
          transition: max-height 300ms ease, margin-top 300ms ease;
        }
        .cohort-fw-body.open {
          max-height: 120px;
        }

        /* Phase timeline + card grid */
        .cohort-bottom {
          display: grid; grid-template-columns: 1fr 360px;
          gap: 64px; align-items: start;
        }

        /* Phases */
        .cohort-phases-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(20px, 2.5vw, 28px);
          color: var(--text-primary); font-weight: 400; margin-bottom: 28px;
        }
        .cohort-phases { display: flex; flex-direction: column; }
        .cohort-phase {
          display: grid; grid-template-columns: 52px 1fr;
          gap: 0 16px; padding: 24px 0;
          border-bottom: 1px solid var(--border-subtle);
        }
        .cohort-phase:last-child { border-bottom: none; }
        .cohort-phase-left {
          display: flex; flex-direction: column; align-items: center; padding-top: 2px;
        }
        .cohort-phase-num {
          font-family: 'DM Mono', monospace; font-size: 12px;
          color: var(--accent); letter-spacing: 0.08em; margin-bottom: 8px;
        }
        .cohort-phase-line {
          width: 1px; flex: 1; background: var(--border-subtle); min-height: 24px;
        }
        .cohort-phase:last-child .cohort-phase-line { display: none; }
        .cohort-phase-when {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.1em; color: var(--text-tertiary); margin-bottom: 6px;
        }
        .cohort-phase-title {
          font-family: 'DM Sans', sans-serif; font-size: 15px;
          font-weight: 600; color: var(--text-primary); margin-bottom: 8px;
        }
        .cohort-phase-body {
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          line-height: 1.7; color: var(--text-secondary); margin-bottom: 10px;
        }
        .cohort-phase-tag {
          display: inline-block; font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.08em;
          border-radius: 5px; padding: 4px 10px;
        }

        /* Signup card */
        .cohort-card {
          background: var(--bg-elevated);
          border: 1px solid rgba(168,85,247,0.22);
          border-radius: 22px; padding: 32px;
          position: sticky; top: 88px;
        }
        .cohort-card-next {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.14em; color: var(--text-tertiary); margin-bottom: 4px;
        }
        .cohort-card-date {
          font-family: 'DM Sans', sans-serif; font-size: 15px;
          font-weight: 500; color: var(--text-primary);
          margin-bottom: 20px; padding-bottom: 20px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .cohort-seats {
          display: flex; align-items: center; gap: 8px; margin-bottom: 18px;
        }
        .cohort-seats-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #4ade80; box-shadow: 0 0 6px #4ade80;
          animation: seat-pulse 2s ease-in-out infinite;
        }
        @keyframes seat-pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        .cohort-seats-text {
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 0.08em; color: #4ade80;
        }
        .cohort-price {
          font-family: 'Instrument Serif', serif;
          font-size: 46px; color: var(--text-primary);
          line-height: 1; margin-bottom: 4px;
        }
        .cohort-price-per {
          font-family: 'DM Mono', monospace; font-size: 11px;
          color: var(--text-tertiary); margin-bottom: 22px; letter-spacing: 0.06em;
        }
        .cohort-includes { display: flex; flex-direction: column; gap: 9px; margin-bottom: 26px; }
        .cohort-include {
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: var(--text-secondary);
          display: flex; align-items: flex-start; gap: 10px; line-height: 1.5;
        }
        .cohort-include::before { content: '✓'; color: #4ade80; flex-shrink: 0; }
        .cohort-include:nth-last-child(-n+2) { color: var(--text-primary); font-weight: 500; }
        .cohort-include:nth-last-child(-n+2)::before { content: ''; display: none; }
        .cohort-btn {
          width: 100%; font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 600;
          color: #fff; background: var(--accent);
          border: none; border-radius: 100px;
          padding: 15px; cursor: pointer;
          transition: all 200ms ease; margin-bottom: 12px; letter-spacing: 0.01em;
        }
        .cohort-btn:hover { filter: brightness(1.1); transform: scale(1.01); }
        .cohort-refund {
          background: rgba(34,197,94,0.07);
          border: 1px solid rgba(34,197,94,0.18);
          border-radius: 10px; padding: 12px 16px;
          margin-bottom: 14px; text-align: center;
        }
        .cohort-refund-text {
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: #4ade80; line-height: 1.5;
        }
        .cohort-refund-text strong { font-weight: 600; }
        .cohort-trust {
          font-family: 'DM Mono', monospace; font-size: 10px;
          color: var(--text-tertiary); text-align: center; letter-spacing: 0.06em;
          line-height: 1.6;
        }


        /* Outcomes */
        .cohort-outcomes-wrap { margin-bottom: 80px; }
        .cohort-outcomes-h3 {
          font-family: 'DM Sans', sans-serif;
          font-size: 17px; color: var(--text-secondary);
          line-height: 1.7; margin-bottom: 48px; max-width: 580px;
          font-weight: 400;
        }
        .cohort-outcome-block { margin-bottom: 52px; }
        .cohort-outcome-header {
          display: flex; align-items: flex-start; gap: 20px; margin-bottom: 24px;
        }
        .cohort-outcome-num {
          font-family: 'DM Mono', monospace; font-size: 13px;
          color: var(--accent); letter-spacing: 0.1em; flex-shrink: 0; padding-top: 2px;
        }
        .cohort-outcome-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(18px, 2vw, 24px); color: var(--text-primary);
          font-weight: 400; margin-bottom: 6px; line-height: 1.25;
        }
        .cohort-outcome-desc {
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          color: var(--text-secondary); line-height: 1.7;
        }
        /* AI cards */
        .cohort-ai-cards {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 10px; margin-left: 33px;
        }
        .cohort-ai-card {
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 12px; padding: 18px 20px;
        }
        .cohort-ai-label {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.12em; color: var(--accent); margin-bottom: 8px;
        }
        .cohort-ai-body {
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          line-height: 1.65; color: var(--text-secondary);
        }
        /* Business context */
        .cohort-context-row {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 10px; margin-left: 33px;
        }
        .cohort-context-card {
          display: flex; align-items: flex-start; gap: 12px;
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 12px; padding: 16px 18px;
        }
        .cohort-context-icon { font-size: 18px; flex-shrink: 0; }
        .cohort-context-q {
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: var(--text-secondary); line-height: 1.6;
        }
        .cohort-framework-grid { margin-left: 33px; }
        @media (max-width: 1024px) {
          .cohort-framework-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 960px) {
          .cohort-header { grid-template-columns: 1fr; gap: 32px; margin-bottom: 56px; }
          .cohort-bottom { grid-template-columns: 1fr; gap: 48px; }
          .cohort-card { position: static; }
          .cohort-section { padding: 80px 24px; }
        }
        @media (max-width: 600px) {
          .cohort-framework-grid { grid-template-columns: 1fr 1fr; }
          .cohort-section { padding: 64px 20px; }
          .cohort-card { padding: 24px 20px; border-radius: 18px; }
          .cohort-price { font-size: 38px; }
        }
        @media (max-width: 400px) {
          .cohort-framework-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <section id="cohort" className="cohort-section">
        <div ref={ref} className="cohort-inner">

          {/* Header — what this cohort is */}
          <div className="cohort-header">
            <div>
              <p data-reveal className="cohort-label">WHAT TO EXPECT IN THIS COHORT</p>
              <h2 data-reveal className="cohort-h2">
                One real case.<br />
                <em>Eight ways to think about it.</em>
              </h2>
            </div>
            <div>
              <p data-reveal className="cohort-intro">
                Every cohort works through one real business problem from a consumer internet company —
                the kind of ambiguous, messy situation that product, analytics, and strategy teams
                actually deal with. <strong>Not a textbook case. A real one.</strong>
              </p>
              <p data-reveal className="cohort-intro">
                The case is the vehicle. The framework is what you keep.
                By the end, you're not just better at this case — you're better at every problem
                that looks like it.
              </p>
              <div data-reveal className="cohort-case-type">
                <div className="cohort-case-label">THE TYPE OF PROBLEMS WE SOLVE</div>
                <div className="cohort-case-examples">
                  {[
                    'Why did our bookings drop 20%?',
                    'Which customer segment should we prioritise?',
                    'Why are users not converting?',
                    'How do we grow in a new market?',
                    "What's driving churn in our top tier?",
                    'Where should we invest next quarter?',
                  ].map((ex, i) => (
                    <span key={i} className="cohort-case-tag">{ex}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Outcomes */}
          <div data-reveal className="cohort-outcomes-wrap">
            <p className="cohort-label">WHAT YOU WALK AWAY WITH</p>
            <p className="cohort-outcomes-h3">
              Three things that transfer to every problem you face after this cohort.
            </p>

            {/* Outcome 1 — Framework */}
            <div className="cohort-outcome-block">
              <div className="cohort-outcome-header">
                <span className="cohort-outcome-num">01</span>
                <div>
                  <div className="cohort-outcome-title">The 8-step problem solving framework</div>
                  <div className="cohort-outcome-desc">A repeatable way to go from a messy, ambiguous problem to a clear recommendation. Works on any business question — not just this case. Tap any step to see what it actually means.</div>
                </div>
              </div>
              <div className="cohort-framework-grid">
                {FRAMEWORK.map((step, i) => (
                  <div
                    key={i}
                    className={`cohort-fw-card${activeStep === i ? ' active' : ''}`}
                    onClick={() => setActiveStep(activeStep === i ? null : i)}
                  >
                    <div className="cohort-fw-num">{step.num}</div>
                    <div className="cohort-fw-title">{step.title}</div>
                    <div className={`cohort-fw-body${activeStep === i ? ' open' : ''}`}>
                      {step.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outcome 2 — AI in decision making */}
            <div className="cohort-outcome-block">
              <div className="cohort-outcome-header">
                <span className="cohort-outcome-num">02</span>
                <div>
                  <div className="cohort-outcome-title">How to use AI in real decision making</div>
                  <div className="cohort-outcome-desc">Not prompting tips. The actual mental model for when to use AI, how to direct it, and how to pressure-test what it gives you before you act on it.</div>
                </div>
              </div>
              <div className="cohort-ai-cards">
                {[
                  { label: 'USE AI TO STRUCTURE', body: 'Break a vague problem into a logical tree before you start investigating.' },
                  { label: 'USE AI TO GENERATE', body: 'Surface hypotheses you might have missed — then decide which ones are worth testing.' },
                  { label: 'USE AI TO PRESSURE-TEST', body: 'Challenge your own recommendation before someone else does in the room.' },
                  { label: 'USE AI TO COMMUNICATE', body: 'Turn a messy analysis into a sharp narrative your stakeholders can actually act on.' },
                ].map((c, i) => (
                  <div key={i} className="cohort-ai-card">
                    <div className="cohort-ai-label">{c.label}</div>
                    <div className="cohort-ai-body">{c.body}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outcome 3 — Business context */}
            <div className="cohort-outcome-block" style={{ marginBottom: 0 }}>
              <div className="cohort-outcome-header">
                <span className="cohort-outcome-num">03</span>
                <div>
                  <div className="cohort-outcome-title">How to read business context fast</div>
                  <div className="cohort-outcome-desc">The ability to pick up any company, any problem, and quickly understand what actually matters — the revenue model, growth levers, and what a good answer looks like for that specific business.</div>
                </div>
              </div>
              <div className="cohort-context-row">
                {[
                  { q: 'How does this company actually make money?', icon: '💰' },
                  { q: 'What is this team optimising for right now?', icon: '🎯' },
                  { q: 'What would a win look like for this business?', icon: '🏆' },
                  { q: 'What data matters here — and what is noise?', icon: '📊' },
                ].map((item, i) => (
                  <div key={i} className="cohort-context-card">
                    <span className="cohort-context-icon">{item.icon}</span>
                    <span className="cohort-context-q">{item.q}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Phase plan + signup card */}
          <div className="cohort-bottom">
            <div>
              <h3 data-reveal className="cohort-phases-title">How the two weeks run</h3>
              <div data-reveal className="cohort-phases">
                {PHASES.map((p, i) => (
                  <div key={i} className="cohort-phase">
                    <div className="cohort-phase-left">
                      <span className="cohort-phase-num">{p.num}</span>
                      <div className="cohort-phase-line" />
                    </div>
                    <div>
                      <div className="cohort-phase-when">{p.when}</div>
                      <div className="cohort-phase-title">{p.title}</div>
                      <p className="cohort-phase-body">{p.body}</p>
                      <span
                        className="cohort-phase-tag"
                        style={{ background: p.tagBg, color: p.tagColor }}
                      >
                        {p.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Signup card */}
            <div data-reveal className="cohort-card">
              <div className="cohort-card-next">NEXT COHORT STARTS</div>
              <div className="cohort-card-date">{getNextSaturday()}</div>
              <div className="cohort-seats">
                <span className="cohort-seats-dot" />
                <span className="cohort-seats-text">3 of 5 seats remaining</span>
              </div>
              <div className="cohort-price">₹2,999</div>
              <div className="cohort-price-per">PER PERSON</div>
              <div className="cohort-includes">
                {[
                  'Full case pre-read material over email',
                  '1.5 hr live Saturday session with Ketan',
                  'Private WhatsApp group — Ketan replies EOD',
                  'Mid-week doubt session if the group needs it',
                  '2 hr evaluation session next Saturday',
                  'Access to Case Study AI during cohort',
                  'Session recordings',
                  'The 8-step framework to keep',
                  '🎁 Bonus: Ketan\'s personal AI prompt library',
                  '🎁 Bonus: Case debrief notes shared after Session 2',
                ].map((item, i) => (
                  <span key={i} className="cohort-include">{item}</span>
                ))}
              </div>
              <button className="cohort-btn" onClick={() => setFormOpen(true)}>
                Reserve via WhatsApp →
              </button>
              <div className="cohort-refund">
                <p className="cohort-refund-text">
                  <strong>No questions asked refund.</strong> If you are not satisfied after Session 1, we refund you in full.
                </p>
              </div>
              <p className="cohort-trust">
                No auto-renewal · Pay per person · full cohort<br />
                Ketan confirms your seat within 24 hrs
              </p>
            </div>
          </div>

        </div>
      </section>

      <InterestForm open={formOpen} onClose={() => setFormOpen(false)} waUrl={WA_URL} />
    </>
  )
}