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
    { val: '7yr', label: 'At Meesho & Myntra' },
    { val: '500+', label: 'Professionals mentored' },
    { val: '15+', label: 'Rejections before Meesho' },
    { val: '170K', label: 'LinkedIn followers' },
  ]

  const credentials = [
    'Analytics Manager · Meesho',
    'Previously · Myntra · American Express',
    'Guest lecturer · Multiple institutes',
    'Topmate mentor · 500+ sessions',
  ]

  return (
    <>
      <style>{`
        .about-section {
          background: var(--bg-surface);
          padding: 112px 32px;
          border-top: 1px solid var(--border-subtle);
        }
        .about-inner {
          max-width: 1040px; margin: 0 auto;
          display: grid; grid-template-columns: 300px 1fr;
          gap: 80px; align-items: start;
        }
        /* Left */
        .about-left { display: flex; flex-direction: column; gap: 20px; }
        .about-avatar {
          width: 100%; aspect-ratio: 1;
          max-width: 220px;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 0 0 1px var(--border-default), 0 0 0 4px rgba(168,85,247,0.15);
        }
        .about-avatar img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .about-stats {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .about-stat {
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 12px; padding: 14px 12px;
          text-align: center;
        }
        .about-stat-val {
          font-family: 'Instrument Serif', serif;
          font-size: 24px; color: var(--accent);
          display: block; margin-bottom: 3px; line-height: 1;
        }
        .about-stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px; color: var(--text-tertiary);
          letter-spacing: 0.08em; line-height: 1.4;
        }
        .about-creds { display: flex; flex-direction: column; gap: 6px; }
        .about-cred {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; color: var(--text-tertiary);
          display: flex; align-items: center; gap: 8px; line-height: 1.5;
        }
        .about-cred::before {
          content: ''; width: 4px; height: 4px; border-radius: 50%;
          background: var(--accent); flex-shrink: 0;
        }
        /* Right */
        .about-label {
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 0.16em; color: var(--accent); margin-bottom: 16px;
        }
        .about-name {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(32px, 3.5vw, 48px);
          font-weight: 400; color: var(--text-primary);
          margin-bottom: 6px; line-height: 1.1;
        }
        .about-tagline {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(16px, 1.8vw, 20px);
          font-style: italic; color: var(--text-secondary);
          margin-bottom: 32px; line-height: 1.4;
        }
        .about-story {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; line-height: 1.85;
          color: var(--text-secondary); margin-bottom: 18px;
        }
        .about-story strong { color: var(--text-primary); font-weight: 500; }
        .about-story em { font-style: italic; color: var(--text-primary); }
        .about-quote {
          background: var(--bg-elevated);
          border-left: 3px solid var(--accent);
          border-radius: 0 14px 14px 0;
          padding: 22px 26px; margin: 28px 0;
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
          transition: gap 180ms ease;
        }
        .about-linkedin:hover { gap: 13px; }

        @media (max-width: 900px) {
          .about-inner { grid-template-columns: 1fr; gap: 40px; }
          .about-left { flex-direction: row; flex-wrap: wrap; align-items: flex-start; gap: 16px; }
          .about-avatar { width: 120px; max-width: 120px; border-radius: 16px; }
          .about-avatar-initials { font-size: 44px; }
          .about-stats { grid-template-columns: repeat(4, 1fr); flex: 1; min-width: 260px; }
          .about-creds { flex-direction: row; flex-wrap: wrap; gap: 8px; width: 100%; }
          .about-section { padding: 80px 24px; }
        }
        @media (max-width: 600px) {
          .about-stats { grid-template-columns: repeat(2, 1fr); }
          .about-section { padding: 64px 20px; }
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
            <div className="about-creds">
              {credentials.map((c, i) => (
                <span key={i} className="about-cred">{c}</span>
              ))}
            </div>
          </div>

          <div>
            <p data-reveal className="about-label">THE PERSON BEHIND THIS</p>
            <h2 data-reveal className="about-name">Ketan Goel</h2>
            <p data-reveal className="about-tagline">
              He got rejected 15+ times before cracking Meesho. That's why he built this.
            </p>

            <p data-reveal className="about-story">
              Ketan spent his first two years out of college at Wipro — doing the work, following the path,
              and quietly wondering if this was it. He knew he wanted more but had no idea what that
              meant or how to get there. <strong>He messaged hundreds of people on LinkedIn.
              Almost no one replied.</strong>
            </p>

            <p data-reveal className="about-story">
              He paid ₹3 lakh for an online data science course, hoping it would give him direction.
              It didn't. What followed was <strong>15+ rejections</strong> from companies he wanted to work at —
              Myntra, Meesho, American Express — before he eventually cracked all three.
              The rejections taught him something no course did: <em>the gap wasn't in his technical
              skills. It was in how he thought through problems.</em>
            </p>

            <p data-reveal className="about-story">
              Once he understood that, everything changed. At Meesho, he worked alongside product managers,
              data scientists, and business managers — many of them IIM and IIT graduates.
              <strong> What he noticed: the ones who grew fastest weren't the most qualified.
              They were the ones who could think clearly, make a call, and back it up.</strong>
              That's it. Every time.
            </p>

            <div data-reveal className="about-quote">
              <p className="about-quote-text">
                "I spent two years and ₹3 lakh trying to find the right career path.
                What actually changed things had nothing to do with tools or certifications.
                It was learning to think through a problem properly — and that's a skill
                nobody was teaching. That's the gap this lab exists to close."
              </p>
            </div>

            <p data-reveal className="about-story">
              Today Ketan has 170K followers on LinkedIn, has mentored 500+ professionals on Topmate,
              delivered guest lectures at multiple institutes, and watched people he's worked with
              transition careers, get promoted, and land roles they thought were out of reach.
              <strong> He's not teaching theory. He's teaching the exact thinking that got him
              — and them — to where they are.</strong>
            </p>

            <a
              data-reveal
              href="https://linkedin.com/in/ketangoel"
              target="_blank"
              rel="noopener noreferrer"
              className="about-linkedin"
            >
              → Follow on LinkedIn
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
