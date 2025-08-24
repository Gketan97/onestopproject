// Header.jsx
import React from "react";
import { Link } from "react-router-dom";

// --- Logo Component ---
const Logo = ({ size = 40 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="50"
      cy="50"
      r="40"
      stroke="white"
      strokeWidth="8"
      strokeOpacity="0.3"
    />
    <path
      d="M50 70 L 50 30"
      stroke="#F97316"
      strokeWidth="8"
      strokeLinecap="round"
    />
    <path
      d="M35 45 L 50 30 L 65 45"
      stroke="#F97316"
      strokeWidth="8"
      strokeLinecap="round"
    />
  </svg>
);
// --- End of Logo ---

// Desktop Header
export const Header = () => {
  return (
    <header className="bg-black/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Logo size={40} />
          <span className="text-2xl font-extrabold text-white">
            <span className="font-bold">OneStop</span>
            <span className="font-medium text-gray-300">Careers</span>
          </span>
        </Link>
        <nav className="flex items-center space-x-8">
          <Link
            to="/"
            className="nav-link text-gray-300 hover:text-white font-bold transition-colors"
          >
            Home
          </Link>
          <Link
            to="/jobs"
            className="nav-link text-gray-300 hover:text-white font-bold transition-colors"
          >
            Find Jobs
          </Link>
          <Link
            to="/resources"
            className="nav-link text-gray-300 hover:text-white font-bold transition-colors"
          >
            Resources
          </Link>
          <Link
            to="/mentors"
            className="nav-link text-gray-300 hover:text-white font-bold transition-colors"
          >
            Mentors
          </Link>
        </nav>
      </div>
    </header>
  );
};
