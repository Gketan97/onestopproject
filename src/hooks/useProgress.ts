import { useProgressStore, type PhaseId } from '@/store/progressStore'

export function useProgress() {
  return useProgressStore()
}

export type { PhaseId }
