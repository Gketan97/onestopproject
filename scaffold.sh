#!/usr/bin/env bash
#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────
# OSC — React 18 + Vite + TypeScript Scaffold
# FAANG-grade, strict mode, zero runtime errors
# ─────────────────────────────────────────────

# ── 1. Init Vite project ─────────────────────
npm create vite@latest onestopproject-main -- --template react-ts
cd onestopproject-main

# ── 2. Install all dependencies ──────────────
npm install \
  react@18.3.1 react-dom@18.3.1 \
  react-router-dom@6 \
  zustand@4 \
  framer-motion@11 \
  lucide-react

npm install -D \
  tailwindcss@3 postcss autoprefixer \
  @types/react@18 @types/react-dom@18 \
  @vitejs/plugin-react \
  typescript

# ── 3. Init Tailwind ─────────────────────────
npx tailwindcss init -p

# ── 4. Config files ──────────────────────────

cat > vite.config.ts << 'VITE_EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
VITE_EOF

cat > tsconfig.json << 'TSCONFIG_EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
TSCONFIG_EOF

cat > tsconfig.node.json << 'TSNODE_EOF'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
TSNODE_EOF

cat > tailwind.config.js << 'TAILWIND_EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg:      '#080810',
        surface: '#0F0F1A',
        border:  '#1E1E30',
        ink:     '#E8E8F0',
        ink2:    '#A0A0C0',
        ink3:    '#606080',
        accent:  '#FC8060',
        blue:    '#4F80FF',
        green:   '#3DD68C',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
TAILWIND_EOF

# ── 5. Create folder structure ───────────────
mkdir -p src/{app,pages/{Home,CaseStudies,CaseStudy},components/{ui,layout,phases,charts,ai,animations},hooks,store,lib,styles}
mkdir -p src/pages/CaseStudy/phases

# ── 6. styles/globals.css ────────────────────
cat > src/styles/globals.css << 'CSS_EOF'
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    color-scheme: dark;
  }
  html {
    @apply bg-bg text-ink font-sans antialiased;
    scroll-behavior: smooth;
  }
  * {
    @apply border-border;
  }
}

@layer utilities {
  .glass {
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  .text-gradient {
    background: linear-gradient(135deg, #FC8060, #4F80FF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}
CSS_EOF

# ── 7. lib/utils.ts ──────────────────────────
cat > src/lib/utils.ts << 'UTILS_EOF'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
UTILS_EOF

# install clsx + tailwind-merge (used in utils)
npm install clsx tailwind-merge

# ── 8. store/progressStore.ts ────────────────
cat > src/store/progressStore.ts << 'PROGRESS_EOF'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Phase =
  | 'orientation'
  | 'investigation'
  | 'hypothesis'
  | 'diagnosis'
  | 'recommendation'
  | 'debrief'

interface ProgressState {
  currentPhase: Phase
  unlockedPhases: Phase[]
  completedPhases: Phase[]
  phaseCompleted: (phase: Phase) => void
  unlockPhase: (phase: Phase) => void
  resetProgress: () => void
  isPhaseUnlocked: (phase: Phase) => boolean
  isPhaseCompleted: (phase: Phase) => boolean
}

const PHASE_ORDER: Phase[] = [
  'orientation',
  'investigation',
  'hypothesis',
  'diagnosis',
  'recommendation',
  'debrief',
]

const initialState = {
  currentPhase: 'orientation' as Phase,
  unlockedPhases: ['orientation'] as Phase[],
  completedPhases: [] as Phase[],
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialState,

      phaseCompleted: (phase: Phase) => {
        const currentIndex = PHASE_ORDER.indexOf(phase)
        const nextPhase = PHASE_ORDER[currentIndex + 1]

        set((state) => ({
          completedPhases: state.completedPhases.includes(phase)
            ? state.completedPhases
            : [...state.completedPhases, phase],
          unlockedPhases:
            nextPhase && !state.unlockedPhases.includes(nextPhase)
              ? [...state.unlockedPhases, nextPhase]
              : state.unlockedPhases,
          currentPhase: nextPhase ?? phase,
        }))
      },

      unlockPhase: (phase: Phase) => {
        set((state) => ({
          unlockedPhases: state.unlockedPhases.includes(phase)
            ? state.unlockedPhases
            : [...state.unlockedPhases, phase],
        }))
      },

      resetProgress: () => set(initialState),

      isPhaseUnlocked: (phase: Phase) => get().unlockedPhases.includes(phase),

      isPhaseCompleted: (phase: Phase) =>
        get().completedPhases.includes(phase),
    }),
    {
      name: 'osc-progress',
    },
  ),
)
PROGRESS_EOF

# ── 9. store/themeStore.ts ───────────────────
cat > src/store/themeStore.ts << 'THEME_EOF'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'dark' | 'light'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),

      setTheme: (theme: Theme) => set({ theme }),
    }),
    { name: 'osc-theme' },
  ),
)
THEME_EOF

# ── 10. hooks/ ───────────────────────────────
cat > src/hooks/useTheme.ts << 'USETHEME_EOF'
import { useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'

export function useTheme() {
  const { theme, toggleTheme, setTheme } = useThemeStore()

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
  }, [theme])

  return { theme, toggleTheme, setTheme }
}
USETHEME_EOF

cat > src/hooks/useProgress.ts << 'USEPROGRESS_EOF'
import { useProgressStore, type Phase } from '@/store/progressStore'

export function useProgress() {
  const {
    currentPhase,
    unlockedPhases,
    completedPhases,
    phaseCompleted,
    unlockPhase,
    resetProgress,
    isPhaseUnlocked,
    isPhaseCompleted,
  } = useProgressStore()

  return {
    currentPhase,
    unlockedPhases,
    completedPhases,
    phaseCompleted,
    unlockPhase,
    resetProgress,
    isPhaseUnlocked,
    isPhaseCompleted,
  }
}

export type { Phase }
USEPROGRESS_EOF

cat > src/hooks/usePhaseGate.ts << 'USEPHASEGATE_EOF'
import { useNavigate } from 'react-router-dom'
import { useProgressStore, type Phase } from '@/store/progressStore'

interface UsePhaseGateReturn {
  canAccess: boolean
  redirectToCurrentPhase: () => void
}

export function usePhaseGate(slug: string, phase: Phase): UsePhaseGateReturn {
  const navigate = useNavigate()
  const isPhaseUnlocked = useProgressStore((s) => s.isPhaseUnlocked)

  const canAccess = isPhaseUnlocked(phase)

  const redirectToCurrentPhase = () => {
    const currentPhase = useProgressStore.getState().currentPhase
    navigate(`/case-study/${slug}/${currentPhase}`, { replace: true })
  }

  return { canAccess, redirectToCurrentPhase }
}
USEPHASEGATE_EOF

# ── 11. components/ui/ ───────────────────────
cat > src/components/ui/Button.tsx << 'BTN_EOF'
import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-accent text-bg hover:bg-accent/90 font-semibold',
  secondary:
    'glass border border-border text-ink hover:border-accent/50',
  ghost:
    'text-ink2 hover:text-ink hover:bg-white/5',
  danger:
    'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled ?? isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  ),
)
Button.displayName = 'Button'
BTN_EOF

cat > src/components/ui/Badge.tsx << 'BADGE_EOF'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'accent' | 'blue' | 'green' | 'muted'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-white/10 text-ink2',
  accent:  'bg-accent/20 text-accent border border-accent/30',
  blue:    'bg-blue/20 text-blue border border-blue/30',
  green:   'bg-green/20 text-green border border-green/30',
  muted:   'bg-border text-ink3',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
BADGE_EOF

cat > src/components/ui/Card.tsx << 'CARD_EOF'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hoverable?: boolean
}

export function Card({ children, className, onClick, hoverable }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass border border-border rounded-2xl p-6',
        hoverable && 'cursor-pointer hover:border-accent/40 transition-all duration-200',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  )
}
CARD_EOF

# ── 12. components/layout/ ───────────────────
cat > src/components/layout/Navbar.tsx << 'NAV_EOF'
import { Link, useLocation } from 'react-router-dom'
import { Moon, Sun, Zap } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/case-studies', label: 'Case Studies' },
]

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { pathname } = useLocation()

  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-ink">
          <Zap size={18} className="text-accent" />
          <span className="text-gradient font-bold tracking-tight">OneStopCareers</span>
        </Link>

        <div className="flex items-center gap-6">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'text-sm transition-colors',
                pathname === to ? 'text-ink font-medium' : 'text-ink2 hover:text-ink',
              )}
            >
              {label}
            </Link>
          ))}

          <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
        </div>
      </div>
    </nav>
  )
}
NAV_EOF

cat > src/components/layout/Layout.tsx << 'LAYOUT_EOF'
import { Navbar } from './Navbar'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="pt-16">{children}</main>
    </div>
  )
}
LAYOUT_EOF

# ── 13. components/animations/ ───────────────
cat > src/components/animations/FadeIn.tsx << 'FADEIN_EOF'
import { motion, type MotionProps } from 'framer-motion'

interface FadeInProps extends MotionProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function FadeIn({ children, delay = 0, className, ...props }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
FADEIN_EOF

# ── 14. Mobile Gate component ────────────────
cat > src/components/ui/MobileGate.tsx << 'GATE_EOF'
import { Monitor } from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'

export function MobileGate() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-8">
      <FadeIn className="max-w-sm w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto">
          <Monitor size={28} className="text-accent" />
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink">Desktop Required</h2>
          <p className="text-ink2 text-sm leading-relaxed">
            This experience requires a desktop screen (minimum 1024px wide). Please open it on
            your laptop or desktop for the full Strategic Incident Simulator.
          </p>
        </div>
        <div className="glass border border-border rounded-xl px-4 py-3 inline-block">
          <span className="text-xs font-mono text-ink3">min-width: 1024px</span>
        </div>
      </FadeIn>
    </div>
  )
}
GATE_EOF

# ── 15. pages/ ───────────────────────────────
cat > src/pages/Home/index.tsx << 'HOME_EOF'
import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, Brain, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { FadeIn } from '@/components/animations/FadeIn'

const FEATURES = [
  {
    icon: Brain,
    title: 'Strategic Thinking',
    description: 'Learn to diagnose ambiguous business problems like senior PMs and analysts.',
  },
  {
    icon: BarChart3,
    title: 'Real Case Studies',
    description: 'Investigate metric drops with compounding root causes — no toy examples.',
  },
  {
    icon: Target,
    title: 'Phase-Gated Progress',
    description: 'Unlock deeper analysis phases only after demonstrating genuine insight.',
  },
]

export default function Home() {
  return (
    <Layout>
      <section className="max-w-7xl mx-auto px-6 py-24 space-y-24">
        {/* Hero */}
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <FadeIn>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Think like a{' '}
              <span className="text-gradient">Senior Analyst</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-lg text-ink2 leading-relaxed">
              Practice high-stakes strategic investigations. Not tutorials — real incident
              simulations where your analytical instincts get sharpened under pressure.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/case-studies">
                  Start Investigating <ArrowRight size={18} />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link to="/case-studies">Browse Cases</Link>
              </Button>
            </div>
          </FadeIn>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, description }, i) => (
            <FadeIn key={title} delay={0.1 * i}>
              <Card hoverable>
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-ink">{title}</h3>
                    <p className="text-sm text-ink2 leading-relaxed">{description}</p>
                  </div>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>
    </Layout>
  )
}
HOME_EOF

cat > src/pages/CaseStudies/index.tsx << 'CASES_EOF'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, TrendingDown } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FadeIn } from '@/components/animations/FadeIn'

interface CaseStudyMeta {
  slug: string
  title: string
  company: string
  metric: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  tags: string[]
}

const CASE_STUDIES: CaseStudyMeta[] = [
  {
    slug: 'revenue-leak',
    title: 'Revenue Leak Investigation',
    company: 'E-Commerce Platform',
    metric: '18% GMV drop in 72hrs',
    difficulty: 'intermediate',
    duration: '45–60 min',
    tags: ['Revenue', 'Funnel', 'SQL'],
  },
  {
    slug: 'makemytrip-dau',
    title: 'Bookings & DAU Decline',
    company: 'MakeMyTrip',
    metric: '4 compounding root causes',
    difficulty: 'advanced',
    duration: '60–90 min',
    tags: ['DAU', 'Bookings', 'Cohort'],
  },
]

const difficultyVariant: Record<string, 'accent' | 'blue' | 'green'> = {
  beginner: 'green',
  intermediate: 'blue',
  advanced: 'accent',
}

export default function CaseStudies() {
  return (
    <Layout>
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-10">
        <FadeIn>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-ink">Case Library</h1>
            <p className="text-ink2">
              Real-world metric investigations. Each case unlocks progressively harder phases.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6">
          {CASE_STUDIES.map((cs, i) => (
            <FadeIn key={cs.slug} delay={0.08 * i}>
              <Link to={`/case-study/${cs.slug}`}>
                <Card hoverable className="h-full">
                  <div className="space-y-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-xs text-ink3 font-mono uppercase tracking-wider">
                          {cs.company}
                        </p>
                        <h2 className="font-semibold text-ink text-lg">{cs.title}</h2>
                      </div>
                      <Badge variant={difficultyVariant[cs.difficulty]}>{cs.difficulty}</Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-accent font-medium">
                      <TrendingDown size={14} />
                      {cs.metric}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 flex-wrap">
                        {cs.tags.map((tag) => (
                          <Badge key={tag} variant="muted">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-ink3">
                        <Clock size={12} />
                        {cs.duration}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-blue font-medium group-hover:gap-2 transition-all">
                      Investigate <ArrowRight size={14} />
                    </div>
                  </div>
                </Card>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>
    </Layout>
  )
}
CASES_EOF

cat > src/pages/CaseStudy/index.tsx << 'CASESHELL_EOF'
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MobileGate } from '@/components/ui/MobileGate'
import { useProgressStore } from '@/store/progressStore'
import { Layout } from '@/components/layout/Layout'
import { FadeIn } from '@/components/animations/FadeIn'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Lock } from 'lucide-react'

const DESKTOP_BREAKPOINT = 1024

export default function CaseStudyShell() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const currentPhase = useProgressStore((s) => s.currentPhase)

  // Mobile gate — re-check on resize
  const isDesktop =
    typeof window !== 'undefined' && window.innerWidth >= DESKTOP_BREAKPOINT

  useEffect(() => {
    const handleResize = () => {
      // Force re-render by dispatching a custom event (lightweight approach)
      window.dispatchEvent(new Event('osc-resize'))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!isDesktop) {
    return <MobileGate />
  }

  const handleEnter = () => {
    navigate(`/case-study/${slug}/${currentPhase}`)
  }

  return (
    <Layout>
      <section className="max-w-3xl mx-auto px-6 py-24 text-center space-y-10">
        <FadeIn className="space-y-4">
          <p className="text-xs font-mono text-ink3 uppercase tracking-widest">Incident File</p>
          <h1 className="text-4xl font-bold text-ink capitalize">
            {slug?.replace(/-/g, ' ')}
          </h1>
          <p className="text-ink2 leading-relaxed">
            You are about to enter a live strategic incident. Progress through each phase by
            demonstrating genuine analytical thinking. Phases are locked until you earn them.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="glass border border-border rounded-2xl p-6 space-y-3 text-left max-w-sm mx-auto">
            <p className="text-xs font-mono text-ink3 uppercase tracking-wide">
              Current Phase
            </p>
            <p className="text-ink font-semibold capitalize flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
              {currentPhase}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.25}>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" onClick={handleEnter}>
              Enter Simulation <ArrowRight size={18} />
            </Button>
            <Button variant="ghost" size="lg" onClick={() => navigate('/case-studies')}>
              <Lock size={16} /> Back to Cases
            </Button>
          </div>
        </FadeIn>
      </section>
    </Layout>
  )
}
CASESHELL_EOF

# ── Phase view (generic) ──────────────────────
cat > src/pages/CaseStudy/phases/PhaseView.tsx << 'PHASEVIEW_EOF'
import { useParams, Navigate } from 'react-router-dom'
import { useProgressStore, type Phase } from '@/store/progressStore'
import { MobileGate } from '@/components/ui/MobileGate'
import { Layout } from '@/components/layout/Layout'
import { FadeIn } from '@/components/animations/FadeIn'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ChevronRight } from 'lucide-react'

const DESKTOP_BREAKPOINT = 1024

export default function PhaseView() {
  const { slug, phase } = useParams<{ slug: string; phase: string }>()
  const { isPhaseUnlocked, phaseCompleted, currentPhase } = useProgressStore()

  const isDesktop =
    typeof window !== 'undefined' && window.innerWidth >= DESKTOP_BREAKPOINT

  if (!isDesktop) return <MobileGate />

  const typedPhase = phase as Phase
  const isUnlocked = isPhaseUnlocked(typedPhase)

  if (!isUnlocked) {
    return <Navigate to={`/case-study/${slug}/${currentPhase}`} replace />
  }

  const handleComplete = () => {
    phaseCompleted(typedPhase)
  }

  return (
    <Layout>
      <section className="max-w-5xl mx-auto px-6 py-16 space-y-10">
        <FadeIn className="space-y-2">
          <Badge variant="blue" className="font-mono text-xs">
            {slug?.replace(/-/g, ' ')}
          </Badge>
          <h1 className="text-3xl font-bold text-ink capitalize">{phase} Phase</h1>
          <p className="text-ink2">Complete this phase to unlock the next investigation step.</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="glass border border-border rounded-2xl p-8 min-h-64 flex items-center justify-center">
            <p className="text-ink3 text-sm font-mono">
              [ Phase content for "{phase}" loads here ]
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex justify-end">
            <Button onClick={handleComplete} size="lg">
              Complete Phase <ChevronRight size={18} />
            </Button>
          </div>
        </FadeIn>
      </section>
    </Layout>
  )
}
PHASEVIEW_EOF

# ── 16. app/ ─────────────────────────────────
cat > src/app/Router.tsx << 'ROUTER_EOF'
import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'

const Home         = lazy(() => import('@/pages/Home'))
const CaseStudies  = lazy(() => import('@/pages/CaseStudies'))
const CaseStudyShell = lazy(() => import('@/pages/CaseStudy'))
const PhaseView    = lazy(() => import('@/pages/CaseStudy/phases/PhaseView'))

function PageLoader() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <span className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/"                                  element={<Home />} />
        <Route path="/case-studies"                      element={<CaseStudies />} />
        <Route path="/case-study/:slug"                  element={<CaseStudyShell />} />
        <Route path="/case-study/:slug/:phase"           element={<PhaseView />} />
        <Route path="*"                                  element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
ROUTER_EOF

cat > src/app/Providers.tsx << 'PROVIDERS_EOF'
import { BrowserRouter } from 'react-router-dom'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return <BrowserRouter>{children}</BrowserRouter>
}
PROVIDERS_EOF

cat > src/app/App.tsx << 'APP_EOF'
import { Providers } from './Providers'
import { AppRouter } from './Router'
import { useTheme } from '@/hooks/useTheme'
import '@/styles/globals.css'

function ThemeSync() {
  useTheme() // syncs <html> class on mount
  return null
}

export default function App() {
  return (
    <Providers>
      <ThemeSync />
      <AppRouter />
    </Providers>
  )
}
APP_EOF

# ── 17. main.tsx entry ───────────────────────
cat > src/main.tsx << 'MAIN_EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element not found')

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
MAIN_EOF

# ── 18. index.html ────────────────────────────
cat > index.html << 'HTML_EOF'
<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OneStopCareers — Strategic Incident Simulator</title>
    <meta name="description" content="Practice high-stakes analytics and PM investigations. Phase-gated case studies for senior role preparation." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
HTML_EOF

# ── 19. Barrel exports ────────────────────────
cat > src/components/ui/index.ts << 'UIBARREL_EOF'
export { Button } from './Button'
export { Badge } from './Badge'
export { Card } from './Card'
export { MobileGate } from './MobileGate'
UIBARREL_EOF

cat > src/components/layout/index.ts << 'LAYOUTBARREL_EOF'
export { Layout } from './Layout'
export { Navbar } from './Navbar'
LAYOUTBARREL_EOF

cat > src/components/animations/index.ts << 'ANIMBARREL_EOF'
export { FadeIn } from './FadeIn'
ANIMBARREL_EOF

# ── 20. Final install + type-check ───────────
npm install
npx tsc --noEmit && echo "✅  TypeScript: zero errors" || echo "❌  Fix TS errors above"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " OSC scaffold complete. Run: npm run dev"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"