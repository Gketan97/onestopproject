import React from "react";
import PropTypes from "prop-types";

const JobCard = ({ job, onOpenModal, isHighlighted }) => {
  if (!job || typeof job !== "object") return null;

  const title = job?.["Job Title"] || "Untitled Job";
  const company = job?.Company || "Unknown Company";
  const location = job?.Location || "Location not specified";
  const link = job?.Link && job.Link !== "#" ? job.Link : null;

  return (
    <div
      id={`job-card-${job.id}`}
      className={`p-4 rounded-xl shadow bg-white transition ${
        isHighlighted ? "ring-2 ring-indigo-500" : ""
      }`}
    >
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-700">{company}</p>
      <p className="text-sm text-gray-500">{location}</p>

      <div className="mt-3 flex gap-2">
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm"
          >
            View Job
          </a>
        ) : (
          <span className="px-3 py-2 rounded-lg bg-gray-200 text-gray-600 text-sm">
            Link unavailable
          </span>
        )}
        {onOpenModal && (
          <button
            className="px-3 py-2 rounded-lg border text-sm"
            onClick={() => onOpenModal(job)}
          >
            Details
          </button>
        )}
      </div>
    </div>
  );
};

JobCard.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.number,
    "Job Title": PropTypes.string,
    Company: PropTypes.string,
    Location: PropTypes.string,
    Link: PropTypes.string,
  }),
  onOpenModal: PropTypes.func,
  isHighlighted: PropTypes.bool,
};

export default JobCard;
