import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useArjun } from '@/hooks/useArjun'

interface Lens {
  id:          string
  icon:        string
  label:       string
  placeholder: string
  arjunPrompt: string
}

interface ObservationInputProps {
  lenses:    Lens[]
  onComplete: (observations: Record<string, string>) => void
}

export function ObservationInput({ lenses, onComplete }: ObservationInputProps) {
  const [answers, setAnswers]         = useState<Record<string, string>>({})
  const [submitted, setSubmitted]     = useState<Record<string, boolean>>({})
  const [arjunReply, setArjunReply]   = useState<Record<string, string>>({})
  const [loading, setLoading]         = useState<Record<string, boolean>>({})
  const { open, sendMessage }         = useArjun()
  const allDone = lenses.every(l => submitted[l.id])

  async function handleSubmit(lens: Lens) {
    const text = answers[lens.id]?.trim()
    if (!text || text.length < 10) return
    setLoading(prev => ({ ...prev, [lens.id]: true }))

    // Pre-built responses for each lens — fast, no API needed
    const responses: Record<string, string> = {
      funnel:   text.toLowerCase().includes('step') || text.toLowerCase().includes('page') || text.toLowerCase().includes('screen')
        ? "Good observation. Count them precisely — Search → List → Detail → Checkout → Payment → Booking. That's 6 stages. Each stage is a potential drop-off point. You'll come back to this in Phase 5."
        : "Think about it as stages, not screens. Each time the user has to make a decision or wait — that's a stage. How many decision points did you encounter?",
      friction: text.toLowerCase().includes('slow') || text.toLowerCase().includes('load') || text.toLowerCase().includes('wait') || text.toLowerCase().includes('checkout')
        ? "Important. Note exactly where the slowness was. Was it search results loading? The hotel detail page? Or the checkout page specifically? The location matters more than the feeling."
        : "Good. Now be specific — WHERE in the flow did you feel it? The finding is only useful if it's tied to a specific funnel stage.",
      trust:    text.toLowerCase().includes('review') || text.toLowerCase().includes('price') || text.toLowerCase().includes('cancel') || text.toLowerCase().includes('photo')
        ? "Trust signals are real conversion drivers. An analyst who only looks at technical metrics misses half the story. Keep this observation — it'll be relevant in Phase 2 when you build hypotheses."
        : "Interesting. Trust signals are often overlooked in metric investigations. Were there moments where you wanted more information before proceeding?",
    }

    await new Promise(r => setTimeout(r, 600))
    setArjunReply(prev => ({ ...prev, [lens.id]: responses[lens.id] ?? "Good observation. Keep it in mind as we go deeper." }))
    setSubmitted(prev => ({ ...prev, [lens.id]: true }))
    setLoading(prev => ({ ...prev, [lens.id]: false }))

    if (lenses.every(l => l.id === lens.id || submitted[l.id])) {
      setTimeout(() => onComplete(answers), 800)
    }
  }

  return (
    <div className="space-y-5">
      {lenses.map((lens, i) => {
        const isLocked  = i > 0 && !submitted[lenses[i-1].id]
        const isDone    = submitted[lens.id]
        const isLoading = loading[lens.id]

        return (
          <motion.div
            key={lens.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: isLocked ? 0.35 : 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="rounded-2xl overflow-hidden"
            style={{
              border: isDone
                ? '1px solid rgba(16,185,129,0.25)'
                : '1px solid var(--border-subtle)',
            }}
          >
            {/* Lens header */}
            <div className="flex items-center gap-3 px-5 py-3"
              style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '18px' }}>{lens.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold"
                  style={{ color: isDone ? 'var(--accent-green)' : 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  {lens.label}
                </p>
              </div>
              {isDone && <span style={{ color: 'var(--accent-green)', fontSize: '14px' }}>✓</span>}
            </div>

            <div className="px-5 py-4 space-y-3" style={{ background: 'var(--bg-elevated)' }}>
              {!isDone && (
                <>
                  <textarea
                    value={answers[lens.id] ?? ''}
                    onChange={e => setAnswers(prev => ({ ...prev, [lens.id]: e.target.value }))}
                    placeholder={lens.placeholder}
                    disabled={isLocked}
                    rows={2}
                    className="w-full rounded-xl px-4 py-3 text-sm resize-none disabled:opacity-40"
                    style={{
                      background:  'var(--bg-surface)',
                      border:      '1px solid var(--border-default)',
                      color:       'var(--text-primary)',
                      outline:     'none',
                      fontFamily:  'var(--font-body)',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.10)' }}
                    onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }}
                  />
                  <button
                    onClick={() => handleSubmit(lens)}
                    disabled={isLocked || isLoading || (answers[lens.id]?.trim().length ?? 0) < 10}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: 'var(--accent-secondary)', color: '#fff', fontFamily: 'var(--font-heading)' }}
                  >
                    {isLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    {isLoading ? 'Arjun is reading...' : 'Submit observation →'}
                  </button>
                </>
              )}

              {/* Saved answer */}
              {isDone && answers[lens.id] && (
                <div className="px-4 py-3 rounded-xl"
                  style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Your observation:</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{answers[lens.id]}</p>
                </div>
              )}

              {/* Arjun reply */}
              <AnimatePresence>
                {arjunReply[lens.id] && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-6 h-6 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold mt-0.5"
                      style={{ background: 'linear-gradient(135deg,rgba(129,140,248,0.25),rgba(255,107,53,0.20))', border: '1px solid rgba(129,140,248,0.25)', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      A
                    </div>
                    <p className="flex-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {arjunReply[lens.id]}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )
      })}

      {allDone && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 rounded-xl text-sm"
          style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)', color: 'var(--accent-green)' }}>
          ✓ All observations recorded — saved to your investigation brief
        </motion.div>
      )}
    </div>
  )
}
