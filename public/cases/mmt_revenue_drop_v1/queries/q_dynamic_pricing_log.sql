SELECT
  week_number,
  algorithm_version,
  COUNT(*)                   AS entries_count,
  ROUND(AVG(multiplier), 3)  AS avg_multiplier,
  ROUND(MAX(multiplier), 3)  AS max_multiplier
FROM price_logs
GROUP BY week_number, algorithm_version
ORDER BY week_number, algorithm_version
