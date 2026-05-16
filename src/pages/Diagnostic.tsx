import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MIN_WORDS = 40

export default function Diagnostic() {
  const navigate = useNavigate()
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const previewMode = new URLSearchParams(window.location.search).get('preview') === 'osc2025'

  const wordCount = answer.trim() === '' ? 0 : answer.trim().split(/\s+/).length
  const progress = Math.min((wordCount / MIN_WORDS) * 100, 100)
  const canSubmit = previewMode || wordCount >= MIN_WORDS

  function handleSubmit() {
    if (!canSubmit || submitting) return
    setSubmitting(true)
    const finalAnswer = previewMode && wordCount < MIN_WORDS
      ? `The user browsed for 5 minutes which signals clear intent — they wanted to order. The question is not why they did not want to order but what stopped them after they had already decided to. I would focus on two causes: delivery time being too long for what they wanted, or unexpected fees at checkout that broke the value equation. I would check where in the flow they dropped off to confirm which hypothesis.`
      : answer
    sessionStorage.setItem('signal_answer', finalAnswer)
    if (previewMode) sessionStorage.setItem('signal_preview', '1')
    else sessionStorage.removeItem('signal_preview')
    navigate('/evaluation')
  }

  return (
    <>
      <style>{`
        .diag-page { min-height: 100vh; background: var(--bg-base); display: flex; flex-direction: column; }
        .diag-topbar { height: 60px; display: flex; align-items: center; padding: 0 32px; border-bottom: 1px solid var(--border-subtle); background: var(--bg-base); position: sticky; top: 0; z-index: 10; justify-content: space-between; }
        .diag-logo { font-family: 'DM Mono', monospace; font-size: 13px; letter-spacing: 0.12em; color: var(--text-tertiary); cursor: pointer; }
        .diag-logo span { background: linear-gradient(135deg,#FF6B9D,#A855F7); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .diag-steps { display: flex; gap: 6px; }
        .diag-step { width: 24px; height: 3px; border-radius: 2px; background: var(--border-subtle); }
        .diag-step.done { background: var(--accent); opacity: 0.35; }
        .diag-step.active { background: var(--accent); }
        .diag-content { flex: 1; display: grid; grid-template-columns: 1fr 400px; max-width: 1200px; margin: 0 auto; width: 100%; padding: 0 32px; }
        .diag-left { padding: 56px 52px 56px 0; border-right: 1px solid var(--border-subtle); }
        .diag-eyebrow { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.16em; color: var(--accent); margin-bottom: 28px; display: flex; align-items: center; gap: 8px; }
        .diag-eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); }
        .diag-q-card { background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 18px; padding: 32px 28px; margin-bottom: 28px; position: relative; }
        .diag-q-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--accent), #FF6B9D); border-radius: 18px 18px 0 0; }
        .diag-q-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.14em; color: var(--text-tertiary); margin-bottom: 16px; }
        .diag-question { font-family: 'Instrument Serif', serif; font-size: clamp(20px, 2.5vw, 28px); line-height: 1.45; color: var(--text-primary); font-weight: 400; margin: 0; }
        .diag-context { font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.8; color: var(--text-secondary); margin-bottom: 28px; }
        .diag-context strong { color: var(--text-primary); font-weight: 500; }
        .diag-nudge { background: rgba(168,85,247,0.05); border: 1px solid rgba(168,85,247,0.12); border-radius: 12px; padding: 18px 20px; }
        .diag-nudge-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.14em; color: var(--accent); margin-bottom: 8px; }
        .diag-nudge-text { font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text-secondary); line-height: 1.7; }
        .diag-right { padding: 56px 0 56px 44px; display: flex; flex-direction: column; }
        .diag-right-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.14em; color: var(--text-tertiary); margin-bottom: 12px; }
        .diag-textarea { flex: 1; min-height: 320px; width: 100%; box-sizing: border-box; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 20px; font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.75; color: var(--text-primary); resize: none; outline: none; transition: border-color 200ms ease; margin-bottom: 16px; }
        .diag-textarea::placeholder { color: var(--text-tertiary); line-height: 1.7; }
        .diag-textarea:focus { border-color: rgba(168,85,247,0.5); }
        .diag-progress-row { display: flex; justify-content: space-between; margin-bottom: 7px; font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-tertiary); letter-spacing: 0.06em; }
        .diag-progress-bar { height: 2px; background: var(--border-subtle); border-radius: 2px; overflow: hidden; margin-bottom: 16px; }
        .diag-progress-fill { height: 100%; border-radius: 2px; background: var(--accent); transition: width 300ms ease; }
        .diag-submit { width: 100%; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 600; color: #fff; background: var(--accent); border: none; border-radius: 100px; padding: 16px; cursor: pointer; transition: all 200ms ease; }
        .diag-submit:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 6px 24px rgba(168,85,247,0.3); }
        .diag-submit:disabled { opacity: 0.35; cursor: not-allowed; }
        .diag-submit-note { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-tertiary); text-align: center; margin-top: 10px; letter-spacing: 0.06em; }
        @media (max-width: 900px) { .diag-content { grid-template-columns: 1fr; padding: 0 24px; } .diag-left { padding: 48px 0 32px; border-right: none; border-bottom: 1px solid var(--border-subtle); } .diag-right { padding: 32px 0 64px; } }
        @media (max-width: 480px) { .diag-content { padding: 0 20px; } .diag-topbar { padding: 0 20px; } }
      `}</style>

      <div className="diag-page">
        <div className="diag-topbar">
          <div style={{display:'flex',alignItems:'center',gap:16}}>
            <button onClick={() => navigate('/')} style={{background:'none',border:'1px solid var(--border-subtle)',borderRadius:100,padding:'6px 14px',fontFamily:'DM Sans,sans-serif',fontSize:13,color:'var(--text-secondary)',cursor:'pointer',transition:'all 150ms'}}>← Home</button>
            <span className="diag-logo" onClick={() => navigate('/')}>onestop<span>careers</span></span>
          </div>
          <div className="diag-steps">
            <div className="diag-step done" />
            <div className="diag-step active" />
            <div className="diag-step" />
          </div>
        </div>
        <div className="diag-content">
          <div className="diag-left">
            <div className="diag-eyebrow"><span className="diag-eyebrow-dot" />4-MINUTE THINKING TEST</div>
            <div className="diag-q-card">
              <div className="diag-q-label">THE SITUATION</div>
              <p className="diag-question">You opened the Swiggy app, browsed through restaurants for about 5 minutes, and then closed it without ordering anything. What do you think happened?</p>
            </div>
            <p className="diag-context">No business knowledge required. No right answer.{' '}<strong>Write the way your mind actually works through this</strong> — not how you'd present it in a meeting.</p>
            <div className="diag-nudge">
              <div className="diag-nudge-label">A USEFUL FRAME</div>
              <p className="diag-nudge-text">Start with your #1 hypothesis about what happened from the user's side. Then your #1 hypothesis from the product or business side. Both angles matter.</p>
            </div>
          </div>
          <div className="diag-right">
            <div className="diag-right-label">YOUR ANSWER</div>
            <textarea
              className="diag-textarea"
              placeholder={"Start with your #1 hypothesis about what happened from the user's side.\n\nThen your #1 hypothesis from the product or business side.\n\nWrite the way your mind actually works — not how you'd present it."}
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              disabled={submitting}
            />
            <div className="diag-progress-row">
              <span>{wordCount < MIN_WORDS ? `${MIN_WORDS - wordCount} more words to unlock` : '✓ Ready'}</span>
              <span>{wordCount} words</span>
            </div>
            <div className="diag-progress-bar">
              <div className="diag-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <button className="diag-submit" onClick={handleSubmit} disabled={!canSubmit || submitting}>
              {submitting ? 'Evaluating…' : 'Get My Evaluation →'}
            </button>
            <p className="diag-submit-note">~15 seconds · Powered by AI · No signup needed</p>
          </div>
        </div>
      </div>
    </>
  )
}
