// src/components/layout/WhatsAppCalloutBar.jsx

import React from 'react';
import { MessageSquare } from 'lucide-react';

const WhatsAppCalloutBar = () => {
  return (
    // UPDATED: Added a subtle gradient and reduced vertical padding for a sleeker look
    <div className="bg-gradient-to-r from-gray-800 via-gray-800/90 to-gray-800 border-y border-gray-700/50">
      <div className="w-full max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row justify-center items-center text-center gap-2 sm:gap-4">
        <p className="text-sm text-gray-300">
          <span className="font-bold text-white">Join 40k+ members</span> on our WhatsApp channel for instant job updates!
        </p>
        <a
          href="https://www.whatsapp.com/channel/0029Va5RkYRBqbrCyLdiaL3M" // <-- UPDATED LINK
          target="_blank"
          rel="noopener noreferrer"
          className="brand-button text-sm font-bold px-4 py-1.5 rounded-lg flex items-center gap-2 whitespace-nowrap"
        >
          <MessageSquare size={14} />
          Join Now
        </a>
      </div>
    </div>
  );
};

export default WhatsAppCalloutBar;
