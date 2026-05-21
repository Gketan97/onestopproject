import { useState, useRef, useEffect } from 'react'

interface PreReadProps {
  onComplete: () => void
}

const PAGES = [
  {
    num: '01',
    tab: 'Business Overview',
    title: 'What PlanMyTrip is and how it makes money',
    type: 'overview',
    sections: [
      {
        heading: null,
        body: `PlanMyTrip.com is an Online Travel Agency — a marketplace that connects travellers with flights, hotels, and bus tickets. It does not own aircraft or rooms. It earns a commission on every booking made through its platform.`,
      },
      {
        heading: 'Customers',
        body: null,
        cards: [
          { label: 'Leisure travellers', text: 'Book holidays, weekend trips, family travel. Highly price-sensitive. Book 3–6 weeks in advance. Higher cancellation rate when plans change.' },
          { label: 'Business travellers', text: 'Use the CorporateDesk portal. Less price-sensitive, need flexibility. High repeat frequency. Valuable long-term but smaller in volume.' },
          { label: 'Budget travellers', text: 'First-time fliers from tier 2/3 cities. App-first users. Very price-driven. Respond strongly to discounts. Lower repeat rate.' },
        ],
      },
      {
        heading: 'Revenue model',
        body: `PlanMyTrip earns a take rate — a percentage of each booking's value — paid by the travel supplier. Take rates vary sharply by product:`,
        table: {
          headers: ['Product', 'Take Rate', 'What this means'],
          rows: [
            ['Hotels & Packages', '~16%', 'Highest margin. Strategic priority for the business.'],
            ['Air Ticketing', '~5%', 'Thin margin. Airlines cap commissions tightly. High volume offsets.'],
            ['Bus (RideConnect)', '~9%', 'Growing segment. High repeat frequency.'],
          ],
        },
        note: 'A ₹10,000 hotel booking generates roughly 3× the revenue of a ₹10,000 flight booking. This shapes every resource allocation decision at PlanMyTrip.',
      },
      {
        heading: 'Competitive landscape',
        body: `TripEase leads the market at ~47% share. PlanMyTrip holds ~42%. On flights, all OTAs show the same airline prices — competition is entirely on user experience, trust, loyalty, and deals. On hotels, inventory quality and reviews matter significantly. When TripEase runs a cashback campaign, PlanMyTrip must respond or accept volume loss.`,
      },
      {
        heading: 'Characteristics of OTA businesses',
        body: null,
        pills: [
          'Does not control the underlying product (flights, rooms)',
          'Revenue tied to booking volume × take rate',
          'Price transparency makes switching frictionless',
          'Trust and reliability drive repeat usage',
          'Discounts drive short-term volume but erode margins',
          'Mobile-first — 70%+ of traffic from apps',
        ],
      },
    ],
  },
  {
    num: '02',
    tab: 'Booking Journey',
    title: 'From search to seat — what actually happens',
    type: 'journey',
    intro: 'Every booking follows the same six-stage sequence. Understanding each stage — what the user does, what the system does, and what can fail — is foundational for anyone working on this business.',
    steps: [
      {
        n: '01', stage: 'Search',
        user: 'Opens app, enters origin, destination, travel date, and passenger count.',
        system: 'Queries live airline inventory via GDS (Global Distribution System) APIs. Returns ranked results.',
        dep: 'GDS uptime and response speed. Slow search results cause immediate drop-off. Live inventory means prices can change between query and display.',
      },
      {
        n: '02', stage: 'Compare',
        user: 'Browses results — comparing prices, airlines, departure times, stops, baggage.',
        system: 'Serves a mix of cached and real-time prices. Applies ranking logic.',
        dep: 'Price accuracy. If a user sees ₹4,200 in results and ₹4,900 at checkout, they abandon. Price consistency across the funnel is critical.',
      },
      {
        n: '03', stage: 'Select',
        user: 'Clicks a specific flight to view full details — fare rules, change/cancellation policy, baggage allowance.',
        system: 'Re-verifies price against live inventory before display.',
        dep: 'Price parity between results and detail page. Any mismatch causes immediate abandonment.',
      },
      {
        n: '04', stage: 'Checkout',
        user: 'Fills in passenger details, selects optional add-ons (seat, meal, insurance), applies coupon.',
        system: 'Holds a temporary fare lock on the selected flight (8–12 minutes). Validates coupon.',
        dep: 'Fare lock expiry. If it expires, price may increase. Coupon failures at this stage cause significant abandonment — users arrived specifically for a discount.',
      },
      {
        n: '05', stage: 'Payment',
        user: 'Selects payment method (UPI, card, net banking, wallet) and completes transaction.',
        system: 'Routes payment through a third-party gateway. Gateway communicates with user\'s bank.',
        dep: 'Payment gateway reliability and bank approval rates. UPI timeouts are the source of "money deducted but booking not confirmed" — the highest-severity support issue.',
      },
      {
        n: '06', stage: 'Confirmation',
        user: 'Receives booking confirmation, PNR number, and e-ticket via SMS and email.',
        system: 'Confirms booking with airline, issues ticket, sends confirmation to user.',
        dep: 'Airline API confirmation. If this call fails after payment succeeds, the customer has paid but has no ticket. Requires manual resolution.',
      },
    ],
  },
  {
    num: '03',
    tab: 'Key Metrics',
    title: 'What PlanMyTrip measures and why',
    type: 'metrics',
    intro: 'Every team at PlanMyTrip tracks a set of metrics. These are the ones that matter most. For each: what it measures, and why the business cares. Not how to analyse it.',
    metrics: [
      { name: 'Conversion Rate', def: 'The percentage of users who complete a paid booking out of all users who searched for flights in the same period.', why: 'The primary health metric for the flight business. Reflects the combined quality of product, pricing, traffic, and payment. A 1% drop at PlanMyTrip\'s scale means thousands of lost bookings per week.' },
      { name: 'Gross Merchandise Value (GMV)', def: 'The total rupee value of all bookings processed through PlanMyTrip — before commissions, discounts, or costs.', why: 'Measures the raw scale of the marketplace. GMV can grow even while profitability falls, so it is never used in isolation.' },
      { name: 'Take Rate', def: 'The revenue PlanMyTrip actually earns as a percentage of GMV. Varies by product category.', why: 'Bridges GMV to revenue. A business that shifts mix from hotels (16%) to flights (5%) can grow GMV while revenue declines.' },
      { name: 'Customer Acquisition Cost (CAC)', def: 'Total marketing and sales spend divided by the number of new paying customers acquired in the same period.', why: 'Measures how efficiently the business is growing. Rising CAC without a corresponding rise in customer lifetime value signals an unsustainable growth model.' },
      { name: 'Retention / Repeat Booking Rate', def: 'The percentage of customers who make a second booking within a defined window — typically 60 or 90 days after their first booking.', why: 'Repeat customers have zero acquisition cost. A business that acquires many customers but retains few is burning money.' },
      { name: 'Cancellation Rate', def: 'The percentage of confirmed bookings that are subsequently cancelled by the user.', why: 'Cancellations cost money — refund processing, airline fees, support load. A high cancellation rate on a cohort often signals those users had low intent when they booked.' },
      { name: 'Contribution Margin', def: 'Revenue minus the variable costs directly tied to each booking — discounts applied, payment fees, customer support costs.', why: 'The CFO\'s preferred metric. A booking that looks good on GMV may be loss-making once discounts and variable costs are factored in.' },
      { name: 'Net Promoter Score (NPS)', def: 'A measure of how likely customers are to recommend PlanMyTrip. Scored -100 to +100.', why: 'A lagging indicator of trust and experience quality. Drops follow product or payment failures — but take weeks to surface.' },
    ],
  },
  {
    num: '04',
    tab: 'Realities & Teams',
    title: 'How the business operates under real conditions',
    type: 'realities',
    intro: 'Understanding a business on paper is different from understanding how it operates day-to-day. These are the pressures, constraints, and team dynamics that shape every decision PlanMyTrip makes.',
    realities: [
      { label: 'Price sensitivity', text: 'Indian flight travellers are acutely price-sensitive. A ₹200 difference is enough to switch platforms. OTAs cannot afford to be consistently more expensive than competitors on high-volume routes.' },
      { label: 'Discounts & competition', text: 'When a competitor runs a cashback campaign, volumes drop immediately. Matching discounts attracts users optimising for the deal, not the platform — they cancel more, repeat less, and cost more in support.' },
      { label: 'Seasonality', text: 'October–March is peak. July–September (monsoon) is the weakest quarter. Comparing metrics across seasons without adjustment produces misleading conclusions.' },
      { label: 'Airline pricing & availability', text: 'Airlines change fares and availability in real time. OTAs do not control this. A sudden fare surge on a key route affects all OTAs simultaneously — it is not a product problem.' },
      { label: 'Mobile acquisition dynamics', text: 'App install campaigns drive large user volumes — but these users differ significantly from organic users. They have lower booking intent, browse more without committing, and convert at lower rates.' },
      { label: 'Customer trust', text: 'Payment failures and poor refund experiences destroy trust quickly. Once a customer has a bad experience, they rarely return. Trust takes years to build and minutes to lose.' },
    ],
    teams: [
      { name: 'Growth & Marketing', focus: 'Acquiring users at lowest cost per install or per booking. Watches channel CAC and weekly booking counts.', tension: 'May prioritise volume over quality. A high-install, low-conversion campaign looks good on marketing dashboards but bad on contribution margin.' },
      { name: 'Product', focus: 'Improving funnel conversion through UX, features, and A/B experiments. Owns the booking flow end-to-end.', tension: 'Quick to attribute problems to UX or recent experiments. May underweight external causes like competitive pricing or traffic quality shifts.' },
      { name: 'Analytics', focus: 'Diagnosing what is happening and why. Works across all teams. Owns data definitions and experiment validity.', tension: 'Often deprioritised in fast business reviews. Needs time to investigate properly — but leadership wants immediate answers.' },
      { name: 'Finance', focus: 'Contribution margin, discount burn, and unit economics per booking.', tension: 'Correct on the financial diagnosis. Does not always have the product context to recommend the right operational fix.' },
      { name: 'Customer Support', focus: 'Resolving post-booking issues — payment failures, cancellations, refunds.', tension: 'Closest to the customer\'s experience but furthest from the root cause. Contact volume spikes are symptoms, not causes.' },
    ],
  },
]

export default function PreRead({ onComplete }: PreReadProps) {
  const [cur, setCur] = useState(0)
  const [unlocked, setUnlocked] = useState([0])
  const [scrollPct, setScrollPct] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const canContinue = scrollPct >= 65 || unlocked.includes(cur + 1)
  const isLast = cur === PAGES.length - 1

  // Track scroll progress
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handler = () => {
      const max = el.scrollHeight - el.clientHeight
      setScrollPct(max > 0 ? Math.min(100, Math.round((el.scrollTop / max) * 100)) : 100)
    }
    el.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => el.removeEventListener('scroll', handler)
  }, [cur])

  // Reset scroll on page change
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
    setScrollPct(0)
  }, [cur])

  function navigate(to: number) {
    if (!unlocked.includes(to) || leaving) return
    setLeaving(true)
    setTimeout(() => { setCur(to); setLeaving(false) }, 200)
  }

  function handleContinue() {
    if (isLast) { onComplete(); return }
    const next = cur + 1
    if (!unlocked.includes(next)) setUnlocked(u => [...u, next])
    navigate(next)
  }

  const page = PAGES[cur]
  const globalPct = Math.round(((cur + scrollPct / 100) / PAGES.length) * 100)

  return (
    <>
      <style>{`
        .pr-shell { display:flex; flex-direction:column; height:100vh; height:100dvh; background:var(--bg-base); overflow:hidden; }

        /* topbar */
        .pr-top { height:58px; display:flex; align-items:center; justify-content:space-between; padding:0 40px; border-bottom:1px solid var(--border-subtle); background:rgba(8,8,12,0.92); backdrop-filter:blur(12px); flex-shrink:0; z-index:10; position:relative; }
        .pr-wm { font-family:'DM Mono',monospace; font-size:13px; font-weight:600; letter-spacing:0.1em; color:#fff; }
        .pr-wm em { font-style:normal; background:linear-gradient(135deg,#FF6B9D,#A855F7); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .pr-badge { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:0.1em; color:var(--accent); background:rgba(168,85,247,0.08); border:1px solid rgba(168,85,247,0.18); border-radius:100px; padding:4px 14px; }

        /* progress */
        .pr-prog { height:2px; background:var(--border-subtle); flex-shrink:0; }
        .pr-prog-fill { height:100%; background:linear-gradient(90deg,var(--accent),#FF6B9D); transition:width 500ms cubic-bezier(.4,0,.2,1); }

        /* tabs */
        .pr-tabs { display:flex; border-bottom:1px solid var(--border-subtle); flex-shrink:0; overflow-x:auto; scrollbar-width:none; }
        .pr-tabs::-webkit-scrollbar { display:none; }
        .pr-tab { display:flex; align-items:center; gap:9px; height:46px; padding:0 26px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; border:none; background:none; cursor:pointer; border-bottom:2px solid transparent; transition:all 180ms; white-space:nowrap; flex-shrink:0; color:var(--text-tertiary); }
        .pr-tab.active { color:var(--text-primary); border-bottom-color:var(--accent); }
        .pr-tab.done { color:var(--text-secondary); }
        .pr-tab.locked { cursor:not-allowed; opacity:0.3; }
        .pr-tab-n { font-family:'DM Mono',monospace; font-size:10px; color:var(--accent); }
        .pr-tab-chk { color:#4ade80; font-size:11px; opacity:0; transition:opacity 200ms; }
        .pr-tab.done .pr-tab-chk { opacity:1; }

        /* body */
        .pr-body { display:flex; flex:1; overflow:hidden; }

        /* sidebar */
        .pr-side { width:210px; flex-shrink:0; border-right:1px solid var(--border-subtle); padding:28px 18px; display:flex; flex-direction:column; gap:4px; overflow-y:auto; }
        .pr-side-ttl { font-family:'DM Mono',monospace; font-size:9px; letter-spacing:0.16em; color:var(--text-tertiary); margin-bottom:10px; }
        .pr-side-item { font-family:'DM Sans',sans-serif; font-size:12px; color:var(--text-tertiary); padding:6px 10px; border-radius:6px; transition:all 140ms; border:1px solid transparent; cursor:default; line-height:1.4; }
        .pr-side-spacer { flex:1; }
        .pr-side-prog { padding-top:18px; border-top:1px solid var(--border-subtle); }
        .pr-side-pl { font-family:'DM Mono',monospace; font-size:9px; letter-spacing:0.1em; color:var(--text-tertiary); margin-bottom:7px; }
        .pr-side-bar { height:2px; background:var(--border-subtle); border-radius:2px; margin-bottom:5px; overflow:hidden; }
        .pr-side-fill { height:100%; background:var(--accent); transition:width 400ms ease; border-radius:2px; }
        .pr-side-hint { font-family:'DM Mono',monospace; font-size:9px; color:var(--text-tertiary); letter-spacing:0.04em; }

        /* scroll area */
        .pr-scroll { flex:1; overflow-y:auto; padding:44px 60px 120px; transition:opacity 200ms, transform 200ms; }
        .pr-scroll.leaving { opacity:0; transform:translateX(-18px); }
        .pr-inner { max-width:640px; }

        /* typography */
        .pr-eyebrow { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:0.16em; color:var(--accent); margin-bottom:10px; }
        .pr-h1 { font-family:'Instrument Serif',serif; font-size:clamp(22px,2.5vw,32px); font-weight:400; line-height:1.2; color:var(--text-primary); margin-bottom:28px; }
        .pr-intro { font-size:15px; color:var(--text-secondary); line-height:1.85; margin-bottom:28px; padding-left:14px; border-left:2px solid rgba(168,85,247,0.35); }
        .pr-sec { margin-bottom:28px; }
        .pr-sec-hd { font-size:11px; font-weight:700; letter-spacing:0.1em; color:var(--text-primary); text-transform:uppercase; margin-bottom:12px; display:flex; align-items:center; gap:10px; }
        .pr-sec-hd::after { content:''; flex:1; height:1px; background:var(--border-subtle); }
        .pr-body-txt { font-size:14px; color:var(--text-secondary); line-height:1.85; margin-bottom:12px; }

        /* cards */
        .pr-cards { display:flex; flex-direction:column; gap:7px; }
        .pr-card { background:var(--bg-elevated); border:1px solid var(--border-subtle); border-radius:10px; padding:14px 16px; transition:border-color 140ms; }
        .pr-card:hover { border-color:rgba(168,85,247,0.2); }
        .pr-card-lbl { font-size:13px; font-weight:600; color:var(--text-primary); margin-bottom:4px; }
        .pr-card-txt { font-size:13px; color:var(--text-secondary); line-height:1.6; }

        /* table */
        .pr-tbl { width:100%; border-collapse:collapse; margin-bottom:12px; border-radius:10px; overflow:hidden; border:1px solid var(--border-subtle); }
        .pr-tbl th { padding:9px 14px; text-align:left; font-family:'DM Mono',monospace; font-size:9px; letter-spacing:0.12em; color:var(--accent); background:rgba(168,85,247,0.06); font-weight:500; }
        .pr-tbl td { padding:10px 14px; font-size:13px; color:var(--text-secondary); border-top:1px solid var(--border-subtle); line-height:1.5; vertical-align:top; }
        .pr-tbl td:first-child { font-weight:600; color:var(--text-primary); white-space:nowrap; }
        .pr-note { background:rgba(168,85,247,0.05); border:1px solid rgba(168,85,247,0.13); border-radius:8px; padding:12px 14px; font-size:13px; color:var(--text-secondary); line-height:1.7; }

        /* pills */
        .pr-pills { display:flex; flex-wrap:wrap; gap:6px; }
        .pr-pill { font-size:12px; color:var(--text-secondary); background:var(--bg-elevated); border:1px solid var(--border-subtle); border-radius:100px; padding:5px 12px; line-height:1; }

        /* journey */
        .pr-journey { display:flex; flex-direction:column; }
        .pr-jstep { display:grid; grid-template-columns:44px 1fr; padding:18px 0; border-bottom:1px solid var(--border-subtle); gap:0 14px; }
        .pr-jstep:last-child { border-bottom:none; }
        .pr-jleft { display:flex; flex-direction:column; align-items:center; }
        .pr-jdot { width:32px; height:32px; border-radius:50%; background:rgba(168,85,247,0.1); border:1px solid rgba(168,85,247,0.22); display:flex; align-items:center; justify-content:center; font-family:'DM Mono',monospace; font-size:10px; font-weight:600; color:var(--accent); flex-shrink:0; margin-bottom:5px; }
        .pr-jline { width:1px; flex:1; background:var(--border-subtle); min-height:10px; }
        .pr-jname { font-size:14px; font-weight:700; color:var(--text-primary); margin-bottom:10px; }
        .pr-jrow { margin-bottom:7px; }
        .pr-jrow-lbl { font-family:'DM Mono',monospace; font-size:9px; letter-spacing:0.12em; color:var(--text-tertiary); margin-bottom:2px; }
        .pr-jrow-txt { font-size:13px; color:var(--text-secondary); line-height:1.6; }
        .pr-jdep { font-size:12px; color:#fbbf24; background:rgba(251,191,36,0.06); border:1px solid rgba(251,191,36,0.14); border-radius:7px; padding:8px 11px; margin-top:8px; line-height:1.55; }

        /* metrics */
        .pr-metrics { display:flex; flex-direction:column; }
        .pr-metric { padding:16px 0; border-bottom:1px solid var(--border-subtle); }
        .pr-metric:last-child { border-bottom:none; }
        .pr-metric-nm { font-size:14px; font-weight:700; color:var(--text-primary); margin-bottom:4px; }
        .pr-metric-df { font-size:13px; color:var(--text-secondary); line-height:1.65; margin-bottom:6px; }
        .pr-metric-wh { font-size:12px; color:var(--text-tertiary); line-height:1.6; padding-left:11px; border-left:2px solid var(--border-subtle); }

        /* realities */
        .pr-r-items { display:flex; flex-direction:column; gap:7px; margin-bottom:6px; }
        .pr-r-item { background:var(--bg-elevated); border:1px solid var(--border-subtle); border-radius:10px; padding:13px 16px; }
        .pr-r-lbl { font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:3px; }
        .pr-r-txt { font-size:13px; color:var(--text-secondary); line-height:1.6; }
        .pr-team { background:var(--bg-elevated); border:1px solid var(--border-subtle); border-radius:10px; padding:14px 16px; margin-bottom:7px; }
        .pr-team-nm { font-size:13px; font-weight:700; color:var(--text-primary); margin-bottom:4px; }
        .pr-team-fc { font-size:13px; color:var(--text-secondary); line-height:1.6; margin-bottom:7px; }
        .pr-team-tn { font-size:12px; color:var(--text-tertiary); line-height:1.55; padding-top:7px; border-top:1px solid var(--border-subtle); }

        /* complete */
        .pr-done { background:rgba(34,197,94,0.05); border:1px solid rgba(34,197,94,0.2); border-radius:12px; padding:22px 26px; margin-top:28px; }
        .pr-done-h { font-size:13px; font-weight:700; color:#4ade80; margin-bottom:7px; }
        .pr-done-t { font-size:14px; color:var(--text-secondary); line-height:1.75; }

        /* footer */
        .pr-foot { position:fixed; bottom:0; left:0; right:0; background:rgba(8,8,12,0.96); backdrop-filter:blur(14px); border-top:1px solid var(--border-subtle); padding:13px 40px; padding-bottom:max(13px, calc(13px + env(safe-area-inset-bottom))); display:flex; align-items:center; justify-content:space-between; z-index:20; }
        .pr-foot-l { display:flex; flex-direction:column; gap:2px; }
        .pr-foot-pg { font-family:'DM Mono',monospace; font-size:11px; letter-spacing:0.07em; color:var(--text-tertiary); }
        .pr-foot-hint { font-family:'DM Mono',monospace; font-size:10px; color:rgba(168,85,247,0.55); letter-spacing:0.04em; }
        .pr-foot-btn { font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; color:#fff; background:var(--accent); border:none; border-radius:100px; padding:11px 28px; cursor:pointer; transition:all 180ms ease; }
        .pr-foot-btn:disabled { opacity:0.28; cursor:not-allowed; }
        .pr-foot-btn:not(:disabled):hover { filter:brightness(1.12); transform:scale(1.02); }

        @media (max-width:900px) {
          .pr-side { display:none; }
          .pr-scroll { padding:28px 24px 120px; }
          .pr-top,.pr-foot { padding:0 22px; }
          .pr-foot { padding:13px 22px; }
          .pr-tab { padding:0 16px; }
        }
        @media (max-width:480px) {
          .pr-scroll { padding:22px 18px 110px; }
        }
      `}</style>

      <div className="pr-shell">

        {/* Topbar */}
        <div className="pr-top">
          <span className="pr-wm">onestop<em>careers</em></span>
          <span className="pr-badge">PRE-READ · PLANMYTRIP CASE</span>
        </div>

        {/* Global progress */}
        <div className="pr-prog">
          <div className="pr-prog-fill" style={{ width: `${globalPct}%` }} />
        </div>

        {/* Tab row */}
        <div className="pr-tabs">
          {PAGES.map((p, i) => {
            const active = i === cur
            const done = unlocked.includes(i + 1)
            const isUnlocked = unlocked.includes(i)
            return (
              <button key={p.num}
                className={`pr-tab${active ? ' active' : done ? ' done' : isUnlocked ? '' : ' locked'}`}
                onClick={() => isUnlocked && navigate(i)}
                disabled={!isUnlocked}
              >
                <span className="pr-tab-n">{p.num}</span>
                {p.tab}
                <span className="pr-tab-chk">✓</span>
              </button>
            )
          })}
        </div>

        {/* Body */}
        <div className="pr-body">

          {/* Sidebar */}
          <div className="pr-side">
            <div className="pr-side-ttl">ON THIS PAGE</div>
            {page.type === 'overview' && page.sections?.map((s, i) => s.heading ? (
              <div key={i} className="pr-side-item">{s.heading}</div>
            ) : null)}
            {page.type === 'journey' && <div className="pr-side-item">6-stage booking flow</div>}
            {page.type === 'metrics' && <div className="pr-side-item">8 key metrics</div>}
            {page.type === 'realities' && (
              <>
                <div className="pr-side-item">Market pressures</div>
                <div className="pr-side-item">How teams think</div>
              </>
            )}
            <div className="pr-side-spacer" />
            <div className="pr-side-prog">
              <div className="pr-side-pl">PAGE {cur + 1} OF {PAGES.length}</div>
              <div className="pr-side-bar">
                <div className="pr-side-fill" style={{ width: `${scrollPct}%` }} />
              </div>
              <div className="pr-side-hint">
                {scrollPct < 65
                  ? `Scroll to unlock continue (${scrollPct}%)`
                  : '✓ Ready to continue'}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className={`pr-scroll${leaving ? ' leaving' : ''}`} ref={scrollRef}>
            <div className="pr-inner">
              <p className="pr-eyebrow">SECTION {page.num} · {page.tab.toUpperCase()}</p>
              <h1 className="pr-h1">{page.title}</h1>

              {/* ── OVERVIEW ── */}
              {page.type === 'overview' && page.sections?.map((s, i) => (
                <div key={i} className="pr-sec">
                  {s.heading && <div className="pr-sec-hd">{s.heading}</div>}
                  {s.body && <p className="pr-body-txt">{s.body}</p>}
                  {s.cards && (
                    <div className="pr-cards">
                      {s.cards.map((c, j) => (
                        <div key={j} className="pr-card">
                          <div className="pr-card-lbl">{c.label}</div>
                          <div className="pr-card-txt">{c.text}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {s.table && (
                    <>
                      <table className="pr-tbl">
                        <thead><tr>{s.table.headers.map((h, j) => <th key={j}>{h}</th>)}</tr></thead>
                        <tbody>{s.table.rows.map((row, j) => <tr key={j}>{row.map((cell, k) => <td key={k}>{cell}</td>)}</tr>)}</tbody>
                      </table>
                      {s.note && <div className="pr-note">{s.note}</div>}
                    </>
                  )}
                  {s.pills && (
                    <div className="pr-pills">
                      {s.pills.map((p, j) => <span key={j} className="pr-pill">{p}</span>)}
                    </div>
                  )}
                </div>
              ))}

              {/* ── JOURNEY ── */}
              {page.type === 'journey' && (
                <>
                  {'intro' in page && <p className="pr-intro">{(page as { intro?: string }).intro}</p>}
                  <div className="pr-journey">
                    {('steps' in page ? (page as { steps: { n: string; stage: string; user: string; system: string; dep: string }[] }).steps : []).map((step, i, arr) => (
                      <div key={i} className="pr-jstep">
                        <div className="pr-jleft">
                          <div className="pr-jdot">{step.n}</div>
                          {i < arr.length - 1 && <div className="pr-jline" />}
                        </div>
                        <div>
                          <div className="pr-jname">{step.stage}</div>
                          <div className="pr-jrow">
                            <div className="pr-jrow-lbl">USER</div>
                            <div className="pr-jrow-txt">{step.user}</div>
                          </div>
                          <div className="pr-jrow">
                            <div className="pr-jrow-lbl">SYSTEM</div>
                            <div className="pr-jrow-txt">{step.system}</div>
                          </div>
                          <div className="pr-jdep">⚡ Dependency: {step.dep}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── METRICS ── */}
              {page.type === 'metrics' && (
                <>
                  {'intro' in page && <p className="pr-intro">{(page as { intro?: string }).intro}</p>}
                  <div className="pr-metrics">
                    {('metrics' in page ? (page as { metrics: { name: string; def: string; why: string }[] }).metrics : []).map((m, i) => (
                      <div key={i} className="pr-metric">
                        <div className="pr-metric-nm">{m.name}</div>
                        <div className="pr-metric-df">{m.def}</div>
                        <div className="pr-metric-wh"><strong>Why the business cares:</strong> {m.why}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── REALITIES ── */}
              {page.type === 'realities' && (
                <>
                  {'intro' in page && <p className="pr-intro">{(page as { intro?: string }).intro}</p>}
                  <div className="pr-sec">
                    <div className="pr-sec-hd">Market pressures & constraints</div>
                    <div className="pr-r-items">
                      {('realities' in page ? (page as { realities: { label: string; text: string }[] }).realities : []).map((r, i) => (
                        <div key={i} className="pr-r-item">
                          <div className="pr-r-lbl">{r.label}</div>
                          <div className="pr-r-txt">{r.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pr-sec">
                    <div className="pr-sec-hd">How different teams think</div>
                    {('teams' in page ? (page as { teams: { name: string; focus: string; tension: string }[] }).teams : []).map((t, i) => (
                      <div key={i} className="pr-team">
                        <div className="pr-team-nm">{t.name}</div>
                        <div className="pr-team-fc">{t.focus}</div>
                        <div className="pr-team-tn">⚡ {t.tension}</div>
                      </div>
                    ))}
                  </div>
                  <div className="pr-done">
                    <div className="pr-done-h">✓ Pre-read complete</div>
                    <div className="pr-done-t">
                      You understand how PlanMyTrip makes money, who their customers are, how a booking works end-to-end, what the key metrics mean, and what real-world pressures the business operates under. That is the context you need. The case study begins on the next page.
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pr-foot">
          <div className="pr-foot-l">
            <span className="pr-foot-pg">
              {page.tab} · {isLast ? 'Final section' : `${PAGES.length - cur - 1} section${PAGES.length - cur - 1 > 1 ? 's' : ''} remaining`}
            </span>
            {!canContinue && (
              <span className="pr-foot-hint">↓ Keep reading to unlock continue ({scrollPct}%)</span>
            )}
          </div>
          <button className="pr-foot-btn" onClick={handleContinue} disabled={!canContinue}>
            {isLast ? 'Enter the Case Study →' : `Continue: ${PAGES[cur + 1]?.tab} →`}
          </button>
        </div>

      </div>
    </>
  )
}
