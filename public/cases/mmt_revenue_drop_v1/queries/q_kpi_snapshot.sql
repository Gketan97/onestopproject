SELECT
  ROUND(AVG(CASE WHEN b.week_number < 16 THEN b.revenue END), 2)      AS avg_revenue_per_booking_pre,
  ROUND(AVG(CASE WHEN b.week_number >= 16 THEN b.revenue END), 2)     AS avg_revenue_per_booking_post,
  ROUND(COUNT(DISTINCT se.search_id)::DOUBLE / NULLIF(COUNT(DISTINCT s.session_id), 0), 3)  AS session_to_search_rate,
  ROUND(COUNT(DISTINCT hv.view_id)::DOUBLE   / NULLIF(COUNT(DISTINCT se.search_id), 0), 3)  AS search_to_view_rate,
  ROUND(COUNT(DISTINCT ba.attempt_id)::DOUBLE / NULLIF(COUNT(DISTINCT hv.view_id), 0), 3)   AS view_to_attempt_rate,
  ROUND(COUNT(DISTINCT b.booking_id)::DOUBLE  / NULLIF(COUNT(DISTINCT ba.attempt_id), 0), 3) AS attempt_to_booking_rate,
  ROUND(AVG(CASE WHEN il.booking_success THEN 1.0 ELSE 0.0 END), 3)  AS supplier_success_rate,
  ROUND(AVG(CASE WHEN p.payment_status = 'success' THEN 1.0 ELSE 0.0 END), 3) AS payment_success_rate
FROM sessions s
LEFT JOIN search_events se    ON s.session_id = se.session_id
LEFT JOIN hotel_views hv      ON se.search_id = hv.search_id
LEFT JOIN booking_attempts ba ON hv.view_id = ba.view_id
LEFT JOIN bookings b          ON ba.attempt_id = b.attempt_id
LEFT JOIN payments p          ON b.booking_id = p.booking_id
LEFT JOIN inventory_logs il   ON b.hotel_id = il.hotel_id
