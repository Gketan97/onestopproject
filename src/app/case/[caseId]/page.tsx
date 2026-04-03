// ============================================================
// CASE STUDY PAGE
// Three-panel layout wired to full phase system:
// teach → investigate → commit per milestone.
// ============================================================

'use client';
import Link from 'next/link';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import type { CaseConfig } from '@/types';

import { CaseLoader } from '@/components/simulator/CaseLoader';
import { MilestoneStrip } from '@/components/simulator/MilestoneStrip';
import { InvestigationBoard } from '@/components/simulator/InvestigationBoard';
import { ChatInterface } from '@/components/simulator/ChatInterface';
import { MetricsPanel } from '@/components/simulator/MetricsPanel';
import { SkillScorecard } from '@/components/simulator/SkillScorecard';
import { TeachingCard } from '@/components/simulator/TeachingCard';
import { FindingGate } from '@/components/simulator/FindingGate';
import { DuckDBLoader } from '@/components/analytics/DuckDBLoader';
import { useSimulation } from '@/hooks/useSimulation';
import { useDuckDB } from '@/hooks/useDuckDB';
import { getTeachingContent } from '@/data/milestoneTeachingContent';

export default function CasePage() {
  const params = useParams();
  const caseId = params.caseId as string;

  const [caseConfig, setCaseConfig] = useState<CaseConfig | null>(null);
  const [caseError, setCaseError] = useState<string | null>(null);

  const {
    state: simState,
    handleCheckpointPassed,
    handleRequestCommit,
    handleFindingAccepted,
    handleEvaluateDepth,
    sendMessage,
    runQuery,
    advanceMilestone,
    reset,
  } = useSimulation(caseConfig);

  const { state: dbState } = useDuckDB(caseConfig);

  const handleCaseLoaded = useCallback((config: CaseConfig) => {
    setCaseConfig(config);
  }, []);

  const handleCaseError = useCallback((error: string) => {
    setCaseError(error);
  }, []);

  // ── ERROR STATE ──────────────────────────────────────────────

  if (caseError) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', flexDirection: 'column', gap: '12px',
      }}>
        <p style={{ color: 'var(--red)', fontSize: '14px' }}>{caseError}</p>
        <Link href="/" style={{ color: 'var(--blue)', fontSize: '13px' }}>Back to home</Link>
      </div>
    );
  }

  // ── LOADING STATES ───────────────────────────────────────────

  if (!caseConfig) {
    return (
      <CaseLoader
        caseId={caseId}
        onLoaded={handleCaseLoaded}
        onError={handleCaseError}
      />
    );
  }

  if (!dbState.initialized) {
    return (
      <DuckDBLoader
        initialized={dbState.initialized}
        loading={dbState.loading}
        error={dbState.error}
        tablesLoaded={dbState.tablesLoaded}
        totalTables={caseConfig.datasetManifest.tables.length}
      />
    );
  }

  const simulation = simState.simulation;
  if (!simulation) return null;

  // ── CURRENT MILESTONE CONTEXT ────────────────────────────────

  const currentMilestone = caseConfig.milestones.find(
    m => m.id === simulation.currentMilestoneId
  );
  const currentMilestoneState =
    simulation.milestoneStates[simulation.currentMilestoneId];
  const currentPhaseState =
    simState.phaseStates[simulation.currentMilestoneId];
  const currentPhase = currentPhaseState?.phase ?? 'teach';
  const teachingContent = currentMilestone
    ? getTeachingContent(currentMilestone.type)
    : null;

  // ── PHASE LABELS ─────────────────────────────────────────────

  const PHASE_LABELS: Record<string, string> = {
    teach: 'Learn',
    investigate: 'Investigate',
    commit: 'Document',
  };

  // ── RENDER ───────────────────────────────────────────────────

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', overflow: 'hidden',
      background: 'var(--bg)',
    }}>

      {/* ── TOP BAR ── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
        background: 'var(--surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link href="/" style={{
            fontSize: '11px', color: 'var(--ink3)',
            textDecoration: 'none', fontWeight: 700,
            letterSpacing: '0.06em',
          }}>
            OSC
          </Link>
          <div style={{ width: '1px', height: '14px', background: 'var(--border)' }} />
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink1)' }}>
            {caseConfig.title}
          </p>
          <span style={{
            fontSize: '11px', color: 'var(--ink3)',
            padding: '2px 8px',
            background: 'var(--elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
          }}>
            {caseConfig.company}
          </span>

          {/* Phase indicator */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '3px 10px',
            background: currentPhase === 'teach'
              ? 'rgba(79,128,255,0.1)'
              : currentPhase === 'investigate'
              ? 'rgba(252,128,25,0.1)'
              : 'rgba(61,214,140,0.1)',
            border: `1px solid ${currentPhase === 'teach'
              ? 'rgba(79,128,255,0.25)'
              : currentPhase === 'investigate'
              ? 'rgba(252,128,25,0.25)'
              : 'rgba(61,214,140,0.25)'}`,
            borderRadius: 'var(--radius-sm)',
          }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: currentPhase === 'teach'
                ? 'var(--blue)'
                : currentPhase === 'investigate'
                ? 'var(--orange)'
                : 'var(--green)',
            }} />
            <span style={{
              fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.08em',
              color: currentPhase === 'teach'
                ? 'var(--blue)'
                : currentPhase === 'investigate'
                ? 'var(--orange)'
                : 'var(--green)',
            }}>
              {PHASE_LABELS[currentPhase]}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: 'var(--orange)', fontWeight: 600 }}>
            {caseConfig.difficulty.toUpperCase()}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--ink3)' }}>
            ~{caseConfig.estimatedMinutes}min
          </span>
          <button
            onClick={reset}
            style={{
              padding: '4px 10px', fontSize: '11px',
              color: 'var(--ink3)', background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* ── MILESTONE STRIP ── */}
      <MilestoneStrip caseConfig={caseConfig} simulation={simulation} />

      {/* ── THREE-PANEL LAYOUT ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr 300px',
        flex: 1,
        overflow: 'hidden',
      }}>

        {/* LEFT — Investigation Board + Scorecard */}
        <div style={{
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          background: 'var(--surface)',
        }}>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <InvestigationBoard board={simulation.board} />
          </div>
          <SkillScorecard
            profile={simulation.profile}
            totalTokensUsed={simState.totalTokensUsed}
          />
        </div>

        {/* CENTER — Phase-aware content */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Milestone header */}
          <div style={{
            padding: '10px 20px',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink1)' }}>
                {currentMilestone?.title}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--ink3)' }}>
                {currentMilestone?.description}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {currentPhase === 'investigate' && (
                <span style={{
                  fontSize: '11px', color: 'var(--ink3)',
                  fontFamily: 'monospace',
                }}>
                  Turn {currentMilestoneState?.turns ?? 0}
                </span>
              )}
              {(currentMilestoneState?.score ?? 0) > 0 && (
                <span style={{
                  fontSize: '12px', fontWeight: 700,
                  color: 'var(--orange)', fontFamily: 'monospace',
                }}>
                  {currentMilestoneState?.score}pts
                </span>
              )}
            </div>
          </div>

          {/* Phase content */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

            {/* TEACH PHASE */}
            {currentPhase === 'teach' && teachingContent && (
              <TeachingCard
                content={teachingContent}
                milestoneOrder={currentMilestone?.order ?? 1}
                onCheckpointPassed={() =>
                  handleCheckpointPassed(simulation.currentMilestoneId)
                }
              />
            )}

            {/* INVESTIGATE PHASE */}
            {currentPhase === 'investigate' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <ChatInterface
                  conversation={simulation.conversation}
                  isThinking={simState.isThinking}
                  error={simState.error}
                  canAdvance={false}
                  currentMilestoneId={simulation.currentMilestoneId}
                  availableQueries={currentMilestone?.availableQueries ?? []}
                  queriesRun={currentMilestoneState?.queriesRun ?? []}
                  isQueryRunning={simState.isQueryRunning}
                  caseConfig={caseConfig}
                  onSendMessage={sendMessage}
                  onRunQuery={runQuery}
                  onAdvance={() => {}}
                  investigationNudge={teachingContent?.investigationNudge}
                  onRequestCommit={() =>
                    handleRequestCommit(simulation.currentMilestoneId)
                  }
                />
              </div>
            )}

            {/* COMMIT PHASE */}
            {currentPhase === 'commit' && teachingContent && (
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                {/* Show conversation summary */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <ChatInterface
                    conversation={simulation.conversation}
                    isThinking={false}
                    error={null}
                    canAdvance={false}
                    currentMilestoneId={simulation.currentMilestoneId}
                    availableQueries={[]}
                    queriesRun={currentMilestoneState?.queriesRun ?? []}
                    isQueryRunning={false}
                    caseConfig={caseConfig}
                    onSendMessage={async () => {}}
                    onRunQuery={async () => null}
                    onAdvance={() => {}}
                    readOnly={true}
                  />
                </div>

                {/* Finding gate */}
                {!currentPhaseState?.commitAccepted ? (
                  <FindingGate
                    content={teachingContent}
                    milestoneId={simulation.currentMilestoneId}
                    milestoneTitle={currentMilestone?.title ?? ''}
                    onFindingAccepted={(text) =>
                      handleFindingAccepted(simulation.currentMilestoneId, text)
                    }
                    onEvaluateDepth={handleEvaluateDepth}
                  />
                ) : (
                  /* Advance milestone button — only shows after commit accepted */
                  <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
                    <button
                      onClick={advanceMilestone}
                      style={{
                        width: '100%', padding: '11px',
                        fontSize: '13px', fontWeight: 600,
                        color: '#fff',
                        background: 'linear-gradient(135deg, var(--green), var(--green-dim))',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        boxShadow: 'var(--glow-green)',
                        transition: 'opacity 0.2s ease',
                      }}
                    >
                      Advance to next milestone →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Metrics Panel */}
        <div style={{
          borderLeft: '1px solid var(--border)',
          overflow: 'hidden',
          background: 'var(--surface)',
        }}>
          <MetricsPanel
            metrics={simState.lastMetrics}
            isQueryRunning={simState.isQueryRunning}
          />
        </div>

      </div>
    </div>
  );
}
