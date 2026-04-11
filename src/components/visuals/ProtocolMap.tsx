import { motion } from 'framer-motion'

const STEPS = [
  { n: '01', emoji: '📐', label: 'Definition\nClarity',  why: 'Lock what\nyou\'re measuring', color: '#FF6B35' },
  { n: '02', emoji: '🔬', label: 'Data\nSanity',         why: 'Verify the\ndata is real',     color: '#818CF8' },
  { n: '03', emoji: '📈', label: 'Timeline\nReview',     why: 'Read the shape\nof the drop',   color: '#10B981' },
  { n: '04', emoji: '🗓', label: 'Seasonality\nCheck',   why: 'Rule out\ncalendar effects',   color: '#FF6B35' },
] as const

export function ProtocolMap() {
  return (
    <div className="rounded-2xl p-5 space-y-4"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
      <p className="text-xs uppercase tracking-widest text-center"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        The 4-step pre-data protocol
      </p>

      <div className="flex items-stretch gap-0">
        {STEPS.map((step, i) => (
          <div key={step.n} className="flex items-stretch flex-1">
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl"
              style={{ background: `${step.color}08`, border: `1px solid ${step.color}22` }}
            >
              <motion.span style={{ fontSize: '20px' }}
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}>
                {step.emoji}
              </motion.span>
              <span className="text-xs font-bold"
                style={{ color: step.color, fontFamily: 'var(--font-mono)' }}>{step.n}</span>
              <p className="text-xs font-semibold text-center whitespace-pre-line leading-snug"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>{step.label}</p>
              <p className="text-center whitespace-pre-line leading-snug"
                style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{step.why}</p>
            </motion.div>

            {i < STEPS.length - 1 && (
              <div className="flex items-center shrink-0" style={{ width: '18px' }}>
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.3 }}
                  style={{ transformOrigin: 'left', width: '100%', display: 'flex', alignItems: 'center' }}
                >
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-default)' }} />
                  <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                    <path d="M1 3.5h5M3.5 1l2.5 2.5-2.5 2.5" stroke="var(--text-muted)" strokeWidth="1" strokeLinecap="round" />
                  </svg>
                </motion.div>
              </div>
            )}
          </div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        className="px-4 py-2.5 rounded-xl text-center"
        style={{ background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.12)' }}>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          <span style={{ color: 'var(--accent-red)', fontWeight: 600 }}>Skip any step</span>
          {' '}and you risk chasing the wrong cause for weeks
        </p>
      </motion.div>
    </div>
  )
}
