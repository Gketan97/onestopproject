import { motion } from 'framer-motion'

interface ArjunMessageProps {
  children:  React.ReactNode
  delay?:    number
  variant?:  'default' | 'question' | 'feedback' | 'correct'
}

const BORDER_COLOR: Record<string, string> = {
  default:  'var(--border-subtle)',
  question: 'rgba(129,140,248,0.30)',
  feedback: 'rgba(255,107,53,0.25)',
  correct:  'rgba(16,185,129,0.30)',
}

const LABEL_COLOR: Record<string, string> = {
  default:  'var(--accent-secondary)',
  question: 'var(--accent-secondary)',
  feedback: 'var(--accent-primary)',
  correct:  'var(--accent-green)',
}

export function ArjunMessage({ children, delay = 0, variant = 'default' }: ArjunMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-4"
    >
      {/* Avatar */}
      <div
        className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold"
        style={{
          background:  'linear-gradient(135deg, rgba(129,140,248,0.25), rgba(255,107,53,0.25))',
          border:      `1px solid ${BORDER_COLOR[variant]}`,
          color:       'var(--text-primary)',
          fontFamily:  'var(--font-heading)',
        }}
      >
        A
      </div>

      {/* Bubble */}
      <div
        className="flex-1 rounded-2xl rounded-tl-sm px-5 py-4 space-y-2"
        style={{
          background: 'var(--bg-surface)',
          border:     `1px solid ${BORDER_COLOR[variant]}`,
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: LABEL_COLOR[variant], fontFamily: 'var(--font-mono)' }}
        >
          Arjun · Staff Analyst
        </p>
        <div
          className="text-sm leading-relaxed space-y-3"
          style={{ color: 'var(--text-secondary)' }}
        >
          {children}
        </div>
      </div>
    </motion.div>
  )
}
