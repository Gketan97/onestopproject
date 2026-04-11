import { motion } from 'framer-motion'
import { Lightbulb } from 'lucide-react'

interface HintCardProps {
  children: React.ReactNode
}

export function HintCard({ children }: HintCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-3 px-5 py-4 rounded-xl"
      style={{
        background: 'rgba(251,191,36,0.06)',
        border:     '1px solid rgba(251,191,36,0.25)',
      }}
    >
      <Lightbulb size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--accent-amber)' }} />
      <div className="text-sm leading-relaxed space-y-1" style={{ color: 'var(--text-secondary)' }}>
        {children}
      </div>
    </motion.div>
  )
}
