-- Revenue loss per root cause with recovery projection
SELECT
  cause,
  daily_loss_usd,
  ROUND(daily_loss_usd * 60, 0)        AS total_60day_loss_usd,
  ROUND(daily_loss_usd * 0.80, 0)      AS estimated_daily_recovery_usd,
  engineering_weeks,
  ROUND(
    (daily_loss_usd * 0.80 * 7) / NULLIF(engineering_weeks, 0),
    0
  )                                     AS revenue_per_eng_week_usd
FROM (
  VALUES
    ('Choice overload — ranking fix',       760000, 3),
    ('Review fatigue — AI summary',         590000, 5),
    ('HVT package shift — surfacing',       460000, 6),
    ('Visa uncertainty — confidence layer', 290000, 8)
) AS t(cause, daily_loss_usd, engineering_weeks)
ORDER BY daily_loss_usd DESC;
