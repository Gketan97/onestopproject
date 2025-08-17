// src/components/layout/SearchAndTabs.jsx

import React from 'react';

const TabButton = ({ tabName, activeTab, label, onClick }) => (
  <button
    onClick={() => onClick(tabName)}
    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tabName ? 'bg-orange-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
  >
    {label}
  </button>
);

const SearchAndTabs = ({ activeTab, onTabClick, searchQuery, onSearchChange, onFilterClick }) => {
  return (
    <div className="sticky top-0 md:top-20 bg-[#1a1a1a] py-4 z-20 -mx-4 px-4 border-b border-gray-800">
      <div className="relative max-w-7xl mx-auto">
        <input
          type="text"
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={activeTab === 'jobs' ? "Search by title, company..." : "Search by role, company, referrer..."}
          className="w-full p-3 pl-4 pr-12 bg-gray-800 text-white rounded-lg border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        {/* The filter button is now always visible and its action is controlled by the parent */}
        <button onClick={onFilterClick} className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><title>Filter Icon</title><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        </button>
      </div>
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 mt-4">
        <TabButton tabName="jobs" activeTab={activeTab} label="Jobs" onClick={onTabClick} />
        <TabButton tabName="referrals" activeTab={activeTab} label="Referrals" onClick={onTabClick} />
      </div>
    </div>
  );
};

export default SearchAndTabs;
