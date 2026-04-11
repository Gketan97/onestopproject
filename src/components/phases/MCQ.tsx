import { useState }                from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react'
import { cn }                      from '@/lib/utils'
import { staggerChildren, staggerItem } from '@/lib/motionVariants'

export interface MCQOption {
  id:      string
  label:   string
  correct: boolean
}

interface MCQProps {
  question:    string
  options:     MCQOption[]
  explanation: string
  onCorrect:   () => void
  ctaLabel?:   string
}

type AnswerState = 'unanswered' | 'correct' | 'incorrect'

export function MCQ({ question, options, explanation, onCorrect, ctaLabel = 'Continue to next phase →' }: MCQProps) {
  const [selected,    setSelected]    = useState<string | null>(null)
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered')
  const [shaking,     setShaking]     = useState(false)

  function handleSelect(option: MCQOption) {
    if (answerState === 'correct') return
    setSelected(option.id)
    if (option.correct) {
      setAnswerState('correct')
    } else {
      setAnswerState('incorrect')
      setShaking(true)
      setTimeout(() => { setShaking(false); setAnswerState('unanswered'); setSelected(null) }, 1200)
    }
  }

  return (
    <div className="rounded-2xl p-6 space-y-5"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center mt-0.5"
          style={{ background: 'rgba(129,140,248,0.10)', border: '1px solid rgba(129,140,248,0.20)' }}>
          <HelpCircle size={15} style={{ color: 'var(--accent-secondary)' }} />
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>
            Knowledge check
          </p>
          <p className="text-sm font-semibold leading-snug"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            {question}
          </p>
        </div>
      </div>

      <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="space-y-2">
        {options.map((option) => {
          const isSelected  = selected === option.id
          const isCorrect   = answerState === 'correct'   && isSelected
          const isIncorrect = answerState === 'incorrect' && isSelected
          return (
            <motion.button key={option.id} variants={staggerItem}
              animate={isIncorrect && shaking ? { x: [0,-8,8,-6,6,-4,4,0], transition: { duration: 0.5 } } : {}}
              onClick={() => handleSelect(option)}
              disabled={answerState === 'correct'}
              className={cn('w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200',
                answerState !== 'correct' && !isSelected && 'hover:border-[var(--border-default)]',
                answerState === 'correct' && !isSelected && 'opacity-40 cursor-not-allowed')}
              style={{
                background: isCorrect ? 'rgba(16,185,129,0.08)' : isIncorrect ? 'rgba(248,113,113,0.08)' : isSelected ? 'rgba(129,140,248,0.08)' : 'var(--bg-elevated)',
                border: isCorrect ? '1px solid rgba(16,185,129,0.30)' : isIncorrect ? '1px solid rgba(248,113,113,0.30)' : isSelected ? '1px solid rgba(129,140,248,0.30)' : '1px solid var(--border-subtle)',
              }}>
              <span className="w-6 h-6 rounded-md shrink-0 flex items-center justify-center text-xs font-bold"
                style={{ background: isCorrect ? 'rgba(16,185,129,0.15)' : isIncorrect ? 'rgba(248,113,113,0.15)' : 'var(--border-subtle)', color: isCorrect ? 'var(--accent-green)' : isIncorrect ? 'var(--accent-red)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {option.id.toUpperCase()}
              </span>
              <span className="flex-1 text-sm" style={{ color: isCorrect ? 'var(--accent-green)' : isIncorrect ? 'var(--accent-red)' : 'var(--text-secondary)', fontFamily: 'var(--font-heading)' }}>
                {option.label}
              </span>
              {isCorrect   && <CheckCircle size={16} style={{ color: 'var(--accent-green)' }} />}
              {isIncorrect && <XCircle     size={16} style={{ color: 'var(--accent-red)'   }} />}
            </motion.button>
          )
        })}
      </motion.div>

      <AnimatePresence>
        {answerState === 'correct' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}>
            <CheckCircle size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--accent-green)' }} />
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--accent-green)' }}>Correct. </strong>{explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {answerState === 'incorrect' && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-xs text-center" style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>
            Not quite — think carefully and try again.
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {answerState === 'correct' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
            <button onClick={onCorrect}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{ background: 'var(--accent-primary)', color: '#fff', fontFamily: 'var(--font-heading)', boxShadow: '0 0 20px rgba(255,107,53,0.25)' }}>
              {ctaLabel}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
