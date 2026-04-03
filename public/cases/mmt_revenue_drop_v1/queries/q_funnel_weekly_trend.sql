SELECT
  s.week_number,
  ROUND(COUNT(DISTINCT hv.view_id)::DOUBLE    / NULLIF(COUNT(DISTINCT se.search_id), 0) * 100, 1) AS search_to_view,
  ROUND(COUNT(DISTINCT ba.attempt_id)::DOUBLE / NULLIF(COUNT(DISTINCT hv.view_id), 0) * 100, 1)   AS view_to_attempt,
  ROUND(COUNT(DISTINCT b.booking_id)::DOUBLE  / NULLIF(COUNT(DISTINCT ba.attempt_id), 0) * 100, 1) AS attempt_to_booking
FROM sessions s
LEFT JOIN search_events se    ON s.session_id = se.session_id
LEFT JOIN hotel_views hv      ON se.search_id = hv.search_id
LEFT JOIN booking_attempts ba ON hv.view_id = ba.view_id
LEFT JOIN bookings b          ON ba.attempt_id = b.attempt_id
GROUP BY s.week_number
ORDER BY s.week_number
