// src/components/modals/ReferralFilterModal.jsx

import React, { useState, useMemo } from 'react';

const ReferralFilterModal = ({ isOpen, onClose, allReferrals, onApplyFilters }) => {
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);

  // Memoize filter options to prevent recalculation on every render
  const filterOptions = useMemo(() => {
    const companies = [...new Set(allReferrals.map(ref => ref.Company).filter(Boolean))].sort();
    const roles = [...new Set(allReferrals.map(ref => ref.Role).filter(Boolean))].sort();
    return { companies, roles };
  }, [allReferrals]);

  const handleCheckboxChange = (value, type) => {
    const updater = type === 'company' ? setSelectedCompanies : setSelectedRoles;
    updater(prev => 
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      companies: selectedCompanies,
      roles: selectedRoles,
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedCompanies([]);
    setSelectedRoles([]);
    onApplyFilters({ companies: [], roles: [] });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="dark-theme-card-bg rounded-xl dark-theme-border border-2 w-full max-w-2xl max-h-[90vh] flex flex-col animate-slide-up" onClick={e => e.stopPropagation()}>
        <header className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Filter Referrals</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-3xl leading-none">&times;</button>
        </header>
        
        <div className="p-6 overflow-y-auto flex-grow">
          <div className="mb-6">
            <h3 className="font-bold text-white mb-3">Company</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
              {filterOptions.companies.map(company => (
                <label key={company} className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={selectedCompanies.includes(company)} onChange={() => handleCheckboxChange(company, 'company')} className="form-checkbox bg-gray-800 border-gray-600 text-orange-500" />
                  {company}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white mb-3">Role</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
              {filterOptions.roles.map(role => (
                <label key={role} className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={selectedRoles.includes(role)} onChange={() => handleCheckboxChange(role, 'role')} className="form-checkbox bg-gray-800 border-gray-600 text-orange-500" />
                  {role}
                </label>
              ))}
            </div>
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

export default ReferralFilterModal;
