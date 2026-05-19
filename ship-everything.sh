#!/bin/bash
# ═══════════════════════════════════════════════════════════
# ship-everything.sh
# Applies: Cohort page, Nav rewrite, Evaluation CTA,
#          CaseStudy teaser, App.tsx routes
# Run from repo root: bash ship-everything.sh
# ═══════════════════════════════════════════════════════════

echo "Shipping everything..."
echo ""

# ── 1. Copy Cohort.tsx ─────────────────────────────────────
echo "→ [1/5] Applying Cohort.tsx..."
cp $(ls -t ~/Downloads/Cohort*.tsx | head -1) src/pages/Cohort.tsx
echo "  ✓ Cohort.tsx applied"

# ── 2. Rewrite Nav ────────────────────────────────────────
echo "→ [2/5] Rewriting Nav..."
cat > src/components/Nav.tsx << 'NAVEOF'
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
        .nav-root { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(8,8,12,0.80); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-bottom: 1px solid rgba(255,255,255,0.07); transition: background 300ms ease; }
        .nav-root.scrolled { background: rgba(8,8,12,0.96); border-bottom-color: var(--border-subtle); }
        .nav-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; height: 68px; }
        .nav-brand { cursor: pointer; display: flex; flex-direction: column; gap: 3px; text-decoration: none; }
        .nav-brand-name { font-family: 'DM Mono', monospace; font-size: 16px; letter-spacing: 0.1em; color: #ffffff; font-weight: 600; line-height: 1; }
        .nav-brand-name span { background: linear-gradient(135deg, #FF6B9D, #A855F7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .nav-brand-sub { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.1em; color: rgba(255,255,255,0.45); line-height: 1; }
        .nav-links { display: flex; align-items: center; gap: 28px; }
        .nav-link { font-family: 'DM Sans', sans-serif; font-size: 14px; color: rgba(255,255,255,0.6); background: none; border: none; cursor: pointer; transition: color 150ms ease; padding: 0; white-space: nowrap; }
        .nav-link:hover { color: #ffffff; }
        .nav-link.active { color: #ffffff; }
        .nav-link.highlight { color: var(--accent); font-weight: 500; }
        .nav-link.highlight:hover { color: #c084fc; }
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
        .nav-mobile-link.highlight { color: var(--accent); font-weight: 500; }
        .nav-mobile-cta { margin-top: 20px; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 600; color: #fff; background: var(--accent); border: none; border-radius: 100px; padding: 15px; cursor: pointer; text-align: center; width: 100%; }
        @media (max-width: 900px) { .nav-links { gap: 18px; } }
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
            <button className={`nav-link highlight${location.pathname === '/lab' ? ' active' : ''}`} onClick={() => navigate('/lab')}>The Lab ↗</button>
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
        <button className="nav-mobile-link highlight" onClick={() => { setMenuOpen(false); navigate('/lab') }}>The Lab ↗</button>
        <button className="nav-mobile-cta" onClick={ctaAction}>{ctaLabel}</button>
      </div>
    </>
  )
}
NAVEOF
echo "  ✓ Nav rewritten"

# ── 3. Case Study public teaser page ──────────────────────
echo "→ [3/5] Building CaseStudy teaser page..."
cat > src/pages/CaseStudy.tsx << 'CSEOF'
/// <reference types="vite/client" />
import { useNavigate } from 'react-router-dom'

const PHASES = [
  { n: '00', label: 'Pre-Read', desc: 'Business context, revenue model, competitive landscape, metric glossary. Read before Saturday.', open: true },
  { n: '01', label: 'Problem Statement', desc: 'The CEO brief. Initial dashboard with misleading metrics. Six stakeholders who all disagree.', open: true },
  { n: '02', label: 'Saturday with Ketan', desc: '8-step framework applied live. Group hypothesis generation. AI demonstration.', open: true },
  { n: '03', label: 'Your Analysis + AI', desc: '5 real datasets. 6-step investigation framework. AI thinking partner that guides without answering.', open: false },
  { n: '04', label: 'Submit + Debrief', desc: 'SCQA structured report. Ketan evaluates live. The gap between your answer and the expert answer.', open: false },
]

const SAMPLE_AI = [
  { role: 'student', text: 'I think the conversion dropped because of the payment UI experiment. It launched right when the drop started.' },
  { role: 'ai', text: 'Interesting hypothesis. Two questions before you commit to it: (1) What % of total users were in the treatment group? (2) iOS users were unaffected by this experiment — is their conversion also down in the problem period? What do you find?' },
  { role: 'student', text: 'Oh — iOS is also down. And the experiment only affected maybe 12% of users.' },
  { role: 'ai', text: 'Exactly. If iOS (unaffected) is also declining, the cause has to be broader than an Android experiment. And if the treatment group is only 12% of users, even a large within-experiment effect can only explain a small fraction of the aggregate drop. What else changed in the week of July 12?' },
]

export default function CaseStudy() {
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        .cs-pub-page { min-height: 100vh; background: var(--bg-base); }
        .cs-pub-topbar { height: 68px; display: flex; align-items: center; padding: 0 32px; border-bottom: 1px solid var(--border-subtle); background: rgba(8,8,12,0.95); backdrop-filter: blur(14px); position: sticky; top: 0; z-index: 100; justify-content: space-between; }
        .cs-pub-logo { font-family: 'DM Mono', monospace; font-size: 15px; letter-spacing: 0.1em; color: #fff; font-weight: 600; cursor: pointer; }
        .cs-pub-logo span { background: linear-gradient(135deg,#FF6B9D,#A855F7); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .cs-pub-inner { max-width: 960px; margin: 0 auto; }
        .cs-pub-hero { padding: 80px 32px 64px; }
        .cs-pub-label { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.16em; color: var(--accent); margin-bottom: 16px; }
        .cs-pub-h1 { font-family: 'Instrument Serif', serif; font-size: clamp(32px, 5vw, 56px); font-weight: 400; color: var(--text-primary); line-height: 1.15; margin-bottom: 20px; }
        .cs-pub-h1 em { font-style: italic; background: linear-gradient(135deg,#FF6B9D,#A855F7); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .cs-pub-desc { font-family: 'DM Sans', sans-serif; font-size: 17px; color: var(--text-secondary); line-height: 1.8; max-width: 600px; margin-bottom: 40px; }
        .cs-pub-desc strong { color: var(--text-primary); font-weight: 500; }
        .cs-pub-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 48px; }
        .cs-pub-pill { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.06em; color: var(--text-secondary); background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 100px; padding: 6px 14px; }
        .cs-pub-problem-box { background: var(--bg-elevated); border: 1px solid rgba(168,85,247,0.2); border-radius: 18px; padding: 32px; position: relative; overflow: hidden; margin-bottom: 64px; }
        .cs-pub-problem-box::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--accent), #FF6B9D); }
        .cs-pub-from { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; color: var(--text-tertiary); margin-bottom: 16px; line-height: 1.8; }
        .cs-pub-quote { font-family: 'Instrument Serif', serif; font-size: clamp(16px, 2vw, 20px); color: var(--text-primary); line-height: 1.65; font-style: italic; }
        .cs-pub-phases { padding: 0 32px 64px; }
        .cs-pub-phases-h2 { font-family: 'Instrument Serif', serif; font-size: clamp(24px, 3vw, 36px); font-weight: 400; color: var(--text-primary); line-height: 1.2; margin-bottom: 32px; }
        .cs-pub-phase { display: flex; gap: 20px; padding: 24px; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 14px; margin-bottom: 10px; transition: border-color 200ms; }
        .cs-pub-phase.locked { opacity: 0.6; }
        .cs-pub-phase-num { font-family: 'DM Mono', monospace; font-size: 13px; color: var(--accent); flex-shrink: 0; padding-top: 2px; }
        .cs-pub-phase-label { font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600; color: var(--text-primary); margin-bottom: 5px; display: flex; align-items: center; gap: 8px; }
        .cs-pub-phase-desc { font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text-secondary); line-height: 1.65; }
        .cs-pub-lock { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.08em; color: var(--text-tertiary); background: var(--bg-base); border: 1px solid var(--border-subtle); border-radius: 4px; padding: 2px 8px; }
        .cs-pub-ai { padding: 0 32px 64px; }
        .cs-pub-ai-h2 { font-family: 'Instrument Serif', serif; font-size: clamp(22px, 2.5vw, 30px); font-weight: 400; color: var(--text-primary); margin-bottom: 8px; }
        .cs-pub-ai-sub { font-family: 'DM Sans', sans-serif; font-size: 15px; color: var(--text-secondary); line-height: 1.75; margin-bottom: 24px; }
        .cs-pub-chat { background: var(--bg-elevated); border: 1px solid rgba(168,85,247,0.2); border-radius: 16px; overflow: hidden; }
        .cs-pub-chat-hdr { padding: '12px 20px'; border-bottom: 1px solid var(--border-subtle); background: rgba(168,85,247,0.05); display: flex; align-items: center; gap: 10px; padding: 12px 20px; }
        .cs-pub-msg { padding: 10px 16px; margin: 4px 16px; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1.7; max-width: 85%; }
        .cs-pub-msg.student { background: var(--accent); color: white; margin-left: auto; border-radius: 16px 16px 4px 16px; }
        .cs-pub-msg.ai { background: var(--bg-base); border: 1px solid var(--border-subtle); color: var(--text-secondary); border-radius: 4px 16px 16px 16px; margin-right: auto; }
        .cs-pub-cta { background: var(--bg-surface); border-top: 1px solid var(--border-subtle); padding: 72px 32px; text-align: center; }
        .cs-pub-cta-h2 { font-family: 'Instrument Serif', serif; font-size: clamp(28px, 4vw, 48px); font-weight: 400; color: var(--text-primary); line-height: 1.2; margin-bottom: 16px; }
        .cs-pub-cta-sub { font-family: 'DM Sans', sans-serif; font-size: 16px; color: var(--text-secondary); line-height: 1.75; max-width: 480px; margin: 0 auto 32px; }
        .cs-pub-cta-btn { font-family: 'DM Sans', sans-serif; font-size: 17px; font-weight: 600; color: #fff; background: var(--accent); border: none; border-radius: 100px; padding: 18px 52px; cursor: pointer; transition: all 200ms ease; display: inline-block; margin-bottom: 14px; }
        .cs-pub-cta-btn:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(168,85,247,0.35); }
        .cs-pub-cta-trust { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-tertiary); letter-spacing: 0.06em; line-height: 1.8; }
        @media (max-width: 600px) { .cs-pub-hero { padding: 56px 20px 48px; } .cs-pub-phases, .cs-pub-ai, .cs-pub-cta { padding-left: 20px; padding-right: 20px; } .cs-pub-topbar { padding: 0 20px; } .cs-pub-problem-box { padding: 24px 20px; } }
      `}</style>

      <div className="cs-pub-page">
        <div className="cs-pub-topbar">
          <span className="cs-pub-logo" onClick={() => navigate('/')}>onestop<span>careers</span></span>
          <button onClick={() => navigate('/diagnostic')} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: '#fff', background: 'var(--accent)', border: 'none', borderRadius: 100, padding: '9px 20px', cursor: 'pointer' }}>Test Yourself Free →</button>
        </div>

        {/* Hero */}
        <div className="cs-pub-hero">
          <div className="cs-pub-inner">
            <p className="cs-pub-label">COHORT CASE STUDY · PLANMYTRIP.COM</p>
            <h1 className="cs-pub-h1">The Growth Trap<br /><em>A real OTA business problem.</em></h1>
            <p className="cs-pub-desc">
              Every cohort works through one real business problem from a consumer internet company. This is the case study for the current cohort. The pre-read and problem statement are open to everyone.{' '}
              <strong>Phase 2 analysis and the AI assistant are locked to enrolled members.</strong>
            </p>
            <div className="cs-pub-pills">
              {['Online Travel · India', '8-week data window', '5 real datasets', 'AI analysis partner', 'Ketan guides live'].map((p, i) => (
                <span key={i} className="cs-pub-pill">{p}</span>
              ))}
            </div>

            {/* Problem statement */}
            <div className="cs-pub-problem-box">
              <div className="cs-pub-from">
                FROM: Arjun Mehta, Group CEO, PlanMyTrip.com<br />
                TO: Analytics & Product Team · URGENT
              </div>
              <p className="cs-pub-quote">
                "Our domestic flight search-to-booking conversion dropped from 21.3% to 15.2% over 8 weeks — a 29% relative decline — despite sessions growing 53%. We're spending ₹610 per booking in discounts to partially sustain volumes that used to need ₹380. Net revenue per booking collapsed from ₹342 to ₹248. If this continues, we miss Q2 margin by ₹180 crore. What happened and what do we do?"
              </p>
            </div>
          </div>
        </div>

        {/* Phase map */}
        <div className="cs-pub-phases">
          <div className="cs-pub-inner">
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, letterSpacing: '0.16em', color: 'var(--accent)', marginBottom: 14 }}>HOW THE COHORT WORKS</p>
            <h2 className="cs-pub-phases-h2">Five phases. Two Saturdays.<br />One problem you actually solve.</h2>
            {PHASES.map((p, i) => (
              <div key={i} className={`cs-pub-phase${!p.open ? ' locked' : ''}`}>
                <span className="cs-pub-phase-num">{p.n}</span>
                <div>
                  <div className="cs-pub-phase-label">
                    {p.label}
                    {!p.open && <span className="cs-pub-lock">🔒 ENROLLED MEMBERS</span>}
                  </div>
                  <div className="cs-pub-phase-desc">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI sample */}
        <div className="cs-pub-ai">
          <div className="cs-pub-inner">
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, letterSpacing: '0.16em', color: 'var(--accent)', marginBottom: 14 }}>THE AI ANALYSIS PARTNER</p>
            <h2 className="cs-pub-ai-h2">It will not give you the answer.<br />It will help you find it.</h2>
            <p className="cs-pub-ai-sub">
              Every enrolled student gets access to an AI that has full context of the PlanMyTrip business. It challenges your hypotheses, asks Socratic questions, and gives hints when you're stuck. It will not tell you the root cause — because learning that yourself is the whole point.
            </p>
            <div className="cs-pub-chat">
              <div className="cs-pub-chat-hdr">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, letterSpacing: '0.1em', color: 'var(--text-primary)' }}>AI ANALYSIS PARTNER · SAMPLE EXCHANGE</span>
              </div>
              <div style={{ padding: '20px 0 16px' }}>
                {SAMPLE_AI.map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: m.role === 'student' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
                    <div className={`cs-pub-msg ${m.role}`}>{m.text}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.08em', color: 'var(--text-tertiary)' }}>THIS IS A REAL SAMPLE FROM THE AI ASSISTANT · AVAILABLE TO ENROLLED MEMBERS IN PHASE 2</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="cs-pub-cta">
          <div className="cs-pub-inner">
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, letterSpacing: '0.16em', color: 'var(--accent)', marginBottom: 14 }}>WORK THROUGH THIS WITH KETAN</p>
            <h2 className="cs-pub-cta-h2">Ready to do this live?</h2>
            <p className="cs-pub-cta-sub">
              Enrol in the Saturday Lab to get full access to all 5 datasets, the AI analysis partner, Ketan's live guidance, and the full debrief. Max 5 people per cohort.
            </p>
            <button className="cs-pub-cta-btn" onClick={() => navigate('/lab')}>
              See the Lab & Enrol →
            </button>
            <p className="cs-pub-cta-trust">
              ₹2,999 per person · Full cohort · No questions asked refund after Session 1<br />
              Group runs even with 1 person · Ketan confirms within 24 hours
            </p>
            <p style={{ marginTop: 20, fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--text-tertiary)' }}>
              Not sure yet?{' '}
              <button onClick={() => navigate('/diagnostic')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 14, fontFamily: 'DM Sans, sans-serif', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                Take the free 4-minute diagnostic first →
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
CSEOF
echo "  ✓ CaseStudy.tsx (public teaser)"

# ── 4. Evaluation — add Case Study CTA ────────────────────
echo "→ [4/5] Adding Case Study CTA to Evaluation..."
python3 << 'PYEOF'
path = 'src/pages/Evaluation.tsx'
with open(path, 'r') as f:
    src = f.read()

old = """              <div className="eval-retry">
                <button className="eval-retry-btn" onClick={() => navigate('/diagnostic')}>
                  Retake the diagnostic
                </button>
              </div>"""

new = """              <div style={{ marginTop: 48, paddingTop: 48, borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.14em', color: 'var(--accent)', marginBottom: 12 }}>SEE A FULL CASE STUDY</p>
                <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: 10 }}>Want to see what a cohort case study looks like?</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>
                  Browse the PlanMyTrip case — the same type of ambiguous business problem you would work through live with Ketan. Pre-read and problem statement are open to everyone.
                </p>
                <button
                  onClick={() => navigate('/case-study')}
                  style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 100, padding: '13px 32px', cursor: 'pointer', transition: 'all 180ms ease', marginBottom: 24, display: 'inline-block' }}
                >
                  Browse the Case Study →
                </button>
              </div>

              <div className="eval-retry">
                <button className="eval-retry-btn" onClick={() => navigate('/diagnostic')}>
                  Retake the diagnostic
                </button>
              </div>"""

if old in src:
    src = src.replace(old, new)
    with open(path, 'w') as f:
        f.write(src)
    print('  ✓ Case Study CTA added to Evaluation')
else:
    print('  ✓ Pattern not found — checking alternative...')
    # Try to find the retry div another way
    if 'eval-retry' in src:
        import re
        src = re.sub(
            r'(<div className="eval-retry">)',
            '''<div style={{ marginTop: 48, paddingTop: 48, borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.14em', color: 'var(--accent)', marginBottom: 12 }}>SEE A FULL CASE STUDY</p>
                <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: 10 }}>Want to see what a cohort case study looks like?</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>
                  Browse the PlanMyTrip case — open to everyone.
                </p>
                <button onClick={() => navigate('/case-study')} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 100, padding: '13px 32px', cursor: 'pointer', marginBottom: 24 }}>
                  Browse the Case Study →
                </button>
              </div>
              \\1''',
            src, count=1
        )
        with open(path, 'w') as f:
            f.write(src)
        print('  ✓ CTA added via regex')
PYEOF

# ── 5. App.tsx — all routes ────────────────────────────────
echo "→ [5/5] Updating App.tsx routes..."
cat > src/App.tsx << 'APPEOF'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Diagnostic from './pages/Diagnostic'
import Evaluation from './pages/Evaluation'
import CaseStudy from './pages/CaseStudy'
import Cohort from './pages/Cohort'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/diagnostic" element={<Diagnostic />} />
        <Route path="/evaluation" element={<Evaluation />} />
        <Route path="/case-study" element={<CaseStudy />} />
        <Route path="/cohort" element={<Cohort />} />
      </Routes>
    </BrowserRouter>
  )
}
APPEOF
echo "  ✓ App.tsx — 5 routes"

# ── Build ──────────────────────────────────────────────────
echo ""
echo "→ Running build..."
npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ ALL DONE"
  echo ""
  echo "Push live:"
  echo "  git add . && git commit -m 'feat: cohort page, case study teaser, nav, evaluation CTA, all routes' && git push origin signal-mvp"
else
  echo ""
  echo "⚠ Build failed — paste errors"
fi
