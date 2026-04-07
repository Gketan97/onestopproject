import { Link } from 'react-router-dom'
import { ArrowRight, Clock, TrendingDown } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FadeIn } from '@/components/animations/FadeIn'

const CASES = [
  { slug: 'revenue-leak',    title: 'Revenue Leak Investigation', company: 'E-Commerce Platform', metric: '18% GMV drop in 72hrs',       difficulty: 'intermediate', duration: '45–60 min', tags: ['Revenue','Funnel','SQL'] },
  { slug: 'makemytrip-dau', title: 'Bookings & DAU Decline',     company: 'MakeMyTrip',           metric: '4 compounding root causes',   difficulty: 'advanced',     duration: '60–90 min', tags: ['DAU','Bookings','Cohort'] },
] as const

const diffMap = { beginner: 'green', intermediate: 'blue', advanced: 'accent' } as const

export default function CaseStudies() {
  return (
    <Layout>
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-10">
        <FadeIn>
          <h1 className="text-3xl font-bold text-ink">Case Library</h1>
          <p className="text-ink2 mt-2">Real-world metric investigations. Each case unlocks progressively harder phases.</p>
        </FadeIn>
        <div className="grid md:grid-cols-2 gap-6">
          {CASES.map((cs, i) => (
            <FadeIn key={cs.slug} delay={0.08 * i}>
              <Link to={`/case-study/${cs.slug}`}>
                <Card hoverable className="h-full">
                  <div className="space-y-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-ink3 font-mono uppercase tracking-wider">{cs.company}</p>
                        <h2 className="font-semibold text-ink text-lg">{cs.title}</h2>
                      </div>
                      <Badge variant={diffMap[cs.difficulty]}>{cs.difficulty}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-accent font-medium">
                      <TrendingDown size={14} />{cs.metric}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 flex-wrap">
                        {cs.tags.map((tag) => <Badge key={tag} variant="muted">{tag}</Badge>)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-ink3">
                        <Clock size={12} />{cs.duration}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-blue font-medium">
                      Investigate <ArrowRight size={14} />
                    </div>
                  </div>
                </Card>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>
    </Layout>
  )
}
