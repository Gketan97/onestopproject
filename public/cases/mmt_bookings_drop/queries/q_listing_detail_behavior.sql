-- Listing detail micro-behaviors: review dwell and back-button
-- Confirms trust deficit at the detail stage for HVT
SELECT
  s.cohort,
  CASE WHEN s.week < 5 THEN 'pre_anomaly' ELSE 'post_anomaly' END    AS period,
  ROUND(AVG(s.review_dwell_seconds), 0)                                AS avg_review_dwell_sec,
  ROUND(AVG(s.listings_viewed), 1)                                     AS avg_listings_viewed_per_session,
  ROUND(AVG(CASE WHEN s.serp_bounce THEN 1.0 ELSE 0.0 END) * 100, 1) AS serp_bounce_pct,
  COUNT(DISTINCT s.session_id)                                          AS sessions
FROM sessions s
WHERE s.cohort IN ('HVT', 'Mission')
GROUP BY s.cohort, period
ORDER BY s.cohort, period DESC;
