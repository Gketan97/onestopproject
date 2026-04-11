import { useState } from 'react'
import { motion }   from 'framer-motion'

interface WeekPoint {
  week:   string
  value:  number
  wLabel: string
}

// 32 weeks of data — W1-W24 stable, W25+ drops
const WOW_DATA: WeekPoint[] = [
  { week: 'W01', wLabel: 'Feb', value: 12.1 },
  { week: 'W02', wLabel: 'Feb', value: 12.0 },
  { week: 'W03', wLabel: 'Mar', value: 12.2 },
  { week: 'W04', wLabel: 'Mar', value: 12.1 },
  { week: 'W05', wLabel: 'Apr', value: 12.0 },
  { week: 'W06', wLabel: 'Apr', value: 12.3 },
  { week: 'W07', wLabel: 'May', value: 12.1 },
  { week: 'W08', wLabel: 'May', value: 12.0 },
  { week: 'W09', wLabel: 'Jun', value: 11.9 },
  { week: 'W10', wLabel: 'Jun', value: 12.1 },
  { week: 'W11', wLabel: 'Jul', value: 12.0 },
  { week: 'W12', wLabel: 'Jul', value: 12.2 },
  { week: 'W13', wLabel: 'Aug', value: 12.1 },
  { week: 'W14', wLabel: 'Aug', value: 11.9 },
  { week: 'W15', wLabel: 'Sep', value: 12.0 },
  { week: 'W16', wLabel: 'Sep', value: 12.1 },
  { week: 'W17', wLabel: 'Oct', value: 12.0 },
  { week: 'W18', wLabel: 'Oct', value: 11.8 },
  { week: 'W19', wLabel: 'Nov', value: 11.7 },
  { week: 'W20', wLabel: 'Nov', value: 11.9 },
  { week: 'W21', wLabel: 'Dec', value: 12.1 },
  { week: 'W22', wLabel: 'Dec', value: 12.2 },
  { week: 'W23', wLabel: 'Jan', value: 12.0 },
  { week: 'W24', wLabel: 'Jan', value: 11.9 },
  // Drop starts W25 — steady −0.2pp per week
  { week: 'W25', wLabel: 'Feb', value: 11.7 },
  { week: 'W26', wLabel: 'Feb', value: 11.5 },
  { week: 'W27', wLabel: 'Mar', value: 11.3 },
  { week: 'W28', wLabel: 'Mar', value: 11.1 },
  { week: 'W29', wLabel: 'Apr', value: 10.9 },
  { week: 'W30', wLabel: 'Apr', value: 10.7 },
  { week: 'W31', wLabel: 'May', value: 10.3 },
  { week: 'W32', wLabel: 'May', value: 10.1 },
]

// Stats for SD bands
const BASELINE   = WOW_DATA.slice(0, 24)
const BASE_MEAN  = BASELINE.reduce((s, d) => s + d.value, 0) / BASELINE.length
const BASE_VAR   = BASELINE.reduce((s, d) => s + Math.pow(d.value - BASE_MEAN, 2), 0) / BASELINE.length
const BASE_SD    = Math.sqrt(BASE_VAR)
const SD1_UPPER  = parseFloat((BASE_MEAN + BASE_SD).toFixed(2))
const SD1_LOWER  = parseFloat((BASE_MEAN - BASE_SD).toFixed(2))

const W = 720; const H = 260
const PL = 48; const PR = 20; const PT = 24; const PB = 36
const IW = W - PL - PR; const IH = H - PT - PB
const N  = WOW_DATA.length
const MIN_V = 9.6; const MAX_V = 12.8

function toX(i: number): number { return PL + (i / (N - 1)) * IW }
function toY(v: number): number { return PT + IH - ((v - MIN_V) / (MAX_V - MIN_V)) * IH }
function makePath(pts: Array<{x:number;y:number}>): string {
  return pts.map((p,i) => `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
}

export function WoWChart({ showBands = false }: { showBands?: boolean }) {
  const [hovered, setHovered] = useState<WeekPoint | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const stablePts = WOW_DATA.slice(0, 25).map((d,i) => ({ x: toX(i), y: toY(d.value) }))
  const dropPts   = WOW_DATA.slice(24).map((d,i)  => ({ x: toX(i+24), y: toY(d.value) }))

  // SD band polygon
  const bandTop = WOW_DATA.slice(0,24).map((_,i) => ({ x: toX(i), y: toY(SD1_UPPER) }))
  const bandBot = WOW_DATA.slice(0,24).map((_,i) => ({ x: toX(i), y: toY(SD1_LOWER) }))
  const bandPath = showBands
    ? [...bandTop, ...[...bandBot].reverse()]
        .map((p,i) => `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + 'Z'
    : ''

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const svgX  = ((e.clientX - rect.left) / rect.width) * W
    const idx   = Math.max(0, Math.min(N-1, Math.round(((svgX-PL)/IW)*(N-1))))
    setHovered(WOW_DATA[idx])
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid var(--border-subtle)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4"
        style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <p className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            MakeMyTrip · Week-on-Week · 8 months
          </p>
          <p className="text-sm font-semibold mt-0.5"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            Bookings/DAU (%)
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-px" style={{ background: 'var(--accent-green)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Stable</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-px" style={{ background: 'var(--accent-red)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Steady drop</span>
          </div>
          {showBands && (
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-3 rounded" style={{ background: 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.30)' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>±1 SD</span>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="px-3 py-3 relative" style={{ background: 'var(--bg-elevated)' }}>
        <svg viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', overflow: 'visible', cursor: 'crosshair' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHovered(null)}>

          {/* Grid */}
          {[10.0, 10.5, 11.0, 11.5, 12.0, 12.5].map(v => (
            <g key={v}>
              <line x1={PL} y1={toY(v)} x2={PL+IW} y2={toY(v)}
                stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              <text x={PL-6} y={toY(v)} textAnchor="end" dominantBaseline="middle"
                fill="rgba(160,152,144,0.5)" fontSize="9" fontFamily="var(--font-mono)">{v.toFixed(1)}</text>
            </g>
          ))}

          {/* SD band */}
          {showBands && (
            <>
              <path d={bandPath} fill="rgba(129,140,248,0.08)" stroke="none" />
              <line x1={PL} y1={toY(SD1_UPPER)} x2={toX(23)} y2={toY(SD1_UPPER)}
                stroke="rgba(129,140,248,0.35)" strokeWidth="1" strokeDasharray="4,3" />
              <line x1={PL} y1={toY(SD1_LOWER)} x2={toX(23)} y2={toY(SD1_LOWER)}
                stroke="rgba(129,140,248,0.35)" strokeWidth="1" strokeDasharray="4,3" />
              <text x={toX(23)+4} y={toY(SD1_UPPER)} dominantBaseline="middle"
                fill="rgba(129,140,248,0.7)" fontSize="8" fontFamily="var(--font-mono)">+1σ {SD1_UPPER}</text>
              <text x={toX(23)+4} y={toY(SD1_LOWER)} dominantBaseline="middle"
                fill="rgba(129,140,248,0.7)" fontSize="8" fontFamily="var(--font-mono)">−1σ {SD1_LOWER}</text>
              <text x={toX(23)+4} y={toY(BASE_MEAN)} dominantBaseline="middle"
                fill="rgba(129,140,248,0.5)" fontSize="8" fontFamily="var(--font-mono)">μ {BASE_MEAN.toFixed(2)}</text>
            </>
          )}

          {/* Drop zone */}
          <rect x={toX(24)} y={PT} width={toX(31)-toX(24)} height={IH}
            fill="rgba(248,113,113,0.04)" />
          <line x1={toX(24)} y1={PT} x2={toX(24)} y2={PT+IH}
            stroke="rgba(248,113,113,0.4)" strokeWidth="1.5" strokeDasharray="5,4" />
          <text x={toX(24)+5} y={PT+14}
            fill="rgba(248,113,113,0.7)" fontSize="9" fontWeight="700" fontFamily="var(--font-mono)">
            Steady drop begins
          </text>

          {/* Axes */}
          <line x1={PL} y1={PT} x2={PL} y2={PT+IH} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <line x1={PL} y1={PT+IH} x2={PL+IW} y2={PT+IH} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

          {/* Lines */}
          <motion.path d={makePath(stablePts)} fill="none" stroke="var(--accent-green)"
            strokeWidth="2.5" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }} />
          <motion.path d={makePath(dropPts)} fill="none" stroke="var(--accent-red)"
            strokeWidth="2.5" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 1.2, duration: 0.8, ease: 'easeInOut' }} />

          {/* Dots */}
          {WOW_DATA.map((d,i) => (
            <circle key={d.week} cx={toX(i)} cy={toY(d.value)}
              r={hovered?.week === d.week ? 5.5 : 3}
              fill={i < 24 ? 'var(--accent-green)' : 'var(--accent-red)'}
              style={{ transition: 'r 0.12s ease' }} />
          ))}

          {/* Month labels — only unique */}
          {WOW_DATA.reduce<Array<{ label: string; i: number }>>((acc, d, i) => {
            const last = acc[acc.length - 1]
            if (!last || last.label !== d.wLabel) acc.push({ label: d.wLabel, i })
            return acc
          }, []).map(({ label, i }) => (
            <text key={`${label}-${i}`} x={toX(i)} y={PT+IH+18}
              textAnchor="middle"
              fill={i >= 24 ? 'rgba(248,113,113,0.6)' : 'rgba(160,152,144,0.4)'}
              fontSize="9" fontFamily="var(--font-mono)">{label}</text>
          ))}

          {/* Hover crosshair */}
          {hovered && (
            <line x1={toX(WOW_DATA.indexOf(hovered))} y1={PT}
              x2={toX(WOW_DATA.indexOf(hovered))} y2={PT+IH}
              stroke="rgba(255,255,255,0.10)" strokeWidth="1" strokeDasharray="4,4" />
          )}
        </svg>

        {/* Tooltip */}
        {hovered && (
          <div className="absolute pointer-events-none px-3 py-2 rounded-xl text-xs space-y-1"
            style={{
              left: Math.min(mousePos.x + 12, 560),
              top:  Math.max(mousePos.y - 56, 4),
              background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
              fontFamily: 'var(--font-mono)', minWidth: '130px',
            }}>
            <p style={{ color: 'var(--text-muted)' }}>{hovered.week} · {hovered.wLabel}</p>
            <p style={{ color: WOW_DATA.indexOf(hovered) < 24 ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 700 }}>
              {hovered.value.toFixed(1)}% B/DAU
            </p>
            {showBands && WOW_DATA.indexOf(hovered) >= 24 && (
              <p style={{ color: 'rgba(129,140,248,0.8)' }}>
                {((BASE_MEAN - hovered.value) / BASE_SD).toFixed(1)}σ below mean
              </p>
            )}
          </div>
        )}
      </div>

      {/* Stats footer */}
      {showBands && (
        <div className="grid grid-cols-4 gap-px" style={{ background: 'var(--border-subtle)' }}>
          {[
            { label: 'Baseline mean',  value: `${BASE_MEAN.toFixed(2)}%`,  color: 'var(--text-primary)' },
            { label: 'Baseline SD',    value: `±${BASE_SD.toFixed(2)}pp`,  color: 'var(--accent-secondary)' },
            { label: 'Current value',  value: '10.1%',                     color: 'var(--accent-red)' },
            { label: 'Z-score',        value: `${((BASE_MEAN - 10.1) / BASE_SD).toFixed(1)}σ`, color: 'var(--accent-red)' },
          ].map(({ label, value, color }) => (
            <div key={label} className="px-4 py-3 text-center"
              style={{ background: 'var(--bg-surface)' }}>
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</p>
              <p className="text-base font-bold" style={{ color, fontFamily: 'var(--font-heading)' }}>{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
