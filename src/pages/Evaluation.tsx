import { useState, useEffect, useRef } from 'react'
import Anthropic from '@anthropic-ai/sdk'
import { useNavigate } from 'react-router-dom'
import InterestForm from '../components/InterestForm'

const WA_URL = 'https://wa.me/919XXXXXXXXX?text=Hi%20Ketan%2C%20I%27d%20like%20to%20reserve%20a%20seat%20for%20the%20Saturday%20AI%20Problem%20Solving%20Lab.'

const SYSTEM = `You are a senior analytics hiring manager with 10 years evaluating problem-solving ability. You have a precise benchmark for what a great answer looks like and you evaluate every response against it — not against abstract criteria.

THE QUESTION ASKED:
"You are a data analyst at Swiggy. A user opened the app, browsed for 5 minutes, and left without ordering. Your manager asks: what happened, and what would you investigate first?"

BENCHMARK — what a 5/5 answer looks like:
The strongest responses do four things in order: (1) Use the 5-minute browse as evidence of intent — the user was not browsing randomly, they wanted food, so the question becomes "what stopped them after they decided to order?" not "why didn't they want to order?" — this reframe is the key insight most people miss. (2) Separate causes into two buckets: user-side (changed mind, got distracted, decision fatigue from too many options) and product-side (delivery time too long, unexpected fees at checkout, preferred restaurant unavailable). (3) Commit to one most-likely hypothesis with a reason — e.g. "delivery time or price shock at checkout, because these are friction points that kill conversion when intent is already there" — not a list of equal possibilities. (4) Name one specific data point that would confirm or refute it — e.g. "I'd check where in the flow they dropped: did they reach a restaurant page? The cart? Or never click anything?"

WHAT DISQUALIFIES A RESPONSE:
- Written by AI: overly structured, bullet points, phrases like "it is important to consider" or "from a business perspective", no personal voice, covers every angle equally
- Off-topic: does not engage with the Swiggy scenario at all
- Too short: under 50 words, not enough to evaluate

SCORING AGAINST BENCHMARK:
5 — Hits all four benchmark elements. Sharp reframe, two-bucket structure, committed hypothesis, data curiosity.
4 — Hits three elements. Missing one but the thinking is clearly structured.
3 — Hits the reframe OR has a committed hypothesis, but not both. Partial structure.
2 — Lists possibilities without committing. No reframe. Surface level.
1 — Vague, scattered, no structure, no hypothesis.

Evaluate efficiently. Be direct. Sound like a mentor giving feedback after an interview, not a teacher grading a paper.

Return ONLY this JSON — no markdown, no backticks, nothing else:
{"ai_detected":false,"off_topic":false,"verdict":"<5-6 words — the single most accurate read of this person's thinking>","overall":<1-5>,"passed":<true if 4+>,"summary":"<2 sentences. What their answer reveals about how they think. Name the strongest thing they did and the single biggest gap. Specific to what they wrote.>","dimensions":[{"name":"Problem Reframe","score":<1-5>,"observation":"<Did they notice that 5 mins = intent, reframing the question? One sentence.>"},{"name":"Hypothesis Commitment","score":<1-5>,"observation":"<Did they pick one most-likely cause and defend it, or list equally? One sentence.>"},{"name":"Structure","score":<1-5>,"observation":"<Did they separate user-side from product-side causes? One sentence.>"},{"name":"Data Curiosity","score":<1-5>,"observation":"<Did they name a specific data point to confirm their hypothesis? One sentence.>"},{"name":"Decision Clarity","score":<1-5>,"observation":"<Did their thinking stay sharp throughout, or trail off? One sentence.>"}],"what_strong_looks_like":"<1-2 sentences showing the benchmark answer concretely. Make the reader feel the gap.>","one_thing":"<One sentence. The single habit that would most improve their thinking. Specific to what they wrote.>","ketan_note":"<1 sentence in Ketan's voice. Direct, personal, not soft.>"}`

interface Dim { name: string; score: number; observation: string }
interface EvalResult {
  verdict: string; overall: number; passed: boolean; summary: string
  dimensions: Dim[]; what_strong_looks_like: string; one_thing: string; ketan_note: string
}

const RISK_LABELS: Record<string, Record<number, string>> = {
  'Problem Reframe': {
    1: 'Risk: You are solving the wrong problem entirely.',
    2: 'Risk: Missing the key insight that reframes the whole question.',
    3: 'Partial: Aware of the framing but not fully exploiting it.',
  },
  'Hypothesis Commitment': {
    1: 'Risk: Leadership sees you as unable to form independent views.',
    2: 'Risk: Your communication reads as passive and non-committal.',
    3: 'Partial: Shows a view but hedges too much to be actionable.',
  },
  'Structure': {
    1: 'Risk: Arguments lack framing — stakeholders tune out.',
    2: 'Risk: Causes are mixed without logical separation.',
    3: 'Partial: Some structure present but not consistently applied.',
  },
  'Data Curiosity': {
    1: 'Risk: Cannot distinguish between data that matters and noise.',
    2: 'Risk: No clear sense of what would confirm or refute your view.',
    3: 'Partial: Curious but not specific about what to look for.',
  },
  'Decision Clarity': {
    1: 'Risk: Thinking trails off — no clear conclusion reached.',
    2: 'Risk: Contradictory signals — the argument undermines itself.',
    3: 'Partial: Clear direction but stops short of a full recommendation.',
  },
}

function ScoreBar({ score, name }: { score: number; name: string }) {
  const color = score <= 2 ? '#f87171' : score === 3 ? '#fbbf24' : '#4ade80'
  const risk = score <= 3 ? RISK_LABELS[name]?.[score] : null
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: risk ? 6 : 0 }}>
        <div style={{ flex: 1, height: 3, background: 'var(--border-subtle)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: `${(score / 5) * 100}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 900ms ease' }} />
        </div>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color, minWidth: 28, textAlign: 'right' }}>{score}/5</span>
      </div>
      {risk && (
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.06em', color: '#f87171', lineHeight: 1.5 }}>
          {risk}
        </div>
      )}
    </div>
  )
}

// 2 transformation cards — most universally felt
const TRANSFORMATIONS = [
  {
    before: 'Your manager asks what happened. You list four possibilities with equal weight. The room moves on without your input.',
    after: 'You walk in with one high-conviction hypothesis, your reasoning, and the exact metric that would prove you wrong.',
  },
  {
    before: 'You present findings. One question from leadership and you say "let me check and get back to you." You don\'t get the follow-up meeting.',
    after: 'You present a recommendation. You\'ve already anticipated their pushback and addressed it before they ask.',
  },
]

export default function Evaluation() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<'loading' | 'result' | 'error'>('loading')
  const [result, setResult] = useState<EvalResult | null>(null)
  const [errMsg, setErrMsg] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  const FALLBACK: EvalResult = {
    verdict: 'Good breadth. Needs sharper hypothesis.',
    overall: 2,
    passed: false,
    summary: 'Your response shows genuine curiosity and covers a range of possibilities. The core gap: possibilities are listed with equal weight and there is no commitment to a single most-likely cause.',
    dimensions: [
      { name: 'Problem Reframe', score: 2, observation: 'Did not use the 5-minute browse as evidence of intent to reframe the question.' },
      { name: 'Hypothesis Commitment', score: 2, observation: 'Listed multiple possibilities without committing to the most likely one with reasoning.' },
      { name: 'Structure', score: 2, observation: 'Causes were not separated into user-side vs product-side buckets.' },
      { name: 'Data Curiosity', score: 3, observation: 'Showed curiosity but did not name a specific data point to confirm the hypothesis.' },
      { name: 'Decision Clarity', score: 2, observation: 'Thinking was consistent but did not arrive at a clear, defensible position.' },
    ],
    what_strong_looks_like: 'A strong response immediately notices that 5 minutes of browsing signals intent. It then narrows to one most-likely cause and names one data point that would confirm it.',
    one_thing: 'Practice committing to one hypothesis and defending it before listing alternatives.',
    ketan_note: 'The instinct to think through multiple angles is good. The next step is learning to pick one and stand behind it.',
  }

  useEffect(() => {
    const answer = sessionStorage.getItem('signal_answer')
    if (!answer) { navigate('/diagnostic'); return }

    const isPreview = sessionStorage.getItem('signal_preview') === '1'
    if (isPreview) {
      setTimeout(() => { setResult(FALLBACK); setPhase('result') }, 1500)
      return
    }

    const client = new Anthropic({
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
      dangerouslyAllowBrowser: true,
    })

    client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1200,
      system: SYSTEM,
      messages: [{ role: 'user', content: answer }],
    })
      .then(data => {
        const text = data.content?.find(b => b.type === 'text')?.text ?? ''
        const parsed = JSON.parse(text.replace(/```json|```/g, '').trim()) as EvalResult
        setResult(parsed)
        setPhase('result')
      })
      .catch(e => {
        console.error(e)
        setResult(FALLBACK)
        setPhase('result')
      })
  }, [])

  useEffect(() => {
    if (phase !== 'result') return
    setTimeout(() => {
      bodyRef.current?.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(18px)'
        setTimeout(() => {
          el.style.transition = 'opacity 0.55s ease, transform 0.55s ease'
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
        }, i * 80)
      })
    }, 60)
  }, [phase])

  const r = result
  const scoreColor = !r ? '#f87171' : r.overall <= 2 ? '#f87171' : r.overall === 3 ? '#fbbf24' : '#4ade80'

  return (
    <>
      <style>{`
        .eval-page { min-height: 100vh; background: var(--bg-base); display: flex; flex-direction: column; }
        .eval-topbar {
          height: 60px; display: flex; align-items: center; padding: 0 32px;
          border-bottom: 1px solid var(--border-subtle); background: var(--bg-base);
          position: sticky; top: 0; z-index: 10; justify-content: space-between;
        }
        .eval-logo { font-family: 'DM Mono', monospace; font-size: 13px; letter-spacing: 0.12em; color: var(--text-tertiary); }
        .eval-logo span { background: linear-gradient(135deg,#FF6B9D,#A855F7); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .eval-steps { display: flex; gap: 6px; }
        .eval-step { width: 24px; height: 3px; border-radius: 2px; background: var(--border-subtle); }
        .eval-step.done { background: var(--accent); opacity: 0.35; }
        .eval-step.active { background: var(--accent); }

        /* Loading */
        .eval-loading { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; }
        .eval-spinner { width: 52px; height: 52px; border-radius: 50%; position: relative; }
        .eval-spinner::before { content:''; position:absolute; inset:0; border-radius:50%; border:2px solid var(--border-subtle); border-top-color:var(--accent); animation:spin 1s linear infinite; }
        .eval-spinner::after { content:''; position:absolute; inset:8px; border-radius:50%; border:1px solid var(--border-subtle); border-bottom-color:#FF6B9D; animation:spin 1.6s linear infinite reverse; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .eval-loading-label { font-family:'DM Mono',monospace; font-size:12px; letter-spacing:0.14em; color:var(--text-tertiary); }
        .eval-loading-sub { font-family:'DM Sans',sans-serif; font-size:14px; color:var(--text-tertiary); text-align:center; max-width:260px; line-height:1.65; }

        /* Body */
        .eval-body { max-width: 760px; margin: 0 auto; width: 100%; padding: 56px 32px 100px; }

        /* Score — always first on mobile */
        .eval-score-row {
          display: flex; flex-direction: column; align-items: center;
          margin-bottom: 40px; padding-bottom: 40px;
          border-bottom: 1px solid var(--border-subtle);
          text-align: center;
        }
        .eval-score {
          width: 96px; height: 96px; border-radius: 50%; border: 2px solid;
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 1px; margin-bottom: 20px; flex-shrink: 0;
        }
        .eval-score-num { font-family:'Instrument Serif',serif; font-size:36px; line-height:1; }
        .eval-score-of { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:0.06em; color:var(--text-tertiary); }
        .eval-eyebrow { font-family:'DM Mono',monospace; font-size:11px; letter-spacing:0.16em; color:var(--accent); margin-bottom:10px; }
        .eval-verdict { font-family:'Instrument Serif',serif; font-size:clamp(22px,3vw,32px); font-style:italic; color:var(--text-primary); line-height:1.25; margin-bottom:14px; }
        .eval-summary { font-family:'DM Sans',sans-serif; font-size:16px; line-height:1.75; color:var(--text-secondary); max-width:560px; margin:0 auto; }

        .eval-sec-label { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:0.16em; color:var(--text-tertiary); margin-bottom:14px; margin-top:40px; }

        /* Dimensions */
        .eval-dims { display: flex; flex-direction: column; gap: 10px; }
        .eval-dim { background:var(--bg-elevated); border:1px solid var(--border-subtle); border-radius:14px; padding:18px 20px; }
        .eval-dim-top { display:flex; align-items:center; gap:14px; margin-bottom:8px; flex-wrap:wrap; }
        .eval-dim-name { font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; color:var(--text-primary); min-width:150px; }
        .eval-dim-obs { font-family:'DM Sans',sans-serif; font-size:13px; line-height:1.6; color:var(--text-secondary); }

        /* Benchmark */
        .eval-strong { background:rgba(168,85,247,0.05); border:1px solid rgba(168,85,247,0.15); border-radius:14px; padding:22px 24px; }
        .eval-strong-label { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:0.14em; color:var(--accent); margin-bottom:10px; }
        .eval-strong-text { font-family:'DM Sans',sans-serif; font-size:15px; line-height:1.75; color:var(--text-secondary); }

        /* One thing */
        .eval-one { border-left:3px solid var(--accent); border-radius:0 12px 12px 0; background:var(--bg-elevated); padding:20px 24px; }
        .eval-one-label { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:0.14em; color:var(--accent); margin-bottom:10px; }
        .eval-one-text { font-family:'Instrument Serif',serif; font-size:18px; font-style:italic; color:var(--text-primary); line-height:1.55; }

        /* Ketan note */
        .eval-ketan { background:var(--bg-elevated); border:1px solid var(--border-subtle); border-radius:14px; padding:22px 24px; display:flex; gap:16px; align-items:flex-start; }
        .eval-ketan-avatar { width:44px; height:44px; border-radius:50%; overflow:hidden; flex-shrink:0; box-shadow:0 0 0 2px rgba(168,85,247,0.2); }
        .eval-ketan-avatar img { width:100%; height:100%; object-fit:cover; }
        .eval-ketan-name { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:0.1em; color:var(--accent); margin-bottom:8px; }
        .eval-ketan-text { font-family:'DM Sans',sans-serif; font-size:15px; line-height:1.7; color:var(--text-secondary); font-style:italic; }

        /* Lab CTA — immediately after ketan note */
        .eval-lab {
          background:var(--bg-elevated); border:1px solid rgba(168,85,247,0.25);
          border-radius:22px; padding:48px 44px; text-align:center;
          position:relative; overflow:hidden;
        }
        .eval-lab::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(168,85,247,0.6),rgba(255,107,157,0.6),transparent); }
        .eval-lab-eyebrow { font-family:'DM Mono',monospace; font-size:11px; letter-spacing:0.16em; color:var(--accent); margin-bottom:14px; }
        .eval-lab-h3 { font-family:'Instrument Serif',serif; font-size:clamp(22px,3vw,34px); font-weight:400; color:var(--text-primary); line-height:1.2; margin-bottom:12px; }
        .eval-lab-body { font-family:'DM Sans',sans-serif; font-size:15px; line-height:1.75; color:var(--text-secondary); max-width:420px; margin:0 auto 28px; }
        .eval-lab-body strong { color:var(--text-primary); font-weight:500; }

        /* Pricing block */
        .eval-pricing {
          display: inline-flex; flex-direction: column; align-items: center;
          background: var(--bg-base); border: 1px solid var(--border-subtle);
          border-radius: 14px; padding: 20px 32px; margin-bottom: 28px; gap: 4px;
        }
        .eval-price-main { font-family:'Instrument Serif',serif; font-size:32px; color:var(--text-primary); line-height:1; }
        .eval-price-detail { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:0.1em; color:var(--text-tertiary); }
        .eval-price-includes {
          display: flex; align-items: center; gap: 8px; margin-top: 8px; flex-wrap: wrap; justify-content: center;
        }
        .eval-price-tag {
          font-family:'DM Mono',monospace; font-size:10px; letter-spacing:0.08em;
          color:var(--accent); background:rgba(168,85,247,0.08);
          border:1px solid rgba(168,85,247,0.15); border-radius:100px; padding:4px 10px;
        }

        .eval-lab-btn { font-family:'DM Sans',sans-serif; font-size:17px; font-weight:600; color:#fff; background:var(--accent); border:none; border-radius:100px; padding:17px 52px; cursor:pointer; transition:all 200ms; display:inline-block; margin-bottom:12px; white-space:nowrap; }
        .eval-lab-btn:hover { filter:brightness(1.1); transform:translateY(-2px); box-shadow:0 8px 32px rgba(168,85,247,0.35); }
        .eval-lab-trust { font-family:'DM Mono',monospace; font-size:10px; color:var(--text-tertiary); letter-spacing:0.06em; }

        /* Transformation — 2 cards only */
        .eval-transform { margin-top:56px; padding-top:56px; border-top:1px solid var(--border-subtle); }
        .eval-transform-label { font-family:'DM Mono',monospace; font-size:11px; letter-spacing:0.16em; color:var(--accent); margin-bottom:12px; }
        .eval-transform-h2 { font-family:'Instrument Serif',serif; font-size:clamp(22px,3vw,34px); font-weight:400; color:var(--text-primary); line-height:1.2; margin-bottom:28px; }
        .eval-transform-h2 em { font-style:italic; background:linear-gradient(135deg,#FF6B9D,#A855F7); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .eval-transform-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:48px; }
        .eval-t-card { background:var(--bg-elevated); border:1px solid var(--border-subtle); border-radius:14px; padding:20px; }
        .eval-t-before { font-family:'DM Sans',sans-serif; font-size:13px; color:var(--text-tertiary); line-height:1.6; padding:10px 12px; background:rgba(239,68,68,0.05); border:1px solid rgba(239,68,68,0.1); border-radius:8px; margin-bottom:8px; }
        .eval-t-after { font-family:'DM Sans',sans-serif; font-size:13px; color:var(--text-secondary); line-height:1.6; padding:10px 12px; background:rgba(34,197,94,0.05); border:1px solid rgba(34,197,94,0.12); border-radius:8px; }

        .eval-retry { text-align:center; margin-top:32px; }
        .eval-retry-btn { font-family:'DM Sans',sans-serif; font-size:14px; color:var(--text-tertiary); background:none; border:none; cursor:pointer; text-decoration:underline; text-underline-offset:3px; }
        .eval-retry-btn:hover { color:var(--text-secondary); }

        @media (max-width: 640px) {
          .eval-body { padding: 36px 20px 80px; }
          .eval-lab { padding: 36px 22px; border-radius: 18px; }
          .eval-lab-btn { width: 100%; max-width: 300px; }
          .eval-transform-grid { grid-template-columns: 1fr; }
          .eval-topbar { padding: 0 20px; }
        }
      `}</style>

      <div className="eval-page">
        <div className="eval-topbar">
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <button
              onClick={() => navigate('/')}
              style={{ background:'none', border:'1px solid var(--border-subtle)', borderRadius:100, padding:'6px 14px', fontFamily:'DM Sans,sans-serif', fontSize:13, color:'var(--text-secondary)', cursor:'pointer' }}
            >
              ← Home
            </button>
            <span className="eval-logo">onestop<span>careers</span></span>
          </div>
          <div className="eval-steps">
            <div className="eval-step done" />
            <div className="eval-step done" />
            <div className="eval-step active" />
          </div>
        </div>

        {phase === 'loading' && (
          <div className="eval-loading">
            <div className="eval-spinner" />
            <div className="eval-loading-label">READING YOUR THINKING</div>
            <p className="eval-loading-sub">Evaluating your response across 5 dimensions…</p>
          </div>
        )}

        {phase === 'error' && (
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, padding:40, textAlign:'center' }}>
            <h2 style={{ fontFamily:'Instrument Serif,serif', fontSize:24, color:'var(--text-primary)', fontWeight:400 }}>Something went wrong</h2>
            <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'var(--text-tertiary)', maxWidth:340, lineHeight:1.65 }}>{errMsg}</p>
            <button style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight:500, color:'var(--bg-base)', background:'var(--text-primary)', border:'none', borderRadius:100, padding:'12px 28px', cursor:'pointer' }} onClick={() => navigate('/diagnostic')}>Try Again</button>
          </div>
        )}

        {phase === 'result' && r && (
          <div className="eval-body" ref={bodyRef}>

            {/* Score — centred, always first */}
            <div data-reveal className="eval-score-row">
              <div className="eval-score" style={{ borderColor: scoreColor, color: scoreColor }}>
                <span className="eval-score-num">{r.overall}</span>
                <span className="eval-score-of">OUT OF 5</span>
              </div>
              <p className="eval-eyebrow">HOW YOU THINK</p>
              <h1 className="eval-verdict">"{r.verdict}"</h1>
              <p className="eval-summary">{r.summary}</p>
            </div>

            {/* Dimensions */}
            <p data-reveal className="eval-sec-label">WHERE YOU ARE RIGHT NOW</p>
            <div data-reveal className="eval-dims">
              {r.dimensions.map((d, i) => (
                <div key={i} className="eval-dim">
                  <div className="eval-dim-top">
                    <span className="eval-dim-name">{d.name}</span>
                    <ScoreBar score={d.score} name={d.name} />
                  </div>
                  <p className="eval-dim-obs">{d.observation}</p>
                </div>
              ))}
            </div>

            {/* Benchmark */}
            <p data-reveal className="eval-sec-label">WHAT STRONG THINKING LOOKS LIKE HERE</p>
            <div data-reveal className="eval-strong">
              <div className="eval-strong-label">THE STANDARD</div>
              <p className="eval-strong-text">{r.what_strong_looks_like}</p>
            </div>

            {/* One thing */}
            <p data-reveal className="eval-sec-label">THE ONE THING TO WORK ON</p>
            <div data-reveal className="eval-one">
              <div className="eval-one-label">FOCUS HERE</div>
              <p className="eval-one-text">{r.one_thing}</p>
            </div>

            {/* Ketan's note */}
            <p data-reveal className="eval-sec-label">A NOTE FROM KETAN</p>
            <div data-reveal className="eval-ketan">
              <div className="eval-ketan-avatar">
                <img src="/ketan.jpeg" alt="Ketan Goel" />
              </div>
              <div>
                <div className="eval-ketan-name">KETAN GOEL · ANALYTICS MANAGER, MEESHO</div>
                <p className="eval-ketan-text">{r.ketan_note}</p>
              </div>
            </div>

            {/* Lab CTA — immediately after Ketan */}
            <div data-reveal style={{ marginTop: 40 }}>
              <div className="eval-lab">
                <p className="eval-lab-eyebrow">SATURDAY AI PROBLEM SOLVING LAB</p>
                <h3 className="eval-lab-h3">
                  Work through a real case.<br />Get Ketan's feedback on your thinking.
                </h3>
                <p className="eval-lab-body">
                  Two live Saturday sessions with Ketan.
                  You investigate a real business problem, build a recommendation, and defend it live.
                  <strong> Maximum 5 people per cohort — every person gets real attention.</strong>
                </p>

                <div className="eval-pricing">
                  <span className="eval-price-main">₹2,999</span>
                  <span className="eval-price-detail">PER PERSON · FULL COHORT</span>
                  <div className="eval-price-includes">
                    <span className="eval-price-tag">2 live sessions</span>
                    <span className="eval-price-tag">Max 5 people</span>
                    <span className="eval-price-tag">Ketan reviews your work</span>
                  </div>
                </div>

                <div>
                  <button className="eval-lab-btn" onClick={() => setFormOpen(true)}>
                    Reserve My Seat →
                  </button>
                </div>
                <p className="eval-lab-trust">No auto-renewal · Ketan confirms within 24hrs</p>
              </div>
            </div>

            {/* 2 transformation cards */}
            <div data-reveal className="eval-transform">
              <p className="eval-transform-label">WHAT CHANGES WITH PRACTICE</p>
              <h2 className="eval-transform-h2">
                This is a skill.<br /><em>Skills can be built.</em>
              </h2>
              <div className="eval-transform-grid">
                {TRANSFORMATIONS.map((t, i) => (
                  <div key={i} className="eval-t-card">
                    <div className="eval-t-before">✕  {t.before}</div>
                    <div className="eval-t-after">✓  {t.after}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="eval-retry">
              <button className="eval-retry-btn" onClick={() => navigate('/diagnostic')}>
                Retake the diagnostic
              </button>
            </div>

          </div>
        )}
      </div>

      <InterestForm open={formOpen} onClose={() => setFormOpen(false)} waUrl={WA_URL} />
    </>
  )
}
