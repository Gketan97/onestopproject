import { Sparkles } from 'lucide-react'
import { useArjunStore, type AIPanelContent } from '@/store/arjunStore'

interface PromptChipProps {
  label:   string
  content: AIPanelContent
}

export function PromptChip({ label, content }: PromptChipProps) {
  const openWithContent = useArjunStore((s) => s.openWithContent)

  return (
    <button
      onClick={() => openWithContent(content)}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      style={{
        background:  'rgba(129,140,248,0.08)',
        border:      '1px solid rgba(129,140,248,0.20)',
        color:       'var(--accent-secondary)',
        fontFamily:  'var(--font-mono)',
      }}
    >
      <Sparkles size={11} />
      {label}
    </button>
  )
}
