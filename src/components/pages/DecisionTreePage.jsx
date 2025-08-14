// =================================================================
// FILE (UPDATE): src/components/pages/DecisionTreePage.jsx
// PURPOSE: Use Link component for navigation and restore full component logic.
// =================================================================
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { decisionTree } from '../../data/appData';

const DecisionTreePage = () => {
  const [currentQuestionId, setCurrentQuestionId] = useState('start');
  const decisionTreeData = decisionTree['stage1'];

  const currentQuestion = decisionTreeData.find(q => q.id === currentQuestionId);

  const handleOptionClick = (nextId) => {
    if (nextId) {
      setCurrentQuestionId(nextId);
    } else {
      setCurrentQuestionId('results');
    }
  };

  if (currentQuestionId === 'results' || !currentQuestion) {
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
    <div className="min-h-screen dark-theme-bg font-sans antialiased dark-theme-text flex flex-col items-center justify-center p-4">
      <div className="bg-black/70 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-lg text-center">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
          {currentQuestion.question}
        </h2>
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option.nextQuestionId)}
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

export default DecisionTreePage;
