import { Link }        from 'react-router-dom'
import { ArrowRight, TrendingDown, Clock, Shield } from 'lucide-react'
import { motion }      from 'framer-motion'
import { Layout }      from '@/components/layout/Layout'
import { Button }      from '@/components/ui/Button'
import { staggerChildren, staggerItem, slideUp, fadeIn } from '@/lib/motionVariants'

const STATS = [
  { value: '7',    label: 'Case Studies',   accentVar: '--accent-primary'   },
  { value: '320+', label: 'Decisions Made', accentVar: '--accent-secondary' },
  { value: '1',    label: 'AI Mentor',      accentVar: '--accent-green'     },
] as const

const FEATURES = [
  {
    icon:       TrendingDown,
    title:      'Real Metric Drops',
    description:'Investigate actual business incidents with compounding root causes — not toy examples.',
    accentVar:  '--accent-primary',
    glowRgba:   'rgba(255,107,53,0.08)',
    borderRgba: 'rgba(255,107,53,0.20)',
  },
  {
    icon:       Shield,
    title:      'Phase-Gated Progress',
    description:'Unlock deeper phases only after demonstrating genuine analytical thinking.',
    accentVar:  '--accent-secondary',
    glowRgba:   'rgba(129,140,248,0.08)',
    borderRgba: 'rgba(129,140,248,0.20)',
  },
  {
    icon:       Clock,
    title:      'Portfolio Proof',
    description:'Leave with a shareable RCA brief that proves how you think to any hiring manager.',
    accentVar:  '--accent-green',
    glowRgba:   'rgba(16,185,129,0.08)',
    borderRgba: 'rgba(16,185,129,0.20)',
  },
] as const

export default function Home() {
  return (
    <Layout>
      {/* Ambient glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute top-1/3 -right-48 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      <div className="relative z-10">
        <section className="max-w-5xl mx-auto px-6 pt-28 pb-20 text-center">

          {/* Pill badge */}
          <motion.div variants={fadeIn} initial="hidden" animate="visible" className="flex justify-center mb-10">
            <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full"
              style={{ background: 'var(--bg-glass)', backdropFilter: 'blur(12px)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent-primary)' }} />
              For <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>BUSINESS ANALYSTS</span> who work with data
            </span>
          </motion.div>

          {/* Hero headline */}
          <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="mb-8">
            {[
              { text: 'The AI will pull', gradient: false },
              { text: 'the data.',        gradient: false },
              { text: 'Can you make the', gradient: true  },
              { text: 'decision?',        gradient: true, soft: true },
            ].map(({ text, gradient, soft }) => (
              <motion.h1
                key={text}
                variants={staggerItem}
                className="leading-[1.0] tracking-tight font-bold"
                style={{
                  fontSize:   'clamp(48px, 8vw, 88px)',
                  fontFamily: 'var(--font-heading)',
                  ...(gradient && !soft ? {
                    background:           'linear-gradient(135deg, #FF6B35 0%, #C084FC 50%, #818CF8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor:  'transparent',
                    backgroundClip:       'text',
                  } : soft ? {
                    background:           'linear-gradient(135deg, #C084FC 0%, #818CF8 60%, #A5B4FC 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor:  'transparent',
                    backgroundClip:       'text',
                  } : { color: 'var(--text-primary)' }),
                }}
              >
                {text}
              </motion.h1>
            ))}
          </motion.div>

          {/* Subheadline */}
          <motion.p variants={slideUp} initial="hidden" animate="visible"
            className="max-w-2xl mx-auto text-lg leading-relaxed mb-10"
            style={{ color: 'var(--text-secondary)' }}>
            AI handles the data pulls. The people who get hired — and promoted — are the ones who know{' '}
            <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>how to think through a problem clearly.</strong>{' '}
            Work through a real business incident alongside an AI thinking partner and leave with{' '}
            <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>proof of how you think — as a link you can share.</strong>
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeIn} initial="hidden" animate="visible"
            className="flex items-center justify-center gap-4 mb-20">
            <Link to="/case-studies"><Button variant="primary" size="lg">Start Investigating <ArrowRight size={18} /></Button></Link>
            <Link to="/case-studies"><Button variant="secondary" size="lg">Browse Cases</Button></Link>
          </motion.div>

          {/* Stats */}
          <motion.div variants={staggerChildren} initial="hidden" animate="visible"
            className="grid grid-cols-3 overflow-hidden rounded-2xl"
            style={{ border: '1px solid var(--border-subtle)' }}>
            {STATS.map(({ value, label, accentVar }) => (
              <motion.div key={label} variants={staggerItem} className="py-8 px-6 text-center"
                style={{ background: 'var(--bg-surface)' }}>
                <p className="text-5xl font-bold tracking-tight mb-1.5"
                  style={{ color: `var(${accentVar})`, fontFamily: 'var(--font-heading)' }}>{value}</p>
                <p className="text-xs uppercase tracking-widest"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto px-6 pb-32">
          <motion.div variants={staggerChildren} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-80px' }} className="grid md:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, description, accentVar, glowRgba, borderRgba }) => (
              <motion.div key={title} variants={staggerItem}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-300"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${glowRgba} 0%, transparent 60%)` }} />
                <div className="relative space-y-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: glowRgba, border: `1px solid ${borderRgba}` }}>
                    <Icon size={18} style={{ color: `var(${accentVar})` }} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>{title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </Layout>
  )
}
