import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Phase =
  | 'orientation'
  | 'investigation'
  | 'hypothesis'
  | 'diagnosis'
  | 'recommendation'
  | 'debrief'

interface ProgressState {
  currentPhase: Phase
  unlockedPhases: Phase[]
  completedPhases: Phase[]
  phaseCompleted: (phase: Phase) => void
  unlockPhase: (phase: Phase) => void
  resetProgress: () => void
  isPhaseUnlocked: (phase: Phase) => boolean
  isPhaseCompleted: (phase: Phase) => boolean
}

const PHASE_ORDER: Phase[] = [
  'orientation','investigation','hypothesis',
  'diagnosis','recommendation','debrief',
]

const initialState = {
  currentPhase: 'orientation' as Phase,
  unlockedPhases: ['orientation'] as Phase[],
  completedPhases: [] as Phase[],
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialState,
      phaseCompleted: (phase) => {
        const next = PHASE_ORDER[PHASE_ORDER.indexOf(phase) + 1]
        set((s) => ({
          completedPhases: s.completedPhases.includes(phase) ? s.completedPhases : [...s.completedPhases, phase],
          unlockedPhases: next && !s.unlockedPhases.includes(next) ? [...s.unlockedPhases, next] : s.unlockedPhases,
          currentPhase: next ?? phase,
        }))
      },
      unlockPhase: (phase) =>
        set((s) => ({ unlockedPhases: s.unlockedPhases.includes(phase) ? s.unlockedPhases : [...s.unlockedPhases, phase] })),
      resetProgress: () => set(initialState),
      isPhaseUnlocked: (phase) => get().unlockedPhases.includes(phase),
      isPhaseCompleted: (phase) => get().completedPhases.includes(phase),
    }),
    { name: 'osc-progress' },
  ),
)
