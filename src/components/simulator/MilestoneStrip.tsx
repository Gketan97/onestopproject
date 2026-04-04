// ============================================================
// MILESTONE STRIP — Horizontal progress bar
// Shows during investigation phase only.
// Clean, minimal, not overwhelming.
// ============================================================

'use client';

import type { CaseConfig, SimulationState } from '@/types';

interface Props {
  caseConfig: CaseConfig;
  simulation: SimulationState;
}

export function MilestoneStrip({ caseConfig, simulation }: Props) {
  const milestones = caseConfig.milestones;
  const currentId  = simulation.currentMilestoneId;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      height: '44px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--surface)',
      flexShrink: 0,
      gap: '0',
      overflowX: 'auto',
    }}>
      {milestones.map((m, i) => {
        const state      = simulation.milestoneStates[m.id];
        const isCompleted = state?.status === 'completed';
        const isCurrent  = m.id === currentId;
        const isPending  = !isCompleted && !isCurrent;

        return (
          <div
            key={m.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0',
              flexShrink: 0,
            }}
          >
            {/* Step */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              background: isCurrent ? 'rgba(255,122,47,0.08)' : 'transparent',
              border: `1px solid ${isCurrent ? 'rgba(255,122,47,0.2)' : 'transparent'}`,
              transition: 'all var(--t-base)',
            }}>
              <div style={{
                width: '18px', height: '18px',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '9px', fontWeight: 700,
                background: isCompleted ? 'var(--green)' : isCurrent ? 'var(--orange)' : 'var(--elevated)',
                border: `1px solid ${isCompleted ? 'var(--green)' : isCurrent ? 'var(--orange)' : 'var(--border)'}`,
                color: isCompleted || isCurrent ? '#fff' : 'var(--ink4)',
                flexShrink: 0,
                transition: 'all var(--t-base)',
              }}>
                {isCompleted ? '✓' : m.order}
              </div>
              <span style={{
                fontSize: '11px',
                fontWeight: isCurrent ? 600 : 400,
                color: isCurrent ? 'var(--orange)' : isCompleted ? 'var(--ink2)' : 'var(--ink4)',
                whiteSpace: 'nowrap',
                letterSpacing: '-0.01em',
                transition: 'color var(--t-fast)',
              }}>
                {m.title}
              </span>
            </div>

            {/* Connector */}
            {i < milestones.length - 1 && (
              <div style={{
                width: '20px', height: '1px',
                background: isCompleted ? 'var(--green)' : 'var(--border)',
                flexShrink: 0,
                transition: 'background var(--t-base)',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
