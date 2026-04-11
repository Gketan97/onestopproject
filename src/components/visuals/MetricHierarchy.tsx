import { motion } from 'framer-motion'

export function MetricHierarchy() {
  return (
    <div className="space-y-3">
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }} className="flex justify-center">
        <div className="px-5 py-3 rounded-xl text-center"
          style={{ background: 'rgba(255,107,53,0.10)', border: '1px solid rgba(255,107,53,0.28)' }}>
          <p className="text-xs uppercase tracking-widest mb-0.5"
            style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>North Star</p>
          <p className="text-base font-bold"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            Bookings / DAU
          </p>
        </div>
      </motion.div>

      <div className="flex justify-center">
        <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          style={{ width: '1px', height: '16px', background: 'var(--border-default)' }} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'CVR Leg',        sub: 'Bookings / Sessions', color: '#F87171', bg: 'rgba(248,113,113,0.08)' },
          { label: 'Engagement Leg', sub: 'Sessions / DAU',      color: '#10B981', bg: 'rgba(16,185,129,0.08)'  },
        ].map((item, i) => (
          <motion.div key={item.label}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
            className="px-3 py-2.5 rounded-xl text-center"
            style={{ background: item.bg, border: `1px solid ${item.color}22` }}>
            <p className="text-xs font-semibold mb-0.5"
              style={{ color: item.color, fontFamily: 'var(--font-heading)' }}>{item.label}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.sub}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="px-3 py-2 rounded-lg text-center"
        style={{ background: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.14)' }}>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--accent-secondary)' }}>Rule: </strong>
          Identify which leg broke before segmenting
        </p>
      </motion.div>
    </div>
  )
}
