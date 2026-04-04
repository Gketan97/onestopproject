-- Review fatigue: dwell time vs CVR inverse correlation
-- Shows that more review reading = less booking for HVT
SELECT
  s.week,
  s.cohort,
  ROUND(AVG(s.review_dwell_seconds), 0)                                  AS avg_review_dwell_sec,
  ROUND(AVG(s.listings_viewed), 1)                                        AS avg_listings_viewed,
  ROUND(AVG(CASE WHEN s.converted THEN 1.0 ELSE 0.0 END) * 100, 2)      AS cvr_pct,
  ROUND(AVG(sr.filters_applied), 1)                                       AS avg_filters_used
FROM sessions s
JOIN search_results sr ON sr.session_id = s.session_id
WHERE s.cohort IN ('HVT', 'Mission')
GROUP BY s.week, s.cohort
ORDER BY s.cohort, s.week;
