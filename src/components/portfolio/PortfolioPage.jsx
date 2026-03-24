// src/components/portfolio/PortfolioPage.jsx
// Renders a candidate's completed case study as a shareable portfolio.
// URL: /portfolio/:portfolioId
// Data source: Firestore portfolios/{portfolioId}

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPortfolio } from '../../services/portfolioService.js';
import { PhasePill, MonoLabel, SqlBlock, ScoreBadge, Spinner, CalloutCard } from '../ui/index.jsx';

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
    `I just completed the ${title} case study on @onestopcareers — a 3-phase analytics simulation where you investigate a real business problem, write SQL, and present findings like a real analyst.\n\nHere is my portfolio: ${url}`
  );
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${text}`;
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

// BUG FIX #8: Separate error state so a Firestore config/network failure
// doesn't show the misleading "This link seems broken" message.
const PortfolioError = () => (
  <div className="min-h-screen bg-bg flex items-center justify-center px-5">
    <div className="text-center max-w-sm">
      <p className="font-mono text-xs text-ink3 uppercase tracking-widest mb-4">Something went wrong</p>
      <h1 className="font-serif text-3xl text-ink mb-4">Couldn't load this portfolio.</h1>
      <p className="text-ink2 text-sm mb-8">There was a problem connecting to the database. Please try again in a moment.</p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-dark transition-colors"
        >
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
  const [loadError, setLoadError]   = useState(false); // BUG FIX #8: distinguish config/network error
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

  if (loading)    return <PortfolioLoading />;
  if (loadError)  return <PortfolioError />;
  if (notFound)   return <PortfolioNotFound />;

  const {
    candidateName,
    caseStudyTitle,
    completedAt,
    score,
    scoreSummary,
    aiEvaluation,
    keyQueries = [],
    finalWriteUp,
    phase3Answers = {},
  } = portfolio;

  return (
    <div className="min-h-screen bg-bg pb-24">

      {/* ── HEADER BAR ─────────────────────────────────────────────── */}
      <header className="bg-bg border-b border-border sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-between">
          <a href="/" className="font-serif text-lg text-ink">
            one<em className="text-accent not-italic">stop</em>careers
          </a>
          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(portfolioUrl, setCopied)}
              className="px-3 py-1.5 text-xs font-medium border border-border rounded-lg text-ink2 hover:bg-surface transition-colors"
            >
              {copied ? 'Copied ✓' : 'Copy link'}
            </button>
            <a
              href={linkedInShareUrl(portfolioUrl, candidateName, caseStudyTitle)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-medium bg-[#0A66C2] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Share on LinkedIn
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pt-10">

        {/* ── CANDIDATE + CASE STUDY HEADER ──────────────────────────── */}
        <section className="mb-10">
          <MonoLabel className="mb-3">{caseStudyTitle}</MonoLabel>
          <h1 className="font-serif text-3xl md:text-4xl text-ink leading-tight mb-3">
            {candidateName ? `${candidateName}'s Portfolio` : 'Case Study Portfolio'}
          </h1>
          <p className="text-ink3 text-sm mb-6">
            Completed {formatDate(completedAt)}
          </p>

          {/* Phase completion badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <PhasePill phase={1} label="Phase 1 — Watch ✓" />
            <PhasePill phase={2} label="Phase 2 — Practice ✓" />
            <PhasePill phase={3} label="Phase 3 — Execute ✓" />
          </div>

          {/* Score */}
          {typeof score === 'number' && (
            <div className="flex items-center gap-3 p-4 bg-surface border border-border rounded-xl">
              <ScoreBadge score={score} />
              <p className="text-ink2 text-sm">{scoreSummary || 'Case study completed'}</p>
            </div>
          )}
        </section>

        {/* ── AI EVALUATION ──────────────────────────────────────────── */}
        {aiEvaluation && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-accent-light border border-accent-border flex items-center justify-center">
                <span className="text-accent text-xs font-bold">A</span>
              </div>
              <div>
                <p className="text-ink text-sm font-medium">Arjun's evaluation</p>
                <p className="text-ink3 text-xs">Senior Data Analyst · Swiggy</p>
              </div>
            </div>
            <div className="bg-surface border border-border rounded-xl p-5">
              {aiEvaluation.split('\n\n').map((para, i) => (
                <p key={i} className="text-ink2 text-sm leading-relaxed mb-3 last:mb-0">
                  {para}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* ── KEY QUERIES ─────────────────────────────────────────────── */}
        {keyQueries.length > 0 && (
          <section className="mb-10">
            <MonoLabel className="mb-4">Key SQL queries</MonoLabel>
            <div className="space-y-4">
              {keyQueries.map((q, i) => (
                <div key={i}>
                  {q.question && <p className="text-ink2 text-xs mb-2 pl-1">{q.question}</p>}
                  <SqlBlock query={q.query} title={`Query ${i + 1}`} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── PHASE 3 HYPOTHESES ──────────────────────────────────────── */}
        {Object.keys(phase3Answers).length > 0 && (
          <section className="mb-10">
            <MonoLabel className="mb-4">Investigation reasoning</MonoLabel>
            <div className="space-y-4">
              {Object.entries(phase3Answers).map(([key, val]) => (
                <div key={key} className="bg-surface border border-border rounded-xl p-4">
                  <p className="text-ink text-xs font-medium uppercase tracking-wide mb-3">{key.replace(/_/g, ' ')}</p>
                  {val.hypothesis && (
                    <div className="mb-2">
                      <span className="font-mono text-[10px] text-ink3 uppercase tracking-widest">Hypothesis</span>
                      <p className="text-ink2 text-sm mt-1">{val.hypothesis}</p>
                    </div>
                  )}
                  {val.conclusion && (
                    <div>
                      <span className="font-mono text-[10px] text-ink3 uppercase tracking-widest">Conclusion</span>
                      <p className="text-ink2 text-sm mt-1">{val.conclusion}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── EXECUTIVE WRITE-UP ──────────────────────────────────────── */}
        {finalWriteUp && (
          <section className="mb-10">
            <MonoLabel className="mb-4">Executive write-up to VP</MonoLabel>
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="bg-surface border-b border-border px-5 py-3">
                <p className="text-ink3 text-xs">To: VP of Growth · Swiggy</p>
              </div>
              <div className="px-5 py-5">
                {finalWriteUp.split('\n').map((line, i) => (
                  <p key={i} className="text-ink2 text-sm leading-relaxed mb-2 last:mb-0">{line}</p>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── RECRUITER CTA ────────────────────────────────────────────── */}
        <section>
          <CalloutCard variant="accent">
            <p className="text-ink font-medium text-sm mb-2">Looking for analysts who think like this?</p>
            <p className="text-ink2 text-sm mb-3">
              onestopcareers trains analysts on real business problems and evaluates their structured thinking — not just SQL.
            </p>
            <a href="mailto:hello@onestopcareers.com" className="text-accent text-sm font-medium hover:underline">
              Get in touch about hiring →
            </a>
          </CalloutCard>
        </section>

      </main>
    </div>
  );
};

export default PortfolioPage;
