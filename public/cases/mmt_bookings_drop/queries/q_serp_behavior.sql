-- SERP micro-behaviors: the choice overload signal
-- HVT scroll depth and time to first click are the smoking gun
SELECT
  sr.cohort,
  CASE WHEN sr.week < 5 THEN 'pre_anomaly' ELSE 'post_anomaly' END   AS period,
  ROUND(AVG(sr.budget_in_top5_pct) * 100, 1)                         AS avg_budget_in_top5_pct,
  ROUND(AVG(sr.time_to_first_click_seconds), 0)                       AS avg_time_to_first_click_sec,
  ROUND(AVG(sr.scroll_depth_pct) * 100, 1)                           AS avg_scroll_depth_pct,
  ROUND(AVG(sr.filters_applied), 1)                                   AS avg_filters_applied,
  ROUND(AVG(CASE WHEN sr.premium_filter_available THEN 1.0 ELSE 0.0 END) * 100, 0) AS sessions_with_premium_filter_pct,
  COUNT(DISTINCT sr.session_id)                                        AS session_count
FROM search_results sr
GROUP BY sr.cohort, period
ORDER BY sr.cohort, period DESC;
