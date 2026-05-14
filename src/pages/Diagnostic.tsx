import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const CASE = `You opened the Swiggy app, browsed for 5 minutes, but did not place an order. What could have happened?`

const DIMENSIONS = [
  'User behavior & intent',
  'Business & ops constraints',
  'Product/UX friction',
  'Systems thinking',
  'Hypothesis prioritization',
]

const MIN_WORDS = 60
const IDEAL_WORDS = 150

function wordCount(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length
}

export default function Diagnostic() {
  const [answer, setAnswer] = useState('')
  const [focused, setFocused] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const wc = wordCount(answer)
  const progress = Math.min(wc / IDEAL_WORDS, 1)
  const canSubmit = wc >= MIN_WORDS

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.max(200, ta.scrollHeight) + 'px'
  }, [answer])

  const handleSubmit = () => {
    if (!canSubmit || submitted) return
    setSubmitted(true)
    sessionStorage.setItem('signal_answer', answer)
    sessionStorage.setItem('signal_wc', String(wc))
    setTimeout(() => navigate('/evaluation'), 400)
  }

  const progressLabel = wc === 0
    ? 'Start writing…'
    : wc < MIN_WORDS
    ? `${MIN_WORDS - wc} more words to unlock evaluation`
    : wc < IDEAL_WORDS
    ? `${wc} words — keep going for richer feedback`
    : `${wc} words — strong depth`

  return (
    <>
      <style>{`
        .diag-page {
          min-height: 100vh;
          background: var(--bg-base);
          display: flex;
          flex-direction: column;
        }
        /* ── Top bar ── */
        .diag-topbar {
          height: 60px;
          display: flex; align-items: center;
          padding: 0 32px;
          border-bottom: 1px solid var(--border-subtle);
          position: sticky; top: 0; z-index: 10;
          background: var(--bg-base);
        }
        .diag-topbar-inner {
          max-width: var(--max-w); margin: 0 auto; width: 100%;
          display: flex; align-items: center; justify-content: space-between;
        }
        .diag-logo {
          font-family: var(--font-mono);
          font-size: 13px; letter-spacing: 0.12em;
          color: var(--text-tertiary);
        }
        .diag-step {
          font-family: var(--font-mono);
          font-size: 12px; color: var(--text-tertiary);
          letter-spacing: 0.08em;
          display: flex; align-items: center; gap: 8px;
        }
        .diag-step-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--accent);
        }
        /* ── Layout ── */
        .diag-body {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 320px;
          max-width: var(--max-w);
          margin: 0 auto;
          width: 100%;
          padding: 56px 32px 80px;
          gap: 64px;
          align-items: start;
        }
        /* ── LEFT: question + input ── */
        .diag-main {}
        .diag-eyebrow {
          font-family: var(--font-mono);
          font-size: 11px; letter-spacing: 0.16em;
          color: var(--accent); margin-bottom: 20px;
        }
        .diag-question {
          font-family: var(--font-serif);
          font-size: clamp(22px, 3vw, 32px);
          font-weight: 400;
          line-height: 1.45;
          color: var(--text-primary);
          margin-bottom: 12px;
        }
        .diag-question-note {
          font-family: var(--font-sans);
          font-size: 14px; line-height: 1.65;
          color: var(--text-tertiary);
          margin-bottom: 36px;
        }
        /* ── Textarea ── */
        .diag-textarea-wrap {
          position: relative;
        }
        .diag-textarea-border {
          position: absolute; inset: 0;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(192,132,252,0.3), rgba(245,158,11,0.15));
          padding: 1px;
          opacity: 0;
          transition: opacity 300ms ease;
          pointer-events: none;
        }
        .diag-textarea-border.focused { opacity: 1; }
        .diag-textarea-border-inner {
          width: 100%; height: 100%;
          border-radius: 15px;
          background: var(--bg-surface);
        }
        textarea.diag-textarea {
          position: relative; z-index: 1;
          width: 100%;
          min-height: 200px;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 24px;
          font-family: var(--font-sans);
          font-size: 16px; line-height: 1.75;
          color: var(--text-primary);
          resize: none;
          outline: none;
          transition: border-color 300ms ease, background 300ms ease;
          caret-color: var(--accent);
        }
        textarea.diag-textarea::placeholder { color: var(--text-tertiary); }
        textarea.diag-textarea:focus {
          border-color: transparent;
          background: var(--bg-surface);
        }
        /* ── Progress ── */
        .diag-progress-row {
          display: flex; align-items: center;
          gap: 14px; margin-top: 16px;
        }
        .diag-progress-bar {
          flex: 1; height: 2px;
          background: var(--border-subtle);
          border-radius: 1px; overflow: hidden;
        }
        .diag-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent), var(--accent-warm));
          border-radius: 1px;
          transition: width 300ms ease;
        }
        .diag-progress-label {
          font-family: var(--font-mono);
          font-size: 11px; color: var(--text-tertiary);
          white-space: nowrap; letter-spacing: 0.06em;
          flex-shrink: 0;
        }
        .diag-progress-label.ready { color: var(--green); }
        /* ── Submit ── */
        .diag-submit-row { margin-top: 28px; }
        .diag-submit-btn {
          font-family: var(--font-sans);
          font-size: 16px; font-weight: 500;
          color: #fff;
          background: var(--accent);
          border: none; border-radius: 100px;
          padding: 16px 48px;
          cursor: pointer;
          transition: all 200ms ease;
          opacity: 1;
        }
        .diag-submit-btn:disabled {
          opacity: 0.28; cursor: not-allowed;
        }
        .diag-submit-btn:not(:disabled):hover {
          filter: brightness(1.1); transform: scale(1.02);
        }
        .diag-submit-btn:not(:disabled):active { transform: scale(0.98); }
        .diag-submit-hint {
          font-family: var(--font-mono);
          font-size: 12px; color: var(--text-tertiary);
          margin-top: 12px; letter-spacing: 0.05em;
        }
        /* ── RIGHT: sidebar ── */
        .diag-sidebar {
          position: sticky; top: 80px;
          display: flex; flex-direction: column; gap: 20px;
        }
        .diag-sidebar-card {
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 24px;
        }
        .diag-sidebar-card-title {
          font-family: var(--font-mono);
          font-size: 11px; letter-spacing: 0.14em;
          color: var(--text-tertiary); margin-bottom: 16px;
        }
        .diag-dim-list { display: flex; flex-direction: column; gap: 10px; }
        .diag-dim {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--font-sans);
          font-size: 13px; color: var(--text-secondary);
        }
        .diag-dim-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--border-default); flex-shrink: 0;
          transition: background 300ms ease;
        }
        .diag-dim-dot.lit { background: var(--accent); box-shadow: 0 0 6px var(--accent); }
        .diag-tip {
          font-family: var(--font-sans);
          font-size: 13px; line-height: 1.65;
          color: var(--text-tertiary);
          font-style: italic;
        }
        .diag-tip strong { color: var(--text-secondary); font-style: normal; }
        /* ── Submitting overlay ── */
        .diag-submitting {
          position: fixed; inset: 0; z-index: 200;
          background: var(--bg-base);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 20px;
          opacity: 0; pointer-events: none;
          transition: opacity 400ms ease;
        }
        .diag-submitting.active { opacity: 1; pointer-events: all; }
        .diag-spinner {
          width: 32px; height: 32px;
          border: 2px solid var(--border-default);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .diag-submitting-text {
          font-family: var(--font-mono);
          font-size: 13px; color: var(--text-tertiary);
          letter-spacing: 0.10em;
        }
        /* Responsive */
        @media (max-width: 860px) {
          .diag-body { grid-template-columns: 1fr; gap: 40px; padding: 40px 24px 64px; }
          .diag-sidebar { position: static; }
        }
        @media (max-width: 480px) {
          .diag-topbar { padding: 0 20px; }
          .diag-body { padding: 32px 20px 56px; }
          .diag-submit-btn { width: 100%; }
        }
      `}</style>

      {/* Submitting overlay */}
      <div className={`diag-submitting${submitted ? ' active' : ''}`}>
        <div className="diag-spinner" />
        <span className="diag-submitting-text">Analysing your thinking…</span>
      </div>

      <div className="diag-page">
        {/* Top bar */}
        <div className="diag-topbar">
          <div className="diag-topbar-inner">
            <span className="diag-logo">KETAN.</span>
            <span className="diag-step">
              <span className="diag-step-dot" />
              DIAGNOSTIC — STEP 1 OF 2
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="diag-body">
          {/* LEFT */}
          <div className="diag-main">
            <p className="diag-eyebrow">BUSINESS CASE — PRODUCT ANALYTICS</p>
            <h1 className="diag-question">{CASE}</h1>
            <p className="diag-question-note">
              Write your best thinking. There's no single right answer —
              we're evaluating how you structure ambiguity, generate hypotheses, and prioritize.
            </p>

            <div className="diag-textarea-wrap">
              <div className={`diag-textarea-border${focused ? ' focused' : ''}`}>
                <div className="diag-textarea-border-inner" />
              </div>
              <textarea
                ref={textareaRef}
                className="diag-textarea"
                placeholder="Start with what you think is most likely…"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                disabled={submitted}
                aria-label="Your answer"
              />
            </div>

            <div className="diag-progress-row">
              <div className="diag-progress-bar">
                <div className="diag-progress-fill" style={{ width: `${progress * 100}%` }} />
              </div>
              <span className={`diag-progress-label${canSubmit ? ' ready' : ''}`}>
                {progressLabel}
              </span>
            </div>

            <div className="diag-submit-row">
              <button
                className="diag-submit-btn"
                disabled={!canSubmit || submitted}
                onClick={handleSubmit}
              >
                {submitted ? 'Analysing…' : 'Get My Evaluation →'}
              </button>
              {!canSubmit && wc > 0 && (
                <p className="diag-submit-hint">
                  Keep writing — depth unlocks a more useful evaluation.
                </p>
              )}
            </div>
          </div>

          {/* RIGHT sidebar */}
          <div className="diag-sidebar">
            <div className="diag-sidebar-card">
              <div className="diag-sidebar-card-title">WHAT WE'RE EVALUATING</div>
              <div className="diag-dim-list">
                {DIMENSIONS.map((d, i) => (
                  <div key={i} className="diag-dim">
                    <span className={`diag-dim-dot${wc > i * 25 ? ' lit' : ''}`} />
                    {d}
                  </div>
                ))}
              </div>
            </div>

            <div className="diag-sidebar-card">
              <div className="diag-sidebar-card-title">HOW TO THINK ABOUT THIS</div>
              <p className="diag-tip">
                <strong>Don't describe the obvious.</strong> Any analyst can say
                "maybe they didn't find anything they liked." Ask yourself: what
                system of factors could explain this pattern — at scale?
              </p>
            </div>

            <div className="diag-sidebar-card">
              <div className="diag-sidebar-card-title">USED AT</div>
              <p className="diag-tip">
                This type of question is used in analytics and PM interviews at
                Swiggy, Zepto, Blinkit, Meesho, Flipkart, and similar companies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
