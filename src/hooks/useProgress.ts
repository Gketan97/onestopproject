import { useProgressStore, type Phase } from '@/store/progressStore'
export function useProgress() {
  return useProgressStore()
}
export type { Phase }
