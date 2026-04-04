-- HVT behavioral shift: package visits increasing, hotel CVR dropping
-- Shows behavioral migration not product failure
SELECT
  s.week,
  ROUND(AVG(CASE WHEN s.cohort = 'HVT' AND s.package_page_visited
    THEN 1.0 ELSE 0.0 END) * 100, 1)                                     AS hvt_package_visit_pct,
  ROUND(AVG(CASE WHEN s.cohort = 'HVT' AND s.converted
    THEN 1.0 ELSE 0.0 END) * 100, 2)                                     AS hvt_hotel_cvr_pct,
  ROUND(AVG(CASE WHEN b.is_package AND s.cohort = 'HVT'
    THEN 1.0 ELSE 0.0 END) * 100, 1)                                     AS hvt_package_booking_pct,
  COUNT(DISTINCT CASE WHEN s.cohort = 'HVT' THEN s.session_id END)       AS hvt_sessions
FROM sessions s
LEFT JOIN bookings b ON b.user_id = s.user_id AND b.week = s.week
GROUP BY s.week
ORDER BY s.week;
