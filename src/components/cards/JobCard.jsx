import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';

const JobCard = ({ job, onOpenModal, isHighlighted }) => (
  <div
    id={`job-card-${job.id}`}
    onClick={() => onOpenModal(job)}
    className={`
      bg-bg border border-border rounded-xl p-5
      flex flex-col justify-between h-full
      cursor-pointer transition-all duration-200 group
      hover:border-border2 hover:shadow-card
      ${isHighlighted ? 'ring-2 ring-accent shadow-accent' : ''}
    `}
  >
    <div>
      <div className="flex items-start gap-3 mb-4">
        <img
          src={job['Company Logo URL']}
          alt={`${job.Company} logo`}
          className="w-11 h-11 rounded-lg object-contain bg-white border border-border p-1 flex-shrink-0"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/44x44/F3F2ED/9B9B8F?text=Co'; }}
        />
        <div className="min-w-0">
          <h3 className="font-semibold text-ink text-base leading-tight truncate">{job['Job Title']}</h3>
          <p className="text-sm text-ink2 mt-0.5">{job.Company}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-ink3 text-sm">
        <MapPin size={13} className="flex-shrink-0" />
        <span>{job.Location}</span>
      </div>
    </div>

    <button
      onClick={(e) => { e.stopPropagation(); onOpenModal(job); }}
      className="
        mt-5 w-full py-2.5 rounded-lg
        bg-accent text-white text-sm font-medium
        flex items-center justify-center gap-2
        hover:bg-accent-dark transition-colors duration-150
      "
    >
      View Details
      <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
    </button>
  </div>
);

export default JobCard;
