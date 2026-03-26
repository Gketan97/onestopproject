import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Briefcase, BookOpen } from 'lucide-react';

const MobileNav = () => {
  const base = 'flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors duration-200';
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-bg/95 backdrop-blur-md z-50 border-t border-border flex h-14 md:hidden">
      <NavLink to="/" className={({ isActive }) => `${base} ${isActive ? 'text-accent' : 'text-ink3'}`}>
        <Home className="w-5 h-5 mb-0.5" />
        <span>Home</span>
      </NavLink>

      <NavLink to="/jobs" className={({ isActive }) => `${base} ${isActive ? 'text-accent' : 'text-ink3'}`}>
        <Briefcase className="w-5 h-5 mb-0.5" />
        <span>Jobs</span>
      </NavLink>

      <NavLink
        to="/case-studies"
        className={({ isActive }) =>
          `${base} ${isActive ? 'text-accent bg-accent-light border-x border-accent-border' : 'text-ink2 hover:text-accent'}`
        }
      >
        <BookOpen className="w-5 h-5 mb-0.5" />
        <span>Cases</span>
      </NavLink>
    </nav>
  );
};

export default MobileNav;
