#!/usr/bin/env bash
# PHASE 1 — LINEAR DISCOVERY FLOW
# Pedagogical UX: content earns its place through interaction + timed sequences
# Hook → Reveal → Proof → Mentorship → Protocol → Investigation

set -euo pipefail

echo "📋 Phase 1 — Linear Discovery Flow"
echo "────────────────────────────────────"

for contract in UI_CONTRACT.md BUG_AUDIT.md CODE_QUALITY.md DEBT_REGISTER.md; do
  [ -f "$contract" ] && echo "  ✅ $contract" || { echo "  ❌ $contract missing"; exit 1; }
done

mkdir -p src/components/phases src/components/visuals

# ── 1. TypewriterText — character by character reveal ────────────────────────
cat > src/components/phases/TypewriterText.tsx << 'EOF'
import { useState, useEffect } from 'react'

interface TypewriterTextProps {
  text:       string
  speed?:     number      // ms per character
  delay?:     number      // ms before starting
  onComplete?: () => void
  className?: string
  style?:     React.CSSProperties
}

export function TypewriterText({
  text, speed = 28, delay = 0, onComplete, className, style,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted]     = useState(false)

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(startTimer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    if (displayed.length >= text.length) {
      onComplete?.()
      return
    }
    const t = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1))
    }, speed)
    return () => clearTimeout(t)
  }, [started, displayed, text, speed, onComplete])

  return (
    <span className={className} style={style}>
      {displayed}
      {displayed.length < text.length && (
        <span
          className="inline-block w-0.5 h-4 ml-0.5 align-middle animate-pulse"
          style={{ background: 'var(--accent-secondary)' }}
        />
      )}
    </span>
  )
}
EOF
echo "✅ TypewriterText.tsx"

# ── 2. CalloutArrow — SVG annotation that draws onto chart ───────────────────
cat > src/components/visuals/CalloutArrow.tsx << 'EOF'
import { motion } from 'framer-motion'

interface CalloutArrowProps {
  x:      number   // position as % of container width
  y:      number   // position as % of container height
  label:  string
  side?:  'left' | 'right'
}

export function CalloutArrow({ x, y, label, side = 'right' }: CalloutArrowProps) {
  const offset = side === 'right' ? 1 : -1

  return (
    <div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
    >
      <svg
        width="160" height="60"
        viewBox="0 0 160 60"
        style={{
          position:  'absolute',
          left:      side === 'right' ? '8px' : '-168px',
          top:       '-20px',
          overflow:  'visible',
        }}
      >
        {/* Arrow line */}
        <motion.path
          d={side === 'right'
            ? 'M 0 30 C 20 30, 30 10, 60 10 L 140 10'
            : 'M 160 30 C 140 30, 130 10, 100 10 L 20 10'}
          fill="none"
          stroke="#F87171"
          strokeWidth="1.5"
          strokeDasharray="4,3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        />
        {/* Arrowhead */}
        <motion.polygon
          points={side === 'right' ? '136,6 144,10 136,14' : '24,6 16,10 24,14'}
          fill="#F87171"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: 'spring', stiffness: 400 }}
          style={{ transformOrigin: side === 'right' ? '140px 10px' : '20px 10px' }}
        />
      </svg>

      {/* Dot on chart */}
      <motion.div
        className="w-3 h-3 rounded-full border-2"
        style={{ background: '#F87171', borderColor: '#0D0D0D' }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, delay: 0.1 }}
      />

      {/* Label pill */}
      <motion.div
        className="absolute px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap"
        style={{
          [side === 'right' ? 'left' : 'right']: side === 'right' ? '68px' : '68px',
          top:        '-26px',
          background: 'rgba(248,113,113,0.15)',
          border:     '1px solid rgba(248,113,113,0.40)',
          color:      '#F87171',
          fontFamily: 'var(--font-mono)',
        }}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        {label}
      </motion.div>
    </div>
  )
}
EOF
echo "✅ CalloutArrow.tsx"

# ── 3. Phase 1 — full linear discovery flow ───────────────────────────────────
cat > src/pages/CaseStudy/phases/Phase1.tsx << 'PHASE1_EOF'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams }            from 'react-router-dom'
import { motion, AnimatePresence }           from 'framer-motion'
import CountUp                               from 'react-countup'
import { useProgressStore }                  from '@/store/progressStore'
import { useArjun }                          from '@/hooks/useArjun'
import { TypewriterText }                    from '@/components/phases/TypewriterText'
import { ContinueButton }                    from '@/components/phases/ContinueButton'
import { RevealBlock }                       from '@/components/phases/RevealBlock'
import { ArjunChip }                         from '@/components/phases/ArjunChip'
import { SectionHeader }                     from '@/components/phases/SectionHeader'
import { MiniBarChart }                      from '@/components/phases/MiniBarChart'
import { WoWChart }                          from '@/components/phases/WoWChart'
import { YoYChart }                          from '@/components/phases/YoYChart'
import { FormulaBuilder }                    from '@/components/visuals/FormulaBuilder'
import { ArjunAvatar }                       from '@/components/visuals/ArjunAvatar'
import { CalloutArrow }                      from '@/components/visuals/CalloutArrow'
import { ProtocolMap }                       from '@/components/visuals/ProtocolMap'

// ── Discovery stages ──────────────────────────────────────────────────────────
type Stage =
  | 'slack'        // Hook: Slack typewriter
  | 'metric'       // Reveal: metric counter
  | 'chart'        // Proof: WoW chart + callout
  | 'arjun'        // Mentorship: Arjun message
  | 'protocol'     // Protocol: 4-step cards
  | 'investigation' // Full phase unlocked

// ── Section state (for the investigation phase) ───────────────────────────────
type SectionKey = 's1' | 's2' | 's3' | 's4'
const SECTION_ORDER: SectionKey[] = ['s1', 's2', 's3', 's4']
interface SectionState { visible: boolean; completed: boolean }
type Sections = Record<SectionKey, SectionState>

const INITIAL_SECTIONS: Sections = {
  s1: { visible: true,  completed: false },
  s2: { visible: false, completed: false },
  s3: { visible: false, completed: false },
  s4: { visible: false, completed: false },
}

// ── Slack lines ────────────────────────────────────────────────────────────────
const SLACK_LINES = [
  { text: 'Team — flagging this as P0.',                                                                    bold: true,  delay: 0    },
  { text: "We've seen a sustained 18% drop in Bookings/DAU over 60 days.",                                  bold: false, delay: 1200 },
  { text: 'Started around day −62. Hasn\'t recovered.',                                                      bold: false, delay: 2800 },
  { text: 'GMV impact: ₹4.2Cr already. Festival season starts in 8 weeks.',                                 bold: false, delay: 4200 },
  { text: 'I need root cause, not hypotheses. Data-backed. Board review in 3 weeks.',                       bold: false, delay: 5600 },
]

// ── Protocol steps ────────────────────────────────────────────────────────────
const PROTOCOL_STEPS = [
  { n: '01', emoji: '📐', label: 'Definition Clarity',  why: 'Lock what you\'re measuring before touching data', color: '#FF6B35', delay: 0    },
  { n: '02', emoji: '🔬', label: 'Data Sanity',         why: 'Verify the data is telling the truth',             color: '#818CF8', delay: 0.15 },
  { n: '03', emoji: '📈', label: 'Timeline Review',     why: 'Read the shape — it tells you what kind of problem', color: '#10B981', delay: 0.3  },
  { n: '04', emoji: '🗓', label: 'Seasonality Check',   why: 'Rule out calendar effects before blaming product',  color: '#FF6B35', delay: 0.45 },
]

// ── Sanity checks ─────────────────────────────────────────────────────────────
const SANITY_CHECKS = [
  { id: 'bookings', exhibit: 'Exhibit A — Absolute Bookings',
    question: 'Bookings averaged ~820K/day before and ~819K/day after the drop. What does this tell you?',
    hint: 'Think about the numerator when it stays flat while the denominator grows.' },
  { id: 'dau', exhibit: 'Exhibit B — Absolute DAU',
    question: 'DAU grew from 10.0M to 11.5M/day (+15%). How do you verify this growth is real and not a definition change?',
    hint: 'What external source is immune to analytics definition changes?' },
  { id: 'pipeline', exhibit: 'Exhibit C — Analytics vs Payment Gateway',
    question: 'Analytics shows 819,240 bookings on Day 45. Gateway shows 821,180. Gap = 0.24%. Is this a problem?',
    hint: 'What level of discrepancy is acceptable vs alarming?' },
  { id: 'incidents', exhibit: 'Exhibit D — Data Engineering Incident Log',
    question: 'The log shows 0 ETL failures and 0 schema changes in 90 days. What does this confirm?',
    hint: 'What could cause a metric to look like it dropped when it actually didn\'t?' },
]

// ── Feedback texts ────────────────────────────────────────────────────────────
const SANITY_FEEDBACK: Record<string, { ok: string; push: string }> = {
  bookings: {
    ok:   'Correct. Flat absolute bookings means the numerator didn\'t crash. The ratio fell because DAU grew +15% while bookings stayed flat. This is a rate problem, not a volume collapse.',
    push: 'Think about the numerator of the ratio. If bookings didn\'t crash, what drove the ratio down? Think numerator vs denominator.',
  },
  dau: {
    ok:   'Exactly right. Cross-check DAU against session logs or backend auth events — sources immune to analytics definition changes. Both show 11.5M so the growth is real.',
    push: 'Think about what source is immune to analytics definition changes. What would still show the truth if someone changed the query?',
  },
  pipeline: {
    ok:   'Correct. A 0.24% gap is within acceptable attribution delay noise. A problem would be 5%+. This pipeline is clean.',
    push: 'Think about scale. 1,940 on 820,000 — what percentage is that? Is that alarming or within normal noise?',
  },
  incidents: {
    ok:   'Exactly. Zero incidents means no ETL failure manufactured a fake drop. The pipeline is trustworthy. We can investigate the metric itself.',
    push: 'Think about what an ETL failure or schema change could do to a metric. If the pipeline was broken, how would that look?',
  },
}

// ── SeasonStep ────────────────────────────────────────────────────────────────
type SeasonStep = 'input' | 'softHint' | 'hardHint' | 'chart' | 'done'

// ═════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export default function Phase1() {
  const { slug }       = useParams<{ slug: string }>()
  const navigate        = useNavigate()
  const { completePhase, isCompleted } = useProgressStore()
  const { open: openArjun, sendMessage } = useArjun()
  const phaseCompleted  = isCompleted('phase-1')

  // ── Discovery stage ──────────────────────────────────────────────────────
  const [stage, setStage] = useState<Stage>(phaseCompleted ? 'investigation' : 'slack')

  // ── Slack typewriter state ───────────────────────────────────────────────
  const [visibleLines, setVisibleLines] = useState<number[]>([])
  const [slackDone, setSlackDone]       = useState(false)
  const [countupStarted, setCountupStarted] = useState(false)

  // ── Chart + callout ──────────────────────────────────────────────────────
  const [showCallout, setShowCallout]   = useState(false)
  const [showBands, setShowBands]       = useState(false)

  // ── Arjun message ────────────────────────────────────────────────────────
  const [arjunVisible, setArjunVisible] = useState(false)

  // ── Protocol cards ───────────────────────────────────────────────────────
  const [protocolVisible, setProtocolVisible] = useState(false)

  // ── Investigation sections ───────────────────────────────────────────────
  const [sections, setSections]             = useState<Sections>(INITIAL_SECTIONS)
  const [sanityIdx, setSanityIdx]           = useState(0)
  const [sanityAnswers, setSanityAnswers]   = useState<Record<string, string>>({})
  const [currentAnswer, setCurrentAnswer]   = useState('')
  const [allSanityDone, setAllSanityDone]   = useState(false)
  const [isEvaluating, setIsEvaluating]     = useState(false)
  const [userVariance, setUserVariance]     = useState('')
  const [varianceDone, setVarianceDone]     = useState(false)
  const [seasonStep, setSeasonStep]         = useState<SeasonStep>('input')
  const [seasonAttempts, setSeasonAttempts] = useState(0)
  const [userSeasonApproach, setUserSeasonApproach] = useState('')
  const [userInsight, setUserInsight]       = useState('')
  const [isEvalInsight, setIsEvalInsight]   = useState(false)

  // ── Restore completed state ──────────────────────────────────────────────
  useEffect(() => {
    if (phaseCompleted) {
      setStage('investigation')
      setSections({ s1:{visible:true,completed:true}, s2:{visible:true,completed:true}, s3:{visible:true,completed:true}, s4:{visible:true,completed:true} })
      setAllSanityDone(true)
      setVarianceDone(true)
      setShowBands(true)
      setSeasonStep('done')
    }
  }, [phaseCompleted])

  // ── Slack line reveal sequence ───────────────────────────────────────────
  useEffect(() => {
    if (stage !== 'slack') return
    const timers: ReturnType<typeof setTimeout>[] = []

    SLACK_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines(prev => [...prev, i])
        if (i === SLACK_LINES.length - 1) {
          setTimeout(() => {
            setSlackDone(true)
            setStage('metric')
            setCountupStarted(true)
          }, 1200)
        }
      }, line.delay)
      timers.push(t)
    })

    return () => timers.forEach(clearTimeout)
  }, [stage])

  // ── Chart callout auto-trigger ───────────────────────────────────────────
  useEffect(() => {
    if (stage !== 'chart') return
    const t1 = setTimeout(() => setShowCallout(true), 1800)
    const t2 = setTimeout(() => setArjunVisible(true), 3200)
    const t3 = setTimeout(() => { setStage('arjun'); setProtocolVisible(true) }, 4400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [stage])

  // ── Section navigation ───────────────────────────────────────────────────
  function revealNext(current: SectionKey) {
    const idx  = SECTION_ORDER.indexOf(current)
    const next = SECTION_ORDER[idx + 1] as SectionKey | undefined
    setSections(prev => ({
      ...prev,
      [current]: { ...prev[current], completed: true },
      ...(next ? { [next]: { ...prev[next], visible: true } } : {}),
    }))
    if (next) setTimeout(() => {
      document.getElementById(`section-${next}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 350)
  }

  // ── Sanity check evaluation ──────────────────────────────────────────────
  async function evaluateSanity() {
    if (currentAnswer.trim().length < 15 || isEvaluating) return
    setIsEvaluating(true)
    const check = SANITY_CHECKS[sanityIdx]
    await new Promise(r => setTimeout(r, 800))
    const lower = currentAnswer.toLowerCase()
    const goodMap: Record<string, string[]> = {
      bookings:  ['flat','stable','numerator','denominator','ratio','rate'],
      dau:       ['session','logs','gateway','cross','verify','real','definition'],
      pipeline:  ['acceptable','noise','normal','0.24','within','not a problem'],
      incidents: ['artifact','pipeline','tracking','not broken','clean','trustworthy'],
    }
    const isGood = goodMap[check.id]?.some(kw => lower.includes(kw)) ?? false
    const fb = SANITY_FEEDBACK[check.id]
    openArjun('phase-1')
    setTimeout(() => sendMessage(isGood ? fb.ok : fb.push), 200)
    setSanityAnswers(prev => ({ ...prev, [check.id]: currentAnswer }))
    const nextIdx = sanityIdx + 1
    setTimeout(() => {
      if (nextIdx >= SANITY_CHECKS.length) {
        setAllSanityDone(true)
      } else {
        setSanityIdx(nextIdx)
        setCurrentAnswer('')
      }
    }, isGood ? 600 : 1500)
    setIsEvaluating(false)
  }

  // ── Variance evaluation ──────────────────────────────────────────────────
  function evaluateVariance() {
    const lower = userVariance.toLowerCase()
    const isGood = ['significant','sigma','sd','standard','6','5','beyond','outside','not noise'].some(k => lower.includes(k))
    openArjun('phase-1')
    setTimeout(() => sendMessage(
      isGood
        ? 'Correct. 1.9pp below baseline mean of 12.05%. Baseline SD = 0.30pp. That\'s 6.3 standard deviations below mean. Anything beyond 3σ is statistically extreme. This is not noise — it\'s confirmed structural.'
        : 'Look at where 10.1% sits relative to the variance band. The band shows normal fluctuation. How many SDs below mean is 10.1%? If it\'s beyond 3σ — statistically significant.'
    ), 200)
    if (isGood) setVarianceDone(true)
  }

  // ── Seasonality ──────────────────────────────────────────────────────────
  function handleSeasonSubmit() {
    const lower = userSeasonApproach.toLowerCase()
    const hasYoY = ['year','yoy','last year','2024','same period','historical','compare'].some(k => lower.includes(k))
    const attempts = seasonAttempts + 1
    setSeasonAttempts(attempts)
    if (hasYoY) setSeasonStep('chart')
    else if (attempts === 1) setSeasonStep('softHint')
    else setSeasonStep('hardHint')
  }

  async function handleInsightSubmit() {
    if (userInsight.trim().length < 20 || isEvalInsight) return
    setIsEvalInsight(true)
    await new Promise(r => setTimeout(r, 900))
    const lower = userInsight.toLowerCase()
    const hasStructural = ['structural','not seasonal','jan','feb','2024','flat'].some(k => lower.includes(k))
    const hasSeasonal   = ['oct','nov','seasonal','monsoon','recover','festival'].some(k => lower.includes(k))
    openArjun('phase-1')
    if (hasStructural && hasSeasonal) {
      setTimeout(() => sendMessage('Perfect. Two patterns: (1) Oct-Nov 2024 shows a seasonal dip that recovered by December — post-monsoon travel lull. (2) Jan-Apr 2025 shows a steady structural drop. Jan 2024 was flat at 12% — same calendar window, completely different behaviour. Seasonality is definitively ruled out.'), 200)
      setSeasonStep('done')
    } else if (!hasStructural) {
      setTimeout(() => sendMessage('Look at the Jan-Feb window specifically. In 2024, what was B/DAU in January? Now look at 2025 January. What does the gap tell you about whether the calendar caused this?'), 200)
    } else {
      setTimeout(() => sendMessage('You identified the structural drop correctly. But look at Oct-Nov in the 2024 line — there\'s a visible dip there too. What caused it? Why did it recover in December? Not all dips are structural.'), 200)
    }
    setIsEvalInsight(false)
  }

  function handlePhaseComplete() {
    completePhase('phase-1')
    navigate(`/case-study/${slug}/phase-2`)
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER — DISCOVERY FLOW
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-10 pb-24">

      {/* ╔══════════════════════════════════════╗ */}
      {/* ║  HOOK — Slack typewriter             ║ */}
      {/* ╚══════════════════════════════════════╝ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}
      >
        {/* Slack channel bar */}
        <div className="flex items-center gap-3 px-5 py-3"
          style={{ background: '#1A1A2E', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
            style={{ background: 'rgba(129,140,248,0.25)', color: 'var(--accent-secondary)' }}>#</div>
          <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-mono)' }}>
            analytics-escalation
          </span>
          <div className="ml-auto flex items-center gap-2">
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#10B981' }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="px-5 py-5 space-y-4 min-h-48" style={{ background: '#141428' }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold"
              style={{ background: 'linear-gradient(135deg,#FF6B35,#818CF8)', color: '#fff', fontFamily: 'var(--font-heading)' }}>
              PM
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-heading)' }}>
                  Priya Mehta
                </span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.30)', fontFamily: 'var(--font-mono)' }}>9:14 AM</span>
              </div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.30)' }}>Head of Growth · MakeMyTrip</p>
            </div>
          </div>

          <div className="space-y-2.5" style={{ paddingLeft: '52px' }}>
            {SLACK_LINES.map((line, i) => (
              <AnimatePresence key={i}>
                {visibleLines.includes(i) && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="text-sm leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.75)' }}
                  >
                    {line.bold
                      ? <strong style={{ color: 'rgba(255,255,255,0.95)' }}>
                          <TypewriterText text={line.text} speed={30} />
                        </strong>
                      : <TypewriterText text={line.text} speed={22} />
                    }
                  </motion.p>
                )}
              </AnimatePresence>
            ))}

            {/* P0 badge */}
            <AnimatePresence>
              {slackDone && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.30)' }}
                >
                  <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: '#F87171' }}
                    animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                  <span className="text-xs font-bold" style={{ color: '#F87171', fontFamily: 'var(--font-mono)' }}>
                    P0 · Board visibility · 3 weeks
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Emoji reactions */}
            <AnimatePresence>
              {slackDone && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                  className="flex gap-2">
                  {['🔥 4', '👀 7', '💯 2', '🚨 5'].map(r => (
                    <span key={r} className="text-xs px-2 py-1 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.55)' }}>
                      {r}
                    </span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* ╔══════════════════════════════════════╗ */}
      {/* ║  REVEAL — Metric counter             ║ */}
      {/* ╚══════════════════════════════════════╝ */}
      <AnimatePresence>
        {(stage === 'metric' || stage === 'chart' || stage === 'arjun' || stage === 'protocol' || stage === 'investigation') && (
          <motion.div
            key="metric-reveal"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl overflow-hidden grain"
            style={{
              border:     '1px solid rgba(248,113,113,0.20)',
              background: 'linear-gradient(135deg,rgba(248,113,113,0.05) 0%,rgba(13,13,13,1) 55%,rgba(129,140,248,0.03) 100%)',
            }}
          >
            <motion.div className="absolute top-0 left-0 w-80 h-80 pointer-events-none"
              style={{ background: 'radial-gradient(circle,rgba(248,113,113,0.10) 0%,transparent 70%)', filter: 'blur(48px)', transform: 'translate(-25%,-25%)' }}
              animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 4, repeat: Infinity }} />

            <div className="relative p-6 space-y-5">
              {/* Alert header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <motion.div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-red)' }}
                    animate={{ opacity: [1, 0.2, 1], scale: [1, 0.8, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }} />
                  <span className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>
                    P0 Incident · Board Visibility
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold"
                  style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.25)', color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>
                  LIVE
                </span>
              </div>

              {/* Big counter */}
              <div className="flex items-start gap-6">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-widest"
                    style={{ color: 'rgba(160,152,144,0.5)', fontFamily: 'var(--font-mono)' }}>
                    Bookings / DAU
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span style={{
                      fontSize:      'clamp(48px, 6vw, 72px)',
                      fontWeight:    800,
                      fontFamily:    'var(--font-heading)',
                      color:         'var(--accent-red)',
                      letterSpacing: '-0.04em',
                      lineHeight:    1,
                    }}>
                      {countupStarted ? (
                        <CountUp start={12.0} end={10.1} decimals={1} duration={2.5} suffix="%" />
                      ) : '12.0%'}
                    </span>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2.8, duration: 0.4 }}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
                      style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.25)' }}
                    >
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M5.5 2v7M2 6l3.5 3.5L9 6" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-sm font-bold" style={{ color: '#F87171', fontFamily: 'var(--font-mono)' }}>
                        −1.9pp
                      </span>
                    </motion.div>
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.0 }}
                    style={{ color: 'rgba(160,152,144,0.5)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
                  >
                    12.0% → 10.1% · 60 days sustained · ₹4.2Cr lost
                  </motion.p>
                </div>

                {/* Right: key stats */}
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.2 }}
                  className="flex-1 grid grid-cols-2 gap-3"
                >
                  {[
                    { label: 'Relative decline', value: '−15.8%',  color: 'var(--accent-red)'     },
                    { label: 'Revenue impact',   value: '₹4.2Cr',  color: 'var(--accent-red)'     },
                    { label: 'Duration',         value: '60 days', color: 'var(--accent-primary)'  },
                    { label: 'Board review',     value: '3 weeks', color: 'var(--accent-amber)'    },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="rounded-xl px-3 py-2.5"
                      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <p className="text-xs mb-1" style={{ color: 'rgba(160,152,144,0.5)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>{label}</p>
                      <p className="text-lg font-bold" style={{ color, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>{value}</p>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* CTA — unlocks chart */}
              {stage === 'metric' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3.4, duration: 0.4 }}
                >
                  <button
                    onClick={() => setStage('chart')}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.30)', color: '#F87171', fontFamily: 'var(--font-heading)' }}
                  >
                    <span>I understand the stakes — show me the data</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M8 3l5 5-5 5" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ╔══════════════════════════════════════╗ */}
      {/* ║  PROOF — WoW chart + callout arrow   ║ */}
      {/* ╚══════════════════════════════════════╝ */}
      <AnimatePresence>
        {(stage === 'chart' || stage === 'arjun' || stage === 'protocol' || stage === 'investigation') && (
          <motion.div
            key="chart-reveal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px flex-1" style={{ background: 'var(--border-subtle)' }} />
              <span className="text-xs uppercase tracking-widest px-2"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                8 months · Week-over-Week
              </span>
              <div className="h-px flex-1" style={{ background: 'var(--border-subtle)' }} />
            </div>

            {/* Chart with callout overlay */}
            <div className="relative">
              <WoWChart showBands={showBands} />
              {/* Callout arrow at Week 25 — approximately 78% from left, 35% from top */}
              <AnimatePresence>
                {showCallout && (
                  <CalloutArrow x={78} y={38} label="Drop starts — W25" side="right" />
                )}
              </AnimatePresence>
            </div>

            {/* Shape analysis */}
            <AnimatePresence>
              {showCallout && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.3 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className="rounded-xl p-4"
                    style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.18)' }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1.5"
                      style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>
                      What you see
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Steady decay — <strong style={{ color: 'var(--text-primary)' }}>−0.2pp every week</strong> for 8 weeks. Not accelerating, not recovering. Clockwork degradation.
                    </p>
                  </div>
                  <div className="rounded-xl p-4"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', opacity: 0.7 }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1.5"
                      style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      What it rules out
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      A sudden cliff would mean a single event — outage, bad deploy. This shape points to something <strong style={{ color: 'var(--text-primary)' }}>structural and compounding</strong>.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ╔══════════════════════════════════════╗ */}
      {/* ║  MENTORSHIP — Arjun speaks           ║ */}
      {/* ╚══════════════════════════════════════╝ */}
      <AnimatePresence>
        {arjunVisible && (stage === 'arjun' || stage === 'protocol' || stage === 'investigation') && (
          <motion.div
            key="arjun-reveal"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-4"
          >
            <ArjunAvatar size={44} pulse />
            <div className="flex-1 rounded-2xl rounded-tl-sm px-5 py-4 space-y-3"
              style={{ background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.22)', color: 'var(--text-secondary)' }}>
              <p className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>
                Arjun · Staff Analyst
              </p>
              <TypewriterText
                text="You have the brief. You can see the drop. Every analyst's first instinct right now is to open a dashboard and start segmenting. That instinct kills investigations."
                speed={20}
                className="text-sm leading-relaxed block"
              />
              <TypewriterText
                text="Before you touch any data — run the 4-step protocol. Each step exists to prevent you from spending weeks chasing the wrong cause."
                speed={20}
                delay={3200}
                className="text-sm leading-relaxed block"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ╔══════════════════════════════════════╗ */}
      {/* ║  PROTOCOL — 4 cards slide in         ║ */}
      {/* ╚══════════════════════════════════════╝ */}
      <AnimatePresence>
        {protocolVisible && (stage === 'protocol' || stage === 'investigation') && (
          <motion.div
            key="protocol-reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="space-y-4"
          >
            <p className="text-xs uppercase tracking-widest text-center"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              The 4-step pre-data protocol — in this exact order
            </p>

            <div className="grid grid-cols-2 gap-3">
              {PROTOCOL_STEPS.map((step, i) => (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.5 + step.delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl p-5 space-y-3"
                  style={{ background: `${step.color}08`, border: `1px solid ${step.color}22` }}
                >
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: '24px' }}>{step.emoji}</span>
                    <span className="text-xs font-bold"
                      style={{ color: step.color, fontFamily: 'var(--font-mono)' }}>
                      {step.n}
                    </span>
                  </div>
                  <p className="text-sm font-semibold"
                    style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                    {step.label}
                  </p>
                  <p className="text-xs leading-relaxed"
                    style={{ color: 'var(--text-muted)' }}>
                    {step.why}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA to begin investigation */}
            {stage === 'protocol' && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.4 }}
                onClick={() => setStage('investigation')}
                className="w-full py-4 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98] mt-2"
                style={{
                  background:  'var(--accent-primary)',
                  color:       '#fff',
                  fontFamily:  'var(--font-heading)',
                  boxShadow:   '0 0 32px rgba(255,107,53,0.20)',
                }}
              >
                Begin the protocol — Definition Clarity →
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ╔══════════════════════════════════════╗ */}
      {/* ║  INVESTIGATION — Full phase          ║ */}
      {/* ╚══════════════════════════════════════╝ */}
      <AnimatePresence>
        {stage === 'investigation' && (
          <motion.div
            key="investigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-16"
          >

            {/* ── S1: Definition Clarity ── */}
            <AnimatePresence>
              {sections.s1.visible && (
                <motion.section id="section-s1" key="s1"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-8">
                  <SectionHeader number={1} title="Definition Clarity"
                    subtitle="Lock these down before you touch a single number." />

                  <RevealBlock>
                    <div className="space-y-4">
                      <FormulaBuilder />
                      <div className="flex flex-wrap gap-2">
                        <ArjunChip label="Why a ratio instead of absolute bookings?"
                          prefillText="Why use Bookings/DAU ratio instead of tracking absolute bookings?" />
                      </div>
                    </div>
                  </RevealBlock>

                  <RevealBlock delay={0.05}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl p-5 space-y-2"
                          style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}>
                          <p className="text-xs uppercase tracking-widest"
                            style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>Wrong</p>
                          <p className="text-2xl font-bold"
                            style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-heading)' }}>"CVR dropped 1.9%"</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            Manager hears: small rounding error. Doesn't escalate.
                          </p>
                        </div>
                        <div className="rounded-2xl p-5 space-y-2"
                          style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                          <p className="text-xs uppercase tracking-widest"
                            style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>Correct</p>
                          <p className="text-2xl font-bold"
                            style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-heading)' }}>"CVR dropped 1.9pp"</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            Manager hears: 15.8% relative decline = ₹4.2Cr.
                          </p>
                        </div>
                      </div>
                      <MiniBarChart title="Who counts as a DAU at MMT" unit="" maxValue={100}
                        data={[
                          { label: 'Logged-in users (counted)',    value: 65, color: 'var(--accent-green)' },
                          { label: 'Anonymous visitors (excluded)', value: 28, color: 'var(--accent-red)'   },
                          { label: 'Bot traffic (excluded)',        value: 7,  color: 'var(--text-muted)'   },
                        ]} />
                      <div className="flex flex-wrap gap-2">
                        <ArjunChip label="What if the DAU definition changed mid-period?"
                          prefillText="What happens if the DAU definition changes mid-investigation?" />
                        <ArjunChip label="Why gross bookings, not net?"
                          prefillText="Why do we use gross bookings instead of net bookings for this metric?" />
                      </div>
                    </div>
                  </RevealBlock>

                  {!sections.s1.completed && (
                    <RevealBlock>
                      <ContinueButton label="Definitions locked — now verify the data" onClick={() => revealNext('s1')} />
                    </RevealBlock>
                  )}
                </motion.section>
              )}
            </AnimatePresence>

            {/* ── S2: Data Sanity ── */}
            <AnimatePresence>
              {sections.s2.visible && (
                <motion.section id="section-s2" key="s2"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-8">
                  <SectionHeader number={2} title="Data Sanity"
                    subtitle="Four exhibits. You decide if the data is trustworthy." />

                  <RevealBlock>
                    <div className="flex gap-4">
                      <ArjunAvatar size={44} />
                      <div className="flex-1 rounded-2xl rounded-tl-sm px-5 py-4 text-sm"
                        style={{ background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.20)', color: 'var(--text-secondary)' }}>
                        <p className="text-xs font-semibold uppercase tracking-widest mb-1.5"
                          style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>Arjun</p>
                        Four exhibits. For each one, tell me what it means for the integrity of this investigation. One wrong answer and I show you the answer — then we move on.
                      </div>
                    </div>
                  </RevealBlock>

                  <RevealBlock delay={0.05}>
                    <div className="space-y-4">
                      {SANITY_CHECKS.map((check, i) => {
                        const isDone   = i < sanityIdx || allSanityDone
                        const isActive = i === sanityIdx && !allSanityDone
                        const isLocked = i > sanityIdx && !allSanityDone
                        return (
                          <motion.div key={check.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: isLocked ? 0.3 : 1, y: 0 }}
                            transition={{ delay: i * 0.08, duration: 0.4 }}
                            className="rounded-2xl overflow-hidden"
                            style={{ border: isDone ? '1px solid rgba(16,185,129,0.25)' : '1px solid var(--border-subtle)' }}>
                            <div className="flex items-center justify-between px-5 py-3"
                              style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
                              <p className="text-xs font-semibold uppercase tracking-widest"
                                style={{ color: isDone ? 'var(--accent-green)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {check.exhibit}
                              </p>
                              {isDone && <span style={{ color: 'var(--accent-green)' }}>✓</span>}
                            </div>
                            <div className="px-5 py-4 space-y-3" style={{ background: 'var(--bg-elevated)' }}>
                              <p className="text-sm font-medium"
                                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                                {check.question}
                              </p>
                              {isDone && sanityAnswers[check.id] && (
                                <div className="px-4 py-3 rounded-xl"
                                  style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
                                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Your answer:</p>
                                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{sanityAnswers[check.id]}</p>
                                </div>
                              )}
                              {isActive && (
                                <>
                                  <textarea value={currentAnswer} onChange={e => setCurrentAnswer(e.target.value)}
                                    placeholder={check.hint} rows={2}
                                    className="w-full rounded-xl px-4 py-3 text-sm resize-none"
                                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', outline: 'none' }}
                                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.10)' }}
                                    onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }} />
                                  <button onClick={evaluateSanity}
                                    disabled={currentAnswer.trim().length < 15 || isEvaluating}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
                                    style={{ background: 'var(--accent-secondary)', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                                    {isEvaluating && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                    {isEvaluating ? 'Evaluating...' : 'Submit analysis'}
                                  </button>
                                </>
                              )}
                            </div>
                          </motion.div>
                        )
                      })}
                      {allSanityDone && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          className="px-5 py-4 rounded-xl"
                          style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}>
                          <p className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>
                            ✓ All four exhibits validated — data is trustworthy.
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </RevealBlock>

                  {sections.s2.visible && !sections.s2.completed && allSanityDone && (
                    <RevealBlock>
                      <ContinueButton label="Data verified — show me the timeline" onClick={() => revealNext('s2')} />
                    </RevealBlock>
                  )}
                </motion.section>
              )}
            </AnimatePresence>

            {/* ── S3: Timeline + Variance ── */}
            <AnimatePresence>
              {sections.s3.visible && (
                <motion.section id="section-s3" key="s3"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-8">
                  <SectionHeader number={3} title="Timeline Review"
                    subtitle="You already saw the shape. Now verify it statistically." />

                  <RevealBlock>
                    <div className="relative">
                      <WoWChart showBands={showBands} />
                      {showBands && <CalloutArrow x={78} y={38} label="6.3σ below mean" side="right" />}
                    </div>
                  </RevealBlock>

                  <RevealBlock delay={0.05}>
                    <div className="rounded-2xl p-6 space-y-4"
                      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                      <p className="text-sm font-semibold"
                        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                        Is this drop statistically significant, or could it be normal variance?
                      </p>
                      {!varianceDone && (
                        <div className="space-y-3">
                          <textarea value={userVariance} onChange={e => setUserVariance(e.target.value)}
                            placeholder="Is 10.1% statistically significant given historical variation? How would you determine this?"
                            rows={2} className="w-full rounded-xl px-4 py-3 text-sm resize-none"
                            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', outline: 'none' }}
                            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.10)' }}
                            onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }} />
                          <button onClick={evaluateVariance} disabled={userVariance.trim().length < 15}
                            className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
                            style={{ background: 'var(--accent-secondary)', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                            Submit answer
                          </button>
                        </div>
                      )}
                      {varianceDone && !showBands && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Good. Now see it visually — the variance bands show the range of normal fluctuation.
                          </p>
                          <button onClick={() => setShowBands(true)}
                            className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--accent-secondary)', color: 'var(--accent-secondary)', fontFamily: 'var(--font-heading)' }}>
                            Show variance bands
                          </button>
                        </motion.div>
                      )}
                      {showBands && (
                        <div className="px-4 py-3 rounded-xl"
                          style={{ background: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.15)' }}>
                          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            <strong style={{ color: 'var(--accent-secondary)' }}>Statistical verdict: </strong>
                            Baseline SD = 0.30pp. Current drop = 1.9pp below mean =
                            <strong style={{ color: 'var(--accent-red)' }}> 6.3σ</strong>.
                            Anything beyond 3σ is statistically extreme. This is confirmed structural.
                          </p>
                        </div>
                      )}
                    </div>
                  </RevealBlock>

                  {!sections.s3.completed && varianceDone && showBands && (
                    <RevealBlock>
                      <ContinueButton label="Pattern confirmed — now rule out seasonality" onClick={() => revealNext('s3')} />
                    </RevealBlock>
                  )}
                </motion.section>
              )}
            </AnimatePresence>

            {/* ── S4: Seasonality ── */}
            <AnimatePresence>
              {sections.s4.visible && (
                <motion.section id="section-s4" key="s4"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6">
                  <SectionHeader number={4} title="Seasonality Check"
                    subtitle="One final check before hypothesis building." />

                  <RevealBlock>
                    <div className="rounded-2xl p-6 space-y-5"
                      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                      <div className="flex gap-4">
                        <ArjunAvatar size={44} />
                        <p className="flex-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          Travel is seasonal. Before you blame product or supply —
                          <strong style={{ color: 'var(--text-primary)' }}> how would you check if this drop is simply a calendar pattern?</strong>
                        </p>
                      </div>

                      {(seasonStep === 'input' || seasonStep === 'softHint' || seasonStep === 'hardHint') && (
                        <div className="space-y-3">
                          <textarea value={userSeasonApproach} onChange={e => setUserSeasonApproach(e.target.value)}
                            placeholder="What data would you pull and what would you look for?"
                            rows={2} className="w-full rounded-xl px-4 py-3 text-sm resize-none"
                            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', outline: 'none' }}
                            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.10)' }}
                            onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }} />
                          <button onClick={handleSeasonSubmit} disabled={userSeasonApproach.trim().length < 10}
                            className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
                            style={{ background: 'var(--accent-secondary)', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                            Submit approach
                          </button>
                        </div>
                      )}

                      <AnimatePresence>
                        {seasonStep === 'softHint' && (
                          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            className="px-4 py-3 rounded-xl"
                            style={{ background: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.15)' }}>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              <strong style={{ color: 'var(--accent-secondary)' }}>Arjun: </strong>
                              Think about what historical data would let you isolate whether this time of year is inherently lower. What comparison separates a calendar effect from a product problem?
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <AnimatePresence>
                        {seasonStep === 'hardHint' && (
                          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            className="flex gap-3 px-4 py-4 rounded-xl"
                            style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.20)' }}>
                            <span style={{ fontSize: '16px' }}>💡</span>
                            <div className="space-y-2">
                              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                Compare the same calendar period one year apart. If the same period last year also dipped — seasonal. If last year was flat — structural.
                              </p>
                              <button onClick={() => setSeasonStep('chart')}
                                className="text-sm font-semibold underline underline-offset-2"
                                style={{ color: 'var(--accent-amber)' }}>
                                Show me the year-over-year data →
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </RevealBlock>

                  <AnimatePresence>
                    {(seasonStep === 'chart' || seasonStep === 'done') && (
                      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }} className="space-y-5">
                        <YoYChart />
                        <ArjunChip label="Why is YoY the right method here?"
                          prefillText="Why is year-over-year comparison the right method for checking seasonality in a metric investigation?" />

                        {seasonStep === 'chart' && (
                          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl p-5 space-y-3"
                            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                            <p className="text-sm font-semibold"
                              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                              Two distinct patterns visible. What do you conclude? Identify both.
                            </p>
                            <textarea value={userInsight} onChange={e => setUserInsight(e.target.value)}
                              placeholder="What is seasonal, what is structural, and how do you know?"
                              rows={3} className="w-full rounded-xl px-4 py-3 text-sm resize-none"
                              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', outline: 'none' }}
                              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.10)' }}
                              onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }} />
                            <button onClick={handleInsightSubmit}
                              disabled={userInsight.trim().length < 20 || isEvalInsight}
                              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
                              style={{ background: 'var(--accent-secondary)', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                              {isEvalInsight && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                              {isEvalInsight ? 'Reading...' : 'Submit insight'}
                            </button>
                          </motion.div>
                        )}

                        {seasonStep === 'done' && (
                          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                            <div className="px-4 py-4 rounded-xl"
                              style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}>
                              <p className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>
                                ✓ Seasonality ruled out — Arjun's full response is in the panel.
                              </p>
                            </div>
                            {!phaseCompleted ? (
                              <motion.button onClick={handlePhaseComplete}
                                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="w-full py-4 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
                                style={{ background: 'var(--accent-primary)', color: '#fff', fontFamily: 'var(--font-heading)', boxShadow: '0 0 24px rgba(255,107,53,0.18)' }}>
                                Seasonality ruled out — Begin Hypothesis Building →
                              </motion.button>
                            ) : (
                              <div className="flex items-center gap-3 px-5 py-4 rounded-xl"
                                style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}>
                                <span style={{ color: 'var(--accent-green)' }}>✓</span>
                                <p className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>
                                  Phase 1 complete — revisiting
                                </p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.section>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
PHASE1_EOF
echo "✅ Phase1.tsx — linear discovery flow"

# ── Update barrel ─────────────────────────────────────────────────────────────
python3 << 'PYEOF'
# Add TypewriterText to phases barrel
with open('src/components/phases/index.ts', 'r') as f:
    c = f.read()
if 'TypewriterText' not in c:
    c += "\nexport { TypewriterText } from './TypewriterText'"
with open('src/components/phases/index.ts', 'w') as f:
    f.write(c)

# Add CalloutArrow to visuals barrel
with open('src/components/visuals/index.ts', 'r') as f:
    c = f.read()
if 'CalloutArrow' not in c:
    c += "\nexport { CalloutArrow } from './CalloutArrow'"
with open('src/components/visuals/index.ts', 'w') as f:
    f.write(c)
print("✅ barrels updated")
PYEOF

# ── Gates ─────────────────────────────────────────────────────────────────────
echo ""
echo "🧠 Gate 1: Type checking..."
npx tsc --noEmit && echo "✅ Zero errors" || echo "❌ Fix above"

echo ""
echo "🔨 Gate 2: Build..."
npm run build && echo "✅ Build passed" || echo "❌ Build failed"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Phase 1 — Linear Discovery Flow"
echo ""
echo " Stage 1 HOOK: Slack lines appear one by one (typewriter)"
echo "   Priya's message builds character by character"
echo "   P0 badge + reactions auto-reveal after last line"
echo ""
echo " Stage 2 REVEAL: B/DAU counter animates 12.0% → 10.1%"
echo "   4 metric pills stagger in after CountUp finishes"
echo "   CTA: 'I understand the stakes — show me the data'"
echo "   (user must click to earn the chart)"
echo ""
echo " Stage 3 PROOF: WoW chart draws in"
echo "   After 1.8s: CalloutArrow animates to Week 25"
echo "   Shape analysis cards appear below callout"
echo ""
echo " Stage 4 MENTORSHIP: Arjun message typewriters in"
echo "   'Every analyst's first instinct is to open a dashboard.'"
echo "   'That instinct kills investigations.'"
echo ""
echo " Stage 5 PROTOCOL: 4 cards slide in one by one"
echo "   2×2 grid, staggered 150ms apart"
echo "   CTA: 'Begin the protocol — Definition Clarity →'"
echo ""
echo " Stage 6 INVESTIGATION: Full phase unlocks"
echo "   S1 Definition → S2 Sanity → S3 Timeline → S4 Seasonality"
echo "   Each section unlocked by ContinueButton"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
