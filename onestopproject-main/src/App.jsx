import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';

import HomePage        from './components/pages/HomePage.jsx';
import JobsPage        from './components/pages/JobsPage.jsx';
import CaseStudyPage   from './components/pages/CaseStudyPage.jsx';
import CaseStudiesPage from './components/pages/CaseStudiesPage.jsx';
import ReferrerForm    from './components/pages/ReferrerForm.jsx';
import PortfolioPage   from './components/portfolio/PortfolioPage.jsx';
import Header          from './components/layout/Header.jsx';
import MobileHeader    from './components/layout/MobileHeader.jsx';
import MobileNav       from './components/layout/MobileNav.jsx';

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

const FULL_SCREEN_ROUTES = ['/case-study/'];

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
        <Routes>
          <Route path="/"                       element={<HomePage />} />
          <Route path="/case-studies"           element={<CaseStudiesPage />} />
          <Route path="/jobs"                   element={<JobsPage />} />
          <Route path="/case-study/:caseId"     element={<CaseStudyPage />} />
          <Route path="/become-referrer"        element={<ReferrerForm />} />
          <Route path="/portfolio/:portfolioId" element={<PortfolioPage />} />
        </Routes>
      </main>

      {!isFullScreen && (
        <footer className="w-full max-w-7xl mx-auto px-4 py-6 text-center border-t border-border mt-12 md:mt-24 z-10">
          <p className="font-serif text-lg text-ink mb-1">
            one<em className="text-accent not-italic">stop</em>careers
          </p>
          <p className="text-xs text-ink3">&copy; 2025 onestopcareers. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
};

export default App;
