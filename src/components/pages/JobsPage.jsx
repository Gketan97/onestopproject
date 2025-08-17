// =================================================================
// FILE (UPDATE): src/components/pages/JobsPage.jsx
// PURPOSE: Implement a new, sleek, sticky search bar and prevent background scroll.
// =================================================================
import React, { useState, useEffect, useCallback } from 'react';
import JobCard from '../cards/Jobcard.jsx';
import JobDetailModal from '../modals/JobDetailModal.jsx';
import ReferralCard from '../cards/ReferralCard.jsx';
import FilterModal from '../modals/FilterModal.jsx';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const JobsPage = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [displayedJobs, setDisplayedJobs] = useState([]);
  const [jobPage, setJobPage] = useState(1);
  const [hasMoreJobs, setHasMoreJobs] = useState(true);
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [allReferrals, setAllReferrals] = useState([]);
  const [displayedReferralCount, setDisplayedReferralCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ titles: [] });

  const debouncedJobSearchQuery = useDebounce(jobSearchQuery, 300);
  const JOBS_PER_PAGE = window.innerWidth < 768 ? 6 : 10;

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [jobsRes, referralsRes] = await Promise.all([
        fetch('https://ketangoel16-creator.github.io/onestopcareers-data/jobs.json'),
        fetch('https://ketangoel16-creator.github.io/onestopcareers-data/referrals.json')
      ]);
      if (!jobsRes.ok || !referralsRes.ok) throw new Error('Network response was not ok');
      const jobsData = await jobsRes.json();
      const referralsData = await referralsRes.json();
      
      const jobsWithIds = jobsData.map((job, index) => ({ ...job, id: index }));
      setAllJobs(jobsWithIds);
      setAllReferrals(referralsData);
    } catch (e) {
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    const lowercasedQuery = debouncedJobSearchQuery.toLowerCase();
    let results = allJobs;

    if (activeFilters.titles.length > 0) {
      results = results.filter(job => activeFilters.titles.includes(job['Job Title']));
    }

    if (lowercasedQuery) {
      results = results.filter(job =>
        (job['Job Title'] || '').toLowerCase().includes(lowercasedQuery) ||
        (job.Company || '').toLowerCase().includes(lowercasedQuery) ||
        (job.Location || '').toLowerCase().includes(lowercasedQuery)
      );
    }
    
    setFilteredJobs(results);
    setJobPage(1);
    setDisplayedJobs(results.slice(0, JOBS_PER_PAGE));
    setHasMoreJobs(results.length > JOBS_PER_PAGE);
  }, [debouncedJobSearchQuery, allJobs, JOBS_PER_PAGE, activeFilters]);

  useEffect(() => {
    if (jobPage > 1) {
      const newJobs = filteredJobs.slice(0, jobPage * JOBS_PER_PAGE);
      setDisplayedJobs(newJobs);
      setHasMoreJobs(filteredJobs.length > newJobs.length);
    }
  }, [jobPage, filteredJobs, JOBS_PER_PAGE]);
  
  const handleOpenModal = (job) => {
    setSelectedJob(job);
    window.location.hash = `job-${job.id}`;
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
    if (window.history.pushState) {
      window.history.pushState("", document.title, window.location.pathname + window.location.search);
    } else {
      window.location.hash = '';
    }
  };

  useEffect(() => {
    if (allJobs.length > 0 && window.location.hash.startsWith('#job-')) {
      const jobId = parseInt(window.location.hash.replace('#job-', ''), 10);
      const job = allJobs.find(j => j.id === jobId);
      if (job) {
        handleOpenModal(job);
      }
    }
  }, [allJobs]);
  
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectedJob || isFilterModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto'; // Cleanup on unmount
    };
  }, [selectedJob, isFilterModalOpen]);

  const handleLoadMoreJobs = () => setJobPage(prev => prev + 1);
  const handleApplyFilters = (filters) => setActiveFilters(filters);
  const handleSeeMoreReferrals = () => setDisplayedReferralCount(prev => prev + 10);

  return (
    <>
      <div className="w-full max-w-7xl mx-auto p-4 md:p-8 flex-grow z-10">
        {/* REMOVED: Redundant header */}
        <div className="sticky top-0 md:top-20 bg-[#1a1a1a] py-4 z-20 -mx-4 px-4 border-b border-gray-800">
          <div className="relative max-w-7xl mx-auto">
            <input
              type="text"
              value={jobSearchQuery}
              onChange={(e) => setJobSearchQuery(e.target.value)}
              placeholder="Search by title, company..."
              className="w-full p-3 pl-4 pr-12 bg-gray-800 text-white rounded-lg border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button onClick={() => setIsFilterModalOpen(true)} className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><title>Filter Icon</title><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            </button>
          </div>
        </div>
        
        <div className="text-center p-4 my-8 bg-green-900/50 border border-green-700 rounded-lg flex items-center justify-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" fill="#25D366" className="w-6 h-6"><path d="M38.6 24.4q0-2.9-1.2-5.5t-3.2-4.3-4.3-3.2-5.5-1.2q-2.1 0-4 .6t-3.6 1.7l-7 2.1-2.2 6.9 2.2-1.4q-1.4 2-2.1 4.2t-.7 4.5q0 2.9 1.2 5.5t3.2 4.3 4.3 3.2 5.5 1.2 5.5-1.2 4.3-3.2 3.2-4.3 1.2-5.5zm-14.7 11.4q-1.4 0-2.8-.5t-2.5-1.4-2-2-1.4-2.5-.5-2.8.5-2.8 1.4-2.5 2-2 2.5-1.4 2.8-.5 2.8.5 2.5 1.4 2 2 1.4 2.5.5 2.8q0 1.4-.5 2.8t-1.4 2.5-2 2-2.5 1.4-2.8.5zm6.6-3.3l-2.4-4.1q-.3-.5-.8-.5h-4.9q-.5 0-.8.5l-2.4 4.1q-.3.5.1.9.3.4.8.4h9.8q.5 0 .8-.4.4-.4.1-.9z"/></svg>
            <a href="https://chat.whatsapp.com/your-channel-link" target="_blank" rel="noopener noreferrer" className="font-semibold text-green-300 hover:text-green-200">
                Join our 40k+ member WhatsApp channel for instant job updates! &rarr;
            </a>
        </div>

        {loading && <p className="text-center text-gray-400">Loading...</p>}
        {error && <div className="text-center text-red-500"><p>{error}</p><button onClick={fetchAllData} className="mt-4 px-6 py-2 brand-button rounded-lg">Retry</button></div>}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {displayedJobs.map((job) => <JobCard job={job} key={job.id} onOpenModal={handleOpenModal} />)}
          </div>
        )}

        {!loading && hasMoreJobs && (
          <div className="text-center mt-12">
            <button onClick={handleLoadMoreJobs} className="px-8 py-3 brand-button font-bold rounded-lg">Load More Jobs</button>
          </div>
        )}
        
        {!loading && displayedJobs.length === 0 && <p className="text-center text-gray-400 py-4">No jobs found.</p>}

        <section className="mt-24">
            <header className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white">Get a <span className="gradient-text">Referral</span></h2>
                <p className="mt-2 text-gray-400">Connect with insiders at top companies.</p>
            </header>
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {allReferrals.slice(0, displayedReferralCount).map((ref, i) => <ReferralCard referral={ref} key={i} />)}
            </div>
            {allReferrals.length > displayedReferralCount && (
                <div className="hidden md:flex justify-center mt-12">
                    <button onClick={handleSeeMoreReferrals} className="px-8 py-3 brand-button font-bold rounded-lg">See More Referrals</button>
                </div>
            )}
            <div className="md:hidden relative">
                <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4 -mx-4 px-4">
                    {allReferrals.map((ref, i) => (
                        <div key={i} className="snap-start flex-shrink-0 w-3/4 sm:w-1/2 pr-4">
                            <ReferralCard referral={ref} />
                        </div>
                    ))}
                </div>
            </div>
             <div className="mt-12 text-center p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <h3 className="font-bold text-white text-lg">Want to refer candidates?</h3>
                <p className="text-gray-400 text-sm mt-2">Join our platform to help others in the community and build your network.</p>
                <button className="mt-4 px-6 py-2 brand-button text-sm font-bold rounded-lg">Become a Referrer</button>
            </div>
        </section>
      </div>
      
      {selectedJob && <JobDetailModal job={selectedJob} onClose={handleCloseModal} />}
      <FilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        allJobs={allJobs}
        onApplyFilters={handleApplyFilters}
      />
    </>
  );
};

export default JobsPage;
