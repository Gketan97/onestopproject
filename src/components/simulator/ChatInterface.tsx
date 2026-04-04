// ============================================================
// CHAT INTERFACE — Investigation center panel
// Arjun's conversation. Inline query suggestions.
// Dead ends explicitly rewarded.
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
  onSendMessage: (text: string) => Promise<void> | void;
  onRunQuery: (queryId: string) => Promise<unknown> | void;
  onAdvance: () => void;
  investigationNudge?: string;
  onRequestCommit?: () => void;
  readOnly?: boolean;
}

// Query ID → human label
function humanLabel(queryId: string): string {
  return queryId
    .replace(/^q_/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

export function ChatInterface({
  conversation, isThinking, error, canAdvance,
  currentMilestoneId, availableQueries, queriesRun,
  isQueryRunning, caseConfig,
  onSendMessage, onRunQuery, onAdvance,
  investigationNudge, onRequestCommit, readOnly,
}: Props) {
  const [input, setInput]       = useState('');
  const bottomRef               = useRef<HTMLDivElement>(null);
  const inputRef                = useRef<HTMLTextAreaElement>(null);
  const mentorName              = caseConfig.mentorPersona.name;

  const milestoneConversation = conversation.filter(
    t => t.milestoneId === currentMilestoneId
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [milestoneConversation, isThinking]);

  function handleSend() {
    const text = input.trim();
    if (!text || isThinking || readOnly) return;
    setInput('');
    onSendMessage(text);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const unrunQueries = availableQueries.filter(q => !queriesRun.includes(q));
  const showQueryBar = !readOnly && availableQueries.length > 0;
  const showCommit   = !readOnly && onRequestCommit && !canAdvance && milestoneConversation.length >= 2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '24px 24px 16px',
        display: 'flex', flexDirection: 'column', gap: '16px',
      }}>
        {/* Opening message */}
        {milestoneConversation.length === 0 && (
          investigationNudge
            ? <NudgeCard mentorName={mentorName} nudge={investigationNudge} />
            : <WelcomeCard mentorName={mentorName} problemBrief={caseConfig.problemBrief} />
        )}

        {/* Messages */}
        {milestoneConversation.map((turn, i) => (
          <MessageBubble key={i} turn={turn} mentorName={mentorName} />
        ))}

        {/* Thinking */}
        {isThinking && <ThinkingIndicator mentorName={mentorName} />}

        {/* Error */}
        {error && (
          <div style={{
            padding: '12px 16px',
            background: 'var(--red-dim)',
            border: '1px solid rgba(255,77,77,0.2)',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px', color: 'var(--red)',
          }}>
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Query suggestions — inline, human labels */}
      {showQueryBar && (
        <div style={{
          padding: '10px 20px',
          borderTop: '1px solid var(--border)',
          background: 'var(--surface)',
        }}>
          <p style={{
            fontSize: '10px', fontWeight: 600, color: 'var(--ink4)',
            letterSpacing: '0.09em', textTransform: 'uppercase',
            marginBottom: '7px',
          }}>
            Run analysis
          </p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {availableQueries.map(queryId => {
              const hasRun = queriesRun.includes(queryId);
              return (
                <button
                  key={queryId}
                  onClick={() => !hasRun && !isQueryRunning && onRunQuery(queryId)}
                  disabled={isQueryRunning || hasRun}
                  style={{
                    padding: '5px 12px',
                    fontSize: '11px', fontWeight: 500,
                    letterSpacing: '-0.01em',
                    color: hasRun ? 'var(--green)' : 'var(--blue)',
                    background: hasRun ? 'var(--green-dim)' : 'var(--blue-dim)',
                    border: `1px solid ${hasRun ? 'rgba(62,207,142,0.2)' : 'rgba(76,127,255,0.2)'}`,
                    borderRadius: 'var(--radius-sm)',
                    cursor: hasRun || isQueryRunning ? 'default' : 'pointer',
                    opacity: isQueryRunning && !hasRun ? 0.5 : 1,
                    transition: 'all var(--t-fast)',
                    display: 'flex', alignItems: 'center', gap: '5px',
                  }}
                >
                  {hasRun && <span style={{ fontSize: '9px' }}>✓</span>}
                  {humanLabel(queryId)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Commit trigger */}
      {showCommit && (
        <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={onRequestCommit}
            style={{
              width: '100%', padding: '10px',
              fontSize: '13px', fontWeight: 600, letterSpacing: '-0.01em',
              color: 'var(--blue)',
              background: 'var(--blue-glow)',
              border: '1px solid rgba(76,127,255,0.2)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all var(--t-fast)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-dim)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--blue-glow)'; }}
          >
            I have enough to document my finding →
          </button>
        </div>
      )}

      {/* Input */}
      {!readOnly && (
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border)',
          display: 'flex', gap: '10px', alignItems: 'flex-end',
          background: 'var(--surface)',
        }}>
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
              fontSize: '13px', lineHeight: 1.55,
              resize: 'none', outline: 'none',
              fontFamily: 'inherit',
              letterSpacing: '-0.01em',
              transition: 'border-color var(--t-fast)',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(76,127,255,0.35)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
          />
          <button
            onClick={handleSend}
            disabled={isThinking || !input.trim()}
            style={{
              padding: '10px 18px',
              background: isThinking || !input.trim() ? 'var(--elevated)' : 'var(--blue)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: isThinking || !input.trim() ? 'var(--ink4)' : '#fff',
              fontSize: '13px', fontWeight: 600, letterSpacing: '-0.01em',
              cursor: isThinking || !input.trim() ? 'default' : 'pointer',
              flexShrink: 0,
              transition: 'all var(--t-fast)',
              boxShadow: !isThinking && input.trim() ? 'var(--glow-blue)' : 'none',
            }}
          >
            {isThinking ? '···' : 'Send'}
          </button>
        </div>
      )}
    </div>
  );
}

// ── SUB-COMPONENTS ───────────────────────────────────────────

function NudgeCard({ mentorName, nudge }: { mentorName: string; nudge: string }) {
  return (
    <div style={{
      padding: '20px 22px',
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: 'var(--radius-lg)',
      animation: 'slideUp 0.4s var(--ease)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <Avatar name={mentorName} />
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink1)', letterSpacing: '-0.01em' }}>{mentorName}</p>
          <p style={{ fontSize: '11px', color: 'var(--ink3)' }}>Staff Product Analyst · MakeMyTrip</p>
        </div>
      </div>
      <p style={{ fontSize: '14px', color: 'var(--ink2)', lineHeight: 1.8 }}>{nudge}</p>
    </div>
  );
}

function WelcomeCard({ mentorName, problemBrief }: { mentorName: string; problemBrief: string }) {
  return (
    <div style={{
      padding: '20px 22px',
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: 'var(--radius-lg)',
      animation: 'slideUp 0.4s var(--ease)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <Avatar name={mentorName} />
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink1)', letterSpacing: '-0.01em' }}>{mentorName}</p>
          <p style={{ fontSize: '11px', color: 'var(--ink3)' }}>Staff Product Analyst · MakeMyTrip</p>
        </div>
      </div>
      <p style={{ fontSize: '14px', color: 'var(--ink2)', lineHeight: 1.8, marginBottom: '14px' }}>{problemBrief}</p>
      <p style={{ fontSize: '13px', color: 'var(--orange)', fontWeight: 500 }}>
        Where would you start your investigation?
      </p>
    </div>
  );
}

function MessageBubble({ turn, mentorName }: { turn: ConversationTurn; mentorName: string }) {
  const isUser = turn.role === 'user';
  return (
    <div style={{
      display: 'flex',
      flexDirection: isUser ? 'row-reverse' : 'row',
      gap: '10px', alignItems: 'flex-start',
      animation: 'slideUp 0.25s var(--ease)',
    }}>
      {!isUser && <Avatar name={mentorName} />}
      <div style={{
        maxWidth: '82%',
        padding: '11px 16px',
        background: isUser ? 'rgba(76,127,255,0.1)' : 'var(--card-bg)',
        border: `1px solid ${isUser ? 'rgba(76,127,255,0.18)' : 'var(--card-border)'}`,
        borderRadius: isUser
          ? 'var(--radius-lg) 4px var(--radius-lg) var(--radius-lg)'
          : '4px var(--radius-lg) var(--radius-lg) var(--radius-lg)',
      }}>
        <p style={{
          fontSize: '13px', color: 'var(--ink2)',
          lineHeight: 1.75, whiteSpace: 'pre-wrap',
          letterSpacing: '-0.005em',
        }}>
          {turn.content}
        </p>
      </div>
    </div>
  );
}

function ThinkingIndicator({ mentorName }: { mentorName: string }) {
  return (
    <div style={{
      display: 'flex', gap: '10px', alignItems: 'flex-start',
      animation: 'fadeIn 0.3s ease-out',
    }}>
      <Avatar name={mentorName} />
      <div style={{
        padding: '12px 16px',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '4px var(--radius-lg) var(--radius-lg) var(--radius-lg)',
        display: 'flex', gap: '4px', alignItems: 'center',
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '5px', height: '5px', borderRadius: '50%',
            background: 'var(--orange)',
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <div style={{
      width: '30px', height: '30px', borderRadius: '50%',
      background: 'rgba(255,122,47,0.1)',
      border: '1px solid rgba(255,122,47,0.25)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '11px', fontWeight: 700, color: 'var(--orange)',
      flexShrink: 0,
    }}>
      {name[0]}
    </div>
  );
}
