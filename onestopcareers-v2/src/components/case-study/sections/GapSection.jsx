import React, { useState } from 'react';
import SlackThread, { SlackMessage } from '../shared/SlackThread.jsx';
import { GAP_CATEGORIES, MOCK } from '../data/swiggyData.js';
import { useArjun } from '../hooks/useArjun.js';

export default function GapSection({ onDone }) {
  const [value, setValue] = useState('');
  const [stage, setStage] = useState('input'); // input | loading | revealed
  const [result, setResult] = useState(null);
  const { callArjun: call } = useArjun();

  const wc = value.trim().split(/\s+/).filter(Boolean).length;

  const submit = async () => {
    if (wc < 10) { alert('Please write at least a few sentences.'); return; }
    setStage('loading');
    const v = value.toLowerCase();
    const covered = {
      demand:   v.includes('hungry') || v.includes('brows') || v.includes('distract') || v.includes('intent') || v.includes('price'),
      supply:   v.includes('supply') || v.includes('restaurant') || v.includes('availab') || v.includes('delivery time') || v.includes('closed'),
      platform: v.includes('load') || v.includes('slow') || v.includes('crash') || v.includes('payment') || v.includes('friction') || v.includes('ux'),
      external: v.includes('compet') || v.includes('zomato') || v.includes('promot') || v.includes('extern') || v.includes('discount'),
    };
    const count = Object.values(covered).filter(Boolean).length;
    const isStrong = count >= 3;
    await call(`Gap exercise answer: ${value}`, isStrong ? 'gap_strong' : 'gap_weak');
    const missing = Object.entries(covered).filter(([, v]) => !v).map(([k]) => GAP_CATEGORIES[k]);
    setResult({ isStrong, missing, covered });
    setStage('revealed');
  };

  return (
    <div className="px-5 pt-2 pb-6">
      {/* Chapter heading */}
      <div className="flex items-center gap-3 py-6">
        <span className="font-mono text-[10px] font-semibold tracking-widest text-ink3 uppercase">Warm-up</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <p className="font-mono text-[10px] font-semibold text-ink3 tracking-widest uppercase mb-3">Let's see how you think right now</p>
      <h2 className="font-serif text-2xl text-ink mb-2">You're in an interview at Swiggy.</h2>
      <p className="text-sm text-ink2 mb-4">The interviewer says:</p>

      <SlackThread channel="interview · Swiggy analytics l2" className="mb-4">
        <SlackMessage initials="IV" name="Interviewer" time="Product Analytics · Swiggy">
          A user opens the Swiggy app, browses restaurants for 3–5 minutes, then closes without ordering. What are all the reasons that might happen?
        </SlackMessage>
      </SlackThread>

      {stage === 'input' && (
        <div className="bg-surface border border-border rounded-xl p-4">
          <p className="text-sm text-ink2 leading-relaxed mb-3">Answer as you would in the interview. Don't overthink — just write what comes to mind.</p>
          <textarea
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Write your answer here..."
            className="w-full min-h-[110px] bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-ink leading-relaxed resize-y outline-none focus:border-border2 font-sans"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-ink3">{wc} words</span>
            <button onClick={submit} className="px-4 py-1.5 bg-accent text-white text-xs font-medium rounded-lg hover:bg-accent-dark transition-colors">See how you did →</button>
          </div>
        </div>
      )}

      {stage === 'loading' && (
        <div className="flex items-center justify-center gap-3 py-8">
          {[0, 1, 2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-ink3 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
          <span className="text-sm text-ink3 ml-1">Evaluating...</span>
        </div>
      )}

      {stage === 'revealed' && result && (
        <div className="space-y-3">
          {/* Your answer */}
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="bg-surface2 px-4 py-2.5 flex items-center justify-between">
              <p className="font-mono text-[9px] font-semibold text-ink3 tracking-widest uppercase">Your answer</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[9px] font-semibold border ${result.isStrong ? 'bg-green-bg text-green border-green-border' : 'bg-amber-bg text-amber border-amber-border'}`}>
                {result.isStrong ? 'Strong' : 'Partial'}
              </span>
            </div>
            <div className="px-4 py-3 text-sm text-ink italic leading-relaxed">{value}</div>
          </div>

          {/* What's missing */}
          <div className="bg-amber-bg border border-amber-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-amber-border">
              <p className="font-mono text-[9px] font-semibold text-amber tracking-widest uppercase mb-2">What's missing</p>
              <p className="text-[12px] text-ink leading-relaxed italic">{result.isStrong ? MOCK.gap_strong.missed : MOCK.gap_weak.missed}</p>
            </div>
            {result.missing.length > 0 ? (
              <div className="px-4 py-3 space-y-2">
                {result.missing.map(c => (
                  <div key={c.label}>
                    <p className="text-[12px] font-semibold text-ink mb-0.5">{c.label}</p>
                    <p className="text-[12px] text-ink2 leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-3"><p className="text-[12px] text-green font-medium">You covered all categories — excellent.</p></div>
            )}
          </div>

          {/* Framework card */}
          <div className="bg-phase1-bg border-2 border-phase1-border rounded-xl p-4">
            <p className="font-mono text-[9px] font-semibold text-phase1 tracking-widest uppercase mb-2">The structure that separates ₹18L from ₹28L</p>
            <p className="text-[13px] text-ink leading-relaxed">A senior analyst doesn't just list reasons — they structure into 4 categories, then rank by <strong>probability × testability</strong>. Platform friction is fastest to verify. Supply-side next. Demand-side last.</p>
          </div>

          <button onClick={onDone} className="w-full py-3.5 bg-accent text-white font-medium rounded-xl text-sm hover:bg-accent-dark hover:-translate-y-px hover:shadow-accent transition-all">
            Start the investigation →
          </button>
          <p className="text-center text-ink3 text-xs">Free · No account · ~45 min</p>
        </div>
      )}
    </div>
  );
}
