import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-black/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="8" fill="#27272A"/>
            <defs>
              <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:"#F97316",stopOpacity:1}}/>
                <stop offset="100%" style={{stopColor:"#FB923C",stopOpacity:1}}/>
              </linearGradient>
            </defs>
            <path d="M9 20C9 17.5 10 15.5 12.5 14C15 12.5 16 15 16 16.5C16 18 14 19 13 21C12 23 14 25 16.5 25.5" stroke="#666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.5 25.5C19 26 22 24 24 22L31 15" stroke="url(#brandGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M26 15L31 15L31 20" stroke="url(#brandGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
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
