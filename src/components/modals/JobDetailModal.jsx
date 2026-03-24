import React, { useEffect, useState } from 'react';
import { Copy, ExternalLink, MessageSquare, X } from 'lucide-react';

const Toast = ({ message, show }) => {
  if (!show) return null;
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-green text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm font-medium">
      {message}
    </div>
  );
};

const JobDetailModal = ({ job, onClose }) => {
  const [showToast, setShowToast] = useState(false);

  // Effect to handle closing the modal with the Escape key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Handler to copy the current URL to the clipboard
  const handleCopyLink = () => {
    // BUG FIX #3: navigator.clipboard is undefined on non-HTTPS (e.g. http://localhost).
    // Use the modern API when available; fall back to the execCommand approach otherwise.
    const url = window.location.href;
<<<<<<< Updated upstream
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
=======

    const showSuccess = () => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    };

    const fallbackCopy = () => {
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.opacity  = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand('copy'); showSuccess(); } catch (e) { /* silent */ }
      document.body.removeChild(ta);
    };

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(showSuccess).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
>>>>>>> Stashed changes
  };

  // If no job data is provided, the component renders nothing.
  if (!job) return null;

  return (
    <>
<<<<<<< Updated upstream
      {/* Backdrop with blur and fade-in animation */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
        onClick={onClose}
      >
        <div
          className="bg-[#1a1a1a] rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] flex flex-col animate-slide-up shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Section */}
          <header className="p-6 border-b border-gray-700 flex justify-between items-start">
=======
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="bg-bg rounded-2xl border border-border w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <header className="p-6 border-b border-border flex justify-between items-start">
>>>>>>> Stashed changes
            <div className="flex items-start gap-4">
              <img
                src={job['Company Logo URL']}
                alt={`${job.Company} logo`}
<<<<<<< Updated upstream
                className="w-16 h-16 rounded-lg object-contain bg-white p-1"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/64x64/ffffff/1a1a1a?text=Logo';
                }}
=======
                className="w-14 h-14 rounded-xl object-contain bg-white border border-border p-1 flex-shrink-0"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/56x56/F3F2ED/9B9B8F?text=Co'; }}
>>>>>>> Stashed changes
              />
              <div>
                <h2 className="text-xl font-semibold text-ink leading-tight">{job['Job Title']}</h2>
                <p className="text-ink2 text-sm mt-0.5">{job.Company} · {job.Location}</p>
              </div>
            </div>
            <button
              onClick={onClose}
<<<<<<< Updated upstream
              className="text-gray-500 hover:text-white text-3xl leading-none"
=======
              className="text-ink3 hover:text-ink transition-colors ml-4 flex-shrink-0"
              aria-label="Close"
>>>>>>> Stashed changes
            >
              <X size={20} />
            </button>
          </header>

<<<<<<< Updated upstream
          {/* Scrollable Job Description */}
          <div className="p-6 overflow-y-auto flex-grow">
            <h3 className="font-bold text-white mb-2">Job Description</h3>
            <p className="text-gray-400 whitespace-pre-wrap">
              {job['Job Description'] || job.Description}
            </p>
          </div>

          {/* Redesigned Unified Footer */}
          <footer className="p-6 border-t border-gray-700 space-y-4">
            {/* Main Action: Apply Now */}
            <div className="flex justify-center items-center">
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

            {/* Tertiary Actions */}
            <div className="flex justify-center items-center gap-6 pt-2">
=======
          {/* Body — scrollable */}
          <div className="p-6 overflow-y-auto flex-grow">
            <p className="text-xs font-mono font-semibold text-ink3 uppercase tracking-widest mb-3">Job Description</p>
            <p className="text-ink2 text-sm leading-relaxed whitespace-pre-wrap">
              {job['Job Description'] || job.Description || 'No description available.'}
            </p>
          </div>

          {/* Footer */}
          <footer className="p-6 border-t border-border space-y-3">
            <a
              href={job['Link']}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center justify-center gap-2 w-full
                py-3 bg-accent text-white font-medium rounded-xl text-sm
                hover:bg-accent-dark transition-colors
              "
            >
              Apply Now
              <ExternalLink size={14} />
            </a>
            <div className="flex items-center justify-center gap-6">
>>>>>>> Stashed changes
              <a
                href="https://www.whatsapp.com/channel/0029Va5RkYRBqbrCyLdiaL3M"
                target="_blank"
                rel="noopener noreferrer"
<<<<<<< Updated upstream
                className="flex items-center gap-2 text-xs text-green-400 hover:text-green-300"
              >
                <MessageSquare size={14} />
=======
                className="flex items-center gap-1.5 text-xs text-green hover:opacity-80 transition-opacity"
              >
                <MessageSquare size={13} />
>>>>>>> Stashed changes
                Get Job Updates
              </a>
              <button
                onClick={handleCopyLink}
<<<<<<< Updated upstream
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-white"
              >
                <Copy size={14} />
                Copy Share Link
=======
                className="flex items-center gap-1.5 text-xs text-ink3 hover:text-ink2 transition-colors"
              >
                <Copy size={13} />
                Copy Link
>>>>>>> Stashed changes
              </button>
            </div>
          </footer>
        </div>
      </div>
      <Toast message="Link copied!" show={showToast} />
    </>
  );
};

export default JobDetailModal;
