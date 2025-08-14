import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

import HomePage from './components/pages/HomePage.jsx';
import DecisionTreePage from './components/pages/DecisionTreePage.jsx';
import Header from './components/layout/Header.jsx';
import MobileNav from './components/layout/MobileNav.jsx';

import { stages } from './data/appData.jsx';

// ----- THIS IS THE UPDATED SECTION -----
// Build the Firebase config from Netlify's environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase using the config object
const app = initializeApp(firebaseConfig);
const firebaseServices = {
  db: getFirestore(app),
  auth: getAuth(app)
};
// ----- END OF UPDATED SECTION -----


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error: ", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-900 text-white flex items-center justify-center p-4">
          <h1 className="text-2xl font-bold text-center">Something went wrong. Please refresh the page.</h1>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  const [authReady, setAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    if (!firebaseServices.auth) {
      setAuthReady(true);
      return;
    }
    const authenticate = async () => {
      try {
        const token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
        if (token) {
          await signInWithCustomToken(firebaseServices.auth, token);
        } else {
          await signInAnonymously(firebaseServices.auth);
        }
      } catch (error) {
        console.error("Firebase authentication failed:", error);
      }
    };
    const unsubscribe = onAuthStateChanged(firebaseServices.auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
      setAuthReady(true);
    });
    authenticate();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId || !firebaseServices.db) return;
    const userProfileRef = doc(firebaseServices.db, 'artifacts', typeof __app_id !== 'undefined' ? __app_id : 'default-app-id', 'users', userId, 'user_data', 'profile');
    try {
      const unsubscribe = onSnapshot(userProfileRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        } else {
          setDoc(userProfileRef, { createdAt: new Date() }).catch(error => {
            console.error("Error creating user profile:", error);
          });
        }
      }, (error) => {
        console.error("Error listening to user profile:", error);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up Firestore listener:", error);
    }
  }, [userId]);

  const darkThemeStyles = `
    .dark-theme-bg { background-color: #1a1a1a; }
    .dark-theme-text { color: #e0e0e0; }
    .dark-theme-border { border-color: #444; }
    .dark-theme-card-bg { background-color: #2a2a2a; }
    .dark-theme-card-hover {
      box-shadow: 0 8px 16px rgba(0,0,0,0.3);
      transform: translateY(-4px);
    }
    .brand-button {
      background-color: #ffffff;
      color: #1a1a1a;
      transition: background-color 0.3s ease, transform 0.3s ease;
    }
    .brand-button:hover {
      background-color: #f0f0f0;
      transform: translateY(-2px);
    }
    .gradient-text {
      background: linear-gradient(90deg, #ff7e5f, #feb47b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap');
    body { font-family: 'Roboto Mono', monospace; }
    .particle-container {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      overflow: hidden; z-index: 0; pointer-events: none;
    }
    .particle {
      position: absolute; background: rgba(255, 255, 255, 0.1);
      border-radius: 50%; animation: moveParticles 25s infinite ease-in-out;
      filter: blur(2px);
    }
    @keyframes moveParticles {
      0% { transform: translateY(0) scale(1); opacity: 0; }
      50% { opacity: 1; }
      100% { transform: translateY(-100vh) scale(1.5); opacity: 0; }
    }
  `;

  return (
    <ErrorBoundary>
      <div className="min-h-screen dark-theme-bg font-sans antialiased dark-theme-text flex flex-col relative pb-16 md:pb-0">
        <style>{darkThemeStyles}</style>
        <div className="particle-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}vw`,
                top: `${Math.random() * 100}vh`,
                width: `${Math.random() * 5 + 2}px`,
                height: `${Math.random() * 5 + 2}px`,
                animationDuration: `${Math.random() * 15 + 10}s`,
                animationDelay: `${Math.random() * -20}s`,
              }}
            ></div>
          ))}
        </div>
        <Header userId={userId} />
        <MobileNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
        {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} />}
        {currentPage === 'decisionTree' && <DecisionTreePage setCurrentPage={setCurrentPage} />}
        <footer className="w-full max-w-7xl mx-auto p-4 text-center text-sm text-gray-500 border-t mt-12 md:mt-24 dark-theme-border z-10">
          <p>&copy; 2025 onestopcareers. All rights reserved.</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default App;
