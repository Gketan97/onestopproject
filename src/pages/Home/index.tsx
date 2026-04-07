import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, Brain, Target } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { FadeIn } from '@/components/animations/FadeIn'

const FEATURES = [
  { icon: Brain,    title: 'Strategic Thinking',  description: 'Diagnose ambiguous business problems like senior PMs and analysts.' },
  { icon: BarChart3, title: 'Real Case Studies',  description: 'Investigate metric drops with compounding root causes — no toy examples.' },
  { icon: Target,   title: 'Phase-Gated Progress', description: 'Unlock deeper analysis phases only after demonstrating genuine insight.' },
]

export default function Home() {
  return (
    <Layout>
      <section className="max-w-7xl mx-auto px-6 py-24 space-y-24">
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <FadeIn>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Think like a <span className="text-gradient">Senior Analyst</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-lg text-ink2 leading-relaxed">
              Practice high-stakes strategic investigations. Not tutorials — real incident
              simulations where your analytical instincts get sharpened under pressure.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="flex items-center justify-center gap-4">
              <Link to="/case-studies">
                <Button size="lg">Start Investigating <ArrowRight size={18} /></Button>
              </Link>
              <Link to="/case-studies">
                <Button variant="secondary" size="lg">Browse Cases</Button>
              </Link>
            </div>
          </FadeIn>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, description }, i) => (
            <FadeIn key={title} delay={0.1 * i}>
              <Card hoverable>
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-ink">{title}</h3>
                    <p className="text-sm text-ink2 leading-relaxed">{description}</p>
                  </div>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>
    </Layout>
  )
}
