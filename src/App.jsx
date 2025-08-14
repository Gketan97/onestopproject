// =================================================================
// FILE (UPDATE): src/App.jsx
// PURPOSE: To add the new JobsPage to the app's routing.
// =================================================================
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

import HomePage from './components/pages/HomePage.jsx';
import DecisionTreePage from './components/pages/DecisionTreePage.jsx';
import JobsPage from './components/pages/JobsPage.jsx'; // Import the new JobsPage
import Header from './components/layout/Header.jsx';
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
const firebaseServices = {
  db: getFirestore(app),
  auth: getAuth(app)
};

class ErrorBoundary extends React.Component { /* ... (no changes) ... */ }

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  // ... other state variables (no changes) ...

  // ... useEffect hooks (no changes) ...

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'decisionTree':
        return <DecisionTreePage setCurrentPage={setCurrentPage} />;
      case 'jobs':
        return <JobsPage />; // Add the jobs page case
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen dark-theme-bg font-sans antialiased dark-theme-text flex flex-col relative pb-16 md:pb-0">
        {/* ... styles and particles (no changes) ... */}
        <Header userId={null} setCurrentPage={setCurrentPage} />
        <MobileNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
        
        {/* Main content area now uses a function to render the correct page */}
        <main className="flex-grow">
          {renderCurrentPage()}
        </main>
        
        <footer className="w-full max-w-7xl mx-auto p-4 text-center text-sm text-gray-500 border-t mt-12 md:mt-24 dark-theme-border z-10">
          <p>&copy; 2025 onestopcareers. All rights reserved.</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default App;
