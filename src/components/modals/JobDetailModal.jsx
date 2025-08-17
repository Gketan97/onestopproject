import React, { useEffect, useState } from 'react';
import { Copy, ExternalLink, MessageSquare } from 'lucide-react';

// A simple, reusable toast notification component
const Toast = ({ message, show }) => {
  if (!show) return null;
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-up z-50">
      {message}
    </div>
  );
};

const JobDetailModal = ({ job, onClose }) => {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000); // Hide toast after 2 seconds
    }).catch(err => {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers if needed
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      } catch (err) {
        alert('Failed to copy link.');
      }
      document.body.removeChild(textArea);
    });
  };

  if (!job) return null;

  return (
    <>
      {/* Solid black backdrop (no cluttered background) */}
      <div 
        className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div 
          className="dark-theme-card-bg rounded-xl dark-theme-border border-2 w-full max-w-2xl max-h-[90vh] flex flex-col animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="p-6 border-b border-gray-700 flex justify-between items-start">
            <div className="flex items-start gap-4">
              <img 
                src={job['Company Logo URL']} 
                alt={`${job.Company} logo`} 
                className="w-16 h-16 rounded-lg object-contain bg-white p-1"
                onError={(e) => { 
                  e.target.onerror = null; 
                  e.target.src='https://placehold.co/64x64/ffffff/1a1a1a?text=Logo'; 
                }}
              />
              <div>
                <h2 className="text-2xl font-bold text-white">{job['Job Title']}</h2>
                <p className="text-gray-400">{job.Company} - {job.Location}</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-white text-3xl leading-none"
            >
              &times;
            </button>
          </header>
          
          <div className="p-6 overflow-y-auto flex-grow">
            <h3 className="font-bold text-white mb-2">Job Description</h3>
            <p className="text-gray-400 whitespace-pre-wrap">{job['Job Description'] || job.Description}</p>
          </div>

          <footer className="p-6 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a 
                href="https://chat.whatsapp.com/your-channel-link" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300"
              >
                <MessageSquare size={16} />
                Get Job Updates
              </a>
              <button 
                onClick={handleCopyLink} 
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
              >
                <Copy size={16} />
                Copy Share Link
              </button>
            </div>
            <a 
              href={job['Link']} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-6 py-3 brand-button font-bold rounded-lg flex items-center gap-2"
            >
              Apply Now
              <ExternalLink size={16} />
            </a>
          </footer>
        </div>
      </div>
      <Toast message="Link copied to clipboard!" show={showToast} />
    </>
  );
};

export default JobDetailModal;
