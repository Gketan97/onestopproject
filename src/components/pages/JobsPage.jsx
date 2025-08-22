// src/pages/JobsPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ReferralFilterModal from '../components/modals/ReferralFilterModal';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ companies: [], roles: [] });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // ✅ Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          'https://script.google.com/macros/s/AKfycbz8OZ4wrUb6kwukysA5ucb9nXu_TE5yp1SIuU8PqUmbJiGWBdwUliU8pGsNpdkliCqN/exec'
        );
        const data = await response.json();
        setJobs(data || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // ✅ Handle search input
  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value.toLowerCase());
  }, []);

  // ✅ Apply filtering + search
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.Company?.toLowerCase().includes(searchTerm) ||
        job.Role?.toLowerCase().includes(searchTerm);

      const matchesCompanyFilter =
        filters.companies.length === 0 || filters.companies.includes(job.Company);

      const matchesRoleFilter =
        filters.roles.length === 0 || filters.roles.includes(job.Role);

      return matchesSearch && matchesCompanyFilter && matchesRoleFilter;
    });
  }, [jobs, searchTerm, filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading jobs...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Available Jobs</h1>
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600"
        >
          Filter
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by company or role..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
        />
      </div>

      {/* Jobs List */}
      <div>
        {filteredJobs.length === 0 ? (
          <div className="text-center text-gray-400">No jobs found.</div>
        ) : (
          <div className="grid gap-4">
            {filteredJobs.map((job, index) => (
              <div
                key={index}
                className="p-4 bg-gray-900 rounded-lg border border-gray-700"
              >
                <h2 className="text-xl font-semibold">{job.Role}</h2>
                <p className="text-gray-400">{job.Company}</p>
                <p className="text-sm text-gray-500">{job.Location || 'Remote'}</p>
                {job['Apply Link'] && (
                  <a
                    href={job['Apply Link']}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-orange-500 hover:underline"
                  >
                    Apply Now
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <ReferralFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        allReferrals={jobs}
        onApplyFilters={(newFilters) => setFilters(newFilters)}
      />
    </div>
  );
};

export default JobsPage;
