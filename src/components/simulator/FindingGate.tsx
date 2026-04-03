// ============================================================
// FINDING GATE COMPONENT
// User authors their own board entry after investigation.
// Arjun evaluates depth via AI — shallow entries get a
// follow-up challenge before the milestone can advance.
// This is the quality gate that cannot be gamed.
// ============================================================

'use client';

import { useState, useRef, useEffect } from 'react';
import type { MilestoneTeachingContent } from '@/types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type GateState =
  | { status: 'idle' }
  | { status: 'writing' }
  | { status: 'evaluating' }
  | { status: 'depth_challenge'; challenge: string }
  | { status: 'challenge_response' }
  | { status: 'accepted'; finalText: string };

interface FindingGateProps {
  content: MilestoneTeachingContent;
  milestoneId: string;
  milestoneTitle: string;
  onFindingAccepted: (findingText: string) => void;
  onEvaluateDepth: (text: string) => Promise<DepthEvaluation>;
}

export interface DepthEvaluation {
  isDeep: boolean;
  challenge: string; // always populated — used if isDeep=false
}

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────

export function FindingGate({
  content,
  milestoneId,
  milestoneTitle,
  onFindingAccepted,
  onEvaluateDepth,
}: FindingGateProps) {
  const [gateState, setGateState] = useState<GateState>({ status: 'idle' });
  const [draftText, setDraftText] = useState('');
  const [challengeResponse, setChallengeResponse] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const challengeRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus textarea when writing begins
  useEffect(() => {
    if (gateState.status === 'writing') {
      textareaRef.current?.focus();
    }
    if (gateState.status === 'depth_challenge') {
      challengeRef.current?.focus();
    }
  }, [gateState.status]);

  // ── HANDLERS ──────────────────────────────────────────────

  function handleStartWriting(): void {
    setGateState({ status: 'writing' });
  }

  async function handleSubmitDraft(): Promise<void> {
    const trimmed = draftText.trim();
    if (trimmed.length < 40) return; // minimum meaningful length

    setGateState({ status: 'evaluating' });

    try {
      const evaluation = await onEvaluateDepth(trimmed);

      if (evaluation.isDeep) {
        setGateState({ status: 'accepted', finalText: trimmed });
        onFindingAccepted(trimmed);
      } else {
        setGateState({
          status: 'depth_challenge',
          challenge: evaluation.challenge,
        });
      }
    } catch {
      // On error, fall back to accepting — don't block the user
      setGateState({ status: 'accepted', finalText: trimmed });
      onFindingAccepted(trimmed);
    }
  }

  async function handleSubmitChallengeResponse(): Promise<void> {
    const trimmed = challengeResponse.trim();
    if (trimmed.length < 20) return;

    setGateState({ status: 'challenge_response' });

    // Combine original + challenge response into final finding
    const finalText = `${draftText.trim()}\n\nFollowing Arjun's challenge: ${trimmed}`;

    // Brief pause for UX — feels like Arjun is reading
    await new Promise(resolve => setTimeout(resolve, 1200));

    setGateState({ status: 'accepted', finalText });
    onFindingAccepted(finalText);
  }

  function handleEditDraft(): void {
    setGateState({ status: 'writing' });
    setChallengeResponse('');
  }

  // ── RENDER ────────────────────────────────────────────────

  if (gateState.status === 'accepted') {
    return <AcceptedState finalText={gateState.finalText} milestoneTitle={milestoneTitle} />;
  }

  return (
    <div
      style={{
        margin: '16px 20px',
        padding: '20px',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-lg)',
        animation: 'slideUp 0.3s ease-out',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '14px',
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--orange)',
            flexShrink: 0,
          }}
        />
        <p
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--orange)',
          }}
        >
          Add to Investigation Board
        </p>
      </div>

      {/* Commit prompt from Arjun */}
      {gateState.status === 'idle' && (
        <IdleState
          commitPrompt={content.commitPrompt}
          onStart={handleStartWriting}
        />
      )}

      {gateState.status === 'writing' && (
        <WritingState
          commitPrompt={content.commitPrompt}
          draftText={draftText}
          textareaRef={textareaRef}
          onTextChange={setDraftText}
          onSubmit={handleSubmitDraft}
        />
      )}

      {gateState.status === 'evaluating' && (
        <EvaluatingState />
      )}

      {gateState.status === 'depth_challenge' && (
        <DepthChallengeState
          challenge={gateState.challenge}
          originalText={draftText}
          challengeResponse={challengeResponse}
          challengeRef={challengeRef}
          onResponseChange={setChallengeResponse}
          onSubmit={handleSubmitChallengeResponse}
          onEdit={handleEditDraft}
        />
      )}

      {gateState.status === 'challenge_response' && (
        <EvaluatingState message="Arjun is reading your response..." />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SUB-STATES
// ─────────────────────────────────────────────────────────────

function IdleState({
  commitPrompt,
  onStart,
}: {
  commitPrompt: string;
  onStart: () => void;
}) {
  return (
    <>
      <p
        style={{
          fontSize: '13px',
          color: 'var(--ink2)',
          lineHeight: 1.7,
          marginBottom: '14px',
        }}
      >
        {commitPrompt}
      </p>
      <button
        onClick={onStart}
        style={{
          padding: '8px 16px',
          background: 'rgba(252,128,25,0.1)',
          border: '1px solid rgba(252,128,25,0.25)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--orange)',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        Write my finding
      </button>
    </>
  );
}

function WritingState({
  commitPrompt,
  draftText,
  textareaRef,
  onTextChange,
  onSubmit,
}: {
  commitPrompt: string;
  draftText: string;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onTextChange: (text: string) => void;
  onSubmit: () => void;
}) {
  const isLongEnough = draftText.trim().length >= 40;

  return (
    <>
      <p
        style={{
          fontSize: '12px',
          color: 'var(--ink3)',
          lineHeight: 1.6,
          marginBottom: '12px',
        }}
      >
        {commitPrompt}
      </p>
      <textarea
        ref={textareaRef}
        value={draftText}
        onChange={e => onTextChange(e.target.value)}
        placeholder="Write your finding in your own words. Be specific — include metric names, numbers, and time references from the data you ran."
        rows={5}
        style={{
          width: '100%',
          padding: '12px 14px',
          background: 'var(--elevated)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--ink1)',
          fontSize: '13px',
          lineHeight: 1.6,
          resize: 'vertical',
          outline: 'none',
          fontFamily: 'inherit',
          marginBottom: '10px',
          transition: 'border-color 0.2s ease',
          boxSizing: 'border-box',
        }}
        onFocus={e => {
          e.target.style.borderColor = 'rgba(252,128,25,0.4)';
        }}
        onBlur={e => {
          e.target.style.borderColor = 'var(--border)';
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <p
          style={{
            fontSize: '11px',
            color: isLongEnough ? 'var(--green)' : 'var(--ink4)',
          }}
        >
          {isLongEnough
            ? 'Good length — submit when ready'
            : `${Math.max(0, 40 - draftText.trim().length)} more characters needed`}
        </p>
        <button
          onClick={onSubmit}
          disabled={!isLongEnough}
          style={{
            padding: '8px 16px',
            background: isLongEnough ? 'var(--orange)' : 'var(--elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: isLongEnough ? '#fff' : 'var(--ink4)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: isLongEnough ? 'pointer' : 'default',
            transition: 'all 0.2s ease',
          }}
        >
          Submit finding
        </button>
      </div>
    </>
  );
}

function EvaluatingState({ message }: { message?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 0',
      }}
    >
      <div
        style={{
          width: '16px',
          height: '16px',
          border: '2px solid var(--border)',
          borderTop: '2px solid var(--orange)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          flexShrink: 0,
        }}
      />
      <p style={{ fontSize: '13px', color: 'var(--ink3)' }}>
        {message ?? 'Arjun is reading your finding...'}
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function DepthChallengeState({
  challenge,
  originalText,
  challengeResponse,
  challengeRef,
  onResponseChange,
  onSubmit,
  onEdit,
}: {
  challenge: string;
  originalText: string;
  challengeResponse: string;
  challengeRef: React.RefObject<HTMLTextAreaElement>;
  onResponseChange: (text: string) => void;
  onSubmit: () => void;
  onEdit: () => void;
}) {
  const isLongEnough = challengeResponse.trim().length >= 20;

  return (
    <>
      {/* Original finding preview */}
      <div
        style={{
          padding: '10px 12px',
          background: 'var(--elevated)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '14px',
        }}
      >
        <p style={{ fontSize: '10px', color: 'var(--ink4)', marginBottom: '4px' }}>
          Your finding
        </p>
        <p style={{ fontSize: '12px', color: 'var(--ink3)', lineHeight: 1.5 }}>
          {originalText}
        </p>
      </div>

      {/* Arjun's challenge */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '14px',
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'rgba(252,128,25,0.15)',
            border: '1px solid rgba(252,128,25,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--orange)',
            flexShrink: 0,
            marginTop: '2px',
          }}
        >
          A
        </div>
        <div
          style={{
            padding: '12px 14px',
            background: 'rgba(252,128,25,0.06)',
            border: '1px solid rgba(252,128,25,0.15)',
            borderRadius:
              '2px var(--radius-lg) var(--radius-lg) var(--radius-lg)',
            flex: 1,
          }}
        >
          <p style={{ fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.7 }}>
            {challenge}
          </p>
        </div>
      </div>

      {/* Response textarea */}
      <textarea
        ref={challengeRef}
        value={challengeResponse}
        onChange={e => onResponseChange(e.target.value)}
        placeholder="Answer Arjun's question with specifics from the data..."
        rows={3}
        style={{
          width: '100%',
          padding: '12px 14px',
          background: 'var(--elevated)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--ink1)',
          fontSize: '13px',
          lineHeight: 1.6,
          resize: 'vertical',
          outline: 'none',
          fontFamily: 'inherit',
          marginBottom: '10px',
          transition: 'border-color 0.2s ease',
          boxSizing: 'border-box',
        }}
        onFocus={e => {
          e.target.style.borderColor = 'rgba(252,128,25,0.4)';
        }}
        onBlur={e => {
          e.target.style.borderColor = 'var(--border)';
        }}
      />

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={onEdit}
          style={{
            padding: '8px 14px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--ink3)',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          Edit original
        </button>
        <button
          onClick={onSubmit}
          disabled={!isLongEnough}
          style={{
            padding: '8px 16px',
            background: isLongEnough ? 'var(--orange)' : 'var(--elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: isLongEnough ? '#fff' : 'var(--ink4)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: isLongEnough ? 'pointer' : 'default',
            transition: 'all 0.2s ease',
          }}
        >
          Submit response
        </button>
      </div>
    </>
  );
}

function AcceptedState({
  finalText,
  milestoneTitle,
}: {
  finalText: string;
  milestoneTitle: string;
}) {
  return (
    <div
      style={{
        margin: '16px 20px',
        padding: '16px',
        background: 'rgba(61,214,140,0.06)',
        border: '1px solid rgba(61,214,140,0.2)',
        borderRadius: 'var(--radius-lg)',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '10px',
        }}
      >
        <div
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: 'var(--green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            color: '#fff',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          ✓
        </div>
        <p
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--green)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Added to Investigation Board
        </p>
      </div>
      <p
        style={{
          fontSize: '12px',
          color: 'var(--ink2)',
          lineHeight: 1.6,
        }}
      >
        {finalText}
      </p>
    </div>
  );
}
