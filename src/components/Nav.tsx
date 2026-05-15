import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Nav() {
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    if (location.pathname !== '/') { navigate('/'); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100) }
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const isHome = location.pathname === '/'

  return (
    <>
      <style>{`
        .nav-root {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: background 300ms ease, border-color 300ms ease, backdrop-filter 300ms ease;
        }
        .nav-root.scrolled {
          background: rgba(8,8,12,0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-subtle);
        }
        .nav-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px; height: 68px;
        }
        /* Brand */
        .nav-brand {
          display: flex; flex-direction: column;
          cursor: pointer; gap: 1px;
          text-decoration: none;
        }
        .nav-brand-name {
          font-family: 'DM Mono', monospace;
          font-size: 14px; letter-spacing: 0.14em;
          color: var(--text-primary); font-weight: 500;
          line-height: 1;
        }
        .nav-brand-name span {
          background: linear-gradient(135deg, #FF6B9D, #A855F7);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .nav-brand-sub {
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.12em;
          color: var(--text-tertiary);
        }
        /* Desktop links */
        .nav-links {
          display: flex; align-items: center; gap: 32px;
        }
        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: var(--text-secondary);
          background: none; border: none; cursor: pointer;
          transition: color 150ms ease; padding: 0;
        }
        .nav-link:hover { color: var(--text-primary); }
        /* CTA */
        .nav-cta {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600;
          color: #fff; background: var(--accent);
          border: none; border-radius: 100px;
          padding: 10px 24px; cursor: pointer;
          transition: all 180ms ease; letter-spacing: 0.01em;
        }
        .nav-cta:hover { filter: brightness(1.1); transform: scale(1.02); }
        /* Hamburger */
        .nav-hamburger {
          display: none; flex-direction: column;
          gap: 5px; background: none; border: none;
          cursor: pointer; padding: 4px;
        }
        .nav-ham-line {
          width: 22px; height: 2px; border-radius: 1px;
          background: var(--text-secondary);
          transition: all 200ms ease;
        }
        .nav-hamburger.open .nav-ham-line:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .nav-hamburger.open .nav-ham-line:nth-child(2) { opacity: 0; }
        .nav-hamburger.open .nav-ham-line:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
        /* Mobile menu */
        .nav-mobile {
          display: none;
          position: fixed; top: 68px; left: 0; right: 0;
          background: rgba(8,8,12,0.96);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle);
          padding: 24px 32px 32px;
          flex-direction: column; gap: 4px;
        }
        .nav-mobile.open { display: flex; }
        .nav-mobile-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; color: var(--text-secondary);
          background: none; border: none; cursor: pointer;
          text-align: left; padding: 12px 0;
          border-bottom: 1px solid var(--border-subtle);
          transition: color 150ms ease;
        }
        .nav-mobile-link:last-child { border-bottom: none; }
        .nav-mobile-link:hover { color: var(--text-primary); }
        .nav-mobile-cta {
          margin-top: 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; font-weight: 600;
          color: #fff; background: var(--accent);
          border: none; border-radius: 100px;
          padding: 14px; cursor: pointer;
          transition: all 180ms ease; text-align: center;
        }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-cta { display: none; }
          .nav-hamburger { display: flex; }
          .nav-inner { padding: 0 20px; }
        }
      `}</style>

      <nav className={`nav-root${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <div className="nav-brand" onClick={() => navigate('/')}>
            <span className="nav-brand-name">
              onestop<span>careers</span>
            </span>
            <span className="nav-brand-sub">AI PROBLEM SOLVING LAB</span>
          </div>

          {isHome && (
            <div className="nav-links">
              <button className="nav-link" onClick={() => scrollTo('truth')}>Why This</button>
              <button className="nav-link" onClick={() => scrollTo('about')}>About Ketan</button>
              <button className="nav-link" onClick={() => scrollTo('cohort')}>The Lab</button>
              <button className="nav-link" onClick={() => scrollTo('faq')}>FAQ</button>
            </div>
          )}

          <button className="nav-cta" onClick={() => navigate('/diagnostic')}>
            Test Yourself Free →
          </button>

          <button
            className={`nav-hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            <span className="nav-ham-line" />
            <span className="nav-ham-line" />
            <span className="nav-ham-line" />
          </button>
        </div>
      </nav>

      {/* Spacer */}
      <div style={{ height: 68 }} />

      {/* Mobile menu */}
      <div className={`nav-mobile${menuOpen ? ' open' : ''}`}>
        {isHome && (
          <>
            <button className="nav-mobile-link" onClick={() => scrollTo('truth')}>Why This</button>
            <button className="nav-mobile-link" onClick={() => scrollTo('about')}>About Ketan</button>
            <button className="nav-mobile-link" onClick={() => scrollTo('cohort')}>The Lab</button>
            <button className="nav-mobile-link" onClick={() => scrollTo('faq')}>FAQ</button>
          </>
        )}
        <button className="nav-mobile-cta" onClick={() => { setMenuOpen(false); navigate('/diagnostic') }}>
          Test Yourself Free →
        </button>
      </div>
    </>
  )
}
