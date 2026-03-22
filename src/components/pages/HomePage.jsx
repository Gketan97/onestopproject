
import React from 'react';
import { Link } from 'react-router-dom';

const testimonials = [
  {
    quote: "Got my first Swiggy screening call two days after sharing the portfolio link. The interviewer had looked at my investigation before the call.",
    name: "Prateek S.",
    role: "Data Analyst · Bangalore",
    phase: 1,
  },
  {
    quote: "The gap exercise at the start was humbling. I thought I knew how to do this. I was missing 60% of what a senior analyst would write.",
    name: "Anika R.",
    role: "2 YOE · Mumbai",
    phase: 2,
  },
  {
    quote: "I'd been prepping for 3 months. This was the first thing that actually made me think instead of memorise. Cleared Razorpay L3 last month.",
    name: "Rohan M.",
    role: "L3 @ Razorpay · Hyderabad",
    phase: 3,
  },
];

const phaseColors = {
  1: { border: '#C84B0C', bg: '#FDF2EC', label: 'Phase 1', labelColor: '#C84B0C' },
  2: { border: '#1E4FCC', bg: '#EDF1FD', label: 'Phase 2', labelColor: '#1E4FCC' },
  3: { border: '#1A6B45', bg: '#EDF6F1', label: 'Phase 3', labelColor: '#1A6B45' },
};

const interviewQs = [
  '"Walk me through a metric drop investigation."',
  '"How do you distinguish correlation from causation?"',
  '"Tell me about a time you were wrong mid-investigation."',
  '"Tell me about a complex, multi-factor problem."',
  '"How would you improve Swiggy\'s restaurant ranking?"',
  '"How do you design a metric from scratch?"',
];

const HomePage = () => {
  return (
    <main className="w-full">

      {/* ── Hero ── */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 pt-16 pb-12 md:pt-24 md:pb-20 text-center">
        <p className="label mb-4">For analysts targeting Swiggy · Razorpay · Flipkart · Uber</p>
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight text-ink mb-6">
          Your career struggle<br />
          <em className="not-italic text-accent">ends here.</em>
        </h1>
        <p className="text-base md:text-lg text-ink2 max-w-xl mx-auto mb-10 leading-relaxed">
          Jobs and referrals to find the role. Case studies to earn it — by learning to think like a ₹28L analyst.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/case-studies/swiggy"
            className="px-7 py-4 brand-button font-medium text-base rounded-lg shadow-sm w-full sm:w-auto text-center"
          >
            Start free case study →
          </a>
          <Link
            to="/jobs"
            className="px-7 py-4 text-base font-medium text-ink2 bg-surface border border-border rounded-lg hover:bg-surface2 transition-colors w-full sm:w-auto text-center"
          >
            Browse jobs
          </Link>
        </div>
        <p className="text-xs text-ink3 mt-4">Free · No account needed · ~45 min</p>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-border" />

      {/* ── Case Study Feature ── */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="label mb-2">The revenue product</p>
            <h2 className="font-serif text-3xl md:text-4xl text-ink">Case Studies</h2>
          </div>
          <span className="pill pill-surface">Case 01 · Live · Free</span>
        </div>

        {/* Dark hook card */}
        <div className="bg-ink rounded-xl p-6 md:p-8 mb-8">
          <p className="font-mono text-xs text-white/40 tracking-widest uppercase mb-5">The answer is not:</p>
          <div className="flex flex-col gap-3 mb-6">
            {['SQL fluency — everyone who applies can write queries', 'Dashboard experience — that\'s table stakes', 'Knowing the right frameworks — everyone has memorised them'].map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-red-400 font-bold text-lg leading-none">×</span>
                <p className="text-white/70 text-sm">{t}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-5 flex items-start gap-3">
            <span className="text-green-400 font-bold text-lg leading-none mt-0.5">→</span>
            <p className="text-white font-medium text-base leading-relaxed">
              It's how they think through a problem under pressure — structured, fast, without being told what to look at next.
            </p>
          </div>
        </div>

        {/* 3 phases */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { phase: 1, title: 'Watch', sub: '~20 min · Free', desc: 'A 10-year Swiggy analyst works a real incident live. Predict his moves before each step.' },
            { phase: 2, title: 'Practice', sub: '~25 min · Free', desc: 'Same business problem, one layer deeper. Your SQL. Your reasoning. AI evaluates what you actually wrote.' },
            { phase: 3, title: 'Execute', sub: '₹499 · Advanced', desc: 'Open workbench. Cohort analysis, LTV model, metric design, ranking algorithm. Portfolio export.' },
          ].map(({ phase, title, sub, desc }) => {
            const c = phaseColors[phase];
            return (
              <div
                key={phase}
                className="relative border rounded-xl p-5 overflow-hidden"
                style={{ borderColor: c.border, background: c.bg }}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: c.border }} />
                <span className="font-mono text-[10px] font-semibold tracking-widest uppercase mb-2 block" style={{ color: c.labelColor }}>
                  Phase {phase} · {sub}
                </span>
                <p className="font-semibold text-ink text-base mb-2">{title}</p>
                <p className="text-ink2 text-sm leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>

        {/* Interview Qs */}
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="bg-surface px-5 py-3 border-b border-border">
            <p className="label">6 interview questions this case prepares</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
            {interviewQs.map((q, i) => (
              <div key={i} className="bg-bg px-5 py-4 text-sm text-ink2 leading-snug italic">
                {q}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/case-studies/swiggy"
            className="inline-flex items-center px-8 py-4 brand-button font-medium text-base rounded-lg"
          >
            Find out how you think now →
          </a>
          <p className="text-xs text-ink3 mt-3">Free · No account · ~45 min total</p>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-border" />

      {/* ── Jobs + Referrals teaser ── */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="mb-10">
          <p className="label mb-2">The traffic layer</p>
          <h2 className="font-serif text-3xl md:text-4xl text-ink">Jobs & Referrals</h2>
          <p className="text-ink2 mt-3 text-base max-w-lg">
            1,200+ live data analyst roles. 84 employees offering direct referrals. All in one place.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link
            to="/jobs"
            className="group block bg-surface border border-border rounded-xl p-6 hover:border-border2 transition-colors relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-phase3" />
            <span className="font-mono text-[10px] font-semibold tracking-widest uppercase text-phase3 mb-3 block">Jobs · 1,240 live</span>
            <p className="font-semibold text-ink text-base mb-2">Data analyst roles</p>
            <p className="text-ink2 text-sm leading-relaxed">Swiggy · Razorpay · Flipkart · Uber India · Meesho and more.</p>
            <p className="text-accent text-sm font-medium mt-4 group-hover:underline">Browse all jobs →</p>
          </Link>
          <Link
            to="/jobs"
            className="group block bg-surface border border-border rounded-xl p-6 hover:border-border2 transition-colors relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: '#9B5200' }} />
            <span className="font-mono text-[10px] font-semibold tracking-widest uppercase mb-3 block" style={{ color: '#9B5200' }}>Referrals · 84 open</span>
            <p className="font-semibold text-ink text-base mb-2">Get referred directly</p>
            <p className="text-ink2 text-sm leading-relaxed">Employees at top companies ready to refer. One message to get in the door.</p>
            <p className="text-accent text-sm font-medium mt-4 group-hover:underline">See referrers →</p>
          </Link>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-border" />

      {/* ── Testimonials ── */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <p className="label mb-2">What people say</p>
        <h2 className="font-serif text-3xl md:text-4xl text-ink mb-10">After completing the case</h2>
        <div className="flex flex-col gap-4">
          {testimonials.map((t, i) => {
            const c = phaseColors[t.phase];
            return (
              <div
                key={i}
                className="bg-surface border border-border rounded-xl p-6"
                style={{ borderLeft: `3px solid ${c.border}` }}
              >
                <p className="text-ink text-sm leading-relaxed italic mb-4">"{t.quote}"</p>
                <div>
                  <p className="font-semibold text-ink text-sm">{t.name}</p>
                  <p className="text-xs text-ink3 mt-0.5">{t.role}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-ink">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-14 md:py-20 text-center">
          <p className="font-mono text-xs text-white/40 tracking-widest uppercase mb-4">Ready to start?</p>
          <h2 className="font-serif text-3xl md:text-5xl text-white leading-tight mb-6">
            Stop memorising.<br />Start investigating.
          </h2>
          <p className="text-white/60 text-base mb-8 max-w-md mx-auto">
            The Swiggy case study is free. No account. 45 minutes. You'll see exactly where your thinking has gaps.
          </p>
          <a
            href="/case-studies/swiggy"
            className="inline-flex items-center px-8 py-4 bg-accent text-white font-medium text-base rounded-lg hover:bg-accent-dark transition-all hover:-translate-y-px"
          >
            Start the investigation →
          </a>
        </div>
      </section>

    </main>
  );
};

export default HomePage;
