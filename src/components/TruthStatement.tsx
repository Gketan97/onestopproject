import { useEffect, useRef } from 'react'

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

  const stages = [
    {
      tag: '1–3 years in',
      quote: '"I used AI to build the whole report. My manager still said it lacked depth. I don\'t know what I\'m missing."',
      reality: 'The output looked polished. The thinking behind it was shallow. AI made it harder to see the gap.',
    },
    {
      tag: '3–6 years in',
      quote: '"I have more experience than most people in the room. But somehow I still struggle to get my point across when it matters."',
      reality: 'Experience builds knowledge. It doesn\'t automatically build the ability to reason under pressure and make your case stick.',
    },
    {
      tag: '6+ years in',
      quote: '"My title has grown. But the decisions I\'m expected to make now are harder, faster, and with less support than before."',
      reality: 'The higher you go, the more it\'s about your judgment — not your output. Most people were never taught how to build that.',
    },
  ]

  const companies = [
    'Flipkart', 'Zomato', 'Meta', 'American Express',
    'Meesho', 'Zepto', 'PhonePe', 'McKinsey', 'Goldman Sachs', 'BCG',
  ]

  return (
    <>
      <style>{`
        .truth-section {
          background: var(--bg-surface);
          padding: 112px 32px;
          border-top: 1px solid var(--border-subtle);
        }
        .truth-inner { max-width: 1100px; margin: 0 auto; }

        /* Heading */
        .truth-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.16em;
          color: var(--accent); margin-bottom: 16px;
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
          font-family: 'DM Sans', sans-serif;
          font-size: 17px; line-height: 1.8;
          color: var(--text-secondary); max-width: 640px; margin-bottom: 64px;
        }
        .truth-intro strong { color: var(--text-primary); font-weight: 500; }

        /* Experience stages */
        .truth-stages {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 16px; margin-bottom: 64px;
        }
        .truth-stage {
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 16px; padding: 28px 24px;
          display: flex; flex-direction: column; gap: 20px;
        }
        .truth-stage-tag {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.12em;
          color: var(--accent); text-transform: uppercase;
        }
        .truth-stage-quote {
          font-family: 'Instrument Serif', serif;
          font-size: 16px; font-style: italic;
          color: var(--text-primary); line-height: 1.65; flex: 1;
        }
        .truth-stage-reality {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; line-height: 1.65;
          color: var(--text-secondary);
          padding-top: 16px;
          border-top: 1px solid var(--border-subtle);
        }

        /* The real shift */
        .truth-shift {
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 20px; padding: 48px;
          margin-bottom: 64px;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 48px; align-items: start;
        }
        .truth-shift-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.14em;
          color: var(--accent); margin-bottom: 16px;
        }
        .truth-shift-h3 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(22px, 2.5vw, 30px);
          color: var(--text-primary); font-weight: 400;
          line-height: 1.3; margin-bottom: 20px;
        }
        .truth-shift-body {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; line-height: 1.8;
          color: var(--text-secondary); margin-bottom: 14px;
        }
        .truth-shift-body strong { color: var(--text-primary); font-weight: 500; }
        .truth-shift-body:last-child { margin-bottom: 0; }

        /* Before / after */
        .truth-examples { display: flex; flex-direction: column; gap: 12px; }
        .truth-example {
          border-radius: 12px; padding: 20px 22px; border: 1px solid;
        }
        .truth-example.bad {
          background: rgba(239,68,68,0.05);
          border-color: rgba(239,68,68,0.15);
        }
        .truth-example.good {
          background: rgba(34,197,94,0.05);
          border-color: rgba(34,197,94,0.18);
        }
        .truth-example-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.12em;
          margin-bottom: 10px;
        }
        .truth-example.bad .truth-example-label { color: #f87171; }
        .truth-example.good .truth-example-label { color: #4ade80; }
        .truth-example-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; line-height: 1.6;
          color: var(--text-secondary);
        }
        .truth-example-text strong { color: var(--text-primary); font-weight: 500; }

        /* Companies */
        .truth-companies-wrap { text-align: center; }
        .truth-companies-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.14em;
          color: var(--text-tertiary); margin-bottom: 16px;
        }
        .truth-companies {
          display: flex; align-items: center; justify-content: center;
          flex-wrap: wrap; gap: 8px;
        }
        .truth-company {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: var(--text-secondary);
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 6px; padding: 7px 16px;
        }

        @media (max-width: 960px) {
          .truth-stages { grid-template-columns: 1fr; }
          .truth-shift { grid-template-columns: 1fr; gap: 32px; padding: 32px; }
          .truth-section { padding: 80px 24px; }
        }
        @media (max-width: 480px) {
          .truth-section { padding: 64px 20px; }
          .truth-shift { padding: 24px; }
        }
      `}</style>

      <section id="truth" className="truth-section">
        <div ref={ref} className="truth-inner">

          <p data-reveal className="truth-label">WHAT'S ACTUALLY HAPPENING</p>
          <h2 data-reveal className="truth-h2">
            AI didn't take the jobs.<br />
            <em>It raised the bar for keeping them.</em>
          </h2>
          <p data-reveal className="truth-intro">
            Every company is doing more with smaller teams. The people who are safe
            aren't the ones who know the most tools — <strong>they're the ones who can
            think through a problem, make a clear call, and back it up.</strong> That skill
            matters whether you're in marketing, finance, operations, product, or consulting.
            And most people were never taught it.
          </p>

          {/* Experience stages — 3 quotes people recognise */}
          <div data-reveal className="truth-stages">
            {stages.map((s, i) => (
              <div key={i} className="truth-stage">
                <span className="truth-stage-tag">{s.tag}</span>
                <p className="truth-stage-quote">{s.quote}</p>
                <p className="truth-stage-reality">{s.reality}</p>
              </div>
            ))}
          </div>

          {/* The shift + before/after */}
          <div data-reveal className="truth-shift">
            <div>
              <p className="truth-shift-label">THE SKILL THAT SEPARATES THEM</p>
              <h3 className="truth-shift-h3">
                It's not about knowing more. It's about thinking better.
              </h3>
              <p className="truth-shift-body">
                The people who are getting promoted — and staying employed as teams shrink —
                all have one thing in common. <strong>They can take a messy, unclear
                situation and turn it into a sharp, defensible point of view.</strong>
              </p>
              <p className="truth-shift-body">
                That's not an analysis skill. It's not a tool skill.
                It's the ability to reason clearly and make decisions — using AI
                to move faster, not to think for you.
              </p>
              <p className="truth-shift-body">
                <strong>This is what companies like Flipkart, Zomato, Meta, and American Express
                now screen for in every role — not just technical ones.</strong>
              </p>
            </div>
            <div className="truth-examples">
              <div className="truth-example bad">
                <div className="truth-example-label">✕ WHAT MOST PEOPLE DO</div>
                <div className="truth-example-text">
                  "Sales dropped 12% last quarter. Could be seasonality,
                  pricing, or competitor activity. Need more data to say for sure."
                  <br /><br />
                  <strong>Observations without a point of view. Safe but useless.</strong>
                </div>
              </div>
              <div className="truth-example good">
                <div className="truth-example-label">✓ WHAT GETS YOU AHEAD</div>
                <div className="truth-example-text">
                  "The drop is concentrated in our mid-tier segment on weekends.
                  That points to a pricing or discovery issue, not seasonality.
                  Here's what I'd test first, and why."
                  <br /><br />
                  <strong>A clear position. A reason. A next step. This is what
                  good judgment looks like.</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Companies */}
          <div data-reveal className="truth-companies-wrap">
            <p className="truth-companies-label">THIS THINKING IS NOW EXPECTED AT</p>
            <div className="truth-companies">
              {companies.map((c, i) => (
                <span key={i} className="truth-company">{c}</span>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
