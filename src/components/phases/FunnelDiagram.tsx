import { motion } from 'framer-motion'
import {
  Search, List, FileText, ShoppingCart, CreditCard, CheckCircle,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
interface FunnelStage {
  id:    string
  label: string
  icon:  React.ElementType
  color: string
  glow:  string
}

// ── Constants ─────────────────────────────────────────────────────────────────
const STAGES: FunnelStage[] = [
  { id: 'search',   label: 'Search',   icon: Search,       color: 'rgba(255,107,53,1)',   glow: 'rgba(255,107,53,0.15)'  },
  { id: 'list',     label: 'List',     icon: List,         color: 'rgba(251,191,36,1)',   glow: 'rgba(251,191,36,0.15)'  },
  { id: 'detail',   label: 'Detail',   icon: FileText,     color: 'rgba(129,140,248,1)',  glow: 'rgba(129,140,248,0.15)' },
  { id: 'checkout', label: 'Checkout', icon: ShoppingCart, color: 'rgba(129,140,248,1)',  glow: 'rgba(129,140,248,0.15)' },
  { id: 'payment',  label: 'Payment',  icon: CreditCard,   color: 'rgba(16,185,129,1)',   glow: 'rgba(16,185,129,0.15)'  },
  { id: 'booking',  label: 'Booking',  icon: CheckCircle,  color: 'rgba(16,185,129,1)',   glow: 'rgba(16,185,129,0.15)'  },
]

const STAGGER_DELAY_MS = 150

// ── Component ─────────────────────────────────────────────────────────────────
export function FunnelDiagram() {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: 'var(--bg-surface)',
        border:     '1px solid var(--border-subtle)',
      }}
    >
      <p
        className="text-xs uppercase tracking-widest mb-6"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
      >
        Booking journey — 6 stages
      </p>

      {/* Desktop: horizontal flow */}
      <div className="flex items-center gap-0 overflow-x-auto pb-2">
        {STAGES.map((stage, i) => {
          const Icon = stage.icon
          return (
            <div key={stage.id} className="flex items-center shrink-0">
              {/* Stage node */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay:    (i * STAGGER_DELAY_MS) / 1000,
                  duration: 0.45,
                  ease:     [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col items-center gap-2.5"
              >
                {/* Icon circle */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: stage.glow,
                    border:     `1px solid ${stage.color}30`,
                  }}
                >
                  <Icon size={20} style={{ color: stage.color }} />
                </div>

                {/* Stage number */}
                <span
                  className="text-xs font-bold"
                  style={{ color: stage.color, fontFamily: 'var(--font-mono)' }}
                >
                  0{i + 1}
                </span>

                {/* Label */}
                <span
                  className="text-xs font-medium text-center"
                  style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-heading)' }}
                >
                  {stage.label}
                </span>
              </motion.div>

              {/* Arrow connector */}
              {i < STAGES.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{
                    delay:    ((i + 0.5) * STAGGER_DELAY_MS) / 1000,
                    duration: 0.3,
                  }}
                  className="flex items-center px-2 mt-[-20px]"
                  style={{ transformOrigin: 'left' }}
                >
                  <div
                    className="w-8 h-px"
                    style={{ background: 'var(--border-default)' }}
                  />
                  <div
                    className="w-0 h-0"
                    style={{
                      borderTop:    '4px solid transparent',
                      borderBottom: '4px solid transparent',
                      borderLeft:   `5px solid var(--border-default)`,
                    }}
                  />
                </motion.div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
