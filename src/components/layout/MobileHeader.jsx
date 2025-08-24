import React from "react";
import { Link } from "react-router-dom";
import Logo from "../icons/Logo"; // adjust path if needed

const MobileHeader = () => {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-b border-gray-800 z-50">
      <div className="flex justify-center items-center h-14">
        <Link to="/" className="flex items-center space-x-2">
          <Logo className="h-8 w-auto text-orange-500" />
          <span className="font-bold text-white">OneStopCareers</span>
        </Link>
      </div>
    </header>
  );
};

export default MobileHeader;
