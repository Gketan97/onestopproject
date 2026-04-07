import { useParams, Navigate } from 'react-router-dom'
import { useProgressStore, type Phase } from '@/store/progressStore'
import { MobileGate } from '@/components/ui/MobileGate'
import { Layout } from '@/components/layout/Layout'
import { FadeIn } from '@/components/animations/FadeIn'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ChevronRight } from 'lucide-react'

export default function PhaseView() {
  const { slug, phase } = useParams<{ slug: string; phase: string }>()
  const { isPhaseUnlocked, phaseCompleted, currentPhase } = useProgressStore()
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024

  if (!isDesktop) return <MobileGate />

  const typedPhase = phase as Phase
  if (!isPhaseUnlocked(typedPhase)) {
    return <Navigate to={`/case-study/${slug}/${currentPhase}`} replace />
  }

  return (
    <Layout>
      <section className="max-w-5xl mx-auto px-6 py-16 space-y-10">
        <FadeIn className="space-y-2">
          <Badge variant="blue" className="font-mono text-xs">{slug?.replace(/-/g, ' ')}</Badge>
          <h1 className="text-3xl font-bold text-ink capitalize">{phase} Phase</h1>
          <p className="text-ink2">Complete this phase to unlock the next investigation step.</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="glass border border-border rounded-2xl p-8 min-h-64 flex items-center justify-center">
            <p className="text-ink3 text-sm font-mono">[ Phase content for "{phase}" loads here ]</p>
          </div>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="flex justify-end">
            <Button onClick={() => phaseCompleted(typedPhase)} size="lg">
              Complete Phase <ChevronRight size={18} />
            </Button>
          </div>
        </FadeIn>
      </section>
    </Layout>
  )
}
