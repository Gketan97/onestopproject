import { useEffect, useRef, useState } from 'react'

export default function AboutKetan() {
  const ref = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const [counted, setCounted] = useState(false)
  const [counts, setCounts] = useState({ yr: 0, mentored: 0, rejections: 0, followers: 0 })

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
            setTimeout(() => {
              el.style.transition = 'opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)'
              el.style.opacity = '1'
              el.style.transform = 'translateY(0)'
            }, i * 100)
          })
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })
    if (ref.current) {
      ref.current.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(20px)'
      })
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [])

  // Count-up animation on stats
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
          setCounted(true)
          const targets = { yr: 7, mentored: 500, rejections: 15, followers: 170 }
          const duration = 1400
          const steps = 40
          const interval = duration / steps
          let step = 0
          const timer = setInterval(() => {
            step++
            const progress = step / steps
            const ease = 1 - Math.pow(1 - progress, 3) // ease-out cubic
            setCounts({
              yr: Math.round(targets.yr * ease),
              mentored: Math.round(targets.mentored * ease),
              rejections: Math.round(targets.rejections * ease),
              followers: Math.round(targets.followers * ease),
            })
            if (step >= steps) clearInterval(timer)
          }, interval)
        }
      })
    }, { threshold: 0.3 })
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [counted])

  return (
    <>
      <style>{`
        .about-section {
          background: var(--bg-surface);
          padding: 88px 32px;
          border-top: 1px solid var(--border-subtle);
        }
        .about-inner {
          max-width: 860px; margin: 0 auto;
          display: grid; grid-template-columns: 220px 1fr;
          gap: 56px; align-items: start;
        }

        /* Left col */
        .about-left { display: flex; flex-direction: column; gap: 14px; }
        .about-avatar {
          width: 180px; aspect-ratio: 1;
          border-radius: 16px; overflow: hidden;
          box-shadow: 0 0 0 1px var(--border-default), 0 0 0 4px rgba(168,85,247,0.12);
          flex-shrink: 0;
        }
        .about-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* Stats grid — count-up */
        .about-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .about-stat {
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 10px; padding: 12px 10px; text-align: center;
        }
        .about-stat-val {
          font-family: 'Instrument Serif', serif;
          font-size: 22px; color: var(--accent);
          display: block; line-height: 1; margin-bottom: 4px;
        }
        .about-stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px; color: var(--text-tertiary);
          letter-spacing: 0.06em; line-height: 1.4;
        }

        /* Right col */
        .about-label {
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 0.16em; color: var(--accent); margin-bottom: 12px;
        }
        .about-name {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(28px, 3vw, 42px);
          font-weight: 400; color: var(--text-primary);
          margin-bottom: 4px; line-height: 1.1;
        }
        .about-tagline {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(14px, 1.6vw, 17px);
          font-style: italic; color: var(--text-secondary);
          margin-bottom: 28px; line-height: 1.45;
        }

        /* Quote — centrepiece */
        .about-quote {
          background: var(--bg-elevated);
          border-left: 3px solid var(--accent);
          border-radius: 0 12px 12px 0;
          padding: 22px 24px;
          margin-bottom: 24px;
        }
        .about-quote-text {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(15px, 1.8vw, 18px);
          font-style: italic; color: var(--text-primary);
          line-height: 1.7; margin: 0;
        }

        /* One sentence below quote */
        .about-context {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: var(--text-secondary);
          line-height: 1.7; margin-bottom: 20px;
        }
        .about-context strong { color: var(--text-primary); font-weight: 500; }

        .about-linkedin {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: var(--accent);
          text-decoration: none; transition: gap 180ms ease;
        }
        .about-linkedin:hover { gap: 14px; }

        /* Mobile */
        @media (max-width: 800px) {
          .about-inner { grid-template-columns: 1fr; gap: 28px; }
          .about-left {
            flex-direction: row; align-items: flex-start;
            gap: 14px; flex-wrap: wrap;
          }
          .about-avatar { width: 96px; border-radius: 12px; }
          .about-stats {
            grid-template-columns: repeat(4, 1fr);
            flex: 1; min-width: 200px;
          }
          .about-section { padding: 72px 20px; }
        }
        @media (max-width: 520px) {
          .about-stats { grid-template-columns: repeat(2, 1fr); width: 100%; }
        }
      `}</style>

      <section id="about" className="about-section">
        <div ref={ref} className="about-inner">

          {/* Left — photo + stats */}
          <div data-reveal className="about-left">
            <div className="about-avatar">
              <img src="/ketan.jpeg" alt="Ketan Goel" />
            </div>
            <div ref={statsRef} className="about-stats">
              <div className="about-stat">
                <span className="about-stat-val">{counted ? `${counts.yr}yr` : '0yr'}</span>
                <span className="about-stat-label">Meesho</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-val">{counted ? `${counts.mentored}+` : '0'}</span>
                <span className="about-stat-label">Professionals mentored</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-val">{counted ? `${counts.rejections}+` : '0'}</span>
                <span className="about-stat-label">Rejections before Meesho</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-val">{counted ? `${counts.followers}K` : '0'}</span>
                <span className="about-stat-label">LinkedIn followers</span>
              </div>
            </div>
          </div>

          {/* Right — trust content */}
          <div>
            <p data-reveal className="about-label">WHY KETAN BUILT THIS</p>
            <h2 data-reveal className="about-name">Ketan Goel</h2>
            <p data-reveal className="about-tagline">
              15+ rejections before finally cracking Meesho. That gap taught him something no course did.
            </p>

            <div data-reveal className="about-quote">
              <p className="about-quote-text">
                "I spent two years and ₹3 lakh trying to find the right career path.
                What actually changed things had nothing to do with tools or certifications.
                It was learning to think through a problem properly — and that's a skill
                nobody was teaching. That's the gap this lab exists to close."
              </p>
            </div>

            <p data-reveal className="about-context">
              At Meesho, the people who grew fastest weren't the most qualified.{' '}
              <strong>They were the ones who could think clearly, make a call, and back it up.</strong>{' '}
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
