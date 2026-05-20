import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const items = ref.current?.querySelectorAll<HTMLElement>('[data-reveal]')
    if (!items) return
    items.forEach((el, i) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(24px)'
      setTimeout(() => {
        el.style.transition = 'opacity 0.65s ease, transform 0.65s ease'
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, 80 + i * 140)
    })
  }, [])

  return (
    <>
      <style>{`
        .hero-section {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
          padding: 96px 32px 80px;
        }
        .hero-dot-grid {
          position: absolute; inset: 0; z-index: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
          background-size: 24px 24px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
        }
        .hero-orb-tr {
          position: absolute; top: -80px; right: -120px; z-index: 0;
          width: 700px; height: 700px; border-radius: 50%;
          background: radial-gradient(circle, rgba(168,85,247,0.13) 0%, transparent 70%);
          filter: blur(60px); pointer-events: none;
        }
        .hero-orb-bl {
          position: absolute; bottom: -100px; left: -100px; z-index: 0;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,107,157,0.08) 0%, transparent 70%);
          filter: blur(70px); pointer-events: none;
        }
        .hero-content {
          position: relative; z-index: 1;
          max-width: 840px; width: 100%;
          text-align: center;
          display: flex; flex-direction: column; align-items: center;
        }
        .hero-alert {
          display: inline-flex; align-items: center; gap: 10px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 100px; padding: 7px 18px 7px 12px;
          margin-bottom: 48px;
        }
        .hero-alert-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #f87171; flex-shrink: 0;
          animation: blink 1.8s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }
        .hero-alert-text {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.12em; color: #f87171;
        }
        .hero-headline {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(38px, 6vw, 76px);
          line-height: 1.1; color: var(--text-primary);
          font-weight: 400; margin-bottom: 20px;
          letter-spacing: -0.02em; max-width: 780px;
        }
        .hero-headline em {
          font-style: italic;
          background: linear-gradient(135deg, #FF6B9D 0%, #C084FC 50%, #A855F7 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subheadline {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(18px, 2.2vw, 26px);
          line-height: 1.5; color: var(--text-secondary);
          font-weight: 400; margin-bottom: 16px;
          max-width: 620px;
        }
        .hero-subheadline strong { color: var(--text-primary); font-weight: 500; }
        .hero-sub2 {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(15px, 1.6vw, 17px);
          line-height: 1.75; color: var(--text-tertiary);
          max-width: 540px; margin-bottom: 52px;
        }
        .hero-cta-group {
          display: flex; flex-direction: column;
          align-items: center; gap: 14px; margin-bottom: 56px;
        }
        .hero-cta-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 18px; font-weight: 600;
          color: #fff; background: var(--accent);
          border: none; border-radius: 100px;
          padding: 20px 64px; cursor: pointer;
          transition: all 200ms ease; letter-spacing: 0.01em;
        }
        .hero-cta-btn:hover {
          filter: brightness(1.1); transform: translateY(-2px);
          box-shadow: 0 10px 36px rgba(168,85,247,0.4);
        }
        .hero-cta-btn:active { transform: translateY(0); }
        .hero-trust {
          font-family: 'DM Mono', monospace;
          font-size: 12px; color: var(--text-tertiary); letter-spacing: 0.05em;
        }
        .hero-scroll-line {
          margin-top: 72px; width: 1px; height: 56px;
          background: linear-gradient(to bottom, var(--border-default), transparent);
        }
        @media (max-width: 768px) {
          .hero-section { padding: 88px 24px 64px; }
          .hero-alert { margin-bottom: 36px; }
          .hero-cta-btn { padding: 17px 48px; font-size: 17px; }
          .hero-scroll-line { margin-top: 48px; }
        }
        @media (max-width: 480px) {
          .hero-section { padding: 80px 20px 56px; }
          .hero-alert-text { font-size: 10px; }
          .hero-cta-btn { width: 100%; max-width: 340px; font-size: 16px; padding: 18px 32px; }
          .hero-trust { font-size: 11px; text-align: center; line-height: 1.6; }
        }
      `}</style>

      <section className="hero-section">
        <div className="hero-dot-grid" />
        <div className="hero-orb-tr" />
        <div className="hero-orb-bl" />
        <div ref={ref} className="hero-content">

          <div data-reveal className="hero-alert">
            <span className="hero-alert-dot" />
            <span className="hero-alert-text">HIRING IS CHANGING RIGHT NOW — NOT IN THE FUTURE</span>
          </div>

          <h1 data-reveal className="hero-headline">
            AI won't take your job.<br />
            <em>Someone who uses AI better than you will.</em>
          </h1>

          <p data-reveal className="hero-subheadline">
            Companies are now hiring for one thing above everything else:{' '}
            <strong>Can you make good decisions using AI?</strong>
          </p>

          <p data-reveal className="hero-sub2">
            Not just use the tools. Actually think — form a view, make a call, back it up.
            Most professionals can't do this yet.
            This free test shows you exactly where you stand.
          </p>

          <div data-reveal className="hero-cta-group">
            <button className="hero-cta-btn" onClick={() => navigate('/diagnostic')}>
              Test Yourself Free →
            </button>
            <span className="hero-trust">4 minutes · No signup · Brutally honest result</span>
          </div>
          <div data-reveal><div className="hero-scroll-line" /></div>
        </div>
      </section>
    </>
  )
}
