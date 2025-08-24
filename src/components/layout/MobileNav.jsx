import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Briefcase, BookOpen, Users } from "lucide-react";

const MobileNav = () => {
  const baseClasses =
    "flex flex-col items-center justify-center flex-1 py-1 text-xs transition-colors duration-200";

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-md z-50 border-t border-gray-800 flex h-14 md:hidden">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${baseClasses} ${isActive ? "text-orange-500" : "text-gray-400"}`
        }
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/jobs"
        className={({ isActive }) =>
          `${baseClasses} ${isActive ? "text-orange-500" : "text-gray-400"}`
        }
      >
        <Briefcase className="w-5 h-5 mb-0.5" />
        <span>Jobs</span>
      </NavLink>

      <NavLink
        to="/resources"
        className={({ isActive }) =>
          `${baseClasses} ${isActive ? "text-orange-500" : "text-gray-400"}`
        }
      >
        <BookOpen className="w-5 h-5 mb-0.5" />
        <span>Resources</span>
      </NavLink>

      <NavLink
        to="/mentors"
        className={({ isActive }) =>
          `${baseClasses} ${isActive ? "text-orange-500" : "text-gray-400"}`
        }
      >
        <Users className="w-5 h-5 mb-0.5" />
        <span>Mentors</span>
      </NavLink>
    </nav>
  );
};

export default MobileNav;
