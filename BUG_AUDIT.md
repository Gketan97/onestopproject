# OSC BUG AUDIT CONTRACT v1.0
# Every build script MUST run these checks before delivery.
# Any BLOCKING failure = fix before shipping.

---

## GATE 1 — TypeScript (BLOCKING)
npx tsc --noEmit
Zero errors required. No exceptions.

## GATE 2 — Forbidden Patterns (BLOCKING)
Run this block:

  # No raw hex in JSX/TSX
  grep -rn "#[0-9A-Fa-f]\{6\}" src/pages src/components --include="*.tsx" \
    | grep -v "//" && echo "RAW HEX FOUND" || echo "ok: no raw hex"

  # No old tokens
  grep -rn "var(--ink\|text-ink\|bg-ink" src/ --include="*.tsx" \
    && echo "OLD TOKENS FOUND" || echo "ok: no old tokens"

  # No use client
  grep -rn "'use client'" src/ --include="*.tsx" \
    && echo "USE CLIENT FOUND" || echo "ok: no use client"

  # No console.log
  grep -rn "console\.log" src/ --include="*.ts" --include="*.tsx" \
    && echo "CONSOLE.LOG FOUND" || echo "ok: no console.log"

## GATE 3 — Required Page Elements (BLOCKING)
Every full-page view must have:
  - Ambient glow orbs (fixed inset-0)
  - relative z-10 on content wrapper
  - Layout wrapper
  - pt-16 (navbar clearance)
  - At minimum slideUp animation on hero content
  - viewport={{ once: true }} on all whileInView

## GATE 4 — Accessibility (NON-BLOCKING, log to DEBT_REGISTER)
  - Icon-only buttons have aria-label
  - All inputs have label
  - Images have alt text
  - Focus-visible styles present

## GATE 5 — Mobile
  - No horizontal scroll at 375px
  - Case study pages show MobileGate below 1024px

## PRE-DELIVERY SCRIPT
  echo "Running Bug Audit..."
  npx tsc --noEmit && echo "TS: clean" || echo "TS: ERRORS"
  grep -rn "'use client'" src/ --include="*.tsx" && echo "FAIL: use client" || echo "ok"
  grep -rn "console\.log" src/ --include="*.tsx" && echo "WARN: console.log" || echo "ok"
  echo "Audit complete"
