// src/components/cards/Jobcard.jsx

import React from 'react';

const JobCard = ({ job, onOpenModal, isHighlighted }) => {
  return (
    // The id allows us to scroll to this card.
    // The className conditionally applies a glowing ring effect for the highlight.
    <div
      id={`job-card-${job.id}`}
      onClick={() => onOpenModal(job)}
      className={`dark-theme-card-bg rounded-lg dark-theme-border p-4 flex flex-col gap-3 h-full cursor-pointer transition-all duration-300 ${isHighlighted ? 'ring-4 ring-orange-500 shadow-lg' : 'hover:border-gray-600'}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={job['Company Logo URL']} 
            alt={`${job.Company} logo`} 
            className="w-12 h-12 rounded-md object-contain bg-white p-1"
            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/48x48/ffffff/1a1a1a?text=Logo'; }}
          />
          <div>
            <h3 className="font-bold text-white leading-tight">{job['Job Title']}</h3>
            <p className="text-sm text-gray-400">{job.Company}</p>
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-500">
        <span>{job.Location}</span>
      </div>
    </div>
  );
};

export default JobCard;
