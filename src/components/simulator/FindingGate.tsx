// ============================================================
// FINDING GATE — Commit phase
// Full-screen vertical experience. No frozen chat.
// Arjun's prompt → User writes → Depth evaluation → Accept
// ============================================================

'use client';

import { useState, useRef, useEffect } from 'react';
import type { MilestoneTeachingContent } from '@/types';

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
  conversationSummary?: string[];
  onFindingAccepted: (findingText: string) => void;
  onEvaluateDepth: (text: string) => Promise<DepthEvaluation>;
}

export interface DepthEvaluation {
  isDeep: boolean;
  challenge: string;
}

export function FindingGate({
  content, milestoneId, milestoneTitle,
  conversationSummary, onFindingAccepted, onEvaluateDepth,
}: FindingGateProps) {
  const [gateState, setGateState]       = useState<GateState>({ status: 'idle' });
  const [draftText, setDraftText]       = useState('');
  const [challengeResponse, setChallengeResponse] = useState('');
  const textareaRef  = useRef<HTMLTextAreaElement>(null);
  const challengeRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (gateState.status === 'writing')         textareaRef.current?.focus();
    if (gateState.status === 'depth_challenge') challengeRef.current?.focus();
  }, [gateState.status]);

  async function handleSubmitDraft() {
    const trimmed = draftText.trim();
    if (trimmed.length < 40) return;
    setGateState({ status: 'evaluating' });
    try {
      const ev = await onEvaluateDepth(trimmed);
      if (ev.isDeep) {
        setGateState({ status: 'accepted', finalText: trimmed });
        onFindingAccepted(trimmed);
      } else {
        setGateState({ status: 'depth_challenge', challenge: ev.challenge });
      }
    } catch {
      setGateState({ status: 'accepted', finalText: trimmed });
      onFindingAccepted(trimmed);
    }
  }

  async function handleSubmitChallenge() {
    const trimmed = challengeResponse.trim();
    if (trimmed.length < 20) return;
    setGateState({ status: 'challenge_response' });
    const finalText = `${draftText.trim()}\n\nArjun challenged me on this: ${trimmed}`;
    await new Promise(r => setTimeout(r, 1000));
    setGateState({ status: 'accepted', finalText });
    onFindingAccepted(finalText);
  }

  if (gateState.status === 'accepted') {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 48px',
        animation: 'scaleIn 0.35s var(--ease)',
      }}>
        <div style={{
          maxWidth: '520px', width: '100%', textAlign: 'center',
        }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: 'var(--green-dim)',
            border: '1.5px solid rgba(62,207,142,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px',
            margin: '0 auto 20px',
            animation: 'scaleIn 0.3s var(--ease)',
          }}>
            ✓
          </div>
          <h2 style={{
            fontSize: '20px', fontWeight: 700, color: 'var(--ink1)',
            letterSpacing: '-0.02em', marginBottom: '10px',
          }}>
            Added to your case study
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--ink3)', lineHeight: 1.7, marginBottom: '24px' }}>
            {milestoneTitle} — your finding is documented. Advance to the next milestone when ready.
          </p>
          <div style={{
            padding: '16px 20px',
            background: 'var(--elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'left',
          }}>
            <p style={{ fontSize: '11px', color: 'var(--ink4)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Your finding</p>
            <p style={{ fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.65 }}>
              {gateState.finalText}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1, overflowY: 'auto',
      display: 'flex', flexDirection: 'column',
      padding: '36px 48px 48px',
    }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: 'var(--orange)',
              animation: 'breathe 2s infinite',
            }} />
            <span style={{
              fontSize: '10px', fontWeight: 600, color: 'var(--orange)',
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              Document your finding
            </span>
          </div>
          <h2 style={{
            fontSize: '22px', fontWeight: 700, color: 'var(--ink1)',
            letterSpacing: '-0.025em', lineHeight: 1.2,
          }}>
            {milestoneTitle}
          </h2>
        </div>

        {/* What you found — summary from conversation */}
        {conversationSummary && conversationSummary.length > 0 && (
          <div style={{
            padding: '16px 20px',
            background: 'var(--elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '22px',
          }}>
            <p style={{ fontSize: '10px', color: 'var(--ink4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
              What you found in this milestone
            </p>
            {conversationSummary.map((point, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: i < conversationSummary.length - 1 ? '6px' : 0 }}>
                <span style={{ color: 'var(--orange)', fontSize: '11px', flexShrink: 0, marginTop: '2px' }}>·</span>
                <p style={{ fontSize: '12px', color: 'var(--ink3)', lineHeight: 1.6 }}>{point}</p>
              </div>
            ))}
          </div>
        )}

        {/* Arjun's commit prompt */}
        <div style={{
          display: 'flex', gap: '12px', marginBottom: '22px',
        }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
            background: 'rgba(255,122,47,0.1)',
            border: '1px solid rgba(255,122,47,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 700, color: 'var(--orange)',
            marginTop: '2px',
          }}>A</div>
          <div style={{
            padding: '14px 18px',
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '4px var(--radius-lg) var(--radius-lg) var(--radius-lg)',
            flex: 1,
          }}>
            <p style={{ fontSize: '14px', color: 'var(--ink2)', lineHeight: 1.75 }}>
              {content.commitPrompt}
            </p>
          </div>
        </div>

        {/* Depth challenge */}
        {gateState.status === 'depth_challenge' && (
          <div style={{
            display: 'flex', gap: '12px', marginBottom: '18px',
            animation: 'slideUp 0.3s var(--ease)',
          }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
              background: 'rgba(255,122,47,0.1)',
              border: '1px solid rgba(255,122,47,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 700, color: 'var(--orange)',
              marginTop: '2px',
            }}>A</div>
            <div style={{
              padding: '14px 18px',
              background: 'rgba(255,122,47,0.05)',
              border: '1px solid rgba(255,122,47,0.15)',
              borderRadius: '4px var(--radius-lg) var(--radius-lg) var(--radius-lg)',
              flex: 1,
            }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--orange)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Arjun challenges your finding
              </p>
              <p style={{ fontSize: '14px', color: 'var(--ink2)', lineHeight: 1.75 }}>
                {gateState.challenge}
              </p>
            </div>
          </div>
        )}

        {/* Draft preview (when challenged) */}
        {gateState.status === 'depth_challenge' && (
          <div style={{
            padding: '12px 16px',
            background: 'var(--elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '14px',
          }}>
            <p style={{ fontSize: '10px', color: 'var(--ink4)', marginBottom: '5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Your draft</p>
            <p style={{ fontSize: '13px', color: 'var(--ink3)', lineHeight: 1.6 }}>{draftText}</p>
          </div>
        )}

        {/* Textarea */}
        {(gateState.status === 'idle' || gateState.status === 'writing') && (
          <textarea
            ref={textareaRef}
            value={draftText}
            onChange={e => setDraftText(e.target.value)}
            onClick={() => gateState.status === 'idle' && setGateState({ status: 'writing' })}
            onFocus={() => gateState.status === 'idle' && setGateState({ status: 'writing' })}
            placeholder="Write your finding in your own words. Include metric names, specific numbers, and time references. Do not paraphrase Arjun — use your own analytical voice."
            rows={6}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: 'var(--elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--ink1)',
              fontSize: '14px', lineHeight: 1.7,
              resize: 'vertical', outline: 'none',
              fontFamily: 'inherit',
              marginBottom: '10px',
              boxSizing: 'border-box',
              letterSpacing: '-0.01em',
              transition: 'border-color var(--t-fast)',
            }}
            onFocusCapture={e => { e.target.style.borderColor = 'rgba(255,122,47,0.35)'; }}
            onBlurCapture={e => { e.target.style.borderColor = 'var(--border)'; }}
          />
        )}

        {gateState.status === 'depth_challenge' && (
          <textarea
            ref={challengeRef}
            value={challengeResponse}
            onChange={e => setChallengeResponse(e.target.value)}
            placeholder="Answer Arjun's challenge with specific data points and reasoning..."
            rows={4}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: 'var(--elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--ink1)',
              fontSize: '14px', lineHeight: 1.7,
              resize: 'vertical', outline: 'none',
              fontFamily: 'inherit',
              marginBottom: '10px',
              boxSizing: 'border-box',
              letterSpacing: '-0.01em',
              transition: 'border-color var(--t-fast)',
            }}
            onFocusCapture={e => { e.target.style.borderColor = 'rgba(255,122,47,0.35)'; }}
            onBlurCapture={e => { e.target.style.borderColor = 'var(--border)'; }}
          />
        )}

        {/* Evaluating */}
        {(gateState.status === 'evaluating' || gateState.status === 'challenge_response') && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 0' }}>
            <div style={{
              width: '14px', height: '14px',
              border: '2px solid var(--border)',
              borderTop: '2px solid var(--orange)',
              borderRadius: '50%',
              animation: 'spin 0.75s linear infinite',
              flexShrink: 0,
            }} />
            <p style={{ fontSize: '13px', color: 'var(--ink3)' }}>
              {gateState.status === 'challenge_response' ? 'Arjun is reading your response...' : 'Arjun is reading your finding...'}
            </p>
          </div>
        )}

        {/* Actions */}
        {(gateState.status === 'idle' || gateState.status === 'writing') && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{
              fontSize: '11px',
              color: draftText.trim().length >= 40 ? 'var(--green)' : 'var(--ink4)',
              transition: 'color var(--t-fast)',
            }}>
              {draftText.trim().length >= 40
                ? 'Ready to submit'
                : `${Math.max(0, 40 - draftText.trim().length)} more characters needed`}
            </p>
            <button
              onClick={handleSubmitDraft}
              disabled={draftText.trim().length < 40}
              style={{
                padding: '11px 26px',
                background: draftText.trim().length >= 40 ? 'var(--orange)' : 'var(--elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: draftText.trim().length >= 40 ? '#fff' : 'var(--ink4)',
                fontSize: '13px', fontWeight: 600, letterSpacing: '-0.01em',
                cursor: draftText.trim().length >= 40 ? 'pointer' : 'default',
                transition: 'all var(--t-base)',
                boxShadow: draftText.trim().length >= 40 ? 'var(--glow-orange)' : 'none',
              }}
            >
              Submit finding
            </button>
          </div>
        )}

        {gateState.status === 'depth_challenge' && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setGateState({ status: 'writing' })}
              style={{
                padding: '10px 16px', background: 'transparent',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                color: 'var(--ink3)', fontSize: '13px', cursor: 'pointer',
                letterSpacing: '-0.01em', transition: 'all var(--t-fast)',
              }}
            >
              Edit original
            </button>
            <button
              onClick={handleSubmitChallenge}
              disabled={challengeResponse.trim().length < 20}
              style={{
                padding: '10px 22px',
                background: challengeResponse.trim().length >= 20 ? 'var(--orange)' : 'var(--elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: challengeResponse.trim().length >= 20 ? '#fff' : 'var(--ink4)',
                fontSize: '13px', fontWeight: 600, letterSpacing: '-0.01em',
                cursor: challengeResponse.trim().length >= 20 ? 'pointer' : 'default',
                transition: 'all var(--t-base)',
              }}
            >
              Submit response
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
