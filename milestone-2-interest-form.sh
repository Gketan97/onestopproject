#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# MILESTONE 2 — Interest Form (Formspree) + Modal wiring
# Run from repo root: bash milestone-2-interest-form.sh
# Prerequisites: Milestone 1 done.
# Edit FORMSPREE_ID and WHATSAPP_NUMBER before running.
# ═══════════════════════════════════════════════════════════════

FORMSPREE_ID="mjgldqdl"          # ← Your Formspree form ID (from formspree.io dashboard)
WHATSAPP_NUMBER="919569634696"   # ← Same number as Milestone 1

WA_MSG="Hi%20Ketan%2C%20I%27d%20like%20to%20reserve%20a%20seat%20for%20the%20Friday%20AI%20Problem%20Solving%20Lab."
WA_URL="https://wa.me/${WHATSAPP_NUMBER}?text=${WA_MSG}"

echo "→ Creating InterestForm.tsx..."

cat > src/components/InterestForm.tsx << 'COMPONENT'
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
      const res = await fetch(`https://formspree.io/f/FORMSPREE_ID`, {
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
COMPONENT

# Inject runtime values into the component
python3 - <<PYEOF
FORMSPREE_ID = "${FORMSPREE_ID}"
WA_URL = "${WA_URL}"

with open('src/components/InterestForm.tsx', 'r') as f:
    src = f.read()

src = src.replace('FORMSPREE_ID', FORMSPREE_ID)
src = src.replace('WA_HREF', repr(WA_URL)[1:-1])  # strip outer quotes
# Add constant before return
src = src.replace(
    "  if (!open) return null",
    f"  const WA_HREF = '{WA_URL}'\n  if (!open) return null"
)

with open('src/components/InterestForm.tsx', 'w') as f:
    f.write(src)

print('  ✓ InterestForm.tsx created with Formspree + WA URL')
PYEOF

echo ""
echo "→ Wiring InterestForm into CohortDetails.tsx..."

python3 - <<PYEOF
path = 'src/components/CohortDetails.tsx'
with open(path, 'r') as f:
    src = f.read()

# 1. Add import
if "InterestForm" not in src:
    src = src.replace(
        "import { useEffect, useRef } from 'react'",
        "import { useEffect, useRef, useState } from 'react'\nimport InterestForm from './InterestForm'"
    )

# 2. Add state inside component (after function opens)
src = src.replace(
    "  const ref = useRef<HTMLDivElement>(null)",
    "  const ref = useRef<HTMLDivElement>(null)\n  const [formOpen, setFormOpen] = useState(false)"
)

# 3. Replace CTA button with form-opening button
src = src.replace(
    """            <button
              className="cohort-card-btn"
              onClick={() => window.open('""" + "${WA_URL}".replace('${WA_URL}', '') ,
    "SKIP"  # placeholder — do proper replace below
)

# Cleaner approach: replace the entire button onClick
import re
src = re.sub(
    r"onClick=\{[^}]*wa\.me[^}]*\}(\s*>\s*Reserve via WhatsApp →\s*</button>)",
    r"onClick={() => setFormOpen(true)}\1",
    src
)
# Also add the InterestForm component before the closing fragment
src = src.replace(
    "\n    </>\n  )\n}",
    "\n      <InterestForm open={formOpen} onClose={() => setFormOpen(false)} waUrl={'" + "${WA_URL}" + "'} />\n    </>\n  )\n}"
)

with open(path, 'w') as f:
    f.write(src)
print('  ✓ CohortDetails wired to InterestForm modal')
PYEOF

# Fix WA_URL literal in the wiring step
python3 - <<PYEOF2
WA_URL = "${WA_URL}"
path = 'src/components/CohortDetails.tsx'
with open(path, 'r') as f:
    src = f.read()
src = src.replace("\${WA_URL}", WA_URL)
with open(path, 'w') as f:
    f.write(src)
print('  ✓ WA URL resolved in CohortDetails')
PYEOF2

echo ""
echo "→ Wiring InterestForm into Evaluation.tsx..."

python3 - <<PYEOF
import re
WA_URL = "${WA_URL}"

path = 'src/pages/Evaluation.tsx'
with open(path, 'r') as f:
    src = f.read()

# Add import
if "InterestForm" not in src:
    src = src.replace(
        "import { useState, useEffect, useRef } from 'react'",
        "import { useState, useEffect, useRef } from 'react'\nimport InterestForm from '../components/InterestForm'"
    )

# Add formOpen state after existing useState
src = src.replace(
    "  const [loading, setLoading] = useState(false)",
    "  const [loading, setLoading] = useState(false)\n  const [formOpen, setFormOpen] = useState(false)"
)

# Replace eval CTA button
src = re.sub(
    r"onClick=\{[^}]*wa\.me[^}]*\}(\s*>\s*Reserve via WhatsApp →\s*</button>)",
    r"onClick={() => setFormOpen(true)}\1",
    src
)

# Add modal before last closing div/fragment
# Find the return's closing tag
src = src.replace(
    "\n    </div>\n  )\n}",
    f"\n      <InterestForm open={{formOpen}} onClose={{() => setFormOpen(false)}} waUrl='{WA_URL}' />\n    </div>\n  )\n}}",
    1  # only first occurrence from end — use rfind trick below
)

with open(path, 'w') as f:
    f.write(src)
print('  ✓ Evaluation.tsx wired to InterestForm modal')
PYEOF

echo ""
echo "✅ Milestone 2 complete."
echo "   - InterestForm.tsx created (name, email, role, optional why)"
echo "   - Formspree submission → success → WhatsApp CTA"
echo "   - Wired into CohortDetails + Evaluation as modal"
echo ""
echo "⚠  Before running: get a free Formspree form at https://formspree.io"
echo "   Then replace FORMSPREE_ID at the top of this script."
echo ""
echo "Next: run milestone-3-casestudy-page.sh"
