import React, { useState } from 'react';
import SlackThread, { SlackMessage } from '../shared/SlackThread.jsx';
import { GAP_CATEGORIES, MOCK } from '../data/swiggyData.js';
import { useArjun } from '../hooks/useArjun.js';

export default function GapSection({ onDone }) {
  const [value,   setValue]   = useState('');
  const [stage,   setStage]   = useState('input'); // input | loading | revealed
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState('');
  const { callArjun: call } = useArjun();

  const wc = value.trim().split(/\s+/).filter(Boolean).length;
  const MIN_WORDS = 8;

  const submit = async () => {
    if (wc < MIN_WORDS) {
      setError(`Please write at least ${MIN_WORDS} words — even a rough answer is fine.`);
      return;
    }
    setError('');
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
      <h2 className="text-2xl text-ink font-semibold mb-2" style={{ letterSpacing: '-0.02em' }}>You're in an interview at Swiggy.</h2>
      <p className="text-sm text-ink2 mb-4">The interviewer says:</p>

      <SlackThread channel="interview · Swiggy analytics l2" className="mb-4">
        <SlackMessage initials="IV" name="Interviewer" meta="Product Analytics · Swiggy">
          A user opens the Swiggy app, browses restaurants for 3–5 minutes, then closes without ordering. What are all the reasons that might happen?
        </SlackMessage>
      </SlackThread>

      {stage === 'input' && (
        <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className="text-sm text-ink2 leading-relaxed mb-3">Answer as you would in the interview. Don't overthink — just write what comes to mind.</p>
          <textarea
            value={value}
            onChange={e => { setValue(e.target.value); if (error) setError(''); }}
            placeholder="Write your answer here..."
            className="w-full min-h-[110px] rounded-lg px-3 py-2.5 text-sm text-ink leading-relaxed resize-y outline-none font-sans custom-scrollbar"
            style={{
              background: 'var(--surface2)',
              border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
              transition: 'border-color 0.2s',
            }}
            onFocus={e => { if (!error) e.target.style.borderColor = 'rgba(79,128,255,0.5)'; }}
            onBlur={e => { if (!error) e.target.style.borderColor = 'var(--border)'; }}
          />

          {/* Inline error — replaces alert() */}
          {error && (
            <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg"
              style={{ background: 'var(--red-bg)', border: '1px solid var(--red-border)' }}>
              <span style={{ color: 'var(--red)', fontSize: 13 }}>⚠</span>
              <p className="text-[12px]" style={{ color: 'var(--red)' }}>{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between mt-3">
            <span className="font-mono text-[11px]" style={{
              color: wc >= MIN_WORDS ? 'var(--green)' : 'var(--ink3)'
            }}>
              {wc} / {MIN_WORDS} words min
            </span>
            <button
              onClick={submit}
              className="px-4 py-1.5 text-white text-xs font-semibold rounded-lg transition-all btn-depress"
              style={{
                background: wc >= MIN_WORDS ? 'var(--accent)' : 'var(--surface2)',
                color: wc >= MIN_WORDS ? 'white' : 'var(--ink3)',
                border: `1px solid ${wc >= MIN_WORDS ? 'transparent' : 'var(--border)'}`,
                cursor: wc >= MIN_WORDS ? 'pointer' : 'default',
              }}
            >
              See how you did →
            </button>
          </div>
        </div>
      )}

      {stage === 'loading' && (
        <div className="rounded-xl p-6 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-[9px] font-bold"
              style={{ background: 'var(--phase1-bg)', color: 'var(--phase1)', border: '1px solid var(--phase1-border)' }}>
              AJ
            </div>
            <span className="text-[13px] font-medium text-ink">Arjun is reading your answer</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            {[0,1,2].map(i => (
              <span key={i} className="w-2 h-2 rounded-full animate-bounce"
                style={{ background: 'var(--phase1)', animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      )}

      {stage === 'revealed' && result && (
        <div className="space-y-3">
          {/* Score card */}
          <div className="splash-in rounded-xl overflow-hidden" style={{ background: 'var(--surface2)', border: '1px solid var(--border2)' }}>
            <div className="px-4 py-4 flex items-center justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest mb-1 text-ink3">Your warm-up result</p>
                <p className="text-2xl font-semibold" style={{ color: result.isStrong ? '#3DD68C' : '#F5A623' }}>
                  {result.isStrong ? 'Strong answer' : 'Partial coverage'}
                </p>
              </div>
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2"
                style={{
                  borderColor: result.isStrong ? '#3DD68C' : '#F5A623',
                  background: result.isStrong ? 'rgba(61,214,140,0.1)' : 'rgba(245,166,35,0.1)',
                }}>
                {result.isStrong ? '✓' : '◑'}
              </div>
            </div>
            <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <p className="text-sm italic leading-relaxed text-ink2">{value}</p>
            </div>
          </div>

          {/* Categories covered */}
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(GAP_CATEGORIES).map(([key, cat]) => {
              const covered = result.covered?.[key];
              return (
                <div key={key} className="rounded-xl p-3 block-enter"
                  style={{
                    background: covered ? 'rgba(61,214,140,0.06)' : 'rgba(255,90,101,0.06)',
                    border: `1px solid ${covered ? 'rgba(61,214,140,0.2)' : 'rgba(255,90,101,0.2)'}`,
                  }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ color: covered ? '#3DD68C' : '#FF5A65', fontSize: 14 }}>{covered ? '✓' : '×'}</span>
                    <p className="font-mono text-[10px] font-bold" style={{ color: covered ? '#3DD68C' : '#FF5A65' }}>
                      {cat.label}
                    </p>
                  </div>
                  {!covered && <p className="text-[11px] leading-relaxed text-ink2">{cat.text}</p>}
                </div>
              );
            })}
          </div>

          {/* Framework card */}
          <div className="rounded-xl p-4" style={{ background: 'var(--phase1-bg)', border: '2px solid var(--phase1-border)' }}>
            <p className="font-mono text-[9px] font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--phase1)' }}>
              The structure that separates ₹18L from ₹28L
            </p>
            <p className="text-[13px] leading-relaxed text-ink">
              A senior analyst doesn't just list reasons — they structure into 4 categories, then rank by{' '}
              <strong>probability × testability</strong>. Platform friction is fastest to verify. Supply-side next. Demand-side last.
            </p>
          </div>

          <button onClick={onDone}
            className="w-full py-3.5 text-white font-semibold rounded-xl text-sm btn-depress transition-all hover:-translate-y-px"
            style={{ background: 'var(--accent)', boxShadow: '0 4px 20px rgba(252,128,25,0.28)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-dark)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}>
            Start the investigation →
          </button>
          <p className="text-center text-[11px] text-ink3">Free · No account · ~45 min</p>
        </div>
      )}
    </div>
  );
}
