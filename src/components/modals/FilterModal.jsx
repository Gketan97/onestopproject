import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';

const FilterModal = ({ isOpen, onClose, allJobs, onApplyFilters }) => {
  const [selectedTitles, setSelectedTitles] = useState([]);

  const jobTitles = useMemo(
    () => [...new Set(allJobs.map(j => j['Job Title']).filter(Boolean))].sort(),
    [allJobs]
  );

  const toggle = (title) =>
    setSelectedTitles(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );

  const handleApply = () => { onApplyFilters({ titles: selectedTitles }); onClose(); };
  const handleClear = () => { setSelectedTitles([]); onApplyFilters({ titles: [] }); onClose(); };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-ink/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-bg rounded-2xl border border-border w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-semibold text-ink">Filter Jobs</h2>
          <button onClick={onClose} className="text-ink3 hover:text-ink transition-colors">
            <X size={20} />
          </button>
        </header>

        <div className="p-6 overflow-y-auto flex-grow">
          <p className="text-xs font-mono font-semibold text-ink3 uppercase tracking-widest mb-4">Job Title</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {jobTitles.map(title => (
              <label key={title} className="flex items-center gap-2.5 text-ink2 text-sm cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedTitles.includes(title)}
                  onChange={() => toggle(title)}
                  className="w-4 h-4 rounded border-border2 text-accent focus:ring-accent focus:ring-1 cursor-pointer"
                />
                <span className="group-hover:text-ink transition-colors">{title}</span>
              </label>
            ))}
          </div>
        </div>

        <footer className="p-6 border-t border-border flex justify-end items-center gap-3">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm text-ink2 hover:text-ink transition-colors"
          >
            Clear all
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-dark transition-colors"
          >
            Apply Filters
          </button>
        </footer>
      </div>
    </div>
  );
};

export default FilterModal;
