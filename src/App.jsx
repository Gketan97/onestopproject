import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, onSnapshot } from 'firebase/firestore';

// Initialize Firebase with global variables provided by the environment
const initializeFirebase = () => {
  console.log('DEBUG: Attempting to initialize Firebase...');
  try {
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};

    if (Object.keys(firebaseConfig).length > 0) {
      const app = initializeApp(firebaseConfig, appId);
      console.log('DEBUG: Firebase app initialized successfully.');
      return {
        db: getFirestore(app),
        auth: getAuth(app),
      };
    }
  } catch (e) {
    console.error("DEBUG: Firebase initialization failed with an error.", e);
  }
  console.log('DEBUG: Firebase services are null or config is empty.');
  return { db: null, auth: null };
};

const firebaseServices = initializeFirebase();

const MobileNav = ({ currentPage, setCurrentPage }) => {
  console.log('DEBUG: MobileNav is rendering.');
  const navItems = [
    { name: "Home", icon: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
    { name: "Jobs", icon: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 11V7a4 4 0 0 0-8 0v4"/><rect x="5" y="9" width="14" height="14" rx="2" ry="2"/></svg> },
    { name: "Resources", icon: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> },
    { name: "Mentors", icon: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-gray-800 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setCurrentPage(item.name.toLowerCase())}
            className={`flex flex-col items-center justify-center p-2 text-xs font-bold transition-colors duration-300 ${currentPage === item.name.toLowerCase() ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}
          >
            <item.icon size="1.2rem" />
            <span className="mt-1">{item.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

// Header component for desktop view
const Header = ({ userId }) => {
  console.log('DEBUG: Header is rendering.');
  return (
    <header className="bg-black/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="#27272A"/>
            <defs>
              <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#F97316',stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#FB923C',stopOpacity:1}} />
              </linearGradient>
            </defs>
            <path d="M9 20C9 17.5 10 15.5 12.5 14C15 12.5 16 15 16 16.5C16 18 14 19 13 21C12 23 14 25 16.5 25.5" stroke="#666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.5 25.5C19 26 22 24 24 22L31 15" stroke="url(#brandGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M26 15L31 15L31 20" stroke="url(#brandGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-2xl font-extrabold text-white">
            <span className="font-bold">OneStop</span><span className="font-medium text-gray-300">Careers</span>
          </span>
        </a>

        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex items-center space-x-8">
            <a href="#" className="nav-link text-gray-300 hover:text-white font-bold transition-colors">Home</a>
            <a href="#" className="nav-link text-gray-300 hover:text-white font-bold transition-colors">Find Jobs</a>
            <a href="#" className="nav-link text-gray-300 hover:text-white font-bold transition-colors">Resources</a>
            <a href="#" className="nav-link text-gray-300 hover:text-white font-bold transition-colors">Mentors</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

// Data structure for the decision tree questions
const decisionTree = {
  stage1: [
    {
      question: "What's your primary career motivation?",
      options: [
        { text: "Building something new and innovative.", nextQuestionId: "q1_a1" },
        { text: "Solving complex problems and helping others.", nextQuestionId: "q1_a2" },
        { text: "Leading teams and shaping strategy.", nextQuestionId: "q1_a3" },
        { text: "Financial stability and growth.", nextQuestionId: "q1_a4" },
      ],
      insight: "Understanding your core motivation helps us filter for roles that will truly energize you. Some people are driven by creation, others by impact, and a few by leadership or security.",
    },
    // Nested questions based on the first answer
    {
      id: "q1_a1",
      question: "Great. Do you prefer working with code or visual design?",
      options: [
        { text: "I love coding and building the technical foundation.", nextQuestionId: "q2_a1" },
        { text: "I prefer visual design and user experience.", nextQuestionId: "q2_a2" },
      ],
      insight: "This choice helps us narrow down creative roles to either technical or artistic paths, ensuring the next questions are highly relevant.",
    },
    {
      id: "q1_a2",
      question: "Understood. Is your strength in data analysis or human-to-human interaction?",
      options: [
        { text: "I enjoy analyzing data to find insights.", nextQuestionId: "q2_a3" },
        { text: "I'm best at communicating and working with people.", nextQuestionId: "q2_a4" },
      ],
      insight: "Impact can be measured in many ways. This helps us distinguish between a more analytical, data-driven approach versus a social, people-centric one.",
    },
    {
      id: "q1_a3",
      question: "Excellent. Is your leadership style more focused on people or product direction?",
      options: [
        { text: "I enjoy mentoring and developing team members.", nextQuestionId: "q2_a5" },
        { text: "I'm passionate about defining the product vision.", nextQuestionId: "q2_a6" },
      ],
      insight: "Leadership roles can vary widely. We are pinpointing whether you thrive as a people manager or as a strategic visionary.",
    },
    {
      id: "q1_a4",
      question: "Noted. Are you looking for roles with high growth potential or a stable, reliable path?",
      options: [
        { text: "I want a path with high earning potential and upward mobility.", nextQuestionId: "q2_a7" },
        { text: "I prefer a stable career with good benefits and work-life balance.", nextQuestionId: "q2_a8" },
      ],
      insight: "This helps us understand your priorities regarding career pace and stability, guiding us toward either high-risk, high-reward roles or more established, secure options.",
    },
    // More question layers to be added here.
  ],
};

const DecisionTreePage = ({ setCurrentPage }) => {
  console.log('DEBUG: DecisionTreePage is rendering.');
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const currentStage = 'stage1'; 

  const questions = decisionTree[currentStage];
  const currentQuestion = currentQuestionId 
    ? questions.find(q => q.id === currentQuestionId)
    : questions[0];

  const handleAnswer = (nextQuestionId) => {
    console.log('DEBUG: User answered. Next question ID:', nextQuestionId);
    if (nextQuestionId) {
      setCurrentQuestionId(nextQuestionId);
    } else {
      console.log('DEBUG: End of decision tree. Navigating to results page.');
      setCurrentPage('results');
    }
  };

  if (!currentQuestion) {
    console.log('DEBUG: No current question found. Displaying result loading message.');
    return (
      <div className="min-h-screen dark-theme-bg flex items-center justify-center">
        <p className="text-white text-2xl font-bold">Thank you for your responses! Generating your results...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark-theme-bg font-sans antialiased dark-theme-text flex flex-col items-center justify-center p-4">
      <div className="bg-black/70 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-lg text-center">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
          {currentQuestion.question}
        </h2>
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option.nextQuestionId)}
              className="w-full px-6 py-4 dark-theme-card-bg text-white rounded-lg dark-theme-border border-2 transition-all duration-300 ease-in-out hover:dark-theme-card-hover hover:scale-105"
            >
              {option.text}
            </button>
          ))}
        </div>
        <p className="mt-6 text-gray-500 text-sm italic">
          {currentQuestion.insight}
        </p>
      </div>
    </div>
  );
};

// Mock testimonials
const testimonials = [
  {
    quote: "Before onestopcareers, I was lost. The decision tree gave me the clarity I needed to pivot my career and find a path I'm truly passionate about. It's a game-changer!",
    name: "Jane D.",
    role: "Marketing Manager"
  },
  {
    quote: "The personalized roadmap helped me identify my skill gaps and find the right courses. I felt so much more confident in my job hunt.",
    name: "Alex P.",
    role: "Software Engineer"
  },
  {
    quote: "I've tried other platforms, but the integrated approach of onestopcareers is what made the difference. It connected my interests directly to jobs and mentors.",
    name: "Sam R.",
    role: "Recent Graduate"
  }
];

const stages = [
  {
    title: 'Stage 1: Exploration',
    description: 'Discover your strengths, passions, and potential career paths with our guided decision tree.',
    icon: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6a6 6 0 0 0-6-6v6H6a6 6 0 0 0 0 12h12a6 6 0 0 0 0-12h-6"/></svg>
    ),
  },
  {
    title: 'Stage 2: Upskilling',
    description: 'Identify skill gaps and find the best courses and resources to advance your knowledge.',
    icon: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 19V5M5 12h14"/></svg>
    ),
  },
  {
    title: 'Stage 3: Interview Readiness',
    description: 'Prepare for interviews with practice questions, tips, and expert advice.',
    icon: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2zm0-4h2V7h-2z"/></svg>
    ),
  },
  {
    title: 'Stage 4: Job Hunt',
    description: 'Access curated job listings, referral programs, and connect with a mentor for guidance.',
    icon: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 11V7a4 4 0 0 0-8 0v4"/><rect x="5" y="9" width="14" height="14" rx="2" ry="2"/></svg>
    ),
  }
];

const HomePage = ({ setCurrentPage }) => {
  console.log('DEBUG: HomePage is rendering.');
  const handleStartJourney = () => {
    console.log('DEBUG: Start Your Journey button clicked. Setting currentPage to "decisionTree".');
    setCurrentPage('decisionTree');
  };

  return (
    <main className="w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col items-center flex-grow z-10">
      <section className="text-center py-16 md:py-24 max-w-4xl">
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-white drop-shadow-lg">
          <span className="gradient-text">Your Career Struggle</span>
          <br />
          Ends Here.
        </h2>
        <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto opacity-80">
          A trusted platform to guide your professional journey with clarity, not confusion.
        </p>
        <div className="mt-8 md:mt-12">
          <button
            onClick={handleStartJourney}
            className="px-8 py-4 brand-button font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50"
          >
            Start Your Journey
          </button>
        </div>
      </section>

      <section className="mt-12 md:mt-16 w-full">
        <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 md:mb-12 dark-theme-text">
          How It Works
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages.map((stage, index) => (
            <div
              key={index}
              className="dark-theme-card-bg p-6 rounded-xl dark-theme-border border-2 transition-all duration-300 ease-in-out hover:dark-theme-card-hover"
            >
              <div className="flex items-center mb-4 space-x-4">
                <div className="p-3 rounded-full bg-white text-black shadow-lg">
                  <stage.icon size="1.5rem" />
                </div>
                <h4 className="text-xl font-bold text-white">{stage.title}</h4>
              </div>
              <p className="text-gray-400">{stage.description}</p>
              <button
                onClick={() => console.log(`DEBUG: Navigating to ${stage.title}`)}
                className="mt-4 text-gray-200 font-semibold text-sm hover:text-white transition duration-300"
              >
                Learn More &rarr;
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 md:mt-16 w-full text-center max-w-4xl">
        <h3 className="text-2xl sm:text-3xl font-bold mb-8 dark-theme-text">
          Why This Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="flex flex-col items-start p-6 rounded-xl dark-theme-card-bg dark-theme-border border-2 shadow-lg">
            <h4 className="text-xl font-bold text-white mb-2">Personalized Pathways</h4>
            <p className="text-gray-400">
              Our dynamic decision tree system tailors every question to your unique responses, creating a career path that's truly your own. No more one-size-fits-all advice.
            </p>
          </div>
          <div className="flex flex-col items-start p-6 rounded-xl dark-theme-card-bg dark-theme-border border-2 shadow-lg">
            <h4 className="text-xl font-bold text-white mb-2">Data-Driven Clarity</h4>
            <p className="text-gray-400">
              We transform your qualitative insights into actionable, data-backed career recommendations, giving you confidence in your next move.
            </p>
          </div>
          <div className="flex flex-col items-start p-6 rounded-xl dark-theme-card-bg dark-theme-border border-2 shadow-lg">
            <h4 className="text-xl font-bold text-white mb-2">Integrated Ecosystem</h4>
            <p className="text-gray-400">
              We don't just give you a result; we connect you to the next steps—from curated jobs and resources to 1:1 mentorship opportunities.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mt-12 md:mt-16 w-full text-center max-w-4xl">
        <h3 className="text-2xl sm:text-3xl font-bold mb-8 dark-theme-text">
          What Our Users Say
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="dark-theme-card-bg p-6 rounded-xl dark-theme-border border-2 shadow-lg">
              <p className="text-gray-400 mb-4 italic">"{testimonial.quote}"</p>
              <div className="text-center">
                <p className="text-white font-bold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};


// The main App component for our website
const App = () => {
  console.log('DEBUG: App component is rendering.');
  const [authReady, setAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    console.log('DEBUG: Running authentication effect.');
    if (!firebaseServices.auth) {
      console.warn("DEBUG: Firebase Auth is not available. Running in local mode.");
      setAuthReady(true);
      return;
    }

    const authenticate = async () => {
      try {
        const token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
        if (token) {
          await signInWithCustomToken(firebaseServices.auth, token);
          console.log("DEBUG: Signed in with custom token.");
        } else {
          await signInAnonymously(firebaseServices.auth);
          console.log("DEBUG: Signed in anonymously.");
        }
      } catch (error) {
        console.error("DEBUG: Firebase authentication failed:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(firebaseServices.auth, (user) => {
      console.log('DEBUG: Auth state changed. User:', user ? user.uid : 'none');
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
      setAuthReady(true);
    });

    authenticate();
    return () => {
      console.log('DEBUG: Unsubscribing from auth state changes.');
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log('DEBUG: Running Firestore effect. userId:', userId);
    if (!userId || !firebaseServices.db) return;

    const userProfileRef = doc(firebaseServices.db, 'artifacts', typeof __app_id !== 'undefined' ? __app_id : 'default-app-id', 'users', userId, 'user_data', 'profile');

    try {
      const unsubscribe = onSnapshot(userProfileRef, (docSnap) => {
        console.log('DEBUG: Firestore snapshot received.');
        if (docSnap.exists()) {
          console.log('DEBUG: User profile exists.', docSnap.data());
          setUserProfile(docSnap.data());
        } else {
          console.log('DEBUG: User profile does not exist. Creating new profile.');
          setDoc(userProfileRef, { createdAt: new Date() }).catch(error => {
            console.error("DEBUG: Error creating user profile:", error);
          });
        }
      }, (error) => {
        console.error("DEBUG: Error listening to user profile:", error);
      });
      return () => {
        console.log('DEBUG: Unsubscribing from Firestore listener.');
        unsubscribe();
      };
    } catch (error) {
      console.error("DEBUG: Error setting up Firestore listener:", error);
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
    <div className="min-h-screen dark-theme-bg font-sans antialiased dark-theme-text flex flex-col relative pb-16 md:pb-0">
      <style>{darkThemeStyles}</style>

      {/* Debug Panel at the top */}
      <div className="fixed top-0 left-0 right-0 bg-red-800 text-white p-2 text-xs z-[100] flex justify-between">
        <span>DEBUG: authReady={String(authReady)} | userId={userId || 'null'} | currentPage={currentPage}</span>
      </div>

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
  );
};

export default App;
