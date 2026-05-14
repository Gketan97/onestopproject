import { useEffect, useRef } from 'react'

export default function AboutKetan() {
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
      { threshold: 0.15 }
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
        .about-section {
          background: var(--bg-surface);
          padding: 112px 32px;
          border-top: 1px solid var(--border-subtle);
        }
        .about-inner {
          max-width: 1000px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 80px;
          align-items: start;
        }
        .about-left { display: flex; flex-direction: column; align-items: center; gap: 24px; }
        .about-avatar {
          width: 160px; height: 160px; border-radius: 50%;
          background: var(--bg-elevated);
          border: 2px solid var(--border-default);
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .about-avatar::after {
          content: '';
          position: absolute; inset: -2px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255,107,157,0.4), rgba(168,85,247,0.4));
          z-index: -1;
        }
        .about-avatar-initials {
          font-family: 'Instrument Serif', serif;
          font-size: 48px;
          color: var(--text-secondary);
        }
        .about-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          width: 100%;
        }
        .about-stat {
          text-align: center;
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 16px 8px;
        }
        .about-stat-num {
          font-family: 'Instrument Serif', serif;
          font-size: 24px;
          color: var(--accent);
          display: block;
          margin-bottom: 4px;
        }
        .about-stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: var(--text-tertiary);
          letter-spacing: 0.08em;
          line-height: 1.4;
        }
        .about-pill {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: var(--text-tertiary);
          letter-spacing: 0.08em;
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          padding: 8px 14px;
          text-align: center;
          width: 100%;
        }
        .about-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.16em;
          color: var(--accent);
          margin-bottom: 16px;
        }
        .about-name {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(32px, 3.5vw, 48px);
          font-weight: 400;
          color: var(--text-primary);
          margin-bottom: 8px;
          line-height: 1.1;
        }
        .about-authority {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(18px, 2vw, 22px);
          font-style: italic;
          color: var(--text-secondary);
          margin-bottom: 32px;
          line-height: 1.4;
        }
        .about-bio {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          line-height: 1.8;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }
        .about-bio strong { color: var(--text-primary); font-weight: 500; }
        .about-bio em { font-style: italic; color: var(--text-primary); }
        .about-insight {
          background: var(--bg-elevated);
          border-left: 2px solid var(--accent);
          border-radius: 0 12px 12px 0;
          padding: 20px 24px;
          margin: 28px 0;
        }
        .about-insight-text {
          font-family: 'Instrument Serif', serif;
          font-size: 18px;
          font-style: italic;
          color: var(--text-primary);
          line-height: 1.6;
        }
        .about-linkedin {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: var(--accent);
          text-decoration: none;
          margin-top: 8px;
          transition: gap 200ms ease;
        }
        .about-linkedin:hover { gap: 12px; }
        @media (max-width: 860px) {
          .about-inner { grid-template-columns: 1fr; gap: 48px; }
          .about-left { flex-direction: row; flex-wrap: wrap; align-items: flex-start; }
          .about-avatar { width: 120px; height: 120px; }
          .about-avatar-initials { font-size: 36px; }
          .about-section { padding: 80px 24px; }
        }
        @media (max-width: 480px) {
          .about-section { padding: 64px 20px; }
          .about-stats { grid-template-columns: repeat(3, 1fr); }
          .about-stat-num { font-size: 20px; }
        }
      `}</style>

      <section id="about" className="about-section">
        <div ref={ref} className="about-inner">
          <div data-reveal className="about-left">
            <div className="about-avatar">
              <span className="about-avatar-initials">KG</span>
            </div>
            <div className="about-stats">
              <div className="about-stat">
                <span className="about-stat-num">170K</span>
                <span className="about-stat-label">LinkedIn followers</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num">7yr</span>
                <span className="about-stat-label">At Meesho</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num">500+</span>
                <span className="about-stat-label">Mentored</span>
              </div>
            </div>
            <span className="about-pill">Analytics Manager · Meesho</span>
          </div>

          <div>
            <p data-reveal className="about-label">YOUR EVALUATOR</p>
            <h2 data-reveal className="about-name">Ketan Goel</h2>
            <p data-reveal className="about-authority">
              He has reviewed more analytical thinking than most people will produce in a career.
            </p>
            <p data-reveal className="about-bio">
              7 years at Meesho as an Analytics Manager means Ketan has sat across from hundreds of candidates, reviewed thousands of analyses, and seen exactly where smart people's thinking breaks down under pressure.
            </p>
            <p data-reveal className="about-bio">
              <strong>The pattern is always the same.</strong> Most professionals describe what happened. The ones who get promoted — and get hired — explain why it happened, what it means, and what to do next. In the same breath, with no hand-holding.
            </p>

            <div data-reveal className="about-insight">
              <p className="about-insight-text">
                "The gap between good and great has almost nothing to do with SQL or Python. It's always the thinking. That gap is learnable — but only if someone shows you exactly where yours breaks down."
              </p>
            </div>

            <p data-reveal className="about-bio">
              The lab is built on what he's seen work: real cases, live evaluation, and honest feedback that tells you precisely where your reasoning falls short — not generic frameworks, but your specific blind spots.
            </p>
            <a
              data-reveal
              href="https://linkedin.com/in/ketangoel"
              target="_blank"
              rel="noopener noreferrer"
              className="about-linkedin"
            >
              → Follow on LinkedIn (170K)
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
