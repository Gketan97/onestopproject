#!/bin/bash
# Run from repo root: bash install-preread.sh

echo "Installing PreRead component..."

# Copy PreRead to components
cp $(ls -t ~/Downloads/PreRead*.tsx | head -1) src/components/PreRead.tsx
echo "  ✓ PreRead.tsx → src/components/PreRead.tsx"

# Copy updated Cohort (with PreRead gate)
cp $(ls -t ~/Downloads/Cohort*.tsx | head -1) src/pages/Cohort.tsx
echo "  ✓ Cohort.tsx → src/pages/Cohort.tsx"

# Build
echo ""
echo "→ Building..."
npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Done — push live:"
  echo "  git add . && git commit -m 'feat: pre-read 4-page experience, gates cohort content' && git push origin signal-mvp"
else
  echo "⚠ Build failed — paste errors above"
fi
