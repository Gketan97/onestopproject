import { useState, useEffect }     from 'react'
import { useNavigate, useParams }  from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useProgressStore }        from '@/store/progressStore'
import { useArjun }                from '@/hooks/useArjun'
import { RevealBlock }             from '@/components/phases/RevealBlock'
import { MetricCard }              from '@/components/phases/MetricCard'
import { MiniBarChart }            from '@/components/phases/MiniBarChart'
import { ArjunChip }               from '@/components/phases/ArjunChip'
import { ContinueButton }          from '@/components/phases/ContinueButton'
import { SectionHeader }           from '@/components/phases/SectionHeader'
import { WoWChart }                from '@/components/phases/WoWChart'
import { YoYChart }                from '@/components/phases/YoYChart'
import { IncidentHero }            from '@/components/visuals/IncidentHero'
import { ProtocolMap }             from '@/components/visuals/ProtocolMap'
import { FormulaBuilder }          from '@/components/visuals/FormulaBuilder'
import { ArjunAvatar }             from '@/components/visuals/ArjunAvatar'

type SectionKey = 's0' | 's1' | 's2' | 's3' | 's4'
const SECTION_ORDER: SectionKey[] = ['s0', 's1', 's2', 's3', 's4']
interface SectionState { visible: boolean; completed: boolean }
type Sections = Record<SectionKey, SectionState>

const INITIAL_SECTIONS: Sections = {
  s0: { visible: true,  completed: false },
  s1: { visible: false, completed: false },
  s2: { visible: false, completed: false },
  s3: { visible: false, completed: false },
  s4: { visible: false, completed: false },
}

type SeasonStep = 'input' | 'softHint' | 'hardHint' | 'chart' | 'done'

export default function Phase1() {
  const { slug }       = useParams<{ slug: string }>()
  const navigate        = useNavigate()
  const { completePhase, isCompleted } = useProgressStore()
  const { open: openArjun, sendMessage } = useArjun()
  const phaseCompleted  = isCompleted('phase-1')

  const [sections, setSections]           = useState<Sections>(INITIAL_SECTIONS)
  const [showBands, setShowBands]         = useState(false)
  const [userVariance, setUserVariance]   = useState('')
  const [varianceDone, setVarianceDone]   = useState(false)
  const [sanityAnswers, setSanityAnswers] = useState<Record<string, string>>({})
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [sanityIdx, setSanityIdx]         = useState(0)
  const [allSanityDone, setAllSanityDone] = useState(false)
  const [isEvaluating, setIsEvaluating]   = useState(false)
  const [seasonStep, setSeasonStep]       = useState<SeasonStep>('input')
  const [seasonAttempts, setSeasonAttempts] = useState(0)
  const [userSeasonApproach, setUserSeasonApproach] = useState('')
  const [userInsight, setUserInsight]     = useState('')
  const [insightAttempts, setInsightAttempts] = useState(0)
  const [isEvalInsight, setIsEvalInsight] = useState(false)

  const SANITY_CHECKS = [
    { id: 'bookings', exhibit: 'Exhibit A — Absolute Bookings',
      question: 'Bookings averaged ~820K/day before and ~819K/day after. What does this tell you?',
      hint: 'Think about the numerator of the ratio when it stays flat while the denominator grows.' },
    { id: 'dau', exhibit: 'Exhibit B — Absolute DAU',
      question: 'DAU grew from 10.0M to 11.5M/day (+15%). How do you verify this growth is real?',
      hint: 'What source would you cross-check against to verify the DAU number?' },
    { id: 'pipeline', exhibit: 'Exhibit C — Analytics vs Payment Gateway',
      question: 'Analytics shows 819,240 bookings on Day 45. Payment gateway shows 821,180. Gap = 0.24%. Is this a problem?',
      hint: 'What level of discrepancy is acceptable vs alarming in analytics pipelines?' },
    { id: 'incidents', exhibit: 'Exhibit D — Data Engineering Incident Log',
      question: 'The log shows 0 ETL failures and 0 schema changes in 90 days. What does this confirm?',
      hint: 'What could cause a metric to look like it dropped when it actually did not?' },
  ]

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
    const feedbackTexts: Record<string, {ok:string;push:string}> = {
      bookings: {
        ok: 'Correct. Flat absolute bookings means the numerator did not crash. The ratio fell because DAU grew +15% while bookings stayed flat. This is a rate problem, not a volume collapse.',
        push: 'Look at the numerator of the ratio. If bookings did not crash, what drove the ratio down? Think numerator vs denominator.',
      },
      dau: {
        ok: 'Exactly right. Cross-check DAU against session logs or backend auth events — sources immune to analytics definition changes. Both sources show 11.5M, so the growth is real.',
        push: 'Think about what source is immune to analytics definition changes. If someone changed the DAU query accidentally, what external source would still show the truth?',
      },
      pipeline: {
        ok: 'Correct. A 0.24% gap is within acceptable attribution delay noise. A problem would be 5%+. This pipeline is clean.',
        push: 'Think about scale. 1,940 on 820,000 bookings — what percentage is that? Is that alarming or within normal noise?',
      },
      incidents: {
        ok: 'Exactly. Zero incidents means no ETL failure manufactured a fake drop. The pipeline is trustworthy. We can now investigate the metric itself.',
        push: 'Think about what an ETL failure or schema change could do to a metric. If the pipeline was broken, how would that look vs what we see?',
      },
    }
    const feedback = feedbackTexts[check.id]
    if (isGood) {
      openArjun('phase-1')
      setTimeout(() => sendMessage(feedback.ok), 200)
      setSanityAnswers(prev => ({ ...prev, [check.id]: currentAnswer }))
      const nextIdx = sanityIdx + 1
      if (nextIdx >= SANITY_CHECKS.length) {
        setAllSanityDone(true)
      } else {
        setSanityIdx(nextIdx)
        setCurrentAnswer('')
      }
    } else {
      openArjun('phase-1')
      setTimeout(() => sendMessage(feedback.push), 200)
      setSanityAnswers(prev => ({ ...prev, [check.id]: currentAnswer }))
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

  function evaluateVariance() {
    const lower = userVariance.toLowerCase()
    const isGood = lower.includes('significant') || lower.includes('not noise') ||
      lower.includes('sigma') || lower.includes('sd') || lower.includes('standard') ||
      lower.includes('outside') || lower.includes('6') || lower.includes('5') || lower.includes('beyond')
    openArjun('phase-1')
    const msg = isGood
      ? 'Correct. The drop is 1.9pp below baseline mean of 12.05%. Baseline SD is 0.30pp. That puts the current value at 6.3 standard deviations below mean. Anything beyond 3 sigma is statistically extreme. This is not noise.'
      : 'Look at where 10.1% sits relative to the variance band. The band shows normal fluctuation range. If current value is far outside — statistically significant. How many SDs below mean is 10.1%?'
    setTimeout(() => sendMessage(msg), 200)
    if (isGood) setVarianceDone(true)
  }

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
      lower.includes('jan') || lower.includes('feb') || lower.includes('2024') || lower.includes('flat')
    const hasSeasonal = lower.includes('oct') || lower.includes('nov') ||
      lower.includes('seasonal') || lower.includes('monsoon') || lower.includes('recover') || lower.includes('festival')
    const hasBoth = hasStructural && hasSeasonal
    const attempts = insightAttempts + 1
    setInsightAttempts(attempts)
    openArjun('phase-1')
    let msg = ''
    if (hasBoth) {
      msg = 'Perfect analysis. Two patterns: (1) Oct-Nov 2024 shows a seasonal dip that recovered by December — post-monsoon travel lull. (2) Jan-Apr 2025 shows a steady structural drop — Jan 2024 was flat at 12%, same calendar window, completely different behaviour. Seasonality is definitively ruled out. The drop is structural.'
      setSeasonStep('done')
    } else if (!hasStructural && attempts < 2) {
      msg = 'You identified the seasonal pattern correctly. Now look at the Jan-Feb window specifically. In 2024, what was B/DAU in January? Compare to 2025 January. What does the gap tell you?'
    } else if (!hasSeasonal && attempts < 2) {
      msg = 'You correctly identified the Jan-Feb structural drop. But look at Oct-Nov in the 2024 line — there is a visible dip there too. What caused it? Why did it recover in December? Not all dips are structural.'
    } else {
      msg = 'Look for two things: (1) Oct-Nov 2024 dip + December recovery = seasonal. (2) Jan-Feb 2025 drop vs Jan-Feb 2024 flat = structural. Your insight needs to address both patterns.'
      setSeasonStep('done')
    }
    setTimeout(() => sendMessage(msg), 200)
    setIsEvalInsight(false)
  }

  function handlePhaseComplete() {
    completePhase('phase-1')
    navigate(`/case-study/${slug}/phase-2`)
  }

  return (
    <div className="space-y-16 pb-20">

      {/* S0 — Brief + Protocol */}
      <AnimatePresence>
        {sections.s0.visible && (
          <motion.section id="section-s0" key="s0"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6">

            <RevealBlock>
              <IncidentHero />
            </RevealBlock>

            <RevealBlock delay={0.1}>
              <div className="flex gap-4">
                <ArjunAvatar size={44} pulse />
                <div className="flex-1 rounded-2xl rounded-tl-sm px-5 py-4 space-y-2 text-sm leading-relaxed"
                  style={{ background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.20)', color: 'var(--text-secondary)' }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1.5"
                    style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>
                    Arjun · Staff Analyst
                  </p>
                  <p>You have received the brief. Every analyst's first instinct is to open a dashboard immediately. <strong style={{ color: 'var(--accent-red)' }}>That instinct kills investigations.</strong></p>
                  <p>Before you touch any data, run this 4-step protocol. Each step prevents you from chasing the wrong cause for weeks.</p>
                </div>
              </div>
            </RevealBlock>

            <RevealBlock delay={0.15}>
              <ProtocolMap />
            </RevealBlock>

            {!sections.s0.completed && (
              <RevealBlock>
                <ContinueButton label="Understood — begin Definition Clarity" onClick={() => revealNext('s0')} />
              </RevealBlock>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* S1 — Definitions */}
      <AnimatePresence>
        {sections.s1.visible && (
          <motion.section id="section-s1" key="s1"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8">
            <SectionHeader number={1} title="Definition Clarity" subtitle="Lock these down before you touch a single number." />

            <RevealBlock>
              <div className="space-y-4">
                <FormulaBuilder />
                <div className="flex flex-wrap gap-2">
                  <ArjunChip label="Why a ratio instead of absolute bookings?" prefillText="Why use Bookings/DAU ratio instead of absolute bookings?" />
                </div>
              </div>
            </RevealBlock>

            <RevealBlock delay={0.05}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl p-5 space-y-2" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}>
                    <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>Wrong</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-heading)' }}>"CVR dropped 1.9%"</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Manager hears: small rounding error</p>
                  </div>
                  <div className="rounded-2xl p-5 space-y-2" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                    <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>Correct</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-heading)' }}>"CVR dropped 1.9pp"</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Manager hears: 15.8% relative decline = Rs 4.2Cr</p>
                  </div>
                </div>
                <MiniBarChart title="Who counts as a DAU at MMT" unit="" maxValue={100}
                  data={[
                    { label: 'Logged-in users (counted)',    value: 65, color: 'var(--accent-green)' },
                    { label: 'Anonymous visitors (excluded)', value: 28, color: 'var(--accent-red)'   },
                    { label: 'Bot traffic (excluded)',        value: 7,  color: 'var(--text-muted)'   },
                  ]} />
                <div className="flex flex-wrap gap-2">
                  <ArjunChip label="What if the DAU definition changed mid-period?" prefillText="What if the DAU definition changed mid-investigation?" />
                  <ArjunChip label="Why gross bookings, not net?" prefillText="Why do we use gross bookings instead of net bookings?" />
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

      {/* S2 — Data Sanity */}
      <AnimatePresence>
        {sections.s2.visible && (
          <motion.section id="section-s2" key="s2"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8">
            <SectionHeader number={2} title="Data Sanity" subtitle="Four exhibits. You decide if the data is trustworthy." />

            <RevealBlock>
              <div className="flex gap-4">
                <ArjunAvatar size={44} />
                <div className="flex-1 rounded-2xl rounded-tl-sm px-5 py-4 text-sm"
                  style={{ background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.20)', color: 'var(--text-secondary)' }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1.5"
                    style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>Arjun</p>
                  Four exhibits. For each one, tell me what it means for the integrity of this investigation. Arjun responds in the panel.
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
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: isLocked ? 0.3 : 1, y: 0 }}
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
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>{check.question}</p>
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
                      All four exhibits validated — data is trustworthy. Now look at the timeline.
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

      {/* S3 — Timeline + Variance */}
      <AnimatePresence>
        {sections.s3.visible && (
          <motion.section id="section-s3" key="s3"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8">
            <SectionHeader number={3} title="Timeline Review" subtitle="8 months of weekly data. Read the shape before anything else." />

            <RevealBlock>
              <WoWChart showBands={showBands} />
            </RevealBlock>

            <RevealBlock delay={0.05}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl p-4 space-y-2"
                    style={{ background: 'var(--bg-surface)', border: '1px solid rgba(248,113,113,0.20)' }}>
                    <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>This chart</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      Steady drop — minus 0.2pp every week for 8 weeks
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Not accelerating, not decelerating. Points to something structural compounding weekly.
                    </p>
                  </div>
                  <div className="rounded-2xl p-4 space-y-2"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', opacity: 0.7 }}>
                    <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>If it were sudden</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>Single cliff overnight</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Would point to one event: outage, bad deploy, A/B test gone wrong.</p>
                  </div>
                </div>
                <ArjunChip label="Why does the shape of the drop matter?" prefillText="Why does the shape of a metric drop matter for investigation?" />
              </div>
            </RevealBlock>

            <RevealBlock delay={0.08}>
              <div className="rounded-2xl p-6 space-y-4"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
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
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Good. Now see it visually — the variance bands show the range of normal fluctuation.</p>
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
                      Baseline SD = 0.30pp. Current drop = 1.9pp below mean = <strong style={{ color: 'var(--accent-red)' }}>6.3 sigma</strong>. Anything beyond 3 sigma is statistically extreme. This is confirmed, significant, and structural.
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

      {/* S4 — Seasonality */}
      <AnimatePresence>
        {sections.s4.visible && (
          <motion.section id="section-s4" key="s4"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6">
            <SectionHeader number={4} title="Seasonality Check" subtitle="One final check before hypothesis building." />

            <RevealBlock>
              <div className="rounded-2xl p-6 space-y-5"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex gap-4">
                  <ArjunAvatar size={44} />
                  <p className="flex-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Travel is deeply seasonal. Before you call this a product problem and build hypotheses, rule out that this is simply an annual calendar pattern. <strong style={{ color: 'var(--text-primary)' }}>How would you check this?</strong>
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
                      <span style={{ fontSize: '16px' }}>Hint</span>
                      <div className="space-y-2">
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          Compare the same calendar period one year apart. If the same period last year also dipped, it is seasonal. If last year was flat in the same period, the drop is structural.
                        </p>
                        <button onClick={() => setSeasonStep('chart')}
                          className="text-sm font-semibold underline underline-offset-2"
                          style={{ color: 'var(--accent-amber)' }}>
                          Show me the year-over-year data
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
                  <ArjunChip label="Why is YoY the right method here?" prefillText="Why is year-over-year comparison the right method for checking seasonality?" />

                  {seasonStep === 'chart' && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl p-5 space-y-3"
                      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                        Two distinct patterns visible. What do you conclude?
                      </p>
                      <textarea value={userInsight} onChange={e => setUserInsight(e.target.value)}
                        placeholder="Identify both patterns and explain your conclusion."
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
                          Seasonality ruled out — Arjun full response in the right panel.
                        </p>
                      </div>
                      {!phaseCompleted ? (
                        <motion.button onClick={handlePhaseComplete}
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                          className="w-full py-4 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
                          style={{ background: 'var(--accent-primary)', color: '#fff', fontFamily: 'var(--font-heading)', boxShadow: '0 0 24px rgba(255,107,53,0.18)' }}>
                          Seasonality ruled out — Begin Hypothesis Building
                        </motion.button>
                      ) : (
                        <div className="flex items-center gap-3 px-5 py-4 rounded-xl"
                          style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}>
                          <span style={{ color: 'var(--accent-green)' }}>✓</span>
                          <p className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>Phase 1 complete</p>
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
    </div>
  )
}
