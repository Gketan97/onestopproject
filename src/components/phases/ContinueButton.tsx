import { motion } from 'framer-motion'

interface ContinueButtonProps {
  label:    string
  onClick:  () => void
  disabled?: boolean
}

export function ContinueButton({ label, onClick, disabled = false }: ContinueButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      disabled={disabled}
      className="group flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        background:  'var(--bg-surface)',
        border:      '1px solid var(--border-default)',
        color:       'var(--text-primary)',
        fontFamily:  'var(--font-heading)',
      }}
    >
      <span
        className="w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-200"
        style={{ background: 'var(--accent-primary)' }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 5h6M5 2l3 3-3 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      {label}
    </motion.button>
  )
}
