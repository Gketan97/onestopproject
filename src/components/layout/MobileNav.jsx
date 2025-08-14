import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Define navItems outside the component to prevent re-creation on every render
const navItems = [
  { 
    name: 'Home', 
    path: '/', 
    icon: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <title>Home Icon</title>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ) 
  },
  { 
    name: 'Jobs', 
    path: '/jobs', 
    icon: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <title>Jobs Icon</title>
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ) 
  },
  { 
    name: 'Resources', 
    path: '/resources', 
    icon: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <title>Resources Icon</title>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ) 
  },
  { 
    name: 'Mentors', 
    path: '/mentors', 
    icon: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <title>Mentors Icon</title>
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="8.5" cy="7" r="4"/>
        <line x1="20" y1="8" x2="20" y2="14"/>
        <line x1="23" y1="11" x2="17" y2="11"/>
      </svg>
    ) 
  }
];

const MobileNav = () => {
  const location = useLocation();
  const currentPage = location.pathname;

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
