import React from 'react';

const MobileNav = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { name: "Home", icon: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
    { name: "Jobs", icon: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 11V7a4 4 0 0 0-8 0v4"/><rect x="5" y="9" width="14" height="14" rx="2" ry="2"/></svg> },
    { name: "Resources", icon: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> },
    { name: "Mentors", icon: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-gray-800 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setCurrentPage(item.name.toLowerCase())}
            className={`flex flex-col items-center justify-center p-2 text-xs font-bold transition-colors duration-300 ${currentPage === item.name.toLowerCase() ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}
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
