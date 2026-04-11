import { Sparkles } from 'lucide-react'
import { useArjun }  from '@/hooks/useArjun'
import { useProgressStore } from '@/store/progressStore'

interface PromptChipProps {
  label:        string
  prefillText?: string
}

export function PromptChip({ label, prefillText }: PromptChipProps) {
  const { open, sendMessage } = useArjun()
  const currentPhaseId = useProgressStore((s) => s.currentPhaseId)

  function handleClick() {
    open(currentPhaseId)
    if (prefillText) setTimeout(() => sendMessage(prefillText), 200)
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      style={{
        background: 'rgba(129,140,248,0.08)',
        border:     '1px solid rgba(129,140,248,0.20)',
        color:      'var(--accent-secondary)',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <Sparkles size={11} />
      {label}
    </button>
  )
}
