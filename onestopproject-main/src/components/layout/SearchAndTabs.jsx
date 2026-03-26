import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const TabButton = ({ tabName, activeTab, label, onClick }) => (
  <button
    onClick={() => onClick(tabName)}
    className={`
      px-5 py-2 text-sm font-medium rounded-lg transition-colors duration-150
      ${activeTab === tabName
        ? 'bg-accent text-white'
        : 'text-ink2 hover:text-ink hover:bg-surface'}
    `}
  >
    {label}
  </button>
);

const SearchAndTabs = ({ activeTab, onTabClick, searchQuery, onSearchChange, onFilterClick }) => (
  <div
    className="sticky top-0 md:top-[var(--header-h)] py-3 z-20 -mx-4 px-4 border-b border-border"
    style={{
      background: 'rgba(8,8,16,0.88)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    }}
  >
    <div className="relative max-w-7xl mx-auto">
      {/* Search input */}
      <div className="relative mb-3">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={
            activeTab === 'jobs'
              ? 'Search by title, company, location…'
              : 'Search by role, company, referrer…'
          }
          className="
            w-full pl-10 pr-12 py-2.5
            bg-bg border border-border rounded-lg
            text-ink text-sm placeholder:text-ink3
            focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent
            transition-colors duration-150
          "
        />
        <button
          onClick={onFilterClick}
          className="absolute inset-y-0 right-0 flex items-center justify-center px-3.5 text-ink3 hover:text-ink transition-colors"
          aria-label="Open filters"
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2">
        <TabButton tabName="jobs"      activeTab={activeTab} label="Jobs"      onClick={onTabClick} />
        <TabButton tabName="referrals" activeTab={activeTab} label="Referrals" onClick={onTabClick} />
      </div>
    </div>
  </div>
);

export default SearchAndTabs;
