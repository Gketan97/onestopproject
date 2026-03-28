import React from 'react';
import { useLocation } from 'react-router-dom';

const MobileHeader = () => {
  const location = useLocation();

  // Jobs page has its own header treatment; portfolio is standalone
  if (location.pathname === '/jobs') return null;
  if (location.pathname.startsWith('/portfolio/')) return null;

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-center h-12 md:hidden"
      style={{
        background: 'rgba(8,8,16,0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <a href="/" className="flex items-center gap-2">
        <span className="text-base font-semibold text-ink" style={{ letterSpacing: '-0.01em' }}>
          one<em className="text-accent not-italic">stop</em>careers
        </span>
      </a>
    </header>
  );
};

export default MobileHeader;
