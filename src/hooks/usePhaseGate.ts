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
