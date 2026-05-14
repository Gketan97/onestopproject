import { useState, useEffect, useRef } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  waUrl: string
}

type Step = 'form' | 'done'

export default function InterestForm({ open, onClose, waUrl }: Props) {
  const [step, setStep] = useState<Step>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const overlayRef = useRef<HTMLDivElement>(null)

  // Reset when re-opened
  useEffect(() => {
    if (open) { setStep('form'); setError('') }
  }, [open])

  // Close on overlay click
  const handleOverlay = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch(`https://formspree.io/f/xyzabc12`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error('Submit failed')
      setStep('done')
    } catch {
      setError('Something went wrong. Please try again or WhatsApp Ketan directly.')
    } finally {
      setLoading(false)
    }
  }

  const WA_HREF = 'https://wa.me/919XXXXXXXXX?text=Hi%20Ketan%2C%20I%27d%20like%20to%20reserve%20a%20seat%20for%20the%20Friday%20AI%20Problem%20Solving%20Lab.'
  if (!open) return null

  return (
    <>
      <style>{`
        .iform-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.72);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: iform-fade 0.18s ease;
        }
        @keyframes iform-fade { from { opacity: 0 } to { opacity: 1 } }
        .iform-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 40px;
          width: 100%; max-width: 480px;
          position: relative;
          animation: iform-up 0.22s ease;
        }
        @keyframes iform-up { from { transform: translateY(16px); opacity: 0 } to { transform: none; opacity: 1 } }
        .iform-close {
          position: absolute; top: 16px; right: 16px;
          background: none; border: none;
          color: var(--text-muted); font-size: 20px;
          cursor: pointer; padding: 4px 8px; line-height: 1;
        }
        .iform-close:hover { color: var(--text-primary); }
        .iform-label {
          font-family: var(--font-mono);
          font-size: 10px; letter-spacing: 0.12em;
          color: var(--text-muted); text-transform: uppercase;
          margin-bottom: 28px; display: block;
        }
        .iform-h2 {
          font-family: var(--font-display);
          font-size: clamp(20px, 4vw, 26px);
          color: var(--text-primary);
          margin: 0 0 8px;
          line-height: 1.2;
        }
        .iform-sub {
          font-size: 14px; color: var(--text-muted);
          margin: 0 0 28px; line-height: 1.6;
        }
        .iform-field { margin-bottom: 16px; }
        .iform-field label {
          display: block;
          font-size: 12px; color: var(--text-muted);
          margin-bottom: 6px;
          font-family: var(--font-mono);
          letter-spacing: 0.06em;
        }
        .iform-field input,
        .iform-field select,
        .iform-field textarea {
          width: 100%; box-sizing: border-box;
          background: var(--bg-base);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          padding: 12px 14px;
          font-size: 14px;
          color: var(--text-primary);
          font-family: var(--font-body);
          outline: none;
          transition: border-color 0.15s;
        }
        .iform-field input:focus,
        .iform-field select:focus,
        .iform-field textarea:focus {
          border-color: var(--text-muted);
        }
        .iform-field textarea { resize: none; height: 72px; }
        .iform-error {
          font-size: 13px; color: #f87171;
          margin: 0 0 12px;
        }
        .iform-submit {
          width: 100%;
          background: var(--text-primary);
          color: var(--bg-base);
          border: none; border-radius: 8px;
          padding: 14px;
          font-size: 15px; font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .iform-submit:hover:not(:disabled) { opacity: 0.88; }
        .iform-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .iform-done-icon { font-size: 36px; margin-bottom: 16px; }
        .iform-done-h2 {
          font-family: var(--font-display);
          font-size: 22px; color: var(--text-primary);
          margin: 0 0 12px;
        }
        .iform-done-body {
          font-size: 14px; color: var(--text-muted);
          line-height: 1.7; margin: 0 0 24px;
        }
        .iform-wa-btn {
          display: block; width: 100%; box-sizing: border-box;
          background: #25D366; color: #fff;
          border: none; border-radius: 8px;
          padding: 14px; font-size: 15px; font-weight: 600;
          text-align: center; text-decoration: none;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .iform-wa-btn:hover { opacity: 0.88; }
      `}</style>

      <div className="iform-overlay" ref={overlayRef} onClick={handleOverlay}>
        <div className="iform-card" role="dialog" aria-modal="true">
          <button className="iform-close" onClick={onClose} aria-label="Close">×</button>

          {step === 'form' ? (
            <>
              <span className="iform-label">Reserve your seat</span>
              <h2 className="iform-h2">Friday AI Problem<br />Solving Lab</h2>
              <p className="iform-sub">Max 5 people. Ketan will confirm your seat and share payment details via WhatsApp within 24 hours.</p>

              <form onSubmit={handleSubmit}>
                <div className="iform-field">
                  <label>Full name *</label>
                  <input name="name" type="text" required placeholder="Your name" />
                </div>
                <div className="iform-field">
                  <label>Email *</label>
                  <input name="email" type="email" required placeholder="you@company.com" />
                </div>
                <div className="iform-field">
                  <label>Current role / company *</label>
                  <input name="role" type="text" required placeholder="e.g. Product Manager at Flipkart" />
                </div>
                <div className="iform-field">
                  <label>Why do you want to join? (optional)</label>
                  <textarea name="why" placeholder="What you're hoping to get from this lab..." />
                </div>

                {error && <p className="iform-error">{error}</p>}

                <button type="submit" className="iform-submit" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit →'}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', paddingTop: 8 }}>
              <div className="iform-done-icon">✓</div>
              <h2 className="iform-done-h2">You're on the list.</h2>
              <p className="iform-done-body">
                Ketan will reach out on WhatsApp within 24 hours to confirm your seat and share payment details.<br /><br />
                You can also message him directly to move faster.
              </p>
              <a className="iform-wa-btn" href={WA_HREF} target="_blank" rel="noopener noreferrer">
                Message Ketan on WhatsApp →
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
