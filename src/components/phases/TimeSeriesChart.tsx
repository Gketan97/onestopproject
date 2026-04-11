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
