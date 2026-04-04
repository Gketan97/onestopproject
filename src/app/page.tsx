'use client';

import Link from 'next/link';
import { useState } from 'react';

interface CaseCardProps {
  href: string;
  company: string;
  difficulty: string;
  title: string;
  description: string;
  tags: { label: string; color: string }[];
  accent: string;
  isNew?: boolean;
  dimmed?: boolean;
}

function CaseCard({
  href, company, difficulty, title, description,
  tags, accent, isNew, dimmed,
}: CaseCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: '22px 26px',
          background: hovered ? 'var(--card-hover)' : 'var(--card-bg)',
          border: `1px solid ${hovered ? accent + '40' : 'var(--card-border)'}`,
          borderRadius: 'var(--radius-lg)',
          cursor: 'pointer',
          transition: 'all var(--t-base) var(--ease)',
          opacity: dimmed ? (hovered ? 1 : 0.65) : 1,
          transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
          boxShadow: hovered ? `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${accent}20` : 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle accent line at top */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${accent}60, transparent)`,
          opacity: hovered ? 1 : 0,
          transition: 'opacity var(--t-base)',
        }} />

        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}>
          <div>
            <p style={{
              fontSize: '10px',
              fontWeight: 600,
              color: accent,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '5px',
            }}>
              {company} · {difficulty}
            </p>
            <h2 style={{
              fontSize: '17px',
              fontWeight: 600,
              color: 'var(--ink1)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}>
              {title}
            </h2>
          </div>
          {isNew && (
            <span style={{
              fontSize: '10px',
              fontWeight: 600,
              color: 'var(--green)',
              background: 'rgba(62,207,142,0.1)',
              border: '1px solid rgba(62,207,142,0.25)',
              padding: '3px 9px',
              borderRadius: '20px',
              flexShrink: 0,
              marginLeft: '12px',
            }}>
              New
            </span>
          )}
        </div>

        <p style={{
          fontSize: '13px',
          color: 'var(--ink3)',
          lineHeight: 1.65,
          marginBottom: '16px',
        }}>
          {description}
        </p>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {tags.map(tag => (
            <span
              key={tag.label}
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color: tag.color,
                background: tag.color + '14',
                border: `1px solid ${tag.color}25`,
                padding: '2px 9px',
                borderRadius: '20px',
              }}
            >
              {tag.label}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
    }}>
      {/* Ambient background */}
      <div style={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '300px',
        background: 'radial-gradient(ellipse at center, rgba(76,127,255,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{
        maxWidth: '580px',
        width: '100%',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Header */}
        <div style={{
          marginBottom: '48px',
          animation: 'slideUp 0.5s var(--ease) both',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '16px',
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--orange)',
              animation: 'breathe 2.5s ease-in-out infinite',
            }} />
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--orange)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              OneStop Careers
            </span>
          </div>

          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: 'var(--ink1)',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '12px',
          }}>
            Product Analytics<br />Case Studies
          </h1>

          <p style={{
            fontSize: '15px',
            color: 'var(--ink3)',
            lineHeight: 1.7,
            maxWidth: '420px',
          }}>
            Investigate real business problems. Build a case study
            you can present in senior analytics interviews.
          </p>
        </div>

        {/* Cases */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <div style={{ animation: 'slideUp 0.5s 0.1s var(--ease) both' }}>
            <CaseCard
              href="/case/mmt_bookings_drop"
              company="MakeMyTrip"
              difficulty="Senior"
              title="The Bookings Crisis"
              description="Bookings/DAU dropped 13% over 60 days while DAU grew 15%. Four compounding root causes. No single villain. Build the full RCA and solution brief."
              tags={[
                { label: '7 milestones', color: 'var(--ink3)' },
                { label: '4 root causes', color: 'var(--orange)' },
                { label: '~60 min', color: 'var(--ink3)' },
                { label: 'Portfolio ready', color: 'var(--green)' },
              ]}
              accent="var(--orange)"
              isNew
            />
          </div>

          <div style={{ animation: 'slideUp 0.5s 0.18s var(--ease) both' }}>
            <CaseCard
              href="/case/makemytrip_revenue_leak"
              company="MakeMyTrip"
              difficulty="Senior"
              title="The Revenue Leak"
              description="Revenue per Booking declined 18% over 6 weeks. A pricing algorithm bug deployed in Week 16. Classic single root cause investigation."
              tags={[
                { label: '7 milestones', color: 'var(--ink3)' },
                { label: '1 root cause', color: 'var(--blue)' },
                { label: '~45 min', color: 'var(--ink3)' },
              ]}
              accent="var(--blue)"
              dimmed
            />
          </div>
        </div>

        {/* Footer */}
        <p style={{
          marginTop: '36px',
          fontSize: '12px',
          color: 'var(--ink4)',
          textAlign: 'center',
          animation: 'fadeIn 0.5s 0.4s both',
        }}>
          Built for analysts targeting FAANG-level product roles in India
        </p>

      </div>
    </div>
  );
}
