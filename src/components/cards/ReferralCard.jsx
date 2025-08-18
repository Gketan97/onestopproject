// src/components/cards/ReferralCard.jsx

import React from 'react';
import { Briefcase, Building2, ArrowRight } from 'lucide-react';

const ReferralCard = ({ referral }) => {
  // Generates initials from the referrer's name
  const getInitials = (name = '') => {
    const names = name.split(' ');
    // Use first letter of the first and last name
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    // Fallback for single names
    return name.substring(0, 2).toUpperCase();
  };

  // CORRECTED: Use data keys that match the normalized data from useDataFetching.js
  const name = referral.name || 'Anonymous Referrer';
  const role = referral.designation || 'Role not specified';
  const company = referral.company || 'Company not specified';
  const link = referral.link || '#';

  return (
    <div className="dark-theme-card-bg dark-theme-border border rounded-xl p-5 flex flex-col justify-between h-full transition-transform duration-200 hover:scale-105">
      {/* Top section with initials and name */}
      <div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center font-bold text-white text-lg">
            {getInitials(name)}
          </div>
          <div>
            <h3 className="font-bold text-white text-lg leading-tight">{name}</h3>
            <p className="text-sm text-gray-400">Referrer</p>
          </div>
        </div>
        
        {/* Middle section with role and company details */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-gray-300">
            <Briefcase size={16} className="text-gray-500" />
            <span className="truncate">{role}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Building2 size={16} className="text-gray-500" />
            <span className="truncate">{company}</span>
          </div>
        </div>
      </div>

      {/* Prominent call-to-action button */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="brand-button w-full mt-5 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2"
      >
        Request Referral
        <ArrowRight size={16} />
      </a>
    </div>
  );
};

export default ReferralCard;
