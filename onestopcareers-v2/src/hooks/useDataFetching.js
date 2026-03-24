import { useState, useEffect, useCallback } from 'react';

// ── CDN endpoints ─────────────────────────────────────────────────────────────
const CDN_JOBS      = 'https://cdn.jsdelivr.net/gh/Gketan97/jobscout-date@main/data/jobs.json';
const RAW_JOBS      = 'https://raw.githubusercontent.com/Gketan97/jobscout-date/main/data/jobs.json';
const CDN_REFERRALS = 'https://ketangoel16-creator.github.io/onestopcareers-data/referrals.json';

// ── Static fallback — shown when all network sources are unreachable ──────────
const FALLBACK_JOBS = [
  { title: 'Data Analyst', company: 'Swiggy', loc: 'Bangalore', url: 'https://careers.swiggy.com', dept: 'Analytics', seniority: 'L2', mode: 'Hybrid' },
  { title: 'Product Analyst', company: 'Zomato', loc: 'Gurugram', url: 'https://www.zomato.com/careers', dept: 'Product', seniority: 'L2', mode: 'Hybrid' },
  { title: 'Business Analyst', company: 'Flipkart', loc: 'Bangalore', url: 'https://www.flipkartcareers.com', dept: 'Business', seniority: 'L2', mode: 'On-site' },
  { title: 'Data Analyst II', company: 'PhonePe', loc: 'Bangalore', url: 'https://careers.phonepe.com', dept: 'Growth', seniority: 'L3', mode: 'Hybrid' },
  { title: 'Analytics Engineer', company: 'CRED', loc: 'Bangalore', url: 'https://careers.cred.club', dept: 'Data', seniority: 'L3', mode: 'On-site' },
  { title: 'Senior Analyst', company: 'Meesho', loc: 'Bangalore', url: 'https://meesho.io/careers', dept: 'Supply', seniority: 'L4', mode: 'Hybrid' },
  { title: 'Data Analyst', company: 'Razorpay', loc: 'Bangalore', url: 'https://razorpay.com/jobs', dept: 'Payments', seniority: 'L2', mode: 'On-site' },
  { title: 'Product Analytics Lead', company: 'Google', loc: 'Hyderabad', url: 'https://careers.google.com', dept: 'Product', seniority: 'L5', mode: 'Hybrid' },
  { title: 'Analyst, Risk', company: 'Amazon', loc: 'Hyderabad', url: 'https://amazon.jobs', dept: 'Risk', seniority: 'L4', mode: 'Hybrid' },
  { title: 'Data Analyst', company: 'Uber', loc: 'Bangalore', url: 'https://uber.com/careers', dept: 'Rides', seniority: 'L3', mode: 'Hybrid' },
  { title: 'Analytics Manager', company: 'Atlassian', loc: 'Bangalore', url: 'https://www.atlassian.com/company/careers', dept: 'Engineering', seniority: 'L5', mode: 'Remote' },
  { title: 'Data Analyst', company: 'Microsoft', loc: 'Hyderabad', url: 'https://careers.microsoft.com', dept: 'Cloud', seniority: 'L3', mode: 'Hybrid' },
];

const FALLBACK_REFERRALS = [
  { Name: 'Priya Sharma', Designation: 'Senior Data Analyst', 'Company name': 'Swiggy', Link: 'https://linkedin.com' },
  { Name: 'Rahul Mehta', Designation: 'Product Analyst', 'Company name': 'Zomato', Link: 'https://linkedin.com' },
  { Name: 'Ananya Singh', Designation: 'Analytics Manager', 'Company name': 'Flipkart', Link: 'https://linkedin.com' },
  { Name: 'Karan Gupta', Designation: 'Data Scientist', 'Company name': 'PhonePe', Link: 'https://linkedin.com' },
];

// ── Field normalisation ───────────────────────────────────────────────────────
const normalizeJob = (job, index) => ({
  id: index,
  'Job Title':        job.title       || job['Job Title']   || '',
  'Company':          job.company     || job['Company']     || '',
  'Location':         job.loc || job.city || job['Location'] || '',
  'Link':             job.url         || job['Link']        || '',
  'Company Logo URL': job.logo
    || (job.company
      ? `https://logo.clearbit.com/${job.company.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.com`
      : ''),
  'Job Description': [
    job.dept        && `Department: ${job.dept}`,
    job.seniority   && `Seniority: ${job.seniority}`,
    job.mode        && `Work mode: ${job.mode}`,
    job.city        && `City: ${job.city}`,
  ].filter(Boolean).join('\n') || '',
  _raw: job,
});

// ── Fetch with timeout helper ─────────────────────────────────────────────────
const fetchWithTimeout = async (url, timeoutMs = 8000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useDataFetching = () => {
  const [allJobs,      setAllJobs]      = useState([]);
  const [allReferrals, setAllReferrals] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setUsingFallback(false);

    let jobsData = null;
    const jobsSources = [
      `${CDN_JOBS}?t=${Date.now()}`,
      `${RAW_JOBS}?t=${Date.now()}`,
      `https://corsproxy.io/?${encodeURIComponent(RAW_JOBS)}`,
    ];

    for (const src of jobsSources) {
      try {
        const res = await fetchWithTimeout(src, 3000);
        if (!res.ok) continue;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          jobsData = data;
          break;
        }
      } catch {
        // try next source
      }
    }

    let referralsData = [];
    try {
      const res = await fetchWithTimeout(CDN_REFERRALS, 3000);
      if (res.ok) referralsData = await res.json();
    } catch {
      // referrals optional — silently fail
    }

    // Fall back to static data when all network sources fail
    if (!jobsData) {
      jobsData = FALLBACK_JOBS;
      setUsingFallback(true);
    }
    if (!referralsData || !referralsData.length) {
      referralsData = FALLBACK_REFERRALS;
    }

    const jobsWithIds = jobsData.map(normalizeJob);

    const referralsWithIds = (Array.isArray(referralsData) ? referralsData : []).map((ref, index) => ({
      id:          index,
      name:        ref.Name              || '',
      designation: ref.Designation       || '',
      company:     ref['Company name']   || '',
      link:        ref.Link              || '',
    }));

    setAllJobs(jobsWithIds);
    setAllReferrals(referralsWithIds);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return { allJobs, allReferrals, loading, error, usingFallback, fetchAllData };
};