#!/usr/bin/env bash
# PHASE 1 DEEP REBUILD
# Progressive reveal + open seasonality + Arjun dialogue
# Contracts enforced: UI_CONTRACT | BUG_AUDIT | CODE_QUALITY | DEBT_REGISTER

set -euo pipefail

echo "📋 Phase 1 Deep Rebuild"
echo "────────────────────────────────────"

# ── Gate 0 ────────────────────────────────────────────────────────────────────
echo "📋 Gate 0: Checking contracts..."
MISSING=0
for contract in UI_CONTRACT.md BUG_AUDIT.md CODE_QUALITY.md DEBT_REGISTER.md; do
  [ -f "$contract" ] && echo "  ✅ $contract" || { echo "  ❌ Missing: $contract"; MISSING=1; }
done
[ "$MISSING" = "1" ] && { echo "❌ Run: bash generate_contracts.sh first"; exit 1; }

mkdir -p src/pages/CaseStudy/phases src/components/phases

# ── 1. Reusable ContinueButton ────────────────────────────────────────────────
cat > src/components/phases/ContinueButton.tsx << 'EOF'
import { motion } from 'framer-motion'

interface ContinueButtonProps {
  label:    string
  onClick:  () => void
  disabled?: boolean
}

export function ContinueButton({ label, onClick, disabled = false }: ContinueButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      disabled={disabled}
      className="group flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        background:  'var(--bg-surface)',
        border:      '1px solid var(--border-default)',
        color:       'var(--text-primary)',
        fontFamily:  'var(--font-heading)',
      }}
    >
      <span
        className="w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-200"
        style={{ background: 'var(--accent-primary)' }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 5h6M5 2l3 3-3 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      {label}
    </motion.button>
  )
}
EOF
echo "✅ ContinueButton.tsx"

# ── 2. ArjunMessage ───────────────────────────────────────────────────────────
cat > src/components/phases/ArjunMessage.tsx << 'EOF'
import { motion } from 'framer-motion'

interface ArjunMessageProps {
  children:  React.ReactNode
  delay?:    number
  variant?:  'default' | 'question' | 'feedback' | 'correct'
}

const BORDER_COLOR: Record<string, string> = {
  default:  'var(--border-subtle)',
  question: 'rgba(129,140,248,0.30)',
  feedback: 'rgba(255,107,53,0.25)',
  correct:  'rgba(16,185,129,0.30)',
}

const LABEL_COLOR: Record<string, string> = {
  default:  'var(--accent-secondary)',
  question: 'var(--accent-secondary)',
  feedback: 'var(--accent-primary)',
  correct:  'var(--accent-green)',
}

export function ArjunMessage({ children, delay = 0, variant = 'default' }: ArjunMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-4"
    >
      {/* Avatar */}
      <div
        className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold"
        style={{
          background:  'linear-gradient(135deg, rgba(129,140,248,0.25), rgba(255,107,53,0.25))',
          border:      `1px solid ${BORDER_COLOR[variant]}`,
          color:       'var(--text-primary)',
          fontFamily:  'var(--font-heading)',
        }}
      >
        A
      </div>

      {/* Bubble */}
      <div
        className="flex-1 rounded-2xl rounded-tl-sm px-5 py-4 space-y-2"
        style={{
          background: 'var(--bg-surface)',
          border:     `1px solid ${BORDER_COLOR[variant]}`,
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: LABEL_COLOR[variant], fontFamily: 'var(--font-mono)' }}
        >
          Arjun · Staff Analyst
        </p>
        <div
          className="text-sm leading-relaxed space-y-3"
          style={{ color: 'var(--text-secondary)' }}
        >
          {children}
        </div>
      </div>
    </motion.div>
  )
}
EOF
echo "✅ ArjunMessage.tsx"

# ── 3. ConceptBlock ───────────────────────────────────────────────────────────
cat > src/components/phases/ConceptBlock.tsx << 'EOF'
import { motion } from 'framer-motion'

interface ConceptBlockProps {
  title:     string
  children:  React.ReactNode
  accent?:   string
  delay?:    number
}

export function ConceptBlock({ title, children, accent = 'var(--accent-primary)', delay = 0 }: ConceptBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid var(--border-subtle)' }}
    >
      {/* Title bar */}
      <div
        className="px-5 py-3 flex items-center gap-3"
        style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}
      >
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: accent }}
        />
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
        >
          {title}
        </p>
      </div>
      {/* Body */}
      <div
        className="px-5 py-5 space-y-3 text-sm leading-relaxed"
        style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
      >
        {children}
      </div>
    </motion.div>
  )
}
EOF
echo "✅ ConceptBlock.tsx"

# ── 4. HintCard ───────────────────────────────────────────────────────────────
cat > src/components/phases/HintCard.tsx << 'EOF'
import { motion } from 'framer-motion'
import { Lightbulb } from 'lucide-react'

interface HintCardProps {
  children: React.ReactNode
}

export function HintCard({ children }: HintCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-3 px-5 py-4 rounded-xl"
      style={{
        background: 'rgba(251,191,36,0.06)',
        border:     '1px solid rgba(251,191,36,0.25)',
      }}
    >
      <Lightbulb size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--accent-amber)' }} />
      <div className="text-sm leading-relaxed space-y-1" style={{ color: 'var(--text-secondary)' }}>
        {children}
      </div>
    </motion.div>
  )
}
EOF
echo "✅ HintCard.tsx"

# ── 5. SectionDivider ─────────────────────────────────────────────────────────
cat > src/components/phases/SectionDivider.tsx << 'EOF'
import { motion } from 'framer-motion'

interface SectionDividerProps {
  number: number
  title:  string
}

export function SectionDivider({ number, title }: SectionDividerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-4"
    >
      <span
        className="text-xs font-bold"
        style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', minWidth: '24px' }}
      >
        {String(number).padStart(2, '0')}
      </span>
      <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
      <span
        className="text-xs uppercase tracking-widest"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
      >
        {title}
      </span>
      <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
    </motion.div>
  )
}
EOF
echo "✅ SectionDivider.tsx"

# ── 6. TimeSeriesChart (static SVG, no deps) ──────────────────────────────────
cat > src/components/phases/TimeSeriesChart.tsx << 'EOF'
import { useState } from 'react'
import { motion }   from 'framer-motion'

interface DataPoint {
  day:   number
  value: number
  label: string
}

const TREND_DATA: DataPoint[] = [
  { day: -90, value: 12.0, label: 'Stable baseline' },
  { day: -80, value: 12.1, label: 'Stable baseline' },
  { day: -70, value: 12.0, label: 'Stable baseline' },
  { day: -62, value: 11.6, label: 'First deviation' },
  { day: -55, value: 11.3, label: 'Continues dropping' },
  { day: -45, value: 11.0, label: 'Drop accelerates' },
  { day: -35, value: 10.7, label: 'No recovery' },
  { day: -25, value: 10.4, label: 'Sustained decline' },
  { day: -15, value: 10.2, label: 'Worsening' },
  { day: -7,  value: 10.1, label: 'Current' },
  { day: 0,   value: 10.1, label: 'Today' },
]

// ── Chart constants ───────────────────────────────────────────────────────────
const W  = 680
const H  = 240
const PL = 48
const PR = 24
const PT = 20
const PB = 36
const IW = W - PL - PR
const IH = H - PT - PB
const MIN_VAL = 9.6
const MAX_VAL = 12.4

function toX(day: number): number {
  const minDay = -90
  const maxDay = 0
  return PL + ((day - minDay) / (maxDay - minDay)) * IW
}

function toY(val: number): number {
  return PT + IH - ((val - MIN_VAL) / (MAX_VAL - MIN_VAL)) * IH
}

function buildPath(points: DataPoint[]): string {
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.day).toFixed(1)},${toY(p.value).toFixed(1)}`)
    .join(' ')
}

// ── Component ─────────────────────────────────────────────────────────────────
export function TimeSeriesChart() {
  const [hovered, setHovered] = useState<DataPoint | null>(null)
  const [mouseX,  setMouseX]  = useState(0)
  const [mouseY,  setMouseY]  = useState(0)

  const baselinePoints = TREND_DATA.filter((p) => p.day <= -62)
  const dropPoints     = TREND_DATA.filter((p) => p.day >= -62)

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect  = e.currentTarget.getBoundingClientRect()
    const svgX  = ((e.clientX - rect.left) / rect.width) * W
    const day   = Math.round(-90 + ((svgX - PL) / IW) * 90)
    const clamped = Math.max(-90, Math.min(0, day))
    const closest = TREND_DATA.reduce((prev, curr) =>
      Math.abs(curr.day - clamped) < Math.abs(prev.day - clamped) ? curr : prev
    )
    setHovered(closest)
    setMouseX(e.clientX - rect.left)
    setMouseY(e.clientY - rect.top)
  }

  return (
    <div className="relative rounded-2xl overflow-hidden"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <p className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            MakeMyTrip · Last 90 days
          </p>
          <p className="text-sm font-semibold mt-0.5"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            Bookings/DAU (%)
          </p>
        </div>
        <div className="flex items-center gap-4">
          {[
            { color: 'var(--accent-green)', label: 'Baseline (stable)' },
            { color: 'var(--accent-red)',   label: 'Drop period' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-6 h-px" style={{ background: color }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 py-4 relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', overflow: 'visible', cursor: 'crosshair' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHovered(null)}
        >
          {/* Grid lines */}
          {[9.6, 10.0, 10.5, 11.0, 11.5, 12.0, 12.4].map((v) => (
            <g key={v}>
              <line
                x1={PL} y1={toY(v)} x2={PL + IW} y2={toY(v)}
                stroke="rgba(255,255,255,0.04)" strokeWidth="1"
              />
              <text
                x={PL - 6} y={toY(v)}
                textAnchor="end" dominantBaseline="middle"
                fill="rgba(160,152,144,0.6)" fontSize="9"
                fontFamily="var(--font-mono)"
              >
                {v.toFixed(1)}
              </text>
            </g>
          ))}

          {/* Axes */}
          <line x1={PL} y1={PT} x2={PL} y2={PT + IH}
            stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <line x1={PL} y1={PT + IH} x2={PL + IW} y2={PT + IH}
            stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

          {/* Anomaly zone */}
          <rect
            x={toX(-62)} y={PT}
            width={toX(0) - toX(-62)} height={IH}
            fill="rgba(248,113,113,0.04)"
          />
          <line
            x1={toX(-62)} y1={PT} x2={toX(-62)} y2={PT + IH}
            stroke="rgba(248,113,113,0.4)" strokeWidth="1.5" strokeDasharray="5,4"
          />
          <text
            x={toX(-62) + 6} y={PT + 12}
            fill="rgba(248,113,113,0.7)" fontSize="9"
            fontFamily="var(--font-mono)" fontWeight="700"
          >
            Drop starts
          </text>

          {/* Baseline path */}
          <motion.path
            d={buildPath(baselinePoints)}
            fill="none"
            stroke="var(--accent-green)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />

          {/* Drop path */}
          <motion.path
            d={buildPath(dropPoints)}
            fill="none"
            stroke="var(--accent-red)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.0, duration: 1.0, ease: 'easeInOut' }}
          />

          {/* Data points */}
          {TREND_DATA.map((p) => (
            <circle
              key={p.day}
              cx={toX(p.day)} cy={toY(p.value)}
              r={hovered?.day === p.day ? 6 : 3.5}
              fill={p.day <= -62 ? 'var(--accent-green)' : 'var(--accent-red)'}
              style={{ transition: 'r 0.15s ease' }}
            />
          ))}

          {/* X-axis labels */}
          {[-90, -75, -62, -45, -30, -15, 0].map((d) => (
            <text
              key={d}
              x={toX(d)} y={PT + IH + 18}
              textAnchor="middle"
              fill={d === -62 ? 'rgba(248,113,113,0.7)' : 'rgba(160,152,144,0.5)'}
              fontSize="9"
              fontFamily="var(--font-mono)"
            >
              {d === 0 ? 'Today' : `${d}d`}
            </text>
          ))}

          {/* Hover crosshair */}
          {hovered && (
            <line
              x1={toX(hovered.day)} y1={PT}
              x2={toX(hovered.day)} y2={PT + IH}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          )}
        </svg>

        {/* Tooltip */}
        {hovered && (
          <div
            className="absolute pointer-events-none px-3 py-2 rounded-xl text-xs space-y-1"
            style={{
              left:        Math.min(mouseX + 12, 480),
              top:         Math.max(mouseY - 60, 8),
              background:  'var(--bg-elevated)',
              border:      '1px solid var(--border-default)',
              fontFamily:  'var(--font-mono)',
              minWidth:    '140px',
            }}
          >
            <p style={{ color: 'var(--text-muted)' }}>Day {hovered.day}</p>
            <p style={{ color: hovered.day <= -62 ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 700 }}>
              {hovered.value}% Bookings/DAU
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{hovered.label}</p>
          </div>
        )}
      </div>

      {/* Shape analysis */}
      <div className="px-5 pb-5">
        <div
          className="px-4 py-3 rounded-xl"
          style={{ background: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.15)' }}
        >
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--accent-secondary)' }}>Shape: gradual decay.</strong>
            {' '}Not a cliff — a slope. This eliminates single-event causes (outage, bad deploy).
            Something structural changed around day −62 and compounded over 10 weeks.
          </p>
        </div>
      </div>
    </div>
  )
}
EOF
echo "✅ TimeSeriesChart.tsx"

# ── 7. YoY Chart for seasonality ─────────────────────────────────────────────
cat > src/components/phases/YoYChart.tsx << 'EOF'
import { motion } from 'framer-motion'

interface MonthPoint { month: string; y2024: number; y2025: number | null }

const YOY_DATA: MonthPoint[] = [
  { month: 'Jan', y2024: 12.0, y2025: 10.1 },
  { month: 'Feb', y2024: 12.1, y2025: 10.0 },
  { month: 'Mar', y2024: 12.0, y2025: null  },
  { month: 'Apr', y2024: 11.8, y2025: null  },
  { month: 'May', y2024: 11.9, y2025: null  },
  { month: 'Jun', y2024: 11.7, y2025: null  },
  { month: 'Jul', y2024: 11.5, y2025: null  },
  { month: 'Aug', y2024: 11.3, y2025: null  },
  { month: 'Sep', y2024: 11.6, y2025: null  },
  { month: 'Oct', y2024: 11.1, y2025: null  },
  { month: 'Nov', y2024: 11.0, y2025: null  },
  { month: 'Dec', y2024: 12.2, y2025: null  },
]

const W = 660; const H = 220
const PL = 44; const PR = 20; const PT = 16; const PB = 32
const IW = W - PL - PR; const IH = H - PT - PB
const MIN_V = 9.8; const MAX_V = 12.6
const N = YOY_DATA.length

function toX(i: number): number { return PL + (i / (N - 1)) * IW }
function toY(v: number): number { return PT + IH - ((v - MIN_V) / (MAX_V - MIN_V)) * IH }

function makePath(points: Array<{ x: number; y: number }>): string {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
}

export function YoYChart() {
  const pts2024 = YOY_DATA.map((d, i) => ({ x: toX(i), y: toY(d.y2024) }))
  const pts2025 = YOY_DATA.filter((d) => d.y2025 !== null).map((d, i) => ({ x: toX(i), y: toY(d.y2025 as number) }))

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid var(--border-subtle)' }}>
      <div className="flex items-center justify-between px-5 py-4"
        style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <p className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Year-over-Year Comparison
          </p>
          <p className="text-sm font-semibold mt-0.5"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            Bookings/DAU — 2024 vs 2025
          </p>
        </div>
        <div className="flex items-center gap-4">
          {[
            { color: 'rgba(160,152,144,0.5)', label: '2024', dash: true  },
            { color: 'var(--accent-red)',     label: '2025', dash: false },
          ].map(({ color, label, dash }) => (
            <div key={label} className="flex items-center gap-1.5">
              <svg width="20" height="10">
                <line x1="0" y1="5" x2="20" y2="5"
                  stroke={color} strokeWidth="2"
                  strokeDasharray={dash ? '5,3' : 'none'} />
              </svg>
              <span className="text-xs"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-4" style={{ background: 'var(--bg-elevated)' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', overflow: 'visible' }}>
          {[10.0, 10.5, 11.0, 11.5, 12.0].map((v) => (
            <g key={v}>
              <line x1={PL} y1={toY(v)} x2={PL + IW} y2={toY(v)}
                stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              <text x={PL - 6} y={toY(v)} textAnchor="end" dominantBaseline="middle"
                fill="rgba(160,152,144,0.5)" fontSize="9" fontFamily="var(--font-mono)">
                {v.toFixed(1)}
              </text>
            </g>
          ))}

          {/* Oct-Nov seasonal zone annotation */}
          <rect x={toX(9)} y={PT} width={toX(10) - toX(9)} height={IH}
            fill="rgba(251,191,36,0.06)" />
          <text x={(toX(9) + toX(10)) / 2} y={PT + 11}
            textAnchor="middle" fill="rgba(251,191,36,0.6)"
            fontSize="8" fontFamily="var(--font-mono)" fontWeight="700">
            Seasonal dip
          </text>

          {/* 2024 line */}
          <motion.path d={makePath(pts2024)} fill="none"
            stroke="rgba(160,152,144,0.4)" strokeWidth="2.5"
            strokeDasharray="6,4" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }} />

          {/* 2025 line */}
          <motion.path d={makePath(pts2025)} fill="none"
            stroke="var(--accent-red)" strokeWidth="3" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.8, duration: 0.8, ease: 'easeInOut' }} />

          {/* Points */}
          {pts2024.map((p, i) => (
            <circle key={`24-${i}`} cx={p.x} cy={p.y} r="3"
              fill="rgba(160,152,144,0.4)" />
          ))}
          {pts2025.map((p, i) => (
            <circle key={`25-${i}`} cx={p.x} cy={p.y} r="3.5"
              fill="var(--accent-red)" />
          ))}

          {/* X labels */}
          {YOY_DATA.map((d, i) => (
            <text key={d.month} x={toX(i)} y={PT + IH + 18}
              textAnchor="middle"
              fill={i >= 9 && i <= 10 ? 'rgba(251,191,36,0.6)' : 'rgba(160,152,144,0.4)'}
              fontSize="9" fontFamily="var(--font-mono)">
              {d.month}
            </text>
          ))}
        </svg>
      </div>

      {/* Insight */}
      <div className="px-5 py-4 space-y-2" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="px-4 py-3 rounded-xl"
          style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.20)' }}>
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
            Seasonal pattern detected
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Oct–Nov shows a real seasonal dip in both years (~1pp). This is normal — post-monsoon travel lull.
            It recovers every December with festival bookings.
          </p>
        </div>
        <div className="px-4 py-3 rounded-xl"
          style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.20)' }}>
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>
            Current drop is NOT seasonal
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Jan–Feb 2024 was flat at 12%. Jan–Feb 2025 dropped 1.9pp. Same period, completely different behaviour.
            The current drop breaks the seasonal pattern — this is structural.
          </p>
        </div>
      </div>
    </div>
  )
}
EOF
echo "✅ YoYChart.tsx"

# ── 8. Phase 1 — Full rebuild ─────────────────────────────────────────────────
cat > src/pages/CaseStudy/phases/Phase1.tsx << 'EOF'
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams }       from 'react-router-dom'
import { motion, AnimatePresence }      from 'framer-motion'
import { useProgressStore }             from '@/store/progressStore'
import { useAIPanelStore }              from '@/store/aiPanelStore'
import { ArjunMessage }                 from '@/components/phases/ArjunMessage'
import { ConceptBlock }                 from '@/components/phases/ConceptBlock'
import { ContinueButton }               from '@/components/phases/ContinueButton'
import { HintCard }                     from '@/components/phases/HintCard'
import { SectionDivider }               from '@/components/phases/SectionDivider'
import { TimeSeriesChart }              from '@/components/phases/TimeSeriesChart'
import { YoYChart }                     from '@/components/phases/YoYChart'
import { PromptChip }                   from '@/components/phases/PromptChip'

// ── Types ─────────────────────────────────────────────────────────────────────
type SectionKey = 'definitions' | 'sanity' | 'timeline' | 'seasonality'

interface SectionState {
  visible:   boolean
  completed: boolean
}

type Sections = Record<SectionKey, SectionState>

const SECTION_ORDER: SectionKey[] = ['definitions', 'sanity', 'timeline', 'seasonality']

const INITIAL_SECTIONS: Sections = {
  definitions: { visible: true,  completed: false },
  sanity:      { visible: false, completed: false },
  timeline:    { visible: false, completed: false },
  seasonality: { visible: false, completed: false },
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Phase1() {
  const { slug }        = useParams<{ slug: string }>()
  const navigate         = useNavigate()
  const { completePhase, isCompleted } = useProgressStore()
  const openWithContent  = useAIPanelStore((s) => s.openWithContent)
  const phaseCompleted   = isCompleted('phase-1')

  const [sections, setSections]       = useState<Sections>(INITIAL_SECTIONS)
  const [userApproach, setUserApproach] = useState('')
  const [showHint, setShowHint]       = useState(false)
  const [yoyRevealed, setYoyRevealed] = useState(false)
  const [userInsight, setUserInsight] = useState('')
  const [insightFeedback, setInsightFeedback] = useState<'idle' | 'evaluating' | 'done'>('idle')
  const [arjunFeedback, setArjunFeedback] = useState('')
  const seasonRef = useRef<HTMLDivElement>(null)

  // If phase already completed — show all sections
  useEffect(() => {
    if (phaseCompleted) {
      setSections({
        definitions: { visible: true, completed: true },
        sanity:      { visible: true, completed: true },
        timeline:    { visible: true, completed: true },
        seasonality: { visible: true, completed: true },
      })
      setYoyRevealed(true)
    }
  }, [phaseCompleted])

  function revealNext(current: SectionKey) {
    const idx  = SECTION_ORDER.indexOf(current)
    const next = SECTION_ORDER[idx + 1]
    setSections((prev) => ({
      ...prev,
      [current]: { ...prev[current], completed: true },
      ...(next ? { [next]: { ...prev[next], visible: true } } : {}),
    }))
    if (next) {
      setTimeout(() => {
        document.getElementById(`section-${next}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    }
  }

  function handleApproachSubmit() {
    const lower = userApproach.toLowerCase()
    const isRelevant = lower.includes('year') || lower.includes('yoy') ||
      lower.includes('same period') || lower.includes('last year') ||
      lower.includes('compare') || lower.includes('2024')
    if (!isRelevant) {
      setShowHint(true)
    } else {
      setShowHint(false)
      setYoyRevealed(true)
      openWithContent({
        type: 'chart', chartId: 'yoy-comparison', title: 'YoY Bookings/DAU — 2024 vs 2025',
      })
    }
  }

  async function handleInsightSubmit() {
    if (userInsight.trim().length < 20) return
    setInsightFeedback('evaluating')
    await new Promise((r) => setTimeout(r, 1200))

    const lower  = userInsight.toLowerCase()
    const isGood = lower.includes('not seasonal') || lower.includes('structural') ||
      lower.includes('same period') || lower.includes('jan') || lower.includes('feb') ||
      lower.includes('2024') || lower.includes('oct') || lower.includes('nov')

    if (isGood) {
      setArjunFeedback(
        'Exactly right. The Oct–Nov dip is a known seasonal pattern — it appeared in 2024 and recovered by December. The Jan–Feb 2025 drop is a completely different animal: same calendar window as 2024 flat, but now down 1.9pp. That rules out seasonality. You\'re ready to go deeper.',
      )
      setInsightFeedback('done')
    } else {
      setArjunFeedback(
        'Look more carefully at the Jan–Feb window specifically. In 2024, was there a dip in Jan–Feb? Compare that to where we are now. What does the gap between the two lines tell you?',
      )
      setInsightFeedback('done')
    }
  }

  function handlePhaseComplete() {
    completePhase('phase-1')
    navigate(`/case-study/${slug}/phase-2`)
  }

  return (
    <div className="space-y-14">

      {/* ── SECTION 1: Definitions ── */}
      <AnimatePresence>
        {sections.definitions.visible && (
          <motion.section
            id="section-definitions"
            key="definitions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <SectionDivider number={1} title="Definition Clarity" />

            <ArjunMessage delay={0.1}>
              <p>
                Before you look at a single data point, lock down exactly what you're measuring.
                Half of all analytics investigations fail because two people in the same room have
                different definitions of the same metric.
              </p>
              <p>
                Priya said "Bookings/DAU dropped 18%". Let's make sure you know precisely what
                every word in that sentence means — because each one is a potential source of confusion.
              </p>
            </ArjunMessage>

            <ConceptBlock title="What is Bookings/DAU — exactly?" accent="var(--accent-primary)" delay={0.15}>
              <p>
                <strong style={{ color: 'var(--text-primary)' }}>Bookings/DAU</strong> is a ratio metric:
                Total bookings completed in a day, divided by the number of daily active users.
                If 1,000 users open the app and 120 complete a booking, Bookings/DAU = 12%.
              </p>
              <p style={{ marginTop: '8px' }}>
                <strong style={{ color: 'var(--accent-primary)' }}>Why it matters: </strong>
                It answers a single question — "are users converting?". A healthy Bookings/DAU means
                users who show up also buy. A falling ratio means something in that journey broke.
              </p>
              <p style={{ marginTop: '8px' }}>
                <strong style={{ color: 'var(--accent-red)' }}>The confusion trap: </strong>
                Bookings/DAU can fall even if absolute bookings are flat — if DAU grows faster than
                bookings. Always check both the numerator and denominator separately before concluding
                anything. We'll do this in the next section.
              </p>
            </ConceptBlock>

            <ConceptBlock title="Percentage Points vs Percentages — a career-defining distinction" accent="var(--accent-secondary)" delay={0.2}>
              <p>
                Bookings/DAU going from <strong style={{ color: 'var(--text-primary)' }}>12.0% to 10.1%</strong> is
                a <strong style={{ color: 'var(--accent-red)' }}>−1.9 percentage point (pp)</strong> drop.
                It is <em>not</em> a 1.9% drop.
              </p>
              <div
                className="rounded-lg px-4 py-3 space-y-1 mt-2"
                style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}
              >
                <p style={{ color: 'var(--accent-red)', fontWeight: 600, fontSize: '12px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  The mistake most analysts make:
                </p>
                <p>
                  They say "CVR dropped 1.9%". Their manager hears "small change". But 1.9pp on a 12%
                  base is actually a <strong style={{ color: 'var(--text-primary)' }}>15.8% relative decline</strong> in
                  conversion. That's not a rounding error — that's ₹4.2Cr.
                </p>
              </div>
              <p style={{ marginTop: '8px' }}>
                Rule: always say <strong style={{ color: 'var(--text-primary)' }}>pp</strong> for absolute
                differences between percentages. Say <strong style={{ color: 'var(--text-primary)' }}>%</strong> only
                for relative changes. In a board presentation, confusing these destroys credibility.
              </p>
            </ConceptBlock>

            <ConceptBlock title="What exactly counts as a DAU?" accent="var(--accent-green)" delay={0.25}>
              <p>
                DAU at MMT = <strong style={{ color: 'var(--text-primary)' }}>logged-in unique users</strong> who
                open the app or web with intent on a given calendar day. Not anonymous visitors. Not bots.
                Not deep-link redirects that bounce in under 3 seconds.
              </p>
              <p style={{ marginTop: '8px' }}>
                <strong style={{ color: 'var(--accent-green)' }}>Why logged-in only: </strong>
                Anonymous users have near-zero booking intent. Including them inflates the denominator
                and makes CVR look artificially low. Using logged-in DAU gives you a qualified demand signal —
                people who actually have accounts and might buy.
              </p>
              <p style={{ marginTop: '8px' }}>
                <strong style={{ color: 'var(--accent-red)' }}>If this definition changed mid-period: </strong>
                Say engineering filtered 200K bot accounts from DAU in week −8. DAU drops by 200K.
                Bookings/DAU spikes — not because more people booked, but because the denominator shrank.
                This is why data sanity checks come before hypotheses. We'll verify this next.
              </p>
            </ConceptBlock>

            <ConceptBlock title="Bookings — gross or net?" accent="var(--accent-primary)" delay={0.3}>
              <p>
                MMT tracks <strong style={{ color: 'var(--text-primary)' }}>Gross Completed Payments</strong> as
                the booking metric — not net bookings (post-cancellation).
              </p>
              <p style={{ marginTop: '8px' }}>
                <strong style={{ color: 'var(--accent-primary)' }}>Why gross: </strong>
                Gross bookings capture purchase intent at the moment of conversion. They're clean.
                Net bookings fluctuate with cancellation policy changes, refund processing delays,
                and seasonal cancellation spikes — all of which are operations problems, not demand problems.
                For a growth investigation, gross is the right signal.
              </p>
            </ConceptBlock>

            {!sections.definitions.completed && (
              <div className="flex justify-start pt-2">
                <ContinueButton
                  label="Clear on definitions — show me the data"
                  onClick={() => revealNext('definitions')}
                />
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── SECTION 2: Data Sanity ── */}
      <AnimatePresence>
        {sections.sanity.visible && (
          <motion.section
            id="section-sanity"
            key="sanity"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <SectionDivider number={2} title="Data Sanity Checks" />

            <ArjunMessage delay={0.1}>
              <p>
                You have the definitions. Now before you form a single hypothesis, run these checks.
                A metric drop can be real or it can be a data artifact. Chasing a ghost costs weeks.
              </p>
              <p>
                Four checks. All verified for this investigation — but you need to understand
                what each one is looking for and why skipping it is dangerous.
              </p>
            </ArjunMessage>

            {/* Check 1 */}
            <ConceptBlock title="Check 1 — Absolute Bookings: are they actually flat?" accent="var(--accent-primary)" delay={0.15}>
              <p>
                Before trusting the ratio, look at the numerator in isolation.
                If absolute bookings crashed from 820K/day to 650K/day, that's one story.
                If absolute bookings are <em>flat at 820K/day</em> while DAU grew, that's a completely
                different story — and a much more subtle one.
              </p>
              <div
                className="grid grid-cols-3 gap-3 mt-3 rounded-xl overflow-hidden"
                style={{ border: '1px solid var(--border-subtle)' }}
              >
                {[
                  { label: 'Before (avg)', value: '821K/day', color: 'var(--accent-green)' },
                  { label: 'After (avg)',  value: '819K/day', color: 'var(--accent-green)' },
                  { label: 'Change',       value: '−0.2%',    color: 'var(--accent-green)' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="px-4 py-3 text-center"
                    style={{ background: 'var(--bg-surface)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</p>
                    <p className="text-lg font-bold" style={{ color, fontFamily: 'var(--font-heading)' }}>{value}</p>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: '10px' }}>
                <strong style={{ color: 'var(--accent-green)' }}>Verdict: </strong>
                Absolute bookings are essentially flat. This rules out a catastrophic failure.
                Whatever broke isn't stopping people from completing bookings entirely —
                it's reducing the <em>rate</em> at which a growing user base converts.
                The problem lives in efficiency, not volume.
              </p>
            </ConceptBlock>

            {/* Check 2 */}
            <ConceptBlock title="Check 2 — Absolute DAU: did it actually grow?" accent="var(--accent-secondary)" delay={0.2}>
              <p>
                Now check the denominator. If DAU growth is real, the falling ratio makes sense.
                But if DAU only "grew" because the definition changed — bots removed, anonymous
                traffic reclassified — then the ratio movement is an artifact.
              </p>
              <div
                className="grid grid-cols-3 gap-3 mt-3 rounded-xl overflow-hidden"
                style={{ border: '1px solid var(--border-subtle)' }}
              >
                {[
                  { label: 'Before (avg)', value: '10.0M/day', color: 'var(--accent-secondary)' },
                  { label: 'After (avg)',  value: '11.5M/day', color: 'var(--accent-red)'       },
                  { label: 'Change',       value: '+15%',      color: 'var(--accent-red)'       },
                ].map(({ label, value, color }) => (
                  <div key={label} className="px-4 py-3 text-center"
                    style={{ background: 'var(--bg-surface)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</p>
                    <p className="text-lg font-bold" style={{ color, fontFamily: 'var(--font-heading)' }}>{value}</p>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: '10px' }}>
                <strong style={{ color: 'var(--accent-secondary)' }}>Verdict: </strong>
                DAU genuinely grew +15% — verified against session logs, not just analytics events.
                No definition change, no bot filter applied in this window. The growth is real.
                This means 1.5M more users opened the app daily — but almost none of them booked.
                That's the core mystery.
              </p>
            </ConceptBlock>

            {/* Check 3 */}
            <ConceptBlock title="Check 3 — Cross-validate: does the math add up?" accent="var(--accent-green)" delay={0.25}>
              <p>
                Cross-check the analytics pipeline against the payment gateway.
                If analytics shows 819K bookings/day but the payment gateway processed 821K transactions,
                the 2K gap is noise. If analytics shows 819K but gateway shows 950K, your tracking is broken.
              </p>
              <div
                className="px-4 py-3 rounded-xl mt-3"
                style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}
              >
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--accent-green)' }}>✓ Verified: </strong>
                  Analytics pipeline and payment gateway are within 0.3% of each other across the full 90-day window.
                  No tracking breakage. The drop you see in the dashboard is real.
                </p>
              </div>
            </ConceptBlock>

            {/* Check 4 */}
            <ConceptBlock title="Check 4 — Any reported data incidents in this window?" accent="var(--accent-primary)" delay={0.3}>
              <p>
                Check with the data engineering team: were there ETL failures, pipeline delays,
                or schema changes in the past 90 days that could have affected the bookings or DAU tables?
                A 4-hour ETL delay on a daily dashboard makes day-over-day comparisons unreliable.
              </p>
              <div
                className="px-4 py-3 rounded-xl mt-3"
                style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}
              >
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--accent-green)' }}>✓ Verified: </strong>
                  Data engineering confirmed zero incidents in this 90-day window. No schema migrations,
                  no ETL failures, no backfills. The data is clean and trustworthy.
                </p>
              </div>
              <p style={{ marginTop: '10px', color: 'var(--text-muted)', fontSize: '12px' }}>
                With all four checks clear, you can now trust the data. The drop is real, the definitions
                are solid, and the pipeline is healthy. Time to look at when exactly this started.
              </p>
            </ConceptBlock>

            {!sections.sanity.completed && (
              <div className="flex justify-start pt-2">
                <ContinueButton
                  label="Data checks passed — show me the timeline"
                  onClick={() => revealNext('sanity')}
                />
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── SECTION 3: Timeline ── */}
      <AnimatePresence>
        {sections.timeline.visible && (
          <motion.section
            id="section-timeline"
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <SectionDivider number={3} title="Timeline Review" />

            <ArjunMessage delay={0.1}>
              <p>
                The shape of a metric drop is one of the most underrated diagnostic tools in analytics.
                Before you form any hypothesis, read the chart like a story. I'll show you what to look for.
              </p>
            </ArjunMessage>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <TimeSeriesChart />
            </motion.div>

            <ConceptBlock title="How to read the shape — gradual decay vs sudden crash" accent="var(--accent-secondary)" delay={0.25}>
              <p>
                <strong style={{ color: 'var(--text-primary)' }}>Sudden crash</strong> (overnight −30%):
                Points to a single triggering event — payment gateway outage, app crash, a bad A/B test
                that went full rollout. Investigation is straightforward: find the event, roll it back.
              </p>
              <p style={{ marginTop: '8px' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Gradual decay</strong> (−0.2pp/week over 10 weeks):
                Points to something structural — a product change with compounding effects, supply quality
                degrading slowly, or a competitive shift that takes time to manifest in behaviour.
                Much harder to find. Requires segmentation, not just log-searching.
              </p>
              <p style={{ marginTop: '8px' }}>
                <strong style={{ color: 'var(--accent-red)' }}>This chart shows gradual decay. </strong>
                The drop started around day −62 and worsened steadily. No sudden cliff.
                This tells you: don't search for a single bad event. Search for what changed
                60 days ago that compounded silently over 10 weeks.
              </p>
            </ConceptBlock>

            <div className="flex flex-wrap gap-2">
              <PromptChip
                label="Why does day −62 matter?"
                content={{ type: 'insight', title: 'Day −62 Significance', text: 'Day −62 is your investigation anchor. Something changed on or just before this date. In your next steps, you\'ll check: what deploys happened around day −62? What supply changes? What A/B tests launched? The gradual nature means it wasn\'t one catastrophic event — it was likely a change with a compounding flywheel effect.' }}
              />
              <PromptChip
                label="What if the drop was sudden instead?"
                content={{ type: 'insight', title: 'Sudden Drop Investigation', text: 'A sudden drop completely changes the investigation. First check: payment gateway logs (outage?), app crash reports (iOS/Android?), recent deploys that went 100% rollout overnight. For sudden drops, time-to-diagnosis is measured in hours, not weeks. You\'d alert on-call, pull logs, and rollback the last deploy within the hour.' }}
              />
            </div>

            {!sections.timeline.completed && (
              <div className="flex justify-start pt-2">
                <ContinueButton
                  label="I see the pattern — now check seasonality"
                  onClick={() => revealNext('timeline')}
                />
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── SECTION 4: Seasonality ── */}
      <AnimatePresence>
        {sections.seasonality.visible && (
          <motion.section
            id="section-seasonality"
            key="seasonality"
            ref={seasonRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <SectionDivider number={4} title="Seasonality Check" />

            <ArjunMessage variant="question" delay={0.1}>
              <p>
                Travel is deeply seasonal. Bookings spike around holidays, dip post-monsoon,
                surge before summer. Before we call this a product problem, we need to rule out
                the possibility that this is just a normal annual pattern.
              </p>
              <p>
                <strong style={{ color: 'var(--accent-secondary)' }}>Your turn to think. </strong>
                How would you verify that this drop isn't simply seasonality?
                What data would you ask for, and what would you be looking for in it?
              </p>
            </ArjunMessage>

            {/* User input */}
            {!yoyRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="space-y-3"
              >
                <textarea
                  value={userApproach}
                  onChange={(e) => setUserApproach(e.target.value)}
                  placeholder="Describe your approach — what data would you pull and what would you look for?"
                  rows={3}
                  className="w-full rounded-xl px-4 py-3 text-sm resize-none transition-all duration-200"
                  style={{
                    background:  'var(--bg-surface)',
                    border:      '1px solid var(--border-default)',
                    color:       'var(--text-primary)',
                    fontFamily:  'var(--font-body)',
                    outline:     'none',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-secondary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.12)' }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--border-default)';   e.currentTarget.style.boxShadow = 'none' }}
                />
                <motion.button
                  onClick={handleApproachSubmit}
                  disabled={userApproach.trim().length < 10}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background:  'var(--accent-secondary)',
                    color:       '#fff',
                    fontFamily:  'var(--font-heading)',
                  }}
                >
                  Submit my approach →
                </motion.button>
              </motion.div>
            )}

            {/* Hint card */}
            <AnimatePresence>
              {showHint && !yoyRevealed && (
                <HintCard>
                  <p>
                    <strong style={{ color: 'var(--accent-amber)' }}>Hint: </strong>
                    The strongest way to rule out seasonality is a year-over-year comparison.
                    Ask Arjun for Bookings/DAU data for Jan–Feb 2024 versus Jan–Feb 2025 —
                    the same calendar period, one year apart.
                    If 2024 showed the same dip, it's seasonal. If 2024 was flat, it's structural.
                  </p>
                  <button
                    onClick={() => {
                      setShowHint(false)
                      setYoyRevealed(true)
                      openWithContent({
                        type: 'chart', chartId: 'yoy-comparison',
                        title: 'YoY Bookings/DAU — 2024 vs 2025',
                      })
                    }}
                    className="mt-2 text-xs font-semibold underline underline-offset-2"
                    style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}
                  >
                    Ask Arjun: Show me Jan–Feb 2024 vs 2025 Bookings/DAU →
                  </button>
                </HintCard>
              )}
            </AnimatePresence>

            {/* YoY chart revealed */}
            <AnimatePresence>
              {yoyRevealed && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-5"
                >
                  <ArjunMessage variant="feedback" delay={0.1}>
                    <p>
                      Good instinct. Here's the year-over-year comparison.
                      Read it carefully — both the Jan–Feb window and the Oct–Nov window tell you something.
                    </p>
                  </ArjunMessage>

                  <YoYChart />

                  <ArjunMessage variant="question" delay={0.2}>
                    <p>
                      Two patterns visible in that chart. What do you conclude?
                      Write your full insight — what's seasonal, what isn't, and how you know.
                    </p>
                  </ArjunMessage>

                  {/* Insight input */}
                  {insightFeedback !== 'done' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="space-y-3"
                    >
                      <textarea
                        value={userInsight}
                        onChange={(e) => setUserInsight(e.target.value)}
                        placeholder="Write your insight from the chart — what's seasonal and what isn't?"
                        rows={3}
                        className="w-full rounded-xl px-4 py-3 text-sm resize-none transition-all duration-200"
                        style={{
                          background: 'var(--bg-surface)',
                          border:     '1px solid var(--border-default)',
                          color:      'var(--text-primary)',
                          fontFamily: 'var(--font-body)',
                          outline:    'none',
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-secondary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.12)' }}
                        onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--border-default)';   e.currentTarget.style.boxShadow = 'none' }}
                      />
                      <motion.button
                        onClick={handleInsightSubmit}
                        disabled={userInsight.trim().length < 20 || insightFeedback === 'evaluating'}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                        style={{ background: 'var(--accent-secondary)', color: '#fff', fontFamily: 'var(--font-heading)' }}
                      >
                        {insightFeedback === 'evaluating' && (
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        {insightFeedback === 'evaluating' ? 'Arjun is reading...' : 'Submit insight →'}
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Arjun feedback */}
                  <AnimatePresence>
                    {insightFeedback === 'done' && arjunFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                        className="space-y-5"
                      >
                        <ArjunMessage variant="correct" delay={0}>
                          <p>{arjunFeedback}</p>
                        </ArjunMessage>

                        {/* Phase complete */}
                        {!phaseCompleted && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                          >
                            <button
                              onClick={handlePhaseComplete}
                              className="w-full py-4 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                              style={{
                                background: 'var(--accent-primary)',
                                color:      '#fff',
                                fontFamily: 'var(--font-heading)',
                                boxShadow:  '0 0 24px rgba(255,107,53,0.20)',
                              }}
                            >
                              Seasonality ruled out — Begin Metric Decomposition →
                            </button>
                          </motion.div>
                        )}

                        {phaseCompleted && (
                          <div
                            className="flex items-center gap-3 px-5 py-4 rounded-xl"
                            style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}
                          >
                            <span style={{ color: 'var(--accent-green)', fontSize: '18px' }}>✓</span>
                            <p className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>
                              Phase 1 complete — revisiting completed content
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Prompt chips */}
            <div className="flex flex-wrap gap-2">
              <PromptChip
                label="What is YoY comparison?"
                content={{ type: 'insight', title: 'Year-over-Year Explained', text: 'YoY comparison takes the same metric for the same calendar period, one year apart. Jan 2025 vs Jan 2024. This controls for seasonal effects. If both years show the same dip in November, that\'s seasonal. If only 2025 dips, something changed in 2025.' }}
              />
              <PromptChip
                label="Show full 2024 seasonality"
                content={{ type: 'chart', chartId: 'yoy-comparison', title: 'Full Year 2024 vs 2025 Seasonality' }}
              />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}
EOF
echo "✅ Phase1.tsx (full rebuild)"

# ── 9. Update barrel exports ──────────────────────────────────────────────────
cat > src/components/phases/index.ts << 'EOF'
export { MCQ }            from './MCQ'
export { SectionBadge }   from './SectionBadge'
export { PromptChip }     from './PromptChip'
export { ContinueButton } from './ContinueButton'
export { ArjunMessage }   from './ArjunMessage'
export { ConceptBlock }   from './ConceptBlock'
export { HintCard }       from './HintCard'
export { SectionDivider } from './SectionDivider'
export { TimeSeriesChart } from './TimeSeriesChart'
export { YoYChart }       from './YoYChart'
EOF
echo "✅ phases/index.ts"

# ── Gate 1: TypeScript ────────────────────────────────────────────────────────
echo ""
echo "🧠 Gate 1: Type checking..."
npx tsc --noEmit && echo "✅ Zero TypeScript errors" || echo "❌ Fix errors above"

# ── Gate 2: Build ─────────────────────────────────────────────────────────────
echo ""
echo "🔨 Gate 2: Build..."
npm run build && echo "✅ Build passed" || echo "❌ Build failed"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Phase 1 deep rebuild complete. Files:"
echo "  src/components/phases/ContinueButton.tsx"
echo "  src/components/phases/ArjunMessage.tsx"
echo "  src/components/phases/ConceptBlock.tsx"
echo "  src/components/phases/HintCard.tsx"
echo "  src/components/phases/SectionDivider.tsx"
echo "  src/components/phases/TimeSeriesChart.tsx"
echo "  src/components/phases/YoYChart.tsx"
echo "  src/pages/CaseStudy/phases/Phase1.tsx (full rebuild)"
echo ""
echo " Experience flow:"
echo "  ✓ Section 1 visible on load — 3 more locked"
echo "  ✓ ContinueButton reveals next section + scrolls"
echo "  ✓ No labels/pills — Arjun narrates naturally"
echo "  ✓ All concepts have: what / why / confusion trap / example"
echo "  ✓ Data sanity: 4 checks, absolute values + cross-validation"
echo "  ✓ Timeline: interactive hover chart with shape analysis"
echo "  ✓ Seasonality: open text → hint if wrong → YoY chart → insight → complete"
echo "  ✓ Completed phases fully revisitable"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
