SELECT
  ba.week_number,
  ROUND(AVG(se.search_price_shown), 2)                                  AS avg_search_price,
  ROUND(AVG(ba.checkout_price), 2)                                      AS avg_checkout_price,
  ROUND(AVG(ba.price_delta_pct) * 100, 1)                               AS avg_price_delta_pct,
  ROUND(
    SUM(CASE WHEN ba.price_delta_pct > 0.15 THEN 1 ELSE 0 END)::DOUBLE
    / NULLIF(COUNT(*), 0) * 100, 1
  )                                                                      AS pct_with_price_shock
FROM booking_attempts ba
JOIN hotel_views hv   ON ba.view_id = hv.view_id
JOIN search_events se ON hv.search_id = se.search_id
GROUP BY ba.week_number
ORDER BY ba.week_number
