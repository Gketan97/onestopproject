#!/usr/bin/env bash
# P2 — NOIR ANALYST Design System
# Run from project root: bash p2_design_system.sh

set -euo pipefail

echo "⚡ P2 — NOIR ANALYST Design System"
echo "────────────────────────────────────"

mkdir -p src/styles src/lib src/components/ui

# ── 1. styles/themes.css ─────────────────────────────────────────────────────
cat > src/styles/themes.css << 'THEMES_EOF'
/* ─────────────────────────────────────────────────────────────
   NOIR ANALYST — Design Token Layer
   Import BEFORE globals.css
   ───────────────────────────────────────────────────────────── */

@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Instrument+Serif:ital@0;1&display=swap');

/* ── Dark Mode (default) ── */
:root,
.dark {
  /* Backgrounds */
  --bg-base:     #0A0A0A;
  --bg-surface:  #111111;
  --bg-elevated: #1A1A1A;
  --bg-glass:    rgba(255, 255, 255, 0.04);

  /* Text */
  --text-primary:   #F0EEE8;
  --text-secondary: #A09E98;
  --text-muted:     #4A4845;

  /* Accents */
  --accent-primary:   #00D4FF;   /* cyan */
  --accent-secondary: #FFB800;   /* amber */
  --accent-purple:    #A855F7;   /* AI/purple */
  --accent-green:     #3DD68C;
  --accent-red:       #FF5C5C;

  /* Borders */
  --border-subtle:  rgba(255, 255, 255, 0.06);
  --border-default: rgba(255, 255, 255, 0.10);
  --border-strong:  rgba(255, 255, 255, 0.18);

  /* Shadows */
  --shadow-sm:   0 1px 3px rgba(0, 0, 0, 0.4);
  --shadow-md:   0 4px 16px rgba(0, 0, 0, 0.5);
  --shadow-lg:   0 8px 40px rgba(0, 0, 0, 0.6);
  --shadow-glow: 0 0 20px rgba(0, 212, 255, 0.15);
  --shadow-glow-amber: 0 0 20px rgba(255, 184, 0, 0.15);
  --shadow-glow-purple: 0 0 20px rgba(168, 85, 247, 0.15);

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 28px;

  /* Transitions */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out:   cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fast:   150ms;
  --duration-base:   250ms;
  --duration-slow:   450ms;

  /* Typography */
  --font-display: 'Instrument Serif', Georgia, serif;
  --font-heading: 'Syne', system-ui, sans-serif;
  --font-mono:    'DM Mono', 'SF Mono', monospace;
  --font-body:    'Syne', system-ui, sans-serif;
}

/* ── Light Mode ── */
.light {
  --bg-base:     #FAF9F6;
  --bg-surface:  #F4F2EE;
  --bg-elevated: #ECEAE4;
  --bg-glass:    rgba(0, 0, 0, 0.03);

  --text-primary:   #0F0F0F;
  --text-secondary: #5A5855;
  --text-muted:     #9A9895;

  --accent-primary:   #0066CC;
  --accent-secondary: #CC7700;
  --accent-purple:    #7C3AED;

  --border-subtle:  rgba(0, 0, 0, 0.06);
  --border-default: rgba(0, 0, 0, 0.10);
  --border-strong:  rgba(0, 0, 0, 0.18);

  --shadow-sm:   0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md:   0 4px 16px rgba(0, 0, 0, 0.10);
  --shadow-lg:   0 8px 40px rgba(0, 0, 0, 0.12);
  --shadow-glow: 0 0 20px rgba(0, 102, 204, 0.12);
}
THEMES_EOF
echo "✅ themes.css"

# ── 2. styles/globals.css ────────────────────────────────────────────────────
cat > src/styles/globals.css << 'GLOBALS_EOF'
/* ─────────────────────────────────────────────────────────────
   NOIR ANALYST — Global Styles + Animations
   ───────────────────────────────────────────────────────────── */

@import './themes.css';
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── Base reset ── */
@layer base {
  *, *::before, *::after { box-sizing: border-box; }

  html {
    background-color: var(--bg-base);
    color: var(--text-primary);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  body { min-height: 100dvh; }

  ::selection {
    background: rgba(0, 212, 255, 0.2);
    color: var(--text-primary);
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg-base); }
  ::-webkit-scrollbar-thumb {
    background: var(--border-default);
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover { background: var(--border-strong); }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }

  code, pre, kbd {
    font-family: var(--font-mono);
  }
}

/* ── Utility classes ── */
@layer utilities {
  /* Glassmorphism */
  .glass {
    background: var(--bg-glass);
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    border: 1px solid var(--border-subtle);
  }

  .glass-strong {
    background: rgba(255, 255, 255, 0.07);
    backdrop-filter: blur(24px) saturate(200%);
    -webkit-backdrop-filter: blur(24px) saturate(200%);
    border: 1px solid var(--border-default);
  }

  /* Text utilities */
  .text-display {
    font-family: var(--font-display);
    font-style: italic;
  }

  .text-heading { font-family: var(--font-heading); }
  .text-mono    { font-family: var(--font-mono); }

  .text-primary   { color: var(--text-primary); }
  .text-secondary { color: var(--text-secondary); }
  .text-muted     { color: var(--text-muted); }

  /* Gradient text */
  .gradient-cyan {
    background: linear-gradient(135deg, #00D4FF, #0066FF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .gradient-amber {
    background: linear-gradient(135deg, #FFB800, #FF7A00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .gradient-purple {
    background: linear-gradient(135deg, #A855F7, #EC4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Glow effects */
  .glow-cyan   { box-shadow: var(--shadow-glow); }
  .glow-amber  { box-shadow: var(--shadow-glow-amber); }
  .glow-purple { box-shadow: var(--shadow-glow-purple); }

  /* Focus ring */
  .focus-ring {
    outline: none;
  }
  .focus-ring:focus-visible {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
  }
}

/* ── Keyframe Animations ── */
@layer utilities {
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-16px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.94); }
    to   { opacity: 1; transform: scale(1); }
  }

  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }

  @keyframes countUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 10px rgba(0, 212, 255, 0.1); }
    50%       { box-shadow: 0 0 30px rgba(0, 212, 255, 0.3); }
  }

  @keyframes spinSlow {
    to { transform: rotate(360deg); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
  }

  /* Animation utility classes */
  .animate-fade-in        { animation: fadeIn 0.4s var(--ease-out-expo) both; }
  .animate-slide-up       { animation: slideUp 0.5s var(--ease-out-expo) both; }
  .animate-slide-in-left  { animation: slideInLeft 0.4s var(--ease-out-expo) both; }
  .animate-scale-in       { animation: scaleIn 0.35s var(--ease-out-expo) both; }
  .animate-count-up       { animation: countUp 0.4s var(--ease-out-expo) both; }
  .animate-pulse-glow     { animation: pulseGlow 2.5s ease-in-out infinite; }
  .animate-float          { animation: float 6s ease-in-out infinite; }
  .animate-spin-slow      { animation: spinSlow 3s linear infinite; }

  /* Shimmer skeleton */
  .skeleton {
    background: linear-gradient(
      90deg,
      var(--bg-surface) 25%,
      var(--bg-elevated) 50%,
      var(--bg-surface) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.6s ease-in-out infinite;
    border-radius: var(--radius-md);
  }

  /* Delay utilities */
  .delay-75  { animation-delay: 75ms; }
  .delay-100 { animation-delay: 100ms; }
  .delay-150 { animation-delay: 150ms; }
  .delay-200 { animation-delay: 200ms; }
  .delay-300 { animation-delay: 300ms; }
  .delay-500 { animation-delay: 500ms; }
}
GLOBALS_EOF
echo "✅ globals.css"

# ── 3. lib/motionVariants.ts ─────────────────────────────────────────────────
cat > src/lib/motionVariants.ts << 'VARIANTS_EOF'
import type { Variants } from 'framer-motion'

/* ─────────────────────────────────────────────────────────────
   NOIR ANALYST — Framer Motion Variant Library
   ───────────────────────────────────────────────────────────── */

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

/* Fade in from transparent */
export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: EASE_OUT_EXPO },
  },
}

/* Slide up + fade */
export const slideUp: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT_EXPO },
  },
}

/* Scale in from slightly smaller */
export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: EASE_OUT_EXPO },
  },
}

/* Slide in from left — progress nav items */
export const slideInLeft: Variants = {
  hidden:  { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: EASE_OUT_EXPO },
  },
}

/* Stagger container — wraps lists of children */
export const staggerChildren: Variants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren:   0.05,
    },
  },
}

/* Stagger item — used as child inside staggerChildren */
export const staggerItem: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT_EXPO },
  },
}

/* Reveal from center — center panel sections */
export const revealContent: Variants = {
  hidden:  { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: EASE_OUT_EXPO },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.98,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
}

/* Overlay backdrop */
export const overlayVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
}

/* Drawer / side panel */
export const drawerVariants: Variants = {
  hidden:  { x: '-100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: EASE_OUT_EXPO },
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
}

/* Tooltip pop */
export const tooltipVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.9, y: 4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: EASE_OUT_EXPO },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.15 },
  },
}
VARIANTS_EOF
echo "✅ motionVariants.ts"

# ── 4. components/ui/Card.tsx ────────────────────────────────────────────────
cat > src/components/ui/Card.tsx << 'CARD_EOF'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type CardVariant = 'default' | 'glass' | 'elevated' | 'outlined'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  hoverable?: boolean
  glowAccent?: 'cyan' | 'amber' | 'purple' | null
}

const variantClasses: Record<CardVariant, string> = {
  default:  'bg-[--bg-surface] border border-[--border-subtle]',
  glass:    'glass',
  elevated: 'bg-[--bg-elevated] border border-[--border-default] shadow-[--shadow-md]',
  outlined: 'bg-transparent border border-[--border-default]',
}

const glowClasses = {
  cyan:   'hover:shadow-[0_0_24px_rgba(0,212,255,0.15)] hover:border-[rgba(0,212,255,0.25)]',
  amber:  'hover:shadow-[0_0_24px_rgba(255,184,0,0.15)] hover:border-[rgba(255,184,0,0.25)]',
  purple: 'hover:shadow-[0_0_24px_rgba(168,85,247,0.15)] hover:border-[rgba(168,85,247,0.25)]',
} as const

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'glass', hoverable = false, glowAccent = null, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-[--radius-lg] p-6 transition-all duration-[--duration-base]',
        variantClasses[variant],
        hoverable && 'cursor-pointer hover:-translate-y-0.5',
        glowAccent && glowClasses[glowAccent],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
)
Card.displayName = 'Card'
CARD_EOF
echo "✅ Card.tsx"

# ── 5. components/ui/Button.tsx ──────────────────────────────────────────────
cat > src/components/ui/Button.tsx << 'BTN_EOF'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'amber' | 'purple'
type ButtonSize    = 'xs' | 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   ButtonVariant
  size?:      ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[--accent-primary] text-[--bg-base] font-semibold hover:opacity-90 ' +
    'shadow-[0_0_16px_rgba(0,212,255,0.25)] hover:shadow-[0_0_24px_rgba(0,212,255,0.4)]',
  secondary:
    'glass border border-[--border-default] text-[--text-primary] ' +
    'hover:border-[--border-strong] hover:bg-[rgba(255,255,255,0.07)]',
  ghost:
    'text-[--text-secondary] hover:text-[--text-primary] hover:bg-[rgba(255,255,255,0.05)]',
  danger:
    'bg-[rgba(255,92,92,0.12)] text-[--accent-red] border border-[rgba(255,92,92,0.25)] ' +
    'hover:bg-[rgba(255,92,92,0.2)]',
  amber:
    'bg-[--accent-secondary] text-[--bg-base] font-semibold hover:opacity-90 ' +
    'shadow-[0_0_16px_rgba(255,184,0,0.25)] hover:shadow-[0_0_24px_rgba(255,184,0,0.4)]',
  purple:
    'bg-[--accent-purple] text-white font-semibold hover:opacity-90 ' +
    'shadow-[0_0_16px_rgba(168,85,247,0.25)] hover:shadow-[0_0_24px_rgba(168,85,247,0.4)]',
}

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'h-7  px-3   text-xs  rounded-[--radius-sm] gap-1.5',
  sm: 'h-9  px-4   text-sm  rounded-[--radius-md] gap-2',
  md: 'h-11 px-5   text-sm  rounded-[--radius-md] gap-2',
  lg: 'h-13 px-7   text-base rounded-[--radius-lg] gap-2.5',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant   = 'primary',
      size      = 'md',
      isLoading = false,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled ?? isLoading}
      className={cn(
        'inline-flex items-center justify-center font-medium',
        'transition-all duration-[--duration-fast]',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-[--accent-primary] focus-visible:ring-offset-1',
        'focus-visible:ring-offset-[--bg-base]',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
        'active:scale-[0.97]',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <span
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
      ) : null}
      {children}
    </button>
  ),
)
Button.displayName = 'Button'
BTN_EOF
echo "✅ Button.tsx"

# ── 6. components/ui/Badge.tsx ───────────────────────────────────────────────
cat > src/components/ui/Badge.tsx << 'BADGE_EOF'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'cyan' | 'amber' | 'purple' | 'green' | 'red' | 'outline'
type BadgeSize    = 'sm' | 'md'

interface BadgeProps {
  children:  React.ReactNode
  variant?:  BadgeVariant
  size?:     BadgeSize
  dot?:      boolean
  pulse?:    boolean
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[rgba(255,255,255,0.07)] text-[--text-secondary] border border-[--border-subtle]',
  cyan:    'bg-[rgba(0,212,255,0.10)] text-[--accent-primary]  border border-[rgba(0,212,255,0.20)]',
  amber:   'bg-[rgba(255,184,0,0.10)] text-[--accent-secondary] border border-[rgba(255,184,0,0.20)]',
  purple:  'bg-[rgba(168,85,247,0.10)] text-[--accent-purple]  border border-[rgba(168,85,247,0.20)]',
  green:   'bg-[rgba(61,214,140,0.10)] text-[--accent-green]   border border-[rgba(61,214,140,0.20)]',
  red:     'bg-[rgba(255,92,92,0.10)]  text-[--accent-red]     border border-[rgba(255,92,92,0.20)]',
  outline: 'bg-transparent text-[--text-secondary] border border-[--border-default]',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px] rounded-md gap-1',
  md: 'px-2.5 py-1 text-xs    rounded-[--radius-sm] gap-1.5',
}

const dotColorMap: Record<BadgeVariant, string> = {
  default: 'bg-[--text-muted]',
  cyan:    'bg-[--accent-primary]',
  amber:   'bg-[--accent-secondary]',
  purple:  'bg-[--accent-purple]',
  green:   'bg-[--accent-green]',
  red:     'bg-[--accent-red]',
  outline: 'bg-[--text-secondary]',
}

export function Badge({
  children,
  variant  = 'default',
  size     = 'md',
  dot      = false,
  pulse    = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium font-[--font-mono] tracking-wide',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            'shrink-0 w-1.5 h-1.5 rounded-full',
            dotColorMap[variant],
            pulse && 'animate-pulse',
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}
BADGE_EOF
echo "✅ Badge.tsx"

# ── 7. components/ui/Input.tsx ───────────────────────────────────────────────
cat > src/components/ui/Input.tsx << 'INPUT_EOF'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type InputSize = 'sm' | 'md' | 'lg'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:       string
  hint?:        string
  error?:       string
  inputSize?:   InputSize
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
}

const sizeClasses: Record<InputSize, string> = {
  sm: 'h-8  text-sm  px-3   rounded-[--radius-sm]',
  md: 'h-11 text-sm  px-4   rounded-[--radius-md]',
  lg: 'h-13 text-base px-5  rounded-[--radius-md]',
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      hint,
      error,
      inputSize = 'md',
      leadingIcon,
      trailingIcon,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-[--text-secondary] font-[--font-mono] uppercase tracking-wider"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leadingIcon && (
            <span className="absolute left-3 text-[--text-muted] pointer-events-none flex items-center">
              {leadingIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-[--bg-surface] text-[--text-primary]',
              'border border-[--border-default]',
              'placeholder:text-[--text-muted]',
              'transition-all duration-[--duration-fast]',
              'focus:outline-none focus:border-[--accent-primary]',
              'focus:shadow-[0_0_0_3px_rgba(0,212,255,0.12)]',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              error && 'border-[--accent-red] focus:border-[--accent-red] focus:shadow-[0_0_0_3px_rgba(255,92,92,0.12)]',
              leadingIcon  && 'pl-10',
              trailingIcon && 'pr-10',
              sizeClasses[inputSize],
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />

          {trailingIcon && (
            <span className="absolute right-3 text-[--text-muted] pointer-events-none flex items-center">
              {trailingIcon}
            </span>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-xs text-[--accent-red] font-[--font-mono]">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-xs text-[--text-muted]">
            {hint}
          </p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'
INPUT_EOF
echo "✅ Input.tsx"

# ── 8. components/ui/GlowEffect.tsx ─────────────────────────────────────────
cat > src/components/ui/GlowEffect.tsx << 'GLOW_EOF'
import { cn } from '@/lib/utils'

type GlowAccent = 'cyan' | 'amber' | 'purple' | 'green'
type GlowSize   = 'sm' | 'md' | 'lg' | 'xl'

interface GlowEffectProps {
  accent?:    GlowAccent
  size?:      GlowSize
  intensity?: 'subtle' | 'medium' | 'strong'
  position?:  'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  className?: string
  fixed?:     boolean
}

const accentColors: Record<GlowAccent, [number, number, number]> = {
  cyan:   [0, 212, 255],
  amber:  [255, 184, 0],
  purple: [168, 85, 247],
  green:  [61, 214, 140],
}

const sizeMap: Record<GlowSize, string> = {
  sm: 'w-48 h-48',
  md: 'w-72 h-72',
  lg: 'w-[450px] h-[450px]',
  xl: 'w-[700px] h-[700px]',
}

const intensityMap = {
  subtle: 0.06,
  medium: 0.10,
  strong: 0.18,
} as const

const positionMap: Record<NonNullable<GlowEffectProps['position']>, string> = {
  'top-left':     '-top-24 -left-24',
  'top-right':    '-top-24 -right-24',
  'bottom-left':  '-bottom-24 -left-24',
  'bottom-right': '-bottom-24 -right-24',
  'center':       'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
}

export function GlowEffect({
  accent    = 'cyan',
  size      = 'lg',
  intensity = 'subtle',
  position  = 'top-left',
  fixed     = false,
  className,
}: GlowEffectProps) {
  const alpha = intensityMap[intensity]
  const [r, g, b] = accentColors[accent]

  return (
    <div
      aria-hidden="true"
      className={cn(
        fixed ? 'fixed' : 'absolute',
        'rounded-full pointer-events-none z-0',
        sizeMap[size],
        positionMap[position],
        className,
      )}
      style={{
        background: `radial-gradient(circle, rgba(${r}, ${g}, ${b}, ${alpha}) 0%, transparent 70%)`,
        filter: 'blur(80px)',
      }}
    />
  )
}
GLOW_EOF
echo "✅ GlowEffect.tsx"

# ── 9. components/ui/index.ts (barrel) ──────────────────────────────────────
cat > src/components/ui/index.ts << 'BARREL_EOF'
export { Button }     from './Button'
export { Badge }      from './Badge'
export { Card }       from './Card'
export { Input }      from './Input'
export { GlowEffect } from './GlowEffect'
BARREL_EOF
echo "✅ ui/index.ts"

# ── 10. lib/motionVariants barrel export ────────────────────────────────────
# already created at src/lib/motionVariants.ts

# ── 11. Update tailwind.config.js to expose CSS vars ────────────────────────
cat > tailwind.config.js << 'TAILWIND_EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Syne', 'system-ui', 'sans-serif'],
        mono:    ['DM Mono', 'SF Mono', 'monospace'],
        display: ['Instrument Serif', 'Georgia', 'serif'],
      },
      colors: {
        /* Map CSS vars to Tailwind — use as bg-bg-base, text-accent-primary etc. */
        'bg-base':     'var(--bg-base)',
        'bg-surface':  'var(--bg-surface)',
        'bg-elevated': 'var(--bg-elevated)',
        'accent-primary':   'var(--accent-primary)',
        'accent-secondary': 'var(--accent-secondary)',
        'accent-purple':    'var(--accent-purple)',
        'accent-green':     'var(--accent-green)',
        'accent-red':       'var(--accent-red)',
        'text-primary':   'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted':     'var(--text-muted)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
      },
      boxShadow: {
        sm:   'var(--shadow-sm)',
        md:   'var(--shadow-md)',
        lg:   'var(--shadow-lg)',
        glow: 'var(--shadow-glow)',
      },
      height: {
        '13': '3.25rem',
      },
    },
  },
  plugins: [],
}
TAILWIND_EOF
echo "✅ tailwind.config.js"

# ── 12. Update App.tsx to import themes.css ──────────────────────────────────
cat > src/app/App.tsx << 'APP_EOF'
import { Providers } from './Providers'
import { AppRouter }  from './Router'
import { useTheme }   from '@/hooks/useTheme'
import '@/styles/themes.css'
import '@/styles/globals.css'

function ThemeSync() { useTheme(); return null }

export default function App() {
  return (
    <Providers>
      <ThemeSync />
      <AppRouter />
    </Providers>
  )
}
APP_EOF
echo "✅ App.tsx updated"

# ── 13. Type-check ───────────────────────────────────────────────────────────
echo ""
echo "🧠 Running type-check..."
npx tsc --noEmit && echo "✅ Zero TypeScript errors" || echo "❌ Fix errors above"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " P2 Design System complete."
echo " Files created:"
echo "  src/styles/themes.css"
echo "  src/styles/globals.css"
echo "  src/lib/motionVariants.ts"
echo "  src/components/ui/Card.tsx"
echo "  src/components/ui/Button.tsx"
echo "  src/components/ui/Badge.tsx"
echo "  src/components/ui/Input.tsx"
echo "  src/components/ui/GlowEffect.tsx"
echo "  src/components/ui/index.ts"
echo "  tailwind.config.js (updated)"
echo "  src/app/App.tsx (updated)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
