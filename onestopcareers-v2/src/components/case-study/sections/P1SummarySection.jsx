import React, { useState } from 'react';
import { P1_STEPS } from '../data/swiggyData.js';

export default function P1SummarySection({ predictions = {}, onDone }) {
  const [framework, setFramework] = useState('');

  const proceed = () => {
    if (framework.length < 10) { alert('Please write at least a sentence.'); return; }
    onDone(framework);
  };

  return (
    <div className="px-5 pb-6">
      <div className="flex items-center gap-3 py-6">
        <span className="font-mono text-[10px] font-semibold tracking-widest text-green uppercase">Phase 1 Complete</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Badge */}
      <div className="flex items-center gap-3 p-4 bg-green-bg border border-green-border rounded-xl mb-5">
        <div className="w-9 h-9 rounded-full bg-green flex items-center justify-center text-white font-bold text-sm flex-shrink-0">✓</div>
        <div>
          <p className="text-[14px] font-semibold text-green">Phase 1 complete</p>
          <p className="text-[12px] text-ink2">You watched Arjun investigate a real incident end-to-end.</p>
        </div>
      </div>

      {/* Predictions review */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden mb-5">
        <div className="bg-surface2 px-4 py-2.5">
          <p className="font-mono text-[9px] font-semibold text-ink3 tracking-widest uppercase">
            Your predictions vs Arjun — {Object.keys(predictions).length}/{P1_STEPS.length} completed
          </p>
        </div>
        <div className="divide-y divide-border">
          {P1_STEPS.map((step, i) => (
            <div key={step.num} className="px-4 py-3">
              <p className="text-[11px] font-semibold text-ink mb-1">Step {step.num}: {step.title}</p>
              <p className="text-[12px] text-ink3 italic">{predictions[i] || '(skipped)'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Before Phase 2 question */}
      <div className="bg-phase2-bg border-2 border-phase2-border rounded-xl p-4 mb-4">
        <p className="font-mono text-[9px] font-semibold text-phase2 tracking-widest uppercase mb-2">Before Phase 2 — Apply the framework</p>
        <p className="text-[13px] text-ink leading-relaxed mb-3">
          You're starting Phase 2. Priya sends a <em>different</em> Slack message about a different problem. What's the <strong>first thing you will do</strong> before touching any data?
        </p>
        <textarea
          value={framework}
          onChange={e => setFramework(e.target.value)}
          placeholder="I would first..."
          className="w-full min-h-[70px] bg-bg border border-border rounded-lg px-3 py-2 text-sm text-ink resize-y outline-none focus:border-border2 font-sans"
        />
      </div>

      <button onClick={proceed} className="w-full py-3.5 bg-phase2 text-white font-medium rounded-xl text-sm hover:bg-blue-700 hover:-translate-y-px transition-all">
        Continue to Phase 2 →
      </button>
    </div>
  );
}
