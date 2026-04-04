-- Recovery projection: week by week if all 4 solutions ship
SELECT
  week_number,
  CASE
    WHEN week_number <= 3  THEN 'Ranking fix ships'
    WHEN week_number <= 5  THEN 'AI review summary ships'
    WHEN week_number <= 6  THEN 'Package surfacing ships'
    WHEN week_number <= 8  THEN 'Visa confidence layer ships'
    ELSE                        'All solutions live'
  END                                                AS milestone,
  CASE
    WHEN week_number <= 3  THEN 760000
    WHEN week_number <= 5  THEN 760000 + 590000
    WHEN week_number <= 6  THEN 760000 + 590000 + 460000
    ELSE                        760000 + 590000 + 460000 + 290000
  END                                                AS cumulative_daily_recovery_usd
FROM (
  SELECT unnest(generate_series(1, 10)) AS week_number
) AS weeks
ORDER BY week_number;
