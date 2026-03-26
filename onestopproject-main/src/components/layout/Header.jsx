import React from 'react';
import { NavLink } from 'react-router-dom';

const Logo = () => (
  <svg width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" stroke="var(--accent)" strokeWidth="8" strokeOpacity="0.3"/>
    <path d="M50 70 L 50 30" stroke="var(--accent)" strokeWidth="8" strokeLinecap="round"/>
    <path d="M35 45 L 50 30 L 65 45" stroke="var(--accent)" strokeWidth="8" strokeLinecap="round"/>
  </svg>
);

const navItems = [
  { label: 'Case Studies', to: '/case-studies' },
  { label: 'Jobs',         to: '/jobs' },
];

const Header = () => (
  <header
    className="sticky top-0 z-50 hidden md:block"
    style={{
      background: 'rgba(8,8,16,0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}
  >
    <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
      <NavLink to="/" className="flex items-center gap-2.5 group">
        <Logo />
        <span className="font-sans text-xl font-semibold" style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}>
          one<em className="not-italic" style={{ color: 'var(--accent)' }}>stop</em>careers
        </span>
      </NavLink>

      <nav className="flex items-center gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `px-3 py-2 text-sm transition-colors rounded-md font-medium ${
                isActive
                  ? 'text-accent bg-accent-light'
                  : 'text-ink2 hover:text-ink hover:bg-surface'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <NavLink
        to="/case-study/swiggy"
        className="px-4 py-2 text-white text-sm font-semibold rounded-lg transition-all hover:-translate-y-px"
        style={{
          background: 'var(--accent)',
          boxShadow: '0 0 0 1px rgba(252,128,25,0.3)',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(252,128,25,0.4)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 0 1px rgba(252,128,25,0.3)'}
      >
        Start free →
      </NavLink>
    </div>
  </header>
);

export default Header;
