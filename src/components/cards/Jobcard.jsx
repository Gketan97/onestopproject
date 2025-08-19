// src/components/cards/Jobcard.jsx

import React from 'react';
import { MapPin, Building, ArrowRight } from 'lucide-react';

const JobCard = ({ job, onOpenModal, isHighlighted }) => {
  return (
    // The main div is still clickable to open the modal
    // Added 'group' to enable the hover effect on the child arrow icon
    <div
      id={`job-card-${job.id}`}
      onClick={() => onOpenModal(job)}
      className={`dark-theme-card-bg rounded-xl dark-theme-border border p-5 flex flex-col justify-between h-full cursor-pointer transition-all duration-300 group ${isHighlighted ? 'ring-2 ring-orange-500 shadow-lg' : 'hover:border-gray-600 hover:scale-105'}`}
    >
      <div>
        <div className="flex items-start gap-4 mb-4">
          <img 
            src={job['Company Logo URL']} 
            alt={`${job.Company} logo`} 
            className="w-12 h-12 rounded-md object-contain bg-white p-1"
            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/48x48/ffffff/1a1a1a?text=Logo'; }}
          />
          <div>
            {/* ENHANCEMENT: Improved visual hierarchy */}
            <h3 className="font-bold text-white text-lg leading-tight">{job['Job Title']}</h3>
            <p className="text-sm text-gray-400">{job.Company}</p>
          </div>
        </div>
        <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={14} className="flex-shrink-0" />
                <span>{job.Location}</span>
            </div>
        </div>
      </div>

      {/* ENHANCEMENT: Full-width, prominent "View Details" button */}
      <button
        onClick={(e) => {
            e.stopPropagation();
            onOpenModal(job);
        }}
        className="brand-button w-full mt-5 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 text-center"
      >
        View Details
        <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </div>
  );
};

export default JobCard;
