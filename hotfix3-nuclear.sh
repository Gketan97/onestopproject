#!/bin/bash
# Nuclear fix — rewrites the broken card section of CohortDetails directly
# Run from repo root: bash hotfix3-nuclear.sh

WHATSAPP_NUMBER="919XXXXXXXXX"   # ← Update this
WA_MSG="Hi%20Ketan%2C%20I%27d%20like%20to%20reserve%20a%20seat%20for%20the%20Friday%20AI%20Problem%20Solving%20Lab."
WA_URL="https://wa.me/${WHATSAPP_NUMBER}?text=${WA_MSG}"

python3 - "$WA_URL" << 'PYEOF'
import sys
WA_URL = sys.argv[1]

path = 'src/components/CohortDetails.tsx'
with open(path, 'r') as f:
    src = f.read()

# ── Strategy: find the card div start, replace everything to end of component ──
# Split at the card price block which is stable and untouched
ANCHOR = '            <div className="cohort-card-price">₹2,500</div>'

if ANCHOR not in src:
    print('ERROR: anchor not found — print first 10 lines around card:')
    for i, line in enumerate(src.split('\n')):
        if 'cohort-card' in line:
            print(f'  {i+1}: {line}')
    sys.exit(1)

before, _ = src.split(ANCHOR, 1)

# Everything from the price div to end of component, freshly written
after = f'''            <div className="cohort-card-price">₹2,500</div>
            <div className="cohort-card-per">per session</div>

            <div className="cohort-card-includes">
              {{[
                '2-hour live session with Ketan',
                'Independent case work with AI',
                'Structured report feedback',
                'Session recording',
                'Case study materials',
              ].map((item, i) => (
                <span key={{i}} className="cohort-card-include">{{item}}</span>
              ))}}
            </div>

            <button
              className="cohort-card-btn"
              onClick={{() => setFormOpen(true)}}
            >
              Reserve via WhatsApp →
            </button>
            <div className="cohort-card-trust">
              No auto-renewal · Pay per session
            </div>
          </div>
        </div>
      </section>
      <InterestForm open={{formOpen}} onClose={{() => setFormOpen(false)}} waUrl={{'{WA_URL}'}} />
    </>
  )
}}
'''

result = before + after.replace("{WA_URL}", WA_URL)

with open(path, 'w') as f:
    f.write(result)

print('✓ CohortDetails.tsx card section rewritten cleanly')
PYEOF

echo ""
echo "→ Running build..."
npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Build passed. All errors fixed."
else
  echo ""
  echo "Remaining errors — printing full file lines 240-280:"
  sed -n '240,280p' src/components/CohortDetails.tsx
fi
