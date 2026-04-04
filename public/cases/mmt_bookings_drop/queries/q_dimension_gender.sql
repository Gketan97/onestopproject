-- Gender dimension: the red herring
-- Female CVR drops but it is driven by listing category, not gender
-- Teaching moment: correlation is not causation
SELECT
  u.cohort,
  CASE WHEN s.week < 5 THEN 'pre_anomaly' ELSE 'post_anomaly' END   AS period,
  s.listing_category,
  ROUND(AVG(CASE WHEN s.converted THEN 1.0 ELSE 0.0 END) * 100, 2)  AS cvr_pct,
  COUNT(DISTINCT s.session_id)                                        AS sessions
FROM sessions s
JOIN users u ON u.user_id = s.user_id
GROUP BY u.cohort, period, s.listing_category
ORDER BY u.cohort, period DESC, s.listing_category;
