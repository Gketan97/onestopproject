// =================================================================
// FILE: src/components/modals/FilterModal.jsx
// =================================================================
import React, { useState, useMemo } from 'react';

const FilterModal = ({ isOpen, onClose, allJobs, onApplyFilters }) => {
  const [selectedTitles, setSelectedTitles] = useState([]);

  const jobTitles = useMemo(() => {
    const titles = allJobs.map(job => job['Job Title']).filter(Boolean);
    return [...new Set(titles)].sort();
  }, [allJobs]);

  const handleTitleToggle = (title) => {
    setSelectedTitles(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const handleApply = () => {
    onApplyFilters({ titles: selectedTitles });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="dark-theme-card-bg rounded-xl dark-theme-border border-2 w-full max-w-md max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Filters</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl leading-none">&times;</button>
        </header>

        <div className="p-6 overflow-y-auto flex-grow">
          <h3 className="font-semibold text-white mb-3">Job Title</h3>
          <div className="flex flex-wrap gap-2">
            {jobTitles.map(title => (
              <button
                key={title}
                onClick={() => handleTitleToggle(title)}
                className={`px-3 py-1 text-sm rounded-full border-2 transition-colors ${selectedTitles.includes(title) ? 'bg-orange-500 border-orange-500 text-white' : 'bg-gray-700 border-gray-600 hover:border-gray-500'}`}
              >
                {title}
              </button>
            ))}
          </div>
        </div>

        <footer className="p-4 border-t border-gray-700 flex justify-end">
          <button onClick={handleApply} className="px-6 py-2 brand-button font-bold rounded-lg">
            Apply Filters
          </button>
        </footer>
      </div>
    </div>
  );
};

export default FilterModal;
