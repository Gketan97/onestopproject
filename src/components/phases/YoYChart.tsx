import { motion } from 'framer-motion'

interface MonthPoint { month: string; y2024: number; y2025: number | null }

// 2024: full year — shows Oct-Nov seasonal dip + Dec recovery
// 2025: Jan-Apr — shows steady non-seasonal drop
const YOY_DATA: MonthPoint[] = [
  { month: 'Jan', y2024: 12.0, y2025: 11.7 },
  { month: 'Feb', y2024: 12.1, y2025: 11.3 },
  { month: 'Mar', y2024: 12.0, y2025: 10.7 },
  { month: 'Apr', y2024: 11.8, y2025: 10.1 },
  { month: 'May', y2024: 11.9, y2025: null  },
  { month: 'Jun', y2024: 11.7, y2025: null  },
  { month: 'Jul', y2024: 11.5, y2025: null  },
  { month: 'Aug', y2024: 11.3, y2025: null  },
  { month: 'Sep', y2024: 11.6, y2025: null  },
  { month: 'Oct', y2024: 11.1, y2025: null  }, // seasonal dip
  { month: 'Nov', y2024: 11.0, y2025: null  }, // seasonal dip
  { month: 'Dec', y2024: 12.2, y2025: null  }, // festival recovery
]

const W = 700; const H = 230
const PL = 44; const PR = 24; const PT = 20; const PB = 32
const IW = W - PL - PR; const IH = H - PT - PB
const MIN_V = 9.5; const MAX_V = 12.8
const N = YOY_DATA.length

function toX(i: number) { return PL + (i / (N-1)) * IW }
function toY(v: number) { return PT + IH - ((v - MIN_V) / (MAX_V - MIN_V)) * IH }
function makePath(pts: Array<{x:number;y:number}>) {
  return pts.map((p,i) => `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
}

export function YoYChart() {
  const pts24 = YOY_DATA.map((d,i) => ({ x: toX(i), y: toY(d.y2024) }))
  const pts25 = YOY_DATA.filter(d => d.y2025 !== null)
    .map((d,i) => ({ x: toX(i), y: toY(d.y2025 as number) }))

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
            { color: 'rgba(160,152,144,0.6)', label: '2024 (full year)', dash: true },
            { color: 'var(--accent-red)',     label: '2025 (Jan–Apr)',   dash: false },
          ].map(({ color, label, dash }) => (
            <div key={label} className="flex items-center gap-1.5">
              <svg width="20" height="10">
                <line x1="0" y1="5" x2="20" y2="5" stroke={color} strokeWidth="2.5"
                  strokeDasharray={dash ? '5,3' : 'none'} />
              </svg>
              <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-3 py-3" style={{ background: 'var(--bg-elevated)' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', overflow: 'visible' }}>
          {[10.0, 10.5, 11.0, 11.5, 12.0].map(v => (
            <g key={v}>
              <line x1={PL} y1={toY(v)} x2={PL+IW} y2={toY(v)}
                stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              <text x={PL-6} y={toY(v)} textAnchor="end" dominantBaseline="middle"
                fill="rgba(160,152,144,0.5)" fontSize="9" fontFamily="var(--font-mono)">{v.toFixed(1)}</text>
            </g>
          ))}

          {/* Oct-Nov seasonal zone — 2024 */}
          <rect x={toX(9)} y={PT} width={toX(11)-toX(9)} height={IH}
            fill="rgba(251,191,36,0.07)" />
          <text x={(toX(9)+toX(11))/2} y={PT+13}
            textAnchor="middle" fill="rgba(251,191,36,0.7)"
            fontSize="9" fontWeight="700" fontFamily="var(--font-mono)">Seasonal dip</text>

          {/* Jan-Apr 2025 drop zone */}
          <rect x={toX(0)} y={PT} width={toX(3)-toX(0)} height={IH}
            fill="rgba(248,113,113,0.05)" />
          <text x={(toX(0)+toX(3))/2} y={PT+13}
            textAnchor="middle" fill="rgba(248,113,113,0.7)"
            fontSize="9" fontWeight="700" fontFamily="var(--font-mono)">Structural drop</text>

          {/* Lines */}
          <motion.path d={makePath(pts24)} fill="none"
            stroke="rgba(160,152,144,0.5)" strokeWidth="2.5"
            strokeDasharray="7,5" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }} />
          <motion.path d={makePath(pts25)} fill="none"
            stroke="var(--accent-red)" strokeWidth="3" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 1.0, duration: 0.7, ease: 'easeInOut' }} />

          {/* Dots */}
          {pts24.map((p,i) => (
            <circle key={`24-${i}`} cx={p.x} cy={p.y} r="3.5"
              fill="rgba(160,152,144,0.5)" />
          ))}
          {pts25.map((p,i) => (
            <circle key={`25-${i}`} cx={p.x} cy={p.y} r="4"
              fill="var(--accent-red)" />
          ))}

          {/* Value labels on 2025 */}
          {pts25.map((p,i) => (
            <text key={`25v-${i}`} x={p.x} y={p.y - 12}
              textAnchor="middle" fill="var(--accent-red)"
              fontSize="9" fontWeight="700" fontFamily="var(--font-mono)">
              {YOY_DATA[i].y2025?.toFixed(1)}
            </text>
          ))}

          {/* Dec recovery annotation */}
          <text x={toX(11)} y={toY(12.2)-14}
            textAnchor="middle" fill="rgba(16,185,129,0.7)"
            fontSize="9" fontWeight="700" fontFamily="var(--font-mono)">
            Festival recovery
          </text>

          {/* X labels */}
          {YOY_DATA.map((d,i) => (
            <text key={d.month} x={toX(i)} y={PT+IH+20}
              textAnchor="middle"
              fill={i >= 9 && i <= 10 ? 'rgba(251,191,36,0.7)' : i <= 3 ? 'rgba(248,113,113,0.6)' : 'rgba(160,152,144,0.4)'}
              fontSize="9" fontFamily="var(--font-mono)">{d.month}</text>
          ))}
        </svg>
      </div>
    </div>
  )
}
