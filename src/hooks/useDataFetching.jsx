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
      
      // THE FINAL FIX: Add a robust check to ensure data is a valid array before processing.
      // This prevents crashes if the JSON file is malformed or contains null entries.
      
      const jobsWithIds = Array.isArray(jobsData)
        ? jobsData
            .filter(job => job && job['Job Title']) // Ensures 'job' is an object with a title
            .map((job, index) => ({ ...job, id: index }))
        : []; // If not an array, default to an empty array
      
      const referralsWithIds = Array.isArray(referralsData)
        ? referralsData
            .filter(ref => ref && ref.Name) // Ensures 'ref' is an object with a Name
            .map((ref, index) => ({
              id: index,
              'Referrer Name': ref.Name || '',
              Role: ref.Designation || '',
              Company: ref['Company name'] || '',
              Link: ref.Link || ''
            }))
        : []; // If not an array, default to an empty array
      
      setAllJobs(jobsWithIds);
      setAllReferrals(referralsWithIds);
    } catch (e) {
      console.error("Data fetching or processing error:", e);
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
