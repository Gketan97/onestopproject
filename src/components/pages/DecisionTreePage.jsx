// =================================================================
// FILE (UPDATE): src/components/pages/DecisionTreePage.jsx
// PURPOSE: Use Link component for navigation.
// =================================================================
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { decisionTree } from '../../data/appData';

const DecisionTreePage = () => {
  // ... (state and logic - no changes) ...

  if (!currentQuestion) {
     return (
        <div className="min-h-screen dark-theme-bg flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-white text-3xl font-bold mb-4">Thank you for your responses!</h2>
            <p className="text-gray-400 mb-8">Your personalized career roadmap is being generated.</p>
            <Link
                to="/"
                className="px-8 py-4 brand-button font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50"
            >
                Return to Home
            </Link>
        </div>
    );
  }

  return (
    // ... (rest of the component - no changes) ...
  );
};

export default DecisionTreePage;
