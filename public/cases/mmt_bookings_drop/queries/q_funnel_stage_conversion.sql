-- Funnel stage conversion: pre vs post for each cohort
-- Shows where each cohort breaks in the funnel
SELECT
  s.cohort,
  CASE WHEN s.week < 5 THEN 'pre_anomaly' ELSE 'post_anomaly' END    AS period,
  COUNT(DISTINCT s.session_id)                                         AS total_sessions,
  ROUND(AVG(CASE WHEN s.serp_bounce THEN 1.0 ELSE 0.0 END) * 100, 1) AS serp_bounce_rate_pct,
  ROUND(AVG(CASE WHEN s.payment_abandoned THEN 1.0 ELSE 0.0 END) * 100, 1) AS payment_abandon_pct,
  ROUND(AVG(CASE WHEN s.opened_external_map THEN 1.0 ELSE 0.0 END) * 100, 1) AS external_map_pct,
  ROUND(AVG(CASE WHEN s.visa_concern_exit THEN 1.0 ELSE 0.0 END) * 100, 1)   AS visa_exit_pct,
  ROUND(AVG(CASE WHEN s.converted THEN 1.0 ELSE 0.0 END) * 100, 2)   AS cvr_pct
FROM sessions s
GROUP BY s.cohort, period
ORDER BY s.cohort, period DESC;
