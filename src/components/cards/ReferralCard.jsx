import React from "react";
import PropTypes from "prop-types";
import { Briefcase, Building2, ArrowRight } from "lucide-react";

const ReferralCard = ({ referral }) => {
  if (!referral || typeof referral !== "object") return null; // never crash

  const name = referral?.["Referrer Name"] || "Unknown Referrer";
  const role = referral?.Role || "Role not specified";
  const company = referral?.Company || "Company not specified";
  const link = referral?.Link && referral.Link !== "#" ? referral.Link : null;

  return (
    <div className="dark-theme-card-bg dark-theme-border border rounded-xl p-5 flex flex-col justify-between h-full transition-transform duration-200 hover:scale-105">
      <div>
        <h3 className="font-bold text-white text-xl leading-tight">{name}</h3>
        <p className="text-sm text-gray-400 mb-4">Referrer</p>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-gray-300">
            <Briefcase size={16} className="text-gray-500" />
            <span className="truncate">{role}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Building2 size={16} className="text-gray-500" />
            <span className="truncate">{company}</span>
          </div>
        </div>
      </div>

      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="brand-button w-full mt-5 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2"
        >
          Request Referral
          <ArrowRight size={16} />
        </a>
      ) : (
        <div className="w-full mt-5 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 bg-gray-700 text-gray-400 cursor-not-allowed">
          Link unavailable
        </div>
      )}
    </div>
  );
};

ReferralCard.propTypes = {
  referral: PropTypes.shape({
    id: PropTypes.number,
    "Referrer Name": PropTypes.string,
    Role: PropTypes.string,
    Company: PropTypes.string,
    Link: PropTypes.string,
  }),
};

export default ReferralCard;
