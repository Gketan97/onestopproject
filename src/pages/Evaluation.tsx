import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import InterestForm from '../components/InterestForm'

const WA_URL = 'https://wa.me/919XXXXXXXXX?text=Hi%20Ketan%2C%20I%27d%20like%20to%20reserve%20a%20seat%20for%20the%20Saturday%20AI%20Problem%20Solving%20Lab.'

// ── System prompt ─────────────────────────────────────────────
const SYSTEM = `You are Ketan Goel — Analytics Manager at Meesho with 7 years evaluating how professionals think through business problems. You have reviewed hundreds of responses to analytical questions and know exactly what separates sharp thinkers from average ones.

The person was asked:
"You opened the Swiggy app, browsed through restaurants for about 5 minutes, and then closed it without ordering anything. What do you think happened?"

This question tests analytical thinking, not knowledge of Swiggy. A strong response:
- Structures the problem space before listing causes
- Distinguishes between user-side reasons and product/business-side reasons  
- Prioritises the most likely hypotheses rather than listing everything equally
- Shows curiosity about data — what would they look at to confirm their hypothesis?
- Reaches a point of view rather than staying neutral

A weak response:
- Lists 5-8 possible reasons with equal weight and no prioritisation
- Stays only on the surface (price, time, mood) without going deeper
- Has no hypothesis — just a list of guesses
- Makes no attempt to distinguish likely from unlikely

Evaluate what they wrote. Be direct. Be specific to what they actually said. Sound like a mentor, not a teacher.

Return ONLY valid JSON with no markdown, no backticks, no explanation outside the JSON:

{
  "verdict": "<5-7 words. The single most accurate description of how this person thinks. E.g: 'Good breadth. No prioritisation.' or 'Lists causes, avoids committing to one.' or 'Strong structure. Sharp hypothesis.' Make it feel like a real read of this specific person.>",
  "overall": <integer 1 to 5>,
  "passed": <boolean — true only if overall >= 4>,
  "summary": "<3 sentences. Specific to what they wrote. Start with the most accurate observation about their thinking style. Name the single biggest strength. Then name the single biggest gap. Be direct, not harsh.>",
  "dimensions": [
    {
      "name": "Problem Structuring",
      "score": <1-5>,
      "observation": "<One sharp, specific sentence about what you saw in their response — or what was missing.>"
    },
    {
      "name": "Hypothesis Quality",
      "score": <1-5>,
      "observation": "<Did they commit to a most-likely cause with reasoning, or list possibilities equally?>"
    },
    {
      "name": "Depth of Thinking",
      "score": <1-5>,
      "observation": "<Did they go beyond the surface? Did they think about what data would tell them more?>"
    },
    {
      "name": "Prioritisation",
      "score": <1-5>,
      "observation": "<Did they rank or filter their ideas, or give everything equal weight?>"
    },
    {
      "name": "Business Lens",
      "score": <1-5>,
      "observation": "<Did they think about why this matters to the business, not just to the user?>"
    }
  ],
  "what_strong_looks_like": "<2-3 sentences. Paint a vivid, specific picture of what a strong response to this question looks like. Don't lecture — show. Make the reader feel the gap and want to close it.>",
  "one_thing": "<One sentence. The single most impactful thinking habit this person should build. Make it specific to what they wrote, not generic advice.>",
  "ketan_note": "<1-2 sentences in Ketan's voice — personal, direct, encouraging without being soft. Something he would actually say to this person if they were sitting across from him.>"
}`

// ── Types ─────────────────────────────────────────────────────
interface Dim { name: string; score: number; observation: string }
interface EvalResult {
  verdict: string
  overall: number
  passed: boolean
  summary: string
  dimensions: Dim[]
  what_strong_looks_like: string
  one_thing: string
  ketan_note: string
}

// ── Transformation cards ──────────────────────────────────────
const TRANSFORMATIONS = [
  {
    before: 'Manager asks "what happened?" You say "it could be many things, let me investigate."',
    after: 'You walk in with one hypothesis, your reasoning, and what you already checked.',
  },
  {
    before: 'You use AI to write the analysis faster — but the thinking is still shallow.',
    after: 'You use AI to challenge your own hypothesis before anyone else gets the chance to.',
  },
  {
    before: 'You present findings. One question from the room and you are back to "let me check."',
    after: 'You present a recommendation. You have already answered their pushback in slide 2.',
  },
  {
    before: 'You know something is wrong with the numbers. You cannot say what or why.',
    after: 'You can name the problem, trace it to a root cause, and say what to fix first.',
  },
]

// ── Score bar ─────────────────────────────────────────────────
function ScoreBar({ score }: { score: number }) {
  const color = score <= 2 ? '#f87171' : score === 3 ? '#fbbf24' : '#4ade80'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
      <div style={{ flex: 1, height: 3, background: 'var(--border-subtle)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${(score / 5) * 100}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 900ms ease' }} />
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color, minWidth: 28, textAlign: 'right' }}>{score}/5</span>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────
export default function Evaluation() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<'loading' | 'result' | 'error'>('loading')
  const [result, setResult] = useState<EvalResult | null>(null)
  const [errMsg, setErrMsg] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const answer = sessionStorage.getItem('signal_answer')
    if (!answer) { navigate('/diagnostic'); return }

    // BYPASS — mock result for UI testing
    setTimeout(() => {
      setResult({
        verdict: 'Good breadth. No prioritisation.',
        overall: 2,
        passed: false,
        summary: 'The response covers a wide range of possible reasons with genuine curiosity. The biggest strength is noticing that 5 minutes of browsing signals intent — most people miss that. The core gap: all possibilities are listed with equal weight and there is no commitment to a most-likely cause.',
        dimensions: [
          { name: 'Problem Structuring', score: 2, observation: 'Listed causes without first breaking the problem into a logical structure.' },
          { name: 'Hypothesis Quality', score: 2, observation: 'Many possibilities raised but no single hypothesis committed to with reasoning.' },
          { name: 'Depth of Thinking', score: 3, observation: 'The intent signal observation was sharp — 5 minutes of browsing means they wanted to order.' },
          { name: 'Prioritisation', score: 1, observation: 'All reasons given equal weight. No filtering applied.' },
          { name: 'Business Lens', score: 2, observation: 'Stayed mostly on the user side without connecting to what the business should do.' },
        ],
        what_strong_looks_like: 'A strong response uses the 5-minute browse as the anchor — intent was clearly there. From that, it narrows to 2 high-probability causes (delivery time or price shock at checkout) and picks the most likely one with a reason. It ends with what one data point would confirm or refute it.',
        one_thing: 'Pick the single most likely reason and defend it — listing everything equally is not analysis, it is description.',
        ketan_note: 'You caught the intent signal — that is actually a strong instinct that most people skip. Now train yourself to use that observation to narrow down, not open up.',
      })
      setPhase('result')
    }, 1500)
  }, [])

  useEffect(() => {
    if (phase !== 'result') return
    setTimeout(() => {
      bodyRef.current?.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(18px)'
        setTimeout(() => {
          el.style.transition = 'opacity 0.55s ease, transform 0.55s ease'
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
        }, i * 75)
      })
    }, 60)
  }, [phase])

  const r = result
  const scoreColor = !r ? '#f87171' : r.overall <= 2 ? '#f87171' : r.overall === 3 ? '#fbbf24' : '#4ade80'

  return (
    <>
      <style>{`
        .eval-page { min-height: 100vh; background: var(--bg-base); display: flex; flex-direction: column; }
        .eval-topbar {
          height: 60px; display: flex; align-items: center; padding: 0 32px;
          border-bottom: 1px solid var(--border-subtle); background: var(--bg-base);
          position: sticky; top: 0; z-index: 10; justify-content: space-between;
        }
        .eval-logo {
          font-family: 'DM Mono', monospace; font-size: 13px;
          letter-spacing: 0.12em; color: var(--text-tertiary);
        }
        .eval-logo span {
          background: linear-gradient(135deg, #FF6B9D, #A855F7);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .eval-steps { display: flex; gap: 6px; }
        .eval-step { width: 24px; height: 3px; border-radius: 2px; background: var(--border-subtle); }
        .eval-step.done { background: var(--accent); opacity: 0.35; }
        .eval-step.active { background: var(--accent); }

        /* Loading */
        .eval-loading {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 24px;
        }
        .eval-spinner { width: 52px; height: 52px; border-radius: 50%; position: relative; }
        .eval-spinner::before {
          content: ''; position: absolute; inset: 0; border-radius: 50%;
          border: 2px solid var(--border-subtle); border-top-color: var(--accent);
          animation: spin 1s linear infinite;
        }
        .eval-spinner::after {
          content: ''; position: absolute; inset: 8px; border-radius: 50%;
          border: 1px solid var(--border-subtle); border-bottom-color: #FF6B9D;
          animation: spin 1.6s linear infinite reverse;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .eval-loading-label {
          font-family: 'DM Mono', monospace; font-size: 12px;
          letter-spacing: 0.14em; color: var(--text-tertiary);
        }
        .eval-loading-sub {
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          color: var(--text-tertiary); text-align: center; max-width: 260px; line-height: 1.65;
        }

        /* Error */
        .eval-error {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 16px; padding: 40px;
          text-align: center;
        }
        .eval-error h2 { font-family: 'Instrument Serif', serif; font-size: 24px; color: var(--text-primary); font-weight: 400; }
        .eval-error p { font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--text-tertiary); max-width: 340px; line-height: 1.65; }
        .eval-error-btn {
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
          color: var(--bg-base); background: var(--text-primary);
          border: none; border-radius: 100px; padding: 12px 28px; cursor: pointer;
        }

        /* Body */
        .eval-body { max-width: 800px; margin: 0 auto; width: 100%; padding: 56px 32px 100px; }

        /* Verdict */
        .eval-verdict-row {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 24px; margin-bottom: 40px; padding-bottom: 40px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .eval-eyebrow {
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 0.16em; color: var(--accent); margin-bottom: 12px;
        }
        .eval-verdict {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(22px, 3vw, 34px);
          font-style: italic; color: var(--text-primary);
          line-height: 1.25; margin-bottom: 16px;
        }
        .eval-summary {
          font-family: 'DM Sans', sans-serif; font-size: 16px;
          line-height: 1.75; color: var(--text-secondary); max-width: 540px;
        }
        .eval-score {
          flex-shrink: 0; width: 86px; height: 86px; border-radius: 50%;
          border: 2px solid; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 1px;
        }
        .eval-score-num { font-family: 'Instrument Serif', serif; font-size: 32px; line-height: 1; }
        .eval-score-of { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.06em; color: var(--text-tertiary); }

        .eval-sec-label {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.16em; color: var(--text-tertiary);
          margin-bottom: 14px; margin-top: 40px;
        }

        /* Dimensions */
        .eval-dims { display: flex; flex-direction: column; gap: 10px; }
        .eval-dim {
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 14px; padding: 18px 22px;
        }
        .eval-dim-top { display: flex; align-items: center; gap: 16px; margin-bottom: 8px; }
        .eval-dim-name { font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; color: var(--text-primary); min-width: 160px; }
        .eval-dim-obs { font-family: 'DM Sans', sans-serif; font-size: 13px; line-height: 1.6; color: var(--text-secondary); }

        /* Strong looks like */
        .eval-strong {
          background: rgba(168,85,247,0.05); border: 1px solid rgba(168,85,247,0.15);
          border-radius: 14px; padding: 24px 26px;
        }
        .eval-strong-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.14em; color: var(--accent); margin-bottom: 10px; }
        .eval-strong-text { font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.75; color: var(--text-secondary); }

        /* One thing */
        .eval-one {
          border-left: 3px solid var(--accent); border-radius: 0 12px 12px 0;
          background: var(--bg-elevated); padding: 20px 24px;
        }
        .eval-one-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.14em; color: var(--accent); margin-bottom: 10px; }
        .eval-one-text { font-family: 'Instrument Serif', serif; font-size: 18px; font-style: italic; color: var(--text-primary); line-height: 1.55; }

        /* Ketan note */
        .eval-ketan {
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 14px; padding: 22px 24px;
          display: flex; gap: 16px; align-items: flex-start;
        }
        .eval-ketan-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(255,107,157,0.3), rgba(168,85,247,0.3));
          display: flex; align-items: center; justify-content: center;
          font-family: 'Instrument Serif', serif; font-size: 16px; color: var(--text-primary);
          flex-shrink: 0;
        }
        .eval-ketan-content {}
        .eval-ketan-name { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; color: var(--accent); margin-bottom: 8px; }
        .eval-ketan-text { font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.7; color: var(--text-secondary); font-style: italic; }

        /* Transformation */
        .eval-transform { margin-top: 64px; padding-top: 64px; border-top: 1px solid var(--border-subtle); }
        .eval-transform-label { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.16em; color: var(--accent); margin-bottom: 14px; }
        .eval-transform-h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(24px, 3.5vw, 38px); font-weight: 400;
          color: var(--text-primary); line-height: 1.2; margin-bottom: 12px;
        }
        .eval-transform-h2 em {
          font-style: italic;
          background: linear-gradient(135deg, #FF6B9D, #A855F7);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .eval-transform-sub {
          font-family: 'DM Sans', sans-serif; font-size: 16px;
          line-height: 1.75; color: var(--text-secondary);
          max-width: 520px; margin-bottom: 36px;
        }
        .eval-transform-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 12px; margin-bottom: 48px;
        }
        .eval-transform-card {
          background: var(--bg-elevated); border: 1px solid var(--border-subtle);
          border-radius: 14px; padding: 22px 20px;
        }
        .eval-t-before {
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: var(--text-tertiary); line-height: 1.55;
          padding: 10px 12px;
          background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.1);
          border-radius: 8px; margin-bottom: 8px;
        }
        .eval-t-before::before { content: '✕  '; color: #f87171; }
        .eval-t-after {
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: var(--text-secondary); line-height: 1.55;
          padding: 10px 12px;
          background: rgba(34,197,94,0.05); border: 1px solid rgba(34,197,94,0.12);
          border-radius: 8px;
        }
        .eval-t-after::before { content: '✓  '; color: #4ade80; }

        /* Lab card */
        .eval-lab {
          background: var(--bg-elevated);
          border: 1px solid rgba(168,85,247,0.25);
          border-radius: 24px; padding: 52px 48px;
          text-align: center; position: relative; overflow: hidden;
        }
        .eval-lab::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(168,85,247,0.6), rgba(255,107,157,0.6), transparent);
        }
        .eval-lab-eyebrow { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.16em; color: var(--accent); margin-bottom: 16px; }
        .eval-lab-h3 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(22px, 3vw, 36px); font-weight: 400;
          color: var(--text-primary); line-height: 1.2; margin-bottom: 14px;
        }
        .eval-lab-body {
          font-family: 'DM Sans', sans-serif; font-size: 15px;
          line-height: 1.75; color: var(--text-secondary);
          max-width: 440px; margin: 0 auto 32px;
        }
        .eval-lab-body strong { color: var(--text-primary); font-weight: 500; }
        .eval-lab-stats {
          display: flex; align-items: center; justify-content: center;
          gap: 32px; flex-wrap: wrap; margin-bottom: 32px;
        }
        .eval-lab-stat { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .eval-lab-stat-val { font-family: 'Instrument Serif', serif; font-size: 24px; color: var(--text-primary); }
        .eval-lab-stat-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; color: var(--text-tertiary); }
        .eval-lab-sep { width: 1px; height: 36px; background: var(--border-subtle); }
        .eval-lab-btn {
          font-family: 'DM Sans', sans-serif; font-size: 17px; font-weight: 600;
          color: #fff; background: var(--accent); border: none;
          border-radius: 100px; padding: 18px 52px; cursor: pointer;
          transition: all 200ms ease; display: inline-block; margin-bottom: 14px;
        }
        .eval-lab-btn:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(168,85,247,0.35); }
        .eval-lab-trust { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-tertiary); letter-spacing: 0.06em; }
        .eval-retry { text-align: center; margin-top: 24px; }
        .eval-retry-btn {
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          color: var(--text-tertiary); background: none; border: none;
          cursor: pointer; text-decoration: underline; text-underline-offset: 3px;
          transition: color 150ms;
        }
        .eval-retry-btn:hover { color: var(--text-secondary); }

        @media (max-width: 640px) {
          .eval-body { padding: 40px 20px 80px; }
          .eval-verdict-row { flex-direction: column; gap: 20px; }
          .eval-score { width: 72px; height: 72px; }
          .eval-score-num { font-size: 28px; }
          .eval-dim-top { flex-direction: column; align-items: flex-start; gap: 8px; }
          .eval-dim-name { min-width: unset; }
          .eval-transform-grid { grid-template-columns: 1fr; }
          .eval-lab { padding: 40px 24px; border-radius: 20px; }
          .eval-lab-btn { width: 100%; }
          .eval-topbar { padding: 0 20px; }
        }
      `}</style>

      <div className="eval-page">
        <div className="eval-topbar">
          <span className="eval-logo">onestop<span>careers</span></span>
          <div className="eval-steps">
            <div className="eval-step done" />
            <div className="eval-step done" />
            <div className="eval-step active" />
          </div>
        </div>

        {phase === 'loading' && (
          <div className="eval-loading">
            <div className="eval-spinner" />
            <div className="eval-loading-label">READING YOUR THINKING</div>
            <p className="eval-loading-sub">Evaluating your response across multiple dimensions…</p>
          </div>
        )}

        {phase === 'error' && (
          <div className="eval-error">
            <h2>Something went wrong</h2>
            <p>The evaluation couldn't complete. {errMsg && `(${errMsg})`}</p>
            <button className="eval-error-btn" onClick={() => navigate('/diagnostic')}>Try Again</button>
          </div>
        )}

        {phase === 'result' && r && (
          <div className="eval-body" ref={bodyRef}>

            {/* Verdict + Score */}
            <div data-reveal className="eval-verdict-row">
              <div>
                <p className="eval-eyebrow">YOUR EVALUATION</p>
                <h1 className="eval-verdict">"{r.verdict}"</h1>
                <p className="eval-summary">{r.summary}</p>
              </div>
              <div className="eval-score" style={{ borderColor: scoreColor, color: scoreColor }}>
                <span className="eval-score-num">{r.overall}</span>
                <span className="eval-score-of">OUT OF 5</span>
              </div>
            </div>

            {/* Dimensions */}
            <p data-reveal className="eval-sec-label">DIMENSION BREAKDOWN</p>
            <div data-reveal className="eval-dims">
              {r.dimensions.map((d, i) => (
                <div key={i} className="eval-dim">
                  <div className="eval-dim-top">
                    <span className="eval-dim-name">{d.name}</span>
                    <ScoreBar score={d.score} />
                  </div>
                  <p className="eval-dim-obs">{d.observation}</p>
                </div>
              ))}
            </div>

            {/* What strong looks like */}
            <p data-reveal className="eval-sec-label">WHAT STRONG THINKING LOOKS LIKE HERE</p>
            <div data-reveal className="eval-strong">
              <div className="eval-strong-label">THE STANDARD</div>
              <p className="eval-strong-text">{r.what_strong_looks_like}</p>
            </div>

            {/* One thing */}
            <p data-reveal className="eval-sec-label">THE ONE THING TO WORK ON</p>
            <div data-reveal className="eval-one">
              <div className="eval-one-label">FOCUS HERE</div>
              <p className="eval-one-text">{r.one_thing}</p>
            </div>

            {/* Ketan's note */}
            <p data-reveal className="eval-sec-label">A NOTE FROM KETAN</p>
            <div data-reveal className="eval-ketan">
              <div className="eval-ketan-avatar">KG</div>
              <div className="eval-ketan-content">
                <div className="eval-ketan-name">KETAN GOEL · ANALYTICS MANAGER, MEESHO</div>
                <p className="eval-ketan-text">{r.ketan_note}</p>
              </div>
            </div>

            {/* Transformation + Lab */}
            <div data-reveal className="eval-transform">
              <p className="eval-transform-label">WHAT CHANGES WITH THE RIGHT TRAINING</p>
              <h2 className="eval-transform-h2">
                This is a skill.<br />
                <em>Skills can be built.</em>
              </h2>
              <p className="eval-transform-sub">
                The gap you just saw isn't about intelligence. It's a thinking pattern —
                and thinking patterns can be retrained. But only through real problems
                with real feedback. Not videos. Not courses. Practice.
              </p>

              <div className="eval-transform-grid">
                {TRANSFORMATIONS.map((t, i) => (
                  <div key={i} className="eval-transform-card">
                    <div className="eval-t-before">{t.before}</div>
                    <div className="eval-t-after">{t.after}</div>
                  </div>
                ))}
              </div>

              <div className="eval-lab">
                <p className="eval-lab-eyebrow">SATURDAY AI PROBLEM SOLVING LAB</p>
                <h3 className="eval-lab-h3">
                  Work through real problems.<br />
                  Get Ketan's feedback on your thinking.
                </h3>
                <p className="eval-lab-body">
                  Every cohort runs across two Saturdays. You get pre-read material,
                  a live problem-solving session, a mid-week doubt session, and a full evaluation.
                  <strong> Max 5 people — every person gets real attention.</strong>
                </p>
                <div className="eval-lab-stats">
                  <div className="eval-lab-stat">
                    <span className="eval-lab-stat-val">₹2,500</span>
                    <span className="eval-lab-stat-label">PER SESSION</span>
                  </div>
                  <div className="eval-lab-sep" />
                  <div className="eval-lab-stat">
                    <span className="eval-lab-stat-val">5</span>
                    <span className="eval-lab-stat-label">MAX PEOPLE</span>
                  </div>
                  <div className="eval-lab-sep" />
                  <div className="eval-lab-stat">
                    <span className="eval-lab-stat-val">Live</span>
                    <span className="eval-lab-stat-label">EVERY SATURDAY</span>
                  </div>
                </div>
                <button className="eval-lab-btn" onClick={() => setFormOpen(true)}>
                  Reserve My Seat →
                </button>
                <p className="eval-lab-trust">No auto-renewal · Pay per session · Ketan confirms within 24hrs</p>
              </div>


              {/* Outcomes */}
              <div style={{ marginTop: 56, paddingTop: 56, borderTop: '1px solid var(--border-subtle)' }}>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, letterSpacing: '0.16em', color: 'var(--accent)', marginBottom: 12 }}>WHAT YOU WALK AWAY WITH FROM THE LAB</p>
                <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 12 }}>Three things that transfer to every problem after this.</h3>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 48, maxWidth: 520 }}>The case is the vehicle. These are what you keep.</p>

                {/* 01 — Framework */}
                <div style={{ marginBottom: 48 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 20 }}>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--accent)', flexShrink: 0, paddingTop: 3, letterSpacing: '0.1em' }}>01</span>
                    <div>
                      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, color: 'var(--text-primary)', fontWeight: 400, marginBottom: 6 }}>The 8-step problem solving framework</div>
                      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>A repeatable way to go from a messy problem to a clear recommendation — works on any business question. Tap any step.</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginLeft: 32 }}>
                    {[
                      { n: '01', t: 'Understand the business', b: 'Before touching the problem, understand what the company actually cares about — its revenue model and growth levers.' },
                      { n: '02', t: 'Define the real problem', b: 'Separate what you have been asked from what you should actually be solving. Most people skip this.' },
                      { n: '03', t: 'Break it into parts', b: 'Structure the problem space before investigating. What are the logical sub-problems?' },
                      { n: '04', t: 'Generate hypotheses', b: 'Not a list of guesses — a structured set of testable explanations ranked by likelihood.' },
                      { n: '05', t: 'Prioritise ruthlessly', b: 'You cannot investigate everything. Which hypotheses have the highest probability and impact if true?' },
                      { n: '06', t: 'Structure your analysis', b: 'What data confirms or refutes each hypothesis? How do you use AI to move faster without losing rigour?' },
                      { n: '07', t: 'Form a recommendation', b: 'Not findings. A specific recommendation with a reason and a next step someone can act on.' },
                      { n: '08', t: 'Stress test', b: 'Where are you most likely to be wrong? Anticipating pushback before it comes is what separates sharp thinkers.' },
                    ].map((s, i) => (
                      <div key={i} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '16px 14px', cursor: 'default' }}>
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: 8 }}>{s.n}</div>
                        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.35, marginBottom: 8 }}>{s.t}</div>
                        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.b}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 02 — AI in decision making */}
                <div style={{ marginBottom: 48 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 20 }}>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--accent)', flexShrink: 0, paddingTop: 3, letterSpacing: '0.1em' }}>02</span>
                    <div>
                      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, color: 'var(--text-primary)', fontWeight: 400, marginBottom: 6 }}>How to use AI in real decision making</div>
                      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>Not prompting tips. The actual mental model for when to use AI, how to direct it, and how to verify what it gives you.</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginLeft: 32 }}>
                    {[
                      { label: 'STRUCTURE', body: 'Use AI to break a vague problem into a logical tree before you start investigating.' },
                      { label: 'GENERATE', body: 'Use AI to surface hypotheses you might have missed — then decide which are worth testing.' },
                      { label: 'PRESSURE-TEST', body: 'Use AI to challenge your own recommendation before someone else does it in the room.' },
                      { label: 'COMMUNICATE', body: 'Use AI to turn a messy analysis into a sharp narrative your stakeholders can act on.' },
                    ].map((c, i) => (
                      <div key={i} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '18px 20px' }}>
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: 8 }}>{c.label}</div>
                        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{c.body}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 03 — Business context */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 20 }}>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--accent)', flexShrink: 0, paddingTop: 3, letterSpacing: '0.1em' }}>03</span>
                    <div>
                      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, color: 'var(--text-primary)', fontWeight: 400, marginBottom: 6 }}>How to read business context fast</div>
                      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>Pick up any company, any problem, and quickly understand what actually matters before you start solving.</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginLeft: 32 }}>
                    {[
                      { q: 'How does this company actually make money?', icon: '💰' },
                      { q: 'What is this team optimising for right now?', icon: '🎯' },
                      { q: 'What would a win look like for this business?', icon: '🏆' },
                      { q: 'What data matters here — and what is noise?', icon: '📊' },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '16px 18px' }}>
                        <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.q}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="eval-retry">
                <button className="eval-retry-btn" onClick={() => navigate('/diagnostic')}>
                  Retake the diagnostic
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <InterestForm open={formOpen} onClose={() => setFormOpen(false)} waUrl={WA_URL} />
    </>
  )
}
