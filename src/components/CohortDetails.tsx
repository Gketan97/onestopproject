import { useEffect, useRef, useState } from 'react'
import InterestForm from './InterestForm'

const WA_URL = 'https://wa.me/919XXXXXXXXX?text=Hi%20Ketan%2C%20I%27d%20like%20to%20reserve%20a%20seat%20for%20the%20Friday%20AI%20Problem%20Solving%20Lab.'

function getNextFriday(): string {
  const today = new Date()
  const day = today.getDay()
  const daysUntilFriday = (5 - day + 7) % 7 || 7
  const nextFriday = new Date(today)
  nextFriday.setDate(today.getDate() + daysUntilFriday)
  return nextFriday.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function CohortDetails() {
  const ref = useRef<HTMLDivElement>(null)
  const [formOpen, setFormOpen] = useState(false)

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
              }, i * 90)
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
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

  const steps = [
    { num: '01', time: '0:00–0:30', title: 'Context setting', body: 'Ketan walks through the case background, raw data files, and step-by-step methodology. You understand the full problem space before solving.' },
    { num: '02', time: '0:30–2:00', title: 'Live solving', body: 'The group works through early phases with Ketan in real time. He watches how you think, not just what you answer.' },
    { num: '03', time: 'That week', title: 'Independent work with AI', body: "You solve remaining phases on your own using AI as a thinking partner. Build a structured report of your findings." },
    { num: '04', time: 'Before Fri', title: 'Submit your report', body: 'Share your structured analysis with Ketan on WhatsApp before Session 2. This is the work he reviews.' },
    { num: '05', time: 'Session 2', title: 'Debrief + frameworks', body: 'Ketan reviews each person\'s thinking, surfaces blind spots, and extracts transferable frameworks from the case.' },
  ]

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
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 80px;
          align-items: start;
        }
        .cohort-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.16em;
          color: var(--accent); margin-bottom: 16px;
        }
        .cohort-h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 400; color: var(--text-primary);
          line-height: 1.2; margin-bottom: 12px;
        }
        .cohort-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; line-height: 1.65;
          color: var(--text-secondary); margin-bottom: 48px;
          max-width: 480px;
        }
        .cohort-steps { display: flex; flex-direction: column; gap: 0; }
        .cohort-step {
          display: flex; gap: 24px; padding: 24px 0;
          border-bottom: 1px solid var(--border-subtle);
        }
        .cohort-step:first-child { border-top: 1px solid var(--border-subtle); }
        .cohort-step-num {
          font-family: 'DM Mono', monospace;
          font-size: 13px; color: var(--accent);
          letter-spacing: 0.08em; flex-shrink: 0;
          padding-top: 2px; min-width: 28px;
        }
        .cohort-step-time {
          font-family: 'DM Mono', monospace;
          font-size: 11px; color: var(--text-tertiary);
          letter-spacing: 0.06em; margin-bottom: 4px;
        }
        .cohort-step-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 500;
          color: var(--text-primary); margin-bottom: 6px;
        }
        .cohort-step-body {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; line-height: 1.6;
          color: var(--text-secondary);
        }
        .cohort-not {
          margin-top: 36px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 16px; padding: 24px 28px;
        }
        .cohort-not-title {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.12em;
          color: var(--text-tertiary); margin-bottom: 14px;
        }
        .cohort-not-items { display: flex; flex-direction: column; gap: 8px; }
        .cohort-not-item {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: var(--text-tertiary);
          display: flex; align-items: center; gap: 10px;
        }
        .cohort-not-item::before {
          content: '✕'; color: var(--red); font-size: 11px; flex-shrink: 0;
        }
        /* RIGHT CARD */
        .cohort-card {
          background: var(--bg-elevated);
          border: 1px solid var(--accent-border);
          border-radius: 24px; padding: 36px;
          position: sticky; top: 80px;
        }
        .cohort-card-next {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.12em;
          color: var(--text-tertiary); margin-bottom: 4px;
        }
        .cohort-card-date {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; color: var(--text-primary);
          font-weight: 500; margin-bottom: 28px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .cohort-card-price {
          font-family: 'Instrument Serif', serif;
          font-size: 52px; color: var(--text-primary);
          line-height: 1; margin-bottom: 4px;
        }
        .cohort-card-per {
          font-family: 'DM Mono', monospace;
          font-size: 12px; color: var(--text-tertiary);
          margin-bottom: 28px;
        }
        .cohort-card-includes { display: flex; flex-direction: column; gap: 10px; margin-bottom: 32px; }
        .cohort-card-include {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: var(--text-secondary);
          display: flex; align-items: center; gap: 10px;
        }
        .cohort-card-include::before { content: '✓'; color: var(--green); flex-shrink: 0; }
        .cohort-card-btn {
          width: 100%;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 500;
          color: #fff; background: var(--accent);
          border: none; border-radius: 100px;
          padding: 16px; cursor: pointer;
          transition: all 200ms ease; margin-bottom: 16px;
        }
        .cohort-card-btn:hover { filter: brightness(1.12); transform: scale(1.01); }
        .cohort-card-trust {
          font-family: 'DM Mono', monospace;
          font-size: 11px; color: var(--text-tertiary);
          text-align: center; letter-spacing: 0.06em;
        }
        .cohort-seats {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 24px;
        }
        .cohort-seats-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 6px var(--green);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .cohort-seats-text {
          font-family: 'DM Mono', monospace;
          font-size: 12px; color: var(--green); letter-spacing: 0.08em;
        }
        @media (max-width: 960px) {
          .cohort-inner { grid-template-columns: 1fr; gap: 48px; }
          .cohort-card { position: static; }
          .cohort-section { padding: 80px 24px; }
        }
        @media (max-width: 480px) {
          .cohort-section { padding: 64px 20px; }
          .cohort-card { padding: 28px 24px; border-radius: 20px; }
          .cohort-card-price { font-size: 44px; }
        }
      `}</style>

      <section id="cohort" className="cohort-section">
        <div ref={ref} className="cohort-inner">
          <div>
            <p data-reveal className="cohort-label">THE LAB</p>
            <h2 data-reveal className="cohort-h2">Friday AI Problem<br />Solving Lab</h2>
            <p data-reveal className="cohort-sub">
              Not a course. Not a bootcamp.
              A live thinking environment with Ketan — where you solve real problems and get honest feedback.
            </p>

            <div data-reveal className="cohort-steps">
              {steps.map((s, i) => (
                <div key={i} className="cohort-step">
                  <span className="cohort-step-num">{s.num}</span>
                  <div>
                    <div className="cohort-step-time">{s.time}</div>
                    <div className="cohort-step-title">{s.title}</div>
                    <div className="cohort-step-body">{s.body}</div>
                  </div>
                </div>
              ))}
            </div>

            <div data-reveal className="cohort-not">
              <div className="cohort-not-title">THIS IS NOT</div>
              <div className="cohort-not-items">
                {['Pre-recorded videos', 'Slides and lectures', 'Generic AI prompting tips', 'Another LinkedIn course'].map((item, i) => (
                  <span key={i} className="cohort-not-item">{item}</span>
                ))}
              </div>
            </div>
          </div>

          <div data-reveal className="cohort-card">
            <div className="cohort-card-next">NEXT SESSION</div>
            <div className="cohort-card-date">{getNextFriday()}</div>

            <div className="cohort-seats">
              <span className="cohort-seats-dot" />
              <span className="cohort-seats-text">3 of 5 seats remaining</span>
            </div>

            <div className="cohort-card-price">₹2,500</div>
            <div className="cohort-card-per">per session</div>

            <div className="cohort-card-includes">
              {[
                '2-hour live session with Ketan',
                'Independent case work with AI',
                'Structured report feedback',
                'Session recording',
                'Case study materials',
              ].map((item, i) => (
                <span key={i} className="cohort-card-include">{item}</span>
              ))}
            </div>

            <button
              className="cohort-card-btn"
              onClick={() => setFormOpen(true)}
            >
              Reserve via WhatsApp →
            </button>
            <div className="cohort-card-trust">
              No auto-renewal · Pay per session
            </div>
          </div>
        </div>
      </section>

      <InterestForm open={formOpen} onClose={() => setFormOpen(false)} waUrl={WA_URL} />
    </>
  )
}