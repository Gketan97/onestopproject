'use client';

import { useEffect, useRef, useState } from 'react';
import type { CaseConfig } from '@/types';

interface Props {
  caseConfig: CaseConfig;
  onBegin: () => void;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const FADE_UP = (delay = 0, inView = true): React.CSSProperties => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateY(0)' : 'translateY(24px)',
  transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
});

const FADE_IN = (delay = 0, inView = true): React.CSSProperties => ({
  opacity: inView ? 1 : 0,
  transition: `opacity 0.7s ease ${delay}ms`,
});

export function CaseCharter({ caseConfig, onBegin }: Props) {
  const [heroIn, setHeroIn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setHeroIn(true), 80); return () => clearTimeout(t); }, []);

  const sec1 = useInView();
  const sec2 = useInView();
  const sec3 = useInView();
  const sec4 = useInView();
  const sec5 = useInView(0.1);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050508',
      color: '#F8FAFC',
      fontFamily: "'Geist', -apple-system, sans-serif",
      backgroundImage: `
        radial-gradient(circle at 0% 0%, rgba(139,92,246,0.04) 0%, transparent 40%),
        radial-gradient(circle at 100% 100%, rgba(255,122,47,0.04) 0%, transparent 40%)
      `,
      overflowY: 'auto',
      position: 'relative',
    }}>
      <style>{`
        @keyframes gradientShift {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes pulse-dot {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .node-card:hover { background: rgba(139,92,246,0.06) !important; }
        .portfolio-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.1) !important; }
        .cta-btn:hover { transform: scale(1.02); }
        .cta-btn:active { transform: scale(0.98); }
      `}</style>

      <div style={{
        position: 'fixed', top: '25%', left: '-80px',
        width: '380px', height: '380px',
        background: 'rgba(139,92,246,0.05)',
        filter: 'blur(150px)', borderRadius: '50%',
        pointerEvents: 'none', zIndex: 0,
        animation: 'float 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'fixed', bottom: 0, right: '-80px',
        width: '320px', height: '320px',
        background: 'rgba(255,122,47,0.05)',
        filter: 'blur(120px)', borderRadius: '50%',
        pointerEvents: 'none', zIndex: 0,
        animation: 'float 10s ease-in-out infinite reverse',
      }} />

      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        maxWidth: '1100px', margin: '0 auto',
        position: 'relative', zIndex: 1,
        ...FADE_IN(0, heroIn),
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #8B5CF6, #FF7A2F)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: 900, color: '#fff', fontStyle: 'italic',
          }}>OS</div>
          <span style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '-0.02em' }}>OneStop Careers</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#475569' }}>Senior Capstone</span>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF7A2F', animation: 'pulse-dot 2s ease-in-out infinite' }} />
          <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#475569' }}>Portfolio Grade: Career Ready</span>
        </div>
      </nav>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 40px 96px', position: 'relative', zIndex: 1 }}>

        <header style={{ marginBottom: '64px', paddingLeft: '32px', position: 'relative' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, width: '4px', height: '100%',
            background: 'linear-gradient(180deg, #FF7A2F, #8B5CF6, #FF7A2F)',
            backgroundSize: '100% 300%',
            animation: 'gradientShift 4s ease infinite',
            borderRadius: '2px',
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', ...FADE_UP(100, heroIn) }}>
            <span style={{
              background: 'rgba(62,207,142,0.1)', border: '1px solid rgba(62,207,142,0.2)',
              color: '#2DD4BF', padding: '4px 12px', borderRadius: '999px',
              fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
            }}>Portfolio Builder</span>
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#475569' }}>MakeMyTrip Series</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 700, letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, #FFF 0%, #94A3B8 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: '20px', lineHeight: 1.1,
            ...FADE_UP(180, heroIn),
          }}>
            {caseConfig.title}
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '18px', fontWeight: 300, lineHeight: 1.6, maxWidth: '640px', ...FADE_UP(280, heroIn) }}>
            Step in as a <strong style={{ color: '#fff', fontWeight: 500 }}>Strategic Problem Solver</strong>.
            Your task is to investigate a major drop in booking performance and present a data-backed plan to the board.
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '48px', marginBottom: '64px', alignItems: 'start' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

            <section ref={sec1.ref}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', ...FADE_UP(0, sec1.inView) }}>
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8B5CF6' }}>01 // How the Platform Works</span>
                <span style={{ fontSize: '10px', color: '#475569', fontStyle: 'italic', fontFamily: 'monospace' }}>Marketplace Value Flow</span>
              </div>
              <div style={{
                background: 'rgba(15,15,26,0.4)', backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px',
                padding: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
                ...FADE_UP(60, sec1.inView),
              }}>
                {[
                  { label: 'The Core Service', color: '#8B5CF6', text: 'A massive marketplace connecting travelers with hotels and stays. MMT manages discovery, trust, and secure payments.' },
                  { label: 'How MMT Makes Money', color: '#2DD4BF', text: 'We take a 10-15% commission from every hotel booking. If people stop booking, our revenue disappears.' },
                  { label: 'The Traveler Mix', color: '#8B5CF6', text: 'Our users range from high-spending business travelers to budget-conscious tourists looking for the best deal.' },
                  { label: 'The Stay Categories', color: '#2DD4BF', text: 'From 5-star luxury hotels to cozy homestays. The mix of what users see determines if they click Book.' },
                ].map((item, i) => (
                  <div key={i} className="node-card" style={{
                    borderLeft: `3px solid ${item.color}`,
                    background: 'rgba(255,255,255,0.02)', padding: '20px',
                    borderRadius: '0 12px 12px 0', transition: 'background 0.3s ease',
                    ...FADE_UP(120 + i * 60, sec1.inView),
                  }}>
                    <p style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: item.color, marginBottom: '8px' }}>{item.label}</p>
                    <p style={{ fontSize: '12px', color: '#F8FAFC', lineHeight: 1.6 }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section ref={sec2.ref}>
              <div style={{ marginBottom: '20px', ...FADE_UP(0, sec2.inView) }}>
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#FF7A2F' }}>02 // The Business Challenge</span>
              </div>
              <div style={{
                background: 'rgba(239,68,68,0.02)', backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px',
                ...FADE_UP(60, sec2.inView),
              }}>
                <h4 style={{ fontWeight: 700, fontSize: '20px', marginBottom: '12px', color: '#fef2f2', ...FADE_UP(100, sec2.inView) }}>
                  &ldquo;The Conversion Gap&rdquo;
                </h4>
                <p style={{ color: '#94A3B8', fontSize: '13px', lineHeight: 1.7, marginBottom: '28px', ...FADE_UP(140, sec2.inView) }}>
                  We are successfully getting more users into the app (+15%), but they are leaving without booking.
                  We need to find where the leak is and why the numbers are not adding up.
                </p>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1px',
                  background: 'rgba(255,255,255,0.05)', borderRadius: '16px',
                  overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  {[
                    { label: 'New Users', value: '+15%', color: '#2DD4BF', delay: 180 },
                    { label: 'Bookings/DAU', value: '-13.4%', color: '#f87171', delay: 240 },
                    { label: 'Total Revenue', value: '-16.5%', color: '#ef4444', delay: 300 },
                  ].map((stat) => (
                    <div key={stat.label} style={{
                      background: 'rgba(0,0,0,0.4)', padding: '20px', textAlign: 'center',
                      ...FADE_UP(stat.delay, sec2.inView),
                    }}>
                      <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#475569', marginBottom: '8px' }}>{stat.label}</p>
                      <p style={{ fontSize: '24px', fontWeight: 700, color: stat.color, letterSpacing: '-0.02em' }}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            <section ref={sec3.ref}>
              <div style={{ marginBottom: '16px', ...FADE_UP(0, sec3.inView) }}>
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#475569' }}>03 // Core Competencies</span>
              </div>
              <div style={{
                background: 'rgba(15,15,26,0.4)', backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px',
                ...FADE_UP(60, sec3.inView),
              }}>
                <p style={{
                  fontSize: '9px', color: '#475569', fontWeight: 700, letterSpacing: '0.2em',
                  textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.05)',
                  paddingBottom: '16px', marginBottom: '24px',
                }}>Through this project, you will learn to:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {[
                    { title: 'Think Like a Business Owner', body: 'Go beyond numbers. Understand how supply, demand, and pricing interact to drive profit.' },
                    { title: 'Structure Complex Problems', body: 'Break a massive drop into small, solvable segments using logical frameworks.' },
                    { title: 'Leverage AI for Analysis', body: 'Partner with your AI mentor to interpret data patterns and uncover hidden insights instantly.' },
                    { title: 'Report to Executives', body: 'Synthesize your findings into a clear, board-ready brief that drives real decision-making.' },
                  ].map((item, i) => (
                    <div key={i} style={{ ...FADE_UP(100 + i * 70, sec3.inView) }}>
                      <p style={{ fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#F8FAFC' }}>{item.title}</p>
                      <p style={{ fontSize: '11px', color: '#94A3B8', lineHeight: 1.6 }}>{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section ref={sec4.ref} style={{ ...FADE_UP(0, sec4.inView) }}>
              <div style={{
                background: '#FF7A2F', borderRadius: '24px', padding: '32px',
                boxShadow: '0 20px 50px rgba(255,122,47,0.2)',
              }}>
                <p style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#000', marginBottom: '20px', ...FADE_UP(60, sec4.inView) }}>
                  Final Portfolio Asset
                </p>
                <p style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.4, color: '#000', marginBottom: '28px', ...FADE_UP(100, sec4.inView) }}>
                  Complete this case to generate a high-impact Root Cause Analysis (RCA) Brief for your portfolio.
                </p>
                <button className="cta-btn" onClick={onBegin} style={{
                  width: '100%', padding: '16px', background: '#000', color: '#fff',
                  fontWeight: 700, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
                  border: 'none', borderRadius: '12px', cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  ...FADE_UP(140, sec4.inView),
                }}>
                  Initialize Project Charter
                </button>
                <div style={{
                  marginTop: '20px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '12px',
                  paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.1)',
                  ...FADE_UP(180, sec4.inView),
                }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', fontWeight: 900, color: '#000',
                  }}>A</div>
                  <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.6)' }}>
                    Mentor Arjun: Standing By
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <section ref={sec5.ref} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '48px' }}>
          <p style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: '#2DD4BF', textAlign: 'center', marginBottom: '32px',
            ...FADE_UP(0, sec5.inView),
          }}>The Portfolio Advantage</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '40px' }}>
            {[
              { icon: '📑', title: 'Resume Overhaul', body: 'Add a verified Senior RCA Project to your experience section. Prove you can handle high-stakes business challenges with data.', delay: 60 },
              { icon: '👀', title: 'Recruiter Magnet', body: 'Get a ready-to-use project description for LinkedIn and your personal website. Designed to catch FAANG-level hiring managers.', delay: 140 },
              { icon: '🔗', title: 'Shareable Artifact', body: 'Export your final Board Briefing as a professional PDF. Use it as a conversation starter in interviews.', delay: 220 },
            ].map((item) => (
              <div key={item.title} className="portfolio-card" style={{
                background: 'rgba(15,15,26,0.4)', backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
                ...FADE_UP(item.delay, sec5.inView),
              }}>
                <div style={{ fontSize: '24px', marginBottom: '12px' }}>{item.icon}</div>
                <p style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>{item.title}</p>
                <p style={{ fontSize: '11px', color: '#94A3B8', lineHeight: 1.6 }}>{item.body}</p>
              </div>
            ))}
          </div>
          <div style={{
            padding: '32px', background: 'rgba(15,15,26,0.4)', backdropFilter: 'blur(16px)',
            border: '1px dashed rgba(45,212,191,0.3)', borderRadius: '24px', textAlign: 'center',
            ...FADE_UP(300, sec5.inView),
          }}>
            <p style={{ fontSize: '13px', color: '#2DD4BF', fontWeight: 700, marginBottom: '8px' }}>Bonus: LinkedIn Power-Post Content</p>
            <p style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic' }}>
              Upon completion, we provide you with a pre-written, data-rich summary of your findings to post online and capture recruiter eyeballs instantly.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
