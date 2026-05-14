#!/bin/bash

# SIGNAL — Prompt 1 Setup Script
# Place this file in your project root (onestopproject_v2) and run:
# chmod +x prompt1_setup.sh && ./prompt1_setup.sh

echo "🚀 Setting up Signal — Prompt 1..."

# ── Create folders ──────────────────────────────────────────
mkdir -p src/styles
mkdir -p src/components
mkdir -p src/pages

# ── globals.css ─────────────────────────────────────────────
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

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg-base); }
::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }
::selection { background: var(--accent-soft); color: var(--text-primary); }
EOF

# ── tailwind.config.cjs ─────────────────────────────────────
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
        'bg-glass':       'var(--bg-glass)',
        'accent':         'var(--accent)',
        'accent-soft':    'var(--accent-soft)',
        'text-primary':   'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary':  'var(--text-tertiary)',
        'border-subtle':  'var(--border-subtle)',
        'border-default': 'var(--border-default)',
        'green':  'var(--green)',
        'red':    'var(--red)',
        'amber':  'var(--amber)',
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
    const el = document.getElementById('cohort')
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: '56px',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      background: 'rgba(8,8,8,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '13px',
          letterSpacing: '0.15em',
          color: 'var(--text-primary)',
          fontWeight: 500,
        }}>KETAN GOEL</span>
        <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>·</span>
        <span className="nav-subtitle" style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '12px',
          color: 'var(--text-tertiary)',
          letterSpacing: '0.05em',
        }}>Analytics Manager · Meesho</span>
      </div>

      <button
        onClick={handleJoin}
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '13px',
          fontWeight: 500,
          color: '#fff',
          background: 'var(--accent)',
          border: 'none',
          borderRadius: '100px',
          padding: '8px 18px',
          cursor: 'pointer',
          transition: 'all 200ms ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.filter = 'brightness(1.1)'
          e.currentTarget.style.transform = 'scale(1.02)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.filter = 'brightness(1)'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        Join the Lab →
      </button>

      <style>{`
        @media (max-width: 640px) { .nav-subtitle { display: none; } }
      `}</style>
    </nav>
  )
}
EOF

# ── src/components/Hero.tsx ──────────────────────────────────
cat > src/components/Hero.tsx << 'EOF'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const items = containerRef.current?.querySelectorAll('[data-reveal]')
    if (!items) return
    items.forEach((el, i) => {
      const htmlEl = el as HTMLElement
      htmlEl.style.opacity = '0'
      htmlEl.style.transform = 'translateY(24px)'
      setTimeout(() => {
        htmlEl.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
        htmlEl.style.opacity = '1'
        htmlEl.style.transform = 'translateY(0)'
      }, 100 + i * 150)
    })
  }, [])

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '80px 24px 60px',
    }}>
      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
      }} />

      {/* Orb top-right */}
      <div style={{
        position: 'absolute', top: '-80px', right: '-120px', zIndex: 0,
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,98,42,0.10) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      {/* Orb bottom-left */}
      <div style={{
        position: 'absolute', bottom: '-100px', left: '-100px', zIndex: 0,
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,98,42,0.05) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      {/* Content */}
      <div ref={containerRef} style={{
        position: 'relative', zIndex: 1,
        maxWidth: '780px', width: '100%',
        textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>

        {/* Eyebrow */}
        <div data-reveal style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '100px',
          padding: '6px 14px 6px 10px',
          marginBottom: '40px',
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: 'var(--accent)', display: 'inline-block', flexShrink: 0,
          }} />
          <span style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '11px',
            letterSpacing: '0.12em',
            color: 'var(--text-tertiary)',
          }}>FOR EVERY PROFESSIONAL WHO USES AI AT WORK</span>
        </div>

        {/* Headline */}
        <h1 data-reveal style={{
          fontFamily: 'Instrument Serif, serif',
          fontSize: 'clamp(34px, 5.2vw, 62px)',
          lineHeight: 1.12,
          color: 'var(--text-primary)',
          fontWeight: 400,
          marginBottom: '32px',
          maxWidth: '720px',
        }}>
          AI can generate answers, write code, and automate execution.{' '}
          <span style={{
            fontStyle: 'italic',
            background: 'linear-gradient(135deg, #E8622A 0%, #F59E0B 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            But can you make the decision?
          </span>
        </h1>

        {/* Subheadline */}
        <p data-reveal style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 'clamp(16px, 2vw, 19px)',
          lineHeight: 1.65,
          color: 'var(--text-secondary)',
          maxWidth: '560px',
          marginBottom: '48px',
        }}>
          The future belongs to people who can use AI to navigate ambiguity,
          solve problems, and make better decisions.{' '}
          <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
            Test where you actually stand.
          </strong>
        </p>

        {/* CTA */}
        <div data-reveal style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
        }}>
          <button
            onClick={() => navigate('/diagnostic')}
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '16px',
              fontWeight: 500,
              color: '#fff',
              background: 'var(--accent)',
              border: 'none',
              borderRadius: '100px',
              padding: '16px 40px',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.filter = 'brightness(1.1)'
              e.currentTarget.style.transform = 'scale(1.02)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.filter = 'brightness(1)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            Test Your Thinking — Free
          </button>

          <span style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '12px',
            color: 'var(--text-tertiary)',
            letterSpacing: '0.05em',
          }}>
            Takes 4 minutes · No signup required · 2,400+ attempts
          </span>
        </div>

        {/* Scroll line */}
        <div data-reveal style={{ marginTop: '80px' }}>
          <div style={{
            width: '1px', height: '48px',
            background: 'linear-gradient(to bottom, var(--border-default), transparent)',
            margin: '0 auto',
          }} />
        </div>

      </div>
    </section>
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
      <Placeholder id="truth"           label="TRUTH STATEMENT — PROMPT 2" />
      <Placeholder id="diagnostic-cta"  label="DIAGNOSTIC CTA — PROMPT 2" />
      <Placeholder id="transformation"  label="TRANSFORMATION — PROMPT 2" />
      <Placeholder id="about"           label="ABOUT KETAN — PROMPT 2" />
      <Placeholder id="cohort"          label="COHORT DETAILS — PROMPT 2" />
      <Placeholder id="faq"             label="FAQ — PROMPT 2" />
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
echo "✅ All files created successfully!"
echo ""
echo "Next steps:"
echo "  npm run dev"
echo ""
echo "You should see the hero at http://localhost:5173"
