// src/analytics/posthog.js
// CP4-C: PostHog analytics wrapper.
// initAnalytics() called once in main.jsx.
// track() used throughout the app for funnel events.
// Never stores PII. No-ops in dev (logs to console instead).

import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;

export function initAnalytics() {
  if (!POSTHOG_KEY || import.meta.env.DEV) return;
  posthog.init(POSTHOG_KEY, {
    api_host:        'https://app.posthog.com',
    capture_pageview: true,
    persistence:     'localStorage',
  });
  // Expose on window so ErrorBoundary can call posthog.capture safely
  window.posthog = posthog;
}

export function track(event, props = {}) {
  if (import.meta.env.DEV) {
    console.log('[Analytics]', event, props);
    return;
  }
  try {
    posthog?.capture(event, props);
  } catch (_) {}
}
