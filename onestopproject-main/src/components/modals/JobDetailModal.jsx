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
  };

  // If no job data is provided, the component renders nothing.
  if (!job) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="bg-bg rounded-2xl border border-border w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <header className="p-6 border-b border-border flex justify-between items-start">
            <div className="flex items-start gap-4">
              <img
                src={job['Company Logo URL']}
                alt={`${job.Company} logo`}
                className="w-14 h-14 rounded-xl object-contain bg-surface2 border border-border p-1 flex-shrink-0"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/56x56/F3F2ED/9B9B8F?text=Co'; }}
              />
              <div>
                <h2 className="text-xl font-semibold text-ink leading-tight">{job['Job Title']}</h2>
                <p className="text-ink2 text-sm mt-0.5">{job.Company} · {job.Location}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-ink3 hover:text-ink transition-colors ml-4 flex-shrink-0"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </header>

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
              <a
                href="https://www.whatsapp.com/channel/0029Va5RkYRBqbrCyLdiaL3M"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-green hover:opacity-80 transition-opacity"
              >
                <MessageSquare size={13} />
                Get Job Updates
              </a>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 text-xs text-ink3 hover:text-ink2 transition-colors"
              >
                <Copy size={13} />
                Copy Link
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
