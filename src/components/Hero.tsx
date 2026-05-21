import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)
  const [stickyVisible, setStickyVisible] = useState(false)

  useEffect(() => {
    const items = ref.current?.querySelectorAll<HTMLElement>('[data-reveal]')
    if (!items) return
    items.forEach((el, i) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(28px)'
      setTimeout(() => {
        el.style.transition = 'opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)'
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, 100 + i * 160)
    })
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (window.innerWidth < 641) {
        setStickyVisible(window.scrollY > window.innerHeight * 0.85)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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
          background-image: radial-gradient(circle, rgba(255,255,255,0.065) 1px, transparent 1px);
          background-size: 26px 26px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
        }
        .hero-orb-tr {
          position: absolute; top: -100px; right: -140px; z-index: 0;
          width: 800px; height: 800px; border-radius: 50%;
          background: radial-gradient(circle, rgba(168,85,247,0.11) 0%, transparent 65%);
          filter: blur(72px); pointer-events: none;
          animation: hero-orb-drift 12s ease-in-out infinite alternate;
        }
        .hero-orb-bl {
          position: absolute; bottom: -120px; left: -80px; z-index: 0;
          width: 560px; height: 560px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,107,157,0.07) 0%, transparent 65%);
          filter: blur(80px); pointer-events: none;
          animation: hero-orb-drift 16s ease-in-out infinite alternate-reverse;
        }
        @keyframes hero-orb-drift { from { transform: translate(0,0); } to { transform: translate(30px,20px); } }

        .hero-content {
          position: relative; z-index: 1;
          max-width: 860px; width: 100%;
          text-align: center;
          display: flex; flex-direction: column; align-items: center;
        }

        /* Alert badge */
        .hero-alert {
          display: inline-flex; align-items: center; gap: 10px;
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.18);
          border-radius: 100px; padding: 7px 20px 7px 12px;
          margin-bottom: 52px;
        }
        .hero-alert-dot { width:7px; height:7px; border-radius:50%; background:#f87171; flex-shrink:0; animation:blink-dot 1.8s ease-in-out infinite; }
        @keyframes blink-dot { 0%,100%{opacity:1} 50%{opacity:0.2} }
        .hero-alert-text { font-family:'DM Mono',monospace; font-size:11px; letter-spacing:0.13em; color:#f87171; }

        /* Headline lines */
        .hero-headline-wrap { margin-bottom: 32px; display:flex; flex-direction:column; align-items:center; gap:0; }
        .hero-line { display:block; overflow:hidden; }
        .hero-line-inner {
          display:block;
          font-family:'Instrument Serif',serif;
          font-weight:400; letter-spacing:-0.02em;
          color:var(--text-primary); line-height:1.12;
          opacity:0; transform:translateY(100%);
          transition:opacity 0.75s cubic-bezier(0.22,1,0.36,1), transform 0.75s cubic-bezier(0.22,1,0.36,1);
        }
        .hero-line-inner.revealed { opacity:1; transform:translateY(0); }

        .hero-line-1 .hero-line-inner { font-size:clamp(18px,3.2vw,46px); color:var(--text-tertiary); transition-delay:0.05s; }
        .hero-line-2 .hero-line-inner { font-size:clamp(28px,5.5vw,80px); color:var(--text-primary); transition-delay:0.22s; letter-spacing:-0.03em; }
        .hero-line-3 .hero-line-inner {
          font-size:clamp(28px,5.5vw,80px); font-style:italic;
          background:linear-gradient(135deg,#FF6B9D 0%,#C084FC 45%,#A855F7 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          transition-delay:0.4s; letter-spacing:-0.03em;
        }

        /* Strikethrough — uses pseudo element for reliability on mobile */
        .hero-strike-wrap { position:relative; display:inline-block; }
        .hero-strike-line {
          position:absolute; left:0; top:50%;
          height:3px; border-radius:2px;
          background:rgba(248,113,113,0.7);
          width:0%;
          transition:width 0.65s cubic-bezier(0.22,1,0.36,1);
          transition-delay:1.1s;
          pointer-events:none;
          transform:translateY(-50%);
        }
        .hero-strike-line.active { width:100%; }

        /* Subheadline */
        .hero-subheadline {
          font-family:'DM Sans',sans-serif;
          font-size:clamp(15px,1.9vw,21px);
          line-height:1.65; color:var(--text-secondary);
          font-weight:400; margin-bottom:48px;
          max-width:540px;
        }
        .hero-subheadline strong { color:var(--text-primary); font-weight:500; }

        /* CTA */
        .hero-cta-group { display:flex; flex-direction:column; align-items:center; gap:16px; }
        .hero-cta-btn {
          font-family:'DM Sans',sans-serif;
          font-size:clamp(15px,1.8vw,18px); font-weight:600;
          color:#fff; background:var(--accent);
          border:none; border-radius:100px;
          padding:18px 52px;
          cursor:pointer;
          transition:all 220ms cubic-bezier(0.22,1,0.36,1);
          white-space:nowrap;
        }
        .hero-cta-btn:hover { filter:brightness(1.12); transform:translateY(-3px); box-shadow:0 12px 40px rgba(168,85,247,0.38); }
        .hero-cta-btn:active { transform:translateY(-1px); }
        .hero-trust { font-family:'DM Mono',monospace; font-size:12px; color:var(--text-tertiary); letter-spacing:0.06em; }

        /* Scroll indicator */
        .hero-scroll { margin-top:64px; display:flex; flex-direction:column; align-items:center; gap:8px; }
        .hero-scroll-text { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:0.16em; color:var(--text-tertiary); opacity:0.5; }
        .hero-scroll-mouse { width:22px; height:34px; border:1px solid rgba(255,255,255,0.12); border-radius:100px; display:flex; justify-content:center; padding-top:6px; }
        .hero-scroll-wheel { width:3px; height:6px; background:rgba(255,255,255,0.25); border-radius:100px; animation:scroll-wheel 1.6s ease infinite; }
        @keyframes scroll-wheel { 0%{transform:translateY(0);opacity:1;} 80%{transform:translateY(8px);opacity:0;} 100%{transform:translateY(0);opacity:0;} }

        /* Sticky mobile CTA */
        .hero-sticky {
          position:fixed; bottom:0; left:0; right:0; z-index:80;
          padding:14px 20px 18px;
          background:rgba(8,8,12,0.96); backdrop-filter:blur(14px);
          border-top:1px solid var(--border-subtle);
          transform:translateY(100%);
          transition:transform 320ms cubic-bezier(0.22,1,0.36,1);
        }
        .hero-sticky.show { transform:translateY(0); }
        .hero-sticky-btn {
          width:100%; font-family:'DM Sans',sans-serif;
          font-size:16px; font-weight:600; color:#fff; background:var(--accent);
          border:none; border-radius:100px; padding:15px; cursor:pointer;
        }

        @media (max-width:768px) {
          .hero-section { padding:88px 24px 64px; }
          .hero-alert { margin-bottom:36px; }
          .hero-scroll { margin-top:48px; }
        }
        @media (max-width:480px) {
          .hero-section { padding:80px 20px 56px; }
          .hero-alert-text { font-size:10px; }
          .hero-trust { font-size:11px; text-align:center; line-height:1.6; }
          .hero-cta-btn { width:100%; max-width:340px; font-size:15px; padding:17px 24px; }
        }
        @media (min-width:641px) { .hero-sticky { display:none !important; } }
      `}</style>

      <section className="hero-section">
        <div className="hero-dot-grid" />
        <div className="hero-orb-tr" />
        <div className="hero-orb-bl" />

        <div ref={ref} className="hero-content">
          <div data-reveal className="hero-alert">
            <span className="hero-alert-dot" />
            <span className="hero-alert-text">AI IS CHANGING WHAT ANALYTICS MEANS RIGHT NOW</span>
          </div>

          <HeadlineReveal />

          <p data-reveal className="hero-subheadline">
            AI is making analysis cheaper.{' '}
            <strong>The highest-paying roles now reward people who can think independently,
            navigate ambiguity, and make high-quality decisions with AI.</strong>
          </p>

          <div data-reveal className="hero-cta-group">
            <button className="hero-cta-btn" onClick={() => navigate('/diagnostic')}>
              Test Your Decision-Making Free →
            </button>
            <span className="hero-trust">4 minutes · No signup · Brutally honest result</span>
          </div>

          <div data-reveal className="hero-scroll">
            <span className="hero-scroll-text">SCROLL</span>
            <div className="hero-scroll-mouse">
              <div className="hero-scroll-wheel" />
            </div>
          </div>
        </div>
      </section>

      <div className={`hero-sticky ${stickyVisible ? 'show' : ''}`}>
        <button className="hero-sticky-btn" onClick={() => navigate('/diagnostic')}>
          Test Your Decision-Making Free →
        </button>
      </div>
    </>
  )
}

function HeadlineReveal() {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 180)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="hero-headline-wrap" style={{ marginBottom: 32 }}>
      <span className="hero-line hero-line-1">
        <span className={`hero-line-inner ${revealed ? 'revealed' : ''}`}>
          The future of analytics is not
        </span>
      </span>

      <span className="hero-line hero-line-2">
        <span className={`hero-line-inner ${revealed ? 'revealed' : ''}`}>
          <span className="hero-strike-wrap">
            Data Pulling &amp; Dashboards.
            <span className={`hero-strike-line ${revealed ? 'active' : ''}`} />
          </span>
        </span>
      </span>

      <span className="hero-line hero-line-3">
        <span className={`hero-line-inner ${revealed ? 'revealed' : ''}`}>
          It's decision-making.
        </span>
      </span>
    </div>
  )
}
