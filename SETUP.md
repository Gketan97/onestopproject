# onestopcareers — Setup Guide

## How to apply this update

1. **Copy everything** from this zip into your project root, replacing existing files.
2. Run `npm install` (dependencies haven't changed).
3. Set environment variables in Netlify (see below).
4. Run `npm run dev` to verify locally.
5. `git add -A && git commit -m "feat: react case study + all redesigns"` then push.

---

## New file structure

```
src/
  App.jsx                          ← updated routes
  components/
    case-study/                    ← NEW — entire React case study
      SwiggyCase.jsx               ← root orchestrator
      data/swiggyData.js           ← all static content (SQL data, mocks, steps)
      hooks/
        useCaseState.js            ← localStorage state management
        useArjun.js                ← Anthropic API wrapper (mock in dev)
        useP2Timer.js              ← Phase 2 elapsed timer + Priya messages
      sections/
        LandingSection.jsx
        GapSection.jsx
        ContextSection.jsx
        Phase1Section.jsx
        P1SummarySection.jsx
        Phase2Section.jsx
        PaywallSection.jsx
        Phase3Section.jsx
        DebriefSection.jsx
      shared/
        ArjunVoice.jsx             ← Arjun's left-bordered callout
        SlackThread.jsx            ← Slack message thread UI
        ProduceFirst.jsx           ← Prediction/free-text input with reveal
        SqlWorkbench.jsx           ← Dark SQL editor + results table
        SchemaPanel.jsx            ← Collapsible schema reference
        MissionBrief.jsx           ← Sticky Phase 2 context panel
        ProgressStrip.jsx          ← Sticky progress bar
    cards/
      JobCard.jsx                  ← updated (initials fallback, grid fix)
    layout/
      Header.jsx                   ← updated (NavLink active states)
      MobileNav.jsx                ← updated (case study link)
    pages/
      CaseStudyPage.jsx            ← updated (uses React, not iframe)
      HomePage.jsx                 ← redesigned
      JobsPage.jsx                 ← redesigned (completion banner, skeleton)
    portfolio/
      PortfolioPage.jsx            ← redesigned (narrative, score bars)
netlify/functions/
  evaluate.js                      ← existing Anthropic proxy
  create-order.js                  ← NEW — Razorpay order creation
public/
  tokens.css                       ← shared CSS design tokens
  case-studies/swiggy.html         ← kept as fallback (not used by React routes)
```

---

## Routes

| URL | Component |
|---|---|
| `/` | HomePage |
| `/jobs` | JobsPage |
| `/case-study/swiggy` | SwiggyCase (via CaseStudyPage) |
| `/portfolio/:id` | PortfolioPage |
| `/become-referrer` | ReferrerForm |

---

## Environment variables (Netlify)

These must be set in Netlify Dashboard → Site Settings → Environment Variables:

```
# Existing (already set)
ANTHROPIC_API_KEY=sk-ant-...
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# New — for Razorpay payment (Phase 3 unlock)
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
```

---

## Firebase project ID (case study portfolio saves)

In `public/case-studies/swiggy.html` (kept as fallback), replace:
```html
<meta name="firebase-project" content="YOUR_FIREBASE_PROJECT_ID">
```
with your actual Firebase project ID.

The React case study (`SwiggyCase.jsx`) reads the same meta tag from the HTML document — so setting it once in `index.html` is sufficient:
```html
<!-- Add to index.html <head> -->
<meta name="firebase-project" content="your-actual-project-id">
```

---

## Dev mode

The case study runs in **mock mode** when `import.meta.env.DEV` is true (i.e. `npm run dev`).  
- All Arjun evaluations use hardcoded mock responses from `swiggyData.js`
- The Phase 3 paywall shows a "Continue to Phase 3 (dev) →" bypass button
- No API calls are made

To test with live API: set `ANTHROPIC_API_KEY` and run via `netlify dev` (not `npm run dev`).
