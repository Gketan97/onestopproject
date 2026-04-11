import { useEffect }                      from 'react'
import { useParams, useNavigate, Outlet } from 'react-router-dom'
import { MobileGate }                     from '@/components/ui/MobileGate'
import { ProgressNav }                    from '@/components/layout/ProgressNav'
import { CenterPanel }                    from '@/components/layout/CenterPanel'
import { ArjunModal }                     from '@/components/ai/ArjunModal'
import { useProgressStore }               from '@/store/progressStore'

const DESKTOP_BREAKPOINT = 1024

export default function CaseStudyShell() {
  const { slug, phase } = useParams<{ slug: string; phase?: string }>()
  const navigate         = useNavigate()
  const currentPhaseId   = useProgressStore((s) => s.currentPhaseId)
  const isDesktop        =
    typeof window !== 'undefined' && window.innerWidth >= DESKTOP_BREAKPOINT

  // Only redirect on initial load when no phase in URL
  useEffect(() => {
    if (!phase && slug) {
      navigate(`/case-study/${slug}/${currentPhaseId}`, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty deps — only run once on mount

  if (!isDesktop) return <MobileGate />

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <ProgressNav />
      <div className="flex-1 min-w-0 overflow-hidden">
        <CenterPanel />
      </div>
      {/* Arjun floating modal — always available */}
      <ArjunModal />
    </div>
  )
}
