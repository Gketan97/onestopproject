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
