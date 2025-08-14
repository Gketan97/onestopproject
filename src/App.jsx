import React, { useState } from 'react';
import { decisionTree } from '../../data/appData.js';

const DecisionTreePage = ({ setCurrentPage }) => {
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const currentStage = 'stage1'; 

  const questions = decisionTree[currentStage];
  const currentQuestion = currentQuestionId 
    ? questions.find(q => q.id === currentQuestionId)
    : questions[0];

  const handleAnswer = (nextQuestionId) => {
    if (nextQuestionId) {
      setCurrentQuestionId(nextQuestionId);
    } else {
      setCurrentPage('results');
    }
  };

  if (!currentQuestion) {
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

export default DecisionTreePage;
