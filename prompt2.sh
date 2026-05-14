#!/bin/bash

# SIGNAL — Prompt 2
# Fixes hero text size + builds all remaining landing page sections
# Run: chmod +x prompt2.sh && ./prompt2.sh

echo "🚀 Building Prompt 2 — remaining sections..."

mkdir -p src/components src/pages

# ── UPDATED Hero.tsx (bigger headline + better centering) ────
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
      el.style.transform = 'translateY(28px)'
      setTimeout(() => {
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease'
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, 120 + i * 170)
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
          padding: 96px 32px 80px;
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
          width: 700px; height: 700px; border-radius: 50%;
          background: radial-gradient(circle, rgba(168,85,247,0.13) 0%, transparent 70%);
          filter: blur(60px); pointer-events: none;
        }
        .hero-orb-bl {
          position: absolute; bottom: -100px; left: -100px; z-index: 0;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,107,157,0.08) 0%, transparent 70%);
          filter: blur(70px); pointer-events: none;
        }
        .hero-content {
          position: relative; z-index: 1;
          max-width: 900px; width: 100%;
          text-align: center;
          display: flex; flex-direction: column; align-items: center;
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-subtle);
          border-radius: 100px;
          padding: 6px 16px 6px 10px;
          margin-bottom: 44px;
        }
        .hero-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--accent); flex-shrink: 0;
        }
        .hero-eyebrow-text {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          color: var(--text-tertiary);
        }
        .hero-headline {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(42px, 6.5vw, 80px);
          line-height: 1.1;
          color: var(--text-primary);
          font-weight: 400;
          margin-bottom: 36px;
          max-width: 860px;
          letter-spacing: -0.01em;
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
          font-size: clamp(16px, 1.8vw, 19px);
          line-height: 1.7;
          color: var(--text-secondary);
          max-width: 520px;
          margin-bottom: 52px;
        }
        .hero-sub strong { color: var(--text-primary); font-weight: 500; }
        .hero-cta-group {
          display: flex; flex-direction: column;
          align-items: center; gap: 16px;
        }
        .hero-cta-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 17px;
          font-weight: 500;
          color: #fff;
          background: var(--accent);
          border: none;
          border-radius: 100px;
          padding: 18px 52px;
          cursor: pointer;
          transition: all 200ms ease;
        }
        .hero-cta-btn:hover { filter: brightness(1.12); transform: scale(1.02); }
        .hero-cta-btn:active { transform: scale(0.98); }
        .hero-trust {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          color: var(--text-tertiary);
          letter-spacing: 0.05em;
        }
        .hero-scroll-line {
          margin-top: 80px;
          width: 1px; height: 56px;
          background: linear-gradient(to bottom, var(--border-default), transparent);
        }
        @media (max-width: 768px) {
          .hero-section { padding: 88px 24px 64px; }
          .hero-eyebrow { margin-bottom: 32px; }
          .hero-headline { margin-bottom: 28px; }
          .hero-sub { margin-bottom: 40px; max-width: 100%; }
          .hero-cta-btn { padding: 16px 40px; font-size: 16px; }
          .hero-scroll-line { margin-top: 56px; }
        }
        @media (max-width: 480px) {
          .hero-section { padding: 80px 20px 56px; }
          .hero-eyebrow-text { font-size: 10px; letter-spacing: 0.08em; }
          .hero-cta-btn { width: 100%; max-width: 340px; }
          .hero-trust { font-size: 11px; line-height: 1.6; text-align: center; }
        }
      `}</style>

      <section className="hero-section">
        <div className="hero-dot-grid" />
        <div className="hero-orb-tr" />
        <div className="hero-orb-bl" />
        <div ref={ref} className="hero-content">
          <div data-reveal className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            <span className="hero-eyebrow-text">FOR EVERY PROFESSIONAL WHO USES AI AT WORK</span>
          </div>
          <h1 data-reveal className="hero-headline">
            AI can generate answers, write code, and automate execution.{' '}
            <span className="hero-gradient-text">But can you make the decision?</span>
          </h1>
          <p data-reveal className="hero-sub">
            The future belongs to people who can use AI to navigate ambiguity,
            solve problems, and make better decisions.{' '}
            <strong>Test where you actually stand.</strong>
          </p>
          <div data-reveal className="hero-cta-group">
            <button className="hero-cta-btn" onClick={() => navigate('/diagnostic')}>
              Test Your Thinking — Free
            </button>
            <span className="hero-trust">
              Takes 4 minutes · No signup required · 2,400+ attempts
            </span>
          </div>
          <div data-reveal><div className="hero-scroll-line" /></div>
        </div>
      </section>
    </>
  )
}
EOF

# ── src/components/TruthStatement.tsx ───────────────────────
cat > src/components/TruthStatement.tsx << 'EOF'
import { useEffect, useRef } from 'react'

export default function TruthStatement() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll<HTMLElement>('[data-reveal]')
            items.forEach((el, i) => {
              setTimeout(() => {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
                el.style.opacity = '1'
                el.style.transform = 'translateY(0)'
              }, i * 100)
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    if (ref.current) {
      const items = ref.current.querySelectorAll<HTMLElement>('[data-reveal]')
      items.forEach(el => {
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
        .truth-section {
          background: var(--bg-surface);
          padding: 112px 32px;
          border-top: 1px solid var(--border-subtle);
        }
        .truth-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
        }
        .truth-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.16em;
          color: var(--accent);
          margin-bottom: 20px;
        }
        .truth-h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(32px, 3.5vw, 48px);
          line-height: 1.15;
          color: var(--text-primary);
          font-weight: 400;
          margin-bottom: 32px;
        }
        .truth-h2 em {
          font-style: italic;
          background: linear-gradient(135deg, #FF6B9D, #A855F7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .truth-para {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          line-height: 1.75;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }
        .truth-para strong { color: var(--text-primary); font-weight: 500; }
        .truth-cards {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .truth-card {
          background: var(--bg-elevated);
          border-radius: 16px;
          padding: 24px 28px;
          border: 1px solid var(--border-subtle);
          transition: border-color 200ms ease;
        }
        .truth-card:hover { border-color: var(--border-default); }
        .truth-card-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.16em;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .truth-card-label.bad { color: var(--red); }
        .truth-card-label.good { color: var(--green); }
        .truth-card-title {
          font-family: 'Instrument Serif', serif;
          font-size: 22px;
          color: var(--text-primary);
          margin-bottom: 10px;
          font-weight: 400;
        }
        .truth-card-body {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: var(--text-secondary);
        }
        .truth-card.bad { border-color: rgba(239,68,68,0.15); }
        .truth-card.good { border-color: rgba(34,197,94,0.15); }
        .truth-card.bad:hover { border-color: rgba(239,68,68,0.30); }
        .truth-card.good:hover { border-color: rgba(34,197,94,0.30); }
        .truth-tagline {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: var(--text-tertiary);
          text-align: center;
          margin-top: 8px;
          font-style: italic;
        }
        @media (max-width: 900px) {
          .truth-inner { grid-template-columns: 1fr; gap: 48px; }
          .truth-section { padding: 80px 24px; }
        }
        @media (max-width: 480px) {
          .truth-section { padding: 64px 20px; }
          .truth-card { padding: 20px; }
        }
      `}</style>

      <section id="truth" className="truth-section">
        <div ref={ref} className="truth-inner">
          <div>
            <p data-reveal className="truth-label">THE SHIFT</p>
            <h2 data-reveal className="truth-h2">
              AI amplifies how you think.<br />
              <em>Not what you think.</em>
            </h2>
            <p data-reveal className="truth-para">
              Every professional now has access to the same AI tools.
              ChatGPT. Gemini. Claude. <strong>The playing field is flat.</strong>
            </p>
            <p data-reveal className="truth-para">
              What's NOT flat: the quality of thinking you bring to them.
              A shallow question gets a shallow answer — even from the world's best AI.
              A structured thinker gets a strategic output.
            </p>
            <p data-reveal className="truth-para">
              <strong>The gap between professionals is widening. Fast.</strong>
            </p>
          </div>

          <div data-reveal className="truth-cards">
            <div className="truth-card bad">
              <div className="truth-card-label bad">✕ SHALLOW THINKING</div>
              <div className="truth-card-title">"The app was slow. Maybe prices were high."</div>
              <div className="truth-card-body">
                3 surface-level guesses. No structure. No prioritization.
                No connection to business impact. This is most people's answer.
              </div>
            </div>
            <div className="truth-card good">
              <div className="truth-card-label good">✓ STRUCTURED THINKING</div>
              <div className="truth-card-title">"Intent → Friction → Supply → Trust"</div>
              <div className="truth-card-body">
                One prioritized hypothesis with a clear framework.
                "The user had intent but hit friction in the discovery phase —
                most likely menu complexity or delivery time anxiety."
              </div>
            </div>
            <p className="truth-tagline">
              The difference is learnable. That's what the lab teaches.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
EOF

# ── src/components/DiagnosticCTA.tsx ────────────────────────
cat > src/components/DiagnosticCTA.tsx << 'EOF'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'

export default function DiagnosticCTA() {
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll<HTMLElement>('[data-reveal]')
            items.forEach((el, i) => {
              setTimeout(() => {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
                el.style.opacity = '1'
                el.style.transform = 'translateY(0)'
              }, i * 100)
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )
    if (ref.current) {
      ref.current.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(20px)'
      })
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        .dcta-section {
          background: var(--bg-base);
          padding: 0 32px;
          border-top: 1px solid var(--border-subtle);
        }
        .dcta-inner {
          max-width: 720px;
          margin: 0 auto;
          padding: 96px 0;
          text-align: center;
        }
        .dcta-banner {
          background: var(--bg-elevated);
          border: 1px solid var(--border-default);
          border-radius: 24px;
          padding: 64px 48px;
          position: relative;
          overflow: hidden;
        }
        .dcta-banner::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(168,85,247,0.5), rgba(255,107,157,0.5), transparent);
        }
        .dcta-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.16em;
          color: var(--accent);
          margin-bottom: 20px;
        }
        .dcta-h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(28px, 4vw, 48px);
          line-height: 1.15;
          color: var(--text-primary);
          font-weight: 400;
          margin-bottom: 20px;
        }
        .dcta-body {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          line-height: 1.7;
          color: var(--text-secondary);
          max-width: 480px;
          margin: 0 auto 40px;
        }
        .dcta-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 500;
          color: #fff;
          background: var(--accent);
          border: none;
          border-radius: 100px;
          padding: 16px 48px;
          cursor: pointer;
          transition: all 200ms ease;
          display: inline-block;
          margin-bottom: 32px;
        }
        .dcta-btn:hover { filter: brightness(1.12); transform: scale(1.02); }
        .dcta-btn:active { transform: scale(0.98); }
        .dcta-trust {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
        }
        .dcta-trust-item {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          color: var(--text-tertiary);
          letter-spacing: 0.06em;
        }
        .dcta-trust-sep {
          width: 3px; height: 3px; border-radius: 50%;
          background: var(--text-tertiary);
          flex-shrink: 0;
        }
        @media (max-width: 640px) {
          .dcta-section { padding: 0 20px; }
          .dcta-inner { padding: 72px 0; }
          .dcta-banner { padding: 48px 28px; border-radius: 20px; }
          .dcta-btn { width: 100%; max-width: 320px; }
        }
      `}</style>

      <section id="diagnostic-cta" className="dcta-section">
        <div ref={ref} className="dcta-inner">
          <div className="dcta-banner">
            <p data-reveal className="dcta-label">THE DIAGNOSTIC</p>
            <h2 data-reveal className="dcta-h2">
              One question.<br />Real evaluation.
            </h2>
            <p data-reveal className="dcta-body">
              Answer a single business problem — the same type asked in
              interviews at Swiggy, Zepto, Blinkit, and Meesho.
              Our AI evaluates exactly how you think.
            </p>
            <div data-reveal>
              <button className="dcta-btn" onClick={() => navigate('/diagnostic')}>
                Start the Diagnostic →
              </button>
            </div>
            <div data-reveal className="dcta-trust">
              <span className="dcta-trust-item">4 minutes</span>
              <span className="dcta-trust-sep" />
              <span className="dcta-trust-item">Free</span>
              <span className="dcta-trust-sep" />
              <span className="dcta-trust-item">Instant feedback</span>
              <span className="dcta-trust-sep" />
              <span className="dcta-trust-item">No signup</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
EOF

# ── src/components/Transformation.tsx ───────────────────────
cat > src/components/Transformation.tsx << 'EOF'
import { useEffect, useRef } from 'react'

const cards = [
  {
    icon: '◈',
    title: 'Business Thinking',
    body: 'Connect user behavior to business impact. Think in tradeoffs. Reason in systems. Understand why decisions get made — not just what they are.',
    outcomes: ['Stop describing symptoms', 'Identify root causes', 'Prioritize ruthlessly'],
  },
  {
    icon: '⬡',
    title: 'AI as a Thinking Partner',
    body: 'Structure your prompts with intent. Validate AI outputs critically. Reason WITH AI instead of depending ON AI.',
    outcomes: ['Use AI to think, not just generate', 'Spot when AI is wrong', '10x your output quality'],
  },
  {
    icon: '◎',
    title: 'Structured Problem Solving',
    body: 'Break ambiguous problems into frameworks. Generate hypotheses systematically. Communicate analytical thinking clearly.',
    outcomes: ["Never blank on hard questions", 'Structure messy information', 'Think clearly on your feet'],
  },
  {
    icon: '◇',
    title: 'Professional Edge',
    body: 'Handle ambiguity with confidence. Make decisions with incomplete information. Lead analytical conversations in any room.',
    outcomes: ['Think like a senior before you are one', "Be the person who 'gets it'", 'Compound faster than peers'],
  },
]

export default function Transformation() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll<HTMLElement>('[data-reveal]')
            items.forEach((el, i) => {
              setTimeout(() => {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
                el.style.opacity = '1'
                el.style.transform = 'translateY(0)'
              }, i * 80)
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
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
        .trans-section {
          background: var(--bg-base);
          padding: 112px 32px;
          border-top: 1px solid var(--border-subtle);
        }
        .trans-inner { max-width: 1100px; margin: 0 auto; }
        .trans-header { text-align: center; margin-bottom: 72px; }
        .trans-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.16em;
          color: var(--accent);
          margin-bottom: 20px;
        }
        .trans-h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(30px, 3.5vw, 48px);
          font-weight: 400;
          color: var(--text-primary);
          line-height: 1.2;
          max-width: 560px;
          margin: 0 auto;
        }
        .trans-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .trans-card {
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 20px;
          padding: 36px;
          transition: border-color 200ms ease, transform 200ms ease;
          cursor: default;
        }
        .trans-card:hover {
          border-color: var(--border-default);
          transform: translateY(-2px);
        }
        .trans-card-icon {
          font-size: 22px;
          color: var(--text-tertiary);
          margin-bottom: 20px;
          display: block;
        }
        .trans-card-title {
          font-family: 'Instrument Serif', serif;
          font-size: 22px;
          font-weight: 400;
          color: var(--text-primary);
          margin-bottom: 14px;
        }
        .trans-card-body {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: 24px;
        }
        .trans-outcomes {
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-top: 1px solid var(--border-subtle);
          padding-top: 20px;
        }
        .trans-outcome {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: var(--text-tertiary);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .trans-outcome::before {
          content: '→';
          color: var(--accent);
          font-size: 12px;
          flex-shrink: 0;
        }
        .trans-tagline {
          text-align: center;
          margin-top: 64px;
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: clamp(20px, 2.5vw, 28px);
          color: var(--text-secondary);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.4;
        }
        .trans-tagline em {
          background: linear-gradient(135deg, #FF6B9D, #A855F7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-style: normal;
        }
        @media (max-width: 768px) {
          .trans-grid { grid-template-columns: 1fr; }
          .trans-section { padding: 80px 24px; }
          .trans-header { margin-bottom: 48px; }
        }
        @media (max-width: 480px) {
          .trans-section { padding: 64px 20px; }
          .trans-card { padding: 28px 24px; }
        }
      `}</style>

      <section id="transformation" className="trans-section">
        <div ref={ref} className="trans-inner">
          <div className="trans-header">
            <p data-reveal className="trans-label">THE TRANSFORMATION</p>
            <h2 data-reveal className="trans-h2">How you'll think differently.</h2>
          </div>

          <div className="trans-grid">
            {cards.map((card, i) => (
              <div key={i} data-reveal className="trans-card">
                <span className="trans-card-icon">{card.icon}</span>
                <div className="trans-card-title">{card.title}</div>
                <p className="trans-card-body">{card.body}</p>
                <div className="trans-outcomes">
                  {card.outcomes.map((o, j) => (
                    <span key={j} className="trans-outcome">{o}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p data-reveal className="trans-tagline">
            The outcome is not learning tools.<br />
            The outcome is <em>becoming a stronger thinker.</em>
          </p>
        </div>
      </section>
    </>
  )
}
EOF

# ── src/components/AboutKetan.tsx ────────────────────────────
cat > src/components/AboutKetan.tsx << 'EOF'
import { useEffect, useRef } from 'react'

export default function AboutKetan() {
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
              }, i * 100)
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    if (ref.current) {
      ref.current.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(20px)'
      })
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        .about-section {
          background: var(--bg-surface);
          padding: 112px 32px;
          border-top: 1px solid var(--border-subtle);
        }
        .about-inner {
          max-width: 1000px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 80px;
          align-items: start;
        }
        .about-left { display: flex; flex-direction: column; align-items: center; gap: 24px; }
        .about-avatar {
          width: 160px; height: 160px; border-radius: 50%;
          background: var(--bg-elevated);
          border: 2px solid var(--border-default);
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .about-avatar::after {
          content: '';
          position: absolute; inset: -2px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255,107,157,0.4), rgba(168,85,247,0.4));
          z-index: -1;
        }
        .about-avatar-initials {
          font-family: 'Instrument Serif', serif;
          font-size: 48px;
          color: var(--text-secondary);
        }
        .about-pills { display: flex; flex-direction: column; gap: 8px; width: 100%; }
        .about-pill {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: var(--text-tertiary);
          letter-spacing: 0.08em;
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          padding: 8px 14px;
          text-align: center;
        }
        .about-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          width: 100%;
          margin-top: 8px;
        }
        .about-stat {
          text-align: center;
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 16px 8px;
        }
        .about-stat-num {
          font-family: 'Instrument Serif', serif;
          font-size: 24px;
          color: var(--accent);
          display: block;
          margin-bottom: 4px;
        }
        .about-stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: var(--text-tertiary);
          letter-spacing: 0.08em;
          line-height: 1.4;
        }
        .about-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.16em;
          color: var(--accent);
          margin-bottom: 16px;
        }
        .about-name {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(32px, 3.5vw, 48px);
          font-weight: 400;
          color: var(--text-primary);
          margin-bottom: 28px;
          line-height: 1.1;
        }
        .about-bio {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          line-height: 1.8;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }
        .about-bio strong { color: var(--text-primary); font-weight: 500; }
        .about-bio em { font-style: italic; color: var(--text-primary); }
        .about-linkedin {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: var(--accent);
          text-decoration: none;
          margin-top: 8px;
          transition: gap 200ms ease;
        }
        .about-linkedin:hover { gap: 12px; }
        @media (max-width: 860px) {
          .about-inner { grid-template-columns: 1fr; gap: 48px; }
          .about-left { flex-direction: row; flex-wrap: wrap; align-items: flex-start; }
          .about-avatar { width: 120px; height: 120px; }
          .about-avatar-initials { font-size: 36px; }
          .about-section { padding: 80px 24px; }
        }
        @media (max-width: 480px) {
          .about-section { padding: 64px 20px; }
          .about-stats { grid-template-columns: repeat(3, 1fr); }
          .about-stat-num { font-size: 20px; }
        }
      `}</style>

      <section id="about" className="about-section">
        <div ref={ref} className="about-inner">
          <div data-reveal className="about-left">
            <div className="about-avatar">
              <span className="about-avatar-initials">KG</span>
            </div>
            <div className="about-pills">
              <span className="about-pill">Analytics Manager · Meesho</span>
              <span className="about-pill">7 Years in Product Analytics</span>
              <span className="about-pill">170K LinkedIn Followers</span>
            </div>
            <div className="about-stats">
              <div className="about-stat">
                <span className="about-stat-num">170K</span>
                <span className="about-stat-label">Followers</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num">7</span>
                <span className="about-stat-label">Years at Meesho</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num">500+</span>
                <span className="about-stat-label">Mentored</span>
              </div>
            </div>
          </div>

          <div>
            <p data-reveal className="about-label">YOUR MENTOR</p>
            <h2 data-reveal className="about-name">Ketan Goel</h2>
            <p data-reveal className="about-bio">
              I've spent 7 years at the intersection of data and decisions —
              most recently as <strong>Analytics Manager at Meesho</strong>, one of
              India's fastest-growing e-commerce companies.
            </p>
            <p data-reveal className="about-bio">
              In that time, I've interviewed hundreds of candidates and worked
              with analysts at every level. The gap between good and great has
              almost nothing to do with SQL or Python.
            </p>
            <p data-reveal className="about-bio">
              <em>It's always the thinking.</em>
            </p>
            <p data-reveal className="about-bio">
              Most professionals describe what happened.
              Great analysts explain <strong>why it happened, what it means,
              and what to do next</strong> — in the same breath.
              That's what this lab teaches.
            </p>
            <a
              data-reveal
              href="https://linkedin.com/in/ketangoel"
              target="_blank"
              rel="noopener noreferrer"
              className="about-linkedin"
            >
              → Follow on LinkedIn (170K)
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
EOF

# ── src/components/CohortDetails.tsx ────────────────────────
cat > src/components/CohortDetails.tsx << 'EOF'
import { useEffect, useRef } from 'react'

function getNextFriday(): string {
  const today = new Date()
  const day = today.getDay()
  const daysUntilFriday = (5 - day + 7) % 7 || 7
  const nextFriday = new Date(today)
  nextFriday.setDate(today.getDate() + daysUntilFriday)
  return nextFriday.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function CohortDetails() {
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
      { threshold: 0.1 }
    )
    if (ref.current) {
      ref.current.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(20px)'
      })
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [])

  const steps = [
    { num: '01', title: 'Real business case', body: 'Ambiguous, no clean answer — just like the real world. Same type asked in top Indian tech companies.' },
    { num: '02', title: 'You solve it. With AI. Live.', body: 'Ketan watches how you think, not just what you answer. The process reveals everything.' },
    { num: '03', title: 'Structured debrief', body: 'Ketan breaks down the senior analyst approach vs what the group produced. The gap is where you grow.' },
    { num: '04', title: 'Frameworks you keep', body: 'Real mental models that transfer directly to your actual job, interviews, and stakeholder conversations.' },
  ]

  return (
    <>
      <style>{`
        .cohort-section {
          background: var(--bg-base);
          padding: 112px 32px;
          border-top: 1px solid var(--border-subtle);
        }
        .cohort-inner {
          max-width: 1100px; margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 80px;
          align-items: start;
        }
        .cohort-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.16em;
          color: var(--accent); margin-bottom: 16px;
        }
        .cohort-h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 400; color: var(--text-primary);
          line-height: 1.2; margin-bottom: 12px;
        }
        .cohort-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; line-height: 1.65;
          color: var(--text-secondary); margin-bottom: 48px;
          max-width: 480px;
        }
        .cohort-steps { display: flex; flex-direction: column; gap: 0; }
        .cohort-step {
          display: flex; gap: 24px; padding: 24px 0;
          border-bottom: 1px solid var(--border-subtle);
        }
        .cohort-step:first-child { border-top: 1px solid var(--border-subtle); }
        .cohort-step-num {
          font-family: 'DM Mono', monospace;
          font-size: 13px; color: var(--accent);
          letter-spacing: 0.08em; flex-shrink: 0;
          padding-top: 2px; min-width: 28px;
        }
        .cohort-step-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 500;
          color: var(--text-primary); margin-bottom: 6px;
        }
        .cohort-step-body {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; line-height: 1.6;
          color: var(--text-secondary);
        }
        .cohort-not {
          margin-top: 36px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 16px; padding: 24px 28px;
        }
        .cohort-not-title {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.12em;
          color: var(--text-tertiary); margin-bottom: 14px;
        }
        .cohort-not-items { display: flex; flex-direction: column; gap: 8px; }
        .cohort-not-item {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: var(--text-tertiary);
          display: flex; align-items: center; gap: 10px;
        }
        .cohort-not-item::before {
          content: '✕'; color: var(--red); font-size: 11px; flex-shrink: 0;
        }
        /* RIGHT CARD */
        .cohort-card {
          background: var(--bg-elevated);
          border: 1px solid var(--accent-border);
          border-radius: 24px; padding: 36px;
          position: sticky; top: 80px;
        }
        .cohort-card-next {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.12em;
          color: var(--text-tertiary); margin-bottom: 4px;
        }
        .cohort-card-date {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; color: var(--text-primary);
          font-weight: 500; margin-bottom: 28px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .cohort-card-price {
          font-family: 'Instrument Serif', serif;
          font-size: 52px; color: var(--text-primary);
          line-height: 1; margin-bottom: 4px;
        }
        .cohort-card-per {
          font-family: 'DM Mono', monospace;
          font-size: 12px; color: var(--text-tertiary);
          margin-bottom: 28px;
        }
        .cohort-card-includes { display: flex; flex-direction: column; gap: 10px; margin-bottom: 32px; }
        .cohort-card-include {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: var(--text-secondary);
          display: flex; align-items: center; gap: 10px;
        }
        .cohort-card-include::before { content: '✓'; color: var(--green); flex-shrink: 0; }
        .cohort-card-btn {
          width: 100%;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 500;
          color: #fff; background: var(--accent);
          border: none; border-radius: 100px;
          padding: 16px; cursor: pointer;
          transition: all 200ms ease; margin-bottom: 16px;
        }
        .cohort-card-btn:hover { filter: brightness(1.12); transform: scale(1.01); }
        .cohort-card-trust {
          font-family: 'DM Mono', monospace;
          font-size: 11px; color: var(--text-tertiary);
          text-align: center; letter-spacing: 0.06em;
        }
        .cohort-seats {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 24px;
        }
        .cohort-seats-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 6px var(--green);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .cohort-seats-text {
          font-family: 'DM Mono', monospace;
          font-size: 12px; color: var(--green); letter-spacing: 0.08em;
        }
        @media (max-width: 960px) {
          .cohort-inner { grid-template-columns: 1fr; gap: 48px; }
          .cohort-card { position: static; }
          .cohort-section { padding: 80px 24px; }
        }
        @media (max-width: 480px) {
          .cohort-section { padding: 64px 20px; }
          .cohort-card { padding: 28px 24px; border-radius: 20px; }
          .cohort-card-price { font-size: 44px; }
        }
      `}</style>

      <section id="cohort" className="cohort-section">
        <div ref={ref} className="cohort-inner">
          <div>
            <p data-reveal className="cohort-label">THE LAB</p>
            <h2 data-reveal className="cohort-h2">Friday AI Problem<br />Solving Lab</h2>
            <p data-reveal className="cohort-sub">
              Not a course. Not a bootcamp.
              A live thinking environment with Ketan — where you solve real problems and get honest feedback.
            </p>

            <div data-reveal className="cohort-steps">
              {steps.map((s, i) => (
                <div key={i} className="cohort-step">
                  <span className="cohort-step-num">{s.num}</span>
                  <div>
                    <div className="cohort-step-title">{s.title}</div>
                    <div className="cohort-step-body">{s.body}</div>
                  </div>
                </div>
              ))}
            </div>

            <div data-reveal className="cohort-not">
              <div className="cohort-not-title">THIS IS NOT</div>
              <div className="cohort-not-items">
                {['Pre-recorded videos', 'Slides and lectures', 'Generic AI prompting tips', 'Another LinkedIn course'].map((item, i) => (
                  <span key={i} className="cohort-not-item">{item}</span>
                ))}
              </div>
            </div>
          </div>

          <div data-reveal className="cohort-card">
            <div className="cohort-card-next">NEXT SESSION</div>
            <div className="cohort-card-date">{getNextFriday()}</div>

            <div className="cohort-seats">
              <span className="cohort-seats-dot" />
              <span className="cohort-seats-text">3 of 5 seats remaining</span>
            </div>

            <div className="cohort-card-price">₹2,500</div>
            <div className="cohort-card-per">per session</div>

            <div className="cohort-card-includes">
              {[
                '90-minute live problem solving',
                "Ketan's framework breakdown",
                'Session recording',
                'Private community access',
                'Case study materials',
              ].map((item, i) => (
                <span key={i} className="cohort-card-include">{item}</span>
              ))}
            </div>

            <button
              className="cohort-card-btn"
              onClick={() => window.open('https://rzp.io/l/ketangoel', '_blank')}
            >
              Reserve Your Seat →
            </button>
            <div className="cohort-card-trust">
              No auto-renewal · Pay per session
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
EOF

# ── src/components/FAQ.tsx ───────────────────────────────────
cat > src/components/FAQ.tsx << 'EOF'
import { useState, useEffect, useRef } from 'react'

const faqs = [
  {
    q: 'Who is this for?',
    a: 'Any professional who works with data, makes decisions, or presents recommendations — and wants to do it better. PMs, analysts, consultants, founders, MBA students, and engineers who want to think more clearly.',
  },
  {
    q: 'Do I need a technical background?',
    a: "No. This is not about SQL, Python, or tools. It's about how you think through problems. Some of the sharpest thinkers in the lab come from non-technical backgrounds.",
  },
  {
    q: "What if I can't make a session?",
    a: 'Each session is recorded. But the live experience — watching Ketan break down your thinking in real time — is the most valuable part. Attendance is strongly recommended.',
  },
  {
    q: 'Why only 5 people?',
    a: 'Because meaningful feedback requires real attention. Ketan evaluates how each person thinks — not just what they answer. That depth is only possible in small groups.',
  },
  {
    q: 'What makes this different from other courses?',
    a: 'Most courses teach content. This lab evaluates thinking. You will leave knowing exactly where your analytical reasoning breaks down — and with frameworks to fix it.',
  },
  {
    q: 'Is ₹2,500 per session or a subscription?',
    a: 'Per session. No commitments, no auto-renewals. Book when it works for you.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
              setTimeout(() => {
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
                el.style.opacity = '1'
                el.style.transform = 'translateY(0)'
              }, i * 60)
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    if (ref.current) {
      ref.current.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(16px)'
      })
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        .faq-section {
          background: var(--bg-surface);
          padding: 112px 32px;
          border-top: 1px solid var(--border-subtle);
        }
        .faq-inner { max-width: 720px; margin: 0 auto; }
        .faq-h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(28px, 3vw, 40px);
          font-weight: 400; color: var(--text-primary);
          margin-bottom: 48px;
        }
        .faq-item {
          border-bottom: 1px solid var(--border-subtle);
          cursor: pointer;
        }
        .faq-item:first-of-type { border-top: 1px solid var(--border-subtle); }
        .faq-question {
          display: flex; align-items: center;
          justify-content: space-between; gap: 16px;
          padding: 24px 0;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; font-weight: 500;
          color: var(--text-primary);
          transition: color 200ms ease;
          user-select: none;
        }
        .faq-item:hover .faq-question { color: var(--text-primary); }
        .faq-chevron {
          width: 20px; height: 20px; flex-shrink: 0;
          color: var(--text-tertiary);
          transition: transform 300ms ease;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
        }
        .faq-chevron.open { transform: rotate(45deg); color: var(--accent); }
        .faq-answer-wrap {
          overflow: hidden;
          max-height: 0;
          transition: max-height 350ms ease;
        }
        .faq-answer-wrap.open { max-height: 300px; }
        .faq-answer {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; line-height: 1.75;
          color: var(--text-secondary);
          padding-bottom: 24px;
          max-width: 600px;
        }
        @media (max-width: 640px) {
          .faq-section { padding: 80px 24px; }
          .faq-question { font-size: 15px; padding: 20px 0; }
        }
        @media (max-width: 480px) {
          .faq-section { padding: 64px 20px; }
        }
      `}</style>

      <section id="faq" className="faq-section">
        <div ref={ref} className="faq-inner">
          <h2 data-reveal className="faq-h2">Common questions</h2>
          {faqs.map((faq, i) => (
            <div
              key={i}
              data-reveal
              className="faq-item"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="faq-question">
                <span>{faq.q}</span>
                <span className={`faq-chevron ${open === i ? 'open' : ''}`}>+</span>
              </div>
              <div className={`faq-answer-wrap ${open === i ? 'open' : ''}`}>
                <p className="faq-answer">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
EOF

# ── src/components/Footer.tsx ────────────────────────────────
cat > src/components/Footer.tsx << 'EOF'
export default function Footer() {
  return (
    <>
      <style>{`
        .footer-section {
          background: var(--bg-base);
          padding: 48px 32px;
          border-top: 1px solid var(--border-subtle);
        }
        .footer-inner {
          max-width: 1100px; margin: 0 auto;
          display: flex; align-items: center;
          justify-content: space-between; gap: 24px;
          flex-wrap: wrap;
        }
        .footer-brand {
          font-family: 'DM Mono', monospace;
          font-size: 13px; letter-spacing: 0.12em;
          color: var(--text-primary);
        }
        .footer-links {
          display: flex; align-items: center; gap: 24px; flex-wrap: wrap;
        }
        .footer-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: var(--text-tertiary);
          text-decoration: none;
          transition: color 200ms ease;
        }
        .footer-link:hover { color: var(--text-secondary); }
        .footer-copy {
          width: 100%; text-align: center;
          font-family: 'DM Mono', monospace;
          font-size: 12px; color: var(--text-tertiary);
          letter-spacing: 0.08em;
          margin-top: 32px;
          padding-top: 32px;
          border-top: 1px solid var(--border-subtle);
        }
        @media (max-width: 640px) {
          .footer-inner { flex-direction: column; align-items: flex-start; }
          .footer-section { padding: 40px 24px; }
        }
      `}</style>

      <footer className="footer-section">
        <div className="footer-inner">
          <span className="footer-brand">KETAN GOEL</span>
          <div className="footer-links">
            <a href="https://linkedin.com/in/ketangoel" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
            <a href="mailto:ketan@onestopcareers.in" className="footer-link">Contact</a>
            <a href="/privacy" className="footer-link">Privacy</a>
          </div>
          <p className="footer-copy">
            © 2026 Ketan Goel · onestopcareers.in · Built for ambitious professionals who take their thinking seriously.
          </p>
        </div>
      </footer>
    </>
  )
}
EOF

# ── UPDATED src/pages/Home.tsx ───────────────────────────────
cat > src/pages/Home.tsx << 'EOF'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import TruthStatement from '../components/TruthStatement'
import DiagnosticCTA from '../components/DiagnosticCTA'
import Transformation from '../components/Transformation'
import AboutKetan from '../components/AboutKetan'
import CohortDetails from '../components/CohortDetails'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Nav />
      <Hero />
      <TruthStatement />
      <DiagnosticCTA />
      <Transformation />
      <AboutKetan />
      <CohortDetails />
      <FAQ />
      <Footer />
    </main>
  )
}
EOF

echo ""
echo "✅ Prompt 2 complete!"
echo ""
echo "Sections built:"
echo "  ✓ Hero (updated — bigger headline)"
echo "  ✓ Truth Statement"
echo "  ✓ Diagnostic CTA"
echo "  ✓ Transformation (4 cards)"
echo "  ✓ About Ketan"
echo "  ✓ Cohort Details + Signup Card"
echo "  ✓ FAQ"
echo "  ✓ Footer"
echo ""
echo "Run: npm run dev"
