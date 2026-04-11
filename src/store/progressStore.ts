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
