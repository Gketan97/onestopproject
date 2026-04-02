// src/components/strategy/hooks/useTerminalBlocks.js
// CP11: Sprint 2 — Terminal Stack block manager hook
//
// Manages the ordered list of data blocks in the left-pane Terminal.
// Blocks unlock as milestones complete — mapped by milestone index.
//
// Usage:
//   const { terminalBlocks, unlockBlock } = useTerminalBlocks();
//   // Call unlockBlock(milestoneIndex) from handleComplete in ArjunSocraticChat
//
// Block shape: { id: string, label: string, color: string, component: ReactNode }

import { useState, useCallback } from 'react';
import React from 'react';
import KpiScorecard from '../components/KpiScorecard.jsx';
import CohortMatrix from '../components/CohortMatrix.jsx';
import FunnelChart from '../visualisations/FunnelChart.jsx';

const ORANGE = '#FC8019';
const BLUE   = '#4F80FF';
const GREEN  = '#3DD68C';
const RED    = '#F38BA8';
const PURPLE = '#A78BFA';

// ── Static funnel data (mirrored from ArjunSocraticChat to avoid circular dep) ─
// These are used by the Terminal read-only funnel display.
// Import real data from swiggyStrategyData if available, else inline here.
function FunnelReadOnly({ thisWeek, lastWeek }) {
  if (!thisWeek || !lastWeek) return null;
  return (
    <div style={{
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.08)',
      background: 'rgba(255,255,255,0.03)',
    }}>
      <div style={{
        padding: '9px 14px',
        background: 'rgba(0,0,0,0.2)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <p style={{
          fontFamily: 'var(--mono)',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--ink3)',
          margin: 0,
        }}>
          Conversion funnel · This week vs Last week
        </p>
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 80px 80px 60px',
          gap: 8,
          marginBottom: 8,
        }}>
          {['Stage', 'This week', 'Last week', 'Δ'].map(h => (
            <span key={h} style={{
              fontFamily: 'var(--mono)',
              fontSize: 9,
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--ink3)',
            }}>
              {h}
            </span>
          ))}
        </div>
        {thisWeek.map((step, i) => {
          const last  = lastWeek[i];
          const delta = last ? (step.pct - last.pct).toFixed(1) : null;
          const isAnomaly = delta !== null && Math.abs(parseFloat(delta)) > 8;
          return (
            <div key={step.stage} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 80px 80px 60px',
              gap: 8,
              padding: '6px 0',
              borderBottom: i < thisWeek.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              background: isAnomaly ? `${RED}06` : 'transparent',
              borderRadius: isAnomaly ? 6 : 0,
            }}>
              <span style={{
                fontSize: 12,
                color: isAnomaly ? 'var(--ink)' : 'var(--ink2)',
                fontWeight: isAnomaly ? 600 : 400,
              }}>
                {step.stage}{isAnomaly && (
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: RED }}> ⚠</span>
                )}
              </span>
              <span style={{
                fontFamily: 'var(--mono)',
                fontSize: 11,
                color: isAnomaly ? RED : 'var(--ink2)',
                fontWeight: isAnomaly ? 700 : 400,
              }}>
                {step.pct?.toFixed(1)}%
              </span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink3)' }}>
                {last?.pct?.toFixed(1)}%
              </span>
              <span style={{
                fontFamily: 'var(--mono)',
                fontSize: 11,
                color: delta && parseFloat(delta) < 0 ? RED : GREEN,
                fontWeight: isAnomaly ? 700 : 400,
              }}>
                {delta !== null ? `${parseFloat(delta) > 0 ? '+' : ''}${delta}` : '—'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Block definitions — each milestone unlocks specific Terminal blocks ─────
// These factories receive the data they need and return a block descriptor.

function makeScopeBlock() {
  return {
    id: 'scope-confirmed',
    label: 'M1 · SCOPE CONFIRMED',
    color: ORANGE,
    component: (
      <div style={{
        borderRadius: 10,
        padding: '14px 16px',
        background: `${ORANGE}08`,
        border: `1px solid ${ORANGE}18`,
      }}>
        <p style={{
          fontFamily: 'var(--mono)',
          fontSize: 9,
          color: ORANGE,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 10,
        }}>
          Incident Scope
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Drop', value: '8.3%' },
            { label: 'GMV at risk', value: '₹19L' },
            { label: 'Region', value: 'North Bangalore' },
            { label: 'Period', value: 'WoW (Tue)' },
          ].map(({ label, value }) => (
            <div key={label} style={{
              padding: '10px 12px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <p style={{
                fontFamily: 'var(--mono)',
                fontSize: 9,
                color: 'var(--ink3)',
                marginBottom: 4,
              }}>
                {label}
              </p>
              <p style={{
                fontFamily: 'var(--mono)',
                fontSize: 15,
                fontWeight: 800,
                color: ORANGE,
                lineHeight: 1,
              }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    ),
  };
}

function makeDashboardBlock() {
  return {
    id: 'kpi-dashboard',
    label: 'M2 · KPI DASHBOARD',
    color: BLUE,
    component: (
      <div style={{ pointerEvents: 'none', opacity: 0.9 }}>
        <KpiScorecard
          onMetricClick={() => {}}
          clickedMetric={null}
          interactive={false}
        />
      </div>
    ),
  };
}

function makeFunnelBlock(thisWeek, lastWeek) {
  return {
    id: 'funnel-analysis',
    label: 'M3 · FUNNEL ANALYSIS',
    color: PURPLE,
    component: (
      <FunnelChart
        thisWeek={thisWeek}
        lastWeek={lastWeek}
        title="Conversion funnel · This week vs Last week"
      />
    ),
  };
}

function makeRootCauseBlock() {
  return {
    id: 'cohort-matrix',
    label: 'M4 · ROOT CAUSE · COHORT',
    color: GREEN,
    component: (
      <div style={{ pointerEvents: 'none', opacity: 0.9 }}>
        <CohortMatrix />
      </div>
    ),
  };
}

function makeImpactBlock(impactSummary) {
  return {
    id: 'impact-sizing',
    label: 'M5 · IMPACT SIZING',
    color: PURPLE,
    component: (
      <div style={{
        borderRadius: 10,
        padding: '14px 16px',
        background: `${PURPLE}08`,
        border: `1px solid ${PURPLE}18`,
      }}>
        <p style={{
          fontFamily: 'var(--mono)',
          fontSize: 9,
          color: PURPLE,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 10,
        }}>
          Your Impact Calculation
        </p>
        {impactSummary ? (
          <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>
            "{impactSummary}"
          </p>
        ) : (
          <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink3)', margin: 0 }}>
            Calculation pending...
          </p>
        )}
      </div>
    ),
  };
}

// ── Main hook ─────────────────────────────────────────────────────────────────
export function useTerminalBlocks() {
  const [blocks, setBlocks] = useState([]);

  // Call this from ArjunSocraticChat's handleComplete
  // milestoneIndex: 0=Scope, 1=Dashboard, 2=Funnel, 3=RootCause, 4=Impact, 5=Respond
  const unlockBlock = useCallback((milestoneIndex, { conclusion, funnelData } = {}) => {
    setBlocks(prev => {
      // Don't add duplicates
      const alreadyAdded = prev.some(b => b.id === getBlockId(milestoneIndex));
      if (alreadyAdded) return prev;

      let newBlock = null;
      switch (milestoneIndex) {
        case 0:
          newBlock = makeScopeBlock();
          break;
        case 1:
          newBlock = makeDashboardBlock();
          break;
        case 2:
          newBlock = makeFunnelBlock(
            funnelData?.thisWeek || [],
            funnelData?.lastWeek || [],
          );
          break;
        case 3:
          newBlock = makeRootCauseBlock();
          break;
        case 4:
          newBlock = makeImpactBlock(conclusion);
          break;
        case 5:
          // M6 Respond doesn't add a block — it's a wrap
          return prev;
        default:
          return prev;
      }

      return newBlock ? [...prev, newBlock] : prev;
    });
  }, []);

  const clearBlocks = useCallback(() => setBlocks([]), []);

  return { terminalBlocks: blocks, unlockBlock, clearBlocks };
}

function getBlockId(milestoneIndex) {
  const ids = [
    'scope-confirmed',
    'kpi-dashboard',
    'funnel-analysis',
    'cohort-matrix',
    'impact-sizing',
  ];
  return ids[milestoneIndex] || null;
}