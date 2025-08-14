// =================================================================
// FILE (UPDATE): src/components/pages/JobsPage.jsx
// PURPOSE: Implement referrals section, smart filters, and improved UX.
// =================================================================
import React, { useState, useEffect, useCallback } from 'react';
import JobCard from '../cards/Jobcard.jsx';
import JobDetailModal from '../modals/JobDetailModal.jsx';
import ReferralCard from '../cards/ReferralCard.jsx';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const JobsPage = () => {
  // State for Jobs
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [displayedJobs, setDisplayedJobs] = useState([]);
  const [jobPage, setJobPage] = useState(1);
  const [hasMoreJobs, setHasMoreJobs] = useState(true);
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

  // State for Referrals
  const [allReferrals, setAllReferrals] = useState([]);
  const [filteredReferrals, setFilteredReferrals] = useState([]);
  
  // General State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setFilteredReferrals(referralsData);

    } catch (e) {
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Filtering for Jobs
  useEffect(() => {
    const lowercasedQuery = debouncedJobSearchQuery.toLowerCase();
    const results = allJobs.filter(job =>
      (job['Job Title'] || '').toLowerCase().includes(lowercasedQuery) ||
      (job.Company || '').toLowerCase().includes(lowercasedQuery) ||
      (job.Location || '').toLowerCase().includes(lowercasedQuery)
    );
    setFilteredJobs(results);
    setJobPage(1);
    setDisplayedJobs(results.slice(0, JOBS_PER_PAGE));
    setHasMoreJobs(results.length > JOBS_PER_PAGE);
  }, [debouncedJobSearchQuery, allJobs, JOBS_PER_PAGE]);

  // Load more jobs
  useEffect(() => {
    if (jobPage > 1) {
      const nextPageJobs = filteredJobs.slice(0, jobPage * JOBS_PER_PAGE);
      setDisplayedJobs(nextPageJobs);
      setHasMoreJobs(filteredJobs.length > jobPage * JOBS_PER_PAGE);
    }
  }, [jobPage, filteredJobs, JOBS_PER_PAGE]);

  // Deep linking for Jobs
  useEffect(() => {
    if (allJobs.length > 0 && window.location.hash.startsWith('#job-')) {
      const jobId = parseInt(window.location.hash.replace('#job-', ''), 10);
      const job = allJobs.find(j => j.id === jobId);
      if (job) setSelectedJob(job);
    }
  }, [allJobs]);

  const handleLoadMoreJobs = () => setJobPage(prev => prev + 1);
  const handleOpenModal = (job) => setSelectedJob(job);
  const handleCloseModal = () => setSelectedJob(null);

  return (
    <>
      <div className="w-full max-w-7xl mx-auto p-4 md:p-8 flex-grow z-10">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white">Job <span className="gradient-text">Opportunities</span></h1>
        </header>

        <div className="sticky top-4 md:top-20 bg-black/50 backdrop-blur-md p-2 rounded-xl z-20 mb-8">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={jobSearchQuery}
              onChange={(e) => setJobSearchQuery(e.target.value)}
              placeholder="Search by title, company..."
              className="w-full p-3 pl-4 bg-gray-800 text-white rounded-lg border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><title>Filter Icon</title><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            </button>
          </div>
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

        {/* Referrals Section */}
        <section className="mt-24">
            <header className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white">Get a <span className="gradient-text">Referral</span></h2>
                <p className="mt-2 text-gray-400">Connect with insiders at top companies.</p>
            </header>
            {/* Desktop View: Grid */}
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredReferrals.slice(0, 10).map((ref, i) => <ReferralCard referral={ref} key={i} />)}
            </div>
            {/* Mobile View: Carousel */}
            <div className="md:hidden relative">
                <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4 -mx-4 px-4">
                    {filteredReferrals.map((ref, i) => (
                        <div key={i} className="snap-start flex-shrink-0 w-3/4 sm:w-1/2 pr-4">
                            <ReferralCard referral={ref} />
                        </div>
                    ))}
                </div>
            </div>
        </section>

      </div>
      
      {selectedJob && <JobDetailModal job={selectedJob} onClose={handleCloseModal} />}
    </>
  );
};

export default JobsPage;
