-- Inventory expansion: homestay share of results vs CVR correlation
-- Confirms ranking dilution from Week 5 onward
SELECT
  sr.week,
  ROUND(AVG(CASE WHEN sr.cohort = 'HVT' THEN sr.budget_in_top5_pct END) * 100, 1)  AS hvt_budget_in_top5_pct,
  ROUND(AVG(CASE WHEN sr.cohort = 'HVT' THEN sr.scroll_depth_pct END) * 100, 1)     AS hvt_scroll_depth_pct,
  ROUND(AVG(CASE WHEN sr.cohort = 'HVT' THEN sr.time_to_first_click_seconds END), 0) AS hvt_time_to_click_sec,
  ROUND(AVG(CASE WHEN s.cohort = 'HVT' AND s.converted THEN 1.0 ELSE 0.0 END) * 100, 2) AS hvt_cvr_pct
FROM search_results sr
JOIN sessions s ON s.session_id = sr.session_id
GROUP BY sr.week
ORDER BY sr.week;
