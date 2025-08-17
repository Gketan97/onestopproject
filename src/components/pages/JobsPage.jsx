// src/pages/JobsPage.jsx
// Final audited version by Gemini, implementing the "Scroll & Highlight" deep-link experience.

import React, { useState, useEffect, useMemo } from 'react';

// Hooks
import { useDataFetching } from '../../hooks/useDataFetching';

// Components
import SearchAndTabs from '../layout/SearchAndTabs';
import JobCard from '../cards/Jobcard.jsx';
import ReferralCard from '../cards/ReferralCard.jsx';
import JobDetailModal from '../modals/JobDetailModal.jsx';
import FilterModal from '../modals/FilterModal.jsx';
import ReferralFilterModal from '../modals/ReferralFilterModal.jsx';
import WhatsAppCalloutCard from '../cards/WhatsAppCalloutCard.jsx';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const ITEMS_PER_PAGE = window.innerWidth < 768 ? 6 : 10;

const JobsPage = () => {
  const { allJobs, allReferrals, loading, error, fetchAllData } = useDataFetching();
  
  const [activeTab, setActiveTab] = useState('jobs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [isJobFilterModalOpen, setIsJobFilterModalOpen] = useState(false);
  const [isReferralFilterModalOpen, setIsReferralFilterModalOpen] = useState(false);
  const [activeJobFilters, setActiveJobFilters] = useState({ titles: [] });
  const [activeReferralFilters, setActiveReferralFilters] = useState({ companies: [], roles: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightedJobId, setHighlightedJobId] = useState(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredData = useMemo(() => {
    const lowercasedQuery = debouncedSearchQuery.toLowerCase();
    
    if (activeTab === 'jobs') {
      let results = allJobs;
      if (activeJobFilters.titles.length > 0) {
        results = results.filter(job => activeJobFilters.titles.includes(job['Job Title']));
      }
      if (lowercasedQuery) {
        results = results.filter(job =>
          (job['Job Title'] || '').toLowerCase().includes(lowercasedQuery) ||
          (job.Company || '').toLowerCase().includes(lowercasedQuery) ||
          (job.Location || '').toLowerCase().includes(lowercasedQuery)
        );
      }
      return results;
    } else { // Referrals
      let results = allReferrals;
      if (activeReferralFilters.companies.length > 0) {
        results = results.filter(ref => activeReferralFilters.companies.includes(ref.Company));
      }
      if (activeReferralFilters.roles.length > 0) {
        results = results.filter(ref => activeReferralFilters.roles.includes(ref.Role));
      }
      if (lowercasedQuery) {
        results = results.filter(ref => 
          (ref.Company || '').toLowerCase().includes(lowercasedQuery) ||
          (ref.Role || '').toLowerCase().includes(lowercasedQuery) ||
          (ref.Location || '').toLowerCase().includes(lowercasedQuery) ||
          (ref['Referrer Name'] || '').toLowerCase().includes(lowercasedQuery)
        );
      }
      return results;
    }
  }, [debouncedSearchQuery, activeTab, allJobs, allReferrals, activeJobFilters, activeReferralFilters]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, debouncedSearchQuery, activeJobFilters, activeReferralFilters]);

  const currentData = useMemo(() => {
    return filteredData.slice(0, currentPage * ITEMS_PER_PAGE);
  }, [currentPage, filteredData]);

  const hasMoreData = currentData.length < filteredData.length;

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

  // DEEP-LINKING UX FIX: This now correctly handles pagination, scrolling, and highlighting.
  useEffect(() => {
    // Ensure data is loaded and there's a hash in the URL
    if (allJobs.length > 0 && window.location.hash.startsWith('#job-')) {
      const jobId = parseInt(window.location.hash.replace('#job-', ''), 10);
      // Find the job's index in the currently filtered list
      const jobIndex = filteredData.findIndex(j => j.id === jobId);

      if (jobIndex !== -1) {
        // Calculate the page the job is on
        const pageOfJob = Math.floor(jobIndex / ITEMS_PER_PAGE) + 1;
        setCurrentPage(pageOfJob);
        
        // Use a timeout to ensure the DOM has updated with the new page's items
        setTimeout(() => {
          const cardElement = document.getElementById(`job-card-${jobId}`);
          if (cardElement) {
            cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setHighlightedJobId(jobId);
            // Remove the highlight after a few seconds for better UX
            setTimeout(() => setHighlightedJobId(null), 3000);
          }
        }, 100);
      }
    }
  }, [allJobs, filteredData]); // Rerun if filteredData changes to handle deep-linking within filtered views

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
    if (activeTab === 'jobs') {
      setIsJobFilterModalOpen(true);
    } else {
      setIsReferralFilterModalOpen(true);
    }
  };

  const renderContent = () => {
    if (loading) return <p className="text-center text-gray-400 mt-8">Loading...</p>;
    if (error) return <div className="text-center text-red-500 mt-8"><p>{error}</p><button onClick={fetchAllData} className="mt-4 px-6 py-2 brand-button rounded-lg">Retry</button></div>;
    if (currentData.length === 0) return <p className="text-center text-gray-400 py-4 mt-8">No results found.</p>;

    if (activeTab === 'jobs') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {currentData.map((job, index) => (
            <React.Fragment key={job.id}>
              <JobCard 
                job={job} 
                onOpenModal={handleOpenModal} 
                isHighlighted={job.id === highlightedJobId}
              />
              {(index + 1) % 5 === 0 && <WhatsAppCalloutCard />}
            </React.Fragment>
          ))}
        </div>
      );
    }

    if (activeTab === 'referrals') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {currentData.map((ref, i) => <ReferralCard referral={ref} key={i} />)}
        </div>
      );
    }
  };

  return (
    <>
      <div className="w-full max-w-7xl mx-auto p-4 md:p-8 flex-grow z-10">
        <SearchAndTabs
          activeTab={activeTab}
          onTabClick={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          onFilterClick={handleFilterClick}
        />
        
        <div className="mt-8">
          {renderContent()}
          {hasMoreData && (
            <div className="text-center mt-12">
              <button onClick={() => setCurrentPage(p => p + 1)} className="px-8 py-3 brand-button font-bold rounded-lg">
                Load More {activeTab === 'jobs' ? 'Jobs' : 'Referrals'}
              </button>
            </div>
          )}
        </div>

        {activeTab === 'referrals' && !loading && !error && (
            <div className="mt-12 text-center p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <h3 className="font-bold text-white text-lg">Want to refer candidates?</h3>
                <p className="text-gray-400 text-sm mt-2">Join our platform to help others in the community and build your network.</p>
                <button className="mt-4 px-6 py-2 brand-button text-sm font-bold rounded-lg">Become a Referrer</button>
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
