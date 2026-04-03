WITH baseline AS (
  SELECT
    COUNT(b.booking_id)::DOUBLE / NULLIF(COUNT(ba.attempt_id), 0) AS baseline_attempt_to_booking
  FROM booking_attempts ba
  LEFT JOIN bookings b ON ba.attempt_id = b.attempt_id
  WHERE ba.week_number < 16
),
curr AS (
  SELECT
    COUNT(b.booking_id)::DOUBLE / NULLIF(COUNT(ba.attempt_id), 0) AS current_attempt_to_booking,
    COUNT(ba.attempt_id)                                           AS weekly_attempts,
    AVG(b.revenue)                                                 AS avg_booking_value
  FROM booking_attempts ba
  LEFT JOIN bookings b ON ba.attempt_id = b.attempt_id
  WHERE ba.week_number >= 16
)
SELECT
  ROUND(c.current_attempt_to_booking * 100, 1)                                          AS current_attempt_to_booking,
  ROUND(b.baseline_attempt_to_booking * 100, 1)                                         AS baseline_attempt_to_booking,
  ROUND((b.baseline_attempt_to_booking - c.current_attempt_to_booking) * c.weekly_attempts, 0) AS recovery_booking_delta,
  ROUND(
    (b.baseline_attempt_to_booking - c.current_attempt_to_booking)
    * c.weekly_attempts * c.avg_booking_value, 2
  )                                                                                      AS projected_weekly_revenue_gain
FROM curr c, baseline b
