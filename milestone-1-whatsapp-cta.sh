#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# MILESTONE 1 — WhatsApp CTA + Session Steps + FAQ
# Run from repo root: bash milestone-1-whatsapp-cta.sh
# Edit WHATSAPP_NUMBER before running.
# ═══════════════════════════════════════════════════════════════

WHATSAPP_NUMBER="919XXXXXXXXX"   # ← Replace with Ketan's number (no + or spaces)
WA_MSG="Hi%20Ketan%2C%20I%27d%20like%20to%20reserve%20a%20seat%20for%20the%20Friday%20AI%20Problem%20Solving%20Lab."
WA_URL="https://wa.me/${WHATSAPP_NUMBER}?text=${WA_MSG}"

echo "→ Patching CohortDetails.tsx (WhatsApp CTA + session steps)..."

python3 - <<PYEOF
import re

# ── CohortDetails.tsx ──────────────────────────────────────────
path = 'src/components/CohortDetails.tsx'
with open(path, 'r') as f:
    src = f.read()

# 1. Replace steps array with real 2-session model
old_steps = """  const steps = [
    { num: '01', title: 'Real business case', body: 'Ambiguous, no clean answer — just like the real world. Same type asked in top Indian tech companies.' },
    { num: '02', title: 'You solve it. With AI. Live.', body: 'Ketan watches how you think, not just what you answer. The process reveals everything.' },
    { num: '03', title: 'Structured debrief', body: 'Ketan breaks down the senior analyst approach vs what the group produced. The gap is where you grow.' },
    { num: '04', title: 'Frameworks you keep', body: 'Real mental models that transfer directly to your actual job, interviews, and stakeholder conversations.' },
  ]"""

new_steps = """  const steps = [
    { num: '01', time: '0:00–0:30', title: 'Context setting', body: 'Ketan walks through the case background, raw data files, and step-by-step methodology. You understand the full problem space before solving.' },
    { num: '02', time: '0:30–2:00', title: 'Live solving', body: 'The group works through early phases with Ketan in real time. He watches how you think, not just what you answer.' },
    { num: '03', time: 'That week', title: 'Independent work with AI', body: 'You solve remaining phases on your own using AI as a thinking partner. Build a structured report of your findings.' },
    { num: '04', time: 'Before Fri', title: 'Submit your report', body: 'Share your structured analysis with Ketan on WhatsApp before Session 2. This is the work he reviews.' },
    { num: '05', time: 'Session 2', title: 'Debrief + frameworks', body: 'Ketan reviews each person\\'s thinking, surfaces blind spots, and extracts transferable frameworks from the case.' },
  ]"""

src = src.replace(old_steps, new_steps)

# 2. Replace Razorpay button with WhatsApp
old_btn = """            <button
              className="cohort-card-btn"
              onClick={() => window.open('https://rzp.io/l/ketangoel', '_blank')}
            >
              Reserve Your Seat →
            </button>"""

new_btn = """            <button
              className="cohort-card-btn"
              onClick={() => window.open('${WA_URL}', '_blank')}
            >
              Reserve via WhatsApp →
            </button>"""

src = src.replace(old_btn, new_btn.replace('${WA_URL}', '${WA_URL}'))

with open(path, 'w') as f:
    f.write(src)

print('  ✓ CohortDetails.tsx patched')

# ── Evaluation.tsx ────────────────────────────────────────────
path2 = 'src/pages/Evaluation.tsx'
with open(path2, 'r') as f:
    src2 = f.read()

old_eval_btn = """                <button
                  className="eval-cta-btn"
                  onClick={() => window.open('https://rzp.io/l/ketangoel', '_blank')}
                >
                  Reserve Your Seat →
                </button>"""

new_eval_btn = """                <button
                  className="eval-cta-btn"
                  onClick={() => window.open('${WA_URL}', '_blank')}
                >
                  Reserve via WhatsApp →
                </button>"""

src2 = src2.replace(old_eval_btn, new_eval_btn.replace('${WA_URL}', '${WA_URL}'))

with open(path2, 'w') as f:
    f.write(src2)

print('  ✓ Evaluation.tsx patched')

# ── FAQ.tsx ───────────────────────────────────────────────────
path3 = 'src/components/FAQ.tsx'
with open(path3, 'r') as f:
    src3 = f.read()

old_faq_end = """  {
    q: 'Is ₹2,500 per session or a subscription?',
    a: 'Per session. No commitments, no auto-renewals. Book when it works for you.',
  },
]"""

new_faq_end = """  {
    q: 'Is ₹2,500 per session or a subscription?',
    a: 'Per session. No commitments, no auto-renewals. Book when it works for you.',
  },
  {
    q: 'What happens between Session 1 and Session 2?',
    a: 'After Session 1, you solve the remaining phases of the case independently using AI as a thinking partner. You build a structured report of your analysis and share it with Ketan on WhatsApp before Session 2. This independent work is where real skill gets built.',
  },
  {
    q: 'What should my report include?',
    a: 'Ketan will share a checklist in Session 1. Typically: your hypotheses, the methodology you followed, key findings per phase, your final recommendation, and which AI prompts you found most useful. Format is flexible — clarity of thinking is what matters.',
  },
]"""

src3 = src3.replace(old_faq_end, new_faq_end)

with open(path3, 'w') as f:
    f.write(src3)

print('  ✓ FAQ.tsx patched (2 new questions added)')
PYEOF

# Inject actual WA_URL value
python3 - <<PYEOF2
import re

WA_URL = "${WA_URL}"

for path in ['src/components/CohortDetails.tsx', 'src/pages/Evaluation.tsx']:
    with open(path, 'r') as f:
        src = f.read()
    src = src.replace('\${WA_URL}', WA_URL)
    with open(path, 'w') as f:
        f.write(src)
    print(f'  ✓ WA URL injected into {path}')

PYEOF2

echo ""
echo "✅ Milestone 1 complete."
echo "   - CohortDetails: 5-step session model + WhatsApp CTA"
echo "   - Evaluation: WhatsApp CTA"
echo "   - FAQ: 2 new questions on independent work + report"
echo ""
echo "Next: run milestone-2-interest-form.sh"
