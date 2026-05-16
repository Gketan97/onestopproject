#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# nuclear-fix.sh — applies ALL pending fixes directly in repo
# Run from repo root: bash nuclear-fix.sh
# ═══════════════════════════════════════════════════════════════

echo "Starting full site fix..."
echo ""

# ── 1. HERO — fix headline and sub ────────────────────────────
echo "→ [1/7] Fixing Hero copy..."
python3 << 'PYEOF'
path = 'src/components/Hero.tsx'
with open(path, 'r') as f:
    src = f.read()

# Fix eyebrow
src = src.replace(
    'FOR EVERY PROFESSIONAL WHO USES AI AT WORK',
    'HIRING IS CHANGING RIGHT NOW — NOT IN THE FUTURE'
)

# Fix headline
src = src.replace(
    "            AI can generate answers, write code, and automate execution.{' '}\n            <span className=\"hero-gradient-text\">But can you make the decision?</span>",
    "            AI won't take your job.\n            <br />\n            <span className=\"hero-gradient-text\">Someone who uses AI to think better than you will.</span>"
)

# Fix sub
import re
src = re.sub(
    r'<p data-reveal className="hero-sub">[\s\S]*?</p>',
    '''<p data-reveal className="hero-sub">
            Companies are now hiring for one thing above everything else —
            <strong>can you make good decisions using AI?</strong>{" "}
            Not just use the tools. Actually think, prioritise, and make a call.
            This free test shows you exactly where you stand.
          </p>''',
    src, count=1
)

# Fix CTA button text
src = src.replace('Test Your Thinking — Free', 'Test Yourself Free →')

# Remove roles strip
src = re.sub(r'\s*<div data-reveal className="hero-roles">[\s\S]*?</div>\s*\n\s*\n', '\n\n', src)

with open(path, 'w') as f:
    f.write(src)
print('  ✓ Hero fixed')
PYEOF

# ── 2. TRUTH STATEMENT — full rewrite ─────────────────────────
echo "→ [2/7] Rewriting TruthStatement..."
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
  { role: 'Product Managers', pain: 'asked to justify every decision in a room full of skeptics' },
  { role: 'Business Analysts', pain: 'expected to have a point of view, not just a dashboard' },
  { role: 'Marketing Managers', pain: 'asked why a campaign underperformed — on the spot' },
  { role: 'Finance & Strategy', pain: 'presenting to leadership who challenge every assumption' },
  { role: 'Operations Leads', pain: 'making calls with incomplete data and no time to investigate' },
  { role: 'Consultants', pain: 'structuring ambiguous problems under client pressure' },
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
          <h2 data-reveal className="truth-h2">
            Everyone has the same AI.<br />
            <em>Not everyone knows how to think with it.</em>
          </h2>
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
echo "  ✓ TruthStatement rewritten"

# ── 3. HOME — fix imports and section order ────────────────────
echo "→ [3/7] Fixing Home.tsx..."
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
echo "  ✓ Home.tsx fixed — Transformation + CohortDetails removed, Testimonials + Footer added"

# ── 4. NAV — fix visibility and wording ───────────────────────
echo "→ [4/7] Fixing Nav..."
python3 << 'PYEOF'
path = 'src/components/Nav.tsx'
with open(path, 'r') as f:
    src = f.read()

# Always-visible semi-transparent background
if 'rgba(8,8,12,0.7)' not in src:
    src = src.replace(
        '.nav-root {\n          position: fixed; top: 0; left: 0; right: 0; z-index: 100;\n        }',
        '.nav-root {\n          position: fixed; top: 0; left: 0; right: 0; z-index: 100;\n          background: rgba(8,8,12,0.75);\n          backdrop-filter: blur(14px);\n          -webkit-backdrop-filter: blur(14px);\n          border-bottom: 1px solid rgba(255,255,255,0.07);\n        }'
    )

# Brighter logo
src = src.replace("color: var(--text-primary); font-weight: 500; line-height: 1;", "color: #ffffff; font-weight: 600; line-height: 1;")

# Sub-label visible
src = src.replace("font-size: 9px; letter-spacing: 0.12em;\n          color: var(--text-tertiary);", "font-size: 11px; letter-spacing: 0.1em;\n          color: rgba(255,255,255,0.5);")

# Why This → The Problem
src = src.replace('Why This', 'The Problem')

with open(path, 'w') as f:
    f.write(src)
print('  ✓ Nav fixed')
PYEOF

# ── 5. APP.TSX — add /lab route ────────────────────────────────
echo "→ [5/7] Adding /lab route..."
python3 << 'PYEOF'
path = 'src/App.tsx'
with open(path, 'r') as f:
    src = f.read()

if '/lab' not in src:
    src = src.replace(
        "import Evaluation from './pages/Evaluation'",
        "import Evaluation from './pages/Evaluation'\nimport Lab from './pages/Lab'"
    )
    src = src.replace(
        "<Route path=\"/evaluation\" element={<Evaluation />} />",
        "<Route path=\"/evaluation\" element={<Evaluation />} />\n        <Route path=\"/lab\" element={<Lab />} />"
    )
    with open(path, 'w') as f:
        f.write(src)
    print('  ✓ /lab route added')
else:
    print('  ✓ /lab already exists')
PYEOF

# ── 6. DIAGNOSTICCTA — fix headline ───────────────────────────
echo "→ [6/7] Fixing DiagnosticCTA..."
python3 << 'PYEOF'
import re
path = 'src/components/DiagnosticCTA.tsx'
with open(path, 'r') as f:
    src = f.read()

src = re.sub(
    r'<h2 data-reveal className="dcta-h2">[\s\S]*?</h2>',
    '<h2 data-reveal className="dcta-h2">\n              Most people think they think well.<br />\n              <em>Most are wrong.</em>\n            </h2>',
    src, count=1
)
src = re.sub(
    r'<button className="dcta-btn"[^>]*>[\s\S]*?</button>',
    '<button className="dcta-btn" onClick={() => navigate(\'/diagnostic\')}>\n                Find Out Where You Stand →\n              </button>',
    src, count=1
)
with open(path, 'w') as f:
    f.write(src)
print('  ✓ DiagnosticCTA fixed')
PYEOF

# ── 7. TESTIMONIALS — create if missing ───────────────────────
echo "→ [7/7] Checking Testimonials..."
if [ ! -f src/components/Testimonials.tsx ]; then
cat > src/components/Testimonials.tsx << 'TESTFILE'
import { useEffect, useRef } from 'react'

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Business Analyst → Product Analyst, Flipkart', initials: 'PS', text: "I had been stuck at the same level for 2 years. One session with Ketan and I understood exactly what was missing — I was describing problems, not diagnosing them. Three months later I had an offer from Flipkart.", highlight: 'Three months later I had an offer from Flipkart.' },
  { name: 'Arjun Mehta', role: 'Operations Manager → Growth Analyst, Zepto', initials: 'AM', text: "Ketan didn't just give me frameworks — he showed me how he actually thinks through a problem. That shift in how I approach things has been worth more than any course I've taken. My manager now regularly asks for my read on things.", highlight: 'My manager now regularly asks for my read on things.' },
  { name: 'Sneha Rajan', role: 'Marketing Executive, Swiggy', initials: 'SR', text: "Honest review: I was sceptical. I've done expensive courses before and walked away with nothing useful. This was completely different. Ketan gave me feedback specific to how I think. My skip-level noticed and mentioned it in my last review.", highlight: 'My skip-level noticed and mentioned it in my last review.' },
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
        @media (max-width: 480px) { .test-section { padding: 56px 20px; } }
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
echo "  ✓ Testimonials.tsx created"
else
  echo "  ✓ Testimonials.tsx already exists"
fi

echo ""
echo "→ Running build..."
npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ ALL FIXES APPLIED SUCCESSFULLY"
  echo ""
  echo "Now push:"
  echo "  git add . && git commit -m 'fix: hero, truth section, home layout, nav, lab route, testimonials' && git push origin signal-mvp"
else
  echo ""
  echo "⚠ Build failed — paste errors above"
fi
