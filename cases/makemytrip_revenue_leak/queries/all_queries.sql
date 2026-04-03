-- q_booking_volume_trend.sql
SELECT
  s.week_number,
  COUNT(DISTINCT s.session_id)          AS sessions,
  COUNT(DISTINCT se.search_id)          AS search_events,
  COUNT(DISTINCT ba.attempt_id)         AS booking_attempts,
  COUNT(DISTINCT b.booking_id)          AS bookings
FROM sessions s
LEFT JOIN search_events se  ON s.session_id = se.session_id
LEFT JOIN hotel_views hv    ON se.search_id = hv.search_id
LEFT JOIN booking_attempts ba ON hv.view_id = ba.view_id
LEFT JOIN bookings b        ON ba.attempt_id = b.attempt_id
GROUP BY s.week_number
ORDER BY s.week_number;

-- q_kpi_snapshot.sql
SELECT
  ROUND(AVG(CASE WHEN b.week_number < 16 THEN b.revenue END), 2)     AS avg_revenue_per_booking_pre,
  ROUND(AVG(CASE WHEN b.week_number >= 16 THEN b.revenue END), 2)    AS avg_revenue_per_booking_post,
  ROUND(COUNT(DISTINCT se.search_id)::DOUBLE / NULLIF(COUNT(DISTINCT s.session_id), 0), 3) AS session_to_search_rate,
  ROUND(COUNT(DISTINCT hv.view_id)::DOUBLE  / NULLIF(COUNT(DISTINCT se.search_id), 0), 3) AS search_to_view_rate,
  ROUND(COUNT(DISTINCT ba.attempt_id)::DOUBLE / NULLIF(COUNT(DISTINCT hv.view_id), 0), 3) AS view_to_attempt_rate,
  ROUND(COUNT(DISTINCT b.booking_id)::DOUBLE / NULLIF(COUNT(DISTINCT ba.attempt_id), 0), 3) AS attempt_to_booking_rate,
  ROUND(AVG(CASE WHEN il.booking_success THEN 1.0 ELSE 0.0 END), 3) AS supplier_success_rate,
  ROUND(AVG(CASE WHEN p.payment_status = 'success' THEN 1.0 ELSE 0.0 END), 3) AS payment_success_rate
FROM sessions s
LEFT JOIN search_events se    ON s.session_id = se.session_id
LEFT JOIN hotel_views hv      ON se.search_id = hv.search_id
LEFT JOIN booking_attempts ba ON hv.view_id = ba.view_id
LEFT JOIN bookings b          ON ba.attempt_id = b.attempt_id
LEFT JOIN payments p          ON b.booking_id = p.booking_id
LEFT JOIN inventory_logs il   ON b.hotel_id = il.hotel_id;

-- q_funnel_weekly_trend.sql
SELECT
  s.week_number,
  ROUND(COUNT(DISTINCT hv.view_id)::DOUBLE   / NULLIF(COUNT(DISTINCT se.search_id), 0) * 100, 1)  AS search_to_view,
  ROUND(COUNT(DISTINCT ba.attempt_id)::DOUBLE / NULLIF(COUNT(DISTINCT hv.view_id), 0) * 100, 1)   AS view_to_attempt,
  ROUND(COUNT(DISTINCT b.booking_id)::DOUBLE  / NULLIF(COUNT(DISTINCT ba.attempt_id), 0) * 100, 1) AS attempt_to_booking
FROM sessions s
LEFT JOIN search_events se    ON s.session_id = se.session_id
LEFT JOIN hotel_views hv      ON se.search_id = hv.search_id
LEFT JOIN booking_attempts ba ON hv.view_id = ba.view_id
LEFT JOIN bookings b          ON ba.attempt_id = b.attempt_id
GROUP BY s.week_number
ORDER BY s.week_number;

-- q_checkout_drop.sql
SELECT
  week_number,
  COUNT(attempt_id)                              AS attempts,
  SUM(CASE WHEN abandoned THEN 1 ELSE 0 END)     AS abandoned,
  ROUND(AVG(CASE WHEN abandoned THEN 1.0 ELSE 0.0 END) * 100, 1) AS abandonment_rate,
  MODE() WITHIN GROUP (ORDER BY abandonment_reason) AS primary_abandonment_reason
FROM booking_attempts
GROUP BY week_number
ORDER BY week_number;

-- q_pricing_anomaly.sql
SELECT
  ba.week_number,
  ROUND(AVG(se.search_price_shown), 2)           AS avg_search_price,
  ROUND(AVG(ba.checkout_price), 2)               AS avg_checkout_price,
  ROUND(AVG(ba.price_delta_pct) * 100, 1)        AS avg_price_delta_pct,
  ROUND(
    SUM(CASE WHEN ba.price_delta_pct > 0.15 THEN 1 ELSE 0 END)::DOUBLE
    / NULLIF(COUNT(*), 0) * 100
  , 1)                                           AS pct_with_price_shock
FROM booking_attempts ba
JOIN hotel_views hv    ON ba.view_id = hv.view_id
JOIN search_events se  ON hv.search_id = se.search_id
GROUP BY ba.week_number
ORDER BY ba.week_number;

-- q_supplier_failure_rate.sql
SELECT
  il.week_number,
  COUNT(*)                                        AS total_attempts,
  SUM(CASE WHEN NOT il.booking_success THEN 1 ELSE 0 END) AS supplier_failures,
  ROUND(AVG(CASE WHEN NOT il.booking_success THEN 1.0 ELSE 0.0 END) * 100, 1) AS failure_rate
FROM inventory_logs il
GROUP BY il.week_number
ORDER BY il.week_number;

-- q_dynamic_pricing_log.sql
SELECT
  week_number,
  algorithm_version,
  COUNT(*)                        AS entries_count,
  ROUND(AVG(multiplier), 3)       AS avg_multiplier,
  ROUND(MAX(multiplier), 3)       AS max_multiplier
FROM price_logs
GROUP BY week_number, algorithm_version
ORDER BY week_number, algorithm_version;

-- q_price_at_checkout_vs_search.sql
SELECT
  ba.week_number,
  se.is_domestic,
  ROUND(AVG(se.search_price_shown), 2)    AS avg_search_price,
  ROUND(AVG(ba.checkout_price), 2)        AS avg_checkout_price,
  ROUND(AVG(ba.price_delta_pct) * 100, 1) AS delta_pct
FROM booking_attempts ba
JOIN hotel_views hv   ON ba.view_id = hv.view_id
JOIN search_events se ON hv.search_id = se.search_id
GROUP BY ba.week_number, se.is_domestic
ORDER BY ba.week_number, se.is_domestic;

-- q_revenue_lost_estimate.sql
WITH baseline AS (
  SELECT AVG(revenue) AS baseline_rpb FROM bookings WHERE week_number < 16
),
post AS (
  SELECT
    week_number,
    COUNT(*) AS weekly_bookings,
    AVG(revenue) AS current_rpb
  FROM bookings WHERE week_number >= 16
  GROUP BY week_number
)
SELECT
  ROUND(b.baseline_rpb, 2)                                AS baseline_rpb,
  ROUND(AVG(p.current_rpb), 2)                            AS current_rpb,
  ROUND(AVG(p.weekly_bookings), 0)                        AS weekly_bookings,
  ROUND((b.baseline_rpb - AVG(p.current_rpb)) * AVG(p.weekly_bookings), 2) AS weekly_revenue_loss,
  ROUND((b.baseline_rpb - AVG(p.current_rpb)) * AVG(p.weekly_bookings) * 6, 2) AS total_revenue_lost_6w
FROM post p, baseline b
GROUP BY b.baseline_rpb;

-- q_affected_bookings.sql
SELECT
  COUNT(*)                                                    AS total_attempts_post_w16,
  SUM(CASE WHEN abandoned AND abandonment_reason = 'price_shock' THEN 1 ELSE 0 END) AS abandoned_due_to_price_shock,
  ROUND(
    SUM(CASE WHEN abandoned AND abandonment_reason = 'price_shock' THEN 1.0 ELSE 0.0 END)
    / NULLIF(COUNT(*), 0) * 100
  , 1)                                                        AS abandoned_pct,
  ROUND(
    SUM(CASE WHEN abandoned AND abandonment_reason = 'price_shock' THEN 1.0 ELSE 0.0 END) * 0.6
  , 0)                                                        AS estimated_lost_bookings
FROM booking_attempts
WHERE week_number >= 16;

-- q_recovery_projection.sql
WITH baseline AS (
  SELECT
    COUNT(b.booking_id)::DOUBLE / NULLIF(COUNT(ba.attempt_id), 0) AS baseline_attempt_to_booking
  FROM booking_attempts ba
  LEFT JOIN bookings b ON ba.attempt_id = b.attempt_id
  WHERE ba.week_number < 16
),
current AS (
  SELECT
    COUNT(b.booking_id)::DOUBLE / NULLIF(COUNT(ba.attempt_id), 0) AS current_attempt_to_booking,
    COUNT(ba.attempt_id) AS weekly_attempts,
    AVG(b.revenue) AS avg_booking_value
  FROM booking_attempts ba
  LEFT JOIN bookings b ON ba.attempt_id = b.attempt_id
  WHERE ba.week_number >= 16
)
SELECT
  ROUND(c.current_attempt_to_booking * 100, 1)  AS current_attempt_to_booking,
  ROUND(b.baseline_attempt_to_booking * 100, 1) AS baseline_attempt_to_booking,
  ROUND((b.baseline_attempt_to_booking - c.current_attempt_to_booking) * c.weekly_attempts, 0) AS recovery_booking_delta,
  ROUND(
    (b.baseline_attempt_to_booking - c.current_attempt_to_booking) * c.weekly_attempts * c.avg_booking_value
  , 2)                                           AS projected_weekly_revenue_gain
FROM current c, baseline b;
