// =================================================================
// FILE (UPDATE): src/components/cards/ReferralCard.jsx
// PURPOSE: Use the correct column names from the referrals JSON data.
// =================================================================
import React from 'react';

const ReferralCard = ({ referral }) => {
  // Using the correct keys from the JSON file now
  const name = referral.Name || 'Anonymous Referrer';
  const headline = referral.Designation || 'Headline not available';
  const company = referral['Company name'] || 'Company not specified';
  const link = referral.Link || '#'; // Assuming 'Link' is the key for the URL

  return (
    <div className="dark-theme-card-bg rounded-xl dark-theme-border border-2 flex flex-col p-4 h-full w-full">
      <div className="flex items-center gap-4 mb-3">
        <img 
          src={referral.image} // Assuming 'image' key might exist, with a fallback
          alt={`${name}'s profile`} 
          className="w-12 h-12 rounded-full object-cover bg-gray-700"
          onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/48x48/ffffff/1a1a1a?text=:)'; }}
        />
        <div>
          <h3 className="font-bold text-white">{name}</h3>
          <p className="text-xs text-gray-400">{headline}</p>
        </div>
      </div>
      <div className="flex-grow">
         <p className="text-sm text-gray-400 mt-1">
          Company: <span className="font-semibold text-gray-300">{company}</span>
        </p>
      </div>
      <a 
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 w-full text-center px-4 py-2 brand-button font-bold text-sm rounded-lg"
      >
        Request Referral
      </a>
    </div>
  );
};

export default ReferralCard;
