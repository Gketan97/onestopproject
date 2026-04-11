import { motion } from 'framer-motion'

interface ConceptBlockProps {
  title:     string
  children:  React.ReactNode
  accent?:   string
  delay?:    number
}

export function ConceptBlock({ title, children, accent = 'var(--accent-primary)', delay = 0 }: ConceptBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid var(--border-subtle)' }}
    >
      {/* Title bar */}
      <div
        className="px-5 py-3 flex items-center gap-3"
        style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}
      >
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: accent }}
        />
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
        >
          {title}
        </p>
      </div>
      {/* Body */}
      <div
        className="px-5 py-5 space-y-3 text-sm leading-relaxed"
        style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
      >
        {children}
      </div>
    </motion.div>
  )
}
