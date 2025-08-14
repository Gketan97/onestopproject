// =================================================================
// FILE (UPDATE): src/components/pages/JobsPage.jsx
// PURPOSE: Implement grid layout, new search/filter UI, and modal logic.
// =================================================================
import React, { useState, useEffect, useCallback } from 'react';
import JobCard from '../cards/Jobcard.jsx';
import JobDetailModal from '../modals/JobDetailModal.jsx';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const JOBS_PER_PAGE = window.innerWidth < 768 ? 6 : 10;

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://ketangoel16-creator.github.io/onestopcareers-data/jobs.json');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const jobsWithIds = data.map((job, index) => ({ ...job, id: index }));
      setAllJobs(jobsWithIds);
    } catch (e) {
      setError('Failed to load job listings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    const lowercasedQuery = debouncedSearchQuery.toLowerCase();
    const results = allJobs.filter(job =>
      (job['Job Title'] || '').toLowerCase().includes(lowercasedQuery) ||
      (job.Company || '').toLowerCase().includes(lowercasedQuery) ||
      (job.Location || '').toLowerCase().includes(lowercasedQuery)
    );
    setFilteredJobs(results);
    setPage(1);
    setDisplayedJobs(results.slice(0, JOBS_PER_PAGE));
    setHasMore(results.length > JOBS_PER_PAGE);
  }, [debouncedSearchQuery, allJobs, JOBS_PER_PAGE]);

  useEffect(() => {
    if (page > 1) {
      const nextPageJobs = filteredJobs.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE);
      setDisplayedJobs(prevJobs => [...prevJobs, ...nextPageJobs]);
      setHasMore(filteredJobs.length > page * JOBS_PER_PAGE);
    }
  }, [page, filteredJobs, JOBS_PER_PAGE]);

  useEffect(() => {
    if (allJobs.length > 0 && window.location.hash) {
      const jobId = parseInt(window.location.hash.replace('#job-', ''), 10);
      const job = allJobs.find(j => j.id === jobId);
      if (job) {
        setSelectedJob(job);
      }
    }
  }, [allJobs]);

  const handleLoadMore = () => setPage(prevPage => prevPage + 1);
  const handleOpenModal = (job) => setSelectedJob(job);
  const handleCloseModal = () => setSelectedJob(null);

  return (
    <>
      <div className="w-full max-w-7xl mx-auto p-4 md:p-8 flex-grow z-10">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white">
            Job <span className="gradient-text">Opportunities</span>
          </h1>
        </header>

        <div className="sticky top-4 md:top-20 bg-black/50 backdrop-blur-md p-2 rounded-xl z-20 mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, company..."
              className="w-full p-3 pl-4 pr-12 bg-gray-800 text-white rounded-lg border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <title>Filter Icon</title>
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
            </button>
          </div>
        </div>

        {loading && <p className="text-center text-gray-400">Loading jobs...</p>}
        {error && <div className="text-center text-red-500"><p>{error}</p><button onClick={fetchJobs} className="mt-4 px-6 py-2 brand-button rounded-lg">Retry</button></div>}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {displayedJobs.map((job) => (
              <JobCard job={job} key={job.id} onOpenModal={handleOpenModal} />
            ))}
          </div>
        )}

        {!loading && hasMore && (
          <div className="text-center mt-12">
            <button onClick={handleLoadMore} className="px-8 py-3 brand-button font-bold rounded-lg">
              Load More Jobs
            </button>
          </div>
        )}
        
        {!loading && displayedJobs.length === 0 && <p className="text-center text-gray-400 py-4">No jobs found. Try a different search.</p>}
      </div>
      
      {selectedJob && <JobDetailModal job={selectedJob} onClose={handleCloseModal} />}
    </>
  );
};

export default JobsPage;
