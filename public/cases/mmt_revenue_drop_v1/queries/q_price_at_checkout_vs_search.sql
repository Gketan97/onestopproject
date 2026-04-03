SELECT
  ba.week_number,
  se.is_domestic,
  ROUND(AVG(se.search_price_shown), 2)     AS avg_search_price,
  ROUND(AVG(ba.checkout_price), 2)         AS avg_checkout_price,
  ROUND(AVG(ba.price_delta_pct) * 100, 1)  AS delta_pct
FROM booking_attempts ba
JOIN hotel_views hv   ON ba.view_id = hv.view_id
JOIN search_events se ON hv.search_id = se.search_id
GROUP BY ba.week_number, se.is_domestic
ORDER BY ba.week_number, se.is_domestic
