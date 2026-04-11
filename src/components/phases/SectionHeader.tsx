import { motion } from 'framer-motion'

interface SectionHeaderProps { number: number; title: string; subtitle?: string }

export function SectionHeader({ number, title, subtitle }: SectionHeaderProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-3">
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold" style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', minWidth: '24px' }}>
          {String(number).padStart(2, '0')}
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
      </div>
      <div className="pl-9 space-y-1">
        <h2 className="text-2xl font-bold tracking-tight"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>{title}</h2>
        {subtitle && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>
    </motion.div>
  )
}
