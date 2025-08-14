// =================================================================
// FILE (UPDATE): src/components/layout/Header.jsx
// PURPOSE: Use the Link component for navigation instead of state.
// =================================================================
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-black/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          {/* ... (logo svg) ... */}
          <span className="text-2xl font-extrabold text-white">
            <span className="font-bold">OneStop</span><span className="font-medium text-gray-300">Careers</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex items-center space-x-8">
            <Link to="/" className="nav-link text-gray-300 hover:text-white font-bold transition-colors">Home</Link>
            <Link to="/jobs" className="nav-link text-gray-300 hover:text-white font-bold transition-colors">Find Jobs</Link>
            {/* These links will work once their routes are added in App.jsx */}
            <Link to="/resources" className="nav-link text-gray-300 hover:text-white font-bold transition-colors">Resources</Link>
            <Link to="/mentors" className="nav-link text-gray-300 hover:text-white font-bold transition-colors">Mentors</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
