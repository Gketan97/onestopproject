import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'

interface MetricCardProps {
  label:      string
  value:      string
  change?:    string
  direction?: 'up' | 'down' | 'flat'
  accent?:    string
  sub?:       string
}

export function MetricCard({ label, value, change, direction = 'flat', accent = 'var(--accent-primary)', sub }: MetricCardProps) {
  const Icon = direction === 'up' ? TrendingUp : direction === 'down' ? TrendingDown : Minus
  const changeColor = direction === 'up' ? 'var(--accent-green)' : direction === 'down' ? 'var(--accent-red)' : 'var(--text-muted)'

  return (
    <div className="rounded-2xl p-5 space-y-3"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
      <p className="text-xs uppercase tracking-widest"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</p>
      <div className="flex items-end justify-between">
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl font-bold tracking-tight"
          style={{ color: accent, fontFamily: 'var(--font-heading)' }}>{value}</motion.p>
        {change && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: `${changeColor}12`, border: `1px solid ${changeColor}25` }}>
            <Icon size={13} style={{ color: changeColor }} />
            <span className="text-sm font-semibold"
              style={{ color: changeColor, fontFamily: 'var(--font-mono)' }}>{change}</span>
          </div>
        )}
      </div>
      {sub && <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
    </div>
  )
}
