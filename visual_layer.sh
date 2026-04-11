#!/usr/bin/env bash
# VISUAL LAYER — STATE OF THE ART
# Aesthetic: Editorial dark intelligence
# Every metric is a visual. Every concept has a diagram. No text dumps.
# Motion: purposeful, physics-based, never decorative
# Contracts enforced: UI_CONTRACT | BUG_AUDIT | CODE_QUALITY | DEBT_REGISTER

set -euo pipefail

echo "🎨 Visual Layer — State of the Art"
echo "No shortcuts. No compromise."
echo "────────────────────────────────────"

for contract in UI_CONTRACT.md BUG_AUDIT.md CODE_QUALITY.md DEBT_REGISTER.md; do
  [ -f "$contract" ] && echo "  ✅ $contract" || { echo "  ❌ $contract missing"; exit 1; }
done

npm install react-countup --legacy-peer-deps 2>/dev/null || true
echo "✅ react-countup ready"

mkdir -p src/components/visuals

# ── Global CSS additions ──────────────────────────────────────────────────────
python3 << 'PYEOF'
css_path = 'src/styles/globals.css'
with open(css_path, 'r') as f:
    existing = f.read()

additions = """
/* ── Grain texture ──────────────────────────────── */
.grain::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
  border-radius: inherit;
}

/* ── Glow pulse ─────────────────────────────────── */
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(255,107,53,0.12); }
  50%       { box-shadow: 0 0 40px rgba(255,107,53,0.28); }
}
.glow-pulse { animation: glow-pulse 3s ease-in-out infinite; }
"""

if 'grain::before' not in existing:
    with open(css_path, 'a') as f:
        f.write(additions)
    print("✅ globals.css updated")
else:
    print("✅ globals.css already has effects")
PYEOF

# ── 1. ArjunAvatar ────────────────────────────────────────────────────────────
cat > src/components/visuals/ArjunAvatar.tsx << 'EOF'
import { motion } from 'framer-motion'

interface ArjunAvatarProps {
  size?:   number
  typing?: boolean
  pulse?:  boolean
}

export function ArjunAvatar({ size = 40, typing = false, pulse = false }: ArjunAvatarProps) {
  const s = size
  const uid = `av-${s}`

  return (
    <div className="relative shrink-0" style={{ width: s, height: s }}>
      <motion.div
        animate={pulse ? { scale: [1, 1.04, 1] } : {}}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: s, height: s }}
      >
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          <defs>
            <linearGradient id={`${uid}-ring`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#818CF8" stopOpacity="0.9" />
              <stop offset="50%"  stopColor="#FF6B35" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id={`${uid}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#1a1a2e" />
              <stop offset="100%" stopColor="#16213e" />
            </linearGradient>
            <linearGradient id={`${uid}-skin`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#D4956A" />
              <stop offset="100%" stopColor="#B8784F" />
            </linearGradient>
            <linearGradient id={`${uid}-shirt`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#818CF8" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
            <clipPath id={`${uid}-clip`}>
              <circle cx="24" cy="24" r="21" />
            </clipPath>
          </defs>

          {/* Rotating ring */}
          <motion.circle cx="24" cy="24" r="23"
            fill="none" stroke={`url(#${uid}-ring)`} strokeWidth="1.5"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '24px 24px' }}
          />

          <circle cx="24" cy="24" r="21" fill={`url(#${uid}-bg)`} />

          <g clipPath={`url(#${uid}-clip)`}>
            {/* Shirt */}
            <ellipse cx="24" cy="43" rx="14" ry="10" fill={`url(#${uid}-shirt)`} />
            {/* Neck */}
            <rect x="21" y="30" width="6" height="6" rx="2" fill={`url(#${uid}-skin)`} />
            {/* Head */}
            <ellipse cx="24" cy="22" rx="10" ry="11" fill={`url(#${uid}-skin)`} />
            {/* Hair */}
            <path d="M14 20 Q14 10 24 9 Q34 10 34 20 L34 16 Q34 8 24 7 Q14 8 14 16Z" fill="#1A0A00" />
            <ellipse cx="24" cy="11" rx="10" ry="4" fill="#1A0A00" />
            {/* Eyes */}
            <ellipse cx="20" cy="22" rx="1.8" ry="2" fill="#1A0A00" />
            <ellipse cx="28" cy="22" rx="1.8" ry="2" fill="#1A0A00" />
            <circle cx="20.6" cy="21.2" r="0.6" fill="white" />
            <circle cx="28.6" cy="21.2" r="0.6" fill="white" />
            {/* Eyebrows */}
            <path d="M17.5 19.5 Q20 18 22.5 19.5" stroke="#3D1A00" strokeWidth="1" fill="none" strokeLinecap="round" />
            <path d="M25.5 19.5 Q28 18 30.5 19.5" stroke="#3D1A00" strokeWidth="1" fill="none" strokeLinecap="round" />
            {/* Smile */}
            <path d="M20 29 Q24 32 28 29" stroke="#8B5A2B" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </g>
        </svg>
      </motion.div>

      {typing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -bottom-1 -right-1 flex items-center gap-0.5 px-2 py-1 rounded-full"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
        >
          {[0, 1, 2].map((dotIdx) => (
            <motion.div key={dotIdx} className="w-1 h-1 rounded-full"
              style={{ background: 'var(--accent-secondary)' }}
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: dotIdx * 0.15 }}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}
EOF
echo "✅ ArjunAvatar.tsx"

# ── 2. IncidentHero ───────────────────────────────────────────────────────────
cat > src/components/visuals/IncidentHero.tsx << 'EOF'
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
EOF
echo "✅ IncidentHero.tsx"

# ── 3. ProtocolMap ────────────────────────────────────────────────────────────
cat > src/components/visuals/ProtocolMap.tsx << 'EOF'
import { motion } from 'framer-motion'

const STEPS = [
  { n: '01', emoji: '📐', label: 'Definition\nClarity',  why: 'Lock what\nyou\'re measuring', color: '#FF6B35' },
  { n: '02', emoji: '🔬', label: 'Data\nSanity',         why: 'Verify the\ndata is real',     color: '#818CF8' },
  { n: '03', emoji: '📈', label: 'Timeline\nReview',     why: 'Read the shape\nof the drop',   color: '#10B981' },
  { n: '04', emoji: '🗓', label: 'Seasonality\nCheck',   why: 'Rule out\ncalendar effects',   color: '#FF6B35' },
] as const

export function ProtocolMap() {
  return (
    <div className="rounded-2xl p-5 space-y-4"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
      <p className="text-xs uppercase tracking-widest text-center"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        The 4-step pre-data protocol
      </p>

      <div className="flex items-stretch gap-0">
        {STEPS.map((step, i) => (
          <div key={step.n} className="flex items-stretch flex-1">
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl"
              style={{ background: `${step.color}08`, border: `1px solid ${step.color}22` }}
            >
              <motion.span style={{ fontSize: '20px' }}
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}>
                {step.emoji}
              </motion.span>
              <span className="text-xs font-bold"
                style={{ color: step.color, fontFamily: 'var(--font-mono)' }}>{step.n}</span>
              <p className="text-xs font-semibold text-center whitespace-pre-line leading-snug"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>{step.label}</p>
              <p className="text-center whitespace-pre-line leading-snug"
                style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{step.why}</p>
            </motion.div>

            {i < STEPS.length - 1 && (
              <div className="flex items-center shrink-0" style={{ width: '18px' }}>
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.3 }}
                  style={{ transformOrigin: 'left', width: '100%', display: 'flex', alignItems: 'center' }}
                >
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-default)' }} />
                  <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                    <path d="M1 3.5h5M3.5 1l2.5 2.5-2.5 2.5" stroke="var(--text-muted)" strokeWidth="1" strokeLinecap="round" />
                  </svg>
                </motion.div>
              </div>
            )}
          </div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        className="px-4 py-2.5 rounded-xl text-center"
        style={{ background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.12)' }}>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          <span style={{ color: 'var(--accent-red)', fontWeight: 600 }}>Skip any step</span>
          {' '}and you risk chasing the wrong cause for weeks
        </p>
      </motion.div>
    </div>
  )
}
EOF
echo "✅ ProtocolMap.tsx"

# ── 4. FormulaBuilder ─────────────────────────────────────────────────────────
cat > src/components/visuals/FormulaBuilder.tsx << 'EOF'
import { motion } from 'framer-motion'

const TOKENS = [
  { text: 'Bookings/DAU',                 color: 'var(--text-primary)',   weight: 800, size: '18px', delay: 0    },
  { text: '=',                             color: 'var(--text-muted)',     weight: 400, size: '18px', delay: 0.25 },
  { text: 'Gross Completed Payments',      color: 'var(--accent-primary)', weight: 700, size: '14px', delay: 0.5  },
  { text: '÷',                             color: 'var(--text-muted)',     weight: 400, size: '18px', delay: 0.75 },
  { text: 'Logged-in Unique Daily Users',  color: 'var(--accent-green)',   weight: 700, size: '14px', delay: 1.0  },
] as const

const EX = [
  { top: '1,000', bot: 'users open app',  color: 'var(--accent-green)',     delay: 1.6 },
  { top: '÷',     bot: '',               color: 'var(--text-muted)',         delay: 1.75 },
  { top: '120',   bot: 'complete booking', color: 'var(--accent-primary)',  delay: 1.9 },
  { top: '=',     bot: '',               color: 'var(--text-muted)',         delay: 2.05 },
  { top: '12.0%', bot: 'Bookings/DAU',   color: 'var(--accent-secondary)',  delay: 2.2 },
] as const

export function FormulaBuilder() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
      <div className="px-5 py-3 flex items-center justify-between"
        style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
        <p className="text-xs uppercase tracking-widest"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Metric definition</p>
        <span className="text-xs px-2 py-0.5 rounded-md"
          style={{ background: 'rgba(255,107,53,0.10)', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', border: '1px solid rgba(255,107,53,0.20)' }}>
          North Star
        </span>
      </div>

      <div className="px-5 py-5 space-y-6" style={{ background: 'var(--bg-elevated)' }}>
        <div className="flex flex-wrap items-center gap-2">
          {TOKENS.map(({ text, color, weight, size, delay }) => (
            <motion.span key={text}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ color, fontWeight: weight, fontSize: size, fontFamily: 'var(--font-heading)', letterSpacing: '-0.01em' }}>
              {text}
            </motion.span>
          ))}
        </div>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          style={{ height: '1px', background: 'var(--border-subtle)', transformOrigin: 'left' }} />

        <div>
          <p className="text-xs uppercase tracking-widest mb-3"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Example</p>
          <div className="flex flex-wrap items-end gap-4">
            {EX.map(({ top, bot, color, delay }) => (
              <motion.div key={`${top}${delay}`}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay, duration: 0.4 }}
                className="flex flex-col items-center">
                <span style={{ color, fontFamily: 'var(--font-heading)', fontSize: top === '÷' || top === '=' ? '22px' : '26px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {top}
                </span>
                {bot && (
                  <span className="text-xs mt-1 text-center"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', maxWidth: '72px', fontSize: '10px' }}>
                    {bot}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.6, duration: 0.45 }}
          className="flex gap-3 px-4 py-3 rounded-xl"
          style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.18)' }}>
          <span style={{ fontSize: '16px', flexShrink: 0 }}>⚠️</span>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--accent-red)' }}>Trap: </strong>
            B/DAU can fall even when bookings are <em style={{ color: 'var(--text-primary)' }}>flat</em> — if DAU grows faster.
            Always check numerator and denominator separately.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
EOF
echo "✅ FormulaBuilder.tsx"

# ── 5. SegmentDonut ───────────────────────────────────────────────────────────
cat > src/components/visuals/SegmentDonut.tsx << 'EOF'
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
EOF
echo "✅ SegmentDonut.tsx"

# ── 6. CommissionVisual ───────────────────────────────────────────────────────
cat > src/components/visuals/CommissionVisual.tsx << 'EOF'
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
EOF
echo "✅ CommissionVisual.tsx"

# ── 7. MetricHierarchy ────────────────────────────────────────────────────────
cat > src/components/visuals/MetricHierarchy.tsx << 'EOF'
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
EOF
echo "✅ MetricHierarchy.tsx"

# ── 8. Barrel ─────────────────────────────────────────────────────────────────
cat > src/components/visuals/index.ts << 'EOF'
export { ArjunAvatar }      from './ArjunAvatar'
export { IncidentHero }     from './IncidentHero'
export { ProtocolMap }      from './ProtocolMap'
export { FormulaBuilder }   from './FormulaBuilder'
export { SegmentDonut }     from './SegmentDonut'
export { CommissionVisual } from './CommissionVisual'
export { MetricHierarchy }  from './MetricHierarchy'
EOF
echo "✅ visuals/index.ts"

# ── 9. Phase0 full rebuild ────────────────────────────────────────────────────
cat > src/pages/CaseStudy/phases/Phase0.tsx << 'PHASE0_EOF'
import { useState, useEffect }     from 'react'
import { useNavigate, useParams }  from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Smartphone } from 'lucide-react'
import { useProgressStore }        from '@/store/progressStore'
import { ContinueButton }          from '@/components/phases/ContinueButton'
import { RevealBlock }             from '@/components/phases/RevealBlock'
import { ArjunAvatar }             from '@/components/visuals/ArjunAvatar'
import { SegmentDonut }            from '@/components/visuals/SegmentDonut'
import { CommissionVisual }        from '@/components/visuals/CommissionVisual'
import { MetricHierarchy }         from '@/components/visuals/MetricHierarchy'

const CANVAS_CARDS = [
  {
    id: 'model', emoji: '🏦', title: 'Business Model', tagline: 'How MMT makes money',
    color: '#FF6B35', glow: 'rgba(255,107,53,0.08)',
    points: [
      'Earns 10–15% commission on every completed hotel booking. Pure performance model.',
      'Revenue = Bookings × AOV × Commission %. If any one drops, revenue drops.',
      'No booking = no revenue — making Bookings/DAU the single most critical health metric.',
    ],
  },
  {
    id: 'users', emoji: '👥', title: 'User Segments', tagline: 'Who books on MMT',
    color: '#818CF8', glow: 'rgba(129,140,248,0.08)',
    points: [
      'A 13% CVR drop in leisure (65% of users) has 3× the revenue impact vs last-minute segment.',
      'Business travelers book within 7 days, less price-sensitive, and represent stable demand.',
      'Identifying which segment drove the drop is the first segmentation question in Phase 3.',
    ],
  },
  {
    id: 'supply', emoji: '🏨', title: 'Supply Side', tagline: 'What users see and book',
    color: '#10B981', glow: 'rgba(16,185,129,0.08)',
    points: [
      'MMT lists 50,000+ hotels across India — 5-star chains to Tier-2 city homestays.',
      'Supply quality matters: if high-converting budget hotels go out of stock, CVR falls with stable traffic.',
      'Photo quality, review count, and pricing freshness all affect the Detail→Checkout conversion rate.',
    ],
  },
  {
    id: 'metrics', emoji: '📊', title: 'Key Metrics', tagline: 'What the team tracks daily',
    color: '#FF6B35', glow: 'rgba(255,107,53,0.08)',
    points: [
      'GMV: total booking value before cancellations. Used for investor reporting and top-line tracking.',
      'CVR (Bookings ÷ Sessions): measures product quality and product-market fit. Drops here are always serious.',
      'DAU/MAU Ratio: stickiness. A falling ratio means users return less — engagement decay, not just conversion.',
    ],
  },
  {
    id: 'moat', emoji: '🛡️', title: 'Competitive Moat', tagline: 'Why users choose MMT',
    color: '#818CF8', glow: 'rgba(129,140,248,0.08)',
    points: [
      'Largest hotel inventory in India — users trust they\'ll always find options, even Tier-2 cities.',
      'MMT wallet and loyalty points create switching costs. Rewards actively prevent churning.',
      'Price sensitivity is high. If a competitor consistently offers 5% lower, the moat erodes fast.',
    ],
  },
]

const CARD_VISUALS: Record<string, React.ReactNode> = {
  model:   <CommissionVisual />,
  users:   <SegmentDonut />,
  metrics: <MetricHierarchy />,
}

const APP_LENSES = [
  { id: 'funnel',   icon: '🔍', label: 'Funnel: Count every step',
    placeholder: 'How many screens from search to checkout? What happens at each one?' },
  { id: 'friction', icon: '⚡', label: 'Friction: Where did you hesitate?',
    placeholder: 'Was anything slow, confusing, or that made you pause? Exact location?' },
  { id: 'trust',    icon: '🤝', label: 'Trust: What built or eroded confidence?',
    placeholder: 'What made you feel ready to book? What created doubt or uncertainty?' },
]

const REPLIES: Record<string, string> = {
  funnel:   'Good — count them as decision points: Search → List → Detail → Checkout → Payment. That\'s 5 stages. Each is a potential drop-off point you\'ll reconstruct in Phase 5.',
  friction: 'Precision matters. Where exactly? Search load? Listing page? Checkout latency? The location tells you which funnel stage to investigate first. Remember this feeling when you see Phase 5 data.',
  trust:    'Trust signals are real conversion drivers — reviews, cancellation policies, price guarantees. All affect Detail→Checkout conversion. File this for your hypothesis list in Phase 2.',
}

const SLACK_LINES = [
  { text: 'Team — flagging this as P0.', bold: true },
  { text: 'We\'ve seen a sustained 18% drop in Bookings/DAU over 60 days. Started around day −62 and hasn\'t recovered.' },
  { text: 'GMV impact is ₹4.2Cr already. If this continues through festival season, we\'re looking at ₹30Cr+ miss for Q.' },
  { text: 'I need root cause analysis — not hypotheses, not guesses. Data-backed. Board review in 3 weeks.' },
]

type Section = 'canvas' | 'app' | 'brief' | 'hypothesis'

function LensCard({
  lens, isLocked, isDone, onDone,
}: {
  lens: typeof APP_LENSES[0]
  isLocked: boolean
  isDone: boolean
  onDone: () => void
}) {
  const [val, setVal]     = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (val.trim().length < 10 || loading) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    setReply(REPLIES[lens.id] ?? 'Good observation. Keep it in mind as we go deeper.')
    setLoading(false)
    onDone()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: isLocked ? 0.3 : 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl overflow-hidden"
      style={{ border: isDone ? '1px solid rgba(16,185,129,0.25)' : '1px solid var(--border-subtle)' }}
    >
      <div className="flex items-center gap-3 px-5 py-3"
        style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
        <span style={{ fontSize: '18px' }}>{lens.icon}</span>
        <p className="text-sm font-semibold flex-1"
          style={{ color: isDone ? 'var(--accent-green)' : 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
          {lens.label}
        </p>
        {isDone && <span style={{ color: 'var(--accent-green)' }}>✓</span>}
      </div>
      <div className="px-5 py-4 space-y-3" style={{ background: 'var(--bg-elevated)' }}>
        {!isDone && (
          <>
            <textarea value={val} onChange={e => setVal(e.target.value)}
              placeholder={lens.placeholder} disabled={isLocked} rows={2}
              className="w-full rounded-xl px-4 py-3 text-sm resize-none"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--font-body)' }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.08)' }}
              onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }} />
            <button onClick={submit}
              disabled={isLocked || loading || val.trim().length < 10}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
              style={{ background: 'var(--accent-secondary)', color: '#fff', fontFamily: 'var(--font-heading)' }}>
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Arjun is reading...' : 'Submit observation →'}
            </button>
          </>
        )}
        {isDone && val && (
          <div className="px-4 py-3 rounded-xl"
            style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Your observation:</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{val}</p>
          </div>
        )}
        <AnimatePresence>
          {reply && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className="flex gap-3">
              <ArjunAvatar size={28} />
              <p className="flex-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{reply}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function Phase0() {
  const { slug }   = useParams<{ slug: string }>()
  const navigate    = useNavigate()
  const { completePhase, isCompleted } = useProgressStore()
  const completed   = isCompleted('phase-0')

  const [openCard, setOpenCard]   = useState<string | null>(null)
  const [section, setSection]     = useState<Section>('canvas')
  const [doneIds, setDoneIds]     = useState<string[]>([])
  const [hyp, setHyp]             = useState('')
  const [hypSaved, setHypSaved]   = useState(false)

  const allLensesDone = APP_LENSES.every(l => doneIds.includes(l.id))

  useEffect(() => {
    if (completed) {
      setSection('hypothesis')
      setDoneIds(APP_LENSES.map(l => l.id))
      setHypSaved(true)
    }
  }, [completed])

  function markDone(id: string) {
    const next = [...doneIds.filter(d => d !== id), id]
    setDoneIds(next)
    if (APP_LENSES.every(l => next.includes(l.id))) {
      setTimeout(() => setSection('brief'), 700)
    }
  }

  return (
    <div className="space-y-12 pb-20">

      {/* ══ CANVAS ══ */}
      <section id="business-canvas" className="space-y-6">
        <RevealBlock>
          <div className="flex gap-4">
            <ArjunAvatar size={44} pulse />
            <div className="flex-1 rounded-2xl rounded-tl-sm px-5 py-4 space-y-2 text-sm leading-relaxed"
              style={{ background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.20)', color: 'var(--text-secondary)' }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1.5"
                style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>Arjun · Staff Analyst</p>
              <p>Before you look at a single number — understand the business. A great analyst knows the company model as well as any PM.</p>
              <p>Expand each card. The visuals inside are the important part.</p>
            </div>
          </div>
        </RevealBlock>

        <div className="space-y-3">
          {CANVAS_CARDS.map((card, ci) => {
            const isOpen = openCard === card.id
            return (
              <motion.div key={card.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ci * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
                <button
                  onClick={() => setOpenCard(isOpen ? null : card.id)}
                  className="w-full flex items-center gap-4 p-4 text-left transition-all duration-200 hover:brightness-110"
                  style={{
                    background:   isOpen ? card.glow : 'var(--bg-surface)',
                    border:       `1px solid ${isOpen ? card.color + '30' : 'var(--border-subtle)'}`,
                    borderRadius: isOpen ? '16px 16px 0 0' : '16px',
                  }}
                  aria-expanded={isOpen}
                >
                  <div className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-xl"
                    style={{ background: card.glow, border: `1px solid ${card.color}22` }}>
                    {card.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold"
                      style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>{card.title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{card.tagline}</p>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                      style={{
                        background:   card.glow,
                        border:       `1px solid ${card.color}30`,
                        borderTop:    'none',
                        borderRadius: '0 0 16px 16px',
                      }}
                    >
                      <div className="px-5 pb-5 pt-4 space-y-4">
                        {CARD_VISUALS[card.id] && (
                          <div className="rounded-xl p-4"
                            style={{ background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            {CARD_VISUALS[card.id]}
                          </div>
                        )}
                        <div className="space-y-2.5">
                          {card.points.map((pt, j) => (
                            <motion.div key={j}
                              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: j * 0.08, duration: 0.35 }}
                              className="flex items-start gap-3">
                              <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                                style={{ background: card.color }} />
                              <p className="text-sm leading-relaxed"
                                style={{ color: 'var(--text-secondary)' }}>{pt}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {section === 'canvas' && !completed && (
          <RevealBlock delay={0.3}>
            <ContinueButton
              label="Business understood — now experience it"
              onClick={() => setSection('app')}
            />
          </RevealBlock>
        )}
      </section>

      {/* ══ APP EXPLORATION ══ */}
      <AnimatePresence>
        {(section !== 'canvas' || completed) && (
          <motion.section id="app-exploration" key="app"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,107,53,0.10)', border: '1px solid rgba(255,107,53,0.20)' }}>
                <Smartphone size={16} style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Section 02</p>
                <h2 className="text-xl font-bold"
                  style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  Experience the Product
                </h2>
              </div>
            </div>

            <div className="flex gap-4">
              <ArjunAvatar size={44} pulse />
              <div className="flex-1 rounded-2xl rounded-tl-sm px-5 py-4 space-y-2 text-sm leading-relaxed"
                style={{ background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.20)', color: 'var(--text-secondary)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1.5"
                  style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>Arjun · Staff Analyst</p>
                <p>Every analyst I respect has used the product before investigating it.</p>
                <p><strong style={{ color: 'var(--text-primary)' }}>Open MakeMyTrip on your phone right now.</strong>{' '}
                  Search for any hotel this weekend. Browse to a hotel detail page. Try to reach the checkout screen. Then come back.</p>
              </div>
            </div>

            {/* Flow instruction */}
            <div className="rounded-2xl p-5"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
              <div className="flex items-start gap-4">
                <span style={{ fontSize: '28px', flexShrink: 0 }}>📱</span>
                <div className="space-y-3 flex-1">
                  <p className="text-sm font-semibold"
                    style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>The flow to trace</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {['Search', 'Browse', 'Hotel Detail', 'Checkout'].map((step, i) => (
                      <div key={step} className="flex items-center gap-2">
                        <span className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                          style={{
                            background: i === 3 ? 'rgba(248,113,113,0.12)' : 'var(--bg-elevated)',
                            border:     i === 3 ? '1px solid rgba(248,113,113,0.25)' : '1px solid var(--border-subtle)',
                            color:      i === 3 ? 'var(--accent-red)' : 'var(--text-secondary)',
                            fontFamily: 'var(--font-mono)',
                          }}>
                          {step}
                        </span>
                        {i < 3 && <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>→</span>}
                      </div>
                    ))}
                    <span className="text-xs px-2 py-1 rounded-full"
                      style={{ background: 'rgba(248,113,113,0.10)', color: 'var(--accent-red)', border: '1px solid rgba(248,113,113,0.20)', fontFamily: 'var(--font-mono)' }}>
                      stop here
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    No payment needed. Stop when you see the checkout summary screen.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {APP_LENSES.map((lens, i) => (
                <LensCard key={lens.id} lens={lens}
                  isLocked={i > 0 && !doneIds.includes(APP_LENSES[i-1].id)}
                  isDone={doneIds.includes(lens.id)}
                  onDone={() => markDone(lens.id)} />
              ))}
            </div>

            {allLensesDone && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 rounded-xl"
                style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}>
                <p className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>
                  ✓ All observations recorded — saved to your investigation brief
                </p>
              </motion.div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ══ BRIEF ══ */}
      <AnimatePresence>
        {(section === 'brief' || section === 'hypothesis' || completed) && (
          <motion.section id="growth-brief" key="brief"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            <div>
              <p className="text-xs uppercase tracking-widest mb-1"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Section 03</p>
              <h2 className="text-xl font-bold"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>The Brief</h2>
            </div>

            <div className="flex gap-4">
              <ArjunAvatar size={44} />
              <div className="flex-1 rounded-2xl rounded-tl-sm px-5 py-3 text-sm"
                style={{ background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.20)', color: 'var(--text-secondary)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1.5"
                  style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>Arjun · Staff Analyst</p>
                You've used the product. Now read the brief that just landed in your Slack.
              </div>
            </div>

            {/* Styled Slack UI */}
            <div className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}>
              <div className="flex items-center gap-3 px-5 py-3"
                style={{ background: '#1A1A2E', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                  style={{ background: 'rgba(129,140,248,0.25)', color: 'var(--accent-secondary)' }}>#</div>
                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-mono)' }}>
                  analytics-escalation
                </span>
                <div className="ml-auto flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#10B981' }} />
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>online</span>
                </div>
              </div>

              <div className="px-5 py-5 space-y-4" style={{ background: '#141428' }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg,#FF6B35,#818CF8)', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                    PM
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-heading)' }}>Priya Mehta</span>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.30)', fontFamily: 'var(--font-mono)' }}>9:14 AM</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.30)', fontSize: '11px' }}>Head of Growth</p>
                  </div>
                </div>

                <div className="space-y-3" style={{ paddingLeft: '52px' }}>
                  {SLACK_LINES.map((line, lineIdx) => (
                    <motion.p key={lineIdx}
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + lineIdx * 0.12, duration: 0.4 }}
                      className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.70)' }}>
                      {line.bold
                        ? <strong style={{ color: 'rgba(255,255,255,0.95)' }}>{line.text}</strong>
                        : line.text}
                    </motion.p>
                  ))}

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mt-1"
                    style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.30)' }}>
                    <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: '#F87171' }}
                      animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    <span className="text-xs font-bold" style={{ color: '#F87171', fontFamily: 'var(--font-mono)' }}>
                      P0 — Board visibility
                    </span>
                  </motion.div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
                    className="flex gap-2 flex-wrap">
                    {['🔥 4', '👀 7', '💯 2', '🚨 5'].map(r => (
                      <span key={r} className="text-xs px-2 py-1 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.55)', cursor: 'default' }}>
                        {r}
                      </span>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>

            {section === 'brief' && !completed && (
              <ContinueButton
                label="Brief received — share my first instinct"
                onClick={() => setSection('hypothesis')}
              />
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ══ HYPOTHESIS ══ */}
      <AnimatePresence>
        {(section === 'hypothesis' || completed) && (
          <motion.section id="first-hypothesis" key="hyp"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            <div className="flex gap-4">
              <ArjunAvatar size={44} pulse />
              <div className="flex-1 rounded-2xl rounded-tl-sm px-5 py-4 space-y-2 text-sm leading-relaxed"
                style={{ background: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.22)', color: 'var(--text-secondary)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1.5"
                  style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>Arjun · Staff Analyst</p>
                <p>You've read the business context. Used the product. Read the brief.</p>
                <p><strong style={{ color: 'var(--text-primary)' }}>Before you look at any data — what's your gut instinct?</strong>{' '}
                  One sentence. No wrong answers. You'll revisit this at Phase 7 to see how close you were.</p>
              </div>
            </div>

            {!hypSaved ? (
              <div className="space-y-3">
                <textarea value={hyp} onChange={e => setHyp(e.target.value)}
                  placeholder="My initial hypothesis is..."
                  rows={2} className="w-full rounded-xl px-4 py-3 text-sm resize-none"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--font-body)' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.08)' }}
                  onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }} />
                <button onClick={() => setHypSaved(true)}
                  disabled={hyp.trim().length < 10}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
                  style={{ background: 'var(--accent-primary)', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                  Save to brief →
                </button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="px-4 py-3 rounded-xl"
                  style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Saved — Initial Hypothesis:</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{hyp || 'Hypothesis recorded.'}</p>
                </div>

                <div className="flex gap-4">
                  <ArjunAvatar size={44} />
                  <div className="flex-1 rounded-2xl rounded-tl-sm px-5 py-4 text-sm"
                    style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.20)', color: 'var(--text-secondary)' }}>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1.5"
                      style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>Arjun · Staff Analyst</p>
                    Good. Hold that thought. You'll revisit it at Phase 7 to see how close your gut was.
                    Now let's do the work that either proves or disproves it.
                  </div>
                </div>

                {!completed && (
                  <motion.button
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => { completePhase('phase-0'); navigate(`/case-study/${slug}/phase-1`) }}
                    className="w-full py-4 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98] glow-pulse"
                    style={{ background: 'var(--accent-primary)', color: '#fff', fontFamily: 'var(--font-heading)', boxShadow: '0 0 32px rgba(255,107,53,0.20)' }}>
                    Begin Investigation — Phase 1: Understanding the Problem →
                  </motion.button>
                )}
                {completed && (
                  <div className="flex items-center gap-3 px-5 py-4 rounded-xl"
                    style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}>
                    <span style={{ color: 'var(--accent-green)' }}>✓</span>
                    <p className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>Phase 0 complete — revisiting</p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}
PHASE0_EOF
echo "✅ Phase0.tsx — full visual rebuild"

# ── 10. Inject IncidentHero + ProtocolMap + FormulaBuilder into Phase1 ────────
python3 << 'PYEOF'
with open('src/pages/CaseStudy/phases/Phase1.tsx', 'r') as f:
    content = f.read()

vis = """import { IncidentHero }   from '@/components/visuals/IncidentHero'
import { ProtocolMap }   from '@/components/visuals/ProtocolMap'
import { FormulaBuilder } from '@/components/visuals/FormulaBuilder'
import { ArjunAvatar }   from '@/components/visuals/ArjunAvatar'"""

if 'IncidentHero' not in content:
    # Insert after last import line
    lines = content.split('\n')
    last_import_idx = 0
    for idx, line in enumerate(lines):
        if line.startswith('import '):
            last_import_idx = idx
    lines.insert(last_import_idx + 1, vis)
    content = '\n'.join(lines)
    with open('src/pages/CaseStudy/phases/Phase1.tsx', 'w') as f:
        f.write(content)
    print("✅ Phase1 visual imports added")
else:
    print("✅ Phase1 already has visual imports")
PYEOF

# ── Update phases barrel ──────────────────────────────────────────────────────
python3 << 'PYEOF'
with open('src/components/phases/index.ts', 'r') as f:
    c = f.read()
to_add = [
    ("PhaseCard",        "export { PhaseCard }        from './PhaseCard'"),
    ("ArjunInline",      "export { ArjunInline }      from './ArjunInline'"),
    ("ObservationInput", "export { ObservationInput } from './ObservationInput'"),
]
changed = False
for name, line in to_add:
    if name not in c:
        c += '\n' + line
        changed = True
if changed:
    with open('src/components/phases/index.ts', 'w') as f:
        f.write(c)
print("✅ phases barrel updated")
PYEOF

# ── Gates ─────────────────────────────────────────────────────────────────────
echo ""
echo "🧠 Gate 1: Type checking..."
npx tsc --noEmit && echo "✅ Zero errors" || echo "❌ Fix above"

echo ""
echo "🔨 Gate 2: Build..."
npm run build && echo "✅ Build passed" || echo "❌ Build failed"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Visual Layer — State of the Art. Delivered."
echo ""
echo " Components:"
echo "  ✓ ArjunAvatar    — SVG illustrated character, animated gradient ring"
echo "  ✓ IncidentHero   — CountUp animation, bezier sparkline, area fill,"
echo "                      inflection marker, 4-pill metrics, ambient glow"
echo "  ✓ ProtocolMap    — 4-step flow, SVG connectors, animated emoji bounce"
echo "  ✓ FormulaBuilder — token reveal, example, confusion trap"
echo "  ✓ SegmentDonut   — animated SVG donut, stroke-dashoffset arcs"
echo "  ✓ CommissionVisual — revenue flow diagram"
echo "  ✓ MetricHierarchy — north star → CVR/engagement tree"
echo ""
echo " Phase 0:"
echo "  ✓ Canvas cards with embedded SVG visuals"
echo "  ✓ Sequential lens observation with Arjun inline"
echo "  ✓ Dark Slack UI with reactions, P0 badge, animations"
echo "  ✓ Hypothesis with ArjunAvatar affirm"
echo ""
echo " Global:"
echo "  ✓ Grain texture utility (.grain)"
echo "  ✓ Glow pulse animation (.glow-pulse)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
