import { useEffect, useRef, useState } from 'react'
import { motion, useInView }           from 'framer-motion'
import CountUp                          from 'react-countup'

const SPARK_RAW = [
  12.0,12.1,12.0,12.1,12.0,12.2,12.0,12.1,11.9,12.0,
  11.8,11.5,11.3,11.1,10.9,10.7,10.6,10.5,10.3,10.2,
  10.2,10.1,10.1,10.2,10.1,10.1,10.0,10.1,10.1,10.1,
]

function Sparkline() {
  const W = 200; const H = 64; const PAD = 6
  const IW = W - PAD * 2; const IH = H - PAD * 2
  const MIN = 9.6; const MAX = 12.6

  const pts = SPARK_RAW.map((v, i) => ({
    x: PAD + (i / (SPARK_RAW.length - 1)) * IW,
    y: PAD + IH - ((v - MIN) / (MAX - MIN)) * IH,
  }))

  function smooth(ps: { x: number; y: number }[]): string {
    if (ps.length < 2) return ''
    let d = `M ${ps[0].x} ${ps[0].y}`
    for (let i = 1; i < ps.length; i++) {
      const p = ps[i - 1]; const c = ps[i]
      const cp1x = p.x + (c.x - p.x) / 3
      const cp2x = c.x - (c.x - p.x) / 3
      d += ` C ${cp1x} ${p.y}, ${cp2x} ${c.y}, ${c.x} ${c.y}`
    }
    return d
  }

  const stablePts = pts.slice(0, 10)
  const dropPts   = pts.slice(9)
  const last = pts[pts.length - 1]
  const inflect = pts[10]

  const areaD = smooth(dropPts) + ` L${last.x},${H} L${inflect.x},${H} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="drop-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#F87171" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#F87171" stopOpacity="0"    />
        </linearGradient>
      </defs>
      <motion.path d={areaD} fill="url(#drop-fill)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.8 }} />
      <motion.path d={smooth(stablePts)} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
      <motion.path d={smooth(dropPts)} fill="none" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 1.0 }} />
      <motion.circle cx={inflect.x} cy={inflect.y} r="4" fill="#F87171"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.3, type: 'spring', stiffness: 400 }} />
      <motion.line x1={inflect.x} y1={0} x2={inflect.x} y2={H}
        stroke="rgba(248,113,113,0.30)" strokeWidth="1" strokeDasharray="3,2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.3 }} />
      <motion.circle cx={last.x} cy={last.y} r="4" fill="#F87171" stroke="#0D0D0D" strokeWidth="2"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.8, type: 'spring', stiffness: 500 }} />
    </svg>
  )
}

export function IncidentHero() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setStarted(true), 300)
      return () => clearTimeout(t)
    }
  }, [inView])

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl overflow-hidden grain"
      style={{
        border:     '1px solid rgba(248,113,113,0.20)',
        background: 'linear-gradient(135deg,rgba(248,113,113,0.05) 0%,rgba(13,13,13,1) 55%,rgba(129,140,248,0.03) 100%)',
      }}
    >
      {/* Ambient glow */}
      <motion.div className="absolute top-0 left-0 w-80 h-80 pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(248,113,113,0.10) 0%,transparent 70%)', filter: 'blur(48px)', transform: 'translate(-25%,-25%)' }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }} />

      <div className="relative p-6 space-y-5">
        {/* Alert header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <motion.div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-red)' }}
              animate={{ opacity: [1, 0.2, 1], scale: [1, 0.8, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }} />
            <span className="text-xs font-bold uppercase tracking-widest"
              style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>
              P0 Incident · Board Visibility
            </span>
          </div>
          <motion.span
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 2.3 }}
            className="px-2.5 py-1 rounded-lg text-xs font-bold"
            style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.25)', color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>
            LIVE
          </motion.span>
        </div>

        {/* Metric + sparkline */}
        <div className="flex items-start gap-6">
          <div className="space-y-1.5 shrink-0">
            <p className="text-xs uppercase tracking-widest"
              style={{ color: 'rgba(160,152,144,0.5)', fontFamily: 'var(--font-mono)' }}>
              Bookings / DAU
            </p>
            <div className="flex items-baseline gap-3">
              <span style={{ fontSize: 'clamp(40px,5vw,60px)', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--accent-red)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {started ? (
                  <CountUp start={12.0} end={10.1} decimals={1} duration={2.2} suffix="%" />
                ) : '12.0%'}
              </span>
              <motion.div
                initial={{ opacity: 0, x: -10 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 2.5 }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
                style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.25)' }}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M5.5 2v7M2 6l3.5 3.5L9 6" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm font-bold" style={{ color: '#F87171', fontFamily: 'var(--font-mono)' }}>−1.9pp</span>
              </motion.div>
            </div>
            <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 2.7 }}
              className="text-xs" style={{ color: 'rgba(160,152,144,0.5)', fontFamily: 'var(--font-mono)' }}>
              12.0% → 10.1% · 60 days sustained
            </motion.p>
          </div>

          <motion.div className="flex-1 min-w-0" style={{ height: '64px', marginTop: '22px' }}
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.4 }}>
            <Sparkline />
          </motion.div>
        </div>

        {/* Metric pills */}
        <div className="flex gap-px rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
          {[
            { label: 'Relative decline', value: '−15.8%', sub: 'vs baseline',       color: 'var(--accent-red)',     delay: 2.0 },
            { label: 'Revenue impact',   value: '₹4.2Cr',  sub: 'already lost',      color: 'var(--accent-red)',     delay: 2.1 },
            { label: 'Duration',         value: '60 days', sub: 'no recovery signal', color: 'var(--accent-primary)', delay: 2.2 },
            { label: 'Board review',     value: '3 weeks', sub: 'slides due Friday',  color: 'var(--accent-amber)',   delay: 2.3 },
          ].map(({ label, value, sub, color, delay }) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay, duration: 0.4 }}
              className="flex-1 flex flex-col items-center justify-center py-4 px-2"
              style={{ background: 'rgba(255,255,255,0.025)' }}>
              <p className="text-xs uppercase tracking-widest mb-1.5"
                style={{ color: 'rgba(160,152,144,0.5)', fontFamily: 'var(--font-mono)', fontSize: '9px', textAlign: 'center' }}>
                {label}
              </p>
              <p className="text-lg font-bold tracking-tight"
                style={{ color, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
                {value}
              </p>
              <p className="text-xs mt-0.5 text-center"
                style={{ color: 'rgba(160,152,144,0.4)', fontFamily: 'var(--font-mono)', fontSize: '9px' }}>
                {sub}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
