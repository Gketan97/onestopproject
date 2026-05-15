import { useEffect, useRef } from 'react'

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Business Analyst → Product Analyst, Flipkart',
    initials: 'PS',
    text: "I had been stuck at the same level for 2 years. I knew I was working hard but something wasn't clicking in my interviews or in my day-to-day work. One session with Ketan and I understood exactly what was missing — I was describing problems, not diagnosing them. Three months later I had an offer from Flipkart. I genuinely don't think that happens without this.",
    highlight: 'Three months later I had an offer from Flipkart.',
  },
  {
    name: 'Arjun Mehta',
    role: 'Operations Manager → Growth Analyst, Zepto',
    initials: 'AM',
    text: "I came from a non-analytics background and was convinced the data roles I wanted were not for me. Ketan didn't just give me frameworks — he showed me how he actually thinks through a problem. That shift in how I approach things has been worth more than any course I've taken. My manager now regularly asks for my read on things before making calls.",
    highlight: 'My manager now regularly asks for my read on things.',
  },
  {
    name: 'Sneha Rajan',
    role: 'Marketing Executive, Swiggy',
    initials: 'SR',
    text: "Honest review: I was sceptical. I've done expensive courses before and walked away with nothing I could use on Monday morning. This was completely different. Ketan gave me feedback that was specific to how I think — not generic advice. I now approach every business problem differently and it shows in my work. My skip-level noticed and mentioned it in my last review.",
    highlight: 'My skip-level noticed and mentioned it in my last review.',
  },
  {
    name: 'Rahul Nair',
    role: 'Data Analyst → Senior Analyst, PhonePe',
    initials: 'RN',
    text: "Ketan's own story resonated with me — I was in the same confused place he described. What I got from working with him wasn't just better interview skills. It was clarity on what I actually want and a clear way of thinking that makes me better at my current job every single day. Promoted within 6 months of our sessions.",
    highlight: 'Promoted within 6 months of our sessions.',
  },
]

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
              setTimeout(() => {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
                el.style.opacity = '1'
                el.style.transform = 'translateY(0)'
              }, i * 100)
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08 }
    )
    if (ref.current) {
      ref.current.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(20px)'
      })
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        .test-section {
          background: var(--bg-base);
          padding: 112px 32px;
          border-top: 1px solid var(--border-subtle);
        }
        .test-inner { max-width: 1100px; margin: 0 auto; }
        .test-header { margin-bottom: 56px; }
        .test-label {
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 0.16em; color: var(--accent); margin-bottom: 14px;
        }
        .test-h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(28px, 3.5vw, 42px);
          font-weight: 400; color: var(--text-primary);
          line-height: 1.2; margin-bottom: 0; max-width: 560px;
        }
        .test-h2 em {
          font-style: italic;
          background: linear-gradient(135deg, #FF6B9D, #A855F7);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .test-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .test-card {
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 18px; padding: 28px 26px;
          display: flex; flex-direction: column; gap: 20px;
          transition: border-color 200ms ease;
        }
        .test-card:hover { border-color: var(--border-default); }
        .test-person {
          display: flex; align-items: center; gap: 14px;
        }
        .test-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(255,107,157,0.2), rgba(168,85,247,0.2));
          border: 1px solid var(--border-subtle);
          display: flex; align-items: center; justify-content: center;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          font-weight: 600; color: var(--text-secondary);
          flex-shrink: 0;
        }
        .test-name {
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          font-weight: 600; color: var(--text-primary); margin-bottom: 2px;
        }
        .test-role {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.06em; color: var(--accent); line-height: 1.4;
        }
        .test-text {
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          line-height: 1.8; color: var(--text-secondary); flex: 1;
        }
        .test-highlight {
          font-family: 'Instrument Serif', serif;
          font-size: 15px; font-style: italic;
          color: var(--text-primary);
          padding: 12px 16px;
          background: rgba(168,85,247,0.06);
          border: 1px solid rgba(168,85,247,0.12);
          border-radius: 8px; line-height: 1.5;
        }
        .test-note {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.1em; color: var(--text-tertiary);
          text-align: center; margin-top: 32px;
        }

        @media (max-width: 768px) {
          .test-grid { grid-template-columns: 1fr; }
          .test-section { padding: 80px 24px; }
        }
        @media (max-width: 480px) {
          .test-section { padding: 64px 20px; }
          .test-card { padding: 22px 20px; }
        }
      `}</style>

      <section id="testimonials" className="test-section">
        <div ref={ref} className="test-inner">
          <div data-reveal className="test-header">
            <p className="test-label">WHAT PEOPLE SAY</p>
            <h2 className="test-h2">
              Career clarity.<br />
              <em>Not just better interview answers.</em>
            </h2>
          </div>

          <div data-reveal className="test-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="test-card">
                <div className="test-person">
                  <div className="test-avatar">{t.initials}</div>
                  <div>
                    <div className="test-name">{t.name}</div>
                    <div className="test-role">{t.role}</div>
                  </div>
                </div>
                <p className="test-text">{t.text}</p>
                <div className="test-highlight">"{t.highlight}"</div>
              </div>
            ))}
          </div>

          <p data-reveal className="test-note">
            TESTIMONIALS FROM KETAN'S MENTEES · NAMES SHARED WITH PERMISSION
          </p>
        </div>
      </section>
    </>
  )
}
