// =================================================================
// FILE (UPDATE): src/App.jsx
// PURPOSE: To add the new MobileHeader component.
// =================================================================
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

import HomePage from './components/pages/HomePage.jsx';
import DecisionTreePage from './components/pages/DecisionTreePage.jsx';
import JobsPage from './components/pages/JobsPage.jsx';
import Header from './components/layout/Header.jsx';
import MobileHeader from './components/layout/MobileHeader.jsx';
import MobileNav from './components/layout/MobileNav.jsx';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const App = () => {
  const [userId, setUserId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        signInAnonymously(auth).catch(error => console.error("Anonymous sign-in failed:", error));
      }
    });
    return () => unsubscribe();
  }, []);

  // Show mobile header on pages other than the Jobs page
  const showMobileHeader = location.pathname !== '/jobs';

  return (
    <div className="min-h-screen bg-[#1a1a1a] font-sans text-[#e0e0e0] flex flex-col relative pb-16 md:pb-0">
      <Header />
      {showMobileHeader && <MobileHeader />}
      <MobileNav />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/decision-tree" element={<DecisionTreePage />} />
          <Route path="/jobs" element={<JobsPage />} />
        </Routes>
      </main>
      <footer className="w-full max-w-7xl mx-auto p-4 text-center text-sm text-gray-500 border-t border-[#444] mt-12 md:mt-24 z-10">
        <p>&copy; 2025 onestopcareers. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
