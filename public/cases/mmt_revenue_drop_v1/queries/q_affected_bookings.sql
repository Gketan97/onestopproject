SELECT
  COUNT(*)                                                                               AS total_attempts_post_w16,
  SUM(CASE WHEN abandoned AND abandonment_reason = 'price_shock' THEN 1 ELSE 0 END)    AS abandoned_due_to_price_shock,
  ROUND(
    SUM(CASE WHEN abandoned AND abandonment_reason = 'price_shock' THEN 1.0 ELSE 0.0 END)
    / NULLIF(COUNT(*), 0) * 100, 1
  )                                                                                      AS abandoned_pct,
  ROUND(
    SUM(CASE WHEN abandoned AND abandonment_reason = 'price_shock' THEN 1.0 ELSE 0.0 END) * 0.6
  , 0)                                                                                   AS estimated_lost_bookings
FROM booking_attempts
WHERE week_number >= 16
