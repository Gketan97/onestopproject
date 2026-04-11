#!/bin/bash
set -euo pipefail

echo "🎨 Updating design tokens globally..."

# ── 1. Update themes.css ─────────────────────────────────────────────────────
cat > src/styles/themes.css << 'THEMES'
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Instrument+Serif:ital@0;1&display=swap');
@import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap');

:root, .dark {
  --bg-base:     #0D0D0D;
  --bg-surface:  #141414;
  --bg-elevated: #1C1C1C;
  --bg-glass:    rgba(255, 255, 255, 0.04);

  --text-primary:   #F5F0E8;
  --text-secondary: #A09890;
  --text-muted:     #4A4540;

  --accent-primary:   #FF6B35;
  --accent-secondary: #818CF8;
  --accent-purple:    #818CF8;
  --accent-green:     #10B981;
  --accent-red:       #F87171;
  --accent-amber:     #FBBF24;

  --border-subtle:  rgba(255, 255, 255, 0.06);
  --border-default: rgba(255, 255, 255, 0.10);
  --border-strong:  rgba(255, 255, 255, 0.18);

  --shadow-sm:   0 1px 3px rgba(0, 0, 0, 0.4);
  --shadow-md:   0 4px 16px rgba(0, 0, 0, 0.5);
  --shadow-lg:   0 8px 40px rgba(0, 0, 0, 0.6);
  --shadow-glow: 0 0 20px rgba(255, 107, 53, 0.15);
  --shadow-glow-indigo: 0 0 20px rgba(129, 140, 248, 0.15);
  --shadow-glow-green:  0 0 20px rgba(16, 185, 129, 0.15);

  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 28px;

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 450ms;

  --font-display: 'Instrument Serif', Georgia, serif;
  --font-heading: 'Cabinet Grotesk', system-ui, sans-serif;
  --font-mono:    'DM Mono', 'SF Mono', monospace;
  --font-body:    'Cabinet Grotesk', system-ui, sans-serif;
}

.light {
  --bg-base:     #FAFAF7;
  --bg-surface:  #F2F2EE;
  --bg-elevated: #FFFFFF;
  --bg-glass:    rgba(0, 0, 0, 0.03);

  --text-primary:   #1A1A1A;
  --text-secondary: #5A5550;
  --text-muted:     #9A9590;

  --accent-primary:   #FF6B35;
  --accent-secondary: #6366F1;
  --accent-purple:    #6366F1;
  --accent-green:     #059669;
  --accent-red:       #DC2626;
  --accent-amber:     #D97706;

  --border-subtle:  rgba(0, 0, 0, 0.06);
  --border-default: rgba(0, 0, 0, 0.10);
  --border-strong:  rgba(0, 0, 0, 0.18);

  --shadow-sm:   0 1px 3px rgba(0, 0, 0, 0.06);
  --shadow-md:   0 4px 16px rgba(0, 0, 0, 0.08);
  --shadow-lg:   0 8px 40px rgba(0, 0, 0, 0.10);
  --shadow-glow: 0 0 20px rgba(255, 107, 53, 0.12);
}
THEMES
echo "✅ themes.css"

# ── 2. Update tailwind.config.js ─────────────────────────────────────────────
cat > tailwind.config.js << 'TAILWIND'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Cabinet Grotesk', 'system-ui', 'sans-serif'],
        mono:    ['DM Mono', 'SF Mono', 'monospace'],
        display: ['Instrument Serif', 'Georgia', 'serif'],
      },
      colors: {
        'bg-base':     'var(--bg-base)',
        'bg-surface':  'var(--bg-surface)',
        'bg-elevated': 'var(--bg-elevated)',
        'accent-primary':   'var(--accent-primary)',
        'accent-secondary': 'var(--accent-secondary)',
        'accent-green':     'var(--accent-green)',
        'accent-red':       'var(--accent-red)',
        'text-primary':   'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted':     'var(--text-muted)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      height: { '13': '3.25rem' },
    },
  },
  plugins: [],
}
TAILWIND
echo "✅ tailwind.config.js"

# ── 3. Update Home page gradients ────────────────────────────────────────────
cat > src/pages/Home/index.tsx << 'HOMEOF'
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
HOMEOF
echo "✅ Home/index.tsx"

# ── 4. Update Button.tsx primary variant to orange ────────────────────────────
sed -i '' "s/'bg-\[--accent-primary\] text-\[--bg-base\] font-semibold hover:opacity-90 ' \+/'bg-[--accent-primary] text-white font-semibold hover:opacity-90 ' +/g" src/components/ui/Button.tsx
echo "✅ Button.tsx"

# ── 5. Update UI_CONTRACT.md tokens ──────────────────────────────────────────
sed -i '' 's/--accent-primary:   #00D4FF (cyan)/--accent-primary:   #FF6B35 (orange)/g' UI_CONTRACT.md
sed -i '' 's/--accent-secondary: #FFB800 (amber)/--accent-secondary: #818CF8 (indigo-400)/g' UI_CONTRACT.md
sed -i '' 's/--accent-purple:    #A855F7 (AI)/--accent-purple:    #818CF8 (indigo-400, light)/g' UI_CONTRACT.md
sed -i '' 's/Cabinet Grotesk replaces Syne/Cabinet Grotesk — primary font/g' UI_CONTRACT.md
echo "✅ UI_CONTRACT.md"

# ── Gate 1: Type check ────────────────────────────────────────────────────────
echo ""
echo "🧠 Type checking..."
npx tsc --noEmit && echo "✅ Zero errors" || echo "❌ Fix errors"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Design token update complete:"
echo "  🟠 Primary:   #FF6B35 (orange)"
echo "  🔵 Secondary: #818CF8 (indigo-400)"
echo "  🟢 Green:     #10B981 (emerald)"
echo "  🔤 Font:      Cabinet Grotesk"
echo "  🌗 Light bg:  #FAFAF7 warm white"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
