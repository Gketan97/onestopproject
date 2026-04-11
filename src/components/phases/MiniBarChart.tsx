import { motion } from 'framer-motion'

interface BarItem { label: string; value: number; color?: string }
interface MiniBarChartProps { data: BarItem[]; title: string; unit?: string; maxValue?: number }

export function MiniBarChart({ data, title, unit = '%', maxValue }: MiniBarChartProps) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value))
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
      <div className="px-5 py-3" style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
        <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{title}</p>
      </div>
      <div className="px-5 py-5 space-y-3" style={{ background: 'var(--bg-elevated)' }}>
        {data.map((item, i) => {
          const pct   = (item.value / max) * 100
          const color = item.color ?? 'var(--accent-primary)'
          return (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-heading)' }}>{item.label}</span>
                <span className="text-sm font-bold" style={{ color, fontFamily: 'var(--font-mono)' }}>{item.value}{unit}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border-subtle)' }}>
                <motion.div className="h-full rounded-full" style={{ background: color }}
                  initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
