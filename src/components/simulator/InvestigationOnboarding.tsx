// ============================================================
// INVESTIGATION ONBOARDING
// Shown ONCE when investigation phase opens for the first time.
// Explains the three panels. One clear first action.
// Never shown again after dismissed.
// ============================================================

'use client';

import { useState } from 'react';

interface Props {
  mentorName: string;
  investigationNudge: string;
  onDismiss: () => void;
}

const PANELS = [
  {
    position: 'left' as const,
    label: 'Your case study doc',
    color: 'var(--blue)',
    colorDim: 'rgba(76,127,255,0.12)',
    description: 'This is what you are building. Every finding you commit goes here. This is what you present in interviews.',
    icon: '◧',
  },
  {
    position: 'center' as const,
    label: 'Arjun — your mentor',
    color: 'var(--orange)',
    colorDim: 'rgba(255,122,47,0.12)',
    description: 'This is where investigation happens. Share your thinking. Arjun will guide your next step.',
    icon: '◈',
  },
  {
    position: 'right' as const,
    label: 'Data results',
    color: 'var(--green)',
    colorDim: 'rgba(62,207,142,0.12)',
    description: 'Appears automatically when you run an analysis. Numbers only — you interpret what they mean.',
    icon: '◧',
  },
];

export function InvestigationOnboarding({ mentorName, investigationNudge, onDismiss }: Props) {
  const [step, setStep] = useState(0); // 0 = panels, 1 = nudge

  if (step === 1) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(7,7,14,0.85)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        animation: 'fadeIn 0.2s ease-out',
        padding: '24px',
      }}>
        <div style={{
          maxWidth: '520px',
          width: '100%',
          background: 'var(--card-bg)',
          border: '1px solid var(--border-md)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px',
          animation: 'scaleIn 0.3s var(--ease)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        }}>
          {/* Arjun avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
            <div style={{
              width: '44px', height: '44px',
              borderRadius: '50%',
              background: 'rgba(255,122,47,0.12)',
              border: '1.5px solid rgba(255,122,47,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', fontWeight: 700, color: 'var(--orange)',
              flexShrink: 0,
            }}>
              A
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink1)' }}>{mentorName}</p>
              <p style={{ fontSize: '11px', color: 'var(--ink3)' }}>Staff Product Analyst · MakeMyTrip</p>
            </div>
          </div>

          <p style={{
            fontSize: '15px',
            color: 'var(--ink2)',
            lineHeight: 1.8,
            marginBottom: '28px',
          }}>
            {investigationNudge}
          </p>

          <button
            onClick={onDismiss}
            style={{
              width: '100%',
              padding: '13px',
              background: 'var(--orange)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: 'var(--glow-orange)',
              letterSpacing: '-0.01em',
              transition: 'opacity var(--t-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Start investigating →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(7,7,14,0.88)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      animation: 'fadeIn 0.25s ease-out',
      padding: '24px',
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        animation: 'slideUp 0.4s var(--ease)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '12px',
          }}>
            <div style={{
              width: '6px', height: '6px',
              borderRadius: '50%',
              background: 'var(--green)',
              animation: 'breathe 2s infinite',
            }} />
            <span style={{
              fontSize: '11px', fontWeight: 600,
              color: 'var(--green)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Learning complete
            </span>
          </div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--ink1)',
            letterSpacing: '-0.02em',
            marginBottom: '8px',
          }}>
            Your investigation workspace
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--ink3)', lineHeight: 1.6 }}>
            Three areas work together. Here is what each one does.
          </p>
        </div>

        {/* Panel cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px',
          marginBottom: '28px',
        }}>
          {PANELS.map((panel, i) => (
            <div
              key={panel.position}
              style={{
                padding: '20px 18px',
                background: 'var(--card-bg)',
                border: `1px solid ${panel.color}30`,
                borderRadius: 'var(--radius-lg)',
                animation: `slideUp 0.4s ${i * 0.08}s var(--ease) both`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top accent */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: '2px',
                background: panel.color,
                opacity: 0.7,
              }} />

              <div style={{
                width: '32px', height: '32px',
                borderRadius: 'var(--radius-sm)',
                background: panel.colorDim,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '12px',
              }}>
                <div style={{
                  width: '14px', height: '10px',
                  background: panel.color,
                  borderRadius: '2px',
                  opacity: 0.8,
                }} />
              </div>

              <p style={{
                fontSize: '12px',
                fontWeight: 600,
                color: panel.color,
                marginBottom: '7px',
                letterSpacing: '-0.01em',
              }}>
                {panel.label}
              </p>
              <p style={{
                fontSize: '12px',
                color: 'var(--ink3)',
                lineHeight: 1.6,
              }}>
                {panel.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => setStep(1)}
            style={{
              padding: '12px 36px',
              background: 'var(--elevated)',
              border: '1px solid var(--border-md)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--ink1)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              transition: 'all var(--t-fast)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--card-bg)';
              e.currentTarget.style.borderColor = 'var(--border-focus)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--elevated)';
              e.currentTarget.style.borderColor = 'var(--border-md)';
            }}
          >
            Got it — show me Arjun&apos;s first question →
          </button>
        </div>
      </div>
    </div>
  );
}
