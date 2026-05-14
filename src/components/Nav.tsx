import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'The Shift', href: '#truth' },
  { label: 'Transformation', href: '#transformation' },
  { label: 'The Lab', href: '#cohort' },
  { label: 'About', href: '#about' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleAnchor = (href: string) => {
    setMenuOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <style>{`
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          height: 60px;
          display: flex; align-items: center;
          padding: 0 32px;
          transition: background 300ms ease, border-color 300ms ease;
          border-bottom: 1px solid transparent;
        }
        .nav.scrolled {
          background: rgba(10,10,11,0.90);
          backdrop-filter: blur(16px) saturate(1.2);
          -webkit-backdrop-filter: blur(16px) saturate(1.2);
          border-bottom-color: var(--border-subtle);
        }
        .nav-inner {
          max-width: var(--max-w); margin: 0 auto; width: 100%;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav-logo {
          font-family: var(--font-mono);
          font-size: 13px; letter-spacing: 0.12em;
          color: var(--text-primary);
          cursor: pointer;
          user-select: none;
        }
        .nav-logo span {
          color: var(--accent);
        }
        .nav-links {
          display: flex; align-items: center; gap: 32px;
        }
        .nav-link {
          font-family: var(--font-sans);
          font-size: 14px; font-weight: 400;
          color: var(--text-secondary);
          cursor: pointer;
          transition: color 150ms ease;
          background: none; border: none; padding: 0;
        }
        .nav-link:hover { color: var(--text-primary); }
        .nav-cta {
          font-family: var(--font-sans);
          font-size: 13px; font-weight: 500;
          color: var(--bg-base);
          background: var(--text-primary);
          border-radius: 100px;
          padding: 8px 20px;
          transition: all 150ms ease;
          border: none; cursor: pointer;
        }
        .nav-cta:hover { opacity: 0.88; }
        /* Mobile hamburger */
        .nav-hamburger {
          display: none; flex-direction: column;
          gap: 5px; padding: 4px; cursor: pointer;
          background: none; border: none;
        }
        .nav-hamburger span {
          display: block; width: 20px; height: 1px;
          background: var(--text-secondary);
          transition: all 250ms ease;
        }
        .nav-hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(4px, 4px); }
        .nav-hamburger.open span:nth-child(2) { opacity: 0; }
        .nav-hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(4px, -4px); }
        /* Mobile menu */
        .nav-mobile {
          position: fixed; top: 60px; left: 0; right: 0;
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border-subtle);
          padding: 24px 32px 32px;
          display: flex; flex-direction: column; gap: 8px;
          transform: translateY(-8px); opacity: 0;
          pointer-events: none;
          transition: all 250ms ease;
          z-index: 99;
        }
        .nav-mobile.open {
          transform: translateY(0); opacity: 1; pointer-events: all;
        }
        .nav-mobile-link {
          font-family: var(--font-sans);
          font-size: 16px; font-weight: 400;
          color: var(--text-secondary);
          padding: 12px 0;
          border-bottom: 1px solid var(--border-subtle);
          cursor: pointer; background: none; border-left: none; border-right: none; border-top: none;
          text-align: left;
          transition: color 150ms ease;
        }
        .nav-mobile-link:hover { color: var(--text-primary); }
        .nav-mobile-cta {
          margin-top: 8px;
          font-family: var(--font-sans);
          font-size: 15px; font-weight: 500;
          color: var(--bg-base);
          background: var(--text-primary);
          border-radius: 100px;
          padding: 14px 24px;
          text-align: center;
          cursor: pointer; border: none;
        }
        @media (max-width: 768px) {
          .nav-links, .nav-cta { display: none; }
          .nav-hamburger { display: flex; }
          .nav { padding: 0 24px; }
        }
        @media (max-width: 480px) {
          .nav { padding: 0 20px; }
          .nav-mobile { padding: 20px 20px 28px; }
        }
      `}</style>

      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <span className="nav-logo" onClick={() => navigate('/')}>
            KETAN<span>.</span>
          </span>
          <div className="nav-links">
            {NAV_LINKS.map(link => (
              <button key={link.label} className="nav-link" onClick={() => handleAnchor(link.href)}>
                {link.label}
              </button>
            ))}
          </div>
          <button className="nav-cta" onClick={() => navigate('/diagnostic')}>
            Test Your Thinking
          </button>
          <button
            className={`nav-hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`nav-mobile${menuOpen ? ' open' : ''}`}>
        {NAV_LINKS.map(link => (
          <button key={link.label} className="nav-mobile-link" onClick={() => handleAnchor(link.href)}>
            {link.label}
          </button>
        ))}
        <button className="nav-mobile-cta" onClick={() => { setMenuOpen(false); navigate('/diagnostic') }}>
          Test Your Thinking →
        </button>
      </div>
    </>
  )
}
