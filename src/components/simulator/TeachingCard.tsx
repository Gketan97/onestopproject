// ============================================================
// TEACHING CARD COMPONENT
// Renders Arjun's concept teaching + MCQ checkpoint.
// User must answer correctly before investigation unlocks.
// No free text at this stage — structured learning only.
// ============================================================

'use client';

import { useState } from 'react';
import type { MilestoneTeachingContent, MCQOption } from '@/types';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface TeachingCardProps {
  content: MilestoneTeachingContent;
  milestoneOrder: number;
  onCheckpointPassed: () => void;
}

type CheckpointState =
  | { status: 'unanswered' }
  | { status: 'wrong'; selectedId: string }
  | { status: 'correct'; selectedId: string };

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────

export function TeachingCard({
  content,
  milestoneOrder,
  onCheckpointPassed,
}: TeachingCardProps) {
  const [checkpointState, setCheckpointState] = useState<CheckpointState>({
    status: 'unanswered',
  });
  const [conceptsRead, setConceptsRead] = useState(false);

  function handleOptionSelect(option: MCQOption): void {
    if (checkpointState.status === 'correct') return;

    if (option.isCorrect) {
      setCheckpointState({ status: 'correct', selectedId: option.id });
    } else {
      setCheckpointState({ status: 'wrong', selectedId: option.id });
    }
  }

  function handleRetry(): void {
    setCheckpointState({ status: 'unanswered' });
  }

  const selectedOption =
    checkpointState.status !== 'unanswered'
      ? content.options.find(o => o.id === checkpointState.selectedId) ?? null
      : null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
        padding: '24px',
        gap: '24px',
      }}
    >
      {/* Arjun intro */}
      <ArjunMessage
        name="Arjun"
        role="Staff Product Analyst · MakeMyTrip"
        message={content.arjunIntro}
        milestoneOrder={milestoneOrder}
      />

      {/* Concepts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--ink3)',
          }}
        >
          What analysts know about this stage
        </p>

        {content.concepts.map((concept, index) => (
          <ConceptBlock
            key={index}
            index={index}
            heading={concept.heading}
            body={concept.body}
            analogy={concept.analogy}
          />
        ))}
      </div>

      {/* Concepts-read confirmation */}
      {!conceptsRead && (
        <button
          onClick={() => setConceptsRead(true)}
          style={{
            padding: '10px 20px',
            background: 'rgba(79,128,255,0.1)',
            border: '1px solid rgba(79,128,255,0.3)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--blue)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            alignSelf: 'flex-start',
            transition: 'all 0.2s ease',
          }}
        >
          I&apos;ve read the concepts — test my understanding
        </button>
      )}

      {/* Checkpoint */}
      {conceptsRead && (
        <CheckpointSection
          question={content.checkpointQuestion}
          options={content.options}
          checkpointState={checkpointState}
          selectedOption={selectedOption}
          onOptionSelect={handleOptionSelect}
          onRetry={handleRetry}
          onProceed={onCheckpointPassed}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ARJUN MESSAGE
// ─────────────────────────────────────────────────────────────

interface ArjunMessageProps {
  name: string;
  role: string;
  message: string;
  milestoneOrder: number;
}

function ArjunMessage({ name, role, message, milestoneOrder }: ArjunMessageProps) {
  return (
    <div
      style={{
        padding: '20px',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-lg)',
        animation: 'slideUp 0.4s ease-out',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '14px',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(252,128,25,0.15)',
            border: '1px solid rgba(252,128,25,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--orange)',
            flexShrink: 0,
          }}
        >
          {name[0]}
        </div>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink1)' }}>
            {name}
          </p>
          <p style={{ fontSize: '11px', color: 'var(--ink3)' }}>{role}</p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              color: 'var(--orange)',
              background: 'rgba(252,128,25,0.1)',
              padding: '2px 8px',
              borderRadius: '10px',
              letterSpacing: '0.06em',
            }}
          >
            Milestone {milestoneOrder}
          </span>
        </div>
      </div>

      <p
        style={{
          fontSize: '13px',
          color: 'var(--ink2)',
          lineHeight: 1.75,
        }}
      >
        {message}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CONCEPT BLOCK
// ─────────────────────────────────────────────────────────────

interface ConceptBlockProps {
  index: number;
  heading: string;
  body: string;
  analogy?: string;
}

function ConceptBlock({ index, heading, body, analogy }: ConceptBlockProps) {
  return (
    <div
      style={{
        padding: '16px',
        background: 'var(--elevated)',
        border: '1px solid var(--border)',
        borderLeft: '3px solid var(--blue)',
        borderRadius: '0 var(--radius-md) var(--radius-md) 0',
        animation: `slideUp ${0.2 + index * 0.1}s ease-out`,
      }}
    >
      <p
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--ink1)',
          marginBottom: '8px',
          lineHeight: 1.4,
        }}
      >
        {heading}
      </p>
      <p
        style={{
          fontSize: '12px',
          color: 'var(--ink2)',
          lineHeight: 1.7,
          marginBottom: analogy ? '10px' : 0,
        }}
      >
        {body}
      </p>
      {analogy && (
        <div
          style={{
            padding: '8px 12px',
            background: 'rgba(79,128,255,0.06)',
            border: '1px solid rgba(79,128,255,0.12)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              color: 'var(--ink3)',
              lineHeight: 1.6,
              fontStyle: 'italic',
            }}
          >
            {analogy}
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CHECKPOINT SECTION
// ─────────────────────────────────────────────────────────────

interface CheckpointSectionProps {
  question: string;
  options: MCQOption[];
  checkpointState: CheckpointState;
  selectedOption: MCQOption | null;
  onOptionSelect: (option: MCQOption) => void;
  onRetry: () => void;
  onProceed: () => void;
}

function CheckpointSection({
  question,
  options,
  checkpointState,
  selectedOption,
  onOptionSelect,
  onRetry,
  onProceed,
}: CheckpointSectionProps) {
  return (
    <div
      style={{
        padding: '20px',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-lg)',
        animation: 'slideUp 0.3s ease-out',
      }}
    >
      {/* Question header */}
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
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'rgba(252,128,25,0.15)',
            border: '1px solid rgba(252,128,25,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 700,
            color: 'var(--orange)',
            flexShrink: 0,
          }}
        >
          ?
        </div>
        <p
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--orange)',
          }}
        >
          Checkpoint — answer to proceed
        </p>
      </div>

      <p
        style={{
          fontSize: '13px',
          color: 'var(--ink1)',
          lineHeight: 1.6,
          marginBottom: '16px',
          fontWeight: 500,
        }}
      >
        {question}
      </p>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {options.map(option => (
          <OptionButton
            key={option.id}
            option={option}
            checkpointState={checkpointState}
            onSelect={onOptionSelect}
          />
        ))}
      </div>

      {/* Explanation after selection */}
      {selectedOption && checkpointState.status !== 'unanswered' && (
        <div
          style={{
            marginTop: '16px',
            padding: '12px 14px',
            background:
              checkpointState.status === 'correct'
                ? 'rgba(61,214,140,0.08)'
                : 'rgba(255,79,79,0.08)',
            border: `1px solid ${
              checkpointState.status === 'correct'
                ? 'rgba(61,214,140,0.2)'
                : 'rgba(255,79,79,0.2)'
            }`,
            borderRadius: 'var(--radius-md)',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              color:
                checkpointState.status === 'correct'
                  ? 'var(--green)'
                  : 'var(--red)',
              fontWeight: 600,
              marginBottom: '4px',
            }}
          >
            {checkpointState.status === 'correct' ? 'Correct' : 'Not quite'}
          </p>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--ink2)',
              lineHeight: 1.6,
            }}
          >
            {selectedOption.explanation}
          </p>
        </div>
      )}

      {/* Action buttons */}
      {checkpointState.status === 'wrong' && (
        <button
          onClick={onRetry}
          style={{
            marginTop: '12px',
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--ink2)',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      )}

      {checkpointState.status === 'correct' && (
        <button
          onClick={onProceed}
          style={{
            marginTop: '12px',
            padding: '10px 20px',
            background: 'var(--green)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: 'var(--glow-green)',
            transition: 'opacity 0.2s ease',
          }}
        >
          Begin investigation →
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// OPTION BUTTON
// ─────────────────────────────────────────────────────────────

interface OptionButtonProps {
  option: MCQOption;
  checkpointState: CheckpointState;
  onSelect: (option: MCQOption) => void;
}

function OptionButton({ option, checkpointState, onSelect }: OptionButtonProps) {
  const isSelected =
    checkpointState.status !== 'unanswered' &&
    checkpointState.selectedId === option.id;

  const isDisabled = checkpointState.status === 'correct';

  let borderColor = 'var(--border)';
  let bgColor = 'var(--elevated)';
  let textColor = 'var(--ink2)';

  if (isSelected) {
    if (checkpointState.status === 'correct') {
      borderColor = 'rgba(61,214,140,0.4)';
      bgColor = 'rgba(61,214,140,0.08)';
      textColor = 'var(--green)';
    } else {
      borderColor = 'rgba(255,79,79,0.4)';
      bgColor = 'rgba(255,79,79,0.08)';
      textColor = 'var(--red)';
    }
  }

  return (
    <button
      onClick={() => !isDisabled && onSelect(option)}
      disabled={isDisabled}
      style={{
        padding: '12px 14px',
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: 'var(--radius-md)',
        color: textColor,
        fontSize: '13px',
        lineHeight: 1.5,
        textAlign: 'left',
        cursor: isDisabled ? 'default' : 'pointer',
        transition: 'all 0.15s ease',
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
      }}
    >
      <span
        style={{
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          border: `1px solid ${borderColor === 'var(--border)' ? 'var(--ink4)' : borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          fontWeight: 700,
          flexShrink: 0,
          marginTop: '1px',
          color: textColor,
          background:
            isSelected && checkpointState.status === 'correct'
              ? 'var(--green)'
              : isSelected && checkpointState.status === 'wrong'
              ? 'var(--red)'
              : 'transparent',
        }}
      >
        {isSelected && checkpointState.status === 'correct'
          ? '✓'
          : isSelected && checkpointState.status === 'wrong'
          ? '✕'
          : option.id.toUpperCase()}
      </span>
      {option.text}
    </button>
  );
}
