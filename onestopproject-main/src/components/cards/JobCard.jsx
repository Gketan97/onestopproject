import React, { useState } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';

// Consistent color from company name
const companyColor = (name = '') => {
  const colors = [
    { bg: 'var(--phase1-bg)', text: 'var(--phase1)' },
    { bg: 'var(--phase2-bg)', text: 'var(--phase2)' },
    { bg: 'var(--phase3-bg)', text: 'var(--phase3)' },
    { bg: 'var(--red-bg)', text: 'var(--red)' },
    { bg: 'var(--amber-bg)', text: 'var(--amber)' },
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const CompanyLogo = ({ src, company }) => {
  const [loaded, setLoaded] = useState(false);
  const initials = (company || 'Co').slice(0, 2).toUpperCase();
  const { bg, text } = companyColor(company);

  return (
    <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center font-mono font-bold text-sm border border-border relative overflow-hidden"
      style={{ background: loaded ? 'rgba(255,255,255,0.92)' : bg, color: text }}>
      {!loaded && <span>{initials}</span>}
      {src && (
        <img
          src={src}
          alt={`${company} logo`}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'contain', padding: '4px',
            opacity: loaded ? 1 : 0, transition: 'opacity 0.2s',
          }}
        />
      )}
    </div>
  );
};

const JobCard = ({ job, onOpenModal, isHighlighted }) => (
  <div
    id={`job-card-${job.id}`}
    onClick={() => onOpenModal(job)}
    className={`
      bg-bg border border-border rounded-xl p-4
      flex flex-col justify-between h-full
      cursor-pointer transition-all duration-200 group
      hover:border-border2 hover:shadow-card
      ${isHighlighted ? 'ring-2 ring-accent shadow-accent' : ''}
    `}
  >
    <div>
      <div className="flex items-start gap-3 mb-3">
        <CompanyLogo src={job['Company Logo URL']} company={job.Company} />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-ink text-sm leading-snug line-clamp-2">{job['Job Title']}</h3>
          <p className="text-xs text-ink2 mt-0.5">{job.Company}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-ink3 text-xs">
        <MapPin size={11} className="flex-shrink-0" />
        <span>{job.Location}</span>
      </div>
    </div>

    <button
      onClick={(e) => { e.stopPropagation(); onOpenModal(job); }}
      className="
        mt-4 w-full py-2 rounded-lg
        bg-accent text-white text-xs font-medium
        flex items-center justify-center gap-1.5
        hover:bg-accent-dark transition-colors duration-150
      "
    >
      View Details
      <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
    </button>
  </div>
);

export default JobCard;
