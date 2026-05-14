#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# HOTFIX — Fix TS errors from Milestone 1 & 2
# Run from repo root: bash hotfix-build-errors.sh
# ═══════════════════════════════════════════════════════════════

WHATSAPP_NUMBER="919XXXXXXXXX"   # ← Same number as before
WA_MSG="Hi%20Ketan%2C%20I%27d%20like%20to%20reserve%20a%20seat%20for%20the%20Friday%20AI%20Problem%20Solving%20Lab."
WA_URL="https://wa.me/${WHATSAPP_NUMBER}?text=${WA_MSG}"

echo "→ Fixing CohortDetails.tsx..."

python3 - <<PYEOF
WA_URL = "https://wa.me/${WHATSAPP_NUMBER}?text=${WA_MSG}"

path = 'src/components/CohortDetails.tsx'
with open(path, 'r') as f:
    src = f.read()

# Fix 1: escaped apostrophe in step 05 body
src = src.replace(
    "body: 'Ketan reviews each person\\'s thinking",
    "body: \"Ketan reviews each person's thinking"
).replace(
    "frameworks from the case.' },",
    "frameworks from the case.\" },"
)

# Fix 2: broken SKIP... URL that landed from the partial replace
# Replace the entire broken button block
import re
src = re.sub(
    r"SKIP[^\n]*\n(\s*>)\n(\s*Reserve via WhatsApp →\s*</button>)",
    f'onClick={{() => setFormOpen(true)}}\n            >\n            Reserve via WhatsApp →\n            </button>',
    src
)

# Also fix any raw URL that got injected without quotes in onClick
src = re.sub(
    r"onClick=\{\(\) => window\.open\(https://wa\.me/[^,]+, '_blank'\)\}",
    "onClick={() => setFormOpen(true)}",
    src
)

with open(path, 'w') as f:
    f.write(src)
print('  ✓ CohortDetails.tsx fixed')
PYEOF

echo "→ Fixing InterestForm.tsx..."

python3 - <<PYEOF
WA_URL = "https://wa.me/${WHATSAPP_NUMBER}?text=${WA_MSG}"

path = 'src/components/InterestForm.tsx'
with open(path, 'r') as f:
    src = f.read()

# Fix: raw URL injected without string quotes in href={...}
# Should be href="..." not href={raw_url}
import re

# Fix href={https://...} → href="https://..."
src = re.sub(
    r'href=\{https://wa\.me/[^}]+\}',
    f'href={{WA_HREF}}',
    src
)

# Ensure WA_HREF constant is correctly defined as a string
# Remove any broken WA_HREF line and re-add it properly
src = re.sub(
    r"const WA_HREF = [^\n]+\n",
    f"const WA_HREF = '{WA_URL}'\n",
    src
)

with open(path, 'w') as f:
    f.write(src)
print('  ✓ InterestForm.tsx fixed')
PYEOF

echo "→ Running build to verify..."
npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Hotfix complete. Build passed."
  echo "   Ready to deploy: vercel --prod"
else
  echo ""
  echo "⚠  Build still has errors. Paste the output above and I'll fix further."
fi
