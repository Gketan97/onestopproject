import { useState, useEffect }     from 'react'
import { useNavigate, useParams }  from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Smartphone } from 'lucide-react'
import { useProgressStore }        from '@/store/progressStore'
import { ContinueButton }          from '@/components/phases/ContinueButton'
import { RevealBlock }             from '@/components/phases/RevealBlock'
import { ArjunAvatar }             from '@/components/visuals/ArjunAvatar'
import { SegmentDonut }            from '@/components/visuals/SegmentDonut'
import { CommissionVisual }        from '@/components/visuals/CommissionVisual'
import { MetricHierarchy }         from '@/components/visuals/MetricHierarchy'

const CANVAS_CARDS = [
  {
    id: 'model', emoji: '🏦', title: 'Business Model', tagline: 'How MMT makes money',
    color: '#FF6B35', glow: 'rgba(255,107,53,0.08)',
    points: [
      'Earns 10–15% commission on every completed hotel booking. Pure performance model.',
      'Revenue = Bookings × AOV × Commission %. If any one drops, revenue drops.',
      'No booking = no revenue — making Bookings/DAU the single most critical health metric.',
    ],
  },
  {
    id: 'users', emoji: '👥', title: 'User Segments', tagline: 'Who books on MMT',
    color: '#818CF8', glow: 'rgba(129,140,248,0.08)',
    points: [
      'A 13% CVR drop in leisure (65% of users) has 3× the revenue impact vs last-minute segment.',
      'Business travelers book within 7 days, less price-sensitive, and represent stable demand.',
      'Identifying which segment drove the drop is the first segmentation question in Phase 3.',
    ],
  },
  {
    id: 'supply', emoji: '🏨', title: 'Supply Side', tagline: 'What users see and book',
    color: '#10B981', glow: 'rgba(16,185,129,0.08)',
    points: [
      'MMT lists 50,000+ hotels across India — 5-star chains to Tier-2 city homestays.',
      'Supply quality matters: if high-converting budget hotels go out of stock, CVR falls with stable traffic.',
      'Photo quality, review count, and pricing freshness all affect the Detail→Checkout conversion rate.',
    ],
  },
  {
    id: 'metrics', emoji: '📊', title: 'Key Metrics', tagline: 'What the team tracks daily',
    color: '#FF6B35', glow: 'rgba(255,107,53,0.08)',
    points: [
      'GMV: total booking value before cancellations. Used for investor reporting and top-line tracking.',
      'CVR (Bookings ÷ Sessions): measures product quality and product-market fit. Drops here are always serious.',
      'DAU/MAU Ratio: stickiness. A falling ratio means users return less — engagement decay, not just conversion.',
    ],
  },
  {
    id: 'moat', emoji: '🛡️', title: 'Competitive Moat', tagline: 'Why users choose MMT',
    color: '#818CF8', glow: 'rgba(129,140,248,0.08)',
    points: [
      'Largest hotel inventory in India — users trust they\'ll always find options, even Tier-2 cities.',
      'MMT wallet and loyalty points create switching costs. Rewards actively prevent churning.',
      'Price sensitivity is high. If a competitor consistently offers 5% lower, the moat erodes fast.',
    ],
  },
]

const CARD_VISUALS: Record<string, React.ReactNode> = {
  model:   <CommissionVisual />,
  users:   <SegmentDonut />,
  metrics: <MetricHierarchy />,
}

const APP_LENSES = [
  { id: 'funnel',   icon: '🔍', label: 'Funnel: Count every step',
    placeholder: 'How many screens from search to checkout? What happens at each one?' },
  { id: 'friction', icon: '⚡', label: 'Friction: Where did you hesitate?',
    placeholder: 'Was anything slow, confusing, or that made you pause? Exact location?' },
  { id: 'trust',    icon: '🤝', label: 'Trust: What built or eroded confidence?',
    placeholder: 'What made you feel ready to book? What created doubt or uncertainty?' },
]

const REPLIES: Record<string, string> = {
  funnel:   'Good — count them as decision points: Search → List → Detail → Checkout → Payment. That\'s 5 stages. Each is a potential drop-off point you\'ll reconstruct in Phase 5.',
  friction: 'Precision matters. Where exactly? Search load? Listing page? Checkout latency? The location tells you which funnel stage to investigate first. Remember this feeling when you see Phase 5 data.',
  trust:    'Trust signals are real conversion drivers — reviews, cancellation policies, price guarantees. All affect Detail→Checkout conversion. File this for your hypothesis list in Phase 2.',
}

const SLACK_LINES = [
  { text: 'Team — flagging this as P0.', bold: true },
  { text: 'We\'ve seen a sustained 18% drop in Bookings/DAU over 60 days. Started around day −62 and hasn\'t recovered.' },
  { text: 'GMV impact is ₹4.2Cr already. If this continues through festival season, we\'re looking at ₹30Cr+ miss for Q.' },
  { text: 'I need root cause analysis — not hypotheses, not guesses. Data-backed. Board review in 3 weeks.' },
]

type Section = 'canvas' | 'app' | 'brief' | 'hypothesis'

function LensCard({
  lens, isLocked, isDone, onDone,
}: {
  lens: typeof APP_LENSES[0]
  isLocked: boolean
  isDone: boolean
  onDone: () => void
}) {
  const [val, setVal]     = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (val.trim().length < 10 || loading) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    setReply(REPLIES[lens.id] ?? 'Good observation. Keep it in mind as we go deeper.')
    setLoading(false)
    onDone()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: isLocked ? 0.3 : 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl overflow-hidden"
      style={{ border: isDone ? '1px solid rgba(16,185,129,0.25)' : '1px solid var(--border-subtle)' }}
    >
      <div className="flex items-center gap-3 px-5 py-3"
        style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
        <span style={{ fontSize: '18px' }}>{lens.icon}</span>
        <p className="text-sm font-semibold flex-1"
          style={{ color: isDone ? 'var(--accent-green)' : 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
          {lens.label}
        </p>
        {isDone && <span style={{ color: 'var(--accent-green)' }}>✓</span>}
      </div>
      <div className="px-5 py-4 space-y-3" style={{ background: 'var(--bg-elevated)' }}>
        {!isDone && (
          <>
            <textarea value={val} onChange={e => setVal(e.target.value)}
              placeholder={lens.placeholder} disabled={isLocked} rows={2}
              className="w-full rounded-xl px-4 py-3 text-sm resize-none"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--font-body)' }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.08)' }}
              onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }} />
            <button onClick={submit}
              disabled={isLocked || loading || val.trim().length < 10}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
              style={{ background: 'var(--accent-secondary)', color: '#fff', fontFamily: 'var(--font-heading)' }}>
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Arjun is reading...' : 'Submit observation →'}
            </button>
          </>
        )}
        {isDone && val && (
          <div className="px-4 py-3 rounded-xl"
            style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Your observation:</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{val}</p>
          </div>
        )}
        <AnimatePresence>
          {reply && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className="flex gap-3">
              <ArjunAvatar size={28} />
              <p className="flex-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{reply}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function Phase0() {
  const { slug }   = useParams<{ slug: string }>()
  const navigate    = useNavigate()
  const { completePhase, isCompleted } = useProgressStore()
  const completed   = isCompleted('phase-0')

  const [openCard, setOpenCard]   = useState<string | null>(null)
  const [section, setSection]     = useState<Section>('canvas')
  const [doneIds, setDoneIds]     = useState<string[]>([])
  const [hyp, setHyp]             = useState('')
  const [hypSaved, setHypSaved]   = useState(false)

  const allLensesDone = APP_LENSES.every(l => doneIds.includes(l.id))

  useEffect(() => {
    if (completed) {
      setSection('hypothesis')
      setDoneIds(APP_LENSES.map(l => l.id))
      setHypSaved(true)
    }
  }, [completed])

  function markDone(id: string) {
    const next = [...doneIds.filter(d => d !== id), id]
    setDoneIds(next)
    if (APP_LENSES.every(l => next.includes(l.id))) {
      setTimeout(() => setSection('brief'), 700)
    }
  }

  return (
    <div className="space-y-12 pb-20">

      {/* ══ CANVAS ══ */}
      <section id="business-canvas" className="space-y-6">
        <RevealBlock>
          <div className="flex gap-4">
            <ArjunAvatar size={44} pulse />
            <div className="flex-1 rounded-2xl rounded-tl-sm px-5 py-4 space-y-2 text-sm leading-relaxed"
              style={{ background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.20)', color: 'var(--text-secondary)' }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1.5"
                style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>Arjun · Staff Analyst</p>
              <p>Before you look at a single number — understand the business. A great analyst knows the company model as well as any PM.</p>
              <p>Expand each card. The visuals inside are the important part.</p>
            </div>
          </div>
        </RevealBlock>

        <div className="space-y-3">
          {CANVAS_CARDS.map((card, ci) => {
            const isOpen = openCard === card.id
            return (
              <motion.div key={card.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ci * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
                <button
                  onClick={() => setOpenCard(isOpen ? null : card.id)}
                  className="w-full flex items-center gap-4 p-4 text-left transition-all duration-200 hover:brightness-110"
                  style={{
                    background:   isOpen ? card.glow : 'var(--bg-surface)',
                    border:       `1px solid ${isOpen ? card.color + '30' : 'var(--border-subtle)'}`,
                    borderRadius: isOpen ? '16px 16px 0 0' : '16px',
                  }}
                  aria-expanded={isOpen}
                >
                  <div className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-xl"
                    style={{ background: card.glow, border: `1px solid ${card.color}22` }}>
                    {card.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold"
                      style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>{card.title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{card.tagline}</p>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
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
                      <div className="px-5 pb-5 pt-4 space-y-4">
                        {CARD_VISUALS[card.id] && (
                          <div className="rounded-xl p-4"
                            style={{ background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            {CARD_VISUALS[card.id]}
                          </div>
                        )}
                        <div className="space-y-2.5">
                          {card.points.map((pt, j) => (
                            <motion.div key={j}
                              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: j * 0.08, duration: 0.35 }}
                              className="flex items-start gap-3">
                              <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                                style={{ background: card.color }} />
                              <p className="text-sm leading-relaxed"
                                style={{ color: 'var(--text-secondary)' }}>{pt}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {section === 'canvas' && !completed && (
          <RevealBlock delay={0.3}>
            <ContinueButton
              label="Business understood — now experience it"
              onClick={() => setSection('app')}
            />
          </RevealBlock>
        )}
      </section>

      {/* ══ APP EXPLORATION ══ */}
      <AnimatePresence>
        {(section !== 'canvas' || completed) && (
          <motion.section id="app-exploration" key="app"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,107,53,0.10)', border: '1px solid rgba(255,107,53,0.20)' }}>
                <Smartphone size={16} style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Section 02</p>
                <h2 className="text-xl font-bold"
                  style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  Experience the Product
                </h2>
              </div>
            </div>

            <div className="flex gap-4">
              <ArjunAvatar size={44} pulse />
              <div className="flex-1 rounded-2xl rounded-tl-sm px-5 py-4 space-y-2 text-sm leading-relaxed"
                style={{ background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.20)', color: 'var(--text-secondary)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1.5"
                  style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>Arjun · Staff Analyst</p>
                <p>Every analyst I respect has used the product before investigating it.</p>
                <p><strong style={{ color: 'var(--text-primary)' }}>Open MakeMyTrip on your phone right now.</strong>{' '}
                  Search for any hotel this weekend. Browse to a hotel detail page. Try to reach the checkout screen. Then come back.</p>
              </div>
            </div>

            {/* Flow instruction */}
            <div className="rounded-2xl p-5"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
              <div className="flex items-start gap-4">
                <span style={{ fontSize: '28px', flexShrink: 0 }}>📱</span>
                <div className="space-y-3 flex-1">
                  <p className="text-sm font-semibold"
                    style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>The flow to trace</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {['Search', 'Browse', 'Hotel Detail', 'Checkout'].map((step, i) => (
                      <div key={step} className="flex items-center gap-2">
                        <span className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                          style={{
                            background: i === 3 ? 'rgba(248,113,113,0.12)' : 'var(--bg-elevated)',
                            border:     i === 3 ? '1px solid rgba(248,113,113,0.25)' : '1px solid var(--border-subtle)',
                            color:      i === 3 ? 'var(--accent-red)' : 'var(--text-secondary)',
                            fontFamily: 'var(--font-mono)',
                          }}>
                          {step}
                        </span>
                        {i < 3 && <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>→</span>}
                      </div>
                    ))}
                    <span className="text-xs px-2 py-1 rounded-full"
                      style={{ background: 'rgba(248,113,113,0.10)', color: 'var(--accent-red)', border: '1px solid rgba(248,113,113,0.20)', fontFamily: 'var(--font-mono)' }}>
                      stop here
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    No payment needed. Stop when you see the checkout summary screen.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {APP_LENSES.map((lens, i) => (
                <LensCard key={lens.id} lens={lens}
                  isLocked={i > 0 && !doneIds.includes(APP_LENSES[i-1].id)}
                  isDone={doneIds.includes(lens.id)}
                  onDone={() => markDone(lens.id)} />
              ))}
            </div>

            {allLensesDone && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 rounded-xl"
                style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}>
                <p className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>
                  ✓ All observations recorded — saved to your investigation brief
                </p>
              </motion.div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ══ BRIEF ══ */}
      <AnimatePresence>
        {(section === 'brief' || section === 'hypothesis' || completed) && (
          <motion.section id="growth-brief" key="brief"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            <div>
              <p className="text-xs uppercase tracking-widest mb-1"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Section 03</p>
              <h2 className="text-xl font-bold"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>The Brief</h2>
            </div>

            <div className="flex gap-4">
              <ArjunAvatar size={44} />
              <div className="flex-1 rounded-2xl rounded-tl-sm px-5 py-3 text-sm"
                style={{ background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.20)', color: 'var(--text-secondary)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1.5"
                  style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>Arjun · Staff Analyst</p>
                You've used the product. Now read the brief that just landed in your Slack.
              </div>
            </div>

            {/* Styled Slack UI */}
            <div className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}>
              <div className="flex items-center gap-3 px-5 py-3"
                style={{ background: '#1A1A2E', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                  style={{ background: 'rgba(129,140,248,0.25)', color: 'var(--accent-secondary)' }}>#</div>
                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-mono)' }}>
                  analytics-escalation
                </span>
                <div className="ml-auto flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#10B981' }} />
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>online</span>
                </div>
              </div>

              <div className="px-5 py-5 space-y-4" style={{ background: '#141428' }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg,#FF6B35,#818CF8)', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                    PM
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-heading)' }}>Priya Mehta</span>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.30)', fontFamily: 'var(--font-mono)' }}>9:14 AM</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.30)', fontSize: '11px' }}>Head of Growth</p>
                  </div>
                </div>

                <div className="space-y-3" style={{ paddingLeft: '52px' }}>
                  {SLACK_LINES.map((line, lineIdx) => (
                    <motion.p key={lineIdx}
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + lineIdx * 0.12, duration: 0.4 }}
                      className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.70)' }}>
                      {line.bold
                        ? <strong style={{ color: 'rgba(255,255,255,0.95)' }}>{line.text}</strong>
                        : line.text}
                    </motion.p>
                  ))}

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mt-1"
                    style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.30)' }}>
                    <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: '#F87171' }}
                      animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    <span className="text-xs font-bold" style={{ color: '#F87171', fontFamily: 'var(--font-mono)' }}>
                      P0 — Board visibility
                    </span>
                  </motion.div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
                    className="flex gap-2 flex-wrap">
                    {['🔥 4', '👀 7', '💯 2', '🚨 5'].map(r => (
                      <span key={r} className="text-xs px-2 py-1 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.55)', cursor: 'default' }}>
                        {r}
                      </span>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>

            {section === 'brief' && !completed && (
              <ContinueButton
                label="Brief received — share my first instinct"
                onClick={() => setSection('hypothesis')}
              />
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ══ HYPOTHESIS ══ */}
      <AnimatePresence>
        {(section === 'hypothesis' || completed) && (
          <motion.section id="first-hypothesis" key="hyp"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            <div className="flex gap-4">
              <ArjunAvatar size={44} pulse />
              <div className="flex-1 rounded-2xl rounded-tl-sm px-5 py-4 space-y-2 text-sm leading-relaxed"
                style={{ background: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.22)', color: 'var(--text-secondary)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1.5"
                  style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>Arjun · Staff Analyst</p>
                <p>You've read the business context. Used the product. Read the brief.</p>
                <p><strong style={{ color: 'var(--text-primary)' }}>Before you look at any data — what's your gut instinct?</strong>{' '}
                  One sentence. No wrong answers. You'll revisit this at Phase 7 to see how close you were.</p>
              </div>
            </div>

            {!hypSaved ? (
              <div className="space-y-3">
                <textarea value={hyp} onChange={e => setHyp(e.target.value)}
                  placeholder="My initial hypothesis is..."
                  rows={2} className="w-full rounded-xl px-4 py-3 text-sm resize-none"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--font-body)' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.08)' }}
                  onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }} />
                <button onClick={() => setHypSaved(true)}
                  disabled={hyp.trim().length < 10}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
                  style={{ background: 'var(--accent-primary)', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                  Save to brief →
                </button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="px-4 py-3 rounded-xl"
                  style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Saved — Initial Hypothesis:</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{hyp || 'Hypothesis recorded.'}</p>
                </div>

                <div className="flex gap-4">
                  <ArjunAvatar size={44} />
                  <div className="flex-1 rounded-2xl rounded-tl-sm px-5 py-4 text-sm"
                    style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.20)', color: 'var(--text-secondary)' }}>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1.5"
                      style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>Arjun · Staff Analyst</p>
                    Good. Hold that thought. You'll revisit it at Phase 7 to see how close your gut was.
                    Now let's do the work that either proves or disproves it.
                  </div>
                </div>

                {!completed && (
                  <motion.button
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => { completePhase('phase-0'); navigate(`/case-study/${slug}/phase-1`) }}
                    className="w-full py-4 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98] glow-pulse"
                    style={{ background: 'var(--accent-primary)', color: '#fff', fontFamily: 'var(--font-heading)', boxShadow: '0 0 32px rgba(255,107,53,0.20)' }}>
                    Begin Investigation — Phase 1: Understanding the Problem →
                  </motion.button>
                )}
                {completed && (
                  <div className="flex items-center gap-3 px-5 py-4 rounded-xl"
                    style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}>
                    <span style={{ color: 'var(--accent-green)' }}>✓</span>
                    <p className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>Phase 0 complete — revisiting</p>
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
