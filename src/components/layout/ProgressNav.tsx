import { useState, useEffect }      from 'react'
import { useParams, useLocation }   from 'react-router-dom'
import { motion, AnimatePresence }  from 'framer-motion'
import { CheckCircle, Lock, Circle, ChevronDown, ChevronRight, RotateCcw } from 'lucide-react'
import { useProgressStore, PHASES, type PhaseId } from '@/store/progressStore'
import { cn } from '@/lib/utils'

const NAV_WIDTH = 256

function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function ProgressNav() {
  const { slug }    = useParams<{ slug: string }>()
  const location    = useLocation()
  const { isUnlocked, isCompleted, progressPercent, currentPhaseId, resetProgress } =
    useProgressStore()

  const percent = progressPercent()

  const [expandedPhases, setExpandedPhases] = useState<Set<PhaseId>>(
    new Set([currentPhaseId])
  )

  useEffect(() => {
    setExpandedPhases((prev) => new Set([...prev, currentPhaseId]))
  }, [currentPhaseId])

  function isAccessible(phaseId: PhaseId): boolean {
    return isUnlocked(phaseId) || isCompleted(phaseId)
  }

  function handlePhaseClick(phaseId: PhaseId) {
    if (!isAccessible(phaseId)) return
    // Use window.location for reliable navigation in nested route context
    window.location.href = `/case-study/${slug}/${phaseId}`
  }

  function handleSectionClick(phaseId: PhaseId, sectionId: string) {
    if (!isAccessible(phaseId)) return
    const target = `/case-study/${slug}/${phaseId}`
    if (window.location.pathname === target) {
      scrollToSection(sectionId)
    } else {
      window.location.href = target
      setTimeout(() => scrollToSection(sectionId), 600)
    }
  }

  function handleReset() {
    resetProgress()
    window.location.href = `/case-study/${slug}/phase-0`
  }

  // Track expanded state based on current URL
  useEffect(() => {
    const currentPhase = location.pathname.split('/').pop() as PhaseId
    if (currentPhase) {
      setExpandedPhases((prev) => new Set([...prev, currentPhase]))
    }
  }, [location.pathname])

  return (
    <aside
      className="flex flex-col shrink-0 h-full overflow-y-auto"
      style={{ width: `${NAV_WIDTH}px`, background: 'var(--bg-surface)', borderRight: '1px solid var(--border-subtle)' }}
      aria-label="Phase navigation"
    >
      {/* Progress bar */}
      <div className="px-4 pt-5 pb-4 space-y-2 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Progress</span>
          <span className="text-xs font-semibold"
            style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>{percent}%</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--border-subtle)' }}
          role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          <motion.div className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))' }}
            initial={{ width: 0 }} animate={{ width: `${percent}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0 16px' }} />

      {/* Phase list */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {PHASES.map((phase) => {
          const accessible  = isAccessible(phase.id)
          const completed   = isCompleted(phase.id)
          const isCurrentUrl = location.pathname.includes(phase.id)
          const isCurrent   = isCurrentUrl
          const isExpanded  = expandedPhases.has(phase.id)
          const hasSections = phase.sections.length > 0

          return (
            <div key={phase.id}>
              <button
                onClick={() => handlePhaseClick(phase.id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200',
                  accessible ? 'cursor-pointer hover:bg-white/5' : 'cursor-not-allowed opacity-35',
                )}
                style={{
                  background: isCurrent ? 'rgba(255,107,53,0.07)' : 'transparent',
                  border:     isCurrent ? '1px solid rgba(255,107,53,0.15)' : '1px solid transparent',
                }}
              >
                <span className="shrink-0">
                  {completed
                    ? <CheckCircle size={14} style={{ color: 'var(--accent-green)' }} />
                    : accessible
                    ? <Circle size={14} style={{ color: isCurrent ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
                    : <Lock size={12} style={{ color: 'var(--text-muted)' }} />}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{
                    color:      completed ? 'var(--accent-green)' : isCurrent ? 'var(--accent-primary)' : accessible ? 'var(--text-secondary)' : 'var(--text-muted)',
                    fontFamily: 'var(--font-heading)',
                  }}>{phase.label}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                    {String(phase.order).padStart(2, '0')}
                  </span>
                  {hasSections && accessible && (
                    <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={11} style={{ color: 'var(--text-muted)' }} />
                    </motion.span>
                  )}
                </div>
              </button>

              <AnimatePresence>
                {hasSections && isExpanded && accessible && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="ml-5 pl-3 py-1 space-y-0.5"
                      style={{ borderLeft: '1px solid var(--border-subtle)' }}>
                      {phase.sections.map((section) => (
                        <button key={section.id}
                          onClick={() => handleSectionClick(phase.id, section.id)}
                          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all hover:bg-white/5">
                          <ChevronRight size={10} style={{ color: 'var(--text-muted)' }} />
                          <span className="text-xs truncate"
                            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                            {section.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </nav>

      {/* Reset */}
      <div className="p-3 shrink-0" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <button onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs transition-all hover:bg-white/5"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', border: '1px solid var(--border-subtle)' }}>
          <RotateCcw size={11} />
          Reset progress
        </button>
      </div>
    </aside>
  )
}
