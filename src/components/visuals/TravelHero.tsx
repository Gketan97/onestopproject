import { useEffect, useRef, useState } from 'react'
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
