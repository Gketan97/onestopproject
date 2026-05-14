import { useEffect, useRef } from 'react'

export default function TruthStatement() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll<HTMLElement>('[data-reveal]')
            items.forEach((el, i) => {
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
      { threshold: 0.15 }
    )
    if (ref.current) {
      const items = ref.current.querySelectorAll<HTMLElement>('[data-reveal]')
      items.forEach(el => {
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
          padding: 112px 32px;
          border-top: 1px solid var(--border-subtle);
        }
        .truth-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
        }
        .truth-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.16em;
          color: var(--accent);
          margin-bottom: 20px;
        }
        .truth-h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(32px, 3.5vw, 48px);
          line-height: 1.15;
          color: var(--text-primary);
          font-weight: 400;
          margin-bottom: 32px;
        }
        .truth-h2 em {
          font-style: italic;
          background: linear-gradient(135deg, #FF6B9D, #A855F7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .truth-para {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          line-height: 1.75;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }
        .truth-para strong { color: var(--text-primary); font-weight: 500; }
        .truth-cards {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .truth-card {
          background: var(--bg-elevated);
          border-radius: 16px;
          padding: 24px 28px;
          border: 1px solid var(--border-subtle);
          transition: border-color 200ms ease;
        }
        .truth-card:hover { border-color: var(--border-default); }
        .truth-card-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.16em;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .truth-card-label.bad { color: var(--red); }
        .truth-card-label.good { color: var(--green); }
        .truth-card-title {
          font-family: 'Instrument Serif', serif;
          font-size: 22px;
          color: var(--text-primary);
          margin-bottom: 10px;
          font-weight: 400;
        }
        .truth-card-body {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: var(--text-secondary);
        }
        .truth-card.bad { border-color: rgba(239,68,68,0.15); }
        .truth-card.good { border-color: rgba(34,197,94,0.15); }
        .truth-card.bad:hover { border-color: rgba(239,68,68,0.30); }
        .truth-card.good:hover { border-color: rgba(34,197,94,0.30); }
        .truth-tagline {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: var(--text-tertiary);
          text-align: center;
          margin-top: 8px;
          font-style: italic;
        }
        @media (max-width: 900px) {
          .truth-inner { grid-template-columns: 1fr; gap: 48px; }
          .truth-section { padding: 80px 24px; }
        }
        @media (max-width: 480px) {
          .truth-section { padding: 64px 20px; }
          .truth-card { padding: 20px; }
        }
      `}</style>

      <section id="truth" className="truth-section">
        <div ref={ref} className="truth-inner">
          <div>
            <p data-reveal className="truth-label">THE SHIFT</p>
            <h2 data-reveal className="truth-h2">
              AI amplifies how you think.<br />
              <em>Not what you think.</em>
            </h2>
            <p data-reveal className="truth-para">
              Every professional now has access to the same AI tools.
              ChatGPT. Gemini. Claude. <strong>The playing field is flat.</strong>
            </p>
            <p data-reveal className="truth-para">
              What's NOT flat: the quality of thinking you bring to them.
              A shallow question gets a shallow answer — even from the world's best AI.
              A structured thinker gets a strategic output.
            </p>
            <p data-reveal className="truth-para">
              <strong>The gap between professionals is widening. Fast.</strong>
            </p>
          </div>

          <div data-reveal className="truth-cards">
            <div className="truth-card bad">
              <div className="truth-card-label bad">✕ SHALLOW THINKING</div>
              <div className="truth-card-title">"The app was slow. Maybe prices were high."</div>
              <div className="truth-card-body">
                3 surface-level guesses. No structure. No prioritization.
                No connection to business impact. This is most people's answer.
              </div>
            </div>
            <div className="truth-card good">
              <div className="truth-card-label good">✓ STRUCTURED THINKING</div>
              <div className="truth-card-title">"Intent → Friction → Supply → Trust"</div>
              <div className="truth-card-body">
                One prioritized hypothesis with a clear framework.
                "The user had intent but hit friction in the discovery phase —
                most likely menu complexity or delivery time anxiety."
              </div>
            </div>
            <p className="truth-tagline">
              The difference is learnable. That's what the lab teaches.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
