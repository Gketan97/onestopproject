#!/usr/bin/env bash
# PHASE 1 COMPLETE REBUILD
# Brief → Protocol → Definitions → Sanity (user validates) → Timeline (WoW + variance) → Seasonality (open)

set -euo pipefail

echo "📋 Phase 1 Complete Rebuild"
echo "────────────────────────────────────"

for contract in UI_CONTRACT.md BUG_AUDIT.md CODE_QUALITY.md DEBT_REGISTER.md; do
  [ -f "$contract" ] && echo "  ✅ $contract" || { echo "  ❌ $contract missing"; exit 1; }
done

mkdir -p src/pages/CaseStudy/phases src/components/phases

# ── WoW Chart ────────────────────────────────────────────────────────────────
cat > src/components/phases/WoWChart.tsx << 'EOF'
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
EOF
echo "✅ WoWChart.tsx"

# ── YoY Chart with proper seasonal + structural patterns ─────────────────────
cat > src/components/phases/YoYChart.tsx << 'EOF'
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
EOF
echo "✅ YoYChart.tsx"

# ── Phase 1 — full rebuild ────────────────────────────────────────────────────
cat > src/pages/CaseStudy/phases/Phase1.tsx << 'PHASE1_EOF'
import { useState, useEffect }     from 'react'
import { useNavigate, useParams }  from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useProgressStore }        from '@/store/progressStore'
import { useAIPanelStore }         from '@/store/aiPanelStore'
import { RevealBlock }             from '@/components/phases/RevealBlock'
import { MetricCard }              from '@/components/phases/MetricCard'
import { MiniBarChart }            from '@/components/phases/MiniBarChart'
import { ArjunChip }               from '@/components/phases/ArjunChip'
import { ContinueButton }          from '@/components/phases/ContinueButton'
import { SectionHeader }           from '@/components/phases/SectionHeader'
import { WoWChart }                from '@/components/phases/WoWChart'
import { YoYChart }                from '@/components/phases/YoYChart'

// ── Types ─────────────────────────────────────────────────────────────────────
type SectionKey = 's0' | 's1' | 's2' | 's3' | 's4'
const SECTION_ORDER: SectionKey[] = ['s0', 's1', 's2', 's3', 's4']
interface SectionState { visible: boolean; completed: boolean }
type Sections = Record<SectionKey, SectionState>

const INITIAL_SECTIONS: Sections = {
  s0: { visible: true,  completed: false }, // Brief + Protocol
  s1: { visible: false, completed: false }, // Definitions
  s2: { visible: false, completed: false }, // Data sanity
  s3: { visible: false, completed: false }, // Timeline
  s4: { visible: false, completed: false }, // Seasonality
}

// ── Sanity check validation ───────────────────────────────────────────────────
interface SanityCheck {
  id:       string
  exhibit:  string
  question: string
  hint:     string
}

const SANITY_CHECKS: SanityCheck[] = [
  {
    id:       'bookings',
    exhibit:  'Exhibit A — Absolute Bookings',
    question: 'Bookings averaged ~820K/day before the drop and ~819K/day after. What does this tell you?',
    hint:     'Think about what it means for the numerator of our ratio when it stays flat while the denominator grows.',
  },
  {
    id:       'dau',
    exhibit:  'Exhibit B — Absolute DAU',
    question: 'DAU grew from 10.0M to 11.5M/day (+15%). How do you verify this growth is real and not a definition change?',
    hint:     'What source would you cross-check against to verify the DAU number isn\'t inflated?',
  },
  {
    id:       'pipeline',
    exhibit:  'Exhibit C — Analytics vs Payment Gateway',
    question: 'Analytics shows 819,240 bookings on Day 45. Payment gateway shows 821,180. Gap = 1,940 (0.24%). Is this a problem?',
    hint:     'Think about what level of discrepancy is acceptable vs alarming in analytics pipelines.',
  },
  {
    id:       'incidents',
    exhibit:  'Exhibit D — Data Engineering Incident Log',
    question: 'The incident log shows 0 ETL failures and 0 schema changes in 90 days. What does this confirm?',
    hint:     'Think about what could cause a metric to look like it dropped when it actually didn\'t.',
  },
]

type SeasonStep = 'input' | 'softHint' | 'hardHint' | 'chart' | 'insight' | 'done'

// ── Component ─────────────────────────────────────────────────────────────────
export default function Phase1() {
  const { slug }       = useParams<{ slug: string }>()
  const navigate        = useNavigate()
  const { completePhase, isCompleted } = useProgressStore()
  const openWithContent = useAIPanelStore((s) => s.openWithContent)
  const phaseCompleted  = isCompleted('phase-1')

  const [sections, setSections]           = useState<Sections>(INITIAL_SECTIONS)
  const [showBands, setShowBands]         = useState(false)
  const [userVariance, setUserVariance]   = useState('')
  const [varianceDone, setVarianceDone]   = useState(false)

  // Sanity check state — one at a time
  const [sanityIdx, setSanityIdx]         = useState(0)
  const [sanityAnswers, setSanityAnswers] = useState<Record<string, string>>({})
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [sanityFeedback, setSanityFeedback] = useState<Record<string, 'ok' | 'push'>>({})
  const [isEvaluating, setIsEvaluating]   = useState(false)
  const [allSanityDone, setAllSanityDone] = useState(false)

  // Seasonality state
  const [seasonStep, setSeasonStep]       = useState<SeasonStep>('input')
  const [seasonAttempts, setSeasonAttempts] = useState(0)
  const [userSeasonApproach, setUserSeasonApproach] = useState('')
  const [userInsight, setUserInsight]     = useState('')
  const [insightAttempts, setInsightAttempts] = useState(0)
  const [isEvalInsight, setIsEvalInsight] = useState(false)

  useEffect(() => {
    if (phaseCompleted) {
      setSections({ s0:{visible:true,completed:true}, s1:{visible:true,completed:true}, s2:{visible:true,completed:true}, s3:{visible:true,completed:true}, s4:{visible:true,completed:true} })
      setAllSanityDone(true)
      setVarianceDone(true)
      setShowBands(true)
      setSeasonStep('done')
    }
  }, [phaseCompleted])

  function revealNext(current: SectionKey) {
    const idx  = SECTION_ORDER.indexOf(current)
    const next = SECTION_ORDER[idx + 1] as SectionKey | undefined
    setSections(prev => ({
      ...prev,
      [current]: { ...prev[current], completed: true },
      ...(next ? { [next]: { ...prev[next], visible: true } } : {}),
    }))
    if (next) setTimeout(() => {
      document.getElementById(`section-${next}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 350)
  }

  // Sanity check evaluation
  async function evaluateSanity() {
    if (currentAnswer.trim().length < 15 || isEvaluating) return
    setIsEvaluating(true)
    const check = SANITY_CHECKS[sanityIdx]
    await new Promise(r => setTimeout(r, 800))

    const lower = currentAnswer.toLowerCase()
    const goodKeywords: Record<string, string[]> = {
      bookings:  ['flat', 'stable', 'numerator', 'denominator', 'ratio', 'rate', 'didn\'t crash', 'not crashed'],
      dau:       ['session', 'logs', 'gateway', 'cross', 'verify', 'real', 'genuine', 'definition', 'source'],
      pipeline:  ['acceptable', 'noise', 'normal', '0.3', '0.24', 'within', 'not a problem', 'fine', 'ok'],
      incidents: ['artifact', 'fake', 'pipeline', 'tracking', 'not broken', 'clean', 'trustworthy', 'real'],
    }

    const isGood = goodKeywords[check.id]?.some(kw => lower.includes(kw)) ?? false

    setSanityFeedback(prev => ({ ...prev, [check.id]: isGood ? 'ok' : 'push' }))
    setSanityAnswers(prev => ({ ...prev, [check.id]: currentAnswer }))

    if (isGood) {
      openWithContent({
        type:  'insight',
        title: `Exhibit ${String.fromCharCode(65 + sanityIdx)} — Arjun's take`,
        text:  getSanityFeedbackText(check.id, true),
      })
      const nextIdx = sanityIdx + 1
      if (nextIdx >= SANITY_CHECKS.length) {
        setAllSanityDone(true)
      } else {
        setSanityIdx(nextIdx)
        setCurrentAnswer('')
      }
    } else {
      openWithContent({
        type:  'insight',
        title: `Not quite — think harder`,
        text:  getSanityFeedbackText(check.id, false),
      })
    }
    setIsEvaluating(false)
  }

  function getSanityFeedbackText(id: string, correct: boolean): string {
    const texts: Record<string, { ok: string; push: string }> = {
      bookings: {
        ok:   'Correct. Flat absolute bookings tells us the numerator didn\'t crash. The ratio fell because DAU (denominator) grew +15% while bookings stayed flat. This is a rate problem, not a volume collapse. A very different kind of investigation.',
        push: 'Look at what the flat bookings tells you about the numerator of our ratio. If bookings didn\'t crash, what drove the ratio down? Think about numerator vs denominator.',
      },
      dau: {
        ok:   'Exactly right. You cross-check DAU against session logs or backend auth events — sources that can\'t be accidentally inflated by an analytics definition change. If both sources show 11.5M, the growth is real.',
        push: 'Think about what source is immune to analytics definition changes. If someone accidentally changed the DAU query to include anonymous users, what external source would still show the truth?',
      },
      pipeline: {
        ok:   'Correct. A 0.24% gap between analytics and payment gateway is within acceptable noise — attribution delays, timezone edge cases. A problem would be 5%+. This pipeline is clean.',
        push: 'Think about scale. 1,940 on 820,000 bookings — what percentage is that? Is that alarming or within normal attribution delay noise?',
      },
      incidents: {
        ok:   'Exactly. Zero incidents means no ETL failure manufactured a fake drop. The data pipeline is trustworthy. We can now investigate the metric itself rather than chasing a ghost in the pipeline.',
        push: 'Think about what an ETL failure or schema change could do to a metric. If the pipeline was broken, what would the metric drop look like vs what we\'re seeing?',
      },
    }
    return texts[id]?.[correct ? 'ok' : 'push'] ?? ''
  }

  // Variance evaluation
  function evaluateVariance() {
    const lower = userVariance.toLowerCase()
    const isGood = lower.includes('significant') || lower.includes('not noise') ||
      lower.includes('sigma') || lower.includes('sd') || lower.includes('standard') ||
      lower.includes('outside') || lower.includes('6') || lower.includes('5') || lower.includes('beyond')

    openWithContent({
      type:  'insight',
      title: isGood ? 'Correct — statistically significant' : 'Think about the bands',
      text:  isGood
        ? 'The drop is 1.9pp below the baseline mean of 12.05%. Baseline SD is ±0.3pp. That puts the current value at 6.3 standard deviations below mean. In statistics, anything beyond ±3σ is considered extremely significant. This is not noise — this is a real, structural, statistically confirmed drop.'
        : 'Look at where 10.1% sits relative to the ±1σ band. The band is the range of normal fluctuation. If the current value is inside the band — noise. If far outside — statistically significant. How many SDs below mean is 10.1%?',
    })
    if (isGood) setVarianceDone(true)
  }

  // Seasonality
  function handleSeasonSubmit() {
    const lower = userSeasonApproach.toLowerCase()
    const hasYoY = lower.includes('year') || lower.includes('yoy') ||
      lower.includes('last year') || lower.includes('2024') ||
      lower.includes('same period') || lower.includes('historical') || lower.includes('compare')

    const attempts = seasonAttempts + 1
    setSeasonAttempts(attempts)

    if (hasYoY) {
      setSeasonStep('chart')
    } else if (attempts === 1) {
      setSeasonStep('softHint')
    } else {
      setSeasonStep('hardHint')
    }
  }

  async function handleInsightSubmit() {
    if (userInsight.trim().length < 20 || isEvalInsight) return
    setIsEvalInsight(true)
    await new Promise(r => setTimeout(r, 900))

    const lower = userInsight.toLowerCase()
    const hasStructural = lower.includes('structural') || lower.includes('not seasonal') ||
      lower.includes('jan') || lower.includes('feb') || lower.includes('2024') ||
      lower.includes('same period') || lower.includes('flat') || lower.includes('2025')
    const hasSeasonal   = lower.includes('oct') || lower.includes('nov') ||
      lower.includes('seasonal') || lower.includes('monsoon') || lower.includes('recover') ||
      lower.includes('festival') || lower.includes('december')
    const hasBoth       = hasStructural && hasSeasonal
    const attempts      = insightAttempts + 1
    setInsightAttempts(attempts)

    if (hasBoth) {
      openWithContent({
        type:  'insight',
        title: 'Complete insight — seasonality ruled out',
        text:  'Perfect analysis. Two patterns in the chart: (1) Oct–Nov 2024 shows a ~1pp seasonal dip that recovered by December — this is the known post-monsoon travel lull. (2) Jan–Apr 2025 shows a steady structural drop from 11.7% to 10.1% — Jan 2024 was flat at 12.0%, so this is NOT seasonal. Same calendar window, completely different behaviour. Seasonality is definitively ruled out. The drop is structural — something changed in the product, supply, or user behaviour around W25.',
      })
      setSeasonStep('done')
    } else if (!hasStructural && attempts < 2) {
      openWithContent({
        type:  'insight',
        title: 'Partial — look at Jan–Feb specifically',
        text:  'You identified the seasonal pattern correctly. Now look at the Jan–Feb window. In 2024, what was B/DAU in January? Now look at 2025 January. Are they the same? What does that tell you about whether the current drop is seasonal or structural?',
      })
      setInsightAttempts(attempts)
    } else if (!hasSeasonal && attempts < 2) {
      openWithContent({
        type:  'insight',
        title: 'Partial — look at Oct–Nov 2024',
        text:  'You correctly identified the Jan–Feb structural drop. But look at Oct–Nov in the 2024 line — there\'s a visible dip there too. What caused it? Why did it recover in December? This is important: not all dips are structural. Identifying the seasonal pattern makes your structural conclusion stronger.',
      })
      setInsightAttempts(attempts)
    } else {
      openWithContent({
        type:  'insight',
        title: 'Both patterns — complete your insight',
        text:  'Look for two things: (1) Oct–Nov 2024 dip + December recovery = seasonal. (2) Jan–Feb 2025 drop vs Jan–Feb 2024 flat = structural. Your insight needs to address both patterns to be complete.',
      })
    }
    setIsEvalInsight(false)
  }

  function handlePhaseComplete() {
    completePhase('phase-1')
    navigate(`/case-study/${slug}/phase-2`)
  }

  return (
    <div className="space-y-16 pb-20">

      {/* ══ S0 — Brief + Protocol ══ */}
      <AnimatePresence>
        {sections.s0.visible && (
          <motion.section id="section-s0" key="s0"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6">

            {/* Brief summary */}
            <RevealBlock>
              <div className="rounded-2xl p-6 space-y-4"
                style={{ background: 'var(--bg-surface)', border: '1px solid rgba(248,113,113,0.20)' }}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent-red)' }} />
                  <span className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>
                    P0 Incident — Board Visibility
                  </span>
                </div>
                <p className="text-lg font-semibold leading-snug"
                  style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  MakeMyTrip Bookings/DAU has dropped 18% over 60 days. ₹4.2Cr already lost. Board review in 3 weeks.
                </p>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { label: 'Metric drop', value: '−1.9pp', sub: 'B/DAU: 12.0% → 10.1%', color: 'var(--accent-red)' },
                    { label: 'Revenue impact', value: '₹4.2Cr', sub: 'Already lost', color: 'var(--accent-red)' },
                    { label: 'Duration', value: '60 days', sub: 'Sustained, not a spike', color: 'var(--accent-primary)' },
                  ].map(({ label, value, sub, color }) => (
                    <div key={label} className="rounded-xl p-4 space-y-1"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                      <p className="text-xs uppercase tracking-widest"
                        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</p>
                      <p className="text-xl font-bold"
                        style={{ color, fontFamily: 'var(--font-heading)' }}>{value}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </RevealBlock>

            {/* Arjun — stop, don't jump */}
            <RevealBlock delay={0.05}>
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg,rgba(129,140,248,0.3),rgba(255,107,53,0.25))', border: '1px solid rgba(129,140,248,0.30)', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  A
                </div>
                <div className="flex-1 rounded-2xl rounded-tl-sm px-5 py-4 space-y-3"
                  style={{ background: 'var(--bg-surface)', border: '1px solid rgba(129,140,248,0.20)' }}>
                  <p className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>
                    Arjun · Staff Analyst
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    You've received the brief. Every analyst's first instinct is to open a dashboard immediately.
                    <strong style={{ color: 'var(--accent-red)' }}> That instinct kills investigations.</strong>
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Before you touch any data, you run a 4-step protocol. Each step exists to prevent you from
                    chasing the wrong cause for weeks. I've seen analysts waste 3 weeks on a drop that turned
                    out to be a tracking bug — because they skipped these checks.
                  </p>
                </div>
              </div>
            </RevealBlock>

            {/* Protocol map */}
            <RevealBlock delay={0.1}>
              <div className="rounded-2xl p-6 space-y-4"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                <p className="text-xs uppercase tracking-widest"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  The 4-step protocol — in this exact order
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { n: '01', label: 'Definition Clarity', why: 'Lock what you\'re measuring', color: 'var(--accent-primary)' },
                    { n: '02', label: 'Data Sanity',        why: 'Verify the data is real',    color: 'var(--accent-secondary)' },
                    { n: '03', label: 'Timeline Review',    why: 'Read the shape of the drop', color: 'var(--accent-green)' },
                    { n: '04', label: 'Seasonality Check',  why: 'Rule out calendar effects',  color: 'var(--accent-primary)' },
                  ].map(({ n, label, why, color }, i) => (
                    <div key={n} className="relative rounded-xl p-4 space-y-2"
                      style={{ background: 'var(--bg-elevated)', border: `1px solid ${color}20` }}>
                      {i < 3 && (
                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10"
                          style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: 700 }}>→</div>
                      )}
                      <span className="text-xs font-bold" style={{ color, fontFamily: 'var(--font-mono)' }}>{n}</span>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>{label}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{why}</p>
                    </div>
                  ))}
                </div>
              </div>
            </RevealBlock>

            {!sections.s0.completed && (
              <RevealBlock>
                <ContinueButton label="Understood — begin Definition Clarity" onClick={() => revealNext('s0')} />
              </RevealBlock>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ══ S1 — Definition Clarity ══ */}
      <AnimatePresence>
        {sections.s1.visible && (
          <motion.section id="section-s1" key="s1"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8">
            <SectionHeader number={1} title="Definition Clarity"
              subtitle="Lock down exactly what you're measuring before looking at any numbers." />

            {/* What is B/DAU — formula visual */}
            <RevealBlock>
              <div className="space-y-4">
                <div className="rounded-2xl p-6 space-y-4"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                  <p className="text-xs uppercase tracking-widest"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    The metric — precisely defined
                  </p>
                  {/* Formula */}
                  <div className="flex flex-wrap items-center gap-3 py-2">
                    {[
                      { text: 'Bookings/DAU', color: 'var(--accent-primary)' },
                      { text: '=',            color: 'var(--text-muted)'     },
                      { text: 'Total Gross Completed Payments', color: 'var(--accent-secondary)' },
                      { text: '÷',            color: 'var(--text-muted)'     },
                      { text: 'Logged-in Unique Daily Users',   color: 'var(--accent-green)'     },
                    ].map(({ text, color }) => (
                      <motion.span key={text}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.12, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="text-base font-bold"
                        style={{ color, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
                        {text}
                      </motion.span>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    If 1,000 users open the app and 120 complete a booking, Bookings/DAU = 12%.
                    It answers one question: <em style={{ color: 'var(--text-primary)' }}>are users converting?</em>
                  </p>
                  <div className="px-4 py-3 rounded-xl"
                    style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      <strong style={{ color: 'var(--accent-red)' }}>Critical trap: </strong>
                      B/DAU can fall even if absolute bookings are flat — if DAU grows faster.
                      Always check numerator and denominator separately. Never conclude from the ratio alone.
                    </p>
                  </div>
                </div>
                <ArjunChip label="Why a ratio instead of absolute bookings?"
                  content={{ type: 'insight', title: 'whyRatio',
                    text: 'A ratio metric lets you compare conversion efficiency regardless of user base size. If you tracked only absolute bookings, a growing user base would mask a real conversion problem. B/DAU = 12% with 1M users means 120K bookings. B/DAU = 12% with 10M users means 1.2M bookings. The ratio tells you if your product is getting better or worse at converting users — independent of growth.' }} />
              </div>
            </RevealBlock>

            {/* DAU definition */}
            <RevealBlock delay={0.05}>
              <div className="space-y-4">
                <MiniBarChart title="Who counts as a DAU at MMT" unit="" maxValue={100}
                  data={[
                    { label: 'Logged-in users — counted',        value: 65, color: 'var(--accent-green)'    },
                    { label: 'Anonymous visitors — excluded',     value: 28, color: 'var(--accent-red)'      },
                    { label: 'Bot traffic — excluded',            value: 7,  color: 'var(--text-muted)'      },
                  ]} />
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  DAU = <strong style={{ color: 'var(--text-primary)' }}>logged-in unique users</strong> with intent.
                  Anonymous users have near-zero booking intent. Including them inflates the denominator
                  and makes CVR look artificially low. Logged-in = qualified demand.
                </p>
                <ArjunChip label="What if this definition changed mid-investigation?"
                  content={{ type: 'insight', title: 'dауDefinition',
                    text: 'Classic trap: engineering filters 200K bot accounts from DAU in week −8. DAU drops 200K. B/DAU spikes overnight — not because more people booked, but because the denominator shrank. This is why you always verify the DAU definition against the query history before drawing conclusions. Check the data engineering changelog.' }} />
              </div>
            </RevealBlock>

            {/* Gross vs Net */}
            <RevealBlock delay={0.08}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl p-5 space-y-3"
                    style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.20)' }}>
                    <p className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
                      Gross Bookings — what we use ✓
                    </p>
                    <p className="text-2xl font-bold"
                      style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-heading)' }}>~820K/day</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Completed payments at checkout. Stable signal. Measures purchase intent at the moment of conversion. Unaffected by cancellation policy changes.
                    </p>
                  </div>
                  <div className="rounded-2xl p-5 space-y-3"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', opacity: 0.7 }}>
                    <p className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      Net Bookings — wrong signal ✗
                    </p>
                    <p className="text-2xl font-bold"
                      style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-heading)' }}>Volatile</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      After cancellations. Fluctuates with refund policy changes, seasonal cancellation spikes, customer service improvements — ops problems, not demand.
                    </p>
                  </div>
                </div>
                <ArjunChip label="Why does gross vs net matter for this investigation?"
                  content={{ type: 'insight', title: 'grossVsNet',
                    text: 'If ops tightened the refund window last month, net bookings would spike — more bookings counted as "completed" before the refund deadline. That would make B/DAU look like it recovered. But the demand hasn\'t changed. Using net bookings would give you a false signal. Gross bookings are immune to this — they count at the moment of checkout regardless of what happens after.' }} />
              </div>
            </RevealBlock>

            {/* pp vs % */}
            <RevealBlock delay={0.1}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl p-5 space-y-2"
                    style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' }}>
                    <p className="text-xs uppercase tracking-widest"
                      style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>❌ Wrong</p>
                    <p className="text-2xl font-bold"
                      style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-heading)' }}>"CVR dropped 1.9%"</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Manager hears: small relative change. Doesn't act.
                    </p>
                  </div>
                  <div className="rounded-2xl p-5 space-y-2"
                    style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                    <p className="text-xs uppercase tracking-widest"
                      style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>✓ Correct</p>
                    <p className="text-2xl font-bold"
                      style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-heading)' }}>"CVR dropped 1.9pp"</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Manager hears: 15.8% relative decline = ₹4.2Cr. Escalates immediately.
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  12.0% → 10.1% is <strong style={{ color: 'var(--accent-red)' }}>−1.9 percentage points (pp)</strong>,
                  not −1.9%. The relative decline is <strong style={{ color: 'var(--accent-red)' }}>−15.8%</strong>.
                  Confusing these in a board presentation destroys credibility instantly.
                </p>
                <ArjunChip label="Real story: how this mistake plays out in a VP meeting"
                  content={{ type: 'insight', title: 'ppMistake',
                    text: 'True story: an analyst presented "CVR dropped 1.9%" to a VP. The VP nodded and moved on — sounded like rounding noise. Two weeks later, the board asked why nobody escalated a 15.8% relative drop. The analyst had the right number, wrong unit. The investigation was delayed 2 weeks because of a single word. Always say pp for absolute differences between percentages.' }} />
              </div>
            </RevealBlock>

            {!sections.s1.completed && (
              <RevealBlock>
                <ContinueButton label="Definitions locked — now verify the data" onClick={() => revealNext('s1')} />
              </RevealBlock>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ══ S2 — Data Sanity (user validates) ══ */}
      <AnimatePresence>
        {sections.s2.visible && (
          <motion.section id="section-s2" key="s2"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8">
            <SectionHeader number={2} title="Data Sanity"
              subtitle="Four exhibits. You decide if the data is trustworthy." />

            <RevealBlock>
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg,rgba(129,140,248,0.3),rgba(255,107,53,0.25))', border: '1px solid rgba(129,140,248,0.30)', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  A
                </div>
                <div className="flex-1 rounded-2xl rounded-tl-sm px-5 py-4"
                  style={{ background: 'var(--bg-surface)', border: '1px solid rgba(129,140,248,0.20)' }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2"
                    style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>Arjun · Staff Analyst</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    I'm giving you four data exhibits. For each one, tell me what it means for the
                    integrity of this investigation. Don't tell me the conclusion — tell me the
                    reasoning. Arjun will respond in the right panel.
                  </p>
                </div>
              </div>
            </RevealBlock>

            {/* Sanity checks — one at a time */}
            <RevealBlock delay={0.05}>
              <div className="space-y-5">
                {SANITY_CHECKS.map((check, i) => {
                  const isDone     = sanityFeedback[check.id] === 'ok'
                  const isActive   = i === sanityIdx && !allSanityDone
                  const isPast     = i < sanityIdx || allSanityDone
                  const isLocked   = i > sanityIdx && !allSanityDone

                  return (
                    <motion.div key={check.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: isLocked ? 0.3 : 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      className="rounded-2xl overflow-hidden"
                      style={{
                        border: isDone
                          ? '1px solid rgba(16,185,129,0.25)'
                          : isActive
                          ? '1px solid var(--border-default)'
                          : '1px solid var(--border-subtle)',
                      }}>
                      {/* Exhibit header */}
                      <div className="flex items-center justify-between px-5 py-3"
                        style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
                        <p className="text-xs font-semibold uppercase tracking-widest"
                          style={{ color: isDone ? 'var(--accent-green)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {check.exhibit}
                        </p>
                        {isDone && <span style={{ color: 'var(--accent-green)', fontSize: '14px' }}>✓</span>}
                      </div>

                      <div className="px-5 py-4 space-y-4" style={{ background: 'var(--bg-elevated)' }}>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                          {check.question}
                        </p>

                        {(isActive || (isPast && sanityAnswers[check.id])) && (
                          <div className="space-y-3">
                            {isPast && sanityAnswers[check.id] && (
                              <div className="px-4 py-3 rounded-xl"
                                style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                                <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Your answer:</p>
                                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{sanityAnswers[check.id]}</p>
                              </div>
                            )}
                            {isActive && (
                              <>
                                <textarea
                                  value={currentAnswer}
                                  onChange={e => setCurrentAnswer(e.target.value)}
                                  placeholder={check.hint}
                                  rows={2}
                                  className="w-full rounded-xl px-4 py-3 text-sm resize-none"
                                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', outline: 'none' }}
                                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.10)' }}
                                  onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }}
                                />
                                <button onClick={evaluateSanity}
                                  disabled={currentAnswer.trim().length < 15 || isEvaluating}
                                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
                                  style={{ background: 'var(--accent-secondary)', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                                  {isEvaluating && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                  {isEvaluating ? 'Evaluating...' : 'Submit analysis →'}
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}

                {allSanityDone && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="px-5 py-4 rounded-xl"
                    style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}>
                    <p className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>
                      ✓ All four exhibits validated — data is trustworthy. Now look at the timeline.
                    </p>
                  </motion.div>
                )}
              </div>
            </RevealBlock>

            {sections.s2.visible && !sections.s2.completed && allSanityDone && (
              <RevealBlock>
                <ContinueButton label="Data verified — show me the timeline" onClick={() => revealNext('s2')} />
              </RevealBlock>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ══ S3 — Timeline + Variance ══ */}
      <AnimatePresence>
        {sections.s3.visible && (
          <motion.section id="section-s3" key="s3"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8">
            <SectionHeader number={3} title="Timeline Review"
              subtitle="8 months of weekly data. Read the shape before anything else." />

            <RevealBlock>
              <WoWChart showBands={showBands} />
            </RevealBlock>

            <RevealBlock delay={0.05}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl p-4 space-y-2"
                    style={{ background: 'var(--bg-surface)', border: '1px solid rgba(248,113,113,0.20)' }}>
                    <p className="text-xs uppercase tracking-widest"
                      style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>This chart</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      Steady drop — −0.2pp every week for 8 weeks
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Not accelerating, not decelerating. Clockwork. Points to something
                      structural that compounds consistently week over week.
                    </p>
                  </div>
                  <div className="rounded-2xl p-4 space-y-2"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', opacity: 0.7 }}>
                    <p className="text-xs uppercase tracking-widest"
                      style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>If it were sudden</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      Single cliff — −30% overnight
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Would point to one event: payment outage, bad deploy, A/B test gone wrong.
                      Search logs, roll back last deploy.
                    </p>
                  </div>
                </div>
                <ArjunChip label="Why does the shape of the drop matter?"
                  content={{ type: 'insight', title: 'dropShape',
                    text: 'The shape is your first hypothesis filter. Steady decay over 8 weeks means something changed in W25 and has been compounding since. It\'s almost certainly NOT a single event. You\'re looking for: a product change that degraded UX gradually, a supply change that reduced available inventory, or a user behaviour shift triggered by a competitor or external event.' }} />
              </div>
            </RevealBlock>

            {/* Variance question */}
            <RevealBlock delay={0.08}>
              <div className="rounded-2xl p-6 space-y-4"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  Before we proceed — is this drop statistically significant, or could it be within normal variance?
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Look at the chart above. The green stable period shows natural weekly fluctuation.
                  The red drop is consistent. But how do you know it's not just noise?
                </p>

                {!varianceDone && (
                  <div className="space-y-3">
                    <textarea
                      value={userVariance}
                      onChange={e => setUserVariance(e.target.value)}
                      placeholder="Is 10.1% statistically significant given the historical variation? How would you determine this?"
                      rows={2}
                      className="w-full rounded-xl px-4 py-3 text-sm resize-none"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', outline: 'none' }}
                      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.10)' }}
                      onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }}
                    />
                    <button onClick={evaluateVariance}
                      disabled={userVariance.trim().length < 15}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
                      style={{ background: 'var(--accent-secondary)', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                      Submit answer →
                    </button>
                  </div>
                )}

                {varianceDone && !showBands && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="space-y-3">
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Good. Now see it visually — the ±1σ bands show the range of normal fluctuation.
                    </p>
                    <button onClick={() => setShowBands(true)}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--accent-secondary)', color: 'var(--accent-secondary)', fontFamily: 'var(--font-heading)' }}>
                      Show variance bands →
                    </button>
                  </motion.div>
                )}

                {showBands && (
                  <div className="px-4 py-3 rounded-xl"
                    style={{ background: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.15)' }}>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      <strong style={{ color: 'var(--accent-secondary)' }}>Statistical verdict: </strong>
                      Baseline SD = ±0.30pp. Current drop = 1.9pp below mean = <strong style={{ color: 'var(--accent-red)' }}>6.3σ</strong>.
                      Anything beyond ±3σ is considered statistically extreme.
                      This drop is not noise. It is confirmed, significant, and structural.
                    </p>
                  </div>
                )}
              </div>
            </RevealBlock>

            {!sections.s3.completed && varianceDone && showBands && (
              <RevealBlock>
                <ContinueButton label="Pattern confirmed — now rule out seasonality" onClick={() => revealNext('s3')} />
              </RevealBlock>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ══ S4 — Seasonality ══ */}
      <AnimatePresence>
        {sections.s4.visible && (
          <motion.section id="section-s4" key="s4"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6">
            <SectionHeader number={4} title="Seasonality Check"
              subtitle="One final check before hypothesis building." />

            <RevealBlock>
              <div className="rounded-2xl p-6 space-y-5"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex gap-4">
                  <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg,rgba(129,140,248,0.3),rgba(255,107,53,0.25))', border: '1px solid rgba(129,140,248,0.30)', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                    A
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Travel is deeply seasonal. Before you call this a product problem and build hypotheses,
                    you need to rule out that this is simply an annual calendar pattern.
                    <strong style={{ color: 'var(--text-primary)' }}> How would you check this?</strong>
                  </p>
                </div>

                {(seasonStep === 'input' || seasonStep === 'softHint' || seasonStep === 'hardHint') && (
                  <div className="space-y-3">
                    <textarea
                      value={userSeasonApproach}
                      onChange={e => setUserSeasonApproach(e.target.value)}
                      placeholder="What data would you pull and what would you look for?"
                      rows={2}
                      className="w-full rounded-xl px-4 py-3 text-sm resize-none"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', outline: 'none' }}
                      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.10)' }}
                      onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }}
                    />
                    <button onClick={handleSeasonSubmit}
                      disabled={userSeasonApproach.trim().length < 10}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
                      style={{ background: 'var(--accent-secondary)', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                      Submit approach →
                    </button>
                  </div>
                )}

                {/* Soft hint — after 1 wrong attempt */}
                <AnimatePresence>
                  {seasonStep === 'softHint' && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="px-4 py-3 rounded-xl"
                      style={{ background: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.15)' }}>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <strong style={{ color: 'var(--accent-secondary)' }}>Arjun: </strong>
                        Think about what historical data would let you isolate whether this time of year
                        is inherently lower. What comparison would separate "calendar effect" from "product problem"?
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hard hint — after 2 wrong attempts */}
                <AnimatePresence>
                  {seasonStep === 'hardHint' && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 px-4 py-4 rounded-xl"
                      style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.20)' }}>
                      <span style={{ fontSize: '16px' }}>💡</span>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold" style={{ color: 'var(--accent-amber)' }}>Hint</p>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          What if you compared the same calendar period — same months — one year apart?
                          If the same period last year also showed a drop, that's seasonal.
                          If last year was flat in the same period, the drop is structural.
                        </p>
                        <button onClick={() => setSeasonStep('chart')}
                          className="text-sm font-semibold underline underline-offset-2"
                          style={{ color: 'var(--accent-amber)' }}>
                          Show me the year-over-year data →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </RevealBlock>

            {/* YoY Chart */}
            <AnimatePresence>
              {(seasonStep === 'chart' || seasonStep === 'insight' || seasonStep === 'done') && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-5">
                  <YoYChart />

                  {seasonStep === 'chart' && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl p-5 space-y-3"
                      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                        Two distinct patterns in that chart. What do you conclude?
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Identify both patterns — what's seasonal and what isn't — and explain how you know.
                      </p>
                      <textarea
                        value={userInsight}
                        onChange={e => setUserInsight(e.target.value)}
                        placeholder="Write your full analysis — identify both patterns and your conclusion."
                        rows={3}
                        className="w-full rounded-xl px-4 py-3 text-sm resize-none"
                        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', outline: 'none' }}
                        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.10)' }}
                        onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }}
                      />
                      <button onClick={handleInsightSubmit}
                        disabled={userInsight.trim().length < 20 || isEvalInsight}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
                        style={{ background: 'var(--accent-secondary)', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                        {isEvalInsight && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                        {isEvalInsight ? 'Arjun is reading...' : 'Submit insight →'}
                      </button>
                    </motion.div>
                  )}

                  <AnimatePresence>
                    {seasonStep === 'done' && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="space-y-5">
                        <div className="px-4 py-4 rounded-xl"
                          style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}>
                          <p className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>
                            ✓ Seasonality ruled out — Arjun's full response is in the right panel.
                          </p>
                        </div>

                        {!phaseCompleted ? (
                          <motion.button onClick={handlePhaseComplete}
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="w-full py-4 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
                            style={{ background: 'var(--accent-primary)', color: '#fff', fontFamily: 'var(--font-heading)', boxShadow: '0 0 24px rgba(255,107,53,0.18)' }}>
                            Seasonality ruled out — Begin Hypothesis Building →
                          </motion.button>
                        ) : (
                          <div className="flex items-center gap-3 px-5 py-4 rounded-xl"
                            style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}>
                            <span style={{ color: 'var(--accent-green)' }}>✓</span>
                            <p className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>
                              Phase 1 complete — revisiting content
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}
PHASE1_EOF
echo "✅ Phase1.tsx — complete rebuild"

# ── Gate 1 ────────────────────────────────────────────────────────────────────
echo ""
echo "🧠 Gate 1: Type checking..."
npx tsc --noEmit && echo "✅ Zero TypeScript errors" || echo "❌ Fix above"

echo ""
echo "🔨 Gate 2: Build..."
npm run build && echo "✅ Build passed" || echo "❌ Build failed"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Phase 1 complete rebuild. Structure:"
echo "  S0  Brief + Protocol map (4-step visual)"
echo "  S1  Definitions: formula → DAU bar → Gross/Net → pp/%"
echo "  S2  Data Sanity: 4 exhibits, user validates each"
echo "  S3  Timeline: WoW chart + variance bands + user answers"
echo "  S4  Seasonality: open text → 2-level hint → YoY chart"
echo "      → user identifies BOTH patterns → right panel response"
echo "  CTA: 'Begin Hypothesis Building →'"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
