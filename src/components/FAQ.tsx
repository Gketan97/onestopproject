import { useState, useEffect, useRef } from 'react'

const faqs = [
  {
    q: 'Who is this for?',
    a: 'Any professional who works with data, makes decisions, or presents recommendations — and wants to do it better. PMs, analysts, consultants, and anyone who wants to think more clearly under pressure.',
  },
  {
    q: 'Do I need a technical background?',
    a: "No. This is not about SQL, Python, or tools. It's about how you think through problems. Some of the sharpest thinkers in the lab come from non-technical backgrounds.",
  },
  {
    q: 'Why only 5 people per cohort?',
    a: 'Because meaningful feedback requires real attention. Ketan evaluates how each person thinks — not just what they answer. That depth is only possible in small groups.',
  },
  {
    q: 'What makes this different from other courses?',
    a: 'Most courses teach content. This lab evaluates thinking. You will leave knowing exactly where your analytical reasoning breaks down — and with a framework to fix it.',
  },
  {
    q: 'What exactly is included for ₹2,999?',
    a: '₹2,999 covers the full cohort — two live Saturday sessions with Ketan. You get the pre-read material, a real business case to investigate independently, Ketan\'s live evaluation of your work, and the full debrief. Maximum 5 people. No subscription, no auto-renewal.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
            setTimeout(() => {
              el.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
              el.style.opacity = '1'
              el.style.transform = 'translateY(0)'
            }, i * 60)
          })
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })
    if (ref.current) {
      ref.current.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(16px)'
      })
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        .faq-section { background: var(--bg-base); padding: 96px 32px; border-top: 1px solid var(--border-subtle); }
        .faq-inner { max-width: 680px; margin: 0 auto; }
        .faq-label { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.16em; color: var(--accent); margin-bottom: 12px; }
        .faq-h2 { font-family: 'Instrument Serif', serif; font-size: clamp(26px, 3vw, 38px); font-weight: 400; color: var(--text-primary); margin-bottom: 48px; line-height: 1.2; }
        .faq-item { border-bottom: 1px solid var(--border-subtle); cursor: pointer; }
        .faq-item:first-of-type { border-top: 1px solid var(--border-subtle); }
        .faq-question { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 0; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 500; color: var(--text-primary); user-select: none; }
        .faq-chevron { width: 20px; height: 20px; flex-shrink: 0; color: var(--text-tertiary); transition: transform 300ms ease; font-size: 18px; display: flex; align-items: center; justify-content: center; }
        .faq-chevron.open { transform: rotate(45deg); color: var(--accent); }
        .faq-answer-wrap { overflow: hidden; max-height: 0; transition: max-height 350ms ease; }
        .faq-answer-wrap.open { max-height: 400px; }
        .faq-answer { font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.75; color: var(--text-secondary); padding-bottom: 22px; max-width: 580px; }
        @media (max-width: 640px) {
          .faq-section { padding: 72px 20px; }
          .faq-question { font-size: 15px; padding: 18px 0; }
        }
      `}</style>

      <section id="faq" className="faq-section">
        <div ref={ref} className="faq-inner">
          <p data-reveal className="faq-label">QUESTIONS</p>
          <h2 data-reveal className="faq-h2">Before you decide</h2>
          {faqs.map((faq, i) => (
            <div key={i} data-reveal className="faq-item" onClick={() => setOpen(open === i ? null : i)}>
              <div className="faq-question">
                <span>{faq.q}</span>
                <span className={`faq-chevron ${open === i ? 'open' : ''}`}>+</span>
              </div>
              <div className={`faq-answer-wrap ${open === i ? 'open' : ''}`}>
                <p className="faq-answer">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
