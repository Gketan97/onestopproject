import { motion } from 'framer-motion'

const TOKENS = [
  { text: 'Bookings/DAU',                 color: 'var(--text-primary)',   weight: 800, size: '18px', delay: 0    },
  { text: '=',                             color: 'var(--text-muted)',     weight: 400, size: '18px', delay: 0.25 },
  { text: 'Gross Completed Payments',      color: 'var(--accent-primary)', weight: 700, size: '14px', delay: 0.5  },
  { text: '÷',                             color: 'var(--text-muted)',     weight: 400, size: '18px', delay: 0.75 },
  { text: 'Logged-in Unique Daily Users',  color: 'var(--accent-green)',   weight: 700, size: '14px', delay: 1.0  },
] as const

const EX = [
  { top: '1,000', bot: 'users open app',  color: 'var(--accent-green)',     delay: 1.6 },
  { top: '÷',     bot: '',               color: 'var(--text-muted)',         delay: 1.75 },
  { top: '120',   bot: 'complete booking', color: 'var(--accent-primary)',  delay: 1.9 },
  { top: '=',     bot: '',               color: 'var(--text-muted)',         delay: 2.05 },
  { top: '12.0%', bot: 'Bookings/DAU',   color: 'var(--accent-secondary)',  delay: 2.2 },
] as const

export function FormulaBuilder() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
      <div className="px-5 py-3 flex items-center justify-between"
        style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
        <p className="text-xs uppercase tracking-widest"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Metric definition</p>
        <span className="text-xs px-2 py-0.5 rounded-md"
          style={{ background: 'rgba(255,107,53,0.10)', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', border: '1px solid rgba(255,107,53,0.20)' }}>
          North Star
        </span>
      </div>

      <div className="px-5 py-5 space-y-6" style={{ background: 'var(--bg-elevated)' }}>
        <div className="flex flex-wrap items-center gap-2">
          {TOKENS.map(({ text, color, weight, size, delay }) => (
            <motion.span key={text}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ color, fontWeight: weight, fontSize: size, fontFamily: 'var(--font-heading)', letterSpacing: '-0.01em' }}>
              {text}
            </motion.span>
          ))}
        </div>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          style={{ height: '1px', background: 'var(--border-subtle)', transformOrigin: 'left' }} />

        <div>
          <p className="text-xs uppercase tracking-widest mb-3"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Example</p>
          <div className="flex flex-wrap items-end gap-4">
            {EX.map(({ top, bot, color, delay }) => (
              <motion.div key={`${top}${delay}`}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay, duration: 0.4 }}
                className="flex flex-col items-center">
                <span style={{ color, fontFamily: 'var(--font-heading)', fontSize: top === '÷' || top === '=' ? '22px' : '26px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {top}
                </span>
                {bot && (
                  <span className="text-xs mt-1 text-center"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', maxWidth: '72px', fontSize: '10px' }}>
                    {bot}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.6, duration: 0.45 }}
          className="flex gap-3 px-4 py-3 rounded-xl"
          style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.18)' }}>
          <span style={{ fontSize: '16px', flexShrink: 0 }}>⚠️</span>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--accent-red)' }}>Trap: </strong>
            B/DAU can fall even when bookings are <em style={{ color: 'var(--text-primary)' }}>flat</em> — if DAU grows faster.
            Always check numerator and denominator separately.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
