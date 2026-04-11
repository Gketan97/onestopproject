import { useNavigate } from 'react-router-dom'
import { motion }      from 'framer-motion'
import { ArrowRight, Clock, Lock, Layers } from 'lucide-react'
import { Badge }       from '@/components/ui/Badge'
import { staggerItem } from '@/lib/motionVariants'
import type { CaseStudyMeta } from '@/data/caseStudies'
import { DIFFICULTY_VARIANT } from '@/data/caseStudies'
import { cn }          from '@/lib/utils'

interface CaseStudyCardProps {
  data: CaseStudyMeta
}

const ACCENT_GLOW: Record<string, string> = {
  cyan:   'rgba(0,212,255,0.08)',
  amber:  'rgba(255,184,0,0.08)',
  green:  'rgba(61,214,140,0.08)',
}

export function CaseStudyCard({ data }: CaseStudyCardProps) {
  const navigate = useNavigate()
  const accentVariant = DIFFICULTY_VARIANT[data.difficulty]
  const glowColor     = ACCENT_GLOW[accentVariant]

  function handleClick() {
    if (!data.available) return
    navigate(`/case-study/${data.slug}`)
  }

  return (
    <motion.div
      variants={staggerItem}
      onClick={handleClick}
      whileHover={data.available ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative rounded-2xl p-6 transition-all duration-300 overflow-hidden',
        data.available ? 'cursor-pointer' : 'cursor-not-allowed opacity-60',
      )}
      style={{
        background: 'var(--bg-surface)',
        border:     '1px solid var(--border-subtle)',
      }}
    >
      {/* Hover glow */}
      {data.available && (
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${glowColor} 0%, transparent 60%)`,
          }}
        />
      )}

      {/* Coming soon overlay */}
      {!data.available && (
        <div className="absolute top-4 right-4">
          <Badge variant="default">
            <Lock size={9} className="mr-1" />
            Coming Soon
          </Badge>
        </div>
      )}

      <div className="relative space-y-5">
        {/* Header */}
        <div className="space-y-1">
          <p
            className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
          >
            {data.company}
          </p>
          <h2
            className="text-base font-semibold leading-snug"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}
          >
            {data.title}
          </h2>
        </div>

        {/* Description */}
        <p
          className="text-sm leading-relaxed line-clamp-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          {data.description}
        </p>

        {/* Metric pill */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{
            background:  `${ACCENT_GLOW[accentVariant]}`,
            border:      `1px solid var(--border-subtle)`,
            color:       'var(--text-secondary)',
            fontFamily:  'var(--font-mono)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: `var(--accent-${accentVariant === 'cyan' ? 'primary' : accentVariant === 'amber' ? 'secondary' : 'green'})` }}
          />
          {data.metric}
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <Badge key={skill} variant="outline" size="sm">
              {skill}
            </Badge>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-4">
            <span
              className="flex items-center gap-1.5 text-xs"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
            >
              <Clock size={11} />
              {data.duration}
            </span>
            <span
              className="flex items-center gap-1.5 text-xs"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
            >
              <Layers size={11} />
              {data.phases} phases
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant={accentVariant as 'cyan' | 'amber' | 'green'} size="sm">
              {data.difficulty}
            </Badge>
            {data.available && (
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
                style={{ color: 'var(--accent-primary)' }}
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
