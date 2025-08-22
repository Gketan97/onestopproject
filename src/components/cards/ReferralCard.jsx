// src/components/cards/ReferralCard.jsx

import React from 'react';
import { Briefcase, Building2, ArrowRight, Linkedin } from 'lucide-react';

const ReferralCard = ({ referral }) => {
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
            <span className="truncate">{company}</span>
          </div>
        </div>
      </div>

      {/* Prominent call-to-action button */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        // ENHANCEMENT: Improved button layout for better visual balance
        className="bg-orange-600 hover:bg-orange-700 text-white w-full mt-5 py-2.5 px-4 rounded-lg font-bold flex items-center justify-between text-center transition-colors"
      >
        <Linkedin size={18} />
        <span className="flex-grow">Request on LinkedIn</span>
        {/* ENHANCEMENT: Arrow now slides right on card hover */}
        <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
      </a>
    </div>
  );
};

export default ReferralCard;
