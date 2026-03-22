import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" stroke="#C84B0C" strokeWidth="8" strokeOpacity="0.3"/>
    <path d="M50 70 L 50 30" stroke="#C84B0C" strokeWidth="8" strokeLinecap="round"/>
    <path d="M35 45 L 50 30 L 65 45" stroke="#C84B0C" strokeWidth="8" strokeLinecap="round"/>
  </svg>
);

const navItems = [
  { label: 'Case Studies', href: '/case-studies/swiggy', external: true, highlight: true },
  { label: 'Jobs', to: '/jobs' },
  { label: 'Resources', to: '/resources' },
  { label: 'Mentors', to: '/mentors' },
];

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-bg sticky top-0 z-50 border-b border-border hidden md:block">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="font-serif text-xl text-ink">
            one<em className="text-accent not-italic">stop</em>careers
          </span>
        </a>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            if (item.external) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-accent bg-accent-light rounded-md hover:bg-accent-border transition-colors"
                >
                  {item.label}
                </a>
              );
            }
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm transition-colors rounded-md ${
                    isActive ? 'text-accent font-medium' : 'text-ink2 hover:text-ink hover:bg-surface'
                  }`
                }
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <a
          href="/case-studies/swiggy"
          className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-dark transition-all hover:-translate-y-px"
        >
          Start free →
        </a>
      </div>
    </header>
  );
};

export default Header;
