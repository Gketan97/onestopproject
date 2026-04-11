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
