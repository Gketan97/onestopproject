#!/usr/bin/env bash
# P3 — Home + Case Studies Pages
# Contracts: UI_CONTRACT.md | BUG_AUDIT.md | CODE_QUALITY.md | DEBT_REGISTER.md
# Run from project root: bash p3_pages.sh

set -euo pipefail

echo "📋 P3 — Home + Case Studies Pages"
echo "────────────────────────────────────"

# ── Gate 0: Contract check ────────────────────────────────────────────────────
echo "📋 Gate 0: Checking contracts..."
MISSING=0
for contract in UI_CONTRACT.md BUG_AUDIT.md CODE_QUALITY.md DEBT_REGISTER.md; do
  [ -f "$contract" ] && echo "  ✅ $contract" || { echo "  ❌ Missing: $contract"; MISSING=1; }
done
[ "$MISSING" = "1" ] && { echo "❌ Run: bash generate_contracts.sh first"; exit 1; }

mkdir -p src/pages/Home src/pages/CaseStudies src/components/ui src/data

# ── 1. src/data/caseStudies.ts ────────────────────────────────────────────────
cat > src/data/caseStudies.ts << 'EOF'
export interface CaseStudyMeta {
  slug:        string
  title:       string
  company:     string
  description: string
  metric:      string
  difficulty:  'Beginner' | 'Intermediate' | 'Advanced'
  duration:    string
  phases:      number
  skills:      string[]
  available:   boolean
}

export const CASE_STUDIES: CaseStudyMeta[] = [
  {
    slug:        'makemytrip-dau-drop',
    title:       'MakeMyTrip — Bookings/DAU Investigation',
    company:     'MakeMyTrip',
    description: '8-phase investigation of an 18% booking decline. Segment by platform, isolate the iOS v8.3 regression, size the impact, and present board-ready recommendations.',
    metric:      '−18% Bookings/DAU over 60 days',
    difficulty:  'Advanced',
    duration:    '45 min',
    phases:      8,
    skills:      ['Segmentation', 'Funnel Analysis', 'Root Cause', 'Impact Sizing'],
    available:   true,
  },
  {
    slug:        'swiggy-order-drop',
    title:       'Swiggy — Order Rate Decline',
    company:     'Swiggy',
    description: 'Investigate a sudden drop in order rate across metro cities. Diagnose supply-side vs demand-side root causes.',
    metric:      '−12% Order Rate in 2 weeks',
    difficulty:  'Intermediate',
    duration:    '30 min',
    phases:      6,
    skills:      ['Cohort Analysis', 'Supply Metrics', 'A/B Testing'],
    available:   false,
  },
  {
    slug:        'flipkart-cart-abandonment',
    title:       'Flipkart — Cart Abandonment Spike',
    company:     'Flipkart',
    description: 'A pricing algorithm change caused unexpected cart abandonment. Trace the funnel and quantify revenue loss.',
    metric:      '+23% Cart Abandonment Rate',
    difficulty:  'Intermediate',
    duration:    '35 min',
    phases:      6,
    skills:      ['Pricing Analysis', 'Funnel Mapping', 'SQL Patterns'],
    available:   false,
  },
]

export const DIFFICULTY_VARIANT = {
  Beginner:     'green',
  Intermediate: 'amber',
  Advanced:     'cyan',
} as const satisfies Record<CaseStudyMeta['difficulty'], string>
EOF
echo "✅ caseStudies.ts"

# ── 2. src/components/ui/CaseStudyCard.tsx ────────────────────────────────────
cat > src/components/ui/CaseStudyCard.tsx << 'EOF'
import { useNavigate } from 'react-router-dom'
import { motion }      from 'framer-motion'
import { ArrowRight, Clock, Lock, Layers } from 'lucide-react'
import { Badge }       from '@/components/ui/Badge'
import { staggerItem } from '@/lib/motionVariants'
import type { CaseStudyMeta } from '@/data/caseStudies'
import { DIFFICULTY_VARIANT } from '@/data/caseStudies'
import { cn }          from '@/lib/utils'

interface CaseStudyCardProps {
  data: CaseStudyMeta
}

const ACCENT_GLOW: Record<string, string> = {
  cyan:   'rgba(0,212,255,0.08)',
  amber:  'rgba(255,184,0,0.08)',
  green:  'rgba(61,214,140,0.08)',
}

export function CaseStudyCard({ data }: CaseStudyCardProps) {
  const navigate = useNavigate()
  const accentVariant = DIFFICULTY_VARIANT[data.difficulty]
  const glowColor     = ACCENT_GLOW[accentVariant]

  function handleClick() {
    if (!data.available) return
    navigate(`/case-study/${data.slug}`)
  }

  return (
    <motion.div
      variants={staggerItem}
      onClick={handleClick}
      whileHover={data.available ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative rounded-2xl p-6 transition-all duration-300 overflow-hidden',
        data.available ? 'cursor-pointer' : 'cursor-not-allowed opacity-60',
      )}
      style={{
        background: 'var(--bg-surface)',
        border:     '1px solid var(--border-subtle)',
      }}
    >
      {/* Hover glow */}
      {data.available && (
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${glowColor} 0%, transparent 60%)`,
          }}
        />
      )}

      {/* Coming soon overlay */}
      {!data.available && (
        <div className="absolute top-4 right-4">
          <Badge variant="default">
            <Lock size={9} className="mr-1" />
            Coming Soon
          </Badge>
        </div>
      )}

      <div className="relative space-y-5">
        {/* Header */}
        <div className="space-y-1">
          <p
            className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
          >
            {data.company}
          </p>
          <h2
            className="text-base font-semibold leading-snug"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}
          >
            {data.title}
          </h2>
        </div>

        {/* Description */}
        <p
          className="text-sm leading-relaxed line-clamp-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          {data.description}
        </p>

        {/* Metric pill */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{
            background:  `${ACCENT_GLOW[accentVariant]}`,
            border:      `1px solid var(--border-subtle)`,
            color:       'var(--text-secondary)',
            fontFamily:  'var(--font-mono)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: `var(--accent-${accentVariant === 'cyan' ? 'primary' : accentVariant === 'amber' ? 'secondary' : 'green'})` }}
          />
          {data.metric}
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <Badge key={skill} variant="outline" size="sm">
              {skill}
            </Badge>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-4">
            <span
              className="flex items-center gap-1.5 text-xs"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
            >
              <Clock size={11} />
              {data.duration}
            </span>
            <span
              className="flex items-center gap-1.5 text-xs"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
            >
              <Layers size={11} />
              {data.phases} phases
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant={accentVariant as 'cyan' | 'amber' | 'green'} size="sm">
              {data.difficulty}
            </Badge>
            {data.available && (
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
                style={{ color: 'var(--accent-primary)' }}
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
EOF
echo "✅ CaseStudyCard.tsx"

# ── 3. src/pages/Home/index.tsx ───────────────────────────────────────────────
cat > src/pages/Home/index.tsx << 'EOF'
import { Link }        from 'react-router-dom'
import { ArrowRight, TrendingDown, Clock, Shield } from 'lucide-react'
import { motion }      from 'framer-motion'
import { Layout }      from '@/components/layout/Layout'
import { Button }      from '@/components/ui/Button'
import { Badge }       from '@/components/ui/Badge'
import {
  staggerChildren,
  staggerItem,
  slideUp,
  fadeIn,
} from '@/lib/motionVariants'

// ── Constants ────────────────────────────────────────────────────────────────
const STATS = [
  { value: '7',    label: 'Case Studies',   accentVar: '--accent-secondary' },
  { value: '320+', label: 'Decisions Made', accentVar: '--accent-primary'   },
  { value: '1',    label: 'AI Mentor',      accentVar: '--accent-purple'    },
] as const

const FEATURES = [
  {
    icon:        TrendingDown,
    title:       'Real Metric Drops',
    description: 'Investigate actual business incidents with compounding root causes — not toy examples.',
    accentVar:   '--accent-primary',
    glowRgba:    'rgba(0,212,255,0.08)',
    borderRgba:  'rgba(0,212,255,0.20)',
  },
  {
    icon:        Shield,
    title:       'Phase-Gated Progress',
    description: 'Unlock deeper phases only after demonstrating genuine analytical thinking.',
    accentVar:   '--accent-secondary',
    glowRgba:    'rgba(255,184,0,0.08)',
    borderRgba:  'rgba(255,184,0,0.20)',
  },
  {
    icon:        Clock,
    title:       'Portfolio Proof',
    description: 'Leave with a shareable RCA brief that proves how you think to any hiring manager.',
    accentVar:   '--accent-purple',
    glowRgba:    'rgba(168,85,247,0.08)',
    borderRgba:  'rgba(168,85,247,0.20)',
  },
] as const

// ── Component ────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <Layout>
      {/* Ambient glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,184,0,0.07) 0%, transparent 70%)',
            filter:     'blur(80px)',
          }}
        />
        <div
          className="absolute top-1/3 -right-48 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)',
            filter:     'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)',
            filter:     'blur(80px)',
          }}
        />
      </div>

      <div className="relative z-10">
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 pt-28 pb-20 text-center">

          {/* Pill badge */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="flex justify-center mb-10"
          >
            <span
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full"
              style={{
                background:  'var(--bg-glass)',
                backdropFilter: 'blur(12px)',
                border:      '1px solid var(--border-subtle)',
                color:       'var(--text-secondary)',
                fontFamily:  'var(--font-mono)',
                fontSize:    '11px',
                fontWeight:  500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: 'var(--accent-primary)' }}
              />
              For{' '}
              <span style={{ color: 'var(--accent-secondary)', fontWeight: 700 }}>
                BUSINESS ANALYSTS
              </span>{' '}
              who work with data
            </span>
          </motion.div>

          {/* Hero headline — staggered lines */}
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            {[
              { text: 'The AI will pull', gradient: false },
              { text: 'the data.',        gradient: false },
              { text: 'Can you make the', gradient: true  },
              { text: 'decision?',        gradient: true  },
            ].map(({ text, gradient }) => (
              <motion.h1
                key={text}
                variants={staggerItem}
                className="leading-[1.0] tracking-tight font-bold"
                style={{
                  fontSize:   'clamp(48px, 8vw, 88px)',
                  fontFamily: 'var(--font-heading)',
                  ...(gradient
                    ? {
                        background:              'linear-gradient(135deg, var(--accent-secondary) 0%, var(--accent-purple) 55%, var(--accent-primary) 100%)',
                        WebkitBackgroundClip:    'text',
                        WebkitTextFillColor:     'transparent',
                        backgroundClip:          'text',
                      }
                    : { color: 'var(--text-primary)' }),
                }}
              >
                {text}
              </motion.h1>
            ))}
          </motion.div>

          {/* Subheadline */}
          <motion.p
            variants={slideUp}
            initial="hidden"
            animate="visible"
            className="max-w-2xl mx-auto text-lg leading-relaxed mb-10"
            style={{ color: 'var(--text-secondary)' }}
          >
            AI handles the data pulls. The people who get hired — and promoted — are
            the ones who know{' '}
            <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              how to think through a problem clearly.
            </strong>{' '}
            Work through a real business incident alongside an AI thinking partner and leave with{' '}
            <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              proof of how you think — as a link you can share.
            </strong>
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center gap-4 mb-20"
          >
            <Link to="/case-studies">
              <Button variant="primary" size="lg">
                Start Investigating <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/case-studies">
              <Button variant="secondary" size="lg">
                Browse Cases
              </Button>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 overflow-hidden rounded-2xl"
            style={{ border: '1px solid var(--border-subtle)' }}
          >
            {STATS.map(({ value, label, accentVar }) => (
              <motion.div
                key={label}
                variants={staggerItem}
                className="py-8 px-6 text-center"
                style={{ background: 'var(--bg-surface)' }}
              >
                <p
                  className="text-5xl font-bold tracking-tight mb-1.5"
                  style={{
                    color:      `var(${accentVar})`,
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  {value}
                </p>
                <p
                  className="text-xs uppercase tracking-widest"
                  style={{
                    color:      'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 pb-32">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid md:grid-cols-3 gap-5"
          >
            {FEATURES.map(({ icon: Icon, title, description, accentVar, glowRgba, borderRgba }) => (
              <motion.div
                key={title}
                variants={staggerItem}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-300"
                style={{
                  background: 'var(--bg-surface)',
                  border:     '1px solid var(--border-subtle)',
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${glowRgba} 0%, transparent 60%)`,
                  }}
                />
                <div className="relative space-y-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: glowRgba,
                      border:     `1px solid ${borderRgba}`,
                    }}
                  >
                    <Icon size={18} style={{ color: `var(${accentVar})` }} />
                  </div>
                  <div className="space-y-2">
                    <h3
                      className="font-semibold text-sm"
                      style={{
                        color:      'var(--text-primary)',
                        fontFamily: 'var(--font-heading)',
                      }}
                    >
                      {title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </Layout>
  )
}
EOF
echo "✅ Home/index.tsx"

# ── 4. src/pages/CaseStudies/index.tsx ───────────────────────────────────────
cat > src/pages/CaseStudies/index.tsx << 'EOF'
import { motion }          from 'framer-motion'
import { Layout }          from '@/components/layout/Layout'
import { CaseStudyCard }   from '@/components/ui/CaseStudyCard'
import { Badge }           from '@/components/ui/Badge'
import { CASE_STUDIES }    from '@/data/caseStudies'
import { staggerChildren, fadeIn } from '@/lib/motionVariants'

export default function CaseStudies() {
  const available = CASE_STUDIES.filter((c) => c.available).length
  const total     = CASE_STUDIES.length

  return (
    <Layout>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div
          className="absolute -top-48 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)',
            filter:     'blur(80px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">

        {/* Page header */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mb-12 space-y-4"
        >
          <div className="flex items-center gap-3">
            <Badge variant="cyan" dot pulse size="md">
              Live
            </Badge>
            <span
              className="text-xs uppercase tracking-widest"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
            >
              {available} of {total} available
            </span>
          </div>

          <h1
            className="text-4xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}
          >
            Case Library
          </h1>

          <p
            className="text-base leading-relaxed max-w-xl"
            style={{ color: 'var(--text-secondary)' }}
          >
            Real-world metric investigations. Each case unlocks progressively harder phases —
            no tutorials, no hand-holding.
          </p>

          {/* Divider */}
          <div style={{ height: '1px', background: 'var(--border-subtle)', marginTop: '8px' }} />
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-5"
        >
          {CASE_STUDIES.map((cs) => (
            <CaseStudyCard key={cs.slug} data={cs} />
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.p
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-center mt-12 text-xs uppercase tracking-widest"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
        >
          More cases shipping every month
        </motion.p>
      </div>
    </Layout>
  )
}
EOF
echo "✅ CaseStudies/index.tsx"

# ── 5. Update barrel exports ──────────────────────────────────────────────────
cat > src/components/ui/index.ts << 'EOF'
export { Button }        from './Button'
export { Badge }         from './Badge'
export { Card }          from './Card'
export { Input }         from './Input'
export { GlowEffect }    from './GlowEffect'
export { CaseStudyCard } from './CaseStudyCard'
EOF
echo "✅ ui/index.ts updated"

# ── Gate 1: TypeScript ────────────────────────────────────────────────────────
echo ""
echo "🧠 Gate 1: Type checking..."
npx tsc --noEmit && echo "✅ Zero TypeScript errors" || echo "❌ Fix errors above"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " P3 complete. Files delivered:"
echo "  src/data/caseStudies.ts"
echo "  src/components/ui/CaseStudyCard.tsx"
echo "  src/pages/Home/index.tsx"
echo "  src/pages/CaseStudies/index.tsx"
echo "  src/components/ui/index.ts (updated)"
echo ""
echo " Test: npm run dev"
echo "  / → Hero with stagger headline"
echo "  /case-studies → Card grid, 1 live + 2 coming soon"
echo "  Click MMT card → /case-study/makemytrip-dau-drop"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
