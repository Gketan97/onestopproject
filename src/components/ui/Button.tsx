import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'amber' | 'purple'
type ButtonSize    = 'xs' | 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   ButtonVariant
  size?:      ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[--accent-primary] text-white font-semibold hover:opacity-90 ' +
    'shadow-[0_0_16px_rgba(0,212,255,0.25)] hover:shadow-[0_0_24px_rgba(0,212,255,0.4)]',
  secondary:
    'glass border border-[--border-default] text-[--text-primary] ' +
    'hover:border-[--border-strong] hover:bg-[rgba(255,255,255,0.07)]',
  ghost:
    'text-[--text-secondary] hover:text-[--text-primary] hover:bg-[rgba(255,255,255,0.05)]',
  danger:
    'bg-[rgba(255,92,92,0.12)] text-[--accent-red] border border-[rgba(255,92,92,0.25)] ' +
    'hover:bg-[rgba(255,92,92,0.2)]',
  amber:
    'bg-[--accent-secondary] text-[--bg-base] font-semibold hover:opacity-90 ' +
    'shadow-[0_0_16px_rgba(255,184,0,0.25)] hover:shadow-[0_0_24px_rgba(255,184,0,0.4)]',
  purple:
    'bg-[--accent-purple] text-white font-semibold hover:opacity-90 ' +
    'shadow-[0_0_16px_rgba(168,85,247,0.25)] hover:shadow-[0_0_24px_rgba(168,85,247,0.4)]',
}

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'h-7  px-3   text-xs  rounded-[--radius-sm] gap-1.5',
  sm: 'h-9  px-4   text-sm  rounded-[--radius-md] gap-2',
  md: 'h-11 px-5   text-sm  rounded-[--radius-md] gap-2',
  lg: 'h-13 px-7   text-base rounded-[--radius-lg] gap-2.5',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant   = 'primary',
      size      = 'md',
      isLoading = false,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled ?? isLoading}
      className={cn(
        'inline-flex items-center justify-center font-medium',
        'transition-all duration-[--duration-fast]',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-[--accent-primary] focus-visible:ring-offset-1',
        'focus-visible:ring-offset-[--bg-base]',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
        'active:scale-[0.97]',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <span
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
      ) : null}
      {children}
    </button>
  ),
)
Button.displayName = 'Button'
