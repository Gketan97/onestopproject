// Produce-first input: user writes → compare with Arjun → AI evaluation
import React, { useState } from 'react';
import { useArjun } from '../hooks/useArjun.js';

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function ProduceFirst({
  id, prompt, minWords = 8, mockKey, arjunAnswer,
  hint, onSubmit, variant = 'p2',
}) {
  const [answer,   setAnswer]   = useState('');
  const [phase,    setPhase]    = useState('input'); // input | loading | compare
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const { callArjun } = useArjun();

  const wc = wordCount(answer);
  const isStrong = feedback.toLowerCase().includes('strong') ||
    feedback.toLowerCase().includes('excellent') ||
    feedback.toLowerCase().includes('right') ||
    feedback.toLowerCase().includes('correct');

  const variantColor = variant === 'p1' ? 'var(--phase1)' : variant === 'p3' ? 'var(--phase3)' : 'var(--phase2)';
  const variantBg    = variant === 'p1' ? 'var(--phase1-bg)' : variant === 'p3' ? 'var(--phase3-bg)' : 'var(--phase2-bg)';

  const submit = async () => {
    if (wc < minWords) { alert(`Please write at least ${minWords} words.`); return; }
    setPhase('loading');
    const fb = await callArjun(`Step: ${id}\nUser answer: ${answer}\nEvaluate concisely.`, mockKey);
    setFeedback(fb);
    setPhase('compare');
    const quality = fb.toLowerCase().includes('strong') || fb.toLowerCase().includes('excellent') ? 'Strong' : 'Adequate';
    onSubmit?.({ answer, feedback: fb, quality });
  };

  return (
    <div className="rounded-xl overflow-hidden my-3"
      style={{ border: '1px solid var(--border)' }}>

      {/* Prompt header */}
      <div className="px-4 py-3.5 border-b"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>{prompt}</p>
      </div>

      {/* Input */}
      {phase === 'input' && (
        <div className="px-4 py-3" style={{ background: 'var(--bg)' }}>
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Write your answer..."
            className="w-full rounded-lg px-3 py-2.5 text-sm leading-relaxed resize-y min-h-[80px] outline-none font-sans transition-colors"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--ink)',
            }}
            onFocus={e => e.target.style.borderColor = variantColor}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
            <span className="font-mono text-[10px]" style={{ color: 'var(--ink3)' }}>
              {wc} words {wc < minWords && <span style={{ color: 'var(--amber)' }}>(min {minWords})</span>}
            </span>
            <div className="flex gap-2">
              {hint && (
                <button onClick={() => setShowHint(!showHint)}
                  className="text-xs px-2.5 py-1 rounded-lg transition-colors"
                  style={{ color: 'var(--ink3)', border: '1px solid var(--border)' }}>
                  💡 Hint
                </button>
              )}
              <button onClick={submit}
                className="text-sm font-medium text-white px-4 py-1.5 rounded-lg btn-depress transition-colors"
                style={{ background: variantColor }}>
                Submit →
              </button>
            </div>
          </div>
          {showHint && hint && (
            <div className="mt-2 p-3 rounded-lg text-xs leading-relaxed"
              style={{ background: 'var(--amber-bg)', border: '1px solid var(--amber-border)', color: 'var(--ink)' }}>
              {hint}
            </div>
          )}
        </div>
      )}

      {/* Loading */}
      {phase === 'loading' && (
        <div className="px-4 py-6 text-center" style={{ background: 'var(--bg)' }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center font-mono text-[9px] font-bold"
              style={{ background: variantBg, color: variantColor, border: `1px solid ${variantColor}40` }}>
              AJ
            </div>
            <div className="flex gap-1">
              {[0,1,2].map(i => (
                <span key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{ background: variantColor, animationDelay: `${i*0.15}s` }} />
              ))}
            </div>
          </div>
          <p className="text-xs" style={{ color: 'var(--ink3)' }}>Arjun is reading your answer…</p>
        </div>
      )}

      {/* Compare */}
      {phase === 'compare' && (
        <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
          {/* Quality badge */}
          <div className="px-4 py-2 border-b flex items-center justify-between"
            style={{ borderColor: 'var(--border)' }}>
            <p className="font-mono text-[9px] font-bold uppercase tracking-widest"
              style={{ color: 'var(--ink3)' }}>Evaluation</p>
            <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{
                color: isStrong ? 'var(--green)' : 'var(--amber)',
                background: isStrong ? 'var(--green-bg)' : 'var(--amber-bg)',
                border: `1px solid ${isStrong ? 'var(--green-border)' : 'var(--amber-border)'}`,
              }}>
              {isStrong ? '✓ Strong' : '◑ Adequate'}
            </span>
          </div>

          {/* Side by side */}
          <div className="grid grid-cols-2 divide-x" style={{ borderColor: 'var(--border)' }}>
            <div className="px-4 py-3">
              <p className="font-mono text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--ink3)' }}>You</p>
              <p className="text-xs leading-relaxed italic" style={{ color: 'var(--ink2)' }}>{answer}</p>
            </div>
            <div className="px-4 py-3">
              <p className="font-mono text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: variantColor }}>Arjun</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ink2)' }}>{arjunAnswer}</p>
            </div>
          </div>

          {/* AI feedback */}
          {feedback && (
            <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
              <p className="font-mono text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: variantColor }}>
                Arjun's note
              </p>
              <p className="text-xs leading-relaxed italic" style={{ color: 'var(--ink2)' }}>{feedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
