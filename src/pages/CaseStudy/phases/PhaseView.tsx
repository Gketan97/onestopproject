import { useParams, Navigate }  from 'react-router-dom'
import { motion }               from 'framer-motion'
import { useProgressStore, PHASES, type PhaseId } from '@/store/progressStore'
import { Button }               from '@/components/ui/Button'
import { ChevronRight }         from 'lucide-react'
import { staggerChildren, staggerItem } from '@/lib/motionVariants'

export default function PhaseView() {
  const { slug, phase }   = useParams<{ slug: string; phase: string }>()
  const { isUnlocked, isCompleted, completePhase, currentPhaseId } = useProgressStore()

  const typedPhase  = phase as PhaseId
  const phaseConfig = PHASES.find((p) => p.id === typedPhase)

  // Only block truly locked phases (not unlocked, not completed)
  if (!isUnlocked(typedPhase) && !isCompleted(typedPhase)) {
    return <Navigate to={`/case-study/${slug}/${currentPhaseId}`} replace />
  }

  const completed = isCompleted(typedPhase)

  return (
    <motion.div
      variants={staggerChildren}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div
        variants={staggerItem}
        className="rounded-2xl p-8 space-y-4"
        style={{
          background: 'var(--bg-surface)',
          border:     '1px solid var(--border-subtle)',
        }}
      >
        <p className="text-xs uppercase tracking-widest"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          Phase content
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          {phaseConfig?.label} content will be built in P6–P11.
        </p>
      </motion.div>

      {!completed && (
        <motion.div variants={staggerItem} className="flex justify-end">
          <Button variant="primary" size="lg" onClick={() => completePhase(typedPhase)}>
            Complete {phaseConfig?.label} <ChevronRight size={18} />
          </Button>
        </motion.div>
      )}

      {completed && (
        <motion.div variants={staggerItem}
          className="flex items-center gap-3 px-5 py-4 rounded-xl"
          style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}>
          <span style={{ color: 'var(--accent-green)', fontSize: '18px' }}>✓</span>
          <p className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>
            Phase complete — you can revisit this anytime
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
