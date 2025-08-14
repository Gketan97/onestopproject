// =================================================================
// FILE (UPDATE): src/App.jsx
// PURPOSE: Remove state-based navigation and use React Router for page rendering.
// =================================================================
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

import HomePage from './components/pages/HomePage.jsx';
import DecisionTreePage from './components/pages/DecisionTreePage.jsx';
import JobsPage from './components/pages/JobsPage.jsx';
import Header from './components/layout/Header.jsx';
import MobileNav from './components/layout/MobileNav.jsx';

// ... (Firebase config and initialization - no changes)

class ErrorBoundary extends React.Component { /* ... (no changes) ... */ }

const App = () => {
  // ... (auth and userProfile state - no changes)
  // REMOVED: const [currentPage, setCurrentPage] = useState('home');

  // ... (useEffect hooks for auth and firestore - no changes) ...

  const darkThemeStyles = `
    /* ... (styles - no changes) ... */
  `;

  return (
    <ErrorBoundary>
      <div className="min-h-screen dark-theme-bg font-sans antialiased dark-theme-text flex flex-col relative pb-16 md:pb-0">
        <style>{darkThemeStyles}</style>
        {/* ... (particle container - no changes) ... */}
        
        <Header />
        <MobileNav />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/decision-tree" element={<DecisionTreePage />} />
            <Route path="/jobs" element={<JobsPage />} />
            {/* Add routes for other pages like /resources, /mentors here */}
          </Routes>
        </main>
        
        <footer className="w-full max-w-7xl mx-auto p-4 text-center text-sm text-gray-500 border-t mt-12 md:mt-24 dark-theme-border z-10">
          <p>&copy; 2025 onestopcareers. All rights reserved.</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default App;
