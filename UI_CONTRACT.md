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
