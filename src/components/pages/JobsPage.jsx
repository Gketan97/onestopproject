import React, { useState, useEffect, useRef, useCallback } from 'react';
import JobCard from '../cards/JobCard.jsx'; // ✅ import instead of defining inline

const JobsPage = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [displayedJobs, setDisplayedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobsPerPage, setJobsPerPage] = useState(10);

  const observer = useRef();

  // Set initial job count based on screen size
  useEffect(() => {
    const getJobsPerPage = () => (window.innerWidth < 768 ? 6 : 10);
    setJobsPerPage(getJobsPerPage());
    const handleResize = () => setJobsPerPage(getJobsPerPage());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('https://ketangoel16-creator.github.io/onestopcareers-data/jobs.json');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setAllJobs(data);
      } catch (e) {
        setError('Failed to load job listings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filter jobs
  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const results = allJobs.filter(job =>
      (job['Job Title'] || '').toLowerCase().includes(lowerQuery) ||
      (job.Company || '').toLowerCase().includes(lowerQuery) ||
      (job.Location || '').toLowerCase().includes(lowerQuery)
    );
    setFilteredJobs(results);
    setPage(1);
    setDisplayedJobs(results.slice(0, jobsPerPage));
    setHasMore(results.length > jobsPerPage);
  }, [searchQuery, allJobs, jobsPerPage]);

  // Infinite scroll
  const lastJobRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) setPage(prev => prev + 1);
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Load more
  useEffect(() => {
    if (page > 1) {
      const nextJobs = filteredJobs.slice((page - 1) * jobsPerPage, page * jobsPerPage);
      setDisplayedJobs(prev => [...prev, ...nextJobs]);
      setHasMore(filteredJobs.length > page * jobsPerPage);
    }
  }, [page, filteredJobs, jobsPerPage]);

  // Deep link scrolling
  useEffect(() => {
    if (displayedJobs.length > 0 && window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.style.backgroundColor = '#3a3a3a';
        setTimeout(() => { element.style.backgroundColor = ''; }, 2000);
      }
    }
  }, [displayedJobs]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 flex-grow z-10">
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white">
          Find Your <span className="gradient-text">Next Opportunity</span>
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Search thousands of jobs from top companies.
        </p>
      </header>

      <div className="sticky top-20 bg-black/50 backdrop-blur-md p-4 rounded-xl z-20 mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by title, company, or location..."
          className="w-full p-4 bg-gray-800 text-white rounded-lg border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="space-y-6">
        {loading && <p className="text-center text-gray-400">Loading jobs...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && displayedJobs.map((job, index) => {
          const card = <JobCard job={job} index={index} key={index} />;
          return (displayedJobs.length === index + 1)
            ? <div ref={lastJobRef} key={index}>{card}</div>
            : card;
        })}
        {!loading && hasMore && <p className="text-center text-gray-500 py-4">Loading more...</p>}
        {!loading && !hasMore && displayedJobs.length > 0 && <p className="text-center text-gray-600 py-4">You've reached the end of the list.</p>}
        {!loading && displayedJobs.length === 0 && <p className="text-center text-gray-400 py-4">No jobs found. Try a different search.</p>}
      </div>

      <section className="mt-24 text-center p-8 dark-theme-card-bg rounded-xl">
        <h2 className="text-3xl font-bold text-white">Get a Referral</h2>
        <p className="mt-4 text-gray-400">
          Increase your chances of getting hired by getting a referral from an insider.
        </p>
        <button className="mt-6 px-8 py-3 brand-button font-bold rounded-lg">
          Explore Referrals
        </button>
      </section>
    </div>
  );
};

export default JobsPage;
