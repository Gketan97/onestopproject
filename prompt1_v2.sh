#!/bin/bash

# SIGNAL — Prompt 1 v2 (pink-purple gradient + full responsiveness)
# Place in project root and run:
# chmod +x prompt1_v2.sh && ./prompt1_v2.sh

echo "🚀 Setting up Signal — Prompt 1 v2..."

mkdir -p src/styles src/components src/pages

# ── src/styles/globals.css ───────────────────────────────────
cat > src/styles/globals.css << 'EOF'
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@400;500&display=swap');

:root {
  --bg-base: #080808;
  --bg-surface: #101010;
  --bg-elevated: #181818;
  --bg-glass: rgba(255,255,255,0.04);
  --text-primary: #F5F3EE;
  --text-secondary: #8A8880;
  --text-tertiary: #4A4845;
  --accent: #E8622A;
  --accent-soft: rgba(232,98,42,0.12);
  --accent-border: rgba(232,98,42,0.30);
  --grad-start: #FF6B9D;
  --grad-end: #A855F7;
  --green: #22C55E;
  --red: #EF4444;
  --amber: #F59E0B;
  --border-subtle: rgba(255,255,255,0.06);
  --border-default: rgba(255,255,255,0.10);
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html { scroll-behavior: smooth; }

body {
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg-base); }
::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }
::selection { background: rgba(168,85,247,0.2); color: var(--text-primary); }
EOF

# ── tailwind.config.cjs ──────────────────────────────────────
cat > tailwind.config.cjs << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-base':        'var(--bg-base)',
        'bg-surface':     'var(--bg-surface)',
        'bg-elevated':    'var(--bg-elevated)',
        'accent':         'var(--accent)',
        'text-primary':   'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary':  'var(--text-tertiary)',
        'border-subtle':  'var(--border-subtle)',
        'border-default': 'var(--border-default)',
      },
      fontFamily: {
        display: ['Instrument Serif', 'serif'],
        mono:    ['DM Mono', 'monospace'],
        sans:    ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
EOF

# ── src/main.tsx ─────────────────────────────────────────────
cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
EOF

# ── src/App.tsx ──────────────────────────────────────────────
cat > src/App.tsx << 'EOF'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Diagnostic from './pages/Diagnostic'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/diagnostic" element={<Diagnostic />} />
      </Routes>
    </BrowserRouter>
  )
}
EOF

# ── src/components/Nav.tsx ───────────────────────────────────
cat > src/components/Nav.tsx << 'EOF'
export default function Nav() {
  const handleJoin = () => {
    document.getElementById('cohort')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <style>{`
        .nav-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 56px;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          background: rgba(8,8,8,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle);
        }
        .nav-left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .nav-name {
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.15em;
          color: var(--text-primary);
          font-weight: 500;
          white-space: nowrap;
        }
        .nav-sep {
          color: var(--text-tertiary);
          font-size: 12px;
          flex-shrink: 0;
        }
        .nav-subtitle {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          color: var(--text-tertiary);
          letter-spacing: 0.05em;
          white-space: nowrap;
        }
        .nav-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #fff;
          background: var(--accent);
          border: none;
          border-radius: 100px;
          padding: 8px 18px;
          cursor: pointer;
          transition: all 200ms ease;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .nav-btn:hover {
          filter: brightness(1.1);
          transform: scale(1.02);
        }
        @media (max-width: 640px) {
          .nav-root { padding: 0 20px; }
          .nav-subtitle, .nav-sep { display: none; }
          .nav-btn { font-size: 12px; padding: 7px 14px; }
        }
      `}</style>
      <nav className="nav-root">
        <div className="nav-left">
          <span className="nav-name">KETAN GOEL</span>
          <span className="nav-sep">·</span>
          <span className="nav-subtitle">Analytics Manager · Meesho</span>
        </div>
        <button className="nav-btn" onClick={handleJoin}>
          Join the Lab →
        </button>
      </nav>
    </>
  )
}
EOF

# ── src/components/Hero.tsx ──────────────────────────────────
cat > src/components/Hero.tsx << 'EOF'
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
      el.style.transform = 'translateY(24px)'
      setTimeout(() => {
        el.style.transition = 'opacity 0.65s ease, transform 0.65s ease'
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, 100 + i * 160)
    })
  }, [])

  return (
    <>
      <style>{`
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 96px 24px 72px;
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
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%);
          filter: blur(50px); pointer-events: none;
        }
        .hero-orb-bl {
          position: absolute; bottom: -100px; left: -100px; z-index: 0;
          width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,107,157,0.08) 0%, transparent 70%);
          filter: blur(60px); pointer-events: none;
        }
        .hero-content {
          position: relative; z-index: 1;
          max-width: 800px; width: 100%;
          text-align: center;
          display: flex; flex-direction: column; align-items: center;
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-subtle);
          border-radius: 100px;
          padding: 6px 14px 6px 10px;
          margin-bottom: 40px;
        }
        .hero-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--accent); flex-shrink: 0;
        }
        .hero-eyebrow-text {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          color: var(--text-tertiary);
        }
        .hero-headline {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(32px, 5vw, 62px);
          line-height: 1.13;
          color: var(--text-primary);
          font-weight: 400;
          margin-bottom: 32px;
          max-width: 740px;
        }
        .hero-gradient-text {
          font-style: italic;
          background: linear-gradient(135deg, #FF6B9D 0%, #C084FC 50%, #A855F7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(15px, 2vw, 18px);
          line-height: 1.7;
          color: var(--text-secondary);
          max-width: 540px;
          margin-bottom: 48px;
        }
        .hero-sub strong {
          color: var(--text-primary);
          font-weight: 500;
        }
        .hero-cta-group {
          display: flex; flex-direction: column;
          align-items: center; gap: 16px;
        }
        .hero-cta-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 500;
          color: #fff;
          background: var(--accent);
          border: none;
          border-radius: 100px;
          padding: 16px 44px;
          cursor: pointer;
          transition: all 200ms ease;
          letter-spacing: 0.01em;
        }
        .hero-cta-btn:hover {
          filter: brightness(1.12);
          transform: scale(1.02);
        }
        .hero-cta-btn:active { transform: scale(0.98); }
        .hero-trust {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          color: var(--text-tertiary);
          letter-spacing: 0.05em;
        }
        .hero-scroll-line {
          margin-top: 72px;
          width: 1px; height: 48px;
          background: linear-gradient(to bottom, var(--border-default), transparent);
        }

        @media (max-width: 768px) {
          .hero-section { padding: 80px 20px 60px; }
          .hero-eyebrow { margin-bottom: 32px; }
          .hero-headline { margin-bottom: 24px; max-width: 100%; }
          .hero-sub { margin-bottom: 40px; max-width: 100%; }
          .hero-cta-btn { padding: 14px 36px; font-size: 15px; }
          .hero-scroll-line { margin-top: 48px; }
          .hero-orb-tr { width: 350px; height: 350px; top: -40px; right: -60px; }
          .hero-orb-bl { width: 250px; height: 250px; }
        }

        @media (max-width: 480px) {
          .hero-section { padding: 80px 16px 48px; }
          .hero-eyebrow { padding: 5px 12px 5px 8px; margin-bottom: 24px; }
          .hero-eyebrow-text { font-size: 10px; letter-spacing: 0.08em; }
          .hero-cta-btn { width: 100%; max-width: 320px; }
          .hero-trust { font-size: 11px; text-align: center; padding: 0 8px; line-height: 1.6; }
          .hero-orb-tr { width: 250px; height: 250px; top: -20px; right: -40px; }
          .hero-orb-bl { width: 180px; height: 180px; bottom: -40px; left: -40px; }
        }
      `}</style>

      <section className="hero-section">
        <div className="hero-dot-grid" />
        <div className="hero-orb-tr" />
        <div className="hero-orb-bl" />

        <div ref={ref} className="hero-content">

          <div data-reveal className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            <span className="hero-eyebrow-text">
              FOR EVERY PROFESSIONAL WHO USES AI AT WORK
            </span>
          </div>

          <h1 data-reveal className="hero-headline">
            AI can generate answers, write code, and automate execution.{' '}
            <span className="hero-gradient-text">
              But can you make the decision?
            </span>
          </h1>

          <p data-reveal className="hero-sub">
            The future belongs to people who can use AI to navigate
            ambiguity, solve problems, and make better decisions.{' '}
            <strong>Test where you actually stand.</strong>
          </p>

          <div data-reveal className="hero-cta-group">
            <button
              className="hero-cta-btn"
              onClick={() => navigate('/diagnostic')}
            >
              Test Your Thinking — Free
            </button>
            <span className="hero-trust">
              Takes 4 minutes · No signup required · 2,400+ attempts
            </span>
          </div>

          <div data-reveal>
            <div className="hero-scroll-line" />
          </div>

        </div>
      </section>
    </>
  )
}
EOF

# ── src/pages/Home.tsx ───────────────────────────────────────
cat > src/pages/Home.tsx << 'EOF'
import Nav from '../components/Nav'
import Hero from '../components/Hero'

const Placeholder = ({ id, label }: { id: string; label: string }) => (
  <div id={id} style={{
    minHeight: '200px',
    background: 'var(--bg-surface)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderTop: '1px solid var(--border-subtle)',
  }}>
    <span style={{
      fontFamily: 'DM Mono, monospace',
      fontSize: '12px',
      color: 'var(--text-tertiary)',
      letterSpacing: '0.1em',
    }}>{label}</span>
  </div>
)

export default function Home() {
  return (
    <main style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Nav />
      <Hero />
      <Placeholder id="truth"          label="TRUTH STATEMENT — PROMPT 2" />
      <Placeholder id="diagnostic-cta" label="DIAGNOSTIC CTA — PROMPT 2" />
      <Placeholder id="transformation" label="TRANSFORMATION — PROMPT 2" />
      <Placeholder id="about"          label="ABOUT KETAN — PROMPT 2" />
      <Placeholder id="cohort"         label="COHORT DETAILS — PROMPT 2" />
      <Placeholder id="faq"            label="FAQ — PROMPT 2" />
    </main>
  )
}
EOF

# ── src/pages/Diagnostic.tsx ─────────────────────────────────
cat > src/pages/Diagnostic.tsx << 'EOF'
import { useNavigate } from 'react-router-dom'

export default function Diagnostic() {
  const navigate = useNavigate()
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '24px',
    }}>
      <span style={{
        fontFamily: 'DM Mono, monospace',
        fontSize: '12px',
        letterSpacing: '0.1em',
        color: 'var(--text-tertiary)',
      }}>DIAGNOSTIC — COMING IN PROMPT 3</span>
      <button
        onClick={() => navigate('/')}
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '14px',
          color: 'var(--text-secondary)',
          background: 'transparent',
          border: '1px solid var(--border-subtle)',
          borderRadius: '100px',
          padding: '10px 20px',
          cursor: 'pointer',
          transition: 'all 200ms ease',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
      >
        ← Back to Home
      </button>
    </div>
  )
}
EOF

echo ""
echo "✅ Done! Run: npm run dev"
echo "   Pink → purple gradient hero ready."
echo "   Fully responsive: desktop, tablet, mobile."
