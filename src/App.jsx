import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
<<<<<<< Updated upstream
import { getFirestore } from 'firebase/firestore';

import HomePage from './components/pages/HomePage.jsx';
import DecisionTreePage from './components/pages/DecisionTreePage.jsx';
import JobsPage from './components/pages/JobsPage.jsx';
import ReferrerForm from './components/pages/ReferrerForm.jsx';
import ResourcesPage from './components/pages/ResourcesPage.jsx';
import MentorsPage from './components/pages/MentorsPage.jsx';
import Header from './components/layout/Header.jsx';
import MobileHeader from './components/layout/MobileHeader.jsx';
import MobileNav from './components/layout/MobileNav.jsx';
=======

import HomePage       from './components/pages/HomePage.jsx';
import JobsPage       from './components/pages/JobsPage.jsx';
import ReferrerForm   from './components/pages/ReferrerForm.jsx';
import PortfolioPage  from './components/portfolio/PortfolioPage.jsx';
import Header         from './components/layout/Header.jsx';
import MobileHeader   from './components/layout/MobileHeader.jsx';
import MobileNav      from './components/layout/MobileNav.jsx';
>>>>>>> Stashed changes

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

<<<<<<< Updated upstream
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const App = () => {
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        signInAnonymously(auth).catch(err => console.error('Sign-in failed:', err));
      }
=======
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

const App = () => {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) signInAnonymously(auth).catch(console.error);
>>>>>>> Stashed changes
    });
    return unsub;
  }, []);

<<<<<<< Updated upstream
  const isJobsPage = location.pathname === '/jobs';

=======
>>>>>>> Stashed changes
  return (
    <div className="min-h-screen bg-bg font-sans text-ink flex flex-col relative pb-16 md:pb-0">
      <Header />
      <MobileHeader />
      <MobileNav />

      <main className="flex-grow">
        <Routes>
<<<<<<< Updated upstream
          <Route path="/" element={<HomePage />} />
          <Route path="/decision-tree" element={<DecisionTreePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/become-referrer" element={<ReferrerForm />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/mentors" element={<MentorsPage />} />
        </Routes>
      </main>
      <footer className="w-full max-w-7xl mx-auto px-4 py-6 text-center border-t border-border mt-12 md:mt-24 z-10">
        <p className="font-serif text-lg text-ink mb-1">one<em className="text-accent not-italic">stop</em>careers</p>
=======
          <Route path="/"                    element={<HomePage />} />
          <Route path="/jobs"                element={<JobsPage />} />
          <Route path="/become-referrer"     element={<ReferrerForm />} />
          <Route path="/portfolio/:portfolioId" element={<PortfolioPage />} />
          {/* Legacy routes - redirect behaviour handled by Netlify */}
        </Routes>
      </main>

      <footer className="w-full max-w-7xl mx-auto px-4 py-6 text-center border-t border-border mt-12 md:mt-24 z-10">
        <p className="font-serif text-lg text-ink mb-1">
          one<em className="text-accent not-italic">stop</em>careers
        </p>
>>>>>>> Stashed changes
        <p className="text-xs text-ink3">&copy; 2025 onestopcareers. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
