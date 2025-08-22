import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, ExternalLink, MessageSquare, Users } from 'lucide-react';

// Toast Notification
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
    const textArea = document.createElement('textarea');
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Failed to copy link.');
    }
    document.body.removeChild(textArea);
  };

  if (!job) return null;

  return (
    <>
      {/* Backdrop with fade-in */}
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
        onClick={onClose}
      >
        <div
          className="bg-[#1a1a1a] rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] flex flex-col animate-slide-up shadow-xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <header className="p-6 border-b border-gray-700 flex justify-between items-start">
            <div className="flex items-start gap-4">
              <img
                src={job['Company Logo URL']}
                alt={`${job.Company} logo`}
                className="w-16 h-16 rounded-lg object-contain bg-white p-1"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    'https://placehold.co/64x64/ffffff/1a1a1a?text=Logo';
                }}
              />
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {job['Job Title']}
                </h2>
                <p className="text-gray-400">
                  {job.Company} - {job.Location}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white text-3xl leading-none"
            >
              &times;
            </button>
          </header>

          {/* Job Description */}
          <div className="p-6 overflow-y-auto flex-grow">
            <h3 className="font-bold text-white mb-2">Job Description</h3>
            <p className="text-gray-400 whitespace-pre-wrap">
              {job['Job Description'] || job.Description}
            </p>
          </div>

          {/* Footer */}
          <footer className="p-6 border-t border-gray-700 space-y-4 sm:space-y-0">
            <div className="hidden sm:flex justify-between items-center gap-4">
              {/* Desktop layout */}
              <Link to="/become-referrer" className="w-full sm:w-auto">
                <button className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors">
                  <Users size={16} />
                  Refer candidates in your companies
                </button>
              </Link>
              <a
                href={job['Link']}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                Apply Now
                <ExternalLink size={16} />
              </a>
            </div>

            {/* Mobile sticky footer */}
            <div className="sm:hidden fixed bottom-0 left-0 w-full bg-[#1a1a1a] border-t border-gray-700 p-4 flex flex-col gap-3 z-50">
              <a
                href={job['Link']}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg flex items-center justify-center gap-2"
              >
                Apply Now
                <ExternalLink size={16} />
              </a>
              <Link to="/become-referrer" className="w-full">
                <button className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg flex items-center justify-center gap-2">
                  <Users size={16} />
                  Refer candidates
                </button>
              </Link>
            </div>

            {/* Extra Links */}
            <div className="flex justify-center items-center gap-6 pt-4 sm:pt-2">
              <a
                href="https://www.whatsapp.com/channel/0029Va5RkYRBqbrCyLdiaL3M"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-green-400 hover:text-green-300"
              >
                <MessageSquare size={14} />
                Get Whatsapp Job Updates
              </a>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-white"
              >
                <Copy size={14} />
                Copy Share Link
              </button>
            </div>
          </footer>
        </div>
      </div>
      <Toast message="Link copied to clipboard!" show={showToast} />
    </>
  );
};

export default JobDetailModal;
