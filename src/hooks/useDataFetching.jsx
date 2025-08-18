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
      const jobsUrl = 'https://ketangoel16-creator.github.io/onestopcareers-data/jobs.json';
      const referralsUrl = 'https://ketangoel16-creator.github.io/onestopcareers-data/referrals.json';

      console.log('📡 Fetching data from:', jobsUrl, referralsUrl);

      const [jobsRes, referralsRes] = await Promise.all([
        fetch(jobsUrl),
        fetch(referralsUrl),
      ]);

      if (!jobsRes.ok || !referralsRes.ok) {
        throw new Error(
          `Network error: Jobs(${jobsRes.status}) Referrals(${referralsRes.status})`
        );
      }

      const jobsData = await jobsRes.json();
      const referralsData = await referralsRes.json();

      // 🔍 Debugging logs
      console.log('✅ Raw jobsData:', jobsData);
      console.log('✅ Raw referralsData:', referralsData);

      // Normalize Jobs
      const jobsWithIds = Array.isArray(jobsData)
        ? jobsData
            .filter((job) => job && job['Job Title'])
            .map((job, index) => ({
              id: index,
              title: job?.['Job Title'] || '',
              company: job?.Company || '',
              location: job?.Location || '',
              experience: job?.Experience || '',
              link: job?.Link || '',
            }))
        : [];

      console.log('🛠 Normalized jobsWithIds:', jobsWithIds);

      // Normalize Referrals
      const referralsWithIds = Array.isArray(referralsData)
        ? referralsData
            .filter(
              (ref) =>
                ref &&
                (ref.Name ||
                  ref['Referrer Name'] ||
                  ref.Designation ||
                  ref.Company ||
                  ref['Company name'])
            )
            .map((ref, index) => ({
              id: index,
              referrerName: ref?.Name || ref?.['Referrer Name'] || '',
              role: ref?.Designation || '',
              company: ref?.['Company name'] || ref?.Company || '',
              link: ref?.Link || '',
            }))
        : [];

      console.log('🛠 Normalized referralsWithIds:', referralsWithIds);

      setAllJobs(jobsWithIds);
      setAllReferrals(referralsWithIds);
    } catch (e) {
      console.error('❌ Data fetching or processing error:', e);
      setError('Failed to load data. Please refresh or try again later.');
      setAllJobs([]);
      setAllReferrals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return { allJobs, allReferrals, loading, error, fetchAllData };
};
