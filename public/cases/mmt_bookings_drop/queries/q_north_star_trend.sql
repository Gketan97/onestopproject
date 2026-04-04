-- North star metric: Bookings/DAU trend across 12 weeks
-- Shows the 13% decline starting Week 5
SELECT
  s.week,
  COUNT(DISTINCT s.user_id)                                    AS dau,
  COUNT(DISTINCT b.booking_id)                                 AS total_bookings,
  ROUND(
    COUNT(DISTINCT b.booking_id) * 100.0 / COUNT(DISTINCT s.user_id),
    2
  )                                                            AS bookings_per_dau_pct,
  ROUND(COALESCE(SUM(b.revenue_usd), 0), 0)                   AS total_revenue_usd
FROM sessions s
LEFT JOIN bookings b
  ON b.user_id = s.user_id AND b.week = s.week
GROUP BY s.week
ORDER BY s.week;
