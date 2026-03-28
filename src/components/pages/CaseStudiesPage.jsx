// src/components/pages/CaseStudiesPage.jsx
// Catalog page: shows all case studies — Swiggy complete, rest locked

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock, CheckCircle, Clock } from 'lucide-react';

// Renders abbr badge immediately; upgrades to real logo if URL resolves
const CompanyLogo = ({ company, logo, accent }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const abbr = company.slice(0, 2).toUpperCase();
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
      style={{ background: imgLoaded ? 'var(--bg)' : (accent + '18'), border: '1px solid var(--border)', position: 'relative' }}>
      {!imgLoaded && (
        <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 800, color: accent }}>{abbr}</span>
      )}
      <img
        src={logo}
        alt={company}
        onLoad={() => setImgLoaded(true)}
        onError={() => setImgLoaded(false)}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'contain', padding: '6px',
          opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.2s',
        }}
      />
    </div>
  );
};

const CASE_STUDIES = [
  {
    id: 'swiggy',
    company: 'Swiggy',
    logo: 'https://logo.clearbit.com/swiggy.com',
    tag: 'Orders Investigation',
    title: 'Why did orders drop 18% in Bangalore last Tuesday?',
    desc: 'A real drop. Real tables. Real time pressure. Investigate alongside Arjun — a 10-year Swiggy analyst.',
    time: '~45 min',
    difficulty: 'Intermediate',
    phases: ['Watch', 'Practice', 'Execute'],
    status: 'available',
    free: true,
    accent: '#FC8019',
    accentBg: 'rgba(252,128,25,0.10)',
    accentBorder: 'rgba(252,128,25,0.25)',
  },
  {
    id: 'zomato',
    company: 'Zomato',
    logo: 'https://logo.clearbit.com/zomato.com',
    tag: 'Restaurant Rankings',
    title: 'Restaurant discovery is broken in Tier-2 cities.',
    desc: 'Investigate why restaurants with high ratings aren\'t surfacing in search. Redesign the ranking model.',
    time: '~50 min',
    difficulty: 'Advanced',
    phases: ['Watch', 'Practice', 'Execute'],
    status: 'coming_soon',
    free: false,
    accent: '#E23744',
    accentBg: 'rgba(226,55,68,0.10)',
    accentBorder: 'rgba(226,55,68,0.25)',
  },
  {
    id: 'razorpay',
    company: 'Razorpay',
    logo: 'https://logo.clearbit.com/razorpay.com',
    tag: 'Payment Failures',
    title: 'Payment success rates dropped 3% overnight.',
    desc: 'Segment the failure modes, identify root causes across gateways, banks, and devices.',
    time: '~40 min',
    difficulty: 'Intermediate',
    phases: ['Watch', 'Practice', 'Execute'],
    status: 'coming_soon',
    free: false,
    accent: '#2B64F5',
    accentBg: 'rgba(43,100,245,0.10)',
    accentBorder: 'rgba(43,100,245,0.25)',
  },
  {
    id: 'meesho',
    company: 'Meesho',
    logo: 'https://logo.clearbit.com/meesho.com',
    tag: 'Supplier Quality',
    title: 'Return rates in fashion are 3× higher than electronics.',
    desc: 'Build the framework to identify bad suppliers, quantify impact, and recommend action to the category head.',
    time: '~45 min',
    difficulty: 'Intermediate',
    phases: ['Watch', 'Practice', 'Execute'],
    status: 'coming_soon',
    free: false,
    accent: '#9B59B6',
    accentBg: 'rgba(155,89,182,0.10)',
    accentBorder: 'rgba(155,89,182,0.25)',
  },
  {
    id: 'phonepe',
    company: 'PhonePe',
    logo: 'https://logo.clearbit.com/phonepe.com',
    tag: 'User Activation',
    title: 'New users install but never transact.',
    desc: 'Map the activation funnel, find the drop-off, design the intervention. Present to the growth team.',
    time: '~40 min',
    difficulty: 'Beginner',
    phases: ['Watch', 'Practice', 'Execute'],
    status: 'coming_soon',
    free: false,
    accent: '#5F259F',
    accentBg: 'rgba(95,37,159,0.10)',
    accentBorder: 'rgba(95,37,159,0.25)',
  },
  {
    id: 'uber',
    company: 'Uber',
    logo: 'https://logo.clearbit.com/uber.com',
    tag: 'Driver Supply',
    title: 'Driver supply is 20% below demand in peak hours.',
    desc: 'Diagnose whether this is a supply, incentive, or routing problem — and quantify the revenue impact.',
    time: '~50 min',
    difficulty: 'Advanced',
    phases: ['Watch', 'Practice', 'Execute'],
    status: 'coming_soon',
    free: false,
    accent: 'rgba(232,234,242,0.7)',
    accentBg: 'rgba(232,234,242,0.08)',
    accentBorder: 'rgba(232,234,242,0.18)',
  },
];

const diffColor = {
  Beginner:     { color: '#3DD68C', bg: 'rgba(61,214,140,0.10)',  border: 'rgba(61,214,140,0.25)' },
  Intermediate: { color: '#F9E2AF', bg: 'rgba(249,226,175,0.10)', border: 'rgba(249,226,175,0.25)' },
  Advanced:     { color: '#F38BA8', bg: 'rgba(243,139,168,0.10)', border: 'rgba(243,139,168,0.25)' },
};

const CaseCard = ({ cs }) => {
  const dc = diffColor[cs.difficulty] || diffColor.Intermediate;
  const isAvailable = cs.status === 'available';

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        border: `1px solid ${isAvailable ? cs.accentBorder : 'var(--border)'}`,
        background: isAvailable ? cs.accentBg : 'var(--surface)',
        opacity: isAvailable ? 1 : 0.72,
      }}
    >
      {/* top accent line */}
      <div style={{ height: 3, background: isAvailable ? cs.accent : 'var(--border2)' }} />

      <div className="p-5 md:p-6">
        {/* header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <CompanyLogo company={cs.company} logo={cs.logo} accent={cs.accent} />
            <div>
              <p style={{ fontFamily: 'var(--mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink3)' }}>
                {cs.company} · {cs.tag}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                {isAvailable
                  ? <span className="inline-flex items-center gap-1" style={{ fontFamily: 'var(--mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: cs.accent }}>
                      <CheckCircle size={10} /> Free · Available now
                    </span>
                  : <span className="inline-flex items-center gap-1" style={{ fontFamily: 'var(--mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink3)' }}>
                      <Lock size={9} /> Coming soon
                    </span>
                }
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 px-2 py-1 rounded-lg" style={{ background: dc.bg, border: `1px solid ${dc.border}` }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: dc.color }}>
              {cs.difficulty}
            </span>
          </div>
        </div>

        {/* content */}
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', color: 'var(--ink)', lineHeight: 1.25, marginBottom: '8px' }}>
          {cs.title}
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.55, marginBottom: '16px' }}>{cs.desc}</p>

        {/* meta row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5" style={{ color: 'var(--ink3)', fontSize: '11px' }}>
            <Clock size={11} />
            <span style={{ fontFamily: 'var(--mono)' }}>{cs.time}</span>
          </div>
          <div className="flex gap-1.5">
            {cs.phases.map((ph, i) => (
              <span key={ph} className="px-2 py-0.5 rounded-md"
                style={{ fontFamily: 'var(--mono)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
                  background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--ink3)' }}>
                {ph}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        {isAvailable
          ? <div className="flex flex-col gap-2">
              <Link to="/strategy/swiggy"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold transition-all hover:-translate-y-px"
                style={{ background: cs.accent, fontSize: '13px', boxShadow: `0 3px 12px ${cs.accent}40` }}
                onMouseEnter={e => e.currentTarget.style.filter='brightness(0.9)'}
                onMouseLeave={e => e.currentTarget.style.filter='brightness(1)'}>
                ⚡ Strategic Simulator — free <ArrowRight size={13} />
              </Link>
              <Link to="/case-study/swiggy"
                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl transition-colors"
                style={{ background: 'var(--surface2)', fontSize: '12px', color: 'var(--ink3)', border: '1px solid var(--border)' }}>
                SQL Investigation (classic)
              </Link>
            </div>
          : <div className="flex items-center justify-center gap-2 w-full py-3 rounded-xl"
              style={{ background: 'var(--surface2)', fontSize: '13px', color: 'var(--ink3)', border: '1px solid var(--border)' }}>
              <Lock size={12} /> Coming soon
            </div>
        }
      </div>
    </div>
  );
};

const CaseStudiesPage = () => (
  <div className="min-h-screen" style={{ background: 'var(--bg)', fontFamily: 'var(--sans)' }}>
    <section className="max-w-5xl mx-auto px-5 pt-14 pb-10 md:pt-20">
      <div className="text-center mb-12">
        <p style={{ fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: '16px' }}>
          Case Studies
        </p>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', color: 'var(--ink)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '16px' }}>
          Real problems. Real companies.<br />
          <em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>Real interview skills.</em>
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--ink2)', maxWidth: 480, margin: '0 auto' }}>
          Each case study is a 3-phase investigation. Watch an expert, practice under time pressure, then execute like it's your first week on the job.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {CASE_STUDIES.map(cs => <CaseCard key={cs.id} cs={cs} />)}
      </div>

      <div className="text-center mt-12 py-6" style={{ border: '1px dashed var(--border2)', borderRadius: 16 }}>
        <p style={{ fontSize: '13px', color: 'var(--ink3)' }}>
          More companies being added every month.{' '}
          <a href="/jobs" style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: 2 }}>
            Browse analytics jobs →
          </a>
        </p>
      </div>
    </section>
  </div>
);

export default CaseStudiesPage;
