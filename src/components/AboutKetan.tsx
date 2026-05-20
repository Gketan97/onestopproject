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

  const stats = [
    { val: '7yr', label: 'Meesho & Myntra' },
    { val: '500+', label: 'Professionals mentored' },
    { val: '15+', label: 'Rejections before Meesho' },
    { val: '170K', label: 'LinkedIn followers' },
  ]

  return (
    <>
      <style>{`
        .about-section {
          background: var(--bg-surface);
          padding: 96px 32px;
          border-top: 1px solid var(--border-subtle);
        }
        .about-inner {
          max-width: 900px; margin: 0 auto;
          display: grid; grid-template-columns: 260px 1fr;
          gap: 64px; align-items: start;
        }
        .about-left { display: flex; flex-direction: column; gap: 16px; }
        .about-avatar {
          width: 200px; aspect-ratio: 1;
          border-radius: 18px; overflow: hidden;
          box-shadow: 0 0 0 1px var(--border-default), 0 0 0 4px rgba(168,85,247,0.15);
        }
        .about-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .about-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .about-stat {
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 10px; padding: 12px 10px; text-align: center;
        }
        .about-stat-val {
          font-family: 'Instrument Serif', serif;
          font-size: 22px; color: var(--accent);
          display: block; margin-bottom: 2px; line-height: 1;
        }
        .about-stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px; color: var(--text-tertiary); letter-spacing: 0.06em; line-height: 1.4;
        }
        .about-label {
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 0.16em; color: var(--accent); margin-bottom: 12px;
        }
        .about-name {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(30px, 3vw, 44px);
          font-weight: 400; color: var(--text-primary);
          margin-bottom: 4px; line-height: 1.1;
        }
        .about-tagline {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(15px, 1.6vw, 18px);
          font-style: italic; color: var(--text-secondary);
          margin-bottom: 28px; line-height: 1.4;
        }
        .about-story {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; line-height: 1.85;
          color: var(--text-secondary); margin-bottom: 16px;
        }
        .about-story strong { color: var(--text-primary); font-weight: 500; }
        .about-quote {
          background: var(--bg-elevated);
          border-left: 3px solid var(--accent);
          border-radius: 0 12px 12px 0;
          padding: 20px 24px; margin: 24px 0;
        }
        .about-quote-text {
          font-family: 'Instrument Serif', serif;
          font-size: 17px; font-style: italic;
          color: var(--text-primary); line-height: 1.65; margin: 0;
        }
        .about-linkedin {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: var(--accent);
          text-decoration: none; transition: gap 180ms ease;
        }
        .about-linkedin:hover { gap: 13px; }

        @media (max-width: 860px) {
          .about-inner { grid-template-columns: 1fr; gap: 32px; }
          .about-left { flex-direction: row; align-items: flex-start; gap: 16px; flex-wrap: wrap; }
          .about-avatar { width: 100px; border-radius: 12px; }
          .about-stats { grid-template-columns: repeat(4, 1fr); flex: 1; min-width: 220px; }
          .about-section { padding: 72px 24px; }
        }
        @media (max-width: 580px) {
          .about-stats { grid-template-columns: repeat(2, 1fr); width: 100%; }
          .about-section { padding: 56px 20px; }
        }
      `}</style>

      <section id="about" className="about-section">
        <div ref={ref} className="about-inner">
          <div data-reveal className="about-left">
            <div className="about-avatar">
              <img src="/ketan.jpeg" alt="Ketan Goel" />
            </div>
            <div className="about-stats">
              {stats.map((s, i) => (
                <div key={i} className="about-stat">
                  <span className="about-stat-val">{s.val}</span>
                  <span className="about-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p data-reveal className="about-label">WHY KETAN BUILT THIS</p>
            <h2 data-reveal className="about-name">Ketan Goel</h2>
            <p data-reveal className="about-tagline">
              He got rejected 15+ times before cracking Meesho. That’s why he built this.
            </p>

            <p data-reveal className="about-story">
              Ketan paid ₹3 lakh for an online data science course, hoping it would give him direction.
              It didn’t. What followed was <strong>15+ rejections</strong> from the companies he wanted —
              Myntra, Meesho, American Express — before eventually cracking all three.
              The rejections taught him something no course did: <strong>the gap wasn’t technical.
              It was in how he thought through problems.</strong>
            </p>

            <p data-reveal className="about-story">
              At Meesho he worked alongside IIM and IIT graduates. What he noticed:
              <strong> the ones who grew fastest weren’t the most qualified.
              They were the ones who could think clearly, make a call, and back it up.</strong>
              That’s it. Every time.
            </p>

            <div data-reveal className="about-quote">
              <p className="about-quote-text">
                "I spent two years and ₹3 lakh trying to find the right career path.
                What actually changed things had nothing to do with tools or certifications.
                It was learning to think through a problem properly — and that’s a skill
                nobody was teaching. That’s the gap this lab exists to close."
              </p>
            </div>

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
