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
      el.style.transform = 'translateY(28px)'
      setTimeout(() => {
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease'
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, 120 + i * 170)
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
          max-width: 860px; width: 100%;
          text-align: center;
          display: flex; flex-direction: column; align-items: center;
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 100px;
          padding: 6px 16px 6px 10px;
          margin-bottom: 44px;
        }
        .hero-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #f87171; flex-shrink: 0;
          animation: hero-pulse 2s ease-in-out infinite;
        }
        @keyframes hero-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(248,113,113,0.5); }
          50% { box-shadow: 0 0 0 5px rgba(248,113,113,0); }
        }
        .hero-eyebrow-text {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.12em;
          color: #f87171;
        }
        .hero-headline {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(38px, 5.5vw, 70px);
          line-height: 1.12; color: var(--text-primary);
          font-weight: 400; margin-bottom: 28px;
          max-width: 820px; letter-spacing: -0.01em;
        }
        .hero-gradient-text {
          font-style: italic;
          background: linear-gradient(135deg, #FF6B9D 0%, #C084FC 50%, #A855F7 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(16px, 1.8vw, 18px);
          line-height: 1.8; color: var(--text-secondary);
          max-width: 600px; margin-bottom: 16px;
        }
        .hero-sub strong { color: var(--text-primary); font-weight: 500; }
        .hero-sub2 {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(15px, 1.6vw, 17px);
          line-height: 1.75; color: var(--text-secondary);
          max-width: 560px; margin-bottom: 48px;
        }
        .hero-cta-group {
          display: flex; flex-direction: column;
          align-items: center; gap: 16px; margin-bottom: 52px;
        }
        .hero-cta-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 17px; font-weight: 500;
          color: #fff; background: var(--accent);
          border: none; border-radius: 100px;
          padding: 18px 52px;
          cursor: pointer; transition: all 200ms ease;
        }
        .hero-cta-btn:hover { filter: brightness(1.12); transform: scale(1.02); }
        .hero-cta-btn:active { transform: scale(0.98); }
        .hero-trust {
          font-family: 'DM Mono', monospace;
          font-size: 12px; color: var(--text-tertiary);
          letter-spacing: 0.05em;
        }
        .hero-roles {
          display: flex; align-items: center; justify-content: center;
          flex-wrap: wrap; gap: 8px;
          padding: 16px 20px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-subtle);
          border-radius: 12px; max-width: 640px;
        }
        .hero-roles-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.12em;
          color: var(--text-tertiary); width: 100%;
          text-align: center; margin-bottom: 10px;
        }
        .hero-role {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; color: var(--text-secondary);
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-subtle);
          border-radius: 5px; padding: 5px 12px;
        }
        .hero-scroll-line {
          margin-top: 72px; width: 1px; height: 56px;
          background: linear-gradient(to bottom, var(--border-default), transparent);
        }
        @media (max-width: 768px) {
          .hero-section { padding: 88px 24px 64px; }
          .hero-eyebrow { margin-bottom: 32px; }
          .hero-cta-btn { padding: 16px 40px; font-size: 16px; }
        }
        @media (max-width: 480px) {
          .hero-section { padding: 80px 20px 56px; }
          .hero-eyebrow-text { font-size: 10px; }
          .hero-cta-btn { width: 100%; max-width: 340px; }
          .hero-trust { font-size: 11px; line-height: 1.6; text-align: center; }
        }
      `}</style>

      <section className="hero-section">
        <div className="hero-dot-grid" />
        <div className="hero-orb-tr" />
        <div className="hero-orb-bl" />
        <div ref={ref} className="hero-content">

          <div data-reveal className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            <span className="hero-eyebrow-text">THIS IS ALREADY HAPPENING — NOT A FUTURE WARNING</span>
          </div>

          <h1 data-reveal className="hero-headline">
            Companies are hiring fewer people.<br />
            <span className="hero-gradient-text">The ones they keep all think the same way.</span>
          </h1>

          <p data-reveal className="hero-sub">
            In the last 12 months, teams across marketing, product, operations, finance, and consulting
            have shrunk. Not because the work disappeared —
            <strong> because one person who thinks clearly with AI now does what three people used to.</strong>
          </p>

          <p data-reveal className="hero-sub2">
            The question isn't whether this affects your role. It's whether you're the one
            who stays — or the one who gets replaced.
            This free test shows you where you actually stand.
          </p>

          <div data-reveal className="hero-cta-group">
            <button className="hero-cta-btn" onClick={() => navigate('/diagnostic')}>
              Find Out Where You Stand — Free →
            </button>
            <span className="hero-trust">
              4 minutes · No signup · Instant result
            </span>
          </div>

          <div data-reveal className="hero-roles">
            <span className="hero-roles-label">RELEVANT FOR EVERY BUSINESS ROLE</span>
            {[
              'Product Management', 'Marketing', 'Operations',
              'Finance', 'Consulting', 'HR', 'Sales',
              'Strategy', 'Growth', 'Category Management'
            ].map((r, i) => (
              <span key={i} className="hero-role">{r}</span>
            ))}
          </div>

          <div data-reveal><div className="hero-scroll-line" /></div>
        </div>
      </section>
    </>
  )
}
