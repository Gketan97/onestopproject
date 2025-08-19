// src/hooks/useDataFetching.js

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
      
      // THE FIX: Add robust checks to ensure data is a valid array and filter out invalid entries.
      
      const jobsWithIds = Array.isArray(jobsData)
        ? jobsData
            .filter(job => job && job['Job Title']) // This guard prevents crashes
            .map((job, index) => ({ ...job, id: index }))
        : []; // Default to an empty array if data is not an array
      
      const referralsWithIds = Array.isArray(referralsData)
        ? referralsData
            .filter(ref => ref && ref.Name) // This guard also prevents crashes
            .map((ref, index) => ({
              id: index,
              'Referrer Name': ref.Name || '',
              Role: ref.Designation || '',
              Company: ref['Company name'] || '',
              Link: ref.Link || ''
            }))
        : []; // Default to an empty array if data is not an array
      
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
