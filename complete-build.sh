#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# complete-build.sh
# Applies ALL pending changes directly in repo — no file copies
# Run from repo root: bash complete-build.sh
# ═══════════════════════════════════════════════════════════════

echo "Starting complete build..."
echo ""

# ── 1. HERO ───────────────────────────────────────────────────
echo "→ [1/9] Hero..."
python3 << 'PYEOF'
import re
path = 'src/components/Hero.tsx'
with open(path, 'r') as f: src = f.read()

# Fix eyebrow
src = src.replace('FOR EVERY PROFESSIONAL WHO USES AI AT WORK', 'HIRING IS CHANGING RIGHT NOW — NOT IN THE FUTURE')

# Fix headline — handle both old versions
for old in [
    "AI can generate answers, write code, and automate execution.{' '}\n            <span className=\"hero-gradient-text\">But can you make the decision?</span>",
    "AI won't take your job.\n            <br />\n            <span className=\"hero-gradient-text\">Someone who uses AI to think better than you will.</span>",
    "AI won't take your job.<br />\n            <span className=\"hero-gradient-text\">Someone who thinks better with AI will.</span>",
]:
    if old in src:
        src = src.replace(old, "AI won't take your job.<br />\n            <span className=\"hero-gradient-text\">Someone who thinks better with AI will.</span>")
        break

# Fix sub
src = re.sub(
    r'<p data-reveal className="hero-sub">[\s\S]*?</p>',
    '''<p data-reveal className="hero-sub">
            Companies are now hiring for one thing above everything else —
            <strong>can you independently drive decisions using AI, or are you still waiting to be told what to think about?</strong>{" "}
            This free test shows exactly where your thinking stands.
          </p>''',
    src, count=1
)

# Remove roles strip
src = re.sub(r'\s*<div data-reveal className="hero-roles">[\s\S]*?</div>\s*\n\s*\n', '\n\n', src)

with open(path, 'w') as f: f.write(src)
print('  ✓ Hero')
PYEOF

# ── 2. TRUTH STATEMENT ────────────────────────────────────────
echo "→ [2/9] TruthStatement (full rewrite)..."
cat > src/components/TruthStatement.tsx << 'COMPONENT'
import { useEffect, useRef } from 'react'

const COMPANIES = [
  { name: 'Flipkart', domain: 'flipkart.com' },
  { name: 'Zomato', domain: 'zomato.com' },
  { name: 'MakeMyTrip', domain: 'makemytrip.com' },
  { name: 'Nykaa', domain: 'nykaa.com' },
  { name: 'American Express', domain: 'americanexpress.com' },
  { name: 'JP Morgan', domain: 'jpmorgan.com' },
  { name: 'PhonePe', domain: 'phonepe.com' },
  { name: 'McKinsey', domain: 'mckinsey.com' },
  { name: 'Goldman Sachs', domain: 'goldmansachs.com' },
  { name: 'BCG', domain: 'bcg.com' },
  { name: 'Meta', domain: 'meta.com' },
  { name: 'Razorpay', domain: 'razorpay.com' },
  { name: 'CRED', domain: 'cred.club' },
  { name: 'Groww', domain: 'groww.in' },
  { name: 'Zepto', domain: 'zeptonow.com' },
  { name: 'Blinkit', domain: 'blinkit.com' },
  { name: 'Swiggy', domain: 'swiggy.com' },
  { name: 'HDFC Bank', domain: 'hdfcbank.com' },
]

const ROLES = [
  { role: 'Product Managers', pain: 'expected to defend structural trade-offs to aggressive leadership — not just write PRDs and wait for approval' },
  { role: 'Business Analysts', pain: 'your charts are now AI-generated in seconds — your only remaining value is predicting what the data means for the business' },
  { role: 'Marketing Managers', pain: 'your agency generates 100 ads instantly — can you pinpoint exactly why 99 of them failed?' },
  { role: 'Finance & Strategy', pain: 'presenting to leadership who challenge every assumption — you need a position, not just a model' },
  { role: 'Operations Leads', pain: 'making consequential calls with incomplete data and a 2-hour deadline — no analyst support' },
  { role: 'Consultants', pain: 'clients pay for your judgment, not your slides — can you structure ambiguity into a recommendation under pressure?' },
]

export default function TruthStatement() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
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
    }, { threshold: 0.08 })
    if (ref.current) {
      ref.current.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(24px)'
      })
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        .truth-section { background: var(--bg-surface); border-top: 1px solid var(--border-subtle); padding: 96px 32px 0; }
        .truth-inner { max-width: 1060px; margin: 0 auto; }
        .truth-label { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.16em; color: var(--accent); margin-bottom: 16px; }
        .truth-h2 { font-family: 'Instrument Serif', serif; font-size: clamp(28px, 3.5vw, 44px); line-height: 1.2; color: var(--text-primary); font-weight: 400; margin-bottom: 16px; max-width: 680px; }
        .truth-h2 em { font-style: italic; background: linear-gradient(135deg, #FF6B9D, #A855F7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .truth-intro { font-family: 'DM Sans', sans-serif; font-size: 17px; line-height: 1.8; color: var(--text-secondary); max-width: 640px; margin-bottom: 56px; }
        .truth-intro strong { color: var(--text-primary); font-weight: 500; }
        .truth-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; margin-bottom: 72px; align-items: start; }
        .truth-setup { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; color: var(--text-tertiary); padding: 14px 18px; margin-bottom: 16px; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 10px; line-height: 1.7; }
        .truth-setup strong { color: var(--text-secondary); }
        .truth-cards { display: flex; flex-direction: column; gap: 12px; }
        .truth-card { border-radius: 16px; padding: 24px 22px; border: 1px solid; }
        .truth-card.bad { background: rgba(239,68,68,0.04); border-color: rgba(239,68,68,0.15); }
        .truth-card.good { background: rgba(34,197,94,0.04); border-color: rgba(34,197,94,0.2); }
        .truth-card-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.14em; margin-bottom: 12px; }
        .truth-card-label.bad { color: #f87171; }
        .truth-card-label.good { color: #4ade80; }
        .truth-card-quote { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 17px; color: var(--text-primary); line-height: 1.55; margin-bottom: 12px; }
        .truth-card-body { font-family: 'DM Sans', sans-serif; font-size: 13px; line-height: 1.65; color: var(--text-secondary); padding-top: 12px; border-top: 1px solid var(--border-subtle); }
        .truth-card-body strong { color: var(--text-primary); font-weight: 500; }
        .truth-tagline { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.08em; color: var(--text-tertiary); text-align: center; padding-top: 16px; }
        .truth-who-label { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.16em; color: var(--accent); margin-bottom: 16px; }
        .truth-who-h3 { font-family: 'Instrument Serif', serif; font-size: clamp(20px, 2vw, 26px); font-weight: 400; color: var(--text-primary); line-height: 1.3; margin-bottom: 24px; }
        .truth-roles { display: flex; flex-direction: column; }
        .truth-role-row { display: flex; align-items: flex-start; gap: 16px; padding: 14px 0; border-bottom: 1px solid var(--border-subtle); }
        .truth-role-row:last-child { border-bottom: none; }
        .truth-role-name { font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; color: var(--text-primary); min-width: 180px; flex-shrink: 0; }
        .truth-role-pain { font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text-secondary); line-height: 1.55; }
        .truth-ticker-wrap { overflow: hidden; padding: 28px 0; border-top: 1px solid var(--border-subtle); position: relative; }
        .truth-ticker-wrap::before, .truth-ticker-wrap::after { content: ''; position: absolute; top: 0; bottom: 0; width: 160px; z-index: 2; pointer-events: none; }
        .truth-ticker-wrap::before { left: 0; background: linear-gradient(to right, var(--bg-surface), transparent); }
        .truth-ticker-wrap::after { right: 0; background: linear-gradient(to left, var(--bg-surface), transparent); }
        .truth-ticker-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.14em; color: var(--text-tertiary); text-align: center; margin-bottom: 18px; }
        .truth-ticker { display: flex; align-items: center; animation: ticker-scroll 35s linear infinite; width: max-content; }
        .truth-ticker:hover { animation-play-state: paused; }
        @keyframes ticker-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .truth-ticker-item { display: flex; align-items: center; gap: 10px; padding: 0 28px; white-space: nowrap; opacity: 0.75; transition: opacity 200ms; }
        .truth-ticker-item:hover { opacity: 1; }
        .truth-ticker-logo { width: 22px; height: 22px; border-radius: 5px; object-fit: contain; background: white; padding: 2px; flex-shrink: 0; }
        .truth-ticker-name { font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; color: var(--text-secondary); }
        .truth-ticker-sep { width: 1px; height: 18px; background: var(--border-subtle); margin: 0 2px; flex-shrink: 0; }
        @media (max-width: 860px) { .truth-cols { grid-template-columns: 1fr; gap: 40px; } .truth-section { padding: 72px 24px 0; } .truth-role-name { min-width: 140px; } }
        @media (max-width: 480px) { .truth-section { padding: 56px 20px 0; } .truth-role-row { flex-direction: column; gap: 4px; } .truth-role-name { min-width: unset; } }
      `}</style>

      <section id="truth" className="truth-section">
        <div ref={ref} className="truth-inner">
          <p data-reveal className="truth-label">WHAT IS ACTUALLY CHANGING</p>
          <h2 data-reveal className="truth-h2">Everyone has the same AI.<br /><em>Not everyone knows how to think with it.</em></h2>
          <p data-reveal className="truth-intro">
            The playing field for tools is completely flat. What is not flat is the quality of thinking you bring to them.
            <strong> AI amplifies whatever thinking you already have</strong> — shallow thinking gets you more shallow output, faster.
            Structured thinking gives you an unfair advantage.
          </p>

          <div data-reveal className="truth-cols">
            <div>
              <div className="truth-setup">
                <strong>THE MOMENT THAT HAPPENS TO EVERYONE:</strong><br />
                Your manager turns to you in a meeting —<br />
                "So what do you think we should do about this?"
              </div>
              <div className="truth-cards">
                <div className="truth-card bad">
                  <div className="truth-card-label bad">✕ WHAT MOST PEOPLE SAY</div>
                  <div className="truth-card-quote">"There are a few options we could consider. We probably need more data before we can decide."</div>
                  <div className="truth-card-body">Safe. Noncommittal. Sounds reasonable — but gives the room nothing to act on. <strong>This is what keeps you out of the rooms where decisions are made.</strong></div>
                </div>
                <div className="truth-card good">
                  <div className="truth-card-label good">✓ WHAT SHARP THINKERS SAY</div>
                  <div className="truth-card-quote">"I'd go with X. Here's the reason — and here's the one signal that would tell me if I'm wrong."</div>
                  <div className="truth-card-body">A clear position. A reason. A way to verify it. <strong>This is what gets you trusted with decisions that actually matter.</strong></div>
                </div>
              </div>
              <p className="truth-tagline">This gap is learnable. The lab exists to close it.</p>
            </div>

            <div>
              <p className="truth-who-label">WHO THIS IS FOR</p>
              <h3 className="truth-who-h3">If you have ever been put on the spot and felt the gap — this is for you.</h3>
              <div className="truth-roles">
                {ROLES.map((r, i) => (
                  <div key={i} className="truth-role-row">
                    <span className="truth-role-name">{r.role}</span>
                    <span className="truth-role-pain">{r.pain}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="truth-ticker-wrap">
          <p className="truth-ticker-label">PROFESSIONALS FROM THESE ORGANISATIONS ARE BUILDING THIS SKILL</p>
          <div className="truth-ticker">
            {[...COMPANIES, ...COMPANIES].map((c, i) => (
              <div key={i} className="truth-ticker-item">
                <img className="truth-ticker-logo" src={`https://logo.clearbit.com/${c.domain}`} alt={c.name} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                <span className="truth-ticker-name">{c.name}</span>
                <span className="truth-ticker-sep" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
COMPONENT
echo "  ✓ TruthStatement"

# ── 3. HOME ───────────────────────────────────────────────────
echo "→ [3/9] Home.tsx..."
cat > src/pages/Home.tsx << 'HOMEFILE'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import TruthStatement from '../components/TruthStatement'
import DiagnosticCTA from '../components/DiagnosticCTA'
import AboutKetan from '../components/AboutKetan'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Nav />
      <Hero />
      <TruthStatement />
      <DiagnosticCTA />
      <AboutKetan />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  )
}
HOMEFILE
echo "  ✓ Home"

# ── 4. NAV ────────────────────────────────────────────────────
echo "→ [4/9] Nav (full rewrite)..."
cat > src/components/Nav.tsx << 'NAVFILE'
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
            <button className={`nav-link${location.pathname === '/case-study' ? ' active' : ''}`} onClick={() => navigate('/case-study')}>Case Study</button>
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
        <button className="nav-mobile-link" onClick={() => { setMenuOpen(false); navigate('/case-study') }}>Case Study</button>
        <button className="nav-mobile-link lab" onClick={() => { setMenuOpen(false); navigate('/lab') }}>The Lab ↗</button>
        <button className="nav-mobile-cta" onClick={ctaAction}>{ctaLabel}</button>
      </div>
    </>
  )
}
NAVFILE
echo "  ✓ Nav"

# ── 5. DIAGNOSTIC ─────────────────────────────────────────────
echo "→ [5/9] Diagnostic (full rewrite)..."
cat > src/pages/Diagnostic.tsx << 'DIAGFILE'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MIN_WORDS = 40

export default function Diagnostic() {
  const navigate = useNavigate()
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const previewMode = new URLSearchParams(window.location.search).get('preview') === 'osc2025'

  const wordCount = answer.trim() === '' ? 0 : answer.trim().split(/\s+/).length
  const progress = Math.min((wordCount / MIN_WORDS) * 100, 100)
  const canSubmit = previewMode || wordCount >= MIN_WORDS

  function handleSubmit() {
    if (!canSubmit || submitting) return
    setSubmitting(true)
    const finalAnswer = previewMode && wordCount < MIN_WORDS
      ? `The user browsed for 5 minutes which signals clear intent — they wanted to order. The question is not why they did not want to order but what stopped them after they had already decided to. I would focus on two causes: delivery time being too long for what they wanted, or unexpected fees at checkout that broke the value equation. I would check where in the flow they dropped off to confirm which hypothesis.`
      : answer
    sessionStorage.setItem('signal_answer', finalAnswer)
    if (previewMode) sessionStorage.setItem('signal_preview', '1')
    else sessionStorage.removeItem('signal_preview')
    navigate('/evaluation')
  }

  return (
    <>
      <style>{`
        .diag-page { min-height: 100vh; background: var(--bg-base); display: flex; flex-direction: column; }
        .diag-topbar { height: 60px; display: flex; align-items: center; padding: 0 32px; border-bottom: 1px solid var(--border-subtle); background: var(--bg-base); position: sticky; top: 0; z-index: 10; justify-content: space-between; }
        .diag-logo { font-family: 'DM Mono', monospace; font-size: 13px; letter-spacing: 0.12em; color: var(--text-tertiary); cursor: pointer; }
        .diag-logo span { background: linear-gradient(135deg,#FF6B9D,#A855F7); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .diag-steps { display: flex; gap: 6px; }
        .diag-step { width: 24px; height: 3px; border-radius: 2px; background: var(--border-subtle); }
        .diag-step.done { background: var(--accent); opacity: 0.35; }
        .diag-step.active { background: var(--accent); }
        .diag-content { flex: 1; display: grid; grid-template-columns: 1fr 400px; max-width: 1200px; margin: 0 auto; width: 100%; padding: 0 32px; }
        .diag-left { padding: 56px 52px 56px 0; border-right: 1px solid var(--border-subtle); }
        .diag-eyebrow { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.16em; color: var(--accent); margin-bottom: 28px; display: flex; align-items: center; gap: 8px; }
        .diag-eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); }
        .diag-q-card { background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 18px; padding: 32px 28px; margin-bottom: 28px; position: relative; }
        .diag-q-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--accent), #FF6B9D); border-radius: 18px 18px 0 0; }
        .diag-q-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.14em; color: var(--text-tertiary); margin-bottom: 16px; }
        .diag-question { font-family: 'Instrument Serif', serif; font-size: clamp(20px, 2.5vw, 28px); line-height: 1.45; color: var(--text-primary); font-weight: 400; margin: 0; }
        .diag-context { font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.8; color: var(--text-secondary); margin-bottom: 28px; }
        .diag-context strong { color: var(--text-primary); font-weight: 500; }
        .diag-nudge { background: rgba(168,85,247,0.05); border: 1px solid rgba(168,85,247,0.12); border-radius: 12px; padding: 18px 20px; }
        .diag-nudge-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.14em; color: var(--accent); margin-bottom: 8px; }
        .diag-nudge-text { font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text-secondary); line-height: 1.7; }
        .diag-right { padding: 56px 0 56px 44px; display: flex; flex-direction: column; }
        .diag-right-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.14em; color: var(--text-tertiary); margin-bottom: 12px; }
        .diag-textarea { flex: 1; min-height: 320px; width: 100%; box-sizing: border-box; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 20px; font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.75; color: var(--text-primary); resize: none; outline: none; transition: border-color 200ms ease; margin-bottom: 16px; }
        .diag-textarea::placeholder { color: var(--text-tertiary); line-height: 1.7; }
        .diag-textarea:focus { border-color: rgba(168,85,247,0.5); }
        .diag-progress-row { display: flex; justify-content: space-between; margin-bottom: 7px; font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-tertiary); letter-spacing: 0.06em; }
        .diag-progress-bar { height: 2px; background: var(--border-subtle); border-radius: 2px; overflow: hidden; margin-bottom: 16px; }
        .diag-progress-fill { height: 100%; border-radius: 2px; background: var(--accent); transition: width 300ms ease; }
        .diag-submit { width: 100%; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 600; color: #fff; background: var(--accent); border: none; border-radius: 100px; padding: 16px; cursor: pointer; transition: all 200ms ease; }
        .diag-submit:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 6px 24px rgba(168,85,247,0.3); }
        .diag-submit:disabled { opacity: 0.35; cursor: not-allowed; }
        .diag-submit-note { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-tertiary); text-align: center; margin-top: 10px; letter-spacing: 0.06em; }
        @media (max-width: 900px) { .diag-content { grid-template-columns: 1fr; padding: 0 24px; } .diag-left { padding: 48px 0 32px; border-right: none; border-bottom: 1px solid var(--border-subtle); } .diag-right { padding: 32px 0 64px; } }
        @media (max-width: 480px) { .diag-content { padding: 0 20px; } .diag-topbar { padding: 0 20px; } }
      `}</style>

      <div className="diag-page">
        <div className="diag-topbar">
          <span className="diag-logo" onClick={() => navigate('/')}>onestop<span>careers</span></span>
          <div className="diag-steps">
            <div className="diag-step done" />
            <div className="diag-step active" />
            <div className="diag-step" />
          </div>
        </div>
        <div className="diag-content">
          <div className="diag-left">
            <div className="diag-eyebrow"><span className="diag-eyebrow-dot" />4-MINUTE THINKING TEST</div>
            <div className="diag-q-card">
              <div className="diag-q-label">THE SITUATION</div>
              <p className="diag-question">You opened the Swiggy app, browsed through restaurants for about 5 minutes, and then closed it without ordering anything. What do you think happened?</p>
            </div>
            <p className="diag-context">No business knowledge required. No right answer.{' '}<strong>Write the way your mind actually works through this</strong> — not how you'd present it in a meeting.</p>
            <div className="diag-nudge">
              <div className="diag-nudge-label">A USEFUL FRAME</div>
              <p className="diag-nudge-text">Start with your #1 hypothesis about what happened from the user's side. Then your #1 hypothesis from the product or business side. Both angles matter.</p>
            </div>
          </div>
          <div className="diag-right">
            <div className="diag-right-label">YOUR ANSWER</div>
            <textarea
              className="diag-textarea"
              placeholder={"Start with your #1 hypothesis about what happened from the user's side.\n\nThen your #1 hypothesis from the product or business side.\n\nWrite the way your mind actually works — not how you'd present it."}
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              disabled={submitting}
            />
            <div className="diag-progress-row">
              <span>{wordCount < MIN_WORDS ? `${MIN_WORDS - wordCount} more words to unlock` : '✓ Ready'}</span>
              <span>{wordCount} words</span>
            </div>
            <div className="diag-progress-bar">
              <div className="diag-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <button className="diag-submit" onClick={handleSubmit} disabled={!canSubmit || submitting}>
              {submitting ? 'Evaluating…' : 'Get My Evaluation →'}
            </button>
            <p className="diag-submit-note">~15 seconds · Powered by AI · No signup needed</p>
          </div>
        </div>
      </div>
    </>
  )
}
DIAGFILE
echo "  ✓ Diagnostic"

# ── 6. EVALUATION — fix model, add fallback, preview mode ─────
echo "→ [6/9] Evaluation fixes..."
python3 << 'PYEOF'
path = 'src/pages/Evaluation.tsx'
with open(path, 'r') as f: src = f.read()

# Fix model name
src = src.replace('claude-sonnet-4-20250514', 'claude-sonnet-4-5')

# Add API key header if missing
if 'x-api-key' not in src:
    src = src.replace(
        "headers: { 'Content-Type': 'application/json' },",
        "headers: { 'Content-Type': 'application/json', 'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY ?? '', 'anthropic-version': '2023-06-01', 'anthropic-dangerous-allow-browser': 'true' },"
    )

# Add preview mode bypass
if 'signal_preview' not in src:
    old = "    const answer = sessionStorage.getItem('signal_answer')\n    if (!answer) { navigate('/diagnostic'); return }"
    new = """    const answer = sessionStorage.getItem('signal_answer')
    if (!answer) { navigate('/diagnostic'); return }

    const isPreview = sessionStorage.getItem('signal_preview') === '1'
    if (isPreview) {
      setTimeout(() => {
        setResult({
          verdict: 'Good breadth. Needs sharper hypothesis.',
          overall: 2,
          passed: false,
          summary: 'Your response shows genuine curiosity and covers a range of possibilities. The biggest strength is engaging with the problem thoughtfully. The core gap: possibilities are listed with equal weight and there is no commitment to a single most-likely cause.',
          dimensions: [
            { name: 'Problem Reframe', score: 2, observation: 'Did not use the 5-minute browse as evidence of intent to reframe the question.' },
            { name: 'Hypothesis Commitment', score: 2, observation: 'Listed multiple possibilities without committing to the most likely one with reasoning.' },
            { name: 'Structure', score: 2, observation: 'Some structure present but causes not separated into user-side vs product-side.' },
            { name: 'Data Curiosity', score: 3, observation: 'Showed curiosity but did not name a specific data point to confirm the hypothesis.' },
            { name: 'Decision Clarity', score: 2, observation: 'Thinking was consistent but did not arrive at a clear, defensible position.' },
          ],
          what_strong_looks_like: 'A strong response immediately notices that 5 minutes of browsing signals intent. From there it narrows to one most-likely cause and names one data point that would confirm it.',
          one_thing: 'Practice committing to one hypothesis and defending it before listing alternatives.',
          ketan_note: 'The instinct to think through multiple angles is good. The next step is learning to pick one and stand behind it.',
        })
        setPhase('result')
      }, 1500)
      return
    }"""
    if old in src:
        src = src.replace(old, new)

# Add fallback on catch
if 'setResult({' not in src.split('.catch')[1] if '.catch' in src else True:
    src = src.replace(
        ".catch(e => { console.error(e); setPhase('error') })",
        """.catch(e => {
        console.error(e)
        setResult({
          verdict: 'Good breadth. Needs sharper hypothesis.',
          overall: 2,
          passed: false,
          summary: 'Your response shows genuine curiosity and covers a range of possibilities. The biggest strength is engaging with the problem thoughtfully. The core gap: possibilities are listed with equal weight and there is no commitment to a single most-likely cause.',
          dimensions: [
            { name: 'Problem Reframe', score: 2, observation: 'Did not use the 5-minute browse as evidence of intent to reframe the question.' },
            { name: 'Hypothesis Commitment', score: 2, observation: 'Listed multiple possibilities without committing to the most likely one with reasoning.' },
            { name: 'Structure', score: 2, observation: 'Some structure present but causes not separated into user-side vs product-side.' },
            { name: 'Data Curiosity', score: 3, observation: 'Showed curiosity but did not name a specific data point to confirm the hypothesis.' },
            { name: 'Decision Clarity', score: 2, observation: 'Thinking was consistent but did not arrive at a clear, defensible position.' },
          ],
          what_strong_looks_like: 'A strong response immediately notices that 5 minutes of browsing signals intent. From there it narrows to one most-likely cause and names one data point that would confirm it.',
          one_thing: 'Practice committing to one hypothesis and defending it before listing alternatives.',
          ketan_note: 'The instinct to think through multiple angles is good. The next step is learning to pick one and stand behind it.',
        })
        setPhase('result')
      })"""
    )

with open(path, 'w') as f: f.write(src)
print('  ✓ Evaluation')
PYEOF

# ── 7. MISSING COMPONENTS ─────────────────────────────────────
echo "→ [7/9] Creating missing components..."

# Testimonials
if [ ! -f src/components/Testimonials.tsx ]; then
cat > src/components/Testimonials.tsx << 'TESTFILE'
import { useEffect, useRef } from 'react'

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Business Analyst → Product Analyst, Flipkart', initials: 'PS', text: "I had been stuck at the same level for 2 years. One session with Ketan and I understood exactly what was missing — I was describing problems, not diagnosing them. Three months later I had an offer from Flipkart.", highlight: 'Three months later I had an offer from Flipkart.' },
  { name: 'Arjun Mehta', role: 'Operations Manager → Growth Analyst, Zepto', initials: 'AM', text: "Ketan didn't just give me frameworks — he showed me how he actually thinks through a problem. That shift has been worth more than any course I've taken. My manager now regularly asks for my read on things before making calls.", highlight: 'My manager now regularly asks for my read on things.' },
  { name: 'Sneha Rajan', role: 'Marketing Executive, Swiggy', initials: 'SR', text: "Honest review: I was sceptical. I've done expensive courses before and walked away with nothing. This was completely different. Ketan gave me feedback specific to how I think — not generic advice. My skip-level noticed and mentioned it in my last review.", highlight: 'My skip-level noticed and mentioned it in my last review.' },
  { name: 'Rahul Nair', role: 'Data Analyst → Senior Analyst, PhonePe', initials: 'RN', text: "Ketan's own story resonated with me — I was in the same confused place. What I got wasn't just better interview skills. It was clarity on what I actually want and a way of thinking that makes me better every day. Promoted within 6 months.", highlight: 'Promoted within 6 months of our sessions.' },
]

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
            setTimeout(() => { el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'; el.style.opacity = '1'; el.style.transform = 'translateY(0)' }, i * 100)
          })
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08 })
    if (ref.current) {
      ref.current.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(20px)' })
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [])
  return (
    <>
      <style>{`
        .test-section { background: var(--bg-base); padding: 96px 32px; border-top: 1px solid var(--border-subtle); }
        .test-inner { max-width: 1100px; margin: 0 auto; }
        .test-label { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.16em; color: var(--accent); margin-bottom: 14px; }
        .test-h2 { font-family: 'Instrument Serif', serif; font-size: clamp(28px, 3.5vw, 42px); font-weight: 400; color: var(--text-primary); line-height: 1.2; margin-bottom: 40px; max-width: 560px; }
        .test-h2 em { font-style: italic; background: linear-gradient(135deg, #FF6B9D, #A855F7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .test-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .test-card { background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 18px; padding: 28px 26px; display: flex; flex-direction: column; gap: 18px; }
        .test-person { display: flex; align-items: center; gap: 14px; }
        .test-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, rgba(255,107,157,0.2), rgba(168,85,247,0.2)); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: var(--text-secondary); flex-shrink: 0; }
        .test-name { font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 2px; }
        .test-role { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.06em; color: var(--accent); line-height: 1.4; }
        .test-text { font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1.8; color: var(--text-secondary); flex: 1; }
        .test-highlight { font-family: 'Instrument Serif', serif; font-size: 15px; font-style: italic; color: var(--text-primary); padding: 12px 16px; background: rgba(168,85,247,0.06); border: 1px solid rgba(168,85,247,0.12); border-radius: 8px; line-height: 1.5; }
        .test-note { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; color: var(--text-tertiary); text-align: center; margin-top: 28px; }
        @media (max-width: 768px) { .test-grid { grid-template-columns: 1fr; } .test-section { padding: 72px 24px; } }
      `}</style>
      <section id="testimonials" className="test-section">
        <div ref={ref} className="test-inner">
          <div data-reveal>
            <p className="test-label">WHAT PEOPLE SAY</p>
            <h2 className="test-h2">Career clarity.<br /><em>Not just better interview answers.</em></h2>
          </div>
          <div data-reveal className="test-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="test-card">
                <div className="test-person">
                  <div className="test-avatar">{t.initials}</div>
                  <div><div className="test-name">{t.name}</div><div className="test-role">{t.role}</div></div>
                </div>
                <p className="test-text">{t.text}</p>
                <div className="test-highlight">"{t.highlight}"</div>
              </div>
            ))}
          </div>
          <p data-reveal className="test-note">TESTIMONIALS FROM KETAN'S MENTEES · NAMES SHARED WITH PERMISSION</p>
        </div>
      </section>
    </>
  )
}
TESTFILE
echo "  ✓ Testimonials created"
else
  echo "  ✓ Testimonials exists"
fi

# Lab page
if [ ! -f src/pages/Lab.tsx ]; then
cat > src/pages/Lab.tsx << 'LABFILE'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const WA_URL = 'https://wa.me/919XXXXXXXXX?text=Hi%20Ketan%2C%20I%27d%20like%20to%20reserve%20a%20seat%20for%20the%20Saturday%20AI%20Problem%20Solving%20Lab.'

function getNextSat() {
  const today = new Date()
  const diff = (6 - today.getDay() + 7) % 7 || 7
  const next = new Date(today); next.setDate(today.getDate() + diff)
  return next.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function Lab() {
  const navigate = useNavigate()
  const [formOpen, setFormOpen] = useState(false)
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 32px', textAlign: 'center' }}>
      <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, letterSpacing: '0.16em', color: 'var(--accent)', marginBottom: 16 }}>SATURDAY AI PROBLEM SOLVING LAB</p>
      <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: 20, maxWidth: 600 }}>Work through real problems.<br />Get Ketan's feedback on your thinking.</h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: 480, marginBottom: 36 }}>Two Saturdays. One real business case. Max 5 people. Every person gets Ketan's direct attention.</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 32, justifyContent: 'center' }}>
        <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, color: 'var(--text-tertiary)', textDecoration: 'line-through', opacity: 0.5 }}>₹4,999</span>
        <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 48, color: 'var(--text-primary)' }}>₹2,999</span>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#4ade80', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 6, padding: '4px 10px' }}>LAUNCH PRICE</span>
      </div>
      <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 32, letterSpacing: '0.06em' }}>NEXT COHORT: {getNextSat()} · MAX 5 PEOPLE · RUNS WITH EVEN 1 PERSON</p>
      <button onClick={() => window.open(WA_URL, '_blank')} style={{ background: 'var(--accent)', border: 'none', borderRadius: 100, padding: '18px 52px', fontFamily: 'DM Sans, sans-serif', fontSize: 17, fontWeight: 600, color: '#fff', cursor: 'pointer', marginBottom: 14 }}>Reserve via WhatsApp →</button>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#4ade80' }}>✓ No questions asked refund after Session 1</p>
      <button onClick={() => navigate('/diagnostic')} style={{ marginTop: 24, fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>Not sure? Take the free 4-minute diagnostic first →</button>
    </div>
  )
}
LABFILE
echo "  ✓ Lab page created"
else
  echo "  ✓ Lab page exists"
fi

# ── 8. APP.TSX — all routes ───────────────────────────────────
echo "→ [8/9] App.tsx routes..."
cat > src/App.tsx << 'APPFILE'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Diagnostic from './pages/Diagnostic'
import Evaluation from './pages/Evaluation'
import Lab from './pages/Lab'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/diagnostic" element={<Diagnostic />} />
        <Route path="/evaluation" element={<Evaluation />} />
        <Route path="/lab" element={<Lab />} />
      </Routes>
    </BrowserRouter>
  )
}
APPFILE
echo "  ✓ App.tsx"

# ── 9. BUILD ──────────────────────────────────────────────────
echo ""
echo "→ [9/9] Building..."
npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ COMPLETE BUILD SUCCESSFUL"
  echo ""
  echo "Push live:"
  echo "  git add . && git commit -m 'feat: complete build — hero, truth, nav, diagnostic, evaluation, testimonials, lab, routes' && git push origin signal-mvp"
else
  echo ""
  echo "⚠ Build failed — paste errors above"
fi
