import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const BriefcaseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);
const CaseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const TreeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
  </svg>
);

const MobileNav = () => {
  const location = useLocation();
  const isJobsPage = location.pathname === '/jobs';
  const navBg = isJobsPage ? 'bg-black/90 border-gray-800' : 'bg-bg border-border';
  const activeColor = 'text-[#C84B0C]';
  const inactiveColor = isJobsPage ? 'text-gray-400' : 'text-ink3';

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 ${navBg} backdrop-blur-sm border-t z-50`}>
      <div className="flex justify-around items-center h-16">
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${location.pathname === '/' ? activeColor : inactiveColor}`}
        >
          <HomeIcon />
          Home
        </Link>
        <Link
          to="/jobs"
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${location.pathname === '/jobs' ? activeColor : inactiveColor}`}
        >
          <BriefcaseIcon />
          Jobs
        </Link>
        <a
          href="/case-studies/swiggy"
          className="flex flex-col items-center gap-1 text-[10px] font-medium text-[#C84B0C] bg-[#FDF2EC] px-3 py-1 rounded-lg border border-[#F2C4A5]"
        >
          <CaseIcon />
          Cases
        </a>
        <Link
          to="/decision-tree"
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${location.pathname === '/decision-tree' ? activeColor : inactiveColor}`}
        >
          <TreeIcon />
          Quiz
        </Link>
      </div>
    </nav>
  );
};

export default MobileNav;
