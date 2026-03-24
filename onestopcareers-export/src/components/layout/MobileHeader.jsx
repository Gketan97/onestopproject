import React from 'react';
import { useLocation } from 'react-router-dom';

const MobileHeader = () => {
  const location = useLocation();

  // Jobs page has its own header treatment; portfolio is standalone
  if (location.pathname === '/jobs') return null;
  if (location.pathname.startsWith('/portfolio/')) return null;

  return (
    <header className="fixed top-0 left-0 w-full bg-bg/95 backdrop-blur-md z-50 border-b border-border flex items-center justify-center h-12 md:hidden">
      <a href="/" className="flex items-center gap-2">
        <span className="font-serif text-lg text-ink">
          one<em className="text-accent not-italic">stop</em>careers
        </span>
      </a>
    </header>
  );
};

export default MobileHeader;
