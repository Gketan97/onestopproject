'use client';

import { useState } from 'react';
import type { CaseConfig } from '@/types';

interface Props {
  caseConfig: CaseConfig;
  onComplete: () => void;
}

type Screen = 'business' | 'metrics' | 'problem' | 'arjun' | 'data';
const SCREENS: Screen[] = ['business', 'metrics', 'problem', 'arjun', 'data'];

const SCREEN_LABELS: Record<Screen, string> = {
  business: 'The business',
  metrics:  'The metrics',
  problem:  'The problem',
  arjun:    'Your mentor',
  data:     'Your data',
};

export function CaseIntro({ caseConfig, onComplete }: Props) {
  const [screen, setScreen] = useState<Screen>('business');
  const idx = SCREENS.indexOf(screen);
  const isLast = idx === SCREENS.length - 1;

  function next() { isLast ? onComplete() : setScreen(SCREENS[idx + 1]); }
  function back() { if (idx > 0) setScreen(SCREENS[idx - 1]); }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: 'var(--bg)',
    }}>

      {/* Top progress bar */}
      <div style={{
        padding: '16px 0 0',
        display: 'flex',
        justifyContent: 'center',
        gap: '6px',
        flexShrink: 0,
      }}>
        {SCREENS.map((s, i) => (
          <div key={s} style={{
            height: '3px',
            width: i === idx ? '32px' : '20px',
            borderRadius: '2px',
            background: i < idx
              ? 'var(--orange)'
              : i === idx
              ? 'var(--orange)'
              : 'var(--border-md)',
            opacity: i < idx ? 0.4 : 1,
            transition: 'all 0.4s var(--ease)',
          }} />
        ))}
      </div>

      {/* Screen label */}
      <div style={{ textAlign: 'center', padding: '10px 0 0', flexShrink: 0 }}>
        <span style={{
          fontSize: '10px',
          fontWeight: 700,
          color: 'var(--ink4)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          {idx + 1} / {SCREENS.length} — {SCREEN_LABELS[screen]}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto' }} key={screen}>
        {screen === 'business' && <BusinessScreen />}
        {screen === 'metrics'  && <MetricsScreen />}
        {screen === 'problem'  && <ProblemScreen caseConfig={caseConfig} />}
        {screen === 'arjun'    && <ArjunScreen caseConfig={caseConfig} />}
        {screen === 'data'     && <DataScreen />}
      </div>

      {/* Navigation */}
      <div style={{
        padding: '20px 40px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <button
          onClick={back}
          style={{
            padding: '8px 0',
            background: 'transparent',
            border: 'none',
            color: idx === 0 ? 'transparent' : 'var(--ink3)',
            fontSize: '13px',
            cursor: idx === 0 ? 'default' : 'pointer',
            pointerEvents: idx === 0 ? 'none' : 'auto',
            transition: 'color var(--t-fast)',
          }}
          onMouseEnter={e => { if (idx > 0) e.currentTarget.style.color = 'var(--ink1)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink3)'; }}
        >
          ← Back
        </button>

        <button
          onClick={next}
          style={{
            padding: '11px 28px',
            background: isLast ? 'var(--green)' : 'var(--orange)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '-0.01em',
            boxShadow: isLast ? 'var(--glow-green)' : 'var(--glow-orange)',
            transition: 'opacity var(--t-fast)',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          {isLast ? 'Begin investigation →' : 'Continue →'}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SHARED LAYOUT
// ─────────────────────────────────────────────────────────────

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      maxWidth: '620px',
      margin: '0 auto',
      padding: '32px 40px 24px',
      width: '100%',
      animation: 'slideUp 0.35s var(--ease) both',
    }}>
      {children}
    </div>
  );
}

function Label({ text, color = 'var(--orange)' }: { text: string; color?: string }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '3px 10px',
      background: `${color}18`,
      border: `1px solid ${color}30`,
      borderRadius: '20px',
      marginBottom: '18px',
    }}>
      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: color }} />
      <span style={{ fontSize: '10px', fontWeight: 700, color, letterSpacing: '0.08em' }}>
        {text}
      </span>
    </div>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h1 style={{
      fontSize: '26px',
      fontWeight: 700,
      color: 'var(--ink1)',
      letterSpacing: '-0.03em',
      lineHeight: 1.2,
      marginBottom: '10px',
    }}>
      {children}
    </h1>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '14px',
      color: 'var(--ink3)',
      lineHeight: 1.75,
      marginBottom: '28px',
    }}>
      {children}
    </p>
  );
}

function Divider() {
  return <div style={{ height: '1px', background: 'var(--border)', margin: '24px 0' }} />;
}

// ─────────────────────────────────────────────────────────────
// SCREEN 1 — THE BUSINESS
// ─────────────────────────────────────────────────────────────

function BusinessScreen() {
  return (
    <Screen>
      <Label text="The business" />
      <Heading>
        How does MakeMyTrip<br />
        <span style={{ color: 'var(--ink3)' }}>actually make money?</span>
      </Heading>
      <Body>
        You have booked a hotel on an app before. You paid the hotel.
        But MakeMyTrip also got paid — and understanding exactly how
        is the foundation of everything in this case study.
      </Body>

      {/* Commission model */}
      <div style={{
        padding: '20px',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '12px',
      }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--orange)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
          The commission model
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { step: '1', text: 'You search for hotels in Goa for the weekend', icon: '🔍' },
            { step: '2', text: 'MakeMyTrip shows you results — hotels pay to be listed and ranked', icon: '📋' },
            { step: '3', text: 'You book a hotel for ₹4,800 per night', icon: '✅' },
            { step: '4', text: 'MakeMyTrip keeps 10–15% as commission — roughly ₹576', icon: '💰' },
          ].map(item => (
            <div key={item.step} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}>
              <div style={{
                width: '28px', height: '28px',
                borderRadius: '50%',
                background: 'var(--orange-dim)',
                border: '1px solid rgba(255,122,47,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 700, color: 'var(--orange)',
                flexShrink: 0,
              }}>
                {item.step}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.6, paddingTop: '4px' }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* Two-sided marketplace */}
      <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>
        A two-sided marketplace
      </p>
      <p style={{ fontSize: '13px', color: 'var(--ink3)', lineHeight: 1.7, marginBottom: '16px' }}>
        MakeMyTrip has two kinds of customers — not one. Both sides have to be healthy for the business to work.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        {[
          {
            side: 'Travelers',
            desc: 'They want to find the right hotel quickly, at a fair price, with reliable information.',
            metric: 'Measured by: Bookings/DAU',
            color: 'var(--blue)',
          },
          {
            side: 'Hotels',
            desc: 'They want their properties seen by the right travelers. They pay for visibility and bookings.',
            metric: 'Measured by: Listing CVR',
            color: 'var(--orange)',
          },
        ].map(item => (
          <div key={item.side} style={{
            padding: '16px',
            background: 'var(--elevated)',
            border: `1px solid ${item.color}20`,
            borderTop: `2px solid ${item.color}`,
            borderRadius: 'var(--radius-md)',
          }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink1)', marginBottom: '8px' }}>
              {item.side}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--ink3)', lineHeight: 1.6, marginBottom: '10px' }}>
              {item.desc}
            </p>
            <p style={{ fontSize: '10px', fontWeight: 600, color: item.color, letterSpacing: '0.04em' }}>
              {item.metric}
            </p>
          </div>
        ))}
      </div>

      <div style={{
        padding: '14px 18px',
        background: 'rgba(255,122,47,0.06)',
        border: '1px solid rgba(255,122,47,0.15)',
        borderRadius: 'var(--radius-md)',
      }}>
        <p style={{ fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--orange)', fontWeight: 600 }}>Why this matters for the case: </strong>
          When a metric drops, you always ask — is this a traveler problem, a hotel problem, or both?
          The answer determines which team owns the fix.
        </p>
      </div>
    </Screen>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 2 — THE METRICS
// ─────────────────────────────────────────────────────────────

function MetricsScreen() {
  const METRICS = [
    {
      name: 'DAU',
      full: 'Daily Active Users',
      plain: 'How many people opened the MakeMyTrip app or website today.',
      analogy: 'Footfall in a physical store. More is good — but only if they buy something.',
      healthy: '10–12 million on a typical day',
      color: 'var(--blue)',
    },
    {
      name: 'CVR',
      full: 'Conversion Rate',
      plain: 'The percentage of sessions that end in a booking.',
      analogy: 'Out of every 100 people who walk into a store, how many leave with something.',
      healthy: '7–9% on a good day across all user types',
      color: 'var(--orange)',
    },
    {
      name: 'Bookings / DAU',
      full: 'The north star metric',
      plain: 'Total completed bookings divided by daily active users. Did today’s users actually book?',
      analogy: 'Revenue per visitor in a store. Captures both how many came AND how many converted.',
      healthy: 'Around 8% — meaning 8 out of every 100 daily users complete a booking',
      color: 'var(--orange)',
      isNorthStar: true,
    },
    {
      name: 'ABV',
      full: 'Average Booking Value',
      plain: 'The average revenue MakeMyTrip earns per completed booking.',
      analogy: 'Average basket size at checkout. A drop here means high-paying customers are leaving.',
      healthy: 'Around $290–$310 per booking',
      color: 'var(--green)',
    },
  ];

  return (
    <Screen>
      <Label text="The metrics" />
      <Heading>
        Four numbers.<br />
        <span style={{ color: 'var(--ink3)' }}>You need to know all of them.</span>
      </Heading>
      <Body>
        Every insight in this case comes from these four metrics.
        Read each one carefully — you will see them constantly.
      </Body>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {METRICS.map((m, i) => (
          <div key={m.name} style={{
            padding: '18px 20px',
            background: m.isNorthStar ? 'rgba(255,122,47,0.06)' : 'var(--card-bg)',
            border: `1px solid ${m.isNorthStar ? 'rgba(255,122,47,0.2)' : 'var(--card-border)'}`,
            borderRadius: 'var(--radius-lg)',
            animation: `slideUp ${0.1 + i * 0.07}s var(--ease) both`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{
                padding: '3px 10px',
                background: `${m.color}18`,
                border: `1px solid ${m.color}30`,
                borderRadius: 'var(--radius-sm)',
              }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: m.color, fontFamily: 'var(--font-mono)' }}>
                  {m.name}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--ink3)' }}>{m.full}</span>
              {m.isNorthStar && (
                <span style={{
                  fontSize: '9px', fontWeight: 700,
                  color: 'var(--orange)',
                  background: 'var(--orange-dim)',
                  border: '1px solid rgba(255,122,47,0.25)',
                  padding: '2px 7px', borderRadius: '10px',
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  marginLeft: 'auto',
                }}>
                  North star
                </span>
              )}
            </div>

            <p style={{ fontSize: '14px', color: 'var(--ink1)', fontWeight: 500, lineHeight: 1.6, marginBottom: '8px' }}>
              {m.plain}
            </p>

            <p style={{ fontSize: '12px', color: 'var(--ink3)', lineHeight: 1.6, marginBottom: '10px' }}>
              <span style={{ color: 'var(--ink4)', fontWeight: 500 }}>Think of it like: </span>
              {m.analogy}
            </p>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '4px 10px',
              background: 'var(--elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
            }}>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--green)' }} />
              <span style={{ fontSize: '11px', color: 'var(--ink3)' }}>
                <span style={{ color: 'var(--ink4)', fontWeight: 500 }}>Healthy: </span>
                {m.healthy}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 3 — THE PROBLEM
// ─────────────────────────────────────────────────────────────

function ProblemScreen({ caseConfig }: { caseConfig: CaseConfig }) {
  const ROWS = [
    { metric: 'Bookings / DAU', what: 'North star — the ratio we are investigating', before: '8.2%', after: '7.1%', delta: '−13.4%', bad: true },
    { metric: 'Daily Active Users', what: 'Users opening the app each day', before: '10M', after: '11.5M', delta: '+15%', bad: false },
    { metric: 'Total bookings / day', what: 'Completed hotel bookings', before: '820K', after: '820K', delta: 'flat', bad: true },
    { metric: 'Revenue / day', what: 'Platform commission earned', before: '$24.8M', after: '$20.7M', delta: '−16.5%', bad: true },
    { metric: 'Avg booking value', what: 'Revenue per completed booking', before: '$302', after: '$252', delta: '−16.6%', bad: true },
  ];

  return (
    <Screen>
      <Label text="The problem" />

      {/* Hero number */}
      <div style={{
        padding: '28px 24px',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-xl)',
        marginBottom: '20px',
        textAlign: 'center',
        animation: 'scaleIn 0.4s var(--ease) both',
      }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Bookings / DAU — 60 day change
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '16px', marginBottom: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '11px', color: 'var(--ink4)', marginBottom: '4px' }}>60 days ago</p>
            <p style={{ fontSize: '36px', fontWeight: 700, color: 'var(--ink3)', letterSpacing: '-0.04em', fontFamily: 'var(--font-mono)' }}>8.2%</p>
          </div>
          <p style={{ fontSize: '24px', color: 'var(--ink4)', marginBottom: '8px' }}>→</p>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '11px', color: 'var(--ink4)', marginBottom: '4px' }}>Today</p>
            <p style={{ fontSize: '36px', fontWeight: 700, color: 'var(--ink1)', letterSpacing: '-0.04em', fontFamily: 'var(--font-mono)' }}>7.1%</p>
          </div>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '8px 20px',
          background: 'rgba(255,77,77,0.08)',
          border: '1px solid rgba(255,77,77,0.2)',
          borderRadius: '20px',
        }}>
          <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--red)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}>
            −13.4%
          </span>
          <span style={{ fontSize: '12px', color: 'var(--ink3)' }}>over 60 days</span>
        </div>
      </div>

      {/* CEO message — short */}
      <div style={{
        padding: '16px 20px',
        background: 'var(--elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '20px',
        display: 'flex',
        gap: '14px',
        alignItems: 'flex-start',
        animation: 'slideUp 0.3s var(--ease) both',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'rgba(255,77,77,0.1)',
          border: '1px solid rgba(255,77,77,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: 700, color: 'var(--red)',
          flexShrink: 0,
        }}>D</div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink1)' }}>Deep Kalra, CEO</p>
            <span style={{ fontSize: '10px', color: 'var(--red)', background: 'rgba(255,77,77,0.1)', padding: '1px 7px', borderRadius: '8px', fontWeight: 600 }}>Urgent</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.7 }}>
            Our Bookings/DAU dropped 13% over 60 days. DAU is up 15% — so more people are using the app but fewer are booking.
            I need the full root cause brief before Friday’s board meeting. Find out what broke.
          </p>
        </div>
      </div>

      {/* Metrics table */}
      <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
        The full picture
      </p>
      <div style={{
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        marginBottom: '16px',
      }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 80px 80px 70px',
          padding: '10px 16px',
          background: 'var(--elevated)',
          gap: '8px',
        }}>
          {['Metric', 'Before', 'Now', 'Change'].map(h => (
            <span key={h} style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ink4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>
        {ROWS.map((row, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '1fr 80px 80px 70px',
            padding: '12px 16px',
            background: i % 2 === 0 ? 'var(--card-bg)' : 'var(--elevated)',
            gap: '8px',
            alignItems: 'start',
            animation: `slideUp ${0.1 + i * 0.05}s var(--ease) both`,
          }}>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 600, color: i === 0 ? 'var(--orange)' : 'var(--ink2)' }}>{row.metric}</p>
              <p style={{ fontSize: '10px', color: 'var(--ink4)', marginTop: '2px', lineHeight: 1.4 }}>{row.what}</p>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--ink4)', fontFamily: 'var(--font-mono)', paddingTop: '2px' }}>{row.before}</span>
            <span style={{ fontSize: '12px', color: 'var(--ink2)', fontFamily: 'var(--font-mono)', fontWeight: 500, paddingTop: '2px' }}>{row.after}</span>
            <span style={{
              fontSize: '12px', fontWeight: 700,
              color: row.delta === 'flat' ? 'var(--ink4)' : row.bad ? 'var(--red)' : 'var(--green)',
              fontFamily: 'var(--font-mono)',
              paddingTop: '2px',
            }}>{row.delta}</span>
          </div>
        ))}
      </div>

      {/* The paradox */}
      <div style={{
        padding: '16px 18px',
        background: 'rgba(255,77,77,0.05)',
        border: '1px solid rgba(255,77,77,0.12)',
        borderRadius: 'var(--radius-md)',
      }}>
        <p style={{ fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.75 }}>
          <strong style={{ color: 'var(--red)', fontWeight: 600 }}>The paradox: </strong>
          More users are coming (+15%) but revenue is falling (−16.5%). The platform is growing and shrinking at the same time.
          This is not one broken thing. Your job is to find all the causes.
        </p>
      </div>
    </Screen>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 4 — MEET ARJUN
// ─────────────────────────────────────────────────────────────

function ArjunScreen({ caseConfig }: { caseConfig: CaseConfig }) {
  const persona = caseConfig.mentorPersona;
  const TRAITS = [
    'Socratic — never gives the answer directly',
    'Rewards dead ends as much as correct paths',
    'Always asks: how much of the drop does this explain?',
    'Shifts between teaching and Socratic based on your progress',
  ];
  const STEPS = [
    { n: '01', title: 'Arjun teaches the concept', body: 'Before each milestone, Arjun explains exactly what analytical skill you need — with real analogies, not jargon.' },
    { n: '02', title: 'You form a hypothesis', body: 'Arjun asks you a question. You write your reasoning. He evaluates whether your thinking is sharp enough.' },
    { n: '03', title: 'You run the data', body: 'No SQL needed. You pick which analysis to run. Results appear. You tell Arjun what the numbers mean.' },
    { n: '04', title: 'You write the finding', body: 'You document your insight in your own words. It goes into your case study portfolio — what you present in interviews.' },
  ];

  return (
    <Screen>
      <Label text="Your mentor" />
      <Heading>
        Meet Arjun.<br />
        <span style={{ color: 'var(--ink3)' }}>He will not give you the answers.</span>
      </Heading>

      {/* Arjun card */}
      <div style={{
        padding: '20px',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-xl)',
        marginBottom: '20px',
        animation: 'scaleIn 0.35s var(--ease) both',
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: 'rgba(255,122,47,0.12)',
            border: '2px solid rgba(255,122,47,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', fontWeight: 700, color: 'var(--orange)',
            flexShrink: 0,
          }}>A</div>
          <div style={{ paddingTop: '4px' }}>
            <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink1)', letterSpacing: '-0.02em', marginBottom: '2px' }}>
              {persona.name}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--ink4)' }}>
              {persona.role} · {persona.company}
            </p>
          </div>
        </div>

        {/* Arjun's actual voice — from M1 teaching content */}
        <div style={{
          padding: '14px 16px',
          background: 'var(--elevated)',
          borderRadius: 'var(--radius-md)',
          borderLeft: '2px solid var(--orange)',
          marginBottom: '14px',
        }}>
          <p style={{ fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.8, fontStyle: 'italic' }}>
            &ldquo;Most analysts open a dashboard immediately. The good ones ask three questions first:
            Is this drop real? What is the shape of the decline? Who is affected?
            Let me show you why these questions matter more than any query you could run.&rdquo;
          </p>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {TRAITS.map((trait, i) => (
            <span key={i} style={{
              fontSize: '11px', fontWeight: 500,
              color: 'var(--ink3)',
              background: 'var(--elevated)',
              border: '1px solid var(--border)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              lineHeight: 1.4,
            }}>
              {trait}
            </span>
          ))}
        </div>
      </div>

      {/* How it works */}
      <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
        How it works — 4 phases per milestone
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {STEPS.map((step, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: '14px',
            padding: '14px 16px',
            background: 'var(--elevated)',
            borderRadius: 'var(--radius-md)',
            animation: `slideUp ${0.1 + i * 0.07}s var(--ease) both`,
          }}>
            <span style={{
              fontSize: '11px', fontWeight: 700,
              color: 'var(--orange)',
              fontFamily: 'var(--font-mono)',
              flexShrink: 0,
              paddingTop: '2px',
              minWidth: '24px',
            }}>{step.n}</span>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink1)', marginBottom: '4px' }}>{step.title}</p>
              <p style={{ fontSize: '12px', color: 'var(--ink3)', lineHeight: 1.6 }}>{step.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '16px',
        padding: '14px 18px',
        background: 'rgba(255,122,47,0.06)',
        border: '1px solid rgba(255,122,47,0.15)',
        borderRadius: 'var(--radius-md)',
      }}>
        <p style={{ fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--orange)', fontWeight: 600 }}>One rule: </strong>
          If you are stuck, tell Arjun. He will teach you. But the insight has to come from you —
          because that is what interviewers test, and that is what sticks.
        </p>
      </div>
    </Screen>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 5 — YOUR DATA
// ─────────────────────────────────────────────────────────────

const KPIS = [
  {
    name: 'Bookings / DAU',
    type: 'North star',
    plain: 'Out of everyone who opened the app today, what fraction completed a booking? This is the number that dropped 13%.',
    typeColor: 'var(--orange)',
  },
  {
    name: 'CVR — Conversion Rate',
    type: 'Funnel metric',
    plain: 'Of all sessions, how many ended in a booking? Breaks down by cohort to show who is converting and who is not.',
    typeColor: 'var(--blue)',
  },
  {
    name: 'SERP bounce rate',
    type: 'Behaviour signal',
    plain: 'How many users left after seeing search results without clicking anything? Rising SERP bounce = results are not relevant.',
    typeColor: 'var(--purple)',
  },
  {
    name: 'Review dwell time',
    type: 'Trust signal',
    plain: 'How long users spend reading reviews before deciding. High dwell = they don&apos;t trust the listing card. A diagnostic, not a vanity metric.',
    typeColor: 'var(--purple)',
  },
  {
    name: 'Payment abandonment',
    type: 'Funnel metric',
    plain: 'Users who reached the payment screen but did not complete. Often signals a price surprise — fees shown only at checkout.',
    typeColor: 'var(--blue)',
  },
];

const TABLES = [
  {
    name: 'users',
    rows: '11,500',
    purpose: 'One row per user — their cohort, tenure, and acquisition channel',
    keyCol: 'cohort',
    keyColDesc: 'HVT, Mission, DealSeeker, or Explorer',
  },
  {
    name: 'sessions',
    rows: '45,000',
    purpose: 'One row per session — did they convert, how long on reviews, did they visit packages',
    keyCol: 'converted',
    keyColDesc: 'true/false — whether the session ended in a booking',
  },
  {
    name: 'listings',
    rows: '8,500',
    purpose: 'One row per property — category, tier, review score, when it was added',
    keyCol: 'onboarded_week',
    keyColDesc: 'Which week was this property added — critical for the Week 5 expansion anomaly',
  },
  {
    name: 'search_results',
    rows: '45,000',
    purpose: 'One row per search — scroll depth, time to first click, filters used',
    keyCol: 'budget_in_top5_pct',
    keyColDesc: 'Fraction of top 5 results that are budget/homestay — the ranking signal',
  },
  {
    name: 'bookings',
    rows: '9,800',
    purpose: 'One row per completed booking — revenue, whether it was a package or international',
    keyCol: 'is_package',
    keyColDesc: 'Whether booked as part of a holiday package — tracks the HVT behavioural shift',
  },
];

function DataScreen() {
  const [expandedKPI, setExpandedKPI] = useState<number | null>(null);
  const [expandedTable, setExpandedTable] = useState<number | null>(0);

  return (
    <Screen>
      <Label text="Your data" color="var(--green)" />
      <Heading>
        What you can query.<br />
        <span style={{ color: 'var(--ink3)' }}>No SQL needed.</span>
      </Heading>
      <Body>
        Five tables. 120,000 rows of synthetic MakeMyTrip data across 12 weeks.
        Arjun will suggest which analysis to run and when.
        You interpret what the numbers mean.
      </Body>

      {/* KPI dictionary */}
      <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
        Key metrics you will encounter
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '28px' }}>
        {KPIS.map((kpi, i) => (
          <div key={i} style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: expandedKPI === i ? 'var(--card-bg)' : 'var(--elevated)',
            transition: 'background var(--t-fast)',
          }}>
            <button
              onClick={() => setExpandedKPI(expandedKPI === i ? null : i)}
              style={{
                width: '100%', padding: '12px 14px',
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'transparent', border: 'none', cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{
                fontSize: '10px', fontWeight: 700,
                color: kpi.typeColor,
                background: `${kpi.typeColor}15`,
                border: `1px solid ${kpi.typeColor}25`,
                padding: '2px 7px', borderRadius: '8px',
                flexShrink: 0, whiteSpace: 'nowrap',
              }}>{kpi.type}</span>
              <span style={{ fontWeight: 600, color: 'var(--ink1)', flex: 1, fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                {kpi.name}
              </span>
              <span style={{
                fontSize: '10px', color: 'var(--ink4)',
                transform: expandedKPI === i ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform var(--t-fast)', display: 'inline-block',
              }}>▾</span>
            </button>
            {expandedKPI === i && (
              <div style={{ padding: '0 14px 14px', animation: 'fadeIn 0.2s var(--ease)' }}>
                <p style={{ fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.7 }}>{kpi.plain}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tables */}
      <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
        Available tables
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {TABLES.map((table, i) => (
          <div key={i} style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: expandedTable === i ? 'var(--card-bg)' : 'var(--elevated)',
            transition: 'background var(--t-fast)',
          }}>
            <button
              onClick={() => setExpandedTable(expandedTable === i ? null : i)}
              style={{
                width: '100%', padding: '12px 14px',
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'transparent', border: 'none', cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <code style={{ fontSize: '12px', fontWeight: 600, color: 'var(--green)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                {table.name}
              </code>
              <span style={{ fontSize: '12px', color: 'var(--ink3)', flex: 1 }}>{table.purpose}</span>
              <span style={{ fontSize: '10px', color: 'var(--ink4)', flexShrink: 0 }}>{table.rows} rows</span>
              <span style={{
                fontSize: '10px', color: 'var(--ink4)',
                transform: expandedTable === i ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform var(--t-fast)', display: 'inline-block',
                marginLeft: '4px',
              }}>▾</span>
            </button>
            {expandedTable === i && (
              <div style={{ padding: '0 14px 14px', animation: 'fadeIn 0.2s var(--ease)' }}>
                <div style={{
                  padding: '10px 12px',
                  background: 'var(--elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex', gap: '10px', alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: '11px', color: 'var(--ink4)', flexShrink: 0, paddingTop: '1px' }}>Key column</span>
                  <div>
                    <code style={{ fontSize: '11px', color: 'var(--green)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '3px' }}>
                      {table.keyCol}
                    </code>
                    <p style={{ fontSize: '11px', color: 'var(--ink3)', lineHeight: 1.5 }}>{table.keyColDesc}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Screen>
  );
}
