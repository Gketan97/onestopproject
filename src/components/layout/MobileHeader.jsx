import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png"; // <-- adjust path to your logo

const MobileHeader = () => {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-b border-gray-800 z-50">
      <div className="flex items-center justify-center h-14">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="OneStopCareers Logo"
            className="h-8 w-auto object-contain"
          />
        </Link>
      </div>
    </header>
  );
};

export default MobileHeader;
