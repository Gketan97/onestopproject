import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Nav() {
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 150)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const isHome = location.pathname === '/'
  const isEval = location.pathname === '/evaluation'

  const ctaLabel = isEval ? 'Reserve My Seat →' : 'Test Yourself Free →'
  const ctaAction = () => {
    setMenuOpen(false)
    if (isEval) {
      document.querySelector<HTMLButtonElement>('.eval-lab-btn')?.click()
    } else {
      navigate('/diagnostic')
    }
  }

  return (
    <>
      <style>{`
        .nav-root { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(8,8,12,0.75); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-bottom: 1px solid rgba(255,255,255,0.07); transition: background 300ms ease; }
        .nav-root.scrolled { background: rgba(8,8,12,0.95); border-bottom-color: var(--border-subtle); }
        .nav-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; height: 68px; }
        .nav-brand { cursor: pointer; display: flex; flex-direction: column; gap: 3px; }
        .nav-brand-name { font-family: 'DM Mono', monospace; font-size: 16px; letter-spacing: 0.1em; color: #ffffff; font-weight: 600; line-height: 1; }
        .nav-brand-name span { background: linear-gradient(135deg, #FF6B9D, #A855F7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .nav-brand-sub { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.1em; color: rgba(255,255,255,0.5); line-height: 1; }
        .nav-links { display: flex; align-items: center; gap: 28px; }
        .nav-link { font-family: 'DM Sans', sans-serif; font-size: 14px; color: rgba(255,255,255,0.65); background: none; border: none; cursor: pointer; transition: color 150ms ease; padding: 0; white-space: nowrap; }
        .nav-link:hover { color: #ffffff; }
        .nav-link.active { color: #ffffff; }
        .nav-link.lab { color: var(--accent); font-weight: 500; }
        .nav-link.lab:hover { color: #c084fc; }
        .nav-cta { font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; color: #fff; background: var(--accent); border: none; border-radius: 100px; padding: 10px 22px; cursor: pointer; transition: all 180ms ease; white-space: nowrap; }
        .nav-cta:hover { filter: brightness(1.1); transform: scale(1.02); }
        .nav-hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
        .nav-ham-line { width: 22px; height: 2px; border-radius: 1px; background: rgba(255,255,255,0.7); transition: all 200ms ease; }
        .nav-hamburger.open .nav-ham-line:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .nav-hamburger.open .nav-ham-line:nth-child(2) { opacity: 0; }
        .nav-hamburger.open .nav-ham-line:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
        .nav-mobile { display: none; position: fixed; top: 68px; left: 0; right: 0; background: rgba(8,8,12,0.98); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border-subtle); padding: 16px 24px 28px; flex-direction: column; }
        .nav-mobile.open { display: flex; }
        .nav-mobile-link { font-family: 'DM Sans', sans-serif; font-size: 16px; color: rgba(255,255,255,0.65); background: none; border: none; cursor: pointer; text-align: left; padding: 14px 0; border-bottom: 1px solid var(--border-subtle); transition: color 150ms ease; width: 100%; }
        .nav-mobile-link:hover { color: #ffffff; }
        .nav-mobile-link.lab { color: var(--accent); font-weight: 500; }
        .nav-mobile-cta { margin-top: 20px; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 600; color: #fff; background: var(--accent); border: none; border-radius: 100px; padding: 15px; cursor: pointer; text-align: center; width: 100%; }
        @media (max-width: 768px) { .nav-links { display: none; } .nav-cta { display: none; } .nav-hamburger { display: flex; } .nav-inner { padding: 0 20px; } }
      `}</style>

      <nav className={`nav-root${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <div className="nav-brand" onClick={() => navigate('/')}>
            <span className="nav-brand-name">onestop<span>careers</span></span>
            <span className="nav-brand-sub">AI PROBLEM SOLVING LAB</span>
          </div>
          <div className="nav-links">
            {isHome && (
              <>
                <button className="nav-link" onClick={() => scrollTo('truth')}>The Problem</button>
                <button className="nav-link" onClick={() => scrollTo('about')}>About Ketan</button>
                <button className="nav-link" onClick={() => scrollTo('testimonials')}>Reviews</button>
                <button className="nav-link" onClick={() => scrollTo('faq')}>FAQ</button>
              </>
            )}
<button className={`nav-link lab${location.pathname === '/lab' ? ' active' : ''}`} onClick={() => navigate('/lab')}>The Lab ↗</button>
          </div>
          <button className="nav-cta" onClick={ctaAction}>{ctaLabel}</button>
          <button className={`nav-hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            <span className="nav-ham-line" /><span className="nav-ham-line" /><span className="nav-ham-line" />
          </button>
        </div>
      </nav>

      <div style={{ height: 68 }} />

      <div className={`nav-mobile${menuOpen ? ' open' : ''}`}>
        {isHome && (
          <>
            <button className="nav-mobile-link" onClick={() => scrollTo('truth')}>The Problem</button>
            <button className="nav-mobile-link" onClick={() => scrollTo('about')}>About Ketan</button>
            <button className="nav-mobile-link" onClick={() => scrollTo('testimonials')}>Reviews</button>
            <button className="nav-mobile-link" onClick={() => scrollTo('faq')}>FAQ</button>
          </>
        )}
<button className="nav-mobile-link lab" onClick={() => { setMenuOpen(false); navigate('/lab') }}>The Lab ↗</button>
        <button className="nav-mobile-cta" onClick={ctaAction}>{ctaLabel}</button>
      </div>
    </>
  )
}
