import React, { useState, useEffect } from 'react';
import { P1_STEPS } from '../data/swiggyData.js';

export default function P1SummarySection({ predictions = {}, onDone }) {
  const [framework, setFramework] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const proceed = () => {
    if (framework.length < 10) { alert('Please write at least a sentence.'); return; }
    onDone(framework);
  };

  const predictionCount = Object.keys(predictions).length;

  return (
    <div className="px-5 pb-6" style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(12px)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
    }}>

      {/* Phase complete splash card */}
      <div className="rounded-2xl overflow-hidden mb-5 mt-4"
        style={{ background: 'linear-gradient(135deg, var(--bg) 0%, var(--surface))', border: '1px solid rgba(61,214,140,0.2)' }}>
        <div className="px-6 py-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ background: 'rgba(61,214,140,0.12)', border: '1px solid rgba(61,214,140,0.25)' }}>
            🔍
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: 'rgba(61,214,140,0.5)' }}>
              Phase 1 Complete
            </p>
            <p className="font-serif text-xl font-semibold" style={{ color: '#3DD68C' }}>
              You watched Arjun work live.
            </p>
            <p className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {predictionCount}/{P1_STEPS.length} predictions made · Root cause identified
            </p>
          </div>
        </div>
      </div>

      {/* Prediction review */}
      <div className="rounded-xl overflow-hidden mb-5"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="px-4 py-2.5" style={{ background: 'var(--surface2)' }}>
          <p className="font-mono text-[9px] font-semibold tracking-widest uppercase"
            style={{ color: 'var(--ink3)' }}>
            Your predictions vs Arjun
          </p>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {P1_STEPS.map((step, i) => (
            <div key={step.num} className="px-4 py-3">
              <p className="text-[11px] font-semibold mb-1" style={{ color: 'var(--ink)' }}>
                Step {step.num}: {step.title}
              </p>
              <p className="text-[12px] italic" style={{ color: predictions[i] ? 'var(--ink2)' : 'var(--ink3)' }}>
                {predictions[i] || '(skipped)'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Before Phase 2 */}
      <div className="rounded-xl p-4 mb-4"
        style={{ background: 'var(--phase2-bg)', border: '2px solid var(--phase2-border)' }}>
        <p className="font-mono text-[9px] font-semibold tracking-widest uppercase mb-2"
          style={{ color: 'var(--phase2)' }}>
          Before Phase 2 — Apply the framework
        </p>
        <p className="text-[13px] leading-relaxed mb-3" style={{ color: 'var(--ink)' }}>
          Priya sends a <em>different</em> Slack message about a different problem. What's the{' '}
          <strong>first thing you will do</strong> before touching any data?
        </p>
        <textarea
          value={framework}
          onChange={e => setFramework(e.target.value)}
          placeholder="I would first..."
          className="w-full min-h-[70px] rounded-lg px-3 py-2 text-sm resize-y outline-none font-sans"
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            color: 'var(--ink)',
          }}
        />
      </div>

      <button onClick={proceed}
        className="w-full py-3.5 text-white font-semibold rounded-xl text-sm btn-depress transition-all hover:-translate-y-px"
        style={{ background: 'var(--phase2)', boxShadow: '0 4px 20px rgba(79,128,255,0.25)' }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--phase2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--phase2)'}>
        Enter the investigation →
      </button>
    </div>
  );
}
