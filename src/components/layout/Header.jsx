import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const isJobsPage = location.pathname === '/jobs';

  if (isJobsPage) {
    return (
      <header className="bg-black/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-serif text-xl text-white">
            one<em className="text-[#C84B0C] not-italic">stop</em>careers
          </Link>
          <nav className="flex items-center gap-6">
            <a href="/case-studies/swiggy" className="text-sm text-gray-400 hover:text-white transition-colors">Case Studies</a>
            <Link to="/jobs" className="text-sm text-white font-medium">Jobs</Link>
            <Link to="/decision-tree" className="text-sm text-gray-400 hover:text-white transition-colors">Decision Tree</Link>
            <a href="/case-studies/swiggy" className="px-4 py-2 bg-[#C84B0C] text-white text-sm font-medium rounded-lg hover:bg-[#A03A08] transition-colors">
              Start free →
            </a>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-bg sticky top-0 z-50 border-b border-border hidden md:block">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="font-serif text-xl text-ink">
          one<em className="text-accent not-italic">stop</em>careers
        </Link>
        <nav className="flex items-center gap-1">
          <a
            href="/case-studies/swiggy"
            className="px-3 py-2 text-sm font-medium text-accent bg-accent-light rounded-md hover:bg-accent-border transition-colors"
          >
            Case Studies
          </a>
          <Link
            to="/jobs"
            className={`px-3 py-2 text-sm transition-colors rounded-md ${location.pathname === '/jobs' ? 'text-accent font-medium' : 'text-ink2 hover:text-ink hover:bg-surface'}`}
          >
            Jobs
          </Link>
          <Link
            to="/decision-tree"
            className={`px-3 py-2 text-sm transition-colors rounded-md ${location.pathname === '/decision-tree' ? 'text-accent font-medium' : 'text-ink2 hover:text-ink hover:bg-surface'}`}
          >
            Decision Tree
          </Link>
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
