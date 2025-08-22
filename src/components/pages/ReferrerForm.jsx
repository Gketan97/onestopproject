import React from "react";
import { useNavigate } from "react-router-dom";

const BecomeReferrerPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gray-900 text-white px-4 md:px-12 py-6">
      {/* Desktop Go Back (Top-left) */}
      <button
        onClick={() => navigate(-1)}
        className="hidden md:flex items-center gap-2 absolute top-6 left-6 text-gray-300 hover:text-orange-500 transition text-sm font-medium"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Go Back
      </button>

      {/* Mobile Sticky Go Back */}
      <button
        onClick={() => navigate(-1)}
        className="fixed bottom-4 left-4 md:hidden flex items-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-full shadow-lg transition-all z-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>

      {/* Page Header */}
      <div className="text-center mt-10 md:mt-0">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Become a Referrer
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          Join our referral program and help great talent find amazing jobs!
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-3xl mx-auto mt-8 md:mt-12 bg-gray-800 p-6 md:p-10 rounded-2xl shadow-lg">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">
          Why Become a Referrer?
        </h2>
        <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
          <li>Help others land their dream jobs</li>
          <li>Earn rewards for successful referrals</li>
          <li>Expand your professional network</li>
        </ul>

        <h3 className="text-lg font-semibold mb-2">How It Works:</h3>
        <p className="text-gray-400 mb-6">
          Share open positions with your network. If someone gets hired through
          your referral, you earn exciting benefits and recognition.
        </p>

        {/* Call to Action */}
        <div className="text-center">
          <a
            href="/apply-as-referrer"
            className="inline-block w-full md:w-auto px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-all"
          >
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default BecomeReferrerPage;
