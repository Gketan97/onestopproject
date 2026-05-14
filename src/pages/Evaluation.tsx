import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import InterestForm from '../components/InterestForm'

const WA_URL = 'https://wa.me/919XXXXXXXXX?text=Hi%20Ketan%2C%20I%27d%20like%20to%20reserve%20a%20seat%20for%20the%20Friday%20AI%20Problem%20Solving%20Lab.'

// ── Types ────────────────────────────────────────────────────
interface DimScore {
  name: string
  score: number // 1–5
  gap: string
}

interface EvalResult {
  verdict: string         // 1-line verdict e.g. "Breadth without structure"
  overall: number         // 1–5
  summary: string         // 2–3 sentence overall read
  dimensions: DimScore[]
  whatYouMissed: string[] // 3–4 bullet strings
  eliteContrast: string   // What a senior analyst would add
  aspiration: string      // Forward-looking hook
}

// ── Evaluation prompt ────────────────────────────────────────
const EVAL_SYSTEM = `You are an elite analytics coach who evaluates how well professionals think through ambiguous business problems. You provide honest, psychologically sharp feedback that feels like mentorship from a senior analyst — never like a grade.

You will receive a user's written answer to this question:
"You opened the Swiggy app, browsed for 5 minutes, but did not place an order. What could have happened?"

Evaluate their response across 5 dimensions. Return ONLY a JSON object (no markdown, no explanation, no backticks) in this exact shape:

{
  "verdict": "<5-word verdict capturing the core thinking pattern, e.g. 'Surface hypotheses, no framework'>",
  "overall": <integer 1-5>,
  "summary": "<2-3 sentences: what the response reveals about how they think. Be direct but not harsh.>",
  "dimensions": [
    { "name": "Hypothesis Quality", "score": <1-5>, "gap": "<one sentence on what was missing or done well>" },
    { "name": "Structural Thinking", "score": <1-5>, "gap": "<one sentence>" },
    { "name": "Business Acumen", "score": <1-5>, "gap": "<one sentence>" },
    { "name": "User Empathy", "score": <1-5>, "gap": "<one sentence>" },
    { "name": "Prioritization", "score": <1-5>, "gap": "<one sentence>" }
  ],
  "whatYouMissed": [
    "<missed dimension 1>",
    "<missed dimension 2>",
    "<missed dimension 3>"
  ],
  "eliteContrast": "<2 sentences: what a senior analyst at Meesho/Swiggy would think about that a junior analyst typically misses>",
  "aspiration": "<1-2 sentences: forward-looking. What becomes possible when you think this way. Make it aspirational.>"
}

Be honest. Most people score 2–3 on overall. Reserve 5 for genuinely exceptional structural thinking with business depth and prioritization.`

// ── Helpers ──────────────────────────────────────────────────
async function runEvaluation(answer: string): Promise<EvalResult> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: EVAL_SYSTEM,
      messages: [{ role: 'user', content: answer }],
    }),
  })

  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const data = await res.json()
  const text = data.content?.find((b: { type: string }) => b.type === 'text')?.text ?? ''
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean) as EvalResult
}

function ScoreBar({ score }: { score: number }) {
  const pct = (score / 5) * 100
  const color = score <= 2 ? '#f87171' : score === 3 ? '#f59e0b' : '#4ade80'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
      <div style={{
        flex: 1, height: 3, background: 'var(--border-subtle)', borderRadius: 2, overflow: 'hidden'
      }}>
        <div style={{
          width: `${pct}%`, height: '100%', background: color, borderRadius: 2,
          transition: 'width 800ms cubic-bezier(0.4,0,0.2,1)'
        }} />
      </div>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 12,
        color: color, minWidth: 20, textAlign: 'right'
      }}>{score}/5</span>
    </div>
  )
}

// Fallback result for missing answer
const FALLBACK: EvalResult = {
  verdict: 'No answer detected',
  overall: 0,
  summary: 'It looks like you navigated here directly without completing the diagnostic. Start the diagnostic to get your personalised evaluation.',
  dimensions: [
    { name: 'Hypothesis Quality', score: 0, gap: 'Complete the diagnostic to see your score.' },
    { name: 'Structural Thinking', score: 0, gap: 'Complete the diagnostic to see your score.' },
    { name: 'Business Acumen', score: 0, gap: 'Complete the diagnostic to see your score.' },
    { name: 'User Empathy', score: 0, gap: 'Complete the diagnostic to see your score.' },
    { name: 'Prioritization', score: 0, gap: 'Complete the diagnostic to see your score.' },
  ],
  whatYouMissed: ['Take the diagnostic to see what you missed.'],
  eliteContrast: 'Senior analysts approach this differently. Take the diagnostic to find out how.',
  aspiration: 'Structured thinking is learnable. Start the 4-minute diagnostic.',
}

// ── Page ─────────────────────────────────────────────────────
export default function Evaluation() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<'loading' | 'reveal' | 'error'>('loading')
  const [result, setResult] = useState<EvalResult | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const revealRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const answer = sessionStorage.getItem('signal_answer')
    if (!answer) {
      setResult(FALLBACK)
      setPhase('reveal')
      return
    }

    runEvaluation(answer)
      .then(r => {
        setResult(r)
        setPhase('reveal')
      })
      .catch(err => {
        setErrorMsg(err.message)
        setPhase('error')
      })
  }, [])

  // Staggered reveal after result arrives
  useEffect(() => {
    if (phase !== 'reveal' || revealed) return
    setRevealed(true)
    setTimeout(() => {
      revealRef.current?.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(20px)'
        setTimeout(() => {
          el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
        }, i * 90)
      })
    }, 50)
  }, [phase, revealed])

  const overallColor = !result || result.overall <= 2
    ? '#f87171' : result.overall === 3 ? '#f59e0b' : '#4ade80'

  return (
    <>
      <style>{`
        .eval-page {
          min-height: 100vh; background: var(--bg-base);
          display: flex; flex-direction: column;
        }
        .eval-topbar {
          height: 60px; display: flex; align-items: center;
          padding: 0 32px;
          border-bottom: 1px solid var(--border-subtle);
          background: var(--bg-base);
          position: sticky; top: 0; z-index: 10;
        }
        .eval-topbar-inner {
          max-width: var(--max-w); margin: 0 auto; width: 100%;
          display: flex; align-items: center; justify-content: space-between;
        }
        .eval-logo {
          font-family: var(--font-mono); font-size: 13px;
          letter-spacing: 0.12em; color: var(--text-tertiary);
        }
        .eval-step {
          font-family: var(--font-mono); font-size: 12px;
          color: var(--text-tertiary); letter-spacing: 0.08em;
          display: flex; align-items: center; gap: 8px;
        }
        .eval-step-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--accent-warm);
        }
        /* ── Loading ── */
        .eval-loading {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 24px;
        }
        .eval-loading-orb {
          position: relative; width: 64px; height: 64px;
        }
        .eval-loading-ring {
          position: absolute; inset: 0;
          border-radius: 50%;
          border: 2px solid var(--border-subtle);
          border-top-color: var(--accent);
          animation: spin 1s linear infinite;
        }
        .eval-loading-ring2 {
          position: absolute; inset: 8px;
          border-radius: 50%;
          border: 1px solid var(--border-subtle);
          border-bottom-color: var(--accent-warm);
          animation: spin 1.5s linear infinite reverse;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .eval-loading-label {
          font-family: var(--font-mono); font-size: 12px;
          color: var(--text-tertiary); letter-spacing: 0.12em;
          text-align: center;
        }
        .eval-loading-sub {
          font-family: var(--font-sans); font-size: 14px;
          color: var(--text-tertiary); text-align: center; max-width: 280px;
          line-height: 1.6;
        }
        /* ── Error ── */
        .eval-error {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 16px;
          padding: 40px 24px; text-align: center;
        }
        .eval-error-title {
          font-family: var(--font-serif); font-size: 24px;
          color: var(--text-primary); font-weight: 400;
        }
        .eval-error-body {
          font-family: var(--font-sans); font-size: 14px;
          color: var(--text-tertiary); max-width: 360px; line-height: 1.65;
        }
        .eval-error-btn {
          font-family: var(--font-sans); font-size: 14px; font-weight: 500;
          color: var(--bg-base); background: var(--text-primary);
          border: none; border-radius: 100px; padding: 12px 28px;
          cursor: pointer;
        }
        /* ── Content ── */
        .eval-content {
          max-width: 840px; margin: 0 auto; width: 100%;
          padding: 56px 32px 100px;
        }
        /* Verdict header */
        .eval-verdict-row {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 24px;
          margin-bottom: 40px;
          padding-bottom: 40px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .eval-verdict-left {}
        .eval-verdict-eyebrow {
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: 0.16em; color: var(--accent);
          margin-bottom: 10px;
        }
        .eval-verdict-text {
          font-family: var(--font-serif);
          font-size: clamp(24px, 3.5vw, 40px);
          font-weight: 400; line-height: 1.2;
          color: var(--text-primary);
          margin-bottom: 16px;
        }
        .eval-verdict-text em {
          font-style: italic; color: var(--text-secondary);
        }
        .eval-summary {
          font-family: var(--font-sans); font-size: 16px;
          line-height: 1.75; color: var(--text-secondary);
          max-width: 560px;
        }
        /* Overall score bubble */
        .eval-score-bubble {
          flex-shrink: 0; text-align: center;
          width: 100px; height: 100px; border-radius: 50%;
          border: 2px solid;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 2px;
        }
        .eval-score-num {
          font-family: var(--font-serif); font-size: 36px;
          line-height: 1; font-weight: 400;
        }
        .eval-score-denom {
          font-family: var(--font-mono); font-size: 11px;
          color: var(--text-tertiary); letter-spacing: 0.08em;
        }
        /* Section labels */
        .eval-section-label {
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: 0.16em; color: var(--text-tertiary);
          margin-bottom: 20px; margin-top: 48px;
        }
        /* Dimensions */
        .eval-dims { display: flex; flex-direction: column; gap: 16px; }
        .eval-dim {
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 14px; padding: 20px 24px;
        }
        .eval-dim-top {
          display: flex; align-items: center;
          gap: 16px; margin-bottom: 10px;
        }
        .eval-dim-name {
          font-family: var(--font-sans); font-size: 14px;
          font-weight: 500; color: var(--text-primary);
          min-width: 160px;
        }
        .eval-dim-gap {
          font-family: var(--font-sans); font-size: 13px;
          line-height: 1.6; color: var(--text-tertiary);
        }
        /* What you missed */
        .eval-missed { display: flex; flex-direction: column; gap: 12px; }
        .eval-missed-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 16px 20px;
          background: rgba(248,113,113,0.06);
          border: 1px solid rgba(248,113,113,0.12);
          border-radius: 12px;
        }
        .eval-missed-icon {
          font-family: var(--font-mono); font-size: 12px;
          color: var(--red); flex-shrink: 0; padding-top: 1px;
        }
        .eval-missed-text {
          font-family: var(--font-sans); font-size: 14px;
          line-height: 1.6; color: var(--text-secondary);
        }
        /* Elite contrast */
        .eval-elite {
          background: var(--bg-elevated);
          border-left: 2px solid var(--accent);
          border-radius: 0 14px 14px 0;
          padding: 24px 28px;
        }
        .eval-elite-label {
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: 0.12em; color: var(--accent);
          margin-bottom: 12px;
        }
        .eval-elite-text {
          font-family: var(--font-sans); font-size: 15px;
          line-height: 1.75; color: var(--text-secondary);
        }
        /* Aspiration */
        .eval-aspiration {
          text-align: center; padding: 48px 0;
          border-top: 1px solid var(--border-subtle);
          margin-top: 16px;
        }
        .eval-aspiration-quote {
          font-family: var(--font-serif); font-style: italic;
          font-size: clamp(20px, 2.5vw, 28px);
          color: var(--text-primary); line-height: 1.45;
          max-width: 560px; margin: 0 auto 40px;
        }
        /* CTA card */
        .eval-cta-card {
          background: var(--bg-elevated);
          border: 1px solid var(--accent-border);
          border-radius: 24px; padding: 48px;
          text-align: center; position: relative; overflow: hidden;
        }
        .eval-cta-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(192,132,252,0.6), transparent);
        }
        .eval-cta-title {
          font-family: var(--font-serif);
          font-size: clamp(22px, 3vw, 36px);
          font-weight: 400; color: var(--text-primary);
          margin-bottom: 14px; line-height: 1.25;
        }
        .eval-cta-body {
          font-family: var(--font-sans); font-size: 15px;
          line-height: 1.7; color: var(--text-secondary);
          max-width: 440px; margin: 0 auto 36px;
        }
        .eval-cta-btn {
          font-family: var(--font-sans); font-size: 16px;
          font-weight: 500; color: #fff;
          background: var(--accent); border: none;
          border-radius: 100px; padding: 16px 48px;
          cursor: pointer; transition: all 200ms ease;
          display: inline-block; margin-bottom: 20px;
        }
        .eval-cta-btn:hover { filter: brightness(1.1); transform: scale(1.02); }
        .eval-cta-trust {
          font-family: var(--font-mono); font-size: 11px;
          color: var(--text-tertiary); letter-spacing: 0.06em;
        }
        .eval-retry {
          text-align: center; margin-top: 32px;
        }
        .eval-retry-btn {
          font-family: var(--font-sans); font-size: 14px;
          color: var(--text-tertiary); background: none; border: none;
          cursor: pointer; transition: color 150ms ease;
          text-decoration: underline; text-underline-offset: 3px;
        }
        .eval-retry-btn:hover { color: var(--text-secondary); }
        /* Responsive */
        @media (max-width: 640px) {
          .eval-content { padding: 40px 20px 80px; }
          .eval-verdict-row { flex-direction: column; gap: 20px; }
          .eval-score-bubble { width: 80px; height: 80px; }
          .eval-score-num { font-size: 28px; }
          .eval-dim-top { flex-direction: column; align-items: flex-start; gap: 8px; }
          .eval-dim-name { min-width: unset; }
          .eval-cta-card { padding: 36px 24px; }
          .eval-cta-btn { width: 100%; }
          .eval-topbar { padding: 0 20px; }
        }
      `}</style>

      <div className="eval-page">
        {/* Top bar */}
        <div className="eval-topbar">
          <div className="eval-topbar-inner">
            <span className="eval-logo">KETAN.</span>
            <span className="eval-step">
              <span className="eval-step-dot" />
              EVALUATION — STEP 2 OF 2
            </span>
          </div>
        </div>

        {/* Loading */}
        {phase === 'loading' && (
          <div className="eval-loading">
            <div className="eval-loading-orb">
              <div className="eval-loading-ring" />
              <div className="eval-loading-ring2" />
            </div>
            <div className="eval-loading-label">ANALYSING YOUR THINKING</div>
            <p className="eval-loading-sub">
              Evaluating hypotheses, structure, business depth, and prioritization…
            </p>
          </div>
        )}

        {/* Error */}
        {phase === 'error' && (
          <div className="eval-error">
            <h2 className="eval-error-title">Evaluation failed</h2>
            <p className="eval-error-body">
              Something went wrong calling the AI evaluator. {errorMsg && `(${errorMsg})`}{' '}
              Please try again.
            </p>
            <button className="eval-error-btn" onClick={() => navigate('/diagnostic')}>
              Try Again
            </button>
          </div>
        )}

        {/* Result */}
        {phase === 'reveal' && result && (
          <div className="eval-content" ref={revealRef}>
            {/* Verdict */}
            <div data-reveal className="eval-verdict-row">
              <div className="eval-verdict-left">
                <p className="eval-verdict-eyebrow">YOUR EVALUATION</p>
                <h1 className="eval-verdict-text">
                  <em>"{result.verdict}"</em>
                </h1>
                <p className="eval-summary">{result.summary}</p>
              </div>
              {result.overall > 0 && (
                <div
                  className="eval-score-bubble"
                  style={{ borderColor: overallColor, color: overallColor }}
                >
                  <span className="eval-score-num">{result.overall}</span>
                  <span className="eval-score-denom">OUT OF 5</span>
                </div>
              )}
            </div>

            {/* Dimensions */}
            <p data-reveal className="eval-section-label">DIMENSION BREAKDOWN</p>
            <div data-reveal className="eval-dims">
              {result.dimensions.map((d, i) => (
                <div key={i} className="eval-dim">
                  <div className="eval-dim-top">
                    <span className="eval-dim-name">{d.name}</span>
                    {d.score > 0 && <ScoreBar score={d.score} />}
                  </div>
                  <p className="eval-dim-gap">{d.gap}</p>
                </div>
              ))}
            </div>

            {/* What you missed */}
            {result.whatYouMissed.length > 0 && (
              <>
                <p data-reveal className="eval-section-label">WHAT MOST PEOPLE MISS</p>
                <div data-reveal className="eval-missed">
                  {result.whatYouMissed.map((m, i) => (
                    <div key={i} className="eval-missed-item">
                      <span className="eval-missed-icon">—</span>
                      <span className="eval-missed-text">{m}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Elite contrast */}
            <p data-reveal className="eval-section-label">HOW A SENIOR ANALYST THINKS</p>
            <div data-reveal className="eval-elite">
              <div className="eval-elite-label">SENIOR LENS</div>
              <p className="eval-elite-text">{result.eliteContrast}</p>
            </div>

            {/* Aspiration + CTA */}
            <div data-reveal className="eval-aspiration">
              <p className="eval-aspiration-quote">{result.aspiration}</p>

              <div className="eval-cta-card">
                <h2 className="eval-cta-title">
                  Join the Friday AI<br />Problem Solving Lab
                </h2>
                <p className="eval-cta-body">
                  Live sessions with Ketan. Max 5 people per cohort.
                  Real business problems, real frameworks, real feedback on how you think.
                </p>
                <button
                  className="eval-cta-btn"
                  onClick={() => setFormOpen(true)}
                >
                  Reserve via WhatsApp →
                </button>
                <p className="eval-cta-trust">₹2,500 per session · No auto-renewal · Pay per session</p>
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