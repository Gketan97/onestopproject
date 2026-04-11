#!/usr/bin/env bash
# P5 REBUILD — Phase 0 (Business Context) + Phase 1 (Understanding the Problem)
# Contracts: UI_CONTRACT.md | BUG_AUDIT.md | CODE_QUALITY.md | DEBT_REGISTER.md
# Run from project root: bash p5_rebuild.sh

set -euo pipefail

echo "📋 P5 REBUILD — Phase 0 + Phase 1"
echo "────────────────────────────────────"

# ── Gate 0: Contract check ────────────────────────────────────────────────────
echo "📋 Gate 0: Checking contracts..."
MISSING=0
for contract in UI_CONTRACT.md BUG_AUDIT.md CODE_QUALITY.md DEBT_REGISTER.md; do
  [ -f "$contract" ] && echo "  ✅ $contract" || { echo "  ❌ Missing: $contract"; MISSING=1; }
done
[ "$MISSING" = "1" ] && { echo "❌ Run: bash generate_contracts.sh first"; exit 1; }

mkdir -p src/pages/CaseStudy/phases src/components/phases src/store src/data

# ── 1. Update progressStore — add phase-0, 9 phases total ────────────────────
cat > src/store/progressStore.ts << 'EOF'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PhaseId =
  | 'phase-0'
  | 'phase-1'
  | 'phase-2'
  | 'phase-3'
  | 'phase-4'
  | 'phase-5'
  | 'phase-6'
  | 'phase-7'
  | 'phase-8'

export interface PhaseSection {
  id:    string
  label: string
}

export interface PhaseConfig {
  id:       PhaseId
  label:    string
  subtitle: string
  order:    number
  sections: PhaseSection[]
}

export const PHASES: PhaseConfig[] = [
  {
    id:       'phase-0',
    label:    'Business Context',
    subtitle: 'Know the company before you touch the data',
    order:    0,
    sections: [
      { id: 'business-canvas', label: 'MMT Business Canvas' },
      { id: 'growth-brief',    label: 'Head of Growth Brief' },
    ],
  },
  {
    id:       'phase-1',
    label:    'Understanding the Problem',
    subtitle: 'Definitions, sanity, and timeline before hypotheses',
    order:    1,
    sections: [
      { id: 'definition-clarity', label: 'Definition Clarity'  },
      { id: 'data-sanity',        label: 'Data Sanity'         },
      { id: 'timeline-review',    label: 'Timeline Review'     },
      { id: 'seasonality',        label: 'Seasonality Check'   },
    ],
  },
  {
    id: 'phase-2', label: 'Metric Decomposition', subtitle: 'Break the metric into legs',
    order: 2, sections: [
      { id: 'decomposition', label: 'Metric Decomposition' },
      { id: 'data-table',    label: '60-Day Data'          },
      { id: 'mcq',           label: 'Knowledge Gate'       },
    ],
  },
  { id: 'phase-3', label: 'Trend Analysis',       subtitle: 'Identify when the drop started',      order: 3, sections: [] },
  { id: 'phase-4', label: 'Hypothesis Building',  subtitle: 'Formulate testable hypotheses',       order: 4, sections: [] },
  { id: 'phase-5', label: 'Segmentation',         subtitle: 'Break down by platform and segment',  order: 5, sections: [] },
  { id: 'phase-6', label: 'Decomposition',        subtitle: 'Isolate the broken metric leg',       order: 6, sections: [] },
  { id: 'phase-7', label: 'Funnel Analysis',      subtitle: 'Find the exact funnel drop-off',      order: 7, sections: [] },
  { id: 'phase-8', label: 'Solutions & Sizing',   subtitle: 'Quantify impact and recommend fixes', order: 8, sections: [] },
]

const PHASE_ORDER = PHASES.map((p) => p.id)

interface ProgressState {
  currentPhaseId:  PhaseId
  completedPhases: PhaseId[]
  unlockedPhases:  PhaseId[]
  completePhase:   (phaseId: PhaseId) => void
  resetProgress:   () => void
  isUnlocked:      (phaseId: PhaseId) => boolean
  isCompleted:     (phaseId: PhaseId) => boolean
  progressPercent: () => number
}

const INITIAL_STATE = {
  currentPhaseId:  'phase-0' as PhaseId,
  completedPhases: [] as PhaseId[],
  unlockedPhases:  ['phase-0'] as PhaseId[],
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,
      completePhase: (phaseId) => {
        const idx    = PHASE_ORDER.indexOf(phaseId)
        const nextId = PHASE_ORDER[idx + 1] as PhaseId | undefined
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
      resetProgress:   () => set(INITIAL_STATE),
      isUnlocked:      (phaseId) => get().unlockedPhases.includes(phaseId),
      isCompleted:     (phaseId) => get().completedPhases.includes(phaseId),
      progressPercent: () => Math.round((get().completedPhases.length / PHASE_ORDER.length) * 100),
    }),
    { name: 'osc-progress' },
  ),
)
EOF
echo "✅ progressStore.ts (9 phases)"

# ── 2. Update aiPanelStore — add width expansion + content ───────────────────
cat > src/store/aiPanelStore.ts << 'EOF'
import { create } from 'zustand'

export type AIPanelContent =
  | { type: 'welcome' }
  | { type: 'chart';   chartId: string; title: string }
  | { type: 'data';    dataId:  string; title: string }
  | { type: 'insight'; text:    string; title: string }

interface AIPanelState {
  isOpen:      boolean
  isExpanded:  boolean
  content:     AIPanelContent
  togglePanel: () => void
  openWithContent: (content: AIPanelContent) => void
  expand:      () => void
  collapse:    () => void
  closePanel:  () => void
}

export const useAIPanelStore = create<AIPanelState>()((set) => ({
  isOpen:     false,
  isExpanded: false,
  content:    { type: 'welcome' },

  togglePanel:     () => set((s) => ({ isOpen: !s.isOpen, isExpanded: false })),
  openWithContent: (content) => set({ isOpen: true, isExpanded: true, content }),
  expand:          () => set({ isExpanded: true }),
  collapse:        () => set({ isExpanded: false }),
  closePanel:      () => set({ isOpen: false, isExpanded: false, content: { type: 'welcome' } }),
}))
EOF
echo "✅ aiPanelStore.ts (expanded)"

# ── 3. ProgressNav — with section dropdowns ───────────────────────────────────
cat > src/components/layout/ProgressNav.tsx << 'EOF'
import { useState, useEffect }      from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { motion, AnimatePresence }  from 'framer-motion'
import { CheckCircle, Lock, Circle, ChevronDown, ChevronRight, RotateCcw } from 'lucide-react'
import { useProgressStore, PHASES, type PhaseId } from '@/store/progressStore'
import { cn } from '@/lib/utils'

const NAV_WIDTH = 256

function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function ProgressNav() {
  const { slug }    = useParams<{ slug: string }>()
  const navigate    = useNavigate()
  const location    = useLocation()
  const { isUnlocked, isCompleted, progressPercent, currentPhaseId, resetProgress } =
    useProgressStore()

  const percent = progressPercent()

  // Track which phases are expanded in nav
  const [expandedPhases, setExpandedPhases] = useState<Set<PhaseId>>(
    new Set([currentPhaseId])
  )

  // Auto-expand current phase
  useEffect(() => {
    setExpandedPhases((prev) => new Set([...prev, currentPhaseId]))
  }, [currentPhaseId])

  function handlePhaseClick(phaseId: PhaseId) {
    if (!isUnlocked(phaseId)) return
    navigate(`/case-study/${slug}/${phaseId}`)
    setExpandedPhases((prev) => {
      const next = new Set(prev)
      next.has(phaseId) ? next.delete(phaseId) : next.add(phaseId)
      return next
    })
  }

  function handleSectionClick(phaseId: PhaseId, sectionId: string) {
    if (!isUnlocked(phaseId)) return
    const currentPath = location.pathname
    const phasePath   = `/case-study/${slug}/${phaseId}`
    if (!currentPath.includes(phaseId)) {
      navigate(phasePath)
      setTimeout(() => scrollToSection(sectionId), 400)
    } else {
      scrollToSection(sectionId)
    }
  }

  function handleReset() {
    resetProgress()
    navigate(`/case-study/${slug}/phase-0`)
  }

  return (
    <aside
      className="flex flex-col shrink-0 h-full overflow-y-auto"
      style={{
        width:       `${NAV_WIDTH}px`,
        background:  'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
      }}
      aria-label="Phase navigation"
    >
      {/* Progress bar */}
      <div className="px-4 pt-5 pb-4 space-y-2 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Progress
          </span>
          <span className="text-xs font-semibold"
            style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
            {percent}%
          </span>
        </div>
        <div className="h-1 rounded-full overflow-hidden"
          style={{ background: 'var(--border-subtle)' }}
          role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          <motion.div className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))' }}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0 16px' }} />

      {/* Phase list */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {PHASES.map((phase) => {
          const unlocked    = isUnlocked(phase.id)
          const completed   = isCompleted(phase.id)
          const isCurrent   = currentPhaseId === phase.id && !completed
          const isExpanded  = expandedPhases.has(phase.id)
          const hasSections = phase.sections.length > 0

          return (
            <div key={phase.id}>
              {/* Phase row */}
              <button
                onClick={() => handlePhaseClick(phase.id)}
                disabled={!unlocked}
                aria-label={`${phase.label}`}
                aria-expanded={hasSections && isExpanded}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left',
                  'transition-all duration-200 group',
                  unlocked ? 'cursor-pointer hover:bg-white/5' : 'cursor-not-allowed opacity-35',
                )}
                style={{
                  background: isCurrent ? 'rgba(255,107,53,0.07)' : 'transparent',
                  border:     isCurrent ? '1px solid rgba(255,107,53,0.15)' : '1px solid transparent',
                }}
              >
                {/* Status icon */}
                <span className="shrink-0">
                  {completed
                    ? <CheckCircle size={14} style={{ color: 'var(--accent-green)' }} />
                    : unlocked
                    ? <Circle size={14} style={{ color: isCurrent ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
                    : <Lock size={12} style={{ color: 'var(--text-muted)' }} />}
                </span>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate"
                    style={{
                      color: completed ? 'var(--accent-green)' : isCurrent ? 'var(--accent-primary)' : unlocked ? 'var(--text-secondary)' : 'var(--text-muted)',
                      fontFamily: 'var(--font-heading)',
                    }}>
                    {phase.label}
                  </p>
                </div>

                {/* Order + expand chevron */}
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                    {String(phase.order).padStart(2, '0')}
                  </span>
                  {hasSections && unlocked && (
                    <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={11} style={{ color: 'var(--text-muted)' }} />
                    </motion.span>
                  )}
                </div>
              </button>

              {/* Section dropdown */}
              <AnimatePresence>
                {hasSections && isExpanded && unlocked && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="ml-5 pl-3 py-1 space-y-0.5"
                      style={{ borderLeft: '1px solid var(--border-subtle)' }}>
                      {phase.sections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => handleSectionClick(phase.id, section.id)}
                          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all duration-150 hover:bg-white/5 group"
                        >
                          <ChevronRight size={10} style={{ color: 'var(--text-muted)' }} />
                          <span className="text-xs truncate"
                            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                            {section.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </nav>

      {/* Reset */}
      <div className="p-3 shrink-0" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <button onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs transition-all duration-200 hover:bg-white/5"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', border: '1px solid var(--border-subtle)' }}
          aria-label="Reset all progress">
          <RotateCcw size={11} />
          Reset progress
        </button>
      </div>
    </aside>
  )
}
EOF
echo "✅ ProgressNav.tsx (section dropdowns)"

# ── 4. AI Panel — expandable to 75vw ─────────────────────────────────────────
cat > src/components/ai/AIPanel.tsx << 'EOF'
import { useRef, useEffect }       from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, ChevronRight } from 'lucide-react'
import { useAIPanelStore }         from '@/store/aiPanelStore'

const COLLAPSED_W = 52
const SIDEBAR_W   = 280

export function AIPanel() {
  const { isOpen, isExpanded, content, togglePanel, collapse, closePanel } = useAIPanelStore()
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close expanded on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && isExpanded) collapse()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isExpanded, collapse])

  return (
    <>
      {/* ── Expanded overlay (75vw) ── */}
      <AnimatePresence>
        {isOpen && isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              ref={overlayRef}
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
              onClick={collapse}
            />

            {/* Panel */}
            <motion.div
              key="expanded-panel"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 h-full z-50 flex flex-col"
              style={{
                width:      '75vw',
                background: 'var(--bg-elevated)',
                borderLeft: '1px solid var(--border-default)',
              }}
              role="dialog"
              aria-modal="true"
              aria-label="AI Assistant"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 shrink-0"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.25)' }}>
                    <Sparkles size={15} style={{ color: 'var(--accent-secondary)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold"
                      style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      {content.type !== 'welcome' ? (content as { title?: string }).title ?? 'AI Assistant' : 'AI Assistant'}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                      Mentor: Arjun · MakeMyTrip
                    </p>
                  </div>
                </div>
                <button onClick={collapse}
                  className="p-2 rounded-lg transition-all hover:bg-white/5"
                  aria-label="Close panel">
                  <X size={16} style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>

              {/* Content area */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {content.type === 'welcome' && <WelcomeContent />}
                {content.type === 'insight' && (
                  <InsightContent text={(content as { text: string }).text} />
                )}
                {content.type === 'chart' && (
                  <ChartPlaceholder chartId={(content as { chartId: string }).chartId} />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Collapsed sidebar strip ── */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.aside
            key="sidebar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative shrink-0 flex flex-col h-full"
            style={{
              width:      isOpen ? `${SIDEBAR_W}px` : `${COLLAPSED_W}px`,
              background: 'var(--bg-elevated)',
              borderLeft: '1px solid var(--border-subtle)',
              transition: 'width 0.3s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            {!isOpen ? (
              /* Collapsed icon strip */
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <button onClick={togglePanel}
                  className="flex flex-col items-center gap-2 py-3 px-2 rounded-xl hover:bg-white/5 transition-all group"
                  aria-label="Open AI Assistant" aria-expanded={false}>
                  <Sparkles size={18} style={{ color: 'var(--accent-secondary)' }}
                    className="group-hover:scale-110 transition-transform" />
                  <span style={{
                    color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '8px',
                    writingMode: 'vertical-rl', textOrientation: 'mixed',
                    transform: 'rotate(180deg)', letterSpacing: '0.15em', textTransform: 'uppercase',
                  }}>AI</span>
                </button>
              </div>
            ) : (
              /* Open sidebar */
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-4 py-4 shrink-0"
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} style={{ color: 'var(--accent-secondary)' }} />
                    <span className="text-sm font-semibold"
                      style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      Arjun
                    </span>
                  </div>
                  <button onClick={closePanel}
                    className="p-1 rounded-lg hover:bg-white/5 transition-all">
                    <X size={14} style={{ color: 'var(--text-muted)' }} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <WelcomeContent compact />
                </div>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function WelcomeContent({ compact = false }: { compact?: boolean }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold"
          style={{ background: 'linear-gradient(135deg,rgba(129,140,248,0.2),rgba(255,107,53,0.2))', border: '1px solid rgba(129,140,248,0.25)', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
          A
        </div>
        <div className="flex-1 rounded-xl rounded-tl-none px-4 py-3 text-sm leading-relaxed"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
          <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>Arjun here. </span>
          {compact
            ? "Click any prompt chip to explore data."
            : "I'm your AI thinking partner. Click any prompt chip in the phase content to explore charts, data, and deeper analysis here."}
        </div>
      </div>
      {!compact && (
        <p className="text-xs text-center" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          Prompts appear as you progress through each section
        </p>
      )}
    </div>
  )
}

function InsightContent({ text }: { text: string }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold"
          style={{ background: 'linear-gradient(135deg,rgba(129,140,248,0.2),rgba(255,107,53,0.2))', border: '1px solid rgba(129,140,248,0.25)', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
          A
        </div>
        <div className="flex-1 rounded-xl rounded-tl-none px-4 py-4 text-sm leading-relaxed"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
          {text}
        </div>
      </div>
    </div>
  )
}

function ChartPlaceholder({ chartId }: { chartId: string }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-8 flex items-center justify-center min-h-64"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
        <p className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          Chart: {chartId} — renders in P13 (Data Layer)
        </p>
      </div>
    </div>
  )
}
EOF
echo "✅ AIPanel.tsx (expandable 75vw)"

# ── 5. PromptChip — reusable trigger for AI panel ─────────────────────────────
cat > src/components/phases/PromptChip.tsx << 'EOF'
import { Sparkles } from 'lucide-react'
import { useAIPanelStore, type AIPanelContent } from '@/store/aiPanelStore'

interface PromptChipProps {
  label:   string
  content: AIPanelContent
}

export function PromptChip({ label, content }: PromptChipProps) {
  const openWithContent = useAIPanelStore((s) => s.openWithContent)

  return (
    <button
      onClick={() => openWithContent(content)}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      style={{
        background:  'rgba(129,140,248,0.08)',
        border:      '1px solid rgba(129,140,248,0.20)',
        color:       'var(--accent-secondary)',
        fontFamily:  'var(--font-mono)',
      }}
    >
      <Sparkles size={11} />
      {label}
    </button>
  )
}
EOF
echo "✅ PromptChip.tsx"

# ── 6. SectionBadge ───────────────────────────────────────────────────────────
cat > src/components/phases/SectionBadge.tsx << 'EOF'
import { cn } from '@/lib/utils'

type BadgeType = 'taught' | 'scaffolded' | 'learner' | 'warning'

interface SectionBadgeProps { type: BadgeType; className?: string }

const CONFIG: Record<BadgeType, { label: string; bg: string; border: string; color: string }> = {
  taught:     { label: 'Taught',     bg: 'rgba(129,140,248,0.10)', border: 'rgba(129,140,248,0.25)', color: 'var(--accent-secondary)' },
  scaffolded: { label: 'Scaffolded', bg: 'rgba(255,107,53,0.10)',  border: 'rgba(255,107,53,0.25)',  color: 'var(--accent-primary)'   },
  learner:    { label: 'Your turn',  bg: 'rgba(16,185,129,0.10)',  border: 'rgba(16,185,129,0.25)',  color: 'var(--accent-green)'     },
  warning:    { label: 'Watch out',  bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)', color: 'var(--accent-red)'       },
}

export function SectionBadge({ type, className }: SectionBadgeProps) {
  const cfg = CONFIG[type]
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold', className)}
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
      {cfg.label}
    </span>
  )
}
EOF
echo "✅ SectionBadge.tsx"

# ── 7. MCQ Component ──────────────────────────────────────────────────────────
cat > src/components/phases/MCQ.tsx << 'EOF'
import { useState }                from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react'
import { cn }                      from '@/lib/utils'
import { staggerChildren, staggerItem } from '@/lib/motionVariants'

export interface MCQOption {
  id:      string
  label:   string
  correct: boolean
}

interface MCQProps {
  question:    string
  options:     MCQOption[]
  explanation: string
  onCorrect:   () => void
  ctaLabel?:   string
}

type AnswerState = 'unanswered' | 'correct' | 'incorrect'

export function MCQ({ question, options, explanation, onCorrect, ctaLabel = 'Continue to next phase →' }: MCQProps) {
  const [selected,    setSelected]    = useState<string | null>(null)
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered')
  const [shaking,     setShaking]     = useState(false)

  function handleSelect(option: MCQOption) {
    if (answerState === 'correct') return
    setSelected(option.id)
    if (option.correct) {
      setAnswerState('correct')
    } else {
      setAnswerState('incorrect')
      setShaking(true)
      setTimeout(() => { setShaking(false); setAnswerState('unanswered'); setSelected(null) }, 1200)
    }
  }

  return (
    <div className="rounded-2xl p-6 space-y-5"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center mt-0.5"
          style={{ background: 'rgba(129,140,248,0.10)', border: '1px solid rgba(129,140,248,0.20)' }}>
          <HelpCircle size={15} style={{ color: 'var(--accent-secondary)' }} />
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>
            Knowledge check
          </p>
          <p className="text-sm font-semibold leading-snug"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            {question}
          </p>
        </div>
      </div>

      <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="space-y-2">
        {options.map((option) => {
          const isSelected  = selected === option.id
          const isCorrect   = answerState === 'correct'   && isSelected
          const isIncorrect = answerState === 'incorrect' && isSelected
          return (
            <motion.button key={option.id} variants={staggerItem}
              animate={isIncorrect && shaking ? { x: [0,-8,8,-6,6,-4,4,0], transition: { duration: 0.5 } } : {}}
              onClick={() => handleSelect(option)}
              disabled={answerState === 'correct'}
              className={cn('w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200',
                answerState !== 'correct' && !isSelected && 'hover:border-[var(--border-default)]',
                answerState === 'correct' && !isSelected && 'opacity-40 cursor-not-allowed')}
              style={{
                background: isCorrect ? 'rgba(16,185,129,0.08)' : isIncorrect ? 'rgba(248,113,113,0.08)' : isSelected ? 'rgba(129,140,248,0.08)' : 'var(--bg-elevated)',
                border: isCorrect ? '1px solid rgba(16,185,129,0.30)' : isIncorrect ? '1px solid rgba(248,113,113,0.30)' : isSelected ? '1px solid rgba(129,140,248,0.30)' : '1px solid var(--border-subtle)',
              }}>
              <span className="w-6 h-6 rounded-md shrink-0 flex items-center justify-center text-xs font-bold"
                style={{ background: isCorrect ? 'rgba(16,185,129,0.15)' : isIncorrect ? 'rgba(248,113,113,0.15)' : 'var(--border-subtle)', color: isCorrect ? 'var(--accent-green)' : isIncorrect ? 'var(--accent-red)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {option.id.toUpperCase()}
              </span>
              <span className="flex-1 text-sm" style={{ color: isCorrect ? 'var(--accent-green)' : isIncorrect ? 'var(--accent-red)' : 'var(--text-secondary)', fontFamily: 'var(--font-heading)' }}>
                {option.label}
              </span>
              {isCorrect   && <CheckCircle size={16} style={{ color: 'var(--accent-green)' }} />}
              {isIncorrect && <XCircle     size={16} style={{ color: 'var(--accent-red)'   }} />}
            </motion.button>
          )
        })}
      </motion.div>

      <AnimatePresence>
        {answerState === 'correct' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}>
            <CheckCircle size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--accent-green)' }} />
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--accent-green)' }}>Correct. </strong>{explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {answerState === 'incorrect' && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-xs text-center" style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>
            Not quite — think carefully and try again.
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {answerState === 'correct' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
            <button onClick={onCorrect}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{ background: 'var(--accent-primary)', color: '#fff', fontFamily: 'var(--font-heading)', boxShadow: '0 0 20px rgba(255,107,53,0.25)' }}>
              {ctaLabel}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
EOF
echo "✅ MCQ.tsx"

# ── 8. Phase 0 — Business Context ─────────────────────────────────────────────
cat > src/pages/CaseStudy/phases/Phase0.tsx << 'EOF'
import { useState }                from 'react'
import { useNavigate, useParams }  from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Building2, Users, Package, BarChart3, Shield, MessageSquare } from 'lucide-react'
import { useProgressStore }        from '@/store/progressStore'
import { PromptChip }              from '@/components/phases/PromptChip'
import { staggerChildren, staggerItem } from '@/lib/motionVariants'

// ── MMT Business Canvas Data ──────────────────────────────────────────────────
interface CanvasCard {
  id:      string
  icon:    React.ElementType
  title:   string
  tagline: string
  color:   string
  glow:    string
  content: string[]
}

const CANVAS_CARDS: CanvasCard[] = [
  {
    id:      'business-model',
    icon:    Building2,
    title:   'Business Model',
    tagline: 'How MMT makes money',
    color:   'var(--accent-primary)',
    glow:    'rgba(255,107,53,0.08)',
    content: [
      'MakeMyTrip earns 10–15% commission on every hotel booking completed through its platform.',
      'Revenue = Bookings × Average Order Value × Commission Rate. If any of these three fall, revenue falls.',
      'Hotels pay MMT only when a traveler completes a booking — no booking, no revenue. This makes Bookings/DAU the single most critical health metric.',
      'Secondary revenue streams include flight bookings, holiday packages, and bus/train tickets — but hotels drive 60% of gross profit.',
    ],
  },
  {
    id:      'user-segments',
    icon:    Users,
    title:   'User Segments',
    tagline: 'Who books on MMT',
    color:   'var(--accent-secondary)',
    glow:    'rgba(129,140,248,0.08)',
    content: [
      'Leisure travelers (65%): Families and couples booking 2–4 months in advance for holidays. Price-sensitive, comparison-shop heavily, high cancellation rates.',
      'Business travelers (25%): Book within 7 days of travel, less price-sensitive, prefer 4-5 star hotels in metro cities, book on mobile during commutes.',
      'Last-minute bookers (10%): Same-day or next-day bookings, highest CVR but smallest segment. Often book via app notifications.',
      'Understanding which segment drove the drop is critical — a 13% drop in leisure CVR has 3x more impact than the same drop in last-minute.',
    ],
  },
  {
    id:      'supply-side',
    icon:    Package,
    title:   'Supply Side',
    tagline: 'What users see and book',
    color:   'var(--accent-green)',
    glow:    'rgba(16,185,129,0.08)',
    content: [
      'MMT lists 50,000+ hotels across India — 5-star chains, boutique stays, budget lodges, and homestays.',
      'Supply mix matters for CVR. If high-converting budget hotels are de-listed or go out of stock, CVR falls even with stable traffic.',
      'Hotel availability, pricing, and review freshness all affect the Detail→Checkout funnel stage.',
      'MMT also competes with hotels\' own websites — if a hotel offers direct booking discounts, users may drop off at the payment stage.',
    ],
  },
  {
    id:      'key-metrics',
    icon:    BarChart3,
    title:   'Key Metrics',
    tagline: 'What the team tracks daily',
    color:   'var(--accent-primary)',
    glow:    'rgba(255,107,53,0.08)',
    content: [
      'Bookings/DAU: Primary health metric. Measures how efficiently MMT converts active users into paying customers.',
      'GMV (Gross Merchandise Value): Total value of bookings before cancellations. Tracks top-line demand.',
      'CVR (Conversion Rate): Bookings ÷ Sessions. Measures quality of the user experience and product-market fit.',
      'Cancellation Rate: High cancellations inflate gross bookings but destroy net revenue. Tracked separately.',
      'DAU/MAU Ratio: Measures stickiness — do users return daily or monthly? A falling ratio signals engagement decay.',
    ],
  },
  {
    id:      'competitive-moat',
    icon:    Shield,
    title:   'Competitive Moat',
    tagline: 'Why users choose MMT over alternatives',
    color:   'var(--accent-secondary)',
    glow:    'rgba(129,140,248,0.08)',
    content: [
      'Largest hotel inventory in India — users trust MMT will always have options even in Tier-2 cities.',
      'MMT wallet and loyalty points create switching costs — users with accumulated rewards are less likely to switch to Goibibo or OYO.',
      'Review ecosystem: 10M+ user reviews create a trust moat. A new competitor can\'t replicate this overnight.',
      'However: price is still king. If a competitor offers 5% lower price consistently, the moat erodes fast. MMT must win on experience, not just inventory.',
    ],
  },
]

// ── Head of Growth message ─────────────────────────────────────────────────────
const SLACK_MESSAGE = {
  sender:    'Priya Mehta',
  role:      'Head of Growth, MakeMyTrip',
  time:      'Today at 9:14 AM',
  channel:   '#analytics-escalation',
  lines: [
    'Team — flagging this as P0.',
    'We\'ve seen a sustained 18% drop in Bookings/DAU over the last 60 days. This isn\'t a one-day blip. The trend started around day -62 and hasn\'t recovered.',
    'GMV impact is already ₹4.2Cr. If this continues through the festival season, we\'re looking at ₹30Cr+ miss for the quarter.',
    'I need a full root cause analysis — not hypotheses, not guesses. Data-backed. I want to know: What broke? When did it break? Why? And what\'s our fastest path to recovery?',
    'The board review is in 3 weeks. I need slides by Friday.',
  ],
  urgency: 'P0 — Board visibility',
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Phase0() {
  const { slug }     = useParams<{ slug: string }>()
  const navigate      = useNavigate()
  const { completePhase, isCompleted } = useProgressStore()
  const completed     = isCompleted('phase-0')
  const [openCard, setOpenCard] = useState<string | null>(null)
  const [briefRead,  setBriefRead]  = useState(false)

  function toggleCard(id: string) {
    setOpenCard((prev) => (prev === id ? null : id))
  }

  function handleComplete() {
    completePhase('phase-0')
    navigate(`/case-study/${slug}/phase-1`)
  }

  return (
    <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="space-y-12">

      {/* ── Section 1: MMT Business Canvas ── */}
      <section id="business-canvas" className="space-y-5">
        <motion.div variants={staggerItem} className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Section 01
            </span>
          </div>
          <h2 className="text-xl font-bold"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            MMT Business Canvas
          </h2>
          <p className="text-sm leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}>
            Before you touch the data, you need to understand the business.
            A great analyst knows the company model as well as any PM.
            Click each card to expand.
          </p>
        </motion.div>

        <motion.div variants={staggerChildren} className="space-y-3">
          {CANVAS_CARDS.map((card, i) => {
            const Icon     = card.icon
            const isOpen   = openCard === card.id
            return (
              <motion.div
                key={card.id}
                variants={staggerItem}
                custom={i}
              >
                {/* Card header — always visible */}
                <button
                  onClick={() => toggleCard(card.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200 hover:border-[var(--border-default)]"
                  style={{
                    background:   isOpen ? card.glow : 'var(--bg-surface)',
                    border:       `1px solid ${isOpen ? card.color + '30' : 'var(--border-subtle)'}`,
                    borderRadius: isOpen ? '16px 16px 0 0' : '16px',
                  }}
                  aria-expanded={isOpen}
                >
                  <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
                    style={{ background: card.glow, border: `1px solid ${card.color}25` }}>
                    <Icon size={18} style={{ color: card.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold"
                      style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      {card.title}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {card.tagline}
                    </p>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
                  </motion.div>
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                      style={{
                        background:    card.glow,
                        border:        `1px solid ${card.color}30`,
                        borderTop:     'none',
                        borderRadius:  '0 0 16px 16px',
                      }}
                    >
                      <div className="px-5 pb-5 pt-2 space-y-3">
                        {card.content.map((line, j) => (
                          <motion.div
                            key={j}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: j * 0.08, duration: 0.35 }}
                            className="flex items-start gap-3"
                          >
                            <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-2"
                              style={{ background: card.color }} />
                            <p className="text-sm leading-relaxed"
                              style={{ color: 'var(--text-secondary)' }}>
                              {line}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Prompt chips for business canvas */}
        <motion.div variants={staggerItem} className="flex flex-wrap gap-2 pt-2">
          <PromptChip label="How does MMT revenue work?" content={{ type: 'insight', title: 'MMT Revenue Model', text: 'MakeMyTrip earns via commission. Every ₹100 booking generates ₹10-15 for MMT. This means a 18% drop in bookings = 18% direct revenue loss, assuming AOV is stable. The business model makes conversion the most critical lever.' }} />
          <PromptChip label="What is MMT\'s biggest risk?" content={{ type: 'insight', title: 'MMT Risk Profile', text: 'Price competition from Goibibo (sister company), OYO, and direct hotel bookings. MMT\'s moat is inventory depth + reviews + wallet ecosystem. If CVR drops, it signals the moat is eroding.' }} />
        </motion.div>
      </section>

      {/* ── Section 2: Head of Growth Brief ── */}
      <section id="growth-brief" className="space-y-5">
        <motion.div variants={staggerItem} className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Section 02
            </span>
          </div>
          <h2 className="text-xl font-bold"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            The Brief
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            This just landed in your Slack. Read it carefully — this is your mandate.
          </p>
        </motion.div>

        {/* Slack message card */}
        <motion.div variants={staggerItem}
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid var(--border-default)' }}>
          {/* Slack header */}
          <div className="flex items-center gap-3 px-5 py-3"
            style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
            <MessageSquare size={14} style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {SLACK_MESSAGE.channel}
            </span>
          </div>

          {/* Message body */}
          <div className="px-5 py-5 space-y-4"
            style={{ background: 'var(--bg-surface)' }}>
            {/* Sender */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.3), rgba(129,140,248,0.3))', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                PM
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                    {SLACK_MESSAGE.sender}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {SLACK_MESSAGE.time}
                  </span>
                </div>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {SLACK_MESSAGE.role}
                </span>
              </div>
            </div>

            {/* Message lines — reveal one at a time */}
            <div className="space-y-3 pl-12">
              {SLACK_MESSAGE.lines.map((line, i) => (
                <motion.p
                  key={`slack-line-${i}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.18, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-sm leading-relaxed"
                  style={{ color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                >
                  {i === 0 && <strong>{line}</strong>}
                  {i !== 0 && line}
                </motion.p>
              ))}

              {/* Urgency badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mt-2"
                style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.25)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent-red)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>
                  {SLACK_MESSAGE.urgency}
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Prompt chips */}
        <motion.div variants={staggerItem} className="flex flex-wrap gap-2">
          <PromptChip label="What is the financial impact?" content={{ type: 'insight', title: 'Financial Impact', text: 'At ₹4.2Cr already lost and a 3-week trend, the run-rate loss is ~₹2Cr/week. Festival season multiplier (2–3x) puts Q4 at risk of ₹30Cr+ miss. This is a board-level incident.' }} />
          <PromptChip label="What does the board want?" content={{ type: 'insight', title: 'Board Expectations', text: 'The board wants three things: (1) Root cause clarity — not "we think" but "the data shows". (2) Speed — fastest path to recovery. (3) Confidence — that you have full visibility and won\'t be surprised again.' }} />
        </motion.div>

        {/* CTA to Phase 1 */}
        <motion.div variants={staggerItem}>
          {!completed ? (
            <button
              onClick={() => { setBriefRead(true); handleComplete() }}
              className="w-full py-4 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{ background: 'var(--accent-primary)', color: '#fff', fontFamily: 'var(--font-heading)', boxShadow: '0 0 24px rgba(255,107,53,0.20)' }}>
              I understand the brief — Begin Phase 1: Understanding the Problem →
            </button>
          ) : (
            <div className="flex items-center gap-3 px-5 py-4 rounded-xl"
              style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}>
              <span style={{ color: 'var(--accent-green)', fontSize: '18px' }}>✓</span>
              <p className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>
                Phase 0 complete — Phase 1 unlocked
              </p>
            </div>
          )}
        </motion.div>
      </section>
    </motion.div>
  )
}
EOF
echo "✅ Phase0.tsx"

# ── 9. Phase 1 — Understanding the Problem ───────────────────────────────────
cat > src/pages/CaseStudy/phases/Phase1.tsx << 'EOF'
import { useState }                from 'react'
import { useNavigate, useParams }  from 'react-router-dom'
import { motion }                  from 'framer-motion'
import { useProgressStore }        from '@/store/progressStore'
import { MCQ, type MCQOption }     from '@/components/phases/MCQ'
import { SectionBadge }            from '@/components/phases/SectionBadge'
import { PromptChip }              from '@/components/phases/PromptChip'
import { staggerChildren, staggerItem } from '@/lib/motionVariants'

// ── Constants ─────────────────────────────────────────────────────────────────
const DEFINITIONS = [
  {
    term:       'Bookings/DAU',
    formula:    'Total Bookings ÷ Daily Active Users',
    why:        'The composite health metric. Tells you if users are converting, not just showing up.',
    color:      'var(--accent-primary)',
    glow:       'rgba(255,107,53,0.08)',
  },
  {
    term:       'DAU (Daily Active Users)',
    formula:    'Logged-in unique users who open the app in a calendar day',
    why:        'Not anonymous visitors, not bots. Logged-in = qualified demand signal.',
    color:      'var(--accent-secondary)',
    glow:       'rgba(129,140,248,0.08)',
  },
  {
    term:       'Bookings',
    formula:    'Gross completed payments — not clicks, not cart adds, not cancellations',
    why:        'Gross bookings capture purchase intent. Net bookings (post-cancellation) are an ops metric.',
    color:      'var(--accent-green)',
    glow:       'rgba(16,185,129,0.08)',
  },
  {
    term:       'Percentage Point (pp)',
    formula:    'The absolute difference between two percentages',
    why:        'CVR going from 12% to 10% is a 2pp drop, not a 2% drop. Confusing these is a career-ending mistake in analytics.',
    color:      'var(--accent-primary)',
    glow:       'rgba(255,107,53,0.08)',
  },
]

const SANITY_CHECKS = [
  {
    check:    'Tracking integrity',
    question: 'Is the SDK firing correctly on all platforms?',
    why:      'An iOS SDK update in week -9 could silently break event tracking, making real bookings appear as drops.',
    status:   'verified',
  },
  {
    check:    'Definition consistency',
    question: 'Has the DAU definition changed? Were bots recently filtered?',
    why:      'If engineering filtered 200K bot accounts from DAU, the denominator drops and the ratio spikes — not a real change.',
    status:   'verified',
  },
  {
    check:    'Data pipeline health',
    question: 'Are there any ETL delays or missing data windows?',
    why:      'A 3-hour ETL delay in a daily dashboard makes day-over-day comparisons unreliable.',
    status:   'verified',
  },
  {
    check:    'Metric scope',
    question: 'Hotel-only or all verticals (flights, buses)?',
    why:      'If flights CVR fell due to external factors, it would drag the blended metric down misleadingly.',
    status:   'verified',
  },
]

const TIMELINE_POINTS = [
  { day: '-90', label: 'Baseline',     value: 12.0, note: 'Stable period. Bookings/DAU consistently at 12%.' },
  { day: '-75', label: 'Stable',       value: 12.1, note: 'No meaningful change. Product stable, no releases.' },
  { day: '-62', label: 'Drop starts',  value: 11.6, note: 'First deviation. Drop of 0.4pp — within noise but worth noting.' },
  { day: '-45', label: 'Accelerates',  value: 11.0, note: 'Drop accelerates. Now 1pp below baseline. Not noise anymore.' },
  { day: '-30', label: 'Confirmed',    value: 10.5, note: 'Sustained decline confirmed. 1.5pp below baseline over 60 days.' },
  { day: '-15', label: 'Worsening',    value: 10.2, note: 'No recovery despite no new releases. Structural problem.' },
  { day: '0',   label: 'Today',        value: 10.1, note: 'Current state. 1.9pp total drop. Investigation initiated.' },
]

const SEASONALITY_OPTIONS: MCQOption[] = [
  { id: 'a', label: 'Compare this quarter\'s Bookings/DAU to same quarter last year', correct: true  },
  { id: 'b', label: 'Look at the last 7 days of data only',                           correct: false },
  { id: 'c', label: 'Wait until next month to see if it recovers naturally',           correct: false },
]

const SEASONALITY_EXPLANATION =
  'YoY comparison on the same metric isolates seasonal patterns. If last year\'s Q4 also showed a similar dip, it\'s seasonal. If last year was flat or growing in the same period, the current drop is structural. This is the only defensible way to rule out seasonality.'

// ── Component ─────────────────────────────────────────────────────────────────
export default function Phase1() {
  const { slug }   = useParams<{ slug: string }>()
  const navigate    = useNavigate()
  const { completePhase, isCompleted } = useProgressStore()
  const completed   = isCompleted('phase-1')

  function handleComplete() {
    completePhase('phase-1')
    navigate(`/case-study/${slug}/phase-2`)
  }

  return (
    <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="space-y-14">

      {/* ── Section 1: Definition Clarity ── */}
      <section id="definition-clarity" className="space-y-5">
        <motion.div variants={staggerItem} className="flex items-center gap-3">
          <SectionBadge type="taught" />
          <span className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Section 01 — Definition Clarity
          </span>
        </motion.div>
        <motion.div variants={staggerItem} className="space-y-2">
          <h2 className="text-xl font-bold"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            Get the definitions right before anything else
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Half of analytics mistakes happen because two people have different definitions of the same metric.
            Lock these down before you look at a single number.
          </p>
        </motion.div>

        <motion.div variants={staggerChildren} className="grid grid-cols-2 gap-4">
          {DEFINITIONS.map((def, i) => (
            <motion.div key={def.term} variants={staggerItem} custom={i}
              className="rounded-2xl p-5 space-y-3"
              style={{ background: def.glow, border: `1px solid ${def.color}25` }}>
              <p className="text-xs font-bold uppercase tracking-wider"
                style={{ color: def.color, fontFamily: 'var(--font-mono)' }}>
                {def.term}
              </p>
              <p className="text-sm font-semibold leading-snug"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                {def.formula}
              </p>
              <p className="text-xs leading-relaxed"
                style={{ color: 'var(--text-secondary)', borderTop: `1px solid ${def.color}15`, paddingTop: '10px' }}>
                <strong style={{ color: def.color }}>Why it matters: </strong>{def.why}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={staggerItem} className="flex flex-wrap gap-2">
          <PromptChip label="Why not use Net Bookings?" content={{ type: 'insight', title: 'Gross vs Net Bookings', text: 'Net bookings fluctuate heavily with cancellation policy changes, customer service improvements, or seasonal cancellation spikes. Gross bookings isolate purchase intent — what you actually sold, before operations get involved. For a growth investigation, gross is cleaner.' }} />
          <PromptChip label="What counts as a DAU?" content={{ type: 'insight', title: 'DAU Definition Deep Dive', text: 'At MMT, a DAU is a logged-in unique user who opens the app or web with intent — not a bot, not a deep link redirect that immediately bounces. The logged-in requirement filters ~35% of raw sessions that have zero conversion potential. Using raw sessions would make the denominator 35% larger and make CVR look worse than it is.' }} />
        </motion.div>
      </section>

      {/* ── Section 2: Data Sanity ── */}
      <section id="data-sanity" className="space-y-5">
        <motion.div variants={staggerItem} className="flex items-center gap-3">
          <SectionBadge type="taught" />
          <span className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Section 02 — Data Sanity
          </span>
        </motion.div>
        <motion.div variants={staggerItem} className="space-y-2">
          <h2 className="text-xl font-bold"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            Verify the data before you trust it
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            A metric drop can be real or an artifact of broken tracking. A senior analyst always runs these four checks first.
            In this case, all four are verified — but you need to know what they are and why they matter.
          </p>
        </motion.div>

        <motion.div variants={staggerChildren} className="space-y-3">
          {SANITY_CHECKS.map((item, i) => (
            <motion.div key={item.check} variants={staggerItem} custom={i}
              className="flex items-start gap-4 p-4 rounded-xl"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
              <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center mt-0.5"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.30)' }}>
                <span style={{ color: 'var(--accent-green)', fontSize: '11px', fontWeight: 700 }}>✓</span>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold"
                  style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  {item.check}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  {item.question}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {item.why}
                </p>
              </div>
              <span className="text-xs px-2 py-1 rounded-md shrink-0"
                style={{ background: 'rgba(16,185,129,0.10)', color: 'var(--accent-green)', fontFamily: 'var(--font-mono)', border: '1px solid rgba(16,185,129,0.20)' }}>
                Verified
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={staggerItem} className="flex flex-wrap gap-2">
          <PromptChip label="Show me how tracking breaks" content={{ type: 'insight', title: 'How Tracking Breaks', text: 'Common failure: an iOS app update removes a screen and the checkout event stops firing. Absolute bookings look flat in the database (real transactions still process) but the analytics event count drops. Result: CVR appears to crash while revenue is stable. Always cross-check analytics events with payment gateway logs.' }} />
        </motion.div>
      </section>

      {/* ── Section 3: Timeline Review ── */}
      <section id="timeline-review" className="space-y-5">
        <motion.div variants={staggerItem} className="flex items-center gap-3">
          <SectionBadge type="taught" />
          <span className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Section 03 — Timeline Review
          </span>
        </motion.div>
        <motion.div variants={staggerItem} className="space-y-2">
          <h2 className="text-xl font-bold"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            Gradual decay vs sudden crash
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            The shape of the drop tells you what kind of problem you have.
            A sudden crash = a single event (deploy, outage). A gradual decay = a structural shift (product change, supply issue, competitive pressure).
          </p>
        </motion.div>

        {/* Timeline visual */}
        <motion.div variants={staggerItem}
          className="rounded-2xl p-6 space-y-5"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs uppercase tracking-widest"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              90-day Bookings/DAU trend
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-px" style={{ background: 'var(--accent-green)' }} />
                <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Baseline</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-px" style={{ background: 'var(--accent-red)' }} />
                <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Drop</span>
              </div>
            </div>
          </div>

          {/* Timeline rows */}
          <div className="space-y-2">
            {TIMELINE_POINTS.map((point, i) => {
              const isDropping = parseFloat(point.value.toString()) < 12.0
              const barWidth   = ((point.value - 9.5) / (12.5 - 9.5)) * 100
              return (
                <motion.div key={point.day}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-4"
                >
                  <span className="text-xs w-10 shrink-0 text-right"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {point.day}d
                  </span>
                  <div className="flex-1 relative h-8 flex items-center">
                    <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--border-subtle)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: isDropping ? 'var(--accent-red)' : 'var(--accent-green)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-bold w-10 shrink-0"
                    style={{ color: isDropping ? 'var(--accent-red)' : 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
                    {point.value}%
                  </span>
                  <span className="text-xs flex-1 hidden md:block"
                    style={{ color: 'var(--text-muted)' }}>
                    {point.label}
                  </span>
                </motion.div>
              )
            })}
          </div>

          {/* Key insight */}
          <div className="px-4 py-3 rounded-xl mt-2"
            style={{ background: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.15)' }}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--accent-secondary)' }}>Shape verdict: </strong>
              This is gradual decay over 60 days — not a sudden crash. This rules out an outage or single bad deploy.
              It points to a structural change: a product modification, supply shift, or behavioral change that compounded over time.
            </p>
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="flex flex-wrap gap-2">
          <PromptChip label="Show full 90-day chart" content={{ type: 'chart', chartId: 'trend-90d', title: '90-Day Bookings/DAU Trend' }} />
          <PromptChip label="What does sudden crash look like?" content={{ type: 'insight', title: 'Sudden vs Gradual', text: 'A sudden crash: metric drops 30% overnight on day -5 and stays flat. Cause: payment gateway outage, app crash, or a single bad A/B test. A gradual decay: metric drifts down 0.2pp/week over 10 weeks. Cause: product quality degradation, supply reduction, or competitive pressure. Different shapes demand different investigations.' }} />
        </motion.div>
      </section>

      {/* ── Section 4: Seasonality Check ── */}
      <section id="seasonality" className="space-y-5">
        <motion.div variants={staggerItem} className="flex items-center gap-3">
          <SectionBadge type="learner" />
          <span className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Section 04 — Seasonality Check
          </span>
        </motion.div>
        <motion.div variants={staggerItem} className="space-y-2">
          <h2 className="text-xl font-bold"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            Rule out seasonality
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Travel is highly seasonal. Before you call this a product problem, you must check if this is just a normal annual dip.
            How would you verify that?
          </p>
        </motion.div>

        {completed ? (
          <motion.div variants={staggerItem}
            className="flex items-center gap-3 px-5 py-4 rounded-xl"
            style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}>
            <span style={{ color: 'var(--accent-green)', fontSize: '18px' }}>✓</span>
            <p className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>
              Phase 1 complete — Phase 2 unlocked
            </p>
          </motion.div>
        ) : (
          <motion.div variants={staggerItem}>
            <MCQ
              question="How would you check if this drop is just seasonal?"
              options={SEASONALITY_OPTIONS}
              explanation={SEASONALITY_EXPLANATION}
              onCorrect={handleComplete}
              ctaLabel="Phase 1 complete — Begin Metric Decomposition →"
            />
          </motion.div>
        )}

        <motion.div variants={staggerItem} className="flex flex-wrap gap-2">
          <PromptChip label="Show YoY comparison" content={{ type: 'chart', chartId: 'yoy-comparison', title: 'Year-over-Year Bookings/DAU' }} />
          <PromptChip label="What is the verdict on seasonality?" content={{ type: 'insight', title: 'Seasonality Verdict', text: 'In 2024, Q4 showed a 0.3pp dip in Oct-Nov that recovered by Dec (festival bookings). In 2025, the drop started 60 days earlier and is 6x deeper. The YoY comparison confirms: this is NOT seasonal. It is structural.' }} />
        </motion.div>
      </section>
    </motion.div>
  )
}
EOF
echo "✅ Phase1.tsx (4 sections)"

# ── 10. Update CaseStudy shell to use new AIPanel ─────────────────────────────
cat > src/pages/CaseStudy/index.tsx << 'EOF'
import { useEffect }                         from 'react'
import { useParams, useNavigate, Outlet }    from 'react-router-dom'
import { MobileGate }                        from '@/components/ui/MobileGate'
import { ProgressNav }                       from '@/components/layout/ProgressNav'
import { CenterPanel }                       from '@/components/layout/CenterPanel'
import { AIPanel }                           from '@/components/ai/AIPanel'
import { useProgressStore }                  from '@/store/progressStore'

const DESKTOP_BREAKPOINT = 1024

export default function CaseStudyShell() {
  const { slug, phase } = useParams<{ slug: string; phase?: string }>()
  const navigate         = useNavigate()
  const currentPhaseId   = useProgressStore((s) => s.currentPhaseId)

  const isDesktop =
    typeof window !== 'undefined' && window.innerWidth >= DESKTOP_BREAKPOINT

  useEffect(() => {
    if (!phase && slug) {
      navigate(`/case-study/${slug}/${currentPhaseId}`, { replace: true })
    }
  }, [phase, slug, currentPhaseId, navigate])

  if (!isDesktop) return <MobileGate />

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <ProgressNav />
      <CenterPanel />
      <AIPanel />
    </div>
  )
}
EOF
echo "✅ CaseStudyShell updated"

# ── 11. Update Router ─────────────────────────────────────────────────────────
cat > src/app/Router.tsx << 'EOF'
import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense }          from 'react'

const Home           = lazy(() => import('@/pages/Home'))
const CaseStudies    = lazy(() => import('@/pages/CaseStudies'))
const CaseStudyShell = lazy(() => import('@/pages/CaseStudy'))
const Phase0         = lazy(() => import('@/pages/CaseStudy/phases/Phase0'))
const Phase1         = lazy(() => import('@/pages/CaseStudy/phases/Phase1'))
const Phase2         = lazy(() => import('@/pages/CaseStudy/phases/Phase2'))
const PhaseView      = lazy(() => import('@/pages/CaseStudy/phases/PhaseView'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
      <span className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }} />
    </div>
  )
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/case-study/:slug" element={<CaseStudyShell />}>
          <Route path="phase-0" element={<Phase0 />} />
          <Route path="phase-1" element={<Phase1 />} />
          <Route path="phase-2" element={<Phase2 />} />
          <Route path=":phase"  element={<PhaseView />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
EOF
echo "✅ Router.tsx"

# ── 12. Barrel exports ────────────────────────────────────────────────────────
cat > src/components/phases/index.ts << 'EOF'
export { MCQ }          from './MCQ'
export { SectionBadge } from './SectionBadge'
export { PromptChip }   from './PromptChip'
EOF

cat > src/components/ai/index.ts << 'EOF'
export { AIPanel } from './AIPanel'
EOF
echo "✅ barrel exports"

# ── Gate 1: TypeScript ────────────────────────────────────────────────────────
echo ""
echo "🧠 Gate 1: Type checking..."
npx tsc --noEmit && echo "✅ Zero TypeScript errors" || echo "❌ Fix errors above"

# ── Gate 2: Build ─────────────────────────────────────────────────────────────
echo ""
echo "🔨 Gate 2: Build..."
npm run build && echo "✅ Build passed" || echo "❌ Build failed"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " P5 REBUILD complete. Files:"
echo "  src/store/progressStore.ts    (9 phases, phase-0 added)"
echo "  src/store/aiPanelStore.ts     (expanded + content types)"
echo "  src/components/layout/ProgressNav.tsx  (section dropdowns)"
echo "  src/components/ai/AIPanel.tsx (75vw expandable)"
echo "  src/components/phases/PromptChip.tsx"
echo "  src/components/phases/MCQ.tsx"
echo "  src/components/phases/SectionBadge.tsx"
echo "  src/pages/CaseStudy/phases/Phase0.tsx (MMT canvas + brief)"
echo "  src/pages/CaseStudy/phases/Phase1.tsx (4 sections)"
echo "  src/pages/CaseStudy/index.tsx (shell updated)"
echo "  src/app/Router.tsx"
echo ""
echo " Test:"
echo "  npm run dev"
echo "  ✓ Phase 0: 5 canvas cards expand/collapse"
echo "  ✓ Slack message reveals line by line"
echo "  ✓ CTA → navigates to phase-1"
echo "  ✓ Phase 1: 4 sections with badges + prompt chips"
echo "  ✓ Prompt chip → AI panel expands to 75vw"
echo "  ✓ Left nav section dropdown shows on active phase"
echo "  ✓ Section click → smooth scroll"
echo "  ✓ MCQ gate on seasonality section"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
