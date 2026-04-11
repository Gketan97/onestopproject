import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'cyan' | 'amber' | 'purple' | 'green' | 'red' | 'outline'
type BadgeSize    = 'sm' | 'md'

interface BadgeProps {
  children:  React.ReactNode
  variant?:  BadgeVariant
  size?:     BadgeSize
  dot?:      boolean
  pulse?:    boolean
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[rgba(255,255,255,0.07)] text-[--text-secondary] border border-[--border-subtle]',
  cyan:    'bg-[rgba(0,212,255,0.10)] text-[--accent-primary]  border border-[rgba(0,212,255,0.20)]',
  amber:   'bg-[rgba(255,184,0,0.10)] text-[--accent-secondary] border border-[rgba(255,184,0,0.20)]',
  purple:  'bg-[rgba(168,85,247,0.10)] text-[--accent-purple]  border border-[rgba(168,85,247,0.20)]',
  green:   'bg-[rgba(61,214,140,0.10)] text-[--accent-green]   border border-[rgba(61,214,140,0.20)]',
  red:     'bg-[rgba(255,92,92,0.10)]  text-[--accent-red]     border border-[rgba(255,92,92,0.20)]',
  outline: 'bg-transparent text-[--text-secondary] border border-[--border-default]',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px] rounded-md gap-1',
  md: 'px-2.5 py-1 text-xs    rounded-[--radius-sm] gap-1.5',
}

const dotColorMap: Record<BadgeVariant, string> = {
  default: 'bg-[--text-muted]',
  cyan:    'bg-[--accent-primary]',
  amber:   'bg-[--accent-secondary]',
  purple:  'bg-[--accent-purple]',
  green:   'bg-[--accent-green]',
  red:     'bg-[--accent-red]',
  outline: 'bg-[--text-secondary]',
}

export function Badge({
  children,
  variant  = 'default',
  size     = 'md',
  dot      = false,
  pulse    = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium font-[--font-mono] tracking-wide',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            'shrink-0 w-1.5 h-1.5 rounded-full',
            dotColorMap[variant],
            pulse && 'animate-pulse',
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}
