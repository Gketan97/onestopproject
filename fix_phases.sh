#!/usr/bin/env bash
# PHASE SEQUENCE FIX
# Correct order: Context → Problem → Hypothesis → Segment → Decompose → Funnel → Size → Solve

set -euo pipefail

echo "📋 Phase Sequence Fix"
echo "────────────────────────────────────"

# Gate 0
for contract in UI_CONTRACT.md BUG_AUDIT.md CODE_QUALITY.md DEBT_REGISTER.md; do
  [ -f "$contract" ] && echo "  ✅ $contract" || { echo "  ❌ $contract missing"; exit 1; }
done

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
    subtitle: 'Definitions, sanity, timeline, and seasonality',
    order:    1,
    sections: [
      { id: 'definition-clarity', label: 'Definition Clarity'  },
      { id: 'data-sanity',        label: 'Data Sanity'         },
      { id: 'timeline-review',    label: 'Timeline Review'     },
      { id: 'seasonality',        label: 'Seasonality Check'   },
    ],
  },
  {
    id:       'phase-2',
    label:    'Hypothesis Building',
    subtitle: 'Form testable hypotheses before touching data',
    order:    2,
    sections: [
      { id: 'evidence-summary',    label: 'Evidence So Far'      },
      { id: 'hypothesis-template', label: 'Hypothesis Framework' },
      { id: 'red-herrings',        label: 'Eliminating Red Herrings' },
    ],
  },
  {
    id:       'phase-3',
    label:    'Segmentation',
    subtitle: 'Where is the drop concentrated?',
    order:    3,
    sections: [
      { id: 'platform-breakdown', label: 'Platform Breakdown'  },
      { id: 'adoption-curve',     label: 'Adoption Curve'      },
      { id: 'user-impact',        label: 'User Impact Sizing'  },
    ],
  },
  {
    id:       'phase-4',
    label:    'Metric Decomposition',
    subtitle: 'Which leg broke within the affected segment?',
    order:    4,
    sections: [
      { id: 'metric-tree',   label: 'Metric Tree'       },
      { id: 'leg-analysis',  label: 'CVR vs Engagement' },
      { id: 'data-table',    label: 'Segment Data'      },
    ],
  },
  {
    id:       'phase-5',
    label:    'Funnel Breakdown',
    subtitle: 'Which exact step in the funnel failed?',
    order:    5,
    sections: [
      { id: 'funnel-comparison', label: 'Before vs After'      },
      { id: 'platform-heatmap',  label: 'Platform Heatmap'     },
      { id: 'performance-data',  label: 'Performance Evidence' },
    ],
  },
  {
    id:       'phase-6',
    label:    'Root Cause Sizing',
    subtitle: 'How much did each cause contribute?',
    order:    6,
    sections: [
      { id: 'cause-breakdown', label: 'Cause Breakdown' },
      { id: 'impact-math',     label: 'Impact Math'     },
    ],
  },
  {
    id:       'phase-7',
    label:    'Solutions & Impact',
    subtitle: 'Fix with confidence, size the recovery',
    order:    7,
    sections: [
      { id: 'solution-portfolio', label: 'Solution Portfolio' },
      { id: 'sizing',             label: 'Impact Sizing'      },
      { id: 'completion',         label: 'RCA Brief'          },
    ],
  },
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
      progressPercent: () =>
        Math.round((get().completedPhases.length / PHASE_ORDER.length) * 100),
    }),
    { name: 'osc-progress' },
  ),
)
EOF
echo "✅ progressStore.ts — 8 phases, correct sequence"

# Update Router — phase-2 now goes to Hypothesis, not Metric Decomposition
cat > src/app/Router.tsx << 'EOF'
import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense }          from 'react'

const Home           = lazy(() => import('@/pages/Home'))
const CaseStudies    = lazy(() => import('@/pages/CaseStudies'))
const CaseStudyShell = lazy(() => import('@/pages/CaseStudy'))
const Phase0         = lazy(() => import('@/pages/CaseStudy/phases/Phase0'))
const Phase1         = lazy(() => import('@/pages/CaseStudy/phases/Phase1'))
const PhaseView      = lazy(() => import('@/pages/CaseStudy/phases/PhaseView'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--bg-base)' }}>
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
          <Route path=":phase"  element={<PhaseView />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
EOF
echo "✅ Router.tsx"

# Also update usePhaseGate to use new PhaseId type
cat > src/hooks/usePhaseGate.ts << 'EOF'
import { useNavigate } from 'react-router-dom'
import { useProgressStore, type PhaseId } from '@/store/progressStore'

interface UsePhaseGateReturn {
  canAccess:              boolean
  redirectToCurrentPhase: () => void
}

export function usePhaseGate(slug: string, phase: PhaseId): UsePhaseGateReturn {
  const navigate   = useNavigate()
  const isUnlocked = useProgressStore((s) => s.isUnlocked)
  const isCompleted = useProgressStore((s) => s.isCompleted)
  const canAccess  = isUnlocked(phase) || isCompleted(phase)

  const redirectToCurrentPhase = () => {
    const current = useProgressStore.getState().currentPhaseId
    navigate(`/case-study/${slug}/${current}`, { replace: true })
  }

  return { canAccess, redirectToCurrentPhase }
}
EOF
echo "✅ usePhaseGate.ts"

# Clear stale localStorage warning
echo ""
echo "⚠️  Clear stale progress in browser console:"
echo "   localStorage.removeItem('osc-progress'); location.reload()"

echo ""
echo "🧠 Type checking..."
npx tsc --noEmit && echo "✅ Zero errors" || echo "❌ Fix errors above"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Phase sequence fixed. Final 8-phase order:"
echo "  0  Business Context"
echo "  1  Understanding the Problem"
echo "  2  Hypothesis Building      ← think first"
echo "  3  Segmentation             ← where is the drop?"
echo "  4  Metric Decomposition     ← which leg in that segment?"
echo "  5  Funnel Breakdown         ← which step failed?"
echo "  6  Root Cause Sizing        ← quantify each cause"
echo "  7  Solutions & Impact       ← fix with confidence"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
