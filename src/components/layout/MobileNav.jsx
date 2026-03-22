import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Briefcase, BookOpen, Users } from 'lucide-react';

const CaseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);

const MobileNav = () => {
  const base = 'flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors duration-200';
  const active = 'text-accent';
  const inactive = 'text-ink3';

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-bg/95 backdrop-blur-md z-50 border-t border-border flex h-14 md:hidden">
      <NavLink to="/" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
        <Home className="w-5 h-5 mb-0.5" />
        <span>Home</span>
      </NavLink>

      <NavLink to="/jobs" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
        <Briefcase className="w-5 h-5 mb-0.5" />
        <span>Jobs</span>
      </NavLink>

      <a
        href="/case-studies/swiggy"
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} text-accent bg-accent-light border-x border-accent-border`}
      >
        <CaseIcon />
        <span>Cases</span>
      </a>

      <NavLink to="/resources" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
        <BookOpen className="w-5 h-5 mb-0.5" />
        <span>Resources</span>
      </NavLink>

      <NavLink to="/mentors" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
        <Users className="w-5 h-5 mb-0.5" />
        <span>Mentors</span>
      </NavLink>
    </nav>
  );
};

export default MobileNav;
