// src/components/cards/ReferralCard.jsx

import React from 'react';
import { Briefcase, Building2, ArrowRight } from 'lucide-react';

const ReferralCard = ({ referral }) => {
  // Use data keys that match the normalized data from the updated hook
  const name = referral['Referrer Name'] || 'Anonymous Referrer';
  const role = referral.Role || 'Role not specified';
  const company = referral.Company || 'Company not specified';
  const link = referral.Link || '#';

  return (
    <div className="dark-theme-card-bg dark-theme-border border rounded-xl p-5 flex flex-col justify-between h-full transition-transform duration-200 hover:scale-105">
      {/* Top section with name and title */}
      <div>
        <h3 className="font-bold text-white text-xl leading-tight">{name}</h3>
        <p className="text-sm text-gray-400 mb-4">Referrer</p>
        
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
