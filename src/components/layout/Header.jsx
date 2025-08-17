import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-black/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="12" fill="#18181B"/>
            <circle cx="20" cy="20" r="12" stroke="#F97316" strokeOpacity="0.3" strokeWidth="3"/>
            <circle cx="20" cy="20" r="5" fill="#F97316"/>
          </svg>
          <span className="text-2xl font-extrabold text-white">
            <span className="font-bold">OneStop</span><span className="font-medium text-gray-300">Careers</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex items-center space-x-8">
            <Link to="/" className="nav-link text-gray-300 hover:text-white font-bold transition-colors">Home</Link>
            <Link to="/jobs" className="nav-link text-gray-300 hover:text-white font-bold transition-colors">Find Jobs</Link>
            <Link to="/resources" className="nav-link text-gray-300 hover:text-white font-bold transition-colors">Resources</Link>
            <Link to="/mentors" className="nav-link text-gray-300 hover:text-white font-bold transition-colors">Mentors</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
