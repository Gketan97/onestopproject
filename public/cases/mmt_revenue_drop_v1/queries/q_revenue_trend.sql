SELECT
  week_number,
  COUNT(booking_id)                                      AS bookings_count,
  ROUND(SUM(revenue), 2)                                 AS total_revenue,
  ROUND(AVG(revenue), 2)                                 AS revenue_per_booking,
  ROUND(
    (AVG(revenue) - LAG(AVG(revenue)) OVER (ORDER BY week_number))
    / NULLIF(LAG(AVG(revenue)) OVER (ORDER BY week_number), 0) * 100
  , 2)                                                   AS wow_change_pct
FROM bookings
GROUP BY week_number
ORDER BY week_number
