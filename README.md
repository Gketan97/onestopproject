<<<<<<< Updated upstream
# onestopproject_recoded
=======
# onestopcareers

Analytics career education platform. Case study based learning starting with the Swiggy Orders Investigation.

## Stack

- **React 18 + Vite** — main app (jobs board, homepage, portfolio pages)
- **Tailwind CSS 3** — all styling via unified token system in `tailwind.config.js`
- **Firebase** — Firestore for portfolio persistence, anonymous auth
- **Netlify** — hosting + serverless functions for secure Anthropic API proxy
- **Vanilla HTML** — `public/case-studies/swiggy.html` (the case study itself)

## Project structure

```
src/
  components/
    layout/       Header, MobileHeader, MobileNav
    pages/        HomePage, JobsPage, ReferrerForm
    portfolio/    PortfolioPage (reads from Firestore by ID)
    cards/        JobCard, ReferralCard
    modals/       FilterModal, JobDetailModal, ReferralFilterModal
    ui/           Shared design system components (PhasePill, Button, etc.)
  services/
    portfolioService.js   Firestore save/get for portfolios
    apiService.js         All Anthropic API calls (via Netlify proxy)
  data/
    appData.jsx           Static data (decision tree, testimonials)
  hooks/
    useDataFetching.js    Jobs + referrals data hook

public/
  case-studies/
    swiggy.html           The 3-phase case study (self-contained HTML)

netlify/
  functions/
    evaluate.js           Serverless proxy for Anthropic API
```

## Local development

### 1. Clone and install

```bash
npm install
```

### 2. Environment variables

Create `.env.local` in the project root:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

For the Netlify function, set in Netlify dashboard → Site settings → Environment variables:

```
ANTHROPIC_API_KEY=sk-ant-...
```

For local dev with Netlify functions, create `netlify/.env`:
```
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Run locally

You need Netlify CLI to run functions locally:

```bash
npm install -g netlify-cli
netlify dev
```

This starts both Vite (port 5173) and the Netlify functions server (port 8888), and proxies correctly. Visit `http://localhost:8888`.

If you only want the React app without functions:
```bash
npm run dev
```
Note: AI evaluations in the case study will fail in this mode (no function server).

### 4. The case study

`swiggy.html` is served as a static file at `/case-studies/swiggy`. It is self-contained and calls `/.netlify/functions/evaluate` for AI evaluations.

The portfolio save in `swiggy.html` uses the Firestore REST API directly. It needs the Firebase project ID. Add this meta tag to `swiggy.html` head (already present as a placeholder):

```html
<meta name="firebase-project" content="your_project_id">
```

Or set the global variable before the script:
```html
<script>window.__FIREBASE_PROJECT_ID__ = 'your_project_id';</script>
```

## Deployment

Push to main → Netlify auto-deploys.

Required Netlify environment variables:
- `ANTHROPIC_API_KEY`
- All `VITE_FIREBASE_*` vars (set in Netlify dashboard, they get baked into the build)

## Portfolio URLs

Portfolios are saved to Firestore at `portfolios/{portfolioId}` and served at `/portfolio/:portfolioId`. The ID is a 10-character random string generated in the browser. Old links never break as long as the Firestore document exists.

Firestore security rules needed (set in Firebase console):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /portfolios/{portfolioId} {
      allow read: if true;  // Public — anyone with the link can view
      allow create: if true; // Anonymous users can save
      allow update, delete: if false; // Immutable after creation
    }
  }
}
```

## Design system

All tokens are in `tailwind.config.js` and mirrored as CSS custom properties in `src/index.css`. Never hardcode hex values in components — use Tailwind classes or CSS variables.

Key tokens:
- `bg-bg` / `bg-surface` — page and card backgrounds
- `text-ink` / `text-ink2` / `text-ink3` — text hierarchy
- `text-accent` / `bg-accent` — orange brand colour
- `bg-phase1-bg` / `text-phase1` — Phase 1 (orange)
- `bg-phase2-bg` / `text-phase2` — Phase 2 (blue)
- `bg-phase3-bg` / `text-phase3` — Phase 3 (green)

Shared components are in `src/components/ui/index.jsx`:
`PhasePill`, `MonoLabel`, `Button`, `CalloutCard`, `SqlBlock`, `ScoreBadge`, `Spinner`, `Divider`
>>>>>>> Stashed changes
