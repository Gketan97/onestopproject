import { useEffect, useRef } from 'react'

export default function TruthStatement() {
  const ref = useRef<HTMLDivElement>(null)

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
              }, i * 100)
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
        .truth-section {
          background: var(--bg-surface);
          padding: 96px 32px;
          border-top: 1px solid var(--border-subtle);
        }
        .truth-inner {
          max-width: 1060px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 72px; align-items: center;
        }
        .truth-label {
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: 0.16em; color: var(--accent); margin-bottom: 16px;
        }
        .truth-h2 {
          font-family: var(--font-display);
          font-size: clamp(28px, 3.5vw, 42px);
          line-height: 1.2; color: var(--text-primary);
          font-weight: 400; margin-bottom: 20px;
        }
        .truth-h2 em {
          font-style: italic;
          background: linear-gradient(135deg, #FF6B9D, #A855F7);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .truth-para {
          font-family: var(--font-body); font-size: 16px;
          line-height: 1.8; color: var(--text-secondary); margin-bottom: 14px;
        }
        .truth-para strong { color: var(--text-primary); font-weight: 500; }
        .truth-cards { display: flex; flex-direction: column; gap: 12px; }
        .truth-card { border-radius: 16px; padding: 24px 22px; border: 1px solid; }
        .truth-card.bad { background: rgba(239,68,68,0.04); border-color: rgba(239,68,68,0.14); }
        .truth-card.good { background: rgba(34,197,94,0.04); border-color: rgba(34,197,94,0.18); }
        .truth-card-label {
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.14em; margin-bottom: 10px;
        }
        .truth-card-label.bad { color: #f87171; }
        .truth-card-label.good { color: #4ade80; }
        .truth-card-title {
          font-family: var(--font-display); font-style: italic;
          font-size: 16px; color: var(--text-primary);
          line-height: 1.5; margin-bottom: 10px;
        }
        .truth-card-body {
          font-family: var(--font-body); font-size: 13px;
          line-height: 1.65; color: var(--text-secondary);
        }
        .truth-tagline {
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: 0.08em; color: var(--text-tertiary); text-align: center;
        }
        @media (max-width: 860px) {
          .truth-inner { grid-template-columns: 1fr; gap: 40px; }
          .truth-section { padding: 72px 24px; }
        }
        @media (max-width: 480px) { .truth-section { padding: 56px 20px; } }
      `}</style>

      <section id="truth" className="truth-section">
        <div ref={ref} className="truth-inner">
          <div>
            <p data-reveal className="truth-label">WHAT IS ACTUALLY CHANGING</p>
            <h2 data-reveal className="truth-h2">
              Everyone has the same AI.<br />
              <em>Not everyone knows how to think with it.</em>
            </h2>
            <p data-reveal className="truth-para">
              The playing field for tools is completely flat.
              What is not flat is the quality of thinking you bring to them.
              <strong> AI gives you leverage — but leverage amplifies
              whatever thinking you already have.</strong>
            </p>
            <p data-reveal className="truth-para">
              Shallow thinking with AI gives you more shallow output, faster.
              Structured thinking with AI gives you an unfair advantage.
              <strong> The gap between people who get this and those who do not
              is growing every single month.</strong>
            </p>
          </div>

          <div data-reveal className="truth-cards">
            <div className="truth-card bad">
              <div className="truth-card-label bad">✕ HOW MOST PEOPLE RESPOND</div>
              <div className="truth-card-title">
                "It could be pricing, or the app was slow, or maybe they just were not hungry."
              </div>
              <div className="truth-card-body">
                Five possible reasons, equal weight, no view on which matters.
                Safe. Forgettable. Gives the person asking nothing to act on.
              </div>
            </div>
            <div className="truth-card good">
              <div className="truth-card-label good">✓ HOW SHARP THINKERS RESPOND</div>
              <div className="truth-card-title">
                "They had intent — 5 minutes of browsing proves it. My best hypothesis: price shock at checkout."
              </div>
              <div className="truth-card-body">
                One hypothesis with a reason. Uses what we already know to rule things out.
                Ends with something testable. This is what gets you trusted with bigger problems.
              </div>
            </div>
            <p className="truth-tagline">This is a learnable skill. The lab exists to build it.</p>
          </div>
        </div>
      </section>
    </>
  )
}
