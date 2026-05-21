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

const SCENARIOS = [
  {
    setup: 'You present your analysis. Leadership looks up from the slide.',
    trigger: '"This is great. But what should we actually do?"',
    bad: {
      label: 'WHAT MOST PEOPLE SAY',
      quote: '"There are a few options we could explore. We probably need a bit more data before we commit to anything."',
      note: 'You just described the problem they already know. You gave them nothing to act on.',
    },
    good: {
      label: 'WHAT DECISION-MAKERS SAY',
      quote: '"Pause the paid campaign — here\'s why, here\'s what we\'ll see in 2 weeks if we\'re right, and here\'s what we do if we\'re wrong."',
      note: 'A position. A reason. A way to verify it. This is what gets you in the room next time.',
    },
  },
  {
    setup: 'AI generates the same chart you spent 3 hours on. In 8 seconds.',
    trigger: '"So what are you adding here that the AI isn\'t?"',
    bad: {
      label: 'WHAT MOST PEOPLE FEEL',
      quote: '"I pull the data, clean it, structure it, build the dashboard. That\'s my value."',
      note: 'That\'s exactly what the AI just did. Faster. For free.',
    },
    good: {
      label: 'WHAT DECISION-MAKERS FEEL',
      quote: '"I tell you what the data means for the business, what decision to make, and what we\'re betting on when we make it."',
      note: 'That\'s judgment. That\'s what AI can\'t replace. That\'s what this lab builds.',
    },
  },
]

export default function TruthStatement() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
            setTimeout(() => {
              el.style.transition = 'opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)'
              el.style.opacity = '1'
              el.style.transform = 'translateY(0)'
            }, i * 100)
          })
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.06 })

    if (ref.current) {
      ref.current.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(22px)'
      })
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        /* ── Section shell ── */
        .ts-section {
          background: var(--bg-surface);
          border-top: 1px solid var(--border-subtle);
          padding: 88px 32px 80px;
        }
        .ts-inner { max-width: 780px; margin: 0 auto; }

        /* ── Section header ── */
        .ts-label {
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 0.16em; color: var(--accent); margin-bottom: 14px;
        }
        .ts-h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(26px, 3.8vw, 46px);
          line-height: 1.15; color: var(--text-primary);
          font-weight: 400; margin-bottom: 56px; max-width: 600px;
        }
        .ts-h2 em {
          font-style: italic;
          background: linear-gradient(135deg, #FF6B9D, #A855F7);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Scenario block ── */
        .ts-scenario { margin-bottom: 52px; }
        .ts-scenario:last-of-type { margin-bottom: 0; }

        /* Setup line */
        .ts-setup {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: var(--text-tertiary);
          letter-spacing: 0.01em; margin-bottom: 6px;
          line-height: 1.5;
        }

        /* The trigger — the question that lands */
        .ts-trigger {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: clamp(18px, 2.4vw, 24px);
          color: var(--text-primary);
          line-height: 1.35;
          margin-bottom: 20px;
        }

        /* Cards stack */
        .ts-cards {
          display: flex; flex-direction: column; gap: 10px;
          margin-bottom: 0;
        }

        /* Individual card */
        .ts-card {
          border-radius: 14px; padding: 20px 20px 16px;
          border: 1px solid;
        }
        .ts-card.bad {
          background: rgba(239,68,68,0.04);
          border-color: rgba(239,68,68,0.14);
        }
        .ts-card.good {
          background: rgba(34,197,94,0.04);
          border-color: rgba(34,197,94,0.18);
        }

        /* Card label */
        .ts-card-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.14em;
          margin-bottom: 10px; display: block;
        }
        .ts-card.bad .ts-card-label { color: #f87171; }
        .ts-card.good .ts-card-label { color: #4ade80; }

        /* Card quote */
        .ts-card-quote {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: clamp(15px, 2vw, 18px);
          color: var(--text-primary);
          line-height: 1.55;
          margin-bottom: 12px;
        }

        /* Card note — 1 sentence */
        .ts-card-note {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: var(--text-secondary);
          line-height: 1.6;
          padding-top: 10px;
          border-top: 1px solid var(--border-subtle);
        }
        .ts-card.good .ts-card-note {
          color: var(--text-secondary);
        }

        /* Divider between scenarios */
        .ts-divider {
          width: 1px; height: 40px;
          background: var(--border-subtle);
          margin: 40px auto;
        }

        /* Closing line */
        .ts-closing {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.1em;
          color: var(--text-tertiary);
          margin-top: 40px;
          text-align: center;
        }

        /* ── Ticker ── */
        .ts-ticker-section {
          background: var(--bg-base);
          border-top: 1px solid var(--border-subtle);
          padding: 32px 0;
          overflow: hidden;
        }
        .ts-ticker-wrap { position: relative; }
        .ts-ticker-wrap::before, .ts-ticker-wrap::after {
          content: ''; position: absolute; top: 0; bottom: 0;
          width: 100px; z-index: 2; pointer-events: none;
        }
        .ts-ticker-wrap::before {
          left: 0;
          background: linear-gradient(to right, var(--bg-base), transparent);
        }
        .ts-ticker-wrap::after {
          right: 0;
          background: linear-gradient(to left, var(--bg-base), transparent);
        }
        .ts-ticker {
          display: flex; align-items: center;
          animation: ts-scroll 32s linear infinite;
          width: max-content;
        }
        .ts-ticker:hover { animation-play-state: paused; }
        @keyframes ts-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .ts-ticker-item {
          display: flex; align-items: center; gap: 9px;
          padding: 0 24px; white-space: nowrap; opacity: 0.6;
          transition: opacity 200ms;
        }
        .ts-ticker-item:hover { opacity: 1; }
        .ts-ticker-logo {
          width: 18px; height: 18px; border-radius: 4px;
          object-fit: contain; background: #fff; padding: 2px; flex-shrink: 0;
        }
        .ts-ticker-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500; color: var(--text-secondary);
        }
        .ts-ticker-dot {
          width: 3px; height: 3px; border-radius: 50%;
          background: var(--border-subtle); flex-shrink: 0;
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .ts-section { padding: 72px 20px 64px; }
          .ts-h2 { margin-bottom: 44px; }
          .ts-scenario { margin-bottom: 44px; }
          .ts-card { padding: 18px 16px 14px; }
        }
      `}</style>

      {/* ── Scenarios section ── */}
      <section id="truth" className="ts-section">
        <div ref={ref} className="ts-inner">

          <p data-reveal className="ts-label">WHAT IS ACTUALLY CHANGING</p>
          <h2 data-reveal className="ts-h2">
            Everyone has the same AI.<br />
            <em>Not everyone knows what to do with it.</em>
          </h2>

          {SCENARIOS.map((s, si) => (
            <div key={si}>
              {si > 0 && <div data-reveal className="ts-divider" />}

              <div data-reveal className="ts-scenario">
                <p className="ts-setup">{s.setup}</p>
                <p className="ts-trigger">"{s.trigger}"</p>

                <div className="ts-cards">
                  {/* Bad card */}
                  <div className="ts-card bad">
                    <span className="ts-card-label">✕ {s.bad.label}</span>
                    <p className="ts-card-quote">"{s.bad.quote}"</p>
                    <p className="ts-card-note">{s.bad.note}</p>
                  </div>

                  {/* Good card */}
                  <div className="ts-card good">
                    <span className="ts-card-label">✓ {s.good.label}</span>
                    <p className="ts-card-quote">"{s.good.quote}"</p>
                    <p className="ts-card-note">{s.good.note}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <p data-reveal className="ts-closing">
            This gap is learnable. The lab exists to close it.
          </p>

        </div>
      </section>

      {/* ── Ticker ── */}
      <div className="ts-ticker-section">
        <div className="ts-ticker-wrap">
          <div className="ts-ticker">
            {[...COMPANIES, ...COMPANIES].map((c, i) => (
              <div key={i} className="ts-ticker-item">
                <img
                  className="ts-ticker-logo"
                  src={`https://logo.clearbit.com/${c.domain}`}
                  alt={c.name}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <span className="ts-ticker-name">{c.name}</span>
                <span className="ts-ticker-dot" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
