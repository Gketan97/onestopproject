-- International travel and visa uncertainty signal
-- Visa exits 3x post Week 5, international CVR collapses
SELECT
  s.week,
  ROUND(AVG(CASE WHEN s.listing_category = 'international'
    THEN (CASE WHEN s.converted THEN 1.0 ELSE 0.0 END) END) * 100, 2)  AS intl_cvr_pct,
  ROUND(AVG(CASE WHEN s.visa_concern_exit THEN 1.0 ELSE 0.0 END) * 100, 2) AS visa_exit_rate_pct,
  COUNT(DISTINCT CASE WHEN s.listing_category = 'international'
    THEN s.session_id END)                                               AS intl_sessions,
  COUNT(DISTINCT CASE WHEN s.visa_concern_exit
    THEN s.session_id END)                                               AS visa_exit_sessions
FROM sessions s
GROUP BY s.week
ORDER BY s.week;
