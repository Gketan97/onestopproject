-- L0 metrics: pre vs post anomaly comparison
-- Week 1-4 = baseline, Week 5-12 = post anomaly
SELECT
  CASE WHEN s.week < 5 THEN 'pre_anomaly' ELSE 'post_anomaly' END AS period,
  COUNT(DISTINCT s.session_id)                                      AS total_sessions,
  COUNT(DISTINCT s.user_id)                                        AS unique_users,
  ROUND(AVG(CASE WHEN s.converted THEN 1.0 ELSE 0.0 END) * 100, 2) AS cvr_pct,
  COUNT(DISTINCT b.booking_id)                                      AS total_bookings,
  ROUND(COALESCE(SUM(b.revenue_usd), 0), 0)                        AS total_revenue_usd,
  ROUND(COALESCE(AVG(b.revenue_usd), 0), 2)                        AS avg_booking_value_usd
FROM sessions s
LEFT JOIN bookings b
  ON b.user_id = s.user_id AND b.week = s.week
GROUP BY period
ORDER BY period DESC;
