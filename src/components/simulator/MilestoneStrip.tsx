// ============================================================
// MILESTONE STRIP
// Horizontal progress indicator showing all milestones.
// ============================================================

'use client';

import type { CaseConfig, SimulationState } from '@/types';

interface Props {
  caseConfig: CaseConfig;
  simulation: SimulationState;
}

const STATUS_COLORS = {
  completed: 'var(--green)',
  active:    'var(--orange)',
  pending:   'var(--ink4)',
  skipped:   'var(--ink4)',
};

const STATUS_BG = {
  completed: 'rgba(61,214,140,0.12)',
  active:    'rgba(252,128,25,0.12)',
  pending:   'rgba(255,255,255,0.03)',
  skipped:   'rgba(255,255,255,0.03)',
};

export function MilestoneStrip({ caseConfig, simulation }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '12px 20px',
        borderBottom: '1px solid var(--border)',
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      {caseConfig.milestones.map((milestone, index) => {
        const milestoneState = simulation.milestoneStates[milestone.id];
        const status = milestoneState?.status ?? 'pending';
        const isActive = milestone.id === simulation.currentMilestoneId;
        const score = milestoneState?.score ?? 0;

        return (
          <div key={milestone.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* Connector */}
            {index > 0 && (
              <div
                style={{
                  width: '24px',
                  height: '1px',
                  background: status === 'completed'
                    ? 'var(--green)'
                    : 'var(--border)',
                  flexShrink: 0,
                  transition: 'background 0.3s ease',
                }}
              />
            )}

            {/* Milestone pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                background: STATUS_BG[status],
                border: `1px solid ${isActive
                  ? 'rgba(252,128,25,0.4)'
                  : status === 'completed'
                  ? 'rgba(61,214,140,0.2)'
                  : 'var(--border)'
                }`,
                borderRadius: 'var(--radius-sm)',
                flexShrink: 0,
                transition: 'all 0.3s ease',
                boxShadow: isActive ? 'var(--glow-orange)' : 'none',
              }}
            >
              {/* Step number or checkmark */}
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: STATUS_COLORS[status],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                {status === 'completed' ? '✓' : milestone.order}
              </div>

              {/* Title */}
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive
                    ? 'var(--orange)'
                    : status === 'completed'
                    ? 'var(--green)'
                    : 'var(--ink3)',
                  whiteSpace: 'nowrap',
                }}
              >
                {milestone.title}
              </span>

              {/* Score badge */}
              {score > 0 && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: score >= 70
                      ? 'var(--green)'
                      : score >= 50
                      ? 'var(--orange)'
                      : 'var(--red)',
                    background: 'rgba(255,255,255,0.06)',
                    padding: '1px 5px',
                    borderRadius: '4px',
                  }}
                >
                  {score}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
