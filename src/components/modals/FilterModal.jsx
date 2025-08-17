// src/components/modals/FilterModal.jsx

import React, { useState, useMemo } from 'react';

const FilterModal = ({ isOpen, onClose, allJobs, onApplyFilters }) => {
  const [selectedTitles, setSelectedTitles] = useState([]);

  const jobTitles = useMemo(() => {
    return [...new Set(allJobs.map(job => job['Job Title']).filter(Boolean))].sort();
  }, [allJobs]);

  const handleTitleChange = (title) => {
    setSelectedTitles(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const handleApply = () => {
    onApplyFilters({ titles: selectedTitles });
    onClose();
  };

  const handleClear = () => {
    setSelectedTitles([]);
    onApplyFilters({ titles: [] });
    onClose();
  };

  if (!isOpen) return null;

  return (
    // OPACITY FIX: Changed bg-opacity-70 to just bg-black for 100% opacity
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="dark-theme-card-bg rounded-xl dark-theme-border border-2 w-full max-w-2xl max-h-[90vh] flex flex-col animate-slide-up" onClick={e => e.stopPropagation()}>
        <header className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Filter Jobs</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-3xl leading-none">&times;</button>
        </header>
        
        <div className="p-6 overflow-y-auto flex-grow">
          <h3 className="font-bold text-white mb-3">Job Title</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {jobTitles.map(title => (
              <label key={title} className="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input type="checkbox" checked={selectedTitles.includes(title)} onChange={() => handleTitleChange(title)} className="form-checkbox bg-gray-800 border-gray-600 text-orange-500" />
                {title}
              </label>
            ))}
          </div>
        </div>

        <footer className="p-6 border-t border-gray-700 flex justify-end items-center gap-4">
          <button onClick={handleClear} className="text-sm text-gray-400 hover:text-white">Clear All</button>
          <button onClick={handleApply} className="px-8 py-3 brand-button font-bold rounded-lg">Apply Filters</button>
        </footer>
      </div>
    </div>
  );
};

export default FilterModal;
