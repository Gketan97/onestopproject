import React, { useState, useEffect } from 'react';
import SlackThread, { SlackMessage } from '../shared/SlackThread.jsx';
import ArjunVoice from '../shared/ArjunVoice.jsx';
import IncidentContext from './IncidentContext.jsx';
import { MOCK } from '../data/swiggyData.js';

export default function ContextSection({ onDone }) {
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [stage, setStage] = useState('kpi'); // kpi | input | loading | revealed

  // Show the full incident context dashboard first
  if (stage === 'kpi') {
    return <IncidentContext onDone={() => setStage('input')} />;
  }
  const [result, setResult] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const check = async () => {
    if (q1.length < 5 || q2.length < 5) { return; } // fields bordered on focus; short answers silently blocked
    setStage('loading');
    await new Promise(r => setTimeout(r, 700));
    const v1 = q1.toLowerCase();
    const v2 = q2.toLowerCase();
    const good1 = v1.includes('return') || v1.includes('re-engag') || v1.includes('exist') || v1.includes('narrow') || v1.includes('segment');
    const good2 = v2.includes('day') || v2.includes('week') || v2.includes('pattern') || v2.includes('control') || v2.includes('normal');
    setResult({ good1, good2 });
    setStage('revealed');
  };

  return (
    <div className={`px-5 pb-6 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center gap-3 py-6">
        <span className="font-mono text-[10px] font-semibold tracking-widest text-ink3 uppercase">Briefing</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <SlackThread channel="analytics-incident · Swiggy data team" className="mb-3">
        <SlackMessage initials="AJ" name="Arjun M." time="Mon 9:22 AM">
          Before I touch any data — Priya, quick clarification: are we talking completed orders only, or including cancellations? And is this platform-wide or a specific vertical?
        </SlackMessage>
        <SlackMessage initials="PS" name="Priya S." time="9:24 AM">
          Completed orders only. Platform-wide. The 8.3% is vs same day last week — we always compare Tuesday to Tuesday to control for day-of-week patterns.
        </SlackMessage>
      </SlackThread>

      <ArjunVoice label="Arjun — Two questions before we continue" phase={1}>
        Before pulling any data, make sure you understood what Priya just said. Answer both questions — then we continue.
      </ArjunVoice>

      {stage === 'input' && (
        <div className="space-y-3 mt-3">
          <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="text-[13px] font-semibold text-ink mb-2">Q1. "Completed orders only." — What does this tell you about where to look for the drop?</p>
            <textarea value={q1} onChange={e => setQ1(e.target.value)} placeholder="Your answer..."
              className="w-full min-h-[60px] rounded-lg px-3 py-2 text-sm text-ink resize-y outline-none font-sans custom-scrollbar"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
              onFocus={e => e.target.style.borderColor = 'rgba(79,128,255,0.5)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="text-[13px] font-semibold text-ink mb-2">Q2. "We compare Tuesday to Tuesday." — Why does Swiggy always use same-day comparison?</p>
            <textarea value={q2} onChange={e => setQ2(e.target.value)} placeholder="Your answer..."
              className="w-full min-h-[60px] rounded-lg px-3 py-2 text-sm text-ink resize-y outline-none font-sans custom-scrollbar"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
              onFocus={e => e.target.style.borderColor = 'rgba(79,128,255,0.5)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          <button
            onClick={check}
            disabled={q1.length < 5 || q2.length < 5}
            className="w-full py-3 text-white font-medium rounded-xl text-sm transition-all btn-depress disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'var(--phase1)' }}
          >
            Check my answers →
          </button>
          {(q1.length < 5 || q2.length < 5) && (
            <p className="text-center text-[11px] text-ink3">Answer both questions to continue</p>
          )}
        </div>
      )}

      {stage === 'loading' && (
        <div className="flex items-center justify-center gap-2 py-8">
          {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-ink3 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
          <span className="text-sm text-ink3 ml-1">Checking...</span>
        </div>
      )}

      {stage === 'revealed' && result && (
        <div className="space-y-3 mt-3">
          {[
            { label: 'Q1 — Completed orders', good: result.good1, yours: q1, arjun: MOCK.ctx_q1_ans },
            { label: 'Q2 — Same-day comparison', good: result.good2, yours: q2, arjun: MOCK.ctx_q2_ans },
          ].map(({ label, good, yours, arjun }) => (
            <div key={label} className="border border-border rounded-xl overflow-hidden">
              <div className="bg-surface2 px-4 py-2.5 flex items-center justify-between">
                <p className="font-mono text-[9px] font-semibold text-ink3 tracking-widest uppercase">{label}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[9px] font-semibold border ${good ? 'bg-green-bg text-green border-green-border' : 'bg-amber-bg text-amber border-amber-border'}`}>
                  {good ? 'Good' : 'Close'}
                </span>
              </div>
              <div className="grid grid-cols-2">
                <div className="px-4 py-3 border-r border-border">
                  <p className="font-mono text-[9px] text-ink3 uppercase tracking-widest mb-1.5">You</p>
                  <p className="text-[12px] text-ink2 leading-relaxed italic">{yours}</p>
                </div>
                <div className="px-4 py-3">
                  <p className="font-mono text-[9px] text-phase1 uppercase tracking-widest mb-1.5">Arjun</p>
                  <p className="text-[12px] text-ink2 leading-relaxed">{arjun}</p>
                </div>
              </div>
            </div>
          ))}
          <button onClick={onDone} className="w-full py-3.5 bg-accent text-white font-medium rounded-xl text-sm hover:bg-accent-dark hover:-translate-y-px hover:shadow-accent transition-all">
            Watch Arjun investigate →
          </button>
        </div>
      )}
    </div>
  );
}
