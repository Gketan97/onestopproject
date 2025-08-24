import React from "react";
import { useLocation } from "react-router-dom";
import Logo from "../icons/Logo";

const MobileHeader = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-b border-gray-800 z-50">
      <div className="flex items-center justify-center h-12 px-4">
        {isHomePage ? (
          // Full logo with icon + wording
          <div className="flex items-center space-x-2">
            <Logo className="w-6 h-6 text-orange-500" />
            <span className="text-white font-semibold text-lg tracking-tight">
              OneStopCareers
            </span>
          </div>
        ) : (
          // Compact logo (only icon)
          <Logo className="w-6 h-6 text-orange-500" />
        )}
      </div>
    </header>
  );
};

export default MobileHeader;
