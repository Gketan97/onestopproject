// =================================================================
// FILE (NEW): src/components/cards/JobCard.jsx
// PURPOSE: A modular, reusable component for displaying a single job listing.
// =================================================================
import React from 'react';

const JobCard = ({ job, index }) => (
  <div id={`job-${index}`} className="dark-theme-card-bg p-6 rounded-xl dark-theme-border border-2 flex flex-col sm:flex-row items-start gap-6 transition-all duration-300 ease-in-out hover:dark-theme-card-hover">
    <img 
      src={job['Company Logo URL']} 
      alt={`${job.Company || 'Company'} logo`} 
      className="w-16 h-16 rounded-lg object-contain bg-white flex-shrink-0"
      onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/64x64/ffffff/1a1a1a?text=Logo'; }}
    />
    <div className="flex-grow">
      <h3 className="text-xl font-bold text-white">{job['Job Title'] || 'Job Title Not Available'}</h3>
      <p className="text-gray-400 mt-1">{job.Company || 'Company Name'} - {job.Location || 'Remote'}</p>
      <p className="text-gray-500 mt-3 text-sm line-clamp-2">{job.Description || 'No description provided.'}</p>
    </div>
    <a 
      href={job['Link']} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="mt-4 sm:mt-0 px-6 py-2 brand-button font-bold text-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 self-start sm:self-center whitespace-nowrap"
    >
      Apply Now
    </a>
  </div>
);

export default JobCard;
