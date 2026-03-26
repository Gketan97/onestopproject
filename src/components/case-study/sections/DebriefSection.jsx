import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { useArjun } from '../hooks/useArjun.js';
import { savePortfolio as savePortfolioToService } from '../../../services/portfolioService.js';
import { BEHAVIOURS, MOCK } from '../data/swiggyData.js';

function genId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(crypto.getRandomValues(new Uint8Array(10))).map(b => chars[b % chars.length]).join('');
}

// Portfolio saving handled by portfolioService.js

export default function DebriefSection({ state }) {
  const { behaviours, behaviourQuality, evidence, p2ElapsedSeconds, p2QueryCount, hints, completedPhases, p2Answers = {}, p3Answers = {} } = state;
  const [stage, setStage] = useState('loading'); // loading | ready
  const [profile, setProfile] = useState('');
  const [interviewer, setInterviewer] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const { callArjun: call } = useArjun();

  const behavioursDone = BEHAVIOURS.filter(b => behaviours[b.code]).length;
  const score = Math.round((behavioursDone / BEHAVIOURS.length) * 100);

  const fmt = (sec) => { const m = Math.floor(sec / 60), s = sec % 60; return `${m}:${s < 10 ? '0' : ''}${s}`; };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const allAnswers = Object.entries({ ...p2Answers, ...p3Answers })
        .map(([k, v]) => `${k}: ${v}`).join('\n\n');
      const fb = await call(
        `Generate analytical profile for user who completed Swiggy investigation.\nAnswers:\n${allAnswers || 'User completed the case.'}\nReturn: profile (3-4 sentences) then ---INTERVIEWER--- then interviewer note (3-4 sentences).`,
        'debrief'
      );
      if (cancelled) return;
      const parts = (typeof fb === 'string' ? fb : MOCK.debrief.profile + '---INTERVIEWER---' + MOCK.debrief.interviewer).split('---INTERVIEWER---');
      const profileText = parts[0]?.trim() || MOCK.debrief.profile;
      const interviewerText = parts[1]?.trim() || MOCK.debrief.interviewer;
      setProfile(profileText);
      setInterviewer(interviewerText);

      const keyQueries = Object.entries(p2Answers)
        .filter(([, v]) => typeof v === 'string' && v.toLowerCase().includes('select'))
        .slice(0, 3)
        .map(([k, v]) => ({ question: k.replace(/-/g, ' ').replace(/_/g, ' '), query: v }));

      const portfolioId = genId();
      const scoreSummary = score >= 75 ? `${behavioursDone}/8 analytical behaviours — strong performance.` : `${behavioursDone}/8 behaviours demonstrated.`;
      const docData = {
        portfolioId, candidateName: state.candidateName || null,
        caseStudyId: 'swiggy', caseStudyTitle: 'Swiggy Orders Investigation',
        phase2Queries: p2Answers, phase3Answers: p3Answers,
        finalWriteUp: p2Answers['p2-vp-ta'] || '',
        aiEvaluation: profileText + '\n\n' + interviewerText,
        score, scoreSummary, keyQueries,
        completedPhases, behaviours,
        p2QueryCount, hints,
        completedAt: new Date().toISOString(), version: 2,
      };
      const portfolioIdFromService = await savePortfolioToService({
        portfolioId: portfolioId,
        ...docData,
      });
      if (!cancelled) {
        setPortfolioUrl(`${window.location.origin}/portfolio/${portfolioId}`);
        setStage('ready');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const copyUrl = () => {
    navigator.clipboard?.writeText(portfolioUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const liShare = () => {
    const text = encodeURIComponent(`I just completed the Swiggy Orders Investigation on onestopcareers.\n\nMy portfolio: ${portfolioUrl}`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioUrl)}&summary=${text}`, '_blank');
  };

  return (
    <div className="px-5 pb-10">

      {/* ── Analyst Stats Splash ── */}
      <div className="splash-in rounded-2xl overflow-hidden mb-6 mt-4"
        style={{ background: 'linear-gradient(135deg, #0D1120 0%, #111820 100%)', border: '1px solid rgba(79,128,255,0.2)' }}>
        <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'rgba(79,128,255,0.15)' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-[10px] font-bold tracking-widest uppercase" style={{ color: '#4F80FF' }}>
              Case 01 · Swiggy Orders Investigation
            </span>
            <span className="font-mono text-[10px]" style={{ color: '#4A5068' }}>· Complete</span>
          </div>
          <div className="flex items-end gap-4">
            <div>
              <div className="font-serif text-5xl font-semibold mb-1"
                style={{ color: score >= 75 ? '#3DD68C' : score >= 50 ? '#F5A623' : '#FF5A65' }}>
                {score}
              </div>
              <p className="font-mono text-[11px]" style={{ color: '#4A5068' }}>/ 100 analyst score</p>
            </div>
            <div className="flex-1 pb-1">
              <div className="h-2 rounded-full mb-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-2 rounded-full transition-all duration-1000"
                  style={{
                    width: `${score}%`,
                    background: score >= 75 ? '#3DD68C' : score >= 50 ? '#F5A623' : '#FF5A65',
                    boxShadow: `0 0 12px ${score >= 75 ? '#3DD68C' : score >= 50 ? '#F5A623' : '#FF5A65'}60`
                  }} />
              </div>
              <p className="font-mono text-[10px]" style={{ color: '#4A5068' }}>
                {score >= 75 ? 'Strong performance — top 25%' : score >= 50 ? 'Solid — keep practising' : 'Good start — try again'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 divide-x" style={{ borderColor: 'rgba(79,128,255,0.1)' }}>
          {[
            { label: 'Behaviours', val: `${behavioursDone}/8`,   sub: 'demonstrated',  color: behavioursDone >= 6 ? '#3DD68C' : '#F5A623' },
            { label: 'Queries',    val: p2QueryCount || 0,        sub: 'SQL written',    color: '#E8EAF0' },
            { label: 'Time',       val: fmt(p2ElapsedSeconds||0), sub: 'Phase 2',        color: '#E8EAF0' },
            { label: 'Phases',     val: completedPhases.length,   sub: 'completed',      color: completedPhases.length >= 3 ? '#3DD68C' : '#4F80FF' },
          ].map(({ label, val, sub, color }, idx) => (
            <div key={label} className="stat-counter text-center px-4 py-4" style={{ borderColor: 'rgba(79,128,255,0.1)', animationDelay: `${idx * 150}ms` }}>
              <div className="font-mono text-xl font-bold mb-0.5" style={{ color }}>{val}</div>
              <div className="font-mono text-[9px] uppercase tracking-widest" style={{ color: '#4A5068' }}>{label}</div>
              <div className="text-[10px] mt-0.5" style={{ color: '#4A5068' }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Behaviours */}
      <div className="border border-border rounded-xl overflow-hidden mb-5">
        <div className="bg-surface2 px-4 py-2.5">
          <p className="font-mono text-[9px] font-semibold text-ink3 tracking-widest uppercase">8 Analytical behaviours — {behavioursDone}/8 demonstrated</p>
        </div>
        <div className="divide-y divide-border">
          {BEHAVIOURS.map(b => {
            const done = behaviours[b.code];
            const qual = behaviourQuality?.[b.code];
            return (
              <div key={b.code} className="flex gap-3 items-start px-4 py-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 border-[1.5px] ${done ? 'bg-green-bg text-green border-green-border' : 'bg-surface2 text-ink3 border-border2'}`}>
                  {done ? '✓' : '○'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-[12px] font-medium text-ink">{b.label}</p>
                    {done && qual && (
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${qual === 'Strong' ? 'bg-green-bg text-green' : 'bg-amber-bg text-amber'}`}>{qual}</span>
                    )}
                  </div>
                  {done && evidence?.[b.code] && (
                    <p className="text-[11px] text-green italic mt-0.5">{evidence[b.code]}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI eval */}
      {stage === 'loading' ? (
        <div className="flex items-center justify-center gap-3 py-8 border border-border rounded-xl mb-5">
          {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-ink3 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
          <span className="text-sm text-ink3">Arjun is evaluating your work...</span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-phase1-bg border border-phase1-border flex items-center justify-center font-mono text-[9px] font-bold text-phase1 flex-shrink-0">AJ</div>
            <div>
              <p className="text-[13px] font-semibold text-ink">Arjun's evaluation</p>
              <p className="text-[11px] text-ink3">Senior Data Analyst · Swiggy</p>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-4 mb-4">
            <p className="text-[13px] text-ink2 leading-relaxed">{profile}</p>
          </div>
          <div className="bg-ink rounded-xl p-4 mb-5">
            <p className="font-mono text-[9px] text-white/40 tracking-widest uppercase mb-2">What your interviewer would write</p>
            <p className="text-[13px] text-white/80 leading-relaxed italic">{interviewer}</p>
          </div>

          {/* Portfolio share */}
          <div className="bg-ink rounded-xl p-4 mb-4">
            <p className="text-white text-[14px] font-semibold mb-2">Your portfolio link</p>
            <div className="bg-white/5 rounded-lg px-3 py-2 font-mono text-[11px] text-white/50 mb-3 break-all">{portfolioUrl}</div>
            <div className="flex gap-2">
              <button onClick={copyUrl} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-border rounded-lg text-[13px] font-medium text-ink2 bg-bg hover:bg-surface transition-colors">
                {copied ? <Check size={13} className="text-green" /> : <Copy size={13} />}
                {copied ? 'Copied!' : 'Copy link'}
              </button>
              <button onClick={liShare} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#0A66C2] text-white rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity">
                Share on LinkedIn
              </button>
            </div>
          </div>

          {/* Recruiter CTA */}
          <div className="bg-accent-light border border-accent-border rounded-xl p-4">
            <p className="text-[13px] font-medium text-ink mb-1">Hiring analysts who think like this?</p>
            <p className="text-[12px] text-ink2 leading-relaxed mb-2">onestopcareers evaluates structured thinking, SQL quality, and communication — not just years of experience.</p>
            <a href="mailto:hello@onestopcareers.com" className="text-accent text-[13px] font-medium hover:underline">Get in touch about hiring →</a>
          </div>
        </>
      )}
    </div>
  );
}
