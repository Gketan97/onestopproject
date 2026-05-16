import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// ── TESTING CONFIG — flip to false before launch ──────────────
const USE_DEFAULT_ANSWER = false

const DEFAULT_ANSWER = `First thing I'd do is not jump to conclusions. A lot of people would immediately say "maybe the restaurant wasn't available" or "maybe prices were high" — but that's just guessing. I'd want to actually think about what we know.

The user opened the app and browsed for 5 minutes. That's actually a signal — they had intent. They weren't just clicking by accident. So the question isn't "why didn't they order" but "what changed between having intent and leaving without acting?"

There are a few buckets I'd think through. One is the user didn't find what they wanted — wrong restaurants showing up, their regular place unavailable, nothing appealing in that moment. Another is they found something but something stopped them — price was higher than expected, delivery time was too long, a fee they didn't anticipate. Third possibility: they got distracted or the decision just didn't feel urgent enough. Food delivery is often an impulse — if the app doesn't create enough pull at the right moment, people leave.

If I had to pick the most likely culprit: delivery time or fees. Those are the friction points that tend to kill conversion when intent is already there. Someone who browses for 5 minutes has already found something interesting — they just didn't feel the value was worth it in that moment.

What I'd want to check: where in the flow they dropped. Did they reach the checkout and leave? Or did they never click on a restaurant? That one data point would tell me a lot more than any assumption.`

export default function Diagnostic() {
  const navigate = useNavigate()
  const location = useLocation()
  const previewMode = new URLSearchParams(location.search).get('preview') === 'osc2025'
  const location = useLocation()
  const isTestMode = new URLSearchParams(location.search).get('test') === '1'
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const DEFAULT_ANSWER = `The user browsed for 5 minutes which means intent was clearly there — they wanted to order something. So the question is not why they did not want to order, but what stopped them after they had already decided to. That reframe matters. I would look at two most likely causes: delivery time being too long for what they wanted in that moment, or an unexpected fee at checkout that broke the value equation. These are the friction points that kill conversion when intent is already present. I would check where in the flow they dropped — did they reach a restaurant page, the cart, or never click anything? That one data point would tell me which hypothesis to pursue first.`

  useEffect(() => {
    if (isTestMode) {
      sessionStorage.setItem('signal_answer', DEFAULT_ANSWER)
      navigate('/evaluation')
    }
  }, [isTestMode])

  const wordCount = answer.trim() === '' ? 0 : answer.trim().split(/\s+/).length
  const MIN_WORDS = 40
  const progress = Math.min((wordCount / MIN_WORDS) * 100, 100)
  const canSubmit = USE_DEFAULT_ANSWER || wordCount >= MIN_WORDS

  async function handleSubmit() {
    if (!canSubmit || submitting) return
    setSubmitting(true)
    const finalAnswer = USE_DEFAULT_ANSWER ? DEFAULT_ANSWER : answer
    sessionStorage.setItem('signal_answer', finalAnswer)
    navigate('/evaluation')
  }

  return (
    <>
      <style>{`
        .diag-page {
          min-height: 100vh; background: var(--bg-base);
          display: flex; flex-direction: column;
        }
        .diag-topbar {
          height: 60px; display: flex; align-items: center;
          padding: 0 32px; border-bottom: 1px solid var(--border-subtle);
          background: var(--bg-base); position: sticky; top: 0; z-index: 10;
          justify-content: space-between;
        }
        .diag-logo {
          font-family: 'DM Mono', monospace; font-size: 13px;
          letter-spacing: 0.12em; color: var(--text-tertiary);
        }
        .diag-logo span {
          background: linear-gradient(135deg, #FF6B9D, #A855F7);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .diag-steps { display: flex; align-items: center; gap: 6px; }
        .diag-step { width: 24px; height: 3px; border-radius: 2px; background: var(--border-subtle); }
        .diag-step.active { background: var(--accent); }
        .diag-step.done { background: var(--accent); opacity: 0.35; }

        .diag-content {
          flex: 1; display: grid;
          grid-template-columns: 1fr 400px;
          max-width: 1200px; margin: 0 auto; width: 100%;
          padding: 0 32px;
        }
        .diag-left {
          padding: 56px 52px 56px 0;
          border-right: 1px solid var(--border-subtle);
        }
        .diag-eyebrow {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.16em; color: var(--accent); margin-bottom: 28px;
          display: flex; align-items: center; gap: 8px;
        }
        .diag-eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); }

        /* Question card */
        .diag-q-card {
          background: var(--bg-elevated);
          border: 1px solid var(--border-default);
          border-radius: 18px; padding: 32px 28px;
          margin-bottom: 28px; position: relative;
        }
        .diag-q-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--accent), #FF6B9D);
          border-radius: 18px 18px 0 0;
        }
        .diag-q-label {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.14em; color: var(--text-tertiary); margin-bottom: 16px;
        }
        .diag-question {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(20px, 2.5vw, 28px);
          line-height: 1.45; color: var(--text-primary);
          font-weight: 400; margin: 0;
        }

        .diag-context {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; line-height: 1.8;
          color: var(--text-secondary); margin-bottom: 0;
        }
        .diag-context strong { color: var(--text-primary); font-weight: 500; }

        /* Nudge — reframed as guidance not evaluation criteria */
        .diag-nudge {
          margin-top: 28px;
          background: rgba(168,85,247,0.05);
          border: 1px solid rgba(168,85,247,0.12);
          border-radius: 12px; padding: 18px 20px;
        }
        .diag-nudge-label {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.14em; color: var(--accent); margin-bottom: 10px;
        }
        .diag-nudge-text {
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: var(--text-secondary); line-height: 1.7;
        }

        /* Right */
        .diag-right {
          padding: 56px 0 56px 44px;
          display: flex; flex-direction: column;
        }
        .diag-right-label {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.14em; color: var(--text-tertiary); margin-bottom: 12px;
        }
        .diag-test-banner {
          background: rgba(251,191,36,0.08);
          border: 1px solid rgba(251,191,36,0.2);
          border-radius: 8px; padding: 10px 16px; margin-bottom: 14px;
          font-family: 'DM Mono', monospace; font-size: 10px;
          color: #fbbf24; letter-spacing: 0.08em; text-align: center;
        }
        .diag-textarea {
          flex: 1; min-height: 320px; width: 100%; box-sizing: border-box;
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 14px; padding: 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; line-height: 1.75; color: var(--text-primary);
          resize: none; outline: none;
          transition: border-color 200ms ease; margin-bottom: 16px;
        }
        .diag-textarea::placeholder { color: var(--text-tertiary); line-height: 1.7; }
        .diag-textarea:focus { border-color: rgba(168,85,247,0.5); }
        .diag-textarea:disabled { opacity: 0.45; cursor: not-allowed; }

        .diag-progress-row {
          display: flex; justify-content: space-between; margin-bottom: 7px;
          font-family: 'DM Mono', monospace; font-size: 11px;
          color: var(--text-tertiary); letter-spacing: 0.06em;
        }
        .diag-progress-bar {
          height: 2px; background: var(--border-subtle);
          border-radius: 2px; overflow: hidden; margin-bottom: 16px;
        }
        .diag-progress-fill {
          height: 100%; border-radius: 2px; background: var(--accent);
          transition: width 300ms ease;
        }
        .diag-submit {
          width: 100%; font-family: 'DM Sans', sans-serif;
          font-size: 16px; font-weight: 600;
          color: #fff; background: var(--accent);
          border: none; border-radius: 100px;
          padding: 16px; cursor: pointer;
          transition: all 200ms ease; letter-spacing: 0.01em;
        }
        .diag-submit:hover:not(:disabled) {
          filter: brightness(1.1); transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(168,85,247,0.3);
        }
        .diag-submit:disabled { opacity: 0.35; cursor: not-allowed; }
        .diag-submit-note {
          font-family: 'DM Mono', monospace; font-size: 11px;
          color: var(--text-tertiary); text-align: center;
          margin-top: 10px; letter-spacing: 0.06em;
        }

        @media (max-width: 900px) {
          .diag-content { grid-template-columns: 1fr; padding: 0 24px; }
          .diag-left { padding: 48px 0 32px; border-right: none; border-bottom: 1px solid var(--border-subtle); }
          .diag-right { padding: 32px 0 64px; }
          .diag-topbar { padding: 0 24px; }
        }
        @media (max-width: 480px) {
          .diag-content { padding: 0 20px; }
          .diag-topbar { padding: 0 20px; }
          .diag-q-card { padding: 24px 20px; }
        }
      `}</style>

      <div className="diag-page">
        <div className="diag-topbar">
          <span className="diag-logo">onestop<span>careers</span></span>
          <div className="diag-steps">
            <div className="diag-step done" />
            <div className="diag-step active" />
            <div className="diag-step" />
          </div>
        </div>

        <div className="diag-content">
          <div className="diag-left">
            <div className="diag-eyebrow">
              <span className="diag-eyebrow-dot" />
              4-MINUTE THINKING TEST
            </div>

            <div className="diag-q-card">
              <div className="diag-q-label">THE SITUATION</div>
              <p className="diag-question">
                You opened the Swiggy app, browsed through restaurants for about 5 minutes, and then closed it without ordering anything. What do you think happened?
              </p>
            </div>

            <p className="diag-context">
              There is no right answer. Write the way your mind actually works through this —
              not how you'd present it in a meeting.{' '}
              <strong>Think out loud.</strong>
            </p>

            <div className="diag-nudge">
              <div className="diag-nudge-label">A USEFUL FRAME</div>
              <p className="diag-nudge-text">
                You're thinking about this from the outside, but try to also think about it from
                the inside — what was going on in the user's head, and what was going on
                in the product/business that they couldn't see. Both matter.
              </p>
            </div>
          </div>

          <div className="diag-right">
            <div className="diag-right-label">YOUR ANSWER</div>



            <textarea
              className="diag-textarea"
              placeholder={"Just think out loud.\n\nWhat might have happened? What are you considering? What feels most likely to you and why?\n\nWrite like you're thinking, not presenting."}
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              disabled={submitting}
            />

            {!USE_DEFAULT_ANSWER && (
              <>
                <div className="diag-progress-row">
                  <span>
                    {wordCount < MIN_WORDS
                      ? `${MIN_WORDS - wordCount} more words to unlock`
                      : '✓ Ready'}
                  </span>
                  <span>{wordCount} words</span>
                </div>
                <div className="diag-progress-bar">
                  <div className="diag-progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </>
            )}

            <button
              className="diag-submit"
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
            >
              {submitting ? 'Evaluating…' : 'Get My Evaluation →'}
            </button>
            <p className="diag-submit-note">~15 seconds · Powered by AI · No signup needed</p>
            {import.meta.env.DEV && (
              <button
                onClick={() => {
                  sessionStorage.setItem('signal_answer', 'The user browsed for 5 minutes which signals clear intent — they wanted to order. So the question is not why they did not want to order but what stopped them. I would focus on two causes: delivery time too long or unexpected fee at checkout. These kill conversion when intent is already there. I would check where in the flow they dropped to confirm which hypothesis.')
                  window.location.href = '/evaluation'
                }}
                style={{marginTop:12,width:'100%',padding:'10px',background:'rgba(251,191,36,0.1)',border:'1px solid rgba(251,191,36,0.2)',borderRadius:8,color:'#fbbf24',fontFamily:'DM Mono,monospace',fontSize:11,letterSpacing:'0.08em',cursor:'pointer'}}
              >
                ⚡ DEV: Skip to Evaluation
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
