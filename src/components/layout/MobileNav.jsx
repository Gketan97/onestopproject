// =================================================================
// FILE (UPDATE): src/components/layout/MobileNav.jsx
// PURPOSE: Use the Link component and useLocation hook for navigation.
// =================================================================
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MobileNav = () => {
  const location = useLocation();
  const currentPage = location.pathname;

  const navItems = [
    { name: 'Home', path: '/', icon: (props) => (/* ... svg ... */) },
    { name: 'Jobs', path: '/jobs', icon: (props) => (/* ... svg ... */) },
    { name: 'Resources', path: '/resources', icon: (props) => (/* ... svg ... */) },
    { name: 'Mentors', path: '/mentors', icon: (props) => (/* ... svg ... */) }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-gray-800 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map(item => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center justify-center p-2 text-xs font-bold transition-colors duration-300 ${currentPage === item.path ? "text-orange-500" : "text-gray-400 hover:text-white"}`}
          >
            <item.icon size="1.2rem" />
            <span className="mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
