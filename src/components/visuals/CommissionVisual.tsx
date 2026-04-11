import { motion } from 'framer-motion'

export function CommissionVisual() {
  const flow = [
    { icon: '🏨', label: 'Hotel',  value: '₹1,000', sub: 'booking value',    color: 'var(--text-secondary)', highlight: false },
    { icon: '→',  label: '',        value: '',         sub: '',               color: '',                       highlight: false },
    { icon: '✈️', label: 'MMT',    value: '₹125',    sub: '12.5% commission', color: 'var(--accent-green)',   highlight: true  },
    { icon: '→',  label: '',        value: '',         sub: '',               color: '',                       highlight: false },
    { icon: '📱', label: 'User',   value: '✓',        sub: 'booking done',   color: 'var(--accent-secondary)', highlight: false },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {flow.map(({ icon, label, value, sub, color, highlight }, fIdx) => (
          <motion.div key={fIdx}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: fIdx * 0.1, duration: 0.4 }}
            className={icon === '→' ? 'flex items-center' : 'flex-1 text-center'}
          >
            {icon === '→' ? (
              <svg width="18" height="10" viewBox="0 0 18 10">
                <path d="M0 5h14M10 2l4 3-4 3" stroke="var(--border-default)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ) : (
              <div className="rounded-xl p-3 space-y-1"
                style={{
                  background: highlight ? 'rgba(16,185,129,0.08)' : 'var(--bg-surface)',
                  border:     highlight ? '1px solid rgba(16,185,129,0.20)' : '1px solid var(--border-subtle)',
                }}>
                <div style={{ fontSize: '18px' }}>{icon}</div>
                {label && <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-heading)' }}>{label}</p>}
                {value && <p className="text-sm font-bold" style={{ color, fontFamily: 'var(--font-heading)' }}>{value}</p>}
                {sub && <p style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{sub}</p>}
              </div>
            )}
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="px-4 py-2.5 rounded-xl text-center"
        style={{ background: 'rgba(255,107,53,0.05)', border: '1px solid rgba(255,107,53,0.12)' }}>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Revenue ={' '}
          <strong style={{ color: 'var(--accent-primary)' }}>Bookings</strong>{' '}×{' '}
          <strong style={{ color: 'var(--accent-secondary)' }}>AOV</strong>{' '}×{' '}
          <strong style={{ color: 'var(--accent-green)' }}>Commission %</strong>
          {' '}— if any falls, revenue falls
        </p>
      </motion.div>
    </div>
  )
}
