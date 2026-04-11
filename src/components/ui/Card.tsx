import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type CardVariant = 'default' | 'glass' | 'elevated' | 'outlined'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  hoverable?: boolean
  glowAccent?: 'cyan' | 'amber' | 'purple' | null
}

const variantClasses: Record<CardVariant, string> = {
  default:  'bg-[--bg-surface] border border-[--border-subtle]',
  glass:    'glass',
  elevated: 'bg-[--bg-elevated] border border-[--border-default] shadow-[--shadow-md]',
  outlined: 'bg-transparent border border-[--border-default]',
}

const glowClasses = {
  cyan:   'hover:shadow-[0_0_24px_rgba(0,212,255,0.15)] hover:border-[rgba(0,212,255,0.25)]',
  amber:  'hover:shadow-[0_0_24px_rgba(255,184,0,0.15)] hover:border-[rgba(255,184,0,0.25)]',
  purple: 'hover:shadow-[0_0_24px_rgba(168,85,247,0.15)] hover:border-[rgba(168,85,247,0.25)]',
} as const

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'glass', hoverable = false, glowAccent = null, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-[--radius-lg] p-6 transition-all duration-[--duration-base]',
        variantClasses[variant],
        hoverable && 'cursor-pointer hover:-translate-y-0.5',
        glowAccent && glowClasses[glowAccent],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
)
Card.displayName = 'Card'
