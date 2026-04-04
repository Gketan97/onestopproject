-- DAU vs bookings decomposition: shows denominator growing faster than numerator
SELECT
  s.week,
  COUNT(DISTINCT s.user_id)                                         AS dau,
  COUNT(DISTINCT b.booking_id)                                      AS bookings,
  ROUND(
    COUNT(DISTINCT b.booking_id) * 100.0 / NULLIF(COUNT(DISTINCT s.user_id), 0),
    2
  )                                                                 AS bookings_per_dau_pct,
  ROUND(
    (COUNT(DISTINCT s.user_id) - LAG(COUNT(DISTINCT s.user_id))
      OVER (ORDER BY s.week)) * 100.0
    / NULLIF(LAG(COUNT(DISTINCT s.user_id)) OVER (ORDER BY s.week), 0),
    1
  )                                                                 AS dau_wow_growth_pct
FROM sessions s
LEFT JOIN bookings b
  ON b.user_id = s.user_id AND b.week = s.week
GROUP BY s.week
ORDER BY s.week;
