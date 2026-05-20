import { useState, useEffect, useRef } from 'react'

const faqs = [
  {
    q: 'Who is this for?',
    a: 'Any professional who works with data, makes decisions, or presents recommendations — and wants to do it better. PMs, analysts, consultants, founders, MBA students, and engineers who want to think more clearly.',
  },
  {
    q: 'Do I need a technical background?',
    a: "No. This is not about SQL, Python, or tools. It's about how you think through problems. Some of the sharpest thinkers in the lab come from non-technical backgrounds.",
  },
  {
    q: "What if I can't make a session?",
    a: 'Each session is recorded. But the live experience — watching Ketan break down your thinking in real time — is the most valuable part. Attendance is strongly recommended.',
  },
  {
    q: 'Why only 5 people?',
    a: 'Because meaningful feedback requires real attention. Ketan evaluates how each person thinks — not just what they answer. That depth is only possible in small groups.',
  },
  {
    q: 'What makes this different from other courses?',
    a: 'Most courses teach content. This lab evaluates thinking. You will leave knowing exactly where your analytical reasoning breaks down — and with frameworks to fix it.',
  },
  {
    q: 'Is ₹2,500 per session or a subscription?',
    a: 'Per session. No commitments, no auto-renewals. Book when it works for you.',
  },
  {
    q: 'What happens between Session 1 and Session 2?',
    a: 'After Session 1, you solve the remaining phases of the case independently using AI as a thinking partner. You build a structured report of your analysis and share it with Ketan on WhatsApp before Session 2. This independent work is where real skill gets built.',
  },
  {
    q: 'What should my report include?',
    a: 'Ketan will share a checklist in Session 1. Typically: your hypotheses, the methodology you followed, key findings per phase, your final recommendation, and which AI prompts you found most useful. Format is flexible — clarity of thinking is what matters.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
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
      },
      { threshold: 0.1 }
    )
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
        .faq-section {
          background: var(--bg-surface);
          padding: 112px 32px;
          border-top: 1px solid var(--border-subtle);
        }
        .faq-inner { max-width: 720px; margin: 0 auto; }
        .faq-h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(28px, 3vw, 40px);
          font-weight: 400; color: var(--text-primary);
          margin-bottom: 48px;
        }
        .faq-item {
          border-bottom: 1px solid var(--border-subtle);
          cursor: pointer;
        }
        .faq-item:first-of-type { border-top: 1px solid var(--border-subtle); }
        .faq-question {
          display: flex; align-items: center;
          justify-content: space-between; gap: 16px;
          padding: 24px 0;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; font-weight: 500;
          color: var(--text-primary);
          transition: color 200ms ease;
          user-select: none;
        }
        .faq-item:hover .faq-question { color: var(--text-primary); }
        .faq-chevron {
          width: 20px; height: 20px; flex-shrink: 0;
          color: var(--text-tertiary);
          transition: transform 300ms ease;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
        }
        .faq-chevron.open { transform: rotate(45deg); color: var(--accent); }
        .faq-answer-wrap {
          overflow: hidden;
          max-height: 0;
          transition: max-height 350ms ease;
        }
        .faq-answer-wrap.open { max-height: 300px; }
        .faq-answer {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; line-height: 1.75;
          color: var(--text-secondary);
          padding-bottom: 24px;
          max-width: 600px;
        }
        @media (max-width: 640px) {
          .faq-section { padding: 80px 24px; }
          .faq-question { font-size: 15px; padding: 20px 0; }
        }
        @media (max-width: 480px) {
          .faq-section { padding: 64px 20px; }
        }
      `}</style>

      <section id="faq" className="faq-section">
        <div ref={ref} className="faq-inner">
          <h2 data-reveal className="faq-h2">Common questions</h2>
          {faqs.map((faq, i) => (
            <div
              key={i}
              data-reveal
              className="faq-item"
              onClick={() => setOpen(open === i ? null : i)}
            >
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
