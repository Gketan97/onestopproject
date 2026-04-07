import { useNavigate } from 'react-router-dom'
import { useProgressStore, type Phase } from '@/store/progressStore'

export function usePhaseGate(slug: string, phase: Phase) {
  const navigate = useNavigate()
  const isPhaseUnlocked = useProgressStore((s) => s.isPhaseUnlocked)
  const canAccess = isPhaseUnlocked(phase)
  const redirectToCurrentPhase = () => {
    const current = useProgressStore.getState().currentPhase
    navigate(`/case-study/${slug}/${current}`, { replace: true })
  }
  return { canAccess, redirectToCurrentPhase }
}
