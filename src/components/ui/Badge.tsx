import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'accent' | 'blue' | 'green' | 'muted'
interface BadgeProps { children: React.ReactNode; variant?: BadgeVariant; className?: string }

const variants: Record<BadgeVariant, string> = {
  default: 'bg-white/10 text-ink2',
  accent:  'bg-accent/20 text-accent border border-accent/30',
  blue:    'bg-blue/20 text-blue border border-blue/30',
  green:   'bg-green/20 text-green border border-green/30',
  muted:   'bg-border text-ink3',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}
