#!/usr/bin/env bash
# OSC — Contract Generator
# Run from project root: bash generate_contracts.sh

set -euo pipefail

echo "📋 Generating OSC Project Contracts..."
echo "────────────────────────────────────────"

# ── 1. UI_CONTRACT.md ─────────────────────────────────────────────────────────
cat > UI_CONTRACT.md << 'UIEOF'
# OSC UI CONTRACT v1.0
# READ THIS BEFORE WRITING ANY UI CODE
# Every component, page, and animation must comply.
# Non-compliance = reject and rebuild.

---

## 1. DESIGN LANGUAGE — NOIR ANALYST

Aesthetic: Editorial noir. Dark, high-contrast, cinematic.
Inspiration: Bloomberg Terminal meets FAANG design system.
Rule: Every screen must feel like it belongs to the same product.

---

## 2. COLOR USAGE — WHEN TO USE WHAT

### Accent Assignment (NEVER arbitrary)
- --accent-primary (#00D4FF cyan)    -> Data, metrics, technical elements, CTAs
- --accent-secondary (#FFB800 amber) -> Warnings, business impact, hero headlines
- --accent-purple (#A855F7)          -> AI mentor Arjun, AI-generated content ONLY
- --accent-green (#3DD68C)           -> Success states, completed phases, positive metrics
- --accent-red (#FF5C5C)             -> Errors, negative metrics, critical alerts

### Text Hierarchy (NEVER skip levels)
- --text-primary   -> Headings, key data, active labels
- --text-secondary -> Body copy, descriptions, supporting text
- --text-muted     -> Timestamps, metadata, disabled states

### Background Hierarchy
- --bg-base     -> Page background ONLY
- --bg-surface  -> Cards, panels, sidebar
- --bg-elevated -> Modals, dropdowns, tooltips, hover states
- --bg-glass    -> Overlays, frosted panels (always with backdrop-filter)

### NEVER DO:
- Raw hex values in JSX/TSX (use CSS vars only)
- Old tokens: --ink, --ink2, --ink3, --accent, --blue, --green (deleted)
- Mixing accent colors randomly
- White cards on white background in light mode

---

## 3. TYPOGRAPHY RULES

### Font Roles (STRICT)
- var(--font-heading)  -> All h1-h4, nav labels, card titles (Syne)
- var(--font-mono)     -> Metrics, code, labels, badges, timestamps (DM Mono)
- var(--font-display)  -> Hero italic accents, Arjun quotes ONLY (Instrument Serif)

### Size Scale
- Hero:         clamp(48px, 8vw, 96px), font-bold, tracking-tight
- Section head: text-3xl to text-4xl, font-bold
- Card title:   text-base to text-lg, font-semibold
- Body:         text-sm to text-base, leading-relaxed
- Label/Badge:  text-xs, uppercase, tracking-widest, font-mono
- Micro:        text-[10px], font-mono ONLY

### Approved Gradient Text Patterns (3 only)
- Amber to Purple to Cyan: Hero headlines (Home only)
- Cyan to Blue:            Data/metric highlights
- Purple to Pink:          AI/Arjun content ONLY

---

## 4. SPACING AND LAYOUT RHYTHM

### Page Layout
- Max width:      max-w-5xl (content), max-w-7xl (full-bleed)
- Horizontal pad: px-6 mobile, px-8 desktop
- Section gap:    py-20 to py-32
- Component gap:  gap-5 cards, gap-6 sections, gap-4 form elements

### Card Anatomy
- Padding:    p-6 standard, p-8 featured
- Radius:     rounded-2xl cards, rounded-xl inner, rounded-lg buttons
- Border:     border-[--border-subtle] default, --border-default on hover

### Grid Patterns
- Features/Cards: grid-cols-1 md:grid-cols-3
- Split layout:   grid-cols-[1fr_420px]
- Stats row:      grid-cols-3 gap-px (flush, no gap)

---

## 5. GLASSMORPHISM RULES

### APPROVED glass usage:
- Navbar, modals, floating panels, Arjun mentor cards, badge pills

### Glass formula (EXACT):
  background: rgba(255,255,255,0.04)
  backdrop-filter: blur(12px) saturate(180%)
  border: 1px solid rgba(255,255,255,0.06)

### NEVER:
- Glass on page background
- Glass without backdrop-filter
- More than 3 glass layers stacked

---

## 6. ANIMATION RULES

### Framer Motion — Which Variant for Which Moment
- fadeIn          -> Simple appear, overlays, badges
- slideUp         -> Hero text blocks, section headings
- staggerChildren -> Any list of 3+ items
- staggerItem     -> Child of staggerChildren ONLY
- revealContent   -> Phase content, modal content
- slideInLeft     -> Progress nav items, sidebar entries
- scaleIn         -> Modals, tooltips, popups

### Timing Rules
- Page load:    delayChildren 0.05, staggerChildren 0.08
- Hover:        duration 0.2s MAX
- Scroll:       viewport={{ once: true, margin: '-80px' }}
- Exit:         duration 0.25s max

### NEVER:
- Decorative spin/bounce with no purpose
- Duration > 0.6s for UI interactions
- Animating on every render without once:true

---

## 7. AMBIENT GLOW ORBS (mandatory on all full-page views)

Every full-height page MUST have ambient orbs. Standard 3-orb pattern:

  Top-left:    amber  rgba(255,184,0,0.07)    w-600 blur-60
  Top-right:   purple rgba(168,85,247,0.07)   w-500 blur-80
  Bottom:      cyan   rgba(0,212,255,0.06)    w-400 blur-80

All orbs: fixed position, pointer-events-none, z-0, opacity-60
Content wrapper: relative z-10

---

## 8. COMPONENT USAGE RULES

### Button
- Primary (cyan):   ONE main CTA per view
- Secondary:        Max TWO per view
- Ghost:            Nav, cancel, back
- Amber:            Business/revenue CTAs
- Purple:           AI/Arjun interactions ONLY
- NEVER raw button tags

### Badge
- dot+pulse: Live status ONLY
- NEVER decorative

### Card variants
- glass:    Mentor panels, featured content
- elevated: Stats, important callouts
- default:  Standard cards
- outlined: Secondary info

### Input
- Always include label prop
- Always include hint or error when relevant
- NEVER raw input tags

---

## 9. NAVBAR RULES

- Always: fixed top, glass, border-b, z-50
- Content: always pt-16 for navbar clearance
- Theme toggle: ghost Button, right side

---

## 10. LIGHT MODE RULES

- bg-base: #FAF9F6 (warm white, NOT pure white)
- Glass: background rgba(0,0,0,0.03)
- Orb opacity: 50% of dark mode values
- Never white cards on white background
UIEOF
echo "✅ UI_CONTRACT.md"

# ── 2. BUG_AUDIT.md ──────────────────────────────────────────────────────────
cat > BUG_AUDIT.md << 'BUGEOF'
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
BUGEOF
echo "✅ BUG_AUDIT.md"

# ── 3. CODE_QUALITY.md ───────────────────────────────────────────────────────
cat > CODE_QUALITY.md << 'CQEOF'
# OSC CODE QUALITY CONTRACT v1.0
# FAANG-level standards. Every file must comply.
# Violations go to DEBT_REGISTER.md

---

## 1. TYPESCRIPT RULES

- Explicit return types on all exported functions
- No `any` — use `unknown` and narrow, or define interfaces
- No non-null assertions (!) without a comment
- Props interfaces defined above component, not inline
- No implicit any from missing types

## 2. NAMING CONVENTIONS

- Components:      PascalCase
- Hooks:           camelCase, prefix `use`
- Stores:          camelCase, suffix `Store`
- Constants:       SCREAMING_SNAKE_CASE
- Types/Interfaces: PascalCase, no I-prefix
- Files:           PascalCase for components, camelCase for utils/hooks

## 3. COMPONENT FILE STRUCTURE (in order)

  1. External imports
  2. Internal imports
  3. Types/interfaces
  4. Constants
  5. Helper functions (small only, else extract to lib/)
  6. Component definition
  7. Export

## 4. FORBIDDEN PATTERNS

  NEVER:
    style={{ color: '#00D4FF' }}           // raw hex
    className="text-blue-500"             // Tailwind color scale
    React.FC<Props>                        // use function syntax
    <div onClick={fn} role="button">      // fake button

  ALWAYS:
    style={{ color: 'var(--accent-primary)' }}
    className={cn('base', condition && 'extra', className)}
    function MyComp({ className }: Props) {
    <Button variant="primary" onClick={fn}>

## 5. ZUSTAND RULES

- All stores use persist middleware with unique name key
- Never mutate state directly
- Always destructure only what you need from stores
- Selectors use shallow for object slices
- Reset functions must use exact initialState object

## 6. ROUTING RULES

- All routes: lazy() + Suspense with PageLoader fallback
- Route params typed: useParams<{ slug: string }>()
- Redirects always use replace: true
- Phase guard logic in usePhaseGate hook only, never inline

## 7. PERFORMANCE RULES

- Framer Motion: viewport={{ once: true }} on all scroll animations
- Ambient orbs: fixed (not absolute) to avoid reflow
- Lists: key by stable ID, never array index for dynamic lists
- Zustand: never subscribe to whole store

## 8. FILE SIZE LIMITS

- Component:  250 lines max
- Page:       400 lines max
- Store:      150 lines max
- Function:   40 lines max

## 9. IMPORT ORDER

  1. React core
  2. External libs (alphabetical)
  3. Internal stores and hooks
  4. Internal components
  5. Internal lib and types
  6. Styles (last)

## 10. PHASE COMPONENT STANDARDS

Every phase component must:
- Accept onComplete: () => void prop
- Accept caseConfig: CaseConfig prop
- Show MobileGate if window.innerWidth < 1024
- Use usePhaseGate for access control
- Call phaseCompleted() only after real user interaction
- Show progress indicator (phase X of Y)
- End with Button variant="primary" Complete CTA
CQEOF
echo "✅ CODE_QUALITY.md"

# ── 4. DEBT_REGISTER.md ──────────────────────────────────────────────────────
cat > DEBT_REGISTER.md << 'DREOF'
# OSC TECHNICAL DEBT REGISTER v1.0
# Log ALL shortcuts, TODOs, known issues here.
# Review before each new prompt. Clear when fixed.
# Format: [DATE] [SEVERITY] [FILE] — Description -> Fix plan

---

## SEVERITY LEVELS
- CRITICAL -> Blocks functionality or causes runtime errors
- HIGH     -> Degrades UX or creates type unsafety
- LOW      -> Minor polish, cleanup, optimization

---

## OPEN ITEMS

### HIGH
- [2026-04-07] [src/pages/Home/index.tsx]
  Light mode glow orbs not tested — opacity may be too strong on #FAF9F6.
  Fix: Add .light class opacity override to orb divs.

- [2026-04-07] [src/components/ui/GlowEffect.tsx]
  GlowEffect component exists but ambient orbs are still inline in pages.
  Fix: Refactor pages to use GlowEffect component.

- [2026-04-07] [src/hooks/usePhaseGate.ts]
  useProgressStore.getState() called inside function — can cause stale closure.
  Fix: Use selector pattern or pass currentPhase as argument.

### LOW
- [2026-04-07] [src/components/animations/FadeIn.tsx]
  FadeIn uses old design tokens. Redundant now motionVariants.ts exists.
  Fix: Deprecate FadeIn.tsx, migrate usages to motion.div + slideUp.

- [2026-04-07] [src/pages/CaseStudies/index.tsx]
  CASES array hardcoded in page. Should be a central registry.
  Fix: Create src/data/cases.ts with CaseConfig[], import everywhere.

- [2026-04-07] [src/components/layout/Navbar.tsx]
  No mobile menu below 768px.
  Fix: Hamburger menu (low priority — desktop-first product).

- [2026-04-07] [General]
  No error boundary. Lazy-loaded pages show blank on chunk failure.
  Fix: ErrorBoundary in app/Providers.tsx.

- [2026-04-07] [tailwind.config.js]
  height-13 (3.25rem) non-standard custom token for Button lg.
  Fix: Use h-12 or h-14, adjust Button padding.

---

## CLEARED ITEMS

- [2026-04-07] utils.ts had 'ximport' corruption -> FIXED
- [2026-04-07] Badge variants mismatch (blue/accent/muted) -> FIXED
- [2026-04-07] GlowEffect malformed radial-gradient -> FIXED
- [2026-04-07] index.html missing script tag -> FIXED
- [2026-04-07] @vitejs/plugin-react missing -> FIXED
- [2026-04-07] use client in simulator files -> FIXED (files deleted)
- [2026-04-07] @types/react-dom missing -> FIXED
DREOF
echo "✅ DEBT_REGISTER.md"

# ── 5. gate0_check.sh ────────────────────────────────────────────────────────
cat > gate0_check.sh << 'GATEEOF'
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
GATEEOF
chmod +x gate0_check.sh
echo "✅ gate0_check.sh"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " 4 Contracts generated + gate0_check.sh"
echo ""
echo " UI_CONTRACT.md    — Design rules (colors, type, animation, layout)"
echo " BUG_AUDIT.md      — Pre-delivery checklist (TS, hex, tokens, a11y)"
echo " CODE_QUALITY.md   — FAANG code standards (naming, structure, perf)"
echo " DEBT_REGISTER.md  — Known issues tracker (open + cleared)"
echo " gate0_check.sh    — Auto-fails any build script if contracts missing"
echo ""
echo " HOW CLAUDE READS THEM:"
echo " Every build prompt: start with 'Read contracts first'"
echo " Every build script: starts with 'source ./gate0_check.sh'"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
