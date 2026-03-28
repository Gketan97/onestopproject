import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Briefcase, Zap } from 'lucide-react';

const MobileNav = () => {
  const base = 'flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors duration-200';
  return (
    <nav
      className="fixed bottom-0 left-0 w-full z-50 flex h-14 md:hidden"
      style={{
        background: 'rgba(8,8,16,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <NavLink to="/" className={({ isActive }) => `${base} ${isActive ? 'text-accent' : 'text-ink3 hover:text-ink2'}`}>
        <Home className="w-5 h-5 mb-0.5" />
        <span>Home</span>
      </NavLink>

      <NavLink to="/jobs" className={({ isActive }) => `${base} ${isActive ? 'text-accent' : 'text-ink3 hover:text-ink2'}`}>
        <Briefcase className="w-5 h-5 mb-0.5" />
        <span>Jobs</span>
      </NavLink>

      <NavLink
        to="/strategy/swiggy"
        className={({ isActive }) =>
          `${base} ${isActive ? 'text-accent' : 'text-ink3 hover:text-ink2'}`
        }
      >
        <Zap className="w-5 h-5 mb-0.5" />
        <span>Simulate</span>
      </NavLink>
    </nav>
  );
};

export default MobileNav;
