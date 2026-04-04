-- Tenure dimension: confirms long-tenure user degradation
-- Key signal: 180d+ users dropping despite being most habitual
SELECT
  CASE
    WHEN u.tenure_days < 30  THEN 'new_0_30d'
    WHEN u.tenure_days < 180 THEN 'mid_31_180d'
    ELSE                          'long_180d_plus'
  END                                                                  AS tenure_segment,
  CASE WHEN s.week < 5 THEN 'pre_anomaly' ELSE 'post_anomaly' END     AS period,
  COUNT(DISTINCT s.user_id)                                            AS unique_users,
  ROUND(AVG(CASE WHEN s.converted THEN 1.0 ELSE 0.0 END) * 100, 2)   AS cvr_pct,
  ROUND(AVG(s.review_dwell_seconds), 0)                                AS avg_review_dwell_sec,
  ROUND(AVG(s.listings_viewed), 1)                                     AS avg_listings_viewed
FROM sessions s
JOIN users u ON u.user_id = s.user_id
GROUP BY tenure_segment, period
ORDER BY tenure_segment, period DESC;
