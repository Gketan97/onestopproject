// =================================================================
// FILE (UPDATE): src/components/layout/MobileNav.jsx
// PURPOSE: To make the "Jobs" icon functional.
// =================================================================
import React from 'react';

const MobileNav = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { name: 'Home', page: 'home', icon: (props) => (/* ... svg ... */) },
    { name: 'Jobs', page: 'jobs', icon: (props) => (/* ... svg ... */) },
    { name: 'Resources', page: 'resources', icon: (props) => (/* ... svg ... */) },
    { name: 'Mentors', page: 'mentors', icon: (props) => (/* ... svg ... */) }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-gray-800 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map(item => (
          <button
            key={item.name}
            onClick={() => setCurrentPage(item.page)}
            className={`flex flex-col items-center justify-center p-2 text-xs font-bold transition-colors duration-300 ${currentPage === item.page ? "text-orange-500" : "text-gray-400 hover:text-white"}`}
          >
            <item.icon size="1.2rem" />
            <span className="mt-1">{item.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
