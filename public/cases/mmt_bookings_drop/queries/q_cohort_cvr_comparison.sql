-- Cohort CVR: pre vs post, all 4 cohorts
-- Key signal: HVT drops most despite being smallest cohort
SELECT
  s.cohort,
  CASE WHEN s.week < 5 THEN 'pre_anomaly' ELSE 'post_anomaly' END  AS period,
  COUNT(DISTINCT s.user_id)                                         AS unique_users,
  ROUND(AVG(CASE WHEN s.converted THEN 1.0 ELSE 0.0 END) * 100, 2) AS cvr_pct,
  ROUND(AVG(b.revenue_usd), 2)                                      AS avg_booking_value_usd,
  ROUND(AVG(s.review_dwell_seconds), 0)                             AS avg_review_dwell_sec,
  ROUND(AVG(s.listings_viewed), 1)                                  AS avg_listings_viewed
FROM sessions s
LEFT JOIN bookings b
  ON b.user_id = s.user_id AND b.week = s.week
GROUP BY s.cohort, period
ORDER BY s.cohort, period DESC;
