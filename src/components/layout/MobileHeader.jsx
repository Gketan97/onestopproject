import React from 'react';
import { Link } from 'react-router-dom';

const MobileHeader = () => {
  return (
    <header className="md:hidden bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 p-4">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="12" fill="#18181B"/>
            <circle cx="20" cy="20" r="12" stroke="#F97316" strokeOpacity="0.3" strokeWidth="3"/>
            <circle cx="20" cy="20" r="5" fill="#F97316"/>
          </svg>
          <span className="text-xl font-extrabold">
            <span className="font-bold text-white">OneStop</span><span className="font-medium text-gray-300">Careers</span>
          </span>
        </Link>
      </div>
    </header>
  );
};

export default MobileHeader;
