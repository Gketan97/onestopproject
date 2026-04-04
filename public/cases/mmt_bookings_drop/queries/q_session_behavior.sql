-- Session behavior signals: review dwell, listings viewed, package visits
-- Shows trust deficit (review dwell) and choice overload (listings viewed)
SELECT
  s.week,
  s.cohort,
  ROUND(AVG(s.review_dwell_seconds), 0)                              AS avg_review_dwell_sec,
  ROUND(AVG(s.listings_viewed), 1)                                   AS avg_listings_viewed,
  ROUND(AVG(CASE WHEN s.serp_bounce THEN 1.0 ELSE 0.0 END) * 100, 1) AS serp_bounce_rate_pct,
  ROUND(AVG(CASE WHEN s.package_page_visited THEN 1.0 ELSE 0.0 END) * 100, 1) AS package_visit_rate_pct,
  ROUND(AVG(CASE WHEN s.visa_concern_exit THEN 1.0 ELSE 0.0 END) * 100, 1)    AS visa_exit_rate_pct
FROM sessions s
GROUP BY s.week, s.cohort
ORDER BY s.cohort, s.week;
