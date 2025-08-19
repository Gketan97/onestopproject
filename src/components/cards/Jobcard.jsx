// src/components/cards/Jobcard.jsx

import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const JobCard = ({ job, onOpenModal, isHighlighted }) => {
  const handleDetailsClick = (e) => {
    e.stopPropagation(); 
    onOpenModal(job);
  };

  return (
    // ENHANCEMENT: Added a scale transform on hover for a "lift" effect
    <div
      id={`job-card-${job.id}`}
      onClick={() => onOpenModal(job)}
      className={`dark-theme-card-bg rounded-lg dark-theme-border p-4 flex flex-col justify-between gap-3 h-full cursor-pointer transition-all duration-300 group ${isHighlighted ? 'ring-4 ring-orange-500 shadow-lg' : 'hover:border-gray-600 hover:scale-105'}`}
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
            {/* ENHANCEMENT: Improved visual hierarchy with a larger job title */}
            <h3 className="font-bold text-white text-md leading-tight">{job['Job Title']}</h3>
            <p className="text-sm text-gray-400">{job.Company}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-end">
        <span className="text-xs text-gray-500">{job.Location}</span>
        
        {/* ENHANCEMENT: Refined button for better visibility */}
        <button
          onClick={handleDetailsClick}
          className="bg-gray-800/80 backdrop-blur-sm text-gray-300 hover:text-white text-xs font-bold py-1.5 px-3 rounded-md flex items-center gap-1 transition-colors"
        >
          Details <MoreHorizontal size={14} />
        </button>
      </div>
    </div>
  );
};

export default JobCard;
