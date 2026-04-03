SELECT
  s.week_number,
  COUNT(DISTINCT s.session_id)   AS sessions,
  COUNT(DISTINCT b.booking_id)   AS bookings,
  ROUND(COUNT(DISTINCT b.booking_id)::DOUBLE / NULLIF(COUNT(DISTINCT s.session_id), 0) * 100, 2) AS conversion_rate
FROM sessions s
LEFT JOIN search_events se    ON s.session_id = se.session_id
LEFT JOIN hotel_views hv      ON se.search_id = hv.search_id
LEFT JOIN booking_attempts ba ON hv.view_id = ba.view_id
LEFT JOIN bookings b          ON ba.attempt_id = b.attempt_id
GROUP BY s.week_number
ORDER BY s.week_number
