import React from 'react';

const JobCard = ({ job, onOpenModal }) => {
  return (
    <div 
      onClick={() => onOpenModal(job)}
      className="dark-theme-card-bg rounded-xl dark-theme-border border-2 flex flex-col p-4 transition-all duration-300 ease-in-out hover:dark-theme-card-hover cursor-pointer h-full"
    >
      <div className="flex items-start gap-4">
        <img 
          src={job['Company Logo URL']} 
          alt={`${job.Company || 'Company'} logo`} 
          className="w-12 h-12 rounded-lg object-contain bg-white flex-shrink-0"
          onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/48x48/ffffff/1a1a1a?text=Logo'; }}
        />
        <div className="flex-grow">
          <h3 className="text-md font-bold text-white line-clamp-2">{job['Job Title'] || 'Job Title Not Available'}</h3>
          <p className="text-sm text-gray-400 mt-1">{job.Company || 'Company Name'}</p>
        </div>
      </div>
      <div className="mt-4 flex-grow">
        <p className="text-xs text-gray-500 line-clamp-3">{job.Description || 'No description provided.'}</p>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-700 w-full">
        <p className="text-xs text-gray-400 font-semibold">{job.Location || 'Remote'}</p>
      </div>
    </div>
  );
};

export default JobCard;
