import React, { useEffect } from "react";

const JobDetailModal = ({ job, onClose }) => {
  // Close modal on Escape key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!job) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative w-full max-w-3xl bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition text-xl"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Job Header */}
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold">{job.title}</h2>
          <p className="text-gray-400 mt-1">{job.company}</p>
          <p className="text-gray-500 text-sm">{job.location}</p>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-gray-300">
          {/* Job Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Job Description</h3>
            <p>{job.description || "No description available."}</p>
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Requirements</h3>
              <ul className="list-disc list-inside space-y-1">
                {job.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Benefits</h3>
              <ul className="list-disc list-inside space-y-1">
                {job.benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sticky Footer with Apply Button */}
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <a
            href={job.applyLink || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-all"
          >
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;
