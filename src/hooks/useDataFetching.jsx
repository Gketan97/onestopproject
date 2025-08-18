// src/hooks/useDataFetching.jsx

import { useState, useEffect, useCallback } from 'react';

export const useDataFetching = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [allReferrals, setAllReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      
      // THE SECOND FIX: Filter out any invalid/empty job entries before mapping
      const jobsWithIds = jobsData
        .filter(job => job && job['Job Title']) // Ensures 'job' exists and has a title
        .map((job, index) => ({ ...job, id: index }));
      
      // THE FIRST FIX: Filter out any invalid/empty referral entries before mapping
      const referralsWithIds = referralsData
        .filter(ref => ref && ref.Name) // Ensures 'ref' exists and has a 'Name' property
        .map((ref, index) => ({
          id: index,
          'Referrer Name': ref.Name || '',
          Role: ref.Designation || '',
          Company: ref['Company name'] || '',
          Link: ref.Link || ''
        }));
      
      setAllJobs(jobsWithIds);
      setAllReferrals(referralsWithIds);
    } catch (e) {
      console.error("Data fetching or processing error:", e); // Added for better debugging
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return { allJobs, allReferrals, loading, error, fetchAllData };
};
