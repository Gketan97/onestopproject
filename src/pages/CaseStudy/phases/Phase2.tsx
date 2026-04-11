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
