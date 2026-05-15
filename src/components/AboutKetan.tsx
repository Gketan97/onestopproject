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
          max-width: 1000px; margin: 0 auto;
          display: grid; grid-template-columns: 260px 1fr;
          gap: 80px; align-items: start;
        }
        .about-left { display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .about-avatar {
          width: 160px; height: 160px; border-radius: 50%;
          background: var(--bg-elevated);
          border: 2px solid var(--border-default);
          display: flex; align-items: center; justify-content: center;
          position: relative;
        }
        .about-avatar::after {
          content: '';
          position: absolute; inset: -3px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(255,107,157,0.5), rgba(168,85,247,0.5));
          z-index: -1;
        }
        .about-avatar-initials {
          font-family: 'Instrument Serif', serif;
          font-size: 48px; color: var(--text-secondary);
        }
        .about-stats {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 10px; width: 100%;
        }
        .about-stat {
          text-align: center; background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 12px; padding: 14px 8px;
        }
        .about-stat-num {
          font-family: 'Instrument Serif', serif;
          font-size: 22px; color: var(--accent);
          display: block; margin-bottom: 4px;
        }
        .about-stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px; color: var(--text-tertiary);
          letter-spacing: 0.07em; line-height: 1.4;
        }
        .about-pill {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; color: var(--text-tertiary);
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 8px; padding: 8px 14px;
          text-align: center; width: 100%;
        }
        .about-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.16em;
          color: var(--accent); margin-bottom: 16px;
        }
        .about-name {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(32px, 3.5vw, 48px);
          font-weight: 400; color: var(--text-primary);
          margin-bottom: 8px; line-height: 1.1;
        }
        .about-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; color: var(--text-tertiary);
          margin-bottom: 28px;
        }
        .about-bio {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; line-height: 1.8;
          color: var(--text-secondary); margin-bottom: 18px;
        }
        .about-bio strong { color: var(--text-primary); font-weight: 500; }
        .about-quote {
          background: var(--bg-elevated);
          border-left: 2px solid var(--accent);
          border-radius: 0 14px 14px 0;
          padding: 24px 28px; margin: 28px 0;
        }
        .about-quote-text {
          font-family: 'Instrument Serif', serif;
          font-size: 18px; font-style: italic;
          color: var(--text-primary); line-height: 1.65; margin: 0;
        }
        .about-linkedin {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: var(--accent);
          text-decoration: none; margin-top: 8px;
          transition: gap 200ms ease;
        }
        .about-linkedin:hover { gap: 13px; }
        @media (max-width: 860px) {
          .about-inner { grid-template-columns: 1fr; gap: 40px; }
          .about-left { flex-direction: row; flex-wrap: wrap; }
          .about-avatar { width: 100px; height: 100px; }
          .about-avatar-initials { font-size: 32px; }
          .about-section { padding: 80px 24px; }
        }
        @media (max-width: 480px) {
          .about-section { padding: 64px 20px; }
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
                <span className="about-stat-label">Meesho</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num">500+</span>
                <span className="about-stat-label">Mentored</span>
              </div>
            </div>
            <span className="about-pill">Analytics Manager · Meesho</span>
          </div>

          <div>
            <p data-reveal className="about-label">WHY KETAN BUILT THIS</p>
            <h2 data-reveal className="about-name">Ketan Goel</h2>
            <p data-reveal className="about-title">Analytics Manager, Meesho · 7 years building and evaluating business thinking</p>

            <p data-reveal className="about-bio">
              Over 7 years at Meesho, Ketan has been on both sides of the table.
              He's reviewed hundreds of candidates. He's watched smart, hardworking
              people get stuck — not because they didn't work hard, but because
              <strong> they were never taught how to think through a problem
              that nobody handed them on a plate.</strong>
            </p>

            <p data-reveal className="about-bio">
              He noticed the same pattern over and over. Juniors who were excellent
              at executing instructions, but froze when asked "what do you think we should do?"
              Seniors who managed teams well but struggled to own a room when
              the data was ambiguous. Good people, stuck at the same level for years —
              not knowing why.
            </p>

            <div data-reveal className="about-quote">
              <p className="about-quote-text">
                "I've promoted people with 2 years of experience over people with 6.
                Not because they knew more — because when things got unclear,
                they could still make a call and stand behind it.
                That's not talent. That's a skill. And almost nobody teaches it."
              </p>
            </div>

            <p data-reveal className="about-bio">
              He built this lab to fix that. Not a course. Not a certification.
              A place where you work through real problems, get honest feedback,
              and find out — specifically — <strong>what's holding your thinking back.</strong>
            </p>

            <a
              data-reveal
              href="https://linkedin.com/in/ketangoel"
              target="_blank"
              rel="noopener noreferrer"
              className="about-linkedin"
            >
              → Follow on LinkedIn (170K followers)
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
