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
      
      // Assign stable IDs to jobs
      const jobsWithIds = jobsData.map((job, index) => ({ ...job, id: index }));
      
      // Normalize referrals into a consistent shape for all components
      const referralsWithIds = referralsData.map((ref, index) => ({
        id: index,
        'Referrer Name': ref.Name || '',
        Role: ref.Designation || '',
        Company: ref['Company name'] || '',
        Link: ref.Link || ''
      }));
      
      setAllJobs(jobsWithIds);
      setAllReferrals(referralsWithIds);
    } catch (e) {
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
