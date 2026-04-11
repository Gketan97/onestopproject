import { motion } from 'framer-motion'

interface PhaseCardProps {
  children:   React.ReactNode
  className?: string
  accent?:    boolean
}

export function PhaseCard({ children, className = '', accent = false }: PhaseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-2xl p-6 space-y-4 ${className}`}
      style={{
        background: accent ? 'rgba(255,107,53,0.04)' : 'var(--bg-surface)',
        border:     accent ? '1px solid rgba(255,107,53,0.20)' : '1px solid var(--border-subtle)',
      }}
    >
      {children}
    </motion.div>
  )
}
