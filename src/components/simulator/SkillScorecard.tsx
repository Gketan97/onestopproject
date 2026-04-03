// ============================================================
// SKILL SCORECARD
// Shows analyst skill scores per dimension.
// Displayed in left panel below Investigation Board.
// ============================================================

'use client';

import type { AnalystSkillProfile } from '@/types';

interface Props {
  profile: AnalystSkillProfile;
  totalTokensUsed: number;
}

const DIMENSIONS = [
  { key: 'problemFraming',     label: 'Problem Framing',     color: 'var(--blue)' },
  { key: 'dataInterpretation', label: 'Data Interpretation', color: 'var(--green)' },
  { key: 'hypothesisQuality',  label: 'Hypothesis Quality',  color: 'var(--orange)' },
  { key: 'solutionImpact',     label: 'Solution Impact',     color: 'var(--green)' },
] as const;

export function SkillScorecard({ profile, totalTokensUsed }: Props) {
  const total = profile.totalScore;

  return (
    <div
      style={{
        padding: '16px',
        borderTop: '1px solid var(--border)',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <p
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--ink3)',
          }}
        >
          Analyst Score
        </p>
        <span
          style={{
            fontSize: '16px',
            fontWeight: 700,
            color: total > 200
              ? 'var(--green)'
              : total > 100
              ? 'var(--orange)'
              : 'var(--ink2)',
            fontFamily: 'monospace',
          }}
        >
          {total}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {DIMENSIONS.map(({ key, label, color }) => {
          const score = profile.scorecard[key];
          const maxPerDimension = 150;
          const pct = Math.min(100, (score / maxPerDimension) * 100);

          return (
            <div key={key}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '3px',
                }}
              >
                <span style={{ fontSize: '11px', color: 'var(--ink3)' }}>
                  {label}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: score > 0 ? color : 'var(--ink4)',
                    fontFamily: 'monospace',
                  }}
                >
                  {score}
                </span>
              </div>
              <div
                style={{
                  height: '3px',
                  background: 'var(--border)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: color,
                    borderRadius: '2px',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Token usage */}
      {totalTokensUsed > 0 && (
        <p
          style={{
            fontSize: '10px',
            color: 'var(--ink4)',
            marginTop: '10px',
            fontFamily: 'monospace',
          }}
        >
          {totalTokensUsed.toLocaleString()} tokens used
        </p>
      )}
    </div>
  );
}
