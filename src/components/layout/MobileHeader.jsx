import React from "react";
import Logo from "../icons/Logo"; // relative import for logo

const MobileHeader = () => {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-b border-gray-800 z-50 flex items-center justify-between px-4 py-2">
      {/* Logo */}
      <div className="flex items-center">
        <Logo className="w-28 h-auto" /> {/* Optimized size for mobile */}
      </div>
    </header>
  );
};

export default MobileHeader;
