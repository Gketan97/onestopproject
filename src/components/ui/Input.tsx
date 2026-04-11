import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type InputSize = 'sm' | 'md' | 'lg'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:       string
  hint?:        string
  error?:       string
  inputSize?:   InputSize
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
}

const sizeClasses: Record<InputSize, string> = {
  sm: 'h-8  text-sm  px-3   rounded-[--radius-sm]',
  md: 'h-11 text-sm  px-4   rounded-[--radius-md]',
  lg: 'h-13 text-base px-5  rounded-[--radius-md]',
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      hint,
      error,
      inputSize = 'md',
      leadingIcon,
      trailingIcon,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-[--text-secondary] font-[--font-mono] uppercase tracking-wider"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leadingIcon && (
            <span className="absolute left-3 text-[--text-muted] pointer-events-none flex items-center">
              {leadingIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-[--bg-surface] text-[--text-primary]',
              'border border-[--border-default]',
              'placeholder:text-[--text-muted]',
              'transition-all duration-[--duration-fast]',
              'focus:outline-none focus:border-[--accent-primary]',
              'focus:shadow-[0_0_0_3px_rgba(0,212,255,0.12)]',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              error && 'border-[--accent-red] focus:border-[--accent-red] focus:shadow-[0_0_0_3px_rgba(255,92,92,0.12)]',
              leadingIcon  && 'pl-10',
              trailingIcon && 'pr-10',
              sizeClasses[inputSize],
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />

          {trailingIcon && (
            <span className="absolute right-3 text-[--text-muted] pointer-events-none flex items-center">
              {trailingIcon}
            </span>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-xs text-[--accent-red] font-[--font-mono]">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-xs text-[--text-muted]">
            {hint}
          </p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'
