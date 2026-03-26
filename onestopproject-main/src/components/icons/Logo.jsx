import React from 'react';

const Logo = ({ variant = 'primary', size = 60, color = 'currentColor' }) => {
  const wordmark = (
    <span className="text-4xl font-bold text-white" style={{ fontSize: size * 0.6 }}>
      OneStopCareers
    </span>
  );

  switch (variant) {
    case 'stacked':
      return (
        <div className="flex flex-col items-center gap-4">
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="8" strokeOpacity="0.3"/>
            <path d="M50 70 L 50 30" stroke="#F97316" strokeWidth="8" strokeLinecap="round"/>
            <path d="M35 45 L 50 30 L 65 45" stroke="#F97316" strokeWidth="8" strokeLinecap="round"/>
          </svg>
          <span className="text-3xl font-bold text-white" style={{ fontSize: size * 0.5 }}>OneStopCareers</span>
        </div>
      );

    case 'icon':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="8" strokeOpacity="0.3"/>
          <path d="M50 70 L 50 30" stroke="#F97316" strokeWidth="8" strokeLinecap="round"/>
          <path d="M35 45 L 50 30 L 65 45" stroke="#F97316" strokeWidth="8" strokeLinecap="round"/>
        </svg>
      );

    case 'mono':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke={color} strokeWidth="8" />
          <path d="M50 70 L 50 30" stroke={color} strokeWidth="8" strokeLinecap="round"/>
          <path d="M35 45 L 50 30 L 65 45" stroke={color} strokeWidth="8" strokeLinecap="round"/>
        </svg>
      );
      
    case 'favicon':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#F97316"/>
            <path d="M50 75 L 50 25" stroke="white" strokeWidth="10" strokeLinecap="round"/>
            <path d="M30 45 L 50 25 L 70 45" stroke="white" strokeWidth="10" strokeLinecap="round"/>
        </svg>
      );

    case 'primary':
    default:
      return (
        <div className="flex items-center gap-4">
          <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="8" strokeOpacity="0.3"/>
            <path d="M50 70 L 50 30" stroke="#F97316" strokeWidth="8" strokeLinecap="round"/>
            <path d="M35 45 L 50 30 L 65 45" stroke="#F97316" strokeWidth="8" strokeLinecap="round"/>
          </svg>
          {wordmark}
        </div>
      );
  }
};

export default Logo;
