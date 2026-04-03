'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import type { CaseConfig } from '@/types';
import { CaseLoader } from '@/components/simulator/CaseLoader';
import { MilestoneStrip } from '@/components/simulator/MilestoneStrip';
import { InvestigationBoard } from '@/components/simulator/InvestigationBoard';
import { ChatInterface } from '@/components/simulator/ChatInterface';
import { MetricsPanel } from '@/components/simulator/MetricsPanel';
import { SkillScorecard } from '@/components/simulator/SkillScorecard';
import { DuckDBLoader } from '@/components/analytics/DuckDBLoader';
import { useSimulation } from '@/hooks/useSimulation';
import { useDuckDB } from '@/hooks/useDuckDB';

export default function CasePage() {
  const params = useParams();
  const caseId = params.caseId as string;
  const [caseConfig, setCaseConfig] = useState<CaseConfig | null>(null);
  const [caseError, setCaseError] = useState<string | null>(null);

  const { state: simState, sendMessage, runQuery, advanceMilestone, reset } =
    useSimulation(caseConfig);
  const { state: dbState } = useDuckDB(caseConfig);

  const handleCaseLoaded = useCallback((config: CaseConfig) => {
    setCaseConfig(config);
  }, []);

  const handleCaseError = useCallback((error: string) => {
    setCaseError(error);
  }, []);

  if (caseError) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '12px' }}>
        <p style={{ color: 'var(--red)', fontSize: '14px' }}>{caseError}</p>
        <a href="/" style={{ color: 'var(--blue)', fontSize: '13px' }}>Back to home</a>
      </div>
    );
  }

  if (!caseConfig) {
    return <CaseLoader caseId={caseId} onLoaded={handleCaseLoaded} onError={handleCaseError} />;
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

  const currentMilestone = caseConfig.milestones.find(
    m => m.id === simulation.currentMilestoneId
  );
  const currentMilestoneState =
    simulation.milestoneStates[simulation.currentMilestoneId];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0, background: 'var(--surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/" style={{ fontSize: '11px', color: 'var(--ink3)', textDecoration: 'none', fontWeight: 600 }}>
            OSC
          </a>
          <div style={{ width: '1px', height: '16px', background: 'var(--border)' }} />
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink1)' }}>
            {caseConfig.title}
          </p>
          <span style={{ fontSize: '11px', color: 'var(--ink3)', padding: '2px 8px', background: 'var(--elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
            {caseConfig.company}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: 'var(--orange)', fontWeight: 600 }}>
            {caseConfig.difficulty.toUpperCase()}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--ink3)' }}>
            ~{caseConfig.estimatedMinutes}min
          </span>
          <button onClick={reset} style={{ padding: '4px 10px', fontSize: '11px', color: 'var(--ink3)', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
            Reset
          </button>
        </div>
      </div>

      <MilestoneStrip caseConfig={caseConfig} simulation={simulation} />

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 300px', flex: 1, overflow: 'hidden' }}>

        <div style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--surface)' }}>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <InvestigationBoard board={simulation.board} />
          </div>
          <SkillScorecard profile={simulation.profile} totalTokensUsed={simState.totalTokensUsed} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink1)' }}>
                {currentMilestone?.title}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--ink3)' }}>
                {currentMilestone?.description}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--ink3)', fontFamily: 'monospace' }}>
                Turn {currentMilestoneState?.turns ?? 0}
              </span>
              {(currentMilestoneState?.score ?? 0) > 0 && (
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--orange)', fontFamily: 'monospace' }}>
                  {currentMilestoneState?.score}pts
                </span>
              )}
            </div>
          </div>
          <ChatInterface
            conversation={simulation.conversation}
            isThinking={simState.isThinking}
            error={simState.error}
            canAdvance={simState.canAdvance}
            currentMilestoneId={simulation.currentMilestoneId}
            availableQueries={currentMilestone?.availableQueries ?? []}
            queriesRun={currentMilestoneState?.queriesRun ?? []}
            isQueryRunning={simState.isQueryRunning}
            caseConfig={caseConfig}
            onSendMessage={sendMessage}
            onRunQuery={runQuery}
            onAdvance={advanceMilestone}
          />
        </div>

        <div style={{ borderLeft: '1px solid var(--border)', overflow: 'hidden', background: 'var(--surface)' }}>
          <MetricsPanel metrics={simState.lastMetrics} isQueryRunning={simState.isQueryRunning} />
        </div>

      </div>
    </div>
  );
}
