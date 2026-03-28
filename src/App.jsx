import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';

// Critical path — loaded immediately
import HomePage        from './components/pages/HomePage.jsx';
import CaseStudyPage   from './components/pages/CaseStudyPage.jsx';
import Header          from './components/layout/Header.jsx';
import MobileHeader    from './components/layout/MobileHeader.jsx';
import MobileNav       from './components/layout/MobileNav.jsx';

// Non-critical — lazy loaded
const JobsPage        = lazy(() => import('./components/pages/JobsPage.jsx'));
const CaseStudiesPage = lazy(() => import('./components/pages/CaseStudiesPage.jsx'));
const ReferrerForm    = lazy(() => import('./components/pages/ReferrerForm.jsx'));
const PortfolioPage   = lazy(() => import('./components/portfolio/PortfolioPage.jsx'));
const StrategyCase    = lazy(() => import('./components/strategy/StrategyCase.jsx'));

// Minimal fallback while lazy chunks load
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex gap-1.5">
        {[0,1,2].map(i => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-ink3 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
}

const firebaseApiKey = import.meta.env.VITE_FIREBASE_API_KEY;

let auth = null;

if (firebaseApiKey && !getApps().length) {
  try {
    const app = initializeApp({
      apiKey:            firebaseApiKey,
      authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId:             import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    });
    auth = getAuth(app);
  } catch (err) {
    console.warn('Firebase init failed — portfolio saves will use localStorage fallback.', err.message);
  }
}

const FULL_SCREEN_ROUTES = ['/case-study/', '/strategy/'];

const App = () => {
  const location  = useLocation();
  const isFullScreen = FULL_SCREEN_ROUTES.some(r => location.pathname.startsWith(r));

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) signInAnonymously(auth).catch(() => {});
    });
    return unsub;
  }, []);

  return (
    <div className={`min-h-screen bg-bg font-sans text-ink flex flex-col relative ${isFullScreen ? '' : 'pb-16 md:pb-0'}`}>
      {!isFullScreen && <Header />}
      {!isFullScreen && <MobileHeader />}
      {!isFullScreen && <MobileNav />}

      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"                       element={<HomePage />} />
            <Route path="/case-studies"           element={<CaseStudiesPage />} />
            <Route path="/jobs"                   element={<JobsPage />} />
            <Route path="/case-study/:caseId"     element={<CaseStudyPage />} />
            <Route path="/strategy/:caseId"       element={<StrategyCase />} />
            <Route path="/become-referrer"        element={<ReferrerForm />} />
            <Route path="/portfolio/:portfolioId" element={<PortfolioPage />} />
          </Routes>
        </Suspense>
      </main>

      {!isFullScreen && (
        <footer className="w-full max-w-7xl mx-auto px-4 py-6 text-center border-t border-border mt-12 md:mt-24 z-10">
          <p className="text-base font-semibold text-ink mb-1" style={{ letterSpacing: '-0.01em' }}>
            one<em className="text-accent not-italic">stop</em>careers
          </p>
          <p className="text-xs text-ink3">&copy; 2026 onestopcareers. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
};

export default App;
