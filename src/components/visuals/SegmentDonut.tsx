import { motion } from 'framer-motion'

const SEGS = [
  { label: 'Leisure travelers',  pct: 65, color: '#FF6B35', detail: 'Book 2–4 months ahead, price-sensitive, 3× CVR impact' },
  { label: 'Business travelers', pct: 25, color: '#818CF8', detail: 'Book within 7 days, low price sensitivity, stable demand' },
  { label: 'Last-minute',        pct: 10, color: '#10B981', detail: 'Same-day, highest CVR per session, smallest segment' },
]

const CX = 56; const CY = 56; const R = 40; const SW = 18

function arc(pct: number, offset: number) {
  const c = 2 * Math.PI * R
  return {
    strokeDasharray:  `${(pct / 100) * c} ${c}`,
    strokeDashoffset: `${c - (offset / 100) * c}`,
  }
}

export function SegmentDonut() {
  let cum = 0
  return (
    <div className="flex items-center gap-6">
      <div className="shrink-0" style={{ width: 112, height: 112 }}>
        <svg viewBox="0 0 112 112" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={SW} />
          {SEGS.map((seg, i) => {
            const props = arc(seg.pct, cum)
            const delay = i * 0.3
            cum += seg.pct
            return (
              <motion.circle key={seg.label}
                cx={CX} cy={CY} r={R} fill="none"
                stroke={seg.color} strokeWidth={SW} strokeLinecap="butt"
                strokeDasharray={props.strokeDasharray}
                strokeDashoffset={props.strokeDashoffset}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay, duration: 0.5 }} />
            )
          })}
          <text x={CX} y={CY - 5} textAnchor="middle" fill="var(--text-primary)"
            fontSize="11" fontWeight="700" fontFamily="var(--font-heading)"
            style={{ transform: 'rotate(90deg)', transformOrigin: `${CX}px ${CY}px` }}>User</text>
          <text x={CX} y={CY + 8} textAnchor="middle" fill="var(--text-muted)"
            fontSize="9" fontFamily="var(--font-mono)"
            style={{ transform: 'rotate(90deg)', transformOrigin: `${CX}px ${CY}px` }}>Segments</text>
        </svg>
      </div>
      <div className="flex-1 space-y-3">
        {SEGS.map((seg, i) => (
          <motion.div key={seg.label}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.15, duration: 0.4 }}>
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-base font-bold" style={{ color: seg.color, fontFamily: 'var(--font-heading)' }}>{seg.pct}%</span>
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>{seg.label}</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{seg.detail}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
