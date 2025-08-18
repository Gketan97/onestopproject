import { useState, useEffect, useCallback } from "react";

/**
 * FAANG-style guarantees:
 * - Always returns arrays (never undefined)
 * - Every record has `id`
 * - Referrals always have keys: "Referrer Name", "Role", "Company", "Link"
 * - Jobs keep original keys and fill defaults
 * - Skips/normalizes invalid rows; never pushes undefined into UI
 */
export const useDataFetching = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [allReferrals, setAllReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const JOBS_URL =
        "https://ketangoel16-creator.github.io/onestopcareers-data/jobs.json";
      const REF_URL =
        "https://ketangoel16-creator.github.io/onestopcareers-data/referrals.json";

      console.log("📡 Fetching:", JOBS_URL, REF_URL);

      const [jobsRes, refRes] = await Promise.all([fetch(JOBS_URL), fetch(REF_URL)]);
      if (!jobsRes.ok || !refRes.ok) {
        throw new Error(
          `Network error — jobs:${jobsRes.status} referrals:${refRes.status}`
        );
      }

      const [jobsData, referralsData] = await Promise.all([
        jobsRes.json(),
        refRes.json(),
      ]);

      console.log("✅ Raw jobsData length:", Array.isArray(jobsData) ? jobsData.length : 0);
      console.log(
        "✅ Raw referralsData length:",
        Array.isArray(referralsData) ? referralsData.length : 0
      );

      // ---- Normalize Jobs (keep old keys; fill defaults) ----
      const jobsWithIds = (Array.isArray(jobsData) ? jobsData : [])
        .map((j, idx) => {
          if (!j || typeof j !== "object") {
            console.warn("⚠️ Skipping invalid job at index", idx, j);
            return null;
          }
          return {
            id: idx,
            // keep original keys you already use elsewhere
            "Job Title": j?.["Job Title"] ?? "",
            Company: j?.Company ?? "",
            Location: j?.Location ?? "",
            Experience: j?.Experience ?? "",
            Description: j?.Description ?? "",
            Link: j?.Link ?? "#",
          };
        })
        .filter(Boolean);

      // ---- Normalize Referrals (force old keys your UI uses) ----
      const referralsWithIds = (Array.isArray(referralsData) ? referralsData : [])
        .map((r, idx) => {
          if (!r || typeof r !== "object") {
            console.warn("⚠️ Skipping invalid referral at index", idx, r);
            return null;
          }
          const name = r?.["Referrer Name"] ?? r?.Name ?? "";
          const role = r?.Role ?? r?.Designation ?? "";
          const company = r?.Company ?? r?.["Company name"] ?? "";
          const link = r?.Link ?? "";

          // If literally everything is empty, drop it to avoid rendering noise
          if (!name && !role && !company && !link) {
            console.warn("⚠️ Dropping empty referral at index", idx, r);
            return null;
          }

          return {
            id: idx,
            "Referrer Name": name || "Unknown Referrer",
            Role: role || "Role not specified",
            Company: company || "Company not specified",
            Link: link || "#",
          };
        })
        .filter(Boolean);

      console.log("🛠 Normalized jobs:", jobsWithIds.length);
      console.log("🛠 Normalized referrals:", referralsWithIds.length);

      setAllJobs(jobsWithIds);
      setAllReferrals(referralsWithIds);
    } catch (err) {
      console.error("❌ Data fetching/processing error:", err);
      setError("Failed to load data. Please try again.");
      // fail closed with empty safe arrays
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
