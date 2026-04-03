SELECT
  week_number,
  COUNT(attempt_id)                                                      AS attempts,
  SUM(CASE WHEN abandoned THEN 1 ELSE 0 END)                            AS abandoned,
  ROUND(AVG(CASE WHEN abandoned THEN 1.0 ELSE 0.0 END) * 100, 1)       AS abandonment_rate,
  MAX(abandonment_reason)                                                AS primary_abandonment_reason
FROM booking_attempts
GROUP BY week_number
ORDER BY week_number
