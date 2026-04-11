#!/usr/bin/env bash
# PHASE 0 + PHASE 1 FINAL BUILD
# Philosophy: High teaching % → gradual action → platform comfort
# Phase 0: Business Canvas → App Exploration → Brief → Hypothesis
# Phase 1: Definitions → Sanity → Timeline → Seasonality (user drives)

set -euo pipefail

echo "📋 Phase 0 + Phase 1 Final Build"
echo "────────────────────────────────────"

for contract in UI_CONTRACT.md BUG_AUDIT.md CODE_QUALITY.md DEBT_REGISTER.md; do
  [ -f "$contract" ] && echo "  ✅ $contract" || { echo "  ❌ $contract missing"; exit 1; }
done

mkdir -p src/pages/CaseStudy/phases src/components/phases

# ── 1. PhaseCard — reusable section wrapper ───────────────────────────────────
cat > src/components/phases/PhaseCard.tsx << 'EOF'
import { motion } from 'framer-motion'

interface PhaseCardProps {
  children:   React.ReactNode
  className?: string
  accent?:    boolean
}

export function PhaseCard({ children, className = '', accent = false }: PhaseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-2xl p-6 space-y-4 ${className}`}
      style={{
        background: accent ? 'rgba(255,107,53,0.04)' : 'var(--bg-surface)',
        border:     accent ? '1px solid rgba(255,107,53,0.20)' : '1px solid var(--border-subtle)',
      }}
    >
      {children}
    </motion.div>
  )
}
EOF
echo "✅ PhaseCard.tsx"

# ── 2. ArjunInline — Arjun speaks within content ─────────────────────────────
cat > src/components/phases/ArjunInline.tsx << 'EOF'
import { motion } from 'framer-motion'

interface ArjunInlineProps {
  children:  React.ReactNode
  variant?:  'default' | 'question' | 'nudge' | 'affirm'
  delay?:    number
}

const VARIANTS = {
  default:  { border: 'rgba(129,140,248,0.20)', bg: 'rgba(129,140,248,0.04)', label: 'var(--accent-secondary)' },
  question: { border: 'rgba(129,140,248,0.30)', bg: 'rgba(129,140,248,0.06)', label: 'var(--accent-secondary)' },
  nudge:    { border: 'rgba(255,184,0,0.25)',   bg: 'rgba(255,184,0,0.04)',   label: 'var(--accent-amber)'     },
  affirm:   { border: 'rgba(16,185,129,0.25)',  bg: 'rgba(16,185,129,0.04)', label: 'var(--accent-green)'     },
}

export function ArjunInline({ children, variant = 'default', delay = 0 }: ArjunInlineProps) {
  const v = VARIANTS[variant]
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-3"
    >
      <div
        className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold mt-0.5"
        style={{
          background:  `linear-gradient(135deg, rgba(129,140,248,0.25), rgba(255,107,53,0.20))`,
          border:      `1px solid ${v.border}`,
          color:       'var(--text-primary)',
          fontFamily:  'var(--font-heading)',
        }}
      >
        A
      </div>
      <div
        className="flex-1 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed"
        style={{ background: v.bg, border: `1px solid ${v.border}`, color: 'var(--text-secondary)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-1.5"
          style={{ color: v.label, fontFamily: 'var(--font-mono)' }}>
          Arjun · Staff Analyst
        </p>
        {children}
      </div>
    </motion.div>
  )
}
EOF
echo "✅ ArjunInline.tsx"

# ── 3. ObservationInput — structured lens input ───────────────────────────────
cat > src/components/phases/ObservationInput.tsx << 'EOF'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useArjun } from '@/hooks/useArjun'

interface Lens {
  id:          string
  icon:        string
  label:       string
  placeholder: string
  arjunPrompt: string
}

interface ObservationInputProps {
  lenses:    Lens[]
  onComplete: (observations: Record<string, string>) => void
}

export function ObservationInput({ lenses, onComplete }: ObservationInputProps) {
  const [answers, setAnswers]         = useState<Record<string, string>>({})
  const [submitted, setSubmitted]     = useState<Record<string, boolean>>({})
  const [arjunReply, setArjunReply]   = useState<Record<string, string>>({})
  const [loading, setLoading]         = useState<Record<string, boolean>>({})
  const { open, sendMessage }         = useArjun()
  const allDone = lenses.every(l => submitted[l.id])

  async function handleSubmit(lens: Lens) {
    const text = answers[lens.id]?.trim()
    if (!text || text.length < 10) return
    setLoading(prev => ({ ...prev, [lens.id]: true }))

    // Pre-built responses for each lens — fast, no API needed
    const responses: Record<string, string> = {
      funnel:   text.toLowerCase().includes('step') || text.toLowerCase().includes('page') || text.toLowerCase().includes('screen')
        ? "Good observation. Count them precisely — Search → List → Detail → Checkout → Payment → Booking. That's 6 stages. Each stage is a potential drop-off point. You'll come back to this in Phase 5."
        : "Think about it as stages, not screens. Each time the user has to make a decision or wait — that's a stage. How many decision points did you encounter?",
      friction: text.toLowerCase().includes('slow') || text.toLowerCase().includes('load') || text.toLowerCase().includes('wait') || text.toLowerCase().includes('checkout')
        ? "Important. Note exactly where the slowness was. Was it search results loading? The hotel detail page? Or the checkout page specifically? The location matters more than the feeling."
        : "Good. Now be specific — WHERE in the flow did you feel it? The finding is only useful if it's tied to a specific funnel stage.",
      trust:    text.toLowerCase().includes('review') || text.toLowerCase().includes('price') || text.toLowerCase().includes('cancel') || text.toLowerCase().includes('photo')
        ? "Trust signals are real conversion drivers. An analyst who only looks at technical metrics misses half the story. Keep this observation — it'll be relevant in Phase 2 when you build hypotheses."
        : "Interesting. Trust signals are often overlooked in metric investigations. Were there moments where you wanted more information before proceeding?",
    }

    await new Promise(r => setTimeout(r, 600))
    setArjunReply(prev => ({ ...prev, [lens.id]: responses[lens.id] ?? "Good observation. Keep it in mind as we go deeper." }))
    setSubmitted(prev => ({ ...prev, [lens.id]: true }))
    setLoading(prev => ({ ...prev, [lens.id]: false }))

    if (lenses.every(l => l.id === lens.id || submitted[l.id])) {
      setTimeout(() => onComplete(answers), 800)
    }
  }

  return (
    <div className="space-y-5">
      {lenses.map((lens, i) => {
        const isLocked  = i > 0 && !submitted[lenses[i-1].id]
        const isDone    = submitted[lens.id]
        const isLoading = loading[lens.id]

        return (
          <motion.div
            key={lens.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: isLocked ? 0.35 : 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="rounded-2xl overflow-hidden"
            style={{
              border: isDone
                ? '1px solid rgba(16,185,129,0.25)'
                : '1px solid var(--border-subtle)',
            }}
          >
            {/* Lens header */}
            <div className="flex items-center gap-3 px-5 py-3"
              style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '18px' }}>{lens.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold"
                  style={{ color: isDone ? 'var(--accent-green)' : 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  {lens.label}
                </p>
              </div>
              {isDone && <span style={{ color: 'var(--accent-green)', fontSize: '14px' }}>✓</span>}
            </div>

            <div className="px-5 py-4 space-y-3" style={{ background: 'var(--bg-elevated)' }}>
              {!isDone && (
                <>
                  <textarea
                    value={answers[lens.id] ?? ''}
                    onChange={e => setAnswers(prev => ({ ...prev, [lens.id]: e.target.value }))}
                    placeholder={lens.placeholder}
                    disabled={isLocked}
                    rows={2}
                    className="w-full rounded-xl px-4 py-3 text-sm resize-none disabled:opacity-40"
                    style={{
                      background:  'var(--bg-surface)',
                      border:      '1px solid var(--border-default)',
                      color:       'var(--text-primary)',
                      outline:     'none',
                      fontFamily:  'var(--font-body)',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.10)' }}
                    onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }}
                  />
                  <button
                    onClick={() => handleSubmit(lens)}
                    disabled={isLocked || isLoading || (answers[lens.id]?.trim().length ?? 0) < 10}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: 'var(--accent-secondary)', color: '#fff', fontFamily: 'var(--font-heading)' }}
                  >
                    {isLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    {isLoading ? 'Arjun is reading...' : 'Submit observation →'}
                  </button>
                </>
              )}

              {/* Saved answer */}
              {isDone && answers[lens.id] && (
                <div className="px-4 py-3 rounded-xl"
                  style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Your observation:</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{answers[lens.id]}</p>
                </div>
              )}

              {/* Arjun reply */}
              <AnimatePresence>
                {arjunReply[lens.id] && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-6 h-6 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold mt-0.5"
                      style={{ background: 'linear-gradient(135deg,rgba(129,140,248,0.25),rgba(255,107,53,0.20))', border: '1px solid rgba(129,140,248,0.25)', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      A
                    </div>
                    <p className="flex-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {arjunReply[lens.id]}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )
      })}

      {allDone && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 rounded-xl text-sm"
          style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)', color: 'var(--accent-green)' }}>
          ✓ All observations recorded — saved to your investigation brief
        </motion.div>
      )}
    </div>
  )
}
EOF
echo "✅ ObservationInput.tsx"

# ── 4. Phase 0 — Business Context ─────────────────────────────────────────────
cat > src/pages/CaseStudy/phases/Phase0.tsx << 'EOF'
import { useState, useEffect }     from 'react'
import { useNavigate, useParams }  from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Building2, Users, Package, BarChart3, Shield, MessageSquare, Smartphone } from 'lucide-react'
import { useProgressStore }        from '@/store/progressStore'
import { ArjunInline }             from '@/components/phases/ArjunInline'
import { ObservationInput }        from '@/components/phases/ObservationInput'
import { PhaseCard }               from '@/components/phases/PhaseCard'
import { ContinueButton }          from '@/components/phases/ContinueButton'
import { RevealBlock }             from '@/components/phases/RevealBlock'
import { staggerChildren, staggerItem } from '@/lib/motionVariants'

// ── Canvas data ───────────────────────────────────────────────────────────────
interface CanvasCard {
  id:      string
  icon:    React.ElementType
  title:   string
  tagline: string
  color:   string
  glow:    string
  points:  string[]
}

const CANVAS_CARDS: CanvasCard[] = [
  {
    id: 'model', icon: Building2, title: 'Business Model', tagline: 'How MMT makes money',
    color: 'var(--accent-primary)', glow: 'rgba(255,107,53,0.08)',
    points: [
      'MakeMyTrip earns 10–15% commission on every completed hotel booking.',
      'Revenue = Bookings × Average Order Value × Commission Rate. If any one falls, revenue falls.',
      'No booking = no revenue. This makes Bookings/DAU the single most critical health metric.',
      'Hotels pay only when a traveler completes a booking — pure performance model.',
    ],
  },
  {
    id: 'users', icon: Users, title: 'User Segments', tagline: 'Who books on MMT',
    color: 'var(--accent-secondary)', glow: 'rgba(129,140,248,0.08)',
    points: [
      'Leisure travelers (65%): book 2–4 months ahead, price-sensitive, high cancellation rates.',
      'Business travelers (25%): book within 7 days, less price-sensitive, prefer 4-5 star metro hotels.',
      'Last-minute bookers (10%): same-day bookings, highest CVR, smallest segment.',
      'A 13% CVR drop in leisure has 3× more revenue impact than the same drop in last-minute.',
    ],
  },
  {
    id: 'supply', icon: Package, title: 'Supply Side', tagline: 'What users see and book',
    color: 'var(--accent-green)', glow: 'rgba(16,185,129,0.08)',
    points: [
      'MMT lists 50,000+ hotels across India — 5-star chains to budget homestays.',
      'Supply mix matters: if high-converting budget hotels go out of stock, CVR falls even with stable traffic.',
      'Hotel availability, pricing, and review freshness all affect the Detail→Checkout conversion.',
      'MMT competes with hotels\' own websites — direct booking discounts create drop-off risk.',
    ],
  },
  {
    id: 'metrics', icon: BarChart3, title: 'Key Metrics', tagline: 'What the team tracks daily',
    color: 'var(--accent-primary)', glow: 'rgba(255,107,53,0.08)',
    points: [
      'Bookings/DAU: primary health metric. Measures how efficiently active users convert to paying customers.',
      'GMV (Gross Merchandise Value): total booking value before cancellations. Tracks top-line demand.',
      'CVR (Conversion Rate): Bookings ÷ Sessions. Measures experience and product-market fit quality.',
      'DAU/MAU Ratio: stickiness — do users return daily or monthly? Falling ratio = engagement decay.',
    ],
  },
  {
    id: 'moat', icon: Shield, title: 'Competitive Moat', tagline: 'Why users choose MMT',
    color: 'var(--accent-secondary)', glow: 'rgba(129,140,248,0.08)',
    points: [
      'Largest hotel inventory in India — users trust MMT will always have options even in Tier-2 cities.',
      'MMT wallet and loyalty points create switching costs — users with rewards are reluctant to switch.',
      'Review ecosystem: 10M+ user reviews create a trust moat competitors can\'t replicate quickly.',
      'Price is still king. If a competitor offers 5% lower consistently, the moat erodes fast.',
    ],
  },
]

const APP_LENSES = [
  {
    id:          'funnel',
    icon:        '🔍',
    label:       'Funnel: Count the steps',
    placeholder: 'How many steps/screens did you go through from search to reaching the checkout page? What happened at each step?',
    arjunPrompt: 'funnel steps observation',
  },
  {
    id:          'friction',
    icon:        '⚡',
    label:       'Friction: Where did you hesitate?',
    placeholder: 'Was anything slow, confusing, or made you pause? Where exactly in the flow did you feel resistance?',
    arjunPrompt: 'friction observation',
  },
  {
    id:          'trust',
    icon:        '🤝',
    label:       'Trust: What made you confident or uncertain?',
    placeholder: 'What information helped you feel ready to book? What made you uncertain or want more details?',
    arjunPrompt: 'trust signals observation',
  },
]

const SLACK_LINES = [
  { text: 'Team — flagging this as P0.', bold: true },
  { text: 'We\'ve seen a sustained 18% drop in Bookings/DAU over the last 60 days. This isn\'t a one-day blip — it started around day −62 and hasn\'t recovered.' },
  { text: 'GMV impact is already ₹4.2Cr. If this continues through the festival season, we\'re looking at ₹30Cr+ miss for the quarter.' },
  { text: 'I need a full root cause analysis — not hypotheses, not guesses. Data-backed. What broke? When? Why? Fastest path to recovery.' },
  { text: 'Board review in 3 weeks. I need slides by Friday.' },
]

// ── Sections ──────────────────────────────────────────────────────────────────
type Section = 'canvas' | 'app' | 'brief' | 'hypothesis'

export default function Phase0() {
  const { slug }       = useParams<{ slug: string }>()
  const navigate        = useNavigate()
  const { completePhase, isCompleted } = useProgressStore()
  const completed       = isCompleted('phase-0')

  const [openCard, setOpenCard]       = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<Section>('canvas')
  const [appDone, setAppDone]         = useState(false)
  const [hypothesis, setHypothesis]   = useState('')
  const [hypothesisSaved, setHypothesisSaved] = useState(false)

  useEffect(() => {
    if (completed) {
      setActiveSection('hypothesis')
      setAppDone(true)
      setHypothesisSaved(true)
    }
  }, [completed])

  function handleComplete() {
    completePhase('phase-0')
    navigate(`/case-study/${slug}/phase-1`)
  }

  return (
    <div className="space-y-12 pb-20">

      {/* ══ SECTION 1: Business Canvas ══ */}
      <section id="business-canvas" className="space-y-6">
        <RevealBlock>
          <ArjunInline variant="default">
            <p>
              Before you look at a single number from this investigation — understand the business.
              A great analyst knows the company model as well as any PM.
              Expand each card. Don't skip them.
            </p>
          </ArjunInline>
        </RevealBlock>

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {CANVAS_CARDS.map((card) => {
            const Icon   = card.icon
            const isOpen = openCard === card.id

            return (
              <motion.div key={card.id} variants={staggerItem}>
                <button
                  onClick={() => setOpenCard(isOpen ? null : card.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200"
                  style={{
                    background:   isOpen ? card.glow : 'var(--bg-surface)',
                    border:       `1px solid ${isOpen ? card.color + '30' : 'var(--border-subtle)'}`,
                    borderRadius: isOpen ? '16px 16px 0 0' : '16px',
                  }}
                  aria-expanded={isOpen}
                >
                  <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
                    style={{ background: card.glow, border: `1px solid ${card.color}25` }}>
                    <Icon size={18} style={{ color: card.color }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold"
                      style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      {card.title}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{card.tagline}</p>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                      style={{
                        background:   card.glow,
                        border:       `1px solid ${card.color}30`,
                        borderTop:    'none',
                        borderRadius: '0 0 16px 16px',
                      }}
                    >
                      <div className="px-5 pb-5 pt-3 space-y-3">
                        {card.points.map((point, j) => (
                          <motion.div key={j}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: j * 0.07, duration: 0.35 }}
                            className="flex items-start gap-3"
                          >
                            <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-2"
                              style={{ background: card.color }} />
                            <p className="text-sm leading-relaxed"
                              style={{ color: 'var(--text-secondary)' }}>{point}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>

        {activeSection === 'canvas' && !completed && (
          <RevealBlock delay={0.2}>
            <ContinueButton
              label="I understand the business — now experience it"
              onClick={() => setActiveSection('app')}
            />
          </RevealBlock>
        )}
      </section>

      {/* ══ SECTION 2: App Exploration ══ */}
      <AnimatePresence>
        {(activeSection === 'app' || activeSection === 'brief' || activeSection === 'hypothesis' || completed) && (
          <motion.section
            id="app-exploration"
            key="app"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Section header */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,107,53,0.10)', border: '1px solid rgba(255,107,53,0.20)' }}>
                <Smartphone size={16} style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Section 02
                </p>
                <h2 className="text-xl font-bold"
                  style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  Experience the Product
                </h2>
              </div>
            </div>

            <ArjunInline variant="question" delay={0.1}>
              <p>
                Every analyst I respect has used the product before investigating it.
                You can't understand a metric drop if you've never experienced the flow.
              </p>
              <p className="mt-2">
                <strong style={{ color: 'var(--text-primary)' }}>Open MakeMyTrip on your phone right now.</strong>
                {' '}Search for a hotel in any city, this weekend.
                Browse a hotel detail page. Try to reach the checkout screen.
                Then come back and tell me what you observed.
              </p>
            </ArjunInline>

            {/* Instruction card */}
            <PhaseCard>
              <div className="flex items-start gap-4">
                <span style={{ fontSize: '28px' }}>📱</span>
                <div className="space-y-2">
                  <p className="text-sm font-semibold"
                    style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                    Use the app first. Then record what you noticed.
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    You don't need to complete a booking. Just go through the flow:
                    Search → Browse results → Open a hotel → Try to reach checkout.
                    Use the three lenses below to structure your observations.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {['🔍 Count steps', '⚡ Feel friction', '🤝 Check trust'].map(tag => (
                      <span key={tag} className="text-xs px-3 py-1 rounded-full"
                        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </PhaseCard>

            {/* Observation inputs */}
            <ObservationInput
              lenses={APP_LENSES}
              onComplete={() => {
                setAppDone(true)
                setTimeout(() => setActiveSection('brief'), 600)
              }}
            />
          </motion.section>
        )}
      </AnimatePresence>

      {/* ══ SECTION 3: Head of Growth Brief ══ */}
      <AnimatePresence>
        {(activeSection === 'brief' || activeSection === 'hypothesis' || completed) && appDone && (
          <motion.section
            id="growth-brief"
            key="brief"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div>
              <p className="text-xs uppercase tracking-widest mb-1"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Section 03
              </p>
              <h2 className="text-xl font-bold"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                The Brief
              </h2>
            </div>

            <ArjunInline variant="default" delay={0.1}>
              <p>
                You've used the product. Now read the brief you've been assigned.
                This just landed in your Slack.
              </p>
            </ArjunInline>

            {/* Slack message */}
            <div className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid var(--border-default)' }}>
              <div className="flex items-center gap-3 px-5 py-3"
                style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
                <MessageSquare size={14} style={{ color: 'var(--text-muted)' }} />
                <span className="text-xs font-medium"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  #analytics-escalation
                </span>
              </div>

              <div className="px-5 py-5 space-y-4" style={{ background: 'var(--bg-surface)' }}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg,rgba(255,107,53,0.3),rgba(129,140,248,0.3))', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                    PM
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold"
                        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                        Priya Mehta
                      </span>
                      <span className="text-xs"
                        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        Today at 9:14 AM
                      </span>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Head of Growth, MakeMyTrip
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pl-12">
                  {SLACK_LINES.map((line, lineIdx) => (
                    <motion.p key={lineIdx}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + lineIdx * 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {line.bold
                        ? <strong style={{ color: 'var(--text-primary)' }}>{line.text}</strong>
                        : line.text}
                    </motion.p>
                  ))}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.4 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mt-2"
                    style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.25)' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: 'var(--accent-red)' }} />
                    <span className="text-xs font-semibold"
                      style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>
                      P0 — Board visibility
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>

            {activeSection === 'brief' && !completed && (
              <ContinueButton
                label="Brief received — share my first instinct"
                onClick={() => setActiveSection('hypothesis')}
              />
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ══ SECTION 4: First Hypothesis ══ */}
      <AnimatePresence>
        {(activeSection === 'hypothesis' || completed) && (
          <motion.section
            id="first-hypothesis"
            key="hypothesis"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            <ArjunInline variant="question" delay={0.1}>
              <p>
                You've read the business context. You've used the product. You've read the brief.
              </p>
              <p className="mt-2">
                <strong style={{ color: 'var(--text-primary)' }}>
                  Before you look at any data — what's your gut instinct about what caused this drop?
                </strong>
                {' '}One sentence. No wrong answers. This is a stake in the ground you'll revisit at the end.
              </p>
            </ArjunInline>

            {!hypothesisSaved ? (
              <div className="space-y-3">
                <textarea
                  value={hypothesis}
                  onChange={e => setHypothesis(e.target.value)}
                  placeholder="My initial hypothesis is..."
                  rows={2}
                  className="w-full rounded-xl px-4 py-3 text-sm resize-none"
                  style={{
                    background:  'var(--bg-surface)',
                    border:      '1px solid var(--border-default)',
                    color:       'var(--text-primary)',
                    outline:     'none',
                    fontFamily:  'var(--font-body)',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.10)' }}
                  onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }}
                />
                <button
                  onClick={() => { setHypothesisSaved(true) }}
                  disabled={hypothesis.trim().length < 10}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
                  style={{ background: 'var(--accent-primary)', color: '#fff', fontFamily: 'var(--font-heading)' }}
                >
                  Save to brief →
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="px-4 py-3 rounded-xl"
                  style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    Saved to your brief — Initial Hypothesis:
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {hypothesis || 'Hypothesis recorded.'}
                  </p>
                </div>

                <ArjunInline variant="affirm" delay={0.2}>
                  <p>
                    Good. Hold that thought.
                    You'll come back to this at the end of the investigation to see how close you were.
                    Now let's do the work that either proves or disproves it.
                  </p>
                </ArjunInline>

                {!completed && (
                  <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={handleComplete}
                    className="w-full py-4 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{
                      background: 'var(--accent-primary)',
                      color:      '#fff',
                      fontFamily: 'var(--font-heading)',
                      boxShadow:  '0 0 24px rgba(255,107,53,0.18)',
                    }}
                  >
                    Begin Investigation — Phase 1: Understanding the Problem →
                  </motion.button>
                )}

                {completed && (
                  <div className="flex items-center gap-3 px-5 py-4 rounded-xl"
                    style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}>
                    <span style={{ color: 'var(--accent-green)' }}>✓</span>
                    <p className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>
                      Phase 0 complete — revisiting content
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}
EOF
echo "✅ Phase0.tsx"

# ── 5. Update barrel exports ──────────────────────────────────────────────────
cat >> src/components/phases/index.ts << 'EOF'
export { PhaseCard }          from './PhaseCard'
export { ArjunInline }        from './ArjunInline'
export { ObservationInput }   from './ObservationInput'
EOF
echo "✅ phases/index.ts updated"

# ── 6. Gate 1: TypeScript ────────────────────────────────────────────────────
echo ""
echo "🧠 Gate 1: Type checking..."
npx tsc --noEmit && echo "✅ Zero errors" || echo "❌ Fix above"

echo ""
echo "🔨 Gate 2: Build..."
npm run build && echo "✅ Build passed" || echo "❌ Build failed"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Phase 0 + Phase 1 Final Build complete"
echo ""
echo " Phase 0 flow:"
echo "  1. MMT Business Canvas — 5 expandable cards (taught)"
echo "  2. App Exploration — 3 structured lenses (action)"
echo "     Arjun responds to each observation inline"
echo "  3. Priya's Brief — Slack message (taught, contextualized)"
echo "  4. First Hypothesis — one sentence, no wrong answers"
echo "     Saved to brief. Arjun: 'Hold that thought.'"
echo ""
echo " Phase 1 unchanged — verify it still works"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
