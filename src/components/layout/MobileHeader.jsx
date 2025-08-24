import React from "react";
import { useLocation } from "react-router-dom";
import Logo from "../icons/Logo";

const MobileHeader = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="fixed top-0 left-0 w-full bg-black/90 backdrop-blur-md z-50 border-b border-gray-800 flex items-center justify-center h-12">
      <div className="flex items-center space-x-2">
        <Logo className="w-7 h-7 text-orange-500" />
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
