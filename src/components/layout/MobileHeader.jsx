import React from 'react';

const MobileHeader = ({ onMenuClick }) => (
  <header className="bg-black/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800 md:hidden">
    <div className="flex items-center justify-between px-4 py-3">
      <a href="/" className="text-xl font-bold text-white">OneStop<span className="text-gray-300">Careers</span></a>
      <button onClick={onMenuClick} className="text-white focus:outline-none">
        ☰
      </button>
    </div>
  </header>
);

export default MobileHeader; // ✅ required
