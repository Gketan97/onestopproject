import { useEffect, useRef } from 'react'

const cards = [
  {
    icon: '◈',
    title: 'Business Thinking',
    body: 'Connect user behavior to business impact. Think in tradeoffs. Reason in systems. Understand why decisions get made — not just what they are.',
    outcomes: ['Stop describing symptoms', 'Identify root causes', 'Prioritize ruthlessly'],
  },
  {
    icon: '⬡',
    title: 'AI as a Thinking Partner',
    body: 'Structure your prompts with intent. Validate AI outputs critically. Reason WITH AI instead of depending ON AI.',
    outcomes: ['Use AI to think, not just generate', 'Spot when AI is wrong', '10x your output quality'],
  },
  {
    icon: '◎',
    title: 'Structured Problem Solving',
    body: 'Break ambiguous problems into frameworks. Generate hypotheses systematically. Communicate analytical thinking clearly.',
    outcomes: ["Never blank on hard questions", 'Structure messy information', 'Think clearly on your feet'],
  },
  {
    icon: '◇',
    title: 'Professional Edge',
    body: 'Handle ambiguity with confidence. Make decisions with incomplete information. Lead analytical conversations in any room.',
    outcomes: ['Think like a senior before you are one', "Be the person who 'gets it'", 'Compound faster than peers'],
  },
]

export default function Transformation() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll<HTMLElement>('[data-reveal]')
            items.forEach((el, i) => {
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
      { threshold: 0.1 }
    )
    if (ref.current) {
      ref.current.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(24px)'
      })
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        .trans-section {
          background: var(--bg-base);
          padding: 112px 32px;
          border-top: 1px solid var(--border-subtle);
        }
        .trans-inner { max-width: 1100px; margin: 0 auto; }
        .trans-header { text-align: center; margin-bottom: 72px; }
        .trans-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.16em;
          color: var(--accent);
          margin-bottom: 20px;
        }
        .trans-h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(30px, 3.5vw, 48px);
          font-weight: 400;
          color: var(--text-primary);
          line-height: 1.2;
          max-width: 560px;
          margin: 0 auto;
        }
        .trans-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .trans-card {
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 20px;
          padding: 36px;
          transition: border-color 200ms ease, transform 200ms ease;
          cursor: default;
        }
        .trans-card:hover {
          border-color: var(--border-default);
          transform: translateY(-2px);
        }
        .trans-card-icon {
          font-size: 22px;
          color: var(--text-tertiary);
          margin-bottom: 20px;
          display: block;
        }
        .trans-card-title {
          font-family: 'Instrument Serif', serif;
          font-size: 22px;
          font-weight: 400;
          color: var(--text-primary);
          margin-bottom: 14px;
        }
        .trans-card-body {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: 24px;
        }
        .trans-outcomes {
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-top: 1px solid var(--border-subtle);
          padding-top: 20px;
        }
        .trans-outcome {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: var(--text-tertiary);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .trans-outcome::before {
          content: '→';
          color: var(--accent);
          font-size: 12px;
          flex-shrink: 0;
        }
        .trans-tagline {
          text-align: center;
          margin-top: 64px;
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: clamp(20px, 2.5vw, 28px);
          color: var(--text-secondary);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.4;
        }
        .trans-tagline em {
          background: linear-gradient(135deg, #FF6B9D, #A855F7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-style: normal;
        }
        @media (max-width: 768px) {
          .trans-grid { grid-template-columns: 1fr; }
          .trans-section { padding: 80px 24px; }
          .trans-header { margin-bottom: 48px; }
        }
        @media (max-width: 480px) {
          .trans-section { padding: 64px 20px; }
          .trans-card { padding: 28px 24px; }
        }
      `}</style>

      <section id="transformation" className="trans-section">
        <div ref={ref} className="trans-inner">
          <div className="trans-header">
            <p data-reveal className="trans-label">THE TRANSFORMATION</p>
            <h2 data-reveal className="trans-h2">How you'll think differently.</h2>
          </div>

          <div className="trans-grid">
            {cards.map((card, i) => (
              <div key={i} data-reveal className="trans-card">
                <span className="trans-card-icon">{card.icon}</span>
                <div className="trans-card-title">{card.title}</div>
                <p className="trans-card-body">{card.body}</p>
                <div className="trans-outcomes">
                  {card.outcomes.map((o, j) => (
                    <span key={j} className="trans-outcome">{o}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p data-reveal className="trans-tagline">
            The outcome is not learning tools.<br />
            The outcome is <em>becoming a stronger thinker.</em>
          </p>
        </div>
      </section>
    </>
  )
}
