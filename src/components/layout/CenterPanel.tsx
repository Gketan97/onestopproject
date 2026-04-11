import { useEffect, useRef } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { motion }            from 'framer-motion'
import { PHASES }            from '@/store/progressStore'
import { useProgressStore }  from '@/store/progressStore'
import { revealContent }     from '@/lib/motionVariants'

export function CenterPanel() {
  const { phase }   = useParams<{ phase: string }>()
  const scrollRef   = useRef<HTMLDivElement>(null)
  const phaseConfig = PHASES.find((p) => p.id === phase)
  const currentPhaseId = useProgressStore((s) => s.currentPhaseId)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [phase])

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="max-w-2xl mx-auto px-10 py-12">
        {phaseConfig && (
          <motion.header
            key={phase}
            variants={revealContent}
            initial="hidden"
            animate="visible"
            className="mb-10 pb-8"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs uppercase tracking-widest"
                style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                Phase {phaseConfig.order} of {PHASES.length - 1}
              </span>
              <span style={{ color: 'var(--border-default)' }}>·</span>
              <span className="text-xs uppercase tracking-widest"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                MakeMyTrip
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
              {phaseConfig.label}
            </h1>
            <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
              {phaseConfig.subtitle}
            </p>
          </motion.header>
        )}

        <motion.div
          key={phase + '-content'}
          variants={revealContent}
          initial="hidden"
          animate="visible"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}
