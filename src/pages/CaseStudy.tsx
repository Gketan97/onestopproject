/// <reference types="vite/client" />
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import InterestForm from '../components/InterestForm'
import Nav from '../components/Nav'

const WA_URL = 'https://wa.me/919019896747?text=Hi%20Ketan%2C%20I%27d%20like%20to%20reserve%20a%20seat%20for%20the%20Saturday%20AI%20Problem%20Solving%20Lab.'

const OUTCOMES = [
  {
    n: '01',
    title: 'Business context of a real bookings company',
    summary: 'How an OTA\'s conversion funnel works — in real P&L terms.',
    body: 'Not a fake case. PlanMyTrip is built on the real structure of how Indian travel companies operate. You will understand what mix shift means in P&L terms, how to read a business you\'ve never seen before in under 30 minutes, and why a 29% conversion drop doesn\'t always mean what it looks like.',
    tag: 'DOMAIN KNOWLEDGE',
  },
  {
    n: '02',
    title: 'Structured problem solving under pressure',
    summary: 'From vague CEO ask to specific root cause with evidence.',
    body: 'Using an 8-step framework applied live by Ketan, then independently by you. This is the skill that separates analysts who get promoted from those who stay in reporting roles for 3 years. You leave knowing how to structure any ambiguous business problem — not just this one.',
    tag: 'THINKING FRAMEWORK',
  },
  {
    n: '03',
    title: 'Working with AI as a thinking partner',
    summary: 'Pressure-test your thinking before anyone else can challenge it.',
    body: 'Not prompting tips. The actual discipline of when to trust AI output, when to push back, and how to direct it toward your specific problem. You leave with Ketan\'s full prompt library from the session — every prompt he used, annotated.',
    tag: 'AI COLLABORATION',
  },
  {
    n: '04',
    title: 'A real case study for your resume and interviews',
    summary: 'You did the work. You have the analysis. You can defend it.',
    body: 'This is not a certificate. It is a structured analysis of a real business problem — the kind interviewers ask about in product and analytics interviews. You investigated it, formed the hypothesis, and defended it to Ketan live. That conversation is yours to describe in any room.',
    tag: 'CAREER ASSET',
  },
]

const SAMPLE_AI = [
  { role: 'student', text: 'I think the conversion dropped because of the payment UI experiment. It launched right when the drop started.' },
  { role: 'ai', text: 'Interesting hypothesis. Two questions before you commit: (1) What % of total users were in the treatment group? (2) iOS users were unaffected by this experiment — is their conversion also down? What do you find?' },
  { role: 'student', text: 'Oh — iOS is also down. And the experiment only affected maybe 12% of users.' },
  { role: 'ai', text: 'Exactly. If iOS (unaffected) is also declining, the cause has to be broader than an Android experiment. And if the treatment is only 12% of users, even a large effect can only explain a small fraction of the aggregate drop. What else changed in the week of July 12?' },
]

function OutcomeCard({ o, index }: { o: typeof OUTCOMES[0]; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      onClick={() => setOpen(v => !v)}
      style={{
        background: 'var(--bg-elevated)',
        border: `1px solid ${open ? 'rgba(168,85,247,0.35)' : 'var(--border-subtle)'}`,
        borderRadius: 14,
        padding: '20px',
        marginBottom: 8,
        cursor: 'pointer',
        transition: 'border-color 200ms',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--accent)', flexShrink: 0, paddingTop: 3, letterSpacing: '0.1em' }}>{o.n}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 5, lineHeight: 1.35 }}>{o.title}</div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{o.summary}</div>
        </div>
        <span style={{ color: 'var(--accent)', fontSize: 18, flexShrink: 0, transition: 'transform 250ms', transform: open ? 'rotate(45deg)' : 'rotate(0deg)', paddingTop: 2 }}>+</span>
      </div>
      {open && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-subtle)', fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: 25 }}>
          {o.body}
          <div style={{ marginTop: 10 }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.12em', color: 'var(--accent)', background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)', borderRadius: 100, padding: '3px 10px' }}>{o.tag}</span>
          </div>
        </div>
      )}
    </div>
  )
}

function CEOMemo() {
  const [expanded, setExpanded] = useState(false)
  const full = '"Our domestic flight search-to-booking conversion dropped from 21.3% to 15.2% over 8 weeks — a 29% relative decline — despite sessions growing 53%. We\'re spending ₹610 per booking in discounts to sustain volumes that used to need ₹380. Net revenue per booking collapsed from ₹342 to ₹248. If this continues, we miss Q2 margin by ₹180 crore. What happened and what do we do?"'
  const hook = '"Our domestic flight conversion dropped 29% in 8 weeks — despite sessions growing 53%. Net revenue per booking collapsed. If this continues, we miss Q2 by ₹180 crore."'
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 18, padding: '28px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--accent), #FF6B9D)' }} />
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-tertiary)', marginBottom: 14, lineHeight: 1.8 }}>
        FROM: Arjun Mehta, Group CEO, PlanMyTrip.com<br />
        TO: Analytics & Product Team · URGENT
      </div>
      <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(15px, 1.8vw, 18px)', color: 'var(--text-primary)', lineHeight: 1.65, fontStyle: 'italic', margin: 0 }}>
        {expanded ? full : hook}
      </p>
      <button onClick={() => setExpanded(v => !v)} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontFamily: 'DM Mono, monospace', fontSize: 11, letterSpacing: '0.08em', cursor: 'pointer', marginTop: 14, padding: 0 }}>
        {expanded ? '↑ Show less' : '↓ Read full brief'}
      </button>
    </div>
  )
}

export default function CaseStudy() {
  const navigate = useNavigate()
  const [formOpen, setFormOpen] = useState(false)
  const [stickyVisible, setStickyVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setStickyVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <style>{`
        .cs-page { min-height: 100vh; background: var(--bg-base); }
        .cs-inner { max-width: 860px; margin: 0 auto; }
        .cs-hero { padding: 72px 32px 52px; }
        .cs-label { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.16em; color: var(--accent); margin-bottom: 14px; }
        .cs-h1 { font-family: 'Instrument Serif', serif; font-size: clamp(28px, 4.5vw, 52px); font-weight: 400; color: var(--text-primary); line-height: 1.15; margin-bottom: 18px; }
        .cs-h1 em { font-style: italic; background: linear-gradient(135deg,#FF6B9D,#A855F7); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .cs-hero-desc { font-family: 'DM Sans', sans-serif; font-size: 16px; color: var(--text-secondary); line-height: 1.8; max-width: 540px; margin-bottom: 10px; }
        .cs-ketan-line { font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text-tertiary); margin-bottom: 28px; }
        .cs-pills { display: flex; flex-wrap: wrap; gap: 7px; }
        .cs-pill { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.06em; color: var(--text-secondary); background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 100px; padding: 5px 12px; }
        .cs-section { padding: 0 32px 56px; }
        .cs-outcomes-intro { font-family: 'Instrument Serif', serif; font-size: clamp(22px, 2.8vw, 34px); font-weight: 400; color: var(--text-primary); line-height: 1.2; margin-bottom: 8px; }
        .cs-outcomes-sub { font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--text-tertiary); line-height: 1.7; margin-bottom: 24px; }
        .cs-chat { background: var(--bg-elevated); border: 1px solid rgba(168,85,247,0.2); border-radius: 16px; overflow: hidden; }
        .cs-chat-hdr { padding: 12px 20px; border-bottom: 1px solid var(--border-subtle); background: rgba(168,85,247,0.05); display: flex; align-items: center; gap: 10px; }
        .cs-msg { padding: 10px 14px; margin: 4px 14px; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1.65; max-width: 88%; }
        .cs-msg.student { background: var(--accent); color: white; margin-left: auto; border-radius: 16px 16px 4px 16px; }
        .cs-msg.ai { background: var(--bg-base); border: 1px solid var(--border-subtle); color: var(--text-secondary); border-radius: 4px 16px 16px 16px; margin-right: auto; }
        .cs-ketan-strip { margin: 0 32px 52px; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 20px 22px; display: flex; gap: 14px; align-items: center; }
        .cs-ketan-photo { width: 44px; height: 44px; border-radius: 50%; overflow: hidden; flex-shrink: 0; box-shadow: 0 0 0 2px rgba(168,85,247,0.2); }
        .cs-ketan-photo img { width: 100%; height: 100%; object-fit: cover; }
        .cs-cta { background: var(--bg-surface); border-top: 1px solid var(--border-subtle); padding: 64px 32px 80px; text-align: center; }
        .cs-cta-h2 { font-family: 'Instrument Serif', serif; font-size: clamp(24px, 3.5vw, 42px); font-weight: 400; color: var(--text-primary); line-height: 1.2; margin-bottom: 12px; }
        .cs-cta-sub { font-family: 'DM Sans', sans-serif; font-size: 15px; color: var(--text-secondary); line-height: 1.75; max-width: 400px; margin: 0 auto 24px; }
        .cs-pricing { display: inline-flex; flex-direction: column; align-items: center; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 18px 32px; margin-bottom: 20px; gap: 4px; }
        .cs-price-main { font-family: 'Instrument Serif', serif; font-size: 32px; color: var(--text-primary); line-height: 1; }
        .cs-price-detail { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; color: var(--text-tertiary); }
        .cs-price-tags { display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap; justify-content: center; }
        .cs-price-tag { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.06em; color: var(--accent); background: rgba(168,85,247,0.08); border: 1px solid rgba(168,85,247,0.15); border-radius: 100px; padding: 3px 9px; }
        .cs-refund { display: inline-flex; align-items: center; gap: 8px; background: rgba(34,197,94,0.06); border: 1px solid rgba(34,197,94,0.2); border-radius: 100px; padding: 7px 16px; margin-bottom: 20px; }
        .cs-refund span { font-family: 'DM Sans', sans-serif; font-size: 13px; color: #4ade80; }
        .cs-cta-btn { font-family: 'DM Sans', sans-serif; font-size: 17px; font-weight: 600; color: #fff; background: var(--accent); border: none; border-radius: 100px; padding: 17px 52px; cursor: pointer; transition: all 200ms; display: inline-block; margin-bottom: 12px; white-space: nowrap; }
        .cs-cta-btn:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(168,85,247,0.35); }
        .cs-cta-trust { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-tertiary); letter-spacing: 0.06em; }
        .cs-sticky { position: fixed; bottom: 0; left: 0; right: 0; z-index: 80; padding: 14px 20px 18px; background: rgba(8,8,12,0.96); backdrop-filter: blur(14px); border-top: 1px solid var(--border-subtle); transform: translateY(100%); transition: transform 320ms cubic-bezier(0.22,1,0.36,1); }
        .cs-sticky.show { transform: translateY(0); }
        .cs-sticky-btn { width: 100%; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 600; color: #fff; background: var(--accent); border: none; border-radius: 100px; padding: 15px; cursor: pointer; }
        @media (max-width: 640px) {
          .cs-hero { padding: 52px 20px 40px; }
          .cs-section { padding: 0 20px 48px; }
          .cs-ketan-strip { margin: 0 20px 44px; }
          .cs-cta { padding: 52px 20px 100px; }
          .cs-cta-btn { width: 100%; max-width: 300px; }
        }
        @media (min-width: 641px) { .cs-sticky { display: none !important; } }
      `}</style>

      <div className="cs-page">
        <Nav />

        <div className="cs-hero">
          <div className="cs-inner">
            <p className="cs-label">COHORT CASE STUDY · THE GROWTH TRAP</p>
            <h1 className="cs-h1">One real problem.<br /><em>Four things you keep forever.</em></h1>
            <p className="cs-hero-desc">A working session — not a course. You investigate a real consumer internet problem, get Ketan's live feedback, and walk away with skills that transfer to every problem after this.</p>
            <p className="cs-ketan-line">Run by <strong style={{ color: 'var(--text-secondary)' }}>Ketan Goel</strong>, Analytics Manager at Meesho</p>
            <div className="cs-pills">
              {['Real Indian internet problem', 'Live feedback from Ketan', '5 real datasets', 'AI thinking partner', 'Max 5 people'].map((p, i) => (
                <span key={i} className="cs-pill">{p}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="cs-section">
          <div className="cs-inner">
            <p className="cs-label" style={{ marginBottom: 14 }}>THIS IS WHAT YOU WILL SOLVE</p>
            <CEOMemo />
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--text-tertiary)', marginTop: 12, lineHeight: 1.6 }}>
              Six stakeholders. Five datasets. One root cause. You find it — then defend it to Ketan live.
            </p>
          </div>
        </div>

        <div className="cs-section">
          <div className="cs-inner">
            <p className="cs-label">WHAT YOU WALK AWAY WITH</p>
            <h2 className="cs-outcomes-intro">The case is the vehicle.<br />These are what you keep.</h2>
            <p className="cs-outcomes-sub">Tap any outcome to see what it means in practice.</p>
            {OUTCOMES.map((o, i) => <OutcomeCard key={i} o={o} index={i} />)}
          </div>
        </div>

        <div className="cs-section">
          <div className="cs-inner">
            <p className="cs-label">THE AI ANALYSIS PARTNER</p>
            <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 400, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.2 }}>
              It won't give you the answer.<br />It helps you find it.
            </h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
              A real exchange from Phase 2 — the AI challenging a student's hypothesis.
            </p>
            <div className="cs-chat">
              <div className="cs-chat-hdr">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, letterSpacing: '0.1em', color: 'var(--text-primary)' }}>REAL SAMPLE · PHASE 2</span>
              </div>
              <div style={{ padding: '16px 0 12px' }}>
                {SAMPLE_AI.map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: m.role === 'student' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                    <div className={`cs-msg ${m.role}`}>{m.text}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.15)' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.08em', color: 'var(--text-tertiary)' }}>AVAILABLE TO ENROLLED MEMBERS</span>
              </div>
            </div>
          </div>
        </div>

        <div className="cs-ketan-strip">
          <div className="cs-ketan-photo">
            <img src="/ketan.jpeg" alt="Ketan Goel" />
          </div>
          <div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>Ketan Goel</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Analytics Manager, Meesho · 170K LinkedIn · 500+ professionals mentored
            </div>
          </div>
        </div>

        <div className="cs-cta">
          <div className="cs-inner">
            <p className="cs-label">SATURDAY AI PROBLEM SOLVING LAB</p>
            <h2 className="cs-cta-h2">Ready to work through this live?</h2>
            <p className="cs-cta-sub">Two Saturdays. Real problem. Ketan's feedback on your thinking.</p>
            <div style={{ marginBottom: 16 }}>
              <div className="cs-pricing">
                <span className="cs-price-main">₹2,999</span>
                <span className="cs-price-detail">PER PERSON · FULL COHORT</span>
                <div className="cs-price-tags">
                  <span className="cs-price-tag">2 live sessions</span>
                  <span className="cs-price-tag">Max 5 people</span>
                  <span className="cs-price-tag">Ketan reviews your work</span>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div className="cs-refund">
                <span style={{ fontSize: 14, color: '#4ade80' }}>✓</span>
                <span>Full refund if not satisfied after Session 1 — no questions asked</span>
              </div>
            </div>
            <div>
              <button className="cs-cta-btn" onClick={() => setFormOpen(true)}>Reserve My Seat →</button>
            </div>
            <p className="cs-cta-trust">Ketan confirms within 24hrs · No auto-renewal</p>
            <p style={{ marginTop: 20, fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--text-tertiary)' }}>
              Not sure yet?{' '}
              <button onClick={() => navigate('/diagnostic')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 14, fontFamily: 'DM Sans, sans-serif', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                Take the free thinking test first →
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className={`cs-sticky ${stickyVisible ? 'show' : ''}`}>
        <button className="cs-sticky-btn" onClick={() => setFormOpen(true)}>
          Reserve My Seat — ₹2,999 →
        </button>
      </div>

      <InterestForm open={formOpen} onClose={() => setFormOpen(false)} waUrl={WA_URL} />
    </>
  )
}
