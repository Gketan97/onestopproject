WITH counts AS (
  SELECT
    COUNT(DISTINCT s.session_id)    AS sessions,
    COUNT(DISTINCT se.search_id)    AS searches,
    COUNT(DISTINCT hv.view_id)      AS views,
    COUNT(DISTINCT ba.attempt_id)   AS attempts,
    COUNT(DISTINCT b.booking_id)    AS bookings
  FROM sessions s
  LEFT JOIN search_events se    ON s.session_id = se.session_id
  LEFT JOIN hotel_views hv      ON se.search_id = hv.search_id
  LEFT JOIN booking_attempts ba ON hv.view_id = ba.view_id
  LEFT JOIN bookings b          ON ba.attempt_id = b.attempt_id
)
SELECT
  'Sessions'  AS stage, sessions  AS count, 100.0 AS conversion_rate FROM counts
UNION ALL
SELECT 'Searches', searches, ROUND(searches::DOUBLE / sessions * 100, 1) FROM counts
UNION ALL
SELECT 'Views',    views,    ROUND(views::DOUBLE    / searches * 100, 1) FROM counts
UNION ALL
SELECT 'Attempts', attempts, ROUND(attempts::DOUBLE / views * 100, 1)    FROM counts
UNION ALL
SELECT 'Bookings', bookings, ROUND(bookings::DOUBLE / attempts * 100, 1) FROM counts
