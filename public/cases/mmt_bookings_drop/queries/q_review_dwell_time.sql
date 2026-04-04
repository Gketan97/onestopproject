-- Review dwell time deep dive: the trust deficit signal
-- HVT review dwell 4x increase is the key insight
SELECT
  CASE WHEN s.week < 5 THEN 'pre_anomaly' ELSE 'post_anomaly' END  AS period,
  s.cohort,
  ROUND(AVG(s.review_dwell_seconds), 0)                             AS avg_review_dwell_sec,
  ROUND(AVG(s.review_dwell_seconds) / 60.0, 1)                     AS avg_review_dwell_min,
  ROUND(AVG(s.listings_viewed), 1)                                  AS avg_listings_viewed,
  ROUND(AVG(CASE WHEN s.converted THEN 1.0 ELSE 0.0 END) * 100, 2) AS cvr_pct,
  COUNT(DISTINCT s.session_id)                                       AS session_count
FROM sessions s
GROUP BY period, s.cohort
ORDER BY s.cohort, period DESC;
