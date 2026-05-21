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

  useEffect(() => {
    const handler = () => setMenuOpen(false)
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

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
        .nav-root { position:fixed; top:0; left:0; right:0; z-index:100; background:rgba(8,8,12,0.80); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); border-bottom:1px solid rgba(255,255,255,0.07); transition:background 300ms ease; }
        .nav-root.scrolled { background:rgba(8,8,12,0.96); border-bottom-color:var(--border-subtle); }
        .nav-inner { max-width:1200px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; padding:0 32px; height:68px; }
        .nav-brand { cursor:pointer; display:flex; flex-direction:column; gap:3px; }
        .nav-brand-name { font-family:'DM Mono',monospace; font-size:16px; letter-spacing:0.1em; color:#fff; font-weight:600; line-height:1; }
        .nav-brand-name span { background:linear-gradient(135deg,#FF6B9D,#A855F7); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .nav-brand-sub { font-family:'DM Mono',monospace; font-size:11px; letter-spacing:0.1em; color:rgba(255,255,255,0.45); line-height:1; }
        .nav-links { display:flex; align-items:center; gap:28px; }
        .nav-link { font-family:'DM Sans',sans-serif; font-size:14px; color:rgba(255,255,255,0.6); background:none; border:none; cursor:pointer; transition:color 150ms; padding:0; white-space:nowrap; }
        .nav-link:hover { color:#fff; }
        .nav-link.active { color:#fff; }
        .nav-link.highlight { color:var(--accent); font-weight:500; }
        .nav-link.highlight:hover { color:#c084fc; }
        .nav-cta { font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; color:#fff; background:var(--accent); border:none; border-radius:100px; padding:10px 22px; cursor:pointer; transition:all 180ms; white-space:nowrap; }
        .nav-cta:hover { filter:brightness(1.1); }

        /* Hamburger */
        .nav-hamburger { display:none; flex-direction:column; justify-content:center; align-items:center; gap:5px; width:44px; height:44px; background:none; border:none; cursor:pointer; position:relative; z-index:300; flex-shrink:0; }
        .nav-ham-line { width:22px; height:2px; border-radius:1px; background:rgba(255,255,255,0.8); transition:all 220ms ease; }
        .nav-hamburger.open .nav-ham-line:nth-child(1) { transform:translateY(7px) rotate(45deg); }
        .nav-hamburger.open .nav-ham-line:nth-child(2) { opacity:0; }
        .nav-hamburger.open .nav-ham-line:nth-child(3) { transform:translateY(-7px) rotate(-45deg); }

        /* Backdrop */
        .nav-backdrop { position:fixed; inset:0; z-index:190; background:rgba(0,0,0,0.65); opacity:0; pointer-events:none; transition:opacity 200ms ease; }
        .nav-backdrop.open { opacity:1; pointer-events:auto; }

        /* Mobile menu */
        .nav-mobile { display:none; position:fixed; top:68px; left:0; right:0; z-index:200; background:rgba(8,8,12,0.98); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border-bottom:1px solid var(--border-subtle); padding:8px 24px 28px; flex-direction:column; max-height:calc(100vh - 68px); overflow-y:auto; -webkit-overflow-scrolling:touch; }
        .nav-mobile.open { display:flex; }
        .nav-mobile-link { font-family:'DM Sans',sans-serif; font-size:16px; color:rgba(255,255,255,0.65); background:none; border:none; cursor:pointer; text-align:left; padding:16px 0; border-bottom:1px solid var(--border-subtle); transition:color 150ms; width:100%; min-height:44px; }
        .nav-mobile-link:last-of-type { border-bottom:none; }
        .nav-mobile-link:hover { color:#fff; }
        .nav-mobile-link.highlight { color:var(--accent); font-weight:500; }
        .nav-mobile-cta { margin-top:16px; font-family:'DM Sans',sans-serif; font-size:16px; font-weight:600; color:#fff; background:var(--accent); border:none; border-radius:100px; padding:15px; cursor:pointer; text-align:center; width:100%; }

        @media (max-width:900px) { .nav-links { gap:18px; } }
        @media (max-width:768px) { .nav-links { display:none; } .nav-cta { display:none; } .nav-hamburger { display:flex; } .nav-inner { padding:0 20px; } }
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
                <button className="nav-link" onClick={() => scrollTo('faq')}>FAQ</button>
                <button className={`nav-link${location.pathname === '/jobs' || location.pathname.startsWith('/jobs/') ? ' active' : ''}`} onClick={() => navigate('/jobs')}>Jobs</button>
              </>
            )}
            <button className={`nav-link${location.pathname === '/case-study' ? ' active' : ''}`} onClick={() => navigate('/case-study')}>Case Study</button>
            <button className="nav-link highlight" onClick={() => navigate('/case-study')}>The Lab ↗</button>
          </div>

          <button className="nav-cta" onClick={ctaAction}>{ctaLabel}</button>

          <button
            className={`nav-hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="nav-ham-line" />
            <span className="nav-ham-line" />
            <span className="nav-ham-line" />
          </button>
        </div>
      </nav>

      {/* Backdrop — tap outside to close */}
      <div
        className={`nav-backdrop${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <div style={{ height: 68 }} />

      <div className={`nav-mobile${menuOpen ? ' open' : ''}`}>
        {isHome && (
          <>
            <button className="nav-mobile-link" onClick={() => scrollTo('truth')}>The Problem</button>
            <button className="nav-mobile-link" onClick={() => scrollTo('about')}>About Ketan</button>
            <button className="nav-mobile-link" onClick={() => scrollTo('faq')}>FAQ</button>
            <button className="nav-mobile-link" onClick={() => { setMenuOpen(false); navigate('/jobs') }}>Jobs</button>
          </>
        )}
        <button className="nav-mobile-link" onClick={() => { setMenuOpen(false); navigate('/case-study') }}>Case Study</button>
        <button className="nav-mobile-link highlight" onClick={() => { setMenuOpen(false); navigate('/case-study') }}>The Lab ↗</button>
        <button className="nav-mobile-cta" onClick={ctaAction}>{ctaLabel}</button>
      </div>
    </>
  )
}
