// Produce-first input: user writes answer → compare with Arjun's answer → AI evaluation
import React, { useState } from 'react';
import { useArjun } from '../hooks/useArjun.js';

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function ProduceFirst({
  id,
  prompt,
  minWords = 8,
  mockKey,
  arjunAnswer,
  hint,
  behaviourCode,
  onComplete,        // callback({ answer, feedback, quality })
  variant = 'p2',   // p1 | p2 | p3 — controls accent color
}) {
  const [answer, setAnswer] = useState('');
  const [phase, setPhase] = useState('input'); // input | loading | compare
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const { callArjun } = useArjun();

  const wc = wordCount(answer);
  const variantClass = variant === 'p1' ? 'bg-phase2 hover:bg-[#163BB0]' : variant === 'p3' ? 'bg-phase3 hover:bg-[#135435]' : 'bg-phase2 hover:bg-[#163BB0]';

  const submit = async () => {
    if (wc < minWords) { alert(`Please write at least ${minWords} words.`); return; }
    setPhase('loading');
    const fb = await callArjun(`Step: ${id}\nUser answer: ${answer}\nEvaluate concisely.`, mockKey);
    setFeedback(fb);
    setPhase('compare');
    const isStrong = fb.toLowerCase().includes('strong') || fb.toLowerCase().includes('excellent') || fb.toLowerCase().includes('right') || fb.toLowerCase().includes('correct');
    onComplete?.({ answer, feedback: fb, quality: isStrong ? 'Strong' : 'Adequate' });
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden my-3">
      {/* Prompt */}
      <div className="px-4 py-3.5 bg-surface border-b border-border">
        <p className="text-sm text-ink leading-relaxed">{prompt}</p>
      </div>

      {/* Input phase */}
      {phase === 'input' && (
        <div className="px-4 py-3">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write your answer..."
            className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-ink leading-relaxed resize-y min-h-[80px] outline-none focus:border-border2 transition-colors"
          />
          <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
            <span className="font-mono text-[10px] text-ink3">{wc} words {wc < minWords && `(min ${minWords})`}</span>
            <div className="flex gap-2">
              {hint && (
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs text-ink3 border border-border rounded-lg px-2.5 py-1 hover:bg-surface transition-colors"
                >
                  💡 Hint
                </button>
              )}
              <button
                onClick={submit}
                className={`text-sm font-medium text-white px-4 py-1.5 rounded-lg transition-colors ${variantClass}`}
              >
                Submit →
              </button>
            </div>
          </div>
          {showHint && hint && (
            <div className="mt-2 p-3 bg-amber-bg border border-amber-border rounded-lg text-xs text-ink leading-relaxed">
              {hint}
            </div>
          )}
        </div>
      )}

      {/* Loading */}
      {phase === 'loading' && (
        <div className="px-4 py-6 text-center">
          <div className="flex gap-1.5 justify-center mb-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-2 h-2 rounded-full bg-ink3 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
          <p className="text-xs text-ink3">Arjun is reading your answer...</p>
        </div>
      )}

      {/* Compare phase */}
      {phase === 'compare' && (
        <div className="bg-surface border-t border-border">
          <div className="grid grid-cols-2">
            <div className="px-4 py-3 border-r border-border">
              <p className="font-mono text-[9px] font-bold text-ink3 uppercase tracking-widest mb-2">You</p>
              <p className="text-xs text-ink2 leading-relaxed italic">{answer}</p>
            </div>
            <div className="px-4 py-3">
              <p className="font-mono text-[9px] font-bold text-phase1 uppercase tracking-widest mb-2">Arjun</p>
              <p className="text-xs text-ink2 leading-relaxed">{arjunAnswer}</p>
            </div>
          </div>
          {feedback && (
            <div className="px-4 py-3 border-t border-border bg-bg">
              <p className="font-mono text-[9px] font-bold text-phase1 uppercase tracking-widest mb-1.5">Arjun's Evaluation</p>
              <p className="text-xs text-ink2 leading-relaxed italic">{feedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
