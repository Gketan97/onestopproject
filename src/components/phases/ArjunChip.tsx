import { Sparkles }  from 'lucide-react'
import { useArjun }  from '@/hooks/useArjun'
import { useProgressStore } from '@/store/progressStore'

interface ArjunChipProps {
  label:       string
  prefillText?: string  // optional: pre-sends a message when chip is clicked
}

export function ArjunChip({ label, prefillText }: ArjunChipProps) {
  const { open, sendMessage, isOpen } = useArjun()
  const currentPhaseId = useProgressStore((s) => s.currentPhaseId)

  function handleClick() {
    open(currentPhaseId)
    if (prefillText) {
      // Small delay to let modal open first
      setTimeout(() => sendMessage(prefillText), 200)
    }
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      style={{
        background:  'rgba(129,140,248,0.07)',
        border:      '1px solid rgba(129,140,248,0.18)',
        color:       'var(--accent-secondary)',
        fontFamily:  'var(--font-mono)',
      }}
    >
      <Sparkles size={10} />
      {label}
    </button>
  )
}
