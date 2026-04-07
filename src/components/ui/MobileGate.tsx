import { Monitor } from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'

export function MobileGate() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-8">
      <FadeIn className="max-w-sm w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto">
          <Monitor size={28} className="text-accent" />
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-ink">Desktop Required</h2>
          <p className="text-ink2 text-sm leading-relaxed">
            This experience requires a desktop screen (minimum 1024px wide).
          </p>
        </div>
        <div className="glass border border-border rounded-xl px-4 py-3 inline-block">
          <span className="text-xs font-mono text-ink3">min-width: 1024px</span>
        </div>
      </FadeIn>
    </div>
  )
}
