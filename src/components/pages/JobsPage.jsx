// src/pages/JobsPage.jsx

import React, { useState, useMemo } from "react";

// Hooks
import { useDataFetching } from "../../hooks/useDataFetching";

// Components
import SearchAndTabs from "../layout/SearchAndTabs";
import JobCard from "../components/cards/Jobcard";
import ReferralCard from "../components/cards/ReferralCard";
import JobModal from "../components/modals/JobModal";
import ReferralFilterModal from "../components/modals/ReferralFilterModal";

const JobsPage = () => {
  // Data fetching
  const { jobs, referrals, loading, error } = useDataFetching();

  // State
  const [activeTab, setActiveTab] = useState("jobs");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  // Referral filter state
  const [isReferralFilterOpen, setIsReferralFilterOpen] = useState(false);
  const [referralFilters, setReferralFilters] = useState({
    companies: [],
    roles: [],
  });

  // ---- JOBS ----
  const filteredJobs = useMemo(() => {
    return jobs.filter(
      (job) =>
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  // ---- REFERRALS ----
  const filteredReferrals = useMemo(() => {
    return referrals.filter((ref) => {
      const matchesSearch =
        ref.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ref.Designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ref["Company name"]?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCompany =
        referralFilters.companies.length === 0 ||
        referralFilters.companies.includes(ref["Company name"]);

      const matchesRole =
        referralFilters.roles.length === 0 ||
        referralFilters.roles.includes(ref.Designation);

      return matchesSearch && matchesCompany && matchesRole;
    });
  }, [referrals, searchTerm, referralFilters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Search + Tabs */}
      <SearchAndTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenReferralFilter={() => setIsReferralFilterOpen(true)}
      />

      {/* JOBS LIST */}
      {activeTab === "jobs" && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <JobCard
                key={index}
                job={job}
                onClick={() => setSelectedJob(job)}
              />
            ))
          ) : (
            <p className="text-gray-400">No jobs found.</p>
          )}
        </div>
      )}

      {/* REFERRALS LIST */}
      {activeTab === "referrals" && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {filteredReferrals.length > 0 ? (
            filteredReferrals.map((ref, index) => (
              <ReferralCard key={index} referral={ref} />
            ))
          ) : (
            <p className="text-gray-400">No referrals found.</p>
          )}
        </div>
      )}

      {/* JOB MODAL */}
      <JobModal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        job={selectedJob}
      />

      {/* REFERRAL FILTER MODAL */}
      <ReferralFilterModal
        isOpen={isReferralFilterOpen}
        onClose={() => setIsReferralFilterOpen(false)}
        allReferrals={referrals}
        onApplyFilters={setReferralFilters}
      />
    </div>
  );
};

export default JobsPage;
