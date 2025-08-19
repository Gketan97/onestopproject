// src/components/cards/Jobcard.jsx

import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const JobCard = ({ job, onOpenModal, isHighlighted }) => {
  // This function handles the click on the "Details" button
  const handleDetailsClick = (e) => {
    // This stops the click from "bubbling up" and triggering the onOpenModal function
    e.stopPropagation(); 
    onOpenModal(job);
  };

  return (
    // The main div is still clickable to open the modal
    <div
      id={`job-card-${job.id}`}
      onClick={() => onOpenModal(job)}
      className={`dark-theme-card-bg rounded-lg dark-theme-border p-4 flex flex-col justify-between gap-3 h-full cursor-pointer transition-all duration-300 ${isHighlighted ? 'ring-4 ring-orange-500 shadow-lg' : 'hover:border-gray-600'}`}
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
      <div className="flex justify-between items-end">
        <span className="text-xs text-gray-500">{job.Location}</span>
        
        {/* UPDATED: Button is now always visible */}
        <button
          onClick={handleDetailsClick}
          className="bg-gray-800/80 backdrop-blur-sm text-gray-300 hover:text-white text-xs font-bold py-1 px-2 rounded-md flex items-center gap-1 transition-colors"
        >
          Details <MoreHorizontal size={12} />
        </button>
      </div>
    </div>
  );
};

export default JobCard;
