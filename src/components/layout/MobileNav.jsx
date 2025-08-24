import React from 'react';

const MobileNav = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <nav className="fixed inset-0 bg-black bg-opacity-95 z-40 flex flex-col items-center justify-center space-y-6 text-white text-lg">
      <button onClick={onClose} className="absolute top-4 right-4 text-2xl">&times;</button>
      <a href="/" onClick={onClose} className="hover:text-gray-300">Home</a>
      <a href="/jobs" onClick={onClose} className="hover:text-gray-300">Find Jobs</a>
      <a href="/resources" onClick={onClose} className="hover:text-gray-300">Resources</a>
      <a href="/mentors" onClick={onClose} className="hover:text-gray-300">Mentors</a>
    </nav>
  );
};

export default MobileNav; // ✅ required
