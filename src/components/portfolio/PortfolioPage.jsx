// src/components/portfolio/PortfolioPage.jsx
// Renders a candidate's completed case study as a shareable portfolio.
// URL: /portfolio/:portfolioId

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPortfolio } from '../../services/portfolioService.js';
import { PhasePill, MonoLabel, SqlBlock, ScoreBadge, Spinner, CalloutCard } from '../ui/index.jsx';
import { Copy, Check, Linkedin, ArrowRight, TrendingUp, MessageSquare, Code2 } from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (ts) => {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

const copyToClipboard = (text, setCopied) => {
  navigator.clipboard?.writeText(text).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }).catch(() => {});
};

const linkedInShareUrl = (url, name, title) => {
  const text = encodeURIComponent(
    `I just completed the ${title} case study on @onestopcareers — a 3-phase analytics simulation.\n\nMy portfolio: ${url}`
  );
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${text}`;
};

// ── Score dimension renderer ───────────────────────────────────────────────────
const ScoreDimension = ({ label, value, max = 100, color }) => {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-ink2">{label}</span>
        <span className="font-mono text-xs font-semibold text-ink">{value}/{max}</span>
      </div>
      <div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
};

// ── Loading / error states ────────────────────────────────────────────────────
const PortfolioLoading = () => (
  <div className="min-h-screen bg-bg flex items-center justify-center">
    <div className="text-center">
      <Spinner size="lg" className="mx-auto mb-4" />
      <p className="text-ink3 text-sm">Loading portfolio…</p>
    </div>
  </div>
);

const PortfolioNotFound = () => (
  <div className="min-h-screen bg-bg flex items-center justify-center px-5">
    <div className="text-center max-w-sm">
      <p className="font-mono text-xs text-ink3 uppercase tracking-widest mb-4">Portfolio not found</p>
      <h1 className="font-serif text-3xl text-ink mb-4">This link seems broken.</h1>
      <p className="text-ink2 text-sm mb-8">The portfolio may have been deleted or the link may be incorrect.</p>
      <a href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-dark transition-colors">
        Back to home
      </a>
    </div>
  </div>
);

const PortfolioError = () => (
  <div className="min-h-screen bg-bg flex items-center justify-center px-5">
    <div className="text-center max-w-sm">
      <p className="font-mono text-xs text-ink3 uppercase tracking-widest mb-4">Something went wrong</p>
      <h1 className="font-serif text-3xl text-ink mb-4">Couldn't load this portfolio.</h1>
      <p className="text-ink2 text-sm mb-8">There was a problem connecting. Please try again.</p>
      <div className="flex items-center justify-center gap-3">
        <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-dark transition-colors">
          Try again
        </button>
        <a href="/" className="px-5 py-2.5 border border-border text-ink2 text-sm font-medium rounded-lg hover:bg-surface transition-colors">
          Back to home
        </a>
      </div>
    </div>
  </div>
);

// ── Main portfolio component ──────────────────────────────────────────────────
const PortfolioPage = () => {
  const { portfolioId } = useParams();
  const [portfolio, setPortfolio]   = useState(null);
  const [loading, setLoading]       = useState(true);
  const [notFound, setNotFound]     = useState(false);
  const [loadError, setLoadError]   = useState(false);
  const [copied, setCopied]         = useState(false);

  const portfolioUrl = `${window.location.origin}/portfolio/${portfolioId}`;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getPortfolio(portfolioId)
      .then((data) => {
        if (cancelled) return;
        if (!data) { setNotFound(true); }
        else        { setPortfolio(data); }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) { setLoadError(true); setLoading(false); }
      });
    return () => { cancelled = true; };
  }, [portfolioId]);

  if (loading)   return <PortfolioLoading />;
  if (loadError) return <PortfolioError />;
  if (notFound)  return <PortfolioNotFound />;

  const {
    candidateName,
    caseStudyTitle = 'Swiggy Orders Investigation',
    completedAt,
    score,
    scoreSummary,
    aiEvaluation,
    keyQueries = [],
    finalWriteUp,
    phase3Answers = {},
  } = portfolio;

  // Estimated dimension scores from overall
  const dims = score != null ? [
    { label: 'Hypothesis quality', value: Math.round(score * 0.33), max: 33, color: 'var(--phase1)' },
    { label: 'SQL correctness', value: Math.round(score * 0.34), max: 34, color: 'var(--phase2)' },
    { label: 'Communication clarity', value: Math.round(score * 0.33), max: 33, color: 'var(--phase3)' },
  ] : [];

  return (
    <div className="min-h-screen bg-bg pb-24">

      {/* OG meta — injected for share previews */}
      {typeof document !== 'undefined' && (() => {
        document.title = `${candidateName ? candidateName + ' — ' : ''}Analytics Portfolio · onestopcareers`;
      })()}

      {/* ── STICKY HEADER ── */}
      <header className="bg-bg/95 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-between gap-3">
          <a href="/" className="font-serif text-lg text-ink flex-shrink-0">
            one<em className="text-accent not-italic">stop</em>careers
          </a>
          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(portfolioUrl, setCopied)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg text-ink2 hover:bg-surface transition-colors"
            >
              {copied ? <Check size={12} className="text-green" /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy link'}
            </button>
            <a
              href={linkedInShareUrl(portfolioUrl, candidateName, caseStudyTitle)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#0A66C2] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Linkedin size={12} />
              LinkedIn
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pt-10">

        {/* ── HERO — candidate + case ── */}
        <section className="mb-10">
          <MonoLabel className="mb-3">{caseStudyTitle}</MonoLabel>
          <h1 className="font-serif text-3xl md:text-4xl text-ink leading-tight mb-2">
            {candidateName ? `${candidateName}'s investigation` : 'Analytics case study portfolio'}
          </h1>
          <p className="text-ink3 text-sm mb-6">Completed {formatDate(completedAt)}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            <PhasePill phase={1} label="Phase 1 — Watch ✓" />
            <PhasePill phase={2} label="Phase 2 — Practice ✓" />
            <PhasePill phase={3} label="Phase 3 — Execute ✓" />
          </div>

          {/* Score card */}
          {typeof score === 'number' && (
            <div className="bg-surface border border-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-mono text-xs text-ink3 uppercase tracking-widest mb-1">Overall score</p>
                  <ScoreBadge score={score} />
                </div>
                <p className="text-ink2 text-sm leading-relaxed flex-1 text-right">{scoreSummary}</p>
              </div>
              {dims.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border">
                  {dims.map(d => <ScoreDimension key={d.label} {...d} />)}
                </div>
              )}
            </div>
          )}
        </section>

        {/* ── NARRATIVE STRUCTURE ── */}

        {/* 1. The problem */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-phase1-bg border border-phase1-border flex items-center justify-center">
              <TrendingUp size={12} className="text-phase1" />
            </div>
            <MonoLabel>The business problem</MonoLabel>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <p className="text-xs font-mono text-ink3 mb-1">Swiggy · North Bangalore · Biryani category</p>
            <p className="text-ink text-sm font-medium leading-relaxed">
              Orders down 34% WoW in North Bangalore's Biryani category. VP of Growth wants root cause before Monday's review. What's driving it?
            </p>
          </div>
        </section>

        {/* 2. Key queries — the actual work */}
        {keyQueries.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-phase2-bg border border-phase2-border flex items-center justify-center">
                <Code2 size={12} className="text-phase2" />
              </div>
              <MonoLabel>Key SQL queries</MonoLabel>
            </div>
            <div className="space-y-5">
              {keyQueries.map((q, i) => (
                <div key={i}>
                  {q.question && (
                    <div className="flex items-start gap-2 mb-2 px-1">
                      <span className="font-mono text-[10px] text-accent font-semibold mt-0.5">Q{i + 1}</span>
                      <p className="text-ink2 text-xs leading-relaxed">{q.question}</p>
                    </div>
                  )}
                  <SqlBlock query={q.query} title={`Query ${i + 1}`} />
                  {q.insight && (
                    <div className="mt-2 px-4 py-2.5 bg-green-bg border border-green-border rounded-lg">
                      <p className="text-green text-xs font-medium leading-relaxed">↳ {q.insight}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Investigation reasoning */}
        {Object.keys(phase3Answers).length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-phase3-bg border border-phase3-border flex items-center justify-center">
                <TrendingUp size={12} className="text-phase3" />
              </div>
              <MonoLabel>Investigation reasoning</MonoLabel>
            </div>
            <div className="space-y-3">
              {Object.entries(phase3Answers).map(([key, val]) => (
                <div key={key} className="bg-surface border border-border rounded-xl p-4">
                  <p className="font-mono text-[10px] text-ink3 uppercase tracking-widest mb-3">{key.replace(/_/g, ' ')}</p>
                  {val.hypothesis && (
                    <div className="mb-3">
                      <p className="font-mono text-[9px] text-phase1 uppercase tracking-widest mb-1">Hypothesis</p>
                      <p className="text-ink2 text-sm leading-relaxed">{val.hypothesis}</p>
                    </div>
                  )}
                  {val.conclusion && (
                    <div className="pt-3 border-t border-border">
                      <p className="font-mono text-[9px] text-phase3 uppercase tracking-widest mb-1">Conclusion</p>
                      <p className="text-ink2 text-sm leading-relaxed">{val.conclusion}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Executive write-up */}
        {finalWriteUp && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-surface2 border border-border2 flex items-center justify-center">
                <MessageSquare size={12} className="text-ink3" />
              </div>
              <MonoLabel>Executive message to VP</MonoLabel>
            </div>
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="bg-surface border-b border-border px-5 py-3 flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-phase2-bg border border-phase2-border flex items-center justify-center">
                  <span className="font-mono text-[10px] font-bold text-phase2">VP</span>
                </div>
                <div>
                  <p className="text-ink text-xs font-medium">To: VP of Growth · Swiggy</p>
                  <p className="text-ink3 text-[10px]">Re: North Bangalore order drop — root cause</p>
                </div>
              </div>
              <div className="px-5 py-5">
                {finalWriteUp.split('\n').map((line, i) => (
                  <p key={i} className="text-ink2 text-sm leading-relaxed mb-2 last:mb-0">{line}</p>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. AI Evaluation */}
        {aiEvaluation && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-accent-light border border-accent-border flex items-center justify-center flex-shrink-0">
                <span className="text-accent text-xs font-bold">A</span>
              </div>
              <div>
                <p className="text-ink text-sm font-medium">Arjun's evaluation</p>
                <p className="text-ink3 text-xs">Senior Data Analyst · Swiggy</p>
              </div>
            </div>
            <div className="bg-surface border border-border rounded-xl p-5">
              {aiEvaluation.split('\n\n').map((para, i) => (
                <p key={i} className="text-ink2 text-sm leading-relaxed mb-3 last:mb-0">{para}</p>
              ))}
            </div>
          </section>
        )}

        {/* ── DUAL CTA — share + recruiter ── */}
        <section className="space-y-4 pt-6 border-t border-border">
          {/* Share CTA */}
          <div className="flex gap-3">
            <button
              onClick={() => copyToClipboard(portfolioUrl, setCopied)}
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-border rounded-xl text-sm font-medium text-ink2 hover:bg-surface transition-colors"
            >
              {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
              {copied ? 'Link copied!' : 'Copy portfolio link'}
            </button>
            <a
              href={linkedInShareUrl(portfolioUrl, candidateName, caseStudyTitle)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#0A66C2] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Linkedin size={14} />
              Share on LinkedIn
            </a>
          </div>

          {/* Recruiter CTA */}
          <CalloutCard variant="accent">
            <p className="text-ink font-medium text-sm mb-1">Hiring analysts who think like this?</p>
            <p className="text-ink2 text-sm mb-3">
              onestopcareers evaluates structured thinking, SQL quality, and communication — not just years of experience.
            </p>
            <a href="mailto:hello@onestopcareers.com" className="text-accent text-sm font-medium hover:underline inline-flex items-center gap-1">
              Get in touch about hiring <ArrowRight size={12} />
            </a>
          </CalloutCard>

          {/* Try it yourself */}
          <div className="text-center py-4">
            <p className="text-ink3 text-xs mb-3">Not a recruiter? See how you compare.</p>
            <a
              href="/strategy/swiggy"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-dark transition-colors"
            >
              Try the same case study — free
              <ArrowRight size={13} />
            </a>
          </div>
        </section>

      </main>
    </div>
  );
};

export default PortfolioPage;
