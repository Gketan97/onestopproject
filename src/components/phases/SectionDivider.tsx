import { motion } from 'framer-motion'

interface SectionDividerProps {
  number: number
  title:  string
}

export function SectionDivider({ number, title }: SectionDividerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-4"
    >
      <span
        className="text-xs font-bold"
        style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', minWidth: '24px' }}
      >
        {String(number).padStart(2, '0')}
      </span>
      <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
      <span
        className="text-xs uppercase tracking-widest"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
      >
        {title}
      </span>
      <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
    </motion.div>
  )
}
