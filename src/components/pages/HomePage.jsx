/ =================================================================
// FILE (UPDATE): src/components/pages/HomePage.jsx
// PURPOSE: Use Link component for navigation.
// =================================================================
import React from 'react';
import { Link } from 'react-router-dom';
import { stages, testimonials, whyItWorks } from '../../data/appData';

const HomePage = () => {
  return (
    <main className="w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col items-center flex-grow z-10">
      {/* ... (Hero section - change button to Link) ... */}
      <div className="mt-8 md:mt-12">
        <Link to="/decision-tree" className="px-8 py-4 brand-button font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50">
          Start Your Journey
        </Link>
      </div>
      {/* ... (How It Works section - change cards to Link) ... */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stages.map((stage, index) => (
          <Link
            key={index}
            to="/decision-tree"
            className="group text-left dark-theme-card-bg p-6 rounded-xl dark-theme-border border-2 transition-all duration-300 ease-in-out hover:dark-theme-card-hover focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {/* ... (card content) ... */}
          </Link>
        ))}
      </div>
      {/* ... (Other sections - no changes) ... */}
    </main>
  );
};

export default HomePage;
