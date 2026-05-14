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
        .about-pills { display: flex; flex-direction: column; gap: 8px; width: 100%; }
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
        }
        .about-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          width: 100%;
          margin-top: 8px;
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
          margin-bottom: 28px;
          line-height: 1.1;
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
            <div className="about-pills">
              <span className="about-pill">Analytics Manager · Meesho</span>
              <span className="about-pill">7 Years in Product Analytics</span>
              <span className="about-pill">170K LinkedIn Followers</span>
            </div>
            <div className="about-stats">
              <div className="about-stat">
                <span className="about-stat-num">170K</span>
                <span className="about-stat-label">Followers</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num">7</span>
                <span className="about-stat-label">Years at Meesho</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num">500+</span>
                <span className="about-stat-label">Mentored</span>
              </div>
            </div>
          </div>

          <div>
            <p data-reveal className="about-label">YOUR MENTOR</p>
            <h2 data-reveal className="about-name">Ketan Goel</h2>
            <p data-reveal className="about-bio">
              I've spent 7 years at the intersection of data and decisions —
              most recently as <strong>Analytics Manager at Meesho</strong>, one of
              India's fastest-growing e-commerce companies.
            </p>
            <p data-reveal className="about-bio">
              In that time, I've interviewed hundreds of candidates and worked
              with analysts at every level. The gap between good and great has
              almost nothing to do with SQL or Python.
            </p>
            <p data-reveal className="about-bio">
              <em>It's always the thinking.</em>
            </p>
            <p data-reveal className="about-bio">
              Most professionals describe what happened.
              Great analysts explain <strong>why it happened, what it means,
              and what to do next</strong> — in the same breath.
              That's what this lab teaches.
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
