// =================================================================
// FILE (UPDATE): src/components/modals/JobDetailModal.jsx
// PURPOSE: A modal to display detailed job info and handle deep linking.
// =================================================================
import React, { useEffect } from 'react';

const JobDetailModal = ({ job, onClose }) => {
  // Handle deep linking and escape key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    
    // Update URL hash for deep linking
    window.location.hash = `job-${job.id}`;

    return () => {
      window.removeEventListener('keydown', handleEsc);
      // Clear hash on close
      if (window.history.pushState) {
        window.history.pushState("", document.title, window.location.pathname + window.location.search);
      } else {
        window.location.hash = '';
      }
    };
  }, [job, onClose]);

  const handleCopyLink = () => {
    // Use the 'copy' command as a fallback for iframe environments
    const url = window.location.href;
    const textArea = document.createElement("textarea");
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      alert('Link copied to clipboard!');
    } catch (err) {
      alert('Failed to copy link.');
    }
    document.body.removeChild(textArea);
  };

  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="dark-theme-card-bg rounded-xl dark-theme-border border-2 w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <header className="p-6 border-b border-gray-700 flex justify-between items-start">
          <div className="flex items-start gap-4">
            <img 
              src={job['Company Logo URL']} 
              alt={`${job.Company} logo`} 
              className="w-16 h-16 rounded-lg object-contain bg-white"
              onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/64x64/ffffff/1a1a1a?text=Logo'; }}
            />
            <div>
              <h2 className="text-2xl font-bold text-white">{job['Job Title']}</h2>
              <p className="text-gray-400">{job.Company} - {job.Location}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-3xl leading-none">&times;</button>
        </header>
        
        <div className="p-6 overflow-y-auto flex-grow">
          <h3 className="font-bold text-white mb-2">Job Description</h3>
          <p className="text-gray-400 whitespace-pre-wrap">{job.Description}</p>
        </div>

        <footer className="p-6 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button onClick={handleCopyLink} className="text-sm text-gray-400 hover:text-white">
            Copy Share Link
          </button>
          <a 
            href={job['Link']} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-8 py-3 brand-button font-bold rounded-lg"
          >
            Apply Now
          </a>
        </footer>
      </div>
    </div>
  );
};

export default JobDetailModal;
