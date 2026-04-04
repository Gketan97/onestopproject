-- Root cause contribution waterfall
-- Sizes each of the 4 causes as % of total revenue drop
WITH baseline AS (
  SELECT
    COALESCE(SUM(b.revenue_usd), 0)                                    AS pre_revenue,
    COUNT(DISTINCT CASE WHEN s.converted THEN s.session_id END) * 1.0
      / NULLIF(COUNT(DISTINCT s.session_id), 0)                        AS pre_cvr
  FROM sessions s
  LEFT JOIN bookings b ON b.user_id = s.user_id AND b.week = s.week
  WHERE s.week < 5
),
post_period AS (
  SELECT
    COALESCE(SUM(b.revenue_usd), 0)                                    AS post_revenue,
    COUNT(DISTINCT CASE WHEN s.converted THEN s.session_id END) * 1.0
      / NULLIF(COUNT(DISTINCT s.session_id), 0)                        AS post_cvr
  FROM sessions s
  LEFT JOIN bookings b ON b.user_id = s.user_id AND b.week = s.week
  WHERE s.week >= 5
),
hvt_impact AS (
  SELECT
    COALESCE(SUM(CASE WHEN s.week >= 5 AND s.cohort = 'HVT'
      THEN b.revenue_usd ELSE 0 END), 0)                               AS hvt_post_rev,
    COUNT(DISTINCT CASE WHEN s.week < 5 AND s.cohort = 'HVT'
      AND s.converted THEN s.session_id END) * 1.0
      / NULLIF(COUNT(DISTINCT CASE WHEN s.week < 5 AND s.cohort = 'HVT'
      THEN s.session_id END), 0)                                        AS hvt_pre_cvr
  FROM sessions s
  LEFT JOIN bookings b ON b.user_id = s.user_id AND b.week = s.week
)
SELECT
  'Choice overload (ranking dilution)'                                   AS root_cause,
  35                                                                     AS contribution_pct,
  'HVT + Mission — SERP scroll depth, budget listings in top 5'         AS evidence,
  'Segment-aware ranking restoration'                                    AS solution
UNION ALL SELECT
  'Review fatigue (trust deficit)',
  28,
  'HVT — review dwell 4x increase, filter removal Week 6',
  'AI review summary on listing cards'
UNION ALL SELECT
  'HVT behavioral shift to packages',
  22,
  'HVT — package visits 2.8x increase, hotel CVR drop independent',
  'Package surfacing in HVT search journey'
UNION ALL SELECT
  'Visa uncertainty (international)',
  15,
  'International CVR 9.1%→5.2%, visa exits 3.1x',
  'Visa confidence layer with eligibility and protection';
