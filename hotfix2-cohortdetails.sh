#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# HOTFIX 2 — Direct rewrite of broken CohortDetails button
# Run from repo root: bash hotfix2-cohortdetails.sh
# ═══════════════════════════════════════════════════════════════

echo "→ Printing lines 258–270 of CohortDetails.tsx for diagnosis..."
sed -n '258,270p' src/components/CohortDetails.tsx

echo ""
echo "→ Rewriting broken button block..."

python3 << 'PYEOF'
path = 'src/components/CohortDetails.tsx'
with open(path, 'r') as f:
    src = f.read()

# Find and replace ANY variant of the broken/old CTA button in CohortDetails
# (handles Razorpay URL, broken SKIP, or partial wa.me injection)
import re

# Pattern: the cohort-card-btn button regardless of its onClick content
src = re.sub(
    r'<button\s+className="cohort-card-btn"[^>]*onClick=\{[^}]*\}[^>]*\s*>\s*[^<]*</button>',
    '<button\n              className="cohort-card-btn"\n              onClick={() => setFormOpen(true)}\n            >\n              Reserve via WhatsApp →\n            </button>',
    src,
    flags=re.DOTALL
)

with open(path, 'w') as f:
    f.write(src)
print('  ✓ Button rewritten')

# Verify the fix
with open(path, 'r') as f:
    check = f.read()
if 'rzp.io' in check:
    print('  ⚠ Razorpay URL still present — manual fix needed')
elif 'SKIP' in check:
    print('  ⚠ SKIP fragment still present — manual fix needed')
else:
    print('  ✓ No stale URLs detected')
PYEOF

echo ""
echo "→ Running build..."
npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Build passed. Ready to deploy."
else
  echo ""
  echo "→ Printing lines around the error for manual inspection..."
  sed -n '258,275p' src/components/CohortDetails.tsx
fi
