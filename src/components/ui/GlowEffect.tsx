import { cn } from '@/lib/utils'

type GlowAccent = 'cyan' | 'amber' | 'purple' | 'green'
type GlowSize   = 'sm' | 'md' | 'lg' | 'xl'

interface GlowEffectProps {
  accent?:    GlowAccent
  size?:      GlowSize
  intensity?: 'subtle' | 'medium' | 'strong'
  position?:  'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  className?: string
  fixed?:     boolean
}

const accentColors: Record<GlowAccent, [number, number, number]> = {
  cyan:   [0, 212, 255],
  amber:  [255, 184, 0],
  purple: [168, 85, 247],
  green:  [61, 214, 140],
}

const sizeMap: Record<GlowSize, string> = {
  sm: 'w-48 h-48',
  md: 'w-72 h-72',
  lg: 'w-[450px] h-[450px]',
  xl: 'w-[700px] h-[700px]',
}

const intensityMap = {
  subtle: 0.06,
  medium: 0.10,
  strong: 0.18,
} as const

const positionMap: Record<NonNullable<GlowEffectProps['position']>, string> = {
  'top-left':     '-top-24 -left-24',
  'top-right':    '-top-24 -right-24',
  'bottom-left':  '-bottom-24 -left-24',
  'bottom-right': '-bottom-24 -right-24',
  'center':       'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
}

export function GlowEffect({
  accent    = 'cyan',
  size      = 'lg',
  intensity = 'subtle',
  position  = 'top-left',
  fixed     = false,
  className,
}: GlowEffectProps) {
  const alpha = intensityMap[intensity]
  const [r, g, b] = accentColors[accent]

  return (
    <div
      aria-hidden="true"
      className={cn(
        fixed ? 'fixed' : 'absolute',
        'rounded-full pointer-events-none z-0',
        sizeMap[size],
        positionMap[position],
        className,
      )}
      style={{
        background: `radial-gradient(circle, rgba(${r}, ${g}, ${b}, ${alpha}) 0%, transparent 70%)`,
        filter: 'blur(80px)',
      }}
    />
  )
}
