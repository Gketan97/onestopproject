#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# apply-all-fixes.sh
# Patches Hero, TruthStatement, Nav directly in repo
# Run from repo root: bash apply-all-fixes.sh
# ═══════════════════════════════════════════════════════════════

echo "→ Patching Hero.tsx — removing roles strip..."
python3 << 'PYEOF'
import re
path = 'src/components/Hero.tsx'
with open(path, 'r') as f:
    src = f.read()

# Remove the roles strip entirely from Hero
src = re.sub(
    r'\s*<div data-reveal className="hero-roles">[\s\S]*?</div>\s*\n',
    '\n',
    src
)

# Remove hero-roles CSS
src = re.sub(r'\.hero-roles \{[^}]*\}\s*', '', src)
src = re.sub(r'\.hero-roles-label \{[^}]*\}\s*', '', src)
src = re.sub(r'\.hero-role \{[^}]*\}\s*', '', src)

with open(path, 'w') as f:
    f.write(src)
print('✓ Hero roles strip removed')
PYEOF

echo "→ Rewriting TruthStatement.tsx..."
cat > src/components/TruthStatement.tsx << 'COMPONENT'
import { useEffect, useRef } from 'react'

const COMPANIES = [
  'Flipkart', 'MakeMyTrip', 'Zomato', 'Nykaa', 'American Express',
  'JP Morgan', 'Meesho', 'Zepto', 'PhonePe', 'McKinsey',
  'Goldman Sachs', 'BCG', 'Meta', 'Swiggy', 'HDFC Bank',
  'Razorpay', 'CRED', 'Blinkit', 'Groww', 'Paytm',
]

export default function TruthStatement() {
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
      { threshold: 0.08 }
    )
    if (ref.current) {
      ref.current.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(24px)'
      })
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [])

  const roles = [
    { role: 'Product Managers', pain: 'asked to justify every decision in a room of skeptics' },
    { role: 'Business Analysts', pain: 'expected to have a point of view, not just a dashboard' },
    { role: 'Marketing Managers', pain: 'asked why a campaign underperformed — on the spot' },
    { role: 'Finance & Strategy', pain: 'presenting to leadership who challenge every assumption' },
    { role: 'Operations Leads', pain: 'making calls with incomplete data and no time to investigate' },
    { role: 'Consultants', pain: 'needing to structure ambiguous problems under client pressure' },
  ]

  return (
    <>
      <style>{`
        .truth-section {
          background: var(--bg-surface);
          border-top: 1px solid var(--border-subtle);
          padding: 96px 32px 0;
        }
        .truth-inner { max-width: 1060px; margin: 0 auto; }

        .truth-label {
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 0.16em; color: var(--accent); margin-bottom: 16px;
        }
        .truth-h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(28px, 3.5vw, 44px);
          line-height: 1.2; color: var(--text-primary);
          font-weight: 400; margin-bottom: 16px; max-width: 680px;
        }
        .truth-h2 em {
          font-style: italic;
          background: linear-gradient(135deg, #FF6B9D, #A855F7);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .truth-intro {
          font-family: 'DM Sans', sans-serif; font-size: 17px;
          line-height: 1.8; color: var(--text-secondary);
          max-width: 640px; margin-bottom: 56px;
        }
        .truth-intro strong { color: var(--text-primary); font-weight: 500; }

        /* Two col */
        .truth-cols {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 56px; margin-bottom: 72px; align-items: start;
        }

        /* Before/after */
        .truth-setup {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.12em; color: var(--text-tertiary);
          padding: 12px 16px; margin-bottom: 16px;
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 8px; line-height: 1.6;
        }
        .truth-setup strong { color: var(--text-secondary); }
        .truth-cards { display: flex; flex-direction: column; gap: 12px; }
        .truth-card { border-radius: 16px; padding: 24px 22px; border: 1px solid; }
        .truth-card.bad { background: rgba(239,68,68,0.04); border-color: rgba(239,68,68,0.15); }
        .truth-card.good { background: rgba(34,197,94,0.04); border-color: rgba(34,197,94,0.2); }
        .truth-card-label {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.14em; margin-bottom: 12px;
        }
        .truth-card-label.bad { color: #f87171; }
        .truth-card-label.good { color: #4ade80; }
        .truth-card-quote {
          font-family: 'Instrument Serif', serif; font-style: italic;
          font-size: 17px; color: var(--text-primary);
          line-height: 1.55; margin-bottom: 12px;
        }
        .truth-card-body {
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          line-height: 1.65; color: var(--text-secondary);
          padding-top: 12px; border-top: 1px solid var(--border-subtle);
        }
        .truth-card-body strong { color: var(--text-primary); font-weight: 500; }
        .truth-tagline {
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 0.08em; color: var(--text-tertiary);
          text-align: center; padding-top: 16px;
        }

        /* Who it's for */
        .truth-who-label {
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 0.16em; color: var(--accent); margin-bottom: 16px;
        }
        .truth-who-h3 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(20px, 2vw, 26px); font-weight: 400;
          color: var(--text-primary); line-height: 1.3; margin-bottom: 24px;
        }
        .truth-roles { display: flex; flex-direction: column; gap: 0; }
        .truth-role-row {
          display: flex; align-items: flex-start; gap: 16px;
          padding: 14px 0; border-bottom: 1px solid var(--border-subtle);
        }
        .truth-role-row:last-child { border-bottom: none; }
        .truth-role-name {
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          font-weight: 600; color: var(--text-primary);
          min-width: 180px; flex-shrink: 0;
        }
        .truth-role-pain {
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: var(--text-secondary); line-height: 1.55;
        }

        /* Ticker */
        .truth-ticker-wrap {
          overflow: hidden; padding: 28px 0;
          border-top: 1px solid var(--border-subtle);
          position: relative; margin-top: 0;
        }
        .truth-ticker-wrap::before,
        .truth-ticker-wrap::after {
          content: ''; position: absolute; top: 0; bottom: 0;
          width: 140px; z-index: 2; pointer-events: none;
        }
        .truth-ticker-wrap::before { left: 0; background: linear-gradient(to right, var(--bg-surface), transparent); }
        .truth-ticker-wrap::after { right: 0; background: linear-gradient(to left, var(--bg-surface), transparent); }
        .truth-ticker-label {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.14em; color: var(--text-tertiary);
          text-align: center; margin-bottom: 18px;
        }
        .truth-ticker {
          display: flex; animation: ticker-scroll 30s linear infinite;
          width: max-content;
        }
        .truth-ticker:hover { animation-play-state: paused; }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .truth-ticker-item {
          display: flex; align-items: center; gap: 10px;
          padding: 0 32px; white-space: nowrap;
        }
        .truth-ticker-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: rgba(168,85,247,0.4); flex-shrink: 0;
        }
        .truth-ticker-name {
          font-family: 'DM Mono', monospace; font-size: 13px;
          letter-spacing: 0.08em; color: var(--text-secondary); font-weight: 500;
        }

        @media (max-width: 860px) {
          .truth-cols { grid-template-columns: 1fr; gap: 40px; }
          .truth-section { padding: 72px 24px 0; }
          .truth-role-name { min-width: 140px; }
        }
        @media (max-width: 480px) {
          .truth-section { padding: 56px 20px 0; }
          .truth-role-row { flex-direction: column; gap: 4px; }
          .truth-role-name { min-width: unset; }
        }
      `}</style>

      <section id="truth" className="truth-section">
        <div ref={ref} className="truth-inner">

          <p data-reveal className="truth-label">WHAT IS ACTUALLY CHANGING</p>
          <h2 data-reveal className="truth-h2">
            Everyone has the same AI.<br />
            <em>Not everyone knows how to think with it.</em>
          </h2>
          <p data-reveal className="truth-intro">
            The playing field for tools is flat. What is not flat is the quality of thinking
            you bring to them. <strong>AI amplifies whatever thinking you already have</strong> —
            shallow thinking gets you more shallow output, faster.
            Structured thinking gives you an unfair advantage.
          </p>

          <div data-reveal className="truth-cols">
            <div>
              <div className="truth-setup">
                <strong>THE MOMENT THAT HAPPENS TO EVERYONE:</strong><br />
                Your manager turns to you in a meeting and asks —<br />
                "So what do you think we should do about this?"
              </div>
              <div className="truth-cards">
                <div className="truth-card bad">
                  <div className="truth-card-label bad">✕ WHAT MOST PEOPLE SAY</div>
                  <div className="truth-card-quote">
                    "There are a few options we could consider. We probably need more data before we can decide."
                  </div>
                  <div className="truth-card-body">
                    Safe. Noncommittal. Sounds reasonable — but gives the room nothing.
                    <strong> This is what keeps you out of the rooms where decisions are made.</strong>
                  </div>
                </div>
                <div className="truth-card good">
                  <div className="truth-card-label good">✓ WHAT SHARP THINKERS SAY</div>
                  <div className="truth-card-quote">
                    "I'd go with X. Here's the reason — and here's the one signal that would tell me if I'm wrong."
                  </div>
                  <div className="truth-card-body">
                    A clear position. A reason. A way to verify it.
                    <strong> This is what gets you trusted with decisions that actually matter.</strong>
                  </div>
                </div>
              </div>
              <p className="truth-tagline">This gap is learnable. The lab exists to close it.</p>
            </div>

            <div>
              <p className="truth-who-label">WHO THIS IS FOR</p>
              <h3 className="truth-who-h3">
                If you have ever been put on the spot and felt the gap — this is for you.
              </h3>
              <div className="truth-roles">
                {roles.map((r, i) => (
                  <div key={i} className="truth-role-row">
                    <span className="truth-role-name">{r.role}</span>
                    <span className="truth-role-pain">{r.pain}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className="truth-ticker-wrap">
          <p className="truth-ticker-label">PROFESSIONALS FROM THESE COMPANIES ARE BUILDING THIS SKILL</p>
          <div className="truth-ticker">
            {[...COMPANIES, ...COMPANIES].map((c, i) => (
              <div key={i} className="truth-ticker-item">
                <span className="truth-ticker-dot" />
                <span className="truth-ticker-name">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
COMPONENT
echo "  ✓ TruthStatement.tsx rewritten"

echo "→ Fixing Nav visibility..."
python3 << 'PYEOF'
path = 'src/components/Nav.tsx'
with open(path, 'r') as f:
    src = f.read()

# Make nav always have semi-transparent background so logo is always visible
src = src.replace(
    '.nav-root {\n          position: fixed; top: 0; left: 0; right: 0; z-index: 100;\n          transition: background 300ms ease, border-color 300ms ease, backdrop-filter 300ms ease;\n        }',
    '.nav-root {\n          position: fixed; top: 0; left: 0; right: 0; z-index: 100;\n          background: rgba(8,8,12,0.7);\n          backdrop-filter: blur(12px);\n          -webkit-backdrop-filter: blur(12px);\n          border-bottom: 1px solid rgba(255,255,255,0.07);\n          transition: background 300ms ease, border-color 300ms ease;\n        }'
)

# Make brand name always white
src = src.replace(
    '.nav-brand-name {\n          font-family: \'DM Mono\', monospace;\n          font-size: 14px; letter-spacing: 0.14em;\n          color: var(--text-primary); font-weight: 500; line-height: 1;\n        }',
    '.nav-brand-name {\n          font-family: \'DM Mono\', monospace;\n          font-size: 16px; letter-spacing: 0.1em;\n          color: #ffffff; font-weight: 600; line-height: 1;\n        }'
)

# Make sub label more visible
src = src.replace(
    '.nav-brand-sub {\n          font-family: \'DM Mono\', monospace;\n          font-size: 9px; letter-spacing: 0.12em;\n          color: var(--text-tertiary);\n        }',
    '.nav-brand-sub {\n          font-family: \'DM Mono\', monospace;\n          font-size: 11px; letter-spacing: 0.1em;\n          color: rgba(255,255,255,0.5);\n        }'
)

# Change Why This to The Problem
src = src.replace(
    "<button className=\"nav-link\" onClick={() => scrollTo('truth')}>Why This</button>",
    "<button className=\"nav-link\" onClick={() => scrollTo('truth')}>The Problem</button>"
)
src = src.replace(
    "<button className=\"nav-mobile-link\" onClick={() => scrollTo('truth')}>Why This</button>",
    "<button className=\"nav-mobile-link\" onClick={() => scrollTo('truth')}>The Problem</button>"
)

with open(path, 'w') as f:
    f.write(src)
print('  ✓ Nav visibility fixed, Why This → The Problem')
PYEOF

echo "→ Adding Footer to Home.tsx..."
python3 << 'PYEOF'
path = 'src/pages/Home.tsx'
with open(path, 'r') as f:
    src = f.read()

if 'Footer' not in src:
    src = src.replace(
        "import FAQ from '../components/FAQ'",
        "import FAQ from '../components/FAQ'\nimport Footer from '../components/Footer'"
    )
    src = src.replace(
        '      <FAQ />\n    </main>',
        '      <FAQ />\n      <Footer />\n    </main>'
    )
    with open(path, 'w') as f:
        f.write(src)
    print('  ✓ Footer added to Home.tsx')
else:
    print('  ✓ Footer already in Home.tsx')
PYEOF

echo "→ Creating Footer.tsx if missing..."
if [ ! -f src/components/Footer.tsx ]; then
cat > src/components/Footer.tsx << 'FOOTER'
import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()
  const year = new Date().getFullYear()
  return (
    <>
      <style>{`
        .footer { background: var(--bg-base); border-top: 1px solid var(--border-subtle); padding: 48px 32px 32px; }
        .footer-inner { max-width: 1100px; margin: 0 auto; }
        .footer-top { display: grid; grid-template-columns: 1fr auto auto auto; gap: 48px; margin-bottom: 40px; padding-bottom: 40px; border-bottom: 1px solid var(--border-subtle); }
        .footer-logo { font-family: 'DM Mono', monospace; font-size: 15px; letter-spacing: 0.1em; color: var(--text-primary); font-weight: 500; cursor: pointer; display: block; margin-bottom: 8px; }
        .footer-logo span { background: linear-gradient(135deg, #FF6B9D, #A855F7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .footer-tagline { font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text-tertiary); line-height: 1.6; max-width: 240px; }
        .footer-col-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.14em; color: var(--text-tertiary); margin-bottom: 14px; }
        .footer-links { display: flex; flex-direction: column; gap: 10px; }
        .footer-link { font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--text-secondary); background: none; border: none; cursor: pointer; padding: 0; text-align: left; transition: color 150ms; text-decoration: none; display: block; }
        .footer-link:hover { color: var(--text-primary); }
        .footer-bottom { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .footer-copy { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.06em; color: var(--text-tertiary); }
        .footer-legal { display: flex; gap: 24px; }
        .footer-legal-link { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.06em; color: var(--text-tertiary); background: none; border: none; cursor: pointer; padding: 0; transition: color 150ms; text-decoration: none; }
        .footer-legal-link:hover { color: var(--text-secondary); }
        .footer-refund { font-family: 'DM Sans', sans-serif; font-size: 13px; color: #4ade80; }
        .footer-refund-note { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--text-tertiary); margin-top: 6px; line-height: 1.6; }
        @media (max-width: 768px) { .footer-top { grid-template-columns: 1fr 1fr; gap: 32px; } .footer { padding: 40px 24px 28px; } }
        @media (max-width: 480px) { .footer-top { grid-template-columns: 1fr; gap: 24px; } .footer-bottom { flex-direction: column; align-items: flex-start; } }
      `}</style>
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <span className="footer-logo" onClick={() => navigate('/')}>onestop<span>careers</span></span>
              <p className="footer-tagline">AI Problem Solving Lab. Built for professionals who want to think better — not just use better tools.</p>
            </div>
            <div>
              <p className="footer-col-label">NAVIGATE</p>
              <div className="footer-links">
                <button className="footer-link" onClick={() => navigate('/')}>Home</button>
                <button className="footer-link" onClick={() => navigate('/lab')}>The Lab</button>
                <button className="footer-link" onClick={() => navigate('/diagnostic')}>Free Diagnostic</button>
              </div>
            </div>
            <div>
              <p className="footer-col-label">ABOUT</p>
              <div className="footer-links">
                <a className="footer-link" href="https://linkedin.com/in/ketangoel" target="_blank" rel="noopener noreferrer">Ketan on LinkedIn</a>
                <a className="footer-link" href="https://topmate.io/ketangoel" target="_blank" rel="noopener noreferrer">Topmate Sessions</a>
              </div>
            </div>
            <div>
              <p className="footer-col-label">GUARANTEE</p>
              <p className="footer-refund">✓ No questions asked refund</p>
              <p className="footer-refund-note">Not satisfied after Session 1?<br />Full refund. No conditions.</p>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© {year} onestopcareers. All rights reserved.</span>
            <div className="footer-legal">
              <button className="footer-legal-link" onClick={() => alert('Terms — Coming soon')}>Terms of Service</button>
              <button className="footer-legal-link" onClick={() => alert('Privacy — Coming soon')}>Privacy Policy</button>
              <a className="footer-legal-link" href="mailto:ketan@onestopcareers.in">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
FOOTER
echo "  ✓ Footer.tsx created"
else
  echo "  ✓ Footer.tsx already exists"
fi

echo ""
echo "→ Running build..."
npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ All fixes applied. Now push:"
  echo "   git add . && git commit -m 'fix: truth section, nav, ticker, footer' && git push origin signal-mvp"
else
  echo "⚠ Build failed — check errors above"
fi
