-- Listing category dimension: shows vacation and tourist dropping
-- Correlated with homestay expansion and ranking dilution
SELECT
  s.listing_category,
  CASE WHEN s.week < 5 THEN 'pre_anomaly' ELSE 'post_anomaly' END       AS period,
  COUNT(DISTINCT s.session_id)                                            AS sessions,
  ROUND(AVG(CASE WHEN s.converted THEN 1.0 ELSE 0.0 END) * 100, 2)      AS cvr_pct,
  ROUND(AVG(s.review_dwell_seconds), 0)                                   AS avg_review_dwell_sec,
  ROUND(AVG(s.listings_viewed), 1)                                        AS avg_listings_viewed
FROM sessions s
GROUP BY s.listing_category, period
ORDER BY s.listing_category, period DESC;
