import React, { useState, useEffect, useMemo } from "react";
import { useDataFetching } from "@/hooks/useDataFetching.js";

import SearchAndTabs from "@/components/layout/SearchAndTabs";
import JobCard from "@/components/cards/Jobcard.jsx";
import ReferralCard from "@/components/cards/ReferralCard.jsx";
import JobDetailModal from "@/components/modals/JobDetailModal.jsx";
import FilterModal from "@/components/modals/FilterModal.jsx";
import ReferralFilterModal from "@/components/modals/ReferralFilterModal.jsx";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const ITEMS_PER_PAGE = typeof window !== "undefined" && window.innerWidth < 768 ? 6 : 10;

const JobsPage = () => {
  const { allJobs, allReferrals, loading, error, fetchAllData } = useDataFetching();

  const [activeTab, setActiveTab] = useState("jobs");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [isJobFilterModalOpen, setIsJobFilterModalOpen] = useState(false);
  const [isReferralFilterModalOpen, setIsReferralFilterModalOpen] = useState(false);
  const [activeJobFilters, setActiveJobFilters] = useState({ titles: [] });
  const [activeReferralFilters, setActiveReferralFilters] = useState({
    companies: [],
    roles: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightedJobId, setHighlightedJobId] = useState(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredData = useMemo(() => {
    const lower = (debouncedSearchQuery || "").toLowerCase();

    if (activeTab === "jobs") {
      let results = Array.isArray(allJobs) ? allJobs.filter(Boolean) : [];
      if (activeJobFilters.titles?.length) {
        results = results.filter((job) =>
          activeJobFilters.titles.includes(job?.["Job Title"] || "")
        );
      }
      if (lower) {
        results = results.filter((job) => {
          const title = (job?.["Job Title"] || "").toLowerCase();
          const company = (job?.Company || "").toLowerCase();
          const location = (job?.Location || "").toLowerCase();
          return title.includes(lower) || company.includes(lower) || location.includes(lower);
        });
      }
      return results;
    } else {
      let results = Array.isArray(allReferrals) ? allReferrals.filter(Boolean) : [];
      if (activeReferralFilters.companies?.length) {
        results = results.filter((ref) =>
          activeReferralFilters.companies.includes(ref?.Company || "")
        );
      }
      if (activeReferralFilters.roles?.length) {
        results = results.filter((ref) =>
          activeReferralFilters.roles.includes(ref?.Role || "")
        );
      }
      if (lower) {
        results = results.filter((ref) => {
          const company = (ref?.Company || "").toLowerCase();
          const role = (ref?.Role || "").toLowerCase();
          const name = (ref?.["Referrer Name"] || "").toLowerCase();
          return company.includes(lower) || role.includes(lower) || name.includes(lower);
        });
      }
      return results;
    }
  }, [
    debouncedSearchQuery,
    activeTab,
    allJobs,
    allReferrals,
    activeJobFilters,
    activeReferralFilters,
  ])
