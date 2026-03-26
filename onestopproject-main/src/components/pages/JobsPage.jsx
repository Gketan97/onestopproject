// src/components/pages/JobsPage.jsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDataFetching } from '../../hooks/useDataFetching.js';
import { BookOpen, Sparkles, ArrowRight, X, Zap, Brain } from 'lucide-react';

import SearchAndTabs from '../layout/SearchAndTabs';
import JobCard from '../cards/JobCard.jsx';
import ReferralCard from '../cards/ReferralCard.jsx';
import JobDetailModal from '../modals/JobDetailModal.jsx';
import FilterModal from '../modals/FilterModal.jsx';
import ReferralFilterModal from '../modals/ReferralFilterModal.jsx';
import WhatsAppCalloutBar from '../layout/WhatsAppCalloutBar.jsx';

// ── Helpers ───────────────────────────────────────────────────────────────────

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const getItemsPerPage = () =>
  (typeof window !== 'undefined' && window.innerWidth < 768 ? 6 : 10);

const shuffleOnce = (arr) => [...arr].sort(() => Math.random() - 0.5);

// ── Flywheel Banner — pattern interrupt between search and job grid ───────────
const FlywheelBanner = ({ onDismiss, dismissed }) => {
  if (dismissed) return null;
  return (
    <div className="mb-5 rounded-2xl overflow-hidden" style={{
      background: 'rgba(252,128,25,0.05)',
      border: '1px solid rgba(252,128,25,0.18)',
      position: 'relative',
    }}>
      {/* Orange top rule */}
      <div style={{ height: 2, background: 'linear-gradient(90deg, var(--phase1), transparent)' }} />

      <div className="flex items-start gap-4 p-4 md:p-5">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(252,128,25,0.12)', border: '1px solid rgba(252,128,25,0.25)' }}>
          <Zap size={18} style={{ color: 'var(--phase1)' }} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[9px] font-bold tracking-widest uppercase mb-1" style={{ color: 'var(--phase1)' }}>
            Most analysts here won't get a callback
          </p>
          <p className="text-sm font-semibold text-ink mb-1 leading-snug">
            SQL skills got you to the job page. Problem-solving skills get you the interview.
          </p>
          <p className="text-xs text-ink2 leading-relaxed mb-3">
            Top firms like Swiggy, Uber, and Razorpay hire for{' '}
            <strong className="text-ink font-medium">structured thinking</strong>,{' '}
            not just query speed. See what separates the top 1% — free, 45 minutes.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <a href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold transition-all"
              style={{ color: 'var(--phase1)', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.gap = '8px'}
              onMouseLeave={e => e.currentTarget.style.gap = '6px'}
            >
              See why you're getting rejected
              <ArrowRight size={12} />
            </a>
            <span style={{ color: 'var(--ink3)', fontSize: 11 }}>·</span>
            <a href="/case-study/swiggy"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-ink2 hover:text-ink transition-colors"
              style={{ textDecoration: 'none' }}
            >
              <Brain size={11} />
              Try the Swiggy case study
            </a>
          </div>
        </div>

        {/* Dismiss */}
        <button onClick={onDismiss}
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'rgba(255,255,255,0.06)' }}
          aria-label="Dismiss"
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
        >
          <X size={11} style={{ color: 'var(--ink3)' }} />
        </button>
      </div>
    </div>
  );
};

// ── Completion Banner — shown to users who finished a case study ───────────────
const CompletionBanner = ({ onDismiss }) => (
  <div className="mb-6 rounded-2xl p-5 md:p-6 relative overflow-hidden glass">
    {/* decorative accent */}
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent" />
    <button
      onClick={onDismiss}
      className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
      aria-label="Dismiss"
    >
      <X size={12} className="text-white/60" />
    </button>
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
        <Sparkles size={18} className="text-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-mono text-[10px] font-semibold tracking-widest uppercase text-accent mb-1">
          Case Study Complete
        </p>
        <p className="text-white font-medium text-sm mb-1">
          You proved you can investigate like a Swiggy analyst.
        </p>
        <p className="text-white/50 text-xs leading-relaxed">
          These companies hire for exactly the skills you just demonstrated — structured thinking, SQL, and executive communication.
        </p>
        <a
          href="/case-studies/swiggy"
          className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-accent hover:text-white transition-colors"
        >
          <BookOpen size={12} />
          View your portfolio →
        </a>
      </div>
    </div>
  </div>
);

// ── Referrals explanation strip ────────────────────────────────────────────────
const ReferralsExplainer = () => (
  <div className="mb-4 px-4 py-3 bg-phase2-bg border border-phase2-border rounded-xl flex items-start gap-3">
    <div className="w-5 h-5 rounded-full bg-phase2 flex items-center justify-center flex-shrink-0 mt-0.5">
      <span className="text-white text-[9px] font-bold">i</span>
    </div>
    <p className="text-xs text-ink2 leading-relaxed">
      These are professionals at top companies willing to refer strong candidates.
      Message them on LinkedIn — attach your portfolio link to stand out.
    </p>
  </div>
);

// ── Component ─────────────────────────────────────────────────────────────────

const JobsPage = () => {
  const { allJobs, allReferrals, loading, error, usingFallback, fetchAllData } = useDataFetching();

  const [activeTab, setActiveTab]                               = useState('jobs');
  const [searchQuery, setSearchQuery]                           = useState('');
  const [selectedJob, setSelectedJob]                           = useState(null);
  const [isJobFilterModalOpen, setIsJobFilterModalOpen]         = useState(false);
  const [isReferralFilterModalOpen, setIsReferralFilterModalOpen] = useState(false);
  const [showCompletionBanner, setShowCompletionBanner]         = useState(false);
  const [flywheelDismissed, setFlywheelDismissed]               = useState(() => {
    try { return !!sessionStorage.getItem('osc_flywheel_dismissed'); } catch { return false; }
  });

  const [activeJobFilters, setActiveJobFilters]           = useState({ titles: [] });
  const [activeReferralFilters, setActiveReferralFilters] = useState({ roles: [] });

  const [currentPage, setCurrentPage]         = useState(1);
  const [highlightedJobId, setHighlightedJobId] = useState(null);
  const [itemsPerPage, setItemsPerPage]         = useState(getItemsPerPage);

  // Check localStorage for case study completion
  useEffect(() => {
    try {
      const completed = localStorage.getItem('osc_case_completed');
      const dismissed = sessionStorage.getItem('osc_banner_dismissed');
      if (completed && !dismissed) setShowCompletionBanner(true);
    } catch (_) {}
  }, []);

  const handleDismissBanner = () => {
    setShowCompletionBanner(false);
    try { sessionStorage.setItem('osc_banner_dismissed', '1'); } catch (_) {}
  };

  const handleDismissFlywheelBanner = () => {
    setFlywheelDismissed(true);
    try { sessionStorage.setItem('osc_flywheel_dismissed', '1'); } catch (_) {}
  };

  useEffect(() => {
    const handleResize = () => setItemsPerPage(getItemsPerPage());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const shuffledReferrals = useMemo(() => shuffleOnce(allReferrals), [allReferrals]);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredData = useMemo(() => {
    const q = debouncedSearchQuery.toLowerCase();
    if (activeTab === 'jobs') {
      let results = allJobs;
      if (activeJobFilters.titles.length > 0) {
        results = results.filter(job => activeJobFilters.titles.includes(job['Job Title']));
      }
      if (q) {
        results = results.filter(job =>
          (job['Job Title'] || '').toLowerCase().includes(q) ||
          (job.Company     || '').toLowerCase().includes(q) ||
          (job.Location    || '').toLowerCase().includes(q)
        );
      }
      return results;
    }
    let results = shuffledReferrals;
    if (activeReferralFilters.roles.length > 0) {
      results = results.filter(ref => activeReferralFilters.roles.includes(ref.designation));
    }
    if (q) {
      results = results.filter(ref =>
        (ref.company     || '').toLowerCase().includes(q) ||
        (ref.designation || '').toLowerCase().includes(q) ||
        (ref.name        || '').toLowerCase().includes(q)
      );
    }
    return results;
  }, [debouncedSearchQuery, activeTab, allJobs, shuffledReferrals, activeJobFilters, activeReferralFilters]);

  useEffect(() => { setCurrentPage(1); }, [activeTab, debouncedSearchQuery, activeJobFilters, activeReferralFilters]);

  const currentData = useMemo(
    () => filteredData.slice(0, currentPage * itemsPerPage),
    [currentPage, filteredData, itemsPerPage]
  );

  const hasMoreData = currentData.length < filteredData.length;

  const handleOpenModal = useCallback((job) => {
    setSelectedJob(job);
    window.location.hash = `job-${job.id}`;
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedJob(null);
    history.replaceState(null, '', window.location.pathname);
  }, []);

  // Deep-link to a specific job on page load
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#job-')) {
      const jobId = hash.replace('#job-', '');
      const job = allJobs.find(j => String(j.id) === jobId);
      if (job) {
        setSelectedJob(job);
        return;
      }
      const pageTarget = filteredData.findIndex(j => String(j.id) === jobId);
      if (pageTarget !== -1) {
        const targetPage = Math.ceil((pageTarget + 1) / itemsPerPage);
        setCurrentPage(targetPage);
        setTimeout(() => {
          const card = document.getElementById(`job-card-${jobId}`);
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setHighlightedJobId(jobId);
            setTimeout(() => setHighlightedJobId(null), 3000);
          }
        }, 100);
      }
    }
  }, [allJobs, filteredData, itemsPerPage]);

  useEffect(() => {
    const body = document.body;
    const originalStyle = window.getComputedStyle(body).overflow;
    if (selectedJob || isJobFilterModalOpen || isReferralFilterModalOpen) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = originalStyle;
    }
    return () => { body.style.overflow = originalStyle; };
  }, [selectedJob, isJobFilterModalOpen, isReferralFilterModalOpen]);

  const handleFilterClick = () => {
    if (activeTab === 'jobs') setIsJobFilterModalOpen(true);
    else setIsReferralFilterModalOpen(true);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const renderContent = () => {
    if (loading) return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="bg-bg border border-border rounded-xl p-4 h-36 animate-pulse">
            <div className="flex gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-surface2 flex-shrink-0" />
              <div className="flex-1">
                <div className="h-3 bg-surface2 rounded mb-2 w-3/4" />
                <div className="h-2.5 bg-surface2 rounded w-1/2" />
              </div>
            </div>
            <div className="h-2 bg-surface2 rounded w-1/3 mb-4" />
            <div className="h-7 bg-surface2 rounded-lg" />
          </div>
        ))}
      </div>
    );

    if (currentData.length === 0) return (
      <div className="text-center py-16">
        <p className="text-ink3 text-sm">No results found.</p>
        <p className="text-ink3 text-xs mt-1">Try adjusting your search or filters.</p>
      </div>
    );

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {activeTab === 'jobs'
          ? currentData.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onOpenModal={handleOpenModal}
                isHighlighted={job.id === highlightedJobId}
              />
            ))
          : currentData.map((ref) => <ReferralCard referral={ref} key={ref.id} />)
        }
      </div>
    );
  };

  return (
    <>
      <div className="w-full max-w-7xl mx-auto p-4 md:p-8 flex-grow z-10 min-h-screen">

        {showCompletionBanner && (
          <CompletionBanner onDismiss={handleDismissBanner} />
        )}

        <SearchAndTabs
          activeTab={activeTab}
          onTabClick={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          onFilterClick={handleFilterClick}
        />

        {/* Flywheel nudge — only show on jobs tab, dismissible per session */}
        {activeTab === 'jobs' && (
          <div className="mt-4">
            <FlywheelBanner
              dismissed={flywheelDismissed}
              onDismiss={handleDismissFlywheelBanner}
            />
          </div>
        )}

        <WhatsAppCalloutBar />

        {usingFallback && (
          <div className="mx-0 mt-3 mb-1 px-4 py-2.5 rounded-xl flex items-center gap-2"
            style={{ background: 'var(--amber-bg)', border: '1px solid var(--amber-border)' }}>
            <span style={{ fontSize: '13px', color: 'var(--amber)' }}>
              ⚠ Showing sample jobs — live listings couldn't load. Check your connection or{' '}
              <button onClick={fetchAllData} style={{ color: 'var(--accent)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                retry
              </button>.
            </span>
          </div>
        )}

        {activeTab === 'referrals' && !loading && <ReferralsExplainer />}

        <div className="mt-4">
          {/* Results count */}
          {!loading && !error && currentData.length > 0 && (
            <p className="text-xs text-ink3 mb-4 font-mono">
              {filteredData.length} {activeTab === 'jobs' ? 'jobs' : 'referrers'} found
              {(activeJobFilters.titles.length > 0 || activeReferralFilters.roles.length > 0) && (
                <span className="ml-2 text-accent">· filtered</span>
              )}
            </p>
          )}

          {renderContent()}

          {hasMoreData && (
            <div className="text-center mt-10">
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-8 py-3 border border-border rounded-xl text-sm font-medium text-ink2 hover:border-border2 hover:text-ink transition-all"
              >
                Load more {activeTab === 'jobs' ? 'jobs' : 'referrers'}
              </button>
            </div>
          )}
        </div>

        {activeTab === 'referrals' && !loading && !error && (
          <div className="mt-12 text-center p-6 bg-surface rounded-xl border border-border">
            <h3 className="font-semibold text-ink text-base">Are you at a top company?</h3>
            <p className="text-ink2 text-sm mt-2 max-w-sm mx-auto">
              Help strong analysts get in. List yourself as a referrer and give back to the community.
            </p>
            <Link to="/become-referrer">
              <button className="mt-4 px-6 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-dark transition-colors">
                Become a Referrer →
              </button>
            </Link>
          </div>
        )}
      </div>

      {selectedJob && <JobDetailModal job={selectedJob} onClose={handleCloseModal} />}

      <FilterModal
        isOpen={isJobFilterModalOpen}
        onClose={() => setIsJobFilterModalOpen(false)}
        allJobs={allJobs}
        onApplyFilters={setActiveJobFilters}
      />
      <ReferralFilterModal
        isOpen={isReferralFilterModalOpen}
        onClose={() => setIsReferralFilterModalOpen(false)}
        allReferrals={allReferrals}
        onApplyFilters={setActiveReferralFilters}
      />
    </>
  );
};

export default JobsPage;
