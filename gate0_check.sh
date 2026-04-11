#!/usr/bin/env bash
# Gate 0 — Contract integrity check
# Add to top of every build script: source ./gate0_check.sh

echo "🔒 Gate 0 — Checking contracts..."
MISSING=0
for contract in UI_CONTRACT.md BUG_AUDIT.md CODE_QUALITY.md DEBT_REGISTER.md; do
  if [ ! -f "$contract" ]; then
    echo "  MISSING: $contract"
    MISSING=1
  else
    echo "  OK: $contract"
  fi
done

if [ "$MISSING" -eq 1 ]; then
  echo "Contracts missing. Run: bash generate_contracts.sh"
  exit 1
fi
echo "All contracts present. Proceeding."
echo ""
