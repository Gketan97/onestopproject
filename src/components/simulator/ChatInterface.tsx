// ============================================================
// CHAT INTERFACE
// Center panel — AI mentor conversation.
// Handles message display, input, and query triggers.
// ============================================================

'use client';

import { useEffect, useRef, useState } from 'react';
import type { CaseConfig, ConversationTurn } from '@/types';

interface Props {
  conversation: ConversationTurn[];
  isThinking: boolean;
  error: string | null;
  canAdvance: boolean;
  currentMilestoneId: string;
  availableQueries: string[];
  queriesRun: string[];
  isQueryRunning: boolean;
  caseConfig: CaseConfig;
  onSendMessage: (text: string) => void;
  onRunQuery: (queryId: string) => void;
  onAdvance: () => void;
  investigationNudge?: string;
  onRequestCommit?: () => void;
  readOnly?: boolean;
}

export function ChatInterface({
  conversation,
  isThinking,
  error,
  canAdvance,
  currentMilestoneId,
  availableQueries,
  queriesRun,
  isQueryRunning,
  caseConfig,
  onSendMessage,
  onRunQuery,
  onAdvance,
  onRequestCommit,
}: Props) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isThinking]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isThinking) return;
    setInput('');
    onSendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const mentorName = caseConfig.mentorPersona.name;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Welcome message if no conversation */}
        {conversation.length === 0 && (
          <WelcomeCard
            mentorName={mentorName}
            problemBrief={caseConfig.problemBrief}
          />
        )}

        {/* Conversation turns */}
        {conversation
          .filter(t => t.milestoneId === currentMilestoneId)
          .map((turn, i) => (
            <MessageBubble key={i} turn={turn} mentorName={mentorName} />
          ))}

        {/* Thinking indicator */}
        {isThinking && <ThinkingIndicator mentorName={mentorName} />}

        {/* Error */}
        {error && (
          <div
            style={{
              padding: '12px 16px',
              background: 'rgba(255,79,79,0.08)',
              border: '1px solid rgba(255,79,79,0.2)',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              color: 'var(--red)',
            }}
          >
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Query buttons */}
      {availableQueries.length > 0 && (
        <div
          style={{
            padding: '10px 20px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              color: 'var(--ink3)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              alignSelf: 'center',
              marginRight: '4px',
            }}
          >
            Run Query:
          </span>
          {availableQueries.map(queryId => {
            const hasRun = queriesRun.includes(queryId);
            return (
              <button
                key={queryId}
                onClick={() => onRunQuery(queryId)}
                disabled={isQueryRunning || hasRun}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: hasRun ? 'var(--green)' : 'var(--blue)',
                  background: hasRun
                    ? 'rgba(61,214,140,0.08)'
                    : 'rgba(79,128,255,0.08)',
                  border: `1px solid ${hasRun
                    ? 'rgba(61,214,140,0.2)'
                    : 'rgba(79,128,255,0.2)'}`,
                  borderRadius: 'var(--radius-sm)',
                  cursor: hasRun || isQueryRunning ? 'default' : 'pointer',
                  fontFamily: 'var(--font-mono, monospace)',
                  opacity: isQueryRunning && !hasRun ? 0.6 : 1,
                  transition: 'all 0.2s ease',
                }}
              >
                {hasRun ? '✓ ' : ''}{queryId}
              </button>
            );
          })}
        </div>
      )}

      {/* Advance milestone button */}
      {onRequestCommit && !canAdvance && (conversation.filter(t => t.milestoneId === currentMilestoneId).length >= 2) && (
        <div style={{ padding: "10px 20px", borderTop: "1px solid var(--border)" }}>
          <button onClick={onRequestCommit} style={{ width: "100%", padding: "9px", fontSize: "12px", fontWeight: 600, color: "var(--blue)", background: "rgba(79,128,255,0.08)", border: "1px solid rgba(79,128,255,0.2)", borderRadius: "var(--radius-md)", cursor: "pointer" }}>
            I have enough data — document my finding
          </button>
        </div>
      )}

      {canAdvance && (
        <div
          style={{
            padding: '10px 20px',
            borderTop: '1px solid var(--border)',
          }}
        >
          <button
            onClick={onAdvance}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#fff',
              background: 'linear-gradient(135deg, var(--green), var(--green-dim))',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              boxShadow: 'var(--glow-green)',
              transition: 'opacity 0.2s ease',
            }}
          >
            Advance to Next Milestone →
          </button>
        </div>
      )}

      {/* Input */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-end',
        }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Reply to ${mentorName}...`}
          disabled={isThinking}
          rows={2}
          style={{
            flex: 1,
            padding: '10px 14px',
            background: 'var(--elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--ink1)',
            fontSize: '13px',
            lineHeight: 1.5,
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s ease',
          }}
          onFocus={e => {
            e.target.style.borderColor = 'rgba(79,128,255,0.4)';
          }}
          onBlur={e => {
            e.target.style.borderColor = 'var(--border)';
          }}
        />
        <button
          onClick={handleSend}
          disabled={isThinking || !input.trim()}
          style={{
            padding: '10px 18px',
            background: isThinking || !input.trim()
              ? 'var(--elevated)'
              : 'var(--blue)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            color: isThinking || !input.trim()
              ? 'var(--ink4)'
              : '#fff',
            fontSize: '13px',
            fontWeight: 600,
            cursor: isThinking || !input.trim() ? 'default' : 'pointer',
            transition: 'all 0.2s ease',
            flexShrink: 0,
          }}
        >
          {isThinking ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────

function WelcomeCard({
  mentorName,
  problemBrief,
}: {
  mentorName: string;
  problemBrief: string;
}) {
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
          marginBottom: '12px',
        }}
      >
        <Avatar name={mentorName} color="var(--orange)" />
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink1)' }}>
            {mentorName}
          </p>
          <p style={{ fontSize: '11px', color: 'var(--ink3)' }}>
            Staff Product Analyst · MakeMyTrip
          </p>
        </div>
      </div>
      <p style={{ fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.7 }}>
        {problemBrief}
      </p>
      <p
        style={{
          fontSize: '12px',
          color: 'var(--orange)',
          marginTop: '12px',
          fontWeight: 500,
        }}
      >
        Where would you start your investigation?
      </p>
    </div>
  );
}

function MessageBubble({
  turn,
  mentorName,
}: {
  turn: ConversationTurn;
  mentorName: string;
}) {
  const isUser = turn.role === 'user';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        gap: '10px',
        alignItems: 'flex-start',
        animation: 'slideUp 0.3s ease-out',
      }}
    >
      {!isUser && <Avatar name={mentorName} color="var(--orange)" />}

      <div
        style={{
          maxWidth: '80%',
          padding: '12px 16px',
          background: isUser
            ? 'rgba(79,128,255,0.12)'
            : 'var(--card-bg)',
          border: `1px solid ${isUser
            ? 'rgba(79,128,255,0.2)'
            : 'var(--card-border)'}`,
          borderRadius: isUser
            ? 'var(--radius-lg) var(--radius-sm) var(--radius-lg) var(--radius-lg)'
            : 'var(--radius-sm) var(--radius-lg) var(--radius-lg) var(--radius-lg)',
        }}
      >
        <p
          style={{
            fontSize: '13px',
            color: 'var(--ink2)',
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
          }}
        >
          {turn.content}
        </p>
      </div>
    </div>
  );
}

function ThinkingIndicator({ mentorName }: { mentorName: string }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      <Avatar name={mentorName} color="var(--orange)" />
      <div
        style={{
          padding: '12px 16px',
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--radius-sm) var(--radius-lg) var(--radius-lg) var(--radius-lg)',
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}
      >
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--orange)',
              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}

function Avatar({ name, color }: { name: string; color: string }) {
  return (
    <div
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: `${color}20`,
        border: `1px solid ${color}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 700,
        color,
        flexShrink: 0,
      }}
    >
      {name[0]}
    </div>
  );
}

// ── EXPORTS FOR PAGE PROP EXTENSION ──────────────────────────
// ChatInterface now accepts optional props for phase system.
// These are appended here to avoid rewriting the full file.
// The actual Props interface extension is handled via the
// component's existing optional prop pattern below.
