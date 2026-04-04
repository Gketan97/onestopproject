-- Payment abandonment: Deal Seeker hidden fee signal
-- Fee revelation at payment is mechanistically distinct from SERP issues
SELECT
  s.cohort,
  CASE WHEN s.week < 5 THEN 'pre_anomaly' ELSE 'post_anomaly' END       AS period,
  COUNT(DISTINCT s.session_id)                                            AS total_sessions,
  ROUND(AVG(CASE WHEN s.payment_abandoned THEN 1.0 ELSE 0.0 END) * 100, 1) AS payment_abandon_pct,
  ROUND(AVG(CASE WHEN s.converted THEN 1.0 ELSE 0.0 END) * 100, 2)      AS overall_cvr_pct
FROM sessions s
GROUP BY s.cohort, period
ORDER BY s.cohort, period DESC;
