// src/hooks/useDataFetching.js

import { useState, useEffect, useCallback } from 'react';

// ── CDN endpoints ─────────────────────────────────────────────────────────────
//
// JOBS  → New crawler-powered CDN (jobscout-date repo).
//         Primary: jsDelivr (CDN-cached, fast)  — same URLs used by index.html
//         Fallback: raw.githubusercontent.com   — bypasses CDN cache if jsDelivr is stale
//
// REFERRALS → Unchanged — still served from the gsheet-backed GitHub Pages CDN.
//
const CDN_JOBS     = 'https://cdn.jsdelivr.net/gh/Gketan97/jobscout-date@main/data/jobs.json';
const RAW_JOBS     = 'https://raw.githubusercontent.com/Gketan97/jobscout-date/main/data/jobs.json';
const CDN_REFERRALS = 'https://ketangoel16-creator.github.io/onestopcareers-data/referrals.json';

// ── Field mapping ─────────────────────────────────────────────────────────────
//
// The new CDN schema (from the crawler) uses short field names:
//   title, company, loc, url, id, dept, ts, color, tier, seniority, city, mode, fn
//
// The React app (JobCard, JobDetailModal, JobsPage) expects:
//   'Job Title', 'Company', 'Location', 'Link', 'Company Logo URL', 'Job Description'
//
// We normalise here in the hook so no component changes are needed.
//
const normalizeJob = (job, index) => ({
  // Stable numeric id for keys, scroll-restore, and highlight tracking
  id: index,

  // Fields the components read
  'Job Title':        job.title       || '',
  'Company':          job.company     || '',
  'Location':         job.loc || job.city || '',
  'Link':             job.url         || '',

  // The new CDN has no logo URLs or long descriptions — use sensible fallbacks.
  // Logo: we construct a Clearbit-style logo URL from the company name.
  //       If that 404s, JobCard/JobDetailModal already have onError fallbacks.
  'Company Logo URL': job.logo
    || (job.company
      ? `https://logo.clearbit.com/${job.company.toLowerCase().replace(/\s+/g, '')}.com`
      : ''),

  // Description: combine available metadata into a readable paragraph.
  'Job Description': [
    job.dept        && `Department: ${job.dept}`,
    job.seniority   && `Seniority: ${job.seniority}`,
    job.mode        && `Work mode: ${job.mode}`,
    job.city        && `City: ${job.city}`,
  ].filter(Boolean).join('\n') || '',

  // Pass through remaining raw fields in case we want them later
  _raw: job,
});

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useDataFetching = () => {
  const [allJobs,      setAllJobs]      = useState([]);
  const [allReferrals, setAllReferrals] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch jobs with jsDelivr → raw fallback (mirrors the HTML page's strategy)
      let jobsData;
      try {
        const res = await fetch(`${CDN_JOBS}?t=${Date.now()}`);
        if (!res.ok) throw new Error('CDN miss');
        jobsData = await res.json();
      } catch {
        const res = await fetch(`${RAW_JOBS}?t=${Date.now()}`);
        if (!res.ok) throw new Error('Failed to load jobs from both CDN and raw source');
        jobsData = await res.json();
      }

      // Referrals — unchanged source
      const referralsRes = await fetch(CDN_REFERRALS);
      if (!referralsRes.ok) throw new Error('Failed to load referrals');
      const referralsData = await referralsRes.json();

      // Normalise jobs into the shape components expect
      const jobsWithIds = jobsData.map(normalizeJob);

      // Normalise referrals (schema unchanged)
      const referralsWithIds = referralsData.map((ref, index) => ({
        id:          index,
        name:        ref.Name              || '',
        designation: ref.Designation       || '',
        company:     ref['Company name']   || '',
        link:        ref.Link              || '',
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
