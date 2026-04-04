-- Average booking value by cohort: pre vs post
-- Confirms HVT ABV stable — revenue drop is CVR not ABV
SELECT
  b.cohort,
  CASE WHEN b.week < 5 THEN 'pre_anomaly' ELSE 'post_anomaly' END  AS period,
  COUNT(DISTINCT b.booking_id)                                       AS bookings,
  ROUND(AVG(b.revenue_usd), 2)                                      AS avg_booking_value_usd,
  ROUND(SUM(b.revenue_usd), 0)                                      AS total_revenue_usd
FROM bookings b
GROUP BY b.cohort, period
ORDER BY b.cohort, period DESC;
