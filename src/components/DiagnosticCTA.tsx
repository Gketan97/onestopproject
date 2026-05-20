import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'

export default function DiagnosticCTA() {
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
            setTimeout(() => {
              el.style.transition = 'opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)'
              el.style.opacity = '1'
              el.style.transform = 'translateY(0)'
            }, i * 110)
          })
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.2 })
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
          max-width: 720px; margin: 0 auto;
          padding: 88px 0;
        }
        .dcta-banner {
          background: var(--bg-elevated);
          border: 1px solid var(--border-default);
          border-radius: 20px; padding: 56px 48px;
          position: relative; overflow: hidden;
          text-align: center;
        }
        .dcta-banner::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(168,85,247,0.6), rgba(255,107,157,0.6), transparent);
        }
        .dcta-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.16em;
          color: var(--accent); margin-bottom: 18px;
        }
        .dcta-h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(26px, 4vw, 48px);
          line-height: 1.15; color: var(--text-primary);
          font-weight: 400; margin-bottom: 18px;
        }
        .dcta-h2 em {
          font-style: italic;
          background: linear-gradient(135deg, #FF6B9D, #A855F7);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .dcta-body {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; line-height: 1.75;
          color: var(--text-secondary);
          max-width: 440px; margin: 0 auto 32px;
        }
        .dcta-body strong { color: var(--text-primary); font-weight: 500; }

        /* Button — never wraps */
        .dcta-btn {
          display: inline-block;
          font-family: 'DM Sans', sans-serif;
          font-size: 17px; font-weight: 600;
          color: #fff; background: var(--accent);
          border: none; border-radius: 100px;
          padding: 17px 48px;
          cursor: pointer; white-space: nowrap;
          transition: all 220ms cubic-bezier(0.22,1,0.36,1);
          margin-bottom: 22px;
          animation: dcta-pulse 3s ease-in-out infinite;
        }
        @keyframes dcta-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(168,85,247,0); }
          50% { box-shadow: 0 0 0 8px rgba(168,85,247,0.12); }
        }
        .dcta-btn:hover {
          filter: brightness(1.12);
          transform: translateY(-2px);
          box-shadow: 0 10px 36px rgba(168,85,247,0.35);
          animation: none;
        }
        .dcta-btn:active { transform: translateY(0); }

        /* Trust row */
        .dcta-trust {
          display: flex; align-items: center;
          justify-content: center; gap: 14px; flex-wrap: wrap;
        }
        .dcta-trust-item {
          font-family: 'DM Mono', monospace;
          font-size: 11px; color: var(--text-tertiary); letter-spacing: 0.06em;
        }
        .dcta-trust-dot {
          width: 3px; height: 3px; border-radius: 50%;
          background: var(--border-default); flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .dcta-section { padding: 0 20px; }
          .dcta-inner { padding: 64px 0; }
          .dcta-banner { padding: 40px 24px; border-radius: 16px; }
          .dcta-btn { width: 100%; max-width: 300px; }
        }
      `}</style>

      <section id="diagnostic-cta" className="dcta-section">
        <div ref={ref} className="dcta-inner">
          <div className="dcta-banner">
            <p data-reveal className="dcta-label">THE 4-MINUTE TEST</p>
            <h2 data-reveal className="dcta-h2">
              Most people think they think well.<br />
              <em>Most are wrong.</em>
            </h2>
            <p data-reveal className="dcta-body">
              No theory. No multiple choice. A real work situation —
              and AI feedback that shows you <strong>exactly where
              your reasoning breaks down.</strong>
            </p>
            <div data-reveal>
              <button className="dcta-btn" onClick={() => navigate('/diagnostic')}>
                Test Yourself Free →
              </button>
            </div>
            <div data-reveal className="dcta-trust">
              <span className="dcta-trust-item">4 minutes</span>
              <span className="dcta-trust-dot" />
              <span className="dcta-trust-item">No signup</span>
              <span className="dcta-trust-dot" />
              <span className="dcta-trust-item">Free</span>
              <span className="dcta-trust-dot" />
              <span className="dcta-trust-item">Instant result</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
