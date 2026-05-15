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

  const realities = [
    {
      tag: 'If you\'re 0–3 years in',
      headline: 'The entry-level job you trained for is disappearing.',
      body: 'Junior roles existed for one reason: seniors needed help executing their thinking. Research, reports, first drafts, data pulls, coordination — you were hired to extend someone else\'s reach. That\'s exactly what AI does now, faster and cheaper. The pipeline isn\'t slow. It\'s closing.',
      hard: 'Getting in without a clear ability to think independently is getting harder every month.',
    },
    {
      tag: 'If you\'re 3–6 years in',
      headline: 'You got promoted for executing well. That\'s no longer enough.',
      body: 'You\'re good at your job. You hit deadlines, produce solid work, manage up well. But when your manager says "what do you think we should do?" — you feel a gap. You were never taught to own the problem. You were taught to solve the one someone handed you. That worked before. It doesn\'t anymore.',
      hard: 'The next level requires judgment, not just reliability. Most people at this stage don\'t know the difference.',
    },
    {
      tag: 'If you\'re 6+ years in',
      headline: 'Your team is shrinking. Your job just got harder.',
      body: 'You used to leverage a team of juniors to produce the thinking. That team is half the size it was. Now you\'re expected to produce AND decide — with AI as your only support. The problem is: managing juniors and thinking clearly are completely different skills. Most senior professionals were never taught the second one.',
      hard: 'The people who thrive aren\'t the most experienced. They\'re the ones who can actually make the call.',
    },
  ]

  const companies = ['Flipkart', 'Zomato', 'Meta', 'American Express', 'Meesho', 'Zepto', 'PhonePe', 'McKinsey', 'BCG', 'Goldman Sachs']

  return (
    <>
      <style>{`
        .truth-section {
          background: var(--bg-surface);
          padding: 112px 32px;
          border-top: 1px solid var(--border-subtle);
        }
        .truth-inner { max-width: 1100px; margin: 0 auto; }

        .truth-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.16em;
          color: var(--accent); margin-bottom: 16px;
        }
        .truth-h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(30px, 4vw, 50px);
          line-height: 1.15; color: var(--text-primary);
          font-weight: 400; margin-bottom: 20px; max-width: 720px;
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
          color: var(--text-secondary); max-width: 660px; margin-bottom: 72px;
        }
        .truth-intro strong { color: var(--text-primary); font-weight: 500; }

        /* Reality cards */
        .truth-realities {
          display: flex; flex-direction: column; gap: 0;
          margin-bottom: 80px;
          border: 1px solid var(--border-subtle);
          border-radius: 20px; overflow: hidden;
        }
        .truth-reality {
          padding: 40px 44px;
          border-bottom: 1px solid var(--border-subtle);
          background: var(--bg-elevated);
          transition: background 200ms ease;
        }
        .truth-reality:last-child { border-bottom: none; }
        .truth-reality:hover { background: rgba(255,255,255,0.03); }
        .truth-reality-tag {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.12em;
          color: var(--accent); margin-bottom: 12px;
        }
        .truth-reality-headline {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(20px, 2vw, 26px);
          color: var(--text-primary); font-weight: 400;
          margin-bottom: 14px; line-height: 1.3;
        }
        .truth-reality-body {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; line-height: 1.8;
          color: var(--text-secondary); margin-bottom: 16px;
          max-width: 720px;
        }
        .truth-reality-hard {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; line-height: 1.7;
          color: var(--text-primary); font-weight: 500;
          padding: 14px 18px;
          background: rgba(168,85,247,0.07);
          border: 1px solid rgba(168,85,247,0.15);
          border-radius: 8px;
          display: inline-block;
        }

        /* Future section */
        .truth-future {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 48px; align-items: start;
          margin-bottom: 72px;
          padding: 48px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 20px;
        }
        .truth-future-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.14em;
          color: var(--accent); margin-bottom: 16px;
        }
        .truth-future-h3 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(22px, 2.5vw, 32px);
          color: var(--text-primary); font-weight: 400;
          line-height: 1.3; margin-bottom: 20px;
        }
        .truth-future-body {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; line-height: 1.8;
          color: var(--text-secondary); margin-bottom: 14px;
        }
        .truth-future-body strong { color: var(--text-primary); font-weight: 500; }
        .truth-future-body:last-child { margin-bottom: 0; }

        /* What good looks like */
        .truth-contrast { display: flex; flex-direction: column; gap: 12px; }
        .truth-contrast-card {
          border-radius: 14px; padding: 22px 24px; border: 1px solid;
        }
        .truth-contrast-card.bad {
          background: rgba(239,68,68,0.05); border-color: rgba(239,68,68,0.15);
        }
        .truth-contrast-card.good {
          background: rgba(34,197,94,0.05); border-color: rgba(34,197,94,0.18);
        }
        .truth-contrast-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.12em; margin-bottom: 12px;
        }
        .truth-contrast-card.bad .truth-contrast-label { color: #f87171; }
        .truth-contrast-card.good .truth-contrast-label { color: #4ade80; }
        .truth-contrast-scenario {
          font-family: 'DM Mono', monospace;
          font-size: 11px; letter-spacing: 0.06em;
          color: var(--text-tertiary); margin-bottom: 10px;
        }
        .truth-contrast-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; line-height: 1.7; color: var(--text-secondary);
        }
        .truth-contrast-text strong { color: var(--text-primary); font-weight: 500; }

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
          .truth-future { grid-template-columns: 1fr; gap: 32px; padding: 32px; }
          .truth-section { padding: 80px 24px; }
        }
        @media (max-width: 640px) {
          .truth-reality { padding: 28px 24px; }
          .truth-section { padding: 64px 20px; }
          .truth-future { padding: 24px; }
        }
      `}</style>

      <section id="truth" className="truth-section">
        <div ref={ref} className="truth-inner">

          <p data-reveal className="truth-label">WHAT'S ACTUALLY HAPPENING</p>
          <h2 data-reveal className="truth-h2">
            Jobs aren't disappearing.<br />
            <em>The jobs that don't require real thinking are.</em>
          </h2>
          <p data-reveal className="truth-intro">
            For decades, companies hired people to extend the reach of decision-makers —
            someone to pull the data, write the report, coordinate the team, prepare the slides.
            AI does all of that now. <strong>What's left — and what pays well — is the
            one thing AI can't replace: the ability to look at a messy situation
            and make a clear, confident call.</strong>
          </p>

          {/* The three realities */}
          <div data-reveal className="truth-realities">
            {realities.map((r, i) => (
              <div key={i} className="truth-reality">
                <div className="truth-reality-tag">{r.tag}</div>
                <div className="truth-reality-headline">{r.headline}</div>
                <p className="truth-reality-body">{r.body}</p>
                <span className="truth-reality-hard">{r.hard}</span>
              </div>
            ))}
          </div>

          {/* What the future looks like */}
          <div data-reveal className="truth-future">
            <div>
              <p className="truth-future-label">WHAT THE FUTURE LOOKS LIKE</p>
              <h3 className="truth-future-h3">
                One person who can think clearly is worth more than a team that can't decide.
              </h3>
              <p className="truth-future-body">
                The roles that are growing — and paying well — are the ones where someone
                can walk into ambiguity and come out with a decision. Not an analysis.
                Not a slide deck. <strong>A clear point of view, backed by reasoning,
                delivered with confidence.</strong>
              </p>
              <p className="truth-future-body">
                This isn't a product role or an analytics role or a consulting role.
                It cuts across all of them. It's the person who uses AI to move fast,
                thinks structurally to avoid blind spots, and makes calls others are afraid to make.
              </p>
              <p className="truth-future-body">
                <strong>Companies like Flipkart, Zomato, Meta, and American Express are
                already hiring for this — in every function, not just tech.</strong>
              </p>
            </div>
            <div className="truth-contrast">
              <div className="truth-contrast-card bad">
                <div className="truth-contrast-label">✕ WHAT GETS YOU STUCK</div>
                <div className="truth-contrast-scenario">SCENARIO: Sales dropped 18% this month.</div>
                <div className="truth-contrast-text">
                  "It could be seasonality, pricing, competition, or product issues.
                  We need to look at all of them and gather more data before drawing conclusions."
                  <br /><br />
                  <strong>Safe. Vague. Forgettable. This is most people's default.</strong>
                </div>
              </div>
              <div className="truth-contrast-card good">
                <div className="truth-contrast-label">✓ WHAT GETS YOU AHEAD</div>
                <div className="truth-contrast-scenario">SAME SCENARIO.</div>
                <div className="truth-contrast-text">
                  "The drop is concentrated in our weekend cohort in metro cities.
                  That rules out seasonality. My best hypothesis is a pricing change
                  that hit our price-sensitive segment hardest. Here's what I'd test first."
                  <br /><br />
                  <strong>A position. A reason. A next step. This is what good judgment sounds like.</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Companies */}
          <div data-reveal className="truth-companies-wrap">
            <p className="truth-companies-label">THIS IS NOW THE BAR AT</p>
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
