import React, { useEffect } from 'react';

const JobDetailModal = ({ job, onClose }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleCopyLink = () => {
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
        onClick={(e) => e.stopPropagation()}
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
          <div className="flex flex-col sm:flex-row items-center gap-4">
             <a href="https://chat.whatsapp.com/your-channel-link" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Get Job Updates
            </a>
            <button onClick={handleCopyLink} className="text-sm text-gray-400 hover:text-white">Copy Share Link</button>
          </div>
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
