import { motion } from 'framer-motion'

interface CalloutArrowProps {
  x:      number   // position as % of container width
  y:      number   // position as % of container height
  label:  string
  side?:  'left' | 'right'
}

export function CalloutArrow({ x, y, label, side = 'right' }: CalloutArrowProps) {
  const offset = side === 'right' ? 1 : -1

  return (
    <div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
    >
      <svg
        width="160" height="60"
        viewBox="0 0 160 60"
        style={{
          position:  'absolute',
          left:      side === 'right' ? '8px' : '-168px',
          top:       '-20px',
          overflow:  'visible',
        }}
      >
        {/* Arrow line */}
        <motion.path
          d={side === 'right'
            ? 'M 0 30 C 20 30, 30 10, 60 10 L 140 10'
            : 'M 160 30 C 140 30, 130 10, 100 10 L 20 10'}
          fill="none"
          stroke="#F87171"
          strokeWidth="1.5"
          strokeDasharray="4,3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        />
        {/* Arrowhead */}
        <motion.polygon
          points={side === 'right' ? '136,6 144,10 136,14' : '24,6 16,10 24,14'}
          fill="#F87171"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: 'spring', stiffness: 400 }}
          style={{ transformOrigin: side === 'right' ? '140px 10px' : '20px 10px' }}
        />
      </svg>

      {/* Dot on chart */}
      <motion.div
        className="w-3 h-3 rounded-full border-2"
        style={{ background: '#F87171', borderColor: '#0D0D0D' }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, delay: 0.1 }}
      />

      {/* Label pill */}
      <motion.div
        className="absolute px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap"
        style={{
          [side === 'right' ? 'left' : 'right']: side === 'right' ? '68px' : '68px',
          top:        '-26px',
          background: 'rgba(248,113,113,0.15)',
          border:     '1px solid rgba(248,113,113,0.40)',
          color:      '#F87171',
          fontFamily: 'var(--font-mono)',
        }}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        {label}
      </motion.div>
    </div>
  )
}
