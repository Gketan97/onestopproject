#!/usr/bin/env bash
# PHASE 0 v2 — FULL REBUILD
# 1. TravelHero SVG animation (planes, cities, routes, hotels)
# 2. Canvas cards: stat grid + analyst insight callout per card
# 3. Canvas: require ALL 5 cards opened before continuing
# 4. App lenses: smart keyword matching → contextual Arjun replies (no API call needed)
# 5. Slack: user-paced line reveal (button, not timer)
# 6. Hypothesis: Arjun challenges based on what user wrote (6 hypothesis types)
# + Phase 1 fixes: YoY 4 months, S3 synthesis sentence

set -euo pipefail
echo "📋 Phase 0 v2 rebuild"
echo "─────────────────────"

for f in UI_CONTRACT.md BUG_AUDIT.md CODE_QUALITY.md DEBT_REGISTER.md; do
  [ -f "$f" ] && echo "  ✅ $f" || { echo "  ❌ $f missing"; exit 1; }
done

mkdir -p src/components/visuals src/pages/CaseStudy/phases

# ════════════════════════════════════════════════════════════════
# A. TravelHero — animated SVG India route map
# ════════════════════════════════════════════════════════════════
python3 << 'PYEOF'
content = '''import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const CITIES = [
  { id: 'del', label: 'Delhi',      x: 195, y: 88,  hub: true  },
  { id: 'mum', label: 'Mumbai',     x: 118, y: 192, hub: true  },
  { id: 'ban', label: 'Bengaluru',  x: 195, y: 272, hub: true  },
  { id: 'col', label: 'Kolkata',    x: 358, y: 105, hub: false },
  { id: 'che', label: 'Chennai',    x: 290, y: 262, hub: false },
  { id: 'hyd', label: 'Hyderabad',  x: 240, y: 198, hub: false },
]

const ROUTES = [
  { a: 'del', b: 'mum', hot: true  },
  { a: 'del', b: 'ban', hot: true  },
  { a: 'del', b: 'col', hot: true  },
  { a: 'mum', b: 'ban', hot: false },
  { a: 'ban', b: 'che', hot: false },
  { a: 'hyd', b: 'del', hot: true  },
]

const HOT_ROUTES = ROUTES.filter(r => r.hot)

function bezier(t: number, ax: number, ay: number, bx: number, by: number) {
  const cx = (ax + bx) / 2 - (by - ay) * 0.28
  const cy = (ay + by) / 2 - (bx - ax) * 0.28
  const x  = (1-t)*(1-t)*ax + 2*(1-t)*t*cx + t*t*bx
  const y  = (1-t)*(1-t)*ay + 2*(1-t)*t*cy + t*t*by
  const dx = 2*(1-t)*(cx-ax) + 2*t*(bx-cx)
  const dy = 2*(1-t)*(cy-ay) + 2*t*(by-cy)
  return { x, y, angle: Math.atan2(dy, dx) * 180 / Math.PI }
}

function bezierPath(ax: number, ay: number, bx: number, by: number) {
  const cx = (ax + bx) / 2 - (by - ay) * 0.28
  const cy = (ay + by) / 2 - (bx - ax) * 0.28
  return `M${ax},${ay} Q${cx},${cy} ${bx},${by}`
}

function Hotel({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x - 9},${y - 26})`}>
      <rect x={1} y={7} width={16} height={13} fill={color} rx={1.5} opacity={0.88} />
      <rect x={5} y={0} width={8}  height={20} fill={color} rx={1.5} />
      <rect x={7.5} y={-3} width={1.5} height={4} fill={color} opacity={0.6} />
      {[0,1,2].flatMap(row => [0,1].map(col => (
        <rect key={`${row}-${col}`}
          x={3 + col*5} y={9 + row*3.5}
          width={2.5} height={2}
          fill="rgba(255,255,255,0.55)" rx={0.5}
        />
      )))}
    </g>
  )
}

function Plane({ t, ax, ay, bx, by, color }: {
  t: number; ax: number; ay: number; bx: number; by: number; color: string
}) {
  const { x, y, angle } = bezier(t, ax, ay, bx, by)
  return (
    <g transform={`translate(${x},${y}) rotate(${angle})`}>
      <ellipse cx={0} cy={0} rx={5.5} ry={1.8} fill={color} />
      <path d="M-1,-0.5 L-4.5,-3.5 L-1,-0.8Z" fill={color} opacity={0.75} />
      <path d="M-1, 0.5 L-4.5, 3.5 L-1, 0.8Z" fill={color} opacity={0.75} />
      <path d="M-4.5,-0.4 L-6.5,-1.8 L-4.5,0Z" fill={color} opacity={0.55} />
      <path d="M-10,0 L-5,0" stroke={color} strokeWidth={0.7} opacity={0.2} />
    </g>
  )
}

export function TravelHero() {
  const [tick, setTick] = useState(0)
  const raf  = useRef<number>(0)
  const t0   = useRef<number>(0)
  const cityMap = Object.fromEntries(CITIES.map(c => [c.id, c]))

  useEffect(() => {
    const step = (ts: number) => {
      if (!t0.current) t0.current = ts
      setTick((ts - t0.current) / 1000)
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [])

  return (
    <div className="relative w-full rounded-2xl overflow-hidden"
      style={{
        height: '300px',
        background: 'linear-gradient(155deg, #080818 0%, #0c0c22 55%, #080818 100%)',
        border: '1px solid rgba(129,140,248,0.18)',
      }}>

      {/* subtle grid */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.05 }}>
        <defs>
          <pattern id="g" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M36 0L0 0 0 36" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)"/>
      </svg>

      {/* ambient glows */}
      <div className="absolute pointer-events-none" style={{
        top: '15%', left: '28%', width: '220px', height: '220px',
        background: 'radial-gradient(circle, rgba(255,107,53,0.07) 0%, transparent 65%)',
        filter: 'blur(32px)',
      }}/>
      <div className="absolute pointer-events-none" style={{
        bottom: '10%', right: '22%', width: '180px', height: '180px',
        background: 'radial-gradient(circle, rgba(129,140,248,0.09) 0%, transparent 65%)',
        filter: 'blur(28px)',
      }}/>

      {/* main scene */}
      <svg className="absolute inset-0" style={{ width: '100%', height: '100%' }}
        viewBox="0 0 480 300" preserveAspectRatio="xMidYMid meet">

        {/* routes */}
        {ROUTES.map((r, i) => {
          const a = cityMap[r.a], b = cityMap[r.b]
          return (
            <path key={i} d={bezierPath(a.x, a.y, b.x, b.y)} fill="none"
              stroke={r.hot ? 'rgba(255,107,53,0.45)' : 'rgba(129,140,248,0.20)'}
              strokeWidth={r.hot ? 1.4 : 0.9}
              strokeDasharray={r.hot ? '4 3' : '2 4'}
            />
          )
        })}

        {/* animated planes — one per hot route, staggered */}
        {HOT_ROUTES.map((r, i) => {
          const a = cityMap[r.a], b = cityMap[r.b]
          const period  = 5.5 + i * 1.1
          const offset  = i * 0.27
          const t       = ((tick / period) + offset) % 1
          const isOdd   = i % 2 === 1
          return (
            <Plane key={i} t={t}
              ax={isOdd ? b.x : a.x} ay={isOdd ? b.y : a.y}
              bx={isOdd ? a.x : b.x} by={isOdd ? a.y : b.y}
              color={i % 2 === 0 ? '#FF6B35' : '#818CF8'}
            />
          )
        })}

        {/* city nodes */}
        {CITIES.map((city, i) => (
          <g key={city.id}>
            <motion.circle cx={city.x} cy={city.y}
              fill="none"
              stroke={city.hub ? 'rgba(255,107,53,0.35)' : 'rgba(129,140,248,0.25)'}
              strokeWidth={0.9}
              animate={{ r: [city.hub ? 9 : 6, city.hub ? 14 : 10, city.hub ? 9 : 6], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.45, ease: 'easeInOut' }}
            />
            <circle cx={city.x} cy={city.y} r={city.hub ? 4.5 : 3}
              fill={city.hub ? 'rgba(255,107,53,0.9)' : 'rgba(129,140,248,0.75)'}
            />
            {city.hub && (
              <Hotel x={city.x} y={city.y}
                color={city.id === 'ban' ? '#818CF8' : city.id === 'mum' ? '#FF6B35' : '#FF6B35'}
              />
            )}
            <text x={city.x} y={city.y + (city.hub ? 14 : 11)}
              textAnchor="middle" fill="rgba(255,255,255,0.45)"
              fontSize={8.5} fontFamily="var(--font-mono)" letterSpacing={0.4}>
              {city.label}
            </text>
          </g>
        ))}

        {/* stat cards — top-left */}
        <g>
          <rect x={8} y={8} width={98} height={38} rx={7}
            fill="rgba(8,8,24,0.88)" stroke="rgba(248,113,113,0.30)" strokeWidth={0.8}/>
          <text x={17} y={23} fill="rgba(248,113,113,0.65)" fontSize={7.5}
            fontFamily="var(--font-mono)" letterSpacing={0.6}>B/DAU</text>
          <text x={17} y={39} fill="#F87171" fontSize={15}
            fontFamily="var(--font-heading)" fontWeight="700">10.1%</text>
          <text x={72} y={39} fill="rgba(248,113,113,0.55)" fontSize={10}
            fontFamily="var(--font-mono)">↓1.9pp</text>
        </g>
        <g>
          <rect x={8} y={54} width={98} height={38} rx={7}
            fill="rgba(8,8,24,0.88)" stroke="rgba(129,140,248,0.22)" strokeWidth={0.8}/>
          <text x={17} y={69} fill="rgba(129,140,248,0.6)" fontSize={7.5}
            fontFamily="var(--font-mono)" letterSpacing={0.6}>DAILY USERS</text>
          <text x={17} y={85} fill="rgba(255,255,255,0.88)" fontSize={15}
            fontFamily="var(--font-heading)" fontWeight="700">11.5M</text>
        </g>

        {/* stat cards — top-right */}
        <g>
          <rect x={374} y={8} width={98} height={38} rx={7}
            fill="rgba(8,8,24,0.88)" stroke="rgba(129,140,248,0.22)" strokeWidth={0.8}/>
          <text x={383} y={23} fill="rgba(129,140,248,0.6)" fontSize={7.5}
            fontFamily="var(--font-mono)" letterSpacing={0.6}>BOOKINGS/DAY</text>
          <text x={383} y={39} fill="rgba(255,255,255,0.88)" fontSize={15}
            fontFamily="var(--font-heading)" fontWeight="700">820K</text>
        </g>
        <g>
          <rect x={374} y={54} width={98} height={38} rx={7}
            fill="rgba(8,8,24,0.88)" stroke="rgba(248,113,113,0.28)" strokeWidth={0.8}/>
          <text x={383} y={69} fill="rgba(248,113,113,0.6)" fontSize={7.5}
            fontFamily="var(--font-mono)" letterSpacing={0.6}>REVENUE HIT</text>
          <text x={383} y={85} fill="#F87171" fontSize={15}
            fontFamily="var(--font-heading)" fontWeight="700">₹4.2Cr</text>
        </g>

        {/* legend — bottom */}
        <g transform="translate(138,284)">
          <circle cx={0}   cy={0} r={4}  fill="rgba(255,107,53,0.8)"/>
          <text   x={9}    y={4}  fill="rgba(255,255,255,0.35)" fontSize={8.5} fontFamily="var(--font-mono)">Major hubs</text>
          <circle cx={82}  cy={0} r={3}  fill="rgba(129,140,248,0.7)"/>
          <text   x={91}   y={4}  fill="rgba(255,255,255,0.35)" fontSize={8.5} fontFamily="var(--font-mono)">Tier-2</text>
          <rect   x={147}  y={-2} width={14} height={2} fill="rgba(255,107,53,0.45)"/>
          <text   x={165}  y={4}  fill="rgba(255,255,255,0.35)" fontSize={8.5} fontFamily="var(--font-mono)">Active routes</text>
        </g>
      </svg>

      {/* P0 badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
        style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.28)' }}>
        <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: '#F87171' }}
          animate={{ opacity: [1, 0.25, 1] }} transition={{ duration: 1.8, repeat: Infinity }}/>
        <span style={{ color: '#F87171', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.07em' }}>
          P0 · LIVE INCIDENT
        </span>
      </div>
    </div>
  )
}
'''

with open('src/components/visuals/TravelHero.tsx', 'w') as f:
    f.write(content)
print('✅ TravelHero.tsx')
PYEOF

# ════════════════════════════════════════════════════════════════
# B. Phase0.tsx — full rebuild
# ════════════════════════════════════════════════════════════════
python3 << 'PYEOF'
content = r'''import { useState, useEffect }     from 'react'
import { useNavigate, useParams }  from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, Building2, Users, Package, BarChart3,
  Shield, Smartphone, TrendingDown, AlertTriangle, CheckCircle2,
} from 'lucide-react'
import { useProgressStore }        from '@/store/progressStore'
import { TravelHero }              from '@/components/visuals/TravelHero'
import { ArjunInline }             from '@/components/phases/ArjunInline'
import { ContinueButton }          from '@/components/phases/ContinueButton'
import { RevealBlock }             from '@/components/phases/RevealBlock'
import { staggerChildren, staggerItem } from '@/lib/motionVariants'

// ── Canvas data ────────────────────────────────────────────────
const CANVAS_CARDS = [
  {
    id: 'model', icon: Building2, title: 'Business Model', tagline: 'How MMT earns',
    color: 'var(--accent-primary)', glow: 'rgba(255,107,53,0.07)',
    badge: '10–15% commission',
    summary: 'Commission-only marketplace. No booking = no revenue.',
    stats: [
      { val: '10–15%',   desc: 'commission per completed booking — pure performance model' },
      { val: '₹4.2Cr',  desc: 'already lost from this 60-day drop. Board review in 3 weeks.' },
      { val: '820K/day', desc: 'gross bookings — flat during drop. Revenue fell because CVR fell.' },
      { val: '₹1,920',  desc: 'average booking value — each lost conversion = this revenue' },
    ],
    insight: 'B/DAU can fall even when absolute bookings are flat — if DAU grows faster than bookings. Always decompose numerator and denominator separately before concluding anything.',
  },
  {
    id: 'users', icon: Users, title: 'User Segments', tagline: 'Who books and why it matters',
    color: 'var(--accent-secondary)', glow: 'rgba(129,140,248,0.07)',
    badge: '11.5M DAU',
    summary: 'Three segments with wildly different conversion behavior and revenue impact.',
    stats: [
      { val: '65%',  desc: 'Leisure — book 2–4 months ahead, most price-sensitive segment' },
      { val: '25%',  desc: 'Business — book within 7 days, 4★+ hotels, less price-sensitive' },
      { val: '10%',  desc: 'Last-minute — same-day, highest CVR, smallest total revenue share' },
      { val: '3×',   desc: 'Revenue impact difference: 1pp CVR drop in leisure vs last-minute' },
    ],
    insight: 'Segment mix changes everything. If the drop is concentrated in leisure users, the revenue impact is 3× larger than the same drop in last-minute bookers. Always segment before sizing.',
  },
  {
    id: 'supply', icon: Package, title: 'Supply Side', tagline: 'What users actually see',
    color: 'var(--accent-green)', glow: 'rgba(16,185,129,0.07)',
    badge: '50,000+ hotels',
    summary: 'Supply quality affects CVR independently of product changes.',
    stats: [
      { val: '50K+',    desc: 'hotels across India — 5★ chains to budget homestays' },
      { val: '~25%',    desc: 'budget hotel share — highest CVR category; stock-out = CVR drop' },
      { val: 'Dynamic', desc: 'pricing by hotels — demand spikes raise prices, reducing affordability' },
      { val: 'Direct',  desc: 'hotel website discounts create checkout drop-off risk at payment step' },
    ],
    insight: 'CVR can fall even if the product works perfectly — if high-converting budget inventory goes out of stock, or hotels raise prices above user expectations at checkout.',
  },
  {
    id: 'metrics', icon: BarChart3, title: 'Key Metrics', tagline: 'What the team optimises',
    color: 'var(--accent-primary)', glow: 'rgba(255,107,53,0.07)',
    badge: 'North Star: B/DAU',
    summary: 'Bookings/DAU is the single metric the entire growth team lives by.',
    stats: [
      { val: 'B/DAU',   desc: '= Gross Completed Payments ÷ Logged-in Unique Daily Users' },
      { val: '−15.8%',  desc: 'relative decline: 12.0% → 10.1% = −1.9pp absolute' },
      { val: 'GMV',     desc: 'Gross Merchandise Value — total booking value before cancellations' },
      { val: 'CVR',     desc: 'Conversion Rate = Bookings ÷ Sessions — measures product quality' },
    ],
    insight: '"CVR dropped 1.9%" sounds like rounding error. "CVR dropped 1.9pp" triggers board escalation. The unit is the message — pp is absolute, % is relative. Use both.',
  },
  {
    id: 'moat', icon: Shield, title: 'Competitive Moat', tagline: 'Why users return',
    color: 'var(--accent-secondary)', glow: 'rgba(129,140,248,0.07)',
    badge: '10M+ reviews',
    summary: 'Three moats — all at risk if CVR drops persistently for 60+ days.',
    stats: [
      { val: '#1',       desc: 'hotel inventory in India — Tier-2 city coverage is key differentiator' },
      { val: 'Wallet',   desc: 'MMT loyalty points create switching costs — rewarded users stay longer' },
      { val: '10M+',     desc: 'user reviews — trust moat competitors cannot replicate quickly' },
      { val: '30–90d',   desc: 'habit change window — sustained drop trains users to open Booking.com first' },
    ],
    insight: 'A sustained CVR drop doesn\'t just cost today\'s revenue — it slowly trains users to default to a competitor. After 90 days of worse experience, the habit change is permanent.',
  },
]

// ── Lens definitions with smart keyword matching ───────────────
const LENSES = [
  {
    id: 'funnel', icon: '🔍',
    label: 'Funnel — count every step',
    placeholder: 'From search to checkout: how many screens? What happened at each one?',
    keywords: ['step', 'screen', 'page', 'tap', 'click', 'scroll', 'stage', 'list', 'detail', 'checkout', 'search', 'result'],
    goodReply: (txt: string) =>
      `Good observation. The standard MMT flow has 6 stages: Search → Results → Hotel Detail → Checkout → Payment → Confirmation. ${txt.toLowerCase().includes('6') || txt.toLowerCase().includes('six') ? 'You counted all 6 — correct.' : 'Each stage is a potential drop-off.'} In Phase 5, you\'ll see exactly which of these broke.`,
    pushReply: 'Think in decision points — every screen where you had to choose something or wait for something to load. Go back: Search → what came next? Count them out.',
  },
  {
    id: 'friction', icon: '⚡',
    label: 'Friction — where did you hesitate?',
    placeholder: 'Was anything slow, confusing, or made you pause before proceeding?',
    keywords: ['slow', 'load', 'wait', 'checkout', 'long', 'delay', 'lag', 'second', 'time', 'pause', 'fast', 'quick'],
    goodReply: (txt: string) =>
      txt.toLowerCase().includes('checkout') || txt.toLowerCase().includes('slow') || txt.toLowerCase().includes('load')
        ? 'Important. Note exactly where in the flow — search results? Hotel detail? Checkout? In Phase 3 you\'ll see that iOS v8.3 checkout load time jumped to 4.2 seconds. If you felt that, you just experienced the root cause firsthand.'
        : 'Good. Be more specific — WHERE in the flow? "It felt slow" is a feeling. "The screen after I tapped Book Now took 4 seconds" is data. Location matters more than the feeling itself.',
    pushReply: 'Try again with a fresh lens: was there any moment you almost gave up, or opened another tab? That specific hesitation point is worth documenting precisely.',
  },
  {
    id: 'trust', icon: '🤝',
    label: 'Trust — what made you confident or uncertain?',
    placeholder: 'What information helped you feel ready to book? What made you want more details first?',
    keywords: ['review', 'photo', 'price', 'cancel', 'refund', 'rating', 'star', 'guarantee', 'policy', 'verified', 'secure'],
    goodReply: () =>
      'Trust signals directly drive Detail→Checkout conversion — independently of product performance. Reviews, cancellation flexibility, price transparency. These are exactly the variables you\'ll test when forming hypotheses in Phase 2.',
    pushReply: 'Think about the moment just before you would have tapped "Proceed to Pay." What were you still unsure about? That gap between browsing and committing is where trust signals live.',
  },
]

// ── Slack lines ────────────────────────────────────────────────
const SLACK = [
  { text: 'Team — flagging this as P0.',                                                                                bold: true  },
  { text: 'We\'ve seen a sustained 18% drop in Bookings/DAU over 60 days. Started day −62. Hasn\'t recovered.',       bold: false },
  { text: 'GMV impact: ₹4.2Cr already. Festival season starts in 8 weeks — ₹30Cr+ quarterly miss if this continues.', bold: false },
  { text: 'I need root cause — not hypotheses. Data-backed. What broke? When? Why? Fastest path to recovery.',         bold: false },
  { text: 'Board review in 3 weeks. Slides by Friday.',                                                                 bold: true  },
]

// ── Hypothesis challenger ──────────────────────────────────────
function challengeHypothesis(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('marketing') || t.includes('ad') || t.includes('campaign') || t.includes('spend'))
    return 'Reasonable instinct — but marketing spend didn\'t change around day −62. CAC, paid/organic mix, and campaign timing are all flat. If marketing is clean, what else could cause a sustained structural drop? What data do you check next?'
  if (t.includes('ios') || t.includes('android') || t.includes('app') || t.includes('update') || t.includes('version'))
    return 'Sharp — platform regression is exactly what a senior analyst checks first. Which specific version? And how would you prove it caused the drop rather than just coincided with it? Correlation vs causation is the trap here.'
  if (t.includes('price') || t.includes('competitor') || t.includes('oyo') || t.includes('booking.com') || t.includes('cheaper'))
    return 'Competitive pressure is plausible — but it typically produces a gradual trend over months, not a clean structural break at a specific day. What would the data look like if it was competitive pressure vs a product regression?'
  if (t.includes('checkout') || t.includes('payment') || t.includes('funnel') || t.includes('conversion'))
    return 'Good direction — funnel breakdown is the right frame. But "checkout issue" covers a lot: latency, UX regression, payment failure, pricing display bug. What specific metric would you pull first to narrow down which of these it is?'
  if (t.includes('season') || t.includes('festival') || t.includes('holiday') || t.includes('january') || t.includes('feb'))
    return 'Seasonality is exactly the first thing you should rule out — and you\'ll do that systematically in Phase 1 Section 4. Strong instinct. But if it\'s seasonal, the YoY chart for Jan–Feb 2024 should show the same dip. Do you know what it showed?'
  if (t.includes('server') || t.includes('infra') || t.includes('outage') || t.includes('downtime'))
    return 'Infrastructure regression is worth considering — but an outage would show as a sudden drop and recovery, not a steady −0.2pp/week over 60 days. What does the shape of the drop tell you about the type of cause?'
  return 'Interesting. Before we test that — what data would you pull first to confirm or kill it? A good hypothesis always has a defined test that can falsify it. What would "I\'m wrong" look like in the data?'
}

type Section = 'canvas' | 'app' | 'brief' | 'hypothesis'

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════
export default function Phase0() {
  const { slug }    = useParams<{ slug: string }>()
  const navigate    = useNavigate()
  const { completePhase, isCompleted } = useProgressStore()
  const completed   = isCompleted('phase-0')

  // Section gate
  const [section, setSection] = useState<Section>('canvas')

  // Canvas
  const [openCard, setOpenCard]         = useState<string | null>('model')
  const [opened, setOpened]             = useState<Set<string>>(new Set(['model']))

  // Lenses
  const [lensText, setLensText]         = useState<Record<string, string>>({})
  const [lensLoading, setLensLoading]   = useState<Record<string, boolean>>({})
  const [lensReply, setLensReply]       = useState<Record<string, string>>({})
  const [lensDone, setLensDone]         = useState<Record<string, boolean>>({})

  // Slack
  const [slackIdx, setSlackIdx]         = useState(0)
  const [slackDone, setSlackDone]       = useState(false)

  // Hypothesis
  const [hypo, setHypo]                 = useState('')
  const [hypoChallenge, setHypoChallenge] = useState('')
  const [hypoChallenged, setHypoChallenged] = useState(false)
  const [hypoLocked, setHypoLocked]     = useState(false)

  // Restore on revisit
  useEffect(() => {
    if (!completed) return
    setSection('hypothesis')
    setOpened(new Set(CANVAS_CARDS.map(c => c.id)))
    setSlackDone(true)
    setHypoChallenged(true)
    setHypoLocked(true)
  }, [completed])

  function toggleCard(id: string) {
    setOpenCard(prev => prev === id ? null : id)
    setOpened(prev => new Set([...prev, id]))
  }

  const allCardsOpened = opened.size >= CANVAS_CARDS.length
  const allLensesDone  = LENSES.every(l => lensDone[l.id])

  async function submitLens(lens: typeof LENSES[0]) {
    const txt = lensText[lens.id]?.trim() ?? ''
    if (txt.length < 12) return
    setLensLoading(prev => ({ ...prev, [lens.id]: true }))
    await new Promise(r => setTimeout(r, 650))
    const hasKeyword = lens.keywords.some(kw => txt.toLowerCase().includes(kw))
    const reply = hasKeyword ? lens.goodReply(txt) : lens.pushReply
    setLensReply(prev  => ({ ...prev, [lens.id]: reply }))
    setLensDone(prev   => ({ ...prev, [lens.id]: true  }))
    setLensLoading(prev => ({ ...prev, [lens.id]: false }))
    const nextDoneCount = Object.values({ ...lensDone, [lens.id]: true }).filter(Boolean).length
    if (nextDoneCount >= LENSES.length) setTimeout(() => setSection('brief'), 700)
  }

  function revealSlack() {
    if (slackIdx < SLACK.length - 1) setSlackIdx(s => s + 1)
    else setSlackDone(true)
  }

  function submitHypo() {
    if (hypo.trim().length < 10) return
    setHypoChallenge(challengeHypothesis(hypo))
    setHypoChallenged(true)
  }

  function handleComplete() {
    completePhase('phase-0')
    navigate(`/case-study/${slug}/phase-1`)
  }

  return (
    <div className="space-y-14 pb-24">

      {/* ── HERO ─────────────────────────────────── */}
      <RevealBlock>
        <div className="space-y-4">
          <TravelHero />
          <div className="flex items-center justify-between px-1">
            <div>
              <p className="text-xs uppercase tracking-widest"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                MakeMyTrip · India's largest OTA
              </p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                50,000+ hotels · 11.5M daily users · ₹4.2Cr at risk
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.22)' }}>
              <TrendingDown size={13} style={{ color: '#F87171' }} />
              <span style={{ color: '#F87171', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>
                −1.9pp in 60 days
              </span>
            </div>
          </div>
        </div>
      </RevealBlock>

      {/* ── Arjun intro ───────────────────────────── */}
      <RevealBlock delay={0.05}>
        <ArjunInline variant="default">
          <p>
            Before you look at a single number — understand the business.
            The analysts I've seen waste the most time are the ones who jumped into data
            without knowing how this company actually makes money.
          </p>
          <p className="mt-2">
            Open every card below. <strong style={{ color: 'var(--text-primary)' }}>Don't skip any.</strong>
            {' '}The Competitive Moat card especially — it explains why a 1.9pp drop
            is an existential problem, not just a bad week.
          </p>
        </ArjunInline>
      </RevealBlock>

      {/* ── CANVAS ───────────────────────────────── */}
      <section id="business-canvas" className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <p className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Section 01
          </p>
          <span style={{ color: 'var(--border-default)' }}>·</span>
          <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {opened.size}/{CANVAS_CARDS.length} cards opened
          </p>
        </div>

        <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="space-y-2">
          {CANVAS_CARDS.map(card => {
            const Icon   = card.icon
            const isOpen = openCard === card.id
            const seen   = opened.has(card.id)
            return (
              <motion.div key={card.id} variants={staggerItem}>
                {/* Header button */}
                <button
                  onClick={() => toggleCard(card.id)}
                  className="w-full flex items-center gap-4 p-4 text-left transition-all duration-200"
                  style={{
                    background:   isOpen ? card.glow : 'var(--bg-surface)',
                    border:       `1px solid ${isOpen ? card.color + '30' : 'var(--border-subtle)'}`,
                    borderRadius: isOpen ? '16px 16px 0 0' : '16px',
                  }}>
                  <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
                    style={{ background: card.glow, border: `1px solid ${card.color}22` }}>
                    <Icon size={18} style={{ color: card.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold"
                        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                        {card.title}
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: card.glow, border: `1px solid ${card.color}22`, color: card.color, fontFamily: 'var(--font-mono)' }}>
                        {card.badge}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{card.summary}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {seen && !isOpen && <CheckCircle2 size={13} style={{ color: 'var(--accent-green)' }} />}
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.22 }}>
                      <ChevronDown size={15} style={{ color: 'var(--text-muted)' }} />
                    </motion.div>
                  </div>
                </button>

                {/* Body */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                      style={{
                        background:   card.glow,
                        border:       `1px solid ${card.color}25`,
                        borderTop:    'none',
                        borderRadius: '0 0 16px 16px',
                      }}>
                      <div className="px-5 py-5 space-y-4">
                        {/* Stats 2×2 grid */}
                        <div className="grid grid-cols-2 gap-2.5">
                          {card.stats.map((s, j) => (
                            <motion.div key={j}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: j * 0.06, duration: 0.3 }}
                              className="rounded-xl p-3 space-y-1"
                              style={{ background: 'rgba(0,0,0,0.30)', border: '1px solid rgba(255,255,255,0.05)' }}>
                              <p className="text-base font-bold tracking-tight"
                                style={{ color: card.color, fontFamily: 'var(--font-heading)' }}>
                                {s.val}
                              </p>
                              <p className="text-xs leading-snug" style={{ color: 'var(--text-muted)' }}>
                                {s.desc}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                        {/* Insight callout */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="flex gap-3 px-4 py-3 rounded-xl"
                          style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${card.color}18` }}>
                          <AlertTriangle size={13} style={{ color: card.color, flexShrink: 0, marginTop: '2px' }} />
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            <strong style={{ color: card.color }}>Analyst insight: </strong>
                            {card.insight}
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Progress nudge */}
        <AnimatePresence>
          {!allCardsOpened && opened.size > 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-xs text-center pt-1"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {CANVAS_CARDS.length - opened.size} card{CANVAS_CARDS.length - opened.size !== 1 ? 's' : ''} remaining
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {allCardsOpened && section === 'canvas' && !completed && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <ContinueButton
                label="Business understood — now experience the product"
                onClick={() => setSection('app')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── APP EXPLORATION ───────────────────────── */}
      <AnimatePresence>
        {(section === 'app' || section === 'brief' || section === 'hypothesis' || completed) && (
          <motion.section key="app"
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6">

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.18)' }}>
                <Smartphone size={15} style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Section 02</p>
                <h2 className="text-xl font-bold"
                  style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  Experience the Product
                </h2>
              </div>
            </div>

            <ArjunInline variant="question" delay={0.1}>
              <p>
                <strong style={{ color: 'var(--text-primary)' }}>Open MakeMyTrip on your phone right now.</strong>
                {' '}Search for a hotel in any city this weekend. Browse a hotel detail page.
                Try to reach the checkout screen. Then come back.
              </p>
              <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
                Every analyst I respect has used the product before looking at any data.
                You can't investigate a metric drop for an experience you've never had.
              </p>
            </ArjunInline>

            <div className="space-y-3">
              {LENSES.map((lens, i) => {
                const prev   = i === 0 || lensDone[LENSES[i-1].id]
                const done   = lensDone[lens.id]
                const locked = !prev && !done

                return (
                  <motion.div key={lens.id}
                    animate={{ opacity: locked ? 0.32 : 1 }}
                    className="rounded-2xl overflow-hidden"
                    style={{ border: `1px solid ${done ? 'rgba(16,185,129,0.28)' : 'var(--border-subtle)'}` }}>

                    {/* Lens header */}
                    <div className="flex items-center gap-3 px-5 py-3"
                      style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '16px' }}>{lens.icon}</span>
                      <p className="flex-1 text-sm font-semibold"
                        style={{ color: done ? 'var(--accent-green)' : 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                        {lens.label}
                      </p>
                      {done && <CheckCircle2 size={13} style={{ color: 'var(--accent-green)' }} />}
                    </div>

                    {/* Lens body */}
                    <div className="px-5 py-4 space-y-3" style={{ background: 'var(--bg-elevated)' }}>
                      {!done && (
                        <>
                          <textarea
                            value={lensText[lens.id] ?? ''}
                            onChange={e => setLensText(p => ({ ...p, [lens.id]: e.target.value }))}
                            placeholder={lens.placeholder}
                            disabled={locked}
                            rows={2}
                            className="w-full rounded-xl px-4 py-3 text-sm resize-none"
                            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', outline: 'none' }}
                            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.45)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.08)' }}
                            onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }}
                          />
                          <button
                            onClick={() => submitLens(lens)}
                            disabled={locked || lensLoading[lens.id] || (lensText[lens.id]?.trim().length ?? 0) < 12}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-35"
                            style={{ background: 'var(--accent-secondary)', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                            {lensLoading[lens.id] && (
                              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                            )}
                            {lensLoading[lens.id] ? 'Reading...' : 'Submit observation →'}
                          </button>
                        </>
                      )}

                      {done && lensText[lens.id] && (
                        <div className="px-4 py-3 rounded-xl"
                          style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.14)' }}>
                          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Your observation:</p>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{lensText[lens.id]}</p>
                        </div>
                      )}

                      <AnimatePresence>
                        {lensReply[lens.id] && (
                          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                            <ArjunInline variant="affirm" delay={0}>
                              <p>{lensReply[lens.id]}</p>
                            </ArjunInline>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── BRIEF ────────────────────────────────── */}
      <AnimatePresence>
        {(section === 'brief' || section === 'hypothesis' || completed) && allLensesDone && (
          <motion.section key="brief"
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5">

            <div>
              <p className="text-xs uppercase tracking-widest mb-0.5"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Section 03</p>
              <h2 className="text-xl font-bold"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>The Brief</h2>
            </div>

            <ArjunInline variant="default" delay={0.05}>
              <p>You've used the product. Now read what just landed in your Slack.
              Notice how it hits differently when you've actually been through the checkout flow yourself.</p>
            </ArjunInline>

            {/* Slack card */}
            <div className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid var(--border-default)' }}>
              <div className="flex items-center gap-3 px-5 py-3"
                style={{ background: '#12122A', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                  style={{ background: 'rgba(129,140,248,0.2)', color: 'var(--accent-secondary)' }}>#</div>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>
                  analytics-escalation
                </span>
                <div className="ml-auto flex items-center gap-1.5">
                  <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: '#10B981' }}
                    animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2.2, repeat: Infinity }}/>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)' }}>live</span>
                </div>
              </div>

              <div className="px-5 py-5 space-y-4" style={{ background: '#0F0F28' }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg,#FF6B35,#818CF8)', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                    PM
                  </div>
                  <div>
                    <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.92)', fontFamily: 'var(--font-heading)' }}>
                      Priya Mehta
                    </span>
                    <span className="text-xs ml-2" style={{ color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-mono)' }}>
                      Today, 9:14 AM
                    </span>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.28)' }}>Head of Growth · MakeMyTrip</p>
                  </div>
                </div>

                <div className="space-y-3 pl-[52px]">
                  {SLACK.slice(0, slackIdx + 1).map((line, li) => (
                    <motion.p key={li}
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.32 }}
                      className="text-sm leading-relaxed"
                      style={{ color: 'rgba(255,255,255,0.76)' }}>
                      {line.bold
                        ? <strong style={{ color: 'rgba(255,255,255,0.95)' }}>{line.text}</strong>
                        : line.text}
                    </motion.p>
                  ))}

                  {/* Reveal button */}
                  {!slackDone && (
                    <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      onClick={revealSlack}
                      className="text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                      style={{ background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.22)', color: 'var(--accent-secondary)', fontFamily: 'var(--font-mono)' }}>
                      {slackIdx < SLACK.length - 1 ? '▼ Continue reading' : '✓ Mark as read'}
                    </motion.button>
                  )}

                  <AnimatePresence>
                    {slackDone && (
                      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
                        style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.28)' }}>
                        <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: '#F87171' }}
                          animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.6, repeat: Infinity }}/>
                        <span className="text-xs font-bold" style={{ color: '#F87171', fontFamily: 'var(--font-mono)' }}>
                          P0 · Board visibility · 3 weeks
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {slackDone && section === 'brief' && !completed && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <ContinueButton
                    label="Brief received — form my first hypothesis"
                    onClick={() => setSection('hypothesis')}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── HYPOTHESIS ───────────────────────────── */}
      <AnimatePresence>
        {(section === 'hypothesis' || completed) && (
          <motion.section key="hypo"
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5">

            <ArjunInline variant="question" delay={0.08}>
              <p>
                You've read the business context. Used the product. Read the brief.
              </p>
              <p className="mt-2">
                <strong style={{ color: 'var(--text-primary)' }}>
                  Before you touch any data — what do you think caused this drop?
                </strong>
                {' '}One sentence. I'll challenge it. This is how real investigations start.
              </p>
            </ArjunInline>

            {!hypoChallenged && (
              <div className="space-y-3">
                <textarea
                  value={hypo}
                  onChange={e => setHypo(e.target.value)}
                  placeholder="My hypothesis is that the drop was caused by..."
                  rows={2}
                  className="w-full rounded-xl px-4 py-3 text-sm resize-none"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', outline: 'none' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.45)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.08)' }}
                  onBlur={e  => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none' }}
                />
                <button
                  onClick={submitHypo}
                  disabled={hypo.trim().length < 10}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-35"
                  style={{ background: 'var(--accent-secondary)', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                  Submit — let Arjun challenge it →
                </button>
              </div>
            )}

            <AnimatePresence>
              {hypoChallenged && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-4">

                  {hypo && (
                    <div className="px-4 py-3 rounded-xl"
                      style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.18)' }}>
                      <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        Your hypothesis — saved to brief:
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{hypo}</p>
                    </div>
                  )}

                  {hypoChallenge && (
                    <ArjunInline variant="nudge" delay={0.1}>
                      <p>{hypoChallenge}</p>
                    </ArjunInline>
                  )}

                  <AnimatePresence>
                    {!hypoLocked && (
                      <motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        onClick={() => setHypoLocked(true)}
                        className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)', fontFamily: 'var(--font-heading)' }}>
                        Hypothesis locked — Begin Investigation →
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {hypoLocked && !completed && (
                    <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      onClick={handleComplete}
                      className="w-full py-4 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
                      style={{ background: 'var(--accent-primary)', color: '#fff', fontFamily: 'var(--font-heading)', boxShadow: '0 0 28px rgba(255,107,53,0.16)' }}>
                      Begin Investigation — Phase 1: Understanding the Problem →
                    </motion.button>
                  )}

                  {completed && (
                    <div className="flex items-center gap-3 px-5 py-4 rounded-xl"
                      style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.18)' }}>
                      <CheckCircle2 size={15} style={{ color: 'var(--accent-green)' }} />
                      <p className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>
                        Phase 0 complete — revisiting
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}
      </AnimatePresence>

    </div>
  )
}
'''

with open('src/pages/CaseStudy/phases/Phase0.tsx', 'w') as f:
    f.write(content)
print('✅ Phase0.tsx')
PYEOF

# ════════════════════════════════════════════════════════════════
# C. Update visuals barrel (add TravelHero if missing)
# ════════════════════════════════════════════════════════════════
python3 << 'PYEOF'
barrel = 'src/components/visuals/index.ts'
try:
    with open(barrel, 'r') as f:
        c = f.read()
except FileNotFoundError:
    c = ''

if 'TravelHero' not in c:
    c += "\nexport { TravelHero } from './TravelHero'\n"
    with open(barrel, 'w') as f:
        f.write(c)
    print('✅ visuals/index.ts: TravelHero added')
else:
    print('✅ TravelHero already in barrel')
PYEOF

# ════════════════════════════════════════════════════════════════
# D. Phase 1 fixes
# ════════════════════════════════════════════════════════════════
python3 << 'PYEOF'
import re

# ── D1: YoYChart — extend 2025 to 4 months ───────────────────
yoy_path = 'src/components/phases/YoYChart.tsx'
with open(yoy_path, 'r') as f:
    yoy = f.read()

changes = [
    # pattern: y2025 null for Mar/Apr → real values
    ("{ month: 'Mar', y2024: 12.0, y2025: null  }",   "{ month: 'Mar', y2024: 12.0, y2025: 10.7  }"),
    ("{ month: 'Apr', y2024: 11.8, y2025: null  }",   "{ month: 'Apr', y2024: 11.8, y2025: 10.1  }"),
    # handle slightly different spacing too
    ("{ month: 'Mar', y2024: 12.0, y2025: null }",    "{ month: 'Mar', y2024: 12.0, y2025: 10.7 }"),
    ("{ month: 'Apr', y2024: 11.8, y2025: null }",    "{ month: 'Apr', y2024: 11.8, y2025: 10.1 }"),
]

changed = False
for old, new in changes:
    if old in yoy:
        yoy = yoy.replace(old, new)
        changed = True

if changed:
    with open(yoy_path, 'w') as f:
        f.write(yoy)
    print('✅ YoYChart: 2025 extended to Jan–Apr')
else:
    print('⚠️  YoYChart: 2025 data already extended or pattern differs')

# ── D2: Phase1 — add synthesis sentence after 6.3σ callout ──
p1_path = 'src/pages/CaseStudy/phases/Phase1.tsx'
with open(p1_path, 'r') as f:
    p1 = f.read()

# Look for 6.3σ arrow label + conclusion block; append synthesis
old_synth = 'Anything beyond ±3σ is considered statistically extreme.\n                      This drop is not noise. It is confirmed, significant, and structural.'
new_synth = 'Anything beyond ±3σ is considered statistically extreme.\n                      This drop is not noise — 6.3σ means a 1-in-a-billion chance of random variation.\n                      Something structural changed around W25 and has compounded every week since.\n                      That timing is your investigation anchor going into Phase 2.'

if old_synth in p1:
    p1 = p1.replace(old_synth, new_synth)
    with open(p1_path, 'w') as f:
        f.write(p1)
    print('✅ Phase1 S3: synthesis sentence seeding Phase 2')
else:
    print('⚠️  Phase1 S3: pattern not matched — may already be updated or differs')
PYEOF

# ════════════════════════════════════════════════════════════════
# E. Gates
# ════════════════════════════════════════════════════════════════
echo ""
echo "🧠 TypeScript..."
npx tsc --noEmit && echo "✅ Zero type errors" || echo "❌ Fix errors above"

echo ""
echo "🔨 Build..."
npm run build && echo "✅ Build clean" || echo "❌ Build failed"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Phase 0 v2 + Phase 1 fixes"
echo ""
echo " TravelHero animation:"
echo "   6 cities (Delhi, Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad)"
echo "   4 hot-route planes — orange/indigo, staggered, bezier paths"
echo "   Hotel building icons on Delhi, Mumbai, Bengaluru"
echo "   Pulse rings on every city node"
echo "   4 live stat cards (B/DAU, DAU, Bookings, Revenue Hit)"
echo "   P0 badge top-right, legend bottom-center"
echo "   Ambient glow + grid overlay + dark gradient bg"
echo ""
echo " Canvas cards:"
echo "   Each card: badge pill + 2×2 stat grid + analyst insight callout"
echo "   Require all 5 cards opened before Continue appears"
echo "   Progress counter (X/5 opened)"
echo ""
echo " App lenses:"
echo "   Smart keyword matching → contextual Arjun reply (no API call)"
echo "   Friction: mentions checkout/slow → iOS v8.3 Phase 3 callback"
echo "   Sequential unlock — lens N+1 visible only after N done"
echo ""
echo " Slack reveal:"
echo "   User-paced: ▼ button per line, not timed"
echo "   'Mark as read' on final line → P0 badge appears"
echo ""
echo " Hypothesis:"
echo "   6 branches: marketing / iOS / price / checkout / seasonal / infra / generic"
echo "   Each challenges with a specific follow-up question"
echo "   Two-step: challenge → lock → Begin Investigation"
echo ""
echo " Phase 1:"
echo "   YoYChart: Mar/Apr 2025 now show real values (10.7%, 10.1%)"
echo "   S3 variance: synthesis sentence anchors to W25 for Phase 2"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
