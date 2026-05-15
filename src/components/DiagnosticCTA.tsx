import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'

export default function DiagnosticCTA() {
  const navigate = useNavigate()
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
      { threshold: 0.2 }
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
        .dcta-section {
          background: var(--bg-base);
          padding: 0 32px;
          border-top: 1px solid var(--border-subtle);
        }
        .dcta-inner {
          max-width: 780px; margin: 0 auto;
          padding: 96px 0; text-align: center;
        }
        .dcta-banner {
          background: var(--bg-elevated);
          border: 1px solid var(--border-default);
          border-radius: 24px; padding: 64px 52px;
          position: relative; overflow: hidden;
        }
        .dcta-banner::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(168,85,247,0.6), rgba(255,107,157,0.6), transparent);
        }
        .dcta-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.16em;
          color: var(--accent); margin-bottom: 20px;
        }
        .dcta-h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(28px, 4vw, 50px);
          line-height: 1.15; color: var(--text-primary);
          font-weight: 400; margin-bottom: 20px;
        }
        .dcta-h2 em {
          font-style: italic;
          background: linear-gradient(135deg, #FF6B9D, #A855F7);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .dcta-body {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; line-height: 1.8;
          color: var(--text-secondary);
          max-width: 520px; margin: 0 auto 40px;
        }
        .dcta-body strong { color: var(--text-primary); font-weight: 500; }
        .dcta-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 17px; font-weight: 600;
          color: #fff; background: var(--accent);
          border: none; border-radius: 100px;
          padding: 18px 52px; cursor: pointer;
          transition: all 200ms ease;
          display: inline-block; margin-bottom: 28px;
          letter-spacing: 0.01em;
        }
        .dcta-btn:hover { filter: brightness(1.12); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(168,85,247,0.35); }
        .dcta-btn:active { transform: translateY(0); }
        .dcta-trust {
          display: flex; align-items: center; justify-content: center;
          gap: 20px; flex-wrap: wrap;
        }
        .dcta-trust-item {
          font-family: 'DM Mono', monospace;
          font-size: 12px; color: var(--text-tertiary);
          letter-spacing: 0.06em;
        }
        .dcta-trust-sep {
          width: 3px; height: 3px; border-radius: 50%;
          background: var(--border-default); flex-shrink: 0;
        }
        @media (max-width: 640px) {
          .dcta-section { padding: 0 20px; }
          .dcta-inner { padding: 72px 0; }
          .dcta-banner { padding: 48px 28px; border-radius: 20px; }
          .dcta-btn { width: 100%; max-width: 320px; }
        }
      `}</style>

      <section id="diagnostic-cta" className="dcta-section">
        <div ref={ref} className="dcta-inner">
          <div className="dcta-banner">
            <p data-reveal className="dcta-label">THE 4-MINUTE TEST</p>
            <h2 data-reveal className="dcta-h2">
              Most people think they think well.<br />Most are wrong.
            </h2>
            <p data-reveal className="dcta-body">
              We put you in a real work situation — the kind that decides who gets promoted
              and who gets managed out. No theory, no multiple choice.
              Just you, thinking through a problem.
              Our AI then shows you <strong>exactly where your reasoning is strong,
              and where it breaks down</strong> — the same things a senior leader
              notices in 30 seconds.
            </p>
            <div data-reveal>
              <button className="dcta-btn" onClick={() => navigate('/diagnostic')}>
                Find Out Where You Stand →
              </button>
            </div>
            <div data-reveal className="dcta-trust">
              <span className="dcta-trust-item">4 minutes</span>
              <span className="dcta-trust-sep" />
              <span className="dcta-trust-item">No signup</span>
              <span className="dcta-trust-sep" />
              <span className="dcta-trust-item">Free</span>
              <span className="dcta-trust-sep" />
              <span className="dcta-trust-item">Instant AI feedback</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
