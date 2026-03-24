# Next Steps — Exact Actions Required

## Step 1 — Apply the code update (5 min)

In your terminal, from your project root:

```bash
unzip onestopcareers-update.zip
cp -r onestopcareers-export/. .
npm install
```

Commit and push:

```bash
git add -A
git commit -m "feat: react case study + all redesigns"
git push
```

Netlify will auto-deploy. The site builds and runs at this point with zero config.
Jobs page, homepage, case study, and portfolio all work.
Portfolio saves fall back to localStorage until Firebase is wired up (Step 3).

---

## Step 2 — Set the Anthropic API key (2 min)
*Required for Arjun's live evaluations in the case study.*

1. Go to: Netlify Dashboard → your site → Site configuration → Environment variables
2. Add one variable:

| Key | Value |
|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` (from console.anthropic.com) |

3. Trigger a redeploy: Deploys → Trigger deploy → Deploy site

Without this, the case study still works — it just uses hardcoded mock feedback instead of live Claude responses.

---

## Step 3 — Wire up Firebase (20 min)
*Required for portfolio links to be shareable across devices.*

Without Firebase, portfolio saves go to localStorage only — the shareable link works only on the same browser on the same device.

### 3a. Create a Firebase project (if you don't have one)

1. Go to console.firebase.google.com
2. Add project → name it `onestopcareers` → continue
3. Disable Google Analytics (not needed) → Create project

### 3b. Enable Firestore

1. In your Firebase project → Build → Firestore Database
2. Create database → Start in **test mode** (you can lock it down later) → Choose a region (asia-south1 for India) → Done

### 3c. Get your config values

1. Firebase project → Project Settings (gear icon) → General
2. Scroll to "Your apps" → click the `</>` web icon → register app as `onestopcareers-web`
3. You'll see a config block like this:
```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "onestopcareers.firebaseapp.com",
  projectId: "onestopcareers",          // ← this is your project ID
  storageBucket: "onestopcareers.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc123",
  measurementId: "G-XXXXXX"             // optional
};
```

### 3d. Add to Netlify environment variables

Go to Netlify → Site configuration → Environment variables → Add all 7:

| Key | Value |
|---|---|
| `VITE_FIREBASE_API_KEY` | `AIza...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `onestopcareers.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `onestopcareers` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `onestopcareers.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789` |
| `VITE_FIREBASE_APP_ID` | `1:123:web:abc123` |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-XXXXXX` (optional) |

### 3e. Add the project ID to index.html

In `index.html`, inside `<head>`, add one line:

```html
<meta name="firebase-project" content="onestopcareers">
```

(Replace `onestopcareers` with your actual project ID from Step 3c.)

Commit and push:

```bash
git add index.html
git commit -m "chore: add firebase project meta tag"
git push
```

Netlify redeploys automatically.

---

## Step 4 — Set Firestore security rules (5 min)
*Prevents anyone from reading/writing arbitrary data.*

In Firebase console → Firestore Database → Rules, replace the default with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /portfolios/{portfolioId} {
      // Anyone can create a portfolio (needed for anonymous saves)
      allow create: if true;
      // Anyone can read a portfolio (needed for public sharing)
      allow read: if true;
      // Nobody can update or delete (portfolios are immutable once created)
      allow update, delete: if false;
    }
  }
}
```

Click Publish.

---

## Step 5 — Wire up Razorpay (30 min)
*Required to charge ₹499 for Phase 3 unlock.*

Until this is done, the paywall shows a "dev bypass" button only in local dev.
In production it shows the payment button, which will fail with an error message
if clicked — the rest of the site is unaffected.

### 5a. Create a Razorpay account

1. Go to dashboard.razorpay.com → sign up
2. Complete KYC (required to accept live payments)
3. While KYC is pending, use Test Mode keys for staging

### 5b. Get your API keys

Razorpay Dashboard → Settings → API Keys → Generate Test Key (or Live Key)
You'll get a Key ID (`rzp_test_...` or `rzp_live_...`) and Key Secret.

### 5c. Add to Netlify environment variables

| Key | Value |
|---|---|
| `RAZORPAY_KEY_ID` | `rzp_test_...` or `rzp_live_...` |
| `RAZORPAY_KEY_SECRET` | the secret (never put this in frontend code) |

Trigger a Netlify redeploy after adding.

---

## Step 6 — Test end to end (15 min)

Run this checklist locally first with `netlify dev` (not `npm run dev` — you need
the functions to run):

```bash
npm install -g netlify-cli   # if not already installed
netlify dev
```

Then open http://localhost:8888 and verify:

- [ ] Homepage loads, "Start free" goes to `/case-study/swiggy`
- [ ] Case study: gap exercise → context → Phase 1 prediction nodes → Phase 2 SQL workbench
- [ ] Phase 2: Arjun's evaluation shows real text (not "Good work on this step")
- [ ] Paywall: Phase 3 dev bypass works in dev mode
- [ ] Debrief: portfolio URL generates, page at `/portfolio/:id` shows your work
- [ ] Jobs page: loads listings, completion banner shows after finishing case study
- [ ] Portfolio page at the URL shows your content

---

## Summary — what each thing unlocks

| Step | Time | Unlocks |
|---|---|---|
| 1. Deploy code | 5 min | Everything works, mock feedback |
| 2. Anthropic key | 2 min | Live Arjun evaluations |
| 3. Firebase | 20 min | Cross-device shareable portfolio links |
| 4. Firestore rules | 5 min | Security (do alongside step 3) |
| 5. Razorpay | 30 min | Paid Phase 3 unlock (₹499) |
| 6. E2E test | 15 min | Confidence before sharing |

**Total: ~75 min to fully live.**

You can deploy after Step 1 and add the rest incrementally without taking the site down.
