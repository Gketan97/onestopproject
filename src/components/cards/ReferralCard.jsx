<<<<<<< Updated upstream
// src/components/cards/ReferralCard.jsx

=======
>>>>>>> Stashed changes
import React from 'react';
import { Briefcase, Building2, ArrowRight } from 'lucide-react';

const ReferralCard = ({ referral }) => {
<<<<<<< Updated upstream
  // Use data keys that match the normalized data from useDataFetching.js
  const name = referral.name || 'Anonymous Referrer';
  const role = referral.designation || 'Role not specified';
  const company = referral.company || 'Company not specified';
  const link = referral.link || '#';

  return (
    // Added 'group' to enable the hover effect on the child arrow icon
    <div className="dark-theme-card-bg dark-theme-border border rounded-xl p-5 flex flex-col justify-between h-full transition-transform duration-200 hover:scale-105 group">
      {/* Top section with name and title */}
      <div>
        <h3 className="font-bold text-white text-xl leading-tight truncate">{name}</h3>
        <p className="text-sm text-gray-400 mb-4">Referrer</p>
        
        {/* Middle section with role and company details */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-gray-300">
            <Briefcase size={16} className="text-gray-500 flex-shrink-0" />
            <span className="truncate">{role}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Building2 size={16} className="text-gray-500 flex-shrink-0" />
=======
  const name    = referral.name        || 'Anonymous Referrer';
  const role    = referral.designation || 'Role not specified';
  const company = referral.company     || 'Company not specified';
  const link    = referral.link        || '#';

  return (
    <div className="
      bg-bg border border-border rounded-xl p-5
      flex flex-col justify-between h-full
      transition-all duration-200 group
      hover:border-border2 hover:shadow-card
    ">
      <div>
        {/* Referrer name + label */}
        <div className="mb-4">
          <h3 className="font-semibold text-ink text-base leading-tight truncate">{name}</h3>
          <p className="text-xs text-ink3 mt-0.5 font-mono uppercase tracking-wide">Referrer</p>
        </div>

        {/* Role + company */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-ink2 text-sm">
            <Briefcase size={13} className="text-ink3 flex-shrink-0" />
            <span className="truncate">{role}</span>
          </div>
          <div className="flex items-center gap-2 text-ink2 text-sm">
            <Building2 size={13} className="text-ink3 flex-shrink-0" />
>>>>>>> Stashed changes
            <span className="truncate">{company}</span>
          </div>
        </div>
      </div>

<<<<<<< Updated upstream
      {/* Prominent call-to-action button */}
=======
>>>>>>> Stashed changes
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
<<<<<<< Updated upstream
        // ENHANCEMENT: Simplified button layout
        className="bg-orange-600 hover:bg-orange-700 text-white w-full mt-5 py-2.5 px-4 rounded-lg font-bold flex items-center justify-center gap-2 text-center transition-colors"
      >
        <span>Request on LinkedIn</span>
        {/* ENHANCEMENT: Arrow now slides right on card hover */}
        <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
=======
        onClick={(e) => e.stopPropagation()}
        className="
          mt-5 w-full py-2.5 px-4 rounded-lg
          bg-accent text-white text-sm font-medium
          flex items-center justify-center gap-2
          hover:bg-accent-dark transition-colors duration-150
        "
      >
        Request on LinkedIn
        <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
>>>>>>> Stashed changes
      </a>
    </div>
  );
};

export default ReferralCard;
