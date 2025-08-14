/ FILE (UPDATE): src/components/layout/Header.jsx
// PURPOSE: To make the "Find Jobs" link functional.
// =================================================================
import React from 'react';

const Header = ({ userId, setCurrentPage }) => {
  const handleNavClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <header className="bg-black/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <button onClick={() => handleNavClick('home')} className="flex items-center gap-3">
          {/* ... (logo svg) ... */}
          <span className="text-2xl font-extrabold text-white">
            <span className="font-bold">OneStop</span><span className="font-medium text-gray-300">Careers</span>
          </span>
        </button>
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex items-center space-x-8">
            <button onClick={() => handleNavClick('home')} className="nav-link text-gray-300 hover:text-white font-bold transition-colors">Home</button>
            <button onClick={() => handleNavClick('jobs')} className="nav-link text-gray-300 hover:text-white font-bold transition-colors">Find Jobs</button>
            <button onClick={() => handleNavClick('resources')} className="nav-link text-gray-300 hover:text-white font-bold transition-colors">Resources</button>
            <button onClick={() => handleNavClick('mentors')} className="nav-link text-gray-300 hover:text-white font-bold transition-colors">Mentors</button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
