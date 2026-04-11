import { cn } from '@/lib/utils'

type BadgeType = 'taught' | 'scaffolded' | 'learner' | 'warning'

interface SectionBadgeProps { type: BadgeType; className?: string }

const CONFIG: Record<BadgeType, { label: string; bg: string; border: string; color: string }> = {
  taught:     { label: 'Taught',     bg: 'rgba(129,140,248,0.10)', border: 'rgba(129,140,248,0.25)', color: 'var(--accent-secondary)' },
  scaffolded: { label: 'Scaffolded', bg: 'rgba(255,107,53,0.10)',  border: 'rgba(255,107,53,0.25)',  color: 'var(--accent-primary)'   },
  learner:    { label: 'Your turn',  bg: 'rgba(16,185,129,0.10)',  border: 'rgba(16,185,129,0.25)',  color: 'var(--accent-green)'     },
  warning:    { label: 'Watch out',  bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)', color: 'var(--accent-red)'       },
}

export function SectionBadge({ type, className }: SectionBadgeProps) {
  const cfg = CONFIG[type]
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold', className)}
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
      {cfg.label}
    </span>
  )
}
