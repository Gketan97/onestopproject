// src/components/layout/WhatsAppCalloutBar.jsx

import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

const WhatsAppCalloutBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    // Added a subtle gradient and reduced vertical padding for a sleeker look
    <div className="bg-gradient-to-r from-gray-800 via-gray-800/90 to-gray-800 border-y border-gray-700/50">
      <div className="w-full max-w-7xl mx-auto px-4 py-2 flex justify-center items-center text-center relative">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-sm text-gray-300">
                {/* UPDATED: More impactful, benefit-driven text */}
                <span className="font-bold text-white">Get real-time job alerts before anyone else.</span> Join 40k+ members on our WhatsApp channel!
            </p>
            <a
                href="https://www.whatsapp.com/channel/0029Va5RkYRBqbrCyLdiaL3M"
                target="_blank"
                rel="noopener noreferrer"
                // UPDATED: Changed to green for higher contrast and added a pulse animation
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-4 py-1.5 rounded-lg flex items-center gap-2 whitespace-nowrap animate-pulse"
            >
                <MessageSquare size={14} />
                Join Now
            </a>
        </div>
        {/* NEW: Dismiss button */}
        <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-500 hover:text-white"
            aria-label="Close banner"
        >
            <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default WhatsAppCalloutBar;
