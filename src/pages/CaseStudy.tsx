import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Phase unlock keyword (Ketan changes this weekly) ──────────
const PHASE2_KEYWORD = 'MMTDEEP1' // Change every Saturday after Session 1

// ── MakeMyTrip Business Context for AI ───────────────────────
const MMT_CONTEXT = `
You are an expert business analyst and case study mentor working with students on the MakeMyTrip Hotel Conversion Rate case study as part of the onestopcareers.in AI Problem Solving Lab run by Ketan Goel.

=== MAKEMYTRIP BUSINESS CONTEXT (Your knowledge base) ===

COMPANY OVERVIEW:
- India's largest online travel agency (OTA) with 55-60% market share
- FY2025: $9.8B gross bookings, $978M revenue, first full year of profitability
- 36.4 million monthly visitors across MakeMyTrip, Goibibo, and redBus brands
- Listed on NASDAQ (MMYT)

REVENUE MODEL:
MakeMyTrip earns revenue through take rates (commission) on every booking:
1. Hotels & Packages: 50%+ of total revenue ($490M FY24). Take rate: ~17-18% adjusted margin. This is the highest margin segment and the strategic priority.
2. Air Ticketing: ~26% of revenue ($201M FY24). Thin margins due to price transparency. Take rate capped by airlines.
3. Bus Ticketing (redBus): Fast growing, 70% of India's online intercity bus market. $33.5M Q4 FY25.
4. Corporate Travel (myBiz): ~30% of revenue, serving 59,000+ organisations.

KEY METRICS THAT MATTER:
- GMV (Gross Merchandise Value) / Gross Bookings: Total value of all bookings made
- Take Rate: Revenue as % of GMV. Hotels: ~18%, Air: ~6%
- Hotel Room Nights: Volume metric for hotel business. Grew 23.2% YoY in Q4 FY25
- Booking Conversion Rate: % of hotel search sessions that result in a confirmed booking
- Cancellation Rate: % of bookings that are cancelled (high in India due to free cancellation policies)
- Repeat Booking Rate: % of customers who book again within 12 months
- CAC (Customer Acquisition Cost): MMT spends $120M+/year on marketing
- RevPAR: Revenue per Available Room (hotel industry metric MMT uses for hotel partner negotiations)

COMPETITIVE LANDSCAPE:
- Booking.com: Global giant, strong in India for international hotels. 60% of Google sponsored hotel results
- MakeMyTrip/Goibibo: Dominant in domestic Indian travel. 52% of Google sponsored results
- Agoda/Expedia: Present but much weaker in India
- Yatra/ixigo/EaseMyTrip: Indian competitors but far smaller ($6-60M revenue vs MMT's $978M)
- Direct booking (hotel websites): Growing threat as hotels try to reduce OTA dependency

WHY HOTELS > FLIGHTS FOR MMT:
Hotels margin (18%) vs Air (6%) means every rupee shifted from air to hotel bookings is 3x more profitable. This is why MMT's entire product strategy is oriented toward hotel discovery and booking. The conversion rate problem in this case is therefore a P&L problem, not just a product problem.

CUSTOMER SEGMENTS:
1. Leisure travelers (60%): Price-sensitive, peak season (Oct-Mar), high cancellation tendency
2. Business travelers via myBiz (30%): Less price-sensitive, need flexibility, high repeat rate
3. International outbound (10%): Growing fast, higher AOV (Average Order Value)

FUNNEL STAGES (Hotel booking):
Homepage/App → Search (destination + dates) → Search Results Page (SRP) → Hotel Detail Page (HDP) → Room Selection → Payment → Confirmation

THE CASE STUDY PROBLEM:
MakeMyTrip's hotel booking conversion rate dropped from 3.2% to 2.7% (a 15.6% relative decline) over Q2-Q3 FY2025 despite:
- Overall traffic growing 18% YoY
- Hotel inventory expanding by 22% (added 8,000 new properties)
- Marketing spend increasing 15%

This is the problem students must diagnose and recommend solutions for.

RAW DATA AVAILABLE TO STUDENTS:
Dataset 1 - Funnel Data: Monthly drop-off rates at each funnel stage
Dataset 2 - Segment Data: Conversion by customer segment, device, city tier
Dataset 3 - Hotel Data: Conversion by hotel category, price band, rating
Dataset 4 - Time Data: Conversion by day of week, time of day, booking window
Dataset 5 - Review Data: Customer review themes and NPS scores by hotel tier

=== YOUR ROLE AND BOUNDARIES ===

YOU ARE: A thinking partner and domain expert. Your job is to help students develop their OWN analysis, not do the analysis for them.

PHASE 2 RULES (Metric Decomposition & Analysis):
- Answer questions about MakeMyTrip business context, metrics, and industry
- Help students understand what a metric means and why it matters
- Challenge their hypotheses with questions ("Have you considered X?", "What would you expect to see in the data if your hypothesis is true?")
- Point them toward the right dataset when they're stuck ("The funnel data might help you answer that")
- Give HINTS not ANSWERS. If they ask "why did conversion drop?" say "What does the funnel data tell you about WHERE the drop is happening?"
- Celebrate good thinking explicitly ("That's a sharp observation - most people miss that")

PHASE 3 RULES (Documentation & Articulation):
- Help students structure their findings into a clear narrative
- Review their draft recommendations and give feedback on clarity and logic
- Teach the "Situation-Complication-Question-Answer" (SCQA) framework for structuring insights
- Help them anticipate what Ketan will challenge in the final session

NEVER DO:
- Give the answer to what caused the conversion drop
- Write their analysis or report for them
- Confirm whether their final hypothesis is correct (that's Ketan's job in Session 2)
- Make up data that isn't in the provided datasets

TONE: Direct, intellectually challenging, warm. Like a brilliant senior colleague who genuinely wants them to figure it out themselves. Not a teacher lecturing — a thinking partner pushing.

When a student seems stuck, ask one sharp question rather than explaining everything. When they get something right, tell them specifically what was good about it.
`

// ── Raw Dataset ───────────────────────────────────────────────
const DATASETS = {
  funnel: {
    title: 'Dataset 1 — Funnel Drop-off Analysis',
    description: 'Monthly conversion rates at each stage of the hotel booking funnel',
    headers: ['Month', 'Search→SRP', 'SRP→HDP', 'HDP→Room Select', 'Room→Payment', 'Payment→Confirm', 'Overall Conv%'],
    rows: [
      ['Apr 2024', '72%', '38%', '52%', '71%', '94%', '3.2%'],
      ['May 2024', '71%', '37%', '51%', '70%', '94%', '3.1%'],
      ['Jun 2024', '70%', '36%', '50%', '69%', '93%', '3.0%'],
      ['Jul 2024', '68%', '33%', '49%', '68%', '93%', '2.8%'],
      ['Aug 2024', '67%', '31%', '48%', '68%', '93%', '2.7%'],
      ['Sep 2024', '67%', '30%', '48%', '67%', '92%', '2.7%'],
    ],
    insight_hint: 'Which stage shows the largest absolute drop? That is your primary investigation area.',
  },
  segment: {
    title: 'Dataset 2 — Conversion by Segment',
    description: 'Conversion rate breakdown by customer type, device, and city tier (Sep 2024 vs Apr 2024)',
    headers: ['Segment', 'Apr 2024 Conv%', 'Sep 2024 Conv%', 'Change', 'Traffic Share'],
    rows: [
      ['Mobile App', '3.4%', '2.9%', '-14.7%', '61%'],
      ['Mobile Web', '2.8%', '2.1%', '-25.0%', '24%'],
      ['Desktop', '3.9%', '3.7%', '-5.1%', '15%'],
      ['Metro cities (T1)', '3.8%', '3.4%', '-10.5%', '45%'],
      ['Tier 2 cities', '2.9%', '2.2%', '-24.1%', '38%'],
      ['Tier 3 cities', '2.1%', '1.6%', '-23.8%', '17%'],
      ['Leisure travelers', '2.9%', '2.3%', '-20.7%', '62%'],
      ['Business (myBiz)', '4.1%', '4.0%', '-2.4%', '28%'],
      ['International outbound', '3.6%', '3.5%', '-2.8%', '10%'],
    ],
    insight_hint: 'Where is the drop concentrated? What does that tell you about the root cause?',
  },
  hotel: {
    title: 'Dataset 3 — Conversion by Hotel Category',
    description: 'How conversion varies by hotel type and price point',
    headers: ['Category', 'Apr 2024 Conv%', 'Sep 2024 Conv%', 'Change', 'New Properties Added'],
    rows: [
      ['Budget (<₹1500/night)', '2.8%', '1.9%', '-32.1%', '4,200'],
      ['Mid-range (₹1500-4000)', '3.4%', '3.0%', '-11.8%', '2,800'],
      ['Premium (₹4000-8000)', '3.8%', '3.7%', '-2.6%', '800'],
      ['Luxury (>₹8000)', '4.2%', '4.1%', '-2.4%', '200'],
      ['Homestays/Villas', '2.1%', '1.4%', '-33.3%', '2,100'],
      ['Chain Hotels', '4.0%', '3.9%', '-2.5%', '0'],
    ],
    insight_hint: 'The pattern here is very specific. What type of hotel is driving the drop? What changed in that segment?',
  },
  timing: {
    title: 'Dataset 4 — Booking Window & Timing Analysis',
    description: 'Conversion by how far in advance the booking is made',
    headers: ['Booking Window', 'Apr 2024 Conv%', 'Sep 2024 Conv%', 'Change', 'Volume Share'],
    rows: [
      ['Same day', '5.1%', '5.0%', '-2.0%', '8%'],
      ['1-3 days', '4.2%', '4.0%', '-4.8%', '19%'],
      ['4-7 days', '3.6%', '3.2%', '-11.1%', '28%'],
      ['8-14 days', '3.1%', '2.4%', '-22.6%', '24%'],
      ['15-30 days', '2.4%', '1.6%', '-33.3%', '15%'],
      ['30+ days', '1.8%', '1.0%', '-44.4%', '6%'],
    ],
    insight_hint: 'What happens to conversion as the booking window increases? What could explain that pattern?',
  },
  reviews: {
    title: 'Dataset 5 — Customer Review & NPS Data',
    description: 'Top complaints from 1-3 star hotel reviews and NPS by segment (Q2-Q3 FY2025)',
    headers: ['Issue Category', 'Mention Frequency', 'Avg Hotel Rating', 'NPS Impact'],
    rows: [
      ['Inaccurate photos/listing', '34%', '2.8', '-42 NPS points'],
      ['Price higher than shown', '28%', '3.1', '-38 NPS points'],
      ['Amenities not as listed', '22%', '2.6', '-35 NPS points'],
      ['Location mismatch', '18%', '2.9', '-28 NPS points'],
      ['Poor customer support', '14%', '3.4', '-22 NPS points'],
      ['Cancellation issues', '11%', '3.2', '-18 NPS points'],
    ],
    insight_hint: 'Which of these issues connects to a specific hotel category in Dataset 3? That connection is key.',
  },
}

// ── AI Chat Component ─────────────────────────────────────────
function AIAssistant({ phase }: { phase: 2 | 3 }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: phase === 2
        ? "Hey — I'm here to help you work through the case, not to give you the answer. What are you looking at right now? Tell me your current hypothesis and I'll help you pressure-test it."
        : "Hey — you're in Phase 3 now. This is about turning your analysis into something Ketan can actually use on Saturday. What's your current structure for the final report? Walk me through it.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    const phaseContext = phase === 2
      ? 'The student is in Phase 2 — metric decomposition and analysis. They have access to all 5 datasets. Help them think, not think for them.'
      : 'The student is in Phase 3 — documenting and articulating findings. Help them structure their narrative and sharpen their recommendation.'

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY ?? '',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-allow-browser': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 600,
          system: MMT_CONTEXT + '\n\nCURRENT PHASE CONTEXT: ' + phaseContext,
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMsg },
          ],
        }),
      })
      const data = await response.json()
      const text = data.content?.[0]?.text ?? 'Something went wrong. Try again.'
      setMessages(prev => [...prev, { role: 'assistant', content: text }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error — check your connection and try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: 'var(--bg-elevated)', border: '1px solid rgba(168,85,247,0.2)',
      borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column',
      height: 480,
    }}>
      <div style={{
        padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'rgba(168,85,247,0.05)',
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%', background: '#4ade80',
          boxShadow: '0 0 6px #4ade80', animation: 'pulse-green 2s infinite',
        }} />
        <style>{'@keyframes pulse-green{0%,100%{opacity:1}50%{opacity:0.4}}'}</style>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, letterSpacing: '0.1em', color: 'var(--text-primary)' }}>
          CASE STUDY AI — {phase === 2 ? 'ANALYSIS PARTNER' : 'REPORT COACH'}
        </span>
        <span style={{ marginLeft: 'auto', fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '0.08em' }}>
          WILL GUIDE · WON'T ANSWER
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              maxWidth: '80%',
              background: m.role === 'user' ? 'var(--accent)' : 'var(--bg-base)',
              border: m.role === 'assistant' ? '1px solid var(--border-subtle)' : 'none',
              borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              padding: '12px 16px',
              fontFamily: 'DM Sans, sans-serif', fontSize: 14, lineHeight: 1.65,
              color: m.role === 'user' ? '#fff' : 'var(--text-secondary)',
              whiteSpace: 'pre-wrap',
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 6, padding: '8px 16px' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
                animation: `dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
            <style>{'@keyframes dot-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}'}</style>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 10 }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Ask about the business, share your hypothesis, or ask for a hint..."
          style={{
            flex: 1, background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
            borderRadius: 10, padding: '10px 14px', resize: 'none', height: 44,
            fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--text-primary)',
            outline: 'none', lineHeight: 1.5,
          }}
          disabled={loading}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            background: 'var(--accent)', border: 'none', borderRadius: 10,
            width: 44, height: 44, cursor: 'pointer', flexShrink: 0,
            opacity: loading || !input.trim() ? 0.4 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, color: '#fff',
          }}
        >
          ↑
        </button>
      </div>
    </div>
  )
}

// ── Dataset Table Component ───────────────────────────────────
function DataTable({ dataset }: { dataset: typeof DATASETS.funnel }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 14, overflow: 'hidden', marginBottom: 12 }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{dataset.title}</div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--text-tertiary)' }}>{dataset.description}</div>
        </div>
        <span style={{ color: 'var(--accent)', fontSize: 20, flexShrink: 0 }}>{expanded ? '−' : '+'}</span>
      </div>
      {expanded && (
        <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'rgba(168,85,247,0.06)' }}>
                  {dataset.headers.map((h, i) => (
                    <th key={i} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.08em', color: 'var(--accent)', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataset.rows.map((row, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--border-subtle)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{
                        padding: '10px 16px',
                        fontFamily: j === 0 ? 'DM Sans, sans-serif' : 'DM Mono, monospace',
                        fontSize: j === 0 ? 13 : 12,
                        color: cell.includes('-') && cell.includes('%') && j > 1 ? '#f87171' : 'var(--text-secondary)',
                        fontWeight: j === 0 ? 500 : 400,
                        whiteSpace: 'nowrap',
                      }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-subtle)', background: 'rgba(168,85,247,0.04)' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.1em', color: 'var(--accent)' }}>💡 HINT: </span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--text-tertiary)' }}>{dataset.insight_hint}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Phase Lock Component ──────────────────────────────────────
function PhaseLock({ onUnlock }: { onUnlock: () => void }) {
  const [keyword, setKeyword] = useState('')
  const [error, setError] = useState(false)

  function tryUnlock() {
    if (keyword.trim().toUpperCase() === PHASE2_KEYWORD) {
      sessionStorage.setItem('cs_unlocked', PHASE2_KEYWORD)
      onUnlock()
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
      borderRadius: 20, padding: '48px 40px', textAlign: 'center', maxWidth: 440, margin: '0 auto',
    }}>
      <div style={{ fontSize: 32, marginBottom: 20 }}>🔒</div>
      <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 24, color: 'var(--text-primary)', fontWeight: 400, marginBottom: 12 }}>
        Phase 2 is locked
      </h3>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
        Ketan will share the unlock keyword at the end of Saturday's Session 1. Enter it below to access Phase 2 and the AI Case Study Assistant.
      </p>
      <input
        type="text"
        placeholder="Enter keyword..."
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && tryUnlock()}
        style={{
          width: '100%', boxSizing: 'border-box',
          background: 'var(--bg-base)', border: `1px solid ${error ? '#f87171' : 'var(--border-subtle)'}`,
          borderRadius: 10, padding: '12px 16px', marginBottom: 12,
          fontFamily: 'DM Mono, monospace', fontSize: 14, color: 'var(--text-primary)',
          outline: 'none', textAlign: 'center', letterSpacing: '0.1em',
          transition: 'border-color 200ms',
        }}
        autoFocus
      />
      {error && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#f87171', marginBottom: 12 }}>Incorrect keyword. Try again or contact Ketan.</p>}
      <button
        onClick={tryUnlock}
        style={{
          width: '100%', background: 'var(--accent)', border: 'none', borderRadius: 100,
          padding: '13px', color: '#fff', fontFamily: 'DM Sans, sans-serif',
          fontSize: 15, fontWeight: 600, cursor: 'pointer',
        }}
      >
        Unlock Phase 2 →
      </button>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function CaseStudy() {
  const navigate = useNavigate()
  const [phase2Unlocked, setPhase2Unlocked] = useState(false)
  const [activeDataset, setActiveDataset] = useState<keyof typeof DATASETS | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const stored = sessionStorage.getItem('cs_unlocked')
    if (stored === PHASE2_KEYWORD) setPhase2Unlocked(true)
  }, [])

  const sectionStyle = (bg = 'var(--bg-base)'): React.CSSProperties => ({
    background: bg, borderTop: '1px solid var(--border-subtle)', padding: '72px 32px',
  })
  const innerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto' }
  const sectionLabel = (text: string) => (
    <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, letterSpacing: '0.16em', color: 'var(--accent)', marginBottom: 14 }}>{text}</p>
  )
  const sectionH2 = (text: string, sub?: string) => (
    <>
      <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: sub ? 10 : 28 }}>{text}</h2>
      {sub && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 32 }}>{sub}</p>}
    </>
  )

  return (
    <>
      <style>{`
        .cs-page { min-height: 100vh; background: var(--bg-base); }
        .cs-topbar { height: 60px; display: flex; align-items: center; padding: 0 32px; border-bottom: 1px solid var(--border-subtle); background: rgba(8,8,12,0.9); backdrop-filter: blur(14px); position: sticky; top: 0; z-index: 100; justify-content: space-between; }
        .cs-logo { font-family: 'DM Mono', monospace; font-size: 14px; letter-spacing: 0.1em; color: #fff; font-weight: 600; cursor: pointer; }
        .cs-logo span { background: linear-gradient(135deg, #FF6B9D, #A855F7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .cs-private-badge { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; color: var(--text-tertiary); background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 100px; padding: 5px 14px; }
        .cs-stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 28px 0; }
        .cs-stat { background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 18px 20px; }
        .cs-stat-val { font-family: 'Instrument Serif', serif; font-size: 28px; color: var(--accent); display: block; margin-bottom: 4px; }
        .cs-stat-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; color: var(--text-tertiary); }
        .cs-metric-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; }
        .cs-metric { background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 10px; padding: 14px 16px; }
        .cs-metric-name { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: 'var(--text-primary)'; margin-bottom: 4px; }
        .cs-metric-def { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--text-tertiary); line-height: 1.55; }
        .cs-problem-box { background: rgba(168,85,247,0.06); border: 1px solid rgba(168,85,247,0.2); border-radius: 16px; padding: 32px; margin: 28px 0; }
        .cs-problem-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.14em; color: var(--accent); margin-bottom: 14px; }
        .cs-problem-text { font-family: 'Instrument Serif', serif; font-size: clamp(18px, 2vw, 24px); color: var(--text-primary); line-height: 1.5; font-style: italic; }
        .cs-data-btn { background: none; border: 1px solid var(--border-subtle); border-radius: 8px; padding: 8px 14px; font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-secondary); cursor: pointer; transition: all 150ms; letter-spacing: 0.06em; }
        .cs-data-btn:hover, .cs-data-btn.active { border-color: var(--accent); color: var(--accent); background: rgba(168,85,247,0.06); }
        .cs-phase-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
        .cs-phase-num { font-family: 'Instrument Serif', serif; font-size: 48px; color: rgba(168,85,247,0.2); font-weight: 400; line-height: 1; }
        .cs-checklist { display: flex; flex-direction: column; gap: 10px; margin: 20px 0; }
        .cs-check { display: flex; align-items: flex-start; gap: 12px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--text-secondary); line-height: 1.6; }
        .cs-check-icon { flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); display: flex; align-items: center; justify-content: center; font-size: 11px; color: #4ade80; margin-top: 1px; }
        .cs-body-text { font-family: 'DM Sans', sans-serif; font-size: 15px; color: var(--text-secondary); line-height: 1.8; margin-bottom: 16px; }
        .cs-body-text strong { color: var(--text-primary); font-weight: 500; }
        .cs-callout { background: var(--bg-elevated); border-left: 3px solid var(--accent); border-radius: 0 12px 12px 0; padding: 16px 20px; margin: 20px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--text-secondary); line-height: 1.7; }
        .cs-wa-btn { display: inline-flex; align-items: center; gap: 10px; background: #25D366; border: none; border-radius: 100px; padding: 14px 28px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600; color: #fff; cursor: pointer; transition: all 200ms; text-decoration: none; }
        .cs-wa-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .cs-submit-checklist { display: flex; flex-direction: column; gap: 8px; margin: 24px 0; }
        .cs-submit-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--text-secondary); }
        .cs-submit-item::before { content: '□'; color: var(--accent); font-size: 16px; flex-shrink: 0; }
        @media (max-width: 768px) { .cs-stat-grid { grid-template-columns: 1fr 1fr; } .cs-metric-grid { grid-template-columns: 1fr; } }
        @media (max-width: 480px) { .cs-stat-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="cs-page">
        {/* Top bar */}
        <div className="cs-topbar">
          <span className="cs-logo" onClick={() => navigate('/')}>onestop<span>careers</span></span>
          <span className="cs-private-badge">🔒 PRIVATE — COHORT MEMBERS ONLY</span>
        </div>

        {/* ── SECTION 0: Access Banner ── */}
        <div style={{ background: 'rgba(168,85,247,0.08)', borderBottom: '1px solid rgba(168,85,247,0.15)', padding: '14px 32px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
            This page is private and shared exclusively with enrolled cohort members.
            Do not share this URL. · Questions? WhatsApp Ketan directly.
          </p>
        </div>

        {/* ── SECTION 1: Pre-Read — Business Context ── */}
        <div style={sectionStyle()}>
          <div style={innerStyle}>
            {sectionLabel('PRE-READ · READ BEFORE SATURDAY')}
            {sectionH2('Understanding MakeMyTrip', 'This is your business context for the case study. Read this before Saturday — the session starts where this ends, not from scratch.')}

            <p className="cs-body-text">
              MakeMyTrip is India's largest online travel agency (OTA) — essentially the Booking.com of India.
              It operates three consumer brands: <strong>MakeMyTrip</strong> (flagship), <strong>Goibibo</strong> (acquired 2017),
              and <strong>redBus</strong> (bus ticketing). Together they command <strong>55-60% of India's OTA market</strong>.
            </p>

            {/* Key stats */}
            <div className="cs-stat-grid">
              {[
                { val: '$9.8B', label: 'Gross Bookings FY2025' },
                { val: '$978M', label: 'Revenue FY2025' },
                { val: '36.4M', label: 'Monthly Visitors' },
                { val: '55-60%', label: 'India OTA Market Share' },
                { val: '18%', label: 'Hotels Adjusted Margin' },
                { val: '6%', label: 'Air Ticketing Margin' },
              ].map((s, i) => (
                <div key={i} className="cs-stat">
                  <span className="cs-stat-val">{s.val}</span>
                  <span className="cs-stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, fontWeight: 400, color: 'var(--text-primary)', margin: '32px 0 14px' }}>How MakeMyTrip makes money</h3>
            <p className="cs-body-text">
              MakeMyTrip earns a <strong>take rate</strong> (commission) on every booking made through its platform.
              Think of it like a marketplace: hotels and airlines list on MMT, customers book, and MMT keeps a percentage.
            </p>
            <p className="cs-body-text">
              <strong>Hotels & Packages (50%+ of revenue):</strong> ~18% adjusted margin. This is the most profitable segment
              and the strategic priority. Every ₹1 of hotel booking revenue is worth 3x a ₹1 of flight booking revenue.
            </p>
            <p className="cs-body-text">
              <strong>Air Ticketing (~26% of revenue):</strong> ~6% margin. Thin because flights are a commodity —
              every OTA shows the same prices, airlines cap commissions, and customers compare ruthlessly.
            </p>
            <p className="cs-body-text">
              <strong>Bus Ticketing / redBus (~14%):</strong> Fast growing. redBus has 70% of India's online intercity bus market.
            </p>
            <p className="cs-body-text">
              <strong>Corporate Travel / myBiz (~30% overall):</strong> Less price-sensitive, high repeat rate, serves 59,000+ organisations.
            </p>

            <div className="cs-callout">
              <strong>Why this matters for the case:</strong> Because hotels are the highest margin segment,
              a drop in hotel conversion rate directly impacts MMT's profitability — not just revenue.
              A 1% drop in hotel conversion rate costs significantly more in profit than a 1% drop in flight conversion.
            </div>

            <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, fontWeight: 400, color: 'var(--text-primary)', margin: '32px 0 14px' }}>The hotel booking funnel</h3>
            <p className="cs-body-text">Every hotel booking on MMT goes through this sequence:</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', margin: '16px 0 24px', fontFamily: 'DM Mono, monospace', fontSize: 12 }}>
              {['Homepage/App', 'Search', 'Results Page (SRP)', 'Hotel Detail Page (HDP)', 'Room Selection', 'Payment', 'Confirmation'].map((step, i, arr) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '5px 10px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{step}</span>
                  {i < arr.length - 1 && <span style={{ color: 'var(--accent)' }}>→</span>}
                </span>
              ))}
            </div>
            <p className="cs-body-text">
              <strong>Conversion rate</strong> = % of users who reach "Search" and complete a "Confirmation".
              Industry average for OTAs globally is 2-4%. MMT was at 3.2% — now it has dropped to 2.7%.
            </p>

            <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, fontWeight: 400, color: 'var(--text-primary)', margin: '32px 0 14px' }}>Key metrics glossary</h3>
            <div className="cs-metric-grid">
              {[
                { name: 'GMV / Gross Bookings', def: 'Total rupee value of all bookings made. MMT earns a % of this.' },
                { name: 'Take Rate', def: 'Revenue as % of GMV. Hotels: ~18%, Air: ~6%.' },
                { name: 'Conversion Rate', def: '% of hotel search sessions that end in a confirmed booking.' },
                { name: 'Cancellation Rate', def: '% of bookings that are later cancelled. High in India due to free cancellation.' },
                { name: 'RevPAR', def: 'Revenue Per Available Room. Hotel industry metric MMT uses with hotel partners.' },
                { name: 'CAC', def: 'Customer Acquisition Cost. MMT spends $120M+/year on marketing to acquire users.' },
                { name: 'Repeat Booking Rate', def: '% of customers who book again within 12 months. Key retention metric.' },
                { name: 'AOV', def: 'Average Order Value. Higher for international bookings vs domestic budget hotels.' },
              ].map((m, i) => (
                <div key={i} className="cs-metric">
                  <div className="cs-metric-name" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{m.name}</div>
                  <div className="cs-metric-def">{m.def}</div>
                </div>
              ))}
            </div>

            <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, fontWeight: 400, color: 'var(--text-primary)', margin: '32px 0 14px' }}>Competitive landscape</h3>
            <p className="cs-body-text">
              <strong>Booking.com:</strong> Global giant, strongest in India for international hotels. Outbids MMT on Google paid search. 60% of sponsored hotel results.
            </p>
            <p className="cs-body-text">
              <strong>MakeMyTrip/Goibibo:</strong> Dominant in domestic Indian travel. 52% of Google sponsored results. Strongest brand recall.
            </p>
            <p className="cs-body-text">
              <strong>Yatra / ixigo / EaseMyTrip:</strong> Indian competitors but dramatically smaller — Yatra at $6M revenue vs MMT's $978M. Not a real competitive threat yet.
            </p>
            <p className="cs-body-text">
              <strong>Direct booking (hotel websites):</strong> Growing threat as large hotels try to reduce OTA commissions. Accor, Marriott actively incentivise direct booking with loyalty points.
            </p>
          </div>
        </div>

        {/* ── SECTION 2: Problem Statement ── */}
        <div style={sectionStyle('var(--bg-surface)')}>
          <div style={innerStyle}>
            {sectionLabel('THE CASE STUDY PROBLEM')}
            {sectionH2('What you are being asked to solve')}
            <div className="cs-problem-box">
              <div className="cs-problem-label">PROBLEM STATEMENT</div>
              <p className="cs-problem-text">
                "MakeMyTrip's hotel booking conversion rate dropped from 3.2% to 2.7% over Q2-Q3 FY2025
                — a 15.6% relative decline — despite overall traffic growing 18% YoY, hotel inventory
                expanding by 22% (8,000 new properties added), and marketing spend increasing 15%.
                Diagnose the root cause and recommend what the product and business team should prioritise."
              </p>
            </div>

            <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, fontWeight: 400, color: 'var(--text-primary)', margin: '28px 0 12px' }}>Why this is a hard problem</h3>
            <p className="cs-body-text">
              Traffic is up. Inventory is up. Marketing is up. By every input metric, things are improving.
              Yet conversion is falling. <strong>This means the cause is not about volume — it is about something
              that changed in the quality of the experience or the quality of the supply.</strong>
            </p>
            <p className="cs-body-text">
              Your job is not to list possible reasons. Your job is to identify the single most likely root cause,
              support it with the data provided, and make a specific recommendation.
            </p>

            <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, fontWeight: 400, color: 'var(--text-primary)', margin: '28px 0 12px' }}>The data you will work with</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {(Object.keys(DATASETS) as (keyof typeof DATASETS)[]).map(key => (
                <button
                  key={key}
                  className={`cs-data-btn${activeDataset === key ? ' active' : ''}`}
                  onClick={() => setActiveDataset(activeDataset === key ? null : key)}
                >
                  {DATASETS[key].title.split('—')[0].trim()}
                </button>
              ))}
            </div>
            {activeDataset && <DataTable dataset={DATASETS[activeDataset]} />}

            <div className="cs-callout" style={{ marginTop: 24 }}>
              <strong>Note:</strong> This is structured synthetic data built to mirror real MMT business patterns.
              The patterns, ratios, and segment splits reflect actual OTA industry benchmarks. Use it exactly as you would real data.
            </div>
          </div>
        </div>

        {/* ── SECTION 3: Phase 1 — Kickstart ── */}
        <div style={sectionStyle()}>
          <div style={innerStyle}>
            <div className="cs-phase-header">
              <span className="cs-phase-num">01</span>
              <div>
                {sectionLabel('PHASE 1 · SATURDAY SESSION · 1.5 HOURS')}
                <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, fontWeight: 400, color: 'var(--text-primary)', margin: 0 }}>Kickstart with Ketan</h2>
              </div>
            </div>

            <p className="cs-body-text">
              On Saturday, Ketan will walk through the problem statement live, apply the 8-step framework
              to this specific case, and help the group surface the right questions to investigate.
              <strong> You do not need to have answers before Saturday — you need to have read the pre-read above.</strong>
            </p>

            <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, fontWeight: 400, color: 'var(--text-primary)', margin: '24px 0 12px' }}>What will happen in Session 1</h3>
            <div className="cs-checklist">
              {[
                'Ketan introduces the 8-step framework applied to THIS case (not generic theory)',
                'Group looks at the funnel data together — Ketan asks: "Where is the drop?" ',
                'Group generates initial hypotheses — Ketan challenges each one',
                'Ketan demonstrates how to use AI as a thinking partner, not an answer machine',
                'By end of session: 2-3 prioritised hypotheses the group agrees to investigate',
                'Ketan shares the Phase 2 unlock keyword',
              ].map((item, i) => (
                <div key={i} className="cs-check">
                  <div className="cs-check-icon">✓</div>
                  {item}
                </div>
              ))}
            </div>

            <div className="cs-callout">
              <strong>What to bring to Saturday:</strong> Have read the pre-read. Have looked at Dataset 1 (funnel data).
              Come with at least one hypothesis — even if you're not sure it's right.
              The session works better when everyone has a view to defend.
            </div>
          </div>
        </div>

        {/* ── SECTION 4: Phase 2 — Deep Dive (LOCKED) ── */}
        <div style={sectionStyle('var(--bg-surface)')}>
          <div style={innerStyle}>
            <div className="cs-phase-header">
              <span className="cs-phase-num">02</span>
              <div>
                {sectionLabel('PHASE 2 · INDEPENDENT WORK · UNLOCKS AFTER SESSION 1')}
                <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, fontWeight: 400, color: 'var(--text-primary)', margin: 0 }}>Deep Dive & Analysis</h2>
              </div>
            </div>

            {!phase2Unlocked ? (
              <PhaseLock onUnlock={() => setPhase2Unlocked(true)} />
            ) : (
              <>
                <p className="cs-body-text">
                  Phase 2 is where the real work happens. You have the datasets, you have the AI assistant,
                  and you have the hypotheses from Session 1. Your job is to go deep on the data,
                  prove or disprove your hypotheses, and arrive at a single root cause with evidence.
                </p>

                <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, fontWeight: 400, color: 'var(--text-primary)', margin: '24px 0 16px' }}>Your investigation framework</h3>
                <div className="cs-checklist">
                  {[
                    { label: 'Step 1 — Locate the drop in the funnel', detail: 'Which stage has the largest absolute drop? That stage is your primary investigation area.' },
                    { label: 'Step 2 — Segment the drop', detail: 'Is the drop uniform across all segments or concentrated? Use Datasets 2 and 3 to find the pattern.' },
                    { label: 'Step 3 — Form a root cause hypothesis', detail: 'Based on what you find in Step 2, what single explanation best fits ALL the data patterns?' },
                    { label: 'Step 4 — Find corroborating evidence', detail: 'Does Dataset 5 (reviews) support your hypothesis? Does Dataset 4 (timing) add context?' },
                    { label: 'Step 5 — Quantify the impact', detail: 'How much of the 0.5pp conversion drop can your hypothesis explain? Size matters.' },
                    { label: 'Step 6 — Form a recommendation', detail: 'Not "investigate further." A specific action with an expected outcome and a success metric.' },
                  ].map((item, i) => (
                    <div key={i} className="cs-check" style={{ flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <div className="cs-check-icon" style={{ marginTop: 0 }}>→</div>
                        <strong style={{ color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}>{item.label}</strong>
                      </div>
                      <p style={{ margin: '0 0 0 32px', fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.6 }}>{item.detail}</p>
                    </div>
                  ))}
                </div>

                <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, fontWeight: 400, color: 'var(--text-primary)', margin: '32px 0 16px' }}>All datasets — explore here</h3>
                {(Object.keys(DATASETS) as (keyof typeof DATASETS)[]).map(key => (
                  <DataTable key={key} dataset={DATASETS[key]} />
                ))}

                <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, fontWeight: 400, color: 'var(--text-primary)', margin: '32px 0 16px' }}>AI Case Study Assistant</h3>
                <p className="cs-body-text">
                  Use the AI to ask about MakeMyTrip business context, pressure-test your hypotheses,
                  or get a hint when you're stuck. <strong>It will not tell you the answer.</strong> It will
                  help you think better.
                </p>
                <AIAssistant phase={2} />
              </>
            )}
          </div>
        </div>

        {/* ── SECTION 5: Phase 3 — Final Report (LOCKED) ── */}
        <div style={sectionStyle()}>
          <div style={innerStyle}>
            <div className="cs-phase-header">
              <span className="cs-phase-num">03</span>
              <div>
                {sectionLabel('PHASE 3 · BEFORE NEXT SATURDAY · UNLOCKS WITH PHASE 2')}
                <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, fontWeight: 400, color: 'var(--text-primary)', margin: 0 }}>Final Report & Submission</h2>
              </div>
            </div>

            {!phase2Unlocked ? (
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                Unlocks together with Phase 2 after Session 1.
              </p>
            ) : (
              <>
                <p className="cs-body-text">
                  Phase 3 is about turning your analysis into a clear, structured output that Ketan
                  can evaluate on Saturday. <strong>This is the skill that separates professionals who
                  find insights from those who can communicate them to decision-makers.</strong>
                </p>

                <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, fontWeight: 400, color: 'var(--text-primary)', margin: '24px 0 14px' }}>The SCQA framework for your report</h3>
                <p className="cs-body-text">Every strong business document follows this structure:</p>
                {[
                  { label: 'S — Situation', desc: 'What is the context? (MMT hotel conversion dropped 15.6% despite growing traffic and inventory)' },
                  { label: 'C — Complication', desc: 'Why is the situation a problem? (Hotels are MMT\'s highest-margin segment. This is a P&L problem, not just a product metric)' },
                  { label: 'Q — Question', desc: 'What is the precise question we\'re answering? (What caused the drop and what should we prioritise to fix it?)' },
                  { label: 'A — Answer', desc: 'Your recommendation, stated first. Evidence second. (Not "we need to investigate" — a specific action with expected impact)' },
                ].map((item, i) => (
                  <div key={i} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '14px 18px', marginBottom: 8 }}>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: 6 }}>{item.label}</div>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{item.desc}</div>
                  </div>
                ))}

                <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, fontWeight: 400, color: 'var(--text-primary)', margin: '28px 0 14px' }}>Submission checklist</h3>
                <p className="cs-body-text">Your report must include all of the following before you submit:</p>
                <div className="cs-submit-checklist">
                  {[
                    'The funnel stage where the drop is concentrated — with data to support it',
                    'The segment(s) most affected — showing why the drop is not uniform',
                    'Your single root cause hypothesis — one clear statement, not a list',
                    'Evidence from at least 2 datasets that supports your hypothesis',
                    'One piece of evidence from Dataset 5 (reviews) that corroborates or challenges your hypothesis',
                    'A specific recommendation with an expected impact and a success metric',
                    'One risk or assumption in your recommendation that you acknowledge',
                  ].map((item, i) => (
                    <div key={i} className="cs-submit-item">{item}</div>
                  ))}
                </div>

                <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, fontWeight: 400, color: 'var(--text-primary)', margin: '28px 0 16px' }}>AI Report Coach</h3>
                <p className="cs-body-text">
                  Use the AI to review your draft, check your SCQA structure, or sharpen your recommendation.
                </p>
                <AIAssistant phase={3} />

                <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, fontWeight: 400, color: 'var(--text-primary)', margin: '32px 0 14px' }}>How to submit</h3>
                <p className="cs-body-text">
                  Send your report on WhatsApp before 6pm on Friday. Format: PDF or Google Doc link.
                  Ketan will review all submissions before Saturday's evaluation session.
                </p>
                <a
                  href="https://wa.me/919XXXXXXXXX?text=Hi%20Ketan%2C%20here%20is%20my%20MakeMyTrip%20case%20study%20report%3A%20"
                  className="cs-wa-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📱 Submit via WhatsApp →
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
