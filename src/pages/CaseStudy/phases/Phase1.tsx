import { useState, useEffect }     from 'react'
import { useNavigate, useParams }  from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useProgressStore }        from '@/store/progressStore'
import { useArjunStore }         from '@/store/arjunStore'
import { RevealBlock }             from '@/components/phases/RevealBlock'
import { MetricCard }              from '@/components/phases/MetricCard'
import { MiniBarChart }            from '@/components/phases/MiniBarChart'
import { ArjunChip }               from '@/components/phases/ArjunChip'
import { ContinueButton }          from '@/components/phases/ContinueButton'
import { SectionHeader }           from '@/components/phases/SectionHeader'
import { WoWChart }                from '@/components/phases/WoWChart'
import { YoYChart }                from '@/components/phases/YoYChart'
import { IncidentHero }   from '@/components/visuals/IncidentHero'
import { ProtocolMap }   from '@/components/visuals/ProtocolMap'
import { FormulaBuilder } from '@/components/visuals/FormulaBuilder'
import { ArjunAvatar }   from '@/components/visuals/ArjunAvatar'

// ── Types ─────────────────────────────────────────────────────────────────────
type SectionKey = 's0' | 's1' | 's2' | 's3' | 's4'
const SECTION_ORDER: SectionKey[] = ['s0', 's1', 's2', 's3', 's4']
interface SectionState { visible: boolean; completed: boolean }
type Sections = Record<SectionKey, SectionState>

const INITIAL_SECTIONS: Sections = {
  s0: { visible: true,  completed: false }, // Brief + Protocol
  s1: { visible: false, completed: false }, // Definitions
  s2: { visible: false, completed: false }, // Data sanity
  s3: { visible: false, completed: false }, // Timeline
  s4: { visible: false, completed: false }, // Seasonality
}

// ── Sanity check validation ───────────────────────────────────────────────────
interface SanityCheck {
  id:       string
  exhibit:  string
  question: string
  hint:     string
}

const SANITY_CHECKS: SanityCheck[] = [
  {
    id:       'bookings',
    exhibit:  'Exhibit A — Absolute Bookings',
    question: 'Bookings averaged ~820K/day before the drop and ~819K/day after. What does this tell you?',
    hint:     'Think about what it means for the numerator of our ratio when it stays flat while the denominator grows.',
  },
  {
    id:       'dau',
    exhibit:  'Exhibit B — Absolute DAU',
    question: 'DAU grew from 10.0M to 11.5M/day (+15%). How do you verify this growth is real and not a definition change?',
    hint:     'What source would you cross-check against to verify the DAU number isn\'t inflated?',
  },
  {
    id:       'pipeline',
    exhibit:  'Exhibit C — Analytics vs Payment Gateway',
    question: 'Analytics shows 819,240 bookings on Day 45. Payment gateway shows 821,180. Gap = 1,940 (0.24%). Is this a problem?',
    hint:     'Think about what level of discrepancy is acceptable vs alarming in analytics pipelines.',
  },
  {
    id:       'incidents',
    exhibit:  'Exhibit D — Data Engineering Incident Log',
    question: 'The incident log shows 0 ETL failures and 0 schema changes in 90 days. What does this confirm?',
    hint:     'Think about what could cause a metric to look like it dropped when it actually didn\'t.',
  },
]

type SeasonStep = 'input' | 'softHint' | 'hardHint' | 'chart' | 'insight' | 'done'

// ── Component ─────────────────────────────────────────────────────────────────
export default function Phase1() {
  const { slug }       = useParams<{ slug: string }>()
  const navigate        = useNavigate()
  const { completePhase, isCompleted } = useProgressStore()
  const openWithContent = useArjunStore((s) => s.openWithContent)
  const phaseCompleted  = isCompleted('phase-1')

  const [sections, setSections]           = useState<Sections>(INITIAL_SECTIONS)
  const [showBands, setShowBands]         = useState(false)
  const [userVariance, setUserVariance]   = useState('')
  const [varianceDone, setVarianceDone]   = useState(false)

  // Sanity check state — one at a time
  const [sanityIdx, setSanityIdx]         = useState(0)
  const [sanityAnswers, setSanityAnswers] = useState<Record<string, string>>({})
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [sanityFeedback, setSanityFeedback] = useState<Record<string, 'ok' | 'push'>>({})
  const [isEvaluating, setIsEvaluating]   = useState(false)
  const [allSanityDone, setAllSanityDone] = useState(false)

  // Seasonality state
  const [seasonStep, setSeasonStep]       = useState<SeasonStep>('input')
  const [seasonAttempts, setSeasonAttempts] = useState(0)
  const [userSeasonApproach, setUserSeasonApproach] = useState('')
  const [userInsight, setUserInsight]     = useState('')
  const [insightAttempts, setInsightAttempts] = useState(0)
  const [isEvalInsight, setIsEvalInsight] = useState(false)

  useEffect(() => {
    if (phaseCompleted) {
      setSections({ s0:{visible:true,completed:true}, s1:{visible:true,completed:true}, s2:{visible:true,completed:true}, s3:{visible:true,completed:true}, s4:{visible:true,completed:true} })
      setAllSanityDone(true)
      setVarianceDone(true)
      setShowBands(true)
      setSeasonStep('done')
    }
  }, [phaseCompleted])

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

  // Sanity check evaluation
  async function evaluateSanity() {
    if (currentAnswer.trim().length < 15 || isEvaluating) return
    setIsEvaluating(true)
    const check = SANITY_CHECKS[sanityIdx]
    await new Promise(r => setTimeout(r, 800))

    const lower = currentAnswer.toLowerCase()
    const goodKeywords: Record<string, string[]> = {
      bookings:  ['flat', 'stable', 'numerator', 'denominator', 'ratio', 'rate', 'didn\'t crash', 'not crashed'],
      dau:       ['session', 'logs', 'gateway', 'cross', 'verify', 'real', 'genuine', 'definition', 'source'],
      pipeline:  ['acceptable', 'noise', 'normal', '0.3', '0.24', 'within', 'not a problem', 'fine', 'ok'],
      incidents: ['artifact', 'fake', 'pipeline', 'tracking', 'not broken', 'clean', 'trustworthy', 'real'],
    }

    const isGood = goodKeywords[check.id]?.some(kw => lower.includes(kw)) ?? false

    setSanityFeedback(prev => ({ ...prev, [check.id]: isGood ? 'ok' : 'push' }))
    setSanityAnswers(prev => ({ ...prev, [check.id]: currentAnswer }))

    if (isGood) {
      openWithContent({
        type:  'insight',
        title: `Exhibit ${String.fromCharCode(65 + sanityIdx)} — Arjun's take`,
        text:  getSanityFeedbackText(check.id, true),
      })
      const nextIdx = sanityIdx + 1
      if (nextIdx >= SANITY_CHECKS.length) {
        setAllSanityDone(true)
      } else {
        setSanityIdx(nextIdx)
        setCurrentAnswer('')
      }
    } else {
      // After 1 wrong answer — show solution and auto-advance
      openWithContent({
        type:  'insight',
        title: `Exhibit ${String.fromCharCode(65 + sanityIdx)} — Answer revealed`,
        text:  getSanityFeedbackText(check.id, true),
      })
      setSanityFeedback(prev => ({ ...prev, [check.id]: 'ok' }))
      setSanityAnswers(prev => ({ ...prev, [check.id]: currentAnswer + ' [Arjun showed answer]' }))
      const nextIdx = sanityIdx + 1
      setTimeout(() => {
        if (nextIdx >= SANITY_CHECKS.length) {
          setAllSanityDone(true)
        } else {
          setSanityIdx(nextIdx)
          setCurrentAnswer('')
        }
      }, 1500)
    }
    setIsEvaluating(false)
  }

  function getSanityFeedbackText(id: string, correct: boolean): string {
    const texts: Record<string, { ok: string; push: string }> = {
      bookings: {
        ok:   'Correct. Flat absolute bookings tells us the numerator didn\'t crash. The ratio fell because DAU (denominator) grew +15% while bookings stayed flat. This is a rate problem, not a volume collapse. A very different kind of investigation.',
        push: 'Look at what the flat bookings tells you about the numerator of our ratio. If bookings didn\'t crash, what drove the ratio down? Think about numerator vs denominator.',
      },
      dau: {
        ok:   'Exactly right. You cross-check DAU against session logs or backend auth events — sources that can\'t be accidentally inflated by an analytics definition change. If both sources show 11.5M, the growth is real.',
        push: 'Think about what source is immune to analytics definition changes. If someone accidentally changed the DAU query to include anonymous users, what external source would still show the truth?',
      },
      pipeline: {
        ok:   'Correct. A 0.24% gap between analytics and payment gateway is within acceptable noise — attribution delays, timezone edge cases. A problem would be 5%+. This pipeline is clean.',
        push: 'Think about scale. 1,940 on 820,000 bookings — what percentage is that? Is that alarming or within normal attribution delay noise?',
      },
      incidents: {
        ok:   'Exactly. Zero incidents means no ETL failure manufactured a fake drop. The data pipeline is trustworthy. We can now investigate the metric itself rather than chasing a ghost in the pipeline.',
        push: 'Think about what an ETL failure or schema change could do to a metric. If the pipeline was broken, what would the metric drop look like vs what we\'re seeing?',
      },
    }
    return texts[id]?.[correct ? 'ok' : 'push'] ?? ''
  }

  // Variance evaluation
  function evaluateVariance() {
    const lower = userVariance.toLowerCase()
    const isGood = lower.includes('significant') || lower.includes('not noise') ||
      lower.includes('sigma') || lower.includes('sd') || lower.includes('standard') ||
      lower.includes('outside') || lower.includes('6') || lower.includes('5') || lower.includes('beyond')

    openWithContent({
      type:  'insight',
      title: isGood ? 'Correct — statistically significant' : 'Think about the bands',
      text:  isGood
        ? 'The drop is 1.9pp below the baseline mean of 12.05%. Baseline SD is ±0.3pp. That puts the current value at 6.3 standard deviations below mean. In statistics, anything beyond ±3σ is considered extremely significant. This is not noise — this is a real, structural, statistically confirmed drop.'
        : 'Look at where 10.1% sits relative to the ±1σ band. The band is the range of normal fluctuation. If the current value is inside the band — noise. If far outside — statistically significant. How many SDs below mean is 10.1%?',
    })
    if (isGood) setVarianceDone(true)
  }

  // Seasonality
  function handleSeasonSubmit() {
    const lower = userSeasonApproach.toLowerCase()
    const hasYoY = lower.includes('year') || lower.includes('yoy') ||
      lower.includes('last year') || lower.includes('2024') ||
      lower.includes('same period') || lower.includes('historical') || lower.includes('compare')

    const attempts = seasonAttempts + 1
    setSeasonAttempts(attempts)

    if (hasYoY) {
      setSeasonStep('chart')
    } else if (attempts === 1) {
      setSeasonStep('softHint')
    } else {
      setSeasonStep('hardHint')
    }
  }

  async function handleInsightSubmit() {
    if (userInsight.trim().length < 20 || isEvalInsight) return
    setIsEvalInsight(true)
    await new Promise(r => setTimeout(r, 900))

    const lower = userInsight.toLowerCase()
    const hasStructural = lower.includes('structural') || lower.includes('not seasonal') ||
      lower.includes('jan') || lower.includes('feb') || lower.includes('2024') ||
      lower.includes('same period') || lower.includes('flat') || lower.includes('2025')
    const hasSeasonal   = lower.includes('oct') || lower.includes('nov') ||
      lower.includes('seasonal') || lower.includes('monsoon') || lower.includes('recover') ||
      lower.includes('festival') || lower.includes('december')
    const hasBoth       = hasStructural && hasSeasonal
    const attempts      = insightAttempts + 1
    setInsightAttempts(attempts)

    if (hasBoth) {
      openWithContent({
        type:  'insight',
        title: 'Complete insight — seasonality ruled out',
        text:  'Perfect analysis. Two patterns in the chart: (1) Oct–Nov 2024 shows a ~1pp seasonal dip that recovered by December — this is the known post-monsoon travel lull. (2) Jan–Apr 2025 shows a steady structural drop from 11.7% to 10.1% — Jan 2024 was flat at 12.0%, so this is NOT seasonal. Same calendar window, completely different behaviour. Seasonality is definitively ruled out. The drop is structural — something changed in the product, supply, or user behaviour around W25.',
      })
      setSeasonStep('done')
    } else if (!hasStructural && attempts < 2) {
      openWithContent({
        type:  'insight',
        title: 'Partial — look at Jan–Feb specifically',
        text:  'You identified the seasonal pattern correctly. Now look at the Jan–Feb window. In 2024, what was B/DAU in January? Now look at 2025 January. Are they the same? What does that tell you about whether the current drop is seasonal or structural?',
      })
      setInsightAttempts(attempts)
    } else if (!hasSeasonal && attempts < 2) {
      openWithContent({
        type:  'insight',
        title: 'Partial — look at Oct–Nov 2024',
        text:  'You correctly identified the Jan–Feb structural drop. But look at Oct–Nov in the 2024 line — there\'s a visible dip there too. What caused it? Why did it recover in December? This is important: not all dips are structural. Identifying the seasonal pattern makes your structural conclusion stronger.',
      })
      setInsightAttempts(attempts)
    } else {
      openWithContent({
        type:  'insight',
        title: 'Both patterns — complete your insight',
        text:  'Look for two things: (1) Oct–Nov 2024 dip + December recovery = seasonal. (2) Jan–Feb 2025 drop vs Jan–Feb 2024 flat = structural. Your insight needs to address both patterns to be complete.',
      })
    }
    setIsEvalInsight(false)
  }

  function handlePhaseComplete() {
    completePhase('phase-1')
    navigate(`/case-study/${slug}/phase-2`)
  }

  return (
    <div className="space-y-16 pb-20">

      {/* ══ S0 — Brief + Protocol ══ */}
      <AnimatePresence>
        {sections.s0.visible && (
          <motion.section id="section-s0" key="s0"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6">

            {/* Brief summary */}
            <RevealBlock>
              <div className="rounded-2xl p-6 space-y-4"
                style={{ background: 'var(--bg-surface)', border: '1px solid rgba(248,113,113,0.20)' }}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent-red)' }} />
                  <span className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>
                    P0 Incident — Board Visibility
                  </span>
                </div>
                <p className="text-lg font-semibold leading-snug"
                  style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  MakeMyTrip Bookings/DAU has dropped 18% over 60 days. ₹4.2Cr already lost. Board review in 3 weeks.
                </p>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { label: 'Metric drop', value: '−1.9pp', sub: 'B/DAU: 12.0% → 10.1%', color: 'var(--accent-red)' },
                    { label: 'Revenue impact', value: '₹4.2Cr', sub: 'Already lost', color: 'var(--accent-red)' },
                    { label: 'Duration', value: '60 days', sub: 'Sustained, not a spike', color: 'var(--accent-primary)' },
                  ].map(({ label, value, sub, color }) => (
                    <div key={label} className="rounded-xl p-4 space-y-1"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                      <p className="text-xs uppercase tracking-widest"
                        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</p>
                      <p className="text-xl font-bold"
                        style={{ color, fontFamily: 'var(--font-heading)' }}>{value}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </RevealBlock>

            {/* Arjun — stop, don't jump */}
            <RevealBlock delay={0.05}>
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg,rgba(129,140,248,0.3),rgba(255,107,53,0.25))', border: '1px solid rgba(129,140,248,0.30)', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  A
                </div>
                <div className="flex-1 rounded-2xl rounded-tl-sm px-5 py-4 space-y-3"
                  style={{ background: 'var(--bg-surface)', border: '1px solid rgba(129,140,248,0.20)' }}>
                  <p className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>
                    Arjun · Staff Analyst
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    You've received the brief. Every analyst's first instinct is to open a dashboard immediately.
                    <strong style={{ color: 'var(--accent-red)' }}> That instinct kills investigations.</strong>
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Before you touch any data, you run a 4-step protocol. Each step exists to prevent you from
                    chasing the wrong cause for weeks. I've seen analysts waste 3 weeks on a drop that turned
                    out to be a tracking bug — because they skipped these checks.
                  </p>
                </div>
              </div>
            </RevealBlock>

            {/* Protocol map */}
            <RevealBlock delay={0.1}>
              <div className="rounded-2xl p-6 space-y-4"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                <p className="text-xs uppercase tracking-widest"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  The 4-step protocol — in this exact order
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { n: '01', label: 'Definition Clarity', why: 'Lock what you\'re measuring', color: 'var(--accent-primary)' },
                    { n: '02', label: 'Data Sanity',        why: 'Verify the data is real',    color: 'var(--accent-secondary)' },
                    { n: '03', label: 'Timeline Review',    why: 'Read the shape of the drop', color: 'var(--accent-green)' },
                    { n: '04', label: 'Seasonality Check',  why: 'Rule out calendar effects',  color: 'var(--accent-primary)' },
                  ].map(({ n, label, why, color }, i) => (
                    <div key={n} className="relative rounded-xl p-4 space-y-2"
                      style={{ background: 'var(--bg-elevated)', border: `1px solid ${color}20` }}>
                      {i < 3 && (
                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10"
                          style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: 700 }}>→</div>
                      )}
                      <span className="text-xs font-bold" style={{ color, fontFamily: 'var(--font-mono)' }}>{n}</span>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>{label}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{why}</p>
                    </div>
                  ))}
                </div>
              </div>
            </RevealBlock>

            {!sections.s0.completed && (
              <RevealBlock>
                <ContinueButton label="Understood — begin Definition Clarity" onClick={() => revealNext('s0')} />
              </RevealBlock>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ══ S1 — Definition Clarity ══ */}
      <AnimatePresence>
        {sections.s1.visible && (
          <motion.section id="section-s1" key="s1"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8">
            <SectionHeader number={1} title="Definition Clarity"
              subtitle="Lock down exactly what you're measuring before looking at any numbers." />

            {/* What is B/DAU — formula visual */}
            <RevealBlock>
              <div className="space-y-4">
                <div className="rounded-2xl p-6 space-y-4"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                  <p className="text-xs uppercase tracking-widest"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    The metric — precisely defined
                  </p>
                  {/* Formula */}
                  <div className="flex flex-wrap items-center gap-3 py-2">
                    {[
                      { text: 'Bookings/DAU', color: 'var(--accent-primary)' },
                      { text: '=',            color: 'var(--text-muted)'     },
                      { text: 'Total Gross Completed Payments', color: 'var(--accent-secondary)' },
                      { text: '÷',            color: 'var(--text-muted)'     },
                      { text: 'Logged-in Unique Daily Users',   color: 'var(--accent-green)'     },
                    ].map(({ text, color }) => (
                      <motion.span key={text}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="text-base font-bold"
                        style={{ color, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
                        {text}
                      </motion.span>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    If 1,000 users open the app and 120 complete a booking, Bookings/DAU = 12%.
                    It answers one question: <em style={{ color: 'var(--text-primary)' }}>are users converting?</em>
                  </p>
                  <div className="px-4 py-3 rounded-xl"
                    style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      <strong style={{ color: 'var(--accent-red)' }}>Critical trap: </strong>
                      B/DAU can fall even if absolute bookings are flat — if DAU grows faster.
                      Always check numerator and denominator separately. Never conclude from the ratio alone.
                    </p>
                  </div>
                </div>
                <ArjunChip label="Why a ratio instead of absolute bookings?" prefillText="Why a ratio instead of absolute bookings?" />
              </div>
            </RevealBlock>

            {/* DAU definition */}
            <RevealBlock delay={0.05}>
              <div className="space-y-4">
                <MiniBarChart title="Who counts as a DAU at MMT" unit="" maxValue={100}
                  data={[
                    { label: 'Logged-in users — counted',        value: 65, color: 'var(--accent-green)'    },
                    { label: 'Anonymous visitors — excluded',     value: 28, color: 'var(--accent-red)'      },
                    { label: 'Bot traffic — excluded',            value: 7,  color: 'var(--text-muted)'      },
                  ]} />
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  DAU = <strong style={{ color: 'var(--text-primary)' }}>logged-in unique users</strong> with intent.
                  Anonymous users have near-zero booking intent. Including them inflates the denominator
                  and makes CVR look artificially low. Logged-in = qualified demand.
                </p>
                <ArjunChip label="What if this definition changed mid-investigation?" prefillText="What if this definition changed mid-investigation?" />
              </div>
            </RevealBlock>

            {/* Gross vs Net */}
            <RevealBlock delay={0.08}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl p-5 space-y-3"
                    style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.20)' }}>
                    <p className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
                      Gross Bookings — what we use ✓
                    </p>
                    <p className="text-2xl font-bold"
                      style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-heading)' }}>~820K/day</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Completed payments at checkout. Stable signal. Measures purchase intent at the moment of conversion. Unaffected by cancellation policy changes.
                    </p>
                  </div>
                  <div className="rounded-2xl p-5 space-y-3"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', opacity: 0.7 }}>
                    <p className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      Net Bookings — wrong signal ✗
                    </p>
                    <p className="text-2xl font-bold"
                      style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-heading)' }}>Volatile</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      After cancellations. Fluctuates with refund policy changes, seasonal cancellation spikes, customer service improvements — ops problems, not demand.
                    </p>
                  </div>
                </div>
                <ArjunChip label="Why does gross vs net matter for this investigation?" prefillText="Why does gross vs net matter for this investigation?" />
              </div>
            </RevealBlock>

            {/* pp vs % */}
            <RevealBlock delay={0.1}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl p-5 space-y-2"
                    style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}>
                    <p className="text-xs uppercase tracking-widest"
                      style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>❌ Wrong</p>
                    <p className="text-2xl font-bold"
                      style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-heading)' }}>"CVR dropped 1.9%"</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Manager hears: small relative change. Doesn't act.
                    </p>
                  </div>
                  <div className="rounded-2xl p-5 space-y-2"
                    style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                    <p className="text-xs uppercase tracking-widest"
                      style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>✓ Correct</p>
                    <p className="text-2xl font-bold"
                      style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-heading)' }}>"CVR dropped 1.9pp"</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Manager hears: 15.8% relative decline = ₹4.2Cr. Escalates immediately.
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  12.0% → 10.1% is <strong style={{ color: 'var(--accent-red)' }}>−1.9 percentage points (pp)</strong>,
                  not −1.9%. The relative decline is <strong style={{ color: 'var(--accent-red)' }}>−15.8%</strong>.
                  Confusing these in a board presentation destroys credibility instantly.
                </p>
                <ArjunChip label="Real story: how this mistake plays out in a VP meeting" prefillText="Real story: how this mistake plays out in a VP meeting" />
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

      {/* ══ S2 — Data Sanity (user validates) ══ */}
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
                <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg,rgba(129,140,248,0.3),rgba(255,107,53,0.25))', border: '1px solid rgba(129,140,248,0.30)', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  A
                </div>
                <div className="flex-1 rounded-2xl rounded-tl-sm px-5 py-4"
                  style={{ background: 'var(--bg-surface)', border: '1px solid rgba(129,140,248,0.20)' }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2"
                    style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>Arjun · Staff Analyst</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    I'm giving you four data exhibits. For each one, tell me what it means for the
                    integrity of this investigation. Don't tell me the conclusion — tell me the
                    reasoning. Arjun will respond in the right panel.
                  </p>
                </div>
              </div>
            </RevealBlock>

            {/* Sanity checks — one at a time */}
            <RevealBlock delay={0.05}>
              <div className="space-y-5">
                {SANITY_CHECKS.map((check, i) => {
                  const isDone     = sanityFeedback[check.id] === 'ok'
                  const isActive   = i === sanityIdx && !allSanityDone
                  const isPast     = i < sanityIdx || allSanityDone
                  const isLocked   = i > sanityIdx && !allSanityDone

                  return (
                    <motion.div key={check.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: isLocked ? 0.3 : 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      className="rounded-2xl overflow-hidden"
                      style={{
                        border: isDone
                          ? '1px solid rgba(16,185,129,0.25)'
                          : isActive
                          ? '1px solid var(--border-default)'
                          : '1px solid var(--border-subtle)',
                      }}>
                      {/* Exhibit header */}
                      <div className="flex items-center justify-between px-5 py-3"
                        style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
                        <p className="text-xs font-semibold uppercase tracking-widest"
                          style={{ color: isDone ? 'var(--accent-green)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {check.exhibit}
                        </p>
                        {isDone && <span style={{ color: 'var(--accent-green)', fontSize: '14px' }}>✓</span>}
                      </div>

                      <div className="px-5 py-4 space-y-4" style={{ background: 'var(--bg-elevated)' }}>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                          {check.question}
                        </p>

                        {(isActive || (isPast && sanityAnswers[check.id])) && (
                          <div className="space-y-3">
                            {isPast && sanityAnswers[check.id] && (
                              <div className="px-4 py-3 rounded-xl"
                                style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                                <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Your answer:</p>
                                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{sanityAnswers[check.id]}</p>
                              </div>
                            )}
                            {isActive && (
                              <>
                                <textarea
                                  value={currentAnswer}
                                  onChange={e => setCurrentAnswer(e.target.value)}
                                  placeholder={check.hint}
                                  rows={2}
                                  className="w-full rounded-xl px-4 py-3 text-sm resize-none"
                                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', outline: 'none' }}
                                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.10)' }}
                                  onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }}
                                />
                                <button onClick={evaluateSanity}
                                  disabled={currentAnswer.trim().length < 15 || isEvaluating}
                                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
                                  style={{ background: 'var(--accent-secondary)', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                                  {isEvaluating && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                  {isEvaluating ? 'Evaluating...' : 'Submit analysis →'}
                                </button>
                              </>
                            )}
                          </div>
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
                      ✓ All four exhibits validated — data is trustworthy. Now look at the timeline.
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

      {/* ══ S3 — Timeline + Variance ══ */}
      <AnimatePresence>
        {sections.s3.visible && (
          <motion.section id="section-s3" key="s3"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8">
            <SectionHeader number={3} title="Timeline Review"
              subtitle="8 months of weekly data. Read the shape before anything else." />

            <RevealBlock>
              <WoWChart showBands={showBands} />
            </RevealBlock>

            <RevealBlock delay={0.05}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl p-4 space-y-2"
                    style={{ background: 'var(--bg-surface)', border: '1px solid rgba(248,113,113,0.20)' }}>
                    <p className="text-xs uppercase tracking-widest"
                      style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>This chart</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      Steady drop — −0.2pp every week for 8 weeks
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Not accelerating, not decelerating. Clockwork. Points to something
                      structural that compounds consistently week over week.
                    </p>
                  </div>
                  <div className="rounded-2xl p-4 space-y-2"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', opacity: 0.7 }}>
                    <p className="text-xs uppercase tracking-widest"
                      style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>If it were sudden</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      Single cliff — −30% overnight
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Would point to one event: payment outage, bad deploy, A/B test gone wrong.
                      Search logs, roll back last deploy.
                    </p>
                  </div>
                </div>
                <ArjunChip label="Why does the shape of the drop matter?" prefillText="Why does the shape of the drop matter?" />
              </div>
            </RevealBlock>

            {/* Variance question */}
            <RevealBlock delay={0.08}>
              <div className="rounded-2xl p-6 space-y-4"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  Before we proceed — is this drop statistically significant, or could it be within normal variance?
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Look at the chart above. The green stable period shows natural weekly fluctuation.
                  The red drop is consistent. But how do you know it's not just noise?
                </p>

                {!varianceDone && (
                  <div className="space-y-3">
                    <textarea
                      value={userVariance}
                      onChange={e => setUserVariance(e.target.value)}
                      placeholder="Is 10.1% statistically significant given the historical variation? How would you determine this?"
                      rows={2}
                      className="w-full rounded-xl px-4 py-3 text-sm resize-none"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', outline: 'none' }}
                      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.10)' }}
                      onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }}
                    />
                    <button onClick={evaluateVariance}
                      disabled={userVariance.trim().length < 15}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
                      style={{ background: 'var(--accent-secondary)', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                      Submit answer →
                    </button>
                  </div>
                )}

                {varianceDone && !showBands && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="space-y-3">
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Good. Now see it visually — the ±1σ bands show the range of normal fluctuation.
                    </p>
                    <button onClick={() => setShowBands(true)}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--accent-secondary)', color: 'var(--accent-secondary)', fontFamily: 'var(--font-heading)' }}>
                      Show variance bands →
                    </button>
                  </motion.div>
                )}

                {showBands && (
                  <div className="px-4 py-3 rounded-xl"
                    style={{ background: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.15)' }}>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      <strong style={{ color: 'var(--accent-secondary)' }}>Statistical verdict: </strong>
                      Baseline SD = ±0.30pp. Current drop = 1.9pp below mean = <strong style={{ color: 'var(--accent-red)' }}>6.3σ</strong>.
                      Anything beyond ±3σ is considered statistically extreme.
                      This drop is not noise. It is confirmed, significant, and structural.
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

      {/* ══ S4 — Seasonality ══ */}
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
                  <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg,rgba(129,140,248,0.3),rgba(255,107,53,0.25))', border: '1px solid rgba(129,140,248,0.30)', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                    A
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Travel is deeply seasonal. Before you call this a product problem and build hypotheses,
                    you need to rule out that this is simply an annual calendar pattern.
                    <strong style={{ color: 'var(--text-primary)' }}> How would you check this?</strong>
                  </p>
                </div>

                {(seasonStep === 'input' || seasonStep === 'softHint' || seasonStep === 'hardHint') && (
                  <div className="space-y-3">
                    <textarea
                      value={userSeasonApproach}
                      onChange={e => setUserSeasonApproach(e.target.value)}
                      placeholder="What data would you pull and what would you look for?"
                      rows={2}
                      className="w-full rounded-xl px-4 py-3 text-sm resize-none"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', outline: 'none' }}
                      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.10)' }}
                      onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }}
                    />
                    <button onClick={handleSeasonSubmit}
                      disabled={userSeasonApproach.trim().length < 10}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
                      style={{ background: 'var(--accent-secondary)', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                      Submit approach →
                    </button>
                  </div>
                )}

                {/* Soft hint — after 1 wrong attempt */}
                <AnimatePresence>
                  {seasonStep === 'softHint' && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="px-4 py-3 rounded-xl"
                      style={{ background: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.15)' }}>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <strong style={{ color: 'var(--accent-secondary)' }}>Arjun: </strong>
                        Think about what historical data would let you isolate whether this time of year
                        is inherently lower. What comparison would separate "calendar effect" from "product problem"?
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hard hint — after 2 wrong attempts */}
                <AnimatePresence>
                  {seasonStep === 'hardHint' && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 px-4 py-4 rounded-xl"
                      style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.20)' }}>
                      <span style={{ fontSize: '16px' }}>💡</span>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold" style={{ color: 'var(--accent-amber)' }}>Hint</p>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          What if you compared the same calendar period — same months — one year apart?
                          If the same period last year also showed a drop, that's seasonal.
                          If last year was flat in the same period, the drop is structural.
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

            {/* YoY Chart */}
            <AnimatePresence>
              {(seasonStep === 'chart' || seasonStep === 'insight' || seasonStep === 'done') && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-5">
                  <YoYChart />

                  {seasonStep === 'chart' && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl p-5 space-y-3"
                      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                        Two distinct patterns in that chart. What do you conclude?
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Identify both patterns — what's seasonal and what isn't — and explain how you know.
                      </p>
                      <textarea
                        value={userInsight}
                        onChange={e => setUserInsight(e.target.value)}
                        placeholder="Write your full analysis — identify both patterns and your conclusion."
                        rows={3}
                        className="w-full rounded-xl px-4 py-3 text-sm resize-none"
                        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', outline: 'none' }}
                        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.10)' }}
                        onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }}
                      />
                      <button onClick={handleInsightSubmit}
                        disabled={userInsight.trim().length < 20 || isEvalInsight}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
                        style={{ background: 'var(--accent-secondary)', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                        {isEvalInsight && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                        {isEvalInsight ? 'Arjun is reading...' : 'Submit insight →'}
                      </button>
                    </motion.div>
                  )}

                  <AnimatePresence>
                    {seasonStep === 'done' && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="space-y-5">
                        <div className="px-4 py-4 rounded-xl"
                          style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}>
                          <p className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>
                            ✓ Seasonality ruled out — Arjun's full response is in the right panel.
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
                              Phase 1 complete — revisiting content
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}
