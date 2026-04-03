WITH baseline AS (
  SELECT AVG(revenue) AS baseline_rpb FROM bookings WHERE week_number < 16
),
post AS (
  SELECT
    week_number,
    COUNT(*)         AS weekly_bookings,
    AVG(revenue)     AS current_rpb
  FROM bookings WHERE week_number >= 16
  GROUP BY week_number
)
SELECT
  ROUND(b.baseline_rpb, 2)                                                              AS baseline_rpb,
  ROUND(AVG(p.current_rpb), 2)                                                          AS current_rpb,
  ROUND(AVG(p.weekly_bookings), 0)                                                      AS weekly_bookings,
  ROUND((b.baseline_rpb - AVG(p.current_rpb)) * AVG(p.weekly_bookings), 2)             AS weekly_revenue_loss,
  ROUND((b.baseline_rpb - AVG(p.current_rpb)) * AVG(p.weekly_bookings) * 6, 2)         AS total_revenue_lost_6w
FROM post p, baseline b
GROUP BY b.baseline_rpb
