#!/usr/bin/env bash
# P5 — Phase 1 (Business Context) + Phase 2 (Metric Understanding)
# Contracts: UI_CONTRACT.md | BUG_AUDIT.md | CODE_QUALITY.md | DEBT_REGISTER.md
# Run from project root: bash p5_phases.sh

set -euo pipefail

echo "📋 P5 — Phase 1 + Phase 2"
echo "────────────────────────────────────"

# ── Gate 0: Contract check ────────────────────────────────────────────────────
echo "📋 Gate 0: Checking contracts..."
MISSING=0
for contract in UI_CONTRACT.md BUG_AUDIT.md CODE_QUALITY.md DEBT_REGISTER.md; do
  [ -f "$contract" ] && echo "  ✅ $contract" || { echo "  ❌ Missing: $contract"; MISSING=1; }
done
[ "$MISSING" = "1" ] && { echo "❌ Run: bash generate_contracts.sh first"; exit 1; }

mkdir -p src/pages/CaseStudy/phases src/components/phases

# ── 1. MCQ Component (reusable) ───────────────────────────────────────────────
cat > src/components/phases/MCQ.tsx << 'EOF'
import { useState }    from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react'
import { cn }          from '@/lib/utils'
import { staggerChildren, staggerItem } from '@/lib/motionVariants'

// ── Types ─────────────────────────────────────────────────────────────────────
export interface MCQOption {
  id:        string
  label:     string
  correct:   boolean
}

interface MCQProps {
  question:    string
  options:     MCQOption[]
  explanation: string
  onCorrect:   () => void
}

type AnswerState = 'unanswered' | 'correct' | 'incorrect'

// ── Constants ─────────────────────────────────────────────────────────────────
const SHAKE_KEYFRAMES = {
  x: [0, -8, 8, -6, 6, -4, 4, 0],
  transition: { duration: 0.5, ease: 'easeInOut' },
}

// ── Component ─────────────────────────────────────────────────────────────────
export function MCQ({ question, options, explanation, onCorrect }: MCQProps) {
  const [selected,    setSelected]    = useState<string | null>(null)
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered')
  const [shaking,     setShaking]     = useState(false)

  function handleSelect(option: MCQOption) {
    if (answerState === 'correct') return

    setSelected(option.id)

    if (option.correct) {
      setAnswerState('correct')
    } else {
      setAnswerState('incorrect')
      setShaking(true)
      setTimeout(() => {
        setShaking(false)
        setAnswerState('unanswered')
        setSelected(null)
      }, 1200)
    }
  }

  return (
    <div
      className="rounded-2xl p-6 space-y-5"
      style={{
        background: 'var(--bg-surface)',
        border:     '1px solid var(--border-subtle)',
      }}
    >
      {/* Question header */}
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center mt-0.5"
          style={{
            background: 'rgba(129,140,248,0.10)',
            border:     '1px solid rgba(129,140,248,0.20)',
          }}
        >
          <HelpCircle size={15} style={{ color: 'var(--accent-secondary)' }} />
        </div>
        <div className="space-y-1">
          <p
            className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}
          >
            Knowledge check
          </p>
          <p
            className="text-sm font-semibold leading-snug"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}
          >
            {question}
          </p>
        </div>
      </div>

      {/* Options */}
      <motion.div
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        {options.map((option) => {
          const isSelected  = selected === option.id
          const isCorrect   = answerState === 'correct' && isSelected
          const isIncorrect = answerState === 'incorrect' && isSelected

          return (
            <motion.button
              key={option.id}
              variants={staggerItem}
              animate={isIncorrect && shaking ? SHAKE_KEYFRAMES : {}}
              onClick={() => handleSelect(option)}
              disabled={answerState === 'correct'}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left',
                'transition-all duration-200',
                answerState !== 'correct' && !isSelected && 'hover:border-[var(--border-default)]',
                answerState === 'correct' && !isSelected && 'opacity-40 cursor-not-allowed',
              )}
              style={{
                background: isCorrect
                  ? 'rgba(16,185,129,0.08)'
                  : isIncorrect
                  ? 'rgba(248,113,113,0.08)'
                  : isSelected
                  ? 'rgba(129,140,248,0.08)'
                  : 'var(--bg-elevated)',
                border: isCorrect
                  ? '1px solid rgba(16,185,129,0.30)'
                  : isIncorrect
                  ? '1px solid rgba(248,113,113,0.30)'
                  : isSelected
                  ? '1px solid rgba(129,140,248,0.30)'
                  : '1px solid var(--border-subtle)',
              }}
            >
              {/* Option letter */}
              <span
                className="w-6 h-6 rounded-md shrink-0 flex items-center justify-center text-xs font-bold"
                style={{
                  background: isCorrect
                    ? 'rgba(16,185,129,0.15)'
                    : isIncorrect
                    ? 'rgba(248,113,113,0.15)'
                    : 'var(--border-subtle)',
                  color: isCorrect
                    ? 'var(--accent-green)'
                    : isIncorrect
                    ? 'var(--accent-red)'
                    : 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {option.id.toUpperCase()}
              </span>

              {/* Label */}
              <span
                className="flex-1 text-sm"
                style={{
                  color: isCorrect
                    ? 'var(--accent-green)'
                    : isIncorrect
                    ? 'var(--accent-red)'
                    : 'var(--text-secondary)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {option.label}
              </span>

              {/* Icon */}
              {isCorrect   && <CheckCircle size={16} style={{ color: 'var(--accent-green)' }} />}
              {isIncorrect && <XCircle     size={16} style={{ color: 'var(--accent-red)'   }} />}
            </motion.button>
          )
        })}
      </motion.div>

      {/* Explanation — shows on correct */}
      <AnimatePresence>
        {answerState === 'correct' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-3 px-4 py-3 rounded-xl"
            style={{
              background: 'rgba(16,185,129,0.06)',
              border:     '1px solid rgba(16,185,129,0.20)',
            }}
          >
            <CheckCircle size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--accent-green)' }} />
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--accent-green)' }}>Correct. </strong>
              {explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint on wrong */}
      <AnimatePresence>
        {answerState === 'incorrect' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-center"
            style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}
          >
            Not quite — think about what could invalidate all your analysis downstream.
          </motion.p>
        )}
      </AnimatePresence>

      {/* Complete CTA */}
      <AnimatePresence>
        {answerState === 'correct' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={onCorrect}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{
                background:  'var(--accent-primary)',
                color:       '#fff',
                fontFamily:  'var(--font-heading)',
                boxShadow:   '0 0 20px rgba(255,107,53,0.25)',
              }}
            >
              Continue to next phase →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
EOF
echo "✅ MCQ.tsx"

# ── 2. FunnelDiagram Component ────────────────────────────────────────────────
cat > src/components/phases/FunnelDiagram.tsx << 'EOF'
import { motion } from 'framer-motion'
import {
  Search, List, FileText, ShoppingCart, CreditCard, CheckCircle,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
interface FunnelStage {
  id:    string
  label: string
  icon:  React.ElementType
  color: string
  glow:  string
}

// ── Constants ─────────────────────────────────────────────────────────────────
const STAGES: FunnelStage[] = [
  { id: 'search',   label: 'Search',   icon: Search,       color: 'rgba(255,107,53,1)',   glow: 'rgba(255,107,53,0.15)'  },
  { id: 'list',     label: 'List',     icon: List,         color: 'rgba(251,191,36,1)',   glow: 'rgba(251,191,36,0.15)'  },
  { id: 'detail',   label: 'Detail',   icon: FileText,     color: 'rgba(129,140,248,1)',  glow: 'rgba(129,140,248,0.15)' },
  { id: 'checkout', label: 'Checkout', icon: ShoppingCart, color: 'rgba(129,140,248,1)',  glow: 'rgba(129,140,248,0.15)' },
  { id: 'payment',  label: 'Payment',  icon: CreditCard,   color: 'rgba(16,185,129,1)',   glow: 'rgba(16,185,129,0.15)'  },
  { id: 'booking',  label: 'Booking',  icon: CheckCircle,  color: 'rgba(16,185,129,1)',   glow: 'rgba(16,185,129,0.15)'  },
]

const STAGGER_DELAY_MS = 150

// ── Component ─────────────────────────────────────────────────────────────────
export function FunnelDiagram() {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: 'var(--bg-surface)',
        border:     '1px solid var(--border-subtle)',
      }}
    >
      <p
        className="text-xs uppercase tracking-widest mb-6"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
      >
        Booking journey — 6 stages
      </p>

      {/* Desktop: horizontal flow */}
      <div className="flex items-center gap-0 overflow-x-auto pb-2">
        {STAGES.map((stage, i) => {
          const Icon = stage.icon
          return (
            <div key={stage.id} className="flex items-center shrink-0">
              {/* Stage node */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay:    (i * STAGGER_DELAY_MS) / 1000,
                  duration: 0.45,
                  ease:     [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col items-center gap-2.5"
              >
                {/* Icon circle */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: stage.glow,
                    border:     `1px solid ${stage.color}30`,
                  }}
                >
                  <Icon size={20} style={{ color: stage.color }} />
                </div>

                {/* Stage number */}
                <span
                  className="text-xs font-bold"
                  style={{ color: stage.color, fontFamily: 'var(--font-mono)' }}
                >
                  0{i + 1}
                </span>

                {/* Label */}
                <span
                  className="text-xs font-medium text-center"
                  style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-heading)' }}
                >
                  {stage.label}
                </span>
              </motion.div>

              {/* Arrow connector */}
              {i < STAGES.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{
                    delay:    ((i + 0.5) * STAGGER_DELAY_MS) / 1000,
                    duration: 0.3,
                  }}
                  className="flex items-center px-2 mt-[-20px]"
                  style={{ transformOrigin: 'left' }}
                >
                  <div
                    className="w-8 h-px"
                    style={{ background: 'var(--border-default)' }}
                  />
                  <div
                    className="w-0 h-0"
                    style={{
                      borderTop:    '4px solid transparent',
                      borderBottom: '4px solid transparent',
                      borderLeft:   `5px solid var(--border-default)`,
                    }}
                  />
                </motion.div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
EOF
echo "✅ FunnelDiagram.tsx"

# ── 3. SectionBadge component (reusable teaching label) ───────────────────────
cat > src/components/phases/SectionBadge.tsx << 'EOF'
import { cn } from '@/lib/utils'

type BadgeType = 'taught' | 'scaffolded' | 'learner' | 'warning'

interface SectionBadgeProps {
  type:      BadgeType
  className?: string
}

const CONFIG: Record<BadgeType, { label: string; bg: string; border: string; color: string }> = {
  taught: {
    label:  'Taught',
    bg:     'rgba(129,140,248,0.10)',
    border: 'rgba(129,140,248,0.25)',
    color:  'var(--accent-secondary)',
  },
  scaffolded: {
    label:  'Scaffolded',
    bg:     'rgba(255,107,53,0.10)',
    border: 'rgba(255,107,53,0.25)',
    color:  'var(--accent-primary)',
  },
  learner: {
    label:  'Your turn',
    bg:     'rgba(16,185,129,0.10)',
    border: 'rgba(16,185,129,0.25)',
    color:  'var(--accent-green)',
  },
  warning: {
    label:  'Watch out',
    bg:     'rgba(248,113,113,0.10)',
    border: 'rgba(248,113,113,0.25)',
    color:  'var(--accent-red)',
  },
}

export function SectionBadge({ type, className }: SectionBadgeProps) {
  const cfg = CONFIG[type]
  return (
    <span
      className={cn('inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold', className)}
      style={{
        background:  cfg.bg,
        border:      `1px solid ${cfg.border}`,
        color:       cfg.color,
        fontFamily:  'var(--font-mono)',
        letterSpacing: '0.05em',
      }}
    >
      {cfg.label}
    </span>
  )
}
EOF
echo "✅ SectionBadge.tsx"

# ── 4. Phase 1 — Business Context ─────────────────────────────────────────────
cat > src/pages/CaseStudy/phases/Phase1.tsx << 'EOF'
import { useNavigate, useParams } from 'react-router-dom'
import { motion }                  from 'framer-motion'
import { TrendingDown, Users, Divide } from 'lucide-react'
import { useProgressStore }        from '@/store/progressStore'
import { MCQ, type MCQOption }     from '@/components/phases/MCQ'
import { FunnelDiagram }           from '@/components/phases/FunnelDiagram'
import { SectionBadge }            from '@/components/phases/SectionBadge'
import { staggerChildren, staggerItem, revealContent } from '@/lib/motionVariants'

// ── Constants ─────────────────────────────────────────────────────────────────
const MCQ_OPTIONS: MCQOption[] = [
  { id: 'a', label: 'Start with segmentation immediately',  correct: false },
  { id: 'b', label: 'Check data quality & tracking setup',  correct: true  },
  { id: 'c', label: 'Build hypotheses and test immediately', correct: false },
]

const MCQ_EXPLANATION =
  'Data quality issues are the silent killer of analytics. If your tracking is broken, every segment, hypothesis, and recommendation built on top is wrong. Always verify the data before you touch it.'

const FORMULA_PARTS = [
  { label: 'Bookings/DAU', color: 'var(--accent-primary)',   delay: 0    },
  { label: '=',            color: 'var(--text-muted)',        delay: 0.15 },
  { label: 'Total Bookings', color: 'var(--accent-secondary)', delay: 0.3  },
  { label: '÷',            color: 'var(--text-muted)',        delay: 0.45 },
  { label: 'Daily Active Users', color: 'var(--accent-green)', delay: 0.6  },
]

// ── Component ─────────────────────────────────────────────────────────────────
export default function Phase1() {
  const { slug }        = useParams<{ slug: string }>()
  const navigate         = useNavigate()
  const { completePhase, isCompleted } = useProgressStore()
  const completed        = isCompleted('phase-1')

  function handleComplete() {
    completePhase('phase-1')
    navigate(`/case-study/${slug}/phase-2`)
  }

  return (
    <motion.div
      variants={staggerChildren}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* ── Section 2: Problem Statement ── */}
      <motion.div variants={staggerItem} className="space-y-4">
        <div className="flex items-center gap-3">
          <SectionBadge type="taught" />
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
          >
            Problem Statement
          </span>
        </div>

        {/* Alert card */}
        <div
          className="rounded-2xl p-6 space-y-5"
          style={{
            background: 'var(--bg-surface)',
            border:     '1px solid var(--border-subtle)',
          }}
        >
          {/* Incident headline */}
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
              style={{
                background: 'rgba(248,113,113,0.10)',
                border:     '1px solid rgba(248,113,113,0.25)',
              }}
            >
              <TrendingDown size={18} style={{ color: 'var(--accent-red)' }} />
            </div>
            <div>
              <p
                className="text-xs uppercase tracking-widest mb-1"
                style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}
              >
                Live Incident
              </p>
              <h3
                className="text-lg font-bold leading-snug"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}
              >
                MakeMyTrip sees −18% drop in Bookings/DAU over 60 days
              </h3>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

          {/* Metric definition */}
          <div className="space-y-3">
            <p
              className="text-xs uppercase tracking-widest"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
            >
              Metric definition
            </p>

            {/* Formula */}
            <div className="flex flex-wrap items-center gap-3">
              {FORMULA_PARTS.map(({ label, color, delay }) => (
                <motion.span
                  key={label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-xl font-bold"
                  style={{ color, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}
                >
                  {label}
                </motion.span>
              ))}
            </div>

            {/* Sub-definitions */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              {[
                { icon: TrendingDown, label: 'Total Bookings', desc: 'Gross completed payments in a day', color: 'var(--accent-secondary)' },
                { icon: Users,        label: 'Daily Active Users', desc: 'Logged-in unique users per day', color: 'var(--accent-green)' },
              ].map(({ icon: Icon, label, desc, color }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
                >
                  <Icon size={14} className="shrink-0 mt-0.5" style={{ color }} />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>{label}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Section 3: Booking Journey ── */}
      <motion.div variants={staggerItem} className="space-y-4">
        <div className="flex items-center gap-3">
          <SectionBadge type="taught" />
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
          >
            Booking Journey
          </span>
        </div>
        <FunnelDiagram />
      </motion.div>

      {/* ── Section 4: MCQ Gate ── */}
      <motion.div variants={staggerItem} className="space-y-4">
        <div className="flex items-center gap-3">
          <SectionBadge type="learner" />
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
          >
            Knowledge Gate
          </span>
        </div>

        {completed ? (
          <motion.div
            variants={revealContent}
            className="flex items-center gap-3 px-5 py-4 rounded-xl"
            style={{
              background: 'rgba(16,185,129,0.06)',
              border:     '1px solid rgba(16,185,129,0.20)',
            }}
          >
            <span style={{ color: 'var(--accent-green)', fontSize: '18px' }}>✓</span>
            <p className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>
              Phase 1 complete — Phase 2 unlocked
            </p>
          </motion.div>
        ) : (
          <MCQ
            question="Before analyzing data, what should you verify first?"
            options={MCQ_OPTIONS}
            explanation={MCQ_EXPLANATION}
            onCorrect={handleComplete}
          />
        )}
      </motion.div>
    </motion.div>
  )
}
EOF
echo "✅ Phase1.tsx"

# ── 5. Phase 2 — Metric Understanding ────────────────────────────────────────
cat > src/pages/CaseStudy/phases/Phase2.tsx << 'EOF'
import { useNavigate, useParams } from 'react-router-dom'
import { motion }                  from 'framer-motion'
import { useProgressStore }        from '@/store/progressStore'
import { MCQ, type MCQOption }     from '@/components/phases/MCQ'
import { SectionBadge }            from '@/components/phases/SectionBadge'
import { staggerChildren, staggerItem, revealContent } from '@/lib/motionVariants'

// ── Constants ─────────────────────────────────────────────────────────────────
const MCQ_OPTIONS: MCQOption[] = [
  { id: 'a', label: 'Engagement leg (Sessions/DAU)',         correct: false },
  { id: 'b', label: 'Conversion leg (Bookings/Sessions)',    correct: true  },
  { id: 'c', label: 'Both legs broke equally',              correct: false },
]

const MCQ_EXPLANATION =
  'Sessions/DAU actually improved slightly (+0.8pp) — users are engaging MORE. But Bookings/Sessions dropped −2.4pp. This isolates the problem: users are coming, but not converting at checkout. That\'s where we investigate next.'

interface DataRow {
  metric:  string
  before:  string
  after:   string
  change:  string
  broken:  boolean
}

const DATA_ROWS: DataRow[] = [
  { metric: 'Bookings/DAU',       before: '12.0%', after: '10.1%', change: '−1.9pp', broken: true  },
  { metric: 'Bookings/Sessions',  before: '14.1%', after: '11.7%', change: '−2.4pp', broken: true  },
  { metric: 'Sessions/DAU',       before: '85.2%', after: '86.0%', change: '+0.8pp', broken: false },
]

// ── Formula reveal parts ───────────────────────────────────────────────────────
const FORMULA_LINE_1 = [
  { text: 'Bookings/DAU',      color: 'var(--accent-primary)',   delay: 0    },
  { text: '=',                 color: 'var(--text-muted)',        delay: 0.1  },
  { text: 'Bookings/Sessions', color: 'var(--accent-red)',        delay: 0.2  },
  { text: '×',                 color: 'var(--text-muted)',        delay: 0.35 },
  { text: 'Sessions/DAU',      color: 'var(--accent-green)',      delay: 0.45 },
]

const FORMULA_LINE_2 = [
  { text: 'CVR Leg',          color: 'var(--accent-red)',   delay: 0.6  },
  { text: '×',                color: 'var(--text-muted)',   delay: 0.7  },
  { text: 'Engagement Leg',   color: 'var(--accent-green)', delay: 0.8  },
]

// ── Component ─────────────────────────────────────────────────────────────────
export default function Phase2() {
  const { slug }      = useParams<{ slug: string }>()
  const navigate       = useNavigate()
  const { completePhase, isCompleted } = useProgressStore()
  const completed      = isCompleted('phase-2')

  function handleComplete() {
    completePhase('phase-2')
    navigate(`/case-study/${slug}/phase-3`)
  }

  return (
    <motion.div
      variants={staggerChildren}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* ── Section 1: Metric Decomposition ── */}
      <motion.div variants={staggerItem} className="space-y-4">
        <div className="flex items-center gap-3">
          <SectionBadge type="scaffolded" />
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
          >
            Metric Decomposition
          </span>
        </div>

        <div
          className="rounded-2xl p-6 space-y-6"
          style={{
            background: 'var(--bg-surface)',
            border:     '1px solid var(--border-subtle)',
          }}
        >
          <div className="space-y-2">
            <p
              className="text-xs uppercase tracking-widest"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
            >
              Breaking down the metric
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Any ratio metric can be decomposed into legs. Each leg isolates a specific driver.
              This tells us WHERE to look before we look anywhere.
            </p>
          </div>

          {/* Formula line 1 */}
          <div
            className="rounded-xl p-5 space-y-4"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="flex flex-wrap items-center gap-3">
              {FORMULA_LINE_1.map(({ text, color, delay }) => (
                <motion.span
                  key={text + delay}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-lg font-bold"
                  style={{ color, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}
                >
                  {text}
                </motion.span>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

            {/* Leg labels */}
            <div className="flex flex-wrap items-center gap-3">
              {FORMULA_LINE_2.map(({ text, color, delay }) => (
                <motion.span
                  key={text}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay, duration: 0.4 }}
                  className="text-sm font-semibold"
                  style={{ color, fontFamily: 'var(--font-mono)' }}
                >
                  {text}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Leg explanation cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: 'CVR Leg (Bookings/Sessions)',
                desc:  'Of everyone who opens the app, what fraction actually books? This measures conversion quality.',
                color: 'var(--accent-red)',
                bg:    'rgba(248,113,113,0.06)',
                border:'rgba(248,113,113,0.15)',
              },
              {
                label: 'Engagement Leg (Sessions/DAU)',
                desc:  'How often does each active user open the app per day? This measures product stickiness.',
                color: 'var(--accent-green)',
                bg:    'rgba(16,185,129,0.06)',
                border:'rgba(16,185,129,0.15)',
              },
            ].map(({ label, desc, color, bg, border }) => (
              <div
                key={label}
                className="p-4 rounded-xl space-y-2"
                style={{ background: bg, border: `1px solid ${border}` }}
              >
                <p className="text-xs font-semibold" style={{ color, fontFamily: 'var(--font-heading)' }}>{label}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Section 2: Data Table ── */}
      <motion.div variants={staggerItem} className="space-y-4">
        <div className="flex items-center gap-3">
          <SectionBadge type="taught" />
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
          >
            60-Day Data
          </span>
        </div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid var(--border-subtle)' }}
        >
          {/* Table header */}
          <div
            className="grid grid-cols-4 px-5 py-3"
            style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}
          >
            {['Metric', 'Before', 'After', 'Change'].map((h) => (
              <span
                key={h}
                className="text-xs uppercase tracking-widest font-semibold"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Table rows */}
          {DATA_ROWS.map((row, i) => (
            <motion.div
              key={row.metric}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-4 px-5 py-4"
              style={{
                background:   row.broken ? 'rgba(248,113,113,0.03)' : 'var(--bg-elevated)',
                borderBottom: i < DATA_ROWS.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              }}
            >
              <span
                className="text-sm font-medium"
                style={{
                  color:      row.broken ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {row.metric}
              </span>
              <span
                className="text-sm"
                style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}
              >
                {row.before}
              </span>
              <span
                className="text-sm"
                style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}
              >
                {row.after}
              </span>
              <span
                className="text-sm font-semibold"
                style={{
                  color:      row.change.startsWith('+') ? 'var(--accent-green)' : 'var(--accent-red)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {row.change}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Insight callout */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="px-5 py-4 rounded-xl"
          style={{
            background: 'rgba(129,140,248,0.06)',
            border:     '1px solid rgba(129,140,248,0.15)',
          }}
        >
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--accent-secondary)' }}>Key insight: </strong>
            Sessions/DAU is stable — users are still opening the app just as often.
            The drop lives entirely in Bookings/Sessions (CVR). That's your investigation scope.
          </p>
        </motion.div>
      </motion.div>

      {/* ── Section 3: MCQ Gate ── */}
      <motion.div variants={staggerItem} className="space-y-4">
        <div className="flex items-center gap-3">
          <SectionBadge type="learner" />
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
          >
            Knowledge Gate
          </span>
        </div>

        {completed ? (
          <motion.div
            variants={revealContent}
            className="flex items-center gap-3 px-5 py-4 rounded-xl"
            style={{
              background: 'rgba(16,185,129,0.06)',
              border:     '1px solid rgba(16,185,129,0.20)',
            }}
          >
            <span style={{ color: 'var(--accent-green)', fontSize: '18px' }}>✓</span>
            <p className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>
              Phase 2 complete — Phase 3 unlocked
            </p>
          </motion.div>
        ) : (
          <MCQ
            question="Which leg of the metric broke?"
            options={MCQ_OPTIONS}
            explanation={MCQ_EXPLANATION}
            onCorrect={handleComplete}
          />
        )}
      </motion.div>
    </motion.div>
  )
}
EOF
echo "✅ Phase2.tsx"

# ── 6. Update Router to wire Phase1 + Phase2 ─────────────────────────────────
cat > src/app/Router.tsx << 'EOF'
import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense }          from 'react'

// ── Lazy imports ──────────────────────────────────────────────────────────────
const Home           = lazy(() => import('@/pages/Home'))
const CaseStudies    = lazy(() => import('@/pages/CaseStudies'))
const CaseStudyShell = lazy(() => import('@/pages/CaseStudy'))
const PhaseView      = lazy(() => import('@/pages/CaseStudy/phases/PhaseView'))
const Phase1         = lazy(() => import('@/pages/CaseStudy/phases/Phase1'))
const Phase2         = lazy(() => import('@/pages/CaseStudy/phases/Phase2'))

// ── Loader ────────────────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--bg-base)' }}
    >
      <span
        className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }}
        aria-label="Loading"
      />
    </div>
  )
}

// ── Router ────────────────────────────────────────────────────────────────────
export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/case-studies" element={<CaseStudies />} />

        <Route path="/case-study/:slug" element={<CaseStudyShell />}>
          <Route path="phase-1" element={<Phase1 />} />
          <Route path="phase-2" element={<Phase2 />} />
          <Route path=":phase"  element={<PhaseView />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
EOF
echo "✅ Router.tsx updated"

# ── 7. Barrel export for phase components ─────────────────────────────────────
cat > src/components/phases/index.ts << 'EOF'
export { MCQ }           from './MCQ'
export { FunnelDiagram } from './FunnelDiagram'
export { SectionBadge }  from './SectionBadge'
EOF
echo "✅ phases/index.ts"

# ── Gate 1: TypeScript ────────────────────────────────────────────────────────
echo ""
echo "🧠 Gate 1: Type checking..."
npx tsc --noEmit && echo "✅ Zero TypeScript errors" || echo "❌ Fix errors above"

# ── Gate 2: Build ─────────────────────────────────────────────────────────────
echo ""
echo "🔨 Gate 2: Build..."
npm run build && echo "✅ Build passed" || echo "❌ Build failed"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " P5 complete. Files delivered:"
echo "  src/components/phases/MCQ.tsx"
echo "  src/components/phases/FunnelDiagram.tsx"
echo "  src/components/phases/SectionBadge.tsx"
echo "  src/components/phases/index.ts"
echo "  src/pages/CaseStudy/phases/Phase1.tsx"
echo "  src/pages/CaseStudy/phases/Phase2.tsx"
echo "  src/app/Router.tsx (phase routes added)"
echo ""
echo " Test checklist:"
echo "  npm run dev"
echo "  ✓ /case-study/makemytrip-dau-drop/phase-1"
echo "  ✓ Formula animates piece by piece"
echo "  ✓ Funnel stages reveal left-to-right"
echo "  ✓ Wrong MCQ answer → shake + reset"
echo "  ✓ Correct answer → explanation + CTA"
echo "  ✓ Complete Phase 1 → nav to phase-2"
echo "  ✓ Phase 2 unlocked in left nav"
echo "  ✓ Complete Phase 2 → Phase 3 unlocked"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
