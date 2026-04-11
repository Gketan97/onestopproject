#!/usr/bin/env bash
# P4 — Case Study Shell (3-Panel Layout)
# Contracts: UI_CONTRACT.md | BUG_AUDIT.md | CODE_QUALITY.md | DEBT_REGISTER.md
# Run from project root: bash p4_shell.sh

set -euo pipefail

echo "📋 P4 — Case Study Shell (3-Panel Layout)"
echo "────────────────────────────────────────────"

# ── Gate 0: Contract check ────────────────────────────────────────────────────
echo "📋 Gate 0: Checking contracts..."
MISSING=0
for contract in UI_CONTRACT.md BUG_AUDIT.md CODE_QUALITY.md DEBT_REGISTER.md; do
  [ -f "$contract" ] && echo "  ✅ $contract" || { echo "  ❌ Missing: $contract"; MISSING=1; }
done
[ "$MISSING" = "1" ] && { echo "❌ Run: bash generate_contracts.sh first"; exit 1; }

mkdir -p src/store src/pages/CaseStudy/phases src/components/layout src/components/ai

# ── 1. src/store/aiPanelStore.ts ─────────────────────────────────────────────
cat > src/store/aiPanelStore.ts << 'EOF'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AIPanelState {
  isOpen:      boolean
  togglePanel: () => void
  openPanel:   () => void
  closePanel:  () => void
}

export const useAIPanelStore = create<AIPanelState>()(
  persist(
    (set) => ({
      isOpen:      false,
      togglePanel: () => set((s) => ({ isOpen: !s.isOpen })),
      openPanel:   () => set({ isOpen: true }),
      closePanel:  () => set({ isOpen: false }),
    }),
    { name: 'osc-ai-panel' },
  ),
)
EOF
echo "✅ aiPanelStore.ts"

# ── 2. Update progressStore to support phaseId-based completion ───────────────
cat > src/store/progressStore.ts << 'EOF'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── Types ────────────────────────────────────────────────────────────────────
export type PhaseId =
  | 'phase-1'
  | 'phase-2'
  | 'phase-3'
  | 'phase-4'
  | 'phase-5'
  | 'phase-6'
  | 'phase-7'
  | 'phase-8'

export interface PhaseConfig {
  id:       PhaseId
  label:    string
  subtitle: string
  order:    number
}

// ── Phase definitions — single source of truth ───────────────────────────────
export const PHASES: PhaseConfig[] = [
  { id: 'phase-1', label: 'Business Context',    subtitle: 'Understand the business model',        order: 1 },
  { id: 'phase-2', label: 'Metric Understanding', subtitle: 'Decompose the metric',                order: 2 },
  { id: 'phase-3', label: 'Trend Analysis',       subtitle: 'Identify when the drop started',      order: 3 },
  { id: 'phase-4', label: 'Hypothesis Building',  subtitle: 'Formulate testable hypotheses',       order: 4 },
  { id: 'phase-5', label: 'Segmentation',         subtitle: 'Break down by platform and segment',  order: 5 },
  { id: 'phase-6', label: 'Decomposition',        subtitle: 'Isolate the broken metric leg',       order: 6 },
  { id: 'phase-7', label: 'Funnel Analysis',      subtitle: 'Find the exact funnel drop-off',      order: 7 },
  { id: 'phase-8', label: 'Solutions & Sizing',   subtitle: 'Quantify impact and recommend fixes', order: 8 },
]

const PHASE_ORDER = PHASES.map((p) => p.id)

// ── Store ─────────────────────────────────────────────────────────────────────
interface ProgressState {
  currentPhaseId:   PhaseId
  completedPhases:  PhaseId[]
  unlockedPhases:   PhaseId[]
  completePhase:    (phaseId: PhaseId) => void
  resetProgress:    () => void
  isUnlocked:       (phaseId: PhaseId) => boolean
  isCompleted:      (phaseId: PhaseId) => boolean
  progressPercent:  () => number
}

const INITIAL_STATE = {
  currentPhaseId:  'phase-1' as PhaseId,
  completedPhases: [] as PhaseId[],
  unlockedPhases:  ['phase-1'] as PhaseId[],
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      completePhase: (phaseId: PhaseId) => {
        const idx      = PHASE_ORDER.indexOf(phaseId)
        const nextId   = PHASE_ORDER[idx + 1] as PhaseId | undefined

        set((s) => ({
          completedPhases: s.completedPhases.includes(phaseId)
            ? s.completedPhases
            : [...s.completedPhases, phaseId],
          unlockedPhases: nextId && !s.unlockedPhases.includes(nextId)
            ? [...s.unlockedPhases, nextId]
            : s.unlockedPhases,
          currentPhaseId: nextId ?? phaseId,
        }))
      },

      resetProgress: () => set(INITIAL_STATE),

      isUnlocked: (phaseId) => get().unlockedPhases.includes(phaseId),

      isCompleted: (phaseId) => get().completedPhases.includes(phaseId),

      progressPercent: () => {
        const total = PHASE_ORDER.length
        const done  = get().completedPhases.length
        return Math.round((done / total) * 100)
      },
    }),
    { name: 'osc-progress' },
  ),
)
EOF
echo "✅ progressStore.ts (updated)"

# ── 3. src/components/layout/ProgressNav.tsx ─────────────────────────────────
cat > src/components/layout/ProgressNav.tsx << 'EOF'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Lock, Circle, RotateCcw } from 'lucide-react'
import { useProgressStore, PHASES, type PhaseId } from '@/store/progressStore'
import { slideInLeft } from '@/lib/motionVariants'
import { cn } from '@/lib/utils'

// ── Constants ─────────────────────────────────────────────────────────────────
const NAV_WIDTH = 240

// ── Component ─────────────────────────────────────────────────────────────────
export function ProgressNav() {
  const { slug }         = useParams<{ slug: string }>()
  const navigate         = useNavigate()
  const { isUnlocked, isCompleted, progressPercent, currentPhaseId, resetProgress } =
    useProgressStore()

  const percent = progressPercent()

  function handlePhaseClick(phaseId: PhaseId) {
    if (!isUnlocked(phaseId)) return
    navigate(`/case-study/${slug}/${phaseId}`)
  }

  function handleReset() {
    resetProgress()
    navigate(`/case-study/${slug}/phase-1`)
  }

  return (
    <aside
      className="flex flex-col shrink-0 h-full overflow-y-auto"
      style={{
        width:      `${NAV_WIDTH}px`,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
      }}
      aria-label="Phase navigation"
    >
      {/* Progress bar */}
      <div className="px-5 pt-6 pb-4 space-y-2">
        <div className="flex items-center justify-between">
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
          >
            Progress
          </span>
          <span
            className="text-xs font-medium"
            style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}
          >
            {percent}%
          </span>
        </div>
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ background: 'var(--border-subtle)' }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${percent}% complete`}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-purple))',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0 20px' }} />

      {/* Phase list */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {PHASES.map((phase) => {
          const unlocked  = isUnlocked(phase.id)
          const completed = isCompleted(phase.id)
          const isCurrent = currentPhaseId === phase.id && !completed

          return (
            <motion.button
              key={phase.id}
              variants={slideInLeft}
              initial="hidden"
              animate="visible"
              onClick={() => handlePhaseClick(phase.id)}
              disabled={!unlocked}
              aria-label={`${phase.label} — ${completed ? 'completed' : unlocked ? 'unlocked' : 'locked'}`}
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left',
                'transition-all duration-200 group',
                unlocked
                  ? 'cursor-pointer hover:bg-white/5'
                  : 'cursor-not-allowed opacity-40',
              )}
              style={{
                background: isCurrent
                  ? 'rgba(0,212,255,0.06)'
                  : 'transparent',
                border: isCurrent
                  ? '1px solid rgba(0,212,255,0.15)'
                  : '1px solid transparent',
              }}
            >
              {/* Phase icon */}
              <span className="shrink-0">
                {completed ? (
                  <CheckCircle
                    size={16}
                    style={{ color: 'var(--accent-green)' }}
                    aria-hidden="true"
                  />
                ) : unlocked ? (
                  <Circle
                    size={16}
                    style={{
                      color: isCurrent
                        ? 'var(--accent-primary)'
                        : 'var(--text-muted)',
                    }}
                    aria-hidden="true"
                  />
                ) : (
                  <Lock size={14} style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
                )}
              </span>

              {/* Phase label */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-medium truncate"
                  style={{
                    color: completed
                      ? 'var(--accent-green)'
                      : isCurrent
                      ? 'var(--accent-primary)'
                      : unlocked
                      ? 'var(--text-secondary)'
                      : 'var(--text-muted)',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  {phase.label}
                </p>
                {isCurrent && (
                  <p
                    className="text-xs truncate mt-0.5"
                    style={{
                      color:      'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                      fontSize:   '10px',
                    }}
                  >
                    In progress
                  </p>
                )}
              </div>

              {/* Phase number */}
              <span
                className="shrink-0 text-xs"
                style={{
                  color:      'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize:   '10px',
                }}
              >
                {String(phase.order).padStart(2, '0')}
              </span>
            </motion.button>
          )
        })}
      </nav>

      {/* Reset button */}
      <div className="p-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs transition-all duration-200 hover:bg-white/5"
          style={{
            color:      'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            border:     '1px solid var(--border-subtle)',
          }}
          aria-label="Reset all progress"
        >
          <RotateCcw size={12} />
          Reset progress
        </button>
      </div>
    </aside>
  )
}
EOF
echo "✅ ProgressNav.tsx"

# ── 4. src/components/ai/AIPanelSkeleton.tsx ─────────────────────────────────
cat > src/components/ai/AIPanelSkeleton.tsx << 'EOF'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAIPanelStore } from '@/store/aiPanelStore'

// ── Constants ─────────────────────────────────────────────────────────────────
const PANEL_WIDTH     = 360
const COLLAPSED_WIDTH = 48

const PANEL_VARIANTS = {
  open: {
    width:   PANEL_WIDTH,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  closed: {
    width:   COLLAPSED_WIDTH,
    opacity: 1,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
}

const CONTENT_VARIANTS = {
  open:   { opacity: 1, x: 0,   transition: { delay: 0.1, duration: 0.25 } },
  closed: { opacity: 0, x: 20,  transition: { duration: 0.15 } },
}

// ── Component ─────────────────────────────────────────────────────────────────
export function AIPanelSkeleton() {
  const { isOpen, togglePanel } = useAIPanelStore()

  return (
    <motion.aside
      variants={PANEL_VARIANTS}
      animate={isOpen ? 'open' : 'closed'}
      initial="closed"
      className="relative shrink-0 flex flex-col h-full overflow-hidden"
      style={{
        background:  'var(--bg-elevated)',
        borderLeft:  '1px solid var(--border-subtle)',
      }}
      aria-label="AI Assistant panel"
    >
      {/* ── Collapsed state — vertical strip ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.15 } }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4"
          >
            {/* Toggle button */}
            <button
              onClick={togglePanel}
              className="flex flex-col items-center gap-2 py-3 px-2 rounded-xl transition-all duration-200 hover:bg-white/5 group"
              aria-label="Open AI Assistant"
              aria-expanded={false}
            >
              <Sparkles
                size={18}
                style={{ color: 'var(--accent-purple)' }}
                className="group-hover:scale-110 transition-transform duration-200"
              />
              <span
                className="text-xs uppercase tracking-widest"
                style={{
                  color:          'var(--text-muted)',
                  fontFamily:     'var(--font-mono)',
                  fontSize:       '8px',
                  writingMode:    'vertical-rl',
                  textOrientation: 'mixed',
                  transform:      'rotate(180deg)',
                  letterSpacing:  '0.15em',
                }}
              >
                AI
              </span>
            </button>

            <ChevronLeft
              size={14}
              style={{ color: 'var(--text-muted)' }}
              aria-hidden="true"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Expanded state — full panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="expanded"
            variants={CONTENT_VARIANTS}
            initial="closed"
            animate="open"
            exit="closed"
            className="flex flex-col h-full"
            style={{ width: `${PANEL_WIDTH}px` }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: '1px solid var(--border-subtle)' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'rgba(168,85,247,0.12)',
                    border:     '1px solid rgba(168,85,247,0.25)',
                  }}
                >
                  <Sparkles size={14} style={{ color: 'var(--accent-purple)' }} aria-hidden="true" />
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}
                  >
                    AI Assistant
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}
                  >
                    Mentor: Arjun
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={togglePanel}
                  className="p-1.5 rounded-lg transition-all duration-200 hover:bg-white/5"
                  aria-label="Collapse AI panel"
                  aria-expanded={true}
                >
                  <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>
            </div>

            {/* Chat area — placeholder */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
              {/* Arjun intro message */}
              <div className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold"
                  style={{
                    background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(0,212,255,0.2))',
                    border:     '1px solid rgba(168,85,247,0.25)',
                    color:      'var(--text-primary)',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  A
                </div>
                <div
                  className="flex-1 rounded-xl rounded-tl-none px-4 py-3 text-sm leading-relaxed"
                  style={{
                    background: 'var(--bg-surface)',
                    border:     '1px solid var(--border-subtle)',
                    color:      'var(--text-secondary)',
                  }}
                >
                  <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>Arjun here.</span>
                  {' '}I will be your AI thinking partner throughout this investigation. Ask me anything about the data, methodology, or your hypotheses.
                </div>
              </div>

              {/* Skeleton placeholder messages */}
              {[80, 120, 60].map((w, i) => (
                <div key={i} className="flex gap-3 justify-end">
                  <div
                    className="rounded-xl rounded-tr-none px-4 py-3 skeleton"
                    style={{ width: `${w}%`, height: '48px' }}
                  />
                </div>
              ))}
            </div>

            {/* Input area */}
            <div
              className="px-4 py-4 shrink-0"
              style={{ borderTop: '1px solid var(--border-subtle)' }}
            >
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl"
                style={{
                  background: 'var(--bg-surface)',
                  border:     '1px solid var(--border-default)',
                }}
              >
                <p
                  className="flex-1 text-sm"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                >
                  Ask Arjun anything...
                </p>
                <span
                  className="text-xs px-2 py-1 rounded-md"
                  style={{
                    background: 'rgba(168,85,247,0.10)',
                    color:      'var(--accent-purple)',
                    fontFamily: 'var(--font-mono)',
                    fontSize:   '10px',
                    border:     '1px solid rgba(168,85,247,0.20)',
                  }}
                >
                  P12
                </span>
              </div>
              <p
                className="text-center mt-2 text-xs"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}
              >
                AI chat unlocks in Phase 12
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  )
}
EOF
echo "✅ AIPanelSkeleton.tsx"

# ── 5. src/components/layout/CenterPanel.tsx ─────────────────────────────────
cat > src/components/layout/CenterPanel.tsx << 'EOF'
import { useEffect, useRef } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { motion }            from 'framer-motion'
import { PHASES }            from '@/store/progressStore'
import { useProgressStore }  from '@/store/progressStore'
import { revealContent }     from '@/lib/motionVariants'

// ── Component ─────────────────────────────────────────────────────────────────
export function CenterPanel() {
  const { phase }        = useParams<{ phase: string }>()
  const currentPhaseId   = useProgressStore((s) => s.currentPhaseId)
  const scrollRef        = useRef<HTMLDivElement>(null)

  // Resolve active phase config
  const activePhaseId = phase ?? currentPhaseId
  const phaseConfig   = PHASES.find((p) => p.id === activePhaseId)

  // Scroll to top on phase change
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activePhaseId])

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto min-h-0"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="max-w-3xl mx-auto px-12 py-12">
        {/* Phase header */}
        {phaseConfig && (
          <motion.header
            key={activePhaseId}
            variants={revealContent}
            initial="hidden"
            animate="visible"
            className="mb-10 pb-8"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className="text-xs uppercase tracking-widest"
                style={{
                  color:      'var(--accent-primary)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Phase {phaseConfig.order} of {PHASES.length}
              </span>
              <span style={{ color: 'var(--border-default)' }}>·</span>
              <span
                className="text-xs uppercase tracking-widest"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
              >
                MakeMyTrip
              </span>
            </div>

            <h1
              className="text-3xl font-bold tracking-tight mb-2"
              style={{
                color:      'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {phaseConfig.label}
            </h1>

            <p
              className="text-base"
              style={{ color: 'var(--text-secondary)' }}
            >
              {phaseConfig.subtitle}
            </p>
          </motion.header>
        )}

        {/* Phase content via nested route */}
        <motion.div
          key={activePhaseId + '-content'}
          variants={revealContent}
          initial="hidden"
          animate="visible"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}
EOF
echo "✅ CenterPanel.tsx"

# ── 6. src/pages/CaseStudy/index.tsx — Shell ─────────────────────────────────
cat > src/pages/CaseStudy/index.tsx << 'EOF'
import { useEffect }          from 'react'
import { useParams, useNavigate, Outlet } from 'react-router-dom'
import { MobileGate }         from '@/components/ui/MobileGate'
import { ProgressNav }        from '@/components/layout/ProgressNav'
import { CenterPanel }        from '@/components/layout/CenterPanel'
import { AIPanelSkeleton }    from '@/components/ai/AIPanelSkeleton'
import { useProgressStore }   from '@/store/progressStore'

// ── Constants ─────────────────────────────────────────────────────────────────
const DESKTOP_BREAKPOINT = 1024

// ── Mobile gate hook ──────────────────────────────────────────────────────────
function useIsDesktop(): boolean {
  if (typeof window === 'undefined') return true
  return window.innerWidth >= DESKTOP_BREAKPOINT
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function CaseStudyShell() {
  const { slug, phase } = useParams<{ slug: string; phase?: string }>()
  const navigate         = useNavigate()
  const currentPhaseId   = useProgressStore((s) => s.currentPhaseId)
  const isDesktop        = useIsDesktop()

  // Redirect bare /case-study/:slug → /case-study/:slug/phase-1
  useEffect(() => {
    if (!phase && slug) {
      navigate(`/case-study/${slug}/${currentPhaseId}`, { replace: true })
    }
  }, [phase, slug, currentPhaseId, navigate])

  if (!isDesktop) return <MobileGate />

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Left: Progress nav */}
      <ProgressNav />

      {/* Center: Scrollable content with nested route outlet */}
      <CenterPanel />

      {/* Right: AI panel */}
      <AIPanelSkeleton />
    </div>
  )
}
EOF
echo "✅ CaseStudyShell (index.tsx)"

# ── 7. Phase placeholder — renders inside CenterPanel via Outlet ──────────────
cat > src/pages/CaseStudy/phases/PhaseView.tsx << 'EOF'
import { useParams, Navigate }  from 'react-router-dom'
import { motion }               from 'framer-motion'
import { ChevronRight, Lock }   from 'lucide-react'
import { useProgressStore, PHASES, type PhaseId } from '@/store/progressStore'
import { Button }               from '@/components/ui/Button'
import { staggerChildren, staggerItem } from '@/lib/motionVariants'

// ── Constants ─────────────────────────────────────────────────────────────────
const DESKTOP_BREAKPOINT = 1024

export default function PhaseView() {
  const { slug, phase }   = useParams<{ slug: string; phase: string }>()
  const { isUnlocked, isCompleted, completePhase, currentPhaseId } = useProgressStore()

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= DESKTOP_BREAKPOINT
  if (!isDesktop) return null // MobileGate handled by shell

  const typedPhase = phase as PhaseId
  const phaseConfig = PHASES.find((p) => p.id === typedPhase)

  // Redirect if phase locked
  if (!isUnlocked(typedPhase)) {
    return <Navigate to={`/case-study/${slug}/${currentPhaseId}`} replace />
  }

  const completed = isCompleted(typedPhase)

  return (
    <motion.div
      variants={staggerChildren}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Content placeholder */}
      <motion.div
        variants={staggerItem}
        className="rounded-2xl p-8 space-y-4"
        style={{
          background: 'var(--bg-surface)',
          border:     '1px solid var(--border-subtle)',
        }}
      >
        <p
          className="text-xs uppercase tracking-widest"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
        >
          Phase content
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          {phaseConfig?.label} content will be built in P5–P11.
          This placeholder confirms the shell, routing, and phase-gate logic work correctly.
        </p>

        {/* Locked indicator */}
        {!isUnlocked(typedPhase) && (
          <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <Lock size={14} />
            <span className="text-sm">Complete the previous phase to unlock this content.</span>
          </div>
        )}
      </motion.div>

      {/* Complete button */}
      {!completed && isUnlocked(typedPhase) && (
        <motion.div variants={staggerItem} className="flex justify-end">
          <Button
            variant="primary"
            size="lg"
            onClick={() => completePhase(typedPhase)}
          >
            Complete {phaseConfig?.label}
            <ChevronRight size={18} />
          </Button>
        </motion.div>
      )}

      {/* Completed state */}
      {completed && (
        <motion.div
          variants={staggerItem}
          className="flex items-center gap-3 px-5 py-4 rounded-xl"
          style={{
            background: 'rgba(61,214,140,0.06)',
            border:     '1px solid rgba(61,214,140,0.20)',
          }}
        >
          <span style={{ color: 'var(--accent-green)', fontSize: '20px' }}>✓</span>
          <p className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>
            Phase complete — next phase unlocked
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
EOF
echo "✅ PhaseView.tsx (placeholder)"

# ── 8. Update Router to handle nested phase routes ────────────────────────────
cat > src/app/Router.tsx << 'EOF'
import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense }          from 'react'

// ── Lazy page imports ─────────────────────────────────────────────────────────
const Home            = lazy(() => import('@/pages/Home'))
const CaseStudies     = lazy(() => import('@/pages/CaseStudies'))
const CaseStudyShell  = lazy(() => import('@/pages/CaseStudy'))
const PhaseView       = lazy(() => import('@/pages/CaseStudy/phases/PhaseView'))

// ── Page loader ───────────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--bg-base)' }}
    >
      <span
        className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }}
        aria-label="Loading"
      />
    </div>
  )
}

// ── Router ────────────────────────────────────────────────────────────────────
export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/case-studies" element={<CaseStudies />} />

        {/* Case study shell wraps nested phase routes */}
        <Route path="/case-study/:slug" element={<CaseStudyShell />}>
          <Route path=":phase" element={<PhaseView />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
EOF
echo "✅ Router.tsx (updated for nested routes)"

# ── 9. Update barrel exports ──────────────────────────────────────────────────
cat > src/components/layout/index.ts << 'EOF'
export { Layout }          from './Layout'
export { Navbar }          from './Navbar'
export { ProgressNav }     from './ProgressNav'
export { CenterPanel }     from './CenterPanel'
EOF

mkdir -p src/components/ai
cat > src/components/ai/index.ts << 'EOF'
export { AIPanelSkeleton } from './AIPanelSkeleton'
EOF
echo "✅ barrel exports updated"

# ── Gate 1: TypeScript ────────────────────────────────────────────────────────
echo ""
echo "🧠 Gate 1: Type checking..."
npx tsc --noEmit && echo "✅ Zero TypeScript errors" || echo "❌ Fix errors above"

# ── Gate 2: Build ─────────────────────────────────────────────────────────────
echo ""
echo "🔨 Gate 2: Build check..."
npm run build && echo "✅ Build passed" || echo "❌ Build failed"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " P4 complete. Files delivered:"
echo "  src/store/aiPanelStore.ts"
echo "  src/store/progressStore.ts        (updated — phaseId based)"
echo "  src/components/layout/ProgressNav.tsx"
echo "  src/components/layout/CenterPanel.tsx"
echo "  src/components/ai/AIPanelSkeleton.tsx"
echo "  src/pages/CaseStudy/index.tsx     (3-panel shell)"
echo "  src/pages/CaseStudy/phases/PhaseView.tsx (placeholder)"
echo "  src/app/Router.tsx                (nested routes)"
echo ""
echo " Test checklist:"
echo "  npm run dev"
echo "  ✓ / → Home"
echo "  ✓ /case-studies → Card grid"
echo "  ✓ Click MMT card → 3-panel layout"
echo "  ✓ Phase 1 unlocked, phases 2-8 locked"
echo "  ✓ Complete Phase 1 → Phase 2 unlocks"
echo "  ✓ AI panel toggle (right side)"
echo "  ✓ Progress bar fills as phases complete"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
