import React from "react";
import { useLocation } from "react-router-dom";

const Logo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="8" strokeOpacity="0.3"/>
    <path d="M50 70 L 50 30" stroke="#F97316" strokeWidth="8" strokeLinecap="round"/>
    <path d="M35 45 L 50 30 L 65 45" stroke="#F97316" strokeWidth="8" strokeLinecap="round"/>
  </svg>
);

const MobileHeader = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="fixed top-0 left-0 w-full bg-black/90 backdrop-blur-md z-50 border-b border-gray-800 flex items-center justify-center h-12 md:hidden">
      <div className="flex items-center space-x-2">
        <Logo size={28} />
        {isHome && (
          <span className="text-white font-semibold text-lg tracking-tight">
            OneStopCareers
          </span>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;
