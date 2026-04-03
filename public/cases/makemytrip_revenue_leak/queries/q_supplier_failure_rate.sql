SELECT
  week_number,
  COUNT(*)                                                               AS total_attempts,
  SUM(CASE WHEN NOT booking_success THEN 1 ELSE 0 END)                  AS supplier_failures,
  ROUND(AVG(CASE WHEN NOT booking_success THEN 1.0 ELSE 0.0 END) * 100, 1) AS failure_rate
FROM inventory_logs
GROUP BY week_number
ORDER BY week_number
