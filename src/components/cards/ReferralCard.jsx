// =================================================================
// FILE (UPDATE): src/components/cards/ReferralCard.jsx
// PURPOSE: Add defensive coding to prevent crashes from bad data.
// =================================================================
import React from 'react';

const ReferralCard = ({ referral }) => {
  // Defensive check: Ensure referral.roles is an array before calling .join()
  const rolesText = Array.isArray(referral.roles) ? referral.roles.join(', ') : 'N/A';

  return (
    <div className="dark-theme-card-bg rounded-xl dark-theme-border border-2 flex flex-col p-4 h-full w-full">
      <div className="flex items-center gap-4 mb-3">
        <img 
          src={referral.image} 
          alt={`${referral.name || 'Referrer'}'s profile`} 
          className="w-12 h-12 rounded-full object-cover bg-gray-700"
          onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/48x48/ffffff/1a1a1a?text=:)'; }}
        />
        <div>
          <h3 className="font-bold text-white">{referral.name || 'Anonymous Referrer'}</h3>
          <p className="text-xs text-gray-400">{referral.headline || 'Headline not available'}</p>
        </div>
      </div>
      <div className="flex-grow">
        <p className="text-sm text-gray-400 line-clamp-2">
          Can refer for: <span className="font-semibold text-gray-300">{rolesText}</span>
        </p>
         <p className="text-sm text-gray-400 mt-1">
          At: <span className="font-semibold text-gray-300">{referral.company || 'Company not specified'}</span>
        </p>
      </div>
      <button className="mt-4 w-full px-4 py-2 brand-button font-bold text-sm rounded-lg">
        Request Referral
      </button>
    </div>
  );
};

export default ReferralCard;
