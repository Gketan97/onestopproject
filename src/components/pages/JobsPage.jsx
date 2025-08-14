// =================================================================
// FILE (NEW): src/components/pages/JobsPage.jsx
// PURPOSE: The main component for the new Jobs page with deep linking and responsive loading.
// =================================================================
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Reusable Job Card Component with fallbacks and ID
const JobCard = ({ job, index }) => (
  <div id={`job-${index}`} className="dark-theme-card-bg p-6 rounded-xl dark-theme-border border-2 flex flex-col sm:flex-row items-start gap-6 transition-all duration-300 ease-in-out hover:dark-theme-card-hover">
    <img 
      src={job['Company Logo URL']} 
      alt={`${job.Company || 'Company'} logo`} 
      className="w-16 h-16 rounded-lg object-contain bg-white flex-shrink-0"
      onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/64x64/ffffff/1a1a1a?text=Logo'; }}
    />
    <div className="flex-grow">
      <h3 className="text-xl font-bold text-white">{job['Job Title'] || 'Job Title Not Available'}</h3>
      <p className="text-gray-400 mt-1">{job.Company || 'Company Name'} - {job.Location || 'Remote'}</p>
      <p className="text-gray-500 mt-3 text-sm line-clamp-2">{job.Description || 'No description provided.'}</p>
    </div>
    <a 
      href={job['Link']} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="mt-4 sm:mt-0 px-6 py-2 brand-button font-bold text-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 self-start sm:self-center whitespace-nowrap"
    >
      Apply Now
    </a>
  </div>
);

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
    const getJobsPerPage = () => window.innerWidth < 768 ? 6 : 10;
    setJobsPerPage(getJobsPerPage());

    const handleResize = () => {
        setJobsPerPage(getJobsPerPage());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch jobs from the JSON CDN
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('https://ketangoel16-creator.github.io/onestopcareers-data/jobs.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setAllJobs(data);
      } catch (e) {
        setError('Failed to load job listings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filter jobs and set initial display
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const results = allJobs.filter(job => 
      (job['Job Title'] || '').toLowerCase().includes(lowercasedQuery) ||
      (job.Company || '').toLowerCase().includes(lowercasedQuery) ||
      (job.Location || '').toLowerCase().includes(lowercasedQuery)
    );
    setFilteredJobs(results);
    setPage(1);
    setDisplayedJobs(results.slice(0, jobsPerPage));
    setHasMore(results.length > jobsPerPage);
  }, [searchQuery, allJobs, jobsPerPage]);

  // Infinite scroll logic
  const lastJobElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Load more jobs when page changes
  useEffect(() => {
    if (page > 1) {
      const nextPageJobs = filteredJobs.slice((page - 1) * jobsPerPage, page * jobsPerPage);
      setDisplayedJobs(prevJobs => [...prevJobs, ...nextPageJobs]);
      setHasMore(filteredJobs.length > page * jobsPerPage);
    }
  }, [page, filteredJobs, jobsPerPage]);

  // Deep link scrolling effect
  useEffect(() => {
    if (displayedJobs.length > 0 && window.location.hash) {
      const id = window.location.hash.substring(1); // remove #
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.style.transition = 'background-color 0.5s ease';
        element.style.backgroundColor = '#3a3a3a'; // Highlight color
        setTimeout(() => {
          element.style.backgroundColor = ''; // Reset color
        }, 2000);
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
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, company, or location..."
          className="w-full p-4 bg-gray-800 text-white rounded-lg border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="space-y-6">
        {loading && <p className="text-center text-gray-400">Loading jobs...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && displayedJobs.map((job, index) => {
          const card = <JobCard job={job} index={index} />;
          if (displayedJobs.length === index + 1) {
            return <div ref={lastJobElementRef} key={index}>{card}</div>;
          }
          return card;
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
