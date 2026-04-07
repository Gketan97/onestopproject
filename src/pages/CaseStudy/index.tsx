import { useParams, useNavigate } from 'react-router-dom'
import { MobileGate } from '@/components/ui/MobileGate'
import { useProgressStore } from '@/store/progressStore'
import { Layout } from '@/components/layout/Layout'
import { FadeIn } from '@/components/animations/FadeIn'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Lock } from 'lucide-react'

export default function CaseStudyShell() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const currentPhase = useProgressStore((s) => s.currentPhase)
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024

  if (!isDesktop) return <MobileGate />

  return (
    <Layout>
      <section className="max-w-3xl mx-auto px-6 py-24 text-center space-y-10">
        <FadeIn className="space-y-4">
          <p className="text-xs font-mono text-ink3 uppercase tracking-widest">Incident File</p>
          <h1 className="text-4xl font-bold text-ink capitalize">{slug?.replace(/-/g, ' ')}</h1>
          <p className="text-ink2 leading-relaxed">
            You are about to enter a live strategic incident. Progress through each phase by
            demonstrating genuine analytical thinking.
          </p>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div className="glass border border-border rounded-2xl p-6 space-y-3 text-left max-w-sm mx-auto">
            <p className="text-xs font-mono text-ink3 uppercase tracking-wide">Current Phase</p>
            <p className="text-ink font-semibold capitalize flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
              {currentPhase}
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={0.25}>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate(`/case-study/${slug}/${currentPhase}`)}>
              Enter Simulation <ArrowRight size={18} />
            </Button>
            <Button variant="ghost" size="lg" onClick={() => navigate('/case-studies')}>
              <Lock size={16} /> Back
            </Button>
          </div>
        </FadeIn>
      </section>
    </Layout>
  )
}
