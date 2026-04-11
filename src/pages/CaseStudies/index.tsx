import { motion }          from 'framer-motion'
import { Layout }          from '@/components/layout/Layout'
import { CaseStudyCard }   from '@/components/ui/CaseStudyCard'
import { Badge }           from '@/components/ui/Badge'
import { CASE_STUDIES }    from '@/data/caseStudies'
import { staggerChildren, fadeIn } from '@/lib/motionVariants'

export default function CaseStudies() {
  const available = CASE_STUDIES.filter((c) => c.available).length
  const total     = CASE_STUDIES.length

  return (
    <Layout>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div
          className="absolute -top-48 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)',
            filter:     'blur(80px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">

        {/* Page header */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mb-12 space-y-4"
        >
          <div className="flex items-center gap-3">
            <Badge variant="cyan" dot pulse size="md">
              Live
            </Badge>
            <span
              className="text-xs uppercase tracking-widest"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
            >
              {available} of {total} available
            </span>
          </div>

          <h1
            className="text-4xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}
          >
            Case Library
          </h1>

          <p
            className="text-base leading-relaxed max-w-xl"
            style={{ color: 'var(--text-secondary)' }}
          >
            Real-world metric investigations. Each case unlocks progressively harder phases —
            no tutorials, no hand-holding.
          </p>

          {/* Divider */}
          <div style={{ height: '1px', background: 'var(--border-subtle)', marginTop: '8px' }} />
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-5"
        >
          {CASE_STUDIES.map((cs) => (
            <CaseStudyCard key={cs.slug} data={cs} />
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.p
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-center mt-12 text-xs uppercase tracking-widest"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
        >
          More cases shipping every month
        </motion.p>
      </div>
    </Layout>
  )
}
