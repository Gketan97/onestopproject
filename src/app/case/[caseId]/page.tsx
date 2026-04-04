// ============================================================
// CASE STUDY PAGE — Full phase orchestration
// teach → [onboarding] → investigate → commit
// Three panels revealed only after learning complete.
// ============================================================

'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { CaseConfig } from '@/types';

import { CaseLoader }              from '@/components/simulator/CaseLoader';
import { MilestoneStrip }          from '@/components/simulator/MilestoneStrip';
import { InvestigationBoard }      from '@/components/simulator/InvestigationBoard';
import { ChatInterface }           from '@/components/simulator/ChatInterface';
import { MetricsPanel }            from '@/components/simulator/MetricsPanel';
import { SkillScorecard }          from '@/components/simulator/SkillScorecard';
import { TeachingCard }            from '@/components/simulator/TeachingCard';
import { FindingGate }             from '@/components/simulator/FindingGate';
import { InvestigationOnboarding } from '@/components/simulator/InvestigationOnboarding';
import { DuckDBLoader }            from '@/components/analytics/DuckDBLoader';
import { useSimulation }           from '@/hooks/useSimulation';
import { useDuckDB }               from '@/hooks/useDuckDB';
import { getTeachingContent }      from '@/data/teachingContentRouter';

export default function CasePage() {
  const params = useParams();
  const caseId = params.caseId as string;

  const [caseConfig, setCaseConfig]           = useState<CaseConfig | null>(null);
  const [caseError, setCaseError]             = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding]   = useState(true);

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

  // ── ERROR ────────────────────────────────────────────────
  if (caseError) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '16px' }}>
        <p style={{ color: 'var(--red)', fontSize: '14px' }}>{caseError}</p>
        <Link href="/" style={{ color: 'var(--blue)', fontSize: '13px' }}>Back to home</Link>
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

  // ── DERIVED STATE ────────────────────────────────────────
  const currentMilestone      = caseConfig.milestones.find(m => m.id === simulation.currentMilestoneId);
  const currentMilestoneState = simulation.milestoneStates[simulation.currentMilestoneId];
  const currentPhaseState     = simState.phaseStates[simulation.currentMilestoneId];
  const currentPhase          = currentPhaseState?.phase ?? 'teach';
  const teachingContent       = currentMilestone ? getTeachingContent(currentMilestone.type, caseId) : null;

  const isTeach       = currentPhase === 'teach';
  const isInvestigate = currentPhase === 'investigate';
  const isCommit      = currentPhase === 'commit';

  // Phase colors
  const phaseColor   = isTeach ? 'var(--blue)' : isInvestigate ? 'var(--orange)' : 'var(--green)';
  const phaseBg      = isTeach ? 'rgba(76,127,255,0.08)' : isInvestigate ? 'rgba(255,122,47,0.08)' : 'rgba(62,207,142,0.08)';
  const phaseBorder  = isTeach ? 'rgba(76,127,255,0.2)' : isInvestigate ? 'rgba(255,122,47,0.2)' : 'rgba(62,207,142,0.2)';
  const phaseLabel   = isTeach ? 'Learn' : isInvestigate ? 'Investigate' : 'Document';

  // ── TOP BAR ──────────────────────────────────────────────
  const TopBar = () => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', height: '48px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--surface)',
      flexShrink: 0, zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <Link href="/" style={{
          fontSize: '11px', fontWeight: 700, color: 'var(--ink3)',
          textDecoration: 'none', letterSpacing: '0.06em',
          transition: 'color var(--t-fast)',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--orange)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink3)')}
        >
          OSC
        </Link>
        <div style={{ width: '1px', height: '14px', background: 'var(--border)' }} />
        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink1)', letterSpacing: '-0.015em' }}>
          {caseConfig.title}
        </p>
        <span style={{
          fontSize: '10px', color: 'var(--ink3)',
          padding: '2px 8px',
          background: 'var(--elevated)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          letterSpacing: '-0.005em',
        }}>
          {caseConfig.company}
        </span>

        {/* Phase pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '3px 10px',
          background: phaseBg,
          border: `1px solid ${phaseBorder}`,
          borderRadius: '20px',
          transition: 'all var(--t-base)',
        }}>
          <div style={{
            width: '5px', height: '5px', borderRadius: '50%',
            background: phaseColor,
            animation: isInvestigate ? 'breathe 2s infinite' : 'none',
          }} />
          <span style={{
            fontSize: '10px', fontWeight: 600, color: phaseColor,
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            {phaseLabel}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '10px', color: 'var(--orange)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {caseConfig.difficulty}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--ink4)' }}>
          ~{caseConfig.estimatedMinutes}min
        </span>
        <button
          onClick={reset}
          style={{
            padding: '4px 10px', fontSize: '11px',
            color: 'var(--ink3)', background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)', cursor: 'pointer',
            letterSpacing: '-0.01em',
            transition: 'all var(--t-fast)',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--ink1)'; e.currentTarget.style.borderColor = 'var(--border-md)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink3)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          Reset
        </button>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════
  // TEACH PHASE — Full screen, vertical, no distraction
  // ══════════════════════════════════════════════════════════
  if (isTeach) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
        <TopBar />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {teachingContent && (
            <TeachingCard
              content={teachingContent}
              milestoneOrder={currentMilestone?.order ?? 1}
              caseTitle={caseConfig.title}
              problemBrief={caseConfig.problemBrief}
              company={caseConfig.company}
              onCheckpointPassed={() => {
                setShowOnboarding(true);
                handleCheckpointPassed(simulation.currentMilestoneId);
              }}
            />
          )}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════
  // INVESTIGATE + COMMIT — Three-panel layout
  // Onboarding overlay on first investigation entry
  // ══════════════════════════════════════════════════════════
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <TopBar />
      <MilestoneStrip caseConfig={caseConfig} simulation={simulation} />

      {/* Three panels */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr auto',
        flex: 1,
        overflow: 'hidden',
      }}>

        {/* LEFT — Case study doc */}
        <div style={{
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          background: 'var(--surface)',
          animation: 'slideInLeft 0.4s var(--ease)',
        }}>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <InvestigationBoard board={simulation.board} />
          </div>
          <SkillScorecard
            profile={simulation.profile}
            totalTokensUsed={simState.totalTokensUsed}
          />
        </div>

        {/* CENTER — Chat + commit */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.4s var(--ease)',
        }}>
          {/* Milestone bar */}
          <div style={{
            padding: '10px 22px',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink1)', letterSpacing: '-0.015em' }}>
                {currentMilestone?.title}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--ink3)' }}>
                {currentMilestone?.description}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isInvestigate && (
                <span style={{ fontSize: '11px', color: 'var(--ink4)', fontVariantNumeric: 'tabular-nums' }}>
                  Turn {currentMilestoneState?.turns ?? 0}
                </span>
              )}
            </div>
          </div>

          {/* INVESTIGATE */}
          {isInvestigate && (
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
                onRequestCommit={() => handleRequestCommit(simulation.currentMilestoneId)}
              />
            </div>
          )}

          {/* COMMIT */}
          {isCommit && teachingContent && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
                <div style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: '40px',
                  animation: 'fadeIn 0.3s var(--ease)',
                }}>
                  <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%',
                      background: 'var(--green-dim)',
                      border: '1.5px solid rgba(62,207,142,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '20px',
                      margin: '0 auto 18px',
                    }}>✓</div>
                    <h3 style={{
                      fontSize: '18px', fontWeight: 700, color: 'var(--ink1)',
                      letterSpacing: '-0.02em', marginBottom: '8px',
                    }}>
                      Finding documented
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--ink3)', lineHeight: 1.65, marginBottom: '28px' }}>
                      Ready for the next milestone when you are.
                    </p>
                    <button
                      onClick={advanceMilestone}
                      style={{
                        padding: '12px 32px',
                        background: 'var(--green)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        color: '#fff',
                        fontSize: '14px', fontWeight: 600, letterSpacing: '-0.01em',
                        cursor: 'pointer',
                        boxShadow: 'var(--glow-green)',
                        transition: 'opacity var(--t-fast)',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                      Next milestone →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT — Data panel (self-managing width) */}
        <div style={{
          overflow: 'hidden',
          animation: 'slideInRight 0.4s var(--ease)',
        }}>
          <MetricsPanel
            metrics={simState.lastMetrics}
            isQueryRunning={simState.isQueryRunning}
          />
        </div>
      </div>

      {/* Investigation onboarding overlay */}
      {isInvestigate && showOnboarding && teachingContent && (
        <InvestigationOnboarding
          mentorName={caseConfig.mentorPersona.name}
          investigationNudge={teachingContent.investigationNudge}
          onDismiss={() => setShowOnboarding(false)}
        />
      )}
    </div>
  );
}
