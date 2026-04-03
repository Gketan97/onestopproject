SELECT
  ROUND(COUNT(DISTINCT hv.view_id)::DOUBLE    / NULLIF(COUNT(DISTINCT se.search_id), 0) * 100, 1) AS search_to_view,
  ROUND(COUNT(DISTINCT ba.attempt_id)::DOUBLE / NULLIF(COUNT(DISTINCT hv.view_id), 0) * 100, 1)   AS view_to_attempt,
  ROUND(COUNT(DISTINCT b.booking_id)::DOUBLE  / NULLIF(COUNT(DISTINCT ba.attempt_id), 0) * 100, 1) AS attempt_to_booking,
  CASE
    WHEN COUNT(DISTINCT b.booking_id)::DOUBLE / NULLIF(COUNT(DISTINCT ba.attempt_id), 0)
       < COUNT(DISTINCT ba.attempt_id)::DOUBLE / NULLIF(COUNT(DISTINCT hv.view_id), 0)
    THEN 'attempt_to_booking'
    ELSE 'view_to_attempt'
  END AS weakest_stage
FROM search_events se
LEFT JOIN hotel_views hv      ON se.search_id = hv.search_id
LEFT JOIN booking_attempts ba ON hv.view_id = ba.view_id
LEFT JOIN bookings b          ON ba.attempt_id = b.attempt_id
