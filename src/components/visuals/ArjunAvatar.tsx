import { motion } from 'framer-motion'

interface ArjunAvatarProps {
  size?:   number
  typing?: boolean
  pulse?:  boolean
}

export function ArjunAvatar({ size = 40, typing = false, pulse = false }: ArjunAvatarProps) {
  const s = size
  const uid = `av-${s}`

  return (
    <div className="relative shrink-0" style={{ width: s, height: s }}>
      <motion.div
        animate={pulse ? { scale: [1, 1.04, 1] } : {}}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: s, height: s }}
      >
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          <defs>
            <linearGradient id={`${uid}-ring`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#818CF8" stopOpacity="0.9" />
              <stop offset="50%"  stopColor="#FF6B35" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id={`${uid}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#1a1a2e" />
              <stop offset="100%" stopColor="#16213e" />
            </linearGradient>
            <linearGradient id={`${uid}-skin`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#D4956A" />
              <stop offset="100%" stopColor="#B8784F" />
            </linearGradient>
            <linearGradient id={`${uid}-shirt`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#818CF8" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
            <clipPath id={`${uid}-clip`}>
              <circle cx="24" cy="24" r="21" />
            </clipPath>
          </defs>

          {/* Rotating ring */}
          <motion.circle cx="24" cy="24" r="23"
            fill="none" stroke={`url(#${uid}-ring)`} strokeWidth="1.5"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '24px 24px' }}
          />

          <circle cx="24" cy="24" r="21" fill={`url(#${uid}-bg)`} />

          <g clipPath={`url(#${uid}-clip)`}>
            {/* Shirt */}
            <ellipse cx="24" cy="43" rx="14" ry="10" fill={`url(#${uid}-shirt)`} />
            {/* Neck */}
            <rect x="21" y="30" width="6" height="6" rx="2" fill={`url(#${uid}-skin)`} />
            {/* Head */}
            <ellipse cx="24" cy="22" rx="10" ry="11" fill={`url(#${uid}-skin)`} />
            {/* Hair */}
            <path d="M14 20 Q14 10 24 9 Q34 10 34 20 L34 16 Q34 8 24 7 Q14 8 14 16Z" fill="#1A0A00" />
            <ellipse cx="24" cy="11" rx="10" ry="4" fill="#1A0A00" />
            {/* Eyes */}
            <ellipse cx="20" cy="22" rx="1.8" ry="2" fill="#1A0A00" />
            <ellipse cx="28" cy="22" rx="1.8" ry="2" fill="#1A0A00" />
            <circle cx="20.6" cy="21.2" r="0.6" fill="white" />
            <circle cx="28.6" cy="21.2" r="0.6" fill="white" />
            {/* Eyebrows */}
            <path d="M17.5 19.5 Q20 18 22.5 19.5" stroke="#3D1A00" strokeWidth="1" fill="none" strokeLinecap="round" />
            <path d="M25.5 19.5 Q28 18 30.5 19.5" stroke="#3D1A00" strokeWidth="1" fill="none" strokeLinecap="round" />
            {/* Smile */}
            <path d="M20 29 Q24 32 28 29" stroke="#8B5A2B" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </g>
        </svg>
      </motion.div>

      {typing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -bottom-1 -right-1 flex items-center gap-0.5 px-2 py-1 rounded-full"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
        >
          {[0, 1, 2].map((dotIdx) => (
            <motion.div key={dotIdx} className="w-1 h-1 rounded-full"
              style={{ background: 'var(--accent-secondary)' }}
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: dotIdx * 0.15 }}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}
