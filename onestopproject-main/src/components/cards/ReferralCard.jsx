import React from 'react';
import { Briefcase, Building2, ArrowRight } from 'lucide-react';

const ReferralCard = ({ referral }) => {
  const name    = referral.name        || 'Anonymous Referrer';
  const role    = referral.designation || 'Role not specified';
  const company = referral.company     || 'Company not specified';
  const link    = referral.link        || '#';

  return (
    <div className="
      bg-bg border border-border rounded-xl p-5
      flex flex-col justify-between h-full
      transition-all duration-200 group
      hover:border-border2 hover:shadow-card
    ">
      <div>
        {/* Referrer name + label */}
        <div className="mb-4">
          <h3 className="font-semibold text-ink text-base leading-tight truncate">{name}</h3>
          <p className="text-xs text-ink3 mt-0.5 font-mono uppercase tracking-wide">Referrer</p>
        </div>

        {/* Role + company */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-ink2 text-sm">
            <Briefcase size={13} className="text-ink3 flex-shrink-0" />
            <span className="truncate">{role}</span>
          </div>
          <div className="flex items-center gap-2 text-ink2 text-sm">
            <Building2 size={13} className="text-ink3 flex-shrink-0" />
            <span className="truncate">{company}</span>
          </div>
        </div>
      </div>

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="
          mt-5 w-full py-2.5 px-4 rounded-lg
          bg-accent text-white text-sm font-medium
          flex items-center justify-center gap-2
          hover:bg-accent-dark transition-colors duration-150
        "
      >
        Request on LinkedIn
        <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </a>
    </div>
  );
};

export default ReferralCard;
